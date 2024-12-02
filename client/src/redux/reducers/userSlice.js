import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching all users
export const getAllUsers = createAsyncThunk(
    'users/getAllUsers',
    async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/users');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
    'users/registerUser',
    async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/users', userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getAllUsers cases
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
                state.error = action.error.message;
            })
            // registerUser cases
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

export default userSlice.reducer;