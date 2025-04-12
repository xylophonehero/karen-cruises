import type { CruiseStop } from "@/types/cruise"

interface CruiseStopsProps {
  stops: CruiseStop[]
}

export function CruiseStops({ stops }: CruiseStopsProps) {
  return (
    <div className="mt-4 border-t pt-4 font-playfair">
      <h4 className="text-sm font-medium mb-2">Cruise Itinerary</h4>
      <ol className="space-y-2">
        {stops.map((stop, index) => (
          <li key={index} className="text-sm flex items-start">
            <div className="flex-shrink-0 w-16 font-medium">Day {stop.day}</div>
            <div>
              <div className="font-medium">{stop.port}</div>
              <div className="text-xs text-muted-foreground">
                {stop.arrivalTime && `Arrive: ${stop.arrivalTime}`}
                {stop.departureTime && stop.arrivalTime && " • "}
                {stop.departureTime && `Depart: ${stop.departureTime}`}
                {!stop.arrivalTime && !stop.departureTime && "At Sea"}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

