import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Article { //news article interface
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse { //interface of API response
    status: string;
    totalResults: number;
    articles: Article[];
}


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


const NEWS_API_BASE_URL = "https://newsapi.org/v2/";
 

export const newsApiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: NEWS_API_BASE_URL,
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
            if (apiKey) {
                headers.set("X-Api-Key", apiKey);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getNews: builder.query<NewsApiResponse, string>({
            // receives the category and returns the URL path and params
            query: (category) => `top-headlines?country=us&category=${category}`,
        }),
    }),
});

export const { useGetNewsQuery } = newsApiSlice; //hook for each endpoint done by rtk query
