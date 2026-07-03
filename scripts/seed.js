/**
 * Standalone database seed script
 * Run with: node scripts/seed.js
 * Used by Docker start.sh for first-run seeding
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Check if already seeded
  const count = await prisma.service.count()
  if (count > 0) {
    console.log('✅ Database already seeded, skipping...')
    return
  }

  console.log('🌱 Seeding database...')

  // Seed Site Settings
  const settings = [
    { key: 'hero_badge', value: '' },
    { key: 'hero_title', value: 'Transform Your Digital Presence With Us' },
    { key: 'hero_description', value: 'We craft stunning, high-performance websites that help businesses grow. From design to development, SEO to e-commerce — we deliver digital solutions that drive results.' },
    { key: 'about_title', value: 'We Build Digital Experiences That Matter' },
    { key: 'about_paragraph1', value: "A-Star Infotech is a forward-thinking web development agency dedicated to empowering businesses with impactful digital solutions. We combine creativity, technology, and strategy to build websites that don't just look great — they deliver measurable results." },
    { key: 'about_paragraph2', value: 'From startups finding their voice to established brands seeking digital transformation, we partner with our clients every step of the way. Our mission is simple: help you succeed online.' },
    { key: 'about_vision', value: 'To be the most trusted digital partner for businesses seeking growth through innovative web solutions.' },
    { key: 'about_mission', value: 'To deliver high-quality, affordable web solutions that help businesses thrive in the digital age.' },
    { key: 'about_values', value: 'Innovation,Integrity,Excellence,Collaboration,Transparency' },
    { key: 'about_years', value: '5+' },
    { key: 'about_years_label', value: 'Trusted Experience' },
    { key: 'services_title', value: 'Everything You Need to Succeed Online' },
    { key: 'services_description', value: 'From concept to launch and beyond, we provide comprehensive web solutions tailored to your business goals.' },
    { key: 'why_title', value: 'What Makes Us Stand Out' },
    { key: 'why_description', value: "We're not just another web development agency. We're your growth partners — committed to delivering solutions that make a real difference for your business." },
    { key: 'portfolio_title', value: 'Projects That Speak for Themselves' },
    { key: 'portfolio_description', value: "Explore some of our recent work and see how we've helped businesses across industries achieve their digital goals." },
    { key: 'testimonials_title', value: 'What Our Clients Say About Us' },
    { key: 'testimonials_description', value: "Don't just take our word for it — hear from the businesses we've helped succeed." },
    { key: 'cta_title', value: 'Ready to Take Your Business Online?' },
    { key: 'cta_description', value: "Let's build something amazing together. Get in touch today for a free consultation and discover how we can transform your digital presence." },
    { key: 'contact_phone', value: '+91 8560074448' },
    { key: 'contact_email', value: 'contact@astarinfotech.in' },
    { key: 'contact_address', value: 'D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan' },
    { key: 'contact_hours', value: 'Mon – Sat: 10:00 AM – 7:00 PM' },
    { key: 'whatsapp_number', value: '918560074448' },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    })
  }

  // Seed Services
  const services = [
    { icon: 'Globe', title: 'Website Design', description: 'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 1 },
    { icon: 'Code2', title: 'Website Development', description: 'Robust, scalable web applications built with the latest technologies for peak performance and reliability.', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 2 },
    { icon: 'ShoppingCart', title: 'E-Commerce Development', description: 'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 3 },
    { icon: 'Smartphone', title: 'Responsive Websites', description: 'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 4 },
    { icon: 'Settings', title: 'Website Maintenance', description: 'Ongoing support, updates, and optimization to keep your website running smoothly and securely.', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 5 },
    { icon: 'Search', title: 'SEO Services', description: 'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 6 },
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  // Seed Portfolio
  const portfolio = [
    { title: 'FreshMart Online Store', category: 'E-Commerce', description: 'A fully-featured online grocery store with real-time inventory, secure checkout, and delivery tracking.', tech: '["Next.js","Stripe","PostgreSQL"]', color: 'from-emerald-500 to-emerald-700', image: '/portfolio-freshmart.png', order: 1 },
    { title: 'HealthPlus Clinic', category: 'Healthcare', description: 'A responsive website for a multi-specialty clinic with appointment booking and patient portal.', tech: '["React","Node.js","MongoDB"]', color: 'from-amber-500 to-amber-700', image: '/portfolio-healthplus.png', order: 2 },
    { title: 'UrbanBite Restaurant', category: 'Restaurant', description: 'A beautiful restaurant website with online ordering, table reservations, and menu management.', tech: '["Next.js","Prisma","Tailwind"]', color: 'from-emerald-600 to-teal-700', image: '/portfolio-urbanbite.png', order: 3 },
    { title: 'EduSpark Academy', category: 'Education', description: 'An e-learning platform with course management, video streaming, and student progress tracking.', tech: '["React","Firebase","TypeScript"]', color: 'from-orange-500 to-amber-700', image: '/portfolio-eduspark.png', order: 4 },
    { title: 'GreenLeaf Landscaping', category: 'Local Business', description: 'A lead-generating website for a landscaping company with gallery, quote requests, and service pages.', tech: '["Next.js","Sanity CMS","Vercel"]', color: 'from-teal-500 to-emerald-700', image: '/portfolio-greenleaf.png', order: 5 },
    { title: 'TechVault IT Solutions', category: 'IT Services', description: 'A corporate website for an IT firm with service pages, case studies, and a knowledge base.', tech: '["React","GraphQL","AWS"]', color: 'from-amber-600 to-orange-700', image: '/portfolio-techvault.png', order: 6 },
  ]

  for (const project of portfolio) {
    await prisma.portfolio.create({ data: project })
  }

  // Seed Testimonials
  const testimonials = [
    { name: 'Priya Sharma', company: 'FreshMart Pvt. Ltd.', review: 'A-Star Infotech transformed our online presence. Our e-commerce sales increased by 150% within the first three months. Their team is incredibly talented and responsive.', rating: 5, order: 1 },
    { name: 'Rajesh Patel', company: 'HealthPlus Clinic', review: 'The website they built for us is professional, fast, and easy to manage. Patient appointments have doubled since launch. Highly recommended!', rating: 5, order: 2 },
    { name: 'Anita Desai', company: 'UrbanBite Restaurant', review: 'From design to deployment, A-Star Infotech exceeded all our expectations. The online ordering system works flawlessly, and our customers love it.', rating: 5, order: 3 },
    { name: 'Vikram Singh', company: 'EduSpark Academy', review: 'Working with A-Star Infotech was a game-changer for our platform. They understood our vision and delivered a solution that truly supports our students.', rating: 5, order: 4 },
    { name: 'Meera Joshi', company: 'GreenLeaf Landscaping', review: 'Our new website generates leads every single day. A-Star Infotech really understands how to create sites that convert visitors into customers.', rating: 5, order: 5 },
    { name: 'Arun Kumar', company: 'TechVault IT Solutions', review: 'Professional, reliable, and creative — A-Star Infotech is the best web development partner we have ever worked with. They truly go above and beyond.', rating: 5, order: 6 },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial })
  }

  // Seed Stats
  const stats = [
    { value: '150+', label: 'Projects Delivered', order: 1 },
    { value: '120+', label: 'Happy Clients', order: 2 },
    { value: '5+', label: 'Years Experience', order: 3 },
    { value: '99%', label: 'Client Satisfaction', order: 4 },
  ]

  for (const stat of stats) {
    await prisma.stat.create({ data: stat })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
