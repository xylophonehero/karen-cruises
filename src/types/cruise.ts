export interface CruiseStop {
  day: number
  port: string
  arrivalTime?: string
  departureTime?: string
}

export interface Cruise {
  id: string
  name: string
  shipName: string
  departureDate: string
  returnDate: string
  duration: number
  departurePort: string
  returnPort: string
  region: string
  price: number
  stops: CruiseStop[]
  bookingUrl: string
}
