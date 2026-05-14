'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  MapPin,
  Users,
  Star,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { EventCard, EventCardSkeleton } from '@/components/events/EventCard';
import { useDebounce } from '@/hooks/use-debounce';
import { queryKeys } from '@/lib/query-keys';
import api from '@/lib/api';

const categories = [
  'ALL',
  'TECH',
  'MUSIC',
  'BUSINESS',
  'HEALTH',
  'SPORTS',
  'ART',
  'EDUCATION',
  'SOCIAL',
  'OTHER',
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
];

const typeOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
];

const priceOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'FREE', label: 'Free' },
  { value: 'PAID', label: 'Paid' },
];

const dateOptions = [
  { value: 'ALL', label: 'Upcoming' },
  { value: 'WEEK', label: 'This Week' },
  { value: 'MONTH', label: 'This Month' },
];

interface Filters {
  search: string;
  category: string;
  type: string;
  price: string;
  date: string;
  sort: string;
  page: number;
}

function parseFilters(sp: URLSearchParams): Filters {
  return {
    search: sp.get('search') || '',
    category: sp.get('category') || 'ALL',
    type: sp.get('type') || 'ALL',
    price: sp.get('price') || 'ALL',
    date: sp.get('date') || 'ALL',
    sort: sp.get('sort') || 'latest',
    page: parseInt(sp.get('page') || '1', 10),
  };
}

function buildQueryString(f: Filters): string {
  const params = new URLSearchParams();
  if (f.search) params.set('search', f.search);
  if (f.category !== 'ALL') params.set('category', f.category);
  if (f.type !== 'ALL') params.set('type', f.type);
  if (f.price !== 'ALL') params.set('price', f.price);
  if (f.date !== 'ALL') params.set('date', f.date);
  if (f.sort !== 'latest') params.set('sort', f.sort);
  if (f.page > 1) params.set('page', String(f.page));
  return params.toString();
}

function getActiveChips(f: Filters): { key: keyof Filters; label: string }[] {
  const chips: { key: keyof Filters; label: string }[] = [];
  if (f.search) chips.push({ key: 'search', label: `Search: ${f.search}` });
  if (f.category !== 'ALL')
    chips.push({ key: 'category', label: `Category: ${f.category}` });
  if (f.type !== 'ALL') chips.push({ key: 'type', label: `Type: ${f.type}` });
  if (f.price !== 'ALL')
    chips.push({
      key: 'price',
      label: `Price: ${f.price === 'FREE' ? 'Free' : 'Paid'}`,
    });
  if (f.date !== 'ALL')
    chips.push({
      key: 'date',
      label: `Date: ${f.date === 'WEEK' ? 'This Week' : 'This Month'}`,
    });
  return chips;
}

