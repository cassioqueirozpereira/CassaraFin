import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Credenciais do Google OAuth (GOOGLE_CLIENT_ID) não configuradas no arquivo .env.local.',
      },
      { status: 400 }
    );
  }

  const origin = new URL(request.url).origin;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
  const scope = encodeURIComponent('openid email profile');

  // prompt=select_account força a exibição da tela de seleção de conta do Google
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&prompt=select_account`;

  return NextResponse.json({ success: true, url: googleUrl });
}
