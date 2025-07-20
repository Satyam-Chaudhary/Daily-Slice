"use client";

import MainLayout from "@/components/MainLayout";
import ContentCard from "@/components/ContentCard";
import { useGetNewsQuery } from "@/store/apiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";


export default function HomePage() {
  const categories = useSelector((state: RootState) => state.preferences.categories);
  const primaryCategory = categories[0] || 'general';
  const selectedCategory = categories[0] || 'general';

  const {
    data: news,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetNewsQuery(primaryCategory);

  const formatPageTitle = () => {
    if (categories.length === 0) return "General";
    if (categories.length === 1) return categories[0];
    if (categories.length === 2) return categories.join(' & ');
    return `${categories.slice(0, 2).join(', ')}...`;
  };

  let content;
  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
           <div key={i} className="flex flex-col space-y-3">
             <Skeleton className="h-[125px] w-full rounded-xl" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-[200px]" />
             </div>
           </div>
        ))}
      </div>
    );
  } else if (isSuccess && news.articles.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.articles.filter(Boolean).map((article) => (
          <ContentCard key={article.url} article={article} />
        ))}
      </div>
    );
  } else if (isError) {
    content = <p className="text-destructive">Error fetching news. Please check your API key and try again.</p>;
  } else {
    content = <p>No articles found for the selected category.</p>;
  }

  return (
    <MainLayout isFetching={isFetching && !isLoading}>
      <h2 className="text-3xl font-bold mb-4 capitalize">
        Top Stories in {formatPageTitle()}
      </h2>
      {content}
    </MainLayout>
  );
}