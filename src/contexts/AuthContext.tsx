import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import api from '@/utils/api';

type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
} | null;

type AuthResponse = {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  token: string;
};

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      const userData = {
        id: response.data._id,
        email: response.data.email,
        name: response.data.name,
        phone: response.data.phone,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        phone: phone || '',
      });
      
      const userData = {
        id: response.data._id,
        email: response.data.email,
        name: response.data.name,
        phone: response.data.phone,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      setUser(userData);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.response?.data?.message || "There was an error creating your account.",
        variant: "destructive",
      });
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: "There was an error sending the reset email.",
        variant: "destructive",
      });
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
