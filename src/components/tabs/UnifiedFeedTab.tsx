"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { UnifiedCardData } from "@/types";
import { useGetNewsQuery } from "@/store/newsApiSlice";
import {
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "@/store/tmdbApiSlice";
import { useGetSocialPostsQuery } from "@/store/socialApiSlice";

import ContentCard from "@/components/ContentCard";
import MovieCard from "@/components/MovieCard";
import SocialPostCard from "@/components/SocialPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import Masonry from 'react-masonry-css';
import '@/styles/masonry.css';


// renders correct component based on type of card
const UnifiedCardRenderer = ({ item }: { item: UnifiedCardData }) => {
  switch (item.type) {
    case 'news':
      return <ContentCard article={item.originalData} />;
    case 'movie':
      return <MovieCard movie={item.originalData} />;
    case 'social':
      return <SocialPostCard post={item.originalData} />;
    default:
      return null;
  }
};

const breakpointColumnsObj = {
  default: 3,
  1024: 2, // 2 columns for screens smaller than 1024px
  640: 1,  // 1 column for screens smaller than 640px
};

export default function UnifiedFeedTab() {
  const categories = useSelector((state: RootState) => state.preferences.categories);
  const movieFeedType = useSelector((state: RootState) => state.preferences.movieFeedType);
  const primaryCategory = categories[0] || "general";

  // fetching data
  const { data: news, isLoading: isNewsLoading } = useGetNewsQuery(primaryCategory);
  const { data: trendingMoviesData, isLoading: isTrendingLoading } = useGetTrendingMoviesQuery(undefined, { skip: movieFeedType !== 'trending' });
  const { data: topRatedMoviesData, isLoading: isTopRatedLoading } = useGetTopRatedMoviesQuery(undefined, { skip: movieFeedType !== 'top_rated' });
  const { data: socialPosts, isLoading: isSocialLoading } = useGetSocialPostsQuery();
  
  const moviesResponse = movieFeedType === 'trending' ? trendingMoviesData : topRatedMoviesData;

  const unifiedFeed = useMemo(() => {
    if (!news?.articles || !moviesResponse?.results || !socialPosts) {
      return [];
    }
    const transformedNews: UnifiedCardData[] = news.articles.filter(Boolean).map((article) => ({ id: article.url, type: 'news', title: article.title, imageUrl: article.urlToImage || "", subtitle: article.source.name, url: article.url, originalData: article }));
    const transformedMovies: UnifiedCardData[] = moviesResponse.results.map((movie) => ({ id: `movie-${movie.id}`, type: 'movie', title: movie.title, imageUrl: movie.poster_path || "", subtitle: `Released: ${movie.release_date}`, url: `https://www.themoviedb.org/movie/${movie.id}`, originalData: movie }));
    const transformedSocial: UnifiedCardData[] = socialPosts.map((post) => ({ id: post.id, type: 'social', title: post.username, imageUrl: post.avatarUrl, subtitle: post.text, originalData: post }));
    let combinedFeed = [...transformedNews, ...transformedMovies, ...transformedSocial];

    // shuffle-algo
    for (let i = combinedFeed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combinedFeed[i], combinedFeed[j]] = [combinedFeed[j], combinedFeed[i]];
    }
    return combinedFeed;
  }, [news, moviesResponse, socialPosts]);

  const isLoading = isNewsLoading || isTrendingLoading || isTopRatedLoading || isSocialLoading;
  
  if (isLoading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
      )
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {unifiedFeed.map((item) => (
        <UnifiedCardRenderer key={item.id} item={item} />
      ))}
    </Masonry>
  );
}