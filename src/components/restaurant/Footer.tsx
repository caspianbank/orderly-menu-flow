import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RateRestaurant } from '@/components/restaurant/RateRestaurant';
import { restaurantInfo } from '@/data/menuData';

export function Footer() {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${restaurantInfo.phone}`, '_self');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${restaurantInfo.email}`, '_self');
  };

  const handleLocationClick = () => {
    const encodedAddress = encodeURIComponent(restaurantInfo.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <footer className="mt-16 bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Restaurant Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-primary">{restaurantInfo.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {restaurantInfo.description}
                </p>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLocationClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground"
                  >
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-left break-words whitespace-normal">
                      {restaurantInfo.address}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCallClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm hover:text-foreground">{restaurantInfo.phone}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEmailClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm hover:text-foreground">{restaurantInfo.email}</span>
                  </Button>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Opening Hours
                </h3>
                <div className="space-y-1">
                  {Object.entries(restaurantInfo.hours).map(([day, hours]) => {
                    return (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium">{day}:</span>
                        <span className={`${hours === 'Closed' ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media & Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Connect With Us</h3>

                <div className="flex gap-2">
                  {restaurantInfo.socialMedia.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.facebook!)}
                      className="gap-2"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  )}

                  {restaurantInfo.socialMedia.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.instagram!)}
                      className="gap-2"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  )}

                  {restaurantInfo.socialMedia.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.twitter!)}
                      className="gap-2"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="w-full">
                    <RateRestaurant />
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleCallClick}
                    className="w-full gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Make a Reservation
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2024 {restaurantInfo.name}. All rights reserved.</p>
              <p className="mt-1">Crafted with care for an exceptional dining experience.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}