export default function EventsClient({
  initialParams,
}: {
  initialParams: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    search: initialParams.search || '',
    category: initialParams.category || 'ALL',
    type: initialParams.type || 'ALL',
    price: initialParams.price || 'ALL',
    date: initialParams.date || 'ALL',
    sort: initialParams.sort || 'latest',
    page: parseInt(initialParams.page || '1', 10),
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  // Sync URL when filters change (except search which uses debounce)
  useEffect(() => {
    const qs = buildQueryString({ ...filters, search: debouncedSearch });
    const url = qs ? `/events?${qs}` : '/events';
    router.replace(url, { scroll: false });
  }, [filters.category, filters.type, filters.price, filters.date, filters.sort, filters.page, debouncedSearch, router]);

  // Reset page when filters change
  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'ALL',
      type: 'ALL',
      price: 'ALL',
      date: 'ALL',
      sort: 'latest',
      page: 1,
    });
  }, []);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {
      page: String(filters.page),
      limit: '9',
      sortBy: filters.sort,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.category !== 'ALL') params.category = filters.category;
    if (filters.type !== 'ALL') params.type = filters.type;
    if (filters.price !== 'ALL') params.isPaid = filters.price === 'PAID' ? 'true' : 'false';
    if (filters.date !== 'ALL') {
      const now = new Date();
      if (filters.date === 'WEEK') {
        const end = new Date(now);
        end.setDate(end.getDate() + 7);
        params.startDateFrom = now.toISOString();
        params.startDateTo = end.toISOString();
      } else if (filters.date === 'MONTH') {
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);
        params.startDateFrom = now.toISOString();
        params.startDateTo = end.toISOString();
      }
    }
    return params;
  }, [filters, debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.events.list(queryParams),
    queryFn: async () => {
      const res = await api.get('/events', { params: queryParams });
      return res.data.data;
    },
    staleTime: 60_000,
  });

  const events = data?.events || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const activeChips = getActiveChips({ ...filters, search: debouncedSearch });

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-auto px-2 py-1 text-xs"
        >
          Clear all
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {filters.category === 'ALL' ? 'All Categories' : filters.category}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]" sideOffset={4}>
            {categories.map((c) => (
              <DropdownMenuItem
                key={c}
                onClick={() => updateFilter('category', c)}
                className={cn(filters.category === c && "bg-accent")}
              >
                {c === 'ALL' ? 'All Categories' : c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {typeOptions.find(t => t.value === filters.type)?.label || 'All Types'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]" sideOffset={4}>
            {typeOptions.map((t) => (
              <DropdownMenuItem
                key={t.value}
                onClick={() => updateFilter('type', t.value)}
                className={cn(filters.type === t.value && "bg-accent")}
              >
                {t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Price</label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {priceOptions.find(p => p.value === filters.price)?.label || 'All Prices'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]" sideOffset={4}>
            {priceOptions.map((p) => (
              <DropdownMenuItem
                key={p.value}
                onClick={() => updateFilter('price', p.value)}
                className={cn(filters.price === p.value && "bg-accent")}
              >
                {p.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {dateOptions.find(d => d.value === filters.date)?.label || 'All Dates'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]" sideOffset={4}>
            {dateOptions.map((d) => (
              <DropdownMenuItem
                key={d.value}
                onClick={() => updateFilter('date', d.value)}
                className={cn(filters.date === d.value && "bg-accent")}
              >
                {d.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort by</label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between font-normal">
              {sortOptions.find(s => s.value === filters.sort)?.label || 'Sort by'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]" sideOffset={4}>
            {sortOptions.map((s) => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => updateFilter('sort', s.value)}
                className={cn(filters.sort === s.value && "bg-accent")}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Events</h1>
        <p className="mt-2 text-muted-foreground">
          Discover meetups, workshops, and gatherings near you.
        </p>
      </div>

      <div className="flex gap-4">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            {filterContent}
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {/* Mobile filter trigger */}
          <div className="mb-4 flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="py-6">
                  {filterContent}
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[180px] justify-between font-normal">
                  {sortOptions.find(s => s.value === filters.sort)?.label || 'Sort by'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]" sideOffset={4}>
                {sortOptions.map((s) => (
                  <DropdownMenuItem
                    key={s.value}
                    onClick={() => updateFilter('sort', s.value)}
                    className={cn(filters.sort === s.value && "bg-accent")}
                  >
                    {s.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active chips */}
          {activeChips.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <Badge
                  key={chip.key}
                  variant="secondary"
                  className="gap-1 pr-1.5"
                >
                  {chip.label}
                  <button
                    onClick={() => {
                      if (chip.key === 'search') updateFilter('search', '');
                      else if (chip.key === 'category')
                        updateFilter('category', 'ALL');
                      else if (chip.key === 'type')
                        updateFilter('type', 'ALL');
                      else if (chip.key === 'price')
                        updateFilter('price', 'ALL');
                      else if (chip.key === 'date')
                        updateFilter('date', 'ALL');
                    }}
                    className="ml-1 rounded-full p-0.5 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto px-2 py-1 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results count */}
          <p className="mb-4 text-sm text-muted-foreground">
            {isLoading
              ? 'Loading events...'
              : `Showing ${events.length} of ${totalCount} events`}
          </p>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <LayoutGrid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No events found</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try adjusting your filters or search to find what you are looking
                for.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={{
                    id: event.id,
                    slug: event.slug,
                    title: event.title,
                    bannerImage: event.bannerImage,
                    organizer: {
                      name: event.organizer?.name || 'Unknown',
                      avatar: event.organizer?.avatar,
                    },
                    startDate: event.startDate,
                    location: event.location,
                    price: event.price,
                    isPaid: event.isPaid,
                    category: event.category,
                    averageRating: event.averageRating,
                    participantCount: event._count?.participations || 0,
                    type: event.type,
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filters.page > 1)
                          setFilters((p) => ({ ...p, page: p.page - 1 }));
                      }}
                      className={
                        filters.page <= 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and neighbors
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= filters.page - 1 && page <= filters.page + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === filters.page}
                            onClick={(e) => {
                              e.preventDefault();
                              setFilters((p) => ({ ...p, page }));
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    if (
                      page === filters.page - 2 ||
                      page === filters.page + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (filters.page < totalPages)
                          setFilters((p) => ({ ...p, page: p.page + 1 }));
                      }}
                      className={
                        filters.page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
