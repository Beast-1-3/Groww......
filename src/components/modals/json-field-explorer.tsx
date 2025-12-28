"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, X, List, Code, Hash, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface JsonFieldExplorerProps {
    apiUrl: string
    selectedFields: string[]
    onFieldsChange: (fields: string[]) => void
    widgetType: 'card' | 'table' | 'lineChart'
}

export function JsonFieldExplorer({
    apiUrl,
    selectedFields,
    onFieldsChange,
    widgetType
}: JsonFieldExplorerProps) {
    const [apiData, setApiData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showArraysOnly, setShowArraysOnly] = useState(false)

    useEffect(() => {
        const fetchPreview = async () => {
            if (!apiUrl) return
            setIsLoading(true)
            setError(null)
            try {
                // Use proxy for external URLs
                const finalUrl = apiUrl.startsWith('http')
                    ? `/api/proxy?url=${encodeURIComponent(apiUrl)}`
                    : apiUrl

                const res = await fetch(finalUrl)
                if (!res.ok) throw new Error("Failed to fetch")
                const data = await res.json()
                setApiData(data)
            } catch (err) {
                setError("Failed to load API preview")
            } finally {
                setIsLoading(false)
            }
        }
        fetchPreview()
    }, [apiUrl])

    const flatFields = useMemo(() => {
        if (!apiData) return []
        const fields: { path: string; type: string; isArray: boolean }[] = []

        const traverse = (obj: any, path: string = "") => {
            if (!obj || typeof obj !== 'object') return

            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key
                const isArr = Array.isArray(value)
                const type = isArr ? 'array' : typeof value

                fields.push({ path: currentPath, type, isArray: isArr })

                if (typeof value === 'object' && value !== null && !isArr) {
                    traverse(value, currentPath)
                }
            }
        }

        traverse(apiData)
        return fields
    }, [apiData])

    const filteredAvailable = flatFields.filter(f => {
        const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = showArraysOnly ? f.isArray : true
        const notSelected = !selectedFields.includes(f.path)
        return matchesSearch && matchesType && notSelected
    })

    const handleAddField = (path: string) => {
        onFieldsChange([...selectedFields, path])
    }

    const handleRemoveField = (path: string) => {
        onFieldsChange(selectedFields.filter(f => f !== path))
    }

    if (isLoading) return <div className="space-y-4 py-4"><Skeleton className="h-40 w-full rounded-2xl" /></div>

    if (error) return <div className="p-4 text-center text-destructive bg-destructive/5 rounded-2xl border border-destructive/20">{error}</div>

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Search for fields..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-muted/20 border-border/50 rounded-xl focus:bg-muted/40 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/10 rounded-xl border border-border/30 hover:bg-muted/20 transition-all cursor-pointer">
                    <input
                        type="checkbox"
                        id="arraysOnly"
                        checked={showArraysOnly}
                        onChange={(e) => setShowArraysOnly(e.target.checked)}
                        className="rounded border-border/50 text-primary focus:ring-primary h-4 w-4"
                    />
                    <Label htmlFor="arraysOnly" className="text-[10px] font-bold uppercase cursor-pointer select-none">Show arrays only</Label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                {/* Available Fields */}
                <div className="flex flex-col border border-border/30 rounded-2xl overflow-hidden bg-muted/5 group/col">
                    <div className="px-5 py-3 border-b border-border/10 bg-muted/10 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Fields</span>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{filteredAvailable.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                        {filteredAvailable.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground/30 text-xs italic">No fields found</div>
                        ) : (
                            filteredAvailable.map((field) => (
                                <div key={field.path} className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm",
                                            field.isArray ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {field.isArray ? <List className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground/90 truncate max-w-[150px]">{field.path}</span>
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground/30">{field.type}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/20 hover:text-primary transition-all"
                                        onClick={() => handleAddField(field.path)}
                                    >
                                        <Plus className="h-4 w-4 stroke-[3px]" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Selected Fields */}
                <div className="flex flex-col border border-primary/20 rounded-2xl overflow-hidden bg-primary/2 shadow-inner">
                    <div className="px-5 py-3 border-b border-primary/10 bg-primary/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Selected Fields</span>
                        <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">{selectedFields.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-primary/20">
                        {selectedFields.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/5 rounded-2xl border-2 border-dashed border-border/20 m-2">
                                <Database className="h-10 w-10 text-muted-foreground/10 mb-4" />
                                <p className="text-[10px] font-bold text-muted-foreground/30 uppercase leading-relaxed tracking-wider">No fields selected yet.<br />Add data fields from the left.</p>
                            </div>
                        ) : (
                            selectedFields.map((path, index) => {
                                const field = flatFields.find(f => f.path === path)
                                return (
                                    <div key={path} className="group flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                                                <Code className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-primary truncate max-w-[150px]">{path}</span>
                                                    {widgetType === 'card' && (
                                                        <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded leading-none">
                                                            → {index === 0 ? 'VALUE' : index === 1 ? 'LABEL' : index === 2 ? 'TREND' : 'EXTRA'}
                                                        </span>
                                                    )}
                                                    {widgetType === 'lineChart' && (
                                                        <span className="text-[9px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded leading-none">
                                                            → {index === 0 ? 'X-AXIS' : index === 1 ? 'Y-AXIS' : 'EXTRA'}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] uppercase font-bold opacity-40">{field?.type || 'field'}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg hover:bg-destructive/20 hover:text-destructive transition-all"
                                            onClick={() => handleRemoveField(path)}
                                        >
                                            <X className="h-4 w-4 stroke-[3px]" />
                                        </Button>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
