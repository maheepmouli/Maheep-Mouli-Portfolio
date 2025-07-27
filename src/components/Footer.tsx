import { Mail, Phone, MapPin, LinkedinIcon, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/maheep-mouli-shashi-280832180',
      icon: <LinkedinIcon size={20} />
    },
    {
      label: 'GitHub',
      href: 'https://github.com/maheepmouli',
      icon: <Github size={20} />
    },
    {
      label: 'Portfolio',
      href: 'https://www.calameo.com/read/007995635f849de9a792d',
      icon: <ExternalLink size={20} />
    }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Maheep Mouli Shashi</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed max-w-md">
              Architect × Urban Technologist × AI Thinker. Designing intelligent feedback systems 
              at the intersection of code, geometry & context.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                Barcelona, Spain
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} className="text-primary" />
                maheep.mouli.shashi@gmail.com
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} className="text-primary" />
                +34 692 673 542
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-highlight font-medium">
                Open to relocation and remote work worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Maheep Mouli Shashi. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>IAAC Barcelona</span>
              <span>•</span>
              <span>Computational Design</span>
              <span>•</span>
              <span>AI Integration</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 