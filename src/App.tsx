import schedules from "@/data/schedules.json";
import { CruiseSection } from "./components/cruise-section";

const schedule = schedules.person.cruises;

function App() {
  const today = new Date();

  const upcomingCruises = schedule.filter(
    (cruise) => new Date(cruise.date_leaving) > today,
  );
  const archivedCruises = schedule.filter(
    (cruise) => new Date(cruise.date_leaving) <= today,
  );

  return (
    <main className="min-h-screen bg-[#003366] text-white py-8 px-4 font-playfair">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Karen Worrall Cruise Schedule
        </h1>

        {upcomingCruises.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">
              🚢 Upcoming Cruises
            </h2>
            <div className="flex flex-col gap-4">
              {upcomingCruises.map((cruise) => (
                <CruiseSection
                  key={`${cruise.id}-${cruise.date_joining}`}
                  cruise={cruise}
                />
              ))}
            </div>
          </div>
        )}

        {archivedCruises.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-300 mb-6">
              📚 Past Cruises
            </h2>
            <div className="flex flex-col gap-4">
              {archivedCruises.reverse().map((cruise) => (
                <CruiseSection
                  key={`${cruise.id}-${cruise.date_joining}`}
                  cruise={cruise}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
