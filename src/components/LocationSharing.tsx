
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Share2, Copy, Check, Loader } from 'lucide-react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

const LocationSharing: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
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

  // Watch location changes
  useEffect(() => {
    let watchId: number | null = null;

    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error('Error watching location:', error);
          toast({
            title: 'Location Tracking Error',
            description: error.message,
            variant: 'destructive',
          });
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    getCurrentLocation();
    toast({
      title: 'Location Tracking Activated',
      description: 'Your location is now being tracked.',
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    toast({
      title: 'Location Tracking Stopped',
      description: 'Your location is no longer being tracked.',
    });
  };

  const shareLocation = () => {
    setIsLoading(true);
    
    // In a real app, this would call your API to generate a tracking link
    // For demo purposes, we're creating a mock link
    setTimeout(() => {
      const trackingId = Math.random().toString(36).substring(2, 10);
      const link = `https://buddy-up.example.com/track/${trackingId}`;
      setShareLink(link);
      setIsSharingModalOpen(true);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        setCopied(true);
        toast({
          title: 'Link Copied',
          description: 'Tracking link copied to clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy link to clipboard.',
          variant: 'destructive',
        });
      }
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 text-primary" />
            Location Tracking
          </CardTitle>
          <CardDescription>Share your live location with trusted contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-sm font-medium mb-2">Current Location:</div>
            {location.latitude && location.longitude ? (
              <>
                <div className="text-sm mb-1">
                  Latitude: {location.latitude.toFixed(6)}
                </div>
                <div className="text-sm mb-1">
                  Longitude: {location.longitude.toFixed(6)}
                </div>
                <div className="text-sm mb-1">
                  Accuracy: {location.accuracy ? `±${location.accuracy.toFixed(1)}m` : 'Unknown'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated: {location.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Unknown'}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Location data not available</div>
            )}
          </div>
          
          {!isTracking && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={startTracking}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Start Tracking My Location
            </Button>
          )}
          
          {isTracking && (
            <div className="flex items-center justify-center gap-2 p-2 bg-primary/10 rounded-lg">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Live tracking active</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={shareLocation}
            disabled={isLoading || !location.latitude}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating link...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share My Live Location
              </>
            )}
          </Button>
          
          {isTracking && (
            <Button 
              variant="outline" 
              className="w-full text-destructive border-destructive hover:bg-destructive/10" 
              onClick={stopTracking}
            >
              Stop Tracking
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isSharingModalOpen} onOpenChange={setIsSharingModalOpen}>
        <DialogContent>
          <DialogTitle>Share Your Live Location</DialogTitle>
          <DialogDescription>
            Share this link with trusted contacts to let them track your location in real-time
          </DialogDescription>
          
          <div className="flex items-center mt-4">
            <Input 
              value={shareLink} 
              readOnly 
              className="pr-10" 
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-[-40px]" 
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsSharingModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                // In a real app, you would implement a direct share option here
                // For now, we'll just call the copy function
                copyToClipboard();
              }}
              className="w-full sm:w-auto"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationSharing;
