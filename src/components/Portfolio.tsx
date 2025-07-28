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
import { useTranslatedProjects, TranslatedProject } from '@/services/translatedProjectsService';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<TranslatedProject[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { getTranslatedProjects } = useTranslatedProjects();
  
  const filters = ['All', 'Architecture', 'Urban Design', 'Computational Design', 'AI/ML', 'BIM', 'Research'];

  const loadProjects = useCallback(() => {
    const allProjects = getTranslatedProjects();
    setProjects(allProjects);
  }, [getTranslatedProjects]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, language]);

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
        {featuredProjects.length > 0 && (
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
        )}

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