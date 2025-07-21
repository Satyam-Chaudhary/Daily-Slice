"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveTab, ActiveTab } from "@/store/uiSlice";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 1. Import our new, self-contained tab components
import UnifiedFeedTab from "@/components/tabs/UnifiedFeedTab";
import NewsTab from "@/components/tabs/NewsTab";
import MoviesTab from "@/components/tabs/MoviesTab";
import SocialTab from "@/components/tabs/SocialTab";

export default function HomePage() {
  const dispatch = useDispatch();

  const [headline, setHeadline] = useState("Your Feed");

  const handleTabChange = (tabValue: string) => {
    dispatch(setActiveTab(tabValue as ActiveTab));
    switch (tabValue) {
      case "news":
        setHeadline("Latest News");
        break;
      case "movies":
        setHeadline("Top Movies");
        break;
      case "social":
        setHeadline("Your Social Media");
        break;
      case "all":
      default:
        setHeadline("Your Feed");
        break;
    }
  };

  return (
    <MainLayout>
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">{headline}</h2>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-6">
          <UnifiedFeedTab />
        </TabsContent>
        <TabsContent value="news" className="mt-6">
          <NewsTab />
        </TabsContent>
        <TabsContent value="movies" className="mt-6">
          <MoviesTab />
        </TabsContent>
        <TabsContent value="social" className="mt-6">
          <SocialTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

