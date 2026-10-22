import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../../data/businessData';
import { useLeadModal } from '../../context/LeadModalContext';

export const Footer: React.FC = () => {
  const { openModal } = useLeadModal();

  return (
    <footer className="bg-charcoal-900 text-charcoal-300 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          
          {/* Brand Intro & Kolkata Scope */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.2em] uppercase text-white font-semibold">
                Homeline Interio
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-olive-400 mt-1">
                Kolkata · Residential Interior Studio
              </p>
            </Link>
            <p className="text-sm text-charcoal-400 max-w-md leading-relaxed">
              Thoughtfully curated living environments, modular kitchens, and custom woodwork tailored to Kolkata residences. Designing functional sanctuaries that reflect your family's lifestyle.
            </p>
            <div className="flex items-center text-xs text-charcoal-400 pt-1">
              <MapPin className="w-4 h-4 text-olive-400 mr-2 flex-shrink-0" />
              <span>Consulting across Garia, Salt Lake, New Town, South City & Kolkata region</span>
            </div>
          </div>

          {/* Proposed Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4">
              Design Services
            </h4>
            <ul className="space-y-2 text-sm">
              {SERVICES_DATA.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services#${service.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-olive-400 hover:text-olive-300 text-xs inline-flex items-center pt-1">
                  View all services <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects" className="hover:text-white transition-colors">Project Gallery</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services & Process</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Design Philosophy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Consultation Request</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link></li>
              <li><Link to="/admin/login" className="text-charcoal-400 hover:text-olive-300 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Consultation CTA */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-2">
              Plan Your Space
            </h4>
            <p className="text-xs text-charcoal-400 leading-relaxed">
              Start with an exploratory brief. Tell us about your home and our team will outline layout possibilities.
            </p>
            <button
              onClick={() => openModal({ source: 'footer_cta' })}
              className="w-full py-2.5 px-4 bg-olive-700 hover:bg-olive-600 text-white text-xs font-semibold uppercase tracking-widest rounded transition-colors text-center"
            >
              Start Enquiry
            </button>
          </div>

        </div>

        {/* Legal & Nats LAB Concept Demo Disclosure */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-charcoal-500 gap-4">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <Sparkles className="w-4 h-4 text-olive-400 flex-shrink-0" />
            <p>
              Interactive concept demo developed by <strong className="text-charcoal-300 font-medium">Nats LAB</strong>. Project concepts and illustrative materials are presented for demonstration purposes.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-charcoal-300 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-olive-300 transition-colors inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Demo Admin
            </Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} Homeline Interio</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
