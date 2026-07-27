import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, Badge, SearchInput, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from '../services/services';
import type { Service, ServiceInput } from '../types';

const ICON_OPTIONS = ['Paintbrush', 'Layers', 'Sparkles', 'Brush', 'Hammer', 'Home', 'Palette'];

const empty: ServiceInput = {
  title: '',
  description: '',
  icon: 'Paintbrush',
  image: '',
  sort_order: 0,
  status: 'active',
};

export default function ServicesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceInput>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchServices());
    } catch {
      toast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon,
      image: s.image ?? '',
      sort_order: s.sort_order,
      status: s.status,
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast('Le titre est requis', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing.id, form);
        toast('Service mis à jour');
      } else {
        await createService(form);
        toast('Service créé');
      }
      setModalOpen(false);
      load();
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteService(id);
      toast('Service supprimé');
      load();
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = items.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Gérez les prestations affichées sur le site."
        action={
          <button onClick={openCreate} className="admin-btn-primary">
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un service..." />
      </div>

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Briefcase}
            title="Aucun service"
            description="Ajoutez votre premier service pour le voir apparaître sur le site."
            action={
              <button onClick={openCreate} className="admin-btn-primary">
                <Plus size={16} /> Ajouter un service
              </button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="admin-table-th">Ordre</th>
                <th className="admin-table-th">Titre</th>
                <th className="admin-table-th hidden md:table-cell">Description</th>
                <th className="admin-table-th hidden sm:table-cell">Icône</th>
                <th className="admin-table-th">Statut</th>
                <th className="admin-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="admin-table-td font-medium">{s.sort_order}</td>
                  <td className="admin-table-td font-medium text-slate-800 dark:text-slate-100">
                    {s.title}
                  </td>
                  <td className="admin-table-td hidden md:table-cell max-w-xs truncate text-slate-500">
                    {s.description}
                  </td>
                  <td className="admin-table-td hidden sm:table-cell">
                    <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {s.icon}
                    </code>
                  </td>
                  <td className="admin-table-td">
                    <Badge
                      className={
                        s.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }
                    >
                      {s.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="admin-table-td text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le service' : 'Nouveau service'}
      >
        <div className="space-y-4">
          <div>
            <label className="admin-label">Titre *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="Peinture intérieure"
            />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input resize-none"
              placeholder="Description du service..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Icône</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="admin-input"
              >
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Ordre</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Image (URL)</label>
            <input
              value={form.image ?? ''}
              onChange={(e) => setForm({ ...form, image: e.target.value || null })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="admin-label">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ServiceInput['status'] })}
              className="admin-input"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="admin-btn-ghost">
              Annuler
            </button>
            <button onClick={save} disabled={saving} className="admin-btn-primary">
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Supprimer le service"
        message="Cette action est irréversible. Le service sera définitivement supprimé."
      />
    </div>
  );
}
