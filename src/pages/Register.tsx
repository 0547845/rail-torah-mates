
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import GoogleAuth from '../components/GoogleAuth';
import DailyContent from '../components/DailyContent';
import { ChevronRight, Heart, MessageCircle, User, Sparkles, BookOpen, Scroll, Star } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('register');

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
    <div className="flex flex-col min-h-[75vh]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-2 flex items-center justify-center mx-auto gap-2">
            <Scroll className="h-4 w-4" />
            <span>תורה קדושה ויקרה לעם היהודי</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-500 to-accent">מצא חברותא ברכבת</h1>
          <p className="text-gray-600 text-lg">חיבור בין לומדי תורה בדרכים</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              הרשמה
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              תוכן יומי
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="mt-0">
            <Card className="w-full animated-gradient shadow-lg border-0 transition-all duration-300 overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-amber-500/10 z-0"></div>
              <CardHeader className="bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm relative z-10 pb-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  הצטרף לקהילה
                </CardTitle>
                <CardDescription className="text-center">
                  מצא שותף ללימוד תורה במהלך נסיעותיך ברכבת
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 px-6 relative z-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-center items-center mb-2">
                        <div className="flex flex-col items-center">
                          <div className="flex gap-2 mb-1">
                            <Scroll className="text-amber-500 h-5 w-5 animate-pulse" />
                            <BookOpen className="text-primary h-5 w-5" />
                            <Star className="text-accent h-5 w-5 animate-pulse" />
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
                        className="focus-ring bg-white/60 backdrop-blur-sm rounded-full"
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
                        className="focus-ring bg-white/60 backdrop-blur-sm rounded-full"
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
                        className="min-h-[100px] focus-ring bg-white/60 backdrop-blur-sm rounded-xl"
                      />
                    </div>
                  </form>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gradient-to-t from-white/80 to-white/40 backdrop-blur-sm px-6 py-4 relative z-10">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full hover-lift focus-ring rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/20 group px-4 py-6 h-auto"
                >
                  {isSubmitting ? (
                    'מבצע רישום...'
                  ) : (
                    <span className="flex items-center justify-center text-lg">
                      מצא חברותא 
                      <ChevronRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-[-4px]" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-0">
            <DailyContent />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>בהרשמה אתה מסכים ל<a href="#" className="text-primary hover:underline">תנאי השימוש</a> ול<a href="#" className="text-primary hover:underline">מדיניות הפרטיות</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
