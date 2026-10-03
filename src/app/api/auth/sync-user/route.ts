import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-mail é obrigatório para sincronização.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const userName = (name || cleanEmail.split('@')[0]).trim();

    // Busca ou cria o usuário na tabela `users` do banco PostgreSQL (Supabase)
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userName,
          email: cleanEmail,
          password: 'OAUTH_GOOGLE_USER',
          role: 'COMUM',
        },
      });
      console.log(`Usuário cadastrado com sucesso na tabela users: ${cleanEmail}`);
    }

    const frontendRole = user.role.toLowerCase() as 'master' | 'plus' | 'comum';

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: frontendRole,
      },
    });
  } catch (error: any) {
    console.error('Erro ao sincronizar usuário do Google no banco de dados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao salvar usuário no banco de dados.' },
      { status: 500 }
    );
  }
}
