import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query user in database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    // Map Prisma enum Role (MASTER, PLUS, COMUM) to lowercase frontend role
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
    console.error('Erro no login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao realizar autenticação.' },
      { status: 500 }
    );
  }
}
