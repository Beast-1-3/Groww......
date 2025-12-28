"use client"

import { useDashboardStore } from "@/store/use-dashboard-store"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddWidgetModal } from "@/components/modals/add-widget-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { isAddModalOpen, setIsAddModalOpen } = useDashboardStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/50 backdrop-blur-xl">
      <div className="flex w-full h-16 items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground shadow-sm">
            <div className="h-4 w-4 rounded-sm bg-background" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">FinBoard</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="group h-10 items-center gap-2 rounded-xl bg-foreground px-5 font-bold text-background transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-black/5 dark:shadow-white/5"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            <span className="text-xs uppercase tracking-tighter">Add Widget</span>
          </Button>
        </div>
      </div>

      <AddWidgetModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </header>
  )
}
