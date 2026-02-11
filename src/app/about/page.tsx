import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">
            About Software Defined Factory
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Software Defined Factory is your trusted resource for learning smart manufacturing,
              Industry 4.0, and Industrial IoT technologies.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              We empower manufacturers, engineers, and operations managers with the knowledge
              and tools needed to successfully implement digital transformation initiatives.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">What We Offer</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>Comprehensive courses on smart manufacturing technologies</li>
              <li>Practical tools and calculators for ROI analysis and planning</li>
              <li>Real-world case studies and implementation guides</li>
              <li>Expert insights on IIoT, automation, and digital transformation</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Get Started</h2>
            <p className="text-muted-foreground">
              Ready to transform your manufacturing operations? Browse our courses,
              try our free tools, or read our blog to start learning today.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
