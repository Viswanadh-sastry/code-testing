export type Channels = {
    id?: string
    name?: string
    description?: string
    parent_id?: string
    metadata?: any
    created_at: string
    status: string
    isConnected?: boolean
    isLocated?: boolean
}

export type ChannelThing = {
    id?: string
    name?: string
    tags?: string[]
    description?: string
    parent_id?: string
    metadata?: any
    created_at: string
    status: string
}

export type ChannelUser = {
    id?: string
    name?: string
    parent_id?: string
    metadata?: any
    relation?: string
    created_at: string
    status: string
}

export type ChannelGroup = {
    id?: string
    name?: string
    description?: string
    parent_id?: string
    metadata?: any
    created_at: string
    status: string
}