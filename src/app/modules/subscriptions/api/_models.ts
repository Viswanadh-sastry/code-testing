export type Subscription = {
    id?: string
    name?: string
    categories?: string[]
    labels?: string[]
    receiver?: string
    channels?: any[]
    resendInterval?: string
    resendLimit?: number
    adminState?: string
    created: string
    modified: string
}
