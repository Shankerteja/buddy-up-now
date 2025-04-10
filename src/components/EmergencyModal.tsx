
import React from 'react';
import { AlertTriangle, Mic, Camera, MapPin, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoadingSpinner from './LoadingSpinner';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location;
  recording: boolean;
  mediaStream: MediaStream | null;
  messagesSent: boolean;
  sendingMessages: boolean;
  onCancel: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({
  open,
  onOpenChange,
  location,
  recording,
  mediaStream,
  messagesSent,
  sendingMessages,
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={onCancel}
              className="border-red-500 text-red-500 hover:bg-red-100 hover:text-red-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Emergency
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;
