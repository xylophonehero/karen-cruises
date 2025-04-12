import { useState } from "react";
import { CruiseCard } from "./cruise-card";
import type { Cruise } from "@/types/cruise";
import { groupBackToBackCruises } from "@/lib/cruise-utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface CruiseScheduleWidgetProps {
  cruises: Cruise[];
}

export function CruiseScheduleWidget({ cruises }: CruiseScheduleWidgetProps) {
  const [filter, setFilter] = useState<string>("all");
  const groupedCruises = groupBackToBackCruises(cruises);

  return (
    <div className="space-y-6 bg-white/10 p-6 rounded-xl backdrop-blur-sm font-playfair">
      <div className="flex justify-end mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="border rounded-md px-3 py-2 text-sm font-playfair">
            <SelectValue placeholder="Select a cruise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cruises</SelectItem>
            <SelectItem value="caribbean">Caribbean</SelectItem>
            <SelectItem value="mediterranean">Mediterranean</SelectItem>
            <SelectItem value="alaska">Alaska</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-8">
        {groupedCruises.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`${group.length > 1 ? "border-l-4 border-primary pl-4" : ""}`}
          >
            {group.length > 1 && (
              <div className="mb-2 text-sm font-medium text-primary">
                Back-to-back cruise package ({group.length} cruises)
              </div>
            )}
            <div className="space-y-2">
              {group.map((cruise, index) => (
                <CruiseCard
                  key={cruise.id}
                  cruise={cruise}
                  isConnected={index < group.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
