import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useLeadModal } from '../../context/LeadModalContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useLeadModal();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-base-ivory/90 backdrop-blur-md border-b border-base-border transition-colors">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark */}
          <Link to="/" className="group flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.18em] uppercase text-charcoal-800 font-semibold group-hover:text-olive-700 transition-colors">
              Homeline Interio
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-charcoal-500 font-sans -mt-0.5">
              Kolkata · Residential Design
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 border-b-2 ${
                  isActive(link.path)
                    ? 'border-olive-600 text-charcoal-900 font-semibold'
                    : 'border-transparent text-charcoal-600 hover:text-charcoal-900 hover:border-charcoal-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => openModal({ source: 'header_cta' })}
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs uppercase tracking-widest font-semibold bg-olive-600 text-white hover:bg-olive-700 active:scale-[0.98] transition-all rounded shadow-soft group"
            >
              <span>Book a Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal-800 hover:text-olive-600 focus:outline-none focus:ring-2 focus:ring-olive-500 rounded"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-base-border bg-base-ivory px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-elevated">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-base rounded ${
                  isActive(link.path)
                    ? 'bg-base-surface text-charcoal-900 font-semibold'
                    : 'text-charcoal-700 hover:bg-base-surfaceLight'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-base-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal({ source: 'mobile_header_cta' });
              }}
              className="w-full flex items-center justify-center px-4 py-3 text-sm uppercase tracking-widest font-semibold bg-olive-600 text-white hover:bg-olive-700 rounded shadow-soft"
            >
              <span>Book a Consultation</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
