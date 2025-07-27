import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { projectsService, Project } from '@/services/projectsService';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const filters = ['All', 'Architecture', 'Urban Design', 'Computational Design', 'AI/ML', 'BIM', 'Research'];

  useEffect(() => {
    const loadProjects = () => {
      const allProjects = projectsService.getAllProjects();
      setProjects(allProjects);
    };
    loadProjects();
  }, []);

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

  return (
    <section id="portfolio" className="section-spacing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6"> My <span className="kinetic-text">Portfolio</span> </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring the intersection of computational design, urban technology, and AI-driven solutions
          </p>
          
          {user && (
            <div className="flex justify-center mt-8">
              <Link to="/portfolio/create">
                <Button className="btn-hero">
                  <Plus size={18} className="mr-2" />
                  Add New Project
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Featured Projects */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Featured Projects</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="project-card group">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs bg-background/90">
                      {project.status}
                    </Badge>
                  </div>
                  
                  {user && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Link to={`/portfolio/edit/${project.id}`}>
                        <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteProject(project.id, project.title)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    {project.subtitle}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.technologies.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/portfolio/${project.id}`}>
                      <Button size="sm" className="btn-hero flex-1">
                        <Eye size={16} className="mr-2" />
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'outline'}
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? 'btn-accent' : ''}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* All Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="project-card group">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-xs bg-background/90">
                      {project.status}
                    </Badge>
                  </div>
                  
                  {user && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Link to={`/portfolio/edit/${project.id}`}>
                        <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="bg-background/90 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteProject(project.id, project.title)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {project.description.slice(0, 100)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link to={`/portfolio/${project.id}`}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full hover:bg-primary hover:text-primary-foreground"
                    >
                      <Eye size={16} className="mr-2" />
                      View Project
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <h3 className="text-3xl font-bold mb-4">Explore More of My Work</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Dive deeper into my comprehensive digital portfolio or connect with me on GitHub to see my code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-hero"
              onClick={() => window.open("https://www.calameo.com/read/007995635f849de9a792d", "_blank")}
            >
              <ExternalLink size={18} className="mr-2" />
              Digital Portfolio
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.open("https://github.com/maheepmouli", "_blank")}
            >
              <Github size={18} className="mr-2" />
              View on GitHub
            </Button>
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={handleHireMe}
            >
              <ExternalLink size={18} className="mr-2" />
              Hire Me
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Portfolio; 