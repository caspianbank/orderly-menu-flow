import { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, LogOut, ArrowLeft, Save, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrderHistory } from './OrderHistory';
import { useToast } from '@/hooks/use-toast';

interface CustomerProfileProps {
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
  onLogout: () => void;
  onBack?: () => void;
}

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// Static customer data
const customerDetails = {
  profileImage: '',
  email: 'john.doe@example.com',
  joinDate: '2023-06-15',
  loyaltyPoints: 1250,
  totalOrders: 47,
  favoriteCategory: 'Italian',
  addresses: [
    {
      id: '1',
      type: 'Home',
      address: '123 Ocean View Street, Apt 4B',
      city: 'Baku',
      country: 'Azerbaijan',
      postalCode: 'AZ1000',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Business District, Floor 12',
      city: 'Baku',
      country: 'Azerbaijan',
      postalCode: 'AZ1001',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: '1',
      type: 'Credit Card',
      last4: '4567',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Credit Card',
      last4: '8901',
      brand: 'Mastercard',
      isDefault: false,
    },
  ],
};

export function CustomerProfile({ customer, onLogout, onBack }: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    email: customer.email || customerDetails.email,
  });
  const [addresses, setAddresses] = useState<Address[]>(customerDetails.addresses);
  const [newAddress, setNewAddress] = useState({
    type: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileSave = () => {
    // Here you would typically save to backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditingProfile(false);
  };

  const handleAddressAdd = () => {
    if (!newAddress.type || !newAddress.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setNewAddress({ type: '', address: '', city: '', country: '', postalCode: '' });
    setIsAddingAddress(false);
    toast({
      title: "Address Added",
      description: "New address has been successfully added.",
    });
  };

  const handleAddressEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleAddressUpdate = () => {
    if (!editingAddress) return;

    setAddresses(addresses.map(addr => 
      addr.id === editingAddress.id ? editingAddress : addr
    ));
    setEditingAddress(null);
    toast({
      title: "Address Updated",
      description: "Address has been successfully updated.",
    });
  };

  const selectAddressFromMap = async () => {
    if (!googleMapsApiKey) {
      toast({
        title: "Google Maps API Key Required",
        description: "Please enter your Google Maps API key to use map functionality.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { Loader } = await import('@googlemaps/js-api-loader');
      const loader = new Loader({
        apiKey: googleMapsApiKey,
        version: 'weekly',
        libraries: ['places'],
      });

      const google = await loader.load();
      
      // Simple geocoding example - in a real app, you'd show a map modal
      const geocoder = new google.maps.Geocoder();
      const address = prompt('Enter an address to geocode:');
      
      if (address) {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const components = result.address_components;
            
            setNewAddress({
              ...newAddress,
              address: result.formatted_address || '',
              city: components.find(c => c.types.includes('locality'))?.long_name || '',
              country: components.find(c => c.types.includes('country'))?.long_name || '',
              postalCode: components.find(c => c.types.includes('postal_code'))?.long_name || '',
            });
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Google Maps. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-6 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
        )}
        
        {/* Header with gradient card */}
        <Card className="mb-6 overflow-hidden border-2 shadow-lg">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                  <AvatarImage src={customerDetails.profileImage} />
                  <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                    {getInitials(customer.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{profileData.fullName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 justify-center sm:justify-start mt-1">
                    <span>Member since {new Date(customerDetails.joinDate).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={onLogout} className="gap-2 bg-background/80 backdrop-blur hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards with enhanced design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md">
                  <User className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{customerDetails.loyaltyPoints}</p>
                  <p className="text-sm text-muted-foreground font-medium">Loyalty Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="h-7 w-7 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">{customerDetails.totalOrders}</p>
                  <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="h-7 w-7 text-secondary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">{customerDetails.favoriteCategory}</p>
                  <p className="text-sm text-muted-foreground font-medium">Favorite Cuisine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs with enhanced styling */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
              Profile Details
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
              Order History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card className="border-2 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription className="text-base">Manage your account details</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-primary-foreground" onClick={() => setIsEditingProfile(true)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-destructive hover:text-destructive-foreground" onClick={() => setIsEditingProfile(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={handleProfileSave}>
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditingProfile ? (
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border-2 border-border rounded-lg bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.fullName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    {isEditingProfile ? (
                      <Input
                        id="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border-2 border-border rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditingProfile ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 border-2 border-border rounded-lg bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 p-3 border-2 border-border rounded-lg bg-muted/50 opacity-50">
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(customerDetails.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addresses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Delivery Addresses</CardTitle>
                    <CardDescription>Manage your saved addresses</CardDescription>
                  </div>
                  <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                          Add a new delivery address to your profile
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="google-maps-key">Google Maps API Key</Label>
                          <Input
                            id="google-maps-key"
                            type="password"
                            placeholder="Enter your Google Maps API key"
                            value={googleMapsApiKey}
                            onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Get your API key from <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address-type">Address Name</Label>
                          <Input
                            id="address-type"
                            placeholder="e.g., Home, Office, etc."
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address-line">Address</Label>
                          <div className="flex gap-2">
                            <Input
                              id="address-line"
                              placeholder="Street address"
                              value={newAddress.address}
                              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            />
                            <Button variant="outline" onClick={selectAddressFromMap} disabled={!googleMapsApiKey}>
                              <MapPin className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postal-code">Postal Code</Label>
                            <Input
                              id="postal-code"
                              placeholder="Postal code"
                              value={newAddress.postalCode}
                              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="Country"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddressAdd}>Add Address</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg ${
                        address.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{address.type}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {address.address}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.country} {address.postalCode}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleAddressEdit(address)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Edit Address Dialog */}
                <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Address</DialogTitle>
                      <DialogDescription>
                        Update your address information
                      </DialogDescription>
                    </DialogHeader>
                    {editingAddress && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-address-type">Address Name</Label>
                          <Input
                            id="edit-address-type"
                            value={editingAddress.type}
                            onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-address-line">Address</Label>
                          <Input
                            id="edit-address-line"
                            value={editingAddress.address}
                            onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-city">City</Label>
                            <Input
                              id="edit-city"
                              value={editingAddress.city}
                              onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-postal-code">Postal Code</Label>
                            <Input
                              id="edit-postal-code"
                              value={editingAddress.postalCode}
                              onChange={(e) => setEditingAddress({ ...editingAddress, postalCode: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-country">Country</Label>
                          <Input
                            id="edit-country"
                            value={editingAddress.country}
                            onChange={(e) => setEditingAddress({ ...editingAddress, country: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingAddress(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddressUpdate}>Update Address</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}