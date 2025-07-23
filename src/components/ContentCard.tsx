"use client";

import { useState, useEffect, forwardRef } from "react";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { addNewsFavorite, removeNewsFavorite } from "@/store/favoriteNewsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import type { Article } from "@/store/newsApiSlice";
import { Heart } from "lucide-react";
import { motion } from "framer-motion"; 
import { cn } from "@/lib/utils";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ContentCard = forwardRef<HTMLDivElement, { article: Article, layoutType?: 'grid' | 'masonry' }>(
  ({ article, layoutType = 'masonry' }, ref) => {
  const dispatch = useDispatch();
  const fallbackImageUrl =
    "/fallback.png"
  const [imageUrl, setImageUrl] = useState(
    article.urlToImage || fallbackImageUrl
  );

  const isFavorite = useSelector((
    state: RootState //check if card is fav or not
  ) =>
    state.favoritesNews.articles.some(
      (favArticle) => favArticle.url === article.url
    )
  );

  useEffect(() => {
    setImageUrl(article.urlToImage || fallbackImageUrl);
  }, [article.urlToImage]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeNewsFavorite(article));
    } else {
      dispatch(addNewsFavorite(article));
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={cn({ 'h-full': layoutType === 'grid' })}
    >
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
              <CardDescription>{article.source.name}</CardDescription>
            </div>
          </div>
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
     <CardContent className="flex-grow flex flex-col">
          <div className="relative w-full h-40 mb-4">
            <Image
              src={imageUrl}
              alt={article.title}
              className="rounded-md object-cover"
              fill={true}
              unoptimized={true} // Allows images from any domain
            />
          </div>
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
    </motion.div>
  );
});

ContentCard.displayName = 'ContentCard';
export default ContentCard;

