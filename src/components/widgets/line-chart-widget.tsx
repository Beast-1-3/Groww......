"use client"

import { LineChartWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2, AlertCircle } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { Skeleton } from "@/components/ui/skeleton"

interface LineChartWidgetProps {
    content: LineChartWidgetContent
    config?: WidgetConfig
}

export function LineChartWidget({ content, config }: LineChartWidgetProps) {
    const { data: apiData, error, isLoading } = useApiData<LineChartWidgetContent>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        fieldMapping: config?.fieldMapping
    })

    // Use API data if available, otherwise fall back to static content
    const displayData = apiData || content
    const { data, xLabel, yLabel } = displayData

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <Skeleton className="h-full w-full rounded-lg" />
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

    if (!data || data.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">No chart data</p>
                    <p className="text-xs text-muted-foreground">Add data to see the chart</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                        opacity={0.3}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="x"
                        label={xLabel ? {
                            value: xLabel,
                            position: 'insideBottom',
                            offset: -10,
                            style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' }
                        } : undefined}
                        tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12
                        }}
                        stroke="hsl(var(--border))"
                        axisLine={{ strokeWidth: 1.5 }}
                    />
                    <YAxis
                        label={yLabel ? {
                            value: yLabel,
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' }
                        } : undefined}
                        tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12
                        }}
                        stroke="hsl(var(--border))"
                        axisLine={{ strokeWidth: 1.5 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        labelStyle={{
                            color: 'hsl(var(--foreground))',
                            fontWeight: 600,
                            marginBottom: '4px',
                            fontSize: '13px'
                        }}
                        itemStyle={{
                            color: 'hsl(var(--muted-foreground))',
                            fontSize: '12px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '10px',
                            fontSize: '12px'
                        }}
                        iconType="line"
                    />
                    <Line
                        type="monotone"
                        dataKey="y"
                        name={yLabel || 'Value'}
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{
                            fill: 'hsl(var(--primary))',
                            strokeWidth: 2,
                            r: 5,
                            stroke: 'hsl(var(--card))'
                        }}
                        activeDot={{
                            r: 7,
                            strokeWidth: 2,
                            fill: 'hsl(var(--primary))',
                            stroke: 'hsl(var(--card))'
                        }}
                        animationDuration={1000}
                        animationEasing="ease-in-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
