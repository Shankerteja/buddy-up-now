
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Shield, MapPin, Phone } from 'lucide-react';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-purple-600 text-white py-4 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Shield className="mr-2" />
          SheShield
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center">
                <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700">
                  <User size={20} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700">
                <Bell size={20} />
              </Button>
              <Button onClick={logout} variant="secondary" className="hidden md:inline-flex bg-white text-purple-600 hover:bg-purple-100">
                Logout
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-purple-700">
                <Menu size={20} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-100">Login</Button>
              </Link>
              <Link to="/signup" className="hidden md:inline-flex">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
