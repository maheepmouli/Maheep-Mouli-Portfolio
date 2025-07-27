import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, FileText, Image, Users, Plus, Edit, LogOut, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProfileImageEditor from './ProfileImageEditor';

const Admin = () => {
  const { user, signOut } = useAuth();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
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
    }
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