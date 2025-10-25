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
        <Button 
          variant="outline" 
          size="icon"
          className="relative h-9 w-9 rounded-lg border-gray-300 hover:border-primary/50 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[75vh] overflow-hidden flex flex-col p-0 rounded-2xl">
        <DialogHeader className="px-5 pt-5 pb-3 border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-gray-900">Filter & Sort</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 gap-1.5 px-2.5 h-8 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Reset</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          <div className="space-y-6">
          {/* Sort Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <Label className="text-sm font-bold text-gray-900">Sort By</Label>
            </div>
            <RadioGroup
              value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as ['name' | 'price' | 'prepTime', 'asc' | 'desc'];
                setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="name-asc" id="name-asc" className="flex-shrink-0" />
                <Label htmlFor="name-asc" className="text-xs font-medium flex-1 cursor-pointer">Name (A → Z)</Label>
              </div>
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="name-desc" id="name-desc" className="flex-shrink-0" />
                <Label htmlFor="name-desc" className="text-xs font-medium flex-1 cursor-pointer">Name (Z → A)</Label>
              </div>
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="price-asc" id="price-asc" className="flex-shrink-0" />
                <Label htmlFor="price-asc" className="text-xs font-medium flex-1 cursor-pointer">Price (Low → High)</Label>
              </div>
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="price-desc" id="price-desc" className="flex-shrink-0" />
                <Label htmlFor="price-desc" className="text-xs font-medium flex-1 cursor-pointer">Price (High → Low)</Label>
              </div>
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="prepTime-asc" id="prepTime-asc" className="flex-shrink-0" />
                <Label htmlFor="prepTime-asc" className="text-xs font-medium flex-1 cursor-pointer">Quickest First</Label>
              </div>
              <div className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                <RadioGroupItem value="prepTime-desc" id="prepTime-desc" className="flex-shrink-0" />
                <Label htmlFor="prepTime-desc" className="text-xs font-medium flex-1 cursor-pointer">Longest First</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-1" />

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <Label className="text-sm font-bold text-gray-900">Price Range</Label>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
              </span>
            </div>
            <div className="px-2 py-3">
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
            </div>
            <div className="flex justify-between px-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">$0</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">$50</span>
            </div>
          </div>

          <Separator className="my-1" />

          {/* Labels */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <Label className="text-sm font-bold text-gray-900">Dietary & Tags</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LABEL_OPTIONS.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <Checkbox
                    id={option.id}
                    checked={localFilters.labels.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleLabelChange(option.id, checked as boolean)
                    }
                    className="flex-shrink-0"
                  />
                  <Label htmlFor={option.id} className="text-xs font-medium flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-1" />

          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <Label className="text-sm font-bold text-gray-900">Categories</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <Checkbox
                    id={category.id}
                    checked={localFilters.selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                    className="flex-shrink-0"
                  />
                  <Label htmlFor={category.id} className="text-xs font-medium flex-1 cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        <div className="flex gap-2.5 px-5 py-3.5 border-t bg-gray-50/50">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1 h-9 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 h-9 text-sm bg-primary hover:bg-primary/90 font-medium shadow-sm transition-all"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}