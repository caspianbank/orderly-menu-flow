import { useState } from 'react';
import { MenuCategory } from '@/types/menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export interface FilterOptions {
  sortBy: 'name' | 'price' | 'prepTime';
  sortOrder: 'asc' | 'desc';
  selectedCategories: string[];
  priceRange: [number, number];
  labels: string[];
}

interface FilterDialogProps {
  categories: MenuCategory[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const LABEL_OPTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'discounted', label: 'Discounted' },
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
];

export function FilterDialog({ categories, filters, onFiltersChange }: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      sortBy: 'name',
      sortOrder: 'asc',
      selectedCategories: [],
      priceRange: [0, 50],
      labels: [],
    };
    setLocalFilters(resetFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, categoryId]
        : prev.selectedCategories.filter(id => id !== categoryId)
    }));
  };

  const handleLabelChange = (labelId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      labels: checked
        ? [...prev.labels, labelId]
        : prev.labels.filter(id => id !== labelId)
    }));
  };

  const activeFiltersCount = 
    (localFilters.selectedCategories.length > 0 ? 1 : 0) +
    (localFilters.labels.length > 0 ? 1 : 0) +
    (localFilters.priceRange[0] !== 0 || localFilters.priceRange[1] !== 50 ? 1 : 0) +
    (localFilters.sortBy !== 'name' || localFilters.sortOrder !== 'asc' ? 1 : 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 relative h-9 px-3 sm:px-4">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Filter & Sort</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-700 gap-1"
            >
              <X className="h-4 w-4" />
              Reset All
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Sort By</Label>
            <RadioGroup
              value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as ['name' | 'price' | 'prepTime', 'asc' | 'desc'];
                setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="name-asc" id="name-asc" />
                <Label htmlFor="name-asc" className="text-sm flex-1 cursor-pointer">Name (A → Z)</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="name-desc" id="name-desc" />
                <Label htmlFor="name-desc" className="text-sm flex-1 cursor-pointer">Name (Z → A)</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="price-asc" id="price-asc" />
                <Label htmlFor="price-asc" className="text-sm flex-1 cursor-pointer">Price (Low → High)</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="price-desc" id="price-desc" />
                <Label htmlFor="price-desc" className="text-sm flex-1 cursor-pointer">Price (High → Low)</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="prepTime-asc" id="prepTime-asc" />
                <Label htmlFor="prepTime-asc" className="text-sm flex-1 cursor-pointer">Quickest First</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="prepTime-desc" id="prepTime-desc" />
                <Label htmlFor="prepTime-desc" className="text-sm flex-1 cursor-pointer">Longest First</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-900">Price Range</Label>
              <span className="text-sm font-medium text-primary">
                ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
              </span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) => 
                setLocalFilters(prev => ({ ...prev, priceRange: value as [number, number] }))
              }
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$0</span>
              <span>$50</span>
            </div>
          </div>

          <Separator />

          {/* Labels */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Dietary & Tags</Label>
            <div className="grid grid-cols-1 gap-2">
              {LABEL_OPTIONS.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={option.id}
                    checked={localFilters.labels.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleLabelChange(option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id} className="text-sm flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900">Categories</Label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={category.id}
                    checked={localFilters.selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={category.id} className="text-sm flex-1 cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}