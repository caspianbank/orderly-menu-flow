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
import { Filter, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  { id: 'vegan', label: 'Vegan', color: 'bg-green-500' },
  { id: 'vegetarian', label: 'Vegetarian', color: 'bg-green-400' },
  { id: 'discounted', label: 'Discounted', color: 'bg-red-500' },
  { id: 'popular', label: 'Popular', color: 'bg-yellow-500' },
  { id: 'trending', label: 'Trending', color: 'bg-purple-500' },
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
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filter Menu
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <RadioGroup
              value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-') as ['name' | 'price' | 'prepTime', 'asc' | 'desc'];
                setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-asc" id="name-asc" />
                <Label htmlFor="name-asc" className="text-sm">Name (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-desc" id="name-desc" />
                <Label htmlFor="name-desc" className="text-sm">Name (Z-A)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="price-asc" />
                <Label htmlFor="price-asc" className="text-sm">Price (Low to High)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="price-desc" />
                <Label htmlFor="price-desc" className="text-sm">Price (High to Low)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prepTime-asc" id="prepTime-asc" />
                <Label htmlFor="prepTime-asc" className="text-sm">Prep Time (Fastest)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prepTime-desc" id="prepTime-desc" />
                <Label htmlFor="prepTime-desc" className="text-sm">Prep Time (Longest)</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={localFilters.selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={category.id} className="text-sm flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
            </Label>
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

          <Separator />

          {/* Labels */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Labels</Label>
            <div className="grid grid-cols-1 gap-2">
              {LABEL_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={localFilters.labels.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleLabelChange(option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id} className="text-sm flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}