"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import type { RootState } from "@/store/store";
import {
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "@/store/tmdbApiSlice";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function MoviesTab() {
  const movieFeedType = useSelector((state: RootState) => state.preferences.movieFeedType);

  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevFeedTypeRef = useRef(movieFeedType);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Call both hooks, but use the `skip` option to disable the inactive one.
  const {
    data: trendingMoviesData,
    isLoading: isTrendingLoading,
    isFetching: isTrendingFetching,
    isSuccess: isTrendingSuccess,
    isError: isTrendingError,
  } = useGetTrendingMoviesQuery({ page }, { skip: movieFeedType !== 'trending' });

  const {
    data: topRatedMoviesData,
    isLoading: isTopRatedLoading,
    isFetching: isTopRatedFetching,
    isSuccess: isTopRatedSuccess,
    isError: isTopRatedError,
  } = useGetTopRatedMoviesQuery({ page }, { skip: movieFeedType !== 'top_rated' });

  //Consolidate the results into single variables for rendering.
  const moviesResponse = movieFeedType === 'trending' ? trendingMoviesData : topRatedMoviesData;
  const isMoviesLoading = movieFeedType === 'trending' ? isTrendingLoading : isTopRatedLoading;
  const isMoviesFetching = movieFeedType === 'trending' ? isTrendingFetching : isTopRatedFetching;
  const isSuccess = movieFeedType === 'trending' ? isTrendingSuccess : isTopRatedSuccess;
  const isError = movieFeedType === 'trending' ? isTrendingError : isTopRatedError;

 
  useEffect(() => {
    if (prevFeedTypeRef.current !== movieFeedType) {
      setPage(1);
      setHasReachedEnd(false);
      prevFeedTypeRef.current = movieFeedType;
    }
  }, [movieFeedType]);

  
  useEffect(() => {
    if (inView && !isMoviesFetching && !hasReachedEnd) {
      if (moviesResponse && moviesResponse.page < moviesResponse.total_pages) {
        setPage((prevPage) => prevPage + 1);
      } else if (moviesResponse) {
        setHasReachedEnd(true);
      }
    }
  }, [inView, isMoviesFetching, moviesResponse, hasReachedEnd]);
  
  const showSkeletons = isMoviesLoading || (isMoviesFetching && page === 1);

  if (showSkeletons) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4">
          {movieFeedType === "trending" ? "Trending Movies This Week" : "Top Rated Movies"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive">Error fetching movies.</p>;
  }

  if (isSuccess && moviesResponse?.results) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4">
          {movieFeedType === "trending" ? "Trending Movies This Week" : "Top Rated Movies"}
        </h2>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {moviesResponse.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
        <div ref={ref} className="flex justify-center items-center p-4 h-20">
          {isMoviesFetching && !showSkeletons && <Loader2 className="h-8 w-8 animate-spin" />}
          {hasReachedEnd && !isMoviesFetching && (
            <p className="text-sm text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    );
  }

  return <p>No movies found.</p>;
}