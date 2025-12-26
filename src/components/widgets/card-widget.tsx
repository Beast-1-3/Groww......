"use client"

import { CardWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { formatValue } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"

interface CardWidgetProps {
    content: CardWidgetContent
    config?: WidgetConfig
}

export function CardWidget({ content, config }: CardWidgetProps) {
    const { data: apiData, error, isLoading } = useApiData<CardWidgetContent>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        fieldMapping: config?.fieldMapping
    })

    // Use API data if available, otherwise fall back to static content
    const displayData = apiData || content
    const { value, label, trend } = displayData

    if (isLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-3 p-6">
                <Skeleton className="h-16 w-40 rounded-lg" />
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-3 p-6">
                <div className="rounded-full bg-destructive/10 p-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-destructive">Failed to load data</p>
                    <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
                </div>
            </div>
        )
    }

    // Format the value based on config or auto-detect
    const formattedValue = formatValue(value, 'auto', {
        decimals: 2
    })

    return (
        <div className="flex h-full flex-col items-center justify-center p-6 space-y-4">
            {/* Main Value */}
            <div className="text-center">
                <div className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {formattedValue}
                </div>
            </div>

            {/* Label */}
            <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </div>
            </div>

            {/* Trend Indicator */}
            {trend !== undefined && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${trend >= 0
                        ? 'bg-green-500/10 text-green-600 dark:text-green-500'
                        : 'bg-red-500/10 text-red-600 dark:text-red-500'
                    }`}>
                    {trend >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : (
                        <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-semibold">
                        {Math.abs(trend)}%
                    </span>
                </div>
            )}
        </div>
    )
}
