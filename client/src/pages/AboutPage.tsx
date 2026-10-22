import { Sparkles, ArrowRight, Compass, Shield, HeartHandshake } from 'lucide-react';
import { useLeadModal } from '../context/LeadModalContext';

export const AboutPage: React.FC = () => {
  const { openModal } = useLeadModal();

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
      
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
          About Homeline Interio
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-900 leading-tight">
          Designing Spaces for Modern Kolkata Living
        </h1>
        <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-sans">
          We approach residential interior design with an appreciation for Kolkata's distinctive architecture, humid weather considerations, and the warmth of family hospitality.
        </p>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">Ergonomic Spatial Flow</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Every millimeter matters in modern apartments. From kitchen triangle clearances to wardrobe loft access, we plan circulation routes that eliminate daily friction.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-700 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">Substrate Integrity</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Kolkata monsoons demand moisture-resistant substrates. We advocate for genuine BWR marine ply, calibrated HDHMR, and certified anti-fungal treatments for long-term endurance.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-base-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-charcoal-900 font-medium">Accountable Execution</h3>
          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Transparent material schedules and realistic milestone planning ensure that budget allocations are honored without surprise cost revisions.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-base-surfaceLight rounded-3xl p-8 sm:p-14 border border-base-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-olive-700 block">
            Craft & Materiality
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal-900 leading-snug">
            Thoughtful Interiors are Built on Respect for Daily Life.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
            Whether redesigning an ancestral flat near Prince Anwar Shah Road or outfitting an open-plan 3BHK in New Town, our goal is to create residences that feel balanced, calm, and unmistakably personal. We avoid fleeting aesthetic fads in favor of natural wood textures, concealed storage, and balanced illumination.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border border-base-border aspect-[4/3] bg-base-surface">
            <img
              src="/images/warm-contemporary-living.jpg"
              alt="Material craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Demo Disclosure Box */}
      <div className="p-6 bg-wood-50 border border-wood-200 rounded-2xl text-xs sm:text-sm text-charcoal-700 space-y-2">
        <div className="flex items-center space-x-2 text-wood-700 font-semibold uppercase tracking-wider text-xs">
          <Sparkles className="w-4 h-4 text-wood-500" />
          <span>Interactive Concept Demo Notice</span>
        </div>
        <p className="leading-relaxed">
          This digital experience was conceived and implemented by <strong>Nats LAB</strong> as a sales demonstration for Homeline Interio. The project imagery and service specifications illustrate how a high-end web presence with an integrated AI lead consultant can engage Kolkata homeowners. Fabricated customer testimonials, unverifiable years of experience, and arbitrary guarantees have been intentionally omitted to uphold editorial integrity.
        </p>
      </div>

      {/* Consultation Action */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-900">
          Ready to Discuss Your Home?
        </h3>
        <p className="text-sm text-charcoal-600 max-w-md mx-auto">
          Share your flat details and room goals. Our design coordinator will follow up to schedule a consultation.
        </p>
        <button
          onClick={() => openModal({ source: 'about_page_cta' })}
          className="inline-flex items-center px-8 py-3.5 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all"
        >
          <span>Schedule a Consultation</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

    </div>
  );
};
