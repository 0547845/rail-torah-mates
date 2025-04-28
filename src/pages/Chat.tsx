
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizonal, ArrowRight, Clock, BookOpen, Sparkles, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDailyContent } from '../hooks/useDailyContent';
import ContentSharingDialog from '../components/ContentSharingDialog';

// Simulated chat message type
interface Message {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const { toast } = useToast();
  const { user, isAuthenticated } = useUser();
  const { halachaItems, chasidutItems, parashaItems, isLoading: isLoadingContent } = useDailyContent();
  
  const [match, setMatch] = useState({
    id: '',
    nickname: '',
    compatibility: 0,
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [dailyContentTab, setDailyContentTab] = useState('halacha');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "נדרשת הרשמה",
        description: "יש להירשם תחילה",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }
    
    // Load match data and initial messages
    if (chatId) {
      // In a real app, this would fetch from an API
      setMatch({
        id: chatId,
        nickname: chatId === 'match1' ? 'אברהם כהן' : chatId === 'match2' ? 'יצחק לוי' : 'יעקב ישראלי',
        compatibility: chatId === 'match1' ? 95 : chatId === 'match2' ? 85 : 75,
      });
      
      setMessages([
        {
          id: '1',
          sender: 'match',
          text: 'שלום! אני שמח שנוצר בינינו קשר ללימוד ברכבת.',
          timestamp: new Date(Date.now() - 120000),
        },
      ]);
    }
  }, [chatId, isAuthenticated, navigate, toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set up the timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowRatingDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    
    // Simulate reply from match after a delay
    setTimeout(() => {
      const replies = [
        'נשמע מעניין, אני מאוד אשמח ללמוד את הנושא הזה!',
        'האם אתה מכיר את הפירוש של הרמב"ם על הסוגיה?',
        'בסדר גמור, נפגש ברכבת. מחכה ללמוד יחד.',
        'יש לי רעיון לדיון מעניין בנושא, אשמח לשתף כשניפגש.',
        'ראיתי מאמר מעניין בנושא הזה לאחרונה, אביא אותו איתי.',
      ];
      
      const replyMsg: Message = {
        id: Date.now().toString(),
        sender: 'match',
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000 + Math.random() * 2000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  const shareContent = (message: string) => {
    setNewMessage(message);
    // Optional: Send automatically
    // setTimeout(sendMessage, 100);
  };
  
  const submitRating = () => {
    if (rating === null) {
      toast({
        title: "דירוג נדרש",
        description: "אנא בחר דירוג לחברותא",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would submit to an API
    toast({
      title: "תודה על הדירוג!",
      description: "הדירוג שלך נשמר בהצלחה",
    });
    
    setShowRatingDialog(false);
    navigate('/matches');
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto animate-fade-in">
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/matches')}
                className="focus-ring"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {match.nickname.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-base">{match.nickname}</CardTitle>
              <Badge variant="outline" className="ml-2">{match.compatibility}% התאמה</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">תוכן יומי</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader className="text-right">
                    <SheetTitle>תוכן יומי ללימוד</SheetTitle>
                    <SheetDescription>
                      חומר לימוד יומי מתחדש שניתן לשתף עם החברותא שלך
                    </SheetDescription>
                  </SheetHeader>
                  
                  <Tabs value={dailyContentTab} onValueChange={setDailyContentTab} className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="halacha" className="flex items-center gap-2">
                        <ScrollText className="h-4 w-4" />
                        <span>הלכה</span>
                      </TabsTrigger>
                      <TabsTrigger value="chasidut" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>חסידות</span>
                      </TabsTrigger>
                      <TabsTrigger value="parasha" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>פרשת השבוע</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="halacha" className="mt-4">
                      <div className="space-y-4">
                        {isLoadingContent ? (
                          <p>טוען תוכן...</p>
                        ) : halachaItems.length > 0 ? (
                          halachaItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden card-gradient-accent hover-lift">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">
                                  {item.content.length > 150 
                                    ? `${item.content.substring(0, 150)}...` 
                                    : item.content}
                                </p>
                                {item.source && <div className="mt-2 text-xs text-muted-foreground">{item.source}</div>}
                              </CardContent>
                              <CardFooter className="flex justify-between pt-2">
                                <ContentSharingDialog 
                                  contentItem={item}
                                  onShare={(message) => shareContent(message)}
                                  matchId={match.id}
                                  compact
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/content/${item.id}`)}
                                  className="text-xs"
                                >
                                  פתח
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <p>אין תוכן זמין כרגע</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="chasidut" className="mt-4">
                      <div className="space-y-4">
                        {isLoadingContent ? (
                          <p>טוען תוכן...</p>
                        ) : chasidutItems.length > 0 ? (
                          chasidutItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden card-gradient-accent hover-lift">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">
                                  {item.content.length > 150 
                                    ? `${item.content.substring(0, 150)}...` 
                                    : item.content}
                                </p>
                                {item.source && <div className="mt-2 text-xs text-muted-foreground">{item.source}</div>}
                              </CardContent>
                              <CardFooter className="flex justify-between pt-2">
                                <ContentSharingDialog 
                                  contentItem={item}
                                  onShare={(message) => shareContent(message)}
                                  matchId={match.id}
                                  compact
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/content/${item.id}`)}
                                  className="text-xs"
                                >
                                  פתח
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <p>אין תוכן זמין כרגע</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="parasha" className="mt-4">
                      <div className="space-y-4">
                        {isLoadingContent ? (
                          <p>טוען תוכן...</p>
                        ) : parashaItems.length > 0 ? (
                          parashaItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden card-gradient-accent hover-lift">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm">
                                  {item.content.length > 150 
                                    ? `${item.content.substring(0, 150)}...` 
                                    : item.content}
                                </p>
                                {item.source && <div className="mt-2 text-xs text-muted-foreground">{item.source}</div>}
                              </CardContent>
                              <CardFooter className="flex justify-between pt-2">
                                <ContentSharingDialog 
                                  contentItem={item}
                                  onShare={(message) => shareContent(message)}
                                  matchId={match.id}
                                  compact
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/content/${item.id}`)}
                                  className="text-xs"
                                >
                                  פתח
                                </Button>
                              </CardFooter>
                            </Card>
                          ))
                        ) : (
                          <p>אין תוכן זמין כרגע</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/content')}
                      className="w-full"
                    >
                      צפה בכל התכנים
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p>{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('he-IL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-3">
          <div className="flex w-full gap-2">
            <Input
              placeholder="הקלד הודעה..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="focus-ring"
            />
            <Button 
              onClick={sendMessage} 
              size="icon"
              disabled={!newMessage.trim()}
              className="focus-ring"
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>דרג את החברותא שלך</DialogTitle>
            <DialogDescription>
              השיחה הסתיימה. אנא דרג את החוויה שלך עם החברותא
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-3xl px-2 transition-all ${
                  rating && star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={submitRating}
              className="w-full focus-ring"
            >
              שלח דירוג
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
