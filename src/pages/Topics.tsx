
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { Topic, topics } from '../data/topics';

const Topics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, selectedTopics, setSelectedTopics, isAuthenticated } = useUser();
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  
  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "נדרשת הרשמה",
        description: "יש להירשם תחילה כדי לבחור תחומי לימוד",
        variant: "destructive",
      });
      navigate('/register');
    }
    
    // Initialize local topics from context if available
    if (selectedTopics.length > 0) {
      setLocalTopics(selectedTopics);
    }
  }, [isAuthenticated, navigate, toast, selectedTopics]);
  
  const toggleTopic = (topic: Topic) => {
    setLocalTopics((prevTopics) => {
      const topicExists = prevTopics.some((t) => t.id === topic.id);
      if (topicExists) {
        return prevTopics.filter((t) => t.id !== topic.id);
      } else {
        return [...prevTopics, topic];
      }
    });
  };
  
  const isSelected = (topicId: string) => {
    return localTopics.some((topic) => topic.id === topicId);
  };
  
  const handleContinue = () => {
    if (localTopics.length === 0) {
      toast({
        title: "בחירת תחומים נדרשת",
        description: "יש לבחור לפחות תחום לימוד אחד",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTopics(localTopics);
    navigate('/stations');
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">בחירת תחומי לימוד</h1>
        <p className="text-gray-500">
          בחר את תחומי הלימוד שמעניינים אותך ללמוד בזמן הנסיעה ברכבת
        </p>
        {user?.nickname && (
          <p className="mt-2 text-primary font-medium">
            שלום {user.nickname}, בחר את התחומים שמעניינים אותך
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8 animate-fade-in">
        {topics.map((topic) => {
          const selected = isSelected(topic.id);
          return (
            <Card 
              key={topic.id} 
              className={`hover-lift cursor-pointer overflow-hidden transition-all duration-300 ${
                selected 
                  ? 'border-primary/50 shadow-md' 
                  : 'border-gray-200'
              }`}
              onClick={() => toggleTopic(topic)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  {selected && (
                    <div className="absolute -top-2 -right-2 text-primary animate-scale-in">
                      <CheckCircle className="h-6 w-6 fill-primary text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="w-full flex justify-between mt-8 animate-fade-in">
        <Button variant="outline" onClick={() => navigate('/')} className="focus-ring">
          חזור
        </Button>
        <Button onClick={handleContinue} className="hover-lift focus-ring">
          המשך לבחירת תחנות
        </Button>
      </div>
    </div>
  );
};

export default Topics;
