import type { SocialPost } from "@/store/socialApiSlice";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart } from "lucide-react";

export default function SocialPostCard({ post }: { post: SocialPost }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar>
          <AvatarImage src={post.avatarUrl} alt={post.username} />
          <AvatarFallback>{post.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{post.username}</span>
          <span className="text-sm text-muted-foreground">{post.handle}</span>
        </div>
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