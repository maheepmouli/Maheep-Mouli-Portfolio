import React from 'react';
import HeroSection from '@/components/HeroSection';

const HeroDemo = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection />
      
      {/* Additional content to demonstrate scroll behavior */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Scroll Down to See More
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            This demonstrates the parallax scroll effect and smooth transitions from the hero section.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroDemo; 