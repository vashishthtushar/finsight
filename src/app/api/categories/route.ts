import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('❌ Error in /api/categories GET:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
