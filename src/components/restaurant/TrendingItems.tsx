import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useRef, useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TrendingItemsProps {
  items: MenuItem[];
  onAddToOrder?: (item: MenuItem) => void;
}

export const TrendingItems = ({ items, onAddToOrder }: TrendingItemsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const trendingItems = items
    .filter(item => item.isTrending)
    .sort((a, b) => (b.ordersToday || 0) - (a.ordersToday || 0))
    .slice(0, 6); // Increased to 6 items for better scrolling

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [trendingItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of one card + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (trendingItems.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-0">
      <div className="bg-gray-50/50 rounded-2xl p-2">
        <div className="flex items-center justify-between mb-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-primary flex-shrink-0" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold">Most Ordered Today</h2>
          <Flame className="text-primary animate-pulse flex-shrink-0" size={18} />
        </div>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Horizontal Scrolling Container */}
      <div className="relative pt-3">
        <ScrollArea className="w-full">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 pb-4 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          >
            {trendingItems.map((item, index) => (
              <div 
                key={item.id}
                className="relative bg-white rounded-xl border-2 border-gray-100 hover:border-primary/30 p-5 hover:shadow-xl transition-all animate-fade-in flex-shrink-0 w-[280px] sm:w-[300px] mt-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 flex items-center gap-1 text-xs px-2.5 py-1 shadow-md"
                >
                  <Flame size={12} className="flex-shrink-0" />
                  #{index + 1}
                </Badge>
                
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/5 border-primary/20">
                      {item.ordersToday} orders today
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t">
                  <span className="font-bold text-primary text-lg">${item.price.toFixed(2)}</span>
                  {onAddToOrder && (
                    <Button
                      onClick={() => onAddToOrder(item)}
                      className="gap-2 text-xs h-8 px-3 bg-primary hover:bg-primary/90 shadow-sm"
                      size="sm"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        {/* Gradient Overlays for Visual Scroll Indicators */}
        {canScrollLeft && (
          <div className="absolute left-0 top-3 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden sm:block" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-3 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none hidden sm:block" />
        )}
      </div>
      </div>
    </section>
  );
};