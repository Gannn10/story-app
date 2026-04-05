const BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryAPI = {
    async register({ name, email, password }) {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        return await response.json();
    },

    async login({ email, password }) {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    },

    async getAllStories(token) {
        const response = await fetch(`${BASE_URL}/stories?location=1`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return await response.json();
    },

    async addStory(token, formData) {
        const response = await fetch(`${BASE_URL}/stories`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });
        return await response.json();
    }
};

export default StoryAPI;