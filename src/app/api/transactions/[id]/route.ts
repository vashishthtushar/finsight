import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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


// PUT: Update a transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { amount, description, date } = body;

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      amount: parseFloat(amount),
      description,
      date: new Date(date),
    },
  });

  return NextResponse.json(updated);
}
