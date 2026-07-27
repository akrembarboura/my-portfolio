import {
  FaPaintBrush, FaServer, FaDatabase, FaTools, FaLock, FaPlug, FaBook, FaWrench
} from 'react-icons/fa';
import {
  SiReact, SiJavascript, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiSupabase,
  SiRedis, SiGithub, SiDocker, SiVercel, SiPostman
} from 'react-icons/si';

// Skills data — each category has an icon class and a list of skills
const skills = [
  {
    category: 'Frontend',
    icon: <FaPaintBrush className="w-5 h-5" />,
    iconClass: 'fe',
    items: [
      { name: 'React.js', level: 88, icon: <SiReact className="text-[#61DAFB]" /> },
      { name: 'JavaScript (ES6+)', level: 85, icon: <SiJavascript className="text-[#F7DF1E]" /> },
      { name: 'TypeScript', level: 72, icon: <SiTypescript className="text-[#3178C6]" /> },
      { name: 'Tailwind CSS', level: 90, icon: <SiTailwindcss className="text-[#06B6D4]" /> },
    ],
  },
  {
    category: 'Backend',
    icon: <FaServer className="w-5 h-5" />,
    iconClass: 'be',
    items: [
      { name: 'Node.js', level: 83, icon: <SiNodedotjs className="text-[#339933]" /> },
      { name: 'Express.js', level: 82, icon: <SiExpress className="text-gray-300" /> },
      { name: 'REST APIs / JWT', level: 80, icon: <FaLock className="text-yellow-500" /> },
      { name: 'Socket.io', level: 68, icon: <FaPlug className="text-blue-400" /> },
    ],
  },
  {
    category: 'Database & BaaS',
    icon: <FaDatabase className="w-5 h-5" />,
    iconClass: 'db',
    items: [
      { name: 'MongoDB', level: 85, icon: <SiMongodb className="text-[#47A248]" /> },
      { name: 'Supabase', level: 80, icon: <SiSupabase className="text-[#3ECF8E]" /> },
      { name: 'Mongoose ODM', level: 82, icon: <FaBook className="text-red-400" /> },
      { name: 'Aggregation Pipelines', level: 70, icon: <FaWrench className="text-gray-400" /> },
      { name: 'Redis (Caching)', level: 55, icon: <SiRedis className="text-[#DC382D]" /> },
    ],
  },
  {
    category: 'Tools & DevOps',
    icon: <FaTools className="w-5 h-5" />,
    iconClass: 'tools',
    items: [
      { name: 'Git & GitHub', level: 88, icon: <SiGithub className="text-white" /> },
      { name: 'Docker', level: 70, icon: <SiDocker className="text-[#2496ED]" /> },
      { name: 'Vercel / Netlify', level: 80, icon: <SiVercel className="text-white" /> },
      { name: 'Postman / Testing', level: 75, icon: <SiPostman className="text-[#FF6C37]" /> },
    ],
  },
];

export default skills;