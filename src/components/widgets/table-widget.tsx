"use client"

import { useState, useMemo, useEffect } from "react"
import { TableWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, getNestedValue } from "@/lib/utils"

interface TableWidgetProps {
    content: TableWidgetContent
    config?: WidgetConfig
    onRefresh?: (refreshFn: () => void) => void
}

export function TableWidget({ content, config, onRefresh }: TableWidgetProps) {
    const { data: apiData, error, isLoading, mutate } = useApiData<any>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        rootPath: config?.rootPath,
        fieldMapping: config?.fieldMapping
    })

    useEffect(() => {
        onRefresh?.(() => mutate())
    }, [mutate, onRefresh])

    // Use API data if available, otherwise fall back to static content
    const displayData = apiData || content
    let headers = displayData?.headers || []
    let rows = displayData?.rows || []

    // If we have API data and it's an array, and we have a field mapping
    if (apiData && Array.isArray(apiData)) {
        if (config?.fieldMapping && Object.keys(config.fieldMapping).length > 0) {
            const mappingKeys = Object.keys(config.fieldMapping).sort((a, b) => Number(a) - Number(b))
            headers = mappingKeys.map(key => config.fieldMapping![key].split('.').pop() || 'Field')
            rows = apiData.map(item => mappingKeys.map(key => getNestedValue(item, config.fieldMapping![key])))
        } else if (apiData.length > 0) {
            // Auto-discover headers from the first item
            const firstItem = apiData[0]
            if (firstItem && typeof firstItem === 'object') {
                const keys = Object.keys(firstItem).filter(k => typeof firstItem[k] !== 'object' || firstItem[k] === null).slice(0, 6)
                headers = keys.map(k => k.charAt(0).toUpperCase() + k.slice(1))
                rows = apiData.map(item => keys.map(k => item[k]))
            }
        }
    }

    // Pagination and search state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-destructive">Failed to load data</p>
                <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
        )
    }

    // Filter rows based on search query
    const filteredRows = rows.filter((row: any[]) =>
        row.some((cell: any) =>
            String(cell).toLowerCase().includes(searchQuery.toLowerCase())
        )
    )

    // Calculate pagination
    const totalPages = Math.ceil(filteredRows.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedRows = filteredRows.slice(startIndex, endIndex)

    // Reset to page 1 when search changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    return (
        <div className="flex h-full flex-col bg-card/5 backdrop-blur-sm">
            {/* Search and controls */}
            <div className="flex items-center justify-between gap-4 px-5 py-2.5 border-b border-border/10">
                <div className="relative flex-1 max-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                    <Input
                        placeholder="Filter..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 h-8 text-xs bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all rounded-md placeholder:text-muted-foreground/30"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
                        {filteredRows.length} OF {rows.length}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                <div className="min-w-full inline-block align-middle">
                    <table className="w-full text-sm border-separate border-spacing-0">
                        <thead className="sticky top-0 bg-background/95 backdrop-blur-md z-10 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                            <tr>
                                {headers.map((header: string, idx: number) => (
                                    <th
                                        key={idx}
                                        className="px-5 py-3 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.1em] border-b border-border/10 min-w-[120px]"
                                    >
                                        <div className="flex items-center gap-1.5 group cursor-default">
                                            {header}
                                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1 h-1 border-l border-t border-primary/40 rotate-45 mb-0.5" />
                                                <div className="w-1 h-1 border-r border-b border-primary/40 rotate-45" />
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5 bg-transparent">
                            {paginatedRows.length === 0 ? (
                                <tr>
                                    <td colSpan={headers.length} className="px-5 py-8 text-center text-muted-foreground/40 text-xs italic">
                                        No entries found
                                    </td>
                                </tr>
                            ) : (
                                paginatedRows.map((row: any[], rowIdx: number) => (
                                    <tr key={rowIdx} className="hover:bg-primary/[0.03] transition-colors group even:bg-muted/[0.02]">
                                        {row.map((cell: any, cellIdx: number) => {
                                            const isNumeric = !isNaN(Number(cell)) && cell !== null && cell !== ""
                                            const isId = headers[cellIdx].toLowerCase() === 'id'
                                            return (
                                                <td
                                                    key={cellIdx}
                                                    className={cn(
                                                        "px-5 py-2.5 whitespace-nowrap text-[13px] font-medium border-b border-border/5 group-hover:text-foreground transition-colors",
                                                        (isNumeric || isId) ? "font-mono text-primary/80" : "text-foreground/70"
                                                    )}
                                                >
                                                    {cell?.toString() || '-'}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-2 border-t border-border/10 bg-muted/5 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-7 w-7 rounded-md hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-20"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[50px] text-center">PAGE {currentPage} / {totalPages || 1}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="h-7 w-7 rounded-md hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-20"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-[9px] font-medium opacity-50">
                    SNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            </div>
        </div>
    )
}
