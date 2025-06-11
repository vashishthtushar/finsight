export const dynamic = 'force-dynamic'; // ⬅️ required for Prisma to work on Vercel

import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  await prisma.transaction.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
