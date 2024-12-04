import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = createAsyncThunk('user/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/users/login', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userName', response.data.name);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/users/register', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const updateUserProfile = createAsyncThunk('user/updateUserProfile', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/auth/users/profile/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: localStorage.getItem('userName') || null,
    users: [],
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    logout: (state) => {
      Object.assign(state, {
        currentUser: null,
        users: [],
        loading: false,
        error: null,
        isAuthenticated: false
      });
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
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
      }).addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        );
      })
    .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;