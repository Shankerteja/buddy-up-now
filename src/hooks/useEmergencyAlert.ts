import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

interface EmergencyResponse {
  success: boolean;
  message: string;
  details?: {
    totalContacts: number;
    successful: number;
    failed: number;
  };
}

export const useEmergencyAlert = () => {
  const [sendingMessages, setSendingMessages] = useState(false);
  const [messagesSent, setMessagesSent] = useState(false);
  const { toast } = useToast();

  const sendAlerts = async (location: Location) => {
    setSendingMessages(true);
    try {
      const locationString = location.latitude && location.longitude
        ? `${location.latitude},${location.longitude}`
        : 'Location unavailable';

      const response = await api.post<EmergencyResponse>('/emergency/alert', {
        location: locationString,
        message: 'I need immediate help!'
      });

      if (response.data.success) {
        setMessagesSent(true);
        toast({
          title: 'Emergency Contacts Notified',
          description: `Alert sent to ${response.data.details?.totalContacts} contacts. ${response.data.details?.successful} successful, ${response.data.details?.failed} failed.`,
        });
      }
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
