import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  refetchingCount: number;
}

const initialState: LoadingState = {
  refetchingCount: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startRefetch: (state) => {
      state.refetchingCount++;
    },
    endRefetch: (state) => {
      state.refetchingCount--;
    },
  },
});

export const { startRefetch, endRefetch } = loadingSlice.actions;
export default loadingSlice.reducer;