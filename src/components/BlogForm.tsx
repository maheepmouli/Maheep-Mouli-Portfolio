import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from './RichTextEditor';
import VideoManager, { VideoItem } from './VideoManager';

interface BlogFormProps {
  slug?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface BlogData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  tags: string[];
  status: 'draft' | 'published';
  videos: VideoItem[];
  published_at?: string;
  updated_at?: string;
}

const BlogForm = ({ slug, onSuccess, onCancel }: BlogFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<BlogData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    tags: [],
    status: 'draft',
    videos: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      setIsEditing(true);
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // This would fetch from your blog service
      // For now, we'll use placeholder data
      const blog = {
        title: 'Sample Blog Post',
        slug: slug,
        excerpt: 'This is a sample blog post excerpt.',
        content: '<p>Sample content here...</p>',
        featured_image: '',
        tags: ['Sample', 'Blog'],
        status: 'draft' as const,
        videos: []
      };
      
      setFormData(blog);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog post.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from title if not provided
      const finalSlug = formData.slug || formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const blogData = {
        ...formData,
        slug: finalSlug,
        author: user?.displayName || 'Admin',
        published_at: isEditing ? formData.published_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save blog post (this would call your blog service)
      console.log('Saving blog post:', blogData);
      
      toast({
        title: isEditing ? "✅ Blog Post Updated!" : "🎉 Blog Post Created!",
        description: isEditing 
          ? "Your blog post has been successfully updated and is now live."
          : "Your new blog post has been successfully created and is now live.",
      });

      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
          <div>
            <Label htmlFor="title">Blog Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your blog post title..."
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="auto-generated-from-title"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave empty to auto-generate from title
            </p>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of your blog post..."
              required
            />
          </div>

          <div>
            <Label htmlFor="featured_image">Featured Image URL</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Content</Label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </CardContent>
      </Card>

      {/* Blog Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoManager
            videos={formData.videos}
            onVideosChange={(videos) => setFormData(prev => ({ ...prev, videos }))}
          />
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
              placeholder="Add tag (e.g., Technology, Design)"
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

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
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
          {loading ? 'Saving...' : (isEditing ? 'Update Blog Post' : 'Create Blog Post')}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm; 