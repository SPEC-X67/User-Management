import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = createAsyncThunk('user/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/login', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userName', response.data.name);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/profile/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    users: [],
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.users = [];
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload;
        state.isAuthenticated = false;
      })
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
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;