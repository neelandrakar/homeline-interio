import React, { useState } from 'react';
import { MessageSquare, MapPin, CheckCircle2, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { LeadFormData } from '../types';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    projectType: 'Full Home Interiors',
    locality: '',
    budgetRange: 'Flexible / To Discuss',
    description: '',
    preferredContactMethod: 'WhatsApp',
    consentGiven: true,
    source: 'contact_page'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name.';
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
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9830123456).';
    }

    if (!formData.locality.trim()) {
      errs.locality = 'Please state your Kolkata locality (e.g. Garia, Salt Lake, New Town).';
    }

    if (!formData.consentGiven) {
      errs.consentGiven = 'Consent is required to contact you regarding this enquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitLead(formData);
      setSubmittedLeadId(res.leadId);
    } catch (err: any) {
      setServerError(err.message || 'Submission failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-olive-700 block">
          Consultation & Enquiries
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-charcoal-900 leading-tight">
          Let's Discuss Your Space
        </h1>
        <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-sans">
          Tell us about your apartment, house, or renovation scope in Kolkata. Our design coordinator reviews each enquiry carefully before scheduling an exploratory call.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Contact Notice & AI Assistant Promo */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Operational Area Information */}
          <div className="bg-white p-7 rounded-2xl border border-base-border shadow-soft space-y-4">
            <h3 className="font-serif text-xl text-charcoal-900 font-semibold">
              Kolkata Studio & Service Coverage
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
              Homeline Interio coordinates residential consultations across Greater Kolkata and adjoining suburban developments.
            </p>
            <div className="pt-2 space-y-2.5 text-xs text-charcoal-700">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-olive-700 flex-shrink-0 mt-0.5" />
                <span>Primary Coverage: Garia, Salt Lake, New Town, Rajarhat, South City, Ballygunge, Behala, Jadavpur, Alipore</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MessageSquare className="w-4 h-4 text-olive-700 flex-shrink-0 mt-0.5" />
                <span>Follow-up channels: WhatsApp & Phone consultations</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-base-border text-[11px] text-charcoal-500">
              <em>Note: Specific physical studio address and direct phone lines are pending formal client onboarding. All enquiries submitted through this demo are saved to the administrative database.</em>
            </div>
          </div>

          {/* AI Consultant Option */}
          <div className="bg-gradient-to-br from-charcoal-900 to-olive-950 text-white p-7 rounded-2xl border border-charcoal-800 shadow-soft space-y-4">
            <div className="flex items-center space-x-2 text-olive-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Option</span>
            </div>
            <h3 className="font-serif text-xl font-medium">
              Prefer a Quick AI Conversation?
            </h3>
            <p className="text-xs text-charcoal-300 leading-relaxed">
              If you aren't sure how to structure your budget or what room categories you need, chat with our virtual design assistant to assemble your brief.
            </p>
            <button
              type="button"
              onClick={() => {
                const btn = document.querySelector('button[aria-label="Open AI Interior Design Consultant"]') as HTMLButtonElement;
                if (btn) btn.click();
              }}
              className="w-full py-2.5 px-4 bg-olive-600 hover:bg-olive-500 text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors text-center"
            >
              Launch Design Assistant
            </button>
          </div>

        </div>

        {/* Right Column: Direct Consultation Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-base-border shadow-soft">
            <h3 className="font-serif text-2xl text-charcoal-900 font-semibold mb-2">
              Consultation Enquiry Form
            </h3>
            <p className="text-xs text-charcoal-500 mb-6">
              Complete this form to register your interior project in our system.
            </p>

            {submittedLeadId ? (
              <div className="text-center py-10 space-y-4 bg-olive-50 p-6 rounded-2xl border border-olive-200">
                <div className="w-12 h-12 bg-olive-100 text-olive-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl text-charcoal-900">Enquiry Confirmed</h4>
                <p className="text-sm text-charcoal-700 max-w-md mx-auto">
                  Your enquiry has been logged under Reference ID: <strong className="font-mono text-olive-800">{submittedLeadId}</strong>.
                </p>
                <p className="text-xs text-charcoal-500">
                  Our team will connect with you via {formData.preferredContactMethod} to review your spatial brief.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedLeadId('')}
                  className="mt-4 px-5 py-2 bg-olive-700 text-white text-xs uppercase tracking-wider rounded font-semibold"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
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
                      placeholder="e.g. Debolina Roy"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 text-sm bg-base-surfaceLight border ${
                        errors.name ? 'border-red-400' : 'border-base-border'
                      } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                      Indian Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98311 23456"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 text-sm bg-base-surfaceLight border ${
                        errors.phone ? 'border-red-400' : 'border-base-border'
                      } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                      Email Address <span className="lowercase font-normal text-charcoal-400">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500"
                    />
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
                      className={`w-full px-3 py-2 text-sm bg-base-surfaceLight border ${
                        errors.locality ? 'border-red-400' : 'border-base-border'
                      } rounded focus:outline-none focus:ring-1 focus:ring-olive-500`}
                    />
                    {errors.locality && <p className="text-[11px] text-red-600 mt-1">{errors.locality}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                      Design Service *
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-800"
                    >
                      <option value="Full Home Interiors">Full Home Interiors</option>
                      <option value="Modular Kitchens">Modular Kitchens</option>
                      <option value="Living Room Design">Living Room Design</option>
                      <option value="Bedroom Interiors">Bedroom Interiors</option>
                      <option value="Space Planning">Space Planning</option>
                      <option value="Renovation Consultation">Renovation Consultation</option>
                      <option value="Other / Custom">Other / Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                      Target Budget <span className="lowercase font-normal text-charcoal-400">(optional)</span>
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500 text-charcoal-800"
                    >
                      <option value="Under ₹3 Lakh">Under ₹3 Lakh</option>
                      <option value="₹3 - ₹6 Lakh">₹3 - ₹6 Lakh</option>
                      <option value="₹6 - ₹10 Lakh">₹6 - ₹10 Lakh</option>
                      <option value="₹10 - ₹15 Lakh">₹10 - ₹15 Lakh</option>
                      <option value="₹15 Lakh+">₹15 Lakh+</option>
                      <option value="Flexible / To Discuss">Flexible / To Discuss</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Space Details / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the property (e.g. 2BHK flat, handover expected next month, priority on storage and kitchen ergonomics)..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-base-surfaceLight border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Preferred Contact Channel
                  </label>
                  <div className="flex space-x-2">
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

                <div>
                  <label className="flex items-start space-x-2 text-xs text-charcoal-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentGiven}
                      onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                      className="mt-0.5 rounded text-olive-600 focus:ring-olive-500"
                    />
                    <span>
                      I consent to Homeline Interio contacting me regarding this interior consultation enquiry.
                    </span>
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
                        <span>Submit Project Enquiry</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
