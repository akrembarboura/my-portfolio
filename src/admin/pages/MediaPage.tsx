import { useRef, useState } from 'react';
import {
  FileImage,
  FolderOpen,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Input';
import { SkeletonGrid } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import SearchInput from '../components/ui/SearchInput';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import { useCollection } from '../hooks/useCollection';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { mediaService } from '../services/entities';
import { compressImage } from '../utils/image';
import { formatBytes, relativeTime } from '../utils/format';
import type { MediaFile, MediaFileInput } from '../types';

export default function MediaPage() {
  const { items, loading, create, remove, update } = useCollection(mediaService, {
    entity: 'Média',
  });
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('Tous');
  const [uploading, setUploading] = useState(false);
  const [renaming, setRenaming] = useState<MediaFile | null>(null);
  const [newName, setNewName] = useState('');
  const [confirm, setConfirm] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const debounced = useDebounce(search, 250);

  const folders = ['Tous', ...Array.from(new Set(items.map((i) => i.folder)))];

  const filtered = items.filter(
    (i) =>
      (folderFilter === 'Tous' || i.folder === folderFilter) &&
      i.name.toLowerCase().includes(debounced.toLowerCase())
  );

  const triggerUpload = () => fileRef.current?.click();

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const dataUrl = await compressImage(file);
        const input: MediaFileInput = {
          name: file.name,
          url: dataUrl,
          folder: folderFilter === 'Tous' ? 'Général' : folderFilter,
          size: file.size,
          type: file.type,
        };
        await create(input);
      }
      success('Fichiers importés', `${files.length} fichier(s) ajouté(s) avec succès.`);
    } catch (err) {
      error('Échec de l\'importation', (err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const openRename = (file: MediaFile) => {
    setRenaming(file);
    setNewName(file.name);
  };

  const handleRename = async () => {
    if (!renaming || !newName.trim()) return;
    try {
      await update(renaming.id, { name: newName.trim() });
      setRenaming(null);
    } catch (err) {
      error('Échec du renommage', (err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await remove(confirm.id);
      setConfirm(null);
    } catch (err) {
      error('Échec de la suppression', (err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-admin-in">
      <PageHeader
        title="Médiathèque"
        description="Gérez vos fichiers et dossiers"
        actions={
          <Button
            onClick={triggerUpload}
            leftIcon={<Upload className="h-4 w-4" />}
            loading={uploading}
          >
            Ajouter
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un fichier…"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setFolderFilter(folder)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                folderFilter === folder
                  ? 'bg-gold-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid items={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucun fichier"
          description="Importez des images pour constituer votre médiathèque."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((file) => (
            <Card key={file.id} className="group overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => openRename(file)}
                    aria-label="Renommer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-300 hover:bg-white/20"
                    onClick={() => setConfirm(file)}
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Badge tone="gray">{file.folder}</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">
                  {file.name}
                </p>
                <p className="mt-0.5 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1">
                    <FileImage className="h-3.5 w-3.5" />
                    {formatBytes(file.size)}
                  </span>
                  <span>{relativeTime(file.created_at || file.createdAt || new Date().toISOString())}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <Modal
        open={renaming !== null}
        onClose={() => setRenaming(null)}
        title="Renommer le fichier"
        footer={
          <>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Annuler
            </Button>
            <Button
              onClick={handleRename}
              leftIcon={<Pencil className="h-4 w-4" />}
              disabled={!newName.trim()}
            >
              Renommer
            </Button>
          </>
        }
      >
        <Field label="Nom du fichier">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="nom-du-fichier.jpg"
          />
        </Field>
      </Modal>

      <ConfirmDialog
        open={confirm !== null}
        title="Supprimer le fichier"
        description={`Voulez-vous vraiment supprimer « ${confirm?.name ?? ''} » ? Cette action est irréversible.`}
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
