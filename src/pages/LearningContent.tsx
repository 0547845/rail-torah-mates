
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, Clock, Share2, ScrollText, Sparkles, Calendar } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useDailyContent, useContentByCategory, useContentItem } from '../hooks/useDailyContent';
import ContentSharingDialog from '../components/ContentSharingDialog';
import { ContentItem } from '../services/dailyContentService';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const LearningContent: React.FC = () => {
  const { id: contentId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { dailyContent, isLoading: isLoadingAll } = useDailyContent();
  const { item, isLoading: isLoadingItem } = useContentItem(contentId);
  const [activeTab, setActiveTab] = useState<'halacha' | 'chasidut' | 'parasha'>('halacha');
  
  const { user, isAuthenticated } = useUser();
  
  // Determine which tab to show as active if a specific item is loaded
  React.useEffect(() => {
    if (item && item.category) {
      setActiveTab(item.category);
    }
  }, [item]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'halacha' | 'chasidut' | 'parasha');
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'halacha':
        return <ScrollText className="h-4 w-4" />;
      case 'chasidut':
        return <Sparkles className="h-4 w-4" />;
      case 'parasha':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'halacha':
        return 'הלכה';
      case 'chasidut':
        return 'חסידות';
      case 'parasha':
        return 'פרשת השבוע';
      default:
        return category;
    }
  };

  const renderContentItem = (item: ContentItem) => (
    <Card key={item.id} className="hover-lift overflow-hidden transition-all hover:shadow-md mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {getCategoryIcon(item.category)}
            {getCategoryName(item.category)}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          {item.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{item.content}</p>
        {item.source && (
          <p className="text-xs text-muted-foreground mt-2">מקור: {item.source}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <ContentSharingDialog contentItem={item} />
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/content/${item.id}`)}
        >
          קרא עוד
        </Button>
      </CardFooter>
    </Card>
  );

  const renderContentItems = (items: ContentItem[] = []) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">אין תוכן זמין כרגע</p>
        </div>
      );
    }
    
    return items.map(renderContentItem);
  };

  const renderLoading = () => (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-3 w-24 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Show a specific content item if an ID is provided
  if (contentId) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/content')}
        >
          <ArrowRight className="mr-2 h-4 w-4" /> חזרה לכל התכנים
        </Button>
        
        {isLoadingItem ? (
          renderLoading()
        ) : item ? (
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryIcon(item.category)}
                  {getCategoryName(item.category)}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {item.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed whitespace-pre-line">{item.content}</p>
              {item.source && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <h4 className="text-sm font-semibold mb-1">מקור:</h4>
                  <p className="text-sm">{item.source}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <ContentSharingDialog contentItem={item} />
              {isAuthenticated && user && (
                <Button variant="outline" onClick={() => navigate('/matches')}>
                  מצא חברותא ללימוד
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>התוכן לא נמצא</CardTitle>
            </CardHeader>
            <CardContent>
              <p>התוכן המבוקש אינו זמין או שהוסר.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/content')}>
                חזרה לתכנים
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  }

  // Show all content organized by tabs
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">תוכן לימודי יומי</h1>
        <p className="text-gray-500">
          תוכן לימודי מתחדש מדי יום בהלכה, חסידות ופרשת השבוע
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
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
        
        <TabsContent value="halacha" className="mt-6">
          {isLoadingAll ? renderLoading() : renderContentItems(dailyContent?.halacha)}
        </TabsContent>
        
        <TabsContent value="chasidut" className="mt-6">
          {isLoadingAll ? renderLoading() : renderContentItems(dailyContent?.chasidut)}
        </TabsContent>
        
        <TabsContent value="parasha" className="mt-6">
          {isLoadingAll ? renderLoading() : renderContentItems(dailyContent?.parasha)}
        </TabsContent>
      </Tabs>
      
      {isAuthenticated ? (
        <div className="text-center mt-12 mb-6">
          <p className="text-sm mb-4">רוצה ללמוד עם מישהו? מצא חברותא לנסיעה ברכבת</p>
          <Button 
            onClick={() => navigate('/stations')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            מצא חברותא ברכבת
          </Button>
        </div>
      ) : (
        <div className="text-center mt-12 mb-6">
          <p className="text-sm mb-4">הירשם כדי למצוא חברותא ללימוד ברכבת</p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            הירשם עכשיו
          </Button>
        </div>
      )}
    </div>
  );
};

export default LearningContent;
