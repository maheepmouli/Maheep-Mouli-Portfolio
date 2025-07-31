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
  status: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user } = useAuth();

  // Clear any cached blog data on component mount
  useEffect(() => {
    console.log('BlogPage: Clearing any cached blog data...');
    
    // Clear any localStorage blog data that might interfere
    const blogKeys = ['blog_posts', 'blogs', 'blog_data'];
    blogKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`BlogPage: Clearing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear any sessionStorage blog data
    const sessionBlogKeys = ['blog_posts', 'blogs', 'blog_data'];
    sessionBlogKeys.forEach(key => {
      if (sessionStorage.getItem(key)) {
        console.log(`BlogPage: Clearing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('BlogPage: Cache cleanup completed');
  }, []);

  useEffect(() => {
    console.log('BlogPage: useEffect triggered, calling fetchPosts...');
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTags]);

  // Initialize filteredPosts when posts are loaded
  useEffect(() => {
    if (posts.length > 0) {
      console.log('BlogPage: Initializing filteredPosts with all posts');
      setFilteredPosts(posts);
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      console.log('BlogPage: Fetching posts from Supabase...');
      console.log('BlogPage: User is admin:', !!user);
      console.log('BlogPage: User details:', user ? { id: user.id, email: user.email } : 'No user');
      console.log('BlogPage: Timestamp:', new Date().toISOString());
      
      // Force fresh data by adding cache-busting
      const cacheBuster = Date.now();
      console.log('BlogPage: Cache buster:', cacheBuster);
      
      let blogs;
      if (user) {
        // Admin: Get all blogs (including drafts)
        console.log('BlogPage: Admin user - fetching all blogs including drafts');
        blogs = await supabaseBlogsService.getAllBlogs();
      } else {
        // Visitor: Get only published blogs
        console.log('BlogPage: Visitor - fetching only published blogs');
        blogs = await supabaseBlogsService.getPublishedBlogs();
      }
      
      console.log('BlogPage: Fetched blogs from Supabase:', blogs);
      console.log('BlogPage: Number of blogs fetched:', blogs.length);
      
      // Log the status of each post to verify filtering
      blogs.forEach((blog, index) => {
        console.log(`BlogPage: Post ${index + 1}: "${blog.title}" - Status: ${blog.status} - Slug: ${blog.slug}`);
      });
      
      // Convert SupabaseBlog to BlogPost format
      const blogPosts: BlogPost[] = blogs.map((blog: SupabaseBlog) => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.excerpt || '',
        slug: blog.slug,
        content: blog.content,
        cover_image_url: blog.cover_image_url,
        tags: blog.tags || [],
        created_at: blog.created_at,
        status: blog.status
      }));
      
      console.log('BlogPage: Blog posts after conversion:', blogPosts);
      console.log('BlogPage: Number of posts after conversion:', blogPosts.length);
      
      // Sort by creation date
      const sortedPosts = blogPosts
        .sort((a: BlogPost, b: BlogPost) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      console.log('BlogPage: Sorted posts:', sortedPosts);
      console.log('BlogPage: Setting posts state with', sortedPosts.length, 'posts');
      
      // Set posts directly
      setPosts(sortedPosts);
      
    } catch (error) {
      console.error('BlogPage: Error fetching posts:', error);
    } finally {
      console.log('BlogPage: Setting loading to false.');
      setLoading(false);
    }
  };

  const filterPosts = () => {
    console.log('BlogPage: filterPosts called with:', {
      postsCount: posts.length,
      searchTerm,
      selectedTags,
      posts: posts.map(p => ({ title: p.title, status: p.status, tags: p.tags }))
    });

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

    console.log('BlogPage: Filtered posts result:', {
      filteredCount: filtered.length,
      filtered: filtered.map(p => ({ title: p.title, status: p.status, tags: p.tags }))
    });

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
    console.log('BlogPage: Loading state is true, showing loading screen');
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

  // Force loading to false if we have posts
  if (posts.length > 0 && loading) {
    console.log('BlogPage: Force setting loading to false');
    setLoading(false);
  }

  // Debug logging
  console.log('BlogPage: Render state:', {
    loading,
    postsCount: posts.length,
    filteredPostsCount: filteredPosts.length,
    searchTerm,
    selectedTags: selectedTags.length
  });

  // Additional debugging for blog cards
  console.log('BlogPage: Posts data:', posts.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    excerpt: p.excerpt?.substring(0, 50) + '...'
  })));

  console.log('BlogPage: Filtered posts data:', filteredPosts.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    excerpt: p.excerpt?.substring(0, 50) + '...'
  })));

  console.log('BlogPage: Render conditions:', {
    postsLength: posts.length,
    filteredPostsLength: filteredPosts.length,
    hasSearchOrTags: searchTerm || selectedTags.length > 0,
    shouldShowCards: posts.length > 0 && (filteredPosts.length > 0 || !(searchTerm || selectedTags.length > 0)),
    postsToRender: filteredPosts.length > 0 ? filteredPosts.length : posts.length
  });

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
                className="flex justify-center mb-8 gap-4"
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
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('BlogPage: Manual refresh triggered');
                    fetchPosts();
                  }}
                >
                  🔄 Refresh Posts
                </Button>
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
                  type="text"
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

            {/* Tags */}
            {getAllTags().length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getAllTags().map((tag) => (
                  <motion.div
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>



          {/* Posts Count */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-center text-muted-foreground">
              Showing {filteredPosts.length > 0 ? filteredPosts.length : posts.length} of {posts.length} posts
            </p>
          </div>

          {/* Blog Cards */}
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
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
              </motion.div>
            ) : filteredPosts.length === 0 && (searchTerm || selectedTags.length > 0) ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-4">No posts match your filters</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTags([]);
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {(filteredPosts.length > 0 ? filteredPosts : (posts.length > 0 ? posts : [])).map((post) => {
                  console.log('BlogPage: Rendering post:', {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    status: post.status,
                    hasExcerpt: !!post.excerpt,
                    hasTags: post.tags?.length > 0
                  });
                  
                                    return (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Card className="project-card group h-full flex flex-col hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500/20">
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
                            {user && post.status === 'draft' && (
                              <Badge variant="secondary" className="text-xs">
                                DRAFT
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
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

                        <div className="flex gap-2 mt-auto pt-4 border-t border-border p-2 flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1"
                          >
                            <Link to={`/blog/${post.slug}`}>
                              <Button variant="default" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                Read More
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </motion.div>
                          
                          <div className="flex gap-1">
                            {post.status === 'published' && (
                              <SocialShare 
                                title={post.title}
                                url={`${window.location.origin}/blog/${post.slug}`}
                                excerpt={post.excerpt}
                              />
                            )}
                            
                            {user && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                  onClick={async () => {
                                    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                      try {
                                        await supabaseBlogsService.deleteBlog(post.id);
                                        // Refresh the posts
                                        fetchPosts();
                                      } catch (error) {
                                        console.error('Error deleting blog:', error);
                                      }
                                    }
                                  }}
                                >
                                  🗑️
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 