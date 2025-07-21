import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define and export the possible types for the movie feed
export type MovieFeedType = 'trending' | 'top_rated';

// Add the new preference to the state shape
interface PreferencesState {
  categories: string[];
  movieFeedType: MovieFeedType;
}

//Set the initial default value
const initialState: PreferencesState = {
  categories: ['technology', 'business'],
  movieFeedType: 'trending',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    //  Add a new reducer to update the movie feed preference
    setMovieFeedType: (state, action: PayloadAction<MovieFeedType>) => {
      state.movieFeedType = action.payload;
    },
  },
});

export const { setCategories, setMovieFeedType } = preferencesSlice.actions;

export default preferencesSlice.reducer;