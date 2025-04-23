import React, { useState, useEffect } from 'react';
import { User, Phone, Trash, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

interface Contact {
  _id: string;
  name: string;
  phone: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface DeleteResponse {
  message: string;
  success?: boolean;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get<Contact[]>('/emergency/contacts');
        // The response.data is an array of contacts directly
        if (Array.isArray(response.data)) {
          setContacts(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          toast({
            title: 'Error',
            description: 'Invalid response format from server',
            variant: 'destructive',
          });
          setContacts([]);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load emergency contacts',
          variant: 'destructive',
        });
        setContacts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both name and phone number',
        variant: 'destructive',
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(newContact.phone.replace(/[\s-]/g, ''))) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    try {
      //console.log('Sending contact data:', newContact);
      const response = await api.post<Contact>('/emergency/contacts', newContact);
      //console.log('API response:', response.data);
      
      // The response.data is the contact object directly
      if (response.data && response.data._id) {
        setContacts(prevContacts => [...prevContacts, response.data]);
        setNewContact({ name: '', phone: '' });
        
        toast({
          title: 'Contact Added',
          description: `${newContact.name} has been added to your emergency contacts`,
        });
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error adding contact:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to add emergency contact',
        variant: 'destructive',
      });
    }
  };

  const removeContact = async (id: string) => {
    try {
      const response = await api.delete<DeleteResponse>(`/emergency/contacts/${id}`);
      
      // Check if the response contains a success message
      if (response.data && response.data.message === 'Contact removed') {
        // This is actually a success case
        const contactToRemove = contacts.find(contact => contact._id === id);
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
        
        toast({
          title: 'Contact Removed',
          description: `${contactToRemove?.name || 'Contact'} has been removed from your emergency contacts`,
        });
      } else if (response.data && response.data.success) {
        // Handle the case where the response has a success flag
        const contactToRemove = contacts.find(contact => contact._id === id);
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
        
        toast({
          title: 'Contact Removed',
          description: `${contactToRemove?.name || 'Contact'} has been removed from your emergency contacts`,
        });
      } else {
        // This is a genuine error case
        throw new Error(response.data?.message || 'Failed to remove contact');
      }
    } catch (error) {
      console.error('Error removing contact:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove emergency contact',
        variant: 'destructive',
      });
    }
  };

  const testMessageContact = async (contact: Contact) => {
    try {
      const response = await api.post<ApiResponse<void>>(`/emergency/alert/${contact._id}`, {
        message: 'This is a test message from SheShield'
      });
      
      if (response.data.success) {
        toast({
          title: 'Test Message Sent',
          description: `A test message was sent to ${contact.name} at ${contact.phone}`,
        });
      } else {
        throw new Error(response.data.message || 'Failed to send test message');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test message',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 text-purple-600" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          These contacts will be notified in case of an emergency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {contacts && contacts.length > 0 ? (
            contacts.map(contact => (
              <div 
                key={contact._id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => testMessageContact(contact)}
                    title="Send Test Message"
                  >
                    <Send className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeContact(contact._id)}
                    title="Remove Contact"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No emergency contacts added yet</p>
              <p className="text-sm mt-1">Add contacts who should be notified in case of emergency</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Add New Contact</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                placeholder="Enter contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={addContact}
          className="w-full bg-purple-600 hover:bg-purple-700"
          type="button"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmergencyContacts;
