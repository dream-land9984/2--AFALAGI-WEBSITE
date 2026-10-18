import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, User, Activity } from 'lucide-react';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import SearchPage from './pages/SearchPage';
import AuthPage from './pages/AuthPage';

const INITIAL_DATA = [
  { id: 1, name: "Abebe Bekele", age: 43, location: "Tigray Region", dateLost: "2023-11-12", description: "Tall, wearing a blue jacket", contact: "+251911234567", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
  { id: 2, name: "Fatima Ali", age: 12, location: "Afar Region", dateLost: "2024-01-05", description: "Small scar on left cheek. Wearing a red dress.", contact: "+251922345678", image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80" },
  { id: 3, name: "Yosef Tadesse", age: 28, location: "Amhara Region", dateLost: "2024-02-14", description: "Last seen at bus station", contact: "+251933456789", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80" }
];

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <Home className="nav-icon" />
        <span>Home</span>
      </Link>
      <Link to="/search" className={`nav-item ${path === '/search' ? 'active' : ''}`}>
        <Search className="nav-icon" />
        <span>Search</span>
      </Link>
      <Link to="/report" className={`nav-item ${path === '/report' ? 'active' : ''}`}>
        <PlusCircle className="nav-icon" />
        <span>Report</span>
      </Link>
      <Link to="/auth" className={`nav-item ${path === '/auth' ? 'active' : ''}`}>
        <User className="nav-icon" />
        <span>Profile</span>
      </Link>
    </div>
  );
}

function App() {
  const [reports, setReports] = useState(INITIAL_DATA);
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="header">
        <Link to="/" className="brand">
          <Activity color="var(--color-primary)" />
          Afalagi
        </Link>
        {user ? (
          <div className="chip animate-fade-in">{user.name}</div>
        ) : (
          <Link to="/auth" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Login</Link>
        )}
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage reports={reports} />} />
          <Route path="/search" element={<SearchPage reports={reports} />} />
          <Route path="/report" element={<ReportPage setReports={setReports} user={user} />} />
          <Route path="/auth" element={<AuthPage user={user} setUser={setUser} />} />
        </Routes>
      </div>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;
