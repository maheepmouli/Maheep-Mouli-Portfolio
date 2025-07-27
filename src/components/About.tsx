import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, GraduationCap, Download, Code, Brain, Building } from 'lucide-react';

const About = () => {
  const tools = [
    'Rhino', 'Revit', 'Python', 'Grasshopper', 'AutoCAD', 'SketchUp',
    'Blender', 'Unity', 'TensorFlow', 'React', 'Node.js', 'SQL',
    'QGIS', 'ArcGIS', 'CNC', 'Robotics', 'BIM', 'AI/ML'
  ];

  const education = [
    {
      degree: "Master of Advanced Architecture",
      institution: "IAAC Barcelona",
      period: "2023–2025",
      focus: "Computational Design & Urban Technology"
    },
    {
      degree: "Bachelor of Architecture",
      institution: "Mysore School of Architecture",
      period: "2018–2023", 
      focus: "Architectural Design & Planning"
    }
  ];

  return (
    <section id="about" className="section-spacing bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="kinetic-text">Maheep</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto color-wave-text">
              I am a passionate computational designer and urban technologist with expertise in leveraging cutting-edge technologies to solve complex urban challenges. My work spans across computational design, AI/ML applications, BIM implementation, and sustainable urban development.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Philosophy & Location */}
            <div className="space-y-8">
              {/* Design Philosophy */}
              <Card className="p-8 hover-lift">
                <div className="flex items-start gap-4 mb-4">
                  <Brain className="text-primary mt-1" size={24} />
                  <h3 className="text-2xl font-bold">Design Philosophy</h3>
                </div>
                <blockquote className="text-lg text-foreground/90 italic leading-relaxed border-l-4 border-primary pl-6">
                  "Designing intelligent feedback systems at the intersection of code, geometry & context."
                </blockquote>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  My approach centers on creating responsive, data-driven environments that adapt to user needs 
                  while maintaining architectural integrity. I believe in leveraging technology not as an end, 
                  but as a means to create more sustainable and human-centered spaces.
                </p>
              </Card>

              {/* Location & Contact */}
              <Card className="p-8 hover-lift">
                <div className="flex items-start gap-4 mb-4">
                  <MapPin className="text-primary mt-1" size={24} />
                  <h3 className="text-2xl font-bold">Based in Barcelona</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Recently completed Master of Advanced Architecture at IAAC (June 2025) and continues to work 
                  on cutting-edge urban technology projects across Europe.
                </p>
                <p className="text-sm text-highlight font-medium">
                  Open to relocation and remote collaboration worldwide
                </p>
              </Card>
            </div>

            {/* Right Column - Education */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-primary" size={28} />
                  <h3 className="text-2xl font-bold">Education</h3>
                </div>
                
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <Card key={index} className="p-6 hover-lift">
                      <h4 className="text-lg font-semibold text-primary mb-2">{edu.degree}</h4>
                      <p className="text-foreground font-medium mb-1">{edu.institution}</p>
                      <p className="text-muted-foreground text-sm mb-2">{edu.period}</p>
                      <p className="text-sm text-highlight">{edu.focus}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CV Download */}
              <Card className="p-6 text-center hover-lift bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <h4 className="text-lg font-semibold mb-3">Complete Portfolio & CV</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Download detailed portfolio with project documentation, technical skills, and professional experience
                </p>
                        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="btn-hero" onClick={() => window.open('/Maheep_mouli_resume.pdf', '_blank')}>
            <Download size={18} className="mr-2" />
            Download CV
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => window.open('https://www.calameo.com/read/007995635f849de9a792d', '_blank')}>
            <Download size={18} className="mr-2" />
            View Portfolio
          </Button>
        </div>
              </Card>
            </div>
          </div>

          {/* Skills & Tools Section */}
          <Card className="p-8 hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <Code className="text-primary" size={28} />
              <h3 className="text-2xl font-bold">Tools & Technologies</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {tools.map((tool, index) => (
                <div key={index} className="tech-badge text-center">
                  {tool}
                </div>
              ))}
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Building className="text-primary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">Architecture & BIM</h4>
                <p className="text-sm text-muted-foreground">Revit, AutoCAD, SketchUp, ArchiCAD</p>
              </div>
              <div className="text-center">
                <Code className="text-primary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">Computational Design</h4>
                <p className="text-sm text-muted-foreground">Rhino, Grasshopper, Python, C#</p>
              </div>
              <div className="text-center">
                <Brain className="text-primary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">AI & Data Science</h4>
                <p className="text-sm text-muted-foreground">TensorFlow, ML, Computer Vision</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About; 