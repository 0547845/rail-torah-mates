
import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Train } from 'lucide-react';

const NearbyStationAlert: React.FC = () => {
  const { nearbyStation, updateUserLocation, locationError, departureStation, setDepartureStation } = useUser();
  const { toast } = useToast();

  // Try to get location on component mount
  useEffect(() => {
    if (!departureStation) {
      updateUserLocation();
    }
  }, []);

  // If no nearby station or already selected as departure, don't show
  if (!nearbyStation || (departureStation && nearbyStation.id === departureStation.id)) {
    return null;
  }

  const handleUseNearbyStation = () => {
    setDepartureStation(nearbyStation);
    toast({
      title: 'תחנה עודכנה',
      description: `תחנת המוצא שלך עודכנה ל${nearbyStation.name}`,
    });
  };

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
      <AlertTitle className="mr-2 text-blue-700">זיהינו תחנה קרובה אליך</AlertTitle>
      <AlertDescription className="flex flex-col">
        <p>אתה נמצא בקרבת תחנת {nearbyStation.name}</p>
        <Button 
          variant="outline" 
          className="mt-2 self-start border-blue-300 hover:border-blue-500 text-blue-700"
          onClick={handleUseNearbyStation}
        >
          <Train className="mr-2 h-4 w-4" />
          <span>קבע כתחנת המוצא שלי</span>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default NearbyStationAlert;
