import { useState } from 'react';
import { Receipt, Clock, CheckCircle, Car, UserCheck, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface PlacedOrder {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  placedAt: Date;
  customerName: string;
  tableNumber: string;
}

// Static data for demonstration
const placedOrders: PlacedOrder[] = [
  {
    id: 'ORD-001',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 28.50 },
      { name: 'Caesar Salad', quantity: 2, price: 12.00 }
    ],
    subtotal: 52.50,
    status: 'preparing',
    placedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    customerName: 'John Doe',
    tableNumber: 'T5'
  },
  {
    id: 'ORD-002',
    items: [
      { name: 'Pasta Carbonara', quantity: 1, price: 18.50 },
      { name: 'Tiramisu', quantity: 1, price: 8.50 }
    ],
    subtotal: 27.00,
    status: 'ready',
    placedAt: new Date(Date.now() - 3600000), // 1 hour ago
    customerName: 'Jane Smith',
    tableNumber: 'T3'
  }
];

const promoCodes = {
  'WELCOME10': { discount: 10, type: 'percentage' as const },
  'SAVE5': { discount: 5, type: 'fixed' as const },
  'STUDENT': { discount: 15, type: 'percentage' as const }
};

export function OrderHistory() {
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'preparing': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotal = (order: PlacedOrder) => {
    const serviceFee = order.subtotal * 0.1; // 10% service fee
    let discount = 0;
    
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discount = order.subtotal * (appliedPromo.discount / 100);
      } else {
        discount = appliedPromo.discount;
      }
    }
    
    return order.subtotal + serviceFee - discount;
  };

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    if (promo) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: promo.discount,
        type: promo.type
      });
      toast({
        title: "Promo Code Applied!",
        description: `${promo.type === 'percentage' ? promo.discount + '%' : '$' + promo.discount} discount applied.`,
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Please check your promo code and try again.",
        variant: "destructive",
      });
    }
    setPromoCode('');
  };

  const getSuggestions = (order: PlacedOrder) => {
    const suggestions = [];
    const total = calculateTotal(order);
    
    // Suggest taxi if order total > $50
    if (total > 50) {
      suggestions.push({
        icon: <Car className="h-4 w-4" />,
        title: "Taxi Service",
        description: "Need a ride home? Book a taxi with 10% discount",
        action: "Book Now"
      });
    }
    
    // Suggest sober driver if order includes alcohol-like items (mock logic)
    if (order.items.some(item => item.name.toLowerCase().includes('wine') || total > 80)) {
      suggestions.push({
        icon: <UserCheck className="h-4 w-4" />,
        title: "Sober Driver",
        description: "Safe ride home with our partner drivers",
        action: "Contact Driver"
      });
    }
    
    return suggestions;
  };

  if (placedOrders.length === 0) {
    return (
      <Card className="mx-4 mb-6">
        <CardContent className="text-center py-8">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
          <p className="text-muted-foreground">Your placed orders will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-4 mb-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Your Orders ({placedOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {placedOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {order.placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Subtotal: ${order.subtotal.toFixed(2)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  {selectedOrder?.id === order.id ? 'Hide Details' : 'View Payment'}
                </Button>
              </div>

              {selectedOrder?.id === order.id && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-4">
                  {/* Promo Code Section */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Promo Code</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={applyPromoCode} variant="outline" size="sm">
                        <Tag className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Try: WELCOME10, SAVE5, STUDENT
                    </p>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Payment Details
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Fee (10%)</span>
                        <span>${(order.subtotal * 0.1).toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({appliedPromo.code})</span>
                          <span>
                            -{appliedPromo.type === 'percentage' 
                              ? `$${(order.subtotal * (appliedPromo.discount / 100)).toFixed(2)}` 
                              : `$${appliedPromo.discount.toFixed(2)}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total to Pay</span>
                      <span className="text-primary">${calculateTotal(order).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Service Suggestions */}
                  {getSuggestions(order).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recommended Services</h4>
                      <div className="grid gap-2">
                        {getSuggestions(order).map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                            <div className="flex items-center gap-3">
                              {suggestion.icon}
                              <div>
                                <p className="font-medium text-sm">{suggestion.title}</p>
                                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              {suggestion.action}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <Button className="w-full" size="lg">
                    Pay ${calculateTotal(order).toFixed(2)}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}