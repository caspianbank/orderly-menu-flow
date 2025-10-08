import { Badge } from '@/components/ui/badge';
import { Clock, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { TimeCategory } from '@/types/menu';

interface TimeBasedMenuProps {
  currentTimeCategory: TimeCategory;
  onTimeCategoryChange: (category: TimeCategory | null) => void;
}

export const TimeBasedMenu = ({ currentTimeCategory, onTimeCategoryChange }: TimeBasedMenuProps) => {
  const getCurrentTimeCategory = (): TimeCategory => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'breakfast';
    if (hour >= 12 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 22) return 'dinner';
    return 'late-night';
  };

  const actualCurrentCategory = getCurrentTimeCategory();

  const timeCategories = [
    {
      id: 'breakfast' as TimeCategory,
      name: 'Breakfast',
      icon: Sunrise,
      time: '6:00 - 12:00',
      color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      active: actualCurrentCategory === 'breakfast'
    },
    {
      id: 'lunch' as TimeCategory,
      name: 'Lunch',
      icon: Sun,
      time: '12:00 - 14:00',
      color: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      active: actualCurrentCategory === 'lunch'
    },
    {
      id: 'dinner' as TimeCategory,
      name: 'Dinner',
      icon: Sunset,
      time: '14:00 - 22:00',
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      active: actualCurrentCategory === 'dinner'
    },
    {
      id: 'late-night' as TimeCategory,
      name: 'Late Night',
      icon: Moon,
      time: '22:00 - 6:00',
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      active: actualCurrentCategory === 'late-night'
    }
  ];

  return null;
};