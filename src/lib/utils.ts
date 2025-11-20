import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a Date object from a date string (YYYY-MM-DD) using UTC timezone.
 * This ensures consistent date handling regardless of the user's local timezone.
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Date object set to UTC midnight
 */
export function createUTCDate(dateString: string): Date {
  // Parse the date string and create a UTC date
  // dateString format: "YYYY-MM-DD"
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Gets today's date in UTC timezone (midnight UTC).
 * This ensures consistent date comparisons regardless of the user's local timezone.
 * @returns Date object representing today at UTC midnight
 */
export function getTodayUTC(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function formatDate(dateString: string): string {
  const date = createUTCDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function calculateCruiseDuration(
  dateJoining: string,
  dateLeaving: string,
): number {
  const joinDate = createUTCDate(dateJoining);
  const leaveDate = createUTCDate(dateLeaving);
  const diffTime = Math.abs(leaveDate.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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

  // Format date as YYYY-MM-DD (using UTC to ensure consistency)
  const date = createUTCDate(dateJoining);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
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
  const startDate = createUTCDate(cruiseStartDate);
  const endDate = createUTCDate(cruiseEndDate);

  // Generate array of all cruise days
  const cruiseDays: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    cruiseDays.push(currentDate.toISOString().split("T")[0]);
    // Increment date in UTC
    currentDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate() + 1,
      ),
    );
  }

  // Map through each day and determine what happens that day
  return cruiseDays.map((dayString) => {
    // Check if there's a port that covers this day
    const portForDay = items.find((item) => {
      const arriveDate = createUTCDate(item.date_arriving);
      const leaveDate = createUTCDate(item.date_leaving);
      const currentDay = createUTCDate(dayString);
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
