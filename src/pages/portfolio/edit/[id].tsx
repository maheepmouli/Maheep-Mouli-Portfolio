import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProjectForm from '@/components/ProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const PortfolioEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to edit projects.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  if (!user || !id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Edit Project</h1>
              <p className="text-muted-foreground">
                Update your project information, content, and images.
              </p>
            </div>
            
            <ProjectForm 
              projectId={id}
              onSuccess={() => {
                toast({
                  title: "Project Updated!",
                  description: "Your project has been successfully updated.",
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

export default PortfolioEdit; 