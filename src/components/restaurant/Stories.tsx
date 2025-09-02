import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Story, StoryResponse } from '@/types/stories';
import { restaurantStories } from '@/data/storiesData';
import { useToast } from '@/hooks/use-toast';

interface StoriesProps {
  isOpen: boolean;
  onClose: () => void;
  initialStoryIndex?: number;
}

export const Stories = ({ isOpen, onClose, initialStoryIndex = 0 }: StoriesProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stories, setStories] = useState(restaurantStories.stories);
  const [showResponses, setShowResponses] = useState(false);
  const [responseText, setResponseText] = useState('');
  const { toast } = useToast();

  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen || isPaused || showResponses) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + (100 / (currentStory.duration * 10));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, currentStoryIndex, isPaused, showResponses, currentStory.duration]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStoryIndex(initialStoryIndex);
      setProgress(0);
      setShowResponses(false);
    }
  }, [isOpen, initialStoryIndex]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
      setShowResponses(false);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
      setShowResponses(false);
    }
  };

  const toggleLove = () => {
    setStories(prev => 
      prev.map(story => 
        story.id === currentStory.id 
          ? { 
              ...story, 
              isLoved: !story.isLoved,
              loves: story.isLoved ? story.loves - 1 : story.loves + 1
            }
          : story
      )
    );
  };

  const sendResponse = () => {
    if (!responseText.trim()) return;

    const newResponse: StoryResponse = {
      id: `resp-${Date.now()}`,
      author: {
        name: 'You',
        avatar: '👤'
      },
      message: responseText,
      timestamp: new Date()
    };

    setStories(prev => 
      prev.map(story => 
        story.id === currentStory.id 
          ? { ...story, responses: [...story.responses, newResponse] }
          : story
      )
    );

    setResponseText('');
    toast({
      title: "Response sent!",
      description: "Your message has been sent to the restaurant.",
    });
  };

  if (!isOpen || !currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Progress bars */}
          <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: index < currentStoryIndex ? '100%' : 
                           index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white pt-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarImage src={currentStory.author.avatar} />
                <AvatarFallback>{currentStory.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{currentStory.author.name}</p>
                <p className="text-xs text-white/80">
                  {new Date(currentStory.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Story Image */}
          <div className="relative flex-1 flex items-center justify-center">
            <img 
              src={currentStory.image}
              alt={currentStory.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation areas */}
            <button 
              className="absolute left-0 top-0 w-1/3 h-full z-10"
              onClick={prevStory}
            />
            <button 
              className="absolute right-0 top-0 w-1/3 h-full z-10"
              onClick={nextStory}
            />
            
            {/* Pause on tap */}
            <button 
              className="absolute inset-0 z-5"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
            />
          </div>

          {/* Story Title */}
          <div className="absolute bottom-20 left-4 right-4 z-20">
            <h3 className="text-white text-lg font-bold mb-2">{currentStory.title}</h3>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLove}
                className={`text-white hover:bg-white/20 ${currentStory.isLoved ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-6 h-6 ${currentStory.isLoved ? 'fill-red-500' : ''}`} />
                <span className="ml-1 text-sm">{currentStory.loves}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponses(!showResponses)}
                className="text-white hover:bg-white/20"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="ml-1 text-sm">{currentStory.responses.length}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStory}
                disabled={currentStoryIndex === 0}
                className="text-white hover:bg-white/20 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextStory}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Response panel */}
          {showResponses && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm text-white p-4 max-h-64 overflow-y-auto">
              <div className="space-y-3 mb-4">
                {currentStory.responses.map((response) => (
                  <div key={response.id} className="flex items-start gap-2">
                    <div className="text-lg">{response.author.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{response.author.name}</p>
                      <p className="text-sm text-white/80">{response.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Send a message..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendResponse()}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button
                  onClick={sendResponse}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface StoriesButtonProps {
  onClick: () => void;
}

export const StoriesButton = ({ onClick }: StoriesButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border-pink-500/20 hover:from-pink-500/20 hover:to-purple-600/20"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-[2px]">
          <Avatar className="w-full h-full">
            <AvatarImage src={restaurantStories.avatar} />
            <AvatarFallback>BV</AvatarFallback>
          </Avatar>
        </div>
        {restaurantStories.hasUnread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>
      <span className="font-medium">Restaurant Stories</span>
      <Play className="w-4 h-4" />
    </Button>
  );
};