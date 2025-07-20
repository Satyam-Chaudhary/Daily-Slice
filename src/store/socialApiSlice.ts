import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export const socialApiSlice = createApi({
  reducerPath: "socialApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getSocialPosts: builder.query<SocialPost[], void>({
      query: () => `mock-social-data.json`,
    }),
  }),
});

export const { useGetSocialPostsQuery } = socialApiSlice;