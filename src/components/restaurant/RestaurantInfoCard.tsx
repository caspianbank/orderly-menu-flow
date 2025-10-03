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
    <section className="container mx-auto px-4 py-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wifi className="h-5 w-5 text-primary" />
            Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wi-Fi Section */}
          {restaurantInfo.wifi && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Free Wi-Fi</h4>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="secondary" className="font-mono">
                    {restaurantInfo.wifi.ssid}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Password:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {restaurantInfo.wifi.password}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPassword}
                      className="h-6 w-6 p-0"
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
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhoneClick}
              className="gap-2 flex-1 min-w-[140px]"
            >
              <Phone className="h-4 w-4" />
              <span className="text-xs">{restaurantInfo.phone}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationClick}
              className="gap-2 flex-1 min-w-[140px]"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Get Directions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
