import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabaseBlogsService } from '@/services/supabaseBlogsService';
import supabase from '@/lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  tags: string[];
  created_at: string;
  status: string;
}

const BlogEditPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    cover_image_url: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      // Get post from Supabase
      const foundPost = await supabaseBlogsService.getBlogBySlug(postSlug);

      if (foundPost) {
        setPost(foundPost);
        setFormData({
          title: foundPost.title || '',
          excerpt: foundPost.excerpt || '',
          content: foundPost.content || '',
          tags: foundPost.tags || [],
          status: (foundPost.status as 'draft' | 'published') || 'draft',
          cover_image_url: foundPost.cover_image_url || ''
        });
      } else {
        toast({
          title: "Error loading post",
          description: "Post not found or you don't have permission to edit it.",
          variant: "destructive"
        });
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error loading post",
        description: "Post not found or you don't have permission to edit it.",
        variant: "destructive"
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!post) {
        throw new Error('Post not found');
      }

      let finalImageUrl = formData.cover_image_url;

      // Upload image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          // If upload failed, don't proceed
          setSaving(false);
          return;
        }
      }

      // Generate new slug from title
      const newSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Update blog in Supabase
      const updatedBlog = await supabaseBlogsService.updateBlog(post.id, {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        cover_image_url: finalImageUrl,
        tags: formData.tags,
        status: formData.status,
        slug: newSlug
      });

      if (!updatedBlog) {
        throw new Error('Failed to update blog post');
      }

      toast({
        title: "Post updated successfully!",
        description: formData.status === 'published' 
          ? "Your post is now live on the blog."
          : "Your draft has been saved."
      });

      navigate(`/blog/${newSlug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error updating post",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile || !user) return null;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Attempting to upload image to Supabase...');
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Supabase upload failed:', uploadError);
        
        // Fallback: Convert to base64 and store as data URL
        console.log('Using fallback: converting to base64...');
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            toast({
              title: "Image converted to data URL",
              description: "Image stored locally due to upload restrictions."
            });
            resolve(dataUrl);
          };
          reader.readAsDataURL(selectedFile);
        });
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      toast({
        title: "Image uploaded successfully!",
        description: "Your image has been uploaded to Supabase."
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Fallback: Convert to base64
      console.log('Using fallback due to error...');
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          toast({
            title: "Image converted to data URL",
            description: "Image stored locally due to upload restrictions.",
            variant: "default"
          });
          resolve(dataUrl);
        };
        reader.readAsDataURL(selectedFile);
      });
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, cover_image_url: '' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-center">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're trying to edit doesn't exist.
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/blog/${post.slug}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Post
            </Button>
            <h1 className="text-3xl font-bold">Edit Post</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label>Cover Image</Label>
                    
                    {/* Upload from Computer */}
                    <div className="space-y-2">
                      <Label htmlFor="image-upload" className="text-sm font-medium">
                        Upload from Computer
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JPEG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>

                    {/* Or Enter URL */}
                    <div className="space-y-2">
                      <Label htmlFor="cover_image_url" className="text-sm font-medium">
                        Or Enter Image URL
                      </Label>
                      <Input
                        id="cover_image_url"
                        value={formData.cover_image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || formData.cover_image_url) && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Preview</Label>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || formData.cover_image_url}
                            alt="Cover preview"
                            className="max-w-xs max-h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={clearImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content here..."
                      rows={15}
                      required
                    />
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
                      placeholder="Add a tag"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Publishing */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        status: e.target.value as 'draft' | 'published' 
                      }))}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || uploading}
                  className="btn-hero"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Update Post'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEditPage; 