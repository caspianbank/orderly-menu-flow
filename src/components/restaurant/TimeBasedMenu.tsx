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

  return (
    <section className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-primary" size={20} />
        <h3 className="text-lg font-semibold">Menu by Time</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={currentTimeCategory === null ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
          onClick={() => onTimeCategoryChange(null)}
        >
          All Day
        </Badge>
        
        {timeCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = currentTimeCategory === category.id;
          const isCurrent = category.active;
          
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2 flex items-center gap-2 ${
                isCurrent ? category.color : ''
              } ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}
              onClick={() => onTimeCategoryChange(category.id)}
            >
              <Icon size={14} />
              <span>{category.name}</span>
              <span className="text-xs opacity-70">{category.time}</span>
              {isCurrent && (
                <span className="animate-pulse">●</span>
              )}
            </Badge>
          );
        })}
      </div>
      
      {actualCurrentCategory && (
        <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <Clock size={14} />
          Currently serving: <strong>{timeCategories.find(c => c.id === actualCurrentCategory)?.name}</strong>
        </p>
      )}
    </section>
  );
};