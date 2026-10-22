import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadNote {
  id: string;
  text: string;
  createdAt: Date;
  author: string;
}

export interface ILead extends Document {
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
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadNoteSchema = new Schema<ILeadNote>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  author: { type: String, default: 'Admin' }
}, { _id: false });

const LeadSchema = new Schema<ILead>({
  leadId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  phoneDisplay: { type: String, required: true },
  phoneDigits: { type: String, required: true, index: true },
  email: { type: String, trim: true, default: '' },
  projectType: { type: String, required: true, index: true },
  locality: { type: String, required: true, index: true },
  budgetRange: { type: String, default: 'Flexible / To Discuss' },
  description: { type: String, default: '' },
  preferredContactMethod: { 
    type: String, 
    enum: ['Phone', 'WhatsApp', 'Email'], 
    default: 'WhatsApp' 
  },
  source: { type: String, default: 'homepage', index: true },
  conversationSummary: { type: String, default: '' },
  consentGiven: { type: Boolean, required: true },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Consultation Scheduled', 'Won', 'Lost'], 
    default: 'New',
    index: true 
  },
  notes: [LeadNoteSchema]
}, {
  timestamps: true
});

// Compound index for efficient sorting and filtering
LeadSchema.index({ status: 1, createdAt: -1 });
LeadSchema.index({ phoneDigits: 1, createdAt: -1 });

export const LeadModel = mongoose.model<ILead>('Lead', LeadSchema);
