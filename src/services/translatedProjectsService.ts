import { useLanguage } from '@/contexts/LanguageContext';

export interface TranslatedProject {
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

// Project data with translations
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
      description: "Proyecto residencial con supervisión integral del sitio y ejecución a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.",
      content: "<h2>Resumen del Proyecto</h2><p>Proyecto residencial con supervisión integral del sitio y ejecución a través de K12 Atelier, enfocándose en prácticas de construcción sostenible.</p>",
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

// Base project data (non-translatable fields)
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

export const useTranslatedProjects = () => {
  const { language } = useLanguage();
  
  const getTranslatedProjects = (): TranslatedProject[] => {
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
  };
  
  return { getTranslatedProjects };
}; 