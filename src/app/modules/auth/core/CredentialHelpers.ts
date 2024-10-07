import { CredentialModel } from './_models';

const CRED_LOCAL_STORAGE_KEY = 'rapid-credential'
const getCred = (): CredentialModel | undefined => {
    if (!localStorage) {
        return
    }

    const lsValue: string | null = localStorage.getItem(CRED_LOCAL_STORAGE_KEY)
    if (!lsValue) {
        return
    }

    try {
        const auth: CredentialModel = JSON.parse(lsValue) as CredentialModel
        if (auth) {
            auth.secret = decryptPassword(auth.secret)
            return auth
        }
    } catch (error) {
        console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
    }
}

const setCred = (auth: CredentialModel) => {
    if (!localStorage) {
        return
    }

    try {
        auth.secret = encryptPassword(auth.secret)
        const lsValue = JSON.stringify(auth)
        localStorage.setItem(CRED_LOCAL_STORAGE_KEY, lsValue)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
    }
}

const removeCred = () => {
    if (!localStorage) {
        return
    }

    try {
        localStorage.removeItem(CRED_LOCAL_STORAGE_KEY)
    } catch (error) {
        console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
    }
}

const encryptPassword = (password: string): string => {
    // You can use any encryption algorithm from plain text to base64, sha256, md5, etc.
    const encryptedPassword = btoa(password);
    return encryptedPassword;
}

const decryptPassword = (encryptedPassword: string): string => {
    // You can use any decryption algorithm from base64 to plain text, sha256, md5, etc.
    const decryptedPassword = atob(encryptedPassword);
    return decryptedPassword;
}

export { getCred, setCred, removeCred, CRED_LOCAL_STORAGE_KEY }
