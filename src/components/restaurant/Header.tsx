import { useState } from 'react';
import { Search, Menu as MenuIcon, Phone, Clock } from 'lucide-react';
import { CallWaiterDialog } from '@/components/restaurant/CallWaiterDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoginButton } from '@/components/restaurant/LoginButton';
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
  const [isWaiterDialogOpen, setIsWaiterDialogOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-soft">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout - Restaurant name full width */}
        <div className="flex md:hidden flex-col space-y-3">
          {/* Restaurant Name - Full Width */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {restaurantInfo.name}
            </div>
          </div>

          {/* Mobile Actions Row */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <LoginButton />
            <ThemeToggle />
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWaiterDialogOpen(true)}
              className="gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop & Tablet Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">
              {restaurantInfo.name}
            </div>
          </div>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
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
            <LoginButton />
            <ThemeToggle />
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWaiterDialogOpen(true)}
              className="gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Waiter</span>
            </Button>

            <CallWaiterDialog
              isOpen={isWaiterDialogOpen}
              onClose={() => setIsWaiterDialogOpen(false)}
            />
          </div>
        </div>

        {/* Tablet Search Bar - Below header */}
        <div className="hidden md:block lg:hidden mt-4">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-muted/50 border-border focus:bg-card"
            />
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 animate-slide-up space-y-3">
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
          {(() => {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const todayHours = restaurantInfo.hours[today as keyof typeof restaurantInfo.hours] || 'Closed';
            return <span>Today: {todayHours}</span>;
          })()}
        </div>
      </div>
    </header>
  );
}