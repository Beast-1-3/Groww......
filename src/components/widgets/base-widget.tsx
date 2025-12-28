"use client"

import { X, GripVertical, RefreshCw, Settings, Table as TableIcon, CreditCard, LineChart as ChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WidgetType, WidgetConfig } from "@/store/use-dashboard-store"
import { cn } from "@/lib/utils"

interface BaseWidgetProps {
    title: string
    type: WidgetType
    config?: WidgetConfig
    onRemove: () => void
    onRefresh?: () => void
    onSettings?: () => void
    children: React.ReactNode
}

export function BaseWidget({ title, type, config, onRemove, onRefresh, onSettings, children }: BaseWidgetProps) {
    const Icon = type === 'table' ? TableIcon : type === 'card' ? CreditCard : ChartIcon

    return (
        <div className="h-full w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden flex flex-col group transition-all hover:border-border/80">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/10 bg-muted/5">
                <div className="drag-handle flex items-center gap-3 cursor-move flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm tracking-tight text-foreground">{title}</h3>
                        {config?.refreshInterval && (
                            <span className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase">
                                {config.refreshInterval}s
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRefresh?.()
                        }}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onSettings?.()
                        }}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation()
                            onRemove()
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-visible relative">
                {children}
            </div>
        </div>
    )
}
