import { BUSINESS_CONFIG } from '../../config/business.js';
import { ChatMessage, ExtractedRequirements, AIChatResponse } from './types.js';

export class AIFallbackEngine {
  /**
   * Extract design project requirements from user messages
   */
  extractRequirements(
    messages: ChatMessage[],
    existing: Partial<ExtractedRequirements> = {}
  ): ExtractedRequirements {
    const combinedText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ')
      .toLowerCase();

    const req: ExtractedRequirements = {
      propertyType: existing.propertyType,
      projectType: existing.projectType,
      locality: existing.locality,
      budget: existing.budget,
      style: existing.style,
      scopeOrDimensions: existing.scopeOrDimensions,
      missingRequirements: []
    };

    // 1. Property Type Extraction
    if (!req.propertyType) {
      if (/\b([1-5])\s*bhk\b/i.test(combinedText)) {
        const match = combinedText.match(/\b([1-5])\s*bhk\b/i);
        if (match) req.propertyType = `${match[1].toUpperCase()}BHK Apartment`;
      } else if (/\bstudio\b/i.test(combinedText)) {
        req.propertyType = 'Studio Apartment';
      } else if (/\b(villa|duplex|bungalow|independent house)\b/i.test(combinedText)) {
        const match = combinedText.match(/\b(villa|duplex|bungalow|independent house)\b/i);
        if (match) req.propertyType = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      } else if (/\b(apartment|flat)\b/i.test(combinedText)) {
        req.propertyType = 'Residential Apartment';
      }
    }

    // 2. Project / Room Category Extraction
    if (!req.projectType) {
      if (/\b(full\s*home|complete\s*(home|flat|interior)|whole\s*(flat|apartment)|entire\s*(flat|home))\b/i.test(combinedText)) {
        req.projectType = 'Full Home Interiors';
      } else if (/\b(modular\s*kitchen|kitchen|pantry|cooktop|chimney)\b/i.test(combinedText)) {
        req.projectType = 'Modular Kitchens';
      } else if (/\b(living\s*room|hall|drawing\s*room|lounge|tv\s*unit)\b/i.test(combinedText)) {
        req.projectType = 'Living Room Design';
      } else if (/\b(bedroom|master\s*bedroom|wardrobe|guest\s*room)\b/i.test(combinedText)) {
        req.projectType = 'Bedroom Interiors';
      } else if (/\b(space\s*planning|layout|floor\s*plan)\b/i.test(combinedText)) {
        req.projectType = 'Space Planning';
      } else if (/\b(renovat|remodel|damp|older\s*flat|civil\s*work)\b/i.test(combinedText)) {
        req.projectType = 'Renovation Consultation';
      }
    }

    // 3. Locality Extraction (Kolkata & surrounding regions)
    if (!req.locality) {
      for (const loc of BUSINESS_CONFIG.popularLocalities) {
        // match word boundary
        const locClean = loc.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        if (combinedText.includes(locClean)) {
          req.locality = loc;
          break;
        }
      }
      if (!req.locality) {
        // Check for other common Kolkata areas
        const otherLocalities = [
          'kasba', 'ruby', 'lake gardens', 'madhyamgram', 'barasat',
          'behala chowrasta', 'gariahat', 'park street', 'shyam bazaar', 'hatibagan',
          'ultadanga', 'chinar park', 'rajarhat'
        ];
        for (const loc of otherLocalities) {
          if (combinedText.includes(loc)) {
            req.locality = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            break;
          }
        }
      }
    }

    // 4. Budget Extraction (INR parsing)
    if (!req.budget) {
      // e.g. "3 lakh", "3.5 lakhs", "₹3L", "300000", "5-8 lakhs"
      const lakhMatch = combinedText.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*(lakhs?|lacs?|l\b)/i);
      if (lakhMatch) {
        if (lakhMatch[2]) {
          req.budget = `₹${lakhMatch[1]} - ₹${lakhMatch[2]} Lakh`;
        } else {
          req.budget = `₹${lakhMatch[1]} Lakh`;
        }
      } else {
        const rawNumMatch = combinedText.match(/(?:₹|rs\.?|inr)?\s*([1-9]\d{5,7})\b/i);
        if (rawNumMatch) {
          const val = parseInt(rawNumMatch[1], 10);
          const inLakhs = (val / 100000).toFixed(1).replace('.0', '');
          req.budget = `₹${inLakhs} Lakh`;
        }
      }
    }

