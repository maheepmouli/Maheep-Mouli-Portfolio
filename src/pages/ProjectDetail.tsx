import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Github, MapPin, Clock, Users, Edit, Trash2, Video, Youtube, HardDrive, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDynamicTranslatedProjects, DynamicProject, dynamicProjectsService } from '@/services/dynamicProjectsService';
import { projectsService } from '@/services/projectsService';
import Navigation from '@/components/Navigation';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { getTranslatedProjectById, deleteProject } = useDynamicTranslatedProjects();

  const [project, setProject] = useState<DynamicProject | null>(null);
  const [projectImages, setProjectImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ProjectDetail: useEffect triggered with id:', id);
    if (id && id !== 'unknown') {
      console.log('ProjectDetail: Loading project with ID:', id);
      setIsLoading(true);
      
      const loadProject = async () => {
        try {
          // First try: Get from dynamicProjectsService
          let projectData = getTranslatedProjectById(id);
          console.log('ProjectDetail: Retrieved from dynamicProjectsService:', projectData);
          
          // Debug: Check all projects in both services
          const allDynamicProjects = dynamicProjectsService.getAllProjects();
          const allRegularProjects = projectsService.getAllProjects();
          console.log('ProjectDetail: All dynamic projects:', allDynamicProjects.map(p => ({ id: p.id, title: p.title })));
          console.log('ProjectDetail: All regular projects:', allRegularProjects.map(p => ({ id: p.id, title: p.title })));
          
          // Second try: If not found, try projectsService
          if (!projectData) {
            console.log('ProjectDetail: Project not found in dynamicProjectsService, checking projectsService...');
            const regularProject = projectsService.getProjectById(id);
            console.log('ProjectDetail: Retrieved from projectsService:', regularProject);
            
            if (regularProject) {
              console.log('ProjectDetail: Found project in projectsService, converting...');
              // Convert to DynamicProject format
              projectData = {
                ...regularProject,
                translations: {
                  en: regularProject,
                  es: regularProject,
                  ca: regularProject
                }
              } as DynamicProject;
              
              // Also sync to dynamicProjectsService for future consistency
              const syncResult = dynamicProjectsService.updateProject(id, projectData);
              console.log('ProjectDetail: Synced to dynamicProjectsService:', syncResult);
            }
          }
          
          // Third try: If still not found, wait a bit and retry (for newly created projects)
          if (!projectData) {
            console.log('ProjectDetail: Project still not found, waiting and retrying...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            projectData = getTranslatedProjectById(id);
            if (!projectData) {
              const regularProject = projectsService.getProjectById(id);
              if (regularProject) {
                projectData = {
                  ...regularProject,
                  translations: {
                    en: regularProject,
                    es: regularProject,
                    ca: regularProject
                  }
                } as DynamicProject;
              }
            }
          }
          
          console.log('ProjectDetail: Final project data:', projectData);
          
          if (projectData) {
            setProject(projectData);
            
            // Load project images with error handling
            try {
              const images = projectsService.getProjectImages(id);
              console.log('ProjectDetail: Loaded project images:', images);
              console.log('ProjectDetail: Number of images found:', images?.length || 0);
              setProjectImages(images || []);
            } catch (error) {
              console.error('ProjectDetail: Error loading project images:', error);
              setProjectImages([]);
            }
          } else {
            console.error('ProjectDetail: Project not found in any service after retry');
            toast({
              title: "Project Not Found",
              description: "The requested project could not be found. Please try refreshing the page.",
              variant: "destructive"
            });
            navigate('/portfolio');
          }
        } catch (error) {
          console.error('ProjectDetail: Error loading project:', error);
          toast({
            title: "Error Loading Project",
            description: "Failed to load project details.",
            variant: "destructive"
          });
          navigate('/portfolio');
        } finally {
          setIsLoading(false);
        }
      };
      
      // Force reload when id changes
      loadProject();
    }
  }, [id, getTranslatedProjectById, navigate, toast]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Loading Project...</h1>
            <p className="text-muted-foreground mb-6">
              Please wait while we fetch the project details.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('ProjectDetail: Debug - Current ID:', id);
                console.log('ProjectDetail: Debug - All dynamic projects:', dynamicProjectsService.getAllProjects());
                console.log('ProjectDetail: Debug - All regular projects:', projectsService.getAllProjects());
                console.log('ProjectDetail: Debug - Project images:', projectImages);
                console.log('ProjectDetail: Debug - localStorage images:', localStorage.getItem('portfolio_images'));
              }}
            >
              Debug Project Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!project || id === 'unknown') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {id === 'unknown' 
                ? "The project ID is not available. Please try refreshing the page."
                : "The project you're looking for doesn't exist."
              }
            </p>
            <Button onClick={() => navigate('/portfolio')}>
              Back to Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for malformed project data
  if (!project.title || !project.id) {
    console.error('ProjectDetail: Malformed project data:', project);
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Project Data</h1>
            <p className="text-muted-foreground mb-6">
              The project data is corrupted. Please try refreshing the page.
            </p>
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
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {typeof video === 'string' ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            {(video as any).url?.includes('youtube.com') ? (
                              <Youtube size={20} className="text-red-500" />
                            ) : (video as any).url?.includes('drive.google.com') ? (
                              <HardDrive size={20} className="text-blue-500" />
                            ) : (
                              <Video size={20} className="text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">
                              {(video as any).url?.includes('youtube.com') ? 'YouTube Video' : 
                               (video as any).url?.includes('drive.google.com') ? 'Google Drive Video' : 'Video'} {index + 1}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Video Embed */}
                      {renderVideoEmbed(typeof video === 'string' ? video : (video as any).url)}
                      
                      {/* Video Description */}
                      {(video as any).description && (
                        <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {(video as any).description}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Images */}
            {projectImages && projectImages.length > 0 && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-semibold mb-4">Project Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectImages.map((image, index) => {
                    try {
                      return (
                        <motion.div 
                          key={image.id || index}
                          className="space-y-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <div className="relative group">
                            <img
                              src={image.image_url}
                              alt={image.alt_text || image.caption || `Project image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                              style={{
                                width: image.width || '100%',
                                height: image.height || 'auto'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden absolute inset-0 bg-muted flex items-center justify-center rounded-lg">
                              <div className="text-center text-muted-foreground">
                                <ImageIcon size={48} className="mx-auto mb-2" />
                                <p className="text-sm">Image not found</p>
                              </div>
                            </div>
                          </div>
                          {image.caption && (
                            <p className="text-sm text-muted-foreground text-center">
                              {image.caption}
                            </p>
                          )}
                        </motion.div>
                      );
                    } catch (error) {
                      console.error('ProjectDetail: Error rendering image:', error);
                      return null;
                    }
                  })}
                </div>
              </motion.div>
            )}

            {/* Project Content */}
            {project.content && (
              <motion.div 
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                <div 
                  className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: project.content.replace(/\n/g, '<br>') 
                  }}
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