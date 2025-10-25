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
      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
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
              
              const wheelSize = typeof window !== 'undefined' && window.innerWidth < 640 ? 48 : window.innerWidth < 768 ? 56 : 64;
              const centerOffset = wheelSize * 4;
              const adjustedX = Math.cos(radian) * (wheelSize * 1.25) + centerOffset;
              const adjustedY = Math.sin(radian) * (wheelSize * 1.25) + centerOffset;
              
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg bg-black/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: adjustedX, top: adjustedY }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>
        
        <div className="text-center space-y-3 sm:space-y-4 w-full max-w-md px-4">
          <div className="flex flex-col xs:flex-row items-center justify-center gap-2">
            <Label htmlFor="diners" className="text-sm">Number of Diners:</Label>
            <Input
              id="diners"
              type="number"
              min="2"
              max="8"
              value={numberOfDiners}
              onChange={(e) => setNumberOfDiners(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
              className="w-20 text-center text-sm"
            />
          </div>
          
          <Button 
            onClick={handleSpinWheel}
            disabled={isSpinning}
            size="lg"
            className="gap-2 animate-pulse w-full sm:w-auto"
          >
            <RotateCcw className={`h-4 w-4 sm:h-5 sm:w-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </Button>
          
          {wheelResult && (
            <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-green-800 dark:text-green-200">
                Diner {wheelResult} pays the full bill of ${total.toFixed(2)}!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onBack} size="sm" className="flex-shrink-0">
              ← Back
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Payment & Bill Splitting
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Choose how to split the bill and complete your payment</p>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Receipt className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Order Summary
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Review your items</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between gap-2">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>Service Charge (10%)</span>
                      <span>${serviceCharge.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between gap-2 font-bold text-base sm:text-lg">
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
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Bill Splitting Options</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Choose how you'd like to handle the payment</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-auto">
                    <TabsTrigger value="equal-split" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Equal Split</span>
                      <span className="xs:hidden">Equal</span>
                    </TabsTrigger>
                    <TabsTrigger value="wheel-spin" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                      <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Spin Wheel</span>
                      <span className="xs:hidden">Spin</span>
                    </TabsTrigger>
                    <TabsTrigger value="individual" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                      <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Pay Own</span>
                      <span className="xs:hidden">Own</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="equal-split" className="space-y-4 sm:space-y-6">
                    <div className="text-center p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-blue-600" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Split Equally</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        Divide the total bill equally among all diners
                      </p>
                      <div className="flex flex-col xs:flex-row items-center justify-center gap-2 mb-3 sm:mb-4">
                        <Label htmlFor="equal-diners" className="text-sm">Number of Diners:</Label>
                        <Input
                          id="equal-diners"
                          type="number"
                          min="2"
                          max="8"
                          value={numberOfDiners}
                          onChange={(e) => setNumberOfDiners(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
                          className="w-20 text-center text-sm"
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border">
                        <p className="text-sm sm:text-base lg:text-lg">
                          Each person pays: <span className="font-bold text-primary">${(total / numberOfDiners).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wheel-spin" className="space-y-4 sm:space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Spin the Wheel!</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                        Let fate decide who pays the entire bill - may the odds be ever in your favor!
                      </p>
                      {renderSpinWheel()}
                    </div>
                  </TabsContent>

                  <TabsContent value="individual" className="space-y-6">
                    <div className="text-center p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <UserCheck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-green-600" />
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Pay for Your Own Items</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        Each person scans the QR code and pays only for their selected items
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto text-sm">
                          <Share2 className="h-4 w-4" />
                          Share QR Code
                        </Button>
                        <Button variant="outline" className="gap-2 w-full sm:w-auto text-sm">
                          Generate Individual Links
                        </Button>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Each diner will need to select their items individually through their own device
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Payment Methods */}
                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Choose Payment Method</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Button
                          key={method.id}
                          variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                          className="h-14 sm:h-16 flex-col gap-1 sm:gap-2 p-2"
                          onClick={() => setSelectedPaymentMethod(method.id)}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                          <span className="text-xs sm:text-sm line-clamp-1">{method.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Pay Now Button */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm sm:text-base px-4 sm:px-6"
                    onClick={handlePayment}
                  >
                    <span className="truncate">Complete Payment ${
                      activeTab === 'equal-split' 
                        ? (total / numberOfDiners).toFixed(2)
                        : activeTab === 'wheel-spin' && wheelResult
                        ? total.toFixed(2)
                        : total.toFixed(2)
                    }</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
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