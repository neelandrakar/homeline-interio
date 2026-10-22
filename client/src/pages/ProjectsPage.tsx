import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/projectsData';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Living Room',
    'Kitchen',
    'Bedroom',
    'Full Home',
    'Compact Spaces'
  ];

  const filteredProjects = selectedCategory === 'All'
    ? INITIAL_PROJECTS
    : INITIAL_PROJECTS.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-olive-600" />
          <span>Demo Concept Portfolio</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-900 leading-tight">
          Residential Design Concepts
        </h1>
        <p className="text-base text-charcoal-600 leading-relaxed font-sans">
          Explore curated illustrative design concepts for Kolkata apartments and homes. Each concept represents a tailored harmony of layout ergonomics, material durability, and warm aesthetic balance.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-base-border">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-olive-700 text-white shadow-soft'
                : 'bg-white text-charcoal-600 hover:bg-base-surface border border-base-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-2xl overflow-hidden border border-base-border shadow-soft hover:shadow-elevated transition-all flex flex-col"
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-base-surface">
              <img
                src={project.imageUrl}
                alt={project.imageAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold text-charcoal-700 border border-white/60">
                Demo Concept · {project.category}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-olive-700 font-medium block mb-1">
                  {project.style}
                </span>
                <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-olive-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-2 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-base-border flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  {project.colorPalette.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-base-border"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
                <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-olive-700 hover:text-olive-900 group/btn"
                >
                  <span>View Concept</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Disclosure Box */}
      <div className="p-4 bg-base-surface rounded-xl border border-base-border text-xs text-charcoal-600 flex items-start space-x-3">
        <Sparkles className="w-4 h-4 text-olive-600 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Presentation Notice:</strong> All concepts depicted above are illustrative 3D visualization studies developed by Nats LAB for Homeline Interio. When real approved project photography is supplied by the client, it seamlessly populates this structured dataset.
        </p>
      </div>

    </div>
  );
};
