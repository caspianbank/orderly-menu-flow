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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customerDetails.profileImage} />
              <AvatarFallback className="text-lg">
                {getInitials(customer.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
              <p className="text-muted-foreground">
                Member since {new Date(customerDetails.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{customerDetails.loyaltyPoints}</p>
                  <p className="text-sm text-muted-foreground">Loyalty Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍽️</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{customerDetails.totalOrders}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl">❤️</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{customerDetails.favoriteCategory}</p>
                  <p className="text-sm text-muted-foreground">Favorite Cuisine</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditingProfile(true)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleProfileSave}>
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
                      <span className="text-xl">🎉</span>
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