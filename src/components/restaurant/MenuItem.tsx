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
    <Card className="menu-card bg-gradient-card border shadow-soft overflow-hidden flex flex-col h-full">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="dish-image w-full h-full object-cover"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isTrending && (
            <Badge className="bg-red-500 text-white border-0 shadow-sm animate-pulse">
              🔥 Trending
            </Badge>
          )}
          {item.isPopular && (
            <Badge className="bg-menu-popular text-white border-0 shadow-sm">
              Popular
            </Badge>
          )}
          {item.isSpecial && (
            <Badge className="bg-menu-special text-primary-foreground border-0 shadow-sm">
              Special
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-card/95 text-card-foreground shadow-sm font-semibold">
            ${item.price.toFixed(2)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3 flex flex-col flex-1">
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Prep Time */}
        {item.prepTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{item.prepTime} min</span>
          </div>
        )}

        {/* Dietary Info */}
        {item.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.dietary.slice(0, 2).map((dietary) => (
              <Badge 
                key={dietary} 
                variant="outline" 
                className={`text-xs ${getDietaryBadgeColor(dietary)}`}
              >
                {dietary}
              </Badge>
            ))}
            {item.dietary.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.dietary.length - 2} more
              </Badge>
            )}
          </div>
        )}

        <Button 
          size="sm" 
          onClick={handleViewDetails}
          className="w-full gap-1 bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
        >
          <Plus className="h-3 w-3" />
          View & Customize
        </Button>
      </CardContent>
    </Card>
  );
}