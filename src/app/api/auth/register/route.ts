import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Este e-mail já está cadastrado no sistema.' },
        { status: 400 }
      );
    }

    // Create new user with default role COMUM
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: password, // In production, hash with bcrypt/argon2
        role: 'COMUM',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'comum',
      },
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao criar conta.' },
      { status: 500 }
    );
  }
}
