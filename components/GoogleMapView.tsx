import React, { useEffect, useRef } from 'react';
import { UserLocation } from '../types';

interface GoogleMapViewProps {
  origin: UserLocation;
  destination: string;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ origin, destination }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).google) {
      return;
    }

    const google = (window as any).google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: origin.latitude, lng: origin.longitude },
      zoom: 15,
      disableDefaultUI: true,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
        {
          featureType: "administrative.country",
          elementType: "geometry.stroke",
          stylers: [{ color: "#4b6878" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#64779e" }],
        },
        {
          featureType: "administrative.province",
          elementType: "geometry.stroke",
          stylers: [{ color: "#4b6878" }],
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.stroke",
          stylers: [{ color: "#334e87" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#023e58" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#283d6a" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6f9ba5" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#1d2c4d" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#023e58" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#3C7680" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#304a7d" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#98a5be" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#1d2c4d" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#2c6675" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#255763" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#b0d5ce" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#023e58" }],
        },
        {
          featureType: "transit",
          elementType: "labels.text.fill",
          stylers: [{ color: "#98a5be" }],
        },
        {
          featureType: "transit",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#1d2c4d" }],
        },
        {
          featureType: "transit.line",
          elementType: "geometry.fill",
          stylers: [{ color: "#283d6a" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#3a4762" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0e1626" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#4e6d70" }],
        },
      ],
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#8A2BE2',
            strokeOpacity: 0.8,
            strokeWeight: 6,
        }
    });

    const request = {
      origin: { lat: origin.latitude, lng: origin.longitude },
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });

  }, [origin, destination]);

  return <div ref={mapRef} className="absolute inset-0" />;
};

export default GoogleMapView;
