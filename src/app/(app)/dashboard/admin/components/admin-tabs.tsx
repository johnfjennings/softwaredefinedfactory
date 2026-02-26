"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface AdminTabsProps {
  overview: React.ReactNode
  users: React.ReactNode
  courses: React.ReactNode
  subscribers: React.ReactNode
  payments: React.ReactNode
  toolUsage: React.ReactNode
  contentReview: React.ReactNode
}

export function AdminTabs({ overview, users, courses, subscribers, payments, toolUsage, contentReview }: AdminTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="tools">Tool Usage</TabsTrigger>
        <TabsTrigger value="content-review">Content Review</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{overview}</TabsContent>
      <TabsContent value="users">{users}</TabsContent>
      <TabsContent value="courses">{courses}</TabsContent>
      <TabsContent value="subscribers">{subscribers}</TabsContent>
      <TabsContent value="payments">{payments}</TabsContent>
      <TabsContent value="tools">{toolUsage}</TabsContent>
      <TabsContent value="content-review">{contentReview}</TabsContent>
    </Tabs>
  )
}
