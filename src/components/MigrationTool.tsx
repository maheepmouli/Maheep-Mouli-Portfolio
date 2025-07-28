import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabaseProjectsService } from '@/services/supabaseProjectsService';

export const MigrationTool = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const { toast } = useToast();

  const migrateProjects = async () => {
    setIsMigrating(true);
    setMigrationStatus('Starting migration...');

    try {
      // Get projects from localStorage
      const localStorageProjects = localStorage.getItem('dynamic_portfolio_projects');
      if (!localStorageProjects) {
        setMigrationStatus('No projects found in localStorage');
        toast({
          title: "No Projects Found",
          description: "No projects found in localStorage to migrate.",
          variant: "destructive"
        });
        return;
      }

      const projects = JSON.parse(localStorageProjects);
      console.log('Migration: Found projects in localStorage:', projects);

      setMigrationStatus(`Found ${projects.length} projects to migrate...`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        setMigrationStatus(`Migrating project ${i + 1}/${projects.length}: ${project.title}`);

        try {
          // Convert project to Supabase format
          const supabaseProject = {
            title: project.title || '',
            subtitle: project.subtitle || '',
            description: project.description || '',
            content: project.content || '',
            image_url: project.image_url || '',
            status: project.status || 'draft',
            featured: project.featured || false,
            project_url: project.project_url || '',
            github_url: project.github_url || '',
            location: project.location || '',
            duration: project.duration || '',
            team_size: project.team_size || '',
            technologies: Array.isArray(project.technologies) ? project.technologies : [],
            tags: Array.isArray(project.tags) ? project.tags : []
          };

          console.log('Migration: Converting project:', supabaseProject);

          const result = await supabaseProjectsService.createProject(supabaseProject);
          
          if (result) {
            successCount++;
            console.log('Migration: Successfully migrated project:', project.title);
          } else {
            errorCount++;
            console.error('Migration: Failed to migrate project:', project.title);
          }
        } catch (error) {
          errorCount++;
          console.error('Migration: Error migrating project:', project.title, error);
        }
      }

      setMigrationStatus(`Migration complete! Success: ${successCount}, Errors: ${errorCount}`);
      
      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${successCount} projects. ${errorCount} errors.`,
        variant: successCount > 0 ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Migration: General error:', error);
      setMigrationStatus('Migration failed');
      toast({
        title: "Migration Failed",
        description: "An error occurred during migration.",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Migrate Projects to Supabase</CardTitle>
        <CardDescription>
          Move your existing projects from localStorage to Supabase database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={migrateProjects} 
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? 'Migrating...' : 'Start Migration'}
        </Button>
        
        {migrationStatus && (
          <div className="text-sm text-muted-foreground">
            {migrationStatus}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 