import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  RefreshCw,
  LogOut,
  Phone,
  MessageSquare,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { Lead } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    qualifiedCount: 0,
    scheduledCount: 0,
    wonCount: 0,
    lostCount: 0
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Lead for Detail Drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const adminUser = api.getSavedAdminUser();

  useEffect(() => {
    if (!api.isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchLeads();
  }, [page, statusFilter, projectTypeFilter, navigate]);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getAdminLeads({
        status: statusFilter,
        projectType: projectTypeFilter,
        search: searchQuery,
        page,
        limit: 15
      });
      setLeads(data.leads || []);
      setTotalLeads(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.metrics) setMetrics(data.metrics);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to retrieve enquiries.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleLogout = () => {
    api.adminLogout();
    navigate('/admin/login');
  };

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setStatusReason('');
    setNewNoteText('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead || !newStatus || newStatus === selectedLead.status) return;

    setIsUpdatingStatus(true);
    try {
      const res = await api.updateLeadStatus(selectedLead.leadId, newStatus, statusReason);
      setSelectedLead(res.lead);
      // Update local table entry
      setLeads(prev => prev.map(l => l.leadId === res.lead.leadId ? res.lead : l));
      setStatusReason('');
      fetchLeads(); // refresh counts
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await api.addLeadNote(selectedLead.leadId, newNoteText);
      const updated = { ...selectedLead, notes: res.notes };
      setSelectedLead(updated);
      setLeads(prev => prev.map(l => l.leadId === updated.leadId ? updated : l));
      setNewNoteText('');
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Contacted': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Qualified': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Consultation Scheduled': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Won': return 'bg-olive-100 text-olive-900 border-olive-300';
      case 'Lost': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-base-ivory pb-20">
      
      {/* Top Admin Navigation Bar */}
      <div className="bg-charcoal-900 text-white border-b border-charcoal-800 sticky top-0 z-30">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-lg tracking-wider uppercase font-semibold">
              Homeline Interio
            </span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-olive-800 text-olive-200 rounded">
              Lead Management CRM
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="hidden sm:block text-charcoal-300">
              Signed in as <strong className="text-white">{adminUser?.name || 'Administrator'}</strong>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 hover:text-white rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-semibold">
              Customer Enquiries & AI Briefs
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Qualified residential leads captured via website and AI design consultant.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-base-surface text-charcoal-700 border border-base-border text-xs font-semibold rounded-lg shadow-soft transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin text-olive-600' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-base-border shadow-soft">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-500 block">
              Total Enquiries
            </span>
            <div className="text-2xl sm:text-3xl font-serif text-charcoal-900 font-semibold mt-1">
              {metrics.total}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-soft">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 block">
              New Enquiries
            </span>
            <div className="text-2xl sm:text-3xl font-serif text-emerald-800 font-semibold mt-1">
              {metrics.newCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-soft">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-700 block">
              Contacted
            </span>
            <div className="text-2xl sm:text-3xl font-serif text-blue-800 font-semibold mt-1">
              {metrics.contactedCount}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-soft">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 block">
              Qualified / Scheduled
            </span>
            <div className="text-2xl sm:text-3xl font-serif text-amber-800 font-semibold mt-1">
              {metrics.qualifiedCount + metrics.scheduledCount}
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white p-4 rounded-2xl border border-base-border shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or locality..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm bg-base-surfaceLight border border-base-border rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-olive-700 text-white text-xs font-semibold rounded"
            >
              Search
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-base-surfaceLight border border-base-border rounded-lg text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-olive-500"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Consultation Scheduled">Consultation Scheduled</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={projectTypeFilter}
              onChange={e => {
                setProjectTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-base-surfaceLight border border-base-border rounded-lg text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-olive-500"
            >
              <option value="All">All Services</option>
              <option value="Full Home Interiors">Full Home</option>
              <option value="Modular Kitchens">Modular Kitchens</option>
              <option value="Living Room Design">Living Room</option>
              <option value="Bedroom Interiors">Bedroom</option>
              <option value="Space Planning">Space Planning</option>
              <option value="Renovation Consultation">Renovation</option>
            </select>
          </div>

        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-base-border shadow-soft overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-olive-600 mx-auto" />
              <p className="text-xs text-charcoal-500">Loading customer enquiries...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Users className="w-12 h-12 text-charcoal-300 mx-auto" />
              <h3 className="font-serif text-lg text-charcoal-800">No Enquiries Found</h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                No customer leads match your current filter settings. Submit a test enquiry via the website or AI consultant to see it appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-base-surfaceLight text-charcoal-600 font-semibold border-b border-base-border uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Project Type</th>
                    <th className="py-3.5 px-4">Locality</th>
                    <th className="py-3.5 px-4">Budget</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-border">
                  {leads.map((lead) => (
                    <tr
                      key={lead._id || lead.leadId}
                      className="hover:bg-base-surfaceLight/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenLead(lead)}
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-charcoal-900 text-sm">
                          {lead.name}
                        </div>
                        <div className="text-[10px] font-mono text-charcoal-400">
                          {lead.leadId}
                        </div>
                      </td>

                      {/* Phone & Channel */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-charcoal-800">
                          {lead.phoneDisplay || lead.phone}
                        </div>
                        <div className="text-[10px] text-olive-700">
                          Prefers: {lead.preferredContactMethod}
                        </div>
                      </td>

                      {/* Project Type */}
                      <td className="py-3 px-4 text-charcoal-800 font-medium">
                        {lead.projectType}
                      </td>

                      {/* Locality */}
                      <td className="py-3 px-4 text-charcoal-700">
                        {lead.locality}
                      </td>

                      {/* Budget */}
                      <td className="py-3 px-4 text-charcoal-700">
                        {lead.budgetRange || 'Flexible'}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-base-surface text-charcoal-600">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-charcoal-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* View Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLead(lead);
                          }}
                          className="px-2.5 py-1 text-olive-700 hover:text-olive-900 hover:bg-olive-50 rounded text-xs font-semibold inline-flex items-center"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 bg-base-surfaceLight border-t border-base-border flex items-center justify-between text-xs text-charcoal-500">
            <div>
              Showing {leads.length} of {totalLeads} total enquiries
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white border border-base-border rounded disabled:opacity-50 text-charcoal-700"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-white border border-base-border rounded disabled:opacity-50 text-charcoal-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* LEAD DETAIL DRAWER / MODAL */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-base-border animate-fade-in overflow-hidden">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-charcoal-900 text-white flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-olive-300 font-semibold block">
                  Lead Details · {selectedLead.leadId}
                </span>
                <h3 className="font-serif text-lg font-medium text-white mt-0.5">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-charcoal-400 hover:text-white rounded hover:bg-charcoal-800"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-base-ivory">
              
              {/* Quick Contact Action Bar */}
              <div className="p-4 bg-white rounded-xl border border-base-border shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-charcoal-700">
                    Direct Outreach
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* WhatsApp Action */}
                  <a
                    href={`https://wa.me/91${selectedLead.phoneDigits}?text=${encodeURIComponent(
                      `Hello ${selectedLead.name}, this is Homeline Interio regarding your enquiry for ${selectedLead.projectType} in ${selectedLead.locality}. We would be delighted to coordinate your consultation.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </a>

                  {/* Phone Call Action */}
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center justify-center py-2 px-3 bg-olive-700 hover:bg-olive-800 text-white rounded-lg text-xs font-semibold space-x-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Client</span>
                  </a>
                </div>

                <p className="text-[10px] text-charcoal-500 italic">
                  Note: Outreach buttons open your device's dialer or WhatsApp interface; they do not trigger automated dispatch.
                </p>
              </div>

              {/* Core Information Grid */}
              <div className="bg-white p-5 rounded-xl border border-base-border shadow-soft space-y-4 text-xs">
                <h4 className="font-serif text-base text-charcoal-900 font-semibold border-b border-base-border pb-2">
                  Project Brief & Location
                </h4>

                <div className="grid grid-cols-2 gap-3 text-charcoal-700">
                  <div>
                    <span className="text-charcoal-400 block text-[10px] uppercase">Service</span>
                    <strong className="text-charcoal-900">{selectedLead.projectType}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px] uppercase">Locality</span>
                    <strong className="text-charcoal-900">{selectedLead.locality}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px] uppercase">Budget Target</span>
                    <strong className="text-charcoal-900">{selectedLead.budgetRange || 'Flexible'}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-400 block text-[10px] uppercase">Preferred Channel</span>
                    <strong className="text-charcoal-900">{selectedLead.preferredContactMethod}</strong>
                  </div>
                  {selectedLead.email && (
                    <div className="col-span-2">
                      <span className="text-charcoal-400 block text-[10px] uppercase">Email</span>
                      <strong className="text-charcoal-900">{selectedLead.email}</strong>
                    </div>
                  )}
                </div>

                {selectedLead.description && (
                  <div className="pt-2 border-t border-base-border">
                    <span className="text-charcoal-400 block text-[10px] uppercase mb-1">Customer Description</span>
                    <p className="bg-base-surfaceLight p-3 rounded-lg text-charcoal-800 leading-relaxed">
                      {selectedLead.description}
                    </p>
                  </div>
                )}
              </div>

              {/* AI Conversation Summary (if available) */}
              {selectedLead.conversationSummary && (
                <div className="bg-white p-5 rounded-xl border border-olive-200 shadow-soft space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-olive-800 font-semibold">
                    <Sparkles className="w-4 h-4 text-olive-600" />
                    <span>AI Consultant Consultation Summary</span>
                  </div>
                  <div className="bg-olive-50/70 p-3 rounded-lg border border-olive-100 text-charcoal-800 whitespace-pre-line leading-relaxed font-sans">
                    {selectedLead.conversationSummary}
                  </div>
                </div>
              )}

              {/* Status Update Form */}
              <div className="bg-white p-5 rounded-xl border border-base-border shadow-soft space-y-3 text-xs">
                <h4 className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px]">
                  Update Lead Pipeline Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="px-3 py-2 bg-base-surfaceLight border border-base-border rounded-lg text-charcoal-800 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Consultation Scheduled">Consultation Scheduled</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Reason/Note (optional)..."
                    value={statusReason}
                    onChange={e => setStatusReason(e.target.value)}
                    className="px-3 py-2 bg-base-surfaceLight border border-base-border rounded-lg text-charcoal-800 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  disabled={isUpdatingStatus || newStatus === selectedLead.status}
                  onClick={handleUpdateStatus}
                  className="w-full py-2 bg-olive-700 hover:bg-olive-800 disabled:bg-charcoal-300 text-white rounded font-semibold transition-colors"
                >
                  {isUpdatingStatus ? 'Updating Status...' : 'Apply Status Change'}
                </button>
              </div>

              {/* Internal Notes History & Add Note */}
              <div className="bg-white p-5 rounded-xl border border-base-border shadow-soft space-y-4 text-xs">
                <h4 className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Activity & Internal Notes</span>
                  <span className="text-charcoal-400 font-normal">({selectedLead.notes?.length || 0})</span>
                </h4>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                    selectedLead.notes.map((note) => (
                      <div key={note.id} className="p-2.5 bg-base-surfaceLight rounded-lg border border-base-border space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-charcoal-500">
                          <strong className="text-charcoal-700">{note.author || 'Admin'}</strong>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-charcoal-800">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-charcoal-400 italic">No notes recorded yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-base-border">
                  <textarea
                    rows={2}
                    placeholder="Add an internal follow-up note..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="w-full px-3 py-2 bg-base-surfaceLight border border-base-border rounded-lg text-charcoal-800 focus:outline-none text-xs"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="w-full py-2 bg-charcoal-800 hover:bg-charcoal-900 disabled:bg-charcoal-300 text-white rounded font-semibold text-xs flex items-center justify-center space-x-1"
                  >
                    {isAddingNote ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1" />
                        <span>Add Internal Note</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
