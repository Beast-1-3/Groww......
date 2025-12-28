"use client"

import { CardWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { formatValue } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useEffect } from "react"

interface CardWidgetProps {
    content: CardWidgetContent
    config?: WidgetConfig
    onRefresh?: (refreshFn: () => void) => void
}

export function CardWidget({ content, config, onRefresh }: CardWidgetProps) {
    const { data: apiData, error, isLoading, mutate } = useApiData<CardWidgetContent>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        fieldMapping: config?.fieldMapping
    })

    useEffect(() => {
        onRefresh?.(() => mutate())
    }, [mutate, onRefresh])

    // Use API data if available, otherwise fall back to static content
    const displayData = apiData || content
    const value = displayData?.value ?? '0'
    const label = displayData?.label ?? 'No Label'
    const trend = displayData?.trend

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
        <div className="flex h-full flex-col justify-center px-6 py-4">
            {/* Data Label */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase opacity-70">
                    {label || 'Value'}
                </span>
            </div>

            {/* Main Value */}
            <div className="flex items-baseline gap-3">
                <div className="text-4xl font-black text-foreground tracking-tighter">
                    {formattedValue}
                </div>
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full",
                        trend >= 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                    )}>
                        {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            {/* Detail info */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </span>
            </div>
        </div>
    )
}
