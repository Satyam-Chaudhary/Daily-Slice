import { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import SearchResults from '@/components/SearchResults';
import { Skeleton } from '@/components/ui/skeleton';

const SearchLoadingFallback = () => (
  <div>
    <Skeleton className="h-10 w-1/3 mb-4" />
    <Skeleton className="h-10 w-full mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<SearchLoadingFallback />}>
        <SearchResults />
      </Suspense>
    </MainLayout>
  );
}