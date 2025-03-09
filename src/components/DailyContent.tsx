
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, BookOpen, Sparkles, BookText, CalendarCheck } from 'lucide-react';
import { useDailyContent } from '../hooks/useDailyContent';
import { ContentItem } from '../services/dailyContentService';

const DailyContent = () => {
  const [activeTab, setActiveTab] = useState('halacha');
  const { halachaItems, chasidutItems, parashaItems, isLoading } = useDailyContent();
  
  // Map category names to their content arrays
  const dailyContentItems: Record<string, ContentItem[]> = {
    halacha: halachaItems,
    chasidut: chasidutItems,
    parasha: parashaItems
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">תוכן יומי מתחדש</h2>
        <p className="text-muted-foreground">הלכה, חסידות וחידושים בפרשת השבוע</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        
        {isLoading ? (
          <div className="p-8 text-center">
            <p>טוען תוכן יומי...</p>
          </div>
        ) : (
          Object.keys(dailyContentItems).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dailyContentItems[tabKey].map((item) => (
                  <Card key={item.id} className="overflow-hidden card-gradient-accent hover-lift">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                        <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" />
                          {item.date}
                        </div>
                      </div>
                      <CardDescription>{item.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{item.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-xs text-muted-foreground">{item.source}</div>
                      <Button variant="outline" size="sm" className="text-xs">
                        קרא עוד
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="rounded-full hover-lift">
                  <BookText className="mr-2 h-4 w-4" />
                  צפה בעוד תוכן יומי
                </Button>
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>
      
      <div className="mt-4 bg-primary/5 p-4 rounded-xl">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          יתרונות הלימוד היומי
        </h3>
        <ul className="text-sm space-y-1 mr-6 list-disc">
          <li>קביעות בלימוד, גם בזמנים של נסיעה</li>
          <li>הבנה מעמיקה של נושאים מגוונים בתורה</li>
          <li>הזדמנות ללמידה משותפת במהלך הנסיעה ברכבת</li>
          <li>התקדמות הדרגתית ועקבית בלימוד התורה</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyContent;
