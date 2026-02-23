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
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!supabaseUrl || !anonKey || !serviceRoleKey || !resendApiKey) {
      return json({ ok: false, message: 'Configuração do servidor incompleta' }, 500)
    }

    const authHeader = req.headers.get('Authorization')
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

    if (!student_id || !email) {
      return json({ ok: false, message: 'student_id e email são obrigatórios' }, 400)
    }

    // Verify trainer via anon client + RLS
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user: trainerUser }, error: authError } = await userClient.auth.getUser()
    if (authError || !trainerUser) {
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
      return json({ ok: false, message: 'Aluno não encontrado' }, 404)
    }

    if (student.user_id) {
      return json({ ok: false, message: 'Aluno já possui conta vinculada' }, 400)
    }

    // Generate secure random token
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')

    // Hash the token with SHA-256
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(token))
    const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

    // Save hash and expiration to students table (service role to bypass RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    const { error: updateError } = await adminClient
      .from('students')
      .update({
        invite_token_hash: tokenHash,
        invited_at: new Date().toISOString(),
        expires_at: expiresAt,
        status: 'pending',
      })
      .eq('id', student_id)

    if (updateError) {
      console.error('[invite-student] updateError:', updateError)
      return json({ ok: false, message: 'Erro ao salvar token de convite' }, 500)
    }

    // Build invite link
    const siteUrl = Deno.env.get('SITE_URL') || 'https://code-restorer-joy.lovable.app'
    const redirectPath = `/student/complete-signup?student_id=${student_id}&token=${token}`
    const inviteLink = `${siteUrl}/login?redirectTo=${encodeURIComponent(redirectPath)}`

    console.log('[invite-student] inviteLink:', inviteLink)

    // Send email via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Atlon PRO <onboarding@resend.dev>',
        to: [email],
        subject: 'Você foi convidado para o Atlon PRO!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Bem-vindo ao Atlon PRO!</h1>
            <p>Seu treinador convidou você para acessar a plataforma.</p>
            <p>Clique no botão abaixo para criar sua conta:</p>
            <a href="${inviteLink}" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
              Criar minha conta
            </a>
            <p style="color: #666; font-size: 14px;">Este link expira em 7 dias.</p>
            <p style="color: #999; font-size: 12px;">Se você não esperava este email, pode ignorá-lo.</p>
          </div>
        `,
      }),
    })

    if (!resendRes.ok) {
      const resendError = await resendRes.text()
      console.error('[invite-student] Resend error:', resendError)
      return json({ ok: false, message: 'Erro ao enviar email de convite' }, 500)
    }

    console.log('[invite-student] invite sent successfully for:', email)
    return json({ ok: true, message: 'Convite enviado com sucesso!' })

  } catch (err: any) {
    console.error('[invite-student] unexpected error:', err?.message, err?.stack)
    return json({ ok: false, message: err?.message || 'Erro interno do servidor' }, 500)
  }
})
