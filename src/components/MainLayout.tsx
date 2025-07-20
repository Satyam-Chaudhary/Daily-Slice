"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SettingsPanel from "./SettingsPanel";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const NavLinks = () => (
  <nav className="mt-8">
    <Link href="/" className="block py-2 px-4 rounded hover:bg-accent">
      Feed
    </Link>
    <Link
      href="/trending"
      className="block py-2 px-4 mt-2 rounded hover:bg-accent"
    >
      Trending
    </Link>
    <Link
      href="/favorites"
      className="block py-2 px-4 mt-2 rounded hover:bg-accent"
    >
      Favorites
    </Link>
  </nav>
);

export default function MainLayout({
  children,
  isFetching = false,
}: {
  children: React.ReactNode;
  isFetching?: boolean;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 flex-shrink-0 p-4 border-r hidden lg:block">
        <h1 className="text-2xl font-bold">
          <Link href="/">Dashboard</Link>
        </h1>
        <NavLinks />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button>
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      <Link href="/">Dashboard</Link>
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1>SEARCH BAR</h1>
            </div>

            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button>
                    <Settings size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">
                      Settings
                    </SheetTitle>
                  </SheetHeader>
                  <SettingsPanel />
                </SheetContent>
              </Sheet>

              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        {isFetching && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
