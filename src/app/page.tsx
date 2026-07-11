'use client'
import {useState, useEffect, FormEvent, useCallback} from 'react'
import {Menu, X, Code2, Globe, ShoppingCart, Smartphone, Settings, Search, ArrowRight, Star, MapPin, Phone, Mail, Clock, Users, Award, Zap, Heart, ChevronRight, Send, Facebook, Instagram, Linkedin, Youtube, MessageCircle, ChevronUp, Sparkles, Target, Shield, Rocket, Sun, Moon, Home as HomeIcon, Stethoscope, Building2, Factory, Store, GraduationCap, UtensilsCrossed, Scale, Briefcase, Wrench, Lightbulb, Gem, HardHat, ChevronDown, HelpCircle} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {LegalModal} from '@/components/legal-modal'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Card, CardContent} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog'
import {toast} from 'sonner'
import {useTheme} from 'next-themes'
import {StructuredData} from '@/components/StructuredData'
import {FAQS, SERVICES} from '@/lib/seo-data'

const NAV=[{l:'Home',h:'/#home'},{l:'About',h:'/#about'},{l:'Services',h:'/#services'},{l:'Portfolio',h:'/#portfolio'},{l:'Testimonials',h:'/#testimonials'},{l:'FAQ',h:'/faq'},{l:'Contact',h:'/#contact'}]
const IM:Record<string,React.ElementType>={Globe,Code2,ShoppingCart,Smartphone,Settings,Search,Award,Zap,Shield,Heart,Target,Rocket,Star,Users,Stethoscope,Building2,Factory,Store,GraduationCap,UtensilsCrossed,Scale,Briefcase,Wrench,Gem,HardHat,Lightbulb}
const SV=[{i:'Globe',t:'Website Design',d:'Beautiful, modern designs that capture your brand identity.',c:'text-emerald-400',bg:'bg-emerald-500/10'},{i:'Code2',t:'Website Development',d:'Robust, scalable web apps built with the latest technologies.',c:'text-cyan-400',bg:'bg-cyan-500/10'},{i:'ShoppingCart',t:'E-Commerce Development',d:'Feature-rich online stores with secure payments.',c:'text-emerald-400',bg:'bg-emerald-500/10'},{i:'Smartphone',t:'Responsive Websites',d:'Websites that look stunning on every device.',c:'text-cyan-400',bg:'bg-cyan-500/10'},{i:'Settings',t:'Website Maintenance',d:'Ongoing support to keep your site running smoothly.',c:'text-emerald-400',bg:'bg-emerald-500/10'},{i:'Search',t:'SEO Services',d:'Data-driven SEO strategies that boost visibility.',c:'text-cyan-400',bg:'bg-cyan-500/10'}]
type SvcDetail={desc:string;features:string[];tech:string[]}
const SD={'Website Design':{desc:"We craft visually stunning, user-centric website designs that reflect your brand's personality and leave a lasting impression. Our design process focuses on aesthetics, usability, and conversion optimization to ensure every visitor becomes a potential customer.",features:['Custom UI/UX Design','Brand Identity Integration','Wireframing & Prototyping','Mobile-First Approach','Conversion-Optimized Layouts','Unlimited Design Revisions'],tech:['Figma','Adobe XD','Photoshop','Illustrator']},'Website Development':{desc:'We build high-performance, scalable websites using the latest technologies and best coding practices. From simple landing pages to complex web applications, our development team delivers clean, maintainable code that stands the test of time.',features:['Custom Web Applications','CMS Integration','API Development','Database Design','Performance Optimization','Security Best Practices'],tech:['Next.js','React','Node.js','TypeScript','PostgreSQL','MongoDB']},'E-Commerce Development':{desc:'Launch your online store with a powerful e-commerce solution that drives sales. We build feature-rich, secure shopping experiences with seamless payment integration, inventory management, and analytics to help you grow your business.',features:['Product Catalog Management','Secure Payment Gateway','Order Tracking System','Inventory Management','Discount & Coupon System','Multi-Vendor Support'],tech:['Shopify','WooCommerce','Stripe','Razorpay','Next.js Commerce','Prisma']},'Responsive Websites':{desc:'Your website will look perfect on every device — desktops, tablets, and smartphones. We use responsive design techniques and fluid layouts to ensure a seamless experience for all visitors, regardless of screen size.',features:['Fluid Grid Layouts','Flexible Images & Media','Touch-Friendly Navigation','Cross-Browser Testing','Progressive Enhancement','Adaptive Content Delivery'],tech:['Tailwind CSS','CSS Grid & Flexbox','React Responsive','Next.js','PWA Support']},'Website Maintenance':{desc:'Keep your website running smoothly with our comprehensive maintenance and support services. From regular updates and security patches to performance monitoring and backups, we handle the technical details so you can focus on your business.',features:['Regular Updates & Patches','Security Monitoring','Performance Optimization','Daily Backups','Uptime Monitoring','Content Updates'],tech:['AWS','Vercel','Cloudflare','GitHub Actions','Monitoring Tools','CDN']},'SEO Services':{desc:'Boost your online visibility and drive organic traffic with our data-driven SEO strategies. We optimize every aspect of your website — from technical SEO and content to backlinks and local search — to ensure you rank higher and reach more customers.',features:['Keyword Research & Strategy','On-Page SEO Optimization','Technical SEO Audit','Content Marketing','Link Building','Local SEO & Google My Business'],tech:['Google Analytics','Search Console','Ahrefs','SEMrush','Screaming Frog','Schema Markup']}} as Record<string,SvcDetail>
const WU=[{i:Award,t:'Experienced Team',d:'Skilled developers with years of expertise.'},{i:Zap,t:'Fast Delivery',d:'Deadlines met without compromising quality.'},{i:Shield,t:'Secure Solutions',d:'Latest security best practices built in.'},{i:Heart,t:'Client-Centric',d:'Your vision drives our work.'},{i:Target,t:'Result-Oriented',d:'Outcomes that grow your business.'},{i:Rocket,t:'Modern Technology',d:'Cutting-edge tools and frameworks.'}]
const PF=[{t:'FreshMart Online Store',c:'E-Commerce',d:'Online grocery store with real-time inventory.',x:'Next.js, Stripe, PostgreSQL',i:'/portfolio-freshmart.png'},{t:'HealthPlus Clinic',c:'Healthcare',d:'Clinic website with appointment booking.',x:'React, Node.js, MongoDB',i:'/portfolio-healthplus.png'},{t:'UrbanBite Restaurant',c:'Restaurant',d:'Restaurant site with online ordering.',x:'Next.js, Prisma, Tailwind',i:'/portfolio-urbanbite.png'},{t:'EduSpark Academy',c:'Education',d:'E-learning platform with progress tracking.',x:'React, Firebase, TypeScript',i:'/portfolio-eduspark.png'},{t:'GreenLeaf Landscaping',c:'Local Business',d:'Lead-gen website with quote requests.',x:'Next.js, Sanity CMS, Vercel',i:'/portfolio-greenleaf.png'},{t:'TechVault IT Solutions',c:'IT Services',d:'Corporate website with case studies.',x:'React, GraphQL, AWS',i:'/portfolio-techvault.png'}]
const TM=[{n:'Priya Sharma',c:'FreshMart Pvt. Ltd.',r:'A-Star Infotech transformed our online presence. Sales increased by 150%!',rt:5},{n:'Rajesh Patel',c:'HealthPlus Clinic',r:'Professional and fast. Patient appointments doubled since launch!',rt:5},{n:'Anita Desai',c:'UrbanBite Restaurant',r:'Exceeded all expectations. Flawless online ordering.',rt:5},{n:'Vikram Singh',c:'EduSpark Academy',r:'A game-changer. They understood our vision perfectly.',rt:5},{n:'Meera Joshi',c:'GreenLeaf Landscaping',r:'Our website generates leads every single day.',rt:5},{n:'Arun Kumar',c:'TechVault IT Solutions',r:'Professional, reliable, creative — the best web partner.',rt:5}]
const ST=[{v:'150+',l:'Projects Delivered'},{v:'120+',l:'Happy Clients'},{v:'5+',l:'Years Experience'},{v:'99%',l:'Client Satisfaction'}]
const IND_F=[{i:'Stethoscope',t:'Healthcare & Clinics',c:'text-blue-400',bg:'bg-blue-500/10'},{i:'Building2',t:'Real Estate',c:'text-orange-400',bg:'bg-orange-500/10'},{i:'Factory',t:'Manufacturing & Export',c:'text-red-400',bg:'bg-red-500/10'},{i:'Store',t:'Retail & E-Commerce',c:'text-pink-400',bg:'bg-pink-500/10'},{i:'GraduationCap',t:'Schools & Coaching',c:'text-amber-400',bg:'bg-amber-500/10'},{i:'UtensilsCrossed',t:'Restaurants & Hotels',c:'text-cyan-400',bg:'bg-cyan-500/10'},{i:'Scale',t:'Legal & CA Firms',c:'text-blue-400',bg:'bg-blue-500/10'},{i:'Briefcase',t:'Consultants & Coaches',c:'text-amber-400',bg:'bg-amber-500/10'},{i:'Wrench',t:'Service Businesses',c:'text-gray-400',bg:'bg-gray-500/10'},{i:'Rocket',t:'Startups',c:'text-red-400',bg:'bg-red-500/10'},{i:'Gem',t:'Jewellery & Fashion',c:'text-purple-400',bg:'bg-purple-500/10'},{i:'HardHat',t:'Construction & Interior',c:'text-orange-400',bg:'bg-orange-500/10'}]
const DF={cn:'A-Star Infotech',ad:'D-49, Shiv Marg, Balaji Sagar-15, Jaipur, Rajasthan',ph:'+91 8560074448',em:'contact@astarinfotech.in',hr:'Mon-Sat: 10AM-7PM',fb:'https://facebook.com/astarinfotech',ig:'https://instagram.com/astarinfotech',li:'https://linkedin.com/company/astarinfotech',yt:'https://youtube.com/@astarinfotech',bc:'#059669',hb:'',hh:'Transform Your Digital Presence With Us',hs:'We craft stunning, high-performance websites that help businesses grow. From design to development, SEO to e-commerce — we deliver results.',ah:'We Build Digital Experiences That Matter',a1:'A-Star Infotech is a forward-thinking web development agency combining creativity, technology, and strategy to deliver measurable results.',a2:'From startups to established brands, we partner with clients every step of the way.',av:'To be the most trusted digital partner for businesses seeking growth through innovation.',am:'Delivering high-quality, affordable web solutions for the digital age.',al:'Innovation, Integrity, Excellence, Collaboration, Transparency',wi:'We\'re your growth partners — delivering solutions that make a real difference.'}

