import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import ImageManager from './ImageManager';
import VideoManager, { VideoItem } from './VideoManager';
import { projectsService, Project, ProjectImage } from '@/services/projectsService';

interface ProjectFormProps {
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  tags: string[];
  status: 'draft' | 'published' | 'Live Demo' | 'Case Study' | 'Built' | 'Research' | 'Completed' | 'Development';
  featured: boolean;
  project_url?: string;
  github_url?: string;
  location?: string;
  duration?: string;
  team_size?: string;
  technologies: string[];
  videos: VideoItem[];
}

const ProjectForm = ({ projectId, onSuccess, onCancel }: ProjectFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image_url: '',
    tags: [],
    status: 'draft',
    featured: false,
    project_url: '',
    github_url: '',
    location: '',
    duration: '',
    team_size: '',
    technologies: [],
    videos: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      setIsEditing(true);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const project = projectsService.getProjectById(projectId!);
      if (!project) {
        toast({
          title: "Error",
          description: "Project not found.",
          variant: "destructive"
        });
        return;
      }
      
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        content: project.content || '',
        image_url: project.image_url || '',
        tags: project.tags || [],
        status: project.status || 'draft',
        featured: project.featured || false,
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        location: project.location || '',
        duration: project.duration || '',
        team_size: project.team_size || '',
        technologies: project.technologies || [],
        videos: project.videos || []
      });

      // Fetch project images
      const images = projectsService.getProjectImages(projectId!);
      setProjectImages(images);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project data.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies
      };

      if (isEditing && projectId) {
        // Update existing project
        const updatedProject = projectsService.updateProject(projectId, projectData);
        if (updatedProject) {
          toast({
            title: "Success!",
            description: "Project updated successfully."
          });
          onSuccess?.();
        } else {
          throw new Error("Failed to update project");
        }
      } else {
        // Create new project
        const newProject = projectsService.createProject(projectData);
        toast({
          title: "Success!",
          description: "Project created successfully."
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleTechnologyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Flow-SIGHT"
                required
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="e.g., Real-time Congestion Prediction Dashboard"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the project..."
              required
            />
          </div>

          <div>
            <Label htmlFor="image_url">Cover Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Barcelona, Spain"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 6 months"
              />
            </div>
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                value={formData.team_size}
                onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                placeholder="e.g., 4 people"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_url">Project URL</Label>
              <Input
                id="project_url"
                value={formData.project_url}
                onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                placeholder="https://project-demo.com"
              />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Project Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Detailed Content</Label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies & Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              onKeyPress={handleTechnologyKeyPress}
              placeholder="Add technology (e.g., React, Python)"
            />
            <Button type="button" onClick={addTechnology} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tech}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTechnology(tech)}
                  className="h-auto p-0 ml-1"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tag (e.g., AI Tools, Urban Analytics)"
            />
            <Button type="button" onClick={addTag} variant="outline">
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="h-auto p-0 ml-1"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Images */}
      <Card>
        <CardHeader>
          <CardTitle>Project Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageManager
            images={projectImages}
            onImagesChange={(images) => setProjectImages(images)}
          />
        </CardContent>
      </Card>

      {/* Project Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Project Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoManager
            videos={formData.videos}
            onVideosChange={(videos) => setFormData(prev => ({ ...prev, videos }))}
          />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="featured">Featured Project</Label>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="Live Demo">Live Demo</option>
              <option value="Case Study">Case Study</option>
              <option value="Built">Built</option>
              <option value="Research">Research</option>
              <option value="Completed">Completed</option>
              <option value="Development">Development</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm; 