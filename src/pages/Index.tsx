
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import { Shield, Navigation, Bell, Phone, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between py-12 gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Personal Safety,
              <span className="text-primary block">Always at Your Fingertips</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              BuddyUp provides you with the tools to stay safe wherever you go. 
              From emergency alerts to fake call escapes, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Log In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="bg-primary/10 p-6 rounded-xl shadow-lg max-w-sm w-full">
            <div className="aspect-square rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="h-24 w-24 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Emergency SOS</h3>
              <p className="text-gray-600">
                One tap sends your location and alerts emergency contacts
              </p>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Emergency SOS</h3>
              <p className="text-gray-600">
                Send alert with your location, start recording audio & video evidence
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location Sharing</h3>
              <p className="text-gray-600">
                Share your real-time location with trusted contacts for extra safety
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fake Call</h3>
              <p className="text-gray-600">
                Trigger a realistic incoming call to help you exit uncomfortable situations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety Resources</h3>
              <p className="text-gray-600">
                Access safety tips, legal rights information, and self-defense guidance
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-primary/5 rounded-xl p-8 text-center my-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Feel Safer?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust BuddyUp to be their personal safety companion.
            Sign up today and get access to all safety features.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg">
                Create Free Account
              </Button>
            </Link>
          )}
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="mr-2 text-primary" />
              <span className="text-xl font-bold">BuddyUp</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BuddyUp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
