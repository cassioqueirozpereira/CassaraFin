import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initialCategories, initialCostCenters } from '@/utils/seedData';

export async function GET() {
  try {
    // 1. Seed Cost Centers
    for (const cc of initialCostCenters) {
      await prisma.costCenter.upsert({
        where: { code: cc.code },
        update: {},
        create: {
          code: cc.code,
          name: cc.name,
          description: cc.description,
          isActive: cc.isActive,
        },
      });
    }

    // 2. Seed Categories
    for (const cat of initialCategories) {
      await prisma.category.upsert({
        where: { code: cat.code },
        update: {},
        create: {
          code: cat.code,
          name: cat.name,
          type: cat.type,
          description: cat.description,
          isActive: cat.isActive,
        },
      });
    }

    // 3. Seed Default Master User if no user exists
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          name: 'Gestor Master',
          email: 'master@torreforte.org',
          password: 'masterpassword123', // Em prod, usar bcrypt hash
          role: 'MASTER',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados Supabase inicializado com sucesso!',
      seededCostCenters: initialCostCenters.length,
      seededCategories: initialCategories.length,
    });
  } catch (error: any) {
    console.error('Erro ao inicializar Supabase:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro de conexão com o banco de dados',
      },
      { status: 500 }
    );
  }
}
