"use client"

import dynamic from "next/dynamic"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Header } from "@/components/layout/header"

// Lazy load the heavy dashboard grid component
const DashboardGrid = dynamic(
  () => import("@/components/dashboard/dashboard-grid").then(mod => ({ default: mod.DashboardGrid })),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }
)

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardShell>
        <DashboardGrid />
      </DashboardShell>
    </div>
  )
}
