import React from 'react';
import { LoginForm } from '@/components/AuthForms';
import NavBar from '@/components/NavBar';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <NavBar />
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
