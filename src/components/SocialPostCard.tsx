"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addSocialPostFavorite, removeSocialPostFavorite } from "@/store/favoriteSocialPostsSlice";
import type { SocialPost } from "@/store/socialApiSlice";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle, Heart } from "lucide-react";

export default function SocialPostCard({ post }: { post: SocialPost }) {
  const dispatch = useDispatch();

  const isFavorite = useSelector((state: RootState) =>
    state.favoriteSocialPosts.posts.some(favPost => favPost.id === post.id)
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeSocialPostFavorite(post));
    } else {
      dispatch(addSocialPostFavorite(post));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.avatarUrl} alt={post.username} />
            <AvatarFallback>{post.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{post.username}</span>
            <span className="text-sm text-muted-foreground">{post.handle}</span>
          </div>
        </div>
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
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.text}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </div>
        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}