import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Share2, Copy, Check, Loader, Navigation, Map } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  address?: string;
  speed?: number | null;
  heading?: number | null;
  altitude?: number | null;
}

const LocationSharing: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    address: '',
    speed: null,
    heading: null,
    altitude: null,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current location with high accuracy
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
            address: location.address, // Preserve existing address
          };
          
          setLocation(newLocation);
          getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your current location.',
            variant: 'destructive',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
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

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name;
        setLocation(prev => ({ ...prev, address }));
      } else {
        console.error('Failed to get address');
      }
    } catch (error) {
      console.error('Error getting address:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Watch location changes with high accuracy
  useEffect(() => {
    let watchId: number | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    if (isTracking && navigator.geolocation) {
      // Initial location update
      getCurrentLocation();
      
      // Set up continuous tracking with watchPosition
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
            address: location.address, // Preserve existing address
          };
          
          setLocation(newLocation);
          
          // Only update address if accuracy is good enough
          if (position.coords.accuracy < 50) {
            getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
          }
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
          maximumAge: 0,
          timeout: 10000,
        }
      );
      
      // Set up a backup interval to ensure location updates continue
      // This helps maintain tracking even if watchPosition has issues
      intervalId = setInterval(() => {
        getCurrentLocation();
      }, 30000); // Update every 30 seconds as a backup
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking]);

  // Initialize map when location changes
  useEffect(() => {
    if (location.latitude && location.longitude && mapRef.current) {
      try {
        // Create an extremely simple and fast map view
        // This approach uses minimal HTML and styling for instant loading
        mapRef.current.innerHTML = `
          <div class="w-full h-full bg-gray-100 p-4 flex flex-col">
            <div class="flex justify-between items-center mb-2">
              <div class="font-medium">Your Location</div>
              <div class="text-xs text-gray-500">
                ${location.accuracy ? `±${location.accuracy.toFixed(1)}m` : 'Unknown'} accuracy
              </div>
            </div>
            
            <div class="bg-white p-3 rounded mb-3 text-sm">
              <div>Lat: ${location.latitude.toFixed(6)}</div>
              <div>Lon: ${location.longitude.toFixed(6)}</div>
            </div>
            
            ${location.address ? `
              <div class="bg-white p-3 rounded mb-3 text-sm">
                <div class="font-medium mb-1">Address:</div>
                <div>${location.address}</div>
              </div>
            ` : ''}
            
            <div class="mt-auto flex gap-2">
              <a 
                href="https://www.google.com/maps?q=${location.latitude},${location.longitude}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex-1 text-center py-2 bg-primary text-white rounded text-sm"
              >
                Google Maps
              </a>
              <a 
                href="https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=16" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex-1 text-center py-2 bg-green-600 text-white rounded text-sm"
              >
                OpenStreetMap
              </a>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error creating map visualization:', error);
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="text-center p-4">
                <p class="text-sm text-gray-500">Map view unavailable</p>
              </div>
            </div>
          `;
        }
      }
    }
  }, [location.latitude, location.longitude, location.accuracy, location.address]);

  const startTracking = () => {
    setIsTracking(true);
    getCurrentLocation();
    toast({
      title: 'Location Tracking Activated',
      description: 'Your location is now being tracked with high accuracy.',
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
            Exact Location Tracking
          </CardTitle>
          <CardDescription>Share your precise live location with trusted contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Location Details</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <div className="text-sm font-medium mb-2">Current Location:</div>
                {location.latitude && location.longitude ? (
                  <>
                    <div className="text-sm mb-1">
                      Latitude: {location.latitude.toFixed(8)}
                    </div>
                    <div className="text-sm mb-1">
                      Longitude: {location.longitude.toFixed(8)}
                    </div>
                    <div className="text-sm mb-1">
                      Accuracy: {location.accuracy ? `±${location.accuracy.toFixed(1)}m` : 'Unknown'}
                    </div>
                    {location.speed !== null && (
                      <div className="text-sm mb-1">
                        Speed: {location.speed > 0 ? `${(location.speed * 3.6).toFixed(1)} km/h` : 'Stationary'}
                      </div>
                    )}
                    {location.heading !== null && (
                      <div className="text-sm mb-1">
                        Heading: {location.heading.toFixed(1)}°
                      </div>
                    )}
                    {location.altitude !== null && (
                      <div className="text-sm mb-1">
                        Altitude: {location.altitude.toFixed(1)}m
                      </div>
                    )}
                    <div className="text-sm mb-1">
                      Last Updated: {location.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Unknown'}
                    </div>
                    {isLoadingAddress ? (
                      <div className="text-sm text-muted-foreground mt-2">
                        <Loader className="h-4 w-4 inline mr-1 animate-spin" />
                        Getting address...
                      </div>
                    ) : location.address ? (
                      <div className="text-sm mt-2 p-2 bg-white rounded border">
                        <strong>Address:</strong> {location.address}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Location data not available</div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <div className="p-4 bg-gray-100 rounded-lg">
                {location.latitude && location.longitude ? (
                  <div ref={mapRef} className="w-full h-[300px] rounded-lg overflow-hidden">
                    {/* Content will be inserted by the useEffect */}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground h-[300px] flex items-center justify-center">
                    Start tracking to see your location on the map
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {!isTracking && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={startTracking}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Start Exact Location Tracking
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
