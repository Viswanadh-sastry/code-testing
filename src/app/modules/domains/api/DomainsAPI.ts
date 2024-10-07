import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getDomain(id: string) {
    const response = await axios.get(`${API_URL}/domains/${id}`);
    return response.data;
}

export async function disableDomain(id: string) {
    const response = await axios.post(`${API_URL}/domains/${id}/disable`);
    return response.data;
}

export async function enableDomain(id: string) {
    const response = await axios.post(`${API_URL}/domains/${id}/enable`);
    return response.data;
}

export async function updateDomain(id: string, domain: any) {
    const response = await axios.patch(`${API_URL}/domains/${id}`, domain);
    return response.data;
}
