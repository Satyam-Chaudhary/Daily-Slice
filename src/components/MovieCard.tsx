"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addMovieFavorite, removeMovieFavorite } from "@/store/favoriteMovieSlice";
import type { Movie } from "@/store/tmdbApiSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

export default function MovieCard({ movie }: { movie: Movie }) {
  const dispatch = useDispatch();
  const fallbackImageUrl = "https://image.tmdb.org/t/p/w600_and_h900_bestv2/wjtxgr7yHM8aTVOhlUSycfVTspI.jpg";
  

  const [imageUrl, setImageUrl] = useState(
    movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImageUrl
  );

  const isFavorite = useSelector((state: RootState) => 
    state.favoriteMovies.movies.some(favMovie => favMovie.id === movie.id)
  );

  useEffect(() => {
    setImageUrl(
      movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImageUrl
    );
  }, [movie.poster_path]);

  const handleImageError = () => {
    if (imageUrl !== fallbackImageUrl) {
      setImageUrl(fallbackImageUrl);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeMovieFavorite(movie));
    } else {
      dispatch(addMovieFavorite(movie));
    }
  };

  return (
    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" className="block relative group">
      <Card className="overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
        <CardContent className="p-0">
          <img
            src={imageUrl}
            onError={handleImageError}
            alt={`Poster for ${movie.title}`}
            className="w-full h-auto object-cover"
          />
        </CardContent>
      </Card>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-2 right-2 h-9 w-9 opacity-80 group-hover:opacity-100 transition-opacity"
        onClick={handleToggleFavorite}
        aria-label="Toggle Favorite"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorite
              ? "fill-red-500 stroke-red-500"
              : "stroke-muted-foreground"
          }`}
        />
      </Button>
    </a>
  );
}