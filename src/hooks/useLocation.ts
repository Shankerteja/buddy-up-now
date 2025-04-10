
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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
    }
  };

  return { location, getLocation };
};
