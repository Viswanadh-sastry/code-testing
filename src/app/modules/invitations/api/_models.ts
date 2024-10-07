export type Invitation = {
    invited_by: string
    user_id: string
    domain_id: string
    relation: string
    resend: boolean
    created_at: string
    updated_at: string
    confirmed_at: string
    toUserName: string
    fromUserName: string
    domainName: string
}