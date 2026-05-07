import API from './api';

export const loginUser = async (email, password) => {
    try {
        const response = await API.post('/auth/login', { email, password });
        const data = response.data;
        
        // Store tokens with EXACT names
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_id', data.user_id.toString());
        
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

export const signupUser = async (name, email, password) => {
    try {
        const response = await API.post('/auth/signup', { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Signup failed' };
    }
};

export const logoutUser = () => {
    localStorage.clear();
    window.location.href = '/';
};

export const getCurrentUser = async () => {
    try {
        const response = await API.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch user' };
    }
};

export const getUsers = async () => {
    try {
        const response = await API.get('/auth/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch users' };
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

export const getUserRole = () => {
    return localStorage.getItem('user_role');
};