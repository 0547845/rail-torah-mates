
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic } from '../data/topics';
import { Station } from '../data/stations';
import { stations } from '../data/stations';

interface User {
  id?: string;
  email?: string;
  nickname?: string;
  description?: string;
  isVerified?: boolean;
  googleId?: string;
  profilePicture?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedTopics: Topic[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
  departureStation: Station | null;
  setDepartureStation: React.Dispatch<React.SetStateAction<Station | null>>;
  arrivalStation: Station | null;
  setArrivalStation: React.Dispatch<React.SetStateAction<Station | null>>;
  departureTime: string | null;
  setDepartureTime: React.Dispatch<React.SetStateAction<string | null>>;
  availableTimes: string[];
  setAvailableTimes: React.Dispatch<React.SetStateAction<string[]>>;
  clearUserData: () => void;
  isAuthenticated: boolean;
  nearbyStation: Station | null;
  updateUserLocation: () => Promise<void>;
  locationError: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [departureStation, setDepartureStation] = useState<Station | null>(null);
  const [arrivalStation, setArrivalStation] = useState<Station | null>(null);
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nearbyStation, setNearbyStation] = useState<Station | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Try to get user location on initial load
    updateUserLocation();
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  // Function to find the nearest train station based on user's location
  const findNearestStation = (latitude: number, longitude: number): Station | null => {
    // Station coordinates (these would ideally be stored with the station data)
    // This is a simplified example using hard-coded coordinates for key stations
    const stationCoordinates: Record<string, {lat: number, lng: number}> = {
      'tel-aviv-savidor-center': {lat: 32.0830, lng: 34.7977},
      'jerusalem-yitzhak-navon': {lat: 31.7891, lng: 35.2038},
      'haifa-center': {lat: 32.8231, lng: 34.9969},
      'beer-sheva-center': {lat: 31.2433, lng: 34.7957},
      'netanya': {lat: 32.3286, lng: 34.8567},
      'ashdod-ad-halom': {lat: 31.7804, lng: 34.6588},
      'ashkelon': {lat: 31.6675, lng: 34.5946},
      'rishon-lezion-moshe-dayan': {lat: 31.9750, lng: 34.7571},
      'herzliya': {lat: 32.1605, lng: 34.8272},
      'bat-yam-yoseftal': {lat: 32.0137, lng: 34.7750},
    };
    
    let nearestStation: Station | null = null;
    let minDistance = Infinity;
    
    stations.forEach(station => {
      const coordinates = stationCoordinates[station.id];
      if (coordinates) {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          coordinates.lat, 
          coordinates.lng
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestStation = station;
        }
      }
    });
    
    // Only return if the station is within 10km
    return minDistance <= 10 ? nearestStation : null;
  };
  
  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  // Function to update user's location
  const updateUserLocation = async (): Promise<void> => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('הדפדפן שלך לא תומך באיתור מיקום');
      return;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Update user location
      setUser(prev => prev ? {
        ...prev,
        location: { latitude, longitude }
      } : null);
      
      // Find nearest station
      const nearest = findNearestStation(latitude, longitude);
      setNearbyStation(nearest);
      
      // If we found a nearby station and no departure station is set, suggest it
      if (nearest && !departureStation) {
        setDepartureStation(nearest);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('לא ניתן לאתר את המיקום שלך');
    }
  };

  const clearUserData = () => {
    setUser(null);
    setSelectedTopics([]);
    setDepartureStation(null);
    setArrivalStation(null);
    setDepartureTime(null);
    setAvailableTimes([]);
    setNearbyStation(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      selectedTopics,
      setSelectedTopics,
      departureStation,
      setDepartureStation,
      arrivalStation,
      setArrivalStation,
      departureTime,
      setDepartureTime,
      availableTimes,
      setAvailableTimes,
      clearUserData,
      isAuthenticated,
      nearbyStation,
      updateUserLocation,
      locationError
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
