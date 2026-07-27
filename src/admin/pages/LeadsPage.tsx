import { useEffect, useState, useCallback } from 'react';
import { Mail, Trash2, Download, Phone, MapPin, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, Badge, SearchInput, PageLoader, Pagination } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchLeads, updateLeadStatus, deleteLead } from '../services/leads';
import { exportToCsv, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, formatDateTime } from '../utils/helpers';
import type { Lead, LeadStatus } from '../types';

const STATUSES: LeadStatus[] = ['new', 'in_progress', 'completed', 'archived'];
const PAGE_SIZE = 10;

export default function LeadsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchLeads();
      // Defensive check: make sure we actually got an array back.
      // If the Supabase client/service layer returns null, an object,
      // or an error payload instead of an array, this prevents a silent crash.
      if (!Array.isArray(data)) {
        console.error('fetchLeads() did not return an array:', data);
        throw new Error('Réponse inattendue du serveur (format invalide)');
      }
      setItems(data);
    } catch (err) {
      // Log the FULL error so we can see what's actually failing
      // (network error, RLS/permission error, parsing error, etc.)
      console.error('LeadsPage load error:', err);
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setLoadError(message);
      toast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id: string, status: LeadStatus) => {
    try {
      await updateLeadStatus(id, status);
      setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      toast('Statut mis à jour');
    } catch (err) {
      console.error('changeStatus error:', err);
      toast('Erreur', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteLead(id);
      toast('Demande supprimée');
      load();
    } catch (err) {
      console.error('remove lead error:', err);
      toast('Erreur', 'error');
    }
  };

  const filtered = items.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    exportToCsv(
      filtered,
      [
        { key: 'name', label: 'Nom' },
        { key: 'phone', label: 'Téléphone' },
        { key: 'email', label: 'Email' },
        { key: 'project_type', label: 'Type' },
        { key: 'message', label: 'Message' },
        { key: 'status', label: 'Statut' },
        { key: 'created_at', label: 'Date' },
      ],
      `demandes-contact-${new Date().toISOString().slice(0, 10)}.csv`
    );
    toast('Export CSV téléchargé');
  };

  return (
    <div>
      <PageHeader
        title="Demandes de contact"
        subtitle="Gérez les demandes de devis reçues via le site."
        action={
          <button onClick={handleExport} className="admin-btn-ghost">
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher par nom, email, téléphone..." />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as LeadStatus | 'all');
            setPage(1);
          }}
          className="admin-input max-w-[200px]"
        >
          <option value="all">Tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <PageLoader />
      ) : loadError ? (
        <Card>
          <EmptyState
            icon={Mail}
            title="Erreur de chargement"
            description={`Impossible de charger les demandes : ${loadError}. Vérifiez la console pour plus de détails.`}
          />
          <div className="flex justify-center mt-4">
            <button onClick={load} className="admin-btn-ghost">
              Réessayer
            </button>
          </div>
        </Card>
      ) : paginated.length === 0 ? (
        <Card>
          <EmptyState
            icon={Mail}
            title="Aucune demande"
            description="Les demandes de devis reçues via le formulaire de contact apparaîtront ici."
          />
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="admin-table-th">Nom</th>
                    <th className="admin-table-th hidden md:table-cell">Téléphone</th>
                    <th className="admin-table-th hidden lg:table-cell">Type</th>
                    <th className="admin-table-th hidden sm:table-cell">Date</th>
                    <th className="admin-table-th">Statut</th>
                    <th className="admin-table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {paginated.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition cursor-pointer"
                      onClick={() => setViewLead(lead)}
                    >
                      <td className="admin-table-td">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.email ?? '—'}</p>
                        </div>
                      </td>
                      <td className="admin-table-td hidden md:table-cell">{lead.phone}</td>
                      <td className="admin-table-td hidden lg:table-cell">{lead.project_type ?? '—'}</td>
                      <td className="admin-table-td hidden sm:table-cell text-slate-500">
                        {formatDateTime(lead.created_at || lead.createdAt || new Date().toISOString())}
                      </td>
                      <td className="admin-table-td">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => changeStatus(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${LEAD_STATUS_COLORS[lead.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="admin-table-td text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(lead.id);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* View modal */}
      <Modal open={!!viewLead} onClose={() => setViewLead(null)} title="Détails de la demande" size="md">
        {viewLead && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {viewLead.name}
              </h3>
              <Badge className={LEAD_STATUS_COLORS[viewLead.status]}>
                {LEAD_STATUS_LABELS[viewLead.status]}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={`tel:${viewLead.phone}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                <Phone size={16} className="text-slate-400" /> {viewLead.phone}
              </a>
              {viewLead.email && (
                <a href={`mailto:${viewLead.email}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                  <Mail size={16} className="text-slate-400" /> {viewLead.email}
                </a>
              )}
              {viewLead.project_type && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="text-slate-400" /> {viewLead.project_type}
                </div>
              )}
              {viewLead.location && (
                <a href={`https://www.google.com/maps?q=${encodeURIComponent(viewLead.location)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  <MapPin size={16} /> GPS / Locus: {viewLead.location.length > 20 ? viewLead.location.substring(0, 20) + '...' : viewLead.location}
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Clock size={16} className="text-slate-400" /> {formatDateTime(viewLead.created_at || viewLead.createdAt || new Date().toISOString())}
              </div>
            </div>
            {viewLead.message && (
              <div>
                <p className="admin-label">Message</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  {viewLead.message}
                </p>
              </div>
            )}
            {viewLead.source_page && (
              <p className="text-xs text-slate-400">Source: {viewLead.source_page}</p>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Supprimer la demande"
        message="Cette demande sera définitivement supprimée."
      />
    </div>
  );
}