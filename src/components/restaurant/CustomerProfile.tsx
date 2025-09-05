import { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrderHistory } from './OrderHistory';

interface CustomerProfileProps {
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
  onLogout: () => void;
  onBack?: () => void;
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
              <h1 className="text-2xl font-bold">{customer.fullName}</h1>
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.fullName}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.phoneNumber}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customerDetails.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Member Since</label>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerDetails.addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg ${
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
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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