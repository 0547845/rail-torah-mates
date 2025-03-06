
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { UserProvider } from '../contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
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
  );
};

export default Layout;
