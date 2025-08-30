import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import GoogleTagManager from "@/components/GoogleTagManager";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import HeroDemo from "./pages/HeroDemo";
import SupabaseConfig from "./components/SupabaseConfig";
import ProtectedRoute from "./components/ProtectedRoute";

// Blog pages
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/[slug]";
import BlogCreate from "./pages/blog/create";
import BlogEdit from "./pages/blog/edit/[slug]";

// Portfolio pages
import PortfolioCreate from "./pages/portfolio/create";
import PortfolioEdit from "./pages/portfolio/edit/[id]";

// Enhanced page transition variants - ultra fast for snappy navigation
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -10
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.15
};

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if transitions should be disabled for performance
const shouldDisableTransitions = () => {
  return isMobile() || prefersReducedMotion() || window.location.search.includes('no-transitions');
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();
  const shouldAnimate = !shouldDisableTransitions();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // If animations should be disabled, render without AnimatePresence
  if (!shouldAnimate) {
    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        minHeight: '100vh'
      }}>
        <Routes location={location}>
          {/* Main Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hero-demo" element={<HeroDemo />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin - Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/supabase-config" element={
            <ProtectedRoute>
              <SupabaseConfig />
            </ProtectedRoute>
          } />
          
          {/* Project Routes */}
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="/portfolio/create" element={
            <ProtectedRoute>
              <PortfolioCreate />
            </ProtectedRoute>
          } />
          <Route path="/portfolio/edit/:id" element={
            <ProtectedRoute>
              <PortfolioEdit />
            </ProtectedRoute>
          } />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/create" element={
            <ProtectedRoute>
              <BlogCreate />
            </ProtectedRoute>
          } />
          <Route path="/blog/edit/:slug" element={
            <ProtectedRoute>
              <BlogEdit />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }

  return (
    <AnimatePresence 
      mode="wait" 
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ 
          position: 'relative',
          width: '100%',
          minHeight: '100vh'
        }}
      >
        <Routes location={location}>
          {/* Main Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hero-demo" element={<HeroDemo />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin - Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/supabase-config" element={
            <ProtectedRoute>
              <SupabaseConfig />
            </ProtectedRoute>
          } />
          
          {/* Project Routes */}
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="/portfolio/create" element={
            <ProtectedRoute>
              <PortfolioCreate />
            </ProtectedRoute>
          } />
          <Route path="/portfolio/edit/:id" element={
            <ProtectedRoute>
              <PortfolioEdit />
            </ProtectedRoute>
          } />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/create" element={
            <ProtectedRoute>
              <BlogCreate />
            </ProtectedRoute>
          } />
          <Route path="/blog/edit/:slug" element={
            <ProtectedRoute>
              <BlogEdit />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    // Only initialize cursor effects on desktop
    if (isMobile()) {
      console.log('Mobile device detected, skipping cursor effects');
      return;
    }

    try {
      // Enhanced cursor wave element
      const cursor = document.createElement('div');
      cursor.className = 'cursor-wave';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '9999';
      document.body.appendChild(cursor);

      // Create cursor trail elements
      const trailElements = Array.from({ length: 5 }, (_, i) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.setProperty('--trail-index', i.toString());
        document.body.appendChild(trail);
        return trail;
      });

      // Update cursor position with smooth following
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;

          const updateCursor = (e: MouseEvent) => {
        // Update mouse position
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check if cursor is over navigation
        const target = e.target as HTMLElement;
        const isOverNavigation = target.closest('nav') || target.closest('.navigation');
        
        if (isOverNavigation) {
          // Hide cursor when over navigation
          if (cursor) cursor.style.opacity = '0';
          trailElements.forEach(trail => {
            if (trail) trail.style.opacity = '0';
          });
        } else {
          // Show cursor when not over navigation
          if (cursor) cursor.style.opacity = '1';
          trailElements.forEach((trail, index) => {
            if (trail) trail.style.opacity = (1 - index * 0.2).toString();
          });
        }
      };

      const animateCursor = () => {
        try {
          // Smooth cursor following
          cursorX += (mouseX - cursorX) * 0.1;
          cursorY += (mouseY - cursorY) * 0.1;
          
          cursor.style.left = cursorX + 'px';
          cursor.style.top = cursorY + 'px';

          // Update trail elements with staggered following
          trailElements.forEach((trail, index) => {
            const trailX = cursorX + (mouseX - cursorX) * (0.1 - index * 0.02);
            const trailY = cursorY + (mouseY - cursorY) * (0.1 - index * 0.02);
            
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
            trail.style.opacity = (1 - index * 0.2).toString();
          });

          requestAnimationFrame(animateCursor);
        } catch (error) {
          console.warn('Cursor animation error:', error);
        }
      };

      // Add hover effect for interactive elements
      const addHoverEffects = () => {
        try {
          // More specific selectors to avoid navigation conflicts
          const interactiveElements = document.querySelectorAll('a:not(nav a), button:not(nav button), .color-wave-text, .project-card, .btn-hero');
          
          interactiveElements.forEach(element => {
            // Skip navigation elements to prevent glitches
            if (element.closest('nav') || element.closest('.navigation')) {
              return;
            }
            
            element.addEventListener('mouseenter', () => {
              if (cursor && cursor.style) {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'rgba(0, 200, 255, 0.3)';
                cursor.style.border = '2px solid rgba(0, 200, 255, 0.8)';
              }
            });
            
            element.addEventListener('mouseleave', () => {
              if (cursor && cursor.style) {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(255, 255, 255, 0.1)';
                cursor.style.border = '1px solid rgba(255, 255, 255, 0.3)';
              }
            });
          });
        } catch (error) {
          console.warn('Hover effects error:', error);
        }
      };

      // Smooth scrolling for anchor links ONLY (not navigation links)
      const handleSmoothScroll = (e: Event) => {
        try {
          const target = e.target as HTMLElement;
          // Only handle anchor links that start with # (same-page anchors)
          if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const targetId = target.getAttribute('href')?.substring(1);
            const targetElement = document.getElementById(targetId || '');
            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
          // Don't interfere with navigation links (href starting with / or http)
        } catch (error) {
          console.warn('Smooth scroll error:', error);
        }
      };

      document.addEventListener('mousemove', updateCursor);
      document.addEventListener('click', handleSmoothScroll);
      
      // Start cursor animation
      animateCursor();
      
      // Add hover effects after a short delay to ensure DOM is ready
      setTimeout(addHoverEffects, 1000);

      // Add manual disable function for debugging
      (window as any).disableCursorEffects = () => {
        if (cursor) cursor.style.display = 'none';
        trailElements.forEach(trail => {
          if (trail) trail.style.display = 'none';
        });
        console.log('Cursor effects manually disabled');
      };

      // Add instant navigation toggle
      (window as any).toggleInstantNavigation = () => {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('no-transitions')) {
          currentUrl.searchParams.delete('no-transitions');
          console.log('Transitions enabled');
        } else {
          currentUrl.searchParams.set('no-transitions', 'true');
          console.log('Instant navigation enabled');
        }
        window.location.href = currentUrl.toString();
      };

      // Cursor effects are now stable with fixed navigation
      console.log('Custom cursor effects initialized successfully');

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', updateCursor);
        document.removeEventListener('click', handleSmoothScroll);
        if (cursor.parentNode) {
          cursor.parentNode.removeChild(cursor);
        }
        trailElements.forEach(trail => {
          if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
          }
        });
      };
    } catch (error) {
      console.warn('Cursor effects initialization failed:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <BrowserRouter>
              <GoogleTagManager gtmId="GTM-W2X6C563" />
              <div className="App">
                <Navigation />
                <AnimatedRoutes />
                <Footer />
                <Toaster />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 