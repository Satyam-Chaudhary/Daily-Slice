import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  theme: 'dark', //default -> dark
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;