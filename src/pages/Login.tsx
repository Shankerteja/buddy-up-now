
import React from 'react';
import { LoginForm } from '@/components/AuthForms';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Shield } from 'lucide-react';

const Login: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <NavBar />
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-6">
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-center text-gray-800">Welcome back to SheShield</h1>
            <p className="mt-1 text-center text-gray-600">Sign in to access your safety features</p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
