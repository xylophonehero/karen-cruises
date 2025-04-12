import { useState } from "react"
import { ChevronDown, ChevronUp, Anchor, Calendar, Ship } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CruiseStops } from "./cruise-stops"
import type { Cruise } from "@/types/cruise"
import { formatDate } from "@/lib/utils"

interface CruiseCardProps {
  cruise: Cruise
  isConnected?: boolean
}

export function CruiseCard({ cruise, isConnected = false }: CruiseCardProps) {
  const [showStops, setShowStops] = useState(false)

  return (
    <div className="relative">
      {isConnected && (
        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-0.5 h-4 bg-primary z-10"></div>
      )}
      <Card className="overflow-hidden font-playfair">
        <CardContent className="p-0">
          <div className="bg-primary/10 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg font-playfair">{cruise.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Ship className="h-4 w-4 mr-1" />
                  <span>{cruise.shipName}</span>
                </div>
              </div>
              <Badge
                variant={
                  cruise.region === "Caribbean"
                    ? "default"
                    : cruise.region === "Mediterranean"
                      ? "secondary"
                      : "outline"
                }
              >
                {cruise.region}
              </Badge>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center mb-4">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(cruise.departureDate)} - {formatDate(cruise.returnDate)} ({cruise.duration} days)
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Anchor className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">{cruise.departurePort}</span>
              </div>
              <div className="text-sm text-muted-foreground">to</div>
              <div className="flex items-center">
                <span className="text-sm font-medium">{cruise.returnPort}</span>
                <Anchor className="h-4 w-4 ml-2 text-muted-foreground" />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-between font-playfair"
              onClick={() => setShowStops(!showStops)}
            >
              <span>View {cruise.stops.length} Stops</span>
              {showStops ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showStops && <CruiseStops stops={cruise.stops} />}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 px-4 py-3">
          <a
            href={cruise.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm font-medium font-playfair"
          >
            Join me on this cruise
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}

