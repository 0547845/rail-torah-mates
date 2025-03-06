
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { UserProvider } from '../contexts/UserContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Google OAuth client ID - in a real app this would be in an environment variable
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent"></div>
          
          <Header />
          <main className="flex-grow pt-24 pb-8 px-4 sm:px-6 relative z-10">
            <div className="container mx-auto animate-fade-in">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default Layout;
