import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getThingChannelList(id: string, data: any) {
    const query = searchThingChannel(data);
    const response = await axios.get(`${API_URL}/things/${id}/channels${query}`);
    return response.data;
}

export async function connectThingChannel(thingId: string, channelId: string) {
    const response = await axios.post(`${API_URL}/channels/${channelId}/things/${thingId}/connect`);
    return response.data;
}

export async function disconnectThingChannel(thingId: string, channelId: string | undefined) {
    const response = await axios.post(`${API_URL}/channels/${channelId}/things/${thingId}/disconnect`);
    return response.data;
}

export async function getThingChannel(id: string) {
    const response = await axios.get(`${API_URL}/things/${id}`);
    return response.data;
}

export async function disableThingChannel(id: string) {
    const response = await axios.post(`${API_URL}/things/${id}/disable`);
    return response.data;
}

export async function enableThingChannel(id: string) {
    const response = await axios.post(`${API_URL}/things/${id}/enable`);
    return response.data;
}

export async function updateThingChannel(id: string, thing: any) {
    const response = await axios.patch(`${API_URL}/things/${id}`, thing);
    return response.data;
}

const searchThingChannel = (data: any) => {
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