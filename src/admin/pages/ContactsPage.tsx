import { useMemo, useState } from 'react';
import {
  Inbox,
  Download,
  Eye,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Field, Select } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import {
  DataTable,
  TableRow,
  TableCell,
} from '../components/ui/DataTable';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useCollection } from '../hooks/useCollection';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { useToast } from '../hooks/useToast';
import { contactsService } from '../services/entities';
import { exportToCsv } from '../utils/csv';
import { formatDate, formatDateTime, truncate } from '../utils/format';
import type { ContactRequest, ContactStatus } from '../types';

const STATUS_META: Record<
  ContactStatus,
  { label: string; tone: 'blue' | 'amber' | 'green' | 'gray' }
> = {
  new: { label: 'Nouveau', tone: 'blue' },
  in_progress: { label: 'En cours', tone: 'amber' },
  completed: { label: 'Terminé', tone: 'green' },
  archived: { label: 'Archivé', tone: 'gray' },
};

const STATUS_OPTIONS: ContactStatus[] = [
  'new',
  'in_progress',
  'completed',
  'archived',
];

const FILTERS: { value: ContactStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'new', label: STATUS_META.new.label },
  { value: 'in_progress', label: STATUS_META.in_progress.label },
  { value: 'completed', label: STATUS_META.completed.label },
  { value: 'archived', label: STATUS_META.archived.label },
];

export default function ContactsPage() {
  const { items, loading, update, remove } = useCollection(contactsService, {
    entity: 'Demande',
  });
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const debounced = useDebounce(search, 250);

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      const q = debounced.trim().toLowerCase();
      if (!q) return true;
      return `${c.name} ${c.email} ${c.phone} ${c.message}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, statusFilter, debounced]);

  const pag = usePagination(filtered, 10);

  const [selected, setSelected] = useState<ContactRequest | null>(null);
  const [detailStatus, setDetailStatus] = useState<ContactStatus>('new');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [confirm, setConfirm] = useState<ContactRequest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openDetail = (c: ContactRequest) => {
    setSelected(c);
    setDetailStatus(c.status);
  };

  const handleDetailStatus = async (status: ContactStatus) => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      const updated = await update(selected.id, { status });
      setDetailStatus(status);
      setSelected(updated);
    } catch (err) {
      toastError('Échec de la mise à jour', (err as Error).message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRowStatus = async (c: ContactRequest, status: ContactStatus) => {
    try {
      await update(c.id, { status });
    } catch (err) {
      toastError('Échec de la mise à jour', (err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await remove(confirm.id);
      if (selected?.id === confirm.id) setSelected(null);
      setConfirm(null);
    } catch (err) {
      toastError('Échec de la suppression', (err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  const exportCsv = () => {
    const rows = filtered.map((c) => ({
      Nom: c.name,
      Email: c.email,
      Téléphone: c.phone,
      Message: c.message,
      Projet: c.projectType ?? '',
      Statut: STATUS_META[c.status].label,
      Date: formatDate(c.createdAt ?? c.created_at ?? ''),
    }));
    exportToCsv('demandes-contact.csv', rows);
    success(
      'Export CSV',
      `${rows.length} demande${rows.length > 1 ? 's' : ''} exportée${rows.length > 1 ? 's' : ''
      }.`
    );
  };

  return (
    <div className="space-y-6 animate-admin-in">
      <PageHeader
        title="Demandes de contact"
        description="Gérez les demandes clients (CRM)"
        actions={
          <Button
            variant="outline"
            onClick={exportCsv}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Exporter CSV
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-4 p-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par nom, email, téléphone ou message…"
          />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = statusFilter === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={
                    'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ' +
                    (active
                      ? 'bg-gold-500 text-charcoal-900 shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700')
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="p-5">
            <SkeletonTable rows={6} />
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucune demande"
          description="Aucune demande de contact ne correspond à votre recherche."
        />
      ) : (
        <>
          <Card>
            <div className="p-0">
              <DataTable
                headers={[
                  'Client',
                  'Coordonnées',
                  'Message',
                  'Date',
                  'Statut',
                  'Actions',
                ]}
              >
                {pag.paginated.map((c) => {
                  const meta = STATUS_META[c.status];
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <p className="font-medium text-stone-900 dark:text-stone-100">
                          {c.name}
                        </p>
                        <p className="truncate text-xs text-stone-400">
                          {c.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="whitespace-nowrap text-stone-600 dark:text-stone-300">
                          {c.phone}
                        </p>
                        {c.projectType && (
                          <Badge
                            tone="purple"
                            className="mt-1"
                          >
                            {c.projectType}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="max-w-xs text-stone-500 dark:text-stone-400">
                          {truncate(c.message ?? '', 60)}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(c.createdAt ?? c.created_at ?? '')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={c.status}
                          onChange={(e) =>
                            handleRowStatus(
                              c,
                              e.target.value as ContactStatus
                            )
                          }
                          className="h-9 py-1.5 text-xs"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge tone={meta.tone} dot>
                            {meta.label}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetail(c)}
                            aria-label="Voir le détail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirm(c)}
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </DataTable>
            </div>
          </Card>

          <Pagination
            page={pag.page}
            totalPages={pag.totalPages}
            total={pag.total}
            pageSize={pag.pageSize}
            onPrev={pag.prev}
            onNext={pag.next}
            canPrev={pag.canPrev}
            canNext={pag.canNext}
          />
        </>
      )}

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Détail de la demande"
        description={`Reçue le ${selected ? formatDateTime(selected.createdAt ?? selected.created_at ?? '') : ''}`}
        size="lg"
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => selected && setConfirm(selected)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Supprimer
            </Button>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Fermer
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600 dark:bg-gold-500/15 dark:text-gold-300">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {selected.name}
                </p>
                <Badge tone={STATUS_META[selected.status].tone} dot>
                  {STATUS_META[selected.status].label}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950/40">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-stone-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="break-all text-sm font-medium text-gold-600 hover:underline dark:text-gold-400"
                  >
                    {selected.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950/40">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-stone-400">
                    Téléphone
                  </p>
                  <a
                    href={`tel:${selected.phone}`}
                    className="break-all text-sm font-medium text-stone-700 dark:text-stone-200"
                  >
                    {selected.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950/40">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Reçue le
                </p>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  {formatDateTime(selected.createdAt ?? selected.created_at ?? '')}
                </p>
              </div>
            </div>

            <Field label="Type de projet">
              <p className="text-sm text-stone-700 dark:text-stone-200">
                {selected.projectType || '—'}
              </p>
            </Field>

            <Field label="Message">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-200">
                {selected.message}
              </div>
            </Field>

            <Field label="Statut">
              <div className="relative">
                <Select
                  value={detailStatus}
                  onChange={(e) =>
                    handleDetailStatus(e.target.value as ContactStatus)
                  }
                  disabled={updatingStatus}
                  className="appearance-none pr-9"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </Select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              </div>
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        title="Supprimer la demande"
        description={`Voulez-vous vraiment supprimer la demande de « ${confirm?.name ?? ''
          } » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleting}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
