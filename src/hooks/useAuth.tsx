import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isLoading: boolean;
  testLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple admin credentials
const ADMIN_EMAIL = 'maheep.mouli.shashi@gmail.com';
const ADMIN_PASSWORD = 'maheep123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('portfolio_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('portfolio_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { email, password: password ? '***' : 'empty' });
    console.log('Expected:', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    
    // Simple email/password check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log('Login successful!');
      const userData: User = {
        id: '1',
        email: email,
        displayName: 'Maheep Mouli Shashi'
      };
      setUser(userData);
      localStorage.setItem('portfolio_user', JSON.stringify(userData));
      return true;
    }
    
    console.log('Login failed - credentials do not match');
    return false;
  };

  const testLogin = async (): Promise<boolean> => {
    console.log('Test login called');
    // Auto-login for testing
    const userData: User = {
      id: '1',
      email: ADMIN_EMAIL,
      displayName: 'Maheep Mouli Shashi'
    };
    setUser(userData);
    localStorage.setItem('portfolio_user', JSON.stringify(userData));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('portfolio_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signOut, isLoading, testLogin }}>
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