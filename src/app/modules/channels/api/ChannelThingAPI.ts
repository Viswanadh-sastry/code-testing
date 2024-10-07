import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getChannelThingList(id: string, data: any) {
    const query = searchChannel(data);
    const response = await axios.get(`${API_URL}/channels/${id}/things${query}`);
    return response.data;
}

export async function connectChannelThing(channelId: string, thingId: string) {
    const response = await axios.post(`${API_URL}/channels/${channelId}/things/${thingId}/connect`);
    return response.data;
}

export async function disconnectChannelThing(channelId: string, thingId: string | undefined) {
    const response = await axios.post(`${API_URL}/channels/${channelId}/things/${thingId}/disconnect`);
    return response.data;
}

const searchChannel = (data: any) => {
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