import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Home from './pages/Home';

// Admin panel is temporarily hidden unless VITE_ENABLE_ADMIN=true
const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === 'true';
const AdminDashboard = ADMIN_ENABLED
  ? lazy(() => import('./pages/AdminDashboard'))
  : null;

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Single-page: all sections live on the index route */}
          <Route index element={<Home />} />
        </Route>

        {/* Independent Admin Route — hidden by default, redirects to home */}
        {ADMIN_ENABLED && AdminDashboard ? (
          <Route
            path="admin/*"
            element={
              <Suspense fallback={null}>
                <AdminDashboard />
              </Suspense>
            }
          />
        ) : (
          <Route path="admin/*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
