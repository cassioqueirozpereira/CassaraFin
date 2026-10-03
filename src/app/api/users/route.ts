import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET /api/users - List all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        role: u.role.toLowerCase(),
      })),
    });
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar lista de usuários.' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Este e-mail já está cadastrado no sistema.' },
        { status: 400 }
      );
    }

    const dbRole = role.toUpperCase() as Role;

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: password.trim(),
        role: dbRole,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao cadastrar novo usuário.' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user role
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { success: false, error: 'ID e novo nível de acesso (role) são obrigatórios.' },
        { status: 400 }
      );
    }

    const dbRole = role.toUpperCase() as Role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: dbRole },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role.toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar nível de acesso do usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar nível de acesso.' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete user by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário é obrigatório.' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuário removido com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir usuário.' },
      { status: 500 }
    );
  }
}
