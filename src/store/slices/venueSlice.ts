import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/interceptors/AxiosInterceptor";
import toast from "react-hot-toast";

export interface Venue {
    id: string;
    name: string;
    location: string;
    capacity: number;
    pricePerDay: number;
    description: string;
    image: string;
    latitude: number;
    longitude: number;
}

export interface VenueBooking {
    id: string;
    userId: string;
    venueId: string;
    startDate: string;
    endDate: string;
    status: string;
    services: {
        catering: number;
        decoration: number;
        photography: number;
        music: number;
    };
    guests: number;
    totalCost: number;
}

export interface SearchFilters {
    budget?: number;
    capacity?: number;
    startDate?: string;
    endDate?: string;
    location?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface SearchResults {
    venues: Venue[];
    pagination: Pagination;
}

export interface VenueState {
    venues: Venue[];
    venueDetails: Venue | null;
    searchResults: SearchResults;
    loading: boolean;
    error: string | null;
}

const initialState: VenueState = {
    venues: [],
    venueDetails: null,
    searchResults: {
        venues: [],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        },
    },
    loading: false,
    error: null,
};

const apiUrl = "http://localhost:3000/api/venues";

export const fetchVenues = createAsyncThunk<Venue[], void, { rejectValue: string }>(
    "venues/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: Venue[] }>(apiUrl);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch venues");
            return rejectWithValue(error.response?.data?.error || "Failed to fetch venues");
        }
    }
);

export const getVenueDetails = createAsyncThunk<Venue, string, { rejectValue: string }>(
    "venues/getVenueDetails",
    async (venueId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: Venue }>(`${apiUrl}/${venueId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch venue details");
            return rejectWithValue(error.response?.data?.error || "Failed to fetch venue details");
        }
    }
);

export const createVenue = createAsyncThunk<Venue, FormData, { rejectValue: string }>(
    "venues/createVenue",
    async (venueData: FormData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<{ data: Venue }>(apiUrl, venueData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Venue created successfully");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create venue");
            return rejectWithValue(error.response?.data?.error || "Failed to create venue");
        }
    }
);

export const updateVenue = createAsyncThunk<
    Venue,
    { venueId: string; venueData: Partial<Venue> },
    { rejectValue: string }
>(
    "venues/updateVenue",
    async ({ venueId, venueData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put<{ data: Venue }>(`${apiUrl}/${venueId}`, venueData);
            toast.success("Venue updated successfully");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update venue");
            return rejectWithValue(error.response?.data?.error || "Failed to update venue");
        }
    }
);

export const deleteVenue = createAsyncThunk<string, string, { rejectValue: string }>(
    "venues/deleteVenue",
    async (venueId: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${apiUrl}/${venueId}`);
            toast.success("Venue deleted successfully");
            return venueId;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete venue");
            return rejectWithValue(error.response?.data?.error || "Failed to delete venue");
        }
    }
);

export const searchVenues = createAsyncThunk<
    SearchResults,
    { filters: SearchFilters; page: number; limit: number },
    { rejectValue: string }
>(
    "venues/searchVenues",
    async ({ filters, page, limit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ data: SearchResults }>(`${apiUrl}/search`, {
                params: {
                    ...filters,
                    page,
                    limit,
                },
            });
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to search venues");
            return rejectWithValue(error.response?.data?.error || "Failed to search venues");
        }
    }
);

export const createBooking = createAsyncThunk<
    VenueBooking,
    {
        venueId: string;
        bookingData: FormData
    },
    { rejectValue: string }
>(
    "venues/createBooking",
    async ({ venueId, bookingData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await axiosInstance.post<{ data: VenueBooking }>(
                `${apiUrl}/${venueId}/book`,
                bookingData,
                config
            );
            toast.success("Booking created successfully");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create booking");
            return rejectWithValue(error.response?.data?.error || "Failed to create booking");
        }
    }
);

const venueSlice = createSlice({
    name: "venues",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVenues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVenues.fulfilled, (state, action: PayloadAction<Venue[]>) => {
                state.loading = false;
                state.venues = action.payload;
            })
            .addCase(fetchVenues.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch venues";
            })
            .addCase(getVenueDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVenueDetails.fulfilled, (state, action: PayloadAction<Venue>) => {
                state.loading = false;
                state.venueDetails = action.payload;
            })
            .addCase(getVenueDetails.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch venue details";
            })
            .addCase(createVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVenue.fulfilled, (state, action: PayloadAction<Venue>) => {
                state.loading = false;
                state.venues.push(action.payload);
            })
            .addCase(createVenue.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to create venue";
            })
            .addCase(updateVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVenue.fulfilled, (state, action: PayloadAction<Venue>) => {
                state.loading = false;
                const updatedVenue = action.payload;
                state.venues = state.venues.map((venue) =>
                    venue.id === updatedVenue.id ? updatedVenue : venue
                );
            })
            .addCase(updateVenue.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to update venue";
            })
            .addCase(deleteVenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVenue.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.venues = state.venues.filter((venue) => venue.id !== action.payload);
            })
            .addCase(deleteVenue.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete venue";
            })
            .addCase(searchVenues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchVenues.fulfilled, (state, action: PayloadAction<SearchResults>) => {
                state.loading = false;
                state.searchResults = action.payload;
                state.venues = action.payload.venues;
            })
            .addCase(searchVenues.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to search venues";
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action: PayloadAction<VenueBooking>) => {
                state.loading = false;
                console.log(action);
            })
            .addCase(createBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload || "Failed to create booking";
            });
    },
});

export default venueSlice.reducer;