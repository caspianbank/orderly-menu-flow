import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface TrendingItemsProps {
  items: MenuItem[];
  onAddToOrder?: (item: MenuItem) => void;
}

export const TrendingItems = ({ items, onAddToOrder }: TrendingItemsProps) => {
  const trendingItems = items
    .filter(item => item.isTrending)
    .sort((a, b) => (b.ordersToday || 0) - (a.ordersToday || 0))
    .slice(0, 3);

  if (trendingItems.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-destructive" size={24} />
        <h2 className="text-2xl font-bold">Most Ordered Today</h2>
        <Flame className="text-destructive animate-pulse" size={20} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendingItems.map((item, index) => (
          <div 
            key={item.id}
            className="relative bg-card rounded-lg border p-4 hover:shadow-lg transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 flex items-center gap-1"
            >
              <Flame size={12} />
              #{index + 1}
            </Badge>
            
            <div className="flex items-center gap-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">${item.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.ordersToday} orders
                  </Badge>
                </div>
              </div>
            </div>
            
            {onAddToOrder && (
              <Button
                onClick={() => onAddToOrder(item)}
                className="w-full mt-3 gap-2"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Basket
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};