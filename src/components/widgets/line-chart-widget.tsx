"use client"

import { LineChartWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle, LineChart as LineChartIcon } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { Skeleton } from "@/components/ui/skeleton"

import { useEffect } from "react"

interface LineChartWidgetProps {
    content: LineChartWidgetContent
    config?: WidgetConfig
    onRefresh?: (refreshFn: () => void) => void
}

export function LineChartWidget({ content, config, onRefresh }: LineChartWidgetProps) {
    const { data: apiData, error, isLoading, mutate } = useApiData<any>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        fieldMapping: config?.fieldMapping
    })

    useEffect(() => {
        onRefresh?.(() => mutate())
    }, [mutate, onRefresh])

    const displayData = apiData || content
    const data = displayData?.data || []
    const xLabel = displayData?.xLabel
    const yLabel = displayData?.yLabel

    if (isLoading) {
        return (
            <div className="flex h-full w-full p-6">
                <Skeleton className="h-full w-full rounded-2xl" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-6 bg-destructive/5 rounded-2xl m-4 border border-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-sm font-bold text-destructive uppercase tracking-tighter">Sync Failed</p>
                <p className="text-[10px] text-muted-foreground/60">{error.message}</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-center">
                <div className="space-y-2">
                    <div className="h-10 w-10 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                        <LineChartIcon className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No Data Available</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full pt-4 pb-2 px-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.05} />
                    <XAxis
                        dataKey="x"
                        hide
                    />
                    <YAxis
                        hide
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border)/0.2)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backdropFilter: 'blur(8px)'
                        }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="y"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
