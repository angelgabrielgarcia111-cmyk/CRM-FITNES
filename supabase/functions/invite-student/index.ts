import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ ok: false, message: 'Missing authorization' }, 401)
    }

    const { student_id, email } = await req.json()
    console.log('[invite-student] input:', { student_id, email })

    if (!student_id || !email) {
      return json({ ok: false, message: 'student_id and email are required' }, 400)
    }

    // Verify trainer via anon client + RLS
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user: trainerUser }, error: authError } = await userClient.auth.getUser()
    if (authError || !trainerUser) {
      return json({ ok: false, message: 'Unauthorized' }, 401)
    }

    // Check trainer role
    const { data: profile } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', trainerUser.id)
      .single()

    if (!profile || profile.role !== 'trainer') {
      return json({ ok: false, message: 'Forbidden: only trainers can invite' }, 403)
    }

    // Verify student belongs to trainer (RLS enforces this)
    const { data: student, error: fetchError } = await userClient
      .from('students')
      .select('id, email, user_id')
      .eq('id', student_id)
      .single()

    if (fetchError || !student) {
      return json({ ok: false, message: 'Aluno não encontrado' }, 404)
    }

    if (student.user_id) {
      return json({ ok: false, message: 'Aluno já possui conta vinculada' }, 400)
    }

    // Build the signup link — no Supabase invite API needed
    const siteUrl = Deno.env.get('SITE_URL') || 'https://code-restorer-joy.lovable.app'
    const signupLink = `${siteUrl}/student/complete-signup?email=${encodeURIComponent(email)}`

    console.log('[invite-student] signup link:', signupLink)

    // TODO: Send email via Resend or another provider with signupLink
    // For now, return the link so the trainer can share it manually
    return json({ ok: true, mode: 'link_generated', link: signupLink })

  } catch (err: any) {
    console.error('[invite-student] unexpected:', err)
    return json({ ok: false, message: err?.message || 'Unknown error' }, 400)
  }
})
