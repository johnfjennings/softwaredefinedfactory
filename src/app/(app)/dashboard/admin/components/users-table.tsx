"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserRoleSelect } from "./user-role-select"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"

type SortColumn = "email" | "full_name" | "role" | "created_at" | "last_accessed_at" | "is_disabled"
type SortDirection = "asc" | "desc"

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string | null
  created_at: string | null
  last_accessed_at: string | null
  is_disabled: boolean
  is_flagged: boolean
}

interface UsersTableProps {
  users: AdminUser[]
  currentUserId: string
}

function SortIcon({ column, sortCol, sortDir }: { column: SortColumn; sortCol: SortColumn; sortDir: SortDirection }) {
  if (sortCol !== column) return <ChevronsUpDown className="ml-1 h-3 w-3 inline opacity-40" />
  return sortDir === "asc"
    ? <ChevronUp className="ml-1 h-3 w-3 inline" />
    : <ChevronDown className="ml-1 h-3 w-3 inline" />
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const [sortCol, setSortCol] = useState<SortColumn>("created_at")
  const [sortDir, setSortDir] = useState<SortDirection>("desc")
  const [disabling, setDisabling] = useState<string | null>(null)
  const router = useRouter()

  function handleSort(col: SortColumn) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortCol(col)
      setSortDir("asc")
    }
  }

  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      let aVal: string | boolean | null
      let bVal: string | boolean | null

      switch (sortCol) {
        case "email": aVal = a.email; bVal = b.email; break
        case "full_name": aVal = a.full_name ?? ""; bVal = b.full_name ?? ""; break
        case "role": aVal = a.role ?? ""; bVal = b.role ?? ""; break
        case "created_at": aVal = a.created_at ?? ""; bVal = b.created_at ?? ""; break
        case "last_accessed_at": aVal = a.last_accessed_at ?? ""; bVal = b.last_accessed_at ?? ""; break
        case "is_disabled": aVal = a.is_disabled ? "1" : "0"; bVal = b.is_disabled ? "1" : "0"; break
        default: aVal = ""; bVal = ""
      }

      const cmp = String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [users, sortCol, sortDir])

  async function handleToggleDisable(userId: string, currentlyDisabled: boolean) {
    setDisabling(userId)
    try {
      await fetch(`/api/admin/users/${userId}/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_disabled: !currentlyDisabled }),
      })
      router.refresh()
    } finally {
      setDisabling(null)
    }
  }

  function SortHeader({ col, children }: { col: SortColumn; children: React.ReactNode }) {
    return (
      <TableHead
        className="cursor-pointer select-none hover:text-foreground"
        onClick={() => handleSort(col)}
      >
        {children}
        <SortIcon column={col} sortCol={sortCol} sortDir={sortDir} />
      </TableHead>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortHeader col="email">Email</SortHeader>
          <SortHeader col="full_name">Name</SortHeader>
          <SortHeader col="role">Role</SortHeader>
          <SortHeader col="created_at">Joined</SortHeader>
          <SortHeader col="last_accessed_at">Last Accessed</SortHeader>
          <SortHeader col="is_disabled">Status</SortHeader>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((u) => (
          <TableRow key={u.id} className={u.is_disabled ? "opacity-60" : undefined}>
            <TableCell className="font-medium">{u.email}</TableCell>
            <TableCell>{u.full_name ?? "—"}</TableCell>
            <TableCell>
              <UserRoleSelect
                userId={u.id}
                currentRole={u.role ?? "user"}
                currentUserId={currentUserId}
              />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {u.last_accessed_at
                ? new Date(u.last_accessed_at).toLocaleDateString()
                : "Never"}
            </TableCell>
            <TableCell>
              {u.is_disabled ? (
                <Badge variant="destructive">Disabled</Badge>
              ) : u.is_flagged ? (
                <Badge variant="secondary">Flagged</Badge>
              ) : (
                <Badge variant="outline">Active</Badge>
              )}
            </TableCell>
            <TableCell>
              {u.id !== currentUserId && (
                <Button
                  size="sm"
                  variant={u.is_disabled ? "outline" : "destructive"}
                  disabled={disabling === u.id}
                  onClick={() => handleToggleDisable(u.id, u.is_disabled)}
                >
                  {disabling === u.id ? "..." : u.is_disabled ? "Enable" : "Disable"}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
