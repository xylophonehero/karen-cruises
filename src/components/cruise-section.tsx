import { formatDate } from "@/lib/utils";
import itineraries from "@/data/itineraries.json";
import { ItineraryTable } from "./itinerary-table";

const ships = itineraries.ships;
interface CruiseSectionProps {
  cruise: {
    id: number;
    ship_name: string;
    date_joining: string;
    date_leaving: string;
  };
}

export function CruiseSection({ cruise }: CruiseSectionProps) {
  return (
    <div
      className="flex flex-col gap-2"
      key={`${cruise.id}-${cruise.date_joining}`}
    >
      <h2 className="text-xl font-bold text-primary">{cruise.ship_name}</h2>
      <div>
        <span>{formatDate(cruise.date_joining)}</span>
        {" - "}
        <span>{formatDate(cruise.date_leaving)}</span>
      </div>
      <div>
        <ItineraryTable
          items={
            ships
              .find((s) => cruise.ship_name === s.name)
              ?.itinerary.filter(
                (itinerary) =>
                  new Date(itinerary.date_arriving) >=
                    new Date(cruise.date_joining) &&
                  new Date(itinerary.date_leaving) <=
                    new Date(cruise.date_leaving),
              ) ?? []
          }
        />
      </div>
    </div>
  );
}

