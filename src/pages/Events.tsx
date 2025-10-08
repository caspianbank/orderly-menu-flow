import { useState } from 'react';
import { Calendar, Clock, DollarSign, ArrowLeft, Music, Mic2, Wine, ChefHat } from 'lucide-react';
import { Event, TicketPurchase } from '@/types/events';
import { eventsData } from '@/data/eventsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const categoryIcons = {
  'live-music': Music,
  'karaoke': Mic2,
  'tasting': Wine,
  'special': ChefHat,
  'other': Calendar,
};

export default function Events() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const upcomingEvents = eventsData.filter(e => e.status === 'upcoming');
  const pastEvents = eventsData.filter(e => e.status === 'past');

  const handleBuyTicket = () => {
    if (!selectedEvent) return;

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const confirmationCode = `TKT-${Date.now().toString(36).toUpperCase()}`;
    
    toast({
      title: 'Tickets Reserved!',
      description: `Confirmation code: ${confirmationCode}. Check your email for details.`,
    });

    setSelectedEvent(null);
    setTicketQuantity(1);
    setCustomerInfo({ name: '', email: '', phone: '' });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const Icon = categoryIcons[event.category];
    const isUpcoming = event.status === 'upcoming';

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-muted relative">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 right-3" variant={isUpcoming ? 'default' : 'secondary'}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
          </Badge>
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-xs">
              {event.category.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-xl">{event.name}</CardTitle>
          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          {isUpcoming && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>${event.ticketPrice} per ticket</span>
            </div>
          )}
          {isUpcoming && (
            <p className="text-sm text-muted-foreground">
              {event.availableTickets} tickets available
            </p>
          )}
        </CardContent>
        {isUpcoming && (
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => setSelectedEvent(event)}
              disabled={event.availableTickets === 0}
            >
              {event.availableTickets === 0 ? 'Sold Out' : 'Buy Tickets'}
            </Button>
          </CardFooter>
        )}
        {!isUpcoming && event.images && event.images.length > 0 && (
          <CardFooter>
            <div className="grid grid-cols-3 gap-2 w-full">
              {event.images.slice(0, 3).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Event photo ${idx + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Events & Shows</h1>
              <p className="text-sm text-muted-foreground">Discover and book amazing experiences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">
              Upcoming Events ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No upcoming events scheduled</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastEvents.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">No past events to display</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Ticket Purchase Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Tickets</DialogTitle>
            <DialogDescription>
              {selectedEvent?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Event Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent && formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent?.time}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Tickets</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedEvent?.availableTickets || 1}
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-center w-20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTicketQuantity(Math.min(selectedEvent?.availableTickets || 1, ticketQuantity + 1))}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-auto">
                  ${((selectedEvent?.ticketPrice || 0) * ticketQuantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${((selectedEvent?.ticketPrice || 0) * ticketQuantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBuyTicket}
                className="flex-1"
              >
                Confirm Purchase
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Note: This is a demo. In production, you would integrate with a payment processor like Stripe.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
