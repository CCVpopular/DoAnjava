import axios from 'axios';

const API_URL = 'http://localhost:8080/api/messages';

const getPublicMessages = (token) => {
    return axios.get(`${API_URL}/public`, { headers: { Authorization: `Bearer ${token}` } });
};

export default {
    getPublicMessages,
};