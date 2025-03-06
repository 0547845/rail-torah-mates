
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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-24 pb-8 px-4 sm:px-6">
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
