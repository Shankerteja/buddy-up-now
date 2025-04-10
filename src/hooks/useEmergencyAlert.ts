
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sendEmergencyMessages } from '@/services/emergencyService';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export const useEmergencyAlert = () => {
  const [sendingMessages, setSendingMessages] = useState(false);
  const [messagesSent, setMessagesSent] = useState(false);
  const { toast } = useToast();

  const sendAlerts = async (location: Location) => {
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

  return { sendingMessages, messagesSent, sendAlerts, setMessagesSent };
};
