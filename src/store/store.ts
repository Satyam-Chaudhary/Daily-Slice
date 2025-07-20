import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import { newsApiSlice } from './newsApiSlice';
import { tmdbApiSlice } from './tmdbApiSlice';
import preferencesReducer from './preferenceSlice';
import favoritesReducer from './favoriteSlice';
import { socialApiSlice } from './socialApiSlice';



export const store = configureStore({
  reducer: {
    ui: uiReducer,
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    [newsApiSlice.reducerPath]: newsApiSlice.reducer,
    [tmdbApiSlice.reducerPath]: tmdbApiSlice.reducer,
    [socialApiSlice.reducerPath]: socialApiSlice.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(newsApiSlice.middleware).concat(tmdbApiSlice.middleware).concat(socialApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;