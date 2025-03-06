
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic } from '../data/topics';
import { Station } from '../data/stations';

interface User {
  id?: string;
  email?: string;
  nickname?: string;
  description?: string;
  isVerified?: boolean;
  googleId?: string;
  profilePicture?: string;
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

  const clearUserData = () => {
    setUser(null);
    setSelectedTopics([]);
    setDepartureStation(null);
    setArrivalStation(null);
    setDepartureTime(null);
    setAvailableTimes([]);
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
      isAuthenticated
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
