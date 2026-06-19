'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollText, Shield, FileText, X } from 'lucide-react'

type LegalDoc = 'privacy' | 'terms' | null

export function LegalModal() {
  const [open, setOpen] = useState<LegalDoc>(null)

  // Expose a global function to open the modal
  useEffect(() => {
    window.openLegal = (doc: LegalDoc) => setOpen(doc)
    return () => { delete window.openLegal }
  }, [])

  return (
    <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border bg-dark-surface shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            {open === 'privacy' ? (
              <><Shield className="w-6 h-6 text-neon" /> Privacy Policy</>
            ) : (
              <><ScrollText className="w-6 h-6 text-neon" /> Terms of Service</>
            )}
            <button
              onClick={() => setOpen(null)}
              className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-6 legal-content max-h-[calc(85vh-100px)]">
          {open === 'privacy' ? <PrivacyContent /> : <TermsContent />}
        </div>

        <div className="px-6 py-4 border-t border-border bg-dark-surface shrink-0 flex justify-end">
          <Button onClick={() => setOpen(null)} className="glow-button bg-neon/20 hover:bg-neon/30 text-neon border border-neon/30">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p className="text-foreground/80 italic">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <p>At A-Star Infotech (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong className="text-foreground">astarinfotech.in</strong> or use our services. Please read this Privacy Policy carefully.</p>

      <Section title="1. Information We Collect">
        <p>We may collect information about you in a variety of ways. The types of information we collect include:</p>
        <SubList items={[
          ['Personal Information', 'Information that you voluntarily provide to us when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, company name, and any message details you choose to share.'],
          ['Usage Data', 'Information our servers automatically collect when you visit our website, such as your IP address, browser type, device type, operating system, pages visited, time spent on pages, and the date and time of your visit.'],
          ['Cookies and Tracking Technologies', 'We may use cookies and similar tracking technologies to track the activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.'],
        ]} />
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect in the following ways:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To respond to your inquiries, provide quotes, and deliver the services you request.</li>
          <li>To communicate with you about our services, updates, and promotional offers (you can opt out at any time).</li>
          <li>To improve our website, services, and user experience based on your feedback and usage patterns.</li>
          <li>To monitor and analyze trends, usage, and activities in connection with our website.</li>
          <li>To detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
          <li>To comply with legal obligations and protect our rights and property.</li>
        </ul>
      </Section>

      <Section title="3. Disclosure of Your Information">
        <p>We may share information we have collected about you in certain situations:</p>
        <SubList items={[
          ['By Law or to Protect Rights', 'If we believe the release of information about you is legally required, such as to comply with a subpoena, judicial proceeding, or legal process.'],
          ['Service Providers', 'We may share your information with third-party service providers who perform services on our behalf, such as hosting providers, analytics providers, and email delivery services. These providers are contractually obligated to protect your information.'],
          ['Business Transfers', 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.'],
        ]} />
      </Section>

      <Section title="4. Tracking Technologies">
        <p>We use cookies, web beacons, tracking pixels, and other tracking technologies on our website to help customize the website and improve your experience. When you access the site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the website.</p>
      </Section>

      <Section title="5. Third-Party Websites">
        <p>The website may contain links to third-party websites and applications of interest, including advertisements and external services. Once you have used these links to leave the website, any further information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.</p>
      </Section>

      <Section title="6. Security of Your Information">
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
      </Section>

      <Section title="7. Data Retention">
        <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required by law or regulation. Contact form submissions are retained for up to 2 years for business and legal purposes.</p>
      </Section>

      <Section title="8. Your Information Rights">
        <p>You have certain rights regarding your personal information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-foreground">Right to Access:</strong> You may request access to the personal information we hold about you.</li>
          <li><strong className="text-foreground">Right to Rectification:</strong> You may request that we correct any inaccurate or incomplete personal information.</li>
          <li><strong className="text-foreground">Right to Erasure:</strong> You may request that we delete your personal information, subject to certain legal exceptions.</li>
          <li><strong className="text-foreground">Right to Opt-Out:</strong> You may opt-out of receiving promotional communications from us at any time.</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <a href="mailto:contact@astarinfotech.in" className="text-neon hover:underline">contact@astarinfotech.in</a>.</p>
      </Section>

      <Section title="9. Children&rsquo;s Privacy">
        <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.</p>
      </Section>

      <Section title="10. Changes to This Privacy Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date. You are advised to review this Privacy Policy periodically for any changes.</p>
      </Section>

      <Section title="11. Contact Us">
        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
        <div className="bg-dark-card border border-border rounded-lg p-4 mt-3 space-y-1">
          <p className="text-foreground font-semibold">A-Star Infotech</p>
          <p>Email: <a href="mailto:contact@astarinfotech.in" className="text-neon hover:underline">contact@astarinfotech.in</a></p>
          <p>Phone: <a href="tel:+918560074448" className="text-neon hover:underline">+91 8560074448</a></p>
          <p>Address: A-313, Street No. 9, Vishwas Park, Uttam Nagar, New Delhi - 110059</p>
        </div>
      </Section>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
      <p className="text-foreground/80 italic">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <p>Welcome to A-Star Infotech. These Terms of Service (&ldquo;Terms&rdquo;, &ldquo;Terms of Service&rdquo;) govern your use of our website <strong className="text-foreground">astarinfotech.in</strong> and the services we provide. By accessing or using our website and services, you agree to be bound by these Terms. If you disagree with any part of the Terms, please do not use our website or services.</p>

      <Section title="1. Services We Provide">
        <p>A-Star Infotech provides web design, web development, e-commerce solutions, responsive website development, website maintenance, and search engine optimization (SEO) services. The specific scope of services for each project will be outlined in a separate proposal, agreement, or invoice agreed upon between you and A-Star Infotech.</p>
      </Section>

      <Section title="2. Acceptance of Terms">
        <p>By accessing and using our website and services, you:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Confirm that you are at least 18 years of age or are accessing the website under parental supervision.</li>
          <li>Warrant that the information you provide to us is accurate, complete, and current at all times.</li>
          <li>Agree to comply with these Terms and all applicable laws and regulations.</li>
        </ul>
      </Section>

      <Section title="3. Intellectual Property Rights">
        <p>Unless otherwise stated, A-Star Infotech and/or its licensors own the intellectual property rights for all material on this website, including design, text, graphics, logos, and code. All intellectual property rights are reserved. You may access this content for your own personal use subject to restrictions set in these Terms.</p>
        <p className="mt-2">Upon full payment of all invoices, ownership of the final deliverable (website, application, or design) will transfer to the client, excluding third-party licensed components, frameworks, and libraries which remain under their respective licenses.</p>
      </Section>

      <Section title="4. Client Responsibilities">
        <p>To enable us to provide our services effectively, the client agrees to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide accurate and timely information, content, and materials required for the project.</li>
          <li>Respond to communications and approve deliverables within a reasonable timeframe.</li>
          <li>Ensure that all content and materials provided do not infringe upon the rights of any third party.</li>
          <li>Obtain all necessary licenses, permits, and consents for materials provided to us.</li>
          <li>Make timely payments as per the agreed payment schedule.</li>
        </ul>
      </Section>

      <Section title="5. Payment Terms">
        <SubList items={[
          ['Project Quotes', 'All project quotes are valid for 30 days from the date of issue. A minimum advance payment of 50% is required to commence work, unless otherwise agreed in writing.'],
          ['Final Payment', 'The remaining balance is due upon project completion and before final deployment or handover of source files.'],
          ['Late Payments', 'Invoices not paid within 15 days of the due date may incur a late fee of 1.5% per month. Work may be paused on projects with overdue invoices.'],
          ['Refunds', 'Advance payments are non-refundable once work has commenced. Refunds for completed work are assessed on a case-by-case basis.'],
        ]} />
      </Section>

      <Section title="6. Project Timeline and Delivery">
        <p>Project timelines are estimates based on the scope of work and client responsiveness. Delays caused by the client, including but not limited to delayed feedback, content provision, or approval, may result in adjusted delivery timelines. We are not liable for delays caused by circumstances beyond our reasonable control.</p>
      </Section>

      <Section title="7. Revisions and Modifications">
        <p>Each project includes a specified number of revision rounds as outlined in the project proposal. Additional revisions beyond the agreed scope will be billed at our standard hourly rate. Major changes to the project scope after work has commenced may result in additional charges and adjusted timelines.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the fullest extent permitted by applicable law, in no event shall A-Star Infotech, its directors, employees, partners, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of our website or services.</p>
        <p className="mt-2">Our total liability for any claim arising out of or relating to these Terms or our services shall not exceed the amount you have paid us for the specific service giving rise to the claim.</p>
      </Section>

      <Section title="9. Disclaimer of Warranties">
        <p>Our website and services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
        <p className="mt-2">We do not warrant that our website will be uninterrupted, secure, or error-free, that defects will be corrected, or that the website or the server that makes it available are free of viruses or other harmful components.</p>
      </Section>

      <Section title="10. Third-Party Links and Services">
        <p>Our website may contain links to third-party websites or integrate with third-party services that are not owned or controlled by A-Star Infotech. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. We expressly disclaim any liability for the actions or omissions of third parties.</p>
      </Section>

      <Section title="11. Confidentiality">
        <p>Both parties agree to keep confidential any proprietary or sensitive information shared during the course of a project. This includes business strategies, customer data, technical specifications, and project details. This obligation survives the termination of any project agreement.</p>
      </Section>

      <Section title="12. Termination">
        <p>We may terminate or suspend access to our services immediately, without prior notice or liability, for any reason, including if you breach these Terms. All provisions of these Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
      </Section>

      <Section title="13. Governing Law">
        <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.</p>
      </Section>

      <Section title="14. Changes to These Terms">
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&rsquo; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our services after revisions become effective, you agree to be bound by the revised Terms.</p>
      </Section>

      <Section title="15. Contact Information">
        <p>If you have any questions about these Terms of Service, please contact us at:</p>
        <div className="bg-dark-card border border-border rounded-lg p-4 mt-3 space-y-1">
          <p className="text-foreground font-semibold">A-Star Infotech</p>
          <p>Email: <a href="mailto:contact@astarinfotech.in" className="text-neon hover:underline">contact@astarinfotech.in</a></p>
          <p>Phone: <a href="tel:+918560074448" className="text-neon hover:underline">+91 8560074448</a></p>
          <p>Address: A-313, Street No. 9, Vishwas Park, Uttam Nagar, New Delhi - 110059</p>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-foreground flex items-start gap-2">
        <FileText className="w-4 h-4 text-neon/60 mt-0.5 shrink-0" />
        {title}
      </h3>
      <div className="pl-6">{children}</div>
    </div>
  )
}

function SubList({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-3 mt-2">
      {items.map(([title, desc]) => (
        <li key={title} className="pl-4 border-l-2 border-neon/20">
          <p className="text-foreground font-medium">{title}</p>
          <p className="text-muted-foreground">{desc}</p>
        </li>
      ))}
    </ul>
  )
}
