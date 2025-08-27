import { useState } from "react";
import schedules from "@/data/schedules.json";
import { CruiseSection } from "./components/cruise-section";
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 text-white py-8 px-4 font-sans bg-fixed">
      {/* Sticky Navigation - Desktop */}
      <nav className="fixed top-4 right-4 z-50 hidden md:block">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex gap-1">
          <a
            href="#upcoming"
            className="px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm text-white/70 hover:text-white hover:bg-white/10"
          >
            🚢 Upcoming
          </a>
          <a
            href="#past"
            className="px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm text-white/70 hover:text-white hover:bg-white/10"
          >
            📚 Past
          </a>
        </div>
      </nav>

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
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigate</DrawerTitle>
            <DrawerDescription>Jump to a section</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-2">
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
        </DrawerContent>
      </Drawer>

      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center text-primary">
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
    </main>
  );
}

export default App;
