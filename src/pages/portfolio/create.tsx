import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProjectForm from '@/components/ProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const PortfolioCreate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to create projects.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Create New Project</h1>
              <p className="text-muted-foreground">
                Add a new project to your portfolio with detailed information, images, and content.
              </p>
            </div>
            
            <ProjectForm 
              onSuccess={() => {
                toast({
                  title: "Project Created!",
                  description: "Your new project has been added to your portfolio.",
                });
                navigate('/admin');
              }}
              onCancel={() => navigate('/admin')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCreate; 