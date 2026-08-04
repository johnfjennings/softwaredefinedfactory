"use client"

import { useEffect, useId, useRef } from "react"
import Script from "next/script"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark" | "auto"
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  className?: string
}

export function TurnstileWidget({ onVerify, onExpire, className }: TurnstileWidgetProps) {
  const containerId = useId().replace(/[:]/g, "")
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) return

    const renderWidget = () => {
      if (!window.turnstile || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval)
          renderWidget()
        }
      }, 100)
      return () => clearInterval(interval)
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, containerId])

  if (!siteKey) return null

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      <div id={containerId} className={className} />
    </>
  )
}
