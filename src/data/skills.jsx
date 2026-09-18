import { FaLock, FaPlug, FaDatabase } from 'react-icons/fa';
import { 
  SiReact, SiTypescript, SiTailwindcss, 
  SiNodedotjs, SiExpress, SiMongodb, SiSupabase, 
  SiGithub, SiDocker, SiVercel, SiPostman, 
  SiNextdotjs, SiPostgresql, SiPrisma 
} from 'react-icons/si';

const skills = [
  {
    category: 'Frontend',
    icon: <SiReact className="w-5 h-5 text-[#61DAFB]" />,
    items: [
      { name: 'React.js', color: '#61DAFB', icon: <SiReact /> },
      { name: 'Next.js', color: 'var(--text-1)', icon: <SiNextdotjs /> },
      { name: 'TypeScript', color: '#3178C6', icon: <SiTypescript /> },
      { name: 'Tailwind CSS', color: '#06B6D4', icon: <SiTailwindcss /> },
    ],
  },
  {
    category: 'Backend',
    icon: <SiNodedotjs className="w-5 h-5 text-[#339933]" />,
    items: [
      { name: 'Node.js', color: '#339933', icon: <SiNodedotjs /> },
      { name: 'Express.js', color: 'var(--text-1)', icon: <SiExpress /> },
      { name: 'REST APIs', color: '#8fa3cc', icon: <FaLock /> },
      { name: 'Authentication', color: '#8fa3cc', icon: <FaPlug /> },
    ],
  },
  {
    category: 'Data',
    icon: <FaDatabase className="w-5 h-5 text-[#336791]" />,
    items: [
      { name: 'PostgreSQL', color: '#336791', icon: <SiPostgresql /> },
      { name: 'Prisma', color: '#2D3748', icon: <SiPrisma /> },
      { name: 'Supabase', color: '#3ECF8E', icon: <SiSupabase /> },
      { name: 'MongoDB', color: '#47A248', icon: <SiMongodb /> },
    ],
  },
  {
    category: 'Infrastructure',
    icon: <SiGithub className="w-5 h-5 text-text-1" />,
    items: [
      { name: 'Docker', color: '#2496ED', icon: <SiDocker /> },
      { name: 'Vercel', color: 'var(--text-1)', icon: <SiVercel /> },
      { name: 'Git & GitHub', color: '#F05032', icon: <SiGithub /> },
      { name: 'Testing', color: '#FF6C37', icon: <SiPostman /> },
    ],
  },
];

export default skills;