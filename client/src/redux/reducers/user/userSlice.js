import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/users/login', credentials);
            // Store token and user name in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userName', response.data.name);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
    'user/registerUser',
    async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/users/register', userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        users: [],
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;