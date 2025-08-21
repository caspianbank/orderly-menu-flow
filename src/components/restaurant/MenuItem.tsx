import { useState } from 'react';
import { Plus, Clock, Info } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface MenuItemProps {
  item: MenuItemType;
  onAddToOrder: (item: MenuItemType) => void;
}

export function MenuItem({ item, onAddToOrder }: MenuItemProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToOrder = () => {
    onAddToOrder(item);
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
    <Card className="menu-card bg-gradient-card border shadow-soft overflow-hidden">
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

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
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

        <div className="flex gap-2 pt-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Info className="h-3 w-3" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl">{item.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="space-y-3">
                  <p className="text-muted-foreground">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                    {item.prepTime && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{item.prepTime} min</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Ingredients</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.ingredients.join(', ')}
                    </p>
                  </div>

                  {item.allergens.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-destructive">Allergens</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.allergens.join(', ')}
                      </p>
                    </div>
                  )}

                  {item.dietary.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Dietary Information</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.dietary.map((dietary) => (
                          <Badge 
                            key={dietary} 
                            variant="outline" 
                            className={getDietaryBadgeColor(dietary)}
                          >
                            {dietary}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            size="sm" 
            onClick={handleAddToOrder}
            className="flex-1 gap-1 bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm"
          >
            <Plus className="h-3 w-3" />
            Add to Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}