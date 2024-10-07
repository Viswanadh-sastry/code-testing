import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getProfile() {
    const response = await axios.get(`${API_URL}/users/profile`);
    return response.data;
}

export async function updateProfileTags(userId: string, tags: string[]) {
    const response = await axios.patch(`${API_URL}/users/${userId}/tags`, {
        tags,
    });
    return response.data;
}

export async function updateProfileIdentity(userId: string, identity: string) {
    const response = await axios.patch(`${API_URL}/users/${userId}/identity`, {
        identity,
    });
    return response.data;
}

export async function updateProfileRole(userId: string, role: string) {
    const response = await axios.patch(`${API_URL}/users/${userId}/role`, {
        role,
    });
    return response.data;
}

export async function updateProfile(userId: string, user: any) {
    const response = await axios.patch(`${API_URL}/users/${userId}`, user);
    return response.data;
}

export async function updateProfilePassword(data: any) {
    const response = await axios.patch(`${API_URL}/users/secret`, data);
    return response.data;
}

export async function disableUser(userId: string) {
    const response = await axios.post(`${API_URL}/users/${userId}/disable`);
    return response.data;
}

export async function enableUser(userId: string) {
    const response = await axios.post(`${API_URL}/users/${userId}/enable`);
    return response.data;
}
