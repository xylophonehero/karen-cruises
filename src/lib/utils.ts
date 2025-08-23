import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

interface ItineraryItem {
  date_arriving: string;
  date_leaving: string;
  country: string;
  port_name: string;
  date_arriving_time: string | null;
  date_leaving_time: string | null;
  new_cruise: boolean;
  is_sea_day?: boolean;
}

export function generateDailyItinerary(items: ItineraryItem[], cruiseStartDate: string, cruiseEndDate: string): ItineraryItem[] {
  const startDate = new Date(cruiseStartDate);
  const endDate = new Date(cruiseEndDate);
  
  // Generate array of all cruise days
  const cruiseDays: string[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    cruiseDays.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Map through each day and determine what happens that day
  return cruiseDays.map(dayString => {
    // Check if there's a port that covers this day
    const portForDay = items.find(item => {
      const arriveDate = new Date(item.date_arriving);
      const leaveDate = new Date(item.date_leaving);
      const currentDay = new Date(dayString);
      return currentDay >= arriveDate && currentDay <= leaveDate;
    });
    
    if (portForDay) {
      // Return port entry for this day
      return {
        ...portForDay,
        date_arriving: dayString,
        date_leaving: dayString
      };
    } else {
      // Return sea day
      return {
        date_arriving: dayString,
        date_leaving: dayString,
        country: "",
        port_name: "Sea Day",
        date_arriving_time: null,
        date_leaving_time: null,
        new_cruise: false,
        is_sea_day: true
      };
    }
  });
}