export default function Home(){
const[mO,sMO]=useState(false),[sc,sSC]=useState(false),[sT,sST]=useState(false),[sub,setSub]=useState(false)
const[fm,setFm]=useState({name:'',email:'',phone:'',message:''})
const[svs,setSvs]=useState(SV),[pf,setPf]=useState(PF),[tms,setTms]=useState(TM),[sts,setSts]=useState(ST),[s,setS]=useState(DF),[inds,setInds]=useState(IND_F)
const[pF,sPF]=useState('All'),[sDlg,setSDlg]=useState<{open:boolean;svc:typeof SV[0]|null}>({open:false,svc:null})
const{theme,setTheme}=useTheme(),[mnt,sMnt]=useState(false),[tI,sTI]=useState(0)
const auto=useCallback(()=>setInterval(()=>sTI(p=>(p+1)%tms.length),5000),[tms.length])
useEffect(()=>{const id=auto();return()=>clearInterval(id)},[auto])
useEffect(()=>sMnt(true),[])
useEffect(()=>{(async()=>{try{const[sR,pR,tR,stR,seR,iR]=await Promise.allSettled([fetch('/api/services'),fetch('/api/portfolio'),fetch('/api/testimonials'),fetch('/api/stats'),fetch('/api/settings'),fetch('/api/industries')])
if(sR.status==='fulfilled'&&sR.value.ok){const d=await sR.value.json();if(d.services?.length)setSvs(d.services.map((x:any)=>({i:x.icon||'Globe',t:x.title,d:x.description,c:x.color||'text-emerald-400',bg:x.bgColor||'bg-emerald-500/10'})))}
if(pR.status==='fulfilled'&&pR.value.ok){const d=await pR.value.json();if(d.portfolio?.length)setPf(d.portfolio.map((x:any)=>({t:x.title,c:x.category,d:x.description,x:x.tech||'',i:x.image||'/portfolio-freshmart.png'})))}
if(tR.status==='fulfilled'&&tR.value.ok){const d=await tR.value.json();if(d.testimonials?.length)setTms(d.testimonials.map((x:any)=>({n:x.name,c:x.company,r:x.review,rt:x.rating||5})))}
if(stR.status==='fulfilled'&&stR.value.ok){const d=await stR.value.json();if(d.stats?.length)setSts(d.stats.map((x:any)=>({v:x.value,l:x.label})))}
if(seR.status==='fulfilled'&&seR.value.ok){const d=await seR.value.json();const g=d.settings||{};setS({...DF,cn:g.companyName??DF.cn,ad:g.address??DF.ad,ph:g.phone??DF.ph,em:g.email??DF.em,hr:g.hours??DF.hr,fb:g.facebook??DF.fb,ig:g.instagram??DF.ig,li:g.linkedin??DF.li,yt:g.youtube??DF.yt,bc:g.brandColor??DF.bc,hb:g.heroBadge??DF.hb,hh:g.heroHeading??DF.hh,hs:g.heroSubtitle??DF.hs,ah:g.aboutHeading??DF.ah,a1:g.aboutDescription1??DF.a1,a2:g.aboutDescription2??DF.a2,av:g.aboutVision??DF.av,am:g.aboutMission??DF.am,al:g.aboutValues??DF.al,wi:g.whyChooseUsIntro??DF.wi})}
if(iR.status==='fulfilled'&&iR.value.ok){const d=await iR.value.json();if(d.industries?.length)setInds(d.industries.map((x:any)=>({i:x.icon||'Globe',t:x.title,c:x.color||'text-emerald-400',bg:x.bgColor||'bg-emerald-500/10'})))}
}catch{}})()},[])
useEffect(()=>{const h=()=>{sSC(window.scrollY>20);sST(window.scrollY>500)};window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h)},[])
useEffect(()=>{const h=s.bc||'#059669',r=document.documentElement,rv=parseInt(h.slice(1,3),16),gv=parseInt(h.slice(3,5),16),bv=parseInt(h.slice(5,7),16)
const li=(f:number)=>`#${Math.round(rv+(255-rv)*(1-f)).toString(16).padStart(2,'0')}${Math.round(gv+(255-gv)*(1-f)).toString(16).padStart(2,'0')}${Math.round(bv+(255-bv)*(1-f)).toString(16).padStart(2,'0')}`
const da=(f:number)=>`#${Math.round(rv*f).toString(16).padStart(2,'0')}${Math.round(gv*f).toString(16).padStart(2,'0')}${Math.round(bv*f).toString(16).padStart(2,'0')}`
r.style.setProperty('--brand-50',li(.1));r.style.setProperty('--brand-100',li(.2));r.style.setProperty('--brand-200',li(.4));r.style.setProperty('--brand-300',li(.6));r.style.setProperty('--brand-400',li(.8));r.style.setProperty('--brand-500',h);r.style.setProperty('--brand-600',h);r.style.setProperty('--brand-700',da(.85));r.style.setProperty('--brand-800',da(.65));r.style.setProperty('--brand-900',da(.45));r.style.setProperty('--brand-950',da(.28))},[s.bc])

