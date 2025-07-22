import { Event } from '@/constants/types';
import axiosInstance from '@/interceptors/AxiosInterceptor';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

export interface EventState {
    events: Event[];
    eventDetails: Event | null;
    loading: boolean;
    error: string | null;
}

const initialState: EventState = {
    events: [],
    eventDetails: null,
    loading: false,
    error: null,
};

const apiUrl = "http://localhost:3000/api/events";

export const fetchPublicEvents = createAsyncThunk(
    'events/fetchPublic',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/public`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch events');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch events');
        }
    }
);

export const fetchUpcomingPublicEvents = createAsyncThunk(
    'events/fetchUpcomingPublic',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axiosInstance.get(`${apiUrl}/public/upcoming`, config);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch upcoming events');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch upcoming events');
        }
    }
);

export const getEventDetails = createAsyncThunk(
    'events/getEventDetails',
    async (eventId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${apiUrl}/${eventId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch event details');
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch event details');
        }
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchPublicEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUpcomingPublicEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUpcomingPublicEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchUpcomingPublicEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getEventDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.eventDetails = action.payload;
            })
            .addCase(getEventDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default eventSlice.reducer;
