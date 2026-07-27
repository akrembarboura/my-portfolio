import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, Badge, SearchInput, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/testimonials';
import type { Testimonial, TestimonialInput } from '../types';

const empty: TestimonialInput = {
  client_name: '',
  photo: '',
  rating: 5,
  review: '',
  company: '',
  published: false,
  sort_order: 0,
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          className="transition"
        >
          <Star
            size={20}
            className={n <= value ? 'fill-gold-400 text-gold-400' : 'text-slate-300 dark:text-slate-600'}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialInput>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchTestimonials());
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

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      client_name: t.client_name,
      photo: t.photo ?? '',
      rating: t.rating,
      review: t.review ?? '',
      company: t.company ?? '',
      published: t.published,
      sort_order: t.sort_order,
    });
    setModalOpen(true);
  };

  const save = async () => {
    const name = (form.client_name || form.clientName || '').trim();
    if (!name) {
      toast('Le nom du client est requis', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, form);
        toast('Témoignage mis à jour');
      } else {
        await createTestimonial(form);
        toast('Témoignage créé');
      }
      setModalOpen(false);
      load();
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (t: Testimonial) => {
    try {
      await updateTestimonial(t.id, { published: !t.published });
      toast(t.published ? 'Témoignage masqué' : 'Témoignage publié');
      load();
    } catch {
      toast('Erreur', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast('Témoignage supprimé');
      load();
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = items.filter((t) =>
    (t.client_name || t.clientName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Témoignages"
        subtitle="Gérez les avis clients affichés sur le site."
        action={
          <button onClick={openCreate} className="admin-btn-primary">
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un client..." />
      </div>

      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Star}
            title="Aucun témoignage"
            description="Ajoutez votre premier avis client."
            action={
              <button onClick={openCreate} className="admin-btn-primary">
                <Plus size={16} /> Ajouter un témoignage
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                  {t.photo && <img src={t.photo} alt={t.client_name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {t.client_name}
                    </h3>
                    <Badge
                      className={
                        t.published
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }
                    >
                      {t.published ? 'Publié' : 'Masqué'}
                    </Badge>
                  </div>
                  {t.company && <p className="text-xs text-slate-400 mb-2">{t.company}</p>}
                  <StarRating value={t.rating} />
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3">
                    "{t.review}"
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => togglePublish(t)} className="admin-btn-ghost flex-1 !py-2">
                  {t.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  {t.published ? 'Masquer' : 'Publier'}
                </button>
                <button onClick={() => openEdit(t)} className="admin-btn-ghost !py-2">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="admin-btn-ghost !py-2 hover:!text-rose-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le témoignage' : 'Nouveau témoignage'}
      >
        <div className="space-y-4">
          <div>
            <label className="admin-label">Nom du client *</label>
            <input
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className="admin-input"
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="admin-label">Entreprise</label>
            <input
              value={form.company ?? ''}
              onChange={(e) => setForm({ ...form, company: e.target.value || null })}
              className="admin-input"
              placeholder="Nom de l'entreprise (optionnel)"
            />
          </div>
          <div>
            <label className="admin-label">Photo (URL)</label>
            <input
              value={form.photo ?? ''}
              onChange={(e) => setForm({ ...form, photo: e.target.value || null })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="admin-label">Note</label>
            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <div>
            <label className="admin-label">Avis</label>
            <textarea
              rows={4}
              value={form.review ?? ''}
              onChange={(e) => setForm({ ...form, review: e.target.value || null })}
              className="admin-input resize-none"
              placeholder="Le témoignage du client..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="published" className="text-sm text-slate-600 dark:text-slate-300">
              Publier sur le site
            </label>
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
        title="Supprimer le témoignage"
        message="Ce témoignage sera définitivement supprimé."
      />
    </div>
  );
}