const hSub=async(e:FormEvent)=>{e.preventDefault();setSub(true);try{const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fm)});if(!res.ok){const d=await res.json();throw new Error(d.error||'Error')};toast.success('Message Sent!',{description:"We'll get back to you within 24 hours."});setFm({name:'',email:'',phone:'',message:''})}catch(er:unknown){toast.error('Error',{description:er instanceof Error?er.message:'Something went wrong'})}finally{setSub(false)}}
const ep=(u:string)=>!u?u:u.startsWith('http')?u:'https://'+u
const cats=['All',...Array.from(new Set(pf.map(p=>p.c)))]
const fP=pF==='All'?pf:pf.filter(p=>p.c===pF)
const tc='glass-card neon-border border-border'
const tb='bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30'
const th=''
const ts='bg-dark-surface'
const tm=tms[tI]

return(<div className="min-h-screen flex flex-col bg-background">

{/* Comprehensive Structured Data (JSON-LD) for SEO */}
<StructuredData/>

{/* Header */}
<header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${sc?'bg-dark-surface/90 backdrop-blur-xl border-b border-border shadow-lg':'bg-transparent'}`}>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 sm:h-20">
<a href="#home" className="flex items-center gap-2"><img src="/logo.png" alt="A-Star Infotech logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-contain"/><div className="flex flex-col"><span className={`font-bold text-base sm:text-lg text-foreground ${th}`}>A-Star</span><span className="text-[10px] sm:text-xs font-medium tracking-wider uppercase text-neon">Infotech</span></div></a>
<nav className="hidden md:flex items-center gap-1">{NAV.map(n=><a key={n.h} href={n.h} className="px-3 lg:px-4 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-neon/10 transition-colors">{n.l}</a>)}<a href="#contact"><Button size="sm" className={`ml-2 glow-button ${tb}`}>Get a Quote</Button></a>{mnt&&<button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="p-2 rounded-lg hover:bg-neon/10 ml-1" aria-label="Toggle theme">{theme==='dark'?<Sun className="w-5 h-5 text-foreground"/>:<Moon className="w-5 h-5 text-foreground"/>}</button>}</nav>
<button onClick={()=>sMO(!mO)} className="md:hidden p-2.5 -mr-2 rounded-md text-foreground hover:bg-neon/10 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Menu">{mO?<X className="w-6 h-6"/>:<Menu className="w-6 h-6"/>}</button>
</div></div>
<div className={`fixed inset-0 z-[60] md:hidden bg-background flex flex-col transition-all duration-300 ${mO?'opacity-100 translate-x-0 pointer-events-auto':'opacity-0 translate-x-full pointer-events-none'}`}>
<div className="flex items-center justify-between px-4 h-16 border-b border-border"><a href="#home" onClick={()=>sMO(false)} className="flex items-center gap-2"><img src="/logo.png" alt="A-Star Infotech logo" className="w-9 h-9 rounded-lg object-contain"/><span className="font-bold text-foreground">A-Star</span></a><button onClick={()=>sMO(false)} className="w-11 h-11 flex items-center justify-center rounded-lg text-foreground" aria-label="Close"><X className="w-6 h-6"/></button></div>
<nav className="flex-1 flex flex-col justify-center px-6"><div className="space-y-2">{NAV.map(n=><a key={n.h} href={n.h} onClick={()=>sMO(false)} className="block px-5 py-3 rounded-lg text-foreground text-lg font-medium hover:bg-neon/10 hover:text-neon transition-colors min-h-[44px]">{n.l}</a>)}</div><div className="mt-8"><a href="#contact" onClick={()=>sMO(false)}><Button className={`w-full glow-button ${tb} h-12 text-base`}>Get a Quote</Button></a>{mnt&&<button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="flex items-center justify-center gap-2 p-3 mt-4 rounded-lg hover:bg-neon/10 text-foreground border border-border w-full">{theme==='dark'?<><Sun className="w-5 h-5"/><span className="text-sm">Light</span></>:<><Moon className="w-5 h-5"/><span className="text-sm">Dark</span></>}</button>}</div></nav>
</div></header>

{/* Hero */}
<section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-background">
<div className="absolute inset-0"><img src="/coding-bg.png" alt="Coding workspace background" aria-hidden="true" className="w-full h-full object-cover hero-bg-image"/><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40"/><div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70"/></div>
<div className="absolute inset-0 hero-grid opacity-30"/>
<div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-neon/5 rounded-full blur-3xl"/><div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"/>
<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40"><div className="max-w-3xl animate-fade-in-up">
{s.hb&&s.hb.trim()&&<Badge className="mb-4 sm:mb-6 bg-neon/10 text-neon border-neon/20 px-3 py-1 text-xs sm:text-sm"><Sparkles className="w-3.5 h-3.5 mr-1.5"/>{s.hb}</Badge>}
<h1 className={`text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight ${th}`}><span className="gradient-text animate-gradient-text">{s.hh}</span></h1>
<p className="mt-5 text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed">{s.hs}</p>
<div className="mt-8 flex flex-col sm:flex-row gap-3">
<a href="#contact" className="block"><Button size="lg" className="glow-button bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 h-12 sm:h-14 shadow-lg w-full sm:w-auto rounded-xl">Start Your Project<ArrowRight className="ml-2 w-4 h-4"/></Button></a>
<a href="#portfolio" className="block"><Button size="lg" className="glass-cta text-foreground font-semibold px-6 h-12 sm:h-14 w-full sm:w-auto rounded-xl">View Our Work<ArrowRight className="ml-2 w-4 h-4"/></Button></a>
</div>
<div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">{sts.map(st=><div key={st.l} className="text-center sm:text-left"><div className="text-2xl sm:text-4xl font-bold text-neon counter-glow">{st.v}</div><div className="text-xs text-muted-foreground mt-1">{st.l}</div></div>)}</div>
</div></div>

</section>

<div className="section-divider"/>

{/* About */}
<section id="about" className="py-16 md:py-28 bg-background grid-bg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up"><div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
<div className="space-y-4">
<div className="rounded-2xl overflow-hidden border border-neon/20 shadow-xl shadow-neon/5"><img src="/about-image.png" alt="A-Star Infotech team - Web development professionals in Jaipur, Rajasthan" className="w-full h-auto object-cover"/></div>
</div>
<div><Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">About Us</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground leading-tight section-title-underline ${th}`}>{s.ah}</h2><p className="mt-6 sm:mt-8 text-muted-foreground text-sm md:text-lg leading-relaxed">{s.a1}</p><p className="mt-3 sm:mt-4 text-muted-foreground text-sm md:text-lg leading-relaxed">{s.a2}</p><div className="mt-6 sm:mt-8 flex flex-wrap gap-2">{s.al.split(',').map((v:string)=>v.trim()).filter(Boolean).map((v:string)=><span key={v} className="tech-pill">{v}</span>)}</div><div className="mt-6 sm:mt-8"><a href="#contact"><Button className={`glow-button ${tb} rounded-xl`}>Get In Touch<ArrowRight className="ml-2 w-4 h-4"/></Button></a></div></div>
</div></div></section>

