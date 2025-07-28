import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, ChevronDown, LinkedinIcon, FileText } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('/maheep.jpg');
  const [currentDescriptor, setCurrentDescriptor] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  
  const descriptors = [
    "Architecture.",
    "Systems.",
    "Data.",
    "Cities.",
    "Materiality.",
    "Innovation."
  ];

  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
    
    // Load profile image from localStorage if available
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }

    // Mouse tracking for dynamic background
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    // GSAP animations for background elements
    gsap.fromTo('.floating-element', 
      { y: 0, opacity: 0.3 },
      { 
        y: -20, 
        opacity: 1, 
        duration: 3, 
        ease: "power2.inOut", 
        stagger: 0.5,
        repeat: -1,
        yoyo: true
      }
    );

    // Animated gradient background
    gsap.to('.gradient-bg', {
      backgroundPosition: '200% 200%',
      duration: 8,
      ease: "none",
      repeat: -1
    });

    // Descriptor text rotation
    const interval = setInterval(() => {
      setCurrentDescriptor((prev) => (prev + 1) % descriptors.length);
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [descriptors.length]);

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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.section 
      ref={heroRef}
      id="hero" 
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 gradient-bg bg-gradient-to-br from-background via-background to-muted/20">
        {/* Mouse-following radial gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
          }}
        />
      </div>
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating blobs */}
        <motion.div 
          className="floating-element absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: -1, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="floating-element absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -20, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: -1, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="floating-element absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-2xl"
          animate={{ 
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: -1, 
            ease: "easeInOut" 
          }}
        />

        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: -1, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            rotate: [360, 0]
          }}
          transition={{ 
            duration: 18, 
            repeat: -1, 
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Particle System */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: -1,
            delay: i * 0.2,
            ease: "easeInOut" as const
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div 
          className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Image */}
          <motion.div 
            className="mb-8"
            variants={imageVariants}
          >
            <div className="relative inline-block">
              {/* Enhanced Gradient Circle Frame */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: -1, ease: "linear" }}
              />
              
              {/* Animated Gradient Border */}
              <motion.div 
                className="relative p-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: -1, ease: "linear" }}
              >
                <img 
                  src={profileImage} 
                  alt="Maheep Mouli Shashi" 
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-background shadow-2xl"
                  onError={() => setProfileImage('/maheep.jpg')}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Name and Title with staggered animation */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            variants={textVariants}
            custom={0}
          >
            <motion.span 
              className="kinetic-text"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Maheep
            </motion.span>{" "}
            <motion.span 
              className="text-foreground"
              variants={textVariants}
              custom={1}
            >
              Mouli Shashi
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 color-wave-text"
            variants={textVariants}
            custom={2}
          >
            Computational Designer & Urban Technologist
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto color-wave-text"
            variants={textVariants}
            custom={3}
          >
            Exploring the intersection of computational design, urban technology, and AI-driven solutions to create sustainable, innovative environments.
          </motion.p>

          {/* Dynamic Descriptor Text */}
          <motion.div 
            className="text-lg md:text-xl text-primary mb-8 font-medium"
            key={currentDescriptor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {descriptors[currentDescriptor]}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center items-center"
            variants={textVariants}
            custom={4}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="btn-hero text-lg px-8 py-3 color-wave-text"
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground color-wave-text"
                onClick={() => window.open("https://linkedin.com/in/maheep-mouli-shashi-280832180", "_blank")}
              >
                <LinkedinIcon size={20} className="mr-2" />
                LinkedIn
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground color-wave-text"
                onClick={() => window.open("/Maheep_mouli_resume.pdf", "_blank")}
              >
                <FileText size={20} className="mr-2" />
                Resume
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Floating Elements */}
        <motion.div 
          className="absolute top-1/4 right-10 hidden lg:block"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: -1, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </motion.div>
        <motion.div 
          className="absolute bottom-1/4 left-10 hidden lg:block"
          animate={{ 
            scale: [1.5, 1, 1.5],
            opacity: [1, 0.5, 1]
          }}
          transition={{ duration: 4, repeat: -1, ease: "easeInOut" }}
        >
          <div className="w-3 h-3 bg-accent rounded-full"></div>
        </motion.div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>
    </motion.section>
  );
};

export default Hero; 