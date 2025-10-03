import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Users, 
  RotateCcw, 
  UserCheck, 
  AppleIcon, 
  Smartphone, 
  Receipt,
  Share2,
  ArrowRight,
  Banknote,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedBy?: string[];
}

interface PaymentPageProps {
  orderItems: OrderItem[];
  onPaymentComplete: () => void;
  onBack: () => void;
}

// Mock order data for demonstration
const mockOrderItems: OrderItem[] = [
  { id: '1', name: 'Margherita Pizza', price: 18.99, quantity: 2 },
  { id: '2', name: 'Caesar Salad', price: 12.50, quantity: 1 },
  { id: '3', name: 'Grilled Salmon', price: 24.99, quantity: 1 },
  { id: '4', name: 'Chocolate Brownie', price: 8.99, quantity: 3 },
  { id: '5', name: 'House Wine', price: 15.00, quantity: 2 },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'apple', name: 'Apple Pay', icon: AppleIcon },
  { id: 'google', name: 'Google Pay', icon: Smartphone },
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'loyalty', name: 'Loyalty Points', icon: Award },
];

export function PaymentPage({ 
  orderItems = mockOrderItems, 
  onPaymentComplete,
  onBack 
}: PaymentPageProps) {
  const [activeTab, setActiveTab] = useState('individual');
  const [numberOfDiners, setNumberOfDiners] = useState(4);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<number | null>(null);
  const [spinRotation, setSpinRotation] = useState(0);
  const { toast } = useToast();

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const serviceCharge = subtotal * 0.1; // 10% service charge
  const total = subtotal + tax + serviceCharge;

  const handleSpinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const winner = Math.floor(Math.random() * numberOfDiners) + 1;
    const rotations = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = (360 / numberOfDiners) * (winner - 1);
    const totalRotation = rotations * 360 + finalAngle;
    
    setSpinRotation(prev => prev + totalRotation);
    
    setTimeout(() => {
      setWheelResult(winner);
      setIsSpinning(false);
      toast({
        title: `🎉 Diner ${winner} pays the bill!`,
        description: "Better luck next time for the others!",
      });
    }, 3000);
  };

  const handlePayment = () => {
    toast({
      title: "Payment Processed Successfully!",
      description: "Thank you for dining with us. Enjoy your meal!",
    });
    onPaymentComplete();
  };

  const renderSpinWheel = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const segmentAngle = 360 / numberOfDiners;
    
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-64 h-64">
          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-4 border-white shadow-2xl transition-transform duration-3000 ease-out"
            style={{ 
              transform: `rotate(${spinRotation}deg)`,
              background: `conic-gradient(${Array.from({ length: numberOfDiners }, (_, i) => 
                `${colors[i % colors.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
              ).join(', ')})`
            }}
          >
            {/* Segments with numbers */}
            {Array.from({ length: numberOfDiners }, (_, i) => {
              const angle = (i + 0.5) * segmentAngle;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * 80 + 128;
              const y = Math.sin(radian) * 80 + 128;
              
              return (
                <div
                  key={i}
                  className="absolute w-8 h-8 flex items-center justify-center text-white font-bold text-lg bg-black/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="diners">Number of Diners:</Label>
            <Input
              id="diners"
              type="number"
              min="2"
              max="8"
              value={numberOfDiners}
              onChange={(e) => setNumberOfDiners(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
              className="w-20 text-center"
            />
          </div>
          
          <Button 
            onClick={handleSpinWheel}
            disabled={isSpinning}
            size="lg"
            className="gap-2 animate-pulse"
          >
            <RotateCcw className={`h-5 w-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </Button>
          
          {wheelResult && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                🎯 Diner {wheelResult} pays the full bill of ${total.toFixed(2)}!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Payment & Bill Splitting
              </h1>
              <p className="text-muted-foreground">Choose how to split the bill and complete your payment</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>Review your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge (10%)</span>
                      <span>${serviceCharge.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bill Splitting Options</CardTitle>
                <CardDescription>Choose how you'd like to handle the payment</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="equal-split" className="gap-2">
                      <Users className="h-4 w-4" />
                      Equal Split
                    </TabsTrigger>
                    <TabsTrigger value="wheel-spin" className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Spin Wheel
                    </TabsTrigger>
                    <TabsTrigger value="individual" className="gap-2">
                      <UserCheck className="h-4 w-4" />
                      Pay Own
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="equal-split" className="space-y-6">
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="text-xl font-semibold mb-2">Split Equally</h3>
                      <p className="text-muted-foreground mb-4">
                        Divide the total bill equally among all diners
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Label htmlFor="equal-diners">Number of Diners:</Label>
                        <Input
                          id="equal-diners"
                          type="number"
                          min="2"
                          max="8"
                          value={numberOfDiners}
                          onChange={(e) => setNumberOfDiners(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
                          className="w-20 text-center"
                        />
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <p className="text-lg">
                          Each person pays: <span className="font-bold text-primary">${(total / numberOfDiners).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wheel-spin" className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Spin the Wheel!</h3>
                      <p className="text-muted-foreground mb-6">
                        Let fate decide who pays the entire bill - may the odds be ever in your favor!
                      </p>
                      {renderSpinWheel()}
                    </div>
                  </TabsContent>

                  <TabsContent value="individual" className="space-y-6">
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <UserCheck className="h-12 w-12 mx-auto mb-4 text-green-600" />
                      <h3 className="text-xl font-semibold mb-2">Pay for Your Own Items</h3>
                      <p className="text-muted-foreground mb-4">
                        Each person scans the QR code and pays only for their selected items
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" className="gap-2">
                          <Share2 className="h-4 w-4" />
                          Share QR Code
                        </Button>
                        <Button variant="outline" className="gap-2">
                          Generate Individual Links
                        </Button>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          💡 Each diner will need to select their items individually through their own device
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Payment Methods */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">Choose Payment Method</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Button
                          key={method.id}
                          variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                          className="h-16 flex-col gap-2"
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <Icon className="h-6 w-6" />
                          <span className="text-sm">{method.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Pay Now Button */}
                <div className="mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    onClick={handlePayment}
                  >
                    Complete Payment ${
                      activeTab === 'equal-split' 
                        ? (total / numberOfDiners).toFixed(2)
                        : activeTab === 'wheel-spin' && wheelResult
                        ? total.toFixed(2)
                        : total.toFixed(2)
                    }
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}