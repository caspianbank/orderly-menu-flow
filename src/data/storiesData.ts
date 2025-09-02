import { StoryCollection } from '@/types/stories';
import restaurantLogo from '@/assets/restaurant-logo.png';
import dishPasta from '@/assets/dish-pasta.jpg';
import dishSalmon from '@/assets/dish-salmon.jpg';
import dishDessert from '@/assets/dish-dessert.jpg';
import dishAppetizer from '@/assets/dish-appetizer.jpg';
import restaurantHero from '@/assets/restaurant-hero.jpg';

export const restaurantStories: StoryCollection = {
  id: 'bella-vista',
  restaurantName: 'Bella Vista',
  avatar: restaurantLogo,
  hasUnread: true,
  stories: [
    {
      id: 'story-1',
      type: 'interior',
      title: 'Beautiful Evening Ambiance',
      image: restaurantHero,
      duration: 15,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      author: {
        name: 'Bella Vista',
        avatar: restaurantLogo
      },
      loves: 124,
      isLoved: false,
      responses: [
        {
          id: 'resp-1',
          author: {
            name: 'Sarah M.',
            avatar: '👩‍🦰'
          },
          message: 'Such a romantic atmosphere! 💕',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'resp-2',
          author: {
            name: 'Mike R.',
            avatar: '👨'
          },
          message: 'Perfect for date night!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]
    },
    {
      id: 'story-2',
      type: 'meal',
      title: 'Chef\'s Special Pasta',
      image: dishPasta,
      duration: 15,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      author: {
        name: 'Chef Marco',
        avatar: '👨‍🍳'
      },
      loves: 89,
      isLoved: true,
      responses: [
        {
          id: 'resp-3',
          author: {
            name: 'Emily C.',
            avatar: '👩'
          },
          message: 'Looks absolutely delicious! 🤤',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 'story-3',
      type: 'meal',
      title: 'Fresh Salmon Today',
      image: dishSalmon,
      duration: 15,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      author: {
        name: 'Bella Vista',
        avatar: restaurantLogo
      },
      loves: 156,
      isLoved: false,
      responses: []
    },
    {
      id: 'story-4',
      type: 'meal',
      title: 'Decadent Dessert',
      image: dishDessert,
      duration: 15,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      author: {
        name: 'Pastry Chef',
        avatar: '👩‍🍳'
      },
      loves: 203,
      isLoved: true,
      responses: [
        {
          id: 'resp-4',
          author: {
            name: 'David L.',
            avatar: '👨‍💼'
          },
          message: 'My sweet tooth is calling! 🍰',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
        }
      ]
    }
  ]
};