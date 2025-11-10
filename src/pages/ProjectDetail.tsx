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
import { unifiedProjectsService, UnifiedProject } from '@/services/unifiedProjectsService';
import Navigation from '@/components/Navigation';

// Helper function to render formatted text (markdown/HTML to HTML)
const renderFormattedText = (text: string): string => {
  if (!text) return '';
  
  let html = text
    // Process markdown bold and italic first
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Handle markdown underline
    .replace(/__(.*?)__/g, '<u class="underline decoration-current">$1</u>')
    // Handle HTML underline tags - preserve nested formatting
    .replace(/<u>((?:[^<]|<(?!\/u>)(?:[^<]|<(?!\/u>))*?)*?)<\/u>/g, (match, content) => {
      return `<u class="underline decoration-current">${content}</u>`;
    })
    // Handle color spans
    .replace(/<span style="color: ([^"]+)">(.*?)<\/span>/g, '<span style="color: $1">$2</span>')
    // Handle gradient spans
    .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(.*?)<\/span>/g, '<span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$2</span>')
    // Fix nested structures: If span wraps underline, reorder so underline wraps span
    .replace(/<span style="color: ([^"]+)">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="color: $1">$3</span></u>')
    .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$3</span></u>');
  
  return html;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [project, setProject] = useState<UnifiedProject | null>(null);
  const [projectImages, setProjectImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ProjectDetail: useEffect triggered with id:', id);
    if (id && id !== 'unknown') {
      console.log('ProjectDetail: Loading project with ID:', id);
      setIsLoading(true);
      
      const loadProject = async () => {
        try {
          // Use unifiedProjectsService to get project
          const projectData = await unifiedProjectsService.getProjectById(id);
          console.log('ProjectDetail: Retrieved from unifiedProjectsService:', projectData);
          console.log('ProjectDetail: Project image_url:', projectData?.image_url);
          console.log('ProjectDetail: Project image_url type:', typeof projectData?.image_url);
          console.log('ProjectDetail: Project image_url length:', projectData?.image_url?.length);
          console.log('ProjectDetail: Project videos:', projectData?.videos);
          console.log('ProjectDetail: Project videos length:', projectData?.videos?.length);
          console.log('ProjectDetail: Project videos type:', typeof projectData?.videos);
          
          if (projectData) {
            setProject(projectData);
            
            // Use the project's images or project_images data if available
            const projectImages = projectData.images || projectData.project_images || [];
            if (projectImages.length > 0) {
              console.log('ProjectDetail: Found project images:', projectImages);
              setProjectImages(projectImages.map((imageUrl, index) => ({
                id: `project-image-${index}`,
                image_url: imageUrl,
                caption: `Project image ${index + 1}`,
                alt_text: `Project image ${index + 1}`,
                sort_order: index,
                width: '100%',
                height: 'auto'
              })));
            } else {
              console.log('ProjectDetail: No project images found');
              setProjectImages([]);
            }
          } else {
            console.error('ProjectDetail: Project not found in unified service');
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
  }, [id, navigate, toast]);

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      try {
        const success = await unifiedProjectsService.deleteProject(projectId);
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
      } catch (error) {
        console.error('ProjectDetail: Error deleting project:', error);
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



  // Helper function to get Google Drive embed URL
  const getGoogleDriveEmbedUrl = (url: string): string => {
    const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
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
    }
    
    // Handle Google Drive videos
    if (videoUrl.includes('drive.google.com')) {
      return (
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            src={getGoogleDriveEmbedUrl(videoUrl)}
            title="Google Drive video player"
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    
    // Alternative: Try to embed as HTML5 video for supported formats
    if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return (
        <video 
          controls 
          className="w-full h-64 rounded-lg"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // Fallback for other video URLs
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Video size={48} className="mx-auto mb-2 !text-white/60" />
          <p className="text-sm !text-white/70">Video not supported</p>
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
            <p className="!text-white/90 mb-6 font-medium">
              Please wait while we fetch the project details.
            </p>

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
            <p className="!text-white/90 mb-6 font-medium">
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
            <p className="!text-white/90 mb-6 font-medium">
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
            {(() => {
              console.log('ProjectDetail: Rendering image with URL:', project.image_url);
              return project.image_url && (
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
                    onLoad={() => console.log('ProjectDetail: Image loaded successfully')}
                    onError={(e) => {
                      console.error('ProjectDetail: Image failed to load:', e);
                      console.error('ProjectDetail: Failed image URL:', project.image_url);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </motion.div>
              );
            })()}



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
                              <div className="text-center !text-white/70">
                                <ImageIcon size={48} className="mx-auto mb-2" />
                                <p className="text-sm">Image not found</p>
                              </div>
                            </div>
                          </div>
                          {image.caption && (
                            <p className="text-sm !text-white/80 text-center font-medium">
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

            {/* Project Videos */}
            {project.videos && project.videos.length > 0 && (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold mb-4">Project Videos</h3>
                <div className="space-y-6">
                  {project.videos.map((video, index) => (
                    <motion.div 
                      key={video.id || index}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <div className="relative">
                        <h4 className="font-medium mb-2">{video.title}</h4>
                        {video.description && (
                          <p className="text-sm !text-white/80 mb-3 font-medium">{video.description}</p>
                        )}
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          {renderVideoEmbed(video.url)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Content with Enhanced Markdown Rendering */}
            {project.content && (
              <motion.div 
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="mb-6 pb-4 border-b border-border/50">
                  <h3 className="text-2xl font-bold mb-2 !text-white bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    Project Details
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
                <div 
                  className="rich-content !text-white/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      let html = project.content
                        // Headers
                        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 !text-white">$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 !text-white">$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 !text-white">$1</h1>')
                        // Bold, Italic, Underline - Process in correct order
                        // First handle bold
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold !text-white">$1</strong>')
                        // Then italic
                        .replace(/\*(.*?)\*/g, '<em class="italic !text-white/90">$1</em>')
                        // Handle markdown underline
                        .replace(/__(.*?)__/g, '<u class="underline decoration-current">$1</u>')
                        // Handle HTML underline tags - preserve any nested formatting
                        .replace(/<u>((?:[^<]|<(?!\/u>)(?:[^<]|<(?!\/u>))*?)*?)<\/u>/g, (match, content) => {
                          // Content might have <strong>, <span>, etc. - preserve them all
                          // The underline will inherit the text color from nested elements via decoration-current
                          return `<u class="underline decoration-current">${content}</u>`;
                        })
                        // Handle color spans
                        .replace(/<span style="color: ([^"]+)">(.*?)<\/span>/g, '<span style="color: $1">$2</span>')
                        // Handle gradient spans  
                        .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(.*?)<\/span>/g, '<span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$2</span>')
                        // Fix nested structures: If span wraps underline, reorder so underline wraps span
                        // This ensures underline inherits the color/gradient from the span
                        .replace(/<span style="color: ([^"]+)">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="color: $1">$3</span></u>')
                        .replace(/<span style="background: ([^"]+); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">(<u[^>]*>)(.*?)(<\/u>)<\/span>/g, '<u class="underline decoration-current"><span style="background: $1; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">$3</span></u>')
                        // Code blocks
                        .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto border border-border/50"><code class="text-sm !text-white/90 font-mono">$1</code></pre>')
                        .replace(/`(.*?)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono !text-primary border border-primary/20">$1</code>')
                        // Links
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium transition-colors hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>')
                        // Images
                        .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-6"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-xl border border-border/50 hover:shadow-2xl transition-shadow" /></div>')
                        // Lists
                        .replace(/^- (.*)/gm, '<li class="ml-6 mb-2 !text-white/90 list-disc">$1</li>')
                        .replace(/^1\. (.*)/gm, '<li class="ml-6 mb-2 !text-white/90 list-decimal">$1</li>')
                        // Blockquotes
                        .replace(/^> (.*)/gm, '<blockquote class="border-l-4 border-primary pl-6 italic my-4 !text-white/80 bg-muted/30 py-3 rounded-r-lg">$1</blockquote>')
                        // Paragraphs
                        .replace(/\n\n/g, '</p><p class="mb-4 !text-white/90 leading-relaxed">')
                        .replace(/\n/g, '<br>');
                      
                      // Wrap in paragraph if not already wrapped
                      if (!html.startsWith('<')) {
                        html = '<p class="mb-4 !text-white/90 leading-relaxed">' + html + '</p>';
                      } else if (!html.includes('<p')) {
                        html = '<p class="mb-4 !text-white/90 leading-relaxed">' + html + '</p>';
                      }
                      
                      // Wrap lists in ul/ol tags
                      html = html.replace(/(<li[^>]*>.*?<\/li>)/g, (match) => {
                        if (match.includes('list-disc')) {
                          return '<ul class="my-4 space-y-2">' + match + '</ul>';
                        } else if (match.includes('list-decimal')) {
                          return '<ol class="my-4 space-y-2 list-decimal list-inside">' + match + '</ol>';
                        }
                        return match;
                      });
                      
                      return html;
                    })()
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
                    <h2 
                      className="text-2xl font-bold mb-2"
                      dangerouslySetInnerHTML={{ __html: renderFormattedText(project.title) }}
                    />
                    {project.subtitle && (
                      <p 
                        className="!text-white/90 font-medium"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(project.subtitle) }}
                      />
                    )}
                  </div>

                  {project.description && (
                    <p 
                      className="text-sm !text-white/80 font-medium"
                      dangerouslySetInnerHTML={{ __html: renderFormattedText(project.description) }}
                    />
                  )}

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {project.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="!text-white/60" />
                        <span className="text-sm !text-white/80 font-medium">{project.location}</span>
                      </div>
                    )}
                    {project.subtitle && !project.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="!text-white/60" />
                        <span 
                          className="text-sm !text-white/80 font-medium"
                          dangerouslySetInnerHTML={{ __html: renderFormattedText(project.subtitle) }}
                        />
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="!text-white/60" />
                        <span className="text-sm !text-white/80 font-medium">{project.duration}</span>
                      </div>
                    )}
                    {project.team_size && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="!text-white/60" />
                        <span className="text-sm !text-white/80 font-medium">{project.team_size}</span>
                      </div>
                    )}
                  </div>

                  {/* Project Status and Featured Badge */}
                  <div className="pt-4 border-t space-y-2">
                    {/* Status Badge */}
                    {project.status && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {project.status}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Featured Project</Badge>
                      </div>
                    )}
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



            {/* Action Buttons */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {project.live_url && (
                <Button className="w-full" onClick={() => window.open(project.live_url, '_blank')}>
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
              
              {project.project_url && (
                <Button variant="outline" className="w-full" onClick={() => window.open(project.project_url, '_blank')}>
                  <ExternalLink size={16} className="mr-2" />
                  Project URL
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