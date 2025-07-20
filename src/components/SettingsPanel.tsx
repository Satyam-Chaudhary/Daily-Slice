"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setCategories } from "@/store/preferenceSlice";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { SheetClose } from "@/components/ui/sheet";

const ALL_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

export default function SettingsPanel() {
  const dispatch = useDispatch();
  const savedCategories = useSelector((state: RootState) => state.preferences.categories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(savedCategories);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleSaveChanges = () => {
    dispatch(setCategories(selectedCategories));
    toast.success("Preferences Saved", {
      description: "Your feed has been updated.",
    });
  };

  return (
    <div className="py-4 p-4">
      <h3 className="text-lg font-medium mb-4">Favorite Categories</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Select the topics you're most interested in. The first category will be your default feed.
      </p>

      {/* Changed to a more spacious single-column flex layout */}
      <div className="flex flex-col gap-4">
        {ALL_CATEGORIES.map((category) => (
          <div key={category} className="flex items-center space-x-3 rounded-md border p-4">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={(checked) => handleCheckboxChange(category, !!checked)}
            />
            <Label
              htmlFor={category}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
            >
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
}