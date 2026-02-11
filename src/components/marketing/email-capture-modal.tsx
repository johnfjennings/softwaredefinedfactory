"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Loader2, CheckCircle2 } from "lucide-react"

interface EmailCaptureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  source?: string
  onSuccess?: (email: string) => void
}

export function EmailCaptureModal({
  open,
  onOpenChange,
  title = "Get Your Free ROI Report",
  description = "Enter your email to download your detailed ROI analysis PDF. We'll also send you tips for maximizing your automation ROI.",
  source = "roi-calculator",
  onSuccess,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          source,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setSuccess(true)

      // Call onSuccess callback after a brief delay to show success state
      setTimeout(() => {
        onSuccess?.(email)
        onOpenChange(false)

        // Reset form after modal closes
        setTimeout(() => {
          setEmail("")
          setFullName("")
          setSuccess(false)
        }, 300)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Success!</h3>
            <p className="text-sm text-muted-foreground">
              Your download will begin shortly. Check your email for tips and resources.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to receive emails from Software Defined Factory.
              Unsubscribe anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
