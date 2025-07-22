import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Article {
    source: { id: string | null; name: string; };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

const NEWS_API_BASE_URL = "https://newsapi.org/v2/";

export const newsApiSlice = createApi({
    reducerPath: "newsApi",
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
        getNews: builder.query<NewsApiResponse, { category: string; page: number }>({
            query: ({ category, page = 1 }) => `top-headlines?country=us&category=${category}&page=${page}`,
            serializeQueryArgs: ({ queryArgs }) => {
                const { category } = queryArgs;
                return { category };
            },
            // This is the key that was missing.
            // It tells RTK Query to ALWAYS refetch if the page number is different.
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
            merge: (currentCache, newItems) => {
                const existingUrls = new Set(currentCache.articles.map(a => a.url));
                
                // Filter out any new items that are already in the cache
                const uniqueNewItems = newItems.articles.filter(a => !existingUrls.has(a.url));
                
                // Push only the unique new items to the cache
                currentCache.articles.push(...uniqueNewItems);
            },
        }),
        searchNews: builder.query<NewsApiResponse, string>({
            query: (searchTerm) => `everything?q=${searchTerm}&sortBy=popularity`,
        }),
    }),
});

export const { useGetNewsQuery, useSearchNewsQuery } = newsApiSlice;