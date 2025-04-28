
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { UserProvider } from '../contexts/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Google OAuth client ID using Vite's import.meta.env instead of process.env
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
          {/* Background decorative elements with Torah-themed patterns */}
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
          
          {/* Light patterns representing the light of Torah */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
            
            {/* Additional decorative elements for Jewish themes */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
            
            {/* Star of David pattern (subtle) */}
            <div className="absolute top-[40%] left-[40%] w-24 h-24 bg-blue-500/3 rounded-full blur-2xl"></div>
            <div className="absolute top-[40%] left-[40%] w-24 h-24 bg-blue-500/3 rotate-45 rounded-full blur-2xl"></div>
            
            {/* Menorah pattern (subtle) */}
            <div className="absolute bottom-1/4 right-1/2 w-2 h-10 bg-amber-500/3 blur-xl"></div>
            <div className="absolute bottom-1/4 right-[calc(50%-10px)] w-2 h-8 bg-amber-500/3 blur-xl"></div>
            <div className="absolute bottom-1/4 right-[calc(50%+10px)] w-2 h-8 bg-amber-500/3 blur-xl"></div>
            <div className="absolute bottom-1/4 right-[calc(50%-20px)] w-2 h-7 bg-amber-500/3 blur-xl"></div>
            <div className="absolute bottom-1/4 right-[calc(50%+20px)] w-2 h-7 bg-amber-500/3 blur-xl"></div>
          </div>
          
          <Header />
          <main className="flex-grow pt-24 pb-8 px-4 sm:px-6 relative z-10">
            <div className="container mx-auto animate-fade-in">
              {children}
            </div>
          </main>
          <Footer />
          <Toaster />
        </div>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default Layout;
