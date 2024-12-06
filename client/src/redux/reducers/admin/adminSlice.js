import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
    if (config.url === '/admin/login') return config;
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginAdmin = createAsyncThunk('admin/loginAdmin', 
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/login', userData);
            const { adminToken, name } = response.data;
            localStorage.setItem('adminToken', adminToken);
            localStorage.setItem('adminName', name);
            return response.data;
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
            const response = await api.post('/admin/users', userData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/users/edituser/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/admin/users/deleteuser/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
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
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAdmin = action.payload.name;
                state.isAuthenticated = true;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.currentAdmin = null;
            })

            // Get all users cases
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

            // Add user cases
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user) {
                    state.users.push(action.payload.user);
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update user cases
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user) {
                    const index = state.users.findIndex(user => user._id === action.payload.user._id);
                    if (index !== -1) {
                        state.users[index] = action.payload.user;
                    }
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete user cases
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.deletedUser) {
                    state.users = state.users.filter(user => user._id !== action.payload.deletedUser._id);
                }
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = adminSlice.actions;
export default adminSlice.reducer;