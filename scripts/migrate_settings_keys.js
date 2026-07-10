/**
 * One-off migration: convert legacy snake_case SiteSetting keys to camelCase
 * matching ALLOWED_SETTINGS_KEYS in src/app/api/settings/route.ts.
 *
 * Run with: node scripts/migrate_settings_keys.js
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Map old snake_case key → new camelCase key
const MIGRATIONS = {
  'hero_badge': 'heroBadge',
  'hero_title': 'heroHeading',
  'hero_description': 'heroSubtitle',
  'about_title': 'aboutHeading',
  'about_paragraph1': 'aboutDescription1',
  'about_paragraph2': 'aboutDescription2',
  'about_vision': 'aboutVision',
  'about_mission': 'aboutMission',
  'about_values': 'aboutValues',
  'why_description': 'whyChooseUsIntro',
  'contact_phone': 'phone',
  'contact_email': 'email',
  'contact_address': 'address',
  'contact_hours': 'hours',
}

// Keys with no camelCase equivalent — just delete
const ORPHANS = [
  'about_years',
  'about_years_label',
  'services_title',
  'services_description',
  'why_title',
  'portfolio_title',
  'portfolio_description',
  'testimonials_title',
  'testimonials_description',
  'cta_title',
  'cta_description',
  'whatsapp_number',
]

async function main() {
  console.log('🔄 Migrating SiteSetting keys from snake_case → camelCase...')

  let migrated = 0
  for (const [oldKey, newKey] of Object.entries(MIGRATIONS)) {
    const existing = await prisma.siteSetting.findUnique({ where: { key: oldKey } })
    if (!existing) continue

    // Only migrate if the new key doesn't already exist (don't overwrite admin's saved values)
    const existingNew = await prisma.siteSetting.findUnique({ where: { key: newKey } })
    if (!existingNew && existing.value) {
      await prisma.siteSetting.create({ data: { key: newKey, value: existing.value } })
      console.log(`  ✓ ${oldKey} → ${newKey}`)
      migrated++
    }
    // Always delete the old key
    await prisma.siteSetting.delete({ where: { key: oldKey } })
  }

  let deleted = 0
  for (const orphan of ORPHANS) {
    const r = await prisma.siteSetting.deleteMany({ where: { key: orphan } })
    if (r.count > 0) {
      console.log(`  ✗ deleted orphan: ${orphan}`)
      deleted += r.count
    }
  }

  // If essential camelCase keys are still missing, seed them with defaults
  const essential = {
    companyName: 'A-Star Infotech',
    address: 'D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan',
    phone: '+91 8560074448',
    email: 'contact@astarinfotech.in',
    secondaryEmail: '',
    hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
    facebook: 'https://facebook.com/astarinfotech',
    instagram: 'https://instagram.com/astarinfotech',
    linkedin: 'https://linkedin.com/company/astarinfotech',
    youtube: 'https://youtube.com/@astarinfotech',
    brandColor: '#059669',
    heroBadge: '',
    heroHeading: 'Transform Your Digital Presence With Us',
    heroSubtitle: 'We craft stunning, high-performance websites that help businesses grow. From design to development, SEO to e-commerce — we deliver digital solutions that drive results.',
    aboutHeading: 'We Build Digital Experiences That Matter',
    aboutDescription1: "A-Star Infotech is a forward-thinking web development agency dedicated to empowering businesses with impactful digital solutions. We combine creativity, technology, and strategy to build websites that don't just look great — they deliver measurable results.",
    aboutDescription2: 'From startups finding their voice to established brands seeking digital transformation, we partner with our clients every step of the way. Our mission is simple: help you succeed online.',
    aboutVision: 'To be the most trusted digital partner for businesses seeking growth through innovative web solutions.',
    aboutMission: 'To deliver high-quality, affordable web solutions that help businesses thrive in the digital age.',
    aboutValues: 'Innovation, Integrity, Excellence, Collaboration, Transparency',
    whyChooseUsIntro: "We're not just another web development agency. We're your growth partners — committed to delivering solutions that make a real difference for your business.",
  }

  let seeded = 0
  for (const [key, value] of Object.entries(essential)) {
    const existing = await prisma.siteSetting.findUnique({ where: { key } })
    if (!existing) {
      await prisma.siteSetting.create({ data: { key, value } })
      console.log(`  + seeded missing: ${key}`)
      seeded++
    }
  }

  console.log(`\n✅ Migration complete: ${migrated} migrated, ${deleted} orphans deleted, ${seeded} missing keys seeded.`)

  // Final state
  const all = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
  console.log(`\nTotal SiteSetting keys in DB: ${all.length}`)
  for (const s of all) {
    console.log(`  ${s.key.padEnd(30)} = ${s.value.substring(0, 50)}${s.value.length > 50 ? '...' : ''}`)
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error('❌ Migration error:', e); process.exit(1) })
