const featuredProjects = [
  {
    id: '01',
    title: 'Café 716+',
    subtitle: 'Full-stack digital platform for a modern café.',
    description: 'A complete digital product built around a real café business. This is not simply a website, but a full-stack platform managing multiple business domains, workflows, and operational systems.',
    image: '/projects/cafe716.webp',
    tags: [
      'Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma',
      'Authentication', 'RBAC', 'Admin Dashboard', 'Events', 'Reservations', 'Orders'
    ],
    github: 'https://github.com/akrembarboura/cafe-website',
    demo: '#',    // Add live link when ready
  },
  {
    id: '02',
    title: '7ATA.TN',
    subtitle: 'Full-stack commerce platform for a Tunisian fashion business.',
    description: 'A premium e-commerce system designed around real operational requirements. Features complete product and stock management, advanced checkout, delivery logic, and multilingual RTL support.',
    image: '/projects/7ata.webp',
    tags: [
      'Next.js 15', 'RSC', 'TypeScript', 'PostgreSQL', 'Prisma', 'Supabase',
      'Authentication', 'RBAC', 'Product variants', 'Orders', 'Cloudinary'
    ],
    github: null,
    demo: '#',
  },
  {
    id: '03',
    title: 'R.N.V',
    subtitle: 'Production website for a painting and renovation company.',
    description: 'A client project demonstrating end-to-end delivery: understanding real business requirements, translating them into a dynamic portfolio platform, iterating with the client, and deploying a highly optimized production build.',
    image: '/projects/rnv.webp',
    tags: [
      'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase',
      'Dynamic Content', 'Client Collaboration', 'SEO/Performance'
    ],
    github: null,
    demo: '#',
  }
];

export default featuredProjects;
