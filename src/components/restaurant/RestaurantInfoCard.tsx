import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Copy, MapPin, Phone } from 'lucide-react';
import { restaurantInfo } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const RestaurantInfoCard = () => {
  const { toast } = useToast();

  const handleCopyPassword = () => {
    if (restaurantInfo.wifi?.password) {
      navigator.clipboard.writeText(restaurantInfo.wifi.password);
      toast({
        title: "Password Copied",
        description: "Wi-Fi password copied to clipboard",
      });
    }
  };

  const handlePhoneClick = () => {
    window.open(`tel:${restaurantInfo.phone}`, '_self');
  };

  const handleLocationClick = () => {
    const encodedAddress = encodeURIComponent(restaurantInfo.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <section className="container mx-auto px-4 py-4 sm:py-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="truncate">Restaurant Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Wi-Fi Section */}
          {restaurantInfo.wifi && (
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <h4 className="font-semibold text-xs sm:text-sm">Free Wi-Fi</h4>
              </div>
              <div className="grid gap-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground flex-shrink-0">Network:</span>
                  <Badge variant="secondary" className="font-mono text-xs break-all text-right">
                    {restaurantInfo.wifi.ssid}
                  </Badge>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground flex-shrink-0">Password:</span>
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                    <Badge variant="secondary" className="font-mono text-xs truncate max-w-[150px] sm:max-w-none">
                      {restaurantInfo.wifi.password}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPassword}
                      className="h-5 w-5 sm:h-6 sm:w-6 p-0 flex-shrink-0"
                      title="Copy password"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {restaurantInfo.wifi.notes && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    {restaurantInfo.wifi.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhoneClick}
              className="gap-2 flex-1 justify-start sm:justify-center text-xs sm:text-sm"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{restaurantInfo.phone}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationClick}
              className="gap-2 flex-1 text-xs sm:text-sm"
            >
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Get Directions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
