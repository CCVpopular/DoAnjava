import axios from 'axios';

const API_URL = 'http://localhost:8080/api/messages';

const getPublicMessages = (token) => {
    return axios.get(`${API_URL}/public`, { headers: { Authorization: `Bearer ${token}` } });
};

const getPrivateMessages = (sender, receiver, token) => {
    return axios.get(`${API_URL}/private`, { params: { sender, receiver }, headers: { Authorization: `Bearer ${token}` } });
};

const savePublicMessage = (message, token) => {
    return axios.post(`${API_URL}/public`, message, { headers: { Authorization: `Bearer ${token}` } });
};

const savePrivateMessage = (message, token) => {
    return axios.post(`${API_URL}/private`, message, { headers: { Authorization: `Bearer ${token}` } });
};

const markAllMessagesAsRead = (sender, receiver, token) => {
    return axios.put(`${API_URL}/mark-read`, { sender, receiver }, { headers: { Authorization: `Bearer ${token}` } });
};
export default {
    getPublicMessages,
    getPrivateMessages,
    savePublicMessage,
    savePrivateMessage,
    markAllMessagesAsRead
};