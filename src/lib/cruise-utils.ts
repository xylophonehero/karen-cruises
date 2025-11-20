import type { Cruise } from "@/types/cruise";
import { createUTCDate } from "./utils";

// Group back-to-back cruises (cruises where the end date of one is the start date of another)
export function groupBackToBackCruises(cruises: Cruise[]): Cruise[][] {
  // Sort cruises by departure date
  const sortedCruises = [...cruises].sort(
    (a, b) =>
      createUTCDate(a.departureDate).getTime() - createUTCDate(b.departureDate).getTime(),
  );

  const groups: Cruise[][] = [];
  let currentGroup: Cruise[] = [];

  sortedCruises.forEach((cruise, index) => {
    if (index === 0) {
      currentGroup.push(cruise);
    } else {
      const previousCruise = sortedCruises[index - 1];

      // Check if this cruise starts on the same day the previous one ends
      if (
        previousCruise.returnPort === cruise.departurePort &&
        previousCruise.returnDate === cruise.departureDate
      ) {
        currentGroup.push(cruise);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [cruise];
      }
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}
