// Widget type definitions and constants
export const WIDGET_TYPES = {
    CARD: 'card',
    LINE_CHART: 'line-chart',
    TABLE: 'table',
} as const

export const DEFAULT_WIDGET_SIZES = {
    card: { w: 2, h: 2, minW: 2, minH: 2 },
    'line-chart': { w: 4, h: 3, minW: 3, minH: 2 },
    table: { w: 4, h: 4, minW: 3, minH: 3 },
}
