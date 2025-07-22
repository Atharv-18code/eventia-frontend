import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import venueReducer from './slices/venueSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        event: eventReducer,
        venue: venueReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
