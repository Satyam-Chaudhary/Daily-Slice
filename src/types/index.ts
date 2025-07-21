import type { Article } from "@/store/newsApiSlice";
import type { Movie } from "@/store/tmdbApiSlice";
import type { SocialPost } from "@/store/socialApiSlice";

// Base interface with common properties
interface UnifiedCardBase {
  id: string;
  title: string;
  imageUrl: string;
  subtitle: string;
  url?: string;
}

// Specific types for each content source
interface UnifiedNewsData extends UnifiedCardBase {
  type: 'news';
  originalData: Article;
}

interface UnifiedMovieData extends UnifiedCardBase {
  type: 'movie';
  originalData: Movie;
}

interface UnifiedSocialData extends UnifiedCardBase {
  type: 'social';
  originalData: SocialPost;
}

// The final discriminated union type 
export type UnifiedCardData = UnifiedNewsData | UnifiedMovieData | UnifiedSocialData;