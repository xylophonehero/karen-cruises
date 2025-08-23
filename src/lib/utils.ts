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

export function addSeaDays(items: ItineraryItem[], cruiseStartDate: string, cruiseEndDate: string): ItineraryItem[] {
  if (items.length === 0) return [];
  
  const result: ItineraryItem[] = [];
  const startDate = new Date(cruiseStartDate);
  const endDate = new Date(cruiseEndDate);
  
  // Sort items by date to ensure correct order
  const sortedItems = [...items].sort((a, b) => 
    new Date(a.date_arriving).getTime() - new Date(b.date_arriving).getTime()
  );
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const currentDateString = currentDate.toISOString().split('T')[0];
    
    // Find the port item that covers this date
    const portDay = sortedItems.find(item => {
      const arriveDate = new Date(item.date_arriving);
      const leaveDate = new Date(item.date_leaving);
      const currentDateObj = new Date(currentDateString);
      return currentDateObj >= arriveDate && currentDateObj <= leaveDate;
    });
    
    if (portDay) {
      // Create a modified version with the current date for multi-day stays
      result.push({
        ...portDay,
        date_arriving: currentDateString,
        date_leaving: currentDateString
      });
    } else {
      // Add sea day
      result.push({
        date_arriving: currentDateString,
        date_leaving: currentDateString,
        country: "",
        port_name: "Sea Day",
        date_arriving_time: null,
        date_leaving_time: null,
        new_cruise: false,
        is_sea_day: true
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

