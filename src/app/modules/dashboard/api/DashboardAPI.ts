import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getDashboardList(data: any) {
    const query = searchDashboard(data);
    const response = await axios.get(`${API_URL}/dashboard${query}`);
    return response.data;
}

export async function getDashboard(id: string) {
    const response = await axios.get(`${API_URL}/dashboard/${id}`);
    return response.data;
}

const searchDashboard = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    if (data.name) {
        if (query) {
            query += `&name=${data.name}`;
        } else {
            query += `?name=${data.name}`;
        }
    }
    if (data.metadata) {
        if (query) {
            query += `&metadata=${data.metadata}`;
        } else {
            query += `?metadata=${data.metadata}`;
        }
    }
    if (query) {
        query += `&status=${data.status}`;
    } else {
        query += `?status=${data.status}`;
    }
    return query;
}