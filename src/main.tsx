import { StrictMode } from 'react';
import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const Dashboard = lazy(() => import('./dashboard/Dashboard.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-slate-300 bg-[#05040a]">
            Loading workspace...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </StrictMode>,
);
