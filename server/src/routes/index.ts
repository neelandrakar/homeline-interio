import { Router } from 'express';
import { contentController } from '../controllers/contentController.js';
import { leadController } from '../controllers/leadController.js';
import { aiController } from '../controllers/aiController.js';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  leadSubmissionLimiter,
  aiChatLimiter,
  adminAuthLimiter
} from '../middleware/rateLimiter.js';

const router = Router();

// Public Content & Health
router.get('/health', contentController.getHealth);
router.get('/projects', contentController.getProjects);
router.get('/projects/:slug', contentController.getProjectBySlug);
router.get('/services', contentController.getServices);

// Lead Capture (Rate limited)
router.post('/leads', leadSubmissionLimiter, leadController.captureLead);

// AI Interior Design Consultant (Rate limited)
router.post('/ai/chat', aiChatLimiter, aiController.chat);

// Admin Authentication
router.post('/admin/login', adminAuthLimiter, adminController.login);
router.post('/admin/logout', adminController.logout);
router.get('/admin/me', authMiddleware, adminController.me);

// Protected Admin Lead Management
router.get('/admin/leads', authMiddleware, leadController.listLeads);
router.get('/admin/leads/:id', authMiddleware, leadController.getLead);
router.patch('/admin/leads/:id', authMiddleware, leadController.updateStatus);
router.post('/admin/leads/:id/notes', authMiddleware, leadController.addNote);

export default router;
