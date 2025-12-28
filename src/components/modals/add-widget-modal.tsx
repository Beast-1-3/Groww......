"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Table as TableIcon, CreditCard, LineChart as ChartIcon, Search, CheckCircle2, AlertCircle } from "lucide-react"
import { useDashboardStore, WidgetType } from "@/store/use-dashboard-store"
import { JsonFieldExplorer } from "./json-field-explorer"
import { cn } from "@/lib/utils"

interface AddWidgetModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddWidgetModal({ open, onOpenChange }: AddWidgetModalProps) {
    const { addWidget, updateWidget, editingWidgetId, setEditingWidgetId, widgets } = useDashboardStore()

    const [title, setTitle] = useState("")
    const [type, setType] = useState<WidgetType>("card")
    const [apiUrl, setApiUrl] = useState("")
    const [refreshInterval, setRefreshInterval] = useState("60")
    const [rootPath, setRootPath] = useState("")
    const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
    const [selectedFields, setSelectedFields] = useState<string[]>([])
    const [isTesting, setIsTesting] = useState(false)
    const [testResult, setTestResult] = useState<{ success: boolean; message: string; fieldsCount?: number } | null>(null)

    const handleFieldsChange = (fields: string[]) => {
        setSelectedFields(fields)

        // Detect array root path (e.g., from "data.0.price" -> root is "data")
        let detectedRoot = ""
        if (fields.length > 0) {
            const firstField = fields[0]
            const match = firstField.match(/^(.*)\.\d+\./)
            if (match) {
                detectedRoot = match[1]
            } else if (firstField.match(/^\d+\./)) {
                detectedRoot = ""
            }
        }
        setRootPath(detectedRoot)

        // Auto-generate field mapping based on type
        const newMapping: Record<string, string> = {}
        if (type === 'card' && fields.length > 0) {
            if (fields[0]) newMapping['value'] = fields[0]
            if (fields[1]) newMapping['label'] = fields[1]
            if (fields[2]) newMapping['trend'] = fields[2]
        } else if (type === 'table') {
            fields.forEach((field, index) => {
                const relativePath = detectedRoot ? field.replace(`${detectedRoot}.`, '').replace(/^\d+\./, '') : field.replace(/^\d+\./, '')
                newMapping[index.toString()] = relativePath
            })
        } else if (type === 'lineChart' && fields.length >= 2) {
            const relX = detectedRoot ? fields[0].replace(`${detectedRoot}.`, '').replace(/^\d+\./, '') : fields[0].replace(/^\d+\./, '')
            const relY = detectedRoot ? fields[1].replace(`${detectedRoot}.`, '').replace(/^\d+\./, '') : fields[1].replace(/^\d+\./, '')
            newMapping['x'] = relX
            newMapping['y'] = relY
        }
        setFieldMapping(newMapping)
    }

    // Load widget data for editing
    useEffect(() => {
        if (editingWidgetId && open) {
            const widget = widgets.find(w => w.id === editingWidgetId)
            if (widget) {
                setTitle(widget.title)
                setType(widget.type)
                setApiUrl(widget.config?.apiUrl || "")
                setRefreshInterval(widget.config?.refreshInterval?.toString() || "60")
                setRootPath(widget.config?.rootPath || "")
                setFieldMapping(widget.config?.fieldMapping || {})
                setSelectedFields(widget.config?.selectedFields || [])
            }
        } else if (!open) {
            // Reset after close
            setTimeout(() => {
                setEditingWidgetId(null)
                setTitle("")
                setType("card")
                setApiUrl("")
                setRefreshInterval("60")
                setRootPath("")
                setFieldMapping({})
                setSelectedFields([])
                setTestResult(null)
            }, 300)
        }
    }, [editingWidgetId, open, widgets, setEditingWidgetId])

    const handleTestApi = async () => {
        if (!apiUrl) return
        setIsTesting(true)
        setTestResult(null)
        try {
            const res = await fetch(apiUrl)
            if (!res.ok) throw new Error("Connection failed")
            const data = await res.json()
            const fieldsCount = Object.keys(data).length
            setTestResult({
                success: true,
                message: "API connection successful!",
                fieldsCount
            })
        } catch (err) {
            setTestResult({ success: false, message: "API connection failed. Please check URL." })
        } finally {
            setIsTesting(false)
        }
    }

