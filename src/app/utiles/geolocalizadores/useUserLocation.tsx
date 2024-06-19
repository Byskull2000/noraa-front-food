"use client";

import { useState, useEffect } from 'react';

interface UserLocation {
  lat: number;
  lng: number;
}

const useUserLocation = (): UserLocation | null => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          }
        );
      } else {
        console.error('Geolocalización no soportada en el navegador.');
      }
    };

    getUserLocation();

    return () => {
      setUserLocation(null);
    };
  }, []);

  return userLocation;
};

export default useUserLocation;
