
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Train, Clock, MessageCircle, Users, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { Topic } from '../data/topics';
import NearbyStationAlert from '../components/NearbyStationAlert';

// Interface for potential matches
interface Match {
  id: string;
  nickname: string;
  topics: Topic[];
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  commonTopics: Topic[];
  compatibility: number;
  profilePicture?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  distanceKm?: number;
}

// Mock user profile images - in a real app, these would come from the server
const profileImages = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/51.jpg',
  'https://randomuser.me/api/portraits/women/53.jpg',
  'https://randomuser.me/api/portraits/men/64.jpg',
];

const Matches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    user,
    selectedTopics, 
    departureStation, 
    arrivalStation, 
    departureTime, 
    isAuthenticated,
    updateUserLocation
  } = useUser();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  
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

    // Try to update user location
    updateUserLocation();
    
    // Generate mock matches
    setLoading(true);
    setTimeout(() => {
      // Generate a random number of active users between 8-20
      const onlineUsersCount = Math.floor(8 + Math.random() * 12);
      setActiveUsers(onlineUsersCount);
      
      // Generate 3-5 random matches
      const matchCount = Math.floor(3 + Math.random() * 3);
      const mockMatches: Match[] = [];
      
      const names = ['אברהם כהן', 'יצחק לוי', 'יעקב ישראלי', 'דוד מזרחי', 'משה גולדברג'];
      
      for (let i = 0; i < matchCount; i++) {
        // Generate common topics - at least one, up to all selected topics
        const commonTopicsCount = Math.max(1, Math.floor(Math.random() * selectedTopics.length));
        const shuffledTopics = [...selectedTopics].sort(() => 0.5 - Math.random());
        const commonTopics = shuffledTopics.slice(0, commonTopicsCount);
        
        // Calculate realistic compatibility based on common topics
        const compatibility = Math.min(100, 60 + (commonTopicsCount / selectedTopics.length * 40));
        
        // Generate realistic distance - nearby users are more likely to be shown
        const distance = Math.floor(Math.random() * 5) + (Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0);
        
        mockMatches.push({
          id: `match${i+1}`,
          nickname: names[i % names.length],
          topics: [...commonTopics, ...shuffledTopics.slice(commonTopicsCount, commonTopicsCount + 2)],
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureTime || '08:00',
          commonTopics,
          compatibility: Math.round(compatibility),
          profilePicture: profileImages[i % profileImages.length],
          isOnline: Math.random() > 0.5,
          lastSeen: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60000)), // Up to 24 hours ago
          distanceKm: distance
        });
      }
      
      // Sort by compatibility
      mockMatches.sort((a, b) => b.compatibility - a.compatibility);
      
      setMatches(mockMatches);
      setLoading(false);
    }, 1500);
  }, [isAuthenticated, selectedTopics, departureStation, arrivalStation, departureTime, navigate, toast, updateUserLocation]);
  
  const startChat = (matchId: string) => {
    toast({
      title: "יצירת צ'אט חדש",
      description: "אנחנו יוצרים צ'אט חדש עבורך",
    });
    
    setTimeout(() => {
      navigate(`/chat/${matchId}`);
    }, 1000);
  };
  
  // Format time since last seen
  const formatTimeSince = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    
    if (minutes < 60) {
      return `${minutes} דקות`;
    } else if (minutes < 24 * 60) {
      return `${Math.floor(minutes / 60)} שעות`;
    } else {
      return `${Math.floor(minutes / (60 * 24))} ימים`;
    }
  };
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">חברותות מתאימות</h1>
        <p className="text-gray-500">
          מצאנו עבורך את החברותות הבאות בהתאם לתחומי העניין שלך ומסלול הנסיעה
        </p>
      </div>

      {/* Show nearby station alert if available */}
      <div className="w-full">
        <NearbyStationAlert />
      </div>
      
      {/* Active users indicator */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="mr-2 text-sm">{activeUsers} משתמשים פעילים כרגע</span>
          </div>
          <span className="text-gray-400 px-2">|</span>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-primary mr-1" />
            <span>{matches.length} חברותות מתאימות</span>
          </div>
        </div>
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
              <Card key={match.id} className="hover:shadow-md transition-shadow overflow-hidden border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-blue-100">
                        {match.profilePicture ? (
                          <AvatarImage src={match.profilePicture} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {match.nickname.substring(0, 2)}
                          </AvatarFallback>
                        )}
                        {match.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-1">
                          {match.nickname}
                          {match.isOnline && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                              מחובר
                            </span>
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50">{match.compatibility}% התאמה</Badge>
                          {match.distanceKm !== undefined && match.distanceKm <= 5 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {match.distanceKm === 0 ? 'קרוב אליך' : `${match.distanceKm} ק״מ ממך`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {!match.isOnline && match.lastSeen && (
                      <span className="text-xs text-gray-500">
                        נראה לאחרונה: לפני {formatTimeSince(match.lastSeen)}
                      </span>
                    )}
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
                    className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
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
