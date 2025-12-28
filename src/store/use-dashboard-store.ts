import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WidgetLayout {
    x: number
    y: number
    w: number
    h: number
}

// Widget content types
export interface CardWidgetContent {
    value: string | number
    label: string
    trend?: number
}

export interface TableWidgetContent {
    headers: string[]
    rows: string[][]
}

export interface LineChartWidgetContent {
    data: { x: string; y: number }[]
    xLabel?: string
    yLabel?: string
}

export type WidgetType = 'card' | 'table' | 'lineChart'

export type WidgetContent = CardWidgetContent | TableWidgetContent | LineChartWidgetContent

export interface WidgetConfig {
    apiUrl?: string
    refreshInterval?: number // in seconds
    fieldMapping?: Record<string, string> // maps API fields to widget fields
    selectedFields?: string[] // array of selected field paths from API
}

export interface Widget {
    id: string
    type: WidgetType
    title: string
    content: WidgetContent
    layout: WidgetLayout
    config?: WidgetConfig
}

export interface DashboardLayout {
    columns: number
    gap: number
}

interface DashboardState {
    widgets: Widget[]
    layout: DashboardLayout

    isAddModalOpen: boolean
    setIsAddModalOpen: (open: boolean) => void
    editingWidgetId: string | null
    setEditingWidgetId: (id: string | null) => void

    // Actions
    addWidget: (widget: Omit<Widget, 'id'>) => void
    removeWidget: (id: string) => void
    updateWidget: (id: string, updates: Partial<Widget>) => void
    updateLayout: (updates: Partial<DashboardLayout>) => void
}

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            widgets: [],
            layout: {
                columns: 4,
                gap: 16
            },
            isAddModalOpen: false,
            setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
            editingWidgetId: null,
            setEditingWidgetId: (id) => set({ editingWidgetId: id }),

            addWidget: (widget) => set((state) => ({
                widgets: [
                    ...state.widgets,
                    { ...widget, id: crypto.randomUUID() }
                ]
            })),

            removeWidget: (id) => set((state) => ({
                widgets: state.widgets.filter((w) => w.id !== id)
            })),

            updateWidget: (id, updates) => set((state) => ({
                widgets: state.widgets.map((w) =>
                    w.id === id ? { ...w, ...updates } : w
                )
            })),

            updateLayout: (updates) => set((state) => ({
                layout: { ...state.layout, ...updates }
            }))
        }),
        {
            name: 'finboard-storage',
        }
    )
)
