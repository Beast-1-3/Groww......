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
    if (apiData && Array.isArray(apiData) && config?.fieldMapping) {
        const mappingKeys = Object.keys(config.fieldMapping).sort((a, b) => Number(a) - Number(b))
        headers = mappingKeys.map(key => config.fieldMapping![key].split('.').pop() || 'Field')
        rows = apiData.map(item => mappingKeys.map(key => getNestedValue(item, config.fieldMapping![key])))
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
        <div className="flex h-full flex-col bg-card/10">
            {/* Search and controls */}
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border/10">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Search table..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 h-10 text-sm bg-muted/20 border-border/50 focus:bg-muted/40 transition-all rounded-lg"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                        {filteredRows.length} of {rows.length} items
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 bg-background/50 backdrop-blur-md z-10">
                        <tr>
                            {headers.map((header: string, idx: number) => (
                                <th
                                    key={idx}
                                    className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/10"
                                >
                                    <div className="flex items-center gap-2">
                                        {header}
                                        <div className="flex flex-col opacity-30">
                                            <div className="w-2 h-2 border-l border-t border-muted-foreground rotate-45 -mb-1" />
                                            <div className="w-2 h-2 border-r border-b border-muted-foreground rotate-45" />
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 bg-transparent">
                        {paginatedRows.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-5 py-12 text-center text-muted-foreground italic">
                                    No results found matching your search
                                </td>
                            </tr>
                        ) : (
                            paginatedRows.map((row: any[], rowIdx: number) => (
                                <tr key={rowIdx} className="hover:bg-primary/[0.02] transition-colors group">
                                    {row.map((cell: any, cellIdx: number) => (
                                        <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground/80 group-hover:text-foreground">
                                            {cell?.toString() || '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border/10 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>Page {currentPage} of {totalPages || 1}</span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-6 w-6 rounded-md hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="h-6 w-6 rounded-md hover:bg-muted"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="text-[10px] italic">
                    Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            </div>
        </div>
    )
}
