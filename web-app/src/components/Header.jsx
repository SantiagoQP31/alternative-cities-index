import React from 'react';
import { Award } from 'lucide-react';

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'narrative', label: 'Narrativa' },
    { id: 'methodology', label: 'Metodología' },
    { id: 'map', label: 'Constelación Urbana' },
    { id: 'explorer', label: 'Explorador ACI' },
    { id: 'robustness', label: 'Validación Científica' }
  ];

  return (
    <nav className="app-navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); setActiveTab('narrative'); }}>
          <Award size={18} className="nav-logo-accent" />
          <span>Alternative Cities <span className="nav-logo-accent">Index</span></span>
        </a>
        <ul className="nav-menu">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
