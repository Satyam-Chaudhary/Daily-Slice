"use client";

import MainLayout from "@/components/MainLayout";
import ContentCard from "@/components/ContentCard";
import MovieCard from "@/components/MovieCard";
import SocialPostCard from "@/components/SocialPostCard";
import { useGetNewsQuery } from "@/store/newsApiSlice";
import { useGetTrendingMoviesQuery } from "@/store/tmdbApiSlice";
import { useGetSocialPostsQuery } from "@/store/socialApiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const categories = useSelector(
    (state: RootState) => state.preferences.categories
  );
  const primaryCategory = categories[0] || "general";

  const {
    data: news,
    isLoading: isNewsLoading,
    isFetching: isNewsFetching,
    isSuccess: isNewsSuccess,
    isError: isNewsError,
  } = useGetNewsQuery(primaryCategory);

  const { data: moviesResponse, isLoading: isMoviesLoading } =
    useGetTrendingMoviesQuery();

  const { data: socialPosts, isLoading: isSocialLoading } =
    useGetSocialPostsQuery();

  const formatPageTitle = () => {
    if (categories.length === 0) return "General";
    if (categories.length === 1) return categories[0];
    if (categories.length === 2) return categories.join(" & ");
    return `${categories.slice(0, 2).join(", ")}...`;
  };


  const socialSection = (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4">From Your Network</h2>
      {isSocialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
             <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPosts?.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
  
  const newsSection = (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4 capitalize">
        Top Stories in {formatPageTitle()}
      </h2>
      {isNewsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isNewsError ? (
        <p className="text-destructive">Error fetching news.</p>
      ) : isNewsSuccess && news?.articles ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.articles.filter(Boolean).map((article) => (
            <ContentCard key={article.url} article={article} />
          ))}
        </div>
      ) : (
        <p>No articles found for this category.</p>
      )}
    </div>
  );

  const movieSection = (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4">Trending Movies This Week</h2>
      {isMoviesLoading ? (
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-[200px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {moviesResponse?.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );



  return (
     <MainLayout isFetching={isNewsFetching && !isNewsLoading}>
      <Tabs defaultValue="news" className="w-full">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Your Feed</h2>
            <TabsList>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="social" className="mt-6">{socialSection}</TabsContent>
        <TabsContent value="news" className="mt-6">{newsSection}</TabsContent>
        <TabsContent value="movies" className="mt-6">{movieSection}</TabsContent>
      </Tabs>
    </MainLayout>
  );
}