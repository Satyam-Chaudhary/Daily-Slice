"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveTab, ActiveTab } from "@/store/uiSlice";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      case "news": setHeadline("Latest News"); break;
      case "movies": setHeadline("Top Movies"); break;
      case "social": setHeadline("Your Social Media"); break;
      default: setHeadline("Your Feed"); break;
    }
  };

  return (
    <MainLayout>
      <Tabs
        defaultValue="all"
        className="w-full flex flex-col h-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-3xl font-bold">{headline}</h2>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto mt-3">
          <TabsContent value="all">
            <UnifiedFeedTab />
          </TabsContent>
          <TabsContent value="news">
            <NewsTab />
          </TabsContent>
          <TabsContent value="movies">
            <MoviesTab />
          </TabsContent>
          <TabsContent value="social">
            <SocialTab />
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
}