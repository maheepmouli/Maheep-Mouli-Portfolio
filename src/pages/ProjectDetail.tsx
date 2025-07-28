import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, MapPin, Clock, Users, Edit, Trash2, Video, Youtube, HardDrive } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDynamicTranslatedProjects, DynamicProject } from '@/services/dynamicProjectsService';
import Navigation from '@/components/Navigation';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { getTranslatedProjectById, deleteProject } = useDynamicTranslatedProjects();

  const [project, setProject] = useState<DynamicProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const projectData = getTranslatedProjectById(id);
      setProject(projectData);
      setIsLoading(false);
    }
  }, [id, getTranslatedProjectById]);

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      const success = deleteProject(projectId);
      if (success) {
        toast({
          title: "Project Deleted",
          description: `"${projectTitle}" has been removed from your portfolio.`,
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

  // Helper function to get YouTube video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper function to get Google Drive video ID
  const getGoogleDriveVideoId = (url: string): string | null => {
    const regExp = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Helper function to render video embed
  const renderVideoEmbed = (videoUrl: string) => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="relative w-full h-0 pb-[56.25%]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    } else if (videoUrl.includes('drive.google.com')) {
      const videoId = getGoogleDriveVideoId(videoUrl);
      if (videoId) {
        return (
          <div className="relative w-full h-0 pb-[56.25%]">
            <iframe
              src={`https://drive.google.com/file/d/${videoId}/preview`}
              title="Google Drive video player"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    // Fallback for other video URLs
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video size={48} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Video not supported</p>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Open Video
          </a>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/portfolio')}>
              Back to Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/portfolio')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Portfolio
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            {project.image_url && (
                              <motion.div 
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </motion.div>
            )}

            {/* Additional Images Gallery */}
            {project.images && project.images.length > 0 && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold">Project Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <motion.div 
                      key={index}
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img 
                        src={image} 
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Videos Section */}
            {project.videos && project.videos.length > 0 && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold">Project Videos</h3>
                <div className="space-y-6">
                  {project.videos.map((video, index) => (
                    <motion.div 
                      key={index}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {video.includes('youtube.com') ? (
                          <Youtube size={20} className="text-red-500" />
                        ) : video.includes('drive.google.com') ? (
                          <HardDrive size={20} className="text-blue-500" />
                        ) : (
                          <Video size={20} className="text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          {video.includes('youtube.com') ? 'YouTube Video' : 
                           video.includes('drive.google.com') ? 'Google Drive Video' : 'Video'} {index + 1}
                        </span>
                      </div>
                      {renderVideoEmbed(video)}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Content */}
            {project.content && (
              <motion.div 
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                    {project.subtitle && (
                      <p className="text-muted-foreground">{project.subtitle}</p>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  )}

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {project.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span className="text-sm">{project.location}</span>
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className="text-sm">{project.duration}</span>
                      </div>
                    )}
                    {project.team_size && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-sm">{project.team_size}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="pt-4 border-t">
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {project.project_url && (
                <Button className="w-full" onClick={() => window.open(project.project_url, '_blank')}>
                  <ExternalLink size={16} className="mr-2" />
                  View Live Demo
                </Button>
              )}
              
              {project.github_url && (
                <Button variant="outline" className="w-full" onClick={() => window.open(project.github_url, '_blank')}>
                  <Github size={16} className="mr-2" />
                  View Code
                </Button>
              )}

              {/* Admin Actions */}
              {user && (
                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/portfolio/edit/${project.id}`)}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Project
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => handleDeleteProject(project.id, project.title)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Project
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 