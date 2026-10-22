import { LeadModel, ILead, ILeadNote } from '../models/Lead.js';
import { CreateLeadInput } from '../validators/leadValidator.js';
import { normalizeIndianPhoneNumber } from '../utils/phoneNormalizer.js';
import { isDbConnected } from '../config/db.js';

// In-Memory fallback store for dev/demo when MongoDB is not connected
const inMemoryLeads: Map<string, any> = new Map();

function generateLeadId(): string {
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HL-${timestamp}-${randomPart}`;
}

export interface LeadFilter {
  status?: string;
  projectType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLeads {
  leads: any[];
  total: number;
  page: number;
  totalPages: number;
  metrics: {
    total: number;
    newCount: number;
    contactedCount: number;
    qualifiedCount: number;
    scheduledCount: number;
    wonCount: number;
    lostCount: number;
  };
}

export class LeadService {
  /**
   * Create a new lead or handle rapid duplicate submission
   */
  async createLead(input: CreateLeadInput): Promise<{ lead: any; isDuplicate: boolean }> {
    const phoneInfo = normalizeIndianPhoneNumber(input.phone);
    if (!phoneInfo.isValid) {
      throw new Error(phoneInfo.error || 'Invalid Indian phone number.');
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Duplicate check policy:
    // If identical phone and projectType submitted within 5 mins, update existing lead note
    if (isDbConnected()) {
      const existing = await LeadModel.findOne({
        phoneDigits: phoneInfo.digits,
        projectType: input.projectType,
        createdAt: { $gte: fiveMinutesAgo }
      });

      if (existing) {
        existing.notes.push({
          id: `note-${Date.now()}`,
          text: `Duplicate enquiry received within 5 mins. Description: "${input.description || 'N/A'}"`,
          createdAt: new Date(),
          author: 'System'
        });
        if (input.conversationSummary && !existing.conversationSummary) {
          existing.conversationSummary = input.conversationSummary;
        }
        await existing.save();
        return { lead: existing.toObject(), isDuplicate: true };
      }

      const leadId = generateLeadId();
      const newLead = await LeadModel.create({
        leadId,
        name: input.name,
        phone: phoneInfo.formattedE164,
        phoneDisplay: phoneInfo.formattedDisplay,
        phoneDigits: phoneInfo.digits,
        email: input.email || '',
        projectType: input.projectType,
        locality: input.locality,
        budgetRange: input.budgetRange || 'Flexible / To Discuss',
        description: input.description || '',
        preferredContactMethod: input.preferredContactMethod || 'WhatsApp',
        source: input.source || 'homepage',
        conversationSummary: input.conversationSummary || '',
        consentGiven: true,
        status: 'New',
        notes: [
          {
            id: `note-${Date.now()}`,
            text: `Enquiry received from ${input.source || 'website'} (Locality: ${input.locality}).`,
            createdAt: new Date(),
            author: 'System'
          }
        ]
      });

      return { lead: newLead.toObject(), isDuplicate: false };
    } else {
      // Memory store fallback
      for (const [id, item] of inMemoryLeads.entries()) {
        if (
          item.phoneDigits === phoneInfo.digits &&
          item.projectType === input.projectType &&
          new Date(item.createdAt) >= fiveMinutesAgo
        ) {
          item.notes.push({
            id: `note-${Date.now()}`,
            text: `Duplicate enquiry received within 5 mins. Description: "${input.description || 'N/A'}"`,
            createdAt: new Date(),
            author: 'System'
          });
          inMemoryLeads.set(id, item);
          return { lead: item, isDuplicate: true };
        }
      }

      const leadId = generateLeadId();
      const leadRecord = {
        _id: leadId,
        leadId,
        name: input.name,
        phone: phoneInfo.formattedE164,
        phoneDisplay: phoneInfo.formattedDisplay,
        phoneDigits: phoneInfo.digits,
        email: input.email || '',
        projectType: input.projectType,
        locality: input.locality,
        budgetRange: input.budgetRange || 'Flexible / To Discuss',
        description: input.description || '',
        preferredContactMethod: input.preferredContactMethod || 'WhatsApp',
        source: input.source || 'homepage',
        conversationSummary: input.conversationSummary || '',
        consentGiven: true,
        status: 'New',
        notes: [
          {
            id: `note-${Date.now()}`,
            text: `Enquiry received from ${input.source || 'website'} (Locality: ${input.locality}).`,
            createdAt: new Date(),
            author: 'System'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryLeads.set(leadId, leadRecord);
      return { lead: leadRecord, isDuplicate: false };
    }
  }

  /**
   * Retrieve paginated leads with filtering, search, and dashboard metrics
   */
  async getLeads(filter: LeadFilter): Promise<PaginatedLeads> {
    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, Math.min(50, filter.limit || 15));
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const query: any = {};
      if (filter.status && filter.status !== 'All') {
        query.status = filter.status;
      }
      if (filter.projectType && filter.projectType !== 'All') {
        query.projectType = filter.projectType;
      }
      if (filter.search) {
        const searchRegex = new RegExp(filter.search.trim(), 'i');
        query.$or = [
          { name: searchRegex },
          { phoneDigits: searchRegex },
          { locality: searchRegex },
          { leadId: searchRegex }
        ];
      }

      const [leads, total, allMetrics] = await Promise.all([
        LeadModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        LeadModel.countDocuments(query),
        LeadModel.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const metricsMap: Record<string, number> = {};
      let totalAll = 0;
      allMetrics.forEach((m: { _id: string; count: number }) => {
        metricsMap[m._id] = m.count;
        totalAll += m.count;
      });

      return {
        leads,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        metrics: {
          total: totalAll,
          newCount: metricsMap['New'] || 0,
          contactedCount: metricsMap['Contacted'] || 0,
          qualifiedCount: metricsMap['Qualified'] || 0,
          scheduledCount: metricsMap['Consultation Scheduled'] || 0,
          wonCount: metricsMap['Won'] || 0,
          lostCount: metricsMap['Lost'] || 0,
        }
      };
    } else {
      // Filter memory store
      let list = Array.from(inMemoryLeads.values());

      // Calculate total metrics across all
      const metrics = {
        total: list.length,
        newCount: list.filter(l => l.status === 'New').length,
        contactedCount: list.filter(l => l.status === 'Contacted').length,
        qualifiedCount: list.filter(l => l.status === 'Qualified').length,
        scheduledCount: list.filter(l => l.status === 'Consultation Scheduled').length,
        wonCount: list.filter(l => l.status === 'Won').length,
        lostCount: list.filter(l => l.status === 'Lost').length,
      };

      if (filter.status && filter.status !== 'All') {
        list = list.filter(l => l.status === filter.status);
      }
      if (filter.projectType && filter.projectType !== 'All') {
        list = list.filter(l => l.projectType === filter.projectType);
      }
      if (filter.search) {
        const s = filter.search.toLowerCase().trim();
        list = list.filter(l =>
          l.name.toLowerCase().includes(s) ||
          l.phoneDigits.includes(s) ||
          l.locality.toLowerCase().includes(s) ||
          l.leadId.toLowerCase().includes(s)
        );
      }

      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = list.length;
      const paginated = list.slice(skip, skip + limit);

      return {
        leads: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        metrics
      };
    }
  }

  /**
   * Get single lead by ID
   */
  async getLeadById(id: string): Promise<any | null> {
    if (isDbConnected()) {
      return LeadModel.findOne({ $or: [{ _id: id }, { leadId: id }] }).lean();
    } else {
      return (
        inMemoryLeads.get(id) ||
        Array.from(inMemoryLeads.values()).find(l => l.leadId === id || l._id === id) ||
        null
      );
    }
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(id: string, status: string, reason?: string, author = 'Admin'): Promise<any | null> {
    if (isDbConnected()) {
      const lead = await LeadModel.findOne({ $or: [{ _id: id }, { leadId: id }] });
      if (!lead) return null;

      const oldStatus = lead.status;
      lead.status = status as any;
      lead.notes.push({
        id: `note-${Date.now()}`,
        text: `Status changed from "${oldStatus}" to "${status}"${reason ? `: ${reason}` : '.'}`,
        createdAt: new Date(),
        author
      });
      await lead.save();
      return lead.toObject();
    } else {
      const lead = await this.getLeadById(id);
      if (!lead) return null;

      const oldStatus = lead.status;
      lead.status = status;
      lead.updatedAt = new Date();
      lead.notes.push({
        id: `note-${Date.now()}`,
        text: `Status changed from "${oldStatus}" to "${status}"${reason ? `: ${reason}` : '.'}`,
        createdAt: new Date(),
        author
      });
      inMemoryLeads.set(lead.leadId, lead);
      return lead;
    }
  }

  /**
   * Add internal note to a lead
   */
  async addNote(id: string, text: string, author = 'Admin'): Promise<any | null> {
    const newNote: ILeadNote = {
      id: `note-${Date.now()}`,
      text,
      createdAt: new Date(),
      author
    };

    if (isDbConnected()) {
      const lead = await LeadModel.findOne({ $or: [{ _id: id }, { leadId: id }] });
      if (!lead) return null;

      lead.notes.push(newNote);
      await lead.save();
      return lead.toObject();
    } else {
      const lead = await this.getLeadById(id);
      if (!lead) return null;

      lead.notes.push(newNote);
      lead.updatedAt = new Date();
      inMemoryLeads.set(lead.leadId, lead);
      return lead;
    }
  }
}

export const leadService = new LeadService();
