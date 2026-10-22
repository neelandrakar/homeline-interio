import {
  ProjectConcept,
  ServiceCategory,
  LeadFormData,
  AIChatResponse,
  ExtractedRequirements
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('homeline_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // --- Content Endpoints ---

  async getProjects(category?: string): Promise<ProjectConcept[]> {
    try {
      const url = category && category !== 'All'
        ? `${API_BASE}/projects?category=${encodeURIComponent(category)}`
        : `${API_BASE}/projects`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      return data.projects || [];
    } catch (err) {
      console.warn('[API] Could not fetch projects from server. Using local dataset.');
      return [];
    }
  }

  async getProjectBySlug(slug: string): Promise<ProjectConcept | null> {
    try {
      const res = await fetch(`${API_BASE}/projects/${slug}`);
      if (!res.ok) throw new Error('Project not found');
      const data = await res.json();
      return data.project || null;
    } catch (err) {
      console.warn(`[API] Could not fetch project slug ${slug} from server.`);
      return null;
    }
  }

  async getServices(): Promise<ServiceCategory[]> {
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error('Failed to load services');
      const data = await res.json();
      return data.services || [];
    } catch (err) {
      console.warn('[API] Could not fetch services from server. Using local dataset.');
      return [];
    }
  }

  // --- Lead Submission ---

  async submitLead(formData: LeadFormData): Promise<{ success: boolean; leadId: string; message: string }> {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || 'Failed to submit enquiry. Please check your information and try again.');
    }

    return {
      success: true,
      leadId: data.lead?.leadId || 'HL-PENDING',
      message: data.message
    };
  }

  // --- AI Chat ---

  async chatWithAI(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    conversationId?: string,
    currentProject?: string,
    existingRequirements?: Partial<ExtractedRequirements>
  ): Promise<AIChatResponse> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: conversationId || `conv-${Date.now()}`,
        messages,
        currentProject,
        existingRequirements
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to converse with design assistant.');
    }

    return data;
  }

  // --- Admin Authentication & Dashboard ---

  async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid administrator login credentials.');
    }

    localStorage.setItem('homeline_admin_token', data.token);
    localStorage.setItem('homeline_admin_user', JSON.stringify(data.user));
    return data;
  }

  adminLogout(): void {
    localStorage.removeItem('homeline_admin_token');
    localStorage.removeItem('homeline_admin_user');
    fetch(`${API_BASE}/admin/logout`, { method: 'POST' }).catch(() => {});
  }

  getSavedAdminUser(): any | null {
    const userStr = localStorage.getItem('homeline_admin_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  isAdminAuthenticated(): boolean {
    return Boolean(localStorage.getItem('homeline_admin_token'));
  }

  async getAdminLeads(params: {
    status?: string;
    projectType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.projectType && params.projectType !== 'All') query.append('projectType', params.projectType);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/admin/leads?${query.toString()}`, {
      headers: {
        ...this.getAuthHeader()
      }
    });

    if (res.status === 401) {
      this.adminLogout();
      throw new Error('Unauthorized. Please log in again.');
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch leads');
    }

    return data;
  }

  async updateLeadStatus(id: string, status: string, statusReason?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({ status, statusReason })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to update lead status');
    }
    return data;
  }

  async addLeadNote(id: string, note: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/leads/${id}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({ note })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to add note');
    }
    return data;
  }
}

export const api = new ApiService();
