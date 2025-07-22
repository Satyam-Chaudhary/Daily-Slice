"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSearchNewsQuery } from '@/store/newsApiSlice';
import { useSearchMoviesQuery } from '@/store/tmdbApiSlice';
import { useGetSocialPostsQuery } from '@/store/socialApiSlice';
import ContentCard from '@/components/ContentCard';
import MovieCard from '@/components/MovieCard';
import SocialPostCard from '@/components/SocialPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  //data fetching
  const { data: news, isFetching: isNewsFetching } = useSearchNewsQuery(query!, {
    skip: !query,
  });
  const { data: movies, isFetching: isMoviesFetching } = useSearchMoviesQuery(query!, {
    skip: !query,
  });
  const { data: allSocialPosts, isLoading: isSocialLoading } = useGetSocialPostsQuery();

  // social media - mock api therefore using filter
  const filteredSocialPosts = useMemo(() => {
    if (!query || !allSocialPosts) return [];
    return allSocialPosts.filter(
      (post) =>
        post.text.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allSocialPosts]);

  // no search query
  if (!query) {
    return (
      <MainLayout>
        <h2 className="text-3xl font-bold">Search</h2>
        <p className="text-muted-foreground mt-2">
          Please enter a term in the search bar above to find content.
        </p>
      </MainLayout>
    );
  }

 

  const newsResults = isNewsFetching ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
    </div>
  ) : news?.articles && news.articles.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.articles.map(article => <ContentCard key={article.url} article={article} />)}
    </div>
  ) : (
    <p className="text-muted-foreground pt-8 text-center">No news articles found.</p>
  );

  const movieResults = isMoviesFetching ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[300px] w-full" />)}
    </div>
  ) : movies?.results && movies.results.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.results.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  ) : (
    <p className="text-muted-foreground pt-8 text-center">No movies found.</p>
  );

  const socialResults = isSocialLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[180px] w-full" />)}
    </div>
  ) : filteredSocialPosts.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSocialPosts.map(post => <SocialPostCard key={post.id} post={post} />)}
    </div>
  ) : (
    <p className="text-muted-foreground pt-8 text-center">No social posts found.</p>
  );

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold">Search Results for "{query}"</h2>
      
      <Tabs defaultValue="news" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>
        <TabsContent value="news" className="mt-6">{newsResults}</TabsContent>
        <TabsContent value="movies" className="mt-6">{movieResults}</TabsContent>
        <TabsContent value="social" className="mt-6">{socialResults}</TabsContent>
      </Tabs>
    </MainLayout>
  );
}