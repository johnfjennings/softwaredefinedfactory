"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Subscriber {
  email: string
  full_name: string | null
  status: string
  source: string | null
  subscribed_at: string
}

export function SubscriberExportButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const headers = ["Email", "Name", "Status", "Source", "Subscribed At"]
    const rows = subscribers.map((s) => [
      s.email,
      s.full_name ?? "",
      s.status,
      s.source ?? "",
      new Date(s.subscribed_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  )
}
