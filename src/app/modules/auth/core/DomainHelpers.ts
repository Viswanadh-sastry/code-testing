import { AuthModel } from './_models';

const DOMAIN_AUTH_LOCAL_STORAGE_KEY = 'rapid-domain-auth'
const DOMAIN_LOCAL_STORAGE_KEY = 'rapid-domain'
const getDAuth = (): AuthModel | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(DOMAIN_AUTH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const auth: AuthModel = JSON.parse(lsValue) as AuthModel
        if (auth) {
            // You can easily check auth_token expiration also
            return auth
        }
    } catch (error) {
        console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setDAuth = (auth: AuthModel) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(auth)
        localStorage.setItem(DOMAIN_AUTH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeDAuth = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(DOMAIN_AUTH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const getDomain = (): any => {
    if (!localStorage) {
        return '';
    }

    const lsValue: string | null = localStorage.getItem(DOMAIN_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return '';
    }

    try {
        const domain: any = JSON.parse(lsValue)
        if (domain) {
            // You can easily check auth_token expiration also
            return domain
        }
    } catch (error) {
        console.error('DOMAIN LOCAL STORAGE PARSE ERROR', error)
    }
}

const setDomain = (domain: any) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(domain)
        localStorage.setItem(DOMAIN_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('DOMAIN LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeDomain = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(DOMAIN_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('DOMAIN LOCAL STORAGE REMOVE ERROR', error)
    }
}

export { getDAuth, setDAuth, removeDAuth, getDomain, setDomain, removeDomain, DOMAIN_AUTH_LOCAL_STORAGE_KEY, DOMAIN_LOCAL_STORAGE_KEY }
