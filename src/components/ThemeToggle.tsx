"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { toggleTheme } from "@/store/uiSlice";

export function ThemeToggle() {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
    >
      
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}