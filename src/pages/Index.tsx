
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import { Shield, Navigation, Bell, Phone, Activity, Heart, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section with Background */}
        <section className="relative rounded-xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-purple-900/75 z-10"></div>
          <div className="bg-[url('https://img.freepik.com/free-photo/positive-young-women-posing-together_23-2148431608.jpg?t=st=1744292764~exp=1744296364~hmac=684eeee0f8aa7070d610284d4684d83544033d1ec5de0296984687e3d1bf0d06&w=1380')] bg-cover bg-center h-[500px]"></div>
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-xl text-white">
                <h1 className="text-5xl font-bold tracking-tight mb-4 animate-fade-in">
                  Women's Safety,
                  <span className="text-purple-200 block">Always at Your Fingertips</span>
                </h1>
                <p className="text-lg text-purple-100 mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
                  SheShield provides you with the tools to stay safe wherever you go. 
                  From emergency alerts to fake call escapes, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
                  {user ? (
                    <Link to="/dashboard">
                      <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/signup">
                        <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                          Get Started
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-purple-200 text-black hover:bg-purple-600/20 hover:text-white">
                          Log In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section with Cards */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            SheShield comes with powerful features designed specifically for women's safety and peace of mind.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Emergency SOS</h3>
              <p className="text-gray-600">
                Send alert with your location, start recording audio & video evidence
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Navigation className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location Sharing</h3>
              <p className="text-gray-600">
                Share your real-time location with trusted contacts for extra safety
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fake Call</h3>
              <p className="text-gray-600">
                Trigger a realistic incoming call to help you exit uncomfortable situations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety Resources</h3>
              <p className="text-gray-600">
                Access safety tips, legal rights information, and self-defense guidance
              </p>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 my-16">
          <h2 className="text-3xl font-bold text-center mb-4">How SheShield Works</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Fast, reliable, and discreet protection when you need it most
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Up Contacts</h3>
              <p className="text-gray-600">
                Add emergency contacts who'll receive alerts when you're in danger
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enable Location</h3>
              <p className="text-gray-600">
                Allow location access so contacts know exactly where to find you
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto">
                <Bell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Activate SOS</h3>
              <p className="text-gray-600">
                Press the emergency button or use voice commands to trigger alerts
              </p>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-4">What Users Say</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            SheShield has helped thousands of women feel safer in their daily lives
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah K.</h4>
                  <p className="text-sm text-gray-500">College Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "SheShield has been a game-changer for my late-night walks back from the library. The location sharing feature gives me peace of mind."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <Star /><Star /><Star /><Star /><Star />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-bold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maya R.</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As someone who travels alone frequently, the fake call feature has helped me exit several uncomfortable situations discreetly."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <Star /><Star /><Star /><Star /><Star />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-bold">J</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer M.</h4>
                  <p className="text-sm text-gray-500">Working Professional</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The voice command feature is brilliant! When my hands are full or I can't reach my phone, I can still call for help."
              </p>
              <div className="flex mt-4 text-yellow-400">
                <Star /><Star /><Star /><Star /><Star />
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 bg-purple-600 rounded-xl p-8 text-center my-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Feel Safer?</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust SheShield to be their personal safety companion.
            Sign up today and get access to all safety features.
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-100">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-100">
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
              <Shield className="mr-2 text-purple-600" />
              <span className="text-xl font-bold">SheShield</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SheShield. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Star component for testimonials
const Star = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default Index;
