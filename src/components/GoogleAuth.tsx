
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';

interface GoogleUserData {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  const handleSuccess = (credentialResponse: any) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential) as GoogleUserData;
      
      // Create user object from Google data
      const newUser = {
        id: `google_${decoded.sub}`,
        email: decoded.email,
        nickname: decoded.name.split(' ')[0], // Use first name as nickname
        profilePicture: decoded.picture,
        googleId: decoded.sub,
        isVerified: true,
      };
      
      setUser(newUser);
      
      toast({
        title: "התחברת בהצלחה!",
        description: `ברוך הבא ${newUser.nickname}`,
      });
      
      // Navigate to topics selection
      navigate('/topics');
    } catch (error) {
      console.error('Error decoding Google token:', error);
      toast({
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה בעת התחברות. נסה שנית.",
        variant: "destructive",
      });
    }
  };

  const handleError = () => {
    toast({
      title: "שגיאה בהתחברות",
      description: "אירעה שגיאה בעת התחברות עם Google. נסה שנית.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="transform transition-all hover:scale-105 shadow-md rounded-full overflow-hidden">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="outline"
          shape="pill"
          text="signin_with"
          locale="he"
          width="280px"
        />
      </div>
    </div>
  );
};

export default GoogleAuth;
