import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, LinkedinIcon, Send, Globe, Calendar, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Using Formspree - a free service that sends emails directly
      const formEndpoint = 'https://formspree.io/f/xwpqojby';
      
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Contact',
          message: formData.message,
          _replyto: formData.email
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Fallback: Open email client with pre-filled message
      const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject || 'New Message'}`);
      const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from your portfolio website contact form.`);
      
      window.open(`mailto:maheep.mouli.shashi@gmail.com?subject=${subject}&body=${body}`, '_blank');
      
      toast({
        title: "Email Client Opened",
        description: "Your email client should open with a pre-filled message. Please send it manually.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const testEmailConnection = async () => {
    try {
      const formEndpoint = 'https://formspree.io/f/xwpqojby';
      const response = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Email',
          message: 'This is a test email to verify the contact form is working.',
          _replyto: 'test@example.com'
        }),
      });

      if (response.ok) {
        toast({
          title: "Email Test Successful",
          description: "The contact form is working correctly.",
        });
      } else {
        toast({
          title: "Email Test Failed",
          description: `Status: ${response.status}. Please check your Formspree configuration.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Email Test Error",
        description: "There was an error testing the email connection.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: t('contact.email'),
      value: t('contact.emailAddress'),
      link: "mailto:maheep.mouli.shashi@gmail.com"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+34 692 673 542",
      link: "tel:+34692673542"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: t('contact.location'),
      link: null
    },
    {
      icon: <LinkedinIcon className="w-5 h-5" />,
      label: t('contact.linkedin'),
      value: "maheep-mouli-shashi",
      link: "https://linkedin.com/in/maheep-mouli-shashi-280832180"
    }
  ];

  return (
    <section id="contact" className="section-spacing">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('contact.title')} <span className="kinetic-text">Collaborate</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto color-wave-text">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8 hover-lift">
                <h3 className="text-2xl font-bold mb-6">{t('contact.getInTouch')}</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-primary">{info.icon}</div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-foreground hover:text-primary transition-colors font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Availability */}
              <Card className="p-8 hover-lift bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <Globe className="text-primary mt-1" size={24} />
                  <div>
                    <h4 className="text-lg font-bold mb-2">{t('contact.availability')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{t('contact.openToProjects')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span>{t('contact.remoteWork')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-primary" />
                        <span>{t('contact.responseTime')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-highlight font-medium text-sm">
                  {t('contact.relocationText')}
                </p>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start border-primary/30 hover:bg-primary/10"
                    onClick={() => window.open("https://linkedin.com/in/maheep-mouli-shashi-280832180", "_blank")}
                  >
                    <LinkedinIcon size={18} className="mr-2" />
                    Connect on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-highlight/30 hover:bg-highlight/10"
                    onClick={() => window.open("https://www.calameo.com/read/007995635f849de9a792d", "_blank")}
                  >
                    <Mail size={18} className="mr-2" />
                    Download Portfolio
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8 hover-lift">
                              <h3 className="text-2xl font-bold mb-6">{t('contact.sendMessage')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@domain.com"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project collaboration, consultation, etc."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, and how I can help..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="btn-hero w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send size={18} className="mr-2" />
                  {isSubmitting ? 'Sending...' : t('contact.sendMessage')}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Your message will be sent directly to Maheep. Your information is secure and will never be shared with third parties.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 