import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, MapPin, Clock, Users, Mail, ArrowLeft, Edit, Trash2, Play, Youtube, HardDrive } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

// Define the TranslatedProject interface
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [project, setProject] = useState<TranslatedProject | null>(null);

  // Project translations data
  const projectTranslations = {
    en: {
      '1': {
        title: "Flow-SIGHT",
        subtitle: "Real-time Congestion Prediction Dashboard",
        description: "AI-powered urban mobility analysis system using Graph ML to predict traffic patterns and optimize city flow in real-time.",
        content: "<h2>Project Overview</h2><p>Flow-SIGHT is an advanced urban mobility analysis system that leverages Graph Machine Learning to predict traffic patterns and optimize city flow in real-time.</p><h3>Key Features</h3><ul><li>Real-time traffic pattern prediction</li><li>Graph ML algorithms for urban data analysis</li><li>Interactive dashboard with live data visualization</li><li>Optimization recommendations for city planners</li></ul><h3>Technologies Used</h3><p>Python, TensorFlow, Graph ML, React, Urban Data Analytics</p>",
        status: "Live Demo",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Urban Data"],
        tags: ["AI Tools", "Urban Analytics"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "ML-driven Wood Optimization & Fabrication Pipeline",
        description: "Computer vision system for automated wood classification and CNC optimization, reducing material waste by 35%.",
        content: "<h2>Project Overview</h2><p>WOOD-ID is a computer vision system for automated wood classification and CNC optimization, significantly reducing material waste.</p><h3>Key Features</h3><ul><li>Automated wood species classification</li><li>CNC optimization algorithms</li><li>Material waste reduction by 35%</li><li>Real-time quality control</li></ul><h3>Technologies Used</h3><p>Computer Vision, CNC, Rhino, Python, Machine Learning</p>",
        status: "Case Study",
        technologies: ["Computer Vision", "CNC", "Rhino", "Python", "ML"],
        tags: ["AI Tools", "Fabrication"]
      },
      '3': {
        title: "Atelier24: KHC Hospital & Hotel",
        subtitle: "14,000 m² Mixed-Use Development",
        description: "Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.",
        content: "<h2>Project Overview</h2><p>Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.</p><h3>Key Features</h3><ul><li>14,000 m² mixed-use development</li><li>Complete BIM coordination</li><li>Technical documentation</li><li>Healthcare and hospitality facilities</li></ul><h3>Technologies Used</h3><p>Revit, AutoCAD, BIM, Construction Documentation</p>",
        status: "Built",
        technologies: ["Revit", "AutoCAD", "BIM", "Construction Docs"],
        tags: ["BIM", "Architecture"]
      },
      '4': {
        title: "Bioplastic Lab",
        subtitle: "Sustainable Material Prototyping",
        description: "Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.",
        content: "<h2>Project Overview</h2><p>Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.</p><h3>Key Features</h3><ul><li>Sustainable material research</li><li>Parametric design workflows</li><li>Digital fabrication techniques</li><li>Bio-based material prototyping</li></ul><h3>Technologies Used</h3><p>Grasshopper, 3D Printing, Material Science, Rhino</p>",
        status: "Research",
        technologies: ["Grasshopper", "3D Printing", "Material Science", "Rhino"],
        tags: ["Fabrication"]
      },
      '5': {
        title: "Chopra Residence",
        subtitle: "Built Execution & Site Experience",
        description: "Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.",
        content: "<h2>Project Overview</h2><p>Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.</p><h3>Key Features</h3><ul><li>Site supervision and execution</li><li>Sustainable building practices</li><li>Residential design</li><li>Construction management</li></ul><h3>Technologies Used</h3><p>Site Supervision, Construction, Sustainable Building</p>",
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
        content: "<h2>Resumen del Proyecto</h2><p>Flow-SIGHT es un sistema avanzado de análisis de movilidad urbana que aprovecha el Machine Learning de Grafos para predecir patrones de tráfico y optimizar el flujo de la ciudad en tiempo real.</p><h3>Características Principales</h3><ul><li>Predicción de patrones de tráfico en tiempo real</li><li>Algoritmos Graph ML para análisis de datos urbanos</li><li>Panel interactivo con visualización de datos en vivo</li><li>Recomendaciones de optimización para planificadores urbanos</li></ul><h3>Tecnologías Utilizadas</h3><p>Python, TensorFlow, Graph ML, React, Análisis de Datos Urbanos</p>",
        status: "Demo en Vivo",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Datos Urbanos"],
        tags: ["Herramientas de IA", "Analítica Urbana"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "Pipeline de Optimización y Fabricación de Madera con ML",
        description: "Sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo el desperdicio de material en un 35%.",
        content: "<h2>Resumen del Proyecto</h2><p>WOOD-ID es un sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo significativamente el desperdicio de material.</p><h3>Características Principales</h3><ul><li>Clasificación automatizada de especies de madera</li><li>Algoritmos de optimización CNC</li><li>Reducción de desperdicio de material en 35%</li><li>Control de calidad en tiempo real</li></ul><h3>Tecnologías Utilizadas</h3><p>Visión por Computadora, CNC, Rhino, Python, Machine Learning</p>",
        status: "Estudio de Caso",
        technologies: ["Visión por Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Herramientas de IA", "Fabricación"]
      },
      '3': {
        title: "Atelier24: Hospital y Hotel KHC",
        subtitle: "Desarrollo Mixto de 14,000 m²",
        description: "Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.",
        content: "<h2>Resumen del Proyecto</h2><p>Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.</p><h3>Características Principales</h3><ul><li>Desarrollo mixto de 14,000 m²</li><li>Coordinación BIM completa</li><li>Documentación técnica</li><li>Instalaciones de salud y hospitalidad</li></ul><h3>Tecnologías Utilizadas</h3><p>Revit, AutoCAD, BIM, Documentación de Construcción</p>",
        status: "Construido",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentación de Construcción"],
        tags: ["BIM", "Arquitectura"]
      },
      '4': {
        title: "Laboratorio de Bioplásticos",
        subtitle: "Prototipado de Materiales Sostenibles",
        description: "Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.",
        content: "<h2>Resumen del Proyecto</h2><p>Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.</p><h3>Características Principales</h3><ul><li>Investigación de materiales sostenibles</li><li>Flujos de trabajo de diseño paramétrico</li><li>Técnicas de fabricación digital</li><li>Prototipado de materiales basados en bio</li></ul><h3>Tecnologías Utilizadas</h3><p>Grasshopper, Impresión 3D, Ciencia de Materiales, Rhino</p>",
        status: "Investigación",
        technologies: ["Grasshopper", "Impresión 3D", "Ciencia de Materiales", "Rhino"],
        tags: ["Fabricación"]
      },
      '5': {
        title: "Residencia Chopra",
        subtitle: "Ejecución Construida y Experiencia en Sitio",
        description: "Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.",
        content: "<h2>Resumen del Proyecto</h2><p>Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.</p><h3>Características Principales</h3><ul><li>Supervisión y execució del sitio</li><li>Prácticas de construcción sostenible</li><li>Diseño residencial</li><li>Gestión de construcción</li></ul><h3>Tecnologías Utilizadas</h3><p>Supervisión de Sitio, Construcción, Construcción Sostenible</p>",
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
        content: "<h2>Resum del Projecte</h2><p>Flow-SIGHT és un sistema avançat d'anàlisi de mobilitat urbana que aprofita el Machine Learning de Grafs per predir patrons de trànsit i optimitzar el flux de la ciutat en temps real.</p><h3>Característiques Principals</h3><ul><li>Predicció de patrons de trànsit en temps real</li><li>Algoritmes Graph ML per anàlisi de dades urbanes</li><li>Tauler interactiu amb visualització de dades en viu</li><li>Recomanacions d'optimització per planificadors urbans</li></ul><h3>Tecnologies Utilitzades</h3><p>Python, TensorFlow, Graph ML, React, Anàlisi de Dades Urbanes</p>",
        status: "Demo en Viu",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Dades Urbanes"],
        tags: ["Eines d'IA", "Analítica Urbana"]
      },
      '2': {
        title: "WOOD-ID",
        subtitle: "Pipeline d'Optimització i Fabricació de Fusta amb ML",
        description: "Sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint el malbaratament de material en un 35%.",
        content: "<h2>Resum del Projecte</h2><p>WOOD-ID és un sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint significativament el malbaratament de material.</p><h3>Característiques Principals</h3><ul><li>Classificació automatitzada d'espècies de fusta</li><li>Algoritmes d'optimització CNC</li><li>Reducció de malbaratament de material en 35%</li><li>Control de qualitat en temps real</li></ul><h3>Tecnologies Utilitzades</h3><p>Visió per Computadora, CNC, Rhino, Python, Machine Learning</p>",
        status: "Estudi de Cas",
        technologies: ["Visió per Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Eines d'IA", "Fabricació"]
      },
      '3': {
        title: "Atelier24: Hospital i Hotel KHC",
        subtitle: "Desenvolupament Mixt de 14,000 m²",
        description: "Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.",
        content: "<h2>Resum del Projecte</h2><p>Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.</p><h3>Característiques Principals</h3><ul><li>Desenvolupament mixt de 14,000 m²</li><li>Coordinació BIM completa</li><li>Documentació tècnica</li><li>Instal·lacions de salut i hospitalitat</li></ul><h3>Tecnologies Utilitzades</h3><p>Revit, AutoCAD, BIM, Documentació de Construcció</p>",
        status: "Construït",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentació de Construcció"],
        tags: ["BIM", "Arquitectura"]
      },
      '4': {
        title: "Laboratori de Bioplàstics",
        subtitle: "Prototipatge de Materials Sostenibles",
        description: "Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.",
        content: "<h2>Resum del Projecte</h2><p>Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.</p><h3>Característiques Principals</h3><ul><li>Recerca de materials sostenibles</li><li>Fluxos de treball de disseny paramètric</li><li>Tècniques de fabricació digital</li><li>Prototipatge de materials basats en bio</li></ul><h3>Tecnologies Utilitzades</h3><p>Grasshopper, Impressió 3D, Ciència de Materials, Rhino</p>",
        status: "Recerca",
        technologies: ["Grasshopper", "Impressió 3D", "Ciència de Materials", "Rhino"],
        tags: ["Fabricació"]
      },
      '5': {
        title: "Residència Chopra",
        subtitle: "Execució Construïda i Experiència en Lloc",
        description: "Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.",
        content: "<h2>Resum del Projecte</h2><p>Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.</p><h3>Característiques Principals</h3><ul><li>Supervisió i execució del lloc</li><li>Pràctiques de construcció sostenible</li><li>Disseny residencial</li><li>Gestió de construcció</li></ul><h3>Tecnologies Utilitzades</h3><p>Supervisió de Lloc, Construcció, Construcció Sostenible</p>",
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

  const getProjectById = useCallback((projectId: string): TranslatedProject | null => {
    const baseProject = baseProjects.find(p => p.id === projectId);
    if (!baseProject) return null;

    const translations = projectTranslations[language as keyof typeof projectTranslations] || projectTranslations.en;
    const projectTranslation = translations[projectId as keyof typeof translations];
    
    if (!projectTranslation) {
      // Fallback to English if translation not found
      const englishTranslations = projectTranslations.en;
      const englishProject = englishTranslations[projectId as keyof typeof englishTranslations];
      
      return {
        ...baseProject,
        ...englishProject
      } as TranslatedProject;
    }
    
    return {
      ...baseProject,
      ...projectTranslation
    } as TranslatedProject;
  }, [language]);

  useEffect(() => {
    if (id) {
      const fetchedProject = getProjectById(id);
      if (fetchedProject) {
        setProject(fetchedProject);
      } else {
        toast({
          title: "Project Not Found",
          description: "The project you are looking for does not exist.",
          variant: "destructive",
        });
        navigate('/portfolio');
      }
    }
  }, [id, navigate, toast, getProjectById]);

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
      toast({
        title: "Project Deleted",
        description: `"${project.title}" has been removed from your portfolio.`,
      });
      navigate('/portfolio');
    }
  };

  if (!project) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div 
        className="container mx-auto px-6 py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 hover:bg-accent"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Project Image */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative group">
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </motion.div>

          {/* Project Details */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {project.title}
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {project.subtitle}
              </motion.p>
              <motion.p 
                className="text-lg leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {project.description}
              </motion.p>
            </div>

            {/* Project Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Location</span>
                  </div>
                  <p className="font-medium">{project.location}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <p className="font-medium">{project.duration}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Team Size</span>
                  </div>
                  <p className="font-medium">{project.team_size}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <Badge variant={project.status === 'Built' ? 'default' : project.status === 'Live Demo' ? 'secondary' : 'outline'}>
                    {project.status}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>

            {/* Technologies */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-lg font-semibold">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              {project.project_url && (
                <Button asChild>
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} className="mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github size={16} className="mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              
              <Button variant="outline" onClick={handleHireMe}>
                <Mail size={16} className="mr-2" />
                Hire Me
              </Button>
            </motion.div>

            {/* Admin Actions */}
            {user && (
              <motion.div 
                className="flex gap-2 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button variant="outline" size="sm" asChild>
                  <a href={`/portfolio/edit/${project.id}`}>
                    <Edit size={14} className="mr-2" />
                    Edit Project
                  </a>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
                  <Trash2 size={14} className="mr-2" />
                  Delete Project
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Project Content */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail; 