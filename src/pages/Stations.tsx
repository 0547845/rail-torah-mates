
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { Station } from '../data/stations';
import { trainScheduleService } from '../services/trainScheduleService';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import StationSelection from './StationSelection';
import TimeSelection from './TimeSelection';
import NearbyStationAlert from '../components/NearbyStationAlert';

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
    selectedTopics,
    nearbyStation,
    updateUserLocation,
    locationError
  } = useUser();
  
  const [step, setStep] = useState<'departure' | 'arrival' | 'time'>('departure');
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
    
    // Try to update user location when component mounts
    updateUserLocation();
  }, [isAuthenticated, selectedTopics, navigate, toast, updateUserLocation]);
  
  // Fetch available train times when both stations are selected
  useEffect(() => {
    const fetchTrainTimes = async () => {
      if (departureStation && arrivalStation && step === 'time') {
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
  }, [departureStation, arrivalStation, setAvailableTimes, toast, step]);
  
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
  
  const handleNextStep = () => {
    if (step === 'departure') {
      setStep('arrival');
    } else if (step === 'arrival') {
      setStep('time');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'time') {
      setStep('arrival');
    } else if (step === 'arrival') {
      setStep('departure');
    }
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
      <div className="text-center mb-6 animate-slide-down">
        <h1 className="text-3xl font-bold mb-2">תכנון הנסיעה</h1>
        <p className="text-gray-500">
          {step === 'departure' && 'בחר את תחנת המוצא שלך לחברותא ברכבת'}
          {step === 'arrival' && 'בחר את תחנת היעד שלך לחברותא ברכבת'}
          {step === 'time' && 'בחר זמן נסיעה מתאים למציאת חברותא'}
        </p>
      </div>
      
      {/* Show nearby station alert if available and on departure step */}
      {step === 'departure' && !departureStation && (
        <div className="w-full mb-4">
          <NearbyStationAlert />
        </div>
      )}
      
      <div className="w-full space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-6">
          <div className="w-full">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
              
              <div 
                className={`flex flex-col items-center justify-center ${step === 'departure' ? 'text-primary' : 'text-gray-500'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'departure' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                  1
                </div>
                <span className="text-xs mt-1">תחנת מוצא</span>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-center ${step === 'arrival' ? 'text-primary' : 'text-gray-500'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'arrival' ? 'bg-primary text-white' : step === 'time' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="text-xs mt-1">תחנת יעד</span>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-center ${step === 'time' ? 'text-primary' : 'text-gray-500'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'time' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                  3
                </div>
                <span className="text-xs mt-1">זמן נסיעה</span>
              </div>
            </div>
          </div>
        </div>
      
        {/* Step Content */}
        {step === 'departure' && (
          <StationSelection 
            type="departure"
            onStationSelected={(station) => handleStationSelection(station, 'departure')}
            selectedStation={departureStation}
            showNextStep={handleNextStep}
          />
        )}
        
        {step === 'arrival' && (
          <StationSelection 
            type="arrival"
            onStationSelected={(station) => handleStationSelection(station, 'arrival')}
            selectedStation={arrivalStation}
            showNextStep={handleNextStep}
          />
        )}
        
        {step === 'time' && departureStation && arrivalStation && (
          <TimeSelection
            availableTimes={availableTimes}
            selectedTime={time}
            onTimeSelected={handleTimeSelection}
            isLoading={isLoadingTimes}
            departureStation={departureStation}
            arrivalStation={arrivalStation}
          />
        )}
      </div>
      
      {/* Navigation Buttons */}
      <Card className="w-full mt-8 border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="flex justify-between pt-4">
            {step !== 'departure' ? (
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                className="focus-ring"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                חזור
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate('/topics')}
                className="focus-ring"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                חזור לנושאים
              </Button>
            )}
            
            {step === 'departure' && (
              <Button 
                onClick={handleNextStep}
                disabled={!departureStation}
                className="hover-lift focus-ring bg-primary hover:bg-primary/90"
              >
                המשך
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {step === 'arrival' && (
              <Button 
                onClick={handleNextStep}
                disabled={!arrivalStation}
                className="hover-lift focus-ring bg-primary hover:bg-primary/90"
              >
                בחר זמן
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {step === 'time' && (
              <Button 
                onClick={handleContinue}
                disabled={!time}
                className="hover-lift focus-ring bg-primary hover:bg-primary/90"
              >
                מצא חברותא
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Station Summary */}
      {(departureStation || arrivalStation) && (
        <Card className="w-full mt-4 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {departureStation && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">תחנת מוצא</span>
                  <div className="flex items-center">
                    <span className="font-semibold">{departureStation.name}</span>
                    {nearbyStation?.id === departureStation.id && (
                      <span className="inline-flex items-center ml-1">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600">קרוב אליך</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {departureStation && arrivalStation && (
                <div className="hidden sm:block">→</div>
              )}
              
              {arrivalStation && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">תחנת יעד</span>
                  <span className="font-semibold">{arrivalStation.name}</span>
                </div>
              )}
              
              {time && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">זמן יציאה</span>
                  <span className="font-semibold">{time}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Stations;
