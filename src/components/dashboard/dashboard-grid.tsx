"use client"

import { useCallback, useMemo, useState, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import type { Layout } from "react-grid-layout"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { WidgetRenderer } from "@/components/widgets/widget-renderer"

const ResponsiveGridLayout = WidthProvider(Responsive)

export function DashboardGrid() {
    const { widgets, updateWidget, removeWidget } = useDashboardStore()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Memoize layout to prevent recalculation on every render
    const layout = useMemo(() => {
        return widgets.map((widget) => ({
            i: widget.id,
            x: widget.layout.x,
            y: widget.layout.y,
            w: widget.layout.w,
            h: widget.layout.h,
            minW: 2,
            minH: 2,
        }))
    }, [widgets])

    // Memoize layout change handler
    const onLayoutChange = useCallback((currentLayout: Layout[]) => {
        if (!mounted) return

        currentLayout.forEach((item) => {
            const widget = widgets.find((w) => w.id === item.i)
            if (widget) {
                if (
                    widget.layout.x !== item.x ||
                    widget.layout.y !== item.y ||
                    widget.layout.w !== item.w ||
                    widget.layout.h !== item.h
                ) {
                    updateWidget(widget.id, {
                        layout: {
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h,
                        },
                    })
                }
            }
        })
    }, [mounted, widgets, updateWidget])

    if (!mounted) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading dashboard...</div>
            </div>
        )
    }

    if (widgets.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-muted-foreground">No widgets yet</p>
                    <p className="text-sm text-muted-foreground">Click "Add Widget" to get started</p>
                </div>
            </div>
        )
    }

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            isDraggable
            isResizable
            compactType="vertical"
            preventCollision={false}
        >
            {widgets.map((widget) => (
                <div key={widget.id}>
                    <WidgetRenderer
                        widget={widget}
                        onRemove={() => removeWidget(widget.id)}
                    />
                </div>
            ))}
        </ResponsiveGridLayout>
    )
}
