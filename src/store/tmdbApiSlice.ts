import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

interface TmdbApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export const tmdbApiSlice = createApi({
    reducerPath: "tmdbApi", 
    baseQuery: fetchBaseQuery({ baseUrl: TMDB_API_BASE_URL }), 
    endpoints: (builder) => ({
        getTrendingMovies: builder.query<TmdbApiResponse, void>({
            query: () => `/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        }),
    }),
});

export const { useGetTrendingMoviesQuery } = tmdbApiSlice;