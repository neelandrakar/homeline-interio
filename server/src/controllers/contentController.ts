import { Request, Response } from 'express';
import { PROJECTS } from '../data/projectsData.js';
import { BUSINESS_CONFIG } from '../config/business.js';
import { isDbConnected } from '../config/db.js';
import { env } from '../config/env.js';

export class ContentController {
  /**
   * Health check endpoint
   * GET /api/health
   */
  getHealth(req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Homeline Interio API',
      database: isDbConnected() ? 'connected (MongoDB)' : 'memory_fallback (Dev/Demo Mode)',
      aiProvider: env.AI_PROVIDER,
      version: '1.0.0'
    });
  }

  /**
   * Get project concepts with optional category filter
   * GET /api/projects
   */
  getProjects(req: Request, res: Response): void {
    const { category, featured } = req.query;
    let list = [...PROJECTS];

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (featured === 'true') {
      list = list.filter(p => p.featured);
    }

    res.json({
      success: true,
      count: list.length,
      projects: list
    });
  }

  /**
   * Get single project concept by slug
   * GET /api/projects/:slug
   */
  getProjectBySlug(req: Request, res: Response): void {
    const { slug } = req.params;
    const project = PROJECTS.find(p => p.slug === slug);

    if (!project) {
      res.status(404).json({
        success: false,
        error: `Project concept with slug "${slug}" not found.`
      });
      return;
    }

    // Include full data for related projects
    const relatedProjects = PROJECTS.filter(p =>
      project.relatedSlugs.includes(p.slug)
    );

    res.json({
      success: true,
      project: {
        ...project,
        relatedProjects
      }
    });
  }

  /**
   * Get services list and metadata
   * GET /api/services
   */
  getServices(req: Request, res: Response): void {
    res.json({
      success: true,
      services: BUSINESS_CONFIG.services,
      steps: BUSINESS_CONFIG.consultationSteps
    });
  }
}

export const contentController = new ContentController();
