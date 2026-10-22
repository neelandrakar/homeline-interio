import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().trim().min(1).max(2000)
});

export const AIChatRequestSchema = z.object({
  conversationId: z.string().trim().min(1).default(() => `conv-${Date.now()}`),
  messages: z.array(ChatMessageSchema).min(1, 'At least one message is required'),
  currentProject: z.string().trim().optional(),
  existingRequirements: z.object({
    propertyType: z.string().optional(),
    projectType: z.string().optional(),
    locality: z.string().optional(),
    budget: z.string().optional(),
    style: z.string().optional(),
    scopeOrDimensions: z.string().optional()
  }).optional()
});

export type AIChatRequest = z.infer<typeof AIChatRequestSchema>;
