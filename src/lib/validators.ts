// Type guards for widgets
import type { Widget } from '@/store/use-dashboard-store'

export function isCardWidget(widget: Widget): boolean {
    return widget.type === 'card'
}

export function isLineChartWidget(widget: Widget): boolean {
    return widget.type === 'line-chart'
}

export function isTableWidget(widget: Widget): boolean {
    return widget.type === 'table'
}

// Validation helpers
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export function isValidRefreshInterval(interval: number): boolean {
    return interval >= 1000 && interval <= 300000 // 1s to 5min
}
