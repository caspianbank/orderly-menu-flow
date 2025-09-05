export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  images?: string[];
  ingredients: string[];
  allergens: string[];
  dietary: DietaryInfo[];
  isPopular?: boolean;
  isSpecial?: boolean;
  prepTime?: number;
  isTrending?: boolean;
  ordersToday?: number;
  timeCategory?: TimeCategory[];
  labels?: string[];
}

export type TimeCategory = 'breakfast' | 'lunch' | 'dinner' | 'late-night' | 'all-day';

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  customerName?: string;
  tableNumber?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  createdAt: Date;
}

export type DietaryInfo = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'halal' | 'kosher';

export type Language = 'az' | 'en' | 'es' | 'fr' | 'de' | 'it';

export interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: {
    [key: string]: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}