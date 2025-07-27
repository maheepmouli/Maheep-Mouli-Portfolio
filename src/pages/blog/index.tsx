import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  cover_image_url?: string;
  tags: string[];
  created_at: string;
  status: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTags]);

  const fetchPosts = async () => {
    try {
      // Get blog posts from localStorage
      const storedPosts = localStorage.getItem('blog_posts');
      const allPosts = storedPosts ? JSON.parse(storedPosts) : [];
      
      // Filter only published posts and sort by creation date
      const publishedPosts = allPosts
        .filter((post: BlogPost) => post.status === 'published')
        .sort((a: BlogPost, b: BlogPost) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    setFilteredPosts(filtered);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
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
          <motion.div 
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/blog/create">
                  <Button className="btn-hero">
                    <Plus size={18} className="mr-2" />
                    Create New Post
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div 
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by tags:</span>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2">
              {getAllTags().map((tag) => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors ${
                      selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} posts
              {searchTerm && ` for "${searchTerm}"`}
              {selectedTags.length > 0 && ` tagged with ${selectedTags.join(', ')}`}
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="max-w-6xl mx-auto">
            {filteredPosts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedTags.length > 0 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Check back soon for insights on computational design and urban technology.'
                  }
                </p>
                {(searchTerm || selectedTags.length > 0) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTags([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                {user && !searchTerm && selectedTags.length === 0 && (
                  <Link to="/blog/create">
                    <Button className="btn-hero">
                      <Plus size={18} className="mr-2" />
                      Write First Post
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="project-card group h-full">
                      {post.cover_image_url && (
                        <div className="relative overflow-hidden">
                          <motion.img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
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
                      <CardContent className="flex flex-col h-full">
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                            {post.excerpt}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Badge variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              </motion.div>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link to={`/blog/${post.slug}`}>
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                              Read More
                              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 