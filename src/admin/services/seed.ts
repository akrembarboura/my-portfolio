import type {
  AboutContent,
  ContactRequest,
  GalleryImage,
  HeroContent,
  MediaFile,
  Notification,
  Project,
  SeoContent,
  Service,
  SettingsContent,
  Testimonial,
} from '../types';

const now = new Date().toISOString();

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const seedServices: Service[] = [
  {
    id: 'svc-1',
    title: 'Peinture Intérieure',
    description:
      'Application soignée de peintures haut de gamme pour sublimer vos intérieurs.',
    icon: 'Paintbrush',
    image:
      'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&w=800',
    sort_order: 1,
    order: 1,
    status: 'active',
    created_at: daysAgo(40),
    updated_at: daysAgo(3),
  },
  {
    id: 'svc-2',
    title: 'Plâtrerie',
    description:
      'Travaux de plâtrerie traditionnelle et moderne, cloisons et plafonds.',
    icon: 'Layers',
    image:
      'https://images.pexels.com/photos/8961107/pexels-photo-8961107.jpeg?auto=compress&w=800',
    sort_order: 2,
    order: 2,
    status: 'active',
    created_at: daysAgo(38),
    updated_at: daysAgo(5),
  },
  {
    id: 'svc-3',
    title: 'Finitions Décoratives',
    description:
      'Enduits décoratifs, patines et effets matières pour un rendu unique.',
    icon: 'Sparkles',
    image:
      'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&w=800',
    sort_order: 3,
    order: 3,
    status: 'active',
    created_at: daysAgo(30),
    updated_at: daysAgo(2),
  },
  {
    id: 'svc-4',
    title: 'Ravalement de Façade',
    description: 'Rénovation et protection durable de vos façades extérieures.',
    icon: 'Building2',
    image:
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&w=800',
    sort_order: 4,
    order: 4,
    status: 'inactive',
    created_at: daysAgo(20),
    updated_at: daysAgo(1),
  },
];

export const seedProjects: Project[] = [
  {
    id: 'prj-1',
    title: 'Rénovation Salon Haussmannien',
    description:
      'Rénovation complète d’un salon avec moulures et peinture premium.',
    category: 'Rénovation',
    before_image:
      'https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&w=800',
    beforeImage:
      'https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&w=800',
    after_image:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=800',
    afterImage:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=800',
    completion_date: daysAgo(15),
    location: 'Paris 8e',
    sort_order: 1,
    order: 1,
    status: 'active',
    created_at: daysAgo(60),
    updated_at: daysAgo(15),
  },
  {
    id: 'prj-2',
    title: 'Chambre Parentale Moderne',
    description: 'Mise en peinture et enduits décoratifs sur mesure.',
    category: 'Décoration',
    before_image:
      'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&w=800',
    beforeImage:
      'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&w=800',
    after_image:
      'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&w=800',
    afterImage:
      'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&w=800',
    completion_date: daysAgo(28),
    location: 'Neuilly-sur-Seine',
    sort_order: 2,
    order: 2,
    status: 'active',
    created_at: daysAgo(52),
    updated_at: daysAgo(28),
  },
  {
    id: 'prj-3',
    title: 'Façade Maison Individuelle',
    description: 'Ravalement complet avec traitement anti-humidité.',
    category: 'Extérieur',
    before_image:
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&w=800',
    beforeImage:
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&w=800',
    after_image:
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&w=800',
    afterImage:
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&w=800',
    completion_date: daysAgo(45),
    location: 'Versailles',
    sort_order: 3,
    order: 3,
    status: 'inactive',
    created_at: daysAgo(70),
    updated_at: daysAgo(45),
  },
];

const galleryUrls = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&w=600',
  'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&w=600',
];

export const seedGallery: GalleryImage[] = galleryUrls.map((url, i) => ({
  id: `gal-${i + 1}`,
  title: `Réalisation ${i + 1}`,
  image_url: url,
  url,
  category: ['Intérieur', 'Extérieur', 'Décoration'][i % 3],
  sort_order: i + 1,
  order: i + 1,
  size: 180000 + i * 24000,
  created_at: daysAgo(30 - i),
  createdAt: daysAgo(30 - i),
  updated_at: daysAgo(30 - i),
}));

export const seedTestimonials: Testimonial[] = [
  {
    id: 'tst-1',
    client_name: 'Sophie Martin',
    clientName: 'Sophie Martin',
    photo:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=200',
    rating: 5,
    review:
      'Travail impeccable et équipe très professionnelle. Je recommande vivement R.N.V Peinture !',
    company: 'Particulier',
    published: true,
    status: 'published',
    sort_order: 1,
    order: 1,
    created_at: daysAgo(25),
    createdAt: daysAgo(25),
  },
  {
    id: 'tst-2',
    client_name: 'Jean Dubois',
    clientName: 'Jean Dubois',
    photo:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=200',
    rating: 5,
    review:
      'Une finition parfaite pour notre bureau. Délais respectés et grande minutie.',
    company: 'Cabinet Dubois & Associés',
    published: true,
    status: 'published',
    sort_order: 2,
    order: 2,
    created_at: daysAgo(18),
    createdAt: daysAgo(18),
  },
  {
    id: 'tst-3',
    client_name: 'Claire Petit',
    clientName: 'Claire Petit',
    photo:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=200',
    rating: 4,
    review: 'Très satisfaite du résultat, un accompagnement de qualité.',
    company: 'Particulier',
    published: false,
    status: 'draft',
    sort_order: 3,
    order: 3,
    created_at: daysAgo(9),
    createdAt: daysAgo(9),
  },
];

