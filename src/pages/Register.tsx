
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = re.test(email);
    setEmailError(isValid ? '' : 'כתובת אימייל לא תקינה');
    return isValid;
  };

  const validateNickname = (nickname: string): boolean => {
    const isValid = nickname.length >= 2;
    setNicknameError(isValid ? '' : 'יש להזין כינוי באורך של 2 תווים לפחות');
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isNicknameValid = validateNickname(nickname);
    
    if (!isEmailValid || !isNicknameValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would include an API call for registration
    setTimeout(() => {
      // Simulate successful registration
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        nickname,
        description,
        isVerified: true, // In a real app, this would start as false until verification
      };
      
      setUser(newUser);
      toast({
        title: "נרשמת בהצלחה!",
        description: "ברוך הבא לחברותא ברכבת",
      });
      
      navigate('/topics');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <Card className="w-full max-w-md glass animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl">הרשמה לחברותא ברכבת</CardTitle>
          <CardDescription>צור פרופיל כדי להתחיל למצוא חברותא</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="הזן כתובת אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email)}
                className="focus-ring"
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname">כינוי לפרופיל</Label>
              <Input
                id="nickname"
                placeholder="בחר כינוי לפרופיל"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onBlur={() => validateNickname(nickname)}
                className="focus-ring"
              />
              {nicknameError && <p className="text-sm text-red-500">{nicknameError}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">תיאור קצר עליך (אופציונלי)</Label>
              <Textarea
                id="description"
                placeholder="ספר מעט על עצמך ועל תחומי הלימוד המועדפים עליך"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] focus-ring"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full hover-lift focus-ring"
          >
            {isSubmitting ? 'מבצע רישום...' : 'הרשם'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
