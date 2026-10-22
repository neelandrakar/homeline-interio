import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Sparkles, Layers, Palette, Compass } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/projectsData';
import { useLeadModal } from '../context/LeadModalContext';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openModal } = useLeadModal();

  const project = INITIAL_PROJECTS.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-site mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-charcoal-900">Project Concept Not Found</h2>
        <p className="text-sm text-charcoal-600">The requested design concept does not exist or has been relocated.</p>
        <Link
          to="/projects"
          className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-olive-700 underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to all projects
        </Link>
      </div>
    );
  }

  const relatedProjects = INITIAL_PROJECTS.filter(p =>
    project.relatedSlugs?.includes(p.slug)
  );

  const handleDiscussSimilarProject = () => {
    // Open AI assistant or trigger consultation modal with prefilled data
    let mappedType: any = 'Modular Kitchens';
    if (project.category === 'Living Room') mappedType = 'Living Room Design';
    else if (project.category === 'Kitchen') mappedType = 'Modular Kitchens';
    else if (project.category === 'Bedroom') mappedType = 'Bedroom Interiors';
    else if (project.category === 'Full Home') mappedType = 'Full Home Interiors';
    else if (project.category === 'Compact Spaces') mappedType = 'Space Planning';

    openModal({
      projectType: mappedType,
      source: 'project_detail',
      description: `Inquiring regarding design concept: "${project.title}" (${project.style} style).`
    });
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Back button & Breadcrumbs */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-charcoal-500 hover:text-charcoal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>All Project Concepts</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-xs uppercase tracking-wider font-semibold">
              Demo Concept · {project.category}
            </span>
            <span className="px-3 py-1 bg-base-surface text-charcoal-700 rounded-full text-xs font-medium">
              Style: {project.style}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal-900 leading-tight">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-sans max-w-2xl">
            {project.description}
          </p>
        </div>

        <div className="lg:col-span-4 flex lg:justify-end">
          <button
            type="button"
            onClick={handleDiscussSimilarProject}
            className="w-full sm:w-auto px-7 py-4 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all inline-flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss a Similar Project</span>
          </button>
        </div>
      </div>

      {/* Main Image Showcase */}
      <div className="rounded-3xl overflow-hidden shadow-elevated border border-base-border aspect-[16/9] bg-base-surface">
        <img
          src={project.imageUrl}
          alt={project.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Concept Architecture & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Project Brief */}
        <div className="bg-white p-7 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-olive-700 font-semibold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Illustrative Brief</span>
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">
            Design Intention
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            {project.brief}
          </p>
        </div>

        {/* Materials Specification */}
        <div className="bg-white p-7 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-olive-700 font-semibold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Core Materials</span>
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">
            Specification Highlights
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-charcoal-600">
            {project.materials.map((m, i) => (
              <li key={i} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-olive-500" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Color Palette */}
        <div className="bg-white p-7 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="flex items-center space-x-2 text-olive-700 font-semibold text-xs uppercase tracking-wider">
            <Palette className="w-4 h-4" />
            <span>Tone & Swatches</span>
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">
            Curated Color Palette
          </h3>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {project.colorPalette.map((c, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 bg-base-surfaceLight rounded-lg border border-base-border">
                <span
                  className="w-5 h-5 rounded-md border border-base-border flex-shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="truncate">
                  <span className="block text-xs font-semibold text-charcoal-800 truncate">{c.name}</span>
                  <span className="block text-[10px] text-charcoal-400 font-mono">{c.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Spatial Layout Inspiration */}
      <div className="bg-base-surfaceLight p-8 sm:p-12 rounded-3xl border border-base-border space-y-4">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-olive-700 block">
          Spatial Strategy
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900">
          Layout Inspiration
        </h2>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-sans max-w-3xl">
          {project.layoutInspiration}
        </p>
      </div>

      {/* Related Concepts */}
      {relatedProjects.length > 0 && (
        <div className="space-y-6 pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-900">
            Related Project Concepts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <Link
                key={rel.id}
                to={`/projects/${rel.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-base-border hover:shadow-soft transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-base-surface">
                  <img
                    src={rel.imageUrl}
                    alt={rel.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] text-olive-700 font-medium block">
                    {rel.category} · {rel.style}
                  </span>
                  <h4 className="font-serif text-base text-charcoal-900 font-medium mt-1 group-hover:text-olive-700 transition-colors">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer Banner for Demo */}
      <div className="p-4 bg-base-surface rounded-xl border border-base-border text-xs text-charcoal-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-olive-600" />
          <span>Interactive concept demo by Nats LAB for Homeline Interio</span>
        </div>
        <Link to="/contact" className="text-olive-700 hover:underline font-semibold">
          Contact for Consultation →
        </Link>
      </div>

    </div>
  );
};
