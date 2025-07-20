import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Article } from './newsApiSlice'; // Import the Article type

interface FavoritesState {
  articles: Article[];
}

const initialState: FavoritesState = {
  articles: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Article>) => {
      state.articles.unshift(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<Article>) => {
      state.articles = state.articles.filter(
        (article) => article.url !== action.payload.url
      );
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;