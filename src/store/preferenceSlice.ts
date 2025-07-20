import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of this slice's state
interface PreferencesState {
  categories: string[];
}

// Set the initial state with some default categories
const initialState: PreferencesState = {
  categories: ['business', 'technology'],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = preferencesSlice.actions;
export default preferencesSlice.reducer;