import { useEffect, useState } from 'react';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchHero, updateHero } from '../services/content';
import type { HeroContent } from '../types';

export default function HeroPage() {
  const { toast } = useToast();
  const [data, setData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHero()
      .then(setData)
      .catch(() => toast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateHero({
        headline: data.headline,
        subtitle: data.subtitle,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        background_image: data.background_image,
      });
      toast('Section Hero mise à jour');
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
        title="Section Hero"
        subtitle="Modifiez la section d'accueil principale du site."
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
            <label className="admin-label">Titre principal (Headline)</label>
            <input
              value={data.headline}
              onChange={(e) => setData({ ...data, headline: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Sous-titre</label>
            <textarea
              rows={2}
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="admin-input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Texte du bouton (CTA)</label>
              <input
                value={data.cta_text}
                onChange={(e) => setData({ ...data, cta_text: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Lien du bouton</label>
              <input
                value={data.cta_link}
                onChange={(e) => setData({ ...data, cta_link: e.target.value })}
                className="admin-input"
                placeholder="contact"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Image de fond (URL)</label>
            <input
              value={data.background_image ?? ''}
              onChange={(e) => setData({ ...data, background_image: e.target.value || null })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Aperçu
          </h3>
          <div className="relative rounded-lg overflow-hidden h-80 bg-slate-200 dark:bg-slate-700">
            {data.background_image ? (
              <img src={data.background_image} alt="Hero preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <ImageIcon size={32} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40 flex flex-col items-center justify-center text-center p-6">
              <h2 className="font-serif text-2xl text-white mb-2">{data.headline}</h2>
              <p className="text-sm text-white/80 mb-4">{data.subtitle}</p>
              <span className="px-5 py-2 bg-gold-400 text-charcoal-900 text-xs font-medium uppercase tracking-wider rounded">
                {data.cta_text}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
