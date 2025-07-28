import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X, Save, Image as ImageIcon, Upload, Video, Youtube, HardDrive } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDynamicTranslatedProjects, DynamicProject } from '@/services/dynamicProjectsService';
import Navigation from '@/components/Navigation';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { createProject } = useDynamicTranslatedProjects();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content: '',
    image_url: '', // Main image for thumbnail
    images: [] as string[], // Additional images array
    videos: [] as string[], // Video URLs array
    status: 'draft' as const,
    featured: false,
    project_url: '',
    github_url: '',
    location: '',
    duration: '',
    team_size: '',
    technologies: [] as string[],
    tags: [] as string[]
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      handleInputChange('technologies', [...formData.technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    handleInputChange('technologies', formData.technologies.filter(t => t !== tech));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      handleInputChange('images', [...formData.images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    handleInputChange('images', formData.images.filter(img => img !== image));
  };

  const addVideo = () => {
    if (newVideo.trim() && !formData.videos.includes(newVideo.trim())) {
      handleInputChange('videos', [...formData.videos, newVideo.trim()]);
      setNewVideo('');
    }
  };

  const removeVideo = (video: string) => {
    handleInputChange('videos', formData.videos.filter(v => v !== video));
  };

  // Handle local file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert file to base64 for storage
        const base64 = await convertFileToBase64(file);
        
        // Add to images array
        handleInputChange('images', [...formData.images, base64]);
      }
      
      toast({
        title: "Images Uploaded",
        description: `${files.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newProject: Omit<DynamicProject, 'id' | 'created_at' | 'updated_at'> = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        content: formData.content,
        image_url: formData.image_url,
        images: formData.images,
        videos: formData.videos,
        status: formData.status,
        featured: formData.featured,
        project_url: formData.project_url,
        github_url: formData.github_url,
        location: formData.location,
        duration: formData.duration,
        team_size: formData.team_size,
        technologies: formData.technologies,
        tags: formData.tags
      };

      const success = createProject(newProject);
      
      if (success) {
        toast({
          title: "Project Created",
          description: "Your project has been created successfully!",
        });
        navigate('/portfolio');
      } else {
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div 
        className="container mx-auto px-6 py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/portfolio')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Portfolio
          </Button>
          <h1 className="text-4xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">Add a new project to your portfolio</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Brief project description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Project description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Detailed Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Detailed project content"
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="image_url">Main Project Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/main-image.jpg"
                    />
                  </div>

                  {/* Local Image Upload */}
                  <div>
                    <Label>Upload Local Images</Label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-primary/50', 'bg-primary/5');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5');
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          handleFileUpload({ target: { files } } as any);
                        }
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag & drop images here or click to browse
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Choose Images'}
                      </Button>
                    </div>
                  </div>

                  {/* Multiple Images Section */}
                  <div>
                    <Label>Additional Image URLs</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="https://example.com/additional-image.jpg"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      />
                      <Button type="button" onClick={addImage} size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Added Images:</Label>
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <ImageIcon size={16} className="text-muted-foreground" />
                            <span className="text-sm flex-1 truncate">
                              {image.startsWith('data:') ? `Local Image ${index + 1}` : image}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(image)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video URLs Section */}
                  <div>
                    <Label>Video URLs (YouTube/Google Drive)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVideo())}
                      />
                      <Button type="button" onClick={addVideo} size="sm">
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    {formData.videos.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Added Videos:</Label>
                        {formData.videos.map((video, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            {video.includes('youtube.com') ? (
                              <Youtube size={16} className="text-red-500" />
                            ) : video.includes('drive.google.com') ? (
                              <HardDrive size={16} className="text-blue-500" />
                            ) : (
                              <Video size={16} className="text-muted-foreground" />
                            )}
                            <span className="text-sm flex-1 truncate">{video}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVideo(video)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
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
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="Live Demo">Live Demo</SelectItem>
                        <SelectItem value="Case Study">Case Study</SelectItem>
                        <SelectItem value="Built">Built</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Project location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 3 months"
                    />
                  </div>

                  <div>
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      value={formData.team_size}
                      onChange={(e) => handleInputChange('team_size', e.target.value)}
                      placeholder="e.g., 5 people"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Links and Technologies */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project_url">Project URL</Label>
                    <Input
                      id="project_url"
                      value={formData.project_url}
                      onChange={(e) => handleInputChange('project_url', e.target.value)}
                      placeholder="https://project-demo.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add technology"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology} size="sm">
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  {formData.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                          {tech} <X size={12} className="ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} <X size={12} className="ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div 
            className="mt-8 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button type="submit" className="btn-hero">
              <Save size={18} className="mr-2" />
              Create Project
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectCreate; 