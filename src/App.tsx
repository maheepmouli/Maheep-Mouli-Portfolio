import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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

// Blog pages
import BlogIndex from "./pages/blog/index";
import BlogPost from "./pages/blog/[slug]";
import BlogCreate from "./pages/blog/create";
import BlogEdit from "./pages/blog/edit/[slug]";

// Portfolio pages
import PortfolioCreate from "./pages/portfolio/create";
import PortfolioEdit from "./pages/portfolio/edit/[id]";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create cursor wave element
    const cursor = document.createElement('div');
    cursor.className = 'cursor-wave';
    document.body.appendChild(cursor);

    // Update cursor position
    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    // Add hover effect for color wave text
    const colorWaveElements = document.querySelectorAll('.color-wave-text');
    colorWaveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
      });
      element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });

    document.addEventListener('mousemove', updateCursor);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              
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
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 