import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import AdminErrorBoundary from './components/AdminErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { PageLoader } from './components/ui';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const LeadsPage = lazy(() => import('./pages/LeadsPage'));
const HeroPage = lazy(() => import('./pages/HeroPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SeoPage = lazy(() => import('./pages/SeoPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage'));

export default function AdminApp() {
  return (
    <AdminErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>

              {/* 1. Unprotected Admin Route */}
              <Route
                path="login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </Suspense>
                }
              />

              {/* 2. Protected Admin Layout Route */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Suspense fallback={<PageLoader />}>
                        {/* Outlet renders whatever child route matches below */}
                        <Outlet />
                      </Suspense>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              >
                {/* 3. Nested Child Routes (No need for a second <Routes> block) */}
                {/* 'index' means this loads exactly at '/admin' */}
                <Route index element={<DashboardPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="hero" element={<HeroPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="seo" element={<SeoPage />} />
                <Route path="media" element={<MediaLibraryPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Catch-all for bad admin URLs (e.g., /admin/fake-page) */}
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>

            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </AdminErrorBoundary>
  );
}