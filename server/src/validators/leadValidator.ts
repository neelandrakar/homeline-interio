import { z } from 'zod';
import { normalizeIndianPhoneNumber } from '../utils/phoneNormalizer.js';

export const LeadStatusEnum = z.enum([
  'New',
  'Contacted',
  'Qualified',
  'Consultation Scheduled',
  'Won',
  'Lost'
]);

export const ProjectTypeEnum = z.enum([
  'Full Home Interiors',
  'Modular Kitchens',
  'Living Room Design',
  'Bedroom Interiors',
  'Space Planning',
  'Renovation Consultation',
  'Other / Custom'
]);

export const ContactMethodEnum = z.enum([
  'Phone',
  'WhatsApp',
  'Email'
]);

export const LeadSourceEnum = z.enum([
  'homepage',
  'services_page',
  'projects_page',
  'project_detail',
  'ai_assistant',
  'contact_page'
]);

export const CreateLeadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  phone: z.string()
    .trim()
    .refine((val) => normalizeIndianPhoneNumber(val).isValid, {
      message: 'Please provide a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 98765 43210).'
    }),
  email: z.string()
    .trim()
    .email('Please enter a valid email address')
    .max(120)
    .optional()
    .or(z.literal('')),
  projectType: ProjectTypeEnum,
  locality: z.string()
    .trim()
    .min(2, 'Locality is required (e.g., Garia, Salt Lake, New Town)')
    .max(100),
  budgetRange: z.string()
    .trim()
    .max(80)
    .optional()
    .default('Flexible / To Discuss'),
  description: z.string()
    .trim()
    .max(2000, 'Project description must be under 2000 characters')
    .optional()
    .default(''),
  preferredContactMethod: ContactMethodEnum.default('WhatsApp'),
  source: LeadSourceEnum.default('homepage'),
  conversationSummary: z.string()
    .trim()
    .max(5000)
    .optional(),
  consentGiven: z.boolean().refine(val => val === true, {
    message: 'Explicit consent is required to contact you regarding your interior design enquiry.'
  })
});

export const UpdateLeadStatusSchema = z.object({
  status: LeadStatusEnum,
  statusReason: z.string().trim().max(500).optional()
});

export const AddLeadNoteSchema = z.object({
  note: z.string().trim().min(2, 'Note cannot be empty').max(1500, 'Note is too long')
});

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof UpdateLeadStatusSchema>;
export type AddLeadNoteInput = z.infer<typeof AddLeadNoteSchema>;
