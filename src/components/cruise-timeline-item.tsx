import { tv } from "tailwind-variants";

interface CruiseTimelineItemProps {
  cruise: {
    id: number;
    ship_name: string;
    date_joining: string;
    date_leaving: string;
  };
  status: "current" | "upcoming" | "past";
  variant?: "desktop" | "mobile";
  isLast?: boolean;
}

const timelineItemStyles = tv({
  slots: {
    container: "block group",
    wrapper: "flex items-start gap-3 rounded-lg p-2 transition-colors",
    dotContainer: "flex-shrink-0 mt-1",
    dot: "w-3 h-3 rounded-full border-2",
    line: "w-px h-8 ml-1.5 mt-1",
    content: "flex-1 min-w-0",
    title: "font-medium text-sm truncate transition-colors",
    dates: "text-xs space-y-0.5",
    statusIndicator: "text-xs mt-1"
  },
  variants: {
    variant: {
      desktop: {
        wrapper: "hover:bg-white/10",
        line: "bg-white/20",
        title: "text-white group-hover:text-primary",
        dates: "text-white/60"
      },
      mobile: {
        wrapper: "hover:bg-gray-100",
        line: "bg-gray-300",
        title: "text-gray-900 group-hover:text-primary",
        dates: "text-gray-500"
      }
    },
    status: {
      current: {
        dot: "bg-green-400 border-green-400",
        statusIndicator: "text-green-600"
      },
      upcoming: {
        dot: "bg-primary border-primary"
      },
      past: {
        dot: "bg-gray-400 border-gray-400"
      }
    }
  },
  defaultVariants: {
    variant: "desktop",
    status: "upcoming"
  }
});

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
};

export function CruiseTimelineItem({ 
  cruise, 
  status, 
  variant = "desktop", 
  isLast = false 
}: CruiseTimelineItemProps) {
  const styles = timelineItemStyles({ variant, status });
  const anchorId = status === "past" ? "past" : "upcoming";

  return (
    <a
      href={`#${anchorId}`}
      className={styles.container()}
    >
      <div className={styles.wrapper()}>
        <div className={styles.dotContainer()}>
          <div className={styles.dot()} />
          {!isLast && <div className={styles.line()} />}
        </div>
        
        <div className={styles.content()}>
          <div className={styles.title()}>
            {cruise.ship_name}
          </div>
          <div className={styles.dates()}>
            <div>Join: {formatDateShort(cruise.date_joining)}</div>
            <div>Leave: {formatDateShort(cruise.date_leaving)}</div>
          </div>
          {status === "current" && (
            <div className={styles.statusIndicator()}>● Ongoing</div>
          )}
        </div>
      </div>
    </a>
  );
}