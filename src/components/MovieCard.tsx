"use client";

import { useState, useEffect, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addMovieFavorite, removeMovieFavorite } from "@/store/favoriteMovieSlice";
import type { Movie } from "@/store/tmdbApiSlice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MovieCard = forwardRef<HTMLAnchorElement, { movie: Movie, layoutType?: 'grid' | 'masonry' }>(({ movie, layoutType = 'masonry' }, ref) => {
  const dispatch = useDispatch();
  const fallbackImageUrl = "https://via.placeholder.com/500x750?text=No+Poster";  
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

  //  const handleImageError = () => {
  //   if (imageUrl !== fallbackImageUrl) {
  //     setImageUrl(fallbackImageUrl);
  //   }
  // };
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeMovieFavorite(movie));
    } else {
      dispatch(addMovieFavorite(movie));
    }
  };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <motion.a
      ref={ref}
      href={`https://www.themoviedb.org/movie/${movie.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group"
      variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className={cn("overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors bg-card", { 'h-full': layoutType === 'grid' })}>
        <CardContent className="p-0 relative aspect-[2/3]">
          <Image
            src={imageUrl}
            alt={`Poster for ${movie.title}`}
            className="object-cover rounded-md"
            fill={true}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </CardContent>
        <CardFooter className="p-2 flex items-center justify-between">
           <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{movie.title}</p>
            <p className="text-xs text-muted-foreground">{releaseYear}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={handleToggleFavorite}
            aria-label="Toggle Favorite"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite
                  ? "fill-red-500 stroke-red-500"
                  // Use a theme-aware color for the non-favorited state
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </CardFooter>
      </Card>
      {/* <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-80 transition-opacity"
        onClick={handleToggleFavorite}
        aria-label="Toggle Favorite"
      >
        <Heart
          className={`h-5 w-5 transition-colors ${
            isFavorite
              ? "fill-red-500 stroke-red-500"
              : "stroke-white" // Changed to white for better contrast
          }`}
        />
      </Button> */}
    </motion.a>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;