// Performance monitoring utilities
export const performanceMonitor = {
    startTime: 0,

    start() {
        this.startTime = performance.now()
    },

    end(label: string) {
        const endTime = performance.now()
        const duration = endTime - this.startTime
        console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`)
        return duration
    },

    measure(fn: () => void, label: string) {
        this.start()
        fn()
        return this.end(label)
    },
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}
