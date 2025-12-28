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
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    const [showArraysOnly, setShowArraysOnly] = useState(false)

    useEffect(() => {
        const fetchPreview = async () => {
            if (!apiUrl) return
            setIsLoading(true)
            setError(null)
            try {
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

    const toggleFolder = (path: string) => {
        const next = new Set(expandedPaths)
        if (next.has(path)) next.delete(path)
        else next.add(path)
        setExpandedPaths(next)
    }

    const fieldHierarchy = useMemo(() => {
        if (!apiData) return []

        interface Node {
            key: string
            path: string
            type: string
            isArray: boolean
            isObject: boolean
            children?: Node[]
        }

        const buildHierarchy = (obj: any, path: string = ""): Node[] => {
            if (!obj || typeof obj !== 'object') return []

            return Object.entries(obj).map(([key, value]) => {
                const currentPath = path ? `${path}.${key}` : key
                const isArr = Array.isArray(value)
                const isObj = typeof value === 'object' && value !== null && !isArr

                const node: Node = {
                    key,
                    path: currentPath,
                    type: isArr ? 'array' : typeof value,
                    isArray: isArr,
                    isObject: isObj
                }

                if (isObj || (isArr && value.length > 0 && typeof value[0] === 'object')) {
                    // For arrays of objects, show the structure of the first item
                    const childData = isArr ? value[0] : value
                    node.children = buildHierarchy(childData, currentPath)
                }

                return node
            })
        }

        return buildHierarchy(apiData)
    }, [apiData])

    const filterHierarchy = (nodes: any[], query: string, arraysOnly: boolean): any[] => {
        return nodes
            .map(node => {
                const hasMatchingChild = node.children && filterHierarchy(node.children, query, arraysOnly).length > 0
                const matchesSearch = node.path.toLowerCase().includes(query.toLowerCase())
                const matchesType = arraysOnly ? node.isArray : true

                if (matchesSearch && matchesType) return node
                if (hasMatchingChild) return { ...node, children: filterHierarchy(node.children, query, arraysOnly) }
                return null
            })
            .filter(Boolean)
    }

    const filteredHierarchy = useMemo(() => {
        return filterHierarchy(fieldHierarchy, searchQuery, showArraysOnly)
    }, [fieldHierarchy, searchQuery, showArraysOnly])

    const handleAddField = (path: string) => {
        onFieldsChange([...selectedFields, path])
    }

    const handleRemoveField = (path: string) => {
        onFieldsChange(selectedFields.filter(f => f !== path))
    }

    const renderNode = (node: any, depth: number = 0) => {
        const isSelected = selectedFields.includes(node.path)
        const isExpanded = expandedPaths.has(node.path)
        const hasChildren = node.children && node.children.length > 0

        return (
            <div key={node.path}>
                <div
                    className={cn(
                        "group flex items-center justify-between p-2 rounded-xl transition-all hover:bg-muted/20",
                        isSelected && "opacity-50 pointer-events-none"
                    )}
                    style={{ marginLeft: `${depth * 12}px` }}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleFolder(node.path)}
                                className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted/40 transition-colors"
                            >
                                <Plus className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-45")} />
                            </button>
                        ) : (
                            <div className="w-5" />
                        )}
                        <div className={cn(
                            "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0",
                            node.isArray ? "bg-orange-500/10 text-orange-500" :
                                node.isObject ? "bg-purple-500/10 text-purple-500" :
                                    "bg-blue-500/10 text-blue-500"
                        )}>
                            {node.isArray ? <List className="h-3.5 w-3.5" /> :
                                node.isObject ? <Database className="h-3.5 w-3.5" /> :
                                    <Hash className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-foreground/90 truncate">{node.key}</span>
                            <span className="text-[9px] uppercase font-bold text-muted-foreground/30">{node.type}</span>
                        </div>
                    </div>
                    {!isSelected && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/20 hover:text-primary transition-all shrink-0"
                            onClick={() => handleAddField(node.path)}
                        >
                            <Plus className="h-3.5 w-3.5 stroke-[3px]" />
                        </Button>
                    )}
                </div>
                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {node.children.map((child: any) => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        )
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
                {/* Available Fields - TREE VIEW */}
                <div className="flex flex-col border border-border/30 rounded-2xl overflow-hidden bg-muted/5 group/col">
                    <div className="px-5 py-3 border-b border-border/10 bg-muted/10 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Hierarchy</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                        {filteredHierarchy.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground/30 text-xs italic">No fields match your search</div>
                        ) : (
                            filteredHierarchy.map((node) => renderNode(node))
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
