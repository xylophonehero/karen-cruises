import itineraries from "@/data/itineraries.json";
import schedules from "@/data/schedules.json";
import { ItineraryTable } from "./components/itinerary-table";

const ships = itineraries.ships;
const schedule = schedules.person.cruises;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function App() {
  return (
    <main className="min-h-screen bg-[#003366] text-white py-8 px-4 font-playfair">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Karen Worrall Upcoming Cruises
        </h1>
        <div className="flex flex-col gap-4">
          {schedule.map((ship) => (
            <div className="flex flex-col gap-2" key={ship.id}>
              <h2 className="text-xl font-bold text-primary">{ship.ship_name}</h2>
              <div>
                <span>{formatDate(ship.date_joining)}</span>
                {" - "}
                <span>{formatDate(ship.date_leaving)}</span>
              </div>
              <div>
                <ItineraryTable
                  items={
                    ships
                      .find((s) => ship.ship_name === s.name)
                      ?.itinerary.filter(
                        (itinerary) =>
                          new Date(itinerary.date_arriving) >=
                            new Date(ship.date_joining) &&
                          new Date(itinerary.date_leaving) <=
                            new Date(ship.date_leaving),
                      ) ?? []
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
