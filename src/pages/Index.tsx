import { useState, useMemo } from 'react';
import { MenuItem as MenuItemType, OrderItem, Language, TimeCategory } from '@/types/menu';
import { menuItems, categories } from '@/data/menuData';
import { Header } from '@/components/restaurant/Header';
import { CategoryTabs } from '@/components/restaurant/CategoryTabs';
import { FilterOptions } from '@/components/restaurant/FilterDialog';
import { MenuItem } from '@/components/restaurant/MenuItem';
import { OrderSummary } from '@/components/restaurant/OrderSummary';
import { Footer } from '@/components/restaurant/Footer';
import MysteryChoice from '@/components/restaurant/MysteryChoice';
import Recommendations from '@/components/restaurant/Recommendations';
import Challenges from '@/components/restaurant/Challenges';
import { TrendingItems } from '@/components/restaurant/TrendingItems';
import { SpinRoulette } from '@/components/restaurant/SpinRoulette';
import { Stories, StoriesButton } from '@/components/restaurant/Stories';
import { TimeBasedMenu } from '@/components/restaurant/TimeBasedMenu';
import { OrderHistory } from '@/components/restaurant/OrderHistory';
import { AdvertisementPopup } from '@/components/restaurant/AdvertisementPopup';
import { CustomerProfile } from '@/components/restaurant/CustomerProfile';
import { PaymentPage } from '@/components/restaurant/PaymentPage';
import restaurantHero from '@/assets/restaurant-hero.jpg';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('az');
  const [activeTimeCategory, setActiveTimeCategory] = useState<TimeCategory | null>(null);
  const [showStories, setShowStories] = useState(false);
  const [loggedInCustomer, setLoggedInCustomer] = useState<{ fullName: string; phoneNumber: string } | null>(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'name',
    sortOrder: 'asc',
    selectedCategories: [],
    priceRange: [0, 50],
    labels: [],
  });
  const { toast } = useToast();

  // Filter menu items based on search, category, time, and filters
  const filteredMenuItems = useMemo(() => {
    let filtered = menuItems;

    // Filter by time category first
    if (activeTimeCategory) {
      filtered = filtered.filter(item => 
        item.timeCategory?.includes(activeTimeCategory) || 
        item.timeCategory?.includes('all-day')
      );
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(item => item.category.id === activeCategory);
    }

    // Filter by selected categories from filters
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(item => 
        filters.selectedCategories.includes(item.category.id)
      );
    }

    // Filter by price range
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    // Filter by labels
    if (filters.labels.length > 0) {
      filtered = filtered.filter(item => {
        return filters.labels.some(label => {
          switch (label) {
            case 'vegan':
              return item.dietary?.includes('vegan') || item.labels?.includes('vegan');
            case 'vegetarian':
              return item.dietary?.includes('vegetarian') || item.labels?.includes('vegetarian');
            case 'discounted':
              return item.labels?.includes('discounted');
            case 'popular':
              return item.isPopular || item.labels?.includes('popular');
            case 'trending':
              return item.isTrending;
            default:
              return false;
          }
        });
      });
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
      // First sort by trending status if not filtered by trending
      if (!filters.labels.includes('trending')) {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
      }
      
      // Then by the selected sort option
      let comparison = 0;
      if (filters.sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (filters.sortBy === 'prepTime') {
        comparison = (a.prepTime || 0) - (b.prepTime || 0);
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, activeCategory, activeTimeCategory, filters]);

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

  const handleLoginSuccess = (customer: { fullName: string; phoneNumber: string }) => {
    setLoggedInCustomer(customer);
  };

  const handleLogout = () => {
    setLoggedInCustomer(null);
  };

  // Show payment page if requested
  if (showPaymentPage) {
    return (
      <PaymentPage 
        orderItems={orderItems.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity
        }))}
        onPaymentComplete={() => {
          setShowPaymentPage(false);
          setOrderItems([]);
          toast({
            title: "Payment Successful!",
            description: "Thank you for your order. Enjoy your meal!",
          });
        }}
        onBack={() => setShowPaymentPage(false)}
      />
    );
  }

  // Show customer profile if requested
  if (showCustomerProfile && loggedInCustomer) {
    return (
      <CustomerProfile 
        customer={loggedInCustomer} 
        onLogout={() => {
          handleLogout();
          setShowCustomerProfile(false);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        onSearchChange={setSearchQuery}
        onCategorySelect={setActiveCategory}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onLoginSuccess={handleLoginSuccess}
        currentCustomer={loggedInCustomer}
        onShowProfile={() => setShowCustomerProfile(true)}
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

      {/* Trending Items */}
      <TrendingItems items={menuItems} />

      {/* Special Features */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
          <MysteryChoice />
          <SpinRoulette items={filteredMenuItems} categories={categories} onAddToOrder={handleAddToOrder} />
          <StoriesButton onClick={() => setShowStories(true)} />
          <Challenges />
        </div>
        <Recommendations />
      </section>

      {/* Time-Based Menu Filter */}
      <TimeBasedMenu 
        currentTimeCategory={activeTimeCategory}
        onTimeCategoryChange={setActiveTimeCategory}
      />

      {/* Category Navigation */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
        filters={filters}
        onFiltersChange={setFilters}
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
        onProceedToPayment={() => setShowPaymentPage(true)}
      />

      {/* Footer */}
      <Footer />
      
      {/* Stories Modal */}
      <Stories 
        isOpen={showStories} 
        onClose={() => setShowStories(false)} 
      />
      
      {/* Advertisement Popup */}
      <AdvertisementPopup onAddToOrder={handleAddToOrder} />
      
      <Toaster />
    </div>
  );
};

export default Index;
