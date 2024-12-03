import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching all users
export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  );

// Async thunk for registering a new user
export const addUser = createAsyncThunk(
    'admin/addUser',
    async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/admin/users', userData);
            return response.data.user; // Return just the user data
        } catch (error) {
            throw error.response.data;
        }
    }
);


const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null,
        isAuthenticated: false,
        currentAdmin: null
    },
    reducers: {
        logout: (state) => {
            state.currentAdmin = null;
            state.isAuthenticated = false;
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
        }
    },
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
                state.error = action.error.message;
            });
    }
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;