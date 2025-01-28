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

export async function getNotificationByTimestamp(start: string, end: string) {
    const response = await axios.get(`${API_URL}/notification/start/${start}/end/${end}`, {
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

export async function getNotificationByStatus(status: string) {
    const response = await axios.get(`${API_URL}/notification/status/${status}`, {
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

export async function deleteNotification(age: string) {
    const response = await axios.delete(`${API_URL}/notification/age/${age}`, {
        headers: {
            'Authorization': `Bearer ${getVaultToken()}`,
        }
    });
    return response.data;
}