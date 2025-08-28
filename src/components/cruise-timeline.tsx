import { tv } from "tailwind-variants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CruiseTimelineItem } from "./cruise-timeline-item";

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

const timelineStyles = tv({
  slots: {
    container: "",
    header: "mb-4",
    title: "text-lg font-bold text-primary font-serif mb-2",
    stats: "text-sm space-y-1",
    currentStatus: "text-green-600",
    tabsList: "grid w-full grid-cols-2 mb-4",
    tabTrigger: "",
    tabContent: "mt-0 flex-1 overflow-y-auto min-h-0",
    emptyState: "text-center py-8",
    timelineList: "space-y-3"
  },
  variants: {
    variant: {
      desktop: {
        container: "bg-white/5 backdrop-blur-sm p-4 h-full flex flex-col rounded-lg",
        title: "text-white",
        stats: "text-white/70",
        tabsList: "bg-white/10",
        tabTrigger: "text-white data-[state=active]:bg-primary data-[state=active]:text-white",
        emptyState: "text-white/70"
      },
      mobile: {
        container: "bg-transparent",
        title: "text-gray-900",
        stats: "text-gray-600",
        tabsList: "bg-gray-100",
        tabTrigger: "",
        emptyState: "text-gray-600"
      }
    }
  },
  defaultVariants: {
    variant: "desktop"
  }
});

const getCruiseStatus = (cruise: any): "current" | "upcoming" | "past" => {
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
  const styles = timelineStyles({ variant });

  const upcomingCruises = cruises
    .filter(c => {
      const status = getCruiseStatus(c);
      return status === "upcoming" || status === "current";
    })
    .sort((a, b) => 
      new Date(a.date_joining).getTime() - new Date(b.date_joining).getTime()
    );

  const completedCruises = cruises
    .filter(c => getCruiseStatus(c) === "past")
    .sort((a, b) => 
      new Date(b.date_joining).getTime() - new Date(a.date_joining).getTime()
    );

  const upcomingCount = cruises.filter(c => getCruiseStatus(c) === "upcoming").length;
  const pastCount = cruises.filter(c => getCruiseStatus(c) === "past").length;
  const currentCruise = cruises.find(c => getCruiseStatus(c) === "current");

  return (
    <div className={`${styles.container()} ${className}`}>
      <div className={styles.header()}>
        <h3 className={styles.title()}>
          Cruise Overview
        </h3>
        <div className={styles.stats()}>
          {currentCruise && (
            <div className={styles.currentStatus()}>Status: Currently cruising</div>
          )}
          <div>{upcomingCount} upcoming • {pastCount} completed</div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full flex flex-col flex-1 min-h-0">
        <TabsList className={styles.tabsList()}>
          <TabsTrigger
            value="upcoming"
            className={styles.tabTrigger()}
          >
            🚢 Upcoming ({upcomingCruises.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className={styles.tabTrigger()}
          >
            📚 Completed ({completedCruises.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className={styles.tabContent()}>
          <CruiseTimelineList cruises={upcomingCruises} variant={variant} emptyMessage="No upcoming cruises" />
        </TabsContent>

        <TabsContent value="completed" className={styles.tabContent()}>
          <CruiseTimelineList cruises={completedCruises} variant={variant} emptyMessage="No completed cruises" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CruiseTimelineListProps {
  cruises: Array<{
    id: number;
    ship_name: string;
    date_joining: string;
    date_leaving: string;
  }>;
  variant: "desktop" | "mobile";
  emptyMessage: string;
}

function CruiseTimelineList({ cruises, variant, emptyMessage }: CruiseTimelineListProps) {
  const styles = timelineStyles({ variant });
  
  if (cruises.length === 0) {
    return (
      <div className={styles.emptyState()}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={styles.timelineList()}>
      {cruises.map((cruise, index) => (
        <CruiseTimelineItem
          key={`${cruise.id}-${cruise.date_joining}`}
          cruise={cruise}
          status={getCruiseStatus(cruise)}
          variant={variant}
          isLast={index === cruises.length - 1}
        />
      ))}
    </div>
  );
}