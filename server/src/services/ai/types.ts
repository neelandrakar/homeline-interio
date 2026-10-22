export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ExtractedRequirements {
  propertyType?: string;      // e.g. '2BHK Apartment', '3BHK Flat', 'Bungalow'
  projectType?: string;       // e.g. 'Modular Kitchens', 'Full Home Interiors', 'Living Room Design'
  locality?: string;          // e.g. 'Garia', 'Salt Lake', 'New Town'
  budget?: string;            // e.g. '₹3 Lakh', '₹5 - 8 Lakh'
  style?: string;             // e.g. 'Warm Contemporary', 'Modern Minimalist', 'Japandi'
  scopeOrDimensions?: string; // e.g. '10x12 ft kitchen', 'False ceiling + TV unit'
  missingRequirements: string[];
}

export interface AIChatResponse {
  assistantMessage: string;
  extractedRequirements: ExtractedRequirements;
  suggestedActions: string[];
  leadCaptureRecommended: boolean;
  isFallbackMode: boolean;
  provider: string;
}
