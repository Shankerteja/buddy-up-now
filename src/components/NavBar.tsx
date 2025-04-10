
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, Menu, User, Shield, MapPin, Phone } from 'lucide-react';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Shield className="mr-2" />
          BuddyUp
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center">
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Button onClick={logout} variant="secondary" className="hidden md:inline-flex">
                Logout
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/signup" className="hidden md:inline-flex">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
