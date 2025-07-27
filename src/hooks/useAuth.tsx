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

// Admin credentials - multiple options for login
const ADMIN_CREDENTIALS = [
  {
    email: 'maheep.mouli.shashi@gmail.com',
    password: 'maheepS@10'
  },
  {
    email: 'lionelmaheep559@gmail.com',
    password: 'maheepS@10'
  },
  {
    email: 'maheep.mouli.shashi@gmail.com',
    password: 'maheep123'
  },
  {
    email: 'lionelmaheep559@gmail.com',
    password: 'maheep123'
  }
];

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
    
    // Check against all possible credentials
    const isValidCredential = ADMIN_CREDENTIALS.some(
      cred => cred.email === email && cred.password === password
    );
    
    if (isValidCredential) {
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
    
    console.log('Login failed - invalid credentials');
    console.log('Available credentials:', ADMIN_CREDENTIALS.map(c => c.email));
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