import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import { newsApiSlice } from './newsApiSlice';
import { tmdbApiSlice } from './tmdbApiSlice';
import preferencesReducer from './preferencesSlice';
import favoritesNewsReducer from './favoriteNewsSlice';
import favoriteMoviesReducer from './favoriteMovieSlice';
import favoriteSocialPostsReducer from './favoriteSocialPostsSlice';
import { socialApiSlice } from './socialApiSlice';
import loadingReducer from './loadingSlice'


export const store = configureStore({
  reducer: {
    ui: uiReducer,
    preferences: preferencesReducer,
    favoritesNews: favoritesNewsReducer,
    favoriteMovies: favoriteMoviesReducer,
    favoriteSocialPosts: favoriteSocialPostsReducer,
    loading: loadingReducer,
    [newsApiSlice.reducerPath]: newsApiSlice.reducer,
    [tmdbApiSlice.reducerPath]: tmdbApiSlice.reducer,
    [socialApiSlice.reducerPath]: socialApiSlice.reducer,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat(newsApiSlice.middleware).concat(tmdbApiSlice.middleware).concat(socialApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;