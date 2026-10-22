import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/leadService.js';
import {
  CreateLeadSchema,
  UpdateLeadStatusSchema,
  AddLeadNoteSchema
} from '../validators/leadValidator.js';
import { AuthRequest } from '../middleware/auth.js';

export class LeadController {
  /**
   * Capture a new customer enquiry
   * POST /api/leads
   */
  async captureLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = CreateLeadSchema.parse(req.body);
      const { lead, isDuplicate } = await leadService.createLead(validatedInput);

      res.status(201).json({
        success: true,
        message: isDuplicate
          ? 'Thank you! Your updated enquiry has been recorded.'
          : 'Thank you! Your interior design enquiry has been submitted successfully.',
        lead: {
          leadId: lead.leadId,
          name: lead.name,
          locality: lead.locality,
          projectType: lead.projectType,
          status: lead.status,
          createdAt: lead.createdAt
        },
        isDuplicate
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * List leads with filtering, search, and pagination
   * GET /api/admin/leads
   */
  async listLeads(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, projectType, search, page, limit } = req.query;

      const result = await leadService.getLeads({
        status: status as string,
        projectType: projectType as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 15
      });

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get single lead by ID
   * GET /api/admin/leads/:id
   */
  async getLead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await leadService.getLeadById(id);

      if (!lead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found.'
        });
        return;
      }

      res.json({
        success: true,
        lead
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update lead status
   * PATCH /api/admin/leads/:id
   */
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, statusReason } = UpdateLeadStatusSchema.parse(req.body);

      const author = req.user ? req.user.name : 'Admin';
      const updatedLead = await leadService.updateLeadStatus(id, status, statusReason, author);

      if (!updatedLead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found or could not be updated.'
        });
        return;
      }

      res.json({
        success: true,
        message: `Lead status updated to ${status}.`,
        lead: updatedLead
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Add internal note to lead
   * POST /api/admin/leads/:id/notes
   */
  async addNote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { note } = AddLeadNoteSchema.parse(req.body);

      const author = req.user ? req.user.name : 'Admin';
      const updatedLead = await leadService.addNote(id, note, author);

      if (!updatedLead) {
        res.status(404).json({
          success: false,
          error: 'Lead not found.'
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Internal note added successfully.',
        notes: updatedLead.notes
      });
    } catch (err) {
      next(err);
    }
  }
}

export const leadController = new LeadController();
