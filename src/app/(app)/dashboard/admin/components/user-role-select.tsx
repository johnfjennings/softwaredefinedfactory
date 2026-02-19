"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface UserRoleSelectProps {
  userId: string
  currentRole: string
  currentUserId: string
}

export function UserRoleSelect({ userId, currentRole, currentUserId }: UserRoleSelectProps) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const isCurrentUser = userId === currentUserId

  async function handleChange(newRole: string) {
    if (newRole === role) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setRole(newRole)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving || isCurrentUser}
      className="text-sm border rounded px-2 py-1 bg-background disabled:opacity-50"
    >
      <option value="user">user</option>
      <option value="instructor">instructor</option>
      <option value="admin">admin</option>
    </select>
  )
}
