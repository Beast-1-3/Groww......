// API endpoint configurations
export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 5000,
    retries: 3,
}

// Default refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
    fast: 5000,     // 5 seconds
    medium: 30000,  // 30 seconds
    slow: 60000,    // 1 minute
}
