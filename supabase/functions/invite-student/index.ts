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
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ ok: false, message: 'Missing authorization' }, 401)
    }

    // Parse body
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
      console.error('[invite-student] auth error:', authError)
      return json({ ok: false, message: 'Unauthorized' }, 401)
    }
    console.log('[invite-student] trainer:', trainerUser.id)

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
      console.error('[invite-student] student not found:', fetchError)
      return json({ ok: false, message: 'Aluno não encontrado' }, 404)
    }

    if (student.user_id) {
      return json({ ok: false, message: 'Aluno já possui conta vinculada' }, 400)
    }

    // Admin client
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Determine redirect URL
    const siteUrl = Deno.env.get('SITE_URL') || 'https://code-restorer-joy.lovable.app'
    const redirectTo = `${siteUrl}/student/complete-signup?email=${encodeURIComponent(email)}`

    // Try invite
    console.log('[invite-student] inviting:', email, 'redirectTo:', redirectTo)
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      { data: { role: 'student', student_id }, redirectTo }
    )

    if (!inviteError) {
      // Invite succeeded
      const newUserId = inviteData?.user?.id
      console.log('[invite-student] invite OK, userId:', newUserId)
      if (newUserId) {
        const { error: upErr } = await adminClient
          .from('students')
          .update({ user_id: newUserId })
          .eq('id', student_id)
        if (upErr) console.error('[invite-student] link error:', upErr)
      }
      return json({ ok: true, mode: 'invited' })
    }

    // Invite failed — check if user already exists
    const msg = inviteError.message || ''
    console.warn('[invite-student] invite error:', msg)

    const isExisting = /already registered|already exists|already been registered/i.test(msg)
      || (inviteError as any).status === 400
      || (inviteError as any).status === 409

    if (!isExisting) {
      // Genuine error
      return json({ ok: false, message: msg }, 400)
    }

    // User already exists — find and link
    console.log('[invite-student] user exists, searching...')
    const { data: listData, error: listErr } = await adminClient.auth.admin.listUsers()

    if (listErr) {
      console.error('[invite-student] listUsers error:', listErr)
      return json({ ok: false, message: 'Failed to search existing users' }, 400)
    }

    const existing = (listData?.users ?? []).find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (!existing) {
      console.error('[invite-student] user not found in list')
      return json({ ok: false, message: 'Usuário já registrado mas não encontrado para vincular' }, 400)
    }

    console.log('[invite-student] found existing user:', existing.id)
    const { error: updateErr } = await adminClient
      .from('students')
      .update({ user_id: existing.id })
      .eq('id', student_id)

    if (updateErr) {
      console.error('[invite-student] link error:', updateErr)
      return json({ ok: false, message: 'Falha ao vincular usuário existente' }, 400)
    }

    console.log('[invite-student] linked existing user successfully')
    return json({ ok: true, mode: 'linked_existing' })

  } catch (err: any) {
    console.error('[invite-student] unexpected:', err)
    return json({ ok: false, message: err?.message || 'Unknown error' }, 400)
  }
})
