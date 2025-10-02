import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trophy, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Rewards & Games</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enjoy exclusive rewards, surprise deals, and fun games while you wait for your order!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Mystery Choice */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-xl">Mystery Choice</CardTitle>
                <CardDescription>
                  Let us surprise you with a random dish from your favorite category
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <MysteryChoice />
              </CardContent>
            </Card>

            {/* Spin Roulette */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-xl">Spin to Order</CardTitle>
                <CardDescription>
                  Spin the wheel and discover exciting menu items with special deals
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <SpinRoulette items={menuItems} categories={categories} onAddToOrder={handleAddToOrder} />
              </CardContent>
            </Card>

            {/* Mini Games */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Mini Games</CardTitle>
                <CardDescription>
                  Play fun games while waiting for your order to arrive
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <MiniGames />
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Challenges</CardTitle>
                <CardDescription>
                  Complete fun challenges to unlock exclusive rewards and badges
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <Challenges />
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                More Rewards Coming Soon!
              </CardTitle>
              <CardDescription>
                We're constantly adding new ways for you to earn points, unlock deals, and have fun while dining with us.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
