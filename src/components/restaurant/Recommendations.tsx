import { useState, useMemo } from 'react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { menuItems } from '@/data/menuData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Heart, Zap, Coffee } from 'lucide-react';

type WeatherType = 'sunny' | 'rainy' | 'cloudy';
type MoodType = 'happy' | 'sad' | 'energetic';

const Recommendations = () => {
  const [currentWeather] = useState<WeatherType>('sunny'); // Mock weather
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');

  // Mock user history (frequently ordered items)
  const userFavorites = ['pasta-1', 'des-1', 'sea-1'];

  const weatherRecommendations = useMemo(() => {
    const weatherMapping = {
      sunny: ['sea-1', 'bev-1', 'des-2'], // Light, refreshing items
      rainy: ['pasta-1', 'main-1', 'bev-2'], // Warm, comforting items
      cloudy: ['app-1', 'pasta-2', 'des-1'] // Moderate, cozy items
    };
    
    return menuItems.filter(item => 
      weatherMapping[currentWeather].includes(item.id)
    );
  }, [currentWeather]);

  const moodRecommendations = useMemo(() => {
    const moodMapping = {
      happy: ['des-1', 'bev-1', 'app-1'], // Celebration foods
      sad: ['pasta-1', 'des-2', 'bev-2'], // Comfort foods
      energetic: ['main-1', 'sea-1', 'bev-2'] // Protein-rich, energizing
    };
    
    return menuItems.filter(item => 
      moodMapping[selectedMood].includes(item.id)
    );
  }, [selectedMood]);

  const historyRecommendations = useMemo(() => {
    return menuItems.filter(item => 
      userFavorites.includes(item.id)
    );
  }, []);

  const getWeatherIcon = (weather: WeatherType) => {
    switch (weather) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      case 'cloudy': return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return <Heart className="h-4 w-4 text-pink-500" />;
      case 'sad': return <Coffee className="h-4 w-4 text-brown-500" />;
      case 'energetic': return <Zap className="h-4 w-4 text-orange-500" />;
    }
  };

  const RecommendationCard = ({ item, reason }: { item: MenuItemType; reason: string }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{item.name}</h4>
            <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {reason}
              </Badge>
              <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-600">🎯</span>
            Recommendations For You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weather-based recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {getWeatherIcon(currentWeather)}
              <h3 className="font-semibold">Perfect for Today's Weather</h3>
              <Badge variant="outline" className="capitalize">
                {currentWeather}
              </Badge>
            </div>
            <div className="grid gap-3">
              {weatherRecommendations.slice(0, 2).map((item) => (
                <RecommendationCard 
                  key={item.id} 
                  item={item} 
                  reason={`${currentWeather} day special`}
                />
              ))}
            </div>
          </div>

          {/* Mood-based recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {getMoodIcon(selectedMood)}
              <h3 className="font-semibold">Mood Boosters</h3>
              <div className="flex gap-1">
                {(['happy', 'sad', 'energetic'] as MoodType[]).map((mood) => (
                  <Button
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood)}
                    className="text-xs capitalize"
                  >
                    {getMoodIcon(mood)}
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {moodRecommendations.slice(0, 2).map((item) => (
                <RecommendationCard 
                  key={item.id} 
                  item={item} 
                  reason={`${selectedMood} mood`}
                />
              ))}
            </div>
          </div>

          {/* History-based recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600">🔄</span>
              <h3 className="font-semibold">Your Favorites</h3>
              <Badge variant="outline">Based on your orders</Badge>
            </div>
            <div className="grid gap-3">
              {historyRecommendations.slice(0, 2).map((item) => (
                <RecommendationCard 
                  key={item.id} 
                  item={item} 
                  reason="frequently ordered"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;