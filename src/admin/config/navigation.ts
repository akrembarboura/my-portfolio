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
    title: 'General',
    items: [
      {
        segment: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        segment: 'projects',
        label: 'Projects',
        icon: FolderKanban,
        path: '/admin/projects',
      },
      { segment: 'media', label: 'Media Library', icon: FolderOpen, path: '/admin/media' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { segment: 'contacts', label: 'Messages', icon: Inbox, path: '/admin/contacts' },
    ],
  },
  {
    title: 'System',
    items: [
      { segment: 'seo', label: 'SEO Settings', icon: Search, path: '/admin/seo' },
      {
        segment: 'settings',
        label: 'Global Settings',
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
