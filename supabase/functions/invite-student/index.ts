import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ ok: false, message: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // User client to verify trainer ownership via RLS
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(JSON.stringify({ ok: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { student_id } = await req.json()
    if (!student_id) {
      return new Response(JSON.stringify({ ok: false, message: 'student_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // RLS ensures only the trainer's own students are returned
    const { data: student, error: fetchError } = await userClient
      .from('students')
      .select('id, email, name, user_id')
      .eq('id', student_id)
      .single()

    if (fetchError || !student) {
      console.error('Fetch student error:', fetchError)
      return new Response(JSON.stringify({ ok: false, message: 'Aluno não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (student.user_id) {
      return new Response(JSON.stringify({ ok: false, message: 'Aluno já possui conta vinculada' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!student.email) {
      return new Response(JSON.stringify({ ok: false, message: 'Aluno não possui email cadastrado' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Admin client with service role key for invite
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    console.log('Sending invite to:', student.email)

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      student.email,
      {
        data: {
          role: 'student',
          student_id: student.id,
          name: student.name || '',
        },
      }
    )

    if (inviteError) {
      console.error('Invite error:', inviteError)
      return new Response(JSON.stringify({ ok: false, message: inviteError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Invite sent successfully:', inviteData)

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ ok: false, message: err?.message || 'Unknown error', details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
