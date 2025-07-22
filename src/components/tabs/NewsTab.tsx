"use client";

import { useEffect } from "react";
import { useSelector, useDispatch} from "react-redux";
import type { RootState } from "@/store/store";
import { useGetNewsQuery } from "@/store/newsApiSlice";
import ContentCard from "@/components/ContentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { startRefetch, endRefetch } from "@/store/loadingSlice";

export default function NewsTab() {
  const dispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.preferences.categories
  );
  const primaryCategory = categories[0] || "general";

  const {
    data: news,
    isLoading: isNewsLoading,
    isSuccess: isNewsSuccess,
    isError: isNewsError,
    isFetching: isNewsFetching
  } = useGetNewsQuery(primaryCategory);

   useEffect(() => {
    if (isNewsFetching && !isNewsLoading) {
      dispatch(startRefetch());
      return () => {
        dispatch(endRefetch());
      };
    }
  }, [isNewsFetching, isNewsLoading, dispatch]);

  const formatPageTitle = () => {
    if (categories.length === 0) return "General";
    if (categories.length === 1) return categories[0];
    if (categories.length === 2) return categories.join(" & ");
    return `${categories.slice(0, 2).join(", ")}...`;
  };

  if (isNewsLoading || isNewsFetching) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4 capitalize">
          Top Stories in {formatPageTitle()}
        </h2>
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
      </div>
    );
  }

  if (isNewsError) {
    return <p className="text-destructive">Error fetching news.</p>;
  }

  if (isNewsSuccess && news?.articles) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4 capitalize">
          Top Stories in {formatPageTitle()}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.articles.filter(Boolean).map((article) => (
            <ContentCard key={article.url} article={article} />
          ))}
        </div>
      </div>
    );
  }
  
  return <p>No articles found for this category.</p>;
}