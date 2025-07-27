'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated blob shapes
  const blobVariants = {
    animate: {
      x: [0, 30, 0],
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  // Particle animation
  const particleVariants = {
    animate: (i: number) => ({
      y: [0, -100, 0],
      x: [0, Math.sin(i) * 50, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3 + i * 0.5,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut" as const
      }
    })
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut" as const
      }
    })
  };

  // Floating elements
  const floatingElements = [
    { id: 1, size: 60, color: 'from-blue-500/20 to-cyan-500/20', delay: 0 },
    { id: 2, size: 80, color: 'from-purple-500/20 to-pink-500/20', delay: 2 },
    { id: 3, size: 40, color: 'from-orange-500/20 to-red-500/20', delay: 4 },
    { id: 4, size: 100, color: 'from-green-500/20 to-emerald-500/20', delay: 6 },
  ];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{ y, opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background Elements */}
      
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Animated Blob Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        variants={blobVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        variants={blobVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
        variants={blobVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
      />

      {/* Floating Geometric Shapes */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={element.id}
          className={`absolute w-${element.size} h-${element.size} bg-gradient-to-r ${element.color} rounded-full blur-xl`}
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + (index % 2) * 40}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
          }}
        />
      ))}

      {/* Particle System */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={particleVariants}
          animate="animate"
          custom={i}
        />
      ))}

      {/* Wavy Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,50 Q25,25 50,50 T100,50"
          stroke="url(#gradient1)"
          strokeWidth="0.5"
          fill="none"
          animate={{
            d: [
              "M0,50 Q25,25 50,50 T100,50",
              "M0,50 Q25,75 50,50 T100,50",
              "M0,50 Q25,25 50,50 T100,50",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          ref={textRef}
          className="space-y-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Glowing Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm"
            variants={textVariants}
            custom={0}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Available for Projects</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            variants={textVariants}
            custom={1}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Maheep Mouli Shashi
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed"
            variants={textVariants}
            custom={2}
          >
            <span className="text-slate-400">Architect</span>
            <span className="mx-4 text-blue-400">×</span>
            <span className="text-slate-400">Urban Technologist</span>
            <span className="mx-4 text-blue-400">×</span>
            <span className="text-slate-400">AI Thinker</span>
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            variants={textVariants}
            custom={3}
          >
            Exploring the intersection of computational design, urban technology, and AI-driven solutions to create sustainable, innovative environments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            variants={textVariants}
            custom={4}
          >
            {/* Primary CTA */}
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full overflow-hidden shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative flex items-center gap-2">
                View Portfolio
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              className="group px-8 py-4 border-2 border-slate-600 text-slate-300 font-semibold rounded-full hover:border-blue-500 hover:text-blue-400 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                Let's Connect
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 pt-12 text-slate-400"
            variants={textVariants}
            custom={5}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm">Client Satisfaction</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden */}
      {/* <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </motion.div> */}

      {/* Mouse Position Tracker for Background Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>
    </motion.section>
  );
};

export default HeroSection; 