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
        getTrendingMovies: builder.query<TmdbApiResponse, { page: number }>({
            query: (args) => {
              const page = args?.page || 1;
              return `/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`;
            },
            serializeQueryArgs: ({ endpointName }) => endpointName,
            forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
            // Updated merge function to handle duplicates
            merge: (currentCache, newItems) => {
                const existingIds = new Set(currentCache.results.map(movie => movie.id));
                const uniqueNewMovies = newItems.results.filter(movie => !existingIds.has(movie.id));
                currentCache.results.push(...uniqueNewMovies);
            },
        }),
        getTopRatedMovies: builder.query<TmdbApiResponse, { page: number }>({
            query: (args) => {
              const page = args?.page || 1;
              return `/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`;
            },
            serializeQueryArgs: ({ endpointName }) => endpointName,
            forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
            merge: (currentCache, newItems) => {
                const existingIds = new Set(currentCache.results.map(movie => movie.id));
                const uniqueNewMovies = newItems.results.filter(movie => !existingIds.has(movie.id));
                currentCache.results.push(...uniqueNewMovies);
            },
        }),
        searchMovies: builder.query<TmdbApiResponse, string>({
            query: (searchTerm) => `/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}`,
        }),
    }),
});

export const { useGetTrendingMoviesQuery, useGetTopRatedMoviesQuery, useSearchMoviesQuery } = tmdbApiSlice;