"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddWidgetModal } from "@/components/modals/add-widget-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary" />
            <span className="font-bold">FinBoard</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" className="gap-1" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Widget</span>
            </Button>
          </div>
        </div>
      </header>

      <AddWidgetModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
