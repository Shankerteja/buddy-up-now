
import React from 'react';
import NavBar from '@/components/NavBar';
import EmergencyButton from '@/components/EmergencyButton';
import FakeCall from '@/components/FakeCall';
import LocationSharing from '@/components/LocationSharing';
import SafetyResources from '@/components/SafetyResources';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6 pb-32 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <LocationSharing />
            <SafetyResources />
          </div>
          
          <div className="space-y-6">
            <FakeCall />
          </div>
        </div>
      </main>
      
      <EmergencyButton />
    </div>
  );
};

export default Dashboard;
