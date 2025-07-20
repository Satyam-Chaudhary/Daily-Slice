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


const NEWS_API_BASE_URL = "https://newsapi.org/v2/";


export const apiSlice = createApi({
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

export const { useGetNewsQuery } = apiSlice; //hook for each endpoint done by rtk query
