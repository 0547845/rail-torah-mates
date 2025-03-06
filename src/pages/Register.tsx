
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import GoogleAuth from '../components/GoogleAuth';
import { ChevronRight, Heart, MessageCircle, User } from 'lucide-react';

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
    <div className="flex justify-center min-h-[75vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">מצא חברותא ברכבת</h1>
          <p className="text-gray-600">חיבור בין לומדי תורה בדרכים</p>
        </div>
        
        <Card className="w-full animated-gradient shadow-lg border-none transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-primary/10 pb-4">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <User className="h-6 w-6 text-primary" />
              הצטרף לקהילה
            </CardTitle>
            <CardDescription className="text-center">
              מצא שותף ללימוד במהלך נסיעותיך ברכבת
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 px-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-center items-center mb-2">
                    <div className="flex flex-col items-center">
                      <div className="flex gap-2 mb-1">
                        <Heart className="text-red-500 h-5 w-5" />
                        <MessageCircle className="text-primary h-5 w-5" />
                        <User className="text-green-500 h-5 w-5" />
                      </div>
                      <span className="text-sm text-gray-600">הדרך המהירה למצוא חברותא</span>
                    </div>
                  </div>
                  
                  <GoogleAuth />
                  
                  <div className="relative my-4">
                    <Separator className="my-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white dark:bg-black px-2 text-xs text-muted-foreground">
                        או הירשם באמצעות מייל
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">כתובת אימייל</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="הזן כתובת אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    className="focus-ring bg-white/60 backdrop-blur-sm"
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
                    className="focus-ring bg-white/60 backdrop-blur-sm"
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
                    className="min-h-[100px] focus-ring bg-white/60 backdrop-blur-sm"
                  />
                </div>
              </form>
            </div>
          </CardContent>
          
          <CardFooter className="bg-primary/5 px-6 py-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full hover-lift focus-ring bg-primary hover:bg-primary/90 text-white group"
            >
              {isSubmitting ? (
                'מבצע רישום...'
              ) : (
                <span className="flex items-center justify-center">
                  מצא חברותא 
                  <ChevronRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>בהרשמה אתה מסכים ל<a href="#" className="text-primary hover:underline">תנאי השימוש</a> ול<a href="#" className="text-primary hover:underline">מדיניות הפרטיות</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
