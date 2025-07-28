import { useLanguage } from '@/contexts/LanguageContext';

export interface DynamicProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  images?: string[]; // Optional array for multiple images
  videos?: string[]; // Optional array for video URLs
  status: 'draft' | 'published' | 'Live Demo' | 'Case Study' | 'Built' | 'Research' | 'Completed' | 'Development' | 'Demo en Vivo' | 'Demo en Viu' | 'Estudio de Caso' | 'Estudi de Cas' | 'Construido' | 'Construït' | 'Investigación' | 'Recerca';
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
  // Multilingual support
  translations?: {
    en?: Partial<DynamicProject>;
    es?: Partial<DynamicProject>;
    ca?: Partial<DynamicProject>;
  };
}

export interface ProjectTranslation {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  status?: string;
  technologies?: string[];
  tags?: string[];
}

const STORAGE_KEY = 'dynamic_portfolio_projects';

// Initialize with sample data if no projects exist
const initializeSampleData = (): DynamicProject[] => [
  {
    id: '1',
    title: "Flow-SIGHT",
    subtitle: "Real-time Congestion Prediction Dashboard",
    description: "AI-powered urban mobility analysis system using Graph ML to predict traffic patterns and optimize city flow in real-time.",
    content: "<h2>Project Overview</h2><p>Flow-SIGHT is an advanced urban mobility analysis system that leverages Graph Machine Learning to predict traffic patterns and optimize city flow in real-time.</p><h3>Key Features</h3><ul><li>Real-time traffic pattern prediction</li><li>Graph ML algorithms for urban data analysis</li><li>Interactive dashboard with live data visualization</li><li>Optimization recommendations for city planners</li></ul><h3>Technologies Used</h3><p>Python, TensorFlow, Graph ML, React, Urban Data Analytics</p>",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    status: "Live Demo",
    featured: true,
    project_url: "https://flow-sight.demo",
    github_url: "https://github.com/maheepmouli/flow-sight",
    location: "Barcelona, Spain",
    duration: "6 months",
    team_size: "4 people",
    technologies: ["Python", "TensorFlow", "Graph ML", "React", "Urban Data"],
    tags: ["AI Tools", "Urban Analytics"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: {
      es: {
        title: "Flow-SIGHT",
        subtitle: "Panel de Predicción de Congestión en Tiempo Real",
        description: "Sistema de análisis de movilidad urbana impulsado por IA que utiliza Graph ML para predecir patrones de tráfico y optimizar el flujo de la ciudad en tiempo real.",
        content: "<h2>Resumen del Proyecto</h2><p>Flow-SIGHT es un sistema avanzado de análisis de movilidad urbana que aprovecha el Machine Learning de Grafos para predecir patrones de tráfico y optimizar el flujo de la ciudad en tiempo real.</p><h3>Características Principales</h3><ul><li>Predicción de patrones de tráfico en tiempo real</li><li>Algoritmos Graph ML para análisis de datos urbanos</li><li>Panel interactivo con visualización de datos en vivo</li><li>Recomendaciones de optimización para planificadores urbanos</li></ul><h3>Tecnologías Utilizadas</h3><p>Python, TensorFlow, Graph ML, React, Análisis de Datos Urbanos</p>",
        status: "Demo en Vivo",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Datos Urbanos"],
        tags: ["Herramientas de IA", "Analítica Urbana"]
      },
      ca: {
        title: "Flow-SIGHT",
        subtitle: "Tauler de Predicció de Congestió en Temps Real",
        description: "Sistema d'anàlisi de mobilitat urbana impulsat per IA que utilitza Graph ML per predir patrons de trànsit i optimitzar el flux de la ciutat en temps real.",
        content: "<h2>Resum del Projecte</h2><p>Flow-SIGHT és un sistema avançat d'anàlisi de mobilitat urbana que aprofita el Machine Learning de Grafs per predir patrons de trànsit i optimitzar el flux de la ciutat en temps real.</p><h3>Característiques Principals</h3><ul><li>Predicció de patrons de trànsit en temps real</li><li>Algoritmes Graph ML per anàlisi de dades urbanes</li><li>Tauler interactiu amb visualització de dades en viu</li><li>Recomanacions d'optimització per planificadors urbans</li></ul><h3>Tecnologies Utilitzades</h3><p>Python, TensorFlow, Graph ML, React, Anàlisi de Dades Urbanes</p>",
        status: "Demo en Viu",
        technologies: ["Python", "TensorFlow", "Graph ML", "React", "Dades Urbanes"],
        tags: ["Eines d'IA", "Analítica Urbana"]
      }
    }
  },
  {
    id: '2',
    title: "WOOD-ID",
    subtitle: "ML-driven Wood Optimization & Fabrication Pipeline",
    description: "Computer vision system for automated wood classification and CNC optimization, reducing material waste by 35%.",
    content: "<h2>Project Overview</h2><p>WOOD-ID is a computer vision system for automated wood classification and CNC optimization, significantly reducing material waste.</p><h3>Key Features</h3><ul><li>Automated wood species classification</li><li>CNC optimization algorithms</li><li>Material waste reduction by 35%</li><li>Real-time quality control</li></ul><h3>Technologies Used</h3><p>Computer Vision, CNC, Rhino, Python, Machine Learning</p>",
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    status: "Case Study",
    featured: true,
    project_url: "https://wood-id.demo",
    github_url: "https://github.com/maheepmouli/wood-id",
    location: "Mysore, India",
    duration: "8 months",
    team_size: "3 people",
    technologies: ["Computer Vision", "CNC", "Rhino", "Python", "ML"],
    tags: ["AI Tools", "Fabrication"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: {
      es: {
        title: "WOOD-ID",
        subtitle: "Pipeline de Optimización y Fabricación de Madera con ML",
        description: "Sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo el desperdicio de material en un 35%.",
        content: "<h2>Resumen del Proyecto</h2><p>WOOD-ID es un sistema de visión por computadora para clasificación automatizada de madera y optimización CNC, reduciendo significativamente el desperdicio de material.</p><h3>Características Principales</h3><ul><li>Clasificación automatizada de especies de madera</li><li>Algoritmos de optimización CNC</li><li>Reducción de desperdicio de material en 35%</li><li>Control de calidad en tiempo real</li></ul><h3>Tecnologías Utilizadas</h3><p>Visión por Computadora, CNC, Rhino, Python, Machine Learning</p>",
        status: "Estudio de Caso",
        technologies: ["Visión por Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Herramientas de IA", "Fabricación"]
      },
      ca: {
        title: "WOOD-ID",
        subtitle: "Pipeline d'Optimització i Fabricació de Fusta amb ML",
        description: "Sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint el malbaratament de material en un 35%.",
        content: "<h2>Resum del Projecte</h2><p>WOOD-ID és un sistema de visió per computadora per classificació automatitzada de fusta i optimització CNC, reduint significativament el malbaratament de material.</p><h3>Característiques Principals</h3><ul><li>Classificació automatitzada d'espècies de fusta</li><li>Algoritmes d'optimització CNC</li><li>Reducció de malbaratament de material en 35%</li><li>Control de qualitat en temps real</li></ul><h3>Tecnologies Utilitzades</h3><p>Visió per Computadora, CNC, Rhino, Python, Machine Learning</p>",
        status: "Estudi de Cas",
        technologies: ["Visió per Computadora", "CNC", "Rhino", "Python", "ML"],
        tags: ["Eines d'IA", "Fabricació"]
      }
    }
  },
  {
    id: '3',
    title: "Atelier24: KHC Hospital & Hotel",
    subtitle: "14,000 m² Mixed-Use Development",
    description: "Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.",
    content: "<h2>Project Overview</h2><p>Complete BIM coordination and technical documentation for large-scale healthcare and hospitality project using advanced Revit workflows.</p><h3>Key Features</h3><ul><li>14,000 m² mixed-use development</li><li>Complete BIM coordination</li><li>Technical documentation</li><li>Healthcare and hospitality facilities</li></ul><h3>Technologies Used</h3><p>Revit, AutoCAD, BIM, Construction Documentation</p>",
    image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
    status: "Built",
    featured: true,
    project_url: "https://atelier24.demo",
    github_url: "https://github.com/maheepmouli/atelier24",
    location: "Bangalore, India",
    duration: "12 months",
    team_size: "8 people",
    technologies: ["Revit", "AutoCAD", "BIM", "Construction Docs"],
    tags: ["BIM", "Architecture"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: {
      es: {
        title: "Atelier24: Hospital y Hotel KHC",
        subtitle: "Desarrollo Mixto de 14,000 m²",
        description: "Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.",
        content: "<h2>Resumen del Proyecto</h2><p>Coordinación BIM completa y documentación técnica para proyecto de salud y hospitalidad a gran escala usando flujos de trabajo avanzados de Revit.</p><h3>Características Principales</h3><ul><li>Desarrollo mixto de 14,000 m²</li><li>Coordinación BIM completa</li><li>Documentación técnica</li><li>Instalaciones de salud y hospitalidad</li></ul><h3>Tecnologías Utilizadas</h3><p>Revit, AutoCAD, BIM, Documentación de Construcción</p>",
        status: "Construido",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentación de Construcción"],
        tags: ["BIM", "Arquitectura"]
      },
      ca: {
        title: "Atelier24: Hospital i Hotel KHC",
        subtitle: "Desenvolupament Mixt de 14,000 m²",
        description: "Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.",
        content: "<h2>Resum del Projecte</h2><p>Coordinació BIM completa i documentació tècnica per projecte de salut i hospitalitat a gran escala usant fluxos de treball avançats de Revit.</p><h3>Característiques Principals</h3><ul><li>Desenvolupament mixt de 14,000 m²</li><li>Coordinació BIM completa</li><li>Documentació tècnica</li><li>Instal·lacions de salut i hospitalitat</li></ul><h3>Tecnologies Utilitzades</h3><p>Revit, AutoCAD, BIM, Documentació de Construcció</p>",
        status: "Construït",
        technologies: ["Revit", "AutoCAD", "BIM", "Documentació de Construcció"],
        tags: ["BIM", "Arquitectura"]
      }
    }
  },
  {
    id: '4',
    title: "Bioplastic Lab",
    subtitle: "Sustainable Material Prototyping",
    description: "Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.",
    content: "<h2>Project Overview</h2><p>Research and development of bio-based materials for architectural applications using parametric design and digital fabrication.</p><h3>Key Features</h3><ul><li>Sustainable material research</li><li>Parametric design workflows</li><li>Digital fabrication techniques</li><li>Bio-based material prototyping</li></ul><h3>Technologies Used</h3><p>Grasshopper, 3D Printing, Material Science, Rhino</p>",
    image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    status: "Research",
    featured: false,
    project_url: "https://bioplastic-lab.demo",
    github_url: "https://github.com/maheepmouli/bioplastic-lab",
    location: "Barcelona, Spain",
    duration: "4 months",
    team_size: "2 people",
    technologies: ["Grasshopper", "3D Printing", "Material Science", "Rhino"],
    tags: ["Fabrication"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: {
      es: {
        title: "Laboratorio de Bioplásticos",
        subtitle: "Prototipado de Materiales Sostenibles",
        description: "Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.",
        content: "<h2>Resumen del Proyecto</h2><p>Investigación y desarrollo de materiales basados en bio para aplicaciones arquitectónicas usando diseño paramétrico y fabricación digital.</p><h3>Características Principales</h3><ul><li>Investigación de materiales sostenibles</li><li>Flujos de trabajo de diseño paramétrico</li><li>Técnicas de fabricación digital</li><li>Prototipado de materiales basados en bio</li></ul><h3>Tecnologías Utilizadas</h3><p>Grasshopper, Impresión 3D, Ciencia de Materiales, Rhino</p>",
        status: "Investigación",
        technologies: ["Grasshopper", "Impresión 3D", "Ciencia de Materiales", "Rhino"],
        tags: ["Fabricación"]
      },
      ca: {
        title: "Laboratori de Bioplàstics",
        subtitle: "Prototipatge de Materials Sostenibles",
        description: "Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.",
        content: "<h2>Resum del Projecte</h2><p>Recerca i desenvolupament de materials basats en bio per aplicacions arquitectòniques usant disseny paramètric i fabricació digital.</p><h3>Característiques Principals</h3><ul><li>Recerca de materials sostenibles</li><li>Fluxos de treball de disseny paramètric</li><li>Tècniques de fabricació digital</li><li>Prototipatge de materials basats en bio</li></ul><h3>Tecnologies Utilitzades</h3><p>Grasshopper, Impressió 3D, Ciència de Materials, Rhino</p>",
        status: "Recerca",
        technologies: ["Grasshopper", "Impressió 3D", "Ciència de Materials", "Rhino"],
        tags: ["Fabricació"]
      }
    }
  },
  {
    id: '5',
    title: "Chopra Residence",
    subtitle: "Built Execution & Site Experience",
    description: "Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.",
    content: "<h2>Project Overview</h2><p>Residential project with comprehensive site supervision and execution through K12 Atelier, focusing on sustainable building practices.</p><h3>Key Features</h3><ul><li>Site supervision and execution</li><li>Sustainable building practices</li><li>Residential design</li><li>Construction management</li></ul><h3>Technologies Used</h3><p>Site Supervision, Construction, Sustainable Building</p>",
    image_url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800&h=600&fit=crop",
    status: "Built",
    featured: false,
    project_url: "https://chopra-residence.demo",
    github_url: "https://github.com/maheepmouli/chopra-residence",
    location: "Mysore, India",
    duration: "10 months",
    team_size: "5 people",
    technologies: ["Site Supervision", "Construction", "Sustainable Building"],
    tags: ["Architecture", "Construction"],
    videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    translations: {
      es: {
        title: "Residencia Chopra",
        subtitle: "Ejecución Construida y Experiencia en Sitio",
        description: "Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.",
        content: "<h2>Resumen del Proyecto</h2><p>Proyecto residencial con supervisión integral del sitio y execució a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.</p><h3>Características Principales</h3><ul><li>Supervisión y execució del sitio</li><li>Prácticas de construcción sostenible</li><li>Diseño residencial</li><li>Gestión de construcción</li></ul><h3>Tecnologías Utilizadas</h3><p>Supervisión de Sitio, Construcción, Construcción Sostenible</p>",
        status: "Construido",
        technologies: ["Supervisión de Sitio", "Construcción", "Construcción Sostenible"],
        tags: ["Arquitectura", "Construcción"]
      },
      ca: {
        title: "Residència Chopra",
        subtitle: "Execució Construïda i Experiència en Lloc",
        description: "Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.",
        content: "<h2>Resum del Projecte</h2><p>Projecte residencial amb supervisió integral del lloc i execució a través de K12 Atelier, centrant-se en pràctiques de construcció sostenible.</p><h3>Característiques Principals</h3><ul><li>Supervisió i execució del lloc</li><li>Pràctiques de construcció sostenible</li><li>Disseny residencial</li><li>Gestió de construcció</li></ul><h3>Tecnologies Utilitzades</h3><p>Supervisió de Lloc, Construcció, Construcció Sostenible</p>",
        status: "Construït",
        technologies: ["Supervisió de Lloc", "Construcció", "Construcció Sostenible"],
        tags: ["Arquitectura", "Construcció"]
      }
    }
  }
];

// Database-like functions
export const dynamicProjectsService = {
  // Clear all data (for debugging)
  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared all project data');
  },

  // Get all projects
  getAllProjects: (): DynamicProject[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Stored projects:', stored);
      
      if (!stored) {
        console.log('No stored projects found, initializing with sample data');
        const initialData = initializeSampleData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData;
      }
      
      const parsed = JSON.parse(stored);
      console.log('Parsed projects:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to sample data if there's an error
      const initialData = initializeSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
  },

  // Get project by ID
  getProjectById: (id: string): DynamicProject | null => {
    const projects = dynamicProjectsService.getAllProjects();
    return projects.find(project => project.id === id) || null;
  },

  // Create new project
  createProject: (projectData: Omit<DynamicProject, 'id' | 'created_at' | 'updated_at'>): DynamicProject => {
    const projects = dynamicProjectsService.getAllProjects();
    const newProject: DynamicProject = {
      ...projectData,
      id: Date.now().toString(), // Simple ID generation
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newProject;
  },

  // Update project
  updateProject: (id: string, updates: Partial<DynamicProject>): DynamicProject | null => {
    const projects = dynamicProjectsService.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) return null;
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects[projectIndex];
  },

  // Delete project
  deleteProject: (id: string): boolean => {
    const projects = dynamicProjectsService.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProjects));
    return true;
  },

  // Get featured projects
  getFeaturedProjects: (): DynamicProject[] => {
    const projects = dynamicProjectsService.getAllProjects();
    return projects.filter(project => project.featured);
  },

  // Search projects
  searchProjects: (query: string): DynamicProject[] => {
    const projects = dynamicProjectsService.getAllProjects();
    const lowercaseQuery = query.toLowerCase();
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.subtitle.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Get projects by tag
  getProjectsByTag: (tag: string): DynamicProject[] => {
    const projects = dynamicProjectsService.getAllProjects();
    return projects.filter(project => 
      project.tags.some(projectTag => 
        projectTag.toLowerCase() === tag.toLowerCase()
      )
    );
  },

  // Get projects by status
  getProjectsByStatus: (status: string): DynamicProject[] => {
    const projects = dynamicProjectsService.getAllProjects();
    return projects.filter(project => project.status === status);
  }
};

// Hook for translated projects
export const useDynamicTranslatedProjects = () => {
  const { language } = useLanguage();

  const getTranslatedProjects = (): DynamicProject[] => {
    console.log('Getting translated projects for language:', language);
    const projects = dynamicProjectsService.getAllProjects();
    console.log('All projects:', projects);
    
    return projects.map(project => {
      // If project has translations for current language, use them
      if (project.translations && project.translations[language as keyof typeof project.translations]) {
        const translation = project.translations[language as keyof typeof project.translations];
        return {
          ...project,
          ...translation
        } as DynamicProject;
      }
      
      // Fallback to English (original project data)
      return project;
    });
  };

  const getTranslatedProjectById = (id: string): DynamicProject | null => {
    const project = dynamicProjectsService.getProjectById(id);
    if (!project) return null;

    // If project has translations for current language, use them
    if (project.translations && project.translations[language as keyof typeof project.translations]) {
      const translation = project.translations[language as keyof typeof project.translations];
      return {
        ...project,
        ...translation
      } as DynamicProject;
    }
    
    // Fallback to English (original project data)
    return project;
  };

  return {
    getTranslatedProjects,
    getTranslatedProjectById,
    getAllProjects: dynamicProjectsService.getAllProjects,
    createProject: dynamicProjectsService.createProject,
    updateProject: dynamicProjectsService.updateProject,
    deleteProject: dynamicProjectsService.deleteProject,
    getFeaturedProjects: dynamicProjectsService.getFeaturedProjects,
    searchProjects: dynamicProjectsService.searchProjects,
    getProjectsByTag: dynamicProjectsService.getProjectsByTag,
    getProjectsByStatus: dynamicProjectsService.getProjectsByStatus
  };
}; 