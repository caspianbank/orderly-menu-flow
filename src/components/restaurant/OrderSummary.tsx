import { useState } from 'react';
import { ShoppingCart, Minus, Plus, X, Send, History } from 'lucide-react';
import { OrderItem } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { OrderHistory } from '@/components/restuarant/OrderHistory';

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

  return (
    <div className="floating-basket">
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-hover bg-primary hover:bg-primary-hover relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-secondary text-secondary-foreground font-bold text-xs min-w-[24px]"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto bg-card px-4 sm:px-6 mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Basket
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="current" className="mt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="current">
                <ShoppingCart className="h-4 w-4 mr-1" /> Current Order
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-1" /> Order History
              </TabsTrigger>
            </TabsList>

            {/* Current Order */}
            <TabsContent value="current" className="space-y-4 mt-4">
              {orderItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Your order is empty</p>
                </div>
              ) : (
                <>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/30">
                    {orderItems.map((orderItem) => (
                      <div key={orderItem.menuItem.id} className="flex items-center gap-3 p-2 rounded bg-card shadow-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{orderItem.menuItem.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${orderItem.menuItem.price.toFixed(2)} each
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateQuantity(orderItem.menuItem.id, orderItem.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-medium">
                            {orderItem.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateQuantity(orderItem.menuItem.id, orderItem.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive ml-1"
                            onClick={() => onRemoveItem(orderItem.menuItem.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                    <h4 className="font-semibold text-base">Order Summary</h4>

                    <div className="space-y-2">
                      {orderItems.map((orderItem) => (
                        <div key={orderItem.menuItem.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {orderItem.quantity}x {orderItem.menuItem.name}
                          </span>
                          <span>${(orderItem.menuItem.price * orderItem.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Amount to Pay:</span>
                      <span className="text-xl font-bold text-primary bg-primary/10 px-3 py-1 rounded-md">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Customer Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Special Instructions (Optional)</Label>
                      <Textarea
                        id="orderNotes"
                        placeholder="Any special requests or dietary notes..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full gap-2 bg-primary hover:bg-primary-hover"
                      size="lg"
                    >
                      <Send className="h-4 w-4" />
                      Place Order - ${totalAmount.toFixed(2)}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Order History */}
            <TabsContent value="history" className="mt-4">
              <OrderHistory />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