<div className="section-divider"/>

{/* Services */}
<section id="services" className="py-16 md:py-28 relative overflow-hidden bg-dark-surface">
{/* Background video — plays muted, looped, behind content */}
<video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none">
<source src="/services-bg.mp4" type="video/mp4"/>
</video>
{/* Subtle gradient overlay — top & bottom only, leaves video visible in middle */}
<div className="absolute inset-0 bg-gradient-to-b from-dark-surface via-dark-surface/20 to-dark-surface"/>
<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className="text-center max-w-2xl mx-auto"><Badge variant="secondary" className="mb-4 bg-neon/20 text-neon border-neon/30 backdrop-blur-sm">Our Services</Badge><h2 className="text-2xl sm:text-4xl font-bold text-white section-title-underline inline-block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Everything You Need to <span className="gradient-text">Succeed Online</span></h2><p className="mt-6 sm:mt-8 text-white/90 text-sm md:text-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">From concept to launch, we provide comprehensive web solutions tailored to your business.</p></div>
<div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{svs.map((svc,idx)=>{const Ic=IM[svc.i]||Globe;return<Card key={svc.t} className="group h-full service-card-blend card-hover-lift relative overflow-hidden"><span className="service-number">{String(idx+1).padStart(2,'0')}</span><CardContent className="p-4 md:p-8 relative z-10"><div className={`icon-ring w-12 h-12 rounded-full ${svc.bg} backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-neon/30`}><Ic className={`w-5 h-5 ${svc.c} drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}/></div><h3 className="text-lg font-semibold text-white mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{svc.t}</h3><p className="text-sm text-white/85 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{svc.d}</p><button onClick={()=>setSDlg({open:true,svc})} className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-neon hover:text-white hover:bg-neon/20 px-3 py-1.5 rounded-lg transition-colors min-h-[44px] group/l backdrop-blur-sm border border-neon/30">Learn More<ArrowRight className="w-4 h-4 transition-transform group-hover/l:translate-x-1"/></button></CardContent></Card>})}
</div></div></section>

<div className="section-divider"/>

{/* Industries We Serve - Updated for India-wide reach */}
<section className="py-16 md:py-28 bg-background"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className="text-center max-w-2xl mx-auto"><Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Industries We Serve</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground section-title-underline inline-block ${th}`}>We Build Websites for <span className="gradient-text">Every India's Business</span></h2><p className="mt-6 sm:mt-8 text-muted-foreground text-sm md:text-lg">From clinics to coaching centres, real estate to restaurants — we create tailored websites for every industry.</p></div>
<div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
{inds.map(ind=>{const Ic=IM[ind.i]||Globe;return<div key={ind.t} className={`group ${tc} rounded-xl p-4 sm:p-5 md:p-6 text-center card-hover-lift border border-border hover:border-neon/30 transition-all cursor-pointer`}><div className={`icon-ring w-12 h-12 sm:w-14 sm:h-14 rounded-full ${ind.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border border-neon/20`}><Ic className={`w-5 h-5 sm:w-6 sm:h-6 ${ind.c}`}/></div><h3 className={`text-xs sm:text-sm font-semibold text-foreground ${th}`}>{ind.t}</h3></div>})}
</div>
<div className="mt-10 sm:mt-12 text-center"><a href="#contact"><Button size="lg" className="bg-neon text-white font-semibold hover:bg-neon/90 min-h-[44px] rounded-xl px-8 py-4 text-base shadow-[0_0_30px_rgba(6,214,160,0.4),0_0_60px_rgba(6,214,160,0.2)] hover:shadow-[0_0_40px_rgba(6,214,160,0.5),0_0_80px_rgba(6,214,160,0.25)] transition-shadow">Get a Free Quote for My Industry<ArrowRight className="ml-2 w-4 h-4"/></Button></a></div>
</div></section>

<div className="section-divider"/>

{/* Why Choose Us */}
<section className="py-16 md:py-28 bg-background hex-pattern"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up"><div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
<div><Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">Why Choose Us</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground leading-tight section-title-underline ${th}`}>What Makes Us <span className="gradient-text">Stand Out</span></h2><p className="mt-6 sm:mt-8 text-muted-foreground text-sm md:text-lg leading-relaxed">{s.wi}</p><div className="mt-6 sm:mt-8 grid sm:grid-cols-2 gap-4">{WU.map(it=><div key={it.t} className="flex gap-3 group"><div className="icon-ring w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-neon/20 to-neon/5 border border-neon/20 flex items-center justify-center group-hover:scale-110 transition-transform"><it.i className="w-5 h-5 text-neon"/></div><div><h3 className={`font-semibold text-foreground text-sm ${th}`}>{it.t}</h3><p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{it.d}</p></div></div>)}</div></div>
<div className={`${tc} rounded-2xl p-6 md:p-10 border-neon/20`}><div className="space-y-4">{[{l:'Client Satisfaction',v:99},{l:'On-Time Delivery',v:97},{l:'Code Quality',v:95},{l:'Support Response',v:98}].map(it=><div key={it.l}><div className="flex justify-between text-xs sm:text-sm mb-1"><span className="font-medium text-foreground">{it.l}</span><span className="text-neon font-semibold">{it.v}%</span></div><div className="h-2 bg-dark-card rounded-full overflow-hidden border border-border"><div className="h-full bg-gradient-to-r from-neon to-cyan-400 rounded-full" style={{width:`${it.v}%`}}/></div></div>)}</div><div className="flex items-center gap-3 mt-5"><Users className="w-6 h-6 text-amber-400"/><div className="text-sm text-muted-foreground">Trusted by <span className="text-foreground font-semibold">120+ businesses</span></div></div></div>
</div></div></section>

<div className="section-divider"/>

{/* Portfolio */}
<section id="portfolio" className={`py-16 md:py-28 ${ts}`}><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className="text-center max-w-2xl mx-auto"><Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Our Portfolio</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground section-title-underline inline-block ${th}`}>Projects That <span className="gradient-text">Speak for Themselves</span></h2></div>
<div className="flex flex-wrap justify-center gap-2 mt-8 sm:mt-10">{cats.map(c=><button key={c} onClick={()=>sPF(c)} className={`filter-tab ${pF===c?'active':''}`}>{c}</button>)}</div>
<div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
{fP.map(p=><Card key={p.t} className={`group overflow-hidden ${tc} h-full card-hover-lift`}><div className="h-36 sm:h-48 relative overflow-hidden"><img src={p.i} alt={p.t} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/><div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent group-hover:via-background/20 transition-all duration-500"/><div className="absolute top-3 left-3"><span className="category-pill">{p.c}</span></div><h3 className={`absolute bottom-3 left-4 text-base sm:text-xl font-bold text-foreground z-10 ${th}`}>{p.t}</h3></div><CardContent className="p-4 sm:p-6"><p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{p.d}</p><div className="mt-3 flex flex-wrap gap-1.5">{p.x.split(',').map((t:string)=><span key={t.trim()} className="tech-pill">{t.trim()}</span>)}</div></CardContent></Card>)}
</div><div className="mt-10 sm:mt-12 text-center"><a href="#contact"><Button size="lg" variant="outline" className="border-neon/30 text-neon hover:bg-neon/10 min-h-[44px] rounded-xl">Discuss Your Project<ArrowRight className="ml-2 w-4 h-4"/></Button></a></div>
</div></section>

<div className="section-divider"/>

{/* Testimonials */}
<section id="testimonials" className="py-16 md:py-28 bg-background"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className="text-center max-w-2xl mx-auto"><Badge variant="secondary" className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">Testimonials</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground section-title-underline inline-block ${th}`}>What Our Clients <span className="gradient-text">Say About Us</span></h2></div>
{tm&&<div className="mt-10 sm:mt-14 relative max-w-3xl mx-auto"><div className={`relative ${tc} rounded-2xl p-6 md:p-12 overflow-hidden min-h-[280px] flex flex-col justify-center`}><div className="quote-mark">&ldquo;</div><div className="relative z-10"><div className="flex gap-1 mb-4">{Array.from({length:5}).map((_,i)=><Star key={i} className={`w-5 h-5 ${i<tm.rt?'fill-amber-400 text-amber-400':'text-muted-foreground/30'}`}/>)}</div><p className="text-muted-foreground leading-relaxed text-sm md:text-lg italic mb-6">&ldquo;{tm.r}&rdquo;</p><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-gradient-to-br from-neon/20 to-neon/5 border-2 border-neon/30 flex items-center justify-center text-neon font-bold">{tm.n.split(' ').map(n=>n[0]).join('')}</div><div><div className={`font-semibold text-foreground text-sm ${th}`}>{tm.n}</div><div className="text-xs text-muted-foreground">{tm.c}</div></div></div></div></div>
<div className="flex items-center justify-center gap-4 mt-6"><button onClick={()=>sTI((tI-1+tms.length)%tms.length)} className="w-10 h-10 rounded-full border border-border hover:border-neon/40 flex items-center justify-center text-muted-foreground hover:text-neon transition-colors" aria-label="Prev"><ChevronRight className="w-4 h-4 rotate-180"/></button><div className="flex items-center gap-2">{tms.map((_,i)=><button key={i} onClick={()=>sTI(i)} className={`testimonial-dot ${i===tI?'active':''}`} aria-label={`Testimonial ${i+1}`}/>)}</div><button onClick={()=>sTI((tI+1)%tms.length)} className="w-10 h-10 rounded-full border border-border hover:border-neon/40 flex items-center justify-center text-muted-foreground hover:text-neon transition-colors" aria-label="Next"><ChevronRight className="w-4 h-4"/></button></div></div>}
</div></section>

{/* FAQ CTA — links to dedicated /faq page */}
<section className="py-16 md:py-24 bg-dark-surface"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className={`${tc} rounded-2xl p-8 md:p-12 text-center border border-neon/20`}>
<Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">FAQ</Badge>
<h2 className={`text-2xl sm:text-4xl font-bold text-foreground mb-4 ${th}`}>Frequently Asked <span className="gradient-text">Questions</span></h2>
<p className="mt-3 text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">Get answers to common questions about our web development services, pricing, timelines, and more.</p>
<a href="/faq"><Button size="lg" className={`mt-6 glow-button ${tb} rounded-xl px-6 h-12 min-h-[44px]`}>View All FAQs<ArrowRight className="ml-2 w-4 h-4"/></Button></a>
</div>
</div></section>

{/* CTA */}
<section className="py-12 md:py-20 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-r from-neon via-brand-600 to-neon"/>
<div className="absolute inset-0 opacity-30"><img src="/cta-animation.png" alt="" aria-hidden="true" className="w-full h-full object-cover"/></div>
<div className="absolute inset-0 hero-grid opacity-50"/>
<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 className={`text-2xl sm:text-4xl font-bold text-white ${th}`}>Ready to Take Your Business Online?</h2><p className="mt-3 text-white/80 text-sm md:text-lg max-w-2xl mx-auto">Let&apos;s build something amazing together. Get in touch today for a free consultation.</p><div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3"><a href="#contact"><Button size="lg" className="bg-white hover:bg-white/90 text-neon font-semibold px-6 h-12 sm:h-14 shadow-lg min-h-[44px] rounded-xl">Get Free Consultation<ArrowRight className="ml-2 w-4 h-4"/></Button></a><a href="https://wa.me/918560074448" target="_blank" rel="noopener noreferrer"><Button size="lg" className="border-white/30 text-white bg-white/10 hover:bg-white/20 px-6 h-12 sm:h-14 backdrop-blur-sm min-h-[44px] rounded-xl"><MessageCircle className="mr-2 w-4 h-4"/>WhatsApp</Button></a></div></div>
</section>

<div className="section-divider"/>

{/* Contact */}
<section id="contact" className="py-16 md:py-28 bg-background grid-bg"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
<div className="text-center max-w-2xl mx-auto"><Badge variant="secondary" className="mb-4 bg-neon/10 text-neon border-neon/20">Contact Us</Badge><h2 className={`text-2xl sm:text-4xl font-bold text-foreground section-title-underline inline-block ${th}`}>Let&apos;s Start <span className="gradient-text">Your Project</span></h2><p className="mt-6 sm:mt-8 text-muted-foreground text-sm md:text-lg">Have a project in mind? Fill out the form or reach us directly.</p></div>
<div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12">
<div className="lg:col-span-2 space-y-4">
<h3 className={`text-lg font-semibold text-foreground mb-2 ${th}`}>Get In Touch</h3>
{[{i:MapPin,l:'Address',v:s.ad,h:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.ad)}`},{i:Phone,l:'Phone',v:s.ph,h:`tel:${s.ph}`},{i:Mail,l:'Email',v:s.em,h:`mailto:${s.em}`},{i:Clock,l:'Hours',v:s.hr,h:''}].map((it,idx)=><a key={idx} href={it.h||undefined} target={it.h&&it.h.startsWith('http')?'_blank':undefined} rel={it.h&&it.h.startsWith('http')?'noopener noreferrer':undefined} className={`flex items-start gap-3 ${tc} rounded-xl p-3 group min-h-[44px] card-hover-lift`}><div className="w-10 h-10 shrink-0 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center group-hover:bg-neon/20 transition-colors"><it.i className="w-4 h-4 text-neon"/></div><div className="pt-1"><div className="font-medium text-foreground text-sm">{it.l}</div><div className="text-sm text-muted-foreground mt-0.5 group-hover:text-neon transition-colors break-words">{it.v}</div></div></a>)}

</div>
<div className="lg:col-span-3 lg:self-start"><Card className={`${tc} border-neon/20 shadow-lg shadow-neon/5`}><CardContent className="p-4 md:p-8">
<h3 className={`text-lg font-semibold text-foreground mb-4 ${th}`}>Send Us a Message</h3>
<form onSubmit={hSub} className="space-y-4">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</label><Input id="name" placeholder="John Doe" required value={fm.name} onChange={e=>setFm({...fm,name:e.target.value})} className="futuristic-input neon-focus"/></div><div className="space-y-2"><label htmlFor="email" className="text-sm font-medium text-foreground">Email *</label><Input id="email" type="email" placeholder="john@example.com" required value={fm.email} onChange={e=>setFm({...fm,email:e.target.value})} className="futuristic-input neon-focus"/></div></div>
<div className="space-y-2"><label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</label><Input id="phone" type="tel" placeholder="+91 0000000000" value={fm.phone} onChange={e=>setFm({...fm,phone:e.target.value})} className="futuristic-input neon-focus"/></div>
<div className="space-y-2"><label htmlFor="message" className="text-sm font-medium text-foreground">Message *</label><Textarea id="message" placeholder="Tell us about your project..." rows={4} required value={fm.message} onChange={e=>setFm({...fm,message:e.target.value})} className="futuristic-input neon-focus"/></div>
<Button type="submit" size="lg" disabled={sub} className={`w-full sm:w-auto glow-button ${tb} px-6 min-h-[44px] rounded-xl`}>{sub?<><span className="animate-spin mr-2">⏳</span>Sending...</>:<>Send Message<Send className="ml-2 w-4 h-4"/></>}</Button>
</form></CardContent></Card></div>
</div></div></section>

{/* Footer */}
<footer className="bg-dark-surface border-t border-border mt-auto"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="py-10 sm:py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
<div className="col-span-2 lg:col-span-1"><div className="flex items-center gap-2.5 mb-4"><img src="/logo.png" alt="A-Star Infotech logo" className="w-10 h-10 rounded-lg object-contain"/><div><div className={`font-bold text-foreground text-lg ${th}`}>A-Star</div><div className="text-xs text-neon font-medium tracking-wider uppercase">Infotech</div></div></div><p className="text-muted-foreground text-sm leading-relaxed max-w-xs">Building smart websites for growing businesses.</p><div className="mt-5 flex gap-2.5">{[{h:s.fb,ic:Facebook,l:'FB'},{h:s.ig,ic:Instagram,l:'IG'},{h:s.li,ic:Linkedin,l:'IN'},{h:s.yt,ic:Youtube,l:'YT'}].filter(x=>x.h).map(x=><a key={x.l} href={ep(x.h)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-card border border-border flex items-center justify-center social-glow" aria-label={x.l}><x.ic className="w-4 h-4 text-muted-foreground"/></a>)}</div></div>
<div><h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Quick Links</h4><ul className="space-y-2">{NAV.map(n=>{const QI:Record<string,React.ElementType>={'/#home':HomeIcon,'/#about':Users,'/#services':Globe,'/#portfolio':Award,'/#testimonials':Star,'/faq':HelpCircle,'/#contact':Mail};const Ic=QI[n.h]||ChevronRight;return<li key={n.h}><a href={n.h} className="text-sm text-muted-foreground hover:text-neon transition-colors min-h-[32px] flex items-center gap-2"><Ic className="w-4 h-4 shrink-0 text-neon/70"/>{n.l}</a></li>})}</ul></div>
<div><h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Our Services</h4><ul className="space-y-2">{svs.map(sv=>{const Ic=IM[sv.i]||Globe;return<li key={sv.t}><a href="#services" className="text-sm text-muted-foreground hover:text-neon transition-colors min-h-[32px] flex items-center gap-2"><Ic className={`w-4 h-4 shrink-0 ${sv.c}`}/>{sv.t}</a></li>})}</ul></div>
<div><h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Contact</h4><ul className="space-y-3"><li><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.ad)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-neon transition-colors flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-neon/70"/>{s.ad}</a></li><li><a href={`tel:${s.ph}`} className="text-sm text-muted-foreground hover:text-neon transition-colors flex items-center gap-2"><Phone className="w-4 h-4 shrink-0 text-neon/70"/>{s.ph}</a></li><li><a href={`mailto:${s.em}`} className="text-sm text-muted-foreground hover:text-neon transition-colors break-all flex items-center gap-2"><Mail className="w-4 h-4 shrink-0 text-neon/70"/>{s.em}</a></li></ul></div>
</div>
<div className="border-t border-border py-4 pb-20 sm:pb-6 flex flex-col sm:flex-row justify-between items-center gap-3"><p className="text-xs sm:text-sm text-muted-foreground/70">&copy; {new Date().getFullYear()} A-Star Infotech. All rights reserved.</p><div className="flex gap-4 text-xs text-muted-foreground/70"><button onClick={()=>window.openLegal?.('privacy')} className="hover:text-neon transition-colors">Privacy Policy</button><button onClick={()=>window.openLegal?.('terms')} className="hover:text-neon transition-colors">Terms of Service</button></div></div>
</div></footer>

<a href="https://wa.me/918560074448?text=Hello%20A-Star!" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 whatsapp-pulse" aria-label="Chat on WhatsApp"><div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7 text-white"/></div></a>
<LegalModal contactInfo={{address:s.ad,phone:s.ph,email:s.em}}/>
<Dialog open={sDlg.open} onOpenChange={o=>setSDlg(p=>({...p,open:o}))}>
<DialogContent className="sm:max-w-xl bg-dark-surface border-neon/20">
{sDlg.svc&&(()=>{const det=SD[sDlg.svc.t];const Ic=IM[sDlg.svc.i]||Globe;return<>
<DialogHeader>
<div className="flex items-center gap-3 mb-2">
<div className={`icon-ring w-12 h-12 rounded-full ${sDlg.svc.bg} flex items-center justify-center border border-neon/20 shrink-0`}><Ic className={`w-5 h-5 ${sDlg.svc.c}`}/></div>
<DialogTitle className="text-xl font-bold text-foreground">{sDlg.svc.t}</DialogTitle>
</div>
<DialogDescription className="text-muted-foreground text-sm leading-relaxed text-left">{det?.desc||sDlg.svc.d}</DialogDescription>
</DialogHeader>
{det&&<div className="space-y-4 mt-2">
<div><h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-neon"/>What We Offer</h4><ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">{det.features.map(f=><li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-neon shrink-0"/>{f}</li>)}</ul></div>
<div><h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Code2 className="w-4 h-4 text-neon"/>Technologies We Use</h4><div className="flex flex-wrap gap-1.5">{det.tech.map(t=><span key={t} className="tech-pill">{t}</span>)}</div></div>
</div>}
<DialogFooter className="mt-2"><a href="#contact" onClick={()=>setSDlg({open:false,svc:null})}><Button className={`glow-button ${tb} rounded-xl`}>Get a Quote<ArrowRight className="ml-2 w-4 h-4"/></Button></a></DialogFooter>
</>})()}
</DialogContent>
</Dialog>
<button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className={`fixed bottom-6 left-6 z-50 w-12 h-12 bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${sT?'opacity-100 scale-100':'opacity-0 scale-75 pointer-events-none'}`} aria-label="Scroll to top"><ChevronUp className="w-5 h-5"/></button>
</div>)}
