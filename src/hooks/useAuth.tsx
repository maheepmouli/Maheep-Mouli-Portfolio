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

// Simple admin credentials
const ADMIN_EMAIL = 'maheep.mouli.shashi@gmail.com';
const ADMIN_PASSWORD = 'maheepS@10';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('portfolio_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('Auth: Loaded user from localStorage:', userData);
      }
    } catch (error) {
      console.error('Auth: Error loading user from localStorage:', error);
      // Don't clear the session on error, just log it
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Clean the inputs - trim whitespace and convert to lowercase for email
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    console.log('Login attempt:', { 
      originalEmail: email, 
      cleanEmail, 
      password: cleanPassword ? '***' : 'empty' 
    });
    
    // Simple email/password check with cleaned inputs
    if (cleanEmail === ADMIN_EMAIL && cleanPassword === ADMIN_PASSWORD) {
      console.log('Login successful!');
      const userData: User = {
        id: '1',
        email: ADMIN_EMAIL,
        displayName: 'Maheep Mouli Shashi'
      };
      setUser(userData);
      localStorage.setItem('portfolio_user', JSON.stringify(userData));
      return true;
    }
    
    console.log('Login failed - credentials do not match');
    return false;
  };

  const signOut = () => {
    try {
      console.log('Auth: Signing out user');
      setUser(null);
      localStorage.removeItem('portfolio_user');
      // Redirect to home page instead of login
      window.location.href = '/';
    } catch (error) {
      console.error('Auth: Error during sign out:', error);
      // Even if there's an error, try to clear the user state
      setUser(null);
    }
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