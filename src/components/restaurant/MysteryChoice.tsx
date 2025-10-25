import { useState } from 'react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { menuItems, categories } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MysteryChoice = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [mysteryItem, setMysteryItem] = useState<MenuItemType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSurpriseMe = async () => {
    if (!selectedCategory) {
      toast({
        title: "Select a Category",
        description: "Please choose a category first to get your mystery item!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMysteryItem(null);

    // Simulate loading with random delay
    const loadingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    
    setTimeout(() => {
      const categoryItems = menuItems.filter(item => item.category.id === selectedCategory);
      const randomItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];
      setMysteryItem(randomItem);
      setIsLoading(false);
      
      toast({
        title: "Mystery Revealed! ✨",
        description: `Your mystery choice is ${randomItem.name}!`,
      });
    }, loadingTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-white border-none font-semibold"
          style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Mystery Choice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Gift className="h-5 w-5 text-purple-500" />
            Mystery Choice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Choose a Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category for your surprise..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSurpriseMe}
            disabled={isLoading || !selectedCategory}
            className="w-full text-white font-semibold py-3"
            style={{ background: isLoading || !selectedCategory ? undefined : 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing Your Surprise...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Surprise Me!
              </>
            )}
          </Button>

          {isLoading && (
            <Card className="border-dashed border-purple-300">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-purple-200 rounded mb-2"></div>
                    <div className="h-3 bg-purple-100 rounded w-3/4 mx-auto"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecting something special for you...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {mysteryItem && !isLoading && (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg text-center text-purple-700">
                  🎉 Your Mystery Choice!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <img 
                    src={mysteryItem.image} 
                    alt={mysteryItem.name}
                    className="w-24 h-24 object-cover rounded-full mx-auto shadow-lg"
                  />
                  <h3 className="font-bold text-lg">{mysteryItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{mysteryItem.description}</p>
                  <p className="text-xl font-bold text-purple-600">${mysteryItem.price.toFixed(2)}</p>
                  {mysteryItem.isPopular && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      ⭐ Popular Choice
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MysteryChoice;