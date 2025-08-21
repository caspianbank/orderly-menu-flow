import { useState } from 'react';
import { Search, Menu as MenuIcon, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Language } from '@/types/menu';
import { restaurantInfo } from '@/data/menuData';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onCategorySelect: (categoryId: string) => void;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function Header({ 
  onSearchChange, 
  onCategorySelect, 
  currentLanguage, 
  onLanguageChange 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleCallWaiter = () => {
    window.open(`tel:${restaurantInfo.phone}`, '_self');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">
              {restaurantInfo.name}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-muted/50 border-border focus:bg-card"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />

            {/* Call Waiter Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCallWaiter}
              className="gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Waiter</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        )}

        {/* Restaurant Hours Info */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Today: {restaurantInfo.hours[new Date().toLocaleDateString('en-US', { weekday: 'long' })]}</span>
        </div>
      </div>
    </header>
  );
}