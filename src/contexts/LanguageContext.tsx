import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'ca';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',

    // Hero Section
    'hero.title': 'Maheep Mouli Shashi',
    'hero.subtitle': 'Computational Designer & Urban Technologist',
    'hero.description': 'Exploring the intersection of computational design, urban technology, and AI-driven solutions to create sustainable, innovative environments.',
    'hero.learnMore': 'Learn More',
    'hero.letsConnect': "Let's Connect",
    'hero.resume': 'Resume',
    'hero.availableForProjects': 'Available for Projects',
    'hero.architect': 'Architect',
    'hero.urbanTechnologist': 'Urban Technologist',
    'hero.aiThinker': 'AI Thinker',

    // About Section
    'about.title': 'About Maheep',
    'about.description': 'I am a passionate computational designer and urban technologist with expertise in leveraging cutting-edge technologies to solve complex urban challenges. My work spans across computational design, AI/ML applications, BIM implementation, and sustainable urban development.',
    'about.designPhilosophy': 'Design Philosophy',
    'about.philosophyQuote': '"Designing intelligent feedback systems at the intersection of code, geometry & context."',
    'about.philosophyDescription': 'My approach centers on creating responsive, data-driven environments that adapt to user needs while maintaining architectural integrity. I believe in leveraging technology not as an end, but as a means to create more sustainable and human-centered spaces.',
    'about.location': 'Based in Barcelona',
    'about.locationDescription': 'Recently completed Master of Advanced Architecture at IAAC (June 2025) and continues to work on cutting-edge urban technology projects across Europe.',
    'about.openToRelocation': 'Open to relocation and remote collaboration worldwide',
    'about.education': 'Education',
    'about.completePortfolio': 'Complete Portfolio & CV',
    'about.portfolioDescription': 'Download detailed portfolio with project documentation, technical skills, and professional experience',
    'about.downloadCV': 'Download CV',
    'about.viewPortfolio': 'View Portfolio',
    'about.toolsTechnologies': 'Tools & Technologies',
    'about.professionalExperience': 'Professional Experience',
    'about.experienceDescription': '3+ years of experience in architectural design, computational design, and urban technology',
    'about.projectsCompleted': 'Projects Completed',
    'about.yearsExperience': 'Years Experience',

    // Portfolio Section
    'portfolio.title': 'My Portfolio',
    'portfolio.subtitle': 'Exploring the intersection of computational design, urban technology, and AI-driven solutions',
    'portfolio.addNewProject': 'Add New Project',
    'portfolio.featuredProjects': 'Featured Projects',
    'portfolio.allProjects': 'All Projects',
    'portfolio.viewProject': 'View Project',
    'portfolio.editProject': 'Edit Project',
    'portfolio.deleteProject': 'Delete Project',
    'portfolio.hireMe': 'Hire Me',
    'portfolio.digitalPortfolio': 'Digital Portfolio',

    // Services Section
    'services.title': 'Services',
    'services.subtitle': 'Comprehensive solutions for modern architectural challenges',
    'services.computationalDesign': 'Computational Design',
    'services.computationalDesignDesc': 'Advanced parametric modeling and algorithmic design solutions',
    'services.urbanTechnology': 'Urban Technology',
    'services.urbanTechnologyDesc': 'Smart city solutions and urban data analysis',
    'services.aiSolutions': 'AI Solutions',
    'services.aiSolutionsDesc': 'Machine learning applications in architecture and urban planning',
    'services.bimImplementation': 'BIM Implementation',
    'services.bimImplementationDesc': 'Building Information Modeling and digital twin solutions',

    // Contact Section
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Ready to collaborate on your next project?',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.sendMessage': 'Send Message',
    'contact.location': 'Barcelona, Spain',
    'contact.emailAddress': 'maheep.mouli.shashi@gmail.com',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',

    // Blog Section
    'blog.title': 'Blog',
    'blog.subtitle': 'Thoughts on architecture, technology, and innovation',
    'blog.readMore': 'Read More',
    'blog.createPost': 'Create Post',
    'blog.editPost': 'Edit Post',
    'blog.deletePost': 'Delete Post',
    'blog.noPosts': 'No posts found',
    'blog.search': 'Search posts...',
    'blog.filterByTags': 'Filter by tags',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.portfolio': 'Portafolio',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',

    // Hero Section
    'hero.title': 'Maheep Mouli Shashi',
    'hero.subtitle': 'Diseñador Computacional y Tecnólogo Urbano',
    'hero.description': 'Explorando la intersección del diseño computacional, la tecnología urbana y las soluciones impulsadas por IA para crear entornos sostenibles e innovadores.',
    'hero.learnMore': 'Saber Más',
    'hero.letsConnect': 'Conectemos',
    'hero.resume': 'CV',
    'hero.availableForProjects': 'Disponible para Proyectos',
    'hero.architect': 'Arquitecto',
    'hero.urbanTechnologist': 'Tecnólogo Urbano',
    'hero.aiThinker': 'Pensador de IA',

    // About Section
    'about.title': 'Acerca de Maheep',
    'about.description': 'Soy un apasionado diseñador computacional y tecnólogo urbano con experiencia en aprovechar tecnologías de vanguardia para resolver desafíos urbanos complejos. Mi trabajo abarca diseño computacional, aplicaciones de IA/ML, implementación BIM y desarrollo urbano sostenible.',
    'about.designPhilosophy': 'Filosofía de Diseño',
    'about.philosophyQuote': '"Diseñando sistemas de retroalimentación inteligentes en la intersección de código, geometría y contexto."',
    'about.philosophyDescription': 'Mi enfoque se centra en crear entornos responsivos e impulsados por datos que se adaptan a las necesidades del usuario mientras mantienen la integridad arquitectónica. Creo en aprovechar la tecnología no como un fin, sino como un medio para crear espacios más sostenibles y centrados en el ser humano.',
    'about.location': 'Radicado en Barcelona',
    'about.locationDescription': 'Recientemente completó el Máster de Arquitectura Avanzada en IAAC (Junio 2025) y continúa trabajando en proyectos de tecnología urbana de vanguardia en toda Europa.',
    'about.openToRelocation': 'Abierto a reubicación y colaboración remota en todo el mundo',
    'about.education': 'Educación',
    'about.completePortfolio': 'Portafolio Completo y CV',
    'about.portfolioDescription': 'Descarga el portafolio detallado con documentación de proyectos, habilidades técnicas y experiencia profesional',
    'about.downloadCV': 'Descargar CV',
    'about.viewPortfolio': 'Ver Portafolio',
    'about.toolsTechnologies': 'Herramientas y Tecnologías',
    'about.professionalExperience': 'Experiencia Profesional',
    'about.experienceDescription': '3+ años de experiencia en diseño arquitectónico, diseño computacional y tecnología urbana',
    'about.projectsCompleted': 'Proyectos Completados',
    'about.yearsExperience': 'Años de Experiencia',

    // Portfolio Section
    'portfolio.title': 'Mi Portafolio',
    'portfolio.subtitle': 'Explorando la intersección del diseño computacional, la tecnología urbana y las soluciones impulsadas por IA',
    'portfolio.addNewProject': 'Agregar Nuevo Proyecto',
    'portfolio.featuredProjects': 'Proyectos Destacados',
    'portfolio.allProjects': 'Todos los Proyectos',
    'portfolio.viewProject': 'Ver Proyecto',
    'portfolio.editProject': 'Editar Proyecto',
    'portfolio.deleteProject': 'Eliminar Proyecto',
    'portfolio.hireMe': 'Contrátame',
    'portfolio.digitalPortfolio': 'Portafolio Digital',

    // Services Section
    'services.title': 'Servicios',
    'services.subtitle': 'Soluciones integrales para desafíos arquitectónicos modernos',
    'services.computationalDesign': 'Diseño Computacional',
    'services.computationalDesignDesc': 'Soluciones avanzadas de modelado paramétrico y diseño algorítmico',
    'services.urbanTechnology': 'Tecnología Urbana',
    'services.urbanTechnologyDesc': 'Soluciones de ciudades inteligentes y análisis de datos urbanos',
    'services.aiSolutions': 'Soluciones de IA',
    'services.aiSolutionsDesc': 'Aplicaciones de machine learning en arquitectura y planificación urbana',
    'services.bimImplementation': 'Implementación BIM',
    'services.bimImplementationDesc': 'Modelado de Información de Construcción y soluciones de gemelos digitales',

    // Contact Section
    'contact.title': 'Ponte en Contacto',
    'contact.subtitle': '¿Listo para colaborar en tu próximo proyecto?',
    'contact.name': 'Nombre',
    'contact.email': 'Correo Electrónico',
    'contact.message': 'Mensaje',
    'contact.sendMessage': 'Enviar Mensaje',
    'contact.location': 'Barcelona, España',
    'contact.emailAddress': 'maheep.mouli.shashi@gmail.com',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',

    // Blog Section
    'blog.title': 'Blog',
    'blog.subtitle': 'Reflexiones sobre arquitectura, tecnología e innovación',
    'blog.readMore': 'Leer Más',
    'blog.createPost': 'Crear Publicación',
    'blog.editPost': 'Editar Publicación',
    'blog.deletePost': 'Eliminar Publicación',
    'blog.noPosts': 'No se encontraron publicaciones',
    'blog.search': 'Buscar publicaciones...',
    'blog.filterByTags': 'Filtrar por etiquetas',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
  },
  ca: {
    // Navigation
    'nav.home': 'Inici',
    'nav.about': 'Sobre mi',
    'nav.portfolio': 'Portafoli',
    'nav.services': 'Serveis',
    'nav.contact': 'Contacte',
    'nav.blog': 'Blog',
    'nav.admin': 'Admin',
    'nav.login': 'Iniciar Sessió',
    'nav.logout': 'Tancar Sessió',

    // Hero Section
    'hero.title': 'Maheep Mouli Shashi',
    'hero.subtitle': 'Dissenyador Computacional i Tecnòleg Urbà',
    'hero.description': 'Explorant la intersecció del disseny computacional, la tecnologia urbana i les solucions impulsades per IA per crear entorns sostenibles i innovadors.',
    'hero.learnMore': 'Saber Més',
    'hero.letsConnect': 'Connectem',
    'hero.resume': 'CV',
    'hero.availableForProjects': 'Disponible per a Projectes',
    'hero.architect': 'Arquitecte',
    'hero.urbanTechnologist': 'Tecnòleg Urbà',
    'hero.aiThinker': 'Pensador d\'IA',

    // About Section
    'about.title': 'Sobre Maheep',
    'about.description': 'Sóc un apassionat dissenyador computacional i tecnòleg urbà amb experiència en充分利用 vanguarda tecnologies per resoldre reptes urbans complexos. El meu treball abasta disseny computacional, aplicacions d\'IA/ML, implementació BIM i desenvolupament urbà sostenible.',
    'about.designPhilosophy': 'Filosofia de Disseny',
    'about.philosophyQuote': '"Dissenyant sistemes de retroalimentació intel·ligents a la intersecció de codi, geometria i context."',
    'about.philosophyDescription': 'El meu enfocament se centra en crear entorns responsius i impulsats per dades que s\'adapten a les necessitats de l\'usuari mentre mantenen la integritat arquitectònica. Crec en充分利用 la tecnologia no com a fi, sinó com a mitjà per crear espais més sostenibles i centrats en l\'ésser humà.',
    'about.location': 'Radicat a Barcelona',
    'about.locationDescription': 'Recentment va completar el Màster d\'Arquitectura Avançada a IAAC (Juny 2025) i continua treballant en projectes de tecnologia urbana de vanguarda a tota Europa.',
    'about.openToRelocation': 'Obert a reubicació i col·laboració remota a tot el món',
    'about.education': 'Educació',
    'about.completePortfolio': 'Portafoli Complet i CV',
    'about.portfolioDescription': 'Descarrega el portafoli detallat amb documentació de projectes, habilitats tècniques i experiència professional',
    'about.downloadCV': 'Descarregar CV',
    'about.viewPortfolio': 'Veure Portafoli',
    'about.toolsTechnologies': 'Eines i Tecnologies',
    'about.professionalExperience': 'Experiència Professional',
    'about.experienceDescription': '3+ anys d\'experiència en disseny arquitectònic, disseny computacional i tecnologia urbana',
    'about.projectsCompleted': 'Projectes Completats',
    'about.yearsExperience': 'Anys d\'Experiència',

    // Portfolio Section
    'portfolio.title': 'El Meu Portafoli',
    'portfolio.subtitle': 'Explorant la intersecció del disseny computacional, la tecnologia urbana i les solucions impulsades per IA',
    'portfolio.addNewProject': 'Afegir Nou Projecte',
    'portfolio.featuredProjects': 'Projectes Destacats',
    'portfolio.allProjects': 'Tots els Projectes',
    'portfolio.viewProject': 'Veure Projecte',
    'portfolio.editProject': 'Editar Projecte',
    'portfolio.deleteProject': 'Eliminar Projecte',
    'portfolio.hireMe': 'Contracta\'m',
    'portfolio.digitalPortfolio': 'Portafoli Digital',

    // Services Section
    'services.title': 'Serveis',
    'services.subtitle': 'Solucions integrals per a reptes arquitectònics moderns',
    'services.computationalDesign': 'Disseny Computacional',
    'services.computationalDesignDesc': 'Solucions avançades de modelatge paramètric i disseny algorítmic',
    'services.urbanTechnology': 'Tecnologia Urbana',
    'services.urbanTechnologyDesc': 'Solucions de ciutats intel·ligents i anàlisi de dades urbanes',
    'services.aiSolutions': 'Solucions d\'IA',
    'services.aiSolutionsDesc': 'Aplicacions de machine learning en arquitectura i planificació urbana',
    'services.bimImplementation': 'Implementació BIM',
    'services.bimImplementationDesc': 'Modelatge d\'Informació de Construcció i solucions de bessons digitals',

    // Contact Section
    'contact.title': 'Posa\'t en Contacte',
    'contact.subtitle': 'Preparat per col·laborar en el teu proper projecte?',
    'contact.name': 'Nom',
    'contact.email': 'Correu Electrònic',
    'contact.message': 'Missatge',
    'contact.sendMessage': 'Enviar Missatge',
    'contact.location': 'Barcelona, Catalunya',
    'contact.emailAddress': 'maheep.mouli.shashi@gmail.com',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',

    // Blog Section
    'blog.title': 'Blog',
    'blog.subtitle': 'Reflexions sobre arquitectura, tecnologia i innovació',
    'blog.readMore': 'Llegir Més',
    'blog.createPost': 'Crear Publicació',
    'blog.editPost': 'Editar Publicació',
    'blog.deletePost': 'Eliminar Publicació',
    'blog.noPosts': 'No es van trobar publicacions',
    'blog.search': 'Buscar publicacions...',
    'blog.filterByTags': 'Filtrar per etiquetes',

    // Common
    'common.loading': 'Carregant...',
    'common.error': 'Error',
    'common.success': 'Èxit',
    'common.cancel': 'Cancel·lar',
    'common.save': 'Desar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Veure',
    'common.close': 'Tancar',
    'common.back': 'Enrere',
    'common.next': 'Següent',
    'common.previous': 'Anterior',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && ['en', 'es', 'ca'].includes(savedLanguage) ? savedLanguage : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 