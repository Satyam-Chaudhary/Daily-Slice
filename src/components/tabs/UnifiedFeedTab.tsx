"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import type { RootState } from "@/store/store";
import type { UnifiedCardData } from "@/types";
import { useGetNewsQuery } from "@/store/newsApiSlice";
import { useGetTrendingMoviesQuery, useGetTopRatedMoviesQuery } from "@/store/tmdbApiSlice";
import { useGetSocialPostsQuery } from "@/store/socialApiSlice";

import ContentCard from "@/components/ContentCard";
import MovieCard from "@/components/MovieCard";
import SocialPostCard from "@/components/SocialPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import Masonry from 'react-masonry-css';
import '@/styles/masonry.css';
import { Loader2 } from "lucide-react";

const interleaveArrays = (arrays: UnifiedCardData[][]) => {
  const sources = arrays.filter(arr => arr.length > 0).map(arr => [...arr]);
  const result: UnifiedCardData[] = [];

  while (sources.some(arr => arr.length > 0)) {
    const availableSources = sources.filter(arr => arr.length > 0);
    
    const randomSourceIndex = Math.floor(Math.random() * availableSources.length);
    const selectedSource = availableSources[randomSourceIndex];
    
    if (selectedSource) {
      result.push(selectedSource.shift()!);
    }
  }
  
  return result;
};

const UnifiedCardRenderer = ({ item }: { item: UnifiedCardData }) => {
  switch (item.type) {
    case 'news': return <ContentCard article={item.originalData} />;
    case 'movie': return <MovieCard movie={item.originalData} />;
    case 'social': return <SocialPostCard post={item.originalData} />;
    default: return null;
  }
};

const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };

export default function UnifiedFeedTab() {
  const { categories, movieFeedType } = useSelector((state: RootState) => state.preferences);
  const primaryCategory = categories[0] || "general";

  const [pageNumbers, setPageNumbers] = useState({ news: 1, movies: 1 });
  const [hasMore, setHasMore] = useState({ news: true, movies: true });
  const { ref, inView } = useInView({ threshold: 0.5 });
  const isMounted = useRef(false);

  // --- Data Fetching ---
  const { data: news, isLoading: isNewsLoading, isFetching: isNewsFetching, isError: isNewsError } = useGetNewsQuery({ category: primaryCategory, page: pageNumbers.news });
  const { data: trendingMoviesData, isLoading: isTrendingLoading, isFetching: isTrendingFetching } = useGetTrendingMoviesQuery({ page: pageNumbers.movies }, { skip: movieFeedType !== 'trending' });
  const { data: topRatedMoviesData, isLoading: isTopRatedLoading, isFetching: isTopRatedFetching, isError: isMoviesError } = useGetTopRatedMoviesQuery({ page: pageNumbers.movies }, { skip: movieFeedType !== 'top_rated' });
  const { data: socialPosts, isLoading: isSocialLoading } = useGetSocialPostsQuery();

  const moviesResponse = movieFeedType === 'trending' ? trendingMoviesData : topRatedMoviesData;
  const isMoviesFetching = movieFeedType === 'trending' ? isTrendingFetching : isTopRatedFetching;
  
  const isMoviesLoading = movieFeedType === 'trending' ? isTrendingLoading : isTopRatedLoading;

  
  useEffect(() => {
    if (isMounted.current) {
      setPageNumbers({ news: 1, movies: 1 });
      setHasMore({ news: true, movies: true });
    } else {
      isMounted.current = true;
    }
  }, [primaryCategory, movieFeedType]);

  useEffect(() => {
    if (inView && !isNewsFetching && !isMoviesFetching) {
      if (hasMore.news && hasMore.movies) {
        setPageNumbers(p => p.news <= p.movies ? { ...p, news: p.news + 1 } : { ...p, movies: p.movies + 1 });
      } else if (hasMore.news) {
        setPageNumbers(p => ({ ...p, news: p.news + 1 }));
      } else if (hasMore.movies) {
        setPageNumbers(p => ({ ...p, movies: p.movies + 1 }));
      }
    }
  }, [inView, isNewsFetching, isMoviesFetching, hasMore]);
  
  useEffect(() => {
    if (isNewsError || (news && (news.articles.length >= news.totalResults || news.articles.length >= 100))) {
      setHasMore(h => ({ ...h, news: false }));
    }
    if (isMoviesError || (moviesResponse && moviesResponse.page >= moviesResponse.total_pages)) {
      setHasMore(h => ({ ...h, movies: false }));
    }
  }, [news, moviesResponse, isNewsError, isMoviesError]);

  // --- Memoized Feed Computation ---
  const unifiedFeed = useMemo(() => {
    if (!news || !moviesResponse || !socialPosts) {
        return [];
    }
    const transformedNews = (news.articles || []).filter(Boolean).map((article): UnifiedCardData => ({ id: article.url, type: 'news', title: article.title, imageUrl: article.urlToImage || "", subtitle: article.source.name, url: article.url, originalData: article }));
    const transformedMovies = (moviesResponse.results || []).map((movie): UnifiedCardData => ({ id: `movie-${movie.id}`, type: 'movie', title: movie.title, imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "", subtitle: `Released: ${movie.release_date}`, url: `https://www.themoviedb.org/movie/${movie.id}`, originalData: movie }));
    const transformedSocial = (socialPosts || []).map((post): UnifiedCardData => ({ id: post.id, type: 'social', title: post.username, imageUrl: post.avatarUrl, subtitle: post.text, originalData: post }));
    
    return interleaveArrays([transformedNews, transformedMovies, transformedSocial]);
  }, [news, moviesResponse, socialPosts]);

  // --- Render Logic ---
  const isInitialLoading = (isNewsLoading && pageNumbers.news === 1) || (isMoviesLoading && pageNumbers.movies === 1) || isSocialLoading;

  if (isInitialLoading && unifiedFeed.length === 0) {
    return ( 
      <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
      </Masonry> 
    );
  }

  const isFetchingMore = isNewsFetching || isMoviesFetching;
  const hasMoreContent = hasMore.news || hasMore.movies;

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {unifiedFeed.map((item) => (
          <UnifiedCardRenderer key={item.id} item={item} />
        ))}
      </Masonry>
      
      {/* This is the section for the loader at the bottom */}
      <div ref={ref} className="flex justify-center items-center p-4 h-20">
        {/* The spinner will show if we are fetching AND it's not the initial load */}
        {isFetchingMore && !isInitialLoading && (
            <Loader2 className="h-8 w-8 animate-spin" />
        )}
        {/* The "end" message will show if both feeds have run out of pages */}
        {!hasMoreContent && unifiedFeed.length > 0 && (
          <p className="text-sm text-muted-foreground">You've reached the end of all content.</p>
        )}
      </div>
    </>
  );
}