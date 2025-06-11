import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const budgets = await prisma.budget.findMany({
    include: { category: true },
  })
  return NextResponse.json(budgets)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { categoryId, amount } = body

  if (!categoryId || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const budget = await prisma.budget.upsert({
    where: { categoryId },
    update: { amount: parseFloat(amount) },
    create: { categoryId, amount: parseFloat(amount) },
  })

  return NextResponse.json(budget)
}
