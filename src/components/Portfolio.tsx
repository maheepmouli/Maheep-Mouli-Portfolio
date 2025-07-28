import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash2, BookOpen, Plus } from 'lucide-react';
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
    setIsLoading(true);
    try {
      console.log('Loading projects for language:', language);
      
      // Get all projects from the service
      const allProjects = dynamicProjectsService.getAllProjects();
      console.log('All projects from service:', allProjects);
      
      // If no projects exist, initialize with sample data
      if (allProjects.length === 0) {
        console.log('No projects found, initializing with sample data...');
        dynamicProjectsService.clearAllData();
        const sampleProjects = dynamicProjectsService.getAllProjects();
        console.log('Sample projects after initialization:', sampleProjects);
        setProjects(sampleProjects);
        setIsLoading(false);
        return;
      }
      
      // Apply translations immediately
      const translatedProjects = allProjects.map(project => {
        const translation = project.translations?.[language as keyof typeof project.translations];
        if (translation) {
          return { ...project, ...translation } as DynamicProject;
        }
        return project;
      });
      
      setProjects(translatedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      const allProjects = dynamicProjectsService.getAllProjects();
      setProjects(allProjects);
    } finally {
      setIsLoading(false);
    }
  }, [language]); // Run on mount and when language changes

  // Listen for storage changes to reload projects when they're updated
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Storage changed, reloading projects...');
      const allProjects = dynamicProjectsService.getAllProjects();
      const translatedProjects = allProjects.map(project => {
        const translation = project.translations?.[language as keyof typeof project.translations];
        if (translation) {
          return { ...project, ...translation } as DynamicProject;
        }
        return project;
      });
      setProjects(translatedProjects);
    };

    // Also check for changes from projectsService
    const checkForUpdates = () => {
      const projectsServiceProjects = projectsService.getAllProjects();
      if (projectsServiceProjects.length > 0) {
        console.log('Found projects in projectsService, syncing...');
        // Convert projectsService projects to dynamicProjectsService format
        const convertedProjects = projectsServiceProjects.map(project => ({
          ...project,
          translations: {
            en: project,
            es: project,
            ca: project
          }
        }));
        
        // Save to dynamicProjectsService
        localStorage.setItem('dynamic_portfolio_projects', JSON.stringify(convertedProjects));
        
        // Reload projects
        const allProjects = dynamicProjectsService.getAllProjects();
        const translatedProjects = allProjects.map(project => {
          const translation = project.translations?.[language as keyof typeof project.translations];
          if (translation) {
            return { ...project, ...translation } as DynamicProject;
          }
          return project;
        });
        setProjects(translatedProjects);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 2 seconds
    const interval = setInterval(checkForUpdates, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [language]);



  // Force re-render when language changes by adding a key
  const portfolioKey = `portfolio-${language}`;

  const reloadProjects = () => {
    const allProjects = dynamicProjectsService.getAllProjects();
    setProjects(allProjects);
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
    const subject = encodeURIComponent('Hire Request - Portfolio Project');
    const body = encodeURIComponent(`Hi Maheep,

I saw your portfolio and would like to discuss a collaboration opportunity with you.

My requirements:
- [Describe your project needs]
- [Timeline]
- [Budget range]

Please let me know when you're available for a call.

Best regards,
[Your name]`);
    
    window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDebugReset = () => {
    dynamicProjectsService.clearAllData();
    reloadProjects();
    toast({
      title: "Debug Reset",
      description: "Project data has been reset and reinitialized.",
    });
  };

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(project => project.tags.includes(activeFilter));
  const featuredProjects = projects.filter(project => project.featured);

  console.log('Portfolio Debug:', {
    projectsLength: projects.length,
    featuredProjectsLength: featuredProjects.length,
    filteredProjectsLength: filteredProjects.length,
    isLoading,
    projects: projects,
    featuredProjects: featuredProjects
  });

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

    return (
      <motion.div
        variants={itemVariants}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-hidden">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
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
              <Link to={`/portfolio/${project.id}`}>
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
              <Button 
                variant="outline" 
                onClick={handleDebugReset}
                className="ml-4"
              >
                Debug Reset
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Current language:', language);
                  console.log('Current projects:', projects);
                  console.log('All projects from service:', dynamicProjectsService.getAllProjects());
                  toast({
                    title: "Debug Info",
                    description: `Language: ${language}, Projects: ${projects.length}`,
                  });
                }}
                className="ml-2"
              >
                Debug Info
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  reloadProjects();
                  toast({
                    title: "Reload Projects",
                    description: "Projects reloaded manually",
                  });
                }}
                className="ml-2"
              >
                Reload
              </Button>
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
            
            {/* Debug info */}
            {projects.length === 0 && (
              <div className="text-center mt-8 p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">No projects found. Click the Debug Reset button to initialize sample projects.</p>
              </div>
            )}
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
            <p className="text-muted-foreground text-lg">No projects found. Please use the Debug Reset button to initialize sample projects.</p>
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