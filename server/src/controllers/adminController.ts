import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../config/env.js';
import { AdminModel } from '../models/Admin.js';
import { isDbConnected } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

const LoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid administrator email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

export class AdminController {
  /**
   * Ensure initial bootstrap administrator exists
   */
  async bootstrapAdmin(): Promise<void> {
    try {
      const email = env.ADMIN_EMAIL.toLowerCase();
      if (isDbConnected()) {
        const existing = await AdminModel.findOne({ email });
        if (!existing) {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, salt);
          await AdminModel.create({
            email,
            passwordHash,
            name: env.ADMIN_NAME,
            role: 'admin'
          });
          console.info(`[ADMIN] Provisioned default administrator: ${email}`);
        }
      }
    } catch (err: any) {
      console.warn(`[ADMIN] Bootstrap check: ${err.message}`);
    }
  }

  /**
   * Admin login
   * POST /api/admin/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const normalizedEmail = email.toLowerCase().trim();

      let adminUser: { id: string; email: string; name: string; role: string } | null = null;

      if (isDbConnected()) {
        const adminDoc = await AdminModel.findOne({ email: normalizedEmail });
        if (adminDoc) {
          const isMatch = await adminDoc.comparePassword(password);
          if (isMatch) {
            adminDoc.lastLoginAt = new Date();
            await adminDoc.save();
            adminUser = {
              id: adminDoc._id.toString(),
              email: adminDoc.email,
              name: adminDoc.name,
              role: adminDoc.role
            };
          }
        }
      }

      // If not found in DB or DB not connected, check against bootstrap environment credentials
      if (!adminUser && normalizedEmail === env.ADMIN_EMAIL.toLowerCase().trim()) {
        // Compare password directly or via bcrypt
        if (password === env.ADMIN_PASSWORD) {
          adminUser = {
            id: 'bootstrap-admin-01',
            email: env.ADMIN_EMAIL,
            name: env.ADMIN_NAME,
            role: 'admin'
          };
        }
      }

      if (!adminUser) {
        res.status(401).json({
          success: false,
          error: 'Invalid administrator email or password.'
        });
        return;
      }

      const token = jwt.sign(
        {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return token in response body and set cookie
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Administrator authentication successful.',
        token,
        user: adminUser
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin logout
   * POST /api/admin/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('admin_token');
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  }

  /**
   * Get current authenticated admin
   * GET /api/admin/me
   */
  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      user: req.user
    });
  }
}

export const adminController = new AdminController();
