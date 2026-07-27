import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FolderKanban, GripVertical } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, Badge, SearchInput, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projects';
import type { Project, ProjectInput } from '../types';

const CATEGORIES = [
  'Peinture intérieure',
  'Peinture extérieure',
  'Plâtrerie',
  'Finitions',
];

const empty: ProjectInput = {
  title: '',
  description: '',
  before_image: '',
  after_image: '',
  category: 'Peinture intérieure',
  completion_date: '',
  location: '',
  sort_order: 0,
  status: 'active',
};

export default function ProjectsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectInput>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchProjects());
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

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? '',
      before_image: p.before_image ?? '',
      after_image: p.after_image ?? '',
      category: p.category ?? 'Peinture intérieure',
      completion_date: p.completion_date ?? '',
      location: p.location ?? '',
      sort_order: p.sort_order,
      status: p.status,
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
        await updateProject(editing.id, form);
        toast('Projet mis à jour');
      } else {
        await createProject(form);
        toast('Projet créé');
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
      await deleteProject(id);
      toast('Projet supprimé');
      load();
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  // Drag & drop ordering
  const handleDragStart = (id: string) => setDragId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const dragged = items.find((i) => i.id === dragId);
    const target = items.find((i) => i.id === targetId);
    if (!dragged || !target) return;
    const newItems = [...items];
    const dragIdx = newItems.findIndex((i) => i.id === dragId);
    const targetIdx = newItems.findIndex((i) => i.id === targetId);
    [newItems[dragIdx].sort_order, newItems[targetIdx].sort_order] = [
      newItems[targetIdx].sort_order,
      newItems[dragIdx].sort_order,
    ];
    newItems.sort((a, b) => (a.sort_order ?? a.order ?? 0) - (b.sort_order ?? b.order ?? 0));
    setItems(newItems);
    try {
      await Promise.all([
        updateProject(dragged.id, { sort_order: target.sort_order }),
        updateProject(target.id, { sort_order: dragged.sort_order }),
      ]);
      toast('Ordre mis à jour');
    } catch {
      toast('Erreur lors de la mise à jour', 'error');
      load();
    }
    setDragId(null);
  };

  const filtered = items.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Projets"
        subtitle="Gérez les chantiers et rénovations affichés sur le site."
        action={
          <button onClick={openCreate} className="admin-btn-primary">
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un projet..." />
      </div>

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderKanban}
            title="Aucun projet"
            description="Ajoutez votre premier projet de rénovation."
            action={
              <button onClick={openCreate} className="admin-btn-primary">
                <Plus size={16} /> Ajouter un projet
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className={`overflow-hidden group cursor-grab ${dragId === p.id ? 'opacity-50' : ''}`}
            >
              <div
                draggable
                onDragStart={() => handleDragStart(p.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(p.id)}
              >
                {/* After image preview */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {p.after_image ? (
                    <img
                      src={p.after_image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <FolderKanban size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-900/60 text-white text-xs px-2 py-1 rounded">
                    <GripVertical size={12} /> Glisser
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gold-500/90 text-charcoal-900">{p.category}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{p.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{p.location ?? '—'}</span>
                    <span>{p.completion_date ?? '—'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="admin-btn-ghost flex-1 !py-2"
                    >
                      <Pencil size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="admin-btn-ghost !py-2 hover:!text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le projet' : 'Nouveau projet'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="admin-label">Titre *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="Rénovation d'un salon à Vénissieux"
            />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Image Avant (URL)</label>
              <input
                value={form.before_image ?? ''}
                onChange={(e) => setForm({ ...form, before_image: e.target.value || null })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="admin-label">Image Après (URL)</label>
              <input
                value={form.after_image ?? ''}
                onChange={(e) => setForm({ ...form, after_image: e.target.value || null })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Catégorie</label>
              <select
                value={form.category ?? ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Date de fin</label>
              <input
                type="date"
                value={form.completion_date ?? ''}
                onChange={(e) => setForm({ ...form, completion_date: e.target.value || null })}
                className="admin-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Lieu</label>
              <input
                value={form.location ?? ''}
                onChange={(e) => setForm({ ...form, location: e.target.value || null })}
                className="admin-input"
                placeholder="Vénissieux"
              />
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
            <label className="admin-label">Statut</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectInput['status'] })}
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
        title="Supprimer le projet"
        message="Cette action est irréversible. Le projet sera définitivement supprimé."
      />
    </div>
  );
}
