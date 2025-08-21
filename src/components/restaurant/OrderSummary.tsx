import { useState } from 'react';
import { ShoppingCart, Minus, Plus, X, Send } from 'lucide-react';
import { OrderItem } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: (customerInfo: { name: string; tableNumber: string; notes?: string }) => void;
}

export function OrderSummary({ 
  orderItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onPlaceOrder 
}: OrderSummaryProps) {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const { toast } = useToast();

  const totalAmount = orderItems.reduce((sum, item) => 
    sum + (item.menuItem.price * item.quantity), 0
  );

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !tableNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and table number.",
        variant: "destructive",
      });
      return;
    }

    onPlaceOrder({
      name: customerName.trim(),
      tableNumber: tableNumber.trim(),
      notes: orderNotes.trim() || undefined,
    });

    setShowOrderDialog(false);
    setCustomerName('');
    setTableNumber('');
    setOrderNotes('');

    toast({
      title: "Order Placed!",
      description: "Your order has been sent to the kitchen. A waiter will confirm shortly.",
    });
  };

  if (orderItems.length === 0) {
    return (
      <div className="floating-action">
        <Card className="w-64 shadow-hover">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Your order is empty</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="floating-action">
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogTrigger asChild>
          <Card className="w-80 shadow-hover cursor-pointer hover:shadow-dish transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order
                </span>
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {orderItems.map((orderItem) => (
                  <div key={orderItem.menuItem.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{orderItem.menuItem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${orderItem.menuItem.price.toFixed(2)} each
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(orderItem.menuItem.id, orderItem.quantity - 1);
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {orderItem.quantity}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(orderItem.menuItem.id, orderItem.quantity + 1);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(orderItem.menuItem.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-lg text-primary">${totalAmount.toFixed(2)}</span>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Click to place your order
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number *</Label>
              <Input
                id="tableNumber"
                placeholder="e.g., T5, Table 12"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNotes">Special Instructions (Optional)</Label>
              <Textarea
                id="orderNotes"
                placeholder="Any special requests or dietary notes..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Order Summary</h4>
              {orderItems.map((orderItem) => (
                <div key={orderItem.menuItem.id} className="flex justify-between text-sm">
                  <span>{orderItem.quantity}x {orderItem.menuItem.name}</span>
                  <span>${(orderItem.menuItem.price * orderItem.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handlePlaceOrder} 
              className="w-full gap-2 bg-primary hover:bg-primary-hover"
              size="lg"
            >
              <Send className="h-4 w-4" />
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}