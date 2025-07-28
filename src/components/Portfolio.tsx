import { useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Eye, Edit, Trash2, Plus, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { projectsService, Project } from '@/services/projectsService';
import { useLanguage } from '@/contexts/LanguageContext';

// Define the TranslatedProject interface locally
interface TranslatedProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  status: string;
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  tags: string[];
  videos?: any[];
  created_at: string;
  updated_at: string;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<TranslatedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const filters = ['All', 'Architecture', 'Urban Design', 'Computational Design', 'AI/ML', 'BIM', 'Research'];

  // Import the translation data directly
  const projectTranslations = {
    en: {
      '1': {
        title: "Flow-SIGHT",
        subtitle: "Real-time Congestion Prediction Dashboard",
        description: "AI-powered urban mobility analysis system using Graph ML to predict traffic patterns and optimize city flow in real-time.",
        content: "<h2>Project Overview</h2><p>Flow-SIGHT is an advanced urban mobility analysis system that leverages Graph Machine Learning to predict traffic patterns and optimize city flow in real-time.</p>",
        status: "Live Demo",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Urban Data"],
        tags: ["AI Tools", "Urban Analytics"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "ML-driven Wood Optimization & Fabrication Pipeline",
        description: "Computer vision system for automated wood classification and CNC optimization, reducing material waste by 35%.",
        content: "<h2>Project Overview</h2><p>WOOD-ID is a computer vision system for automated wood classification and CNC optimization, significantly reducing material waste.</p>",
        status: "Case Study",
        technologies: ["Computer Vision", "CNC", "Rhino", "Python", "ML"],
        tags: ["AI Tools", "Fabrication"]
      },
      '3': {
        title: "Atelier24: KHC Hospital & Hotel",
        subtitle: "14,000 m² Mixed-Use Development",
        description: "Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.",
        content: "<h2>Project Overview</h2><p>Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.</p>",
        status: "Built",
        technologies: ["Revit", "AutoCAD", "BIM", "Construction Docs"],
        tags: ["BIM", "Architecture"]
      },
      '4': {
        title: "Bioplastic Lab",
        subtitle: "Sustainable Material Prototyping",
        description: "Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.",
        content: "<h2>Project Overview</h2><p>Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.</p>",
        status: "Research",
        technologies: ["Grasshopper", "3D Printing", "Material Science", "Rhino"],
        tags: ["Fabrication"]
      },
      '5': {
        title: "Chopra Residence",
        subtitle: "Built Execution & Site Experience",
        description: "Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.",
        content: "<h2>Project Overview</h2><p>Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.</p>",
        status: "Built",
        technologies: ["Site Supervision", "Construction", "Sustainable Building"],
        tags: ["Architecture", "Construction"]
      }
    },
    es: {
      '1': {
        title: "Flow-SIGHT",
        subtitle: "Panel de Predicción de Congestión en Tiempo Real",
        description: "Sistema de análisis de movilidad urbana impulsado por IA que utiliza Graph ML para predecir patrones de tráfico y optimizar el flujo de la ciudad en tiempo real.",
        content: "<h2>Resumen del Proyecto</h2><p>Flow-SIGHT es un sistema avanzado de análisis de movilidad urbana que aprovecha el Machine Learning de Grafos para predecir patrones de tráfico y optimizar el flujo de la ciudad en tiempo real.</p>",
        status: "Demo en Vivo",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Datos Urbanos"],
        tags: ["Herramientas de IA", "Analítica Urbana"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "Pipeline de Optimización y Fabricación de Madera con ML",
        description: "Sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo el desperdicio de material en un 35%.",
        content: "<h2>Resumen del Proyecto</h2><p>WOOD-ID es un sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo significativamente el desperdicio de material.</p>",
        status: "Estudio de Caso",
        technologies: ["Visión por Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Herramientas de IA", "Fabricación"]
      },
      '3': {
        title: "Atelier24: Hospital y Hotel KHC",
        subtitle: "Desarrollo Mixto de 14,000 m²",
        description: "Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.",
        content: "<h2>Resumen del Proyecto</h2><p>Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.</p>",
        status: "Construido",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentación de Construcción"],
        tags: ["BIM", "Arquitectura"]
      },
      '4': {
        title: "Laboratorio de Bioplásticos",
        subtitle: "Prototipado de Materiales Sostenibles",
        description: "Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.",
        content: "<h2>Resumen del Proyecto</h2><p>Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.</p>",
        status: "Investigación",
        technologies: ["Grasshopper", "Impresión 3D", "Ciencia de Materiales", "Rhino"],
        tags: ["Fabricación"]
      },
      '5': {
        title: "Residencia Chopra",
        subtitle: "Ejecución Construida y Experiencia en Sitio",
        description: "Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.",
        content: "<h2>Resumen del Proyecto</h2><p>Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.</p>",
        status: "Construido",
        technologies: ["Supervisión de Sitio", "Construcción", "Construcción Sostenible"],
        tags: ["Arquitectura", "Construcción"]
      }
    },
    ca: {
      '1': {
        title: "Flow-SIGHT",
        subtitle: "Tauler de Predicció de Congestió en Temps Real",
        description: "Sistema d'anàlisi de mobilitat urbana impulsat per IA que utilitza Graph ML per predir patrons de trànsit i optimitzar el flux de la ciutat en temps real.",
        content: "<h2>Resum del Projecte</h2><p>Flow-SIGHT és un sistema avançat d'anàlisi de mobilitat urbana que aprofita el Machine Learning de Grafs per predir patrons de trànsit i optimitzar el flux de la ciutat en temps real.</p>",
        status: "Demo en Viu",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Dades Urbanes"],
        tags: ["Eines d'IA", "Analítica Urbana"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "Pipeline d'Optimització i Fabricació de Fusta amb ML",
        description: "Sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint el malbaratament de material en un 35%.",
        content: "<h2>Resum del Projecte</h2><p>WOOD-ID és un sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint significativament el malbaratament de material.</p>",
        status: "Estudi de Cas",
        technologies: ["Visió per Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Eines d'IA", "Fabricació"]
      },
      '3': {
        title: "Atelier24: Hospital i Hotel KHC",
        subtitle: "Desenvolupament Mixt de 14,000 m²",
        description: "Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.",
        content: "<h2>Resum del Projecte</h2><p>Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.</p>",
        status: "Construït",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentació de Construcció"],
        tags: ["BIM", "Arquitectura"]
      },
      '4': {
        title: "Laboratori de Bioplàstics",
        subtitle: "Prototipatge de Materials Sostenibles",
        description: "Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.",
        content: "<h2>Resum del Projecte</h2><p>Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.</p>",
        status: "Recerca",
        technologies: ["Grasshopper", "Impressió 3D", "Ciència de Materials", "Rhino"],
        tags: ["Fabricació"]
      },
      '5': {
        title: "Residència Chopra",
        subtitle: "Execució Construïda i Experiència en Lloc",
        description: "Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.",
        content: "<h2>Resum del Projecte</h2><p>Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.</p>",
        status: "Construït",
        technologies: ["Supervisió de Lloc", "Construcció", "Construcció Sostenible"],
        tags: ["Arquitectura", "Construcció"]
      }
    }
  };

  // Base project data
  const baseProjects = [
    {
      id: '1',
      image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      featured: true,
      project_url: "https://flow-sight.demo",
      github_url: "https://github.com/maheepmouli/flow-sight",
      location: "Barcelona, Spain",
      duration: "6 months",
      team_size: "4 people",
      videos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      featured: true,
      project_url: "https://wood-id.demo",
      github_url: "https://github.com/maheepmouli/wood-id",
      location: "Mysore, India",
      duration: "8 months",
      team_size: "3 people",
      videos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
      featured: true,
      project_url: "https://atelier24.demo",
      github_url: "https://github.com/maheepmouli/atelier24",
      location: "Bangalore, India",
      duration: "12 months",
      team_size: "8 people",
      videos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
      featured: false,
      project_url: "https://bioplastic-lab.demo",
      github_url: "https://github.com/maheepmouli/bioplastic-lab",
      location: "Barcelona, Spain",
      duration: "4 months",
      team_size: "2 people",
      videos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
      featured: false,
      project_url: "https://chopra-residence.demo",
      github_url: "https://github.com/maheepmouli/chopra-residence",
      location: "Mysore, India",
      duration: "10 months",
      team_size: "5 people",
      videos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const getTranslatedProjects = useCallback((): TranslatedProject[] => {
    console.log('Getting translated projects for language:', language);
    return baseProjects.map(baseProject => {
      const translations = projectTranslations[language as keyof typeof projectTranslations] || projectTranslations.en;
      const projectTranslation = translations[baseProject.id as keyof typeof translations];
      
      if (!projectTranslation) {
        // Fallback to English if translation not found
        const englishTranslations = projectTranslations.en;
        const englishProject = englishTranslations[baseProject.id as keyof typeof englishTranslations];
        
        return {
          ...baseProject,
          ...englishProject
        } as TranslatedProject;
      }
      
      return {
        ...baseProject,
        ...projectTranslation
      } as TranslatedProject;
    });
  }, [language]);

  const loadProjects = useCallback(() => {
    setIsLoading(true);
    try {
      const allProjects = getTranslatedProjects();
      console.log('Loaded projects:', allProjects); // Debug log
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getTranslatedProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = activeFilter === 'All' ? projects : projects.filter(project => project.tags.includes(activeFilter));
  const featuredProjects = projects.filter(project => project.featured);

  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      const success = projectsService.deleteProject(projectId);
      if (success) {
        setProjects(projects.filter(p => p.id !== projectId));
        toast({
          title: "Project Deleted",
          description: `"${projectTitle}" has been removed from your portfolio.`,
        });
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
    const subject = encodeURIComponent('Hire Request - Portfolio');
    const body = encodeURIComponent(`Hi Maheep,

I saw your portfolio and would like to discuss a collaboration opportunity with you.

My project requirements:
- [Describe your project needs]
- [Timeline]
- [Budget range]

Please let me know when you're available for a call.

Best regards,
[Your name]`);
    
    window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

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
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const ProjectCard = ({ project, isFeatured = false }: { project: TranslatedProject; isFeatured?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card 
          className="project-card group overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden">
            <motion.img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-48 object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm">
                {project.status}
              </Badge>
            </div>
            
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
    <section id="portfolio" className="section-spacing">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6"> {t('portfolio.title')} <span className="kinetic-text">Portfolio</span> </h2>
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
            <motion.h3 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('portfolio.featuredProjects')}
            </motion.h3>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="max-w-6xl mx-auto mb-16">
            <motion.h3 
              className="text-3xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {t('portfolio.featuredProjects')}
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isFeatured={true} />
              ))}
            </motion.div>
          </div>
        ) : null}

        {/* Project Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-8"
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
                  variant={activeFilter === filter ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(filter)}
                  className={activeFilter === filter ? 'btn-accent' : ''}
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
          ) : filteredProjects.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects found matching the selected filter.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <h3 className="text-3xl font-bold mb-4">Explore More of My Work</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Dive deeper into my comprehensive digital portfolio or connect with me on GitHub to see my code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                              <Button 
                    className="btn-hero"
                    onClick={() => window.open("https://www.calameo.com/read/007995635f849de9a792d", "_blank")}
                  >
                    <BookOpen size={18} className="mr-2" />
                    {t('portfolio.digitalPortfolio')}
                  </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open("https://github.com/maheepmouli", "_blank")}
                >
                  <Github size={18} className="mr-2" />
                  View on GitHub
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={handleHireMe}
                >
                  <ExternalLink size={18} className="mr-2" />
                  Hire Me
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio; 