import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ChevronDown } from 'lucide-react';

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const kineticTexts = [
    "Architect × Urban Technologist × AI Thinker",
    "Architecture. Systems. Cities. Data. Materiality.",
    "Designing intelligent feedback systems",
    "Code. Geometry. Context."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % kineticTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPortfolio = () => {
    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Profile Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img 
              src="/maheep.jpg" 
              alt="Maheep Mouli Shashi" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/30 hero-glow"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
        </div>
        
        {/* Kinetic Headline */}
        <div className="mb-6 h-20 md:h-24 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold kinetic-text leading-tight">
            {kineticTexts[currentText]}
          </h1>
        </div>
        
        {/* Bio Summary */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            <span className="text-highlight font-semibold">Architect & Urbanist</span> | <span className="text-highlight font-semibold">Computational Designer</span> | <span className="text-highlight font-semibold">Specializing in AI-Driven Design, Urban Analytics & BIM Integration</span>
          </p>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            Maheep designs responsive, data-rich systems that rethink how cities operate. With 2.5+ years of global experience and a Master's in Advanced Architecture (IAAC), he blends parametric logic, AI models, and urban strategy to shape sustainable futures.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button onClick={scrollToPortfolio} size="lg" className="btn-hero text-lg px-8 py-3">
            Explore My Work
          </Button>
          <Button onClick={scrollToAbout} variant="outline" size="lg" className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Learn More
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToAbout} className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 