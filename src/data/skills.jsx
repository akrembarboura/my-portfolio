import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiPrisma,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
  SiVercel,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

const skills = [
  {
    id: '01',
    category: 'Frontend',
    caption: 'Interfaces, rendering & styling',
    items: [
      {
        name: 'React',
        color: '#61DAFB',
        Icon: SiReact,
      },
      {
        name: 'Next.js',
        color: 'var(--text-1)',
        Icon: SiNextdotjs,
      },
      {
        name: 'TypeScript',
        color: '#3178C6',
        Icon: SiTypescript,
      },
      {
        name: 'JavaScript',
        color: '#F7DF1E',
        Icon: SiJavascript,
      },
      {
        name: 'Tailwind CSS',
        color: '#06B6D4',
        Icon: SiTailwindcss,
      },
      {
        name: 'HTML5',
        color: '#E34F26',
        Icon: SiHtml5,
      },
      {
        name: 'CSS3',
        color: '#1572B6',
        Icon: SiCss,
      },
    ],
  },
  {
    id: '02',
    category: 'Backend & Data',
    caption: 'APIs, runtimes & persistence',
    items: [
      {
        name: 'Node.js',
        color: '#5FA04E',
        Icon: SiNodedotjs,
      },
      {
        name: 'Express.js',
        color: 'var(--text-1)',
        Icon: SiExpress,
      },
      {
        name: 'PostgreSQL',
        color: '#4169E1',
        Icon: SiPostgresql,
      },
      {
        name: 'MongoDB',
        color: '#47A248',
        Icon: SiMongodb,
      },
      {
        name: 'Supabase',
        color: '#3ECF8E',
        Icon: SiSupabase,
      },
      {
        name: 'Prisma',
        color: '#16A394',
        Icon: SiPrisma,
      },
    ],
  },
  {
    id: '03',
    category: 'Tools & Workflow',
    caption: 'Version control, testing & cloud delivery',
    items: [
      {
        name: 'Git',
        color: '#F05032',
        Icon: SiGit,
      },
      {
        name: 'GitHub',
        color: 'var(--text-1)',
        Icon: SiGithub,
      },
      {
        name: 'VS Code',
        color: '#007ACC',
        Icon: VscVscode,
      },
      {
        name: 'Postman',
        color: '#FF6C37',
        Icon: SiPostman,
      },
      {
        name: 'Docker',
        color: '#2496ED',
        Icon: SiDocker,
      },
      {
        name: 'Vercel',
        color: 'var(--text-1)',
        Icon: SiVercel,
      },
    ],
  },
]

export default skills
