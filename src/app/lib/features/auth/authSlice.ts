// slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';

interface User {
  username: string;
}

interface AuthState {
  refreshToken: string | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  user: User | null
}

interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}


const BASE_URL = '/api';

const initialState: AuthState = {
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  status: 'idle',
  error: null,
  user: null,
};

export const login = createAsyncThunk<LoginResponse, { username: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/token/`, {
        username,
        password,
      });
      const { refresh, access, user } = response.data;
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('accessToken', access);
      return { refresh, access, user };
    } catch (error) {
      return rejectWithValue('Invalid username or password, try bm and kk(dummy)');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk<LoginResponse, { refreshToken: string }, { rejectValue: string }>(
  'auth/refreshToken',
  async ({ refreshToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const { refresh, access, user } = response.data;
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('accessToken', access);
      return { refresh, access, user };
    } catch (error) {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.refreshToken = null;
      state.accessToken = null;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.refreshToken = action.payload.refresh;
        state.accessToken = action.payload.access;
        state.user = action.payload.user;
        
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to login';
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.refreshToken = action.payload.refresh;
        state.accessToken = action.payload.access;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to refresh token';
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
