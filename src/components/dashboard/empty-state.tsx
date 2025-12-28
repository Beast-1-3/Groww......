"use client"

import { Plus, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/store/use-dashboard-store"

interface EmptyStateProps {
    className?: string
}

export function EmptyState({ className }: EmptyStateProps) {
    const setIsAddModalOpen = useDashboardStore((state) => state.setIsAddModalOpen)

    return (
        <div className={cn("flex min-h-[60vh] flex-col items-center justify-center p-8", className)}>
            <div
                onClick={() => setIsAddModalOpen(true)}
                className="w-full max-w-2xl aspect-[2/1] bg-muted/5 border-2 border-dashed border-primary/20 rounded-[2rem] flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all group"
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <LayoutDashboard className="h-10 w-10 text-primary opacity-40 group-hover:opacity-100 transition-all" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-base font-black uppercase tracking-widest text-foreground/80">No widgets active</h3>
                    <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-tighter">Click Add Widget to get started</p>
                </div>
                <div className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40">
                    <Plus className="h-4 w-4 stroke-[3px]" />
                    <span className="text-xs uppercase tracking-widest">Add New Widget</span>
                </div>
            </div>
        </div>
    )
}
