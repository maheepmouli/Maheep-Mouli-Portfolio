import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.services'), href: '/services' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.contact'), href: '/contact' }
  ];

  const isHomePage = location.pathname === '/';

  const handleNavClick = (href: string) => {
    if (isHomePage && href.startsWith('#')) {
      // For home page sections, scroll to element
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <motion.img 
                src="/logo.png" 
                alt="MMS Logo" 
                className="h-12 w-12"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-2xl font-bold text-foreground">MMS</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`nav-link relative text-foreground hover:text-primary transition-colors font-medium ${
                    location.pathname === item.href ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <LanguageSwitcher />
            </motion.div>
            
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="group">
                      <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Admin
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="group">
                    <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Sign Out
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="group">
                      <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Login
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/contact">
                    <Button className="btn-accent group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        Let's Collaborate
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-border"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col space-y-4 pt-4 pb-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={menuItemVariants}
                  >
                    <Link
                      to={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`block text-left text-foreground hover:text-primary transition-colors font-medium py-3 px-4 rounded-lg hover:bg-muted/50 ${
                        location.pathname === item.href ? 'text-primary bg-primary/10' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Language Switcher for Mobile */}
                <motion.div 
                  className="flex flex-col space-y-2 mt-4 pt-4 border-t border-border"
                  variants={menuItemVariants}
                >
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                </motion.div>
                
                {user ? (
                  <motion.div 
                    className="flex flex-col space-y-2 mt-4 pt-4 border-t border-border"
                    variants={menuItemVariants}
                  >
                    <Link to="/admin">
                      <Button variant="ghost" className="w-full justify-start group">
                        <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Admin Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full group" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      Sign Out
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col space-y-2 mt-4 pt-4 border-t border-border"
                    variants={menuItemVariants}
                  >
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start group">
                        <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button className="btn-accent w-full group">
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          Let's Collaborate
                        </span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation; 