import React from 'react';
import Navigation from '@/components/Navigation';
import Admin from '@/components/Admin';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { toast } = useToast();
  
  const handleForceReload = () => {
    // Clear all cached data
    localStorage.removeItem('dynamic_portfolio_projects');
    localStorage.removeItem('portfolio_projects');
    
    // Force reload of projects
    window.dispatchEvent(new CustomEvent('portfolio-updated', {
      detail: { action: 'force-refresh' }
    }));
    
    // Reload the page to ensure fresh data
    window.location.reload();
    
    toast({
      title: "Cache Cleared",
      description: "All cached data has been cleared and the page will reload.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Admin />
    </div>
  );
};

export default AdminPage; 