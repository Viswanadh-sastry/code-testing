export type Group = {
    id?: string
    name?: string
    description?: string
    metadata?: any
    created_at: string
    status: string
    updated_at: string
    children: Group[]
    tree: boolean
}

export type GroupChannel = {
    id?: string
    name?: string
    description?: string
    metadata?: any
    created_at: string
    status: string
    updated_at: string
}

export type GroupUser = {
    id?: string
    name?: string
    metadata?: any
    created_at: string
    status: string
    updated_at: string
    tag: string
    relation: string
}

export type User = {
    id?: string
    name?: string
    description?: string
    metadata?: any
    created_at: string
    status: string
    updated_at: string
    tag: string
}