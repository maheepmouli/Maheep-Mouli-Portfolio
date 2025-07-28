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
import { dynamicProjectsService } from '@/services/dynamicProjectsService';

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
      console.log('ProjectForm: Fetching project with ID:', projectId);
      const project = projectsService.getProjectById(projectId!);
      console.log('ProjectForm: Retrieved project:', project);
      
      if (!project) {
        console.log('ProjectForm: Project not found in projectsService, checking dynamicProjectsService...');
        const dynamicProject = dynamicProjectsService.getProjectById(projectId!);
        console.log('ProjectForm: Retrieved from dynamicProjectsService:', dynamicProject);
        
        if (dynamicProject) {
          // Convert dynamic project to regular project format
          const regularProject = {
            id: dynamicProject.id,
            title: dynamicProject.title,
            subtitle: dynamicProject.subtitle,
            description: dynamicProject.description,
            content: dynamicProject.content,
            image_url: dynamicProject.image_url,
            status: dynamicProject.status,
            featured: dynamicProject.featured,
            project_url: dynamicProject.project_url,
            github_url: dynamicProject.github_url,
            location: dynamicProject.location,
            duration: dynamicProject.duration,
            team_size: dynamicProject.team_size,
            technologies: dynamicProject.technologies,
            tags: dynamicProject.tags,
            videos: dynamicProject.videos || [],
            created_at: dynamicProject.created_at,
            updated_at: dynamicProject.updated_at
          };
          
          setFormData({
            title: regularProject.title || '',
            subtitle: regularProject.subtitle || '',
            description: regularProject.description || '',
            content: regularProject.content || '',
            image_url: regularProject.image_url || '',
            tags: regularProject.tags || [],
            status: (regularProject.status as any) || 'draft',
            featured: regularProject.featured || false,
            project_url: regularProject.project_url || '',
            github_url: regularProject.github_url || '',
            location: regularProject.location || '',
            duration: regularProject.duration || '',
            team_size: regularProject.team_size || '',
            technologies: regularProject.technologies || [],
            videos: (regularProject.videos || []) as any
          });
          
          // Fetch project images
          try {
            const images = projectsService.getProjectImages(projectId!);
            console.log('ProjectForm: Loaded project images:', images);
            setProjectImages(images || []);
          } catch (error) {
            console.error('ProjectForm: Error loading project images:', error);
            setProjectImages([]);
          }
          return;
        }
        
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
      console.error('ProjectForm: Error fetching project:', error);
      toast({
        title: "Error",
        description: "Failed to load project data.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ProjectForm: Form submitted');
    setLoading(true);

    try {
      console.log('ProjectForm: Starting form submission');
      console.log('ProjectForm: Current form data:', formData);
      console.log('ProjectForm: Current project images:', projectImages);
      const projectData = {
        ...formData,
        technologies: formData.technologies
      };

      if (isEditing && projectId) {
        console.log('ProjectForm: Updating project with ID:', projectId);
        console.log('ProjectForm: Project data to update:', projectData);
        
        // Update existing project
        const updatedProject = projectsService.updateProject(projectId, projectData);
        console.log('ProjectForm: Updated project result:', updatedProject);
        
        if (updatedProject) {
          console.log('ProjectForm: Successfully updated project:', updatedProject);
          
          // Save project images with error handling
          console.log('ProjectForm: Saving project images:', projectImages);
          try {
            projectImages.forEach((image, index) => {
              if (!image.id && image.image_url) {
                // This is a new image, add it to the service
                projectsService.addProjectImage(projectId, {
                  image_url: image.image_url,
                  caption: image.caption || '',
                  alt_text: image.alt_text || '',
                  width: image.width || '100%',
                  height: image.height || 'auto',
                  sort_order: index
                });
              }
            });
          } catch (error) {
            console.error('ProjectForm: Error saving images:', error);
            // Don't fail the entire save if images fail
          }
          
          // Also update in dynamicProjectsService for portfolio sync
          const dynamicProject = {
            ...updatedProject,
            image_url: updatedProject.image_url, // Explicitly preserve image_url
            translations: {
              en: updatedProject,
              es: updatedProject,
              ca: updatedProject
            }
          };
          console.log('ProjectForm: Syncing to dynamicProjectsService:', dynamicProject);
          console.log('ProjectForm: Image URL being synced:', dynamicProject.image_url);
          const syncResult = await dynamicProjectsService.updateProject(projectId, dynamicProject);
          console.log('ProjectForm: Sync result:', syncResult);
          
          // Verify the project exists in both services
          const verifyDynamic = dynamicProjectsService.getProjectById(projectId);
          const verifyRegular = projectsService.getProjectById(projectId);
          console.log('ProjectForm: Verification - Dynamic service:', verifyDynamic ? 'Found' : 'Not found');
          console.log('ProjectForm: Verification - Regular service:', verifyRegular ? 'Found' : 'Not found');
          
          // Check localStorage directly
          const dynamicStorage = localStorage.getItem('dynamic_portfolio_projects');
          const regularStorage = localStorage.getItem('portfolio_projects');
          console.log('ProjectForm: localStorage - Dynamic:', dynamicStorage ? 'Has data' : 'Empty');
          console.log('ProjectForm: localStorage - Regular:', regularStorage ? 'Has data' : 'Empty');
          
          // Trigger custom event to notify Portfolio component
          window.dispatchEvent(new CustomEvent('portfolio-updated', {
            detail: { projectId: projectId, action: 'updated' }
          }));
          
          // Show success message and redirect immediately
          toast({
            title: "✅ Project Updated!",
            description: "Redirecting to project details...",
          });
          
          // Redirect to the updated project immediately
          setTimeout(() => {
            window.location.href = `/portfolio/${projectId}`;
          }, 1000);
        } else {
          throw new Error("Failed to update project");
        }
      } else {
        console.log('ProjectForm: Creating new project');
        console.log('ProjectForm: Project data to create:', projectData);
        
        // Create new project
        const newProject = projectsService.createProject(projectData);
        console.log('ProjectForm: Created project result:', newProject);
        
        // Also create in dynamicProjectsService for portfolio sync
        const dynamicProject = {
          ...newProject,
          image_url: newProject.image_url, // Explicitly preserve image_url
          translations: {
            en: newProject,
            es: newProject,
            ca: newProject
          }
        };
                  console.log('ProjectForm: Syncing to dynamicProjectsService:', dynamicProject);
          console.log('ProjectForm: Image URL being synced for new project:', dynamicProject.image_url);
          const syncResult = await dynamicProjectsService.createProject(dynamicProject);
          console.log('ProjectForm: Sync result:', syncResult);
        
        // Save project images for new project with error handling
        console.log('ProjectForm: Saving project images for new project:', projectImages);
        try {
          projectImages.forEach((image, index) => {
            if (image.image_url) {
              projectsService.addProjectImage(newProject.id, {
                image_url: image.image_url,
                caption: image.caption || '',
                alt_text: image.alt_text || '',
                width: image.width || '100%',
                height: image.height || 'auto',
                sort_order: index
              });
            }
          });
        } catch (error) {
          console.error('ProjectForm: Error saving images for new project:', error);
          // Don't fail the entire save if images fail
        }
        
        toast({
          title: "🎉 Project Created!",
          description: "Your new project has been successfully created and is now live.",
        });
        
        // Trigger custom event to notify Portfolio component
        window.dispatchEvent(new CustomEvent('portfolio-updated', {
          detail: { projectId: newProject.id, action: 'created' }
        }));
        
        // Show success message and redirect immediately
        toast({
          title: "🎉 Project Created!",
          description: "Redirecting to project details...",
        });
        
        // Redirect to the new project immediately
        setTimeout(() => {
          window.location.href = `/portfolio/${newProject.id}`;
        }, 1000);
      }
    } catch (error) {
      console.error('ProjectForm: Error during form submission:', error);
      
      // Check if it's a storage quota error
      if (error instanceof Error && error.message.includes('quota')) {
        toast({
          title: "❌ Storage Full",
          description: "Your browser storage is full. Please clear some data or use smaller images.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to save project. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      console.log('ProjectForm: Form submission completed');
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

          <div className="space-y-4">
            <Label htmlFor="image_url">Cover Image</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image_url" className="text-sm text-muted-foreground">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="image_upload" className="text-sm text-muted-foreground">Or Upload from Device</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          setFormData(prev => ({ ...prev, image_url: result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('image_upload') as HTMLInputElement;
                      input?.click();
                    }}
                  >
                    <Upload size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Image Preview */}
            {formData.image_url && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <Label className="text-sm font-medium mb-2">Preview</Label>
                <div className="relative group">
                  <img
                    src={formData.image_url}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-muted flex items-center justify-center rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Image not found</p>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  className="mt-2"
                >
                  <X size={16} className="mr-2" />
                  Remove Image
                </Button>
              </div>
            )}
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
                onImagesChange={(images) => {
                  try {
                    console.log('ProjectForm: Images changed:', images);
                    setProjectImages(images as any);
                  } catch (error) {
                    console.error('ProjectForm: Error updating project images:', error);
                    toast({
                      title: "Error updating images",
                      description: "Failed to update image list. Please try again.",
                      variant: "destructive"
                    });
                  }
                }}
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
        <Button 
          type="submit" 
          disabled={loading}
          onClick={() => console.log('ProjectForm: Submit button clicked')}
        >
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm; 