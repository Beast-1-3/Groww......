import useSWR from 'swr'

interface UseApiDataOptions {
    apiUrl?: string | null
    refreshInterval?: number // in seconds
    fieldMapping?: Record<string, string>
}

interface UseApiDataResult<T> {
    data: T | null
    error: Error | null
    isLoading: boolean
    isValidating: boolean
    mutate: () => Promise<any>
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

import { Skeleton } from "@/components/ui/skeleton"
import { cn, getNestedValue } from "@/lib/utils"

// Transform API response using field mapping
function transformData<T>(rawData: any, fieldMapping?: Record<string, string>): T | null {
    if (!rawData) return null
    if (!fieldMapping || Object.keys(fieldMapping).length === 0) {
        return rawData as T
    }

    const transformed: any = {}

    for (const [targetField, sourcePath] of Object.entries(fieldMapping)) {
        if (sourcePath) {
            transformed[targetField] = getNestedValue(rawData, sourcePath)
        }
    }

    return transformed as T
}

export function useApiData<T = any>({
    apiUrl,
    refreshInterval = 60,
    fieldMapping
}: UseApiDataOptions): UseApiDataResult<T> {
    // Only fetch if apiUrl is provided
    const shouldFetch = apiUrl && apiUrl.trim().length > 0

    const { data: rawData, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch ? apiUrl : null,
        fetcher,
        {
            refreshInterval: refreshInterval * 1000, // Convert to milliseconds
            revalidateOnFocus: false,
            dedupingInterval: 5000, // Prevent duplicate requests within 5s
            shouldRetryOnError: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000
        }
    )

    // Transform the data using field mapping
    const transformedData = transformData<T>(rawData, fieldMapping)

    return {
        data: transformedData,
        error: error || null,
        isLoading: shouldFetch ? isLoading : false,
        isValidating: shouldFetch ? isValidating : false,
        mutate
    }
}
