import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from './newsApiSlice'; // Import the Article type

interface FavoritesState {
  articles: Article[];
}

const initialState: FavoritesState = {
  articles: [],
};

const favoritesNewsSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addNewsFavorite: (state, action: PayloadAction<Article>) => {
      state.articles.unshift(action.payload);
    },
    removeNewsFavorite: (state, action: PayloadAction<Article>) => {
      state.articles = state.articles.filter(
        (article) => article.url !== action.payload.url
      );
    },
  },
});

export const { addNewsFavorite, removeNewsFavorite } = favoritesNewsSlice.actions;

export default favoritesNewsSlice.reducer;