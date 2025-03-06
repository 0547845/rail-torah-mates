
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser, selectedTopics, isAuthenticated } = useUser();
  
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [description, setDescription] = useState(user?.description || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "נדרשת הרשמה",
        description: "יש להירשם תחילה",
        variant: "destructive",
      });
      navigate('/register');
    }
  }, [isAuthenticated, navigate, toast]);
  
  const handleSave = () => {
    if (!nickname.trim()) {
      toast({
        title: "שגיאה",
        description: "שם המשתמש אינו יכול להיות ריק",
        variant: "destructive",
      });
      return;
    }
    
    if (user) {
      setUser({
        ...user,
        nickname,
        description,
      });
      
      toast({
        title: "הפרופיל עודכן",
        description: "הפרופיל שלך עודכן בהצלחה",
      });
      
      setIsEditing(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto">
      <div className="text-center mb-10 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">הפרופיל שלי</h1>
        <p className="text-gray-500">
          צפה ונהל את הפרופיל והעדפות החברותא שלך
        </p>
      </div>
      
      <Card className="w-full animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user.nickname?.substring(0, 2) || 'אא'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.nickname}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="focus-ring"
              >
                ערוך פרופיל
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nickname">כינוי</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="focus-ring"
                />
              </div>
              <div>
                <Label htmlFor="description">אודות</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] focus-ring"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">אודות</h3>
                <p className="text-gray-600">
                  {user.description || 'לא הוסף תיאור'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">תחומי לימוד מועדפים</h3>
                {selectedTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTopics.map((topic) => (
                      <Badge key={topic.id} variant="secondary">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">לא נבחרו תחומי לימוד</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="focus-ring ml-2"
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSave}
              className="focus-ring"
            >
              שמור שינויים
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="w-full mt-6 flex justify-between animate-fade-in">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="focus-ring"
        >
          חזור לעמוד הראשי
        </Button>
        <Button 
          onClick={() => navigate('/topics')} 
          className="focus-ring"
        >
          עדכן העדפות
        </Button>
      </div>
    </div>
  );
};

export default Profile;