    // 5. Style Preferences
    if (!req.style) {
      if (/\bjapandi\b/i.test(combinedText)) req.style = 'Japandi';
      else if (/\b(scandinavian|nordic)\b/i.test(combinedText)) req.style = 'Scandinavian';
      else if (/\b(minimal|minimalist|clean)\b/i.test(combinedText)) req.style = 'Modern Minimalist';
      else if (/\b(contemporary|modern)\b/i.test(combinedText)) req.style = 'Warm Contemporary';
      else if (/\b(classic|traditional|vintage|heritage)\b/i.test(combinedText)) req.style = 'Transitional Heritage';
      else if (/\b(wood|warm wood|walnut|oak)\b/i.test(combinedText)) req.style = 'Warm Wood & Earthy';
    }

    // Determine missing key requirements
    const missing: string[] = [];
    if (!req.projectType) missing.push('projectType');
    if (!req.propertyType) missing.push('propertyType');
    if (!req.locality) missing.push('locality');
    if (!req.budget) missing.push('budget');

    req.missingRequirements = missing;
    return req;
  }

  /**
   * Generate a helpful, grounded, and concise response
   */
  process(
    messages: ChatMessage[],
    currentProject?: string,
    existingRequirements: Partial<ExtractedRequirements> = {}
  ): AIChatResponse {
    const latestUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content.trim() || '';
    const lowerLatest = latestUserMsg.toLowerCase();

    // Contextual seed if launched from a project
    const seededReq = { ...existingRequirements };
    if (currentProject && !seededReq.projectType) {
      if (currentProject.toLowerCase().includes('kitchen')) seededReq.projectType = 'Modular Kitchens';
      else if (currentProject.toLowerCase().includes('living')) seededReq.projectType = 'Living Room Design';
      else if (currentProject.toLowerCase().includes('bedroom')) seededReq.projectType = 'Bedroom Interiors';
      else if (currentProject.toLowerCase().includes('full')) seededReq.projectType = 'Full Home Interiors';
      else if (currentProject.toLowerCase().includes('compact')) seededReq.projectType = 'Space Planning';
    }

    const req = this.extractRequirements(messages, seededReq);

    // Check for explicit consultation / lead submission intent
    const wantsToSubmit = /\b(submit|book|consult|quote|hire|contact|call me|whatsapp me|prepare enquiry|send enquiry)\b/i.test(lowerLatest);

    // Knowledge Grounding & FAQ check - only trigger if user is asking a question
    const isAskingQuestion = lowerLatest.includes('?') ||
      /\b(how|what|where|can i|is it|do you|which areas|who)\b/i.test(lowerLatest);

    if (isAskingQuestion) {
      for (const faq of BUSINESS_CONFIG.groundedFaqs) {
        const qWords = faq.question.toLowerCase().split(' ').filter(w => w.length > 3);
        const matches = qWords.filter(w => lowerLatest.includes(w));
        if (matches.length >= 2) {
          return {
            assistantMessage: `${faq.answer}\n\nTell me a little about your space so I can help organize your requirements. What type of project are you planning?`,
            extractedRequirements: req,
            suggestedActions: ['Plan Modular Kitchen', 'Full Home Interiors', 'Living Room Design', 'View Services'],
            leadCaptureRecommended: false,
            isFallbackMode: true,
            provider: 'Deterministic Knowledge Engine'
          };
        }
      }
    }

    // Ready for lead handover if at least 2 key requirements are met or user explicitly requested
    const hasSufficientRequirements =
      (Boolean(req.projectType) && (Boolean(req.locality) || Boolean(req.propertyType))) ||
      wantsToSubmit;

    if (wantsToSubmit || (hasSufficientRequirements && messages.length >= 4)) {
      const summaryItems: string[] = [];
      if (req.propertyType) summaryItems.push(`Property: ${req.propertyType}`);
      if (req.projectType) summaryItems.push(`Scope: ${req.projectType}`);
      if (req.locality) summaryItems.push(`Location: ${req.locality}`);
      if (req.budget) summaryItems.push(`Comfortable Budget: ${req.budget}`);
      if (req.style) summaryItems.push(`Preferred Style: ${req.style}`);

      const summaryText = summaryItems.length > 0
        ? `Here is the design brief we've outlined:\n• ${summaryItems.join('\n• ')}`
        : 'I have recorded your notes for the interior team.';

      return {
        assistantMessage: `${summaryText}\n\nWould you like me to prepare a project enquiry for our design team to review? They can coordinate a detailed consultation via Phone or WhatsApp.`,
        extractedRequirements: req,
        suggestedActions: ['Yes, Prepare Enquiry', 'Add More Details', 'Change Locality'],
        leadCaptureRecommended: true,
        isFallbackMode: true,
        provider: 'Deterministic Knowledge Engine'
      };
    }

    // Step-by-step guidance based on what's missing (one question at a time)
    if (!req.projectType) {
      return {
        assistantMessage: 'Welcome to Homeline Interio! What kind of space are you planning to design or renovate?',
        extractedRequirements: req,
        suggestedActions: [
          'Modular Kitchen',
          'Living Room Design',
          'Full Home Interiors',
          'Bedroom Retreat'
        ],
        leadCaptureRecommended: false,
        isFallbackMode: true,
        provider: 'Deterministic Knowledge Engine'
      };
    }

    if (!req.propertyType && req.projectType === 'Full Home Interiors') {
      return {
        assistantMessage: `Great, a full home interior project! Is your home a 2BHK, 3BHK, or an independent residence?`,
        extractedRequirements: req,
        suggestedActions: ['2BHK Apartment', '3BHK Apartment', '4BHK / Villa', 'Under Possession'],
        leadCaptureRecommended: false,
        isFallbackMode: true,
        provider: 'Deterministic Knowledge Engine'
      };
    }

    if (!req.locality) {
      return {
        assistantMessage: `Understood regarding your ${req.projectType.toLowerCase()}. Which locality in or around Kolkata is the property situated in (e.g., Garia, Salt Lake, New Town, South City)?`,
        extractedRequirements: req,
        suggestedActions: ['Garia', 'Salt Lake', 'New Town', 'South City', 'Ballygunge'],
        leadCaptureRecommended: false,
        isFallbackMode: true,
        provider: 'Deterministic Knowledge Engine'
      };
    }

    if (!req.budget) {
      return {
        assistantMessage: `Got it—${req.locality} is well within our primary consultation area. Do you have an approximate budget range in mind (e.g., ₹3-5 Lakh, ₹6-10 Lakh, or flexible)?`,
        extractedRequirements: req,
        suggestedActions: ['Under ₹3 Lakh', '₹3 - ₹6 Lakh', '₹6 - ₹10 Lakh', 'Flexible to Discuss'],
        leadCaptureRecommended: false,
        isFallbackMode: true,
        provider: 'Deterministic Knowledge Engine'
      };
    }

    // Default wrap-up offering lead capture
    return {
      assistantMessage: `Thank you for sharing those details! We have noted: ${req.propertyType || 'Residential space'} in ${req.locality} for ${req.projectType} with an illustrative target around ${req.budget}.\n\nWould you like our design coordinator to reach out for a personalized consultation?`,
      extractedRequirements: req,
      suggestedActions: ['Yes, Connect with Team', 'Discuss Material Options', 'Ask Another Question'],
      leadCaptureRecommended: true,
      isFallbackMode: true,
      provider: 'Deterministic Knowledge Engine'
    };
  }
}

export const fallbackEngine = new AIFallbackEngine();
