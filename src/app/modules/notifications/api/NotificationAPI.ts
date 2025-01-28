import axios from "axios";
import { getVaultToken } from "../../auth/core/VaultHelpers";

const API_URL = import.meta.env.VITE_APP_NOTIFICATION_API_URL;

export async function addNotification(data: any) {
    const response = await axios.post(`${API_URL}/notification`, data, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getNotificationByCategory(category: string) {
    const response = await axios.get(`${API_URL}/notification/category/${category}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getNotificationByLabel(label: string) {
    const response = await axios.get(`${API_URL}/notification/label/${label}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getNotification(data: any) {
    const query = searchNotification(data);
    const response = await axios.get(`${API_URL}/notification/${query}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function getNotificationBySubscription(name: string) {
    const response = await axios.get(`${API_URL}/notification/subscription/name/${name}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteNotificationByAge(age: string) {
    const response = await axios.delete(`${API_URL}/notification/age/${age}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

export async function deleteNotificationById(id: string) {
    const response = await axios.delete(`${API_URL}/notification/id/${id}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}

const searchNotification = (data: any) => {
    let query = "";
    if (data.from) {
        query += `start/${data.from}/end/${data.to}`;
    } else {
        query += `status/${data.status}`;
    }
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    return query;
}