"use client"

import { useState } from "react"
import { TableWidgetContent, WidgetConfig } from "@/store/use-dashboard-store"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useApiData } from "@/hooks/use-api-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TableWidgetProps {
    content: TableWidgetContent
    config?: WidgetConfig
}

export function TableWidget({ content, config }: TableWidgetProps) {
    const { data: apiData, error, isLoading } = useApiData<TableWidgetContent>({
        apiUrl: config?.apiUrl,
        refreshInterval: config?.refreshInterval,
        fieldMapping: config?.fieldMapping
    })

    // Use API data if available, otherwise fall back to static content
    const displayData = apiData || content
    const { headers, rows } = displayData

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
    const filteredRows = rows.filter(row =>
        row.some(cell =>
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
        <div className="flex h-full flex-col">
            {/* Search and controls */}
            <div className="flex items-center gap-2 p-3 border-b">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-8 h-8 text-sm"
                    />
                </div>
                <Select value={String(pageSize)} onValueChange={(v) => {
                    setPageSize(Number(v))
                    setCurrentPage(1)
                }}>
                    <SelectTrigger className="w-20 h-8 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/50 border-b">
                        <tr>
                            {headers.map((header, idx) => (
                                <th key={idx} className="px-4 py-2 text-left font-semibold text-xs uppercase tracking-wide">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRows.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-4 py-8 text-center text-muted-foreground">
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            paginatedRows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} className="px-4 py-2">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-muted-foreground">
                <div>
                    Showing {filteredRows.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredRows.length)} of {filteredRows.length}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-7 px-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="h-7 px-2"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
