/**
 * Centralized SEO data for A-Star Infotech
 * Used by structured data components, sitemap, and service pages
 */

export const SITE = {
  name: 'A-Star Infotech',
  url: 'https://www.astarinfotech.in',
  email: 'contact@astarinfotech.in',
  phone: '+91 8560074448',
  phoneTel: '+918560074448',
  address: {
    street: 'D-49, Shiv Marg, Balaji Sagar-15',
    city: 'Jaipur',
    region: 'Rajasthan',
    postalCode: '302006',
    country: 'IN',
    countryName: 'India',
  },
  geo: {
    latitude: 26.9124,
    longitude: 75.7873,
  },
  hours: 'Mon-Sat 10:00-19:00',
  priceRange: '₹₹',
  founded: '2021',
  foundedYear: 2021,
  social: {
    facebook: 'https://facebook.com/astarinfotech',
    instagram: 'https://instagram.com/astarinfotech',
    linkedin: 'https://linkedin.com/company/astarinfotech',
    youtube: 'https://youtube.com/@astarinfotech',
  },
}

export const SERVICES = [
  {
    slug: 'website-design',
    title: 'Website Design',
    shortTitle: 'Website Design',
    description: 'Beautiful, modern designs that capture your brand identity and engage visitors from the first click.',
    fullDescription: 'We craft visually stunning, user-centric website designs that reflect your brand personality and leave a lasting impression. Our design process focuses on aesthetics, usability, and conversion optimization to ensure every visitor becomes a potential customer.',
    icon: 'Globe',
    features: [
      'Custom UI/UX Design',
      'Brand Identity Integration',
      'Wireframing & Prototyping',
      'Mobile-First Approach',
      'Conversion-Optimized Layouts',
      'Unlimited Design Revisions',
    ],
    tech: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
    keywords: ['website design jaipur', 'web design company', 'ui ux design india', 'responsive website design'],
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    shortTitle: 'Website Development',
    description: 'Robust, scalable web applications built with the latest technologies for peak performance and reliability.',
    fullDescription: 'We build high-performance, scalable websites using the latest technologies and best coding practices. From simple landing pages to complex web applications, our development team delivers clean, maintainable code that stands the test of time.',
    icon: 'Code2',
    features: [
      'Custom Web Applications',
      'CMS Integration',
      'API Development',
      'Database Design',
      'Performance Optimization',
      'Security Best Practices',
    ],
    tech: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB'],
    keywords: ['website development jaipur', 'web development company', 'react development india', 'next js development'],
  },
  {
    slug: 'ecommerce-development',
    title: 'E-Commerce Development',
    shortTitle: 'E-Commerce Development',
    description: 'Feature-rich online stores with secure payments, inventory management, and seamless shopping experiences.',
    fullDescription: 'Launch your online store with a powerful e-commerce solution that drives sales. We build feature-rich, secure shopping experiences with seamless payment integration, inventory management, and analytics to help you grow your business.',
    icon: 'ShoppingCart',
    features: [
      'Product Catalog Management',
      'Secure Payment Gateway',
      'Order Tracking System',
      'Inventory Management',
      'Discount & Coupon System',
      'Multi-Vendor Support',
    ],
    tech: ['Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'Next.js Commerce', 'Prisma'],
    keywords: ['ecommerce development jaipur', 'online store development', 'shopify development india', 'ecommerce website design'],
  },
  {
    slug: 'responsive-websites',
    title: 'Responsive Websites',
    shortTitle: 'Responsive Websites',
    description: 'Websites that look stunning on every device — from desktop monitors to the smallest smartphones.',
    fullDescription: 'Your website will look perfect on every device — desktops, tablets, and smartphones. We use responsive design techniques and fluid layouts to ensure a seamless experience for all visitors, regardless of screen size.',
    icon: 'Smartphone',
    features: [
      'Fluid Grid Layouts',
      'Flexible Images & Media',
      'Touch-Friendly Navigation',
      'Cross-Browser Testing',
      'Progressive Enhancement',
      'Adaptive Content Delivery',
    ],
    tech: ['Tailwind CSS', 'CSS Grid & Flexbox', 'React Responsive', 'Next.js', 'PWA Support'],
    keywords: ['responsive website design', 'mobile friendly website', 'pwa development india', 'mobile website design'],
  },
  {
    slug: 'website-maintenance',
    title: 'Website Maintenance',
    shortTitle: 'Website Maintenance',
    description: 'Ongoing support, updates, and optimization to keep your website running smoothly and securely.',
    fullDescription: 'Keep your website running smoothly with our comprehensive maintenance and support services. From regular updates and security patches to performance monitoring and backups, we handle the technical details so you can focus on your business.',
    icon: 'Settings',
    features: [
      'Regular Updates & Patches',
      'Security Monitoring',
      'Performance Optimization',
      'Daily Backups',
      'Uptime Monitoring',
      'Content Updates',
    ],
    tech: ['AWS', 'Vercel', 'Cloudflare', 'GitHub Actions', 'Monitoring Tools', 'CDN'],
    keywords: ['website maintenance', 'website support india', 'website security jaipur', 'website updates'],
  },
  {
    slug: 'seo-services',
    title: 'SEO Services',
    shortTitle: 'SEO Services',
    description: 'Data-driven SEO strategies that boost your visibility and drive organic traffic to your website.',
    fullDescription: 'Boost your online visibility and drive organic traffic with our data-driven SEO strategies. We optimize every aspect of your website — from technical SEO and content to backlinks and local search — to ensure you rank higher and reach more customers.',
    icon: 'Search',
    features: [
      'Keyword Research & Strategy',
      'On-Page SEO Optimization',
      'Technical SEO Audit',
      'Content Marketing',
      'Link Building',
      'Local SEO & Google My Business',
    ],
    tech: ['Google Analytics', 'Search Console', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Schema Markup'],
    keywords: ['seo services jaipur', 'seo company india', 'local seo jaipur', 'google ranking', 'organic traffic'],
  },
] as const

export const FAQS = [
  {
    question: 'What services does A-Star Infotech offer?',
    answer: 'A-Star Infotech offers comprehensive web development services including website design, website development, e-commerce development, responsive websites, website maintenance, and SEO services. We serve businesses across Jaipur, Rajasthan, and all of India.',
  },
  {
    question: 'How much does a website cost in Jaipur, India?',
    answer: 'Website costs vary based on requirements. A basic business website starts from ₹15,000, e-commerce websites from ₹40,000, and custom web applications from ₹80,000. Contact us for a free quote tailored to your specific needs and budget.',
  },
  {
    question: 'How long does it take to build a website?',
    answer: 'A typical business website takes 2-4 weeks, e-commerce sites 4-8 weeks, and complex web applications 8-16 weeks. Timeline depends on project complexity, content readiness, and revision rounds. We provide detailed timelines during the project planning phase.',
  },
  {
    question: 'Do you provide website maintenance after launch?',
    answer: 'Yes, we offer ongoing website maintenance plans starting from ₹2,000/month. This includes security updates, backups, performance monitoring, content updates, and technical support. We ensure your website stays secure, fast, and up-to-date.',
  },
  {
    question: 'Will my website be mobile-friendly and responsive?',
    answer: 'Absolutely. Every website we build is 100% responsive and mobile-friendly by default. We test on multiple devices and screen sizes to ensure a seamless experience for all visitors, which also helps with Google search rankings.',
  },
  {
    question: 'Do you offer SEO services to help my website rank on Google?',
    answer: 'Yes, we provide comprehensive SEO services including keyword research, on-page optimization, technical SEO audits, content marketing, link building, and local SEO for Google My Business. Our data-driven approach helps improve your search rankings and organic traffic.',
  },
  {
    question: 'Can you redesign my existing website?',
    answer: 'Yes, we specialize in website redesigns. We can transform your outdated website into a modern, fast, and conversion-optimized platform while preserving your SEO rankings and content. We handle migration, redirects, and ensure zero downtime during the transition.',
  },
  {
    question: 'What technologies do you use for web development?',
    answer: 'We use modern, industry-standard technologies including Next.js, React, TypeScript, Node.js, PostgreSQL, MongoDB, Tailwind CSS, and Prisma. For e-commerce, we work with Shopify, WooCommerce, Stripe, and Razorpay. We choose the best tech stack based on your project requirements.',
  },
  {
    question: 'Do you work with clients outside Jaipur?',
    answer: 'Yes, while we are based in Jaipur, Rajasthan, we work with clients across India and internationally. We communicate via email, phone, video calls, and project management tools to ensure smooth collaboration regardless of location.',
  },
  {
    question: 'How do I get started with A-Star Infotech?',
    answer: 'Getting started is easy. Contact us via phone at +91 8560074448, email at contact@astarinfotech.in, or fill out the contact form on our website. We offer a free consultation to discuss your project, understand your goals, and provide a detailed proposal with timeline and pricing.',
  },
] as const

export const TESTIMONIALS = [
  { name: 'Priya Sharma', company: 'FreshMart Pvt. Ltd.', review: 'A-Star Infotech transformed our online presence. Our e-commerce sales increased by 150% within the first three months. Their team is incredibly talented and responsive.', rating: 5 },
  { name: 'Rajesh Patel', company: 'HealthPlus Clinic', review: 'The website they built for us is professional, fast, and easy to manage. Patient appointments have doubled since launch. Highly recommended!', rating: 5 },
  { name: 'Anita Desai', company: 'UrbanBite Restaurant', review: 'From design to deployment, A-Star Infotech exceeded all our expectations. The online ordering system works flawlessly, and our customers love it.', rating: 5 },
  { name: 'Vikram Singh', company: 'EduSpark Academy', review: 'Working with A-Star Infotech was a game-changer for our platform. They understood our vision and delivered a solution that truly supports our students.', rating: 5 },
  { name: 'Meera Joshi', company: 'GreenLeaf Landscaping', review: 'Our new website generates leads every single day. A-Star Infotech really understands how to create sites that convert visitors into customers.', rating: 5 },
  { name: 'Arun Kumar', company: 'TechVault IT Solutions', review: 'Professional, reliable, and creative — A-Star Infotech is the best web development partner we have ever worked with. They truly go above and beyond.', rating: 5 },
] as const

export const STATS = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '120+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
] as const

// Average rating computed from testimonials
export const AVERAGE_RATING = (
  TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
).toFixed(1)
export const REVIEW_COUNT = TESTIMONIALS.length
