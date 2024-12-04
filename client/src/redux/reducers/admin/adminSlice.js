import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance with auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add request interceptor to always use latest token
api.interceptors.request.use((config) => {
    // Don't add auth header for login request
    if (config.url === '/admin/login') return config;
    
    config.headers = {
        ...config.headers,
        ...getAuthHeader()
    };
    return config;
});

export const loginAdmin = createAsyncThunk('admin/loginAdmin', 
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/login', userData);
            const { adminToken, name } = response.data;
            if (adminToken) {
                localStorage.setItem('adminToken', adminToken);
                localStorage.setItem('adminName', name);
                return response.data;
            }
            return rejectWithValue('Login failed: No token received');
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const addUser = createAsyncThunk(
    'admin/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/users', userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add user');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        currentAdmin: localStorage.getItem('adminName'),
        users: [],
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem('adminToken')
    },
    reducers: {
        logout: (state) => {
            state.currentAdmin = null;
            state.isAuthenticated = false;
            state.users = [];
            state.error = null;
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAdmin = action.payload.name;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.currentAdmin = null;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;