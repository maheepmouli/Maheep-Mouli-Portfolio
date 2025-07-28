import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash2, BookOpen, Plus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { DynamicProject, dynamicProjectsService } from '@/services/dynamicProjectsService';
import { projectsService } from '@/services/projectsService';

const Portfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const filters = ['All', 'Architecture', 'Urban Design', 'Computational Design', 'AI/ML', 'BIM', 'Research'];

  const [projects, setProjects] = useState<DynamicProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Load projects on mount and when language changes
  useEffect(() => {
    console.log('Portfolio: Language changed to:', language);
    setIsLoading(true);
    
    const loadProjects = () => {
      try {
        console.log('Portfolio: Loading projects for language:', language);
        
        // Debug: Check what's in localStorage
        const dynamicData = localStorage.getItem('dynamic_portfolio_projects');
        const regularData = localStorage.getItem('portfolio_projects');
        
        console.log('Portfolio: localStorage check:');
        console.log('Portfolio: - dynamic_portfolio_projects:', dynamicData ? 'exists' : 'not found');
        console.log('Portfolio: - portfolio_projects:', regularData ? 'exists' : 'not found');
        
        if (dynamicData) {
          try {
            const parsed = JSON.parse(dynamicData);
            console.log('Portfolio: - dynamic data has', parsed.length, 'projects');
          } catch (e) {
            console.log('Portfolio: - dynamic data is corrupted');
          }
        }
        
        if (regularData) {
          try {
            const parsed = JSON.parse(regularData);
            console.log('Portfolio: - regular data has', parsed.length, 'projects');
          } catch (e) {
            console.log('Portfolio: - regular data is corrupted');
          }
        }
        
        // Get all projects from the service
        const allProjects = dynamicProjectsService.getAllProjects();
        console.log('Portfolio: All projects from service:', allProjects);
        console.log('Portfolio: Sample project structure:', allProjects[0]);
        
        // Check if projects are missing image_urls and force refresh
        const projectsWithImages = allProjects.filter(p => p.image_url);
        console.log('Portfolio: Projects with images:', projectsWithImages.length, 'out of', allProjects.length);
        
        // If no projects exist or if projects are missing images, initialize with sample data
        if (allProjects.length === 0 || projectsWithImages.length < allProjects.length) {
          console.log('Portfolio: No projects found, initializing with sample data...');
          localStorage.removeItem('dynamic_portfolio_projects');
          const sampleProjects = dynamicProjectsService.getAllProjects();
          console.log('Portfolio: Sample projects after initialization:', sampleProjects);
          setProjects(sampleProjects);
          setIsLoading(false);
          return;
        }
        
        // Ensure we have projects before proceeding
        if (allProjects.length === 0) {
          console.log('Portfolio: Still no projects after initialization, setting empty array');
          setProjects([]);
          setIsLoading(false);
          return;
        }
        
        // Apply translations immediately
        const translatedProjects = allProjects.map(project => {
          const translation = project.translations?.[language as keyof typeof project.translations];
          if (translation) {
            // Preserve the original image_url when applying translations
            const translatedProject = { ...project, ...translation } as DynamicProject;
            // Ensure image_url is preserved from the original project
            if (project.image_url && !translatedProject.image_url) {
              translatedProject.image_url = project.image_url;
              console.log(`Portfolio: Fixed missing image_url for project "${project.title}"`);
            }
            console.log(`Portfolio: Project "${project.title}" - Original image_url: ${project.image_url}, Translated image_url: ${translatedProject.image_url}`);
            return translatedProject;
          }
          return project;
        });
        
        console.log('Portfolio: Translated projects:', translatedProjects);
        console.log('Portfolio: Image URLs:', translatedProjects.map(p => ({ title: p.title, image_url: p.image_url })));
        setProjects(translatedProjects);
      } catch (error) {
        console.error('Portfolio: Error loading projects:', error);
        const allProjects = dynamicProjectsService.getAllProjects();
        setProjects(allProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Force reload when language changes
    loadProjects();
  }, [language]); // Run on mount and when language changes

  // Listen for storage changes to reload projects when they're updated
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Portfolio: Storage changed, reloading projects...');
      const allProjects = dynamicProjectsService.getAllProjects();
      console.log('Portfolio: Storage change - All projects:', allProjects.map(p => ({ title: p.title, image_url: p.image_url })));
              const translatedProjects = allProjects.map(project => {
          const translation = project.translations?.[language as keyof typeof project.translations];
          if (translation) {
            // Preserve the original image_url when applying translations
            const translatedProject = { ...project, ...translation } as DynamicProject;
            // Ensure image_url is preserved from the original project
            if (project.image_url && !translatedProject.image_url) {
              translatedProject.image_url = project.image_url;
              console.log(`Portfolio: Storage change - Fixed missing image_url for project "${project.title}"`);
            }
            console.log(`Portfolio: Storage change - Project "${project.title}" - Original image_url: ${project.image_url}, Translated image_url: ${translatedProject.image_url}`);
            return translatedProject;
          }
          return project;
        });
      setProjects(translatedProjects);
    };

    const handleCustomStorageChange = (event: CustomEvent) => {
      console.log('Portfolio: Custom storage event received:', event.detail);
      
      // Handle different types of updates
      if (event.detail.action === 'updated' || event.detail.action === 'created' || event.detail.action === 'image-removed' || event.detail.action === 'force-refresh') {
        console.log('Portfolio: Project updated/created/image-removed/force-refresh, forcing refresh...');
        console.log('Portfolio: Action:', event.detail.action);
        console.log('Portfolio: Image URL:', event.detail.imageUrl);
        console.log('Portfolio: Project ID:', event.detail.projectId);
        
        // For image removal, force immediate refresh
        if (event.detail.action === 'image-removed') {
          console.log('Portfolio: Image removal detected, forcing immediate refresh...');
          setRefreshKey(prev => prev + 1);
          reloadProjects();
        } else {
          setTimeout(() => {
            setRefreshKey(prev => prev + 1);
            reloadProjects();
          }, 500); // Small delay to ensure data is saved
        }
      } else {
        handleStorageChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolio-updated', handleCustomStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolio-updated', handleCustomStorageChange as EventListener);
    };
  }, [language]);



  // Force re-render when language changes or projects update
  const [refreshKey, setRefreshKey] = useState(0);
  const portfolioKey = `portfolio-${language}-${refreshKey}-${Date.now()}`;

  // Utility function to handle image URLs with aggressive cache-busting
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return '';
    
    // For base64 images, return as-is
    if (url.startsWith('data:')) {
      return url;
    }
    
    // For all external URLs, add cache-busting parameter to ensure fresh content
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${timestamp}&t=${timestamp}`;
  };

  const reloadProjects = () => {
    const allProjects = dynamicProjectsService.getAllProjects();
    
    const translatedProjects = allProjects.map(project => {
      const translation = project.translations?.[language as keyof typeof project.translations];
      if (translation) {
        const translatedProject = { ...project, ...translation } as DynamicProject;
        // Ensure image_url is preserved from the original project
        if (project.image_url && !translatedProject.image_url) {
          translatedProject.image_url = project.image_url;
        }
        return translatedProject;
      }
      return project;
    });
    
    setProjects(translatedProjects);
  };

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      const success = dynamicProjectsService.deleteProject(projectId);
      if (success) {
        toast({
          title: "Project Deleted",
          description: `"${projectTitle}" has been removed from your portfolio.`,
        });
        reloadProjects(); // Reload projects after deletion
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleHireMe = () => {
    const subject = encodeURIComponent("Project Inquiry - Portfolio");
    const body = encodeURIComponent(`Hi Maheep,\n\nI'm interested in discussing a potential project with you. I found your portfolio and would like to learn more about your services.\n\nBest regards,\n[Your Name]`);
    window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(project => project.tags.includes(activeFilter));
  const featuredProjects = projects.filter(project => project.featured);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const ProjectCard = ({ project, isFeatured = false }: { project: DynamicProject; isFeatured?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Reset image error state when project changes
    useEffect(() => {
      setImageError(false);
      setImageLoading(true);
      
      // If there's no image URL, don't show loading state
      if (!project.image_url) {
        setImageLoading(false);
        return;
      }
      
      // For base64 images, set loading to false immediately since they load instantly
      if (project.image_url.startsWith('data:')) {
        setImageLoading(false);
        setImageError(false);
      }
    }, [project.id, project.image_url]);

    return (
      <motion.div
        variants={itemVariants}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-hidden">
            {project.image_url && !imageError ? (
              <img 
                src={getOptimizedImageUrl(project.image_url)} 
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => {
                  setImageError(false);
                  setImageLoading(false);
                }}
              />
            ) : null}
            {imageLoading && project.image_url && !imageError ? (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
                </div>
              </div>
            ) : null}
            {(!project.image_url || imageError) && !imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon size={48} className="mx-auto mb-2" />
                  <p className="text-sm">No cover image</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Admin Actions */}
            {user && (
              <motion.div 
                className="absolute top-4 left-4 flex gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/portfolio/edit/${project.id}`}>
                  <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background backdrop-blur-sm">
                    <Edit size={14} />
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="bg-background/90 hover:bg-destructive hover:text-destructive-foreground backdrop-blur-sm"
                  onClick={() => handleDeleteProject(project.id, project.title)}
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="p-6">
            <motion.h4 
              className="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {project.title}
            </motion.h4>
            <p className="text-muted-foreground text-sm mb-3">
              {project.subtitle}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {isFeatured ? project.description : project.description.slice(0, 100) + '...'}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
              {project.technologies.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 2}
                </Badge>
              )}
            </div>
            
            <motion.div 
              className="flex gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/portfolio/${project.id || 'unknown'}`} onClick={() => {
                console.log('Portfolio: Clicking View Project for:', project.id, project.title);
                console.log('Portfolio: Current URL will be:', `/portfolio/${project.id || 'unknown'}`);
              }}>
                <Button size="sm" className="btn-hero flex-1">
                  <Eye size={16} className="mr-2" />
                  View Project
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <section id="portfolio" className="section-spacing" key={portfolioKey}>
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6"> 
            My <span className="kinetic-text">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('portfolio.subtitle')}
          </p>
          
          {user && (
            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link to="/portfolio/create">
                <Button className="btn-hero">
                  <Plus size={18} className="mr-2" />
                  {t('portfolio.addNewProject')}
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Projects */}
        {isLoading ? (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('portfolio.featuredProjects')}
            </motion.h3>
            
            {/* Always show projects, even if empty */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProjects.length > 0 ? (
                featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} isFeatured={true} />
                ))
              ) : (
                // Show all projects if no featured projects
                projects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.id} project={project} isFeatured={true} />
                ))
              )}
            </motion.div>
            

            

          </motion.div>
        )}

        {/* Upload Cover Images Message */}
        {projects.length > 0 && projects.every(p => !p.image_url) && (
          <motion.div 
            className="w-full mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ImageIcon size={20} />
              <p className="text-sm font-medium">Upload Cover Images</p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Click "Edit" on any project to upload your own cover images. The current projects are using placeholder images.
            </p>
          </motion.div>
        )}

        {/* Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {filters.map((filter) => (
            <motion.div
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className="transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                {filter}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* All Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              // Show all projects if no filtered projects
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </motion.div>
        )}

        {/* Show message if no projects at all */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found. Please add some projects to your portfolio.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground color-wave-text"
              onClick={() => window.open("https://www.calameo.com/read/007995635f849de9a792d", "_blank")}
            >
              <BookOpen size={18} className="mr-2" />
              {t('portfolio.digitalPortfolio')}
            </Button>
            
            <Button
              size="lg"
              className="btn-hero text-lg px-8 py-3"
              onClick={handleHireMe}
            >
              {t('portfolio.hireMe')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio; 