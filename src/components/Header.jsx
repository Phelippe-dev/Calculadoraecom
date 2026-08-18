import React from 'react';
import { Calculator, BarChart3, TrendingUp, BookOpen, Bookmark, Printer, Sparkles } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, savedCount, onOpenSavedModal }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="header-bar">
      <div className="brand-title">
        <div className="brand-text">
          <h1>Gravity Calculadora <Sparkles size={16} style={{ color: '#A855F7' }} /></h1>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          <Calculator size={15} /> Calculadora
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'comparator' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparator')}
        >
          <BarChart3 size={15} /> Comparador Lado a Lado
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'goal' ? 'active' : ''}`}
          onClick={() => setActiveTab('goal')}
        >
          <TrendingUp size={15} /> Projeção Mensal
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <BookOpen size={15} /> Regras &amp; Taxas 2026
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onOpenSavedModal}
          style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
        >
          <Bookmark size={15} style={{ color: '#A855F7' }} />
          Salvos ({savedCount})
        </button>

        <button
          type="button"
          className="btn btn-outline no-print"
          onClick={handlePrint}
          title="Imprimir ou Salvar PDF"
          style={{ padding: '0.5rem 0.75rem' }}
        >
          <Printer size={15} />
        </button>
      </div>
    </header>
  );
}
