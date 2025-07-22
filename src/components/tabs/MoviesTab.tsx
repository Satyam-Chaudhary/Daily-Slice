"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import {
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "@/store/tmdbApiSlice";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { startRefetch, endRefetch } from "@/store/loadingSlice";

export default function MoviesTab() {
  const dispatch = useDispatch();
  const movieFeedType = useSelector(
    (state: RootState) => state.preferences.movieFeedType
  );

  const { 
    data: trendingMoviesData, 
    isLoading: isTrendingLoading,
    isFetching: isTrendingFetching
  } = useGetTrendingMoviesQuery(undefined, {
      skip: movieFeedType !== "trending",
    });

  const { 
    data: topRatedMoviesData, 
    isLoading: isTopRatedLoading,
    isFetching: isTopRatedFetching
   } = useGetTopRatedMoviesQuery(undefined, {
      skip: movieFeedType !== "top_rated",
    });

  const moviesResponse =
    movieFeedType === "trending" ? trendingMoviesData : topRatedMoviesData;
  const isMoviesLoading =
    movieFeedType === "trending" ? isTrendingLoading : isTopRatedLoading;
  const isMovieFetching =
    movieFeedType === "trending" ? isTrendingFetching : isTopRatedFetching;

  useEffect(() => {
    if (isMovieFetching && !isMoviesLoading) {
      dispatch(startRefetch());
      return () => {
        dispatch(endRefetch());
      };
    }
  }, [isMovieFetching, isMoviesLoading, dispatch]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">
        {movieFeedType === "trending"
          ? "Trending Movies This Week"
          : "Top Rated Movies"}
      </h2>
      {isMoviesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
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
}