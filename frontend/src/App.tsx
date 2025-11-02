import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Investments } from './pages/Investments';
import { Simulator } from './pages/Simulator';
import { RiskPlanner } from './pages/RiskPlanner';
import { News } from './pages/News';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import AuthSuccess from './pages/AuthSuccess';
import { FundsEnhanced } from './pages/markets/FundsEnhanced';
import { FundCompare } from './pages/markets/funds/FundCompare';
import { Crypto } from './pages/markets/Crypto';
import { StocksIN } from './pages/markets/StocksIN';
import { StocksUS } from './pages/markets/StocksUS';
import { Bonds } from './pages/markets/Bonds';
import { Watchlist } from './pages/markets/Watchlist';
import { Compare } from './pages/markets/Compare';
import { Button } from './components/ui/Button';
function AppContent() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  // Check if current route is auth page (no header/footer)
  const isAuthPage = ['/login', '/signup', '/auth/success'].includes(location.pathname);

  // Check for print mode
  const searchParams = new URLSearchParams(location.search);
  const isPrintMode = searchParams.get('print') === '1';
  return <div className={`flex flex-col min-h-screen w-full ${isPrintMode ? 'print-view' : ''}`} style={!isPrintMode ? {
    backgroundColor: `rgb(var(--bg))`
  } : undefined}>
      {!isAuthPage && !isPrintMode && <>
          <Header onMenuClick={() => setMobileNavOpen(true)} />
          <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        </>}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/risk-planner" element={<RiskPlanner />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Markets Routes */}
          <Route path="/markets/funds" element={<FundsEnhanced />} />
          <Route path="/markets/funds/compare" element={<FundCompare />} />
          <Route path="/markets/crypto" element={<Crypto />} />
          <Route path="/markets/stocks-in" element={<StocksIN />} />
          <Route path="/markets/stocks-us" element={<StocksUS />} />
          <Route path="/markets/bonds" element={<Bonds />} />
          <Route path="/markets/watchlist" element={<Watchlist />} />
          <Route path="/markets/compare" element={<Compare />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAuthPage && !isPrintMode && <Footer />}

      {/* Print Mode Indicator */}
      {isPrintMode && <div className="fixed top-4 right-4 no-print">
          <Button onClick={() => window.print()}>Print / Save as PDF</Button>
        </div>}
    </div>;
}
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}