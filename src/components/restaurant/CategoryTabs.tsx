import { MenuCategory } from '@/types/menu';
import { Button } from '@/components/ui/button';
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { FilterDialog, FilterOptions } from './FilterDialog';
import { SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategorySelect,
  filters,
  onFiltersChange,
}: CategoryTabsProps) {
  // Count active filters
  const activeFiltersCount = 
    (filters.selectedCategories.length > 0 ? 1 : 0) +
    (filters.labels.length > 0 ? 1 : 0) +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50 ? 1 : 0) +
    (filters.sortBy !== 'name' || filters.sortOrder !== 'asc' ? 1 : 0);

  return (
    <nav className="sticky z-40 bg-white/95 backdrop-blur-md border-t border-b border-gray-200 shadow-sm top-[57px] sm:top-[65px] md:top-[73px]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
          {/* Categories Section */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-2 text-gray-500 flex-shrink-0">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm font-medium">Categories:</span>
            </div>
            
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2 w-max">
                <Button
                  variant={activeCategory === null ? "default" : "outline"}
                  onClick={() => onCategorySelect(null)}
                  className={`whitespace-nowrap px-4 py-2 h-9 font-medium text-sm transition-all ${
                    activeCategory === null
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                  }`}
                >
                  All Items
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    onClick={() => onCategorySelect(category.id)}
                    className={`whitespace-nowrap px-4 py-2 h-9 font-medium text-sm transition-all ${
                      activeCategory === category.id
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-1" />
            </ScrollArea>
          </div>

          {/* Filter Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="gap-2 h-9 px-3 sm:px-4 bg-white hover:bg-gray-50 border-gray-300 relative"
              asChild
            >
              <div>
                <FilterDialog
                  categories={categories}
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="pb-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
            {filters.labels.map((label) => (
              <Badge 
                key={label} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20"
              >
                {label}
              </Badge>
            ))}
            {filters.selectedCategories.length > 0 && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20"
              >
                {filters.selectedCategories.length} categories
              </Badge>
            )}
            {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50) && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20"
              >
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({
                sortBy: 'name',
                sortOrder: 'asc',
                selectedCategories: [],
                priceRange: [0, 50],
                labels: [],
              })}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
