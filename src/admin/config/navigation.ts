import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Images,
  MessageSquareQuote,
  Inbox,
  Sparkles,
  UserRound,
  Search,
  Settings,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  segment: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Général',
    items: [
      {
        segment: 'dashboard',
        label: 'Tableau de bord',
        icon: LayoutDashboard,
        path: '/admin',
      },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { segment: 'services', label: 'Services', icon: Wrench, path: '/admin/services' },
      {
        segment: 'projects',
        label: 'Projets',
        icon: FolderKanban,
        path: '/admin/projects',
      },
      {
        segment: 'portfolio',
        label: 'Portfolio',
        icon: Images,
        path: '/admin/portfolio',
      },
      {
        segment: 'testimonials',
        label: 'Témoignages',
        icon: MessageSquareQuote,
        path: '/admin/testimonials',
      },
    ],
  },
  {
    title: 'Pages',
    items: [
      { segment: 'hero', label: 'Section Hero', icon: Sparkles, path: '/admin/hero' },
      { segment: 'about', label: 'À propos', icon: UserRound, path: '/admin/about' },
      { segment: 'seo', label: 'SEO', icon: Search, path: '/admin/seo' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { segment: 'contacts', label: 'Demandes', icon: Inbox, path: '/admin/contacts' },
    ],
  },
  {
    title: 'Système',
    items: [
      {
        segment: 'media',
        label: 'Médiathèque',
        icon: FolderOpen,
        path: '/admin/media',
      },
      {
        segment: 'settings',
        label: 'Paramètres',
        icon: Settings,
        path: '/admin/settings',
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function findNavBySegment(segment: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find((item) => item.segment === segment);
}
