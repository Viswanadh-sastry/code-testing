export type Thing = {
    id?: string
    name?: string
    tags?: string[]
    metadata?: any
    credentials: {
        identity: string
        secret: string
    }
    created_at: string
    updated_at: string
    isConnected: boolean
    status: string
    activity: string
    lastSeenMsg: string
}

export type User = {
    id?: string
    name?: string
    metadata?: any
    created_at: string
}

export type ThingChannel = {
    id?: string
    name?: string
    description?: any
    created_at: string
}
