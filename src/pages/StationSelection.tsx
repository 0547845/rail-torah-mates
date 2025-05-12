
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
import { useToast } from '@/hooks/use-toast';
import { useUser } from '../contexts/UserContext';
import { stations, Station } from '../data/stations';
import { trainScheduleService } from '../services/trainScheduleService';
import { CheckCircle2, Train, MapPin, Locate } from 'lucide-react';

interface StationSelectionProps {
  type: 'departure' | 'arrival';
  onStationSelected: (station: Station) => void;
  selectedStation: Station | null;
  showNextStep: () => void;
}

const StationSelection: React.FC<StationSelectionProps> = ({ 
  type, 
  onStationSelected, 
  selectedStation,
  showNextStep
}) => {
  const { toast } = useToast();
  const { nearbyStation, updateUserLocation, locationError } = useUser();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const title = type === 'departure' ? 'בחר את תחנת המוצא שלך' : 'בחר את תחנת היעד שלך';
  const description = type === 'departure' 
    ? 'התחנה ממנה אתה מתחיל את נסיעתך ברכבת' 
    : 'התחנה אליה אתה מסיים את נסיעתך ברכבת';
  
  const filteredStations = stations.filter((station) => {
    const matchesRegion = selectedRegion === 'all' || station.region === selectedRegion;
    const matchesSearch = station.name.includes(searchTerm);
    return matchesRegion && matchesSearch;
  });

  // Highlight nearby station if available and this is departure selection
  useEffect(() => {
    if (type === 'departure' && nearbyStation && !selectedStation) {
      // Auto-scroll to the station in the list
      setTimeout(() => {
        const stationElement = document.getElementById(`station-${nearbyStation.id}`);
        if (stationElement) {
          stationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [nearbyStation, selectedStation, type]);
  
  const handleStationClick = (station: Station) => {
    onStationSelected(station);
    
    // Show toast notification when station is selected
    toast({
      title: `${type === 'departure' ? 'תחנת מוצא' : 'תחנת יעד'} נבחרה`,
      description: station.name,
    });
    
    // If it's a departure station, automatically go to the next step
    if (type === 'departure') {
      setTimeout(() => {
        showNextStep();
      }, 500);
    }
  };

  const findNearbyStation = async () => {
    setIsLocating(true);
    await updateUserLocation();
    setIsLocating(false);
    
    if (locationError) {
      toast({
        title: "שגיאה באיתור מיקום",
        description: locationError,
        variant: "destructive",
      });
      return;
    }
    
    if (nearbyStation) {
      toast({
        title: "נמצאה תחנה קרובה",
        description: nearbyStation.name,
      });
      
      // Auto-scroll to the station in the list
      setTimeout(() => {
        const stationElement = document.getElementById(`station-${nearbyStation.id}`);
        if (stationElement) {
          stationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      // If this is departure selection, select the nearby station
      if (type === 'departure') {
        onStationSelected(nearbyStation);
      }
    } else {
      toast({
        title: "לא נמצאה תחנה קרובה",
        description: "נסה לבחור תחנה מהרשימה",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
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
          <div className="w-full md:w-2/3">
            <Label htmlFor="search">חיפוש תחנה</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="הקלד שם תחנה"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus-ring"
              />
              {type === 'departure' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={findNearbyStation}
                  disabled={isLocating}
                  className="flex items-center gap-1"
                >
                  {isLocating ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>מאתר...</span>
                    </>
                  ) : (
                    <>
                      <Locate className="h-4 w-4" />
                      <span>תחנה קרובה</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="max-h-64 overflow-y-auto border rounded-md p-2">
          <ul className="space-y-2">
            {filteredStations.map((station) => (
              <li 
                key={station.id}
                id={`station-${station.id}`}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors hover:bg-primary/5 ${
                  selectedStation?.id === station.id ? 'bg-primary/10 border border-primary/30' : 
                  (nearbyStation?.id === station.id && type === 'departure') ? 'bg-blue-50 border border-blue-200' : 
                  'border'
                }`}
                onClick={() => handleStationClick(station)}
              >
                <div className="flex items-center gap-2">
                  {(nearbyStation?.id === station.id && type === 'departure') ? (
                    <MapPin className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Train className="h-4 w-4 text-primary" />
                  )}
                  <span>{station.name}</span>
                  
                  {(nearbyStation?.id === station.id && type === 'departure') && (
                    <span className="text-xs text-blue-600 ml-1">קרוב אליך</span>
                  )}
                </div>
                {selectedStation?.id === station.id && (
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
  );
};

export default StationSelection;
