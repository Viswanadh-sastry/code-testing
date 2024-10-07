import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getChannelGroupList(id: string, data: any) {
    const query = searchChannelGroup(data);
    const response = await axios.get(`${API_URL}/channels/${id}/groups${query}`);
    return response.data;
}

export async function createChannelGroup(id: string, data: any) {
    const response = await axios.post(`${API_URL}/channels/${id}/groups/assign`, data);
    return response.data;
}

export async function unassignChannelGroup(channelId: string, data: any) {
    const response = await axios.post(`${API_URL}/channels/${channelId}/groups/unassign`, data);
    return response.data;
}

export async function disableChannelGroup(id: string) {
    const response = await axios.post(`${API_URL}/channels/${id}/disable`);
    return response.data;
}

export async function enableChannelGroup(id: string) {
    const response = await axios.post(`${API_URL}/channels/${id}/enable`);
    return response.data;
}

export async function updateChannelGroup(id: string, thing: any) {
    const response = await axios.put(`${API_URL}/channels/${id}`, thing);
    return response.data;
}

export async function getGroupChannel(id: string) {
    const response = await axios.get(`${API_URL}/channels/${id}`);
    return response.data;
}



const searchChannelGroup = (data: any) => {
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