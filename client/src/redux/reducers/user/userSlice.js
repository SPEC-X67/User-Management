import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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