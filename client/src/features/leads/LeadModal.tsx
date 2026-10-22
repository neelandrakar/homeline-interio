import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Send, Phone, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { useLeadModal } from '../../context/LeadModalContext';
import { api } from '../../services/api';
import { LeadFormData } from '../../types';

export const LeadModal: React.FC = () => {
  const { isOpen, closeModal, prefillData } = useLeadModal();

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    projectType: 'Modular Kitchens',
    locality: '',
    budgetRange: 'Flexible / To Discuss',
    description: '',
    preferredContactMethod: 'WhatsApp',
    consentGiven: true,
    source: 'modal_cta',
    conversationSummary: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState('');
  const [serverError, setServerError] = useState('');

  // Update form fields when prefillData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        ...prefillData,
        consentGiven: true
      }));
      setErrors({});
      setSubmitSuccess(false);
      setServerError('');
    }
  }, [isOpen, prefillData]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full name (at least 2 characters).';
    }

    // Phone validation for Indian mobile
    const cleanedPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
    let digits = cleanedPhone.startsWith('+91')
      ? cleanedPhone.slice(3)
      : cleanedPhone.startsWith('91') && cleanedPhone.length === 12
      ? cleanedPhone.slice(2)
      : cleanedPhone.startsWith('0') && cleanedPhone.length === 11
      ? cleanedPhone.slice(1)
      : cleanedPhone;

    if (!digits || digits.length !== 10 || !['6', '7', '8', '9'].includes(digits[0])) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9830123456).';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address or leave it blank.';
    }

    if (!formData.locality.trim() || formData.locality.trim().length < 2) {
      newErrors.locality = 'Please specify your locality in or around Kolkata.';
    }

    if (!formData.consentGiven) {
      newErrors.consentGiven = 'Consent is required so our team can follow up regarding your enquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitLead(formData);
      setCreatedLeadId(res.leadId);
      setSubmitSuccess(true);
    } catch (err: any) {
      setServerError(err.message || 'Unable to submit enquiry right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-base-ivory border border-base-border rounded-lg shadow-elevated w-full max-w-xl overflow-hidden animate-fade-in">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-base-border flex items-center justify-between bg-base-surfaceLight">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-olive-700 block">
              Consultation Request
            </span>
            <h3 id="modal-title" className="text-xl font-serif text-charcoal-900 font-semibold mt-0.5">
              Plan Your Interior Space
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-charcoal-500 hover:text-charcoal-800 rounded-full hover:bg-base-surface transition-colors"
            aria-label="Close consultation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-olive-100 text-olive-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-serif text-2xl text-charcoal-900 font-medium">
                Enquiry Received
              </h4>
              <p className="text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-charcoal-900">{formData.name}</strong>. Your project enquiry for <strong>{formData.projectType}</strong> in <strong>{formData.locality}</strong> has been saved.
              </p>
              <div className="inline-block bg-base-surface px-4 py-2 rounded text-xs font-mono text-charcoal-700 border border-base-border">
                Reference ID: <strong className="text-olive-700">{createdLeadId}</strong>
              </div>
              <p className="text-xs text-charcoal-500 pt-2">
                Our design coordinator will review your space details and follow up via {formData.preferredContactMethod} to schedule a consultation.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-wider font-semibold rounded shadow-soft transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span>{serverError}</span>
                </div>
              )}

              {formData.conversationSummary && (
                <div className="p-3 bg-olive-50 border border-olive-200 rounded text-xs text-olive-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-medium text-olive-800">
                    <Sparkles className="w-3.5 h-3.5 text-olive-600" />
                    <span>Imported from AI Design Consultation</span>
                  </div>
                  <p className="text-charcoal-600 text-[11px] leading-tight line-clamp-2">
                    {formData.conversationSummary}
                  </p>
                </div>
              )}

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyo Sen"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 text-sm bg-white border ${
                      errors.name ? 'border-red-400 focus:ring-red-300' : 'border-base-border focus:ring-olive-400'
                    } rounded focus:outline-none focus:ring-1`}
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98301 23456"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-sm bg-white border ${
                      errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-base-border focus:ring-olive-400'
                    } rounded focus:outline-none focus:ring-1`}
                  />
                  {errors.phone ? (
                    <p className="text-[11px] text-red-600 mt-0.5">{errors.phone}</p>
                  ) : (
                    <p className="text-[10px] text-charcoal-400 mt-0.5">Indian 10-digit mobile number</p>
                  )}
                </div>
              </div>

              {/* Email & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Email Address <span className="text-charcoal-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 text-sm bg-white border ${
                      errors.email ? 'border-red-400' : 'border-base-border'
                    } rounded focus:outline-none focus:ring-1 focus:ring-olive-400`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Project Locality in Kolkata *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garia, Salt Lake, New Town"
                    value={formData.locality}
                    onChange={e => setFormData({ ...formData, locality: e.target.value })}
                    className={`w-full px-3 py-2 text-sm bg-white border ${
                      errors.locality ? 'border-red-400' : 'border-base-border'
                    } rounded focus:outline-none focus:ring-1 focus:ring-olive-400`}
                  />
                  {errors.locality && <p className="text-[11px] text-red-600 mt-0.5">{errors.locality}</p>}
                </div>
              </div>

              {/* Project Type & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                    Design Service *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-400 text-charcoal-800"
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
                    Budget Target <span className="text-charcoal-400 font-normal lowercase">(indicative)</span>
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-400 text-charcoal-800"
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

              {/* Project Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1">
                  Brief Description or Specific Needs
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2BHK flat, need L-shaped kitchen layout, TV unit, and master wardrobe with soft close drawers..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-base-border rounded focus:outline-none focus:ring-1 focus:ring-olive-400 text-charcoal-800 resize-none"
                />
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-700 font-semibold mb-1.5">
                  Preferred Follow-up Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { method: 'WhatsApp', icon: MessageSquare },
                    { method: 'Phone', icon: Phone },
                    { method: 'Email', icon: Mail }
                  ].map(({ method, icon: Icon }) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContactMethod: method as any })}
                      className={`flex items-center justify-center py-2 px-3 text-xs rounded border transition-all ${
                        formData.preferredContactMethod === method
                          ? 'border-olive-600 bg-olive-50 text-olive-900 font-semibold'
                          : 'border-base-border bg-white text-charcoal-600 hover:border-charcoal-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explicit Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 text-xs text-charcoal-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentGiven}
                    onChange={e => setFormData({ ...formData, consentGiven: e.target.checked })}
                    className="mt-0.5 rounded border-base-border text-olive-600 focus:ring-olive-500"
                  />
                  <span>
                    I consent to Homeline Interio contacting me regarding this design enquiry via my chosen method.
                  </span>
                </label>
                {errors.consentGiven && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.consentGiven}</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-base-border">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-charcoal-600 hover:text-charcoal-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-olive-700 hover:bg-olive-800 disabled:bg-olive-400 text-white text-xs uppercase tracking-widest font-semibold rounded shadow-soft transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-2" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
