"use client"; // This line is crucial for components that use hooks

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Settings, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SettingsPanel from "./SettingsPanel";
import SearchInput from "./SearchInput";


const NavLinks = () => (
    <nav className="mt-8">
      <Link href="/" className="block py-2 px-4 rounded hover:bg-accent">
        Feed
      </Link>
      <Link href="/favorites" className="block py-2 px-4 mt-2 rounded hover:bg-accent">
        Favorites
      </Link>
    </nav>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();
  // const isRefetching = useSelector((state: RootState) => state.loading.refetchingCount > 0);
  // const isSearchPage = pathname === '/search';
  // const showOverlayLoader = isRefetching && !isSearchPage;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 flex-shrink-0 p-4 border-r hidden lg:block">
        <h1 className="text-2xl font-bold">
          <Link href="/">Daily-Slice</Link>
        </h1>
        <NavLinks />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="p-4 border-b z-10 bg-background">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild><button><Menu size={24} /></button></SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <SheetHeader className="text-left">
                    <SheetTitle><Link href="/">Daily-Slice</Link></SheetTitle>
                  </SheetHeader>
                  <NavLinks />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex-1"><SearchInput /></div>
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild><button><Settings size={24} /></button></SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
                  </SheetHeader>
                  <SettingsPanel />
                </SheetContent>
              </Sheet>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        
        {/* {showOverlayLoader && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity z-20">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )} */}
      </div>
    </div>
  );
}