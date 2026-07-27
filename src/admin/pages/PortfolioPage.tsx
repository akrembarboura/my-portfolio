import { useEffect, useState } from 'react';
import { Plus, Trash2, Images, Search, X, Upload } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, SearchInput, PageLoader, Pagination, Badge } from '../components/ui';
import { useToast } from '../context/ToastContext';
import {
  fetchPortfolio,
  createPortfolioImages,
  deletePortfolioImage,
} from '../services/portfolio';
import type { PortfolioImage, PortfolioImageInput } from '../types';

const CATEGORIES = ['Tous', 'Peinture intérieure', 'Peinture extérieure', 'Plâtrerie', 'Finitions'];
const PAGE_SIZE = 12;

export default function PortfolioPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkUrls, setBulkUrls] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchPortfolio());
    } catch {
      toast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addImages = async () => {
    const urls = bulkUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      toast('Ajoutez au moins une URL', 'error');
      return;
    }
    try {
      const inputs: PortfolioImageInput[] = urls.map((url) => ({
        title: null,
        image_url: url,
        category: category === 'Tous' ? null : category,
        sort_order: 0,
      }));
      await createPortfolioImages(inputs);
      toast(`${urls.length} image(s) ajoutée(s)`);
      setBulkUrls('');
      setModalOpen(false);
      load();
    } catch {
      toast('Erreur lors de l\'ajout', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await deletePortfolioImage(id);
      toast('Image supprimée');
      load();
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = items.filter((item) => {
    const imageUrl = item.image_url || item.url || '';
    const matchSearch =
      (item.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      imageUrl.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Tous' || item.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle="Gérez la galerie d'images affichée sur le site."
        action={
          <button onClick={() => setModalOpen(true)} className="admin-btn-primary">
            <Plus size={16} /> Ajouter
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher..." />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : paginated.length === 0 ? (
        <Card>
          <EmptyState
            icon={Images}
            title="Aucune image"
            description="Ajoutez des images à votre portfolio."
            action={
              <button onClick={() => setModalOpen(true)} className="admin-btn-primary">
                <Plus size={16} /> Ajouter des images
              </button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginated.map((item) => {
              const imgUrl = item.image_url || item.url || '';
              return (
                <Card key={item.id} className="overflow-hidden group">
                  <div
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setPreviewUrl(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={item.title ?? 'Portfolio'}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Search size={24} className="text-white" />
                    </div>
                    {item.category && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gold-500/90 text-charcoal-900">{item.category}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <p className="text-xs text-slate-500 truncate flex-1">
                      {item.title ?? 'Sans titre'}
                    </p>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 transition shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Add modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter des images" size="md">
        <div className="space-y-4">
          <div>
            <label className="admin-label">URLs des images (une par ligne)</label>
            <textarea
              rows={6}
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              className="admin-input resize-none"
              placeholder="https://images.pexels.com/...&#10;https://images.pexels.com/..."
            />
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <Upload size={12} /> Collez une URL par ligne pour ajouter plusieurs images.
            </p>
          </div>
          <div>
            <label className="admin-label">Catégorie</label>
            <select
              value={category === 'Tous' ? '' : category}
              onChange={(e) => setCategory(e.target.value || 'Tous')}
              className="admin-input"
            >
              <option value="">Sans catégorie</option>
              {CATEGORIES.filter((c) => c !== 'Tous').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="admin-btn-ghost">
              Annuler
            </button>
            <button onClick={addImages} className="admin-btn-primary">
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80"
          onClick={() => setPreviewUrl(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
          <img src={previewUrl} alt="Aperçu" className="max-w-full max-h-[90vh] rounded-lg" />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Supprimer l'image"
        message="Cette image sera définitivement supprimée du portfolio."
      />
    </div>
  );
}
