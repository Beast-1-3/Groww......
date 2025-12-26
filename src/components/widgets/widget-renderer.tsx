"use client"

import { memo } from "react"
import { Widget } from "@/store/use-dashboard-store"
import { BaseWidget } from "./base-widget"
import { CardWidget } from "./card-widget"
import { TableWidget } from "./table-widget"
import { LineChartWidget } from "./line-chart-widget"

interface WidgetRendererProps {
    widget: Widget
    onRemove: () => void
}

function WidgetRendererComponent({ widget, onRemove }: WidgetRendererProps) {
    const renderContent = () => {
        switch (widget.type) {
            case 'card':
                return <CardWidget content={widget.content as any} config={widget.config} />
            case 'table':
                return <TableWidget content={widget.content as any} config={widget.config} />
            case 'lineChart':
                return <LineChartWidget content={widget.content as any} config={widget.config} />
            default:
                return (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Unknown widget type: {widget.type}
                    </div>
                )
        }
    }

    return (
        <BaseWidget title={widget.title} onRemove={onRemove}>
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
