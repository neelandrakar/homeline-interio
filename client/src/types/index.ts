export interface ProjectConcept {
  id: string;
  slug: string;
  title: string;
  category: 'Living Room' | 'Kitchen' | 'Bedroom' | 'Full Home' | 'Compact Spaces';
  style: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  featured: boolean;
  brief: string;
  materials: string[];
  colorPalette: { name: string; hex: string }[];
  layoutInspiration: string;
  relatedSlugs: string[];
  relatedProjects?: ProjectConcept[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  suitableFor: string[];
  keyDecisions: string[];
  imageUrl: string;
}

export interface ConsultationStep {
  step: number;
  title: string;
  description: string;
}

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface Lead {
  _id: string;
  leadId: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  phoneDigits: string;
  email?: string;
  projectType: string;
  locality: string;
  budgetRange?: string;
  description?: string;
  preferredContactMethod: 'Phone' | 'WhatsApp' | 'Email';
  source: string;
  conversationSummary?: string;
  consentGiven: boolean;
  status: 'New' | 'Contacted' | 'Qualified' | 'Consultation Scheduled' | 'Won' | 'Lost';
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  projectType: string;
  locality: string;
  budgetRange: string;
  description: string;
  preferredContactMethod: 'Phone' | 'WhatsApp' | 'Email';
  consentGiven: boolean;
  source: string;
  conversationSummary?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ExtractedRequirements {
  propertyType?: string;
  projectType?: string;
  locality?: string;
  budget?: string;
  style?: string;
  scopeOrDimensions?: string;
  missingRequirements?: string[];
}

export interface AIChatResponse {
  success: boolean;
  conversationId: string;
  assistantMessage: string;
  extractedRequirements: ExtractedRequirements;
  suggestedActions: string[];
  leadCaptureRecommended: boolean;
  isFallbackMode: boolean;
  provider: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
