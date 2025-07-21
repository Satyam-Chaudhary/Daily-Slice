"use client";

import { useGetSocialPostsQuery } from "@/store/socialApiSlice";
import SocialPostCard from "@/components/SocialPostCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SocialTab() {
  const { data: socialPosts, isLoading: isSocialLoading } =
    useGetSocialPostsQuery();
    
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">From Your Network</h2>
      {isSocialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPosts?.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}