    const handleSubmit = () => {
        const config = apiUrl ? {
            apiUrl,
            refreshInterval: parseInt(refreshInterval) || 60,
            rootPath,
            fieldMapping,
            selectedFields
        } : undefined

        if (editingWidgetId) {
            updateWidget(editingWidgetId, {
                title: title || `Updated ${type} Widget`,
                type,
                config
            })
        } else {
            let content: any
            switch (type) {
                case 'card':
                    content = { value: '$0', label: title || 'Finance Data', trend: 0 }
                    break
                case 'table':
                    content = { headers: ['Loading...'], rows: [['...']] }
                    break
                case 'lineChart':
                    content = { data: [], xLabel: 'Time', yLabel: 'Value' }
                    break
            }

            addWidget({
                type,
                title: title || `New ${type} Widget`,
                content,
                layout: { x: 0, y: 0, w: type === 'card' ? 3 : 6, h: type === 'card' ? 3 : 4 },
                config
            })
        }

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/40 shadow-2xl">
                <DialogHeader className="px-8 py-6 border-b border-border/10">
                    <DialogTitle className="text-2xl font-black italic tracking-tighter text-foreground">
                        {editingWidgetId ? 'EDIT WIDGET' : 'ADD NEW WIDGET'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground/60 font-medium">
                        {editingWidgetId ? 'Update your widget configuration.' : 'Configure your real-time finance widget in seconds.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Widget Name</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Bitcoin Price"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:bg-muted/40 transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="refreshInterval" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Refresh Interval (sec)</Label>
                            <Input
                                id="refreshInterval"
                                type="number"
                                placeholder="60"
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(e.target.value)}
                                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:bg-muted/40 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    {/* API Config */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="apiUrl" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">API URL Source</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="apiUrl"
                                    placeholder="https://api.coinbase.com/v2/prices/BTC-USD/spot"
                                    value={apiUrl}
                                    onChange={(e) => setApiUrl(e.target.value)}
                                    className="h-12 bg-muted/20 border-border/50 rounded-xl focus:bg-muted/40 transition-all font-mono text-xs"
                                />
                                <Button
                                    variant="secondary"
                                    className="h-12 px-6 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                    onClick={handleTestApi}
                                    disabled={!apiUrl || isTesting}
                                >
                                    {isTesting ? "..." : "TEST"}
                                </Button>
                            </div>
                        </div>

                        {testResult && (
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all animate-in fade-in slide-in-from-top-2",
                                testResult.success ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <span>{testResult.message} {testResult.fieldsCount ? `${testResult.fieldsCount} top-level fields found.` : ""}</span>
                            </div>
                        )}
                    </div>

                    {/* Display Mode */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">Display Mode</Label>
                        <div className="flex gap-3">
                            {[
                                { id: 'card', name: 'Card', icon: CreditCard },
                                { id: 'table', name: 'Table', icon: TableIcon },
                                { id: 'lineChart', name: 'Chart', icon: ChartIcon },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setType(mode.id as WidgetType)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all",
                                        type === mode.id
                                            ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                                            : "bg-muted/10 border-border/30 text-muted-foreground hover:bg-muted/20 hover:border-border/50"
                                    )}
                                >
                                    <mode.icon className={cn("h-6 w-6", type === mode.id ? "stroke-[2.5px]" : "stroke-1")} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{mode.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Field Explorer */}
                    {apiUrl && testResult?.success && (
                        <div className="space-y-4 pt-4 border-t border-border/10">
                            <div className="flex items-center justify-between">
                                <Label className="text-[11px] font-bold uppercase tracking-widest text-primary">Field Explorer</Label>
                            </div>
                            <JsonFieldExplorer
                                apiUrl={apiUrl}
                                selectedFields={selectedFields}
                                onFieldsChange={handleFieldsChange}
                                widgetType={type}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="px-8 py-6 border-t border-border/10 bg-muted/5">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-muted-foreground hover:text-foreground">
                        CANCEL
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 rounded-xl shadow-lg shadow-primary/20"
                    >
                        {editingWidgetId ? 'UPDATE WIDGET' : 'CREATE WIDGET'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
