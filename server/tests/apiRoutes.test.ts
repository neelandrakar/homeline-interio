import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { env } from '../src/config/env.js';

describe('Homeline Interio API Routes', () => {
  let adminToken = '';
  let createdLeadId = '';

  it('GET /api/health returns 200 and server status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Homeline Interio');
  });

  it('GET /api/projects returns project concepts list', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.projects.length).toBeGreaterThanOrEqual(8);
  });

  it('GET /api/services returns interior design services', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.services.length).toBeGreaterThanOrEqual(6);
  });

  it('POST /api/leads captures customer enquiry with validation', async () => {
    const payload = {
      name: 'Ananya Mukherjee',
      phone: '+91 98305 67890',
      email: 'ananya@example.com',
      projectType: 'Modular Kitchens',
      locality: 'Salt Lake Sector 1',
      budgetRange: '₹3 - ₹6 Lakh',
      description: 'Interested in acrylic finish parallel kitchen layout.',
      preferredContactMethod: 'WhatsApp',
      source: 'services_page',
      consentGiven: true
    };

    const res = await request(app).post('/api/leads').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.lead).toBeDefined();
    expect(res.body.lead.leadId).toBeDefined();
    expect(res.body.lead.name).toBe('Ananya Mukherjee');
    createdLeadId = res.body.lead.leadId;
  });

  it('POST /api/leads handles rapid duplicate gracefully', async () => {
    const payload = {
      name: 'Ananya Mukherjee',
      phone: '9830567890',
      projectType: 'Modular Kitchens',
      locality: 'Salt Lake Sector 1',
      description: 'Second duplicate click check.',
      preferredContactMethod: 'WhatsApp',
      consentGiven: true
    };

    const res = await request(app).post('/api/leads').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.isDuplicate).toBe(true);
  });

  it('POST /api/leads fails when phone number is invalid', async () => {
    const payload = {
      name: 'Invalid User',
      phone: '1234567890', // Invalid leading digit
      projectType: 'Living Room Design',
      locality: 'Ballygunge',
      consentGiven: true
    };

    const res = await request(app).post('/api/leads').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/ai/chat returns grounded AI consultation reply', async () => {
    const chatPayload = {
      conversationId: 'test-conv-001',
      messages: [
        { role: 'user', content: 'We bought a flat in New Town and need modular kitchen ideas within ₹4 lakh.' }
      ]
    };

    const res = await request(app).post('/api/ai/chat').send(chatPayload);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assistantMessage).toBeDefined();
    expect(res.body.extractedRequirements.locality).toBe('New Town / Rajarhat');
    expect(res.body.extractedRequirements.projectType).toBe('Modular Kitchens');
  });

  describe('Admin Authentication & Lead Management', () => {
    it('POST /api/admin/login rejects incorrect password', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: env.ADMIN_EMAIL,
        password: 'wrongpassword'
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/admin/login succeeds with valid credentials and issues JWT', async () => {
      const res = await request(app).post('/api/admin/login').send({
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      adminToken = res.body.token;
    });

    it('GET /api/admin/leads requires authorization', async () => {
      const res = await request(app).get('/api/admin/leads');
      expect(res.status).toBe(401);
    });

    it('GET /api/admin/leads succeeds when authenticated', async () => {
      const res = await request(app)
        .get('/api/admin/leads')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.leads).toBeDefined();
      expect(res.body.metrics).toBeDefined();
    });

    it('PATCH /api/admin/leads/:id updates status', async () => {
      if (!createdLeadId) return;

      const res = await request(app)
        .patch(`/api/admin/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Contacted',
          statusReason: 'Connected via WhatsApp with client.'
        });

      expect(res.status).toBe(200);
      expect(res.body.lead.status).toBe('Contacted');
    });

    it('POST /api/admin/leads/:id/notes appends an internal note', async () => {
      if (!createdLeadId) return;

      const res = await request(app)
        .post(`/api/admin/leads/${createdLeadId}/notes`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          note: 'Client confirmed floor plan will be shared on Saturday.'
        });

      expect(res.status).toBe(201);
      expect(res.body.notes.length).toBeGreaterThan(0);
    });
  });
});
