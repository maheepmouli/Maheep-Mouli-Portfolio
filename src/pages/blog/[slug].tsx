import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Edit, ExternalLink, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseBlogsService, SupabaseBlog } from '@/services/supabaseBlogsService';
import SocialShare from '@/components/SocialShare';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  cover_image_url?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  status: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      console.log('BlogPostPage: Fetching post with slug:', postSlug);
      
      // Decode URL slug in case it comes from external links
      const decodedSlug = decodeURIComponent(postSlug);
      console.log('BlogPostPage: Decoded slug:', decodedSlug);
      
      // Use Supabase service with proper filtering
      const blogPost = await supabaseBlogsService.getBlogBySlug(decodedSlug);
      
      if (blogPost) {
        // Convert SupabaseBlog to BlogPost format
        const post: BlogPost = {
          id: blogPost.id,
          title: blogPost.title,
          excerpt: blogPost.excerpt || '',
          slug: blogPost.slug,
          content: blogPost.content,
          cover_image_url: blogPost.cover_image_url,
          tags: blogPost.tags || [],
          created_at: blogPost.created_at,
          updated_at: blogPost.updated_at,
          status: blogPost.status
        };
        
        console.log('BlogPostPage: Found post:', post);
        setPost(post);
        setError(null);
      } else {
        console.log('BlogPostPage: Post not found or excluded');
        setNotFound(true);
        setError(`Blog post with slug "${decodedSlug}" not found`);
      }
    } catch (error) {
      console.error('BlogPostPage: Error fetching post:', error);
      setNotFound(true);
      setError(error instanceof Error ? error.message : 'Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <div className="text-muted-foreground">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          {error && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
              <strong>Error details:</strong> {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/blog">
              <Button className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/blog" className="inline-block mb-8">
          <Button variant="ghost" className="hover:bg-secondary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Post Header */}
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span>{formatDate(post.created_at)}</span>
              </div>
              {post.updated_at !== post.created_at && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <span>Updated {formatDate(post.updated_at)}</span>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Admin Actions */}
            {user && (
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to={`/blog/edit/${post.slug}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Post
                  </Button>
                </Link>
              </div>
            )}
          </header>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="aspect-video overflow-hidden rounded-lg mb-12">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Post Content */}
          <article className="prose prose-lg max-w-none mb-12 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary">
            <div
              className="whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Post Footer */}
          <footer className="border-t pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Published on {formatDate(post.created_at)}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/blog" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
                
                {post.status === 'published' && (
                  <div className="w-full sm:w-auto">
                    <SocialShare 
                      title={post.title}
                      url={window.location.href}
                      excerpt={post.excerpt}
                    />
                  </div>
                )}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage; 