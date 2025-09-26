import { formatDate, generateCruiseId, calculateCruiseDuration } from "@/lib/utils";
import itineraries from "@/data/itineraries.json";
import { ItineraryTable } from "./itinerary-table";
import { CruiseSchedule } from "@/types/schedule";

const ships = itineraries.ships;

interface CruiseSectionProps {
  cruise: CruiseSchedule;
}

export function CruiseSection({ cruise }: CruiseSectionProps) {
  const cruiseId = generateCruiseId(cruise.ship_name, cruise.date_joining);
  const duration = calculateCruiseDuration(cruise.date_joining, cruise.date_leaving);

  return (
    <div className="flex flex-col relative" id={cruiseId}>
      <div className="sticky -top-8 flex flex-col bg-blue-900 z-1 pt-4 pb-2">
        <h2 className="text-xl font-bold text-primary">
          {cruise.ship_name}
          {cruise.tags.length > 0 && `: ${cruise.tags.join(' | ')}`}
        </h2>
        <div className="text-sm text-white/80">
          <span>{formatDate(cruise.date_joining)}</span>
          {" - "}
          <span>{formatDate(cruise.date_leaving)}</span>
          <span className="ml-2">({duration} days)</span>
        </div>
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
          cruiseStartDate={cruise.date_joining}
          cruiseEndDate={cruise.date_leaving}
        />
      </div>
    </div>
  );
}
