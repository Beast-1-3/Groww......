"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TreeNode {
    key: string
    value: any
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null'
    path: string
    children?: TreeNode[]
}

interface JsonFieldExplorerProps {
    apiUrl: string
    selectedFields: string[]
    onFieldsChange: (fields: string[]) => void
    widgetType: 'card' | 'table' | 'lineChart'
}

function buildTree(obj: any, parentPath: string = ''): TreeNode[] {
    if (!obj || typeof obj !== 'object') return []

    const nodes: TreeNode[] = []

    for (const [key, value] of Object.entries(obj)) {
        const path = parentPath ? `${parentPath}.${key}` : key
        const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value

        const node: TreeNode = {
            key,
            value,
            type: type as any,
            path,
        }

        if (type === 'object' || type === 'array') {
            node.children = buildTree(value, path)
        }

        nodes.push(node)
    }

    return nodes
}

function TreeNodeComponent({
    node,
    selectedFields,
    onToggleField,
    level = 0
}: {
    node: TreeNode
    selectedFields: string[]
    onToggleField: (path: string) => void
    level?: number
}) {
    const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedFields.includes(node.path)
    const isSelectable = node.type !== 'object' && node.type !== 'array'

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'string': return 'text-green-600'
            case 'number': return 'text-blue-600'
            case 'boolean': return 'text-purple-600'
            case 'array': return 'text-orange-600'
            case 'object': return 'text-gray-600'
            default: return 'text-gray-400'
        }
    }

    const getValuePreview = (value: any, type: string) => {
        if (type === 'string') return `"${String(value).substring(0, 30)}${String(value).length > 30 ? '...' : ''}"`
        if (type === 'number' || type === 'boolean') return String(value)
        if (type === 'array') return `[${value.length}]`
        if (type === 'object') return `{${Object.keys(value).length}}`
        return 'null'
    }

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-1 px-2 hover:bg-accent rounded cursor-pointer ${isSelected ? 'bg-accent' : ''}`}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
            >
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-0 h-4 w-4"
                    >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                )}
                {!hasChildren && <div className="w-4" />}

                {isSelectable && (
                    <button
                        onClick={() => onToggleField(node.path)}
                        className={`h-4 w-4 border rounded flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-input'}`}
                    >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </button>
                )}
                {!isSelectable && <div className="w-4" />}

                <span className="font-mono text-sm">{node.key}</span>
                <span className={`text-xs ${getTypeColor(node.type)}`}>
                    {node.type}
                </span>
                {!hasChildren && (
                    <span className="text-xs text-muted-foreground ml-auto">
                        {getValuePreview(node.value, node.type)}
                    </span>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(node.path)
                    }}
                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded"
                    title="Copy path"
                >
                    <Copy className="h-3 w-3" />
                </button>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children!.map((child, idx) => (
                        <TreeNodeComponent
                            key={`${child.path}-${idx}`}
                            node={child}
                            selectedFields={selectedFields}
                            onToggleField={onToggleField}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
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
    const [tree, setTree] = useState<TreeNode[]>([])

    const fetchApiPreview = async () => {
        if (!apiUrl) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(apiUrl)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            setApiData(data)
            setTree(buildTree(data))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch API data')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleField = (path: string) => {
        if (selectedFields.includes(path)) {
            onFieldsChange(selectedFields.filter(f => f !== path))
        } else {
            onFieldsChange([...selectedFields, path])
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    onClick={fetchApiPreview}
                    disabled={!apiUrl || isLoading}
                    size="sm"
                    variant="outline"
                >
                    {isLoading ? 'Loading...' : 'Explore Fields'}
                </Button>
                {selectedFields.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
                    </span>
                )}
            </div>

            {error && (
                <div className="text-sm text-destructive p-3 bg-destructive/10 rounded">
                    {error}
                </div>
            )}

            {tree.length > 0 && (
                <div className="border rounded-lg p-2 max-h-96 overflow-auto bg-muted/30">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                        API Response Structure
                    </div>
                    {tree.map((node, idx) => (
                        <TreeNodeComponent
                            key={`${node.path}-${idx}`}
                            node={node}
                            selectedFields={selectedFields}
                            onToggleField={handleToggleField}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
