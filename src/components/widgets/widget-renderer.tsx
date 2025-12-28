"use client"

import { memo } from "react"
import { Widget } from "@/store/use-dashboard-store"
import { BaseWidget } from "./base-widget"
import { CardWidget } from "./card-widget"
import { TableWidget } from "./table-widget"
import { LineChartWidget } from "./line-chart-widget"

import { useDashboardStore } from "@/store/use-dashboard-store"
import { useState, useRef, useCallback } from "react"

interface WidgetRendererProps {
    widget: Widget
    onRemove: () => void
}

function WidgetRendererComponent({ widget, onRemove }: WidgetRendererProps) {
    const refreshRef = useRef<() => void>(() => { })
    const { setEditingWidgetId, setIsAddModalOpen } = useDashboardStore()

    const handleSettings = useCallback(() => {
        setEditingWidgetId(widget.id)
        setIsAddModalOpen(true)
    }, [widget.id, setEditingWidgetId, setIsAddModalOpen])

    const handleRefresh = useCallback(() => {
        refreshRef.current()
    }, [])

    const registerRefresh = useCallback((fn: () => void) => {
        refreshRef.current = fn
    }, [])

    const renderContent = () => {
        const props = {
            content: widget.content as any,
            config: widget.config,
            onRefresh: registerRefresh
        }

        switch (widget.type) {
            case 'card':
                return <CardWidget {...props} />
            case 'table':
                return <TableWidget {...props} />
            case 'lineChart':
                return <LineChartWidget {...props} />
            default:
                return (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Unknown widget type: {widget.type}
                    </div>
                )
        }
    }

    return (
        <BaseWidget
            title={widget.title}
            type={widget.type}
            config={widget.config}
            onRemove={onRemove}
            onRefresh={handleRefresh}
            onSettings={handleSettings}
        >
            {renderContent()}
        </BaseWidget>
    )
}

// Memoize to prevent unnecessary re-renders when other widgets update
export const WidgetRenderer = memo(WidgetRendererComponent, (prevProps, nextProps) => {
    // Only re-render if widget data or onRemove function changes
    return (
        prevProps.widget.id === nextProps.widget.id &&
        prevProps.widget.title === nextProps.widget.title &&
        prevProps.widget.type === nextProps.widget.type &&
        JSON.stringify(prevProps.widget.content) === JSON.stringify(nextProps.widget.content) &&
        JSON.stringify(prevProps.widget.config) === JSON.stringify(nextProps.widget.config)
    )
})

WidgetRenderer.displayName = 'WidgetRenderer'
