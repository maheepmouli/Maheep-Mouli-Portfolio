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
import { useDynamicTranslatedProjects, DynamicProject } from '@/services/dynamicProjectsService';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { getTranslatedProjectById, deleteProject } = useDynamicTranslatedProjects();
  const [project, setProject] = useState<DynamicProject | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedProject = getTranslatedProjectById(id);
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
  }, [id, navigate, toast, getTranslatedProjectById]);

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
      const success = deleteProject(project.id);
      if (success) {
        toast({
          title: "Project Deleted",
          description: `"${project.title}" has been removed from your portfolio.`,
        });
        navigate('/portfolio');
      } else {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive"
        });
      }
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