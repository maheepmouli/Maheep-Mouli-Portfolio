import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, MapPin, Clock, Users, Mail, ArrowLeft, Edit, Trash2, Play, Youtube, HardDrive } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { projectsService, Project, ProjectImage } from '@/services/projectsService';
import { VideoItem } from '@/components/VideoManager';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);

  // Helper functions for video URLs
  const getYouTubeEmbedUrl = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    const driveIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (driveIdMatch) {
      return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
    }
    return url;
  };

  useEffect(() => {
    if (id) {
      const fetchedProject = projectsService.getProjectById(id);
      if (fetchedProject) {
        setProject(fetchedProject);
        setProjectImages(projectsService.getProjectImages(id));
      } else {
        toast({
          title: "Project Not Found",
          description: "The project you are looking for does not exist.",
          variant: "destructive",
        });
        navigate('/portfolio');
      }
    }
  }, [id, navigate, toast]);

  const handleHireMe = () => {
    const subject = encodeURIComponent(`Hire Request - ${project?.title || 'Portfolio Project'}`);
    const body = encodeURIComponent(`Hi Maheep,

I saw your ${project?.title || 'portfolio'} project and would like to discuss a collaboration opportunity with you.

Project: ${project?.title || 'N/A'}
My requirements:
- [Describe your project needs]
- [Timeline]
- [Budget range]

Please let me know when you're available for a call.

Best regards,
[Your name]`);
    
    window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDeleteProject = () => {
    if (project && confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      const success = projectsService.deleteProject(project.id);
      if (success) {
        toast({
          title: "Project Deleted",
          description: `"${project.title}" has been removed from your portfolio.`,
        });
        navigate('/portfolio');
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <Button variant="ghost" onClick={() => navigate('/portfolio')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Portfolio
              </Button>
              {user && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/portfolio/edit/${project.id}`)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Project
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProject}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                  </Button>
                </div>
              )}
            </div>

            {/* Project Hero */}
            <div className="relative mb-12 rounded-lg overflow-hidden shadow-lg">
              <img src={project.image_url} alt={project.title} className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h1 className="text-5xl font-bold mb-2">{project.title}</h1>
                <p className="text-xl text-primary-foreground/80 mb-4">{project.subtitle}</p>
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-sm px-3 py-1">
                  {project.status}
                </Badge>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Description */}
              <Card className="lg:col-span-2 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground text-lg leading-relaxed">
                  {project.description}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card className="p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Project Info</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4 text-muted-foreground">
                  {project.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{project.duration}</span>
                    </div>
                  )}
                  {project.team_size && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Team Size: {project.team_size}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rich Content */}
            <Card className="mb-12 p-8">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold">Detailed Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0 prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              </CardContent>
            </Card>

            {/* Project Images */}
            {projectImages.length > 0 && (
              <Card className="mb-12 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Project Gallery</CardTitle>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectImages.sort((a, b) => a.sort_order - b.sort_order).map((image) => (
                    <div key={image.id} className="relative group">
                      <img src={image.image_url} alt={image.alt_text || image.caption} className="w-full h-auto rounded-lg object-cover" />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Project Videos */}
            {project.videos && project.videos.length > 0 && (
              <Card className="mb-12 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Project Videos</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {project.videos.map((video: VideoItem) => (
                    <div key={video.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {video.type === 'youtube' ? <Youtube size={14} /> : <HardDrive size={14} />}
                          {video.type === 'youtube' ? 'YouTube' : 'Google Drive'}
                        </Badge>
                        <h4 className="font-medium text-lg">{video.title}</h4>
                      </div>
                      {video.description && (
                        <p className="text-muted-foreground">{video.description}</p>
                      )}
                      
                      {/* Video Player */}
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={
                            video.type === 'youtube' 
                              ? getYouTubeEmbedUrl(video.url)
                              : getGoogleDriveEmbedUrl(video.url)
                          }
                          title={video.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Project Videos */}
            {project.videos && project.videos.length > 0 && (
              <Card className="mb-12 p-8">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold">Project Videos</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {project.videos.map((video: VideoItem) => (
                    <div key={video.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {video.type === 'youtube' ? <Youtube size={14} /> : <HardDrive size={14} />}
                          {video.type === 'youtube' ? 'YouTube' : 'Google Drive'}
                        </Badge>
                        <h4 className="font-medium text-lg">{video.title}</h4>
                      </div>
                      {video.description && (
                        <p className="text-muted-foreground">{video.description}</p>
                      )}
                      
                      {/* Video Player */}
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={
                            video.type === 'youtube' 
                              ? getYouTubeEmbedUrl(video.url)
                              : getGoogleDriveEmbedUrl(video.url)
                          }
                          title={video.title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.project_url && (
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(project.project_url, '_blank')}
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Live Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(project.github_url, '_blank')}
                    >
                      <Github size={18} className="mr-2" />
                      View Code
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleHireMe}
                  >
                    <Mail size={18} className="mr-2" />
                    Hire Me for Similar Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 