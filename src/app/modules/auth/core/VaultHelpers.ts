const VAULT_AUTH_LOCAL_STORAGE_KEY = 'rapid-vault-auth'
const getVaultToken = (): string | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(VAULT_AUTH_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const vaultToken: string = JSON.parse(lsValue) as string
        if (vaultToken) {
            // You can easily check id_token expiration also
            return vaultToken
        }
    } catch (error) {
        console.error('VAULT TOKEN LOCAL STORAGE PARSE ERROR', error)
    }
}

const setVaultToken = (vaultToken: string) => {
    if (!localStorage) {
        return
    }

    try {
        const lsValue = JSON.stringify(vaultToken)
        localStorage.setItem(VAULT_AUTH_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('VAULT TOKEN LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeVaultToken = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(VAULT_AUTH_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('VAULT LOCAL STORAGE REMOVE ERROR', error)
    }
}

export { getVaultToken, setVaultToken, removeVaultToken, VAULT_AUTH_LOCAL_STORAGE_KEY }
