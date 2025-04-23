import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const { toast } = useToast();

  const getLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };
            setLocation(newLocation);
            resolve(newLocation);
          },
          (error) => {
            console.error('Error getting location:', error);
            toast({
              title: 'Location Error',
              description: 'Unable to get your current location.',
              variant: 'destructive',
            });
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        const error = new Error('Geolocation is not supported by your browser.');
        toast({
          title: 'Location Not Supported',
          description: 'Geolocation is not supported by your browser.',
          variant: 'destructive',
        });
        reject(error);
      }
    });
  };

  return { location, getLocation };
};
