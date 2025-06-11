import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// DELETE: Delete a transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  await prisma.transaction.delete({ where: { id } })

  return NextResponse.json({ success: true })
}

// PUT: Update a transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const body = await request.json()
  const { amount, description, date } = body

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      amount: parseFloat(amount),
      description,
      date: new Date(date)
    }
  })

  return NextResponse.json(updated)
}
