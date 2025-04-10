
interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface Location {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

export const getEmergencyContacts = (): Contact[] => {
  const savedContacts = localStorage.getItem('emergencyContacts');
  if (savedContacts) {
    return JSON.parse(savedContacts);
  }
  return [];
};

export const sendEmergencyMessages = async (
  location: Location,
  customMessage?: string
): Promise<boolean> => {
  const contacts = getEmergencyContacts();
  
  if (contacts.length === 0) {
    console.warn('No emergency contacts found');
    return false;
  }

  const locationText = location.latitude && location.longitude
    ? `My current location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : 'Location unavailable';

  const defaultMessage = `EMERGENCY ALERT: I need help immediately. ${locationText}`;
  const messageContent = customMessage || defaultMessage;

  try {
    // In a real app, this would call an SMS API service
    // Here we're mocking the API call
    console.log(`Sending emergency messages to ${contacts.length} contacts`);
    console.log(`Message content: ${messageContent}`);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log which contacts would receive messages
    contacts.forEach(contact => {
      console.log(`Message would be sent to ${contact.name} at ${contact.phone}`);
    });
    
    return true;
  } catch (error) {
    console.error('Error sending emergency messages:', error);
    return false;
  }
};
