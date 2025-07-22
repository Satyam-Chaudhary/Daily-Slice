"use client";

import { useEffect, useState, useRef, forwardRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetNewsQuery } from "@/store/newsApiSlice";
import ContentCard from "@/components/ContentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This will make each card animate 0.1s after the previous one
    },
  },
};

export default function NewsTab() {
  const categories = useSelector(
    (state: RootState) => state.preferences.categories
  );
  const primaryCategory = categories[0] || "general";

  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const prevCategoryRef = useRef(primaryCategory);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const {
    data: news,
    isLoading: isNewsLoading,
    isSuccess: isNewsSuccess,
    isError: isNewsError,
    isFetching: isNewsFetching,
    error,
  } = useGetNewsQuery({ category: primaryCategory, page });

  useEffect(() => {
    if (prevCategoryRef.current !== primaryCategory) {
      setPage(1);
      setHasReachedEnd(false);
      prevCategoryRef.current = primaryCategory;
    }
  }, [primaryCategory]);

  useEffect(() => {
    if (error && "status" in error && error.status === 426) {
      setHasReachedEnd(true);
    }
  }, [error]);

  useEffect(() => {
    if (inView && !isNewsFetching && !hasReachedEnd) {
      if (news && news.articles.length < news.totalResults) {
        setPage((prevPage) => prevPage + 1);
      } else if (news) {
        // If totalResults is inaccurate, set the end state manually
        setHasReachedEnd(true);
      }
    }
  }, [inView, isNewsFetching, news, hasReachedEnd]);

  const formatPageTitle = () => {
    if (categories.length === 0) return "General";
    if (categories.length === 1) return categories[0];
    return `${categories.slice(0, 2).join(", ")}...`;
  };

  const showSkeletons = isNewsLoading || (isNewsFetching && page === 1);

  if (showSkeletons) {
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

  if (isNewsError && !(error && "status" in error && error.status === 426)) {
    return <p className="text-destructive">Error fetching news.</p>;
  }

  if (news?.articles && news.articles.length > 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4 capitalize">
          Top Stories in {formatPageTitle()}
        </h2>
         <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
          {news.articles.map((article) => (
            <ContentCard key={article.url} article={article} layoutType="grid" />
          ))}
        {/* </div> */}
        </motion.div>
        <div ref={ref} className="flex justify-center items-center p-4 h-20">
          {isNewsFetching && !showSkeletons && <Loader2 className="h-8 w-8 animate-spin" />}
          {hasReachedEnd && !isNewsFetching && (
            <p className="text-sm text-muted-foreground">You've reached the end.</p>
          )}
        </div>
      </div>
    );
  }

  return <p>No articles found for this category.</p>;
}
