// Format currency values
export function formatCurrency(value: number | string, currency: string = 'USD', decimals: number = 2): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue)) return String(value)

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(numValue)
    } catch {
        return `$${numValue.toFixed(decimals)}`
    }
}

// Format large numbers with abbreviations (K, M, B)
export function formatNumber(value: number | string, decimals: number = 1): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue)) return String(value)

    const absValue = Math.abs(numValue)
    const sign = numValue < 0 ? '-' : ''

    if (absValue >= 1e9) {
        return `${sign}${(absValue / 1e9).toFixed(decimals)}B`
    } else if (absValue >= 1e6) {
        return `${sign}${(absValue / 1e6).toFixed(decimals)}M`
    } else if (absValue >= 1e3) {
        return `${sign}${(absValue / 1e3).toFixed(decimals)}K`
    }

    return numValue.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    })
}

// Format percentage values
export function formatPercentage(value: number | string, decimals: number = 1): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue)) return String(value)

    return `${numValue.toFixed(decimals)}%`
}

// Auto-detect and format value based on type
export function formatValue(
    value: any,
    format?: 'currency' | 'number' | 'percentage' | 'auto',
    options?: {
        currency?: string
        decimals?: number
    }
): string {
    if (value === null || value === undefined) return 'N/A'

    const numValue = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(numValue)) return String(value)

    switch (format) {
        case 'currency':
            return formatCurrency(numValue, options?.currency, options?.decimals)
        case 'number':
            return formatNumber(numValue, options?.decimals)
        case 'percentage':
            return formatPercentage(numValue, options?.decimals)
        case 'auto':
        default:
            // Auto-detect: if value is between -100 and 100 and has decimals, might be percentage
            if (Math.abs(numValue) <= 100 && numValue % 1 !== 0) {
                return formatPercentage(numValue)
            }
            // Otherwise format as number
            return formatNumber(numValue)
    }
}
