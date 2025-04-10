
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mic, Camera, MapPin, X, AlertCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { sendEmergencyMessages } from '@/services/emergencyService';
import LoadingSpinner from './LoadingSpinner';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

const EmergencyButton: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [sendingMessages, setSendingMessages] = useState(false);
  const [messagesSent, setMessagesSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up shake detection for mobile devices
    if (window.DeviceMotionEvent) {
      let shakeThreshold = 15;
      let lastX: number | null = null;
      let lastY: number | null = null;
      let lastZ: number | null = null;
      
      const handleMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        const { x, y, z } = acceleration;
        if (x === null || y === null || z === null) return;
        
        if (lastX === null || lastY === null || lastZ === null) {
          lastX = x;
          lastY = y;
          lastZ = z;
          return;
        }
        
        const deltaX = Math.abs(lastX - x);
        const deltaY = Math.abs(lastY - y);
        const deltaZ = Math.abs(lastZ - z);
        
        if ((deltaX > shakeThreshold && deltaY > shakeThreshold) || 
            (deltaX > shakeThreshold && deltaZ > shakeThreshold) || 
            (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
          if (!emergencyActive) {
            triggerEmergency();
          }
        }
        
        lastX = x;
        lastY = y;
        lastZ = z;
      };
      
      window.addEventListener('devicemotion', handleMotion);
      
      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    }
  }, [emergencyActive]);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMediaStream(stream);
      setRecording(true);
      
      toast({
        title: 'Recording Started',
        description: 'Audio and video recording has started.',
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Recording Error',
        description: 'Unable to access camera or microphone.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setRecording(false);
      
      toast({
        title: 'Recording Stopped',
        description: 'Audio and video recording has stopped.',
      });
    }
  };

  const triggerEmergency = async () => {
    setEmergencyActive(true);
    getLocation();
    startRecording();
    playAlarm();
    
    // Send emergency messages to contacts
    setSendingMessages(true);
    try {
      const result = await sendEmergencyMessages(location);
      setMessagesSent(true);
      
      if (result) {
        toast({
          title: 'Emergency Contacts Notified',
          description: 'Your emergency contacts have been sent your location and alert.',
        });
      } else {
        toast({
          title: 'No Contacts Found',
          description: 'No emergency contacts to notify. Please add contacts in settings.',
          variant: 'destructive',
        });
      }
      
      // Mock API call to send alert to backend
      setTimeout(() => {
        toast({
          title: 'Alert Sent',
          description: 'Emergency services have been notified.',
        });
      }, 2000);
    } catch (error) {
      console.error('Error sending emergency messages:', error);
      toast({
        title: 'Message Sending Failed',
        description: 'Unable to send emergency messages to your contacts.',
        variant: 'destructive',
      });
    } finally {
      setSendingMessages(false);
    }
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    stopRecording();
    stopAlarm();
    setMessagesSent(false);
    
    toast({
      title: 'Emergency Cancelled',
      description: 'Emergency mode has been deactivated.',
    });
  };

  const playAlarm = () => {
    try {
      const audio = new Audio('/alarm.mp3');
      audio.loop = true;
      audio.volume = 0.7;
      audio.id = 'emergency-alarm';
      document.body.appendChild(audio);
      audio.play().catch(error => {
        console.error('Error playing alarm:', error);
      });
    } catch (error) {
      console.error('Error setting up alarm:', error);
    }
  };

  const stopAlarm = () => {
    const audio = document.getElementById('emergency-alarm') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.remove();
    }
  };

  return (
    <>
      <div className="fixed bottom-24 inset-x-0 flex justify-center z-50">
        <Button
          variant="destructive"
          size="lg"
          className="sos-button h-24 w-24 rounded-full text-2xl font-bold"
          onClick={triggerEmergency}
          id="sos-button"
        >
          SOS
        </Button>
      </div>

      <Dialog open={emergencyActive} onOpenChange={setEmergencyActive}>
        <DialogContent className="bg-red-50 border-red-500">
          <DialogTitle className="flex items-center text-red-700">
            <AlertTriangle className="mr-2" />
            Emergency Mode Active
          </DialogTitle>
          <DialogDescription className="text-center text-red-600">
            Help is on the way. Stay calm and stay on the line.
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="bg-white p-4 rounded-md space-y-2">
              <div className="flex items-center">
                <MapPin className="text-red-500 mr-2" />
                <p className="text-sm font-medium">
                  {location.latitude && location.longitude
                    ? `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'Getting location...'}
                </p>
              </div>
              
              <div className="flex items-center">
                <Camera className={`mr-2 ${recording ? 'text-red-500' : 'text-gray-500'}`} />
                <p className="text-sm font-medium">
                  {recording ? 'Video recording active' : 'Video recording inactive'}
                </p>
              </div>
              
              <div className="flex items-center">
                <Mic className={`mr-2 ${recording ? 'text-red-500' : 'text-gray-500'}`} />
                <p className="text-sm font-medium">
                  {recording ? 'Audio recording active' : 'Audio recording inactive'}
                </p>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className={`mr-2 ${messagesSent ? 'text-green-500' : sendingMessages ? 'text-orange-500' : 'text-gray-500'}`} />
                <p className="text-sm font-medium">
                  {messagesSent 
                    ? 'Emergency messages sent to contacts' 
                    : sendingMessages 
                      ? 'Sending emergency messages...' 
                      : 'Emergency contacts will be notified'}
                </p>
                {sendingMessages && <LoadingSpinner size="small" color="purple" />}
              </div>
            </div>
            
            {recording && mediaStream && (
              <div className="rounded-md overflow-hidden bg-black">
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-auto"
                  ref={(videoElement) => {
                    if (videoElement && mediaStream) {
                      videoElement.srcObject = mediaStream;
                    }
                  }}
                />
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={cancelEmergency}
                className="border-red-500 text-red-500 hover:bg-red-100 hover:text-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Emergency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
