import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL;

export async function getInvitationList(data: any) {
    const query = searchInvitation(data);
    const response = await axios.get(`${API_URL}/invitations?limit=${data.limit}&offset=${data.offset}${query}`);
    return response.data;
}

export async function sendInvitation(data: any) {
    const response = await axios.post(`${API_URL}/invitations`, data);
    return response.data;
}

export async function getInvitation(userId: string, domainId: string) {
    const response = await axios.get(`${API_URL}/invitations/${userId}/${domainId}`);
    return response.data;
}

export async function deleteInvitation(userId: string, domainId: string) {
    const response = await axios.delete(`${API_URL}/invitations/${userId}/${domainId}`);
    return response.data;
}

export async function acceptInvitation(data: any) {
    const response = await axios.post(`${API_URL}/invitations/accept`, data);
    return response.data;
}

const searchInvitation = (data: any) => {
    let query = "";
    if (data.invited_by) {
        query += `&invited_by=${data.invited_by}`;
    }
    if (data.domain_id) {
        query += `&domain_id=${data.domain_id}`;
    }
    if (data.user_id) {
        query += `&user_id=${data.user_id}`;
    }
    if (data.relation) {
        query += `&relation=${data.relation}`;
    }
    if (data.state) {
        query += `&state=${data.state}`;
    }
    return query;
}
