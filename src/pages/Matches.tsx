
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Train, Clock, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { Topic } from '../data/topics';

// Mock data for potential matches
interface Match {
  id: string;
  nickname: string;
  topics: Topic[];
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  commonTopics: Topic[];
  compatibility: number;
}

const Matches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    user,
    selectedTopics, 
    departureStation, 
    arrivalStation, 
    departureTime, 
    isAuthenticated 
  } = useUser();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is authenticated and has all required data
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
    
    if (!selectedTopics.length) {
      toast({
        title: "בחר תחומי לימוד",
        description: "יש לבחור תחומי לימוד תחילה",
        variant: "destructive",
      });
      navigate('/topics');
      return;
    }
    
    if (!departureStation || !arrivalStation) {
      toast({
        title: "בחר תחנות",
        description: "יש לבחור תחנות תחילה",
        variant: "destructive",
      });
      navigate('/stations');
      return;
    }
    
    // Generate mock matches
    setLoading(true);
    setTimeout(() => {
      const mockMatches: Match[] = [
        {
          id: 'match1',
          nickname: 'אברהם כהן',
          topics: selectedTopics.slice(0, Math.max(1, Math.floor(Math.random() * selectedTopics.length))),
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureTime || '08:00',
          commonTopics: selectedTopics.slice(0, Math.max(1, Math.floor(Math.random() * selectedTopics.length))),
          compatibility: 95
        },
        {
          id: 'match2',
          nickname: 'יצחק לוי',
          topics: selectedTopics.slice(0, Math.max(1, Math.floor(Math.random() * selectedTopics.length))),
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureTime || '08:00',
          commonTopics: selectedTopics.slice(0, 1),
          compatibility: 85
        },
        {
          id: 'match3',
          nickname: 'יעקב ישראלי',
          topics: selectedTopics.slice(0, Math.max(1, Math.floor(Math.random() * selectedTopics.length))),
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureTime || '08:00',
          commonTopics: selectedTopics.slice(0, 1),
          compatibility: 75
        }
      ];
      
      setMatches(mockMatches);
      setLoading(false);
    }, 1500);
  }, [isAuthenticated, selectedTopics, departureStation, arrivalStation, departureTime, navigate, toast]);
  
  const startChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">חברותות מתאימות</h1>
        <p className="text-gray-500">
          מצאנו עבורך את החברותות הבאות בהתאם לתחומי העניין שלך ומסלול הנסיעה
        </p>
      </div>
      
      {loading ? (
        <div className="w-full max-w-md mx-auto text-center p-8 animate-pulse">
          <h3 className="text-xl mb-4">מחפש חברותות מתאימות...</h3>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      ) : (
        <div className="w-full space-y-6 animate-fade-in">
          {matches.length > 0 ? (
            matches.map((match) => (
              <Card key={match.id} className="hover-lift overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {match.nickname.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{match.nickname}</CardTitle>
                        <Badge variant="outline" className="mt-1">{match.compatibility}% התאמה</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">תחומי לימוד משותפים:</span>
                      <div className="flex flex-wrap gap-1">
                        {match.commonTopics.map((topic) => (
                          <Badge key={topic.id} variant="secondary" className="text-xs">
                            {topic.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {match.departureStation} → {match.arrivalStation}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">שעת יציאה: {match.departureTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 pt-4">
                  <Button 
                    onClick={() => startChat(match.id)} 
                    className="w-full flex items-center gap-2 hover-lift focus-ring"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>התחל שיחה</span>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="w-full max-w-md mx-auto p-6 text-center">
              <h3 className="text-xl font-medium mb-4">לא נמצאו חברותות מתאימות</h3>
              <p className="text-gray-500 mb-6">
                לא מצאנו משתמשים שמתאימים לקריטריונים שהגדרת. נסה לשנות את התחומים או התחנות שבחרת.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/topics')} 
                  variant="outline"
                  className="mr-2 focus-ring"
                >
                  שנה תחומים
                </Button>
                <Button 
                  onClick={() => navigate('/stations')} 
                  className="focus-ring"
                >
                  שנה תחנות
                </Button>
              </div>
            </Card>
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/stations')}
              className="focus-ring"
            >
              חזור
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="focus-ring"
            >
              חזור לעמוד הראשי
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
