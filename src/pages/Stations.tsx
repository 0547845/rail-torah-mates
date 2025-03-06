
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { stations, Station } from '../data/stations';
import { trainScheduleService } from '../services/trainScheduleService';
import { CheckCircle2, Clock, Train } from 'lucide-react';

const Stations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    departureStation, 
    setDepartureStation, 
    arrivalStation, 
    setArrivalStation, 
    departureTime, 
    setDepartureTime,
    availableTimes,
    setAvailableTimes,
    isAuthenticated, 
    selectedTopics 
  } = useUser();
  
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [time, setTime] = useState(departureTime || '');
  
  // Check if user is authenticated and has selected topics
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
    }
  }, [isAuthenticated, selectedTopics, navigate, toast]);
  
  // Fetch available train times when both stations are selected
  useEffect(() => {
    const fetchTrainTimes = async () => {
      if (departureStation && arrivalStation) {
        setIsLoadingTimes(true);
        try {
          const times = await trainScheduleService.getAvailableTrainTimes(
            departureStation,
            arrivalStation
          );
          setAvailableTimes(times);
          setTime(''); // Reset selected time when stations change
        } catch (error) {
          console.error("Error fetching train times:", error);
          toast({
            title: "שגיאה בטעינת לוח זמנים",
            description: "לא ניתן לטעון את לוח הזמנים כעת. נסה שנית מאוחר יותר.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingTimes(false);
        }
      }
    };

    fetchTrainTimes();
  }, [departureStation, arrivalStation, setAvailableTimes, toast]);
  
  const filteredStations = stations.filter((station) => {
    const matchesRegion = selectedRegion === 'all' || station.region === selectedRegion;
    const matchesSearch = station.name.includes(searchTerm);
    return matchesRegion && matchesSearch;
  });
  
  const handleStationSelection = (station: Station, type: 'departure' | 'arrival') => {
    if (type === 'departure') {
      setDepartureStation(station);
    } else {
      setArrivalStation(station);
    }
  };
  
  const handleTimeSelection = (selectedTime: string) => {
    setTime(selectedTime);
  };
  
  const handleContinue = () => {
    if (!departureStation || !arrivalStation) {
      toast({
        title: "בחירת תחנות נדרשת",
        description: "יש לבחור תחנת מוצא ותחנת יעד",
        variant: "destructive",
      });
      return;
    }
    
    if (departureStation.id === arrivalStation.id) {
      toast({
        title: "תחנות זהות",
        description: "תחנת המוצא והיעד לא יכולות להיות זהות",
        variant: "destructive",
      });
      return;
    }
    
    if (!time) {
      toast({
        title: "בחר שעת נסיעה",
        description: "יש לבחור שעת נסיעה",
        variant: "destructive",
      });
      return;
    }
    
    setDepartureTime(time);
    navigate('/matches');
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">בחירת תחנות רכבת</h1>
        <p className="text-gray-500">
          בחר את תחנת המוצא והיעד שלך ואת שעת הנסיעה המשוערת
        </p>
      </div>
      
      <Tabs defaultValue="departure" className="w-full animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="departure" className="text-lg">תחנת מוצא</TabsTrigger>
          <TabsTrigger value="arrival" className="text-lg">תחנת יעד</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>בחר את תחנת המוצא שלך</CardTitle>
              <CardDescription>התחנה ממנה אתה מתחיל את נסיעתך ברכבת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="region">אזור</Label>
                  <Select 
                    value={selectedRegion} 
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="כל האזורים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל האזורים</SelectItem>
                      <SelectItem value="north">צפון</SelectItem>
                      <SelectItem value="center">מרכז</SelectItem>
                      <SelectItem value="south">דרום</SelectItem>
                      <SelectItem value="jerusalem">ירושלים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="search">חיפוש תחנה</Label>
                  <Input
                    id="search"
                    placeholder="הקלד שם תחנה"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus-ring"
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                <ul className="space-y-2">
                  {filteredStations.map((station) => (
                    <li 
                      key={station.id} 
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-primary/5 ${
                        departureStation?.id === station.id ? 'bg-primary/10 border border-primary/30' : 'border'
                      }`}
                      onClick={() => handleStationSelection(station, 'departure')}
                    >
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-primary" />
                        <span>{station.name}</span>
                      </div>
                      {departureStation?.id === station.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </li>
                  ))}
                  {filteredStations.length === 0 && (
                    <li className="p-3 text-gray-500 text-center">לא נמצאו תחנות</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="arrival" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>בחר את תחנת היעד שלך</CardTitle>
              <CardDescription>התחנה אליה אתה מסיים את נסיעתך ברכבת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="region">אזור</Label>
                  <Select 
                    value={selectedRegion} 
                    onValueChange={setSelectedRegion}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="כל האזורים" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל האזורים</SelectItem>
                      <SelectItem value="north">צפון</SelectItem>
                      <SelectItem value="center">מרכז</SelectItem>
                      <SelectItem value="south">דרום</SelectItem>
                      <SelectItem value="jerusalem">ירושלים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="search">חיפוש תחנה</Label>
                  <Input
                    id="search"
                    placeholder="הקלד שם תחנה"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus-ring"
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                <ul className="space-y-2">
                  {filteredStations.map((station) => (
                    <li 
                      key={station.id} 
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-primary/5 ${
                        arrivalStation?.id === station.id ? 'bg-primary/10 border border-primary/30' : 'border'
                      }`}
                      onClick={() => handleStationSelection(station, 'arrival')}
                    >
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-primary" />
                        <span>{station.name}</span>
                      </div>
                      {arrivalStation?.id === station.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </li>
                  ))}
                  {filteredStations.length === 0 && (
                    <li className="p-3 text-gray-500 text-center">לא נמצאו תחנות</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="w-full mt-8 animate-fade-in">
        <CardHeader>
          <CardTitle>בחר שעת נסיעה</CardTitle>
          <CardDescription>
            {departureStation && arrivalStation ? 
              `זמני רכבת זמינים מ${departureStation.name} ל${arrivalStation.name}` : 
              'יש לבחור תחנות מוצא ויעד תחילה'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTimes ? (
            <div className="py-4 text-center">
              <p className="text-gray-500">טוען לוח זמנים...</p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {availableTimes.map((trainTime) => (
                <div
                  key={trainTime}
                  onClick={() => handleTimeSelection(trainTime)}
                  className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all hover:bg-primary/5 ${
                    time === trainTime ? 'bg-primary/10 border-primary/30' : ''
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>{trainTime}</span>
                </div>
              ))}
            </div>
          ) : departureStation && arrivalStation ? (
            <div className="py-4 text-center">
              <p className="text-gray-500">לא נמצאו זמני רכבת זמינים בין התחנות שנבחרו</p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-500">יש לבחור תחנת מוצא ותחנת יעד לצפייה בלוח הזמנים</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/topics')}
            className="focus-ring"
          >
            חזור
          </Button>
          <Button 
            onClick={handleContinue}
            className="hover-lift focus-ring"
            disabled={!departureStation || !arrivalStation || !time}
          >
            מצא חברותא
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Stations;
