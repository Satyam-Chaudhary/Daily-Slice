"use client";

import { useState, useEffect } from "react";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "@/store/favoriteSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import type { Article } from "@/store/apiSlice";
import { Heart } from "lucide-react";

export default function ContentCard({ article }: { article: Article }) {
  const dispatch = useDispatch();
  const fallbackImageUrl =
    "https://allroundclub.com/blog/wp-content/uploads/2021/10/how-to-draw-pikachu.png";
  const [imageUrl, setImageUrl] = useState(
    article.urlToImage || fallbackImageUrl
  );

  const isFavorite = useSelector((
    state: RootState //check if card is fav or not
  ) =>
    state.favorites.articles.some(
      (favArticle) => favArticle.url === article.url
    )
  );

  useEffect(() => {
    setImageUrl(article.urlToImage || fallbackImageUrl);
  }, [article.urlToImage]);

  const handleImageError = () => {
    if (imageUrl !== fallbackImageUrl) {
      setImageUrl(fallbackImageUrl);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(article));
    } else {
      dispatch(addFavorite(article));
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
        <CardDescription>{article.source.name}</CardDescription>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            aria-label="Toggle Favorite"
          >
            <Heart
              className={`h-6 w-6 transition-colors ${
                isFavorite
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <img
          src={imageUrl}
          onError={handleImageError}
          alt={article.title}
          className="rounded-md mb-4 w-full h-40 object-cover bg-muted"
        />
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description || "No description available for this article."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
