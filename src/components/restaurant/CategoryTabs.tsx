import { MenuCategory } from '@/types/menu';
import { Button } from '@/components/ui/button';
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { FilterDialog, FilterOptions } from './FilterDialog';

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
  return (
    <div className="sticky z-30 bg-background/95 backdrop-blur-sm border-b py-4 top-[calc(145px)] md:top-[80px] lg:top-[100px]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <ScrollArea className="w-full lg:flex-1">
            <div className="flex gap-2 pb-2 w-max">
              <Button
                variant={activeCategory === null ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategorySelect(null)}
                className={`whitespace-nowrap ${
                  activeCategory === null
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'hover:bg-muted hover:text-foreground'
                }`}
              >
                All Menu
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onCategorySelect(category.id)}
                  className={`whitespace-nowrap gap-2 ${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
            {/* ✅ optional: custom horizontal scrollbar */}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Filter controls */}
          <div className="flex gap-2 items-center w-full lg:w-auto">
            <FilterDialog
              categories={categories}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
