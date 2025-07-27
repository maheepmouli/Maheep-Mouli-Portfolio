import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ChevronDown, LinkedinIcon, FileText } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('/maheep.jpg');

  useEffect(() => {
    setIsVisible(true);
    
    // Load profile image from localStorage if available
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-highlight/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Profile Image */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Gradient Circle Frame */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-xl opacity-50 animate-pulse"></div>
              
              {/* Animated Gradient Border - Only Border */}
              <div className="relative p-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow">
                <img 
                  src={profileImage} 
                  alt="Maheep Mouli Shashi" 
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-background shadow-2xl"
                  onError={() => setProfileImage('/maheep.jpg')} // Fallback to default image
                />
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="kinetic-text">Maheep</span>{" "}
            <span className="text-foreground">Mouli Shashi</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 color-wave-text">
            Computational Designer & Urban Technologist
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto color-wave-text">
            Exploring the intersection of computational design, urban technology, and AI-driven solutions to create sustainable, innovative environments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center items-center">
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
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground color-wave-text"
              onClick={() => window.open("https://linkedin.com/in/maheep-mouli-shashi-280832180", "_blank")}
            >
              <LinkedinIcon size={20} className="mr-2" />
              LinkedIn
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground color-wave-text"
              onClick={() => window.open("/Maheep_mouli_resume.pdf", "_blank")}
            >
              <FileText size={20} className="mr-2" />
              Resume
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - HIDDEN */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div> */}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 hidden lg:block">
        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
      </div>
      <div className="absolute bottom-1/4 left-10 hidden lg:block">
        <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
      </div>
    </section>
  );
};

export default Hero; 