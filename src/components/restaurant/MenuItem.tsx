import { Plus, Clock } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface MenuItemProps {
  item: MenuItemType;
  onAddToOrder: (item: MenuItemType) => void;
}

export function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const navigate = useNavigate();

  const handleAddToOrder = () => {
    onAddToOrder(item);
  };

  const handleViewDetails = () => {
    navigate(`/menu/${item.id}`);
  };

  const getDietaryBadgeColor = (dietary: string) => {
    const colors = {
      vegetarian: 'bg-green-100 text-green-800 border-green-200',
      vegan: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'gluten-free': 'bg-blue-100 text-blue-800 border-blue-200',
      'dairy-free': 'bg-purple-100 text-purple-800 border-purple-200',
      'nut-free': 'bg-orange-100 text-orange-800 border-orange-200',
      halal: 'bg-teal-100 text-teal-800 border-teal-200',
      kosher: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[dietary as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="menu-card bg-white border-0 shadow-md hover:shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative flex-[4]">
        <div className="h-full overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="dish-image w-full h-full object-cover"
          />
        </div>
        
        {/* Badges - Only trending/popular/special */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isTrending && (
            <Badge className="bg-red-500 text-white border-0 shadow-sm animate-pulse text-xs">
              Trending
            </Badge>
          )}
          {item.isPopular && (
            <Badge className="bg-menu-popular text-white border-0 shadow-sm text-xs">
              Popular
            </Badge>
          )}
          {item.isSpecial && (
            <Badge className="bg-menu-special text-primary-foreground border-0 shadow-sm text-xs">
              Special
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 space-y-2 flex flex-col flex-[1] bg-white">
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-card-foreground line-clamp-2">
            {item.name}
          </h3>
        </div>

        {/* Price and Button Section */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="text-lg sm:text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </div>
          <Button 
            size="sm" 
            onClick={handleViewDetails}
            className="gap-1 bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm h-8 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}