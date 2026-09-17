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

const empty: ProjectInput = {
  num: '01',
  icon: '',
  title: '',
  description: '',
  tags: [],
  github: '',
  demo: '',
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
      num: p.num ?? '01',
      icon: p.icon ?? '',
      title: p.title,
      description: p.description ?? '',
      tags: p.tags ?? [],
      github: p.github ?? '',
      demo: p.demo ?? '',
      sort_order: p.sort_order ?? 0,
      status: p.status ?? 'active',
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
      p.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Projets (Portfolio)"
        subtitle="Gérez les projets affichés sur votre portfolio développeur."
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
            description="Ajoutez votre premier projet à votre portfolio."
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
                <div className="relative h-24 overflow-hidden bg-slate-100 dark:bg-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    {p.icon && (
                      <div className="text-3xl bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                        {p.icon}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
                        {p.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-mono mt-1">N° {p.num}</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/60 text-white text-xs px-2 py-1 rounded">
                    <GripVertical size={12} /> Glisser
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                  
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                          +{p.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="admin-btn-ghost flex-1 !py-2 text-xs"
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
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="admin-label">Numéro</label>
              <input
                value={form.num}
                onChange={(e) => setForm({ ...form, num: e.target.value })}
                className="admin-input"
                placeholder="01"
              />
            </div>
            <div className="col-span-1">
              <label className="admin-label">Icône (Emoji/Texte)</label>
              <input
                value={form.icon ?? ''}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="admin-input"
                placeholder="🚀"
              />
            </div>
            <div className="col-span-2">
              <label className="admin-label">Titre *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                placeholder="E-commerce Platform"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input resize-none"
              placeholder="Une courte description du projet..."
            />
          </div>

          <div>
            <label className="admin-label">Tags (Séparés par des virgules)</label>
            <input
              value={(form.tags || []).join(', ')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="admin-input"
              placeholder="React, Node.js, Tailwind"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Lien GitHub</label>
              <input
                value={form.github ?? ''}
                onChange={(e) => setForm({ ...form, github: e.target.value || null })}
                className="admin-input"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="admin-label">Lien Démo (Live)</label>
              <input
                value={form.demo ?? ''}
                onChange={(e) => setForm({ ...form, demo: e.target.value || null })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Ordre d'affichage</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="admin-input"
              />
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
