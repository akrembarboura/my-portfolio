<div align="center">
  <img src="public/akrempicture.png" alt="Akrem Barboura Logo" width="120" style="border-radius: 50%; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);" />

  # 🌟 Akrem Barboura — Full-Stack Developer Portfolio

  A premium, high-performance portfolio and content management system built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://github.com/akrembarboura)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 🚀 Overview

Welcome to my personal developer portfolio! This project is a modern showcase of my skills, projects, and professional background. Beyond just a static site, it includes a **fully-featured Admin Dashboard** powered by Supabase, allowing dynamic updates to the portfolio's content, skills, projects, and contact leads without needing to alter code.

## ✨ Features

- **Dynamic Data Management**: All projects, skills, services, and timeline events are fetched in real-time from a PostgreSQL database.
- **Secure Admin Panel**: Built-in authentication (RLS) protects the admin routes, allowing authorized users to edit portoflio content and track new contact requests.
- **Modern UI/UX Aesthetic**: Smooth scrolling animations, glassmorphism UI elements, dark/light mode toggles, and premium Tailwind styling.
- **Interactive Geolocation Contact Form**: Integrated with the browser's Geolocation API to allow clients to optionally attach accurate GPS coordinates to their project inquiries!
- **Fully Responsive**: Architected with a mobile-first approach ensuring perfect presentation on both phones and high-resolution desktop monitors.

## 🛠 Tech Stack

| Technology | Description |
|---|---|
| **Frontend Setup** | React 18, Vite, React Router v7 |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Backend / BaaS** | Supabase (PostgreSQL, Auth, RLS Policies) |
| **Data Flow** | Custom REST endpoints & direct Supabase client mutations |
| **Deployment** | Vercel (CI/CD Integrated) |

## 📦 Getting Started

Want to run this project locally? Follow these steps!

### 1. Clone the Repository
```bash
git clone https://github.com/akrembarboura/my-portfolio.git
cd my-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase Environment
Create a `.env` file at the root of the project with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://<YOUR_PROJECT_ID>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

### 4. Run the Development Server
```bash
npm run dev
```

Enjoy exploring the architecture! If you have any inquiries, feel free to visit the **Contact** section of the live portfolio.

---

<div align="center">
  <i>Developed with ❤️ by Akrem Barboura</i><br/>
  <a href="https://github.com/akrembarboura">GitHub</a> • <a href="https://linkedin.com/in/akrembarboura">LinkedIn</a>
</div>
