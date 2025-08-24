import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type RatingAspect = 'service' | 'meal' | 'atmosphere';

export function RateRestaurant() {
  const [ratings, setRatings] = useState<{ [key in RatingAspect]?: number }>({});
  const [hoveredRatings, setHoveredRatings] = useState<{ [key in RatingAspect]?: number }>({});
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const aspects: { key: RatingAspect; label: string }[] = [
    { key: 'service', label: 'Service Quality' },
    { key: 'meal', label: 'Meal Quality' },
    { key: 'atmosphere', label: 'Atmosphere' },
  ];

  const handleSetRating = (aspect: RatingAspect, value: number) => {
    setRatings((prev) => ({ ...prev, [aspect]: value }));
  };

  const handleRatingSubmit = () => {
    // At least one required aspect must be rated (service + meal)
    if (!ratings.service || !ratings.meal) {
      toast({
        title: "Incomplete Rating",
        description: "Please rate both Service Quality and Meal Quality.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for your feedback!",
      description: `Service: ${ratings.service} ★, Meal: ${ratings.meal} ★${ratings.atmosphere ? `, Atmosphere: ${ratings.atmosphere} ★` : ''
        }`,
    });

    // Reset after submission
    setIsOpen(false);
    setRatings({});
    setHoveredRatings({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full bg-primary hover:bg-primary/90">
          <Star className="h-4 w-4" />
          Rate Restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Our Restaurant</DialogTitle>
          <DialogDescription>
            Please rate your experience in different aspects.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 py-4">
          {aspects.map((aspect) => (
            <div key={aspect.key} className="flex flex-col items-center space-y-2">
              <p className="font-medium">{aspect.label}</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleSetRating(aspect.key, star)}
                    onMouseEnter={() =>
                      setHoveredRatings((prev) => ({ ...prev, [aspect.key]: star }))
                    }
                    onMouseLeave={() =>
                      setHoveredRatings((prev) => ({ ...prev, [aspect.key]: 0 }))
                    }
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${star <= (hoveredRatings[aspect.key] || ratings[aspect.key] || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 gap-1 border border-gray-200">
              Cancel
            </Button>
            <Button onClick={handleRatingSubmit} className='flex-1'>
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
