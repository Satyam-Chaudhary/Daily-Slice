"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import MainLayout from "@/components/MainLayout";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import MovieCard from "@/components/MovieCard";
import SocialPostCard from "@/components/SocialPostCard";

export default function FavoritesPage() {
  const favoriteArticles = useSelector((state: RootState) => state.favoritesNews.articles); // favorited array
  const favoriteMovies = useSelector((state: RootState) => state.favoriteMovies.movies);
  const favoriteSocialPosts = useSelector((state: RootState) => state.favoriteSocialPosts.posts);


  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Your Favorites</h2>
        <p className="text-muted-foreground">
          All the slices you've saved in one place.
        </p>
      </div>

      {favoriteArticles.length === 0 && favoriteMovies.length === 0 && favoriteSocialPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 mt-16">
          <h3 className="text-xl font-semibold">Nothing to see here... yet.</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Click the heart icon on any article or movie to save it to this list.
          </p>
          <Button asChild>
            <Link href="/">Browse Content</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
           {favoriteSocialPosts.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">Favorite Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteSocialPosts.map((post) => (
                  <SocialPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )
        }
          {favoriteArticles.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">Favorite Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteArticles.map((article) => (
                  <ContentCard key={article.url} article={article} />
                ))}
              </div>
            </section>
          )}

          {favoriteMovies.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">Favorite Movies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </MainLayout>
  );
}