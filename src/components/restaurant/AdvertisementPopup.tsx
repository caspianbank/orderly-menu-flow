import { useState, useEffect } from 'react';
import { X, Clock, ShoppingCart, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

interface Advertisement {
  id: string;
  title: string;
  message: string;
  item: MenuItemType;
  specialPrice?: number;
  duration: number; // in seconds
  isActive: boolean;
  urgencyText?: string;
}

interface AdvertisementPopupProps {
  onAddToOrder: (item: MenuItemType) => void;
}

// Sample advertisement data - in real app, this would come from restaurant admin
const sampleAdvertisements: Advertisement[] = [
  {
    id: 'ad-1',
    title: '🎵 Performance Break Special! 🎵',
    message: 'While our talented singer takes a well-deserved break, why not treat yourself to our signature cocktail?',
    item: {
      id: 'cocktail-1',
      name: 'Bella Vista Mojito',
      description: 'Fresh mint, lime, and premium rum - the perfect refreshment',
      price: 12.50,
      category: { id: 'drinks', name: 'Beverages', icon: '🍹', order: 1 },
      image: '/placeholder.svg',
      ingredients: ['Premium White Rum', 'Fresh Mint', 'Lime', 'Soda Water'],
      allergens: [],
      dietary: [],
      isSpecial: true,
      prepTime: 3
    },
    specialPrice: 9.99,
    duration: 30,
    isActive: true,
    urgencyText: 'Limited time offer!'
  },
  {
    id: 'ad-2',
    title: '🍕 Chef\'s Recommendation',
    message: 'Our head chef suggests pairing your evening with our most popular appetizer!',
    item: {
      id: 'appetizer-1',
      name: 'Mediterranean Platter',
      description: 'Assorted olives, hummus, feta cheese, and warm pita bread',
      price: 16.50,
      category: { id: 'appetizers', name: 'Appetizers', icon: '🥗', order: 2 },
      image: '/placeholder.svg',
      ingredients: ['Mixed Olives', 'Hummus', 'Feta Cheese', 'Pita Bread'],
      allergens: ['dairy'],
      dietary: ['vegetarian'],
      isPopular: true,
      prepTime: 5
    },
    duration: 25,
    isActive: true,
    urgencyText: 'Chef\'s choice tonight!'
  }
];

export function AdvertisementPopup({ onAddToOrder }: AdvertisementPopupProps) {
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const { toast } = useToast();

  // Simulate receiving advertisements from restaurant admin
  useEffect(() => {
    const triggerAd = () => {
      const activeAds = sampleAdvertisements.filter(ad => ad.isActive);
      if (activeAds.length > 0) {
        const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
        setCurrentAd(randomAd);
        setTimeLeft(randomAd.duration);
        setShowPopup(true);
      }
    };

    // Trigger first ad after 10 seconds, then randomly every 2-5 minutes
    const initialTimeout = setTimeout(triggerAd, 10000);

    const interval = setInterval(() => {
      triggerAd();
    }, Math.random() * 180000 + 120000); // 2-5 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && showPopup) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && showPopup) {
      setShowPopup(false);
    }
  }, [timeLeft, showPopup]);

  const handleOrderNow = () => {
    if (currentAd) {
      onAddToOrder(currentAd.item);
      setShowPopup(false);

      toast({
        title: "Added to Order!",
        description: `${currentAd.item.name} has been added to your order${currentAd.specialPrice ? ' at special price!' : '.'}`,
      });
    }
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!currentAd || !showPopup) return null;

  const displayPrice = currentAd.specialPrice || currentAd.item.price;
  const hasDiscount = currentAd.specialPrice && currentAd.specialPrice < currentAd.item.price;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent hideClose={true} className="max-w-md w-[95vw] mx-auto rounded-xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        {/* Header with close button and timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Special Offer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-primary mb-2">
            {currentAd.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {currentAd.message}
          </p>
        </div>

        {/* Item showcase */}
        <div className="bg-card rounded-lg p-4 border mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg leading-tight">
                  {currentAd.item.name}
                </h3>
                <div className="text-right flex-shrink-0">
                  {hasDiscount ? (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground line-through">
                        ${currentAd.item.price.toFixed(2)}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${displayPrice.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-primary">
                      ${displayPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {currentAd.item.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {currentAd.urgencyText && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 animate-pulse">
                    {currentAd.urgencyText}
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save ${(currentAd.item.price - displayPrice).toFixed(2)}
                  </Badge>
                )}
                {currentAd.item.prepTime && (
                  <Badge variant="outline" className="text-xs">
                    {currentAd.item.prepTime} min prep
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleOrderNow}
            className="flex-1 gap-2 bg-primary hover:bg-primary-hover"
            size="lg"
          >
            <ShoppingCart className="h-4 w-4" />
            Order Now - ${displayPrice.toFixed(2)}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{
                width: `${(timeLeft / currentAd.duration) * 100}%`
              }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Offer expires in {timeLeft} seconds
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}