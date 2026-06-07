import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Seed Services
    const existingServices = await db.service.count()
    if (existingServices === 0) {
      await db.service.createMany({
        data: [
          { title: 'Website Design', description: 'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.', icon: 'Globe', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 1 },
          { title: 'Website Development', description: 'Robust, scalable web applications built with the latest technologies for peak performance and reliability.', icon: 'Code2', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 2 },
          { title: 'E-Commerce Development', description: 'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.', icon: 'ShoppingCart', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 3 },
          { title: 'Responsive Websites', description: 'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.', icon: 'Smartphone', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 4 },
          { title: 'Website Maintenance', description: 'Ongoing support, updates, and optimization to keep your website running smoothly and securely.', icon: 'Settings', color: 'text-emerald-600', bgColor: 'bg-emerald-50', order: 5 },
          { title: 'SEO Services', description: 'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.', icon: 'Search', color: 'text-amber-600', bgColor: 'bg-amber-50', order: 6 },
        ],
      })
    }

    // Seed Portfolio
    const existingPortfolio = await db.portfolio.count()
    if (existingPortfolio === 0) {
      await db.portfolio.createMany({
        data: [
          { title: 'FreshMart Online Store', category: 'E-Commerce', description: 'A fully-featured online grocery store with real-time inventory, secure checkout, and delivery tracking.', tech: 'Next.js, Stripe, PostgreSQL', color: 'from-emerald-500 to-emerald-700', image: '/portfolio-freshmart.png', order: 1 },
          { title: 'HealthPlus Clinic', category: 'Healthcare', description: 'A responsive website for a multi-specialty clinic with appointment booking and patient portal.', tech: 'React, Node.js, MongoDB', color: 'from-amber-500 to-amber-700', image: '/portfolio-healthplus.png', order: 2 },
          { title: 'UrbanBite Restaurant', category: 'Restaurant', description: 'A beautiful restaurant website with online ordering, table reservations, and menu management.', tech: 'Next.js, Prisma, Tailwind', color: 'from-emerald-600 to-teal-700', image: '/portfolio-urbanbite.png', order: 3 },
          { title: 'EduSpark Academy', category: 'Education', description: 'An e-learning platform with course management, video streaming, and student progress tracking.', tech: 'React, Firebase, TypeScript', color: 'from-orange-500 to-amber-700', image: '/portfolio-eduspark.png', order: 4 },
          { title: 'GreenLeaf Landscaping', category: 'Local Business', description: 'A lead-generating website for a landscaping company with gallery, quote requests, and service pages.', tech: 'Next.js, Sanity CMS, Vercel', color: 'from-teal-500 to-emerald-700', image: '/portfolio-greenleaf.png', order: 5 },
          { title: 'TechVault IT Solutions', category: 'IT Services', description: 'A corporate website for an IT firm with service pages, case studies, and a knowledge base.', tech: 'React, GraphQL, AWS', color: 'from-amber-600 to-orange-700', image: '/portfolio-techvault.png', order: 6 },
        ],
      })
    }

    // Seed Testimonials
    const existingTestimonials = await db.testimonial.count()
    if (existingTestimonials === 0) {
      await db.testimonial.createMany({
        data: [
          { name: 'Priya Sharma', company: 'FreshMart Pvt. Ltd.', review: 'A-Star Infotech transformed our online presence. Our e-commerce sales increased by 150% within the first three months. Their team is incredibly talented and responsive.', rating: 5, order: 1 },
          { name: 'Rajesh Patel', company: 'HealthPlus Clinic', review: 'The website they built for us is professional, fast, and easy to manage. Patient appointments have doubled since launch. Highly recommended!', rating: 5, order: 2 },
          { name: 'Anita Desai', company: 'UrbanBite Restaurant', review: 'From design to deployment, A-Star Infotech exceeded all our expectations. The online ordering system works flawlessly, and our customers love it.', rating: 5, order: 3 },
          { name: 'Vikram Singh', company: 'EduSpark Academy', review: 'Working with A-Star Infotech was a game-changer for our platform. They understood our vision and delivered a solution that truly supports our students.', rating: 5, order: 4 },
          { name: 'Meera Joshi', company: 'GreenLeaf Landscaping', review: 'Our new website generates leads every single day. A-Star Infotech really understands how to create sites that convert visitors into customers.', rating: 5, order: 5 },
          { name: 'Arun Kumar', company: 'TechVault IT Solutions', review: 'Professional, reliable, and creative — A-Star Infotech is the best web development partner we have ever worked with. They truly go above and beyond.', rating: 5, order: 6 },
        ],
      })
    }

    // Seed Stats
    const existingStats = await db.stat.count()
    if (existingStats === 0) {
      await db.stat.createMany({
        data: [
          { value: '150+', label: 'Projects Delivered', order: 1 },
          { value: '120+', label: 'Happy Clients', order: 2 },
          { value: '5+', label: 'Years Experience', order: 3 },
          { value: '99%', label: 'Client Satisfaction', order: 4 },
        ],
      })
    }

    // Seed Site Settings
    const existingSettings = await db.siteSetting.count()
    if (existingSettings === 0) {
      await db.siteSetting.createMany({
        data: [
          { key: 'companyName', value: 'A-Star Infotech' },
          { key: 'address', value: 'D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan' },
          { key: 'phone', value: '+91 8560074448' },
          { key: 'email', value: 'karansinghmeertiya@gmail.com' },
          { key: 'hours', value: 'Mon – Sat: 10:00 AM – 7:00 PM' },
          { key: 'heroTitle', value: 'Building Smart Websites for Growing Businesses' },
          { key: 'heroSubtitle', value: 'We craft stunning, high-performance websites that help businesses establish a powerful online presence and drive real results.' },
        ],
      })
    }

    // Seed sample contact
    const existingContacts = await db.contact.count()
    if (existingContacts === 0) {
      await db.contact.create({
        data: {
          name: 'A-Star Infotech',
          email: 'astarinfotech.dev@gmail.com',
          phone: '+91 8560074448',
          message: 'Welcome to A-Star Infotech! This is a test message to verify the database is working correctly.',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully! All data has been populated.',
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
