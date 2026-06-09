// Skills data — each category has an icon class and a list of skills
const skills = [
  {
    category: 'Frontend',
    icon: '🎨',
    iconClass: 'fe',
    items: [
      { name: 'React.js', level: 88, icon: '⚛️' },
      { name: 'JavaScript (ES6+)', level: 85, icon: '🟨' },
      { name: 'TypeScript', level: 72, icon: '🔷' },
      { name: 'Tailwind CSS', level: 90, icon: '💨' },
    ],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    iconClass: 'be',
    items: [
      { name: 'Node.js', level: 83, icon: '🟩' },
      { name: 'Express.js', level: 82, icon: '🚂' },
      { name: 'REST APIs / JWT', level: 80, icon: '🔐' },
      { name: 'Socket.io', level: 68, icon: '🔌' },
    ],
  },
  {
    category: 'Database',
    icon: '🗄️',
    iconClass: 'db',
    items: [
      { name: 'MongoDB', level: 85, icon: '🍃' },
      { name: 'Mongoose ODM', level: 82, icon: '📖' },
      { name: 'Aggregation Pipelines', level: 70, icon: '🔧' },
      { name: 'Redis (Caching)', level: 55, icon: '⚡' },
    ],
  },
  {
    category: 'Tools & DevOps',
    icon: '🛠️',
    iconClass: 'tools',
    items: [
      { name: 'Git & GitHub', level: 88, icon: '🐙' },
      { name: 'Docker', level: 70, icon: '🐳' },
      { name: 'Vercel / Netlify', level: 80, icon: '▲' },
      { name: 'Postman / Testing', level: 75, icon: '📮' },
    ],
  },
];

export default skills;
