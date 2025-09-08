import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2, BookOpen, Plus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { unifiedProjectsService, UnifiedProject } from '@/services/unifiedProjectsService';

const Portfolio = () => {
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  // Translated filters
  const filters = [
    t('filters.all'),
    t('filters.python'),
    t('filters.react'),
    t('filters.rhino'),
    t('filters.grasshopper'),
    t('filters.robotics'),
    t('filters.research'),
    t('filters.architecture')
  ];
  
  // Category mapping for better filtering (using original English keys for mapping)
  const categoryMapping = {
    [t('filters.python')]: ['Python', 'TensorFlow', 'AI/ML'],
    [t('filters.react')]: ['React', 'Node.js', 'Web Development'],
    [t('filters.rhino')]: ['Rhino', 'Grasshopper', 'Computational Design'],
    [t('filters.grasshopper')]: ['Rhino', 'Grasshopper', 'Computational Design'],
    [t('filters.robotics')]: ['Robotics', 'Fabrication'],
    [t('filters.research')]: ['Research', 'Material Science', 'Thermal Analysis', 'Bio-materials'],
    [t('filters.architecture')]: ['Architecture', 'Urban Planning', 'AutoCAD', 'SketchUp', 'Architectural Design']
  };

  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const fallbackProjects = [
    {
      id: '1',
      title: 'Flow-SIGHT',
      slug: 'flow-sight',
      subtitle: 'Real-time Congestion Prediction Dashboard',
      description: 'AI-powered urban mobility analysis system using Graph Neural Networks to predict traffic patterns and optimize city flow in real-time.',
      content: 'FLOW-SIGHT\nPredictive Urban Mobility Intelligence\n\nAn advanced AI-powered urban mobility analysis system that leverages Graph Neural Networks to predict traffic patterns and optimize city flow in real-time. The system provides real-time congestion prediction, dynamic route optimization, and comprehensive urban mobility insights.',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      project_images: [],
      technologies: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
      github_url: 'https://github.com/maheepmouli/flow-sight',
      live_url: 'https://flow-sight.demo.com',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'HYPAR PORTABLES',
      slug: 'hypar-portables',
      subtitle: 'Robotic Assembly of Lightweight Cork Modules for Adaptive Urbanism',
      description: 'Hypar Portables is a robotically fabricated, modular seating system created using natural cork panels. The project explores adaptive urbanism through lightweight, sustainable materials and robotic assembly techniques.',
      content: 'HYPAR PORTABLES\nRobotic Assembly of Lightweight Cork Modules for Adaptive Urbanism\n\nThis innovative project explores the intersection of robotic fabrication, sustainable materials, and adaptive urban design. Using natural cork panels, we created a modular seating system that can be robotically assembled and adapted to various urban contexts.',
      image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      project_images: [],
      technologies: ['Rhino', 'Grasshopper', 'Python', 'Robotics', 'Cork Materials'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'R&E - BioFoam Thermal Performance',
      slug: 'biofoam-thermal-performance',
      subtitle: 'Investigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics',
      description: 'This project investigates the thermal performance of bio-based materials by experimenting with bioplastics derived from banana and agar. The research focuses on porosity optimization for thermal insulation applications.',
      content: 'R&E - BIOFOAM THERMAL PERFORMANCE\nInvestigating Porosity & Thermal Insulation in Banana-Agar Based Bioplastics\n\nThis research project explores the thermal properties of bio-based materials, specifically focusing on bioplastics derived from banana and agar. The study investigates how porosity affects thermal insulation performance in sustainable building materials.',
      image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      project_images: [],
      technologies: ['Material Science', 'Thermal Analysis', 'Bio-materials', 'Research'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Blasters Park: Multi-Functional Stadium Complex',
      slug: 'blasters-park-stadium',
      subtitle: 'Bachelor Thesis Project - 52 Acres of Integrated Design Thinking',
      description: 'A 52-acre urban-scale stadium and recreational complex designed as a comprehensive thesis project. The development integrates multiple functions within a cohesive urban framework.',
      content: 'BLASTERS PARK: MULTI-FUNCTIONAL STADIUM COMPLEX\nBachelor Thesis Project - 52 Acres of Integrated Design Thinking\n\nThis comprehensive thesis project explores the design of a 52-acre urban-scale stadium and recreational complex. The project demonstrates integrated design thinking across multiple scales, from urban planning to architectural detail.',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      project_images: [],
      technologies: ['AutoCAD', 'SketchUp', 'Urban Planning', 'Architectural Design'],
      github_url: '',
      live_url: '',
      featured: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // First cleanup any duplicate projects
      await unifiedProjectsService.cleanupProjects();
      
      const projects = await unifiedProjectsService.getAllProjects();
      console.log('Portfolio: Loaded projects:', projects.length, projects);
      setProjects(projects);
      
      // Preload images for better performance
      projects.forEach(project => {
        if (project.image_url && !project.image_url.startsWith('data:')) {
          const img = new Image();
          img.src = project.image_url;
        }
      });
    } catch (error) {
      console.error('Portfolio: Error loading projects:', error);
      console.log('Portfolio: Using fallback projects:', fallbackProjects.length);
      setProjects(fallbackProjects);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    
    // Preload images for better performance
    const preloadImages = (projects: UnifiedProject[]) => {
      projects.forEach(project => {
        if (project.image_url && !project.image_url.startsWith('data:')) {
          const img = new Image();
          img.src = project.image_url;
        }
      });
    };
    
    // Listen for project updates to refresh the data
    const handleProjectUpdate = (event: CustomEvent) => {
      if (event.detail.action === 'updated' || event.detail.action === 'created') {
        loadProjects();
      }
    };
    
    window.addEventListener('projectUpdate', handleProjectUpdate as EventListener);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('projectUpdate', handleProjectUpdate as EventListener);
    };
  }, [language]);

  // Update activeFilter when language changes to ensure "All" filter works correctly
  useEffect(() => {
    if (activeFilter === 'All') {
      setActiveFilter(t('filters.all'));
    }
  }, [language, activeFilter, t]);

  const filteredProjects = activeFilter === t('filters.all') || activeFilter === 'All'
    ? projects 
    : projects.filter(project => {
        // Check if any of the project's technologies match the selected category
        const categoryTechnologies = categoryMapping[activeFilter] || [];
        console.log('Portfolio: Filtering projects for:', activeFilter, 'with technologies:', categoryTechnologies);
        return project.technologies.some(tech => 
          categoryTechnologies.some(catTech => 
            tech.toLowerCase().includes(catTech.toLowerCase()) || 
            catTech.toLowerCase().includes(tech.toLowerCase())
          )
        );
      });

  console.log('Portfolio: Active filter:', activeFilter, 'Projects:', projects.length, 'Filtered:', filteredProjects.length);

  // Animation variants for portfolio content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const ProjectCard = ({ project }: { project: UnifiedProject }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Reset image error state when project changes
    useEffect(() => {
      setImageError(false);
      
      if (!project.image_url || project.image_url === '') {
        setImageLoading(false);
        setImageError(false);
        return;
      }
      
      if (project.image_url.startsWith('data:')) {
        setImageLoading(false);
        setImageError(false);
      } else {
        setImageLoading(true);
        // Force image to start loading
        const img = new Image();
        img.onload = () => {
          setImageError(false);
          setImageLoading(false);
        };
        img.onerror = () => {
          setImageError(true);
          setImageLoading(false);
        };
        img.src = project.image_url;
      }
    }, [project.id, project.image_url]);

    return (
      <motion.div
        variants={itemVariants}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-hidden">
            {/* Loading State */}
            {imageLoading && project.image_url && !imageError && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center !text-white/70">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm font-medium">{t('project.loading')}</p>
                </div>
              </div>
            )}
            
            {/* Image */}
            {project.image_url && !imageError && !imageLoading && (
              <img 
                src={project.image_url} 
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
            )}
            
            {/* Fallback for no image or error */}
            {(!project.image_url || imageError) && !imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center !text-white/70">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen size={24} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">{project.title}</p>
                      <p className="text-xs !text-white/60 mt-1 font-medium">{t('portfolio.projectPreview')}</p>
                    </div>
                  </div>
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
                  onClick={async () => {
                    if (confirm(t('project.actions.confirmDelete', { title: project.title }))) {
                      try {
                        const success = await unifiedProjectsService.deleteProject(project.id);
                        
                        if (success) {
                          toast({
                            title: t('project.actions.deleteSuccess'),
                            description: t('project.actions.deleteDescription', { title: project.title }),
                          });
                          
                          // Refresh the projects list
                          loadProjects();
                        } else {
                          toast({
                            title: t('project.actions.deleteFailed'),
                            description: t('project.actions.deleteError'),
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error('Portfolio: Error deleting project:', error);
                        toast({
                          title: t('common.error'),
                          description: t('project.actions.deleteErrorDescription'),
                          variant: "destructive"
                        });
                      }
                    }
                  }}
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
            <p className="!text-white/80 text-sm mb-3 font-medium">
              {project.subtitle}
            </p>
            <p className="!text-white/70 text-sm leading-relaxed mb-4 font-medium">
              {project.description.slice(0, 100) + '...'}
            </p>
            
            {/* Status and Featured Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.status && (
                <Badge variant="secondary" className="text-xs">
                  {t(`project.status.${project.status.toLowerCase()}`)}
                </Badge>
              )}
              {project.featured && (
                <Badge variant="default" className="text-xs">
                  {t('project.status.featured')}
                </Badge>
              )}
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/portfolio/${project.id || 'unknown'}`}>
                <Button size="sm" className="btn-hero flex-1">
                  <Eye size={16} className="mr-2" />
                  {t('portfolio.viewProject')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const FeaturedProjectCard = ({ project }: { project: UnifiedProject }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Reset image error state when project changes
    useEffect(() => {
      setImageError(false);
      
      if (!project.image_url || project.image_url === '') {
        setImageLoading(false);
        setImageError(false);
        return;
      }
      
      if (project.image_url.startsWith('data:')) {
        setImageLoading(false);
        setImageError(false);
      } else {
        setImageLoading(true);
        // Force image to start loading
        const img = new Image();
        img.onload = () => {
          setImageError(false);
          setImageLoading(false);
        };
        img.onerror = () => {
          setImageError(true);
          setImageLoading(false);
        };
        img.src = project.image_url;
      }
    }, [project.id, project.image_url]);

    return (
      <motion.div
        variants={itemVariants}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer' }}
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.3 }
        }}
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl border-2 border-primary/20 hover:border-primary/40">
          <div className="relative overflow-hidden">
            {/* Loading State */}
            {imageLoading && project.image_url && !imageError && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center !text-white/70">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm font-medium">Loading...</p>
                </div>
              </div>
            )}
            
            {/* Image */}
            {project.image_url && !imageError && !imageLoading && (
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => {
                  setImageError(false);
                  setImageLoading(false);
                }}
              />
            )}
            
            {/* Fallback for no image or error */}
            {(!project.image_url || imageError) && !imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center !text-white/70">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen size={24} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">{project.title}</p>
                      <p className="text-xs !text-white/60 mt-1 font-medium">{t('portfolio.featuredProject')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Featured Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {t('project.status.featured')}
              </Badge>
            </div>
            
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
                  onClick={async () => {
                    if (confirm(t('project.actions.confirmDelete', { title: project.title }))) {
                      try {
                        const success = await unifiedProjectsService.deleteProject(project.id);
                        
                        if (success) {
                          toast({
                            title: t('project.actions.deleteSuccess'),
                            description: t('project.actions.deleteDescription', { title: project.title }),
                          });
                          
                          // Refresh the projects list
                          loadProjects();
                        } else {
                          toast({
                            title: t('project.actions.deleteFailed'),
                            description: t('project.actions.deleteError'),
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error('Portfolio: Error deleting project:', error);
                        toast({
                          title: t('common.error'),
                          description: t('project.actions.deleteErrorDescription'),
                          variant: "destructive"
                        });
                      }
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="p-8">
            <motion.h4 
              className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {project.title}
            </motion.h4>
            <p className="!text-white/80 text-base mb-4 font-medium">
              {project.subtitle}
            </p>
            <p className="!text-white/70 text-sm leading-relaxed mb-6 font-medium">
              {project.description.slice(0, 150) + '...'}
            </p>
            
            {/* Status Badge */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.status && (
                <Badge variant="secondary" className="text-xs">
                  {t(`project.status.${project.status.toLowerCase()}`)}
                </Badge>
              )}
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/portfolio/${project.id || 'unknown'}`}>
                <Button size="lg" className="btn-hero flex-1">
                  <Eye size={18} className="mr-2" />
                  {t('portfolio.viewProject')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const shouldShowButton = user; // Only show for authenticated users, not visitors

  return (
    <motion.section 
      id="portfolio" 
      className="section-spacing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 underline-effect !text-white">
            {t('portfolio.title')}
          </h2>
          <p className="text-base sm:text-lg !text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto font-medium px-4">
            {t('portfolio.subtitle')}
          </p>
        </motion.div>

        {/* Add New Project Button - Only show for authenticated users */}
        {(() => {
          return shouldShowButton && (
            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button asChild className="btn-hero">
                <Link to="/portfolio/create">
                  <Plus size={18} className="mr-2" />
                  {t('portfolio.addNewProject')}
                </Link>
              </Button>
            </motion.div>
          );
        })()}

        {/* Featured Projects Section */}
        {!isLoading && projects.filter(p => p.featured).length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 !text-white">
                <span className="kinetic-text">{t('portfolio.featuredProjects')}</span>
              </h3>
              <p className="!text-white/80 font-medium">
                {t('portfolio.highlightedWorks')}
              </p>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects
                .filter(project => project.featured)
                .map((project) => (
                  <FeaturedProjectCard key={project.id} project={project} />
                ))}
            </motion.div>
          </motion.div>
        )}

        {/* Filter Buttons - Moved below Featured Projects */}
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
              style={{ cursor: 'pointer' }}
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

        {/* Filter Status */}
        <div className="text-center mb-4 text-sm !text-white/70 font-medium">
          {t('portfolio.showingProjects', { count: filteredProjects.length, total: projects.length })}
          {activeFilter !== t('filters.all') && activeFilter !== 'All' && ` (${t('portfolio.filteredBy', { filter: activeFilter })})`}
        </div>

        {/* All Projects Section */}
        {!isLoading && projects.filter(p => !p.featured).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 !text-white">
                {t('portfolio.allProjects')}
              </h3>
              <p className="!text-white/80 font-medium">
                {t('portfolio.completeCollection')}
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="!text-white/80 font-medium">{t('portfolio.loadingProjects')}</p>
            </div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="!text-white/80 text-lg font-medium">
              {t('portfolio.noProjectsForFilter', { filter: activeFilter })}
              {activeFilter !== t('filters.all') && activeFilter !== 'All' && ` ${t('portfolio.tryDifferentFilter')}`}
            </p>
          </div>
        )}

        {/* Show message if no projects */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="!text-white/80 text-lg font-medium">
              {t('portfolio.noProjectsFound')}
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
              onClick={() => {
                const subject = encodeURIComponent(t('portfolio.projectInquiry'));
                const body = encodeURIComponent(t('portfolio.emailBody'));
                window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
              }}
            >
              {t('portfolio.hireMe')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Portfolio; 