import { FaServer, FaCode, FaDatabase, FaTools, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import { 
  SiReact, SiTypescript, SiTailwindcss, 
  SiNodedotjs, SiExpress, SiMongodb, SiSupabase, 
  SiGithub, SiDocker, SiVercel, SiPostman, 
  SiNextdotjs, SiPostgresql, SiPrisma 
} from 'react-icons/si';

const skills = [
  {
    category: 'Frontend',
    icon: <FaCode className="w-6 h-6 text-[#61DAFB]" />,
    items: [
      {
        name: 'React',
        role: 'UI Library · Core',
        isPrimary: true,
        color: '#61DAFB',
        icon: <SiReact className="w-6 h-6" />,
      },
      {
        name: 'Next.js',
        role: 'Full-Stack / SSR',
        isPrimary: true,
        color: 'var(--text-1)',
        icon: <SiNextdotjs className="w-6 h-6" />,
      },
      {
        name: 'TypeScript',
        role: 'Type Safety',
        isPrimary: true,
        color: '#3178C6',
        icon: <SiTypescript className="w-6 h-6" />,
      },
      {
        name: 'Tailwind CSS',
        role: 'Utility-First Styling',
        isPrimary: false,
        color: '#06B6D4',
        icon: <SiTailwindcss className="w-6 h-6" />,
      },
    ],
  },
  {
    category: 'Backend',
    icon: <FaServer className="w-6 h-6 text-[#5FA04E]" />,
    items: [
      {
        name: 'Node.js',
        role: 'Runtime Environment',
        isPrimary: true,
        color: '#5FA04E',
        icon: <SiNodedotjs className="w-6 h-6" />,
      },
      {
        name: 'Express.js',
        role: 'REST APIs & Middleware',
        isPrimary: true,
        color: 'var(--text-1)',
        icon: <SiExpress className="w-6 h-6" />,
      },
      {
        name: 'RESTful APIs',
        role: 'API Architecture & Design',
        isPrimary: false,
        color: '#0EA5E9',
        icon: <FaNetworkWired className="w-5 h-5" />,
      },
      {
        name: 'Authentication',
        role: 'JWT, RBAC & Protection',
        isPrimary: false,
        color: '#F59E0B',
        icon: <FaShieldAlt className="w-5 h-5" />,
      },
    ],
  },
  {
    category: 'Databases',
    icon: <FaDatabase className="w-6 h-6 text-[#4169E1]" />,
    items: [
      {
        name: 'PostgreSQL',
        role: 'Relational Database',
        isPrimary: true,
        color: '#4169E1',
        icon: <SiPostgresql className="w-6 h-6" />,
      },
      {
        name: 'Supabase',
        role: 'Postgres BaaS & Auth',
        isPrimary: true,
        color: '#3ECF8E',
        icon: <SiSupabase className="w-6 h-6" />,
      },
      {
        name: 'MongoDB',
        role: 'Document Database',
        isPrimary: false,
        color: '#47A248',
        icon: <SiMongodb className="w-6 h-6" />,
      },
      {
        name: 'Prisma',
        role: 'Type-Safe ORM',
        isPrimary: false,
        color: '#16A394',
        icon: <SiPrisma className="w-6 h-6" />,
      },
    ],
  },
  {
    category: 'Tools & Platforms',
    icon: <FaTools className="w-6 h-6 text-[#F05032]" />,
    items: [
      {
        name: 'Git & GitHub',
        role: 'Version Control & CI',
        isPrimary: true,
        color: '#F05032',
        icon: <SiGithub className="w-6 h-6" />,
      },
      {
        name: 'Docker',
        role: 'Containerization',
        isPrimary: false,
        color: '#2496ED',
        icon: <SiDocker className="w-6 h-6" />,
      },
      {
        name: 'Vercel',
        role: 'Deployment & Hosting',
        isPrimary: false,
        color: 'var(--text-1)',
        icon: <SiVercel className="w-6 h-6" />,
      },
      {
        name: 'Postman',
        role: 'API Testing & Inspection',
        isPrimary: false,
        color: '#FF6C37',
        icon: <SiPostman className="w-6 h-6" />,
      },
    ],
  },
];

export default skills;