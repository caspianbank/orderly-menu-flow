import { useState } from 'react';
import { ArrowLeft, Sparkles, ShoppingCart, ChevronsDown, ChevronsUp, Dice5, Eye, EyeOff } from 'lucide-react';
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
  isQuizQuestion?: boolean;
  mysteryReveal?: {
    item: MenuItemType;
    isRevealed: boolean;
  };
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: "Hi! I'm your AI food guide. What kind of dish are you looking for today? Tap any question below to get started!",
    },
  ]);
  const [mysteryMode, setMysteryMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);

  const togglePrompts = () => {
    setIsMinimized(prev => !prev);
  };

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

  const quizQuestions = [
    {
      question: "What's your current mood? 🎭",
      options: ["Adventurous", "Cozy & Relaxed", "Energetic", "Romantic"]
    },
    {
      question: "Do you want something sweet, spicy, or balanced? 🌶️",
      options: ["Sweet 🍰", "Spicy 🔥", "Balanced 🥗", "Savory 🍖"]
    },
    {
      question: "Would you rather try something new or go with a classic? ✨",
      options: ["Something New!", "Classic Comfort", "Chef's Special", "Surprise Me!"]
    },
    {
      question: "Are you eating alone or with someone? 👥",
      options: ["Solo Dining", "With Partner", "With Friends", "Family Feast"]
    }
  ];

  const startMysteryMode = () => {
    setMysteryMode(true);
    setQuizAnswers([]);
    setCurrentQuizStep(0);
    setMessages(prev => [
      ...prev,
      {
        type: 'ai',
        content: "🎲 Welcome to the Mysterious Meal Finder! I'll ask you a few fun questions to find your perfect match. Ready?",
      },
      {
        type: 'ai',
        content: quizQuestions[0].question,
        isQuizQuestion: true,
      }
    ]);
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    setMessages(prev => [
      ...prev,
      { type: 'user', content: answer }
    ]);

    if (currentQuizStep < quizQuestions.length - 1) {
      const nextStep = currentQuizStep + 1;
      setCurrentQuizStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            type: 'ai',
            content: quizQuestions[nextStep].question,
            isQuizQuestion: true,
          }
        ]);
      }, 500);
    } else {
      // Quiz complete - analyze and recommend
      setTimeout(() => {
        const recommendedItem = analyzeMysteryAnswers(newAnswers);
        setMessages(prev => [
          ...prev,
          {
            type: 'ai',
            content: "✨ Based on your answers, I've found the perfect dish for you! Would you like to see it now or keep it mysterious?",
            mysteryReveal: {
              item: recommendedItem,
              isRevealed: false
            }
          }
        ]);
        setMysteryMode(false);
      }, 800);
    }
  };

  const analyzeMysteryAnswers = (answers: string[]): MenuItemType => {
    let filteredItems = [...menuItems];
    
    // Mood-based filtering
    if (answers[0]?.includes('Adventurous') || answers[0]?.includes('Energetic')) {
      filteredItems = filteredItems.filter(item => item.isSpecial || item.isTrending);
    } else if (answers[0]?.includes('Cozy') || answers[0]?.includes('Romantic')) {
      filteredItems = filteredItems.filter(item => 
        item.category.id === 'pasta' || item.category.id === 'desserts'
      );
    }
    
    // Taste preference
    if (answers[1]?.includes('Spicy')) {
      filteredItems = filteredItems.filter(item => 
        item.description.toLowerCase().includes('spicy')
      );
    } else if (answers[1]?.includes('Sweet')) {
      filteredItems = filteredItems.filter(item => item.category.id === 'desserts');
    }
    
    // Novelty vs classic
    if (answers[2]?.includes('New') || answers[2]?.includes('Special')) {
      filteredItems = filteredItems.filter(item => item.isSpecial || item.isTrending);
    }
    
    // If filtering resulted in no items, use popular items
    if (filteredItems.length === 0) {
      filteredItems = menuItems.filter(item => item.isPopular || item.isTrending);
    }
    
    // Return random item from filtered list
    return filteredItems[Math.floor(Math.random() * filteredItems.length)];
  };

  const handleRevealMystery = (messageIndex: number) => {
    setMessages(prev => prev.map((msg, idx) => {
      if (idx === messageIndex && msg.mysteryReveal) {
        return {
          ...msg,
          mysteryReveal: {
            ...msg.mysteryReveal,
            isRevealed: true
          }
        };
      }
      return msg;
    }));
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
                className={`rounded-2xl px-4 py-3 animate-fade-in ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {/* Quiz Question Options */}
              {message.isQuizQuestion && message.type === 'ai' && (
                <div className="grid grid-cols-2 gap-2 animate-scale-in">
                  {quizQuestions[currentQuizStep]?.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className="h-auto py-3 text-sm border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      onClick={() => handleQuizAnswer(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Mystery Reveal */}
              {message.mysteryReveal && (
                <div className="space-y-3">
                  {!message.mysteryReveal.isRevealed ? (
                    <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/50 animate-scale-in">
                      <Dice5 className="h-16 w-16 mx-auto text-primary animate-pulse mb-4" />
                      <h3 className="font-bold text-lg mb-2">Your Mysterious Meal Awaits! 🎭</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Are you ready to discover what destiny has prepared for you?
                      </p>
                      <Button
                        onClick={() => handleRevealMystery(index)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Reveal My Mystery Meal
                      </Button>
                    </Card>
                  ) : (
                    <Card className="overflow-hidden animate-scale-in shadow-lg">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img
                          src={message.mysteryReveal.item.image}
                          alt={message.mysteryReveal.item.name}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
                          <Badge className="mb-2 bg-primary/90">✨ Your Perfect Match</Badge>
                          <h3 className="font-bold text-2xl">{message.mysteryReveal.item.name}</h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {message.mysteryReveal.item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {message.mysteryReveal.item.dietary?.map((diet) => (
                            <Badge key={diet} variant="secondary" className="text-xs">
                              {diet}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="font-bold text-primary text-xl">
                            ${message.mysteryReveal.item.price.toFixed(2)}
                          </span>
                          <Button
                            onClick={() => handleAddToBasket(message.mysteryReveal.item)}
                            className="gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Basket
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              )}

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
      <div 
        className="sticky bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-md border-t-2 border-primary/20 shadow-2xl transition-all duration-300"
        style={{ 
          bottom: 0,
          transform: isMinimized ? 'translateY(calc(100% - 60px))' : 'translateY(0)'
        }}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-center p-2 border-b border-primary/10">
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePrompts}
            className="gap-2 hover:bg-primary/10"
          >
            {isMinimized ? (
              <>
                <ChevronsUp className="h-4 w-4" />
                <span className="text-xs font-medium">Show Prompts</span>
              </>
            ) : (
              <>
                <ChevronsDown className="h-4 w-4" />
                <span className="text-xs font-medium">Hide Prompts</span>
              </>
            )}
          </Button>
        </div>

        <div className={`p-4 space-y-3 ${isMinimized ? 'hidden' : ''}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <p className="text-sm font-semibold text-foreground">Ask me anything about our menu!</p>
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>

          {/* Mystery Meal Finder Button */}
          <Button
            onClick={startMysteryMode}
            className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6 shadow-lg"
            disabled={mysteryMode}
          >
            <Dice5 className="h-5 w-5" />
            Try Mysterious Meal Finder 🎲
          </Button>
          
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {promptCategories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">{category.category}</p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>
                <div className="space-y-2">
                  {category.questions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-md"
                      onClick={() => handlePromptClick(question)}
                    >
                      <span className="text-sm font-medium">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
