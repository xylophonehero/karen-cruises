import { useState } from "react";
import schedules from "@/data/schedules.json";
import { CruiseSection } from "./components/cruise-section";
import { CruiseTimeline } from "./components/cruise-timeline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const schedule = schedules.person.cruises;

function App() {
  const today = new Date();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const upcomingCruises = schedule.filter(
    (cruise) => new Date(cruise.date_leaving) > today,
  );
  const archivedCruises = schedule.filter(
    (cruise) => new Date(cruise.date_leaving) <= today,
  );

  return (
    <main className="h-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 text-white font-sans bg-fixed flex gap-x-4">
      {/* Desktop Sidebar */}
      <aside className="w-[360px] hidden h-full lg:block">
        <CruiseTimeline cruises={schedule} />
      </aside>

      {/* Mobile Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button className="fixed bottom-6 right-6 z-50 md:hidden bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transition-all duration-200">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Cruise Overview</DrawerTitle>
            <DrawerDescription>
              Navigate to any cruise or section
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <CruiseTimeline cruises={schedule} variant="mobile" />

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                Quick Navigation
              </h4>
              <div className="space-y-2">
                <DrawerClose asChild>
                  <a
                    href="#upcoming"
                    className="w-full block text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium bg-gray-100 text-gray-900 hover:bg-gray-200"
                  >
                    🚢 Upcoming Cruises
                  </a>
                </DrawerClose>
                <DrawerClose asChild>
                  <a
                    href="#past"
                    className="w-full block text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium bg-gray-100 text-gray-900 hover:bg-gray-200"
                  >
                    📚 Past Cruises
                  </a>
                </DrawerClose>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="flex-1 overflow-auto h-full py-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center text-primary font-serif">
            Karen Worrall Cruise Schedule
          </h1>

          {upcomingCruises.length > 0 && (
            <div id="upcoming" className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-6">
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
            <div id="past">
              <h2 className="text-3xl font-bold text-primary mb-6 ">
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
      </div>
    </main>
  );
}

export default App;
