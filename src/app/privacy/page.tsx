import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Software Defined Factory. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <article className="container mx-auto max-w-4xl px-4 py-24">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: 12 February 2026</p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Introduction</h2>
            <p>
              Software Defined Factory (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website{" "}
              <strong>softwaredefinedfactory.com</strong> (the &ldquo;Site&rdquo;). This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our Site, create an account,
              subscribe to our newsletter, use our tools, or purchase our courses.
            </p>
            <p>
              By using the Site, you agree to the collection and use of information in accordance with this policy.
              If you do not agree, please do not use the Site.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information You Provide</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li>
                <strong>Create an account:</strong> email address, password, and optionally your full name
              </li>
              <li>
                <strong>Subscribe to our newsletter:</strong> email address and optionally your name
              </li>
              <li>
                <strong>Use our tools:</strong> data you enter into calculators (e.g. the ROI Calculator), and
                optionally your email address if you choose to receive results by email
              </li>
              <li>
                <strong>Purchase a course:</strong> payment information is processed directly by Stripe and is
                not stored on our servers
              </li>
              <li>
                <strong>Contact us:</strong> any information you include in messages sent to us
              </li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you visit the Site, we may automatically collect:</p>
            <ul>
              <li>
                <strong>Usage data:</strong> pages visited, time spent on pages, referring URLs, and general
                navigation patterns via Vercel Analytics (privacy-friendly, no cookies, no personal data tracking)
              </li>
              <li>
                <strong>Device information:</strong> browser type, operating system, and screen resolution
                (aggregated, not personally identifiable)
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Site and our services</li>
              <li>Create and manage your user account</li>
              <li>Process course purchases and manage enrolments</li>
              <li>Send you newsletters and educational content (only if you subscribe)</li>
              <li>Respond to your enquiries and provide support</li>
              <li>Track your course progress and learning history</li>
              <li>Analyse Site usage to improve content and user experience</li>
              <li>Prevent fraud and ensure Site security</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services that may process your data:</p>

            <h3>Supabase (Authentication &amp; Database)</h3>
            <p>
              We use Supabase to manage user accounts and store application data. Supabase processes your email
              address and account information. Their privacy policy is available at{" "}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                supabase.com/privacy
              </a>.
            </p>

            <h3>Stripe (Payment Processing)</h3>
            <p>
              Course payments are processed by Stripe. We do not store your credit card details. Stripe&apos;s
              privacy policy is available at{" "}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                stripe.com/privacy
              </a>.
            </p>

            <h3>Vercel (Hosting &amp; Analytics)</h3>
            <p>
              Our Site is hosted on Vercel. We use Vercel Analytics, which is a privacy-friendly analytics
              solution that does not use cookies and does not collect personally identifiable information.
              Vercel&apos;s privacy policy is available at{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                vercel.com/legal/privacy-policy
              </a>.
            </p>

            <h3>Resend (Email)</h3>
            <p>
              We use Resend to send emails including newsletters, password resets, purchase confirmations, and
              account notifications. Resend&apos;s privacy policy is available at{" "}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                resend.com/legal/privacy-policy
              </a>.
            </p>

            <h3>YouTube (Video Content)</h3>
            <p>
              Course videos are hosted on YouTube. When you watch embedded videos, YouTube may collect data
              in accordance with Google&apos;s privacy policy at{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                policies.google.com/privacy
              </a>.
            </p>

            <h2>Cookies</h2>
            <p>
              We use minimal cookies that are essential for the Site to function:
            </p>
            <ul>
              <li>
                <strong>Authentication cookies:</strong> to keep you logged in to your account
              </li>
              <li>
                <strong>Theme preference:</strong> to remember your light/dark mode choice
              </li>
            </ul>
            <p>
              We do not use advertising cookies or third-party tracking cookies. Vercel Analytics does not
              use cookies.
            </p>

            <h2>Data Retention</h2>
            <ul>
              <li>
                <strong>Account data:</strong> retained for as long as your account is active. You may request
                deletion at any time.
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> retained until you unsubscribe. You can unsubscribe
                at any time using the link in any email.
              </li>
              <li>
                <strong>Course enrolment and progress data:</strong> retained for as long as your account is
                active to support your learning history.
              </li>
              <li>
                <strong>Payment records:</strong> retained as required by applicable tax and accounting laws.
              </li>
              <li>
                <strong>Analytics data:</strong> aggregated and anonymised, retained indefinitely.
              </li>
            </ul>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li><strong>Access</strong> the personal data we hold about you</li>
              <li><strong>Correct</strong> inaccurate or incomplete data</li>
              <li><strong>Delete</strong> your personal data and account</li>
              <li><strong>Export</strong> your data in a portable format</li>
              <li><strong>Withdraw consent</strong> for data processing (e.g. unsubscribe from emails)</li>
              <li><strong>Object</strong> to certain types of data processing</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at the email address below.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data,
              including:
            </p>
            <ul>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Row-level security policies on our database</li>
              <li>Secure authentication via Supabase Auth</li>
              <li>Regular security updates to our software dependencies</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. We
              cannot guarantee absolute security.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              The Site is not intended for children under 16 years of age. We do not knowingly collect
              personal information from children under 16. If we become aware that we have collected data
              from a child under 16, we will take steps to delete that information.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your data may be processed in countries other than your own, including the United States, where
              our hosting and service providers operate. By using the Site, you consent to the transfer of
              your information to these countries.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. We
              encourage you to review this page periodically.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your data rights, please
              contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@softwaredefinedfactory.com
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
