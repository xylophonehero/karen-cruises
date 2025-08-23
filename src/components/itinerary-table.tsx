import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const dayDifference = (date1: string, date2: string) => {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);
  return Math.round(
    (date2Obj.getTime() - date1Obj.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export function ItineraryTable({ items }: { items: ItineraryItem[] }) {
  if (items.length === 0) return null;
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
        {items.map((item, index) => {
          const dayDiff = dayDifference(item.date_arriving, item.date_leaving);
          return (
            <TableRow
              className={
                item.new_cruise && index !== items.length - 1
                  ? "bg-chart-2"
                  : ""
              }
              key={index}
            >
              <TableCell>{formatDateShort(item.date_arriving)}</TableCell>
              <TableCell>
                {item.port_name}
              </TableCell>
              <TableCell>{item.country}</TableCell>
              <TableCell>{!item.is_sea_day && index !== 0 && item.date_arriving_time}</TableCell>
              <TableCell>
                {!item.is_sea_day && index !== items.length - 1 && item.date_leaving_time}
                {' '}
                {dayDiff > 0 && `(+${dayDiff})`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
