import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getDomainList(data: any) {
    const query = searchDomain(data);
    const response = await axios.get(`${API_URL}/domains?limit=${data.limit}&offset=${data.offset}${query}`);
    return response.data;
}

export async function createDomain(data: any) {
    const response = await axios.post(`${API_URL}/domains`, data);
    return response.data;
}

const searchDomain = (data: any) => {
    let query = "";
    if (data.name) {
        query += `&name=${data.name}`;
    }
    if (data.permission) {
        query += `&permission=${data.permission}`;
    }
    if (data.status) {
        query += `&status=${data.status}`;
    }
    return query;
}
