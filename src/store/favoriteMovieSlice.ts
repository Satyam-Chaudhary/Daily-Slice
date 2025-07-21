import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Movie } from './tmdbApiSlice'; // Import the Movie type


interface FavoriteMoviesState {
  movies: Movie[];
}

const initialState: FavoriteMoviesState = {
  movies: [],
};

const favoriteMoviesSlice = createSlice({
  name: 'favoriteMovies',
  initialState,
  reducers: {
    addMovieFavorite: (state, action: PayloadAction<Movie>) => {
      state.movies.unshift(action.payload);
    },
    removeMovieFavorite: (state, action: PayloadAction<Movie>) => {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload.id
      );
    },
  },
});

export const { addMovieFavorite, removeMovieFavorite } = favoriteMoviesSlice.actions;

export default favoriteMoviesSlice.reducer;