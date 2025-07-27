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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - only Maheep can access
const ADMIN_CREDENTIALS = {
  email: 'maheep.mouli.shashi@gmail.com',
  password: 'maheepS@10'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('portfolio_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Only Maheep can access admin features
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const userData: User = {
        id: '1',
        email: email,
        displayName: 'Maheep Mouli Shashi'
      };
      setUser(userData);
      localStorage.setItem('portfolio_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('portfolio_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signOut, isLoading }}>
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