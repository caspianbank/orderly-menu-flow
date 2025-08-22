import { MenuCategory } from '@/types/menu';
import { Button } from '@/components/ui/button';
import {
  ScrollArea,
  ScrollBar,
} from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  sortBy: 'name' | 'price';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'price') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategorySelect,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[100px] z-30 bg-background/95 backdrop-blur-sm border-b py-4">
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

          {/* Sorting controls */}
          <div className="flex gap-2 items-center w-full lg:w-auto">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
