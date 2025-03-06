
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Train, LogOut, User, Menu } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { user, clearUserData, isAuthenticated } = useUser();
  const location = useLocation();
  
  const isLandingPage = location.pathname === '/';
  
  const navLinks = [
    { to: '/', label: 'ראשי' },
    { to: '/topics', label: 'תחומי לימוד' },
    { to: '/stations', label: 'תחנות רכבת' },
    { to: '/matches', label: 'התאמות' },
  ];
  
  const filteredLinks = isAuthenticated ? navLinks : navLinks.slice(0, 1);

  return (
    <header className="py-4 px-6 flex items-center justify-between glass fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center space-x-2 space-x-reverse">
          <Train className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">חברותא ברכבת</span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
        {filteredLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === link.to ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="focus-ring">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearUserData}
              className="focus-ring"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          !isLandingPage && (
            <Link to="/register">
              <Button variant="default" className="animate-scale-in focus-ring">
                התחברות / הרשמה
              </Button>
            </Link>
          )
        )}
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden focus-ring">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[80vw] sm:w-[385px]">
            <SheetHeader>
              <SheetTitle>חברותא ברכבת</SheetTitle>
              <SheetDescription>מציאת חברותא ללימוד תורה ברכבת ישראל</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {filteredLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.to ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link to="/profile" className="text-sm font-medium">פרופיל</Link>
              )}
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  onClick={clearUserData}
                  className="mt-4 focus-ring"
                >
                  התנתק
                </Button>
              ) : (
                <Link to="/register" className="mt-4">
                  <Button className="w-full focus-ring">
                    התחברות / הרשמה
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
