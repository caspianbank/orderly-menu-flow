import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dices, Sparkles } from 'lucide-react';
import { MenuItem, MenuCategory } from '@/types/menu';

interface SpinRouletteProps {
  items: MenuItem[];
  categories: MenuCategory[];
  onAddToOrder: (item: MenuItem) => void;
}

export const SpinRoulette = ({ items, categories, onAddToOrder }: SpinRouletteProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category.id === selectedCategory);

  const spinWheel = () => {
    if (isSpinning || filteredItems.length === 0) return;
    
    setIsSpinning(true);
    setSelectedItem(null);
    
    // Play spin sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore audio play errors (e.g., user hasn't interacted with page yet)
      });
    }
    
    // Random rotation between 1800 and 3600 degrees (5-10 full rotations)
    const randomRotation = 1800 + Math.random() * 1800;
    setRotation(prev => prev + randomRotation);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      setSelectedItem(filteredItems[randomIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  const wheelItems = filteredItems.slice(0, 6); // Limit to 6 items for better visual and less overlap
  const itemAngle = 360 / (wheelItems.length || 1);

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
        
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Choose Category:</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          {/* Roulette Wheel */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-4 h-6 bg-primary transform rotate-180" 
                   style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              </div>
            </div>
            
            <div 
              className="relative w-80 h-80 rounded-full border-8 border-primary shadow-2xl overflow-hidden transition-transform ease-out"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? '4s' : '0.3s',
                background: wheelItems.length > 0 
                  ? `conic-gradient(${wheelItems.map((_, index) => {
                      const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--primary)/0.8)', 'hsl(var(--secondary)/0.8)', 'hsl(var(--accent)/0.8)'];
                      const startAngle = (index * itemAngle);
                      const endAngle = ((index + 1) * itemAngle);
                      return `${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg`;
                    }).join(', ')})` 
                  : 'hsl(var(--muted))'
              }}
            >
              {wheelItems.map((item, index) => {
                const angle = index * itemAngle;
                const textAngle = angle + itemAngle / 2;
                const radius = 100; // Distance from center
                const x = 50 + (radius * 0.6 * Math.cos((textAngle - 90) * Math.PI / 180));
                const y = 50 + (radius * 0.6 * Math.sin((textAngle - 90) * Math.PI / 180));
                
                return (
                  <div
                    key={item.id}
                    className="absolute text-white font-bold text-center pointer-events-none"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${textAngle}deg)`,
                      fontSize: wheelItems.length <= 4 ? '12px' : '10px',
                      lineHeight: '1.2',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      width: wheelItems.length <= 4 ? '80px' : '60px'
                    }}
                  >
                    <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name.length > (wheelItems.length <= 4 ? 12 : 8) 
                        ? item.name.substring(0, wheelItems.length <= 4 ? 12 : 8) + '...' 
                        : item.name}
                    </div>
                    <div className="text-[8px] opacity-90 mt-1">
                      ${item.price}
                    </div>
                  </div>
                );
              })}
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-background border-4 border-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <Dices className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
          
          {/* Spin Button */}
          <Button 
            onClick={spinWheel}
            disabled={isSpinning || filteredItems.length === 0}
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
          
          {filteredItems.length === 0 && (
            <p className="text-muted-foreground text-center">
              No items available in selected category
            </p>
          )}
          
          {/* Hidden audio element for spin sound */}
          <audio 
            ref={audioRef}
            preload="auto"
            className="hidden"
          >
            <source src="data:audio/wav;base64,UklGRvIBAABXQVZFZm10IBAAAAABAAABACEAACAHAAACAAEAQWF0YdQBAAA=" type="audio/wav" />
          </audio>
          
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