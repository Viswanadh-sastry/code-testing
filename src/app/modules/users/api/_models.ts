export type User = {
    id?: string
    name?: string
    role?: string
    metadata?: any
    tags?: string[]
    credentials: {
        identity: string
    }
    status: string
    created_at: string
    updated_at: string
    updated_by: string
}