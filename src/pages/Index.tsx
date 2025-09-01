import { useState, useMemo } from 'react';
import { MenuItem as MenuItemType, OrderItem, Language } from '@/types/menu';
import { menuItems, categories } from '@/data/menuData';
import { Header } from '@/components/restaurant/Header';
import { CategoryTabs } from '@/components/restaurant/CategoryTabs';
import { MenuItem } from '@/components/restaurant/MenuItem';
import { OrderSummary } from '@/components/restaurant/OrderSummary';
import { Footer } from '@/components/restaurant/Footer';
import MysteryChoice from '@/components/restaurant/MysteryChoice';
import Recommendations from '@/components/restaurant/Recommendations';
import Challenges from '@/components/restaurant/Challenges';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('az');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Filter menu items based on search and category
  const filteredMenuItems = useMemo(() => {
    let filtered = menuItems;

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(item => item.category.id === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(query)
        ) ||
        item.category.name.toLowerCase().includes(query)
      );
    }

    // Sort the filtered results
    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, activeCategory, sortBy, sortOrder]);

  const handleAddToOrder = (item: MenuItemType) => {
    setOrderItems(prev => {
      const existingItem = prev.find(orderItem => orderItem.menuItem.id === item.id);

      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.menuItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }

      return [...prev, { menuItem: item, quantity: 1 }];
    });

    toast({
      title: "Added to Order",
      description: `${item.name} has been added to your order.`,
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setOrderItems(prev =>
      prev.map(orderItem =>
        orderItem.menuItem.id === itemId
          ? { ...orderItem, quantity }
          : orderItem
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(orderItem => orderItem.menuItem.id !== itemId));

    toast({
      title: "Item Removed",
      description: "Item has been removed from your order.",
    });
  };

  const handlePlaceOrder = (customerInfo: { name: string; tableNumber: string; notes?: string }) => {
    // In a real app, this would send the order to a backend
    console.log('Order placed:', {
      items: orderItems,
      customer: customerInfo,
      total: orderItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0)
    });

    // Clear the order
    setOrderItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onSearchChange={setSearchQuery}
        onCategorySelect={setActiveCategory}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurantHero}
          alt="Restaurant interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Welcome to Bella Vista
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              An elegant dining experience with Mediterranean flavors
            </p>
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
          <MysteryChoice />
          <Challenges />
        </div>
        <Recommendations />
      </section>

      {/* Category Navigation */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
      />

      {/* Menu Items Grid */}
      <main className="container mx-auto px-4">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No dishes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse different categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
            {filteredMenuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onAddToOrder={handleAddToOrder}
              />
            ))}
          </div>
        )}
      </main>

      {/* Order Summary */}
      <OrderSummary
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Footer */}
      <Footer />

      <Toaster />
    </div>
  );
};

export default Index;
