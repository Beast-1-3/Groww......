"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardStore, WidgetType } from "@/store/use-dashboard-store"
import { JsonFieldExplorer } from "./json-field-explorer"

interface AddWidgetModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddWidgetModal({ open, onOpenChange }: AddWidgetModalProps) {
    const addWidget = useDashboardStore((state) => state.addWidget)

    const [title, setTitle] = useState("")
    const [type, setType] = useState<WidgetType>("card")
    const [apiUrl, setApiUrl] = useState("")
    const [refreshInterval, setRefreshInterval] = useState("60")
    const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
    const [selectedFields, setSelectedFields] = useState<string[]>([])

    const handleSubmit = () => {
        // Generate sample content based on type
        let content: any

        switch (type) {
            case 'card':
                content = {
                    value: fieldMapping.value || '$0',
                    label: fieldMapping.label || 'No Data',
                    trend: fieldMapping.trend ? parseFloat(fieldMapping.trend) : undefined
                }
                break
            case 'table':
                content = {
                    headers: ['Column 1', 'Column 2', 'Column 3'],
                    rows: [
                        ['Data 1', 'Data 2', 'Data 3'],
                        ['Data 4', 'Data 5', 'Data 6']
                    ]
                }
                break
            case 'lineChart':
                content = {
                    data: [
                        { x: 'Jan', y: 30 },
                        { x: 'Feb', y: 45 },
                        { x: 'Mar', y: 38 },
                        { x: 'Apr', y: 55 },
                        { x: 'May', y: 62 },
                        { x: 'Jun', y: 58 }
                    ],
                    xLabel: 'Month',
                    yLabel: 'Revenue ($K)'
                }
                break
        }

        addWidget({
            type,
            title: title || `New ${type} Widget`,
            content,
            layout: { x: 0, y: 0, w: type === 'card' ? 3 : 6, h: type === 'card' ? 3 : 4 },
            config: apiUrl ? {
                apiUrl,
                refreshInterval: parseInt(refreshInterval) || 60,
                fieldMapping,
                selectedFields
            } : undefined
        })

        // Reset form
        setTitle("")
        setType("card")
        setApiUrl("")
        setRefreshInterval("60")
        setFieldMapping({})
        setSelectedFields([])
        onOpenChange(false)
    }

    const renderFieldMapping = () => {
        if (!apiUrl) return null

        switch (type) {
            case 'card':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="field-value">Value Field</Label>
                            <Input
                                id="field-value"
                                placeholder="e.g., data.revenue"
                                value={fieldMapping.value || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, value: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-label">Label Field</Label>
                            <Input
                                id="field-label"
                                placeholder="e.g., data.label"
                                value={fieldMapping.label || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, label: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-trend">Trend Field (optional)</Label>
                            <Input
                                id="field-trend"
                                placeholder="e.g., data.trend"
                                value={fieldMapping.trend || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, trend: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 'table':
                return (
                    <div className="space-y-2">
                        <Label htmlFor="field-data">Data Array Path</Label>
                        <Input
                            id="field-data"
                            placeholder="e.g., data.transactions"
                            value={fieldMapping.dataPath || ""}
                            onChange={(e) => setFieldMapping({ ...fieldMapping, dataPath: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Path to the array in the API response
                        </p>
                    </div>
                )
            case 'lineChart':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="field-data-array">Data Array Path</Label>
                            <Input
                                id="field-data-array"
                                placeholder="e.g., data.chartData"
                                value={fieldMapping.dataPath || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, dataPath: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-x">X Field</Label>
                            <Input
                                id="field-x"
                                placeholder="e.g., date"
                                value={fieldMapping.xField || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, xField: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="field-y">Y Field</Label>
                            <Input
                                id="field-y"
                                placeholder="e.g., value"
                                value={fieldMapping.yField || ""}
                                onChange={(e) => setFieldMapping({ ...fieldMapping, yField: e.target.value })}
                            />
                        </div>
                    </div>
                )
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Widget</DialogTitle>
                    <DialogDescription>
                        Configure your widget with optional API data source
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Widget Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter widget title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Widget Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value as WidgetType)}>
                            <SelectTrigger id="type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="table">Table</SelectItem>
                                <SelectItem value="lineChart">Line Chart</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apiUrl">API URL (optional)</Label>
                        <Input
                            id="apiUrl"
                            placeholder="https://api.example.com/data"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                        />
                    </div>

                    {apiUrl && (
                        <div className="space-y-2">
                            <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                            <Input
                                id="refreshInterval"
                                type="number"
                                placeholder="60"
                                value={refreshInterval}
                                onChange={(e) => setRefreshInterval(e.target.value)}
                            />
                        </div>
                    )}

                    {apiUrl && (
                        <JsonFieldExplorer
                            apiUrl={apiUrl}
                            selectedFields={selectedFields}
                            onFieldsChange={setSelectedFields}
                            widgetType={type}
                        />
                    )}

                    {renderFieldMapping()}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Add Widget
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
