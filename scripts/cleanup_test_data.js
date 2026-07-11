const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  // Delete the test service I created
  const deleted = await prisma.service.deleteMany({ where: { title: 'Test Service' } })
  console.log(`Deleted ${deleted.count} test service(s)`)
  // Also delete the test contact inquiry
  const deletedContacts = await prisma.contact.deleteMany({ where: { email: 'rahul@test.com' } })
  console.log(`Deleted ${deletedContacts.count} test contact(s)`)
  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
