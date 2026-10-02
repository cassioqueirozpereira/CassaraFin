import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        'Login cancelado pelo usuário ou falha na autenticação do Google.'
      )}`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        'Configuração incompleta: GOOGLE_CLIENT_SECRET ausente no arquivo .env.local'
      )}`
    );
  }

  try {
    // 1. Trocar o código de autorização pelos tokens de acesso do Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Erro ao obter token do Google:', tokenData);
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Falha ao autenticar com o servidor do Google.')}`
      );
    }

    // 2. Buscar perfil e e-mail do usuário autenticado no Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser || !googleUser.email) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent('Não foi possível obter o e-mail da sua conta Google.')}`
      );
    }

    const cleanEmail = googleUser.email.toLowerCase().trim();

    // 3. Buscar ou criar o usuário no banco de dados
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          password: 'OAUTH_GOOGLE_ACCOUNT',
          role: 'COMUM',
        },
      });
    }

    const frontendRole = user.role.toLowerCase();
    const userPayload = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: frontendRole,
      })
    );

    // 4. Redirecionar de volta para o login com o payload de sessão para salvar no frontend
    return NextResponse.redirect(`${origin}/login?google_session=${userPayload}`);
  } catch (err: any) {
    console.error('Erro no callback do Google OAuth:', err);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Erro interno ao processar login com Google.')}`
    );
  }
}
