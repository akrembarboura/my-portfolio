import { useEffect, useState } from 'react';
import { Save, Loader2, Building2, Globe, Clock, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, PageLoader } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { fetchSettings, updateSettings } from '../services/content';
import type { SiteSettings } from '../types';

export default function SettingsPage() {
  const { toast } = useToast();
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(setData)
      .catch(() => toast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await updateSettings({
        business_name: data.business_name,
        owner_name: data.owner_name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        siret: data.siret,
        ape_code: data.ape_code,
        maps_embed: data.maps_embed,
        opening_hours: data.opening_hours,
        social_facebook: data.social_facebook,
        social_instagram: data.social_instagram,
        social_linkedin: data.social_linkedin,
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
      });
      toast('Paramètres mis à jour');
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
        title="Paramètres"
        subtitle="Gérez les informations de votre entreprise."
        action={
          <button onClick={save} disabled={saving} className="admin-btn-primary">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business info */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={18} className="text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Informations entreprise
            </h3>
          </div>
          <div>
            <label className="admin-label">Nom de l'entreprise</label>
            <input
              value={data.business_name}
              onChange={(e) => setData({ ...data, business_name: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Responsable</label>
            <input
              value={data.owner_name ?? ''}
              onChange={(e) => setData({ ...data, owner_name: e.target.value || null })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Adresse</label>
            <textarea
              rows={2}
              value={data.address ?? ''}
              onChange={(e) => setData({ ...data, address: e.target.value || null })}
              className="admin-input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Téléphone</label>
              <input
                value={data.phone ?? ''}
                onChange={(e) => setData({ ...data, phone: e.target.value || null })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input
                value={data.email ?? ''}
                onChange={(e) => setData({ ...data, email: e.target.value || null })}
                className="admin-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="admin-label">SIRET</label>
              <input
                value={data.siret ?? ''}
                onChange={(e) => setData({ ...data, siret: e.target.value || null })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Code APE</label>
              <input
                value={data.ape_code ?? ''}
                onChange={(e) => setData({ ...data, ape_code: e.target.value || null })}
                className="admin-input"
              />
            </div>
          </div>
        </Card>

        {/* Contact + Social */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Carte & Horaires
              </h3>
            </div>
            <div>
              <label className="admin-label">Google Maps (URL embed)</label>
              <textarea
                rows={3}
                value={data.maps_embed ?? ''}
                onChange={(e) => setData({ ...data, maps_embed: e.target.value || null })}
                className="admin-input resize-none"
                placeholder="https://www.google.com/maps?q=..."
              />
            </div>
            <div>
              <label className="admin-label">
                <Clock size={12} className="inline mr-1" /> Horaires d'ouverture
              </label>
              <input
                value={data.opening_hours ?? ''}
                onChange={(e) => setData({ ...data, opening_hours: e.target.value || null })}
                className="admin-input"
                placeholder="Lun - Ven: 8h - 18h"
              />
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Réseaux sociaux
            </h3>
            <div>
              <label className="admin-label">Facebook</label>
              <input
                value={data.social_facebook ?? ''}
                onChange={(e) => setData({ ...data, social_facebook: e.target.value || null })}
                className="admin-input"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="admin-label">Instagram</label>
              <input
                value={data.social_instagram ?? ''}
                onChange={(e) => setData({ ...data, social_instagram: e.target.value || null })}
                className="admin-input"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="admin-label">LinkedIn</label>
              <input
                value={data.social_linkedin ?? ''}
                onChange={(e) => setData({ ...data, social_linkedin: e.target.value || null })}
                className="admin-input"
                placeholder="https://linkedin.com/..."
              />
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={18} className="text-indigo-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Identité visuelle
              </h3>
            </div>
            <div>
              <label className="admin-label">Logo (URL)</label>
              <input
                value={data.logo_url ?? ''}
                onChange={(e) => setData({ ...data, logo_url: e.target.value || null })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="admin-label">Favicon (URL)</label>
              <input
                value={data.favicon_url ?? ''}
                onChange={(e) => setData({ ...data, favicon_url: e.target.value || null })}
                className="admin-input"
                placeholder="https://..."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
