import { useState } from 'react';
import { Search, Menu as MenuIcon, Phone, Clock, Trophy, Circle, Bell, User, Globe, Moon, Sun, X, Calendar, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { CallWaiterDialog } from '@/components/restaurant/CallWaiterDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoginButton } from '@/components/restaurant/LoginButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Language } from '@/types/menu';
import { restaurantInfo } from '@/data/menuData';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  onCategorySelect: (categoryId: string) => void;
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onLoginSuccess: (customer: { fullName: string; phoneNumber: string }) => void;
  currentCustomer: { fullName: string; phoneNumber: string } | null;
  onShowProfile: () => void;
  onStoriesClick: () => void;
  hasNewStories?: boolean;
}

export function Header({
  onSearchChange,
  onCategorySelect,
  currentLanguage,
  onLanguageChange,
  onLoginSuccess,
  currentCustomer,
  onShowProfile,
  onStoriesClick,
  hasNewStories = true
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWaiterDialogOpen, setIsWaiterDialogOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout - Clean 3-element header */}
          <div className="flex md:hidden items-center justify-between">
            {/* Restaurant Logo/Name */}
            <Link to="/" className="text-2xl font-bold text-primary">
              {restaurantInfo.name}
            </Link>

            {/* Right Actions: Search Icon + Hamburger Menu */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="h-9 w-9"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Hamburger Menu */}
              <Sheet open={isHamburgerOpen} onOpenChange={setIsHamburgerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    {/* Login/Profile - Top Item */}
                    {currentCustomer ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          onShowProfile();
                          setIsHamburgerOpen(false);
                        }}
                        className="justify-start gap-3 h-auto py-3"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {currentCustomer.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium">{currentCustomer.fullName}</div>
                          <div className="text-sm text-muted-foreground">View Profile</div>
                        </div>
                      </Button>
                    ) : (
                      <div onClick={() => setIsHamburgerOpen(false)}>
                        <LoginButton onLoginSuccess={onLoginSuccess} className="w-full justify-start gap-3" />
                      </div>
                    )}

                    <Separator />

                    {/* Rewards */}
                    <Link to="/rewards" onClick={() => setIsHamburgerOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                        <Trophy className="h-5 w-5" />
                        <span>Rewards</span>
                      </Button>
                    </Link>

                    {/* Events & Shows */}
                    <Link to="/events" onClick={() => setIsHamburgerOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                        <Calendar className="h-5 w-5" />
                        <span>Events & Shows</span>
                      </Button>
                    </Link>

                    {/* AI Recommendations */}
                    <Link to="/ai-recommendations" onClick={() => setIsHamburgerOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                        <Sparkles className="h-5 w-5" />
                        <span>AI Food Guide</span>
                      </Button>
                    </Link>

                    {/* About Us */}
                    <Link to="/about" onClick={() => setIsHamburgerOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                        <Info className="h-5 w-5" />
                        <span>Our Story</span>
                      </Button>
                    </Link>

                    {/* Stories */}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onStoriesClick();
                        setIsHamburgerOpen(false);
                      }}
                      className="w-full justify-start gap-3 h-auto py-3 relative"
                    >
                      <div className="relative">
                        <Circle className="h-5 w-5" />
                        {hasNewStories && (
                          <Circle className="absolute -top-1 -right-1 h-2.5 w-2.5 fill-primary text-primary animate-pulse" />
                        )}
                      </div>
                      <span>Stories</span>
                      {hasNewStories && <span className="ml-auto text-xs text-primary">New</span>}
                    </Button>

                    <Separator />

                    {/* Language Selection */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5" />
                        <span>Language</span>
                      </div>
                      <LanguageSelector
                        currentLanguage={currentLanguage}
                        onLanguageChange={onLanguageChange}
                      />
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        <span>Theme</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                      >
                        {theme === 'light' ? 'Dark' : 'Light'}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Expanded Search */}
          {isSearchExpanded && (
            <div className="md:hidden mt-4 animate-slide-up">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-muted/50"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchExpanded(false)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
            <ThemeToggle />
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            {/* Stories Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onStoriesClick}
              className="relative rounded-full"
            >
              {hasNewStories && (
                <Circle className="absolute -top-0.5 -right-0.5 h-3 w-3 fill-primary text-primary animate-pulse" />
              )}
              <div className={`rounded-full p-2 ${hasNewStories ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </Button>

            {/* Rewards Link */}
            <Link to="/rewards">
              <Button variant="ghost" size="sm" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Rewards</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWaiterDialogOpen(true)}
              className="gap-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call Waiter</span>
            </Button>
            
            {/* Login/Profile on the right */}
            {currentCustomer ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowProfile}
                className="p-2 hover:bg-transparent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentCustomer.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <LoginButton onLoginSuccess={onLoginSuccess} />
            )}

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

        {/* Restaurant Hours Info */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {(() => {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const todayHours = restaurantInfo.hours[today as keyof typeof restaurantInfo.hours] || 'Closed';
            return <span>Today: {todayHours}</span>;
          })()}
        </div>
      </header>

      {/* Floating Action Button - Call Waiter (Mobile Only) */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsWaiterDialogOpen(true)}
          className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Bell className="h-6 w-6" />
        </Button>
      </div>

      {/* Call Waiter Dialog */}
      <CallWaiterDialog
        isOpen={isWaiterDialogOpen}
        onClose={() => setIsWaiterDialogOpen(false)}
      />
    </>
  );
}