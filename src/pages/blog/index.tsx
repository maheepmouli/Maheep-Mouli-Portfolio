import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  created_at: string;
  status: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">Loading blog posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blog & <span className="kinetic-text">Insights</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Exploring the intersection of computational design, urban technology, and AI-driven solutions
              </p>
            </div>

            {/* Admin Actions */}
            {user && (
              <div className="flex justify-center mb-8">
                <Link to="/blog/create">
                  <Button className="btn-hero">
                    <Plus size={18} className="mr-2" />
                    Create New Post
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Blog Posts Grid */}
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Check back soon for insights on computational design and urban technology.
                </p>
                {user && (
                  <Link to="/blog/create">
                    <Button className="btn-hero">
                      <Plus size={18} className="mr-2" />
                      Write First Post
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="project-card group">
                    {post.cover_image_url && (
                      <div className="relative overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                          Read More
                          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 