"use client"

import { useDashboardStore } from "@/store/use-dashboard-store"
import { Plus, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddWidgetModal } from "@/components/modals/add-widget-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRef } from "react"
import { toast } from "sonner"


export function Header() {
  const { isAddModalOpen, setIsAddModalOpen, widgets, layout, importDashboard } = useDashboardStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = JSON.stringify({ widgets, layout }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const date = new Date().toISOString().split('T')[0]
    link.download = `FinBoard-Config-${date}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Downloaded Successfully', {
      description: 'Your dashboard configuration has been saved.'
    })
  }


  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)
        if (parsed.widgets && parsed.layout) {
          importDashboard(parsed.widgets, parsed.layout)
          toast.success('Dashboard configuration restored successfully!')
        } else {
          toast.error('Invalid dashboard backup file.')
        }
      } catch (err) {
        toast.error('Failed to read configuration file.')
      }

    }
    reader.readAsText(file)
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <div className="flex items-center gap-2 border-r border-border/10 pr-4 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="h-9 w-9 rounded-lg p-0 hover:bg-muted"
              title="Export Configuration"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 rounded-lg p-0 hover:bg-muted"
              title="Import Configuration"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
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
