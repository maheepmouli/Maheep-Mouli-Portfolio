import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, FileText, Image, Users, Plus, Edit, LogOut, Upload, HardDrive, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProfileImageEditor from './ProfileImageEditor';
import StorageManager from './StorageManager';
import { dynamicProjectsService } from '@/services/dynamicProjectsService';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState('/maheep.jpg');



  const handleProfileImageChange = (imageUrl: string, file?: File) => {
    setCurrentProfileImage(imageUrl);
    setShowProfileEditor(false);
    
    // In a real application, you would save this to your backend
    // For now, we'll store it in localStorage
    localStorage.setItem('profileImage', imageUrl);
    if (file) {
      localStorage.setItem('profileImageFile', JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type
      }));
    }
  };

  const adminCards = [
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      icon: <FileText className="h-8 w-8" />,
      actions: [
        { label: "View All", href: "/portfolio", icon: <FileText className="h-4 w-4" /> },
        { label: "Create New", href: "/portfolio/create", icon: <Plus className="h-4 w-4" /> }
      ]
    },
    {
      title: "Blog Posts",
      description: "Manage your blog content",
      icon: <FileText className="h-8 w-8" />,
      actions: [
        { label: "View All", href: "/blog", icon: <FileText className="h-4 w-4" /> },
        { label: "Create New", href: "/blog/create", icon: <Plus className="h-4 w-4" /> }
      ]
    },
    {
      title: "Media Library",
      description: "Manage images and files",
      icon: <Image className="h-8 w-8" />,
      actions: [
        { label: "Upload Files", href: "#", icon: <Upload className="h-4 w-4" />, onClick: () => alert("Media upload feature coming soon!") }
      ]
    },
    {
      title: "Profile Settings",
      description: "Update your profile information",
      icon: <Users className="h-8 w-8" />,
      actions: [
        { label: "Edit Profile Image", href: "#", icon: <Edit className="h-4 w-4" />, onClick: () => setShowProfileEditor(true) }
      ]
    },
    {
      title: "Storage Management",
      description: "Configure storage providers and monitor usage",
      icon: <HardDrive className="h-8 w-8" />,
      actions: [
        { label: "Manage Storage", href: "#", icon: <HardDrive className="h-4 w-4" />, onClick: () => setShowStorageManager(true) }
      ]
    },
    {
      title: "Supabase Configuration",
      description: "Configure and test your Supabase database",
      icon: <Database className="h-8 w-8" />,
      actions: [
        { label: "Configure Supabase", href: "/supabase-config", icon: <Database className="h-4 w-4" /> }
      ]
    },


  ];

  if (showProfileEditor) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Edit Profile Image</h1>
                <p className="text-muted-foreground mt-2">
                  Update your profile picture
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowProfileEditor(false)}>
                Back to Admin
              </Button>
            </div>

            {/* Profile Image Editor */}
            <ProfileImageEditor
              currentImageUrl={currentProfileImage}
              onImageChange={handleProfileImageChange}
              onCancel={() => setShowProfileEditor(false)}
            />
          </div>
        </div>
      </div>
    );
  }



  if (showStorageManager) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold">Storage Management</h1>
                <p className="text-muted-foreground mt-2">
                  Configure storage providers and monitor usage
                </p>
              </div>
              <Button variant="outline" onClick={() => setShowStorageManager(false)}>
                Back to Admin
              </Button>
            </div>

            {/* Storage Manager */}
            <StorageManager />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Portfolio Admin</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.displayName || 'Admin'}
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Storage Management Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>
                Manage your local storage and clear data when needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Storage Usage</p>
                  <p className="text-sm text-muted-foreground">
                    Check how much storage you're using
                  </p>
                </div>
                <Button onClick={() => {
                  const storageInfo = dynamicProjectsService.getStorageInfo();
                  toast({
                    title: "Storage Usage",
                    description: `Used: ${Math.round(storageInfo.used / 1024)}KB / Available: ${Math.round(storageInfo.available / 1024)}KB`,
                  });
                }} variant="outline">
                  Check Usage
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Clear All Data</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all projects and images (⚠️ This cannot be undone)
                  </p>
                </div>
                <Button onClick={() => {
                  localStorage.removeItem('dynamic_portfolio_projects');
                  toast({
                    title: "Data Cleared",
                    description: "All projects and data have been cleared.",
                  });
                }} variant="destructive">
                  Clear All
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Clear Images Only</p>
                  <p className="text-sm text-muted-foreground">
                    Remove all project images to free up space
                  </p>
                </div>
                <Button onClick={() => {
                  const projects = dynamicProjectsService.getAllProjects();
                  const projectsWithoutImages = projects.map(project => ({
                    ...project,
                    image_url: ''
                  }));
                  projectsWithoutImages.forEach(project => {
                    dynamicProjectsService.updateProject(project.id, project);
                  });
                  toast({
                    title: "Images Cleared",
                    description: "All project images have been removed.",
                  });
                }} variant="outline">
                  Clear Images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">
                      {card.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {card.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {card.actions.map((action, actionIndex) => (
                      <div key={actionIndex}>
                        {action.onClick ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start"
                            onClick={action.onClick}
                          >
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </Button>
                        ) : (
                          <Link to={action.href}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                            >
                              {action.icon}
                              <span className="ml-2">{action.label}</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Files</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 