import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WidgetType = 'card' | 'line-chart' | 'table'

export interface Widget {
    id: string
    type: WidgetType
    title: string
    config: any
    apiUrl?: string
    refreshInterval?: number
}

export interface DashboardLayout {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
}

interface DashboardStore {
    widgets: Widget[]
    layouts: DashboardLayout[]
    isEditMode: boolean
    addWidget: (widget: Widget, layout: DashboardLayout) => void
    removeWidget: (id: string) => void
    updateWidget: (id: string, updates: Partial<Widget>) => void
    updateLayouts: (layouts: DashboardLayout[]) => void
    toggleEditMode: () => void
}

export const useDashboardStore = create<DashboardStore>()(
    persist(
        (set) => ({
            widgets: [],
            layouts: [],
            isEditMode: false,
            addWidget: (widget, layout) =>
                set((state) => ({
                    widgets: [...state.widgets, widget],
                    layouts: [...state.layouts, layout],
                })),
            removeWidget: (id) =>
                set((state) => ({
                    widgets: state.widgets.filter((w) => w.id !== id),
                    layouts: state.layouts.filter((l) => l.i !== id),
                })),
            updateWidget: (id, updates) =>
                set((state) => ({
                    widgets: state.widgets.map((w) =>
                        w.id === id ? { ...w, ...updates } : w
                    ),
                })),
            updateLayouts: (layouts) => set({ layouts }),
            toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
        }),
        {
            name: 'dashboard-storage',
        }
    )
)
