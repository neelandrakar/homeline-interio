import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles, MessageSquare } from 'lucide-react';
import { INITIAL_PROJECTS } from '../data/projectsData';
import { SERVICES_DATA, CONSULTATION_STEPS, BUSINESS_INFO } from '../data/businessData';
import { useLeadModal } from '../context/LeadModalContext';

export const HomePage: React.FC = () => {
  const { openModal } = useLeadModal();
  const featuredProjects = INITIAL_PROJECTS.filter(p => p.featured).slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      
      {/* SECTION A: HERO */}
      <section className="relative pt-8 sm:pt-16 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-xs uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 rounded-full bg-olive-600 animate-pulse" />
              <span>{BUSINESS_INFO.eyebrow}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-charcoal-900 leading-[1.08] font-normal tracking-tight">
              Spaces That <br />
              <span className="italic font-serif font-light text-olive-700">Feel Like Home.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-600 max-w-xl font-sans leading-relaxed">
              Thoughtfully designed interiors, tailored around your lifestyle, your space, and your vision. From modern modular kitchens to full-home transformations in Kolkata.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all text-center group"
              >
                <span>Explore Our Designs</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => openModal({ source: 'hero_secondary_cta' })}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-base-surface hover:bg-base-surfaceLight border border-base-border text-charcoal-800 text-xs uppercase tracking-widest font-semibold rounded transition-colors text-center"
              >
                <span>Plan Your Interior</span>
              </button>
            </div>

            {/* Subtle locality badges */}
            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs text-charcoal-500">
              <span className="font-medium text-charcoal-700">Serving residences in:</span>
              <span className="bg-white px-2.5 py-1 rounded border border-base-border">Garia</span>
              <span className="bg-white px-2.5 py-1 rounded border border-base-border">Salt Lake</span>
              <span className="bg-white px-2.5 py-1 rounded border border-base-border">New Town</span>
              <span className="bg-white px-2.5 py-1 rounded border border-base-border">South City</span>
              <span className="bg-white px-2.5 py-1 rounded border border-base-border">Ballygunge</span>
            </div>
          </div>

          {/* Hero Editorial Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-base-border aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="/images/hero.jpg"
                alt="Homeline Interio contemporary living space concept"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-olive-700 block">
                    Demo Concept · Kolkata
                  </span>
                  <p className="font-serif text-sm text-charcoal-900 font-medium">
                    Warm Contemporary Residence
                  </p>
                </div>
                <Link
                  to="/projects/warm-contemporary-living"
                  className="p-2 text-charcoal-700 hover:text-olive-700 rounded-full hover:bg-base-surfaceLight transition-colors"
                  aria-label="View concept details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION B: INTRODUCTORY STORY */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-base-surfaceLight rounded-3xl p-8 sm:p-14 border border-base-border">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700">
              Our Perspective
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal-900 leading-tight">
              Good Design Starts With <br />
              <span className="italic font-normal">Understanding You.</span>
            </h2>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed font-sans">
              A home is not a static showroom; it is the backdrop to morning chai, lively family celebrations, and quiet evening unwindings. We believe interior design in Kolkata should balance enduring Bengali hospitality with contemporary space efficiency—solving storage constraints, humidity challenges, and functional zoning without sacrificing aesthetic warmth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
              <div className="p-4 bg-white rounded-xl border border-base-border">
                <span className="font-serif text-2xl text-olive-700 block mb-1">01</span>
                <h4 className="font-semibold text-charcoal-900 text-sm">Spatial Clarity</h4>
                <p className="text-xs text-charcoal-500 mt-1">Clearing visual clutter while maximizing storage capacity.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-base-border">
                <span className="font-serif text-2xl text-olive-700 block mb-1">02</span>
                <h4 className="font-semibold text-charcoal-900 text-sm">Honest Materials</h4>
                <p className="text-xs text-charcoal-500 mt-1">BWR marine ply, durable quartz, and moisture-resistant hardware.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-base-border">
                <span className="font-serif text-2xl text-olive-700 block mb-1">03</span>
                <h4 className="font-semibold text-charcoal-900 text-sm">Tailored Living</h4>
                <p className="text-xs text-charcoal-500 mt-1">Every dimension customized to how your household moves and lives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED PROJECT CONCEPTS */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block mb-1">
              Design Concepts
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900">
              Featured Interior Concepts
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-olive-700 hover:text-olive-900 transition-colors"
          >
            <span>View All 8 Concepts</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-base-border shadow-soft hover:shadow-elevated transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-base-surface">
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
                  <div className="flex items-center justify-between text-xs text-olive-700 font-medium mb-1">
                    <span>{project.style}</span>
                    <span className="text-charcoal-400">Concept</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal-900 group-hover:text-olive-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-base-border flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {project.colorPalette.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-base-border"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-olive-700 hover:text-olive-900 group/link"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION D: PROPOSED SERVICES */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
            What We Do
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900">
            Comprehensive Interior Design Services
          </h2>
          <p className="text-sm text-charcoal-600">
            Proposed service categories crafted for Kolkata apartments and residential spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="bg-white p-7 rounded-2xl border border-base-border shadow-soft flex flex-col justify-between space-y-5 hover:border-olive-300 transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-olive-50 text-olive-700 flex items-center justify-center font-serif font-semibold text-base">
                  ✦
                </div>
                <h3 className="font-serif text-xl text-charcoal-900 font-medium">
                  {service.name}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-base-border flex items-center justify-between">
                <Link
                  to={`/services#${service.slug}`}
                  className="text-xs uppercase tracking-wider font-semibold text-olive-700 hover:text-olive-900 inline-flex items-center"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <button
                  type="button"
                  onClick={() => openModal({ projectType: service.name as any, source: 'service_card' })}
                  className="text-xs text-charcoal-500 hover:text-charcoal-800 underline"
                >
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION E: AI ASSISTANT PROMOTION BANNER */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-olive-900 rounded-3xl p-8 sm:p-14 text-white shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider font-medium text-olive-200">
              <Sparkles className="w-3.5 h-3.5 text-olive-300" />
              <span>Interactive AI Lead Engine</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
              Not Sure Where to Start? <br />
              <span className="italic font-light text-olive-300">Let's Talk About Your Space.</span>
            </h2>

            <p className="text-charcoal-300 text-sm sm:text-base leading-relaxed">
              Tell our design assistant what you have in mind. Explore room ideas, calculate preliminary scopes, and organize your requirements into a structured brief before your consultation.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => {
                  // Trigger launcher button or window event
                  const chatButton = document.querySelector('button[aria-label="Open AI Interior Design Consultant"]') as HTMLButtonElement;
                  if (chatButton) chatButton.click();
                }}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-olive-500 hover:bg-olive-400 text-charcoal-900 text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all text-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Talk to Our Design Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: HOW IT WORKS */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900">
            A Transparent Three-Step Journey
          </h2>
          <p className="text-sm text-charcoal-600">
            From preliminary vision to executed reality in Kolkata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONSULTATION_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white p-8 rounded-2xl border border-base-border relative shadow-soft"
            >
              <div className="font-serif text-4xl text-olive-600 font-light mb-4">
                0{step.step}
              </div>
              <h3 className="font-serif text-xl text-charcoal-900 font-medium mb-2">
                {step.title.replace(/^\d+\.\s*/, '')}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION G: FINAL CTA */}
      <section className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-base-surface rounded-3xl p-10 sm:p-16 border border-base-border max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
            Begin Your Project
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal-900 leading-tight">
            Let's Plan a Space <br />
            <span className="italic font-normal">That Works for You.</span>
          </h2>
          <p className="text-sm sm:text-base text-charcoal-600 max-w-xl mx-auto">
            Share your room details or apartment possession dates. Our Kolkata team will schedule a tailored consultation.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openModal({ source: 'homepage_final_cta' })}
              className="inline-flex items-center justify-center px-8 py-4 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all"
            >
              <span>Start Your Project Enquiry</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
