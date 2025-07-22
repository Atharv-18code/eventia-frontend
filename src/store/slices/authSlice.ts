import { User } from '@/constants/types';
import axiosInstance from '@/interceptors/AxiosInterceptor';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    authenticated: boolean;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user')) || {
        preferences: {
            categories: ["Technical", "Music", "Sports", "Arts", "Science", "Business", "Health", "Food", "Fashion", "Travel"],
            budgetRange: 50000,
        },
    },
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    authenticated: localStorage.getItem('token') ? true : false,
};

const apiUrl = "http://localhost:3000/api/auth";

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${apiUrl}/login`, credentials);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const checkExistingUser = createAsyncThunk(
    'auth/checkExistingUser',
    async (userData: { email: string; }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${apiUrl}/check-user`, userData);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Signup failed');
            return rejectWithValue(error.response?.data?.error || 'Signup failed');
        }
    }
);

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: { name: string; email: string; password: string, preferences: { categories: string[], budgetRange: number } }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${apiUrl}/register`, userData);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Signup failed');
            return rejectWithValue(error.response?.data?.error || 'Signup failed');
        }
    }
);

export const logoutUser = createAsyncThunk(`${apiUrl}/logout`, async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        await axiosInstance.post(`${apiUrl}/logout`, {}, config);
        toast.success('User logged out');

        localStorage.removeItem('token');

        return null;
    } catch (error) {
        toast.error(error.response?.data?.error || 'Logout failed');
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
});

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${apiUrl}/forgot-password`, { email });
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset email');
            return rejectWithValue(error.response?.data?.error || 'Failed to send reset email');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data: { token: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${apiUrl}/reset-password`, data);
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to reset password');
            return rejectWithValue(error.response?.data?.error || 'Failed to reset password');
        }
    }
);

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.authenticated = true;

                localStorage.setItem('user', JSON.stringify(action.payload.data.user));
                localStorage.setItem('token', action.payload.data.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(checkExistingUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkExistingUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(checkExistingUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.authenticated = false;
                localStorage.clear();
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
