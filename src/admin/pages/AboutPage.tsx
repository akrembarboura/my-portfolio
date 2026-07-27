import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchAbout, updateAbout } from '../services/content';
import type { AboutContent } from '../types';

export default function AboutPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchAbout()
      .then(setData)
      .catch(() => toast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateAbout({
        title: data.title,
        description: data.description,
        experience: data.experience,
        image: data.image,
        skills: data.skills,
      });
      toast('Page À propos mise à jour');
    } catch {
      toast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim() || !data) return;
    setData({ ...data, skills: [...(data.skills ?? []), newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (idx: number) => {
    if (!data?.skills) return;
    setData({ ...data, skills: data.skills.filter((_, i) => i !== idx) });
  };

  if (loading) return <PageLoader />;
  if (!data) return <p className="text-slate-500">Erreur de chargement.</p>;

  return (
    <div>
      <PageHeader
        title="Page À propos"
        subtitle="Modifiez la section présentant l'artisan."
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
            <label className="admin-label">Titre</label>
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea
              rows={5}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="admin-input resize-none"
            />
          </div>
          <div>
            <label className="admin-label">Expérience</label>
            <input
              value={data.experience ?? ''}
              onChange={(e) => setData({ ...data, experience: e.target.value || null })}
              className="admin-input"
              placeholder="10+ ans d'expérience"
            />
          </div>
          <div>
            <label className="admin-label">Image (URL)</label>
            <input
              value={data.image ?? ''}
              onChange={(e) => setData({ ...data, image: e.target.value || null })}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <div>
            <label className="admin-label">Compétences</label>
            <div className="flex gap-2 mb-3">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="admin-input"
                placeholder="Ajouter une compétence..."
              />
              <button onClick={addSkill} className="admin-btn-ghost shrink-0">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.skills ?? []).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                  <button onClick={() => removeSkill(i)} className="text-slate-400 hover:text-rose-600">
                    <X size={14} />
                  </button>
                </span>
              ))}
              {(!data.skills || data.skills.length === 0) && (
                <p className="text-sm text-slate-400">Aucune compétence ajoutée.</p>
              )}
            </div>
          </div>

          {/* Image preview */}
          {data.image && (
            <div>
              <label className="admin-label">Aperçu de l'image</label>
              <div className="rounded-lg overflow-hidden h-48 bg-slate-100 dark:bg-slate-700">
                <img src={data.image} alt="À propos" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
