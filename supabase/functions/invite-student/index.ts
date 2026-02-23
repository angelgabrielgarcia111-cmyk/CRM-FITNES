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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('[invite-student] env check:', {
      hasUrl: !!supabaseUrl,
      hasAnon: !!anonKey,
      hasServiceRole: !!serviceRoleKey,
    })

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ ok: false, message: 'Configuração do servidor incompleta (variáveis de ambiente ausentes)' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    console.log('[invite-student] hasAuth:', !!authHeader)

    if (!authHeader) {
      return json({ ok: false, message: 'Autorização ausente' }, 401)
    }

    let body: Record<string, unknown> = {}
    try {
      body = await req.json()
    } catch {
      return json({ ok: false, message: 'Body JSON inválido' }, 400)
    }

    const student_id = body.student_id as string
    const email = body.email as string
    console.log('[invite-student] input:', { student_id, email })

    if (!student_id || !email) {
      return json({ ok: false, message: 'student_id e email são obrigatórios' }, 400)
    }

    // Verify trainer via anon client + RLS
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user: trainerUser }, error: authError } = await userClient.auth.getUser()
    if (authError || !trainerUser) {
      console.error('[invite-student] authError:', authError)
      return json({ ok: false, message: 'Token inválido ou expirado' }, 401)
    }

    // Check trainer role
    const { data: profile } = await userClient
      .from('profiles')
      .select('role')
      .eq('id', trainerUser.id)
      .single()

    if (!profile || profile.role !== 'trainer') {
      return json({ ok: false, message: 'Apenas treinadores podem convidar' }, 403)
    }

    // Verify student belongs to trainer (RLS enforces this)
    const { data: student, error: fetchError } = await userClient
      .from('students')
      .select('id, email, user_id')
      .eq('id', student_id)
      .single()

    if (fetchError || !student) {
      console.error('[invite-student] fetchError:', fetchError)
      return json({ ok: false, message: 'Aluno não encontrado' }, 404)
    }

    if (student.user_id) {
      return json({ ok: false, message: 'Aluno já possui conta vinculada' }, 400)
    }

    // Use service role client to invite user by email
    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const siteUrl = Deno.env.get('SITE_URL') || 'https://code-restorer-joy.lovable.app'
    const redirectTo = `${siteUrl}/student/complete?student_id=${student_id}&email=${encodeURIComponent(email)}`

    console.log('[invite-student] redirectTo:', redirectTo)

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { role: 'student', student_id },
    })

    if (inviteError) {
      console.error('[invite-student] inviteError:', inviteError)

      // If user already exists, they can just log in — link_student_user will handle re-linking
      if ((inviteError as any).code === 'email_exists' || inviteError.message?.includes('already been registered')) {
        console.log('[invite-student] user already exists, returning success')
        return json({ ok: true, message: 'Aluno já possui conta. Ele pode fazer login diretamente com e-mail e senha.' })
      }

      return json({ ok: false, message: inviteError.message }, 400)
    }

    console.log('[invite-student] invite sent successfully for:', email)
    return json({ ok: true, message: 'Convite enviado com sucesso!' })

  } catch (err: any) {
    console.error('[invite-student] unexpected error:', err?.message, err?.stack)
    return json({ ok: false, message: err?.message || 'Erro interno do servidor' }, 500)
  }
})
