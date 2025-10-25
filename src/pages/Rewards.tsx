import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Gift, Target, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MysteryChoice from '@/components/restaurant/MysteryChoice';
import { SpinRoulette } from '@/components/restaurant/SpinRoulette';
import { MiniGames } from '@/components/restaurant/MiniGames';
import Challenges from '@/components/restaurant/Challenges';
import { menuItems, categories } from '@/data/menuData';
import { OrderItem } from '@/types/menu';

const Rewards = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleAddToOrder = (item: any) => {
    console.log('Adding to order:', item);
  };
  
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
              <span className="font-medium">Back to Menu</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: '#9D080F' }}>Games</h1>
            <p className="text-gray-600 text-base sm:text-lg">Play games and win rewards while you wait</p>
          </div>
          
          {/* Games Grid - All in one section */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            
            {/* Mystery Choice - Hidden Dialog Implementation */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}>
                        <Gift className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl mb-2 font-bold text-gray-900">Mystery Choice</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600">
                          Random dish from your favorite category
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-center">
                    <Gift className="h-5 w-5" style={{ color: '#9D080F' }} />
                    Mystery Choice
                  </DialogTitle>
                </DialogHeader>
                <MysteryChoice />
              </DialogContent>
            </Dialog>

            {/* Spin to Win - Hidden Dialog Implementation */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}>
                        <Target className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl mb-2 font-bold text-gray-900">Spin to Win</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600">
                          Spin for special deals and discounts
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <SpinRoulette items={menuItems} categories={categories} onAddToOrder={handleAddToOrder} />
              </DialogContent>
            </Dialog>

            {/* Mini Games - Hidden Dialog Implementation */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}>
                        <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl mb-2 font-bold text-gray-900">Mini Games</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600">
                          Quick games while waiting for order
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
                <MiniGames />
              </DialogContent>
            </Dialog>

            {/* Daily Challenges - Hidden Dialog Implementation */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}>
                        <Award className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl mb-2 font-bold text-gray-900">Daily Challenges</CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600">
                          Complete challenges for rewards
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <Challenges />
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
