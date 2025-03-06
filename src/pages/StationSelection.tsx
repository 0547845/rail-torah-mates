
import React, { useState } from 'react';
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
import { CheckCircle2, Train } from 'lucide-react';

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
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const title = type === 'departure' ? 'בחר את תחנת המוצא שלך' : 'בחר את תחנת היעד שלך';
  const description = type === 'departure' 
    ? 'התחנה ממנה אתה מתחיל את נסיעתך ברכבת' 
    : 'התחנה אליה אתה מסיים את נסיעתך ברכבת';
  
  const filteredStations = stations.filter((station) => {
    const matchesRegion = selectedRegion === 'all' || station.region === selectedRegion;
    const matchesSearch = station.name.includes(searchTerm);
    return matchesRegion && matchesSearch;
  });
  
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
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
                  selectedStation?.id === station.id ? 'bg-primary/10 border border-primary/30' : 'border'
                }`}
                onClick={() => handleStationClick(station)}
              >
                <div className="flex items-center gap-2">
                  <Train className="h-4 w-4 text-primary" />
                  <span>{station.name}</span>
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
