import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { useMediaRecording } from '@/hooks/useMediaRecording';
import { useEmergencyAlert } from '@/hooks/useEmergencyAlert';
import { useAudioAlarm } from '@/hooks/useAudioAlarm';
import { useShakeDetection } from '@/hooks/useShakeDetection';
import EmergencyModal from './EmergencyModal';

const EmergencyButton: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const { toast } = useToast();
  const { location, getLocation } = useLocation();
  const { recording, mediaStream, startRecording, stopRecording } = useMediaRecording();
  const { sendingMessages, messagesSent, sendAlerts, setMessagesSent } = useEmergencyAlert();
  const { playAlarm, stopAlarm } = useAudioAlarm();

  const triggerEmergency = async () => {
    setEmergencyActive(true);
    playAlarm();
    startRecording();
    
    try {
      // Get location and wait for it to be available
      const locationData = await getLocation();
      
      // Send emergency messages to contacts with location
      await sendAlerts(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
      
      // If location is not available, send alert without location
      await sendAlerts(location);
      toast({
        title: 'Location Not Available',
        description: 'Emergency alert sent without location data.',
        variant: 'destructive',
      });
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

  // Set up shake detection for mobile devices
  useShakeDetection({
    onShake: triggerEmergency,
    enabled: !emergencyActive
  });

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

      <EmergencyModal
        open={emergencyActive}
        onOpenChange={setEmergencyActive}
        location={location}
        recording={recording}
        mediaStream={mediaStream}
        messagesSent={messagesSent}
        sendingMessages={sendingMessages}
        onCancel={cancelEmergency}
      />
    </>
  );
};

export default EmergencyButton;
