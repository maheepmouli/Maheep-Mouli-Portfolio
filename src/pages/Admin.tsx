import React from 'react';
import Navigation from '@/components/Navigation';
import Admin from '@/components/Admin';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Admin />
    </div>
  );
};

export default AdminPage; 