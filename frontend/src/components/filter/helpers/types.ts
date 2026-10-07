export interface FieldOption {
    title: string
    value: string | number
}

export type FilterValue = string | number | FieldOption

export type FilterValues = Record<string, FilterValue | undefined>
