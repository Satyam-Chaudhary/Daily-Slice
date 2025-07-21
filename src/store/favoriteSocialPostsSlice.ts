import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SocialPost } from './socialApiSlice'; // Import the SocialPost type

interface FavoriteSocialPostsState {
  posts: SocialPost[];
}

const initialState: FavoriteSocialPostsState = {
  posts: [],
};

const favoriteSocialPostsSlice = createSlice({
  name: 'favoriteSocialPosts',
  initialState,
  reducers: {
    addSocialPostFavorite: (state, action: PayloadAction<SocialPost>) => {
      state.posts.unshift(action.payload);
    },
    removeSocialPostFavorite: (state, action: PayloadAction<SocialPost>) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload.id
      );
    },
  },
});

export const { addSocialPostFavorite, removeSocialPostFavorite } = favoriteSocialPostsSlice.actions;

export default favoriteSocialPostsSlice.reducer;