import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
import { SERVICES_DATA } from '../data/businessData';
import { useLeadModal } from '../context/LeadModalContext';
import { api } from '../services/api';
import { LeadFormData } from '../types';

export const ServicesPage: React.FC = () => {
  const { openModal } = useLeadModal();

  // On-page direct consultation enquiry form state
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    projectType: 'Modular Kitchens',
    locality: '',
    budgetRange: '₹3 - ₹6 Lakh',
    description: '',
    preferredContactMethod: 'WhatsApp',
    consentGiven: true,
    source: 'services_page'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name.';
    }

    const cleanedPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
    let digits = cleanedPhone.startsWith('+91')
      ? cleanedPhone.slice(3)
      : cleanedPhone.startsWith('91') && cleanedPhone.length === 12
      ? cleanedPhone.slice(2)
      : cleanedPhone.startsWith('0') && cleanedPhone.length === 11
      ? cleanedPhone.slice(1)
      : cleanedPhone;

    if (!digits || digits.length !== 10 || !['6', '7', '8', '9'].includes(digits[0])) {
      errs.phone = 'Valid 10-digit Indian mobile number required.';
    }

    if (!formData.locality.trim()) {
      errs.locality = 'Please state your locality in Kolkata.';
    }

    if (!formData.consentGiven) {
      errs.consentGiven = 'Consent required to coordinate consultation.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitLead(formData);
      setSubmittedLeadId(res.leadId);
    } catch (err: any) {
      setServerError(err.message || 'Submission failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24">
      
      {/* Page Title */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
          Interior Architecture & Consultation
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-900 leading-tight">
          Tailored Design Services
        </h1>
        <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-sans">
          Whether you are taking possession of a new flat in New Town, renovating an established residence in Ballygunge, or upgrading your modular kitchen in Garia, we provide structured, accountable interior design consultations.
        </p>
      </div>

      {/* Services List Sections */}
      <div className="space-y-20">
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={service.id}
              id={service.slug}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-24`}
            >
              {/* Image Column */}
              <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="rounded-3xl overflow-hidden shadow-elevated border border-base-border aspect-[4/3] bg-base-surface">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="space-y-2">
                  <span className="text-xs font-serif italic text-olive-700 text-lg">
                    0{index + 1}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-medium">
                    {service.name}
                  </h2>
                  <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
                    {service.fullDescription}
                  </p>
                </div>

                {/* Suitable For */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
                    Ideal For:
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-600">
                    {service.suitableFor.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-olive-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Decisions */}
                <div className="space-y-2 bg-base-surfaceLight p-4 rounded-xl border border-base-border">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-olive-800">
                    Key Decisions Explored in Consultation:
                  </h4>
                  <ul className="space-y-1 text-xs text-charcoal-600">
                    {service.keyDecisions.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openModal({ projectType: service.name as any, source: 'service_page_section' })}
                    className="inline-flex items-center px-6 py-3 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all"
                  >
                    <span>Discuss {service.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Illustrative Budget Framework Notice */}
      <div className="bg-wood-50 p-8 rounded-2xl border border-wood-200 text-xs sm:text-sm text-charcoal-700 space-y-3">
        <div className="flex items-center space-x-2 text-wood-700 font-semibold uppercase tracking-wider text-xs">
          <Sparkles className="w-4 h-4 text-wood-500" />
          <span>Illustrative Budget Guidance (Demo Notice)</span>
        </div>
        <p className="leading-relaxed">
          Interior budgets in Kolkata vary according to floor plate dimensions, civil reconfiguration, core substrate choices (HDHMR vs. BWR Marine Ply), and finish grades (acrylic, matte laminate, or natural veneer). For this demonstration, sample project categories are mapped to indicative ranges (e.g. Under ₹3L, ₹3-6L, ₹6-10L) to help prospective clients frame expectations before an on-site evaluation. Homeline Interio finalizes transparent bill-of-quantities during personalized consultation.
        </p>
      </div>

      {/* Embedded Lead Capture Section */}
      <section className="bg-white p-8 sm:p-14 rounded-3xl border border-base-border shadow-soft max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
            Schedule a Conversation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900">
            Request an Interior Consultation
          </h2>
          <p className="text-sm text-charcoal-600">
            Provide your space requirements below. Our Kolkata interior coordinator will reach out via Phone or WhatsApp.
          </p>
        </div>

        {submittedLeadId ? (
          <div className="text-center py-8 space-y-3 bg-olive-50 p-6 rounded-2xl border border-olive-200">
            <div className="w-12 h-12 bg-olive-100 text-olive-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal-900">Enquiry Successfully Submitted</h3>
            <p className="text-sm text-charcoal-600">
              Reference ID: <strong className="font-mono text-olive-800">{submittedLeadId}</strong>
            </p>
            <p className="text-xs text-charcoal-500">
              Our design team will review your requirements and coordinate next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sourav Banerjee"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2.5 text-sm bg-base-surfaceLight border ${
                    errors.name ? 'border-red-400' : 'border-base-border'
                  } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Indian Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98300 12345"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2.5 text-sm bg-base-surfaceLight border ${
                    errors.phone ? 'border-red-400' : 'border-base-border'
                  } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                />
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Service of Interest *
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-800"
                >
                  <option value="Modular Kitchens">Modular Kitchens</option>
                  <option value="Full Home Interiors">Full Home Interiors</option>
                  <option value="Living Room Design">Living Room Design</option>
                  <option value="Bedroom Interiors">Bedroom Interiors</option>
                  <option value="Space Planning">Space Planning</option>
                  <option value="Renovation Consultation">Renovation Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Locality in Kolkata *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garia, Salt Lake, New Town"
                  value={formData.locality}
                  onChange={e => setFormData({ ...formData, locality: e.target.value })}
                  className={`w-full px-3 py-2.5 text-sm bg-base-surfaceLight border ${
                    errors.locality ? 'border-red-400' : 'border-base-border'
                  } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                />
                {errors.locality && <p className="text-[11px] text-red-600 mt-1">{errors.locality}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Target Budget <span className="lowercase font-normal text-charcoal-400">(optional)</span>
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-800"
                >
                  <option value="Under ₹3 Lakh">Under ₹3 Lakh</option>
                  <option value="₹3 - ₹6 Lakh">₹3 - ₹6 Lakh</option>
                  <option value="₹6 - ₹10 Lakh">₹6 - ₹10 Lakh</option>
                  <option value="₹10 - ₹15 Lakh">₹10 - ₹15 Lakh</option>
                  <option value="₹15 Lakh+">₹15 Lakh+</option>
                  <option value="Flexible / To Discuss">Flexible / To Discuss</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Preferred Contact Channel
                </label>
                <div className="flex space-x-2 pt-1">
                  {['WhatsApp', 'Phone', 'Email'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContactMethod: method as any })}
                      className={`flex-1 py-2 text-xs rounded border transition-all ${
                        formData.preferredContactMethod === method
                          ? 'border-olive-600 bg-olive-50 text-olive-900 font-semibold'
                          : 'border-base-border bg-base-surfaceLight text-charcoal-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                Project Specifics or Questions
              </label>
              <textarea
                rows={3}
                placeholder="Mention any specifics: room dimensions, flat handover timeline, materials you like..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="flex items-start space-x-2 text-xs text-charcoal-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                  className="mt-0.5 rounded text-olive-600 focus:ring-olive-500"
                />
                <span>I consent to being contacted by Homeline Interio regarding this interior consultation enquiry.</span>
              </label>
              {errors.consentGiven && <p className="text-[11px] text-red-600 mt-1">{errors.consentGiven}</p>}
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-olive-700 hover:bg-olive-800 disabled:bg-olive-400 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-2" />
                    <span>Submit Consultation Request</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </section>

    </div>
  );
};
