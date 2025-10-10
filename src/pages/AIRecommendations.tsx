import { useState } from 'react';
import { ArrowLeft, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { menuItems } from '@/data/menuData';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  recommendations?: MenuItemType[];
}

interface PromptButton {
  category: string;
  questions: string[];
}

const promptCategories: PromptButton[] = [
  {
    category: 'Mood/Craving',
    questions: [
      "I'm craving something spicy.",
      "What's light and refreshing today?",
      "I need comfort food.",
    ],
  },
  {
    category: 'Dietary/Restriction',
    questions: [
      "Show me vegan options.",
      "What's gluten-free?",
      "What has no dairy?",
    ],
  },
  {
    category: 'Popularity/Signature',
    questions: [
      "What is the Chef's special?",
      "What are your most popular dishes?",
      "What's the best seller right now?",
    ],
  },
  {
    category: 'Pairing',
    questions: [
      "What drink pairs well with pasta?",
      "Recommend a dessert for coffee.",
      "What goes well with seafood?",
    ],
  },
];

const AIRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hi! I'm your AI food guide. What kind of dish are you looking for today? Tap any question below to get started!",
    },
  ]);

  const getRecommendations = (question: string): MenuItemType[] => {
    const lowerQuestion = question.toLowerCase();
    
    // Spicy
    if (lowerQuestion.includes('spicy')) {
      return menuItems
        .filter(item => 
          item.description.toLowerCase().includes('spicy') || 
          item.name.toLowerCase().includes('spicy') ||
          item.ingredients.some(ing => ing.toLowerCase().includes('spicy'))
        )
        .slice(0, 3);
    }
    
    // Light and refreshing
    if (lowerQuestion.includes('light') || lowerQuestion.includes('refreshing')) {
      return menuItems
        .filter(item => 
          item.category.id === 'appetizers' || 
          item.category.id === 'seafood' ||
          item.dietary?.includes('vegan')
        )
        .slice(0, 3);
    }
    
    // Comfort food
    if (lowerQuestion.includes('comfort')) {
      return menuItems
        .filter(item => 
          item.category.id === 'pasta' || 
          item.category.id === 'mains'
        )
        .slice(0, 3);
    }
    
    // Vegan
    if (lowerQuestion.includes('vegan')) {
      return menuItems
        .filter(item => item.dietary?.includes('vegan'))
        .slice(0, 3);
    }
    
    // Gluten-free
    if (lowerQuestion.includes('gluten-free') || lowerQuestion.includes('gluten free')) {
      return menuItems
        .filter(item => item.dietary?.includes('gluten-free'))
        .slice(0, 3);
    }
    
    // No dairy
    if (lowerQuestion.includes('dairy')) {
      return menuItems
        .filter(item => !item.allergens.includes('Dairy'))
        .slice(0, 3);
    }
    
    // Chef's special
    if (lowerQuestion.includes('chef') || lowerQuestion.includes('special')) {
      return menuItems
        .filter(item => item.isSpecial)
        .slice(0, 3);
    }
    
    // Popular dishes
    if (lowerQuestion.includes('popular')) {
      return menuItems
        .filter(item => item.isPopular)
        .slice(0, 3);
    }
    
    // Best seller / trending
    if (lowerQuestion.includes('best seller') || lowerQuestion.includes('trending')) {
      return menuItems
        .filter(item => item.isTrending)
        .sort((a, b) => (b.ordersToday || 0) - (a.ordersToday || 0))
        .slice(0, 3);
    }
    
    // Pairing with pasta
    if (lowerQuestion.includes('pasta')) {
      return menuItems
        .filter(item => 
          item.category.id === 'beverages' && 
          (item.name.toLowerCase().includes('wine') || item.name.toLowerCase().includes('water'))
        )
        .slice(0, 2);
    }
    
    // Dessert for coffee
    if (lowerQuestion.includes('dessert') && lowerQuestion.includes('coffee')) {
      return menuItems
        .filter(item => item.category.id === 'desserts')
        .slice(0, 3);
    }
    
    // Pairing with seafood
    if (lowerQuestion.includes('seafood')) {
      return menuItems
        .filter(item => 
          item.category.id === 'beverages' && 
          item.name.toLowerCase().includes('wine')
        )
        .slice(0, 2);
    }
    
    // Default: return popular items
    return menuItems
      .filter(item => item.isPopular || item.isTrending)
      .slice(0, 3);
  };

  const getAIResponse = (question: string, recommendations: MenuItemType[]): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('spicy')) {
      return "Here are some fiery options that will satisfy your spicy craving!";
    }
    if (lowerQuestion.includes('light') || lowerQuestion.includes('refreshing')) {
      return "Perfect for a light meal! Here are our refreshing selections:";
    }
    if (lowerQuestion.includes('comfort')) {
      return "Nothing beats comfort food! These dishes are sure to warm your heart:";
    }
    if (lowerQuestion.includes('vegan')) {
      return "Great choice! Here are our delicious plant-based options:";
    }
    if (lowerQuestion.includes('gluten-free')) {
      return "We have excellent gluten-free options for you:";
    }
    if (lowerQuestion.includes('dairy')) {
      return "Here are our dairy-free selections:";
    }
    if (lowerQuestion.includes('chef') || lowerQuestion.includes('special')) {
      return "Our Chef's special creations, made with passion:";
    }
    if (lowerQuestion.includes('popular')) {
      return "Our most loved dishes by customers:";
    }
    if (lowerQuestion.includes('best seller') || lowerQuestion.includes('trending')) {
      return "These are flying off the kitchen! Our top trending items:";
    }
    if (lowerQuestion.includes('pasta')) {
      return "Perfect pairing for pasta! Try these beverages:";
    }
    if (lowerQuestion.includes('dessert') && lowerQuestion.includes('coffee')) {
      return "These sweet treats complement coffee beautifully:";
    }
    if (lowerQuestion.includes('seafood')) {
      return "Excellent choice! These pair wonderfully with seafood:";
    }
    
    return "Based on your preference, I recommend:";
  };

  const handlePromptClick = (question: string) => {
    const recommendations = getRecommendations(question);
    const aiResponse = getAIResponse(question, recommendations);
    
    setMessages(prev => [
      ...prev,
      { type: 'user', content: question },
      { 
        type: 'ai', 
        content: aiResponse,
        recommendations 
      },
    ]);
  };

  const handleAddToBasket = (item: MenuItemType) => {
    toast({
      title: "Added to Basket",
      description: `${item.name} has been added to your order.`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">AI Food Guide</h1>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[85%] space-y-3">
              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {/* Recommendations */}
              {message.recommendations && message.recommendations.length > 0 && (
                <div className="space-y-3">
                  {message.recommendations.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row gap-3 p-3">
                        {/* Item Image */}
                        <div className="flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          
                          {/* Dietary badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.dietary?.slice(0, 2).map((diet) => (
                              <Badge key={diet} variant="secondary" className="text-xs">
                                {diet}
                              </Badge>
                            ))}
                          </div>

                          {/* Price and Add button */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary text-base sm:text-lg">${item.price.toFixed(2)}</span>
                            <Button
                              size="icon"
                              onClick={() => handleAddToBasket(item)}
                              className="h-9 w-9 sm:h-10 sm:w-10"
                            >
                              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Predefined Prompts */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 space-y-3">
        <p className="text-sm text-muted-foreground text-center">Tap a question to get recommendations:</p>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {promptCategories.map((category) => (
            <div key={category.category} className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">{category.category}</p>
              <div className="space-y-2">
                {category.questions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handlePromptClick(question)}
                  >
                    <span className="text-sm">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
