import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image, Plus, LogOut, Upload, Database, Settings, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { unifiedProjectsService } from '@/services/unifiedProjectsService';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [projectCount, setProjectCount] = useState(0);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });
  const [hasBackup, setHasBackup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projects = await unifiedProjectsService.getAllProjects();
        setProjectCount(projects.length);
        
        // Get storage info
        const info = unifiedProjectsService.getStorageInfo();
        setStorageInfo(info);
        
        // Check if backup exists
        const backup = localStorage.getItem('unified_portfolio_projects_backup');
        setHasBackup(!!backup);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will remove all projects and cannot be undone.')) {
      try {
        // Clear all localStorage data
        unifiedProjectsService.clearStorage();
        
        // Clear other potential storage keys
        const keysToClear = [
          'portfolio_projects',
          'dynamic_projects', 
          'project_images',
          'project_videos',
          'user_preferences'
        ];
        
        keysToClear.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.warn(`Could not remove ${key}:`, error);
          }
        });
        
        toast({
          title: "✅ Storage Cleared",
          description: "All local data has been cleared successfully.",
        });
        
        // Refresh project count
        setProjectCount(0);
      } catch (error) {
        console.error('Error clearing data:', error);
        toast({
          title: "❌ Error",
          description: "Failed to clear all data. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClearImages = async () => {
    if (confirm('Are you sure you want to clear all project images? This will remove all image data but keep project information.')) {
      try {
        const projects = await unifiedProjectsService.getAllProjects();
        const projectsWithoutImages = projects.map(project => ({ ...project, image_url: '' }));
        for (const project of projectsWithoutImages) {
          await unifiedProjectsService.updateProject(project.id, project);
        }
        
        toast({
          title: "✅ Images Cleared",
          description: "All project images have been removed successfully.",
        });
      } catch (error) {
        console.error('Error clearing images:', error);
        toast({
          title: "❌ Error",
          description: "Failed to clear images. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRestoreFromBackup = () => {
    if (confirm('Are you sure you want to restore from backup? This will replace current data with the backup.')) {
      try {
        const backup = localStorage.getItem('unified_portfolio_projects_backup');
        if (backup) {
          const backupData = JSON.parse(backup);
          localStorage.setItem('unified_portfolio_projects', backup);
          
          toast({
            title: "✅ Backup Restored",
            description: `Restored ${backupData.length} projects from backup.`,
          });
          
          // Refresh the page to show restored data
          window.location.reload();
        } else {
          toast({
            title: "❌ No Backup Found",
            description: "No backup data was found to restore.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error restoring from backup:', error);
        toast({
          title: "❌ Error",
          description: "Failed to restore from backup. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Portfolio Admin</h1>
              <p className="text-muted-foreground mt-1">
                Manage your projects and content
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : projectCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active portfolio projects
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Connected
                </div>
                <p className="text-xs text-muted-foreground">
                  Supabase + Local Storage
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Local Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((storageInfo.used / 1024 / 1024) * 100) / 100}MB
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((storageInfo.used / storageInfo.available) * 100)}% used
                </p>
                {storageInfo.used > storageInfo.available * 0.8 && (
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    ⚠️ Storage getting full
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  Real-time
                </div>
                <p className="text-xs text-muted-foreground">
                  Immediate updates
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Projects</CardTitle>
                    <CardDescription>
                      Manage your portfolio projects
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/portfolio">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Projects
                  </Button>
                </Link>
                <Link to="/portfolio/create">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    <Image className="h-8 w-8" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Media & Images</CardTitle>
                    <CardDescription>
                      Upload and manage project images
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/portfolio/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover Images
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button className="w-full justify-start">
                    <Image className="h-4 w-4 mr-2" />
                    Manage Project Images
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Storage Management */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>
                Manage your data and storage settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all projects and images (⚠️ This cannot be undone)
                  </p>
                </div>
                <Button onClick={handleClearAllData} variant="destructive" size="sm">
                  Clear All
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Clear Images Only</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all project images to free up space
                  </p>
                </div>
                <Button onClick={handleClearImages} variant="outline" size="sm">
                  Clear Images
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Restore from Backup</p>
                  <p className="text-sm text-muted-foreground">
                    {hasBackup 
                      ? "Replace current data with the last backup" 
                      : "No backup available"
                    }
                  </p>
                </div>
                <Button 
                  onClick={handleRestoreFromBackup} 
                  variant="outline" 
                  size="sm"
                  disabled={!hasBackup}
                >
                  {hasBackup ? "Restore Backup" : "No Backup"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 dark:text-blue-400 mt-1">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Unified Storage System
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your projects are automatically synchronized between Supabase and local storage. 
                    When you create or edit projects, they're immediately visible to visitors without any manual refresh needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin; 