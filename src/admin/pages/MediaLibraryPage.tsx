import { useEffect, useState } from 'react';
import { Images, Trash2, Pencil, Upload, FolderPlus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Card, EmptyState, SearchInput, PageLoader, Pagination } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchMedia, createMediaItem, updateMediaItem, deleteMediaItem, uploadMedia } from '../services/media';
import { formatBytes } from '../utils/helpers';
import type { MediaItem } from '../types';

const FOLDERS = ['all', 'general', 'services', 'projects', 'portfolio', 'hero'];
const PAGE_SIZE = 15;

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameItem, setRenameItem] = useState<MediaItem | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newUrls, setNewUrls] = useState('');
  const [newFolder, setNewFolder] = useState('general');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchMedia(folder === 'all' ? undefined : folder));
    } catch {
      toast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [folder]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // The uploadMedia service pushes binary file to Supabase storage
        const publicUrl = await uploadMedia(file, newFolder);
        // The createMediaItem saves the URL into the db for UI display
        await createMediaItem({
          name: file.name,
          url: publicUrl,
          folder: newFolder,
          size: file.size,
          mime_type: file.type,
        });
      }
      toast(`${files.length} fichier(s) uploadé(s)`);
      setUploadOpen(false);
      load();
    } catch (error) {
      console.error(error);
      toast("Erreur lors de l'upload local", 'error');
    } finally {
      setUploadingFiles(false);
    }
  };

  const addMedia = async () => {
    const urls = newUrls.split('\n').map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) {
      toast('Ajoutez au moins une URL', 'error');
      return;
    }
    try {
      for (const url of urls) {
        await createMediaItem({
          name: url.split('/').pop() ?? 'image',
          url,
          folder: newFolder,
          size: 0,
          mime_type: 'image/jpeg',
        });
      }
      toast(`${urls.length} média(s) ajouté(s)`);
      setNewUrls('');
      setUploadOpen(false);
      load();
    } catch {
      toast('Erreur lors de l\'ajout', 'error');
    }
  };

  const saveRename = async () => {
    if (!renameItem) return;
    try {
      await updateMediaItem(renameItem.id, { name: renameValue });
      toast('Média renommé');
      setRenameItem(null);
      load();
    } catch {
      toast('Erreur', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMediaItem(id);
      toast('Média supprimé');
      load();
    } catch {
      toast('Erreur', 'error');
    }
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Médiathèque"
        subtitle="Gérez les images et fichiers du site."
        action={
          <button onClick={() => setUploadOpen(true)} className="admin-btn-primary">
            <Upload size={16} /> Ajouter
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un média..." />
        <div className="flex flex-wrap gap-2">
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFolder(f);
                setPage(1);
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${folder === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
              {f === 'all' ? 'Tous' : f}
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
            title="Aucun média"
            description="Ajoutez des images à votre médiathèque."
            action={
              <button onClick={() => setUploadOpen(true)} className="admin-btn-primary">
                <Upload size={16} /> Ajouter des médias
              </button>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {paginated.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setRenameItem(item);
                        setRenameValue(item.name);
                      }}
                      className="p-2 rounded-lg bg-white/90 text-slate-700 hover:bg-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-2 rounded-lg bg-white/90 text-rose-600 hover:bg-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.folder} · {formatBytes(item.size)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Ajouter des médias">
        <div className="space-y-4">
          <div>
            <label className="admin-label">Dossier de destination</label>
            <select
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="admin-input"
            >
              {FOLDERS.filter((f) => f !== 'all').map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label mb-2">Uploader depuis votre appareil</label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <input
                type="file"
                multiple
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileUpload}
                disabled={uploadingFiles}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {uploadingFiles ? (
                <div className="flex flex-col items-center">
                  <span className="text-sm mt-2 text-slate-500 font-medium">Upload en cours... Patientez svp.</span>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none">
                  <Upload size={24} className="text-indigo-400 mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Cliquez ou glissez vos fichiers ici</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP autorisés</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
            <span className="text-xs text-slate-400 font-medium">OU</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          </div>

          <div>
            <label className="admin-label">URLs des images (une par ligne)</label>
            <textarea
              rows={4}
              value={newUrls}
              onChange={(e) => setNewUrls(e.target.value)}
              className="admin-input resize-none"
              placeholder="https://images.pexels.com/...&#10;https://images.pexels.com/..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setUploadOpen(false)} className="admin-btn-ghost">
              Annuler
            </button>
            <button onClick={addMedia} className="admin-btn-primary">
              <FolderPlus size={16} /> Ajouter via URL
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename modal */}
      <Modal open={!!renameItem} onClose={() => setRenameItem(null)} title="Renommer le média" size="sm">
        <div className="space-y-4">
          <div>
            <label className="admin-label">Nouveau nom</label>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="admin-input"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setRenameItem(null)} className="admin-btn-ghost">
              Annuler
            </button>
            <button onClick={saveRename} className="admin-btn-primary">
              Renommer
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && remove(deleteId)}
        title="Supprimer le média"
        message="Ce média sera définitivement supprimé."
      />
    </div>
  );
}
