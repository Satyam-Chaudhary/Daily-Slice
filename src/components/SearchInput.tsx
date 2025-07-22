"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { getSearchHistory, addSearchToHistory, clearSearchHistory } from "@/lib/searchHistory";
import { useSearchNewsQuery } from "@/store/newsApiSlice";
import { useSearchMoviesQuery } from "@/store/tmdbApiSlice";
import { useGetSocialPostsQuery } from "@/store/socialApiSlice";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  const [searchTerm, setSearchTerm] = useState(urlQuery || "");
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  //data fetching
  const { data: newsResults, isLoading: isNewsLoading } = useSearchNewsQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });
  const { data: movieResults, isLoading: isMoviesLoading } = useSearchMoviesQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });
  const { data: allSocialPosts } = useGetSocialPostsQuery();

  const socialResults = useMemo(() => {
    if (!debouncedSearchTerm || !allSocialPosts) return [];
    return allSocialPosts.filter(
      (post) =>
        post.text.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, allSocialPosts]);

  const isQuickSearchLoading = isNewsLoading || isMoviesLoading;


  useEffect(() => {
    if (debouncedSearchTerm) {
      addSearchToHistory(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(urlQuery || "");
  }, [urlQuery]);

  
  const handleFocus = () => { setIsFocused(true); setHistory(getSearchHistory()); };
  const handleHistoryClick = (term: string) => { setSearchTerm(term); };
  const handleClear = () => { setSearchTerm(""); };
  const handleClearHistory = (e: React.MouseEvent) => { e.stopPropagation(); clearSearchHistory(); setHistory([]); };
  const handleViewAll = () => { router.push(`/search?q=${debouncedSearchTerm}`); };

  
  const showHistoryDropdown = isFocused && searchTerm === "" && history.length > 0;
  const showQuickSearchDropdown = isFocused && searchTerm !== "" && debouncedSearchTerm !== "";

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search news, movies..."
        className="pl-8 pr-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {searchTerm && (
        <Button variant="ghost" size="icon" className="absolute right-1 top-0.5 h-8 w-8 rounded-full" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* recent search */}
      {showHistoryDropdown && (
        <div className="absolute top-full mt-2 w-full bg-background/90 backdrop-blur-sm border rounded-md shadow-lg z-30">
          <div className="flex justify-between items-center p-2 border-b">
            <p className="text-xs font-semibold text-muted-foreground">Recent Searches</p>
            <Button variant="link" className="text-xs h-auto p-0" onMouseDown={handleClearHistory}>Clear</Button>
          </div>
          <ul>
            {history.map((term, index) => (
              <li key={index}><button className="w-full text-left px-3 py-2 text-sm hover:bg-accent" onMouseDown={() => handleHistoryClick(term)}>{term}</button></li>
            ))}
          </ul>
        </div>
      )}

      {/* //quick search */}
      {showQuickSearchDropdown && (
        <div className="absolute top-full mt-2 w-full bg-background/90 backdrop-blur-sm border rounded-md shadow-lg z-30 max-h-[60vh] overflow-y-auto">
          {isQuickSearchLoading && (
            <div className="p-4 flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
          )}
          {!isQuickSearchLoading && (
            <>
              {/* News Results */}
              {newsResults?.articles && newsResults.articles.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">News</p>
                  <ul>{newsResults.articles.slice(0, 3).map(article => (<li key={article.url}><Link href={article.url} target="_blank" className="block text-sm p-2 hover:bg-accent rounded-md truncate">{article.title}</Link></li>))}</ul>
                </div>
              )}
              {/* Movie Results */}
              {movieResults?.results && movieResults.results.length > 0 && (
                <div className="p-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Movies</p>
                  <ul>{movieResults.results.slice(0, 3).map(movie => (<li key={movie.id}><Link href={`/search?q=${movie.title}`} className="block text-sm p-2 hover:bg-accent rounded-md truncate">{movie.title}</Link></li>))}</ul>
                </div>
              )}
              {/* Social Results */}
              {socialResults.length > 0 && (
                 <div className="p-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Social Posts</p>
                  <ul>{socialResults.slice(0, 2).map(post => (<li key={post.id}><p className="text-sm p-2 truncate">{post.username}: "{post.text.substring(0, 40)}..."</p></li>))}</ul>
                </div>
              )}
              {/* View All Button */}
              <div className="p-2 border-t">
                <Button variant="link" className="w-full" onMouseDown={handleViewAll}>View all results for "{debouncedSearchTerm}"</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}