export const seedContacts: ContactRequest[] = [
  {
    id: 'ctc-1',
    name: 'Marc Leroy',
    email: 'marc.leroy@email.com',
    phone: '06 12 34 56 78',
    message: 'Bonjour, je souhaite un devis pour repeindre un appartement de 80m².',
    project_type: 'Peinture',
    projectType: 'Peinture',
    status: 'new',
    created_at: daysAgo(1),
    createdAt: daysAgo(1),
  },
  {
    id: 'ctc-2',
    name: 'Isabelle Moreau',
    email: 'isabelle.m@email.com',
    phone: '07 98 76 54 32',
    message: 'Demande de rendez-vous pour un ravalement de façade.',
    project_type: 'Façade',
    projectType: 'Façade',
    status: 'in_progress',
    created_at: daysAgo(3),
    createdAt: daysAgo(3),
  },
  {
    id: 'ctc-3',
    name: 'Thomas Bernard',
    email: 'thomas.bernard@email.com',
    phone: '06 45 67 89 01',
    message: 'Merci pour votre intervention, tout est parfait.',
    project_type: 'Décoration',
    projectType: 'Décoration',
    status: 'completed',
    created_at: daysAgo(12),
    createdAt: daysAgo(12),
  },
  {
    id: 'ctc-4',
    name: 'Nadia Benali',
    email: 'nadia.benali@email.com',
    phone: '07 11 22 33 44',
    message: 'Ancienne demande, projet annulé.',
    project_type: 'Plâtrerie',
    projectType: 'Plâtrerie',
    status: 'archived',
    created_at: daysAgo(40),
    createdAt: daysAgo(40),
  },
];

export const seedMedia: MediaFile[] = galleryUrls.map((url, i) => ({
  id: `med-${i + 1}`,
  name: `image-${i + 1}.jpg`,
  url,
  folder: ['Général', 'Projets', 'Services'][i % 3],
  size: 200000 + i * 30000,
  mime_type: 'image/jpeg',
  type: 'image/jpeg',
  created_at: daysAgo(20 - i),
  createdAt: daysAgo(20 - i),
}));

export const seedHero: HeroContent = {
  id: 1,
  headline: "L'Art de Sublimer Vos Espaces",
  subtitle:
    'R.N.V Peinture — Artisan peintre d’exception pour des intérieurs et façades d’exception.',
  cta_text: 'Demander un devis',
  ctaText: 'Demander un devis',
  cta_link: '/contact',
  ctaLink: '/contact',
  background_image:
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=1600',
  backgroundImage:
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=1600',
  updated_at: now,
};

export const seedAbout: AboutContent = {
  id: 1,
  title: 'Un savoir-faire artisanal depuis 15 ans',
  description:
    'Passionné par mon métier, je mets mon expertise au service de vos projets pour un résultat à la hauteur de vos attentes.',
  experience: '15 ans',
  experienceYears: '15 ans',
  image:
    'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&w=800',
  skills: ['Peinture décorative', 'Plâtrerie', 'Enduits & finitions', 'Ravalement de façade'],
  updated_at: now,
};

export const seedSeo: SeoContent = {
  id: 1,
  meta_title: 'R.N.V Peinture | Artisan Peintre Haut de Gamme',
  metaTitle: 'R.N.V Peinture | Artisan Peintre Haut de Gamme',
  meta_description:
    'R.N.V Peinture, artisan peintre spécialisé en peinture intérieure, plâtrerie et finitions décoratives. Devis gratuit.',
  metaDescription:
    'R.N.V Peinture, artisan peintre spécialisé en peinture intérieure, plâtrerie et finitions décoratives. Devis gratuit.',
  keywords: 'peintre, peinture intérieure, plâtrerie, ravalement, décoration',
  og_image:
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=1200',
  ogImage:
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=1200',
  updated_at: now,
};

export const seedSettings: SettingsContent = {
  id: 1,
  business_name: 'R.N.V Peinture',
  businessName: 'R.N.V Peinture',
  owner_name: 'Khaled Chtoui',
  ownerName: 'Khaled Chtoui',
  address: '1 Rue André Lebon, 69200 Vénissieux, France',
  phone: '07 58 66 28 27',
  email: 'rnvpeinture@outlook.com',
  siret: '938 050 789 00018',
  ape_code: '4120A',
  apeCode: '4120A',
  maps_embed: 'https://maps.google.com/?q=Venissieux',
  opening_hours: 'Lundi - Vendredi: 08:00 - 18:00',
  social_facebook: 'https://facebook.com/rnvpeinture',
  social_instagram: 'https://instagram.com/rnvpeinture',
  social_linkedin: '',
  logo_url: '',
  favicon_url: '',
  updated_at: now,
};

export const seedNotifications: Notification[] = [
  {
    id: 'ntf-1',
    title: 'Nouvelle demande de devis',
    message: 'Marc Leroy a envoyé une demande.',
    description: 'Marc Leroy a envoyé une demande.',
    created_at: now,
    time: now,
    read: false,
    type: 'message',
  },
  {
    id: 'ntf-2',
    title: 'Nouveau témoignage',
    message: 'Un client a laissé un avis 5 étoiles.',
    description: 'Un client a laissé un avis 5 étoiles.',
    created_at: daysAgo(1),
    time: daysAgo(1),
    read: false,
    type: 'success',
  },
  {
    id: 'ntf-3',
    title: 'Sauvegarde effectuée',
    message: 'Le contenu de la page d’accueil a été mis à jour.',
    description: 'Le contenu de la page d’accueil a été mis à jour.',
    created_at: daysAgo(2),
    time: daysAgo(2),
    read: true,
    type: 'info',
  },
];

