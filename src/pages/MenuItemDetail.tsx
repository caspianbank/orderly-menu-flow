import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { menuItems } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';

// Types for customization options
interface SizeOption {
  id: string;
  name: string;
  priceModifier: number;
}

interface StyleOption {
  id: string;
  name: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

const sizeOptions: SizeOption[] = [
  { id: 'small', name: 'Small', priceModifier: -2.00 },
  { id: 'medium', name: 'Medium', priceModifier: 0 },
  { id: 'large', name: 'Large', priceModifier: 3.00 },
];

const styleOptions: StyleOption[] = [
  { id: 'regular', name: 'Regular' },
  { id: 'hot', name: 'Hot' },
  { id: 'iced', name: 'Iced' },
];

const addOns: AddOn[] = [
  { id: 'extra-shot', name: 'Extra Shot', price: 1.50 },
  { id: 'oat-milk', name: 'Oat Milk', price: 0.75 },
  { id: 'almond-milk', name: 'Almond Milk', price: 0.75 },
  { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 0.50 },
  { id: 'caramel-syrup', name: 'Caramel Syrup', price: 0.50 },
  { id: 'whipped-cream', name: 'Whipped Cream', price: 0.75 },
];

export default function MenuItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<MenuItemType | null>(null);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedStyle, setSelectedStyle] = useState('regular');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);

  useEffect(() => {
    const foundItem = menuItems.find(menuItem => menuItem.id === id);
    if (foundItem) {
      setItem(foundItem);
    }
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Item not found</p>
      </div>
    );
  }

  const getDietaryBadgeColor = (dietary: string) => {
    const colors = {
      vegetarian: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200',
      vegan: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200',
      'gluten-free': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200',
      'dairy-free': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200',
      'nut-free': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200',
      halal: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-200',
      kosher: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200',
    };
    return colors[dietary as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateTotalPrice = () => {
    const sizePrice = sizeOptions.find(s => s.id === selectedSize)?.priceModifier || 0;
    const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    
    return (item.price + sizePrice + addOnsPrice) * quantity;
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${item.name} - $${calculateTotalPrice().toFixed(2)}`,
    });
    navigate('/');
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  // Get images for carousel
  const carouselImages = item.images && item.images.length > 0 ? item.images : [item.image];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{item.name}</h1>
        </div>
      </div>

      {/* Section 1: Item Presentation */}
      <div className="w-full">
        {/* Image Gallery */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="w-full h-full">
                    <img 
                      src={image} 
                      alt={`${item.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
              {item.video && (
                <CarouselItem>
                  <div className="w-full h-full">
                    <video 
                      controls
                      className="w-full h-full object-cover"
                      poster={item.image}
                    >
                      <source src={item.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Core Info */}
        <div className="container mx-auto px-4 pt-8 pb-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{item.name}</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</div>
              {item.prepTime && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{item.prepTime} min</span>
                </div>
              )}
            </div>
            
            {/* Social Proof - Mock data */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8 · 234 reviews)</span>
            </div>
          </div>

          {/* Extended Description */}
          <p className="text-muted-foreground leading-relaxed">
            {item.description}. Expertly crafted with premium ingredients sourced from local suppliers, 
            this dish delivers an exceptional flavor profile that balances tradition with modern culinary innovation.
          </p>
        </div>
      </div>

      {/* Section 2: Customization */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customize Your Order</h3>
              
              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  {sizeOptions.map((size) => (
                    <div key={size.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={size.id} id={size.id} />
                        <Label htmlFor={size.id} className="cursor-pointer font-normal">
                          {size.name}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {size.priceModifier > 0 ? `+$${size.priceModifier.toFixed(2)}` : 
                         size.priceModifier < 0 ? `-$${Math.abs(size.priceModifier).toFixed(2)}` : 
                         'Standard'}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-6" />

              {/* Style Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Preparation Style</Label>
                <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle}>
                  {styleOptions.map((style) => (
                    <div key={style.id} className="flex items-center p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <RadioGroupItem value={style.id} id={`style-${style.id}`} className="mr-3" />
                      <Label htmlFor={`style-${style.id}`} className="cursor-pointer font-normal">
                        {style.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator className="my-6" />

              {/* Add-ons */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Add-ons</Label>
                <div className="space-y-2">
                  {addOns.map((addOn) => (
                    <div key={addOn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id={addOn.id}
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={() => toggleAddOn(addOn.id)}
                        />
                        <Label htmlFor={addOn.id} className="cursor-pointer font-normal">
                          {addOn.name}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">+${addOn.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Special Notes */}
              <div className="space-y-3">
                <Label htmlFor="special-notes" className="text-base font-medium">Special Instructions</Label>
                <Textarea
                  id="special-notes"
                  placeholder="Any special requests or dietary restrictions?"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Transparency & Detail */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Dietary Information */}
            {item.dietary.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
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

            {/* Allergen Warnings */}
            {item.allergens.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-base font-semibold mb-3 text-destructive">Allergen Warning</h3>
                  <p className="text-sm text-muted-foreground">
                    Contains: {item.allergens.join(', ')}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Nutritional Information */}
            <div>
              <button
                onClick={() => setShowNutritionalInfo(!showNutritionalInfo)}
                className="flex items-center justify-between w-full text-base font-semibold"
              >
                <span>Nutritional Information</span>
                {showNutritionalInfo ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {showNutritionalInfo && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm">450 kcal</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm">25g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">Carbohydrates</span>
                    <span className="text-sm">35g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm">18g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium">Fiber</span>
                    <span className="text-sm">6g</span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="text-base font-semibold mb-3">Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                {item.ingredients.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 border rounded-lg p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold min-w-[2ch] text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Add to Cart - ${calculateTotalPrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
