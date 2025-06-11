const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = ['Food', 'Rent', 'Travel', 'Shopping', 'Utilities']

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  console.log('✅ Categories seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
