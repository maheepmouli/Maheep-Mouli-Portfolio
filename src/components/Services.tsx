import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Building, 
  BarChart3, 
  Cpu, 
  Cog,
  ArrowRight,
  Zap,
  Database,
  Monitor
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Services = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      id: 1,
      title: "Computational Design & Parametric Systems",
      icon: <Cpu className="w-8 h-8" />,
      description: "Advanced algorithmic design solutions that respond to environmental and programmatic constraints through intelligent automation.",
      features: [
        "Parametric modeling and optimization",
        "Environmental performance analysis",
        "Generative design algorithms"
      ],
      tools: ["Rhino", "Grasshopper", "Python", "C#"],
      highlight: "Reduce design iteration time by 60%",
      color: "primary"
    },
    {
      id: 2,
      title: "BIM Coordination & Technical Documentation",
      icon: <Building className="w-8 h-8" />,
      description: "Comprehensive Building Information Modeling services from concept to construction with advanced clash detection and 4D scheduling.",
      features: [
        "Multi-disciplinary BIM coordination",
        "Construction documentation",
        "Clash detection and resolution"
      ],
      tools: ["Revit", "AutoCAD", "Navisworks", "BIM 360"],
      highlight: "14,000+ m² projects delivered",
      color: "accent"
    },
    {
      id: 3,
      title: "Urban Data Dashboards & Visualization",
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Real-time urban analytics platforms that transform complex city data into actionable insights for planners and policymakers.",
      features: [
        "Interactive data visualization",
        "Real-time monitoring systems",
        "Predictive urban analytics"
      ],
      tools: ["React", "D3.js", "QGIS", "Python"],
      highlight: "Real-time city insights",
      color: "highlight"
    },
    {
      id: 4,
      title: "AI-Powered Design Tools",
      icon: <Brain className="w-8 h-8" />,
      description: "Machine learning integration for design optimization, material classification, and automated design assistance using cutting-edge AI.",
      features: [
        "Computer vision for material analysis",
        "Graph ML for spatial optimization",
        "Automated design assistance"
      ],
      tools: ["TensorFlow", "Computer Vision", "Graph ML", "Python"],
      highlight: "35% material waste reduction",
      color: "primary"
    },
    {
      id: 5,
      title: "CNC + Robotic Fabrication",
      icon: <Cog className="w-8 h-8" />,
      description: "Digital fabrication workflows from design to production, including robotic assembly and precision CNC manufacturing.",
      features: [
        "CNC toolpath optimization",
        "Robotic assembly programming",
        "Material efficiency analysis"
      ],
      tools: ["CNC Programming", "Robotics", "CAM", "3D Printing"],
      highlight: "Precision digital fabrication",
      color: "accent"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'border-primary/30 hover:border-primary bg-primary/5';
      case 'accent':
        return 'border-accent/30 hover:border-accent bg-accent/5';
      case 'highlight':
        return 'border-highlight/30 hover:border-highlight bg-highlight/5';
      default:
        return 'border-primary/30 hover:border-primary bg-primary/5';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'accent':
        return 'text-accent';
      case 'highlight':
        return 'text-highlight';
      default:
        return 'text-primary';
    }
  };

  return (
    <section id="services" className="section-spacing bg-secondary/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 underline-effect">
            <span className="kinetic-text">{t('services.title')}</span> & Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className={`p-8 hover-lift transition-all duration-300 ${getColorClasses(service.color)}`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`${getIconColor(service.color)} mt-1`}>
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Key Features</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <ArrowRight size={14} className={getIconColor(service.color)} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tools.map((tool, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Highlight & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Zap size={16} className={getIconColor(service.color)} />
                  <span className="text-sm font-medium">{service.highlight}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`${getIconColor(service.color)} hover:bg-current/10`}
                >
                  Learn More
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Collaboration CTA */}
        <div className="text-center">
          <Card className="p-12 max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-accent/5 to-highlight/10 border-primary/30">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-left">
                <h3 className="text-3xl font-bold mb-4">Ready to Collaborate?</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Let's explore how computational design, AI integration, and urban technology 
                  can transform your next project. I specialize in creating innovative solutions 
                  that bridge technical complexity with human-centered design.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} />
                    Remote & On-site
                  </div>
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    Technical Consulting
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} />
                    Rapid Prototyping
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="btn-hero"
                  onClick={() => {
                    const subject = encodeURIComponent('Hire Request - Portfolio Services');
                    const body = encodeURIComponent(`Hi Maheep,

I saw your portfolio services and would like to discuss a collaboration opportunity with you.

Services I'm interested in:
- [List the services you're interested in]

My project details:
- [Describe your project needs]
- [Timeline]
- [Budget range]

Please let me know when you're available for a call.

Best regards,
[Your name]`);
                    
                    window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
                  }}
                >
                  Hire Me
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services; 