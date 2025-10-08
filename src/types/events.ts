export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  ticketPrice: number;
  status: 'upcoming' | 'past';
  image?: string;
  images?: string[];
  videos?: string[];
  availableTickets: number;
  category: 'live-music' | 'karaoke' | 'tasting' | 'special' | 'other';
}

export interface TicketPurchase {
  eventId: string;
  eventName: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseDate: Date;
  confirmationCode: string;
}
