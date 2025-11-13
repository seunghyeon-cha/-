export interface Itinerary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  days?: ItineraryDay[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  itineraryId: string;
  dayNumber: number;
  date: string;
  places: ItineraryPlace[];
}

export interface ItineraryPlace {
  id: string;
  dayId: string;
  placeId: string;
  place?: {
    id: string;
    name: string;
    address: string;
    category: string;
    latitude?: number;
    longitude?: number;
  };
  orderIndex: number;
  memo?: string;
  visitTime?: string;
}

export interface CreateItineraryDto {
  title: string;
  startDate: string;
  endDate: string;
  region: string;
  isPublic?: boolean;
}

export interface UpdateItineraryDto {
  title?: string;
  startDate?: string;
  endDate?: string;
  region?: string;
  isPublic?: boolean;
}
