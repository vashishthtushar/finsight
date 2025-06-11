import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET: Fetch all transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: { category: true }, // Include category info
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('❌ Error in /api/transactions GET:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}

// POST: Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, date, categoryId } = body

    if (!amount || !description || !date || !categoryId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        categoryId,
      },
    })

    return NextResponse.json(newTransaction)
  } catch (error) {
    console.error('❌ Error in /api/transactions POST:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
