
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getGroupChannelList(id: any, data: any) {
    const query = searchGroupChannel(data);
    const response = await axios.get(`${API_URL}/groups/${id}/channels${query}`);
    return response.data;
}

export async function createGroupChannel(id: string, data: any) {
    const response = await axios.post(`${API_URL}/groups/${id}/channels/assign`, data);
    return response.data;
}

export async function unassignGroupChannel(groupId: string, data: any) {
    const response = await axios.post(`${API_URL}/groups/${groupId}/channels/unassign`, data);
    return response.data;
}

export async function getGroupChannel(id: string) {
    const response = await axios.get(`${API_URL}/groups/${id}`);
    return response.data;
}

const searchGroupChannel = (data: any) => {
    let query = "";
    if (data.limit) {
        query += `?limit=${data.limit}`;
    }
    if (data.offset) {
        query += `&offset=${data.offset}`;
    }
    if (query) {
        query += `&status=${data.status}`;
    } else {
        query += `?status=${data.status}`;
    }
    return query;
}