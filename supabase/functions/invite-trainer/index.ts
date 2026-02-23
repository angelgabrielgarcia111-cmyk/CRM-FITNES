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
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ ok: false, message: 'Server config missing' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ ok: false, message: 'Unauthorized' }, 401)
    }

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return json({ ok: false, message: 'Invalid token' }, 401)
    }

    const userId = claimsData.claims.sub

    // Check admin role using has_role
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { data: isAdmin } = await adminClient.rpc('has_role', { _user_id: userId, _role: 'admin' })

    if (!isAdmin) {
      return json({ ok: false, message: 'Only admins can invite trainers' }, 403)
    }

    // Parse body
    let body: Record<string, unknown> = {}
    try { body = await req.json() } catch {
      return json({ ok: false, message: 'Invalid JSON body' }, 400)
    }

    const email = (body.email as string)?.trim()?.toLowerCase()
    if (!email) {
      return json({ ok: false, message: 'email is required' }, 400)
    }

    // Upsert trainer_invites
    const { error: upsertError } = await adminClient
      .from('trainer_invites')
      .upsert(
        { email, status: 'sent', sent_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (upsertError) {
      console.error('[invite-trainer] upsert error:', upsertError)
      // If conflict on unique index, try update
      const { error: updateError } = await adminClient
        .from('trainer_invites')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .ilike('email', email)

      if (updateError) {
        console.error('[invite-trainer] update error:', updateError)
        return json({ ok: false, message: 'Failed to create invite record' }, 500)
      }
    }

    // Send invite via Supabase Admin
    const siteUrl = Deno.env.get('SITE_URL') || 'https://code-restorer-joy.lovable.app'
    const redirectTo = `${siteUrl}/login`

    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: { role: 'trainer' },
    })

    if (inviteError) {
      console.error('[invite-trainer] inviteError:', inviteError)

      if ((inviteError as any).code === 'email_exists' || inviteError.message?.includes('already been registered')) {
        return json({ ok: true, message: 'Trainer already has an account. They can log in directly.' })
      }

      return json({ ok: false, message: inviteError.message }, 400)
    }

    return json({ ok: true, message: 'Invitation sent successfully!' })

  } catch (err: any) {
    console.error('[invite-trainer] error:', err?.message)
    return json({ ok: false, message: err?.message || 'Internal error' }, 500)
  }
})
