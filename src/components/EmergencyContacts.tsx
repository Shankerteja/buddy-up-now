
import React, { useState, useEffect } from 'react';
import { User, Phone, Trash, Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const { toast } = useToast();

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage when updated
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = () => {
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

    const newContactWithId = {
      ...newContact,
      id: crypto.randomUUID(),
    };

    setContacts([...contacts, newContactWithId]);
    setNewContact({ name: '', phone: '' });
    
    toast({
      title: 'Contact Added',
      description: `${newContact.name} has been added to your emergency contacts`,
    });
  };

  const removeContact = (id: string) => {
    const contactToRemove = contacts.find(contact => contact.id === id);
    setContacts(contacts.filter(contact => contact.id !== id));
    
    toast({
      title: 'Contact Removed',
      description: `${contactToRemove?.name} has been removed from your emergency contacts`,
    });
  };

  const testMessageContact = (contact: Contact) => {
    // In a real app, this would integrate with an SMS API
    toast({
      title: 'Test Message Sent',
      description: `A test message was sent to ${contact.name} at ${contact.phone}`,
    });
  };

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
          {contacts.length > 0 ? (
            contacts.map(contact => (
              <div 
                key={contact.id} 
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
                    onClick={() => removeContact(contact.id)}
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
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmergencyContacts;
