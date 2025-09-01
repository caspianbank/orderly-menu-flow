import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Dices, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface SpinRouletteProps {
  items: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
}

export const SpinRoulette = ({ items, onAddToOrder }: SpinRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning || items.length === 0) return;
    
    setIsSpinning(true);
    setSelectedItem(null);
    
    // Random rotation between 1440 and 2160 degrees (4-6 full rotations)
    const randomRotation = 1440 + Math.random() * 720;
    setRotation(prev => prev + randomRotation);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setSelectedItem(items[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const wheelItems = items.slice(0, 8); // Limit to 8 items for better visual
  const itemAngle = 360 / wheelItems.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:from-primary/20 hover:to-secondary/20">
          <Dices className="w-5 h-5" />
          Spin to Order
          <Sparkles className="w-4 h-4 text-primary" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dices />
            Spin the Roulette Wheel
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6">
          {/* Roulette Wheel */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-4 h-6 bg-primary transform rotate-180" 
                   style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              </div>
            </div>
            
            <div 
              className="relative w-80 h-80 rounded-full border-8 border-primary shadow-2xl overflow-hidden transition-transform duration-3000 ease-out"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                background: 'conic-gradient(from 0deg, hsl(var(--primary)) 0deg, hsl(var(--secondary)) 45deg, hsl(var(--accent)) 90deg, hsl(var(--primary)) 135deg, hsl(var(--secondary)) 180deg, hsl(var(--accent)) 225deg, hsl(var(--primary)) 270deg, hsl(var(--secondary)) 315deg)'
              }}
            >
              {wheelItems.map((item, index) => (
                <div
                  key={item.id}
                  className="absolute w-full h-full flex items-center justify-center text-white font-semibold text-xs text-center px-2"
                  style={{
                    transform: `rotate(${index * itemAngle}deg)`,
                    transformOrigin: '50% 50%',
                    clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos((index * itemAngle - itemAngle/2) * Math.PI / 180)}% ${50 + 40 * Math.sin((index * itemAngle - itemAngle/2) * Math.PI / 180)}%, ${50 + 40 * Math.cos((index * itemAngle + itemAngle/2) * Math.PI / 180)}% ${50 + 40 * Math.sin((index * itemAngle + itemAngle/2) * Math.PI / 180)}%)`
                  }}
                >
                  <div 
                    className="transform"
                    style={{ transform: `rotate(${itemAngle/2}deg)` }}
                  >
                    <div className="text-[10px] leading-tight">
                      {item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name}
                    </div>
                    <div className="text-[8px] opacity-80">
                      ${item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Spin Button */}
          <Button 
            onClick={spinWheel}
            disabled={isSpinning || items.length === 0}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
          >
            {isSpinning ? (
              <>
                <div className="animate-spin mr-2">🎰</div>
                Spinning...
              </>
            ) : (
              <>
                <Dices className="mr-2" />
                Spin the Wheel!
              </>
            )}
          </Button>
          
          {/* Result */}
          {selectedItem && !isSpinning && (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20 animate-scale-in">
              <div className="text-center space-y-4">
                <Badge variant="default" className="text-lg px-4 py-2">
                  🎉 Winner! 🎉
                </Badge>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="text-left">
                    <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                    <p className="text-muted-foreground">{selectedItem.description}</p>
                    <p className="text-2xl font-bold text-primary mt-2">${selectedItem.price}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onAddToOrder(selectedItem)}
                  className="w-full"
                  size="lg"
                >
                  Add to Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};