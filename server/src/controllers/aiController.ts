import { Request, Response, NextFunction } from 'express';
import { AIChatRequestSchema } from '../validators/aiValidator.js';
import { aiService } from '../services/ai/aiAdapter.js';

export class AIController {
  /**
   * Handle AI interior design consultant messages
   * POST /api/ai/chat
   */
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conversationId, messages, currentProject, existingRequirements } =
        AIChatRequestSchema.parse(req.body);

      const result = await aiService.chat(
        messages,
        currentProject,
        existingRequirements
      );

      res.json({
        success: true,
        conversationId,
        assistantMessage: result.assistantMessage,
        extractedRequirements: result.extractedRequirements,
        suggestedActions: result.suggestedActions,
        leadCaptureRecommended: result.leadCaptureRecommended,
        isFallbackMode: result.isFallbackMode,
        provider: result.provider
      });
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AIController();
