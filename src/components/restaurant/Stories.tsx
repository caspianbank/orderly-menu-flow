import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight, Play, Share } from 'lucide-react';
import { Story, StoryResponse } from '@/types/stories';
import { restaurantStories } from '@/data/storiesData';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';

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

  const handleShare = async () => {
    const shareData = {
      title: currentStory.title,
      text: `Check out this story from ${currentStory.author.name}: ${currentStory.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Story shared!",
          description: "The story has been shared successfully.",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        toast({
          title: "Link copied!",
          description: "Story link has been copied to clipboard.",
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast({
          title: "Share failed",
          description: "Unable to share the story. Please try again.",
          variant: "destructive",
        });
      }
    }
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
    setShowResponses(false);
    toast({
      title: "Response sent!",
      description: "Your message has been sent to the restaurant.",
    });
  };

  if (!isOpen || !currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md h-[95vh] sm:h-[90vh] p-0 bg-black border-none">
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
          <div className="absolute top-4 left-3 right-3 sm:left-4 sm:right-4 z-20 flex items-center justify-between text-white pt-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Avatar className="w-8 h-8 border-2 border-white flex-shrink-0">
                <AvatarImage src={currentStory.author.avatar} />
                <AvatarFallback>{currentStory.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{currentStory.author.name}</p>
                <p className="text-xs text-white/80 truncate">
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
              className="text-white hover:bg-white/20 p-2 h-8 w-8 flex-shrink-0"
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
          <motion.div
            className="absolute bottom-0 z-20 px-3 sm:px-4"
            animate={{
              marginBottom: showResponses ? 60 : 0, // push up when input opens
            }}>
            <h1 className="p-3 sm:p-4 text-white text-base sm:text-lg font-bold mb-2">{currentStory.title}</h1>
          </motion.div>

          {/* Bottom actions + input */}
          <div className="absolute bottom-3 right-3 left-3 sm:bottom-4 sm:right-4 sm:left-4 z-20">
            <motion.div
              animate={{
                marginBottom: showResponses ? 60 : 0, // push up when input opens
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-end gap-1"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLove}
                className={`flex flex-col text-white w-10 sm:w-12 hover:bg-white/20 py-6 sm:py-8 transition-colors ${currentStory.isLoved ? "text-red-500" : ""}`}
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${currentStory.isLoved ? "fill-red-500" : ""}`} />
                <span className="text-xs sm:text-sm mt-1">{currentStory.loves}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponses(!showResponses)}
                className="flex flex-col text-white w-10 sm:w-12 hover:bg-white/20 py-6 sm:py-8 transition-colors"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm mt-1">{currentStory.responses.length}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex flex-col text-white w-10 sm:w-12 hover:bg-white/20 py-6 sm:py-8 transition-colors"
              >
                <Share className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm mt-1">Share</span>
              </Button>
            </motion.div>

            {/* Input box */}
            <AnimatePresence>
              {showResponses && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 right-0 bottom-0"
                >
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Send a message..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendResponse()}
                      className="flex-1 bg-white text-black placeholder:text-gray-500 rounded-full px-3 sm:px-4 py-2 text-sm"
                    />
                    <Button
                      onClick={sendResponse}
                      size="icon"
                      className="rounded-full bg-green-500 hover:bg-green-600 text-white h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
      className="flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border-pink-500/20 hover:from-pink-500/20 hover:to-purple-600/20 text-sm"
    >
      <div className="relative flex-shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-[2px]">
          <Avatar className="w-full h-full">
            <AvatarImage src={restaurantStories.avatar} />
            <AvatarFallback>BV</AvatarFallback>
          </Avatar>
        </div>
        {restaurantStories.hasUnread && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>
      <span className="font-medium hidden xs:inline">Restaurant Stories</span>
      <span className="font-medium xs:hidden">Stories</span>
      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
    </Button>
  );
};