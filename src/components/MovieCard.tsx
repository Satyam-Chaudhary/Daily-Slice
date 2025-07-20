import type { Movie } from "@/store/tmdbApiSlice";
import { Card, CardContent } from "@/components/ui/card";

export default function MovieCard({ movie }: { movie: Movie }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const fallbackImageUrl = "https://via.placeholder.com/500x750?text=No+Poster";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImageUrl;
  };

  return (
    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary transition-colors">
        <CardContent className="p-0">
          <img
            src={posterUrl}
            alt={`Poster for ${movie.title}`}
            onError={handleImageError}
            className="w-full h-auto object-cover"
          />
        </CardContent>
      </Card>
    </a>
  );
}