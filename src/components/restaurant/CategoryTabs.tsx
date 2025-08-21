import { MenuCategory } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategorySelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-[120px] z-30 bg-background/95 backdrop-blur-sm border-b py-4">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            <Button
              variant={activeCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategorySelect(null)}
              className={`whitespace-nowrap ${
                activeCategory === null 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'hover:bg-muted'
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
                    : 'hover:bg-muted'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}