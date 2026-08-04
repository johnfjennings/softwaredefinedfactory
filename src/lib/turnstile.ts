const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // If not configured, don't block the app — treat as disabled.
  if (!secret) return true

  if (!token) return false

  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteIp) body.append("remoteip", remoteIp)

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })

    const data = await res.json()
    return data.success === true
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return false
  }
}
