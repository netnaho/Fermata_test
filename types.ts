
export type Screen = 'start' | 'home' | 'map' | 'profile';

export interface RouteDetails {
  destination: string;
  duration: string;
  distance: string;
  directionsAmharic: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
