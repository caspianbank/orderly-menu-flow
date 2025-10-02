import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trophy, Gift, Calendar, Target, Star } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  rules: string;
  startDate: string;
  endDate: string;
  progress: number;
  target: number;
  reward: string;
  isCompleted: boolean;
  isActive: boolean;
}

const Challenges = () => {
  const [challenges] = useState<Challenge[]>([
    {
      id: 'challenge-1',
      title: 'Dessert Lover',
      description: 'Order 3 desserts this week',
      rules: 'Order any 3 desserts within 7 days to get 1 free dessert',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      progress: 2,
      target: 3,
      reward: '1 Free Dessert',
      isCompleted: false,
      isActive: true,
    },
    {
      id: 'challenge-2',
      title: 'Weekend Warrior',
      description: 'Dine with us 2 weekends in a row',
      rules: 'Visit on Saturday or Sunday for 2 consecutive weekends',
      startDate: '2024-01-13',
      endDate: '2024-01-28',
      progress: 1,
      target: 2,
      reward: '20% Off Next Order',
      isCompleted: false,
      isActive: true,
    },
    {
      id: 'challenge-3',
      title: 'Seafood Explorer',
      description: 'Try all seafood dishes',
      rules: 'Order each item from our seafood menu',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 2,
      target: 2,
      reward: 'VIP Table Reservation',
      isCompleted: true,
      isActive: false,
    },
    {
      id: 'challenge-4',
      title: 'Social Butterfly',
      description: 'Bring 5 friends this month',
      rules: 'Each friend must order a main course',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 3,
      target: 5,
      reward: 'Group Dinner for 6 (50% Off)',
      isCompleted: false,
      isActive: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const activeChallenge = challenges.filter(c => c.isActive);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
    <Card className={`${challenge.isCompleted ? 'border-green-200 bg-green-50' : 'border-purple-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {challenge.isCompleted ? (
              <Trophy className="h-5 w-5 text-green-600" />
            ) : (
              <Target className="h-5 w-5 text-purple-600" />
            )}
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
          </div>
          {challenge.isCompleted && (
            <Badge className="bg-green-100 text-green-800">
              <Star className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{challenge.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              {challenge.progress}/{challenge.target}
            </span>
          </div>
          <Progress 
            value={(challenge.progress / challenge.target) * 100} 
            className="h-2"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Gift className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-purple-700">Reward: {challenge.reward}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Until {new Date(challenge.endDate).toLocaleDateString()}</span>
        </div>

        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
          <strong>Rules:</strong> {challenge.rules}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 font-semibold">
          <Trophy className="mr-2 h-4 w-4" />
          Challenges
          {activeChallenge.length > 0 && (
            <Badge className="ml-2 bg-white text-orange-600">
              {activeChallenge.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            Challenges & Rewards
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Active Challenges */}
          {activeChallenge.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Active Challenges
              </h3>
              <div className="space-y-4">
                {activeChallenge.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-green-600" />
                Completed Challenges
              </h3>
              <div className="space-y-4">
                {completedChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{activeChallenge.length}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{completedChallenges.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {challenges.reduce((acc, c) => acc + (c.isCompleted ? 1 : 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Rewards Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Challenges;