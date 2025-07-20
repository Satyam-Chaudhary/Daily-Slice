"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import MainLayout from "@/components/MainLayout";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const favoriteArticles = useSelector((state: RootState) => state.favorites.articles); // favorited array

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Your Favorites</h2>
        <p className="text-muted-foreground">
          All the articles you've saved in one place.
        </p>
      </div>

      {favoriteArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteArticles.map((article) => (
            <ContentCard key={article.url} article={article} />
          ))}
        </div>
      ) : (
        //if no favorite display err
        
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 mt-16 ">
          <h3 className="text-xl font-semibold">Nothing to see here... yet.</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Click the heart icon on any article to save it to this list.
          </p>
          <Button asChild>
            <Link href="/">Browse Articles</Link>
          </Button>
        </div>
        
      )}
    </MainLayout>
  );
}