import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import restaurantHero from '@/assets/restaurant-hero.jpg';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Marco Rossi",
      title: "Executive Chef",
      photo: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop",
      quote: "Cooking is love made visible. Every dish tells our story."
    },
    {
      name: "Sofia Martinez",
      title: "Founder & Owner",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      quote: "We create experiences, not just meals. Welcome to our family."
    },
    {
      name: "Giovanni Bianchi",
      title: "Head Sommelier",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote: "The perfect wine transforms a meal into a memory."
    }
  ];

  const timeline = [
    { year: "1985", event: "First oven installed, family recipes begin" },
    { year: "1998", event: "Expanded to waterfront location" },
    { year: "2010", event: "Won 'Best Mediterranean Restaurant' award" },
    { year: "2018", event: "Featured in Culinary Excellence Magazine" },
    { year: "2024", event: "Launched our innovative digital QR menu" }
  ];

  const gallery = [
    { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop", alt: "Restaurant interior ambiance" },
    { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop", alt: "Beautifully plated signature dish" },
    { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop", alt: "Happy customers dining" },
    { url: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop", alt: "Cozy dining atmosphere" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={restaurantHero}
          alt="Bella Vista Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
          <div className="text-center text-white animate-fade-in px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              A legacy of flavor, tradition, and passion since 1985
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Our Story Section */}
        <section className="mb-16 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">The Bella Vista Journey</CardTitle>
              <CardDescription className="text-base">Where passion meets tradition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Founded in 1985</strong>, Bella Vista began as a small family kitchen with a big dream: 
                to share the authentic flavors of the Mediterranean with our community. What started with our grandmother's 
                secret recipes and a single wood-fired oven has blossomed into the beloved dining destination you see today.
              </p>
              <p>
                Our name, <em className="text-foreground">"Bella Vista"</em> (Beautiful View), reflects not just our stunning waterfront location, 
                but our philosophy: that every meal should be a feast for all the senses. We believe in using only the 
                <strong className="text-foreground"> freshest local ingredients</strong>, prepared with time-honored techniques passed down 
                through generations.
              </p>
              <p>
                Today, we blend tradition with innovation—from our artisanal pasta made fresh daily to our cutting-edge 
                digital menu experience. But our heart remains the same: creating memorable moments around the table, 
                one exceptional dish at a time.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Timeline Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Milestones</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-20 text-right">
                  <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                    {item.year}
                  </Badge>
                </div>
                <div className="relative flex-1">
                  <div className="absolute -left-3 top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                  <Card className="group-hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <p className="text-foreground font-medium">{item.event}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Vision & Philosophy Section */}
        <section className="mb-16 animate-fade-in">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl mb-2">🌱</div>
                  <h3 className="font-semibold text-lg">Local & Fresh</h3>
                  <p className="text-sm text-muted-foreground">
                    We partner with local farmers and fishermen to bring you the freshest seasonal ingredients
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl mb-2">👨‍🍳</div>
                  <h3 className="font-semibold text-lg">Authentic Recipes</h3>
                  <p className="text-sm text-muted-foreground">
                    Traditional family recipes perfected over four generations of culinary excellence
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-4xl mb-2">❤️</div>
                  <h3 className="font-semibold text-lg">Made with Love</h3>
                  <p className="text-sm text-muted-foreground">
                    Every dish is crafted with passion, care, and attention to detail
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Meet the Team Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">"{member.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Location & Contact Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">Visit Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Bella Vista Restaurant</p>
                  <p className="text-muted-foreground">123 Waterfront Boulevard</p>
                  <p className="text-muted-foreground">Seaside District, City 12345</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Opening Hours:</p>
                  <p className="text-sm text-muted-foreground">Monday - Thursday: 11:00 AM - 10:00 PM</p>
                  <p className="text-sm text-muted-foreground">Friday - Saturday: 11:00 AM - 11:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sunday: 12:00 PM - 9:00 PM</p>
                </div>
                <Button className="w-full gap-2" asChild>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href="mailto:info@bellavista.com" className="hover:text-primary transition-colors">
                      info@bellavista.com
                    </a>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-3">Follow Us:</p>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <Button variant="secondary" className="w-full gap-2" asChild>
                    <a href="https://www.google.com/search?q=bella+vista+restaurant+reviews" target="_blank" rel="noopener noreferrer">
                      <Star className="h-4 w-4" />
                      Read Our Reviews
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Atmosphere</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center animate-fade-in">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-8 pb-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Experience Bella Vista?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join us for an unforgettable dining experience. View our menu and start your culinary journey today.
              </p>
              <Link to="/">
                <Button size="lg" className="gap-2">
                  Explore Our Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
