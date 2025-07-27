import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, FileText, Image, Users, Plus, Edit, LogOut, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const { user, signOut } = useAuth();

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
        { label: "Edit Profile", href: "#", icon: <Edit className="h-4 w-4" />, onClick: () => alert("Profile settings coming soon!") }
      ]
    }
  ];

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
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Quick Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Blog Posts</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Featured Projects</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Image className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 