"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setCategories, setMovieFeedType, MovieFeedType } from "@/store/preferencesSlice";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { SheetClose } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const NewsSettings = () => {
  const dispatch = useDispatch();
  const savedCategories = useSelector((state: RootState) => state.preferences.categories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(savedCategories);

  const ALL_NEWS_CATEGORIES = [
    "business", "entertainment", "general", "health", "science", "sports", "technology",
  ];

  const handleCheckboxChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleSaveChanges = () => {
    dispatch(setCategories(selectedCategories));
    toast.success("News Preferences Saved", {
      description: "Your news feed has been updated.",
    });
  };

  return (
     <div className="py-4 p-4">
      <h3 className="text-lg font-medium mb-4">Favorite Categories</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select the topics you're most interested in. The first category will be your default feed.
      </p>
      <div className="flex flex-col gap-4">
        {ALL_NEWS_CATEGORIES.map((category) => (
          <div key={category} className="flex items-center space-x-3 rounded-md border p-4">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => handleCheckboxChange(category, !!checked)}
            />
            <Label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
              {category}
            </Label>
          </div>
        ))}
      </div>
      <SheetClose asChild>
        <Button onClick={handleSaveChanges} className="mt-8 w-full">
          Save Changes
        </Button>
      </SheetClose>
    </div>
  );
};

const MovieSettings = () => {
  const dispatch = useDispatch();
    
    const savedMovieFeedType = useSelector((state: RootState) => state.preferences.movieFeedType);
    
    const [selectedFeedType, setSelectedFeedType] = useState<MovieFeedType>(savedMovieFeedType);

    const handleSaveChanges = () => {
        dispatch(setMovieFeedType(selectedFeedType));
        toast.success("Movie Preferences Saved", {
            description: `Your movie feed will now show ${selectedFeedType.replace('_', ' ')} movies.`,
        });
    }
    return (
        <div className="py-4 p-4">
            <h3 className="text-lg font-medium mb-4">Movie Feed Preferences</h3>
            <p className="text-muted-foreground mb-6">
              Choose the type of movie feed you'd like to see on your dashboard.
            </p>
            <RadioGroup
                defaultValue={selectedFeedType}
                onValueChange={(value: MovieFeedType) => setSelectedFeedType(value)}
            >
                <div className="flex items-center space-x-3 rounded-md border p-4">
                    <RadioGroupItem value="trending" id="trending" />
                    <Label htmlFor="trending" className="font-medium">Trending</Label>
                </div>
                <div className="flex items-center space-x-3 rounded-md border p-4 mt-2">
                    <RadioGroupItem value="top_rated" id="top_rated" />
                    <Label htmlFor="top_rated" className="font-medium">Top Rated</Label>
                </div>
            </RadioGroup>
            <SheetClose asChild>
                <Button onClick={handleSaveChanges} className="mt-8 w-full">
                    Save Changes
                </Button>
            </SheetClose>
        </div>
    )
}

const SocialSettings = () => {
    return (
        <div className="py-4 p-4">
            <h3 className="text-lg font-medium mb-4">Social Feed Preferences</h3>
            <p className="text-muted-foreground mb-6">
                No specific settings are available for the social feed.
            </p>
        </div>
    )
}


export default function SettingsPanel() {
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  const renderSettings = () => {
    switch (activeTab) {
      case 'news':
        return <NewsSettings />;
      case 'movies':
        return <MovieSettings />;
      case 'social':
        return <SocialSettings />;
      default:
        return (
        <div className="py-4 p-4">
            <h3 className="text-lg font-medium mb-4">Choose a Tab</h3>
            <p className="text-muted-foreground mb-6">
                Select a Tab to see Settings
            </p>
        </div>
    )
    }
  };

  return <div className="py-4">{renderSettings()}</div>;
}