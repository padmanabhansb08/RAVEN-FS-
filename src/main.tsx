import { StrictMode } from 'react';
import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layout/MainLayout';
import SetupPage from './pages/SetupPage';
import ResultsPage from './pages/ResultsPage';
import './index.css';

const Dashboard = lazy(() => import('./dashboard/Dashboard.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-slate-300 bg-[#05040a]">
              Loading workspace...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<SetupPage />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppProvider>
  </StrictMode>,
);
