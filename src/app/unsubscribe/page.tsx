"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsubscribe")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-md px-4 py-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Unsubscribe</h1>
            <p className="text-muted-foreground">
              Sorry to see you go. Enter your email below to unsubscribe from our newsletter.
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 text-center p-8 rounded-lg border border-border">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              <h2 className="text-xl font-semibold">You&apos;ve been unsubscribed</h2>
              <p className="text-muted-foreground">
                You won&apos;t receive any more emails from us. If you change your mind, you can
                always resubscribe from our homepage.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
                  <XCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Unsubscribe"
                )}
              </Button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
