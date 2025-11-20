import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createUTCDate } from "@/lib/utils";

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

const formatDateShort = (dateString: string) => {
  const date = createUTCDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

const dayDifference = (date1: string, date2: string) => {
  const date1Obj = createUTCDate(date1);
  const date2Obj = createUTCDate(date2);
  return Math.round(
    (date2Obj.getTime() - date1Obj.getTime()) / (1000 * 60 * 60 * 24),
  );
};

interface ItineraryTableProps {
  items: ItineraryItem[];
  cruiseStartDate: string;
  cruiseEndDate: string;
}

export function ItineraryTable({
  items,
  cruiseStartDate,
  cruiseEndDate,
}: ItineraryTableProps) {
  // Generate array of all cruise days
  const cruiseDays: string[] = [];
  let currentDate = createUTCDate(cruiseStartDate);
  const endDate = createUTCDate(cruiseEndDate);

  while (currentDate <= endDate) {
    cruiseDays.push(currentDate.toISOString().split("T")[0]);
    // Increment date in UTC
    currentDate = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() + 1
    ));
  }

  if (cruiseDays.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow className="[&>th]:text-primary">
          <TableHead>Date</TableHead>
          <TableHead>Port</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Arrival Time</TableHead>
          <TableHead>Departure Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cruiseDays.map((dayString, index) => {
          // Find the port that covers this day, prioritizing items that start on this day
          const portForDay =
            items.find((item) => item.date_arriving === dayString) ||
            items.find((item) => {
              const arriveDate = createUTCDate(item.date_arriving);
              const leaveDate = createUTCDate(item.date_leaving);
              const currentDay = createUTCDate(dayString);
              return currentDay >= arriveDate && currentDay <= leaveDate;
            });

          const dayEntry = portForDay
            ? {
                ...portForDay,
                date_arriving: dayString,
                date_leaving: dayString,
              }
            : {
                date_arriving: dayString,
                date_leaving: dayString,
                country: "",
                port_name: "Sea Day",
                date_arriving_time: null,
                date_leaving_time: null,
                new_cruise: false,
                is_sea_day: true,
              };

          // Determine if this is the first or last day of a multi-day port stay
          const isFirstDayOfStay = portForDay
            ? dayString === portForDay.date_arriving
            : false;
          const isLastDayOfStay = portForDay
            ? dayString === portForDay.date_leaving
            : false;

          // Check if there's a conflict (another item starting on the next day)
          const hasConflictNextDay =
            portForDay &&
            !isLastDayOfStay &&
            items.some((item) => {
              const currentDay = createUTCDate(dayString);
              const nextDay = new Date(Date.UTC(
                currentDay.getUTCFullYear(),
                currentDay.getUTCMonth(),
                currentDay.getUTCDate() + 1
              ));
              return item.date_arriving === nextDay.toISOString().split("T")[0];
            });

          const dayDiff = dayDifference(
            dayEntry.date_arriving,
            dayEntry.date_leaving,
          );

          return (
            <TableRow
              className={
                dayEntry.new_cruise &&
                isFirstDayOfStay &&
                index !== cruiseDays.length - 1
                  ? "bg-primary/60"
                  : ""
              }
              key={dayString}
            >
              <TableCell>{formatDateShort(dayEntry.date_arriving)}</TableCell>
              <TableCell>{dayEntry.port_name}</TableCell>
              <TableCell>{dayEntry.country}</TableCell>
              <TableCell>
                {!dayEntry.is_sea_day &&
                  (isFirstDayOfStay || index === 0) &&
                  dayEntry.date_arriving_time}
              </TableCell>
              <TableCell>
                {!dayEntry.is_sea_day &&
                  (isLastDayOfStay || hasConflictNextDay) &&
                  dayEntry.date_leaving_time}{" "}
                {dayDiff > 0 && `(+${dayDiff})`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
