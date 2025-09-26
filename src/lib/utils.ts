import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateCruiseDuration(
  dateJoining: string,
  dateLeaving: string,
): number {
  const joinDate = new Date(dateJoining);
  const leaveDate = new Date(dateLeaving);
  const diffTime = Math.abs(leaveDate.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end days
}

export function generateCruiseId(
  shipName: string,
  dateJoining: string,
): string {
  // Convert ship name to kebab case and remove special characters
  const shipKebab = shipName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  // Format date as YYYY-MM-DD
  const date = new Date(dateJoining);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  return `cruise-${shipKebab}-${dateStr}`;
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

export function generateDailyItinerary(
  items: ItineraryItem[],
  cruiseStartDate: string,
  cruiseEndDate: string,
): ItineraryItem[] {
  const startDate = new Date(cruiseStartDate);
  const endDate = new Date(cruiseEndDate);

  // Generate array of all cruise days
  const cruiseDays: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    cruiseDays.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Map through each day and determine what happens that day
  return cruiseDays.map((dayString) => {
    // Check if there's a port that covers this day
    const portForDay = items.find((item) => {
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
        date_leaving: dayString,
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
        is_sea_day: true,
      };
    }
  });
}
