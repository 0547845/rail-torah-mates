
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-6 mt-auto border-t animate-fade-in">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} חברותא ברכבת - כל הזכויות שמורות
            </p>
          </div>
          <div className="flex space-x-6 space-x-reverse">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">
              מדיניות פרטיות
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">
              תנאי שימוש
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">
              צור קשר
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
