import { tv } from "tailwind-variants";
import { formatDate, generateCruiseId } from "@/lib/utils";

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
  onItemClick?: () => void;
}

const timelineItemStyles = tv({
  slots: {
    container: "block group relative",
    wrapper:
      "flex items-start gap-3 rounded-lg p-2 transition-colors relative z-10",
    dotContainer: "shrink-0 relative flex items-center justify-center w-6 h-6",
    dot: "w-3 h-3 rounded-full border-2 relative z-20",
    line: "absolute left-3 top-6 w-px bottom-0 transform -translate-x-1/2",
    content: "flex-1 min-w-0",
    title: "font-medium text-sm truncate transition-colors",
    dates: "text-xs space-y-0.5",
    statusIndicator: "text-xs mt-1",
  },
  variants: {
    variant: {
      desktop: {
        wrapper: "hover:bg-white/10",
        line: "bg-white/20",
        title: "text-white group-hover:text-primary",
        dates: "text-white/60",
      },
      mobile: {
        wrapper: "hover:bg-gray-100",
        line: "bg-gray-300",
        title: "text-gray-900 group-hover:text-primary",
        dates: "text-gray-500",
      },
    },
    status: {
      current: {
        dot: "bg-green-400 border-green-400",
        statusIndicator: "text-green-600",
      },
      upcoming: {
        dot: "bg-primary border-primary",
      },
      past: {
        dot: "bg-gray-400 border-gray-400",
      },
    },
    isLast: {
      true: {
        line: "hidden",
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: "desktop",
    status: "upcoming",
    isLast: false,
  },
});

export function CruiseTimelineItem({
  cruise,
  status,
  variant = "desktop",
  isLast = false,
  onItemClick,
}: CruiseTimelineItemProps) {
  const styles = timelineItemStyles({ variant, status, isLast });
  const cruiseId = generateCruiseId(cruise.ship_name, cruise.date_joining);

  return (
    <a 
      href={`#${cruiseId}`} 
      className={styles.container()}
      onClick={onItemClick}
    >
      <div className={styles.wrapper()}>
        <div className={styles.dotContainer()}>
          <div className={styles.dot()} />
          <div className={styles.line()} />
        </div>

        <div className={styles.content()}>
          <div className={styles.title()}>{cruise.ship_name}</div>
          <div className={styles.dates()}>
            <div>Join: {formatDate(cruise.date_joining)}</div>
            <div>Leave: {formatDate(cruise.date_leaving)}</div>
          </div>
          {status === "current" && (
            <div className={styles.statusIndicator()}>● Ongoing</div>
          )}
        </div>
      </div>
    </a>
  );
}
