import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  created_at: string;
  excerpt: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
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

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading post...</div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
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
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {estimateReadingTime(post.content)} min read
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {post.cover_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {post.excerpt && (
              <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t">
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage; 