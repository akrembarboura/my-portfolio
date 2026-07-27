import { useEffect, useState } from 'react';
import { Save, Loader2, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchSeo, updateSeo } from '../services/content';
import type { SeoSettings } from '../types';

export default function SeoPage() {
  const { toast } = useToast();
  const [data, setData] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSeo()
      .then(setData)
      .catch(() => toast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateSeo({
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        keywords: data.keywords,
        og_image: data.og_image,
      });
      toast('Paramètres SEO mis à jour');
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!data) return <p className="text-slate-500">Erreur de chargement.</p>;

  return (
    <div>
      <PageHeader
        title="SEO"
        subtitle="Optimisez le référencement de votre site."
        action={
          <button onClick={save} disabled={saving} className="admin-btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-5">
          <div>
            <label className="admin-label">Méta Titre</label>
            <input
              value={data.meta_title ?? data.metaTitle ?? ''}
              onChange={(e) => setData({ ...data, meta_title: e.target.value, metaTitle: e.target.value })}
              className="admin-input"
              maxLength={60}
            />
            <p className="text-xs text-slate-400 mt-1">{(data.meta_title ?? data.metaTitle ?? '').length}/60 caractères</p>
          </div>
          <div>
            <label className="admin-label">Méta Description</label>
            <textarea
              rows={3}
              value={data.meta_description ?? data.metaDescription ?? ''}
              onChange={(e) => setData({ ...data, meta_description: e.target.value, metaDescription: e.target.value })}
              className="admin-input resize-none"
              maxLength={160}
            />
            <p className="text-xs text-slate-400 mt-1">{(data.meta_description ?? data.metaDescription ?? '').length}/160 caractères</p>
          </div>
          <div>
            <label className="admin-label">Mots-clés (séparés par des virgules)</label>
            <input
              value={data.keywords ?? ''}
              onChange={(e) => setData({ ...data, keywords: e.target.value || null })}
              className="admin-input"
              placeholder="peintre, vénissieux, rénovation, peinture"
            />
          </div>
          <div>
            <label className="admin-label">Image Open Graph (URL)</label>
            <input
              value={data.og_image ?? ''}
              onChange={(e) => setData({ ...data, og_image: e.target.value || null })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
        </Card>

        {/* Google preview */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Aperçu Google
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Search size={14} />
              <span>rnvpeinture.fr</span>
            </div>
            <p className="text-lg text-indigo-600 hover:underline cursor-pointer">
              {data.meta_title}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {data.meta_description}
            </p>
          </div>

          {data.og_image && (
            <div className="mt-6">
              <label className="admin-label">Aperçu Open Graph</label>
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-sm">
                {data.og_image && (
                  <img src={data.og_image} alt="OG" className="w-full h-40 object-cover" />
                )}
                <div className="p-3 bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-400">rnvpeinture.fr</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {data.meta_title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.meta_description}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
