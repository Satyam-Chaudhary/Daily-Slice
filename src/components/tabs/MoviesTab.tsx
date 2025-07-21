"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
} from "@/store/tmdbApiSlice";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoviesTab() {
  const movieFeedType = useSelector(
    (state: RootState) => state.preferences.movieFeedType
  );

  const { data: trendingMoviesData, isLoading: isTrendingLoading } =
    useGetTrendingMoviesQuery(undefined, {
      skip: movieFeedType !== "trending",
    });

  const { data: topRatedMoviesData, isLoading: isTopRatedLoading } =
    useGetTopRatedMoviesQuery(undefined, {
      skip: movieFeedType !== "top_rated",
    });

  const moviesResponse =
    movieFeedType === "trending" ? trendingMoviesData : topRatedMoviesData;
  const isMoviesLoading =
    movieFeedType === "trending" ? isTrendingLoading : isTopRatedLoading;

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