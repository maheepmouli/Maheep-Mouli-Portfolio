import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  console.log("🚀 Portfolio component mounting...");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const filters = ['All', 'Architecture', 'Urban Design', 'Computational Design', 'AI/ML', 'BIM', 'Research'];

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
      console.log("📋 Portfolio: Loaded projects:", projects.map(p => ({
        title: p.title,
        image_url: p.image_url,
        featured: p.featured
      })));
      setProjects(projects);
      
      // Preload images for better performance
      projects.forEach(project => {
        if (project.image_url && !project.image_url.startsWith('data:')) {
          console.log("🖼️ Preloading image for:", project.title, "URL:", project.image_url);
          const img = new Image();
          img.src = project.image_url;
        }
      });
    } catch (error) {
      console.error('Portfolio: Error loading projects:', error);
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
      console.log('Portfolio: Received project update event:', event.detail);
      if (event.detail.action === 'updated' || event.detail.action === 'created') {
        console.log('Portfolio: Refreshing projects after update...');
        loadProjects();
      }
    };
    
    window.addEventListener('projectUpdate', handleProjectUpdate as EventListener);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('projectUpdate', handleProjectUpdate as EventListener);
    };
  }, [language]);

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(project => project.technologies.includes(activeFilter));

  // Debug logging
  console.log("🔍 Portfolio: Processing projects:", {
    totalProjects: projects.length,
    filteredProjects: filteredProjects.length,
    activeFilter,
    featuredProjects: projects.filter(p => p.featured).length,
    nonFeaturedProjects: projects.filter(p => !p.featured).length,
    projectTitles: projects.map(p => p.title)
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

  const ProjectCard = ({ project }: { project: UnifiedProject }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true); // Start as true to show loading state

    console.log("🔍 ProjectCard rendering for:", project.title);
    console.log("🔍 Project status:", project.status);
    console.log("🔍 Project featured:", project.featured);

    // Reset image error state when project changes
    useEffect(() => {
      console.log("🖼️ ProjectCard: Image URL:", project.image_url);
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
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl">
          <div className="relative overflow-hidden">
            {/* Loading State */}
            {imageLoading && project.image_url && !imageError && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
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
                <div className="text-center text-muted-foreground">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen size={24} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">{project.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Project Preview</p>
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
                    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                      try {
                        console.log('Portfolio: Deleting project:', project.title);
                        const success = await unifiedProjectsService.deleteProject(project.id);
                        
                        if (success) {
                          toast({
                            title: "✅ Project Deleted",
                            description: `"${project.title}" has been deleted successfully.`,
                          });
                          
                          // Refresh the projects list
                          loadProjects();
                        } else {
                          toast({
                            title: "❌ Delete Failed",
                            description: "Failed to delete project. Please try again.",
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error('Portfolio: Error deleting project:', error);
                        toast({
                          title: "❌ Error",
                          description: "An error occurred while deleting the project.",
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
            <p className="text-muted-foreground text-sm mb-3">
              {project.subtitle}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {project.description.slice(0, 100) + '...'}
            </p>
            
            {/* Status and Featured Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.status && (
                <Badge variant="secondary" className="text-xs">
                  {project.status}
                </Badge>
              )}
              {project.featured && (
                <Badge variant="default" className="text-xs">
                  Featured
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
                  View Project
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
      console.log("🖼️ FeaturedProjectCard: Image URL:", project.image_url);
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
      >
        <Card className="h-full overflow-hidden project-card transition-all duration-300 hover:shadow-xl border-2 border-primary/20 hover:border-primary/40">
          <div className="relative overflow-hidden">
            {/* Loading State */}
            {imageLoading && project.image_url && !imageError && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Loading...</p>
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
                <div className="text-center text-muted-foreground">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen size={24} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-primary">{project.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">Featured Project</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Featured Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Featured
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
                    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                      try {
                        console.log('Portfolio: Deleting project:', project.title);
                        const success = await unifiedProjectsService.deleteProject(project.id);
                        
                        if (success) {
                          toast({
                            title: "✅ Project Deleted",
                            description: `"${project.title}" has been deleted successfully.`,
                          });
                          
                          // Refresh the projects list
                          loadProjects();
                        } else {
                          toast({
                            title: "❌ Delete Failed",
                            description: "Failed to delete project. Please try again.",
                            variant: "destructive"
                          });
                        }
                      } catch (error) {
                        console.error('Portfolio: Error deleting project:', error);
                        toast({
                          title: "❌ Error",
                          description: "An error occurred while deleting the project.",
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
            <p className="text-muted-foreground text-base mb-4">
              {project.subtitle}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {project.description.slice(0, 150) + '...'}
            </p>
            
            {/* Status Badge */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.status && (
                <Badge variant="secondary" className="text-xs">
                  {project.status}
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
    <section id="portfolio" className="section-spacing">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 underline-effect">
            My <span className="kinetic-text">Portfolio</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto color-wave-text px-4">
            {t('portfolio.subtitle')}
          </p>
        </div>

        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link to={user ? "/portfolio/create" : "/login"}>
            <Button className="btn-hero">
              <Plus size={18} className="mr-2" />
              {t('portfolio.addNewProject')}
            </Button>
          </Link>
        </motion.div>

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
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                <span className="kinetic-text">Featured</span> Projects
              </h3>
              <p className="text-muted-foreground">
                Highlighted works showcasing innovative design and technology
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

        {/* All Projects Section */}
        {!isLoading && projects.filter(p => !p.featured).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                All <span className="kinetic-text">Projects</span>
              </h3>
              <p className="text-muted-foreground">
                Complete collection of computational design and urban technology projects
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : (
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
        )}

        {/* Show message if no projects */}
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
              onClick={() => {
                const subject = encodeURIComponent("Project Inquiry - Portfolio");
                const body = encodeURIComponent(`Hi Maheep,\n\nI'm interested in discussing a potential project with you.\n\nBest regards,\n[Your Name]`);
                window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
              }}
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