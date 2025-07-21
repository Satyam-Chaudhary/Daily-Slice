import { createSlice , PayloadAction} from '@reduxjs/toolkit';

export type ActiveTab = 'news' | 'movies' | 'social';

export interface UiState {
  theme: 'light' | 'dark';
  activeTab: ActiveTab;
}

const initialState: UiState = {
  theme: 'dark', //default -> dark
  activeTab: 'news'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleTheme, setActiveTab} = uiSlice.actions;
export default uiSlice.reducer;