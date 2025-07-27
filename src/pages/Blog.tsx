import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  tags: string[];
  created_at: string;
  slug: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, cover_image_url, tags, created_at, slug')
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

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
        <div className="container mx-auto px-4">
          <div className="text-center">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blog & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on architecture, technology, and the intersection of digital and physical design.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                All Posts
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
            <p className="text-muted-foreground">
              Check back soon for thoughts on architecture, technology, and design.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {post.cover_image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.created_at)}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {post.tags && post.tags.length > 0 && (
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 