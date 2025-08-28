import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CruiseTimelineProps {
  cruises: Array<{
    id: number;
    ship_name: string;
    date_joining: string;
    date_leaving: string;
  }>;
  className?: string;
  variant?: "desktop" | "mobile";
}

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

const getCruiseStatus = (cruise: any) => {
  const today = new Date();
  const joinDate = new Date(cruise.date_joining);
  const leaveDate = new Date(cruise.date_leaving);

  if (today >= joinDate && today <= leaveDate) {
    return "current";
  } else if (today > leaveDate) {
    return "past";
  } else {
    return "upcoming";
  }
};

export function CruiseTimeline({
  cruises,
  className = "",
  variant = "desktop",
}: CruiseTimelineProps) {
  const upcomingCruises = cruises
    .filter(
      (c) =>
        getCruiseStatus(c) === "upcoming" || getCruiseStatus(c) === "current",
    )
    .sort(
      (a, b) =>
        new Date(a.date_joining).getTime() - new Date(b.date_joining).getTime(),
    );

  const completedCruises = cruises
    .filter((c) => getCruiseStatus(c) === "past")
    .sort(
      (a, b) =>
        new Date(b.date_joining).getTime() - new Date(a.date_joining).getTime(),
    ); // Reverse order

  const upcomingCount = cruises.filter(
    (c) => getCruiseStatus(c) === "upcoming",
  ).length;
  const pastCount = cruises.filter((c) => getCruiseStatus(c) === "past").length;
  const currentCruise = cruises.find((c) => getCruiseStatus(c) === "current");

  const isDesktop = variant === "desktop";
  const containerClasses = isDesktop
    ? "bg-white/5 backdrop-blur-sm p-4 h-full flex flex-col"
    : "bg-transparent";
  const textClasses = isDesktop ? "text-white" : "text-gray-900";
  const subtextClasses = isDesktop ? "text-white/70" : "text-gray-600";

  const renderTimeline = (
    cruiseList: typeof cruises,
    tabType: "upcoming" | "completed",
  ) => {
    if (cruiseList.length === 0) {
      return (
        <div className={`text-center py-8 ${subtextClasses}`}>
          No {tabType} cruises
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {cruiseList.map((cruise, index) => {
          const status = getCruiseStatus(cruise);
          const anchorId = status === "past" ? "past" : "upcoming";

          return (
            <a
              key={`${cruise.id}-${cruise.date_joining}`}
              href={`#${anchorId}`}
              className="block group"
            >
              <div
                className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                  isDesktop ? "hover:bg-white/10" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      status === "current"
                        ? "bg-green-400 border-green-400"
                        : status === "upcoming"
                          ? "bg-primary border-primary"
                          : "bg-gray-400 border-gray-400"
                    }`}
                  />
                  {index < cruiseList.length - 1 && (
                    <div
                      className={`w-px h-8 ml-1.5 mt-1 ${
                        isDesktop ? "bg-white/20" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm truncate group-hover:text-primary transition-colors ${textClasses}`}
                  >
                    {cruise.ship_name}
                  </div>
                  <div
                    className={`text-xs space-y-0.5 ${
                      isDesktop ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    <div>Join: {formatDateShort(cruise.date_joining)}</div>
                    <div>Leave: {formatDateShort(cruise.date_leaving)}</div>
                  </div>
                  {status === "current" && (
                    <div className="text-xs text-green-600 mt-1">● Ongoing</div>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="mb-4">
        <h3
          className={`text-lg font-bold text-primary font-serif mb-2 ${textClasses}`}
        >
          Cruise Overview
        </h3>
        <div className={`text-sm space-y-1 ${subtextClasses}`}>
          {currentCruise && (
            <div className="text-green-600">Status: Currently cruising</div>
          )}
          <div>
            {upcomingCount} upcoming • {pastCount} completed
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full flex flex-col flex-1 min-h-0">
        <TabsList
          className={`grid w-full grid-cols-2 mb-4 ${
            isDesktop ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          <TabsTrigger
            value="upcoming"
            className={`${isDesktop ? "text-white data-[state=active]:bg-primary data-[state=active]:text-white" : ""}`}
          >
            🚢 Upcoming ({upcomingCruises.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className={`${isDesktop ? "text-white data-[state=active]:bg-primary data-[state=active]:text-white" : ""}`}
          >
            📚 Completed ({completedCruises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0 flex-1 overflow-y-auto min-h-0">
          {renderTimeline(upcomingCruises, "upcoming")}
        </TabsContent>

        <TabsContent value="completed" className="mt-0 flex-1 overflow-y-auto min-h-0">
          {renderTimeline(completedCruises, "completed")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

