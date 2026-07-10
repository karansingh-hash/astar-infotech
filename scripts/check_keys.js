const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
  console.log('=== All SiteSetting keys in DB ===')
  for (const s of settings) {
    console.log(`  ${s.key.padEnd(30)} = ${s.value.substring(0, 60)}${s.value.length > 60 ? '...' : ''}`)
  }
  console.log(`\nTotal: ${settings.length} keys`)
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
