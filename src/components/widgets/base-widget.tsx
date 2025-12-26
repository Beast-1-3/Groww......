"use client"

import { X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BaseWidgetProps {
    title: string
    onRemove: () => void
    children: React.ReactNode
}

export function BaseWidget({ title, onRemove, children }: BaseWidgetProps) {
    return (
        <div className="h-full w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="drag-handle flex items-center gap-2 cursor-move flex-1">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm text-card-foreground">{title}</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onRemove()
                    }}
                    type="button"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    )
}
