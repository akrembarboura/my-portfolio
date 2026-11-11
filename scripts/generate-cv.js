// Generates a valid, clean, ATS-compliant PDF for Akrem Barboura
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'node:buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildPdf() {
  const content = [];

  // Helper functions for PDF operators
  const esc = (txt) => txt.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  
  // Page size: A4 = 595.28 x 841.89 points
  let y = 800;

  function addHeader(name, title, contactInfo) {
    // Name
    content.push('BT /F2 20 Tf 40 ' + y + ' Td (' + esc(name) + ') Tj ET');
    y -= 18;
    // Blue line accent
    content.push('0.145 0.388 0.922 RG 2 w 40 ' + (y + 12) + ' m 555 ' + (y + 12) + ' l S');
    // Title
    content.push('BT /F1 11 Tf 0.145 0.388 0.922 rg 40 ' + y + ' Td (' + esc(title) + ') Tj ET');
    y -= 14;
    // Contact bar
    content.push('BT /F1 8.5 Tf 0.28 0.33 0.41 rg 40 ' + y + ' Td (' + esc(contactInfo) + ') Tj ET');
    y -= 16;
  }

  function addSection(title) {
    y -= 4;
    content.push('BT /F2 10.5 Tf 0.06 0.09 0.16 rg 40 ' + y + ' Td (' + esc(title.toUpperCase()) + ') Tj ET');
    content.push('0.85 0.88 0.92 RG 0.75 w 40 ' + (y - 3) + ' m 555 ' + (y - 3) + ' l S');
    y -= 14;
  }

  function addParagraph(text, size = 8.5) {
    content.push('BT /F1 ' + size + ' Tf 0.2 0.25 0.33 rg');
    // simple word wrap for width ~515
    const words = text.split(' ');
    let line = '';
    const maxChars = 110;
    for (const w of words) {
      if ((line + ' ' + w).length > maxChars) {
        content.push('40 ' + y + ' Td (' + esc(line.trim()) + ') Tj');
        content.push('0 0 Td');
        y -= (size + 3.5);
        line = w + ' ';
      } else {
        line += w + ' ';
      }
    }
    if (line.trim().length > 0) {
      content.push('40 ' + y + ' Td (' + esc(line.trim()) + ') Tj');
      y -= (size + 4);
    }
    content.push('ET');
  }

  function addSkillRow(cat, items) {
    content.push('BT /F2 8.5 Tf 0.1 0.15 0.25 rg 40 ' + y + ' Td (' + esc(cat + ':') + ') Tj ET');
    content.push('BT /F1 8.5 Tf 0.2 0.25 0.33 rg 130 ' + y + ' Td (' + esc(items) + ') Tj ET');
    y -= 12.5;
  }

  function addItemHeader(role, org, date) {
    content.push('BT /F2 9.5 Tf 0.06 0.09 0.16 rg 40 ' + y + ' Td (' + esc(role) + ') Tj ET');
    if (org) {
      content.push('BT /F1 9 Tf 0.145 0.388 0.922 rg 180 ' + y + ' Td (' + esc(' |  ' + org) + ') Tj ET');
    }
    content.push('BT /F1 8.5 Tf 0.4 0.45 0.55 rg 480 ' + y + ' Td (' + esc(date) + ') Tj ET');
    y -= 12;
  }

  function addBullet(text) {
    content.push('BT /F1 8.5 Tf 0.145 0.388 0.922 rg 45 ' + y + ' Td (\\267) Tj ET'); // bullet dot
    content.push('BT /F1 8.5 Tf 0.2 0.25 0.33 rg 55 ' + y + ' Td (' + esc(text) + ') Tj ET');
    y -= 11.5;
  }

  // Compose CV
  addHeader(
    'AKREM BARBOURA',
    'Full-Stack Web Engineer | Distributed Systems & Architecture Specialist',
    'Tunis, Tunisia (UTC+1 / CET) | Open to Remote Worldwide | akrembarboura316@gmail.com | github.com/akrembarboura'
  );

  addSection('Executive Summary');
  addParagraph(
    'Full-Stack Engineer with extensive production experience building resilient web applications using React 19, Next.js 15, TypeScript, and Node.js. Proven ability to design robust backend APIs and scalable PostgreSQL/MongoDB architectures, backed by modern responsive interfaces. Experienced in asynchronous remote collaboration with full European overlap and 4-6 hours active overlap with US East Coast engineering teams.'
  );

  addSection('Technical Proficiencies');
  addSkillRow('Frontend', 'React 19, Next.js 15 (App Router, RSC, Server Actions), TypeScript, TanStack Start, Tailwind CSS v4, Framer Motion');
  addSkillRow('Backend & DB', 'Node.js, Express.js, RESTful APIs, Supabase (Auth, RLS, Storage), PostgreSQL, Prisma ORM, MongoDB');
  addSkillRow('DevOps & Tools', 'Git, GitHub, Vercel, Docker basics, Vite 8, ESLint, Postman, CI/CD automated workflows');
  addSkillRow('Remote Delivery', 'Async-first communication, clear PR documentation, Loom video walk-throughs, Linear, Slack, Notion');

  addSection('Production Experience');
  addItemHeader('Freelance Full-Stack Developer', 'Remote Worldwide', '2024 — Present');
  addBullet('Engineered and shipped 5+ full-stack web applications for commercial clients across North Africa and Europe.');
  addBullet('Designed performant SSR & static generation architectures with Next.js 15, reducing FCP to <0.8s.');
  addBullet('Implemented role-based access control (RBAC) and row-level security policies with Supabase and PostgreSQL.');
  addBullet('Led complete technical delivery from scoping and database schema design to automated Vercel deployments.');
  y -= 4;

  addItemHeader('Full-Stack Architecture & Systems', 'Self-Directed Deep Dive', '2023 — 2024');
  addBullet('Completed rigorous specialization in scalable distributed architectures and strict TypeScript engineering.');
  addBullet('Architected end-to-end full-stack prototypes focusing on database indexing, API security, and state management.');
  y -= 4;

  addSection('Featured Projects');
  addItemHeader('LOC MAISON', 'Rental Marketplace', 'Next.js 15, React 19, TS, MongoDB');
  addBullet('Tunisian managed rental platform connecting tenants with verified property listings (location-match.vercel.app).');
  addBullet('Built faceted search filters, responsive photo galleries, and automated landlord inquiry pipelines.');
  y -= 3;

  addItemHeader('EDUPOWER PORTAL', 'Full-Stack LMS Platform', 'TanStack Start, React 19, Supabase, Postgres');
  addBullet('Structured course management with interactive student quizzes, analytics tracking, and AI study flashcards.');
  addBullet('Implemented strict Supabase PostgreSQL Row Level Security to isolate student and instructor privileges.');
  y -= 3;

  addItemHeader('CAFÉ 716+', 'Digital Hospitality Platform', 'React 19, Three.js, Prisma, Tailwind');
  addBullet('Student café venue platform managing digital menus, PS5 lounge reservations, and live seating availability.');
  addBullet('Integrated interactive 3D lounge visualizer using Three.js for immersive space exploration.');
  y -= 3;

  addItemHeader('7ATA.TN', 'Luxury Streetwear E-Commerce', 'Next.js 15, RSC, Prisma, Tailwind CSS');
  addBullet('Editorial luxury e-commerce platform with inventory variants and multilingual RTL layout support.');

  addSection('Education & Languages');
  addSkillRow('Education', 'Computer Science & Software Development foundations');
  addSkillRow('Languages', 'English (Fluent / Professional), French (Fluent / Professional), Arabic (Native)');

  const stream = content.join('\n');

  // Build standard PDF 1.4 binary structure
  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj');
  objects.push('4 0 obj\n<< /Length ' + Buffer.byteLength(stream) + ' >>\nstream\n' + stream + '\nendstream\nendobj');
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  let offset = 0;
  const pdfHeader = '%PDF-1.4\n';
  offset += Buffer.byteLength(pdfHeader);

  const offsets = [];
  let body = '';
  for (const obj of objects) {
    offsets.push(offset);
    const chunk = obj + '\n';
    body += chunk;
    offset += Buffer.byteLength(chunk);
  }

  const xrefOffset = offset;
  let xref = 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
  for (const off of offsets) {
    xref += String(off).padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';

  const fullPdf = pdfHeader + body + xref + trailer;

  const targetPath = path.resolve(__dirname, '../public/cv-akrem-barboura.pdf');
  fs.writeFileSync(targetPath, fullPdf, 'binary');
  console.log('Successfully generated CV PDF at:', targetPath);
}

buildPdf();
