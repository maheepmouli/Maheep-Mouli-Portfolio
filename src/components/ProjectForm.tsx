import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, Upload, X, Plus, Image as ImageIcon, FileImage } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import ImageManager from './ImageManager';
import VideoManager, { VideoItem } from './VideoManager';
import { unifiedProjectsService, UnifiedProject } from '@/services/unifiedProjectsService';
import { imageUploadService, uploadImageToSupabase as uploadImageToSupabaseService } from '@/services/imageUploadService';

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
  project_images?: string[];
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
    project_images: [],
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
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projectImages, setProjectImages] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      setIsEditing(true);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      console.log('ProjectForm: Fetching project with ID:', projectId);
      const project = await unifiedProjectsService.getProjectById(projectId!);
      console.log('ProjectForm: Retrieved project:', project);
      
      if (!project) {
        toast({
          title: "Error",
          description: "Project not found.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('ProjectForm: Loading project data:', project);
      console.log('ProjectForm: Project videos from database:', project.videos);
      console.log('ProjectForm: Project location from database:', project.location);
      
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        content: project.content || '',
        image_url: project.image_url || '',
        project_images: project.project_images || [],
        tags: project.technologies || [], // Use technologies instead of tags
        status: 'draft', // Default status since it's not in UnifiedProject
        featured: project.featured || false,
        project_url: project.live_url || '', // Use live_url instead of project_url
        github_url: project.github_url || '',
        location: project.location || project.subtitle || '', // Use location if available, fallback to subtitle
        duration: '', // Not available in UnifiedProject
        team_size: '', // Not available in UnifiedProject
        technologies: project.technologies || [],
        videos: project.videos || [] // Load existing videos
      });

      // Load existing project images
      if (project.project_images && project.project_images.length > 0) {
        console.log('ProjectForm: Loading existing project images:', project.project_images);
        const existingImages = project.project_images.map((imageUrl, index) => ({
          id: `existing-image-${index}`,
          image_url: imageUrl,
          caption: `Project image ${index + 1}`,
          alt_text: `Project image ${index + 1}`,
          sort_order: index,
          width: '100%',
          height: 'auto'
        }));
        setProjectImages(existingImages);
        console.log('ProjectForm: Set project images:', existingImages);
      } else {
        console.log('ProjectForm: No existing project images found');
        setProjectImages([]);
      }
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
    console.log('ProjectForm: Current form data:', formData);
    console.log('ProjectForm: Project images:', projectImages);
    console.log('ProjectForm: User authenticated:', !!user);
    console.log('ProjectForm: Is editing:', isEditing);
    console.log('ProjectForm: Project ID:', projectId);
    
    // Validate required fields
    if (!formData.title || !formData.description) {
      toast({
        title: "❌ Missing Required Fields",
        description: "Please fill in title and description.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    try {
      console.log('ProjectForm: Starting form submission');
      console.log('ProjectForm: Current form data:', formData);
      
      // Generate slug from title
      const generateSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      const projectData = {
        ...formData,
        slug: generateSlug(formData.title),
        technologies: formData.technologies,
        project_images: projectImages.map(img => img.image_url),
        videos: formData.videos || [],
        location: formData.location || formData.subtitle || ''
      };
      
      console.log('ProjectForm: Videos being saved:', formData.videos);
      console.log('ProjectForm: Location being saved:', formData.location);
      
      console.log('ProjectForm: Project data being saved:', projectData);
      console.log('ProjectForm: Project images being saved:', projectImages.map(img => img.image_url));

      if (isEditing && projectId) {
        console.log('ProjectForm: Updating project with ID:', projectId);
        console.log('ProjectForm: Project data to update:', projectData);
        
        // Update existing project
        console.log('ProjectForm: Calling updateProject with ID:', projectId);
        console.log('ProjectForm: Update data:', projectData);
        const updatedProject = await unifiedProjectsService.updateProject(projectId, projectData);
        console.log('ProjectForm: Updated project result:', updatedProject);
        
        if (updatedProject) {
          console.log('ProjectForm: Successfully updated project:', updatedProject);
          
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
        console.log('ProjectForm: Attempting to create project...');
        console.log('ProjectForm: Project data being sent:', projectData);
        
        let newProject;
        try {
          newProject = await unifiedProjectsService.createProject(projectData);
          console.log('ProjectForm: Created project result:', newProject);
          
          if (!newProject) {
            console.error('ProjectForm: Service returned null/undefined for new project');
            throw new Error("Failed to create project - no project returned");
          }
          
          console.log('ProjectForm: Project created successfully with ID:', newProject.id);
        
        } catch (serviceError) {
          console.error('ProjectForm: Service error details:', serviceError);
          throw new Error(`Service error: ${serviceError}`);
        }
        
        toast({
          title: "🎉 Project Created Successfully!",
          description: "Your new project has been created and is now live.",
        });
        
        // Redirect to portfolio page to see the new project
        setTimeout(() => {
          window.location.href = '/portfolio';
        }, 1000);
      }
    } catch (error) {
      console.error('ProjectForm: Error during form submission:', error);
      
      toast({
        title: "❌ Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('ProjectForm: Image file selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      setImageFile(file);
      setIsUploading(true);
      
      try {
        // Upload image immediately
        const imageUrl = await uploadImageToSupabaseService(file);
        console.log('ProjectForm: Image uploaded successfully:', imageUrl);
        
        // Update form data with the uploaded image URL
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        console.log('ProjectForm: Updated formData.image_url to:', imageUrl);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
          console.log('ProjectForm: Image preview created');
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "✅ Image Uploaded",
          description: "Cover image has been uploaded successfully.",
        });
        
        // If editing, update the project immediately
        if (projectId) {
          console.log('ProjectForm: Updating project with new image URL:', imageUrl);
          await unifiedProjectsService.updateProject(projectId, { image_url: imageUrl });
          console.log('ProjectForm: Project updated with new image');
        }
        
      } catch (error) {
        console.error('ProjectForm: Image upload failed:', error);
        
        // Check for specific bucket error
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Storage bucket not found')) {
          toast({
            title: "❌ Storage Not Configured",
            description: "Please create the 'portfolio-assets' bucket in your Supabase dashboard. Check STORAGE_SETUP.md for instructions.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "❌ Upload Failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          });
        }
        
        // Clear the file if upload failed
        setImageFile(null);
        setImagePreview('');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      console.log('ProjectForm: Uploading image to Supabase...');
      
      // Use the imported service function
      const imageUrl = await uploadImageToSupabaseService(file);
      
      console.log('ProjectForm: Image uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('ProjectForm: Image upload failed:', error);
      throw error;
    }
  };

  const handleImageUploadClick = () => {
    const input = document.getElementById('image_upload') as HTMLInputElement;
    input?.click();
  };

  const handleRemoveImage = async () => {
    // Clear the image URL
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImageFile(null);
    setImagePreview('');
    
    // Update the project immediately if editing
    if (projectId) {
      try {
        await unifiedProjectsService.updateProject(projectId, { image_url: '' });
        toast({
          title: "✅ Image Removed Successfully!",
          description: "Cover image has been removed. The portfolio should update immediately.",
        });
      } catch (error) {
        console.error('Error removing image:', error);
        toast({
          title: "Error",
          description: "Failed to remove image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <form onSubmit={(e) => {
      console.log('ProjectForm: Form onSubmit triggered!');
      handleSubmit(e);
    }} className="space-y-8">
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
                <Label htmlFor="image_url" className="text-sm text-muted-foreground">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="image_upload" className="text-sm text-muted-foreground">Upload from Device *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                    style={{ display: 'none' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageUploadClick}
                    className="flex-1"
                  >
                    <FileImage size={16} className="mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Image Preview */}
            {(formData.image_url || imagePreview) ? (
              <div className="border rounded-lg p-4 bg-muted/20">
                <Label className="text-sm font-medium mb-2">Preview</Label>
                <div className="relative group">
                  <img
                    src={imagePreview || formData.image_url}
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
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <X size={16} className="mr-2" />
                    Remove Image
                  </Button>
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Uploading...
                    </div>
                  )}
                  {formData.image_url && !isUploading && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <ImageIcon size={16} />
                      Uploaded Successfully
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/20">
                <Label className="text-sm font-medium mb-2">No Cover Image</Label>
                <div className="h-48 bg-muted flex items-center justify-center rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon size={48} className="mx-auto mb-2" />
                    <p className="text-sm">No cover image selected</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload an image above to set as cover</p>
                  </div>
                </div>
                {isUploading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-blue-600 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Uploading image...
                  </div>
                )}
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
              id="new-technology"
              name="new-technology"
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
              id="new-tag"
              name="new-tag"
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
          disabled={loading || isUploading}
        >
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : isUploading ? 'Uploading...' : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm; 