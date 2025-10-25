import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
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
    <footer className="mt-12 sm:mt-16 bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* Restaurant Info */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-primary">{restaurantInfo.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {restaurantInfo.description}
                </p>

                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLocationClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground w-full"
                  >
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 self-start mt-0.5" />
                    <span className="text-xs sm:text-sm text-left break-words whitespace-normal">
                      {restaurantInfo.address}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCallClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground w-full"
                  >
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm hover:text-foreground truncate">{restaurantInfo.phone}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEmailClick}
                    className="justify-start gap-2 h-auto p-2 hover:bg-muted/50 hover:text-foreground w-full"
                  >
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm hover:text-foreground truncate">{restaurantInfo.email}</span>
                  </Button>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  Opening Hours
                </h3>
                <div className="space-y-1">
                  {Object.entries(restaurantInfo.hours).map(([day, hours]) => {
                    return (
                      <div key={day} className="flex justify-between text-xs sm:text-sm gap-2">
                        <span className="font-medium capitalize">{day}:</span>
                        <span className={`${hours === 'Closed' ? 'text-muted-foreground' : 'text-foreground'} text-right`}>
                          {hours}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media & Actions */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">Connect With Us</h3>

                <div className="flex flex-wrap gap-2">
                  {restaurantInfo.socialMedia.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.facebook!)}
                      className="gap-2 h-9"
                    >
                      <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  )}

                  {restaurantInfo.socialMedia.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.instagram!)}
                      className="gap-2 h-9"
                    >
                      <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  )}

                  {restaurantInfo.socialMedia.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.twitter!)}
                      className="gap-2 h-9"
                    >
                      <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  )}

                  {restaurantInfo.socialMedia.youtube && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSocialClick(restaurantInfo.socialMedia.youtube!)}
                      className="gap-2 h-9"
                    >
                      <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">YouTube</span>
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
                    className="w-full gap-2 text-xs sm:text-sm h-9 sm:h-auto"
                  >
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Make a Reservation
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-5 sm:my-6" />

            <div className="text-center text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>&copy; {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.</p>
              <p>Crafted with care for an exceptional dining experience.</p>
              <p>Powered by <span className="font-medium">CassaPoint</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
