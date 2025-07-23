import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

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

export const newsApiSlice = createApi({
    reducerPath: "newsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://newsapi.org/v2/",
        prepareHeaders: (headers) => {
            const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
            if (apiKey) headers.set("X-Api-Key", apiKey);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getNews: builder.query<NewsApiResponse, { category: string; page: number }>({
            async queryFn({ category, page = 1 }, _queryApi, _extraOptions, fetchWithBQ) {
                if (process.env.NODE_ENV === 'production') {
                    try {
                        const response = await fetch('/mocks/mock-news.json');
                        if (!response.ok) throw new Error('Failed to fetch mock news');
                        const allNews: NewsApiResponse = await response.json();
                        const pageSize = 20;
                        const start = (page - 1) * pageSize;
                        const end = start + pageSize;
                        const paginatedArticles = allNews.articles.slice(start, end);
                        return { data: { ...allNews, articles: paginatedArticles } };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                        return { error: { status: 'CUSTOM_ERROR', error: errorMessage } as FetchBaseQueryError };
                    }
                }
                
                // THE FIX: Explicitly handle the result of the live API call
                const result = await fetchWithBQ(`top-headlines?country=us&category=${category}&page=${page}`);
                if (result.error) {
                    return { error: result.error };
                }
                // Assert that the data is the correct type
                return { data: result.data as NewsApiResponse };
            },
            serializeQueryArgs: ({ queryArgs }) => ({ category: queryArgs.category }),
            forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
            merge: (currentCache, newItems) => {
                const existingUrls = new Set(currentCache.articles.map(a => a.url));
                const uniqueNewItems = newItems.articles.filter(a => !existingUrls.has(a.url));
                currentCache.articles.push(...uniqueNewItems);
            },
        }),
        searchNews: builder.query<NewsApiResponse, string>({
            async queryFn(searchTerm, _queryApi, _extraOptions, fetchWithBQ) {
                 if (process.env.NODE_ENV === 'production') {
                    try {
                        const response = await fetch('/mocks/mock-news.json');
                        if (!response.ok) throw new Error('Failed to fetch mock news');
                        const allNews: NewsApiResponse = await response.json();
                        const filteredArticles = allNews.articles.filter(article => 
                            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (article.description || '').toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        return { data: { ...allNews, articles: filteredArticles, totalResults: filteredArticles.length } };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                        return { error: { status: 'CUSTOM_ERROR', error: errorMessage } as FetchBaseQueryError };
                    }
                }
                
                // THE FIX: Apply the same robust pattern here
                const result = await fetchWithBQ(`everything?q=${searchTerm}&sortBy=popularity`);
                if (result.error) {
                    return { error: result.error };
                }
                return { data: result.data as NewsApiResponse };
            }
        }),
    }),
});

export const { useGetNewsQuery, useSearchNewsQuery } = newsApiSlice;