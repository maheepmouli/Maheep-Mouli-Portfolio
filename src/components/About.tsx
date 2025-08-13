import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, GraduationCap, Download, Code, Brain, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  
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
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 underline-effect">
              About <span className="kinetic-text">Maheep</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto color-wave-text px-4">
              {t('about.description')}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
            {/* Left Column - Philosophy & Location */}
            <div className="space-y-6 sm:space-y-8">
              {/* Design Philosophy */}
              <Card className="p-4 sm:p-6 md:p-8 hover-lift">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Brain className="text-primary mt-1 flex-shrink-0" size={24} />
                  <h3 className="text-xl sm:text-2xl font-bold">{t('about.designPhilosophy')}</h3>
                </div>
                <blockquote className="text-base sm:text-lg text-foreground/90 italic leading-relaxed border-l-4 border-primary pl-4 sm:pl-6">
                  {t('about.philosophyQuote')}
                </blockquote>
                <p className="text-muted-foreground mt-4 leading-relaxed text-sm sm:text-base">
                  {t('about.philosophyDescription')}
                </p>
              </Card>

              {/* Location & Contact */}
              <Card className="p-4 sm:p-6 md:p-8 hover-lift">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                  <h3 className="text-xl sm:text-2xl font-bold">{t('about.location')}</h3>
                </div>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  {t('about.locationDescription')}
                </p>
                <p className="text-sm text-highlight font-medium">
                  {t('about.openToRelocation')}
                </p>
              </Card>
            </div>

            {/* Right Column - Education */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <GraduationCap className="text-primary flex-shrink-0" size={28} />
                  <h3 className="text-xl sm:text-2xl font-bold">{t('about.education')}</h3>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {education.map((edu, index) => (
                    <Card key={index} className="p-4 sm:p-6 hover-lift">
                      <h4 className="text-base sm:text-lg font-semibold text-primary mb-2">{edu.degree}</h4>
                      <p className="text-foreground font-medium mb-1 text-sm sm:text-base">{edu.institution}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-2">{edu.period}</p>
                      <p className="text-xs sm:text-sm text-highlight">{edu.focus}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CV Download */}
              <Card className="p-4 sm:p-6 text-center hover-lift bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <h4 className="text-base sm:text-lg font-semibold mb-3">{t('about.completePortfolio')}</h4>
                <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                  {t('about.portfolioDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                      <Button 
                      size="sm"
                      className="btn-hero text-sm"
                      onClick={() => window.open("/Maheep_mouli_resume.pdf", "_blank")}
                    >
                      <Download size={16} className="mr-2" />
                      {t('about.downloadCV')}
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline" 
                      className="text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => window.open("https://www.calameo.com/read/007995635f849de9a792d", "_blank")}
                    >
                      <Download size={16} className="mr-2" />
                      {t('about.viewPortfolio')}
                    </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
              <Code className="text-primary" size={24} />
              <h3 className="text-xl sm:text-2xl font-bold">{t('about.toolsTechnologies')}</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* Experience Timeline */}
            <Card className="p-6 sm:p-8 text-center hover-lift bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Building className="text-accent" size={24} />
                <h3 className="text-xl sm:text-2xl font-bold">{t('about.professionalExperience')}</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                {t('about.experienceDescription')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">10+</div>
                  <div className="text-muted-foreground">{t('about.projectsCompleted')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-accent">3+</div>
                  <div className="text-muted-foreground">{t('about.yearsExperience')}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 