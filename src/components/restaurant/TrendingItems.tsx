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
    <section className="container mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <TrendingUp className="text-destructive flex-shrink-0" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold">Most Ordered Today</h2>
        <Flame className="text-destructive animate-pulse flex-shrink-0" size={18} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {trendingItems.map((item, index) => (
          <div 
            key={item.id}
            className="relative bg-card rounded-lg border p-3 sm:p-4 hover:shadow-lg transition-shadow animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 flex items-center gap-1 text-xs px-2 py-1"
            >
              <Flame size={12} className="flex-shrink-0" />
              #{index + 1}
            </Badge>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-1 sm:mt-2 gap-2">
                  <span className="font-bold text-primary text-sm sm:text-base">${item.price}</span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                    {item.ordersToday} orders
                  </Badge>
                </div>
              </div>
            </div>
            
            {onAddToOrder && (
              <Button
                onClick={() => onAddToOrder(item)}
                className="w-full mt-2 sm:mt-3 gap-2 text-xs sm:text-sm h-8 sm:h-auto"
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                Add to Basket
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};