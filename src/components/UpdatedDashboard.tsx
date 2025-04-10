
import React from 'react';
import NavBar from '@/components/NavBar';
import EmergencyButton from '@/components/EmergencyButton';
import FakeCall from '@/components/FakeCall';
import LocationSharing from '@/components/LocationSharing';
import SafetyResources from '@/components/SafetyResources';
import VoiceCommand from '@/components/VoiceCommand';
import EmergencyContacts from '@/components/EmergencyContacts';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

const UpdatedDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleEmergencyVoiceCommand = () => {
    // Trigger the same action as the SOS button
    document.getElementById('sos-button')?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6 pb-32 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-800">Welcome, {user.name}</h1>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <LocationSharing />
            <VoiceCommand onEmergency={handleEmergencyVoiceCommand} />
            <EmergencyContacts />
          </div>
          
          <div className="space-y-6">
            <FakeCall />
            <SafetyResources />
          </div>
        </div>
      </main>
      
      <EmergencyButton />
    </div>
  );
};

export default UpdatedDashboard;
