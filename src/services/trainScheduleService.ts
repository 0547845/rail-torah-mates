
import { Station } from '../data/stations';

interface TrainSchedule {
  id: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string; // format: HH:MM
  arrivalTime: string; // format: HH:MM
  date: string; // format: YYYY-MM-DD
  trainNumber: string;
}

// This is a mock service that simulates fetching train schedules
// In a production app, this would make actual API calls to train service providers
export const trainScheduleService = {
  // Get available train times between two stations for today
  getAvailableTrainTimes: async (
    departureStation: Station, 
    arrivalStation: Station, 
    date: Date = new Date()
  ): Promise<string[]> => {
    console.log(`Fetching train times from ${departureStation.name} to ${arrivalStation.name}`);
    
    // In a real implementation, this would make API calls to Israel Railways, Moovit, or Google Maps
    // For now, we'll simulate a response with mock data
    
    // Return mock train departure times
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Generate some realistic train times based on the time of day
        const times = [];
        const startHour = 6; // First train at 6 AM
        const endHour = 23; // Last train at 11 PM
        
        // Add train times every ~30-60 minutes, with some variation
        for (let hour = startHour; hour <= endHour; hour++) {
          // Morning rush (more frequent)
          if (hour >= 6 && hour <= 9) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            times.push(`${hour.toString().padStart(2, '0')}:30`);
            if (hour !== 9) {
              times.push(`${hour.toString().padStart(2, '0')}:15`);
              times.push(`${hour.toString().padStart(2, '0')}:45`);
            }
          }
          // Evening rush (more frequent)
          else if (hour >= 16 && hour <= 19) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            times.push(`${hour.toString().padStart(2, '0')}:30`);
            if (hour !== 19) {
              times.push(`${hour.toString().padStart(2, '0')}:15`);
              times.push(`${hour.toString().padStart(2, '0')}:45`);
            }
          }
          // Regular hours (less frequent)
          else {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour % 2 === 0) {
              times.push(`${hour.toString().padStart(2, '0')}:30`);
            }
          }
        }
        
        resolve(times.sort());
      }, 1000);
    });
  },
  
  // This would fetch full schedule details in a real implementation
  getTrainSchedule: async (
    departureStation: Station,
    arrivalStation: Station,
    departureTime: string,
    date: Date = new Date()
  ): Promise<TrainSchedule | null> => {
    console.log(`Fetching train schedule for ${departureTime} from ${departureStation.name} to ${arrivalStation.name}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate a realistic arrival time (5-120 minutes later depending on distance)
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        
        // Simplified distance calculation based on regions
        let travelMinutes = 30; // Default travel time
        
        if (departureStation.region !== arrivalStation.region) {
          // Different regions - longer travel time
          travelMinutes = 60;
          
          // Special case for Jerusalem which is further
          if (departureStation.region === 'jerusalem' || arrivalStation.region === 'jerusalem') {
            travelMinutes = 90;
          }
        } else {
          // Same region - shorter travel time
          travelMinutes = 20;
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
        
        // Generate random train number
        const trainNumber = Math.floor(100 + Math.random() * 900).toString();
        
        resolve({
          id: `train_${Date.now()}`,
          departureStationId: departureStation.id,
          arrivalStationId: arrivalStation.id,
          departureTime,
          arrivalTime,
          date: formattedDate,
          trainNumber
        });
      }, 800);
    });
  }
};
