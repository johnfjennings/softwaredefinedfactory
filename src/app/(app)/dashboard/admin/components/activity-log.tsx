"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertTriangle, Flag } from "lucide-react"

export interface ActivityLogEntry {
  id: string
  user_id: string | null
  session_id: string
  event_type: string
  page_path: string | null
  metadata: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface SuspiciousUser {
  user_id: string
  email: string
  is_flagged: boolean
  signals: string[]
  event_count: number
  last_seen: string
}

interface ActivityLogProps {
  recentEvents: ActivityLogEntry[]
  suspiciousUsers: SuspiciousUser[]
  profileMap: Record<string, string>
  totalEvents: number
}

const EVENT_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  page_view: "outline",
  auth_login: "secondary",
  auth_signup: "default",
  tool_use: "secondary",
  blog_view: "outline",
  course_enroll: "default",
  lesson_complete: "default",
}

function truncate(str: string | null, max = 40) {
  if (!str) return "—"
  return str.length > max ? str.slice(0, max) + "…" : str
}

export function ActivityLog({
  recentEvents,
  suspiciousUsers,
  profileMap,
  totalEvents,
}: ActivityLogProps) {
  const [flagging, setFlagging] = useState<string | null>(null)
  const [flagged, setFlagged] = useState<Set<string>>(
    new Set(suspiciousUsers.filter((u) => u.is_flagged).map((u) => u.user_id))
  )

  const handleFlag = async (userId: string, shouldFlag: boolean) => {
    setFlagging(userId)
    try {
      await fetch(`/api/admin/users/${userId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_flagged: shouldFlag }),
      })
      setFlagged((prev) => {
        const next = new Set(prev)
        if (shouldFlag) { next.add(userId) } else { next.delete(userId) }
        return next
      })
    } finally {
      setFlagging(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Bot Suspicion Panel */}
      {suspiciousUsers.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Suspicious Users ({suspiciousUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Signals</TableHead>
                  <TableHead className="text-right">Events</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {suspiciousUsers.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.signals.map((s) => (
                          <Badge key={s} variant="destructive" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{u.event_count}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(u.last_seen).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={flagged.has(u.user_id) ? "destructive" : "outline"}>
                        {flagged.has(u.user_id) ? "Flagged" : "Under review"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={flagging === u.user_id}
                        onClick={() => handleFlag(u.user_id, !flagged.has(u.user_id))}
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        {flagged.has(u.user_id) ? "Unflag" : "Flag"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity ({totalEvents.toLocaleString()} total events)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={EVENT_BADGE_VARIANTS[e.event_type] ?? "outline"}>
                        {e.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {e.user_id ? (profileMap[e.user_id] ?? e.user_id.slice(0, 8) + "…") : (
                        <span className="text-muted-foreground">anonymous</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {truncate(e.page_path)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {e.ip_address ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {truncate(e.user_agent, 50)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No activity recorded yet. Set NEXT_PUBLIC_ACTIVITY_TRACKING_ENABLED=true to start tracking.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
