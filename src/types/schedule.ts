export interface CruiseSchedule {
  id: number;
  ship_name: string;
  date_joining: string;
  date_leaving: string;
  tags: string[];
}

export interface PersonSchedule {
  id: string;
  name: string;
  cruises: CruiseSchedule[];
}
