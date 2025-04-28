
import { Station } from '../data/stations';
import axios from 'axios';

interface TrainSchedule {
  id: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string; // format: HH:MM
  arrivalTime: string; // format: HH:MM
  date: string; // format: YYYY-MM-DD
  trainNumber: string;
  platform?: string;
  isDelayed?: boolean;
  delayMinutes?: number;
}

// This service provides train schedule data
// In a production environment, this would connect to Israel Railways API
export const trainScheduleService = {
  // Get available train times between two stations
  getAvailableTrainTimes: async (
    departureStation: Station, 
    arrivalStation: Station, 
    date: Date = new Date()
  ): Promise<string[]> => {
    console.log(`Fetching train times from ${departureStation.name} to ${arrivalStation.name}`);
    
    try {
      // In a production environment, this would call Israel Railways API
      // For now, simulate a response with realistic mock data

      // Optional - future implementation with actual API:
      // const response = await axios.get('https://www.rail.co.il/apiinfo/api/v1/timetable', {
      //   params: {
      //     fromStation: departureStation.id,
      //     toStation: arrivalStation.id,
      //     date: date.toISOString().split('T')[0],
      //   }
      // });
      // return response.data.departures.map((dep: any) => dep.departureTime);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate realistic train times based on time of day and regions
      const times = [];
      const startHour = 5; // First train at 5 AM
      const endHour = 23; // Last train at 11 PM
      
      // Add train times with patterns similar to real Israel Railways schedule
      for (let hour = startHour; hour <= endHour; hour++) {
        // High frequency during rush hours (more frequent)
        if ((hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 19)) {
          // Every 20-30 minutes during rush hour
          times.push(`${hour.toString().padStart(2, '0')}:00`);
          times.push(`${hour.toString().padStart(2, '0')}:20`);
          times.push(`${hour.toString().padStart(2, '0')}:40`);
        }
        // Regular daytime service
        else if (hour >= 10 && hour <= 15) {
          // Every 30 minutes during regular daytime
          times.push(`${hour.toString().padStart(2, '0')}:00`);
          times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        // Evening and early morning (less frequent)
        else {
          // Every hour during evening and early morning
          times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      }

      // Add some realistic variation for distant/rural lines
      if (departureStation.region !== arrivalStation.region) {
        // Between regions, less frequent service
        return times.filter((_, index) => index % 2 === 0).sort();
      }

      // Jerusalem line special case - fewer trains
      if (departureStation.region === 'jerusalem' || arrivalStation.region === 'jerusalem') {
        return times.filter((_, index) => index % 3 === 0).sort();
      }
      
      return times.sort();
    } catch (error) {
      console.error("Error fetching train times:", error);
      throw new Error("שגיאה בטעינת לוח הזמנים");
    }
  },
  
  // Get detailed schedule for a specific train
  getTrainSchedule: async (
    departureStation: Station,
    arrivalStation: Station,
    departureTime: string,
    date: Date = new Date()
  ): Promise<TrainSchedule | null> => {
    console.log(`Fetching train schedule for ${departureTime} from ${departureStation.name} to ${arrivalStation.name}`);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Calculate a realistic arrival time based on distance between stations
      const [depHours, depMinutes] = departureTime.split(':').map(Number);
      
      // Calculate travel time based on regions and station distance
      let travelMinutes = 30; // Default travel time
      
      if (departureStation.region !== arrivalStation.region) {
        // Different regions - longer travel time
        travelMinutes = 60;
        
        // Special case for Jerusalem which is further
        if (departureStation.region === 'jerusalem' || arrivalStation.region === 'jerusalem') {
          travelMinutes = 90;
        }
        
        // North to South (or vice versa) is longer
        if ((departureStation.region === 'north' && arrivalStation.region === 'south') || 
            (departureStation.region === 'south' && arrivalStation.region === 'north')) {
          travelMinutes = 120;
        }
      } else {
        // Same region - shorter travel time
        if (departureStation.region === 'center') {
          travelMinutes = 15; // Center area has shorter travels
        } else {
          travelMinutes = 25; // Other regions slightly longer
        }
      }
      
      // Calculate arrival time
      const arrivalDate = new Date();
      arrivalDate.setHours(depHours);
      arrivalDate.setMinutes(depMinutes + travelMinutes);
      
      const arrivalHours = arrivalDate.getHours().toString().padStart(2, '0');
      const arrivalMinutes = arrivalDate.getMinutes().toString().padStart(2, '0');
      const arrivalTime = `${arrivalHours}:${arrivalMinutes}`;
      
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      
      // Generate realistic train data
      const trainNumber = Math.floor(100 + Math.random() * 900).toString();
      const platform = Math.floor(1 + Math.random() * 10).toString();
      
      // Occasionally add delays for realism
      const isDelayed = Math.random() < 0.2; // 20% chance of delay
      const delayMinutes = isDelayed ? Math.floor(5 + Math.random() * 20) : 0;
      
      return {
        id: `train_${trainNumber}_${formattedDate.replace(/-/g, '')}_${departureTime.replace(':', '')}`,
        departureStationId: departureStation.id,
        arrivalStationId: arrivalStation.id,
        departureTime,
        arrivalTime,
        date: formattedDate,
        trainNumber,
        platform,
        isDelayed,
        delayMinutes
      };
    } catch (error) {
      console.error("Error fetching train schedule:", error);
      throw new Error("שגיאה בטעינת פרטי הרכבת");
    }
  },
  
  // Get alternative connections for a specific route
  getAlternativeConnections: async (
    departureStation: Station,
    arrivalStation: Station,
    preferredTime: string,
    date: Date = new Date()
  ): Promise<string[]> => {
    // Get all available times
    const allTimes = await trainScheduleService.getAvailableTrainTimes(
      departureStation,
      arrivalStation,
      date
    );
    
    // Find index of preferred time
    const timeIndex = allTimes.findIndex(time => time === preferredTime);
    
    // Return times around the preferred time (2 before and 2 after)
    if (timeIndex === -1) {
      // If preferred time not found, return the next 4 available times
      return allTimes.slice(0, 4);
    }
    
    const start = Math.max(0, timeIndex - 2);
    const end = Math.min(allTimes.length, timeIndex + 3);
    
    return allTimes.slice(start, end);
  }
};

