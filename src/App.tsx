import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

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

// Blog pages
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/[slug]";
import BlogCreate from "./pages/blog/create";
import BlogEdit from "./pages/blog/edit/[slug]";

// Portfolio pages
import PortfolioCreate from "./pages/portfolio/create";
import PortfolioEdit from "./pages/portfolio/edit/[id]";

// Enhanced page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
  duration: 0.6
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
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
          
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Project Routes */}
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/portfolio/create" element={<PortfolioCreate />} />
          <Route path="/portfolio/edit/:id" element={<PortfolioEdit />} />
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/create" element={<BlogCreate />} />
          <Route path="/blog/edit/:slug" element={<BlogEdit />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    // Enhanced cursor wave element
    const cursor = document.createElement('div');
    cursor.className = 'cursor-wave';
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
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
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
    };

    // Add hover effect for interactive elements
    const addHoverEffects = () => {
      const interactiveElements = document.querySelectorAll('a, button, .color-wave-text, .project-card, .btn-hero');
      
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(2)';
          cursor.style.background = 'rgba(0, 200, 255, 0.3)';
          cursor.style.border = '2px solid rgba(0, 200, 255, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          cursor.style.background = 'rgba(255, 255, 255, 0.1)';
          cursor.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        });
      });
    };

    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLElement;
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
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('click', handleSmoothScroll);
    
    // Start cursor animation
    animateCursor();
    
    // Add hover effects after a short delay to ensure DOM is ready
    setTimeout(addHoverEffects, 1000);

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
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App; 