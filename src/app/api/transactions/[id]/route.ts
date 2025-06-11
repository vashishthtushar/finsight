// Avoid Edge Function – required for Prisma to work on Vercel
export const dynamic = 'force-dynamic';

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const id = req.url.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
