import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import { apiSlice } from './apiSlice';
import preferencesReducer from './preferenceSlice';
import favoritesReducer from './favoriteSlice'; 



export const store = configureStore({
  reducer: {
    ui: uiReducer,
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;