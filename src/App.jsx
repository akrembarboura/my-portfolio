import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Single-page: all sections live on the index route */}
          <Route index element={<Home />} />
        </Route>
        {/* Independent Admin Route (No public header/footer) */}
        <Route path="admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
