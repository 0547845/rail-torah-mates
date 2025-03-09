
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

interface TimeSelectionProps {
  availableTimes: string[];
  selectedTime: string | null;
  onTimeSelected: (time: string) => void;
  isLoading: boolean;
  departureStation: { name: string } | null;
  arrivalStation: { name: string } | null;
  onSelectArrivalStation?: () => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  availableTimes,
  selectedTime,
  onTimeSelected,
  isLoading,
  departureStation,
  arrivalStation,
  onSelectArrivalStation
}) => {
  return (
    <Card className="w-full mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle>בחר שעת נסיעה</CardTitle>
        <CardDescription>
          {departureStation ? (
            arrivalStation ? 
              `זמני רכבת זמינים מ${departureStation.name} ל${arrivalStation.name}` :
              `נבחרה תחנת מוצא: ${departureStation.name}. אנא בחר תחנת יעד.`
          ) : (
            'יש לבחור תחנת מוצא תחילה'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <p className="text-gray-500">טוען לוח זמנים...</p>
          </div>
        ) : departureStation && !arrivalStation ? (
          <div className="py-4 text-center">
            <p className="text-gray-500 mb-4">יש לבחור תחנת יעד כדי לראות את לוח הזמנים</p>
            {onSelectArrivalStation && (
              <Button onClick={onSelectArrivalStation} className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white rounded-full">
                <span className="flex items-center gap-2">
                  בחר תחנת יעד
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            )}
          </div>
        ) : departureStation && arrivalStation && availableTimes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {availableTimes.map((trainTime) => (
              <div
                key={trainTime}
                onClick={() => onTimeSelected(trainTime)}
                className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-all hover:bg-primary/5 ${
                  selectedTime === trainTime ? 'bg-primary/10 border-primary/30 scale-105' : ''
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
            <p className="text-gray-500">יש לבחור תחנת מוצא לצפייה בלוח הזמנים</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSelection;
