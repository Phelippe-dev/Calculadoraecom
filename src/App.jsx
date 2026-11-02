import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PricingCalculator from './components/PricingCalculator';
import MarketplaceComparator from './components/MarketplaceComparator';
import MonthlyGoalCalculator from './components/MonthlyGoalCalculator';
import RulesGuide from './components/RulesGuide';
import SavedSimulationsModal from './components/SavedSimulationsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [savedSimulations, setSavedSimulations] = useState(() => {
    try {
      const stored = localStorage.getItem('gravity_simulations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('gravity_simulations', JSON.stringify(savedSimulations));
    } catch (e) {
      console.error(e);
    }
  }, [savedSimulations]);

  const handleSaveSimulation = (simData) => {
    setSavedSimulations(prev => [simData, ...prev]);
  };

  const handleDeleteSimulation = (id) => {
    setSavedSimulations(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setSavedSimulations([]);
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedSimulations.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
      />

      <main>
        {activeTab === 'single' && (
          <PricingCalculator
            currentMarketplace="ml"
            onSaveSimulation={handleSaveSimulation}
          />
        )}

        {activeTab === 'comparator' && (
          <MarketplaceComparator />
        )}

        {activeTab === 'goal' && (
          <MonthlyGoalCalculator onSaveSimulation={handleSaveSimulation} />
        )}

        {activeTab === 'rules' && (
          <RulesGuide />
        )}
      </main>

      {/* Footer & Seção Institucional Gravity Tech */}
      <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem', paddingBottom: '2.5rem' }}>
        <div 
          className="card no-print" 
          style={{ 
            maxWidth: '860px', 
            margin: '0 auto 1.75rem auto', 
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', 
            border: '1px solid rgba(168, 85, 247, 0.35)', 
            padding: '1.6rem', 
            textAlign: 'center' 
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.85rem', borderRadius: 'var(--radius-pill)', background: 'rgba(168, 85, 247, 0.16)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#C084FC', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            ✨ GRAVITY TECH — TECNOLOGIA SOB MEDIDA &amp; AUTOMAÇÃO
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
            Precisa de um Sistema Web, Dashboard ou Automação para seu Negócio?
          </h3>
          
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 1.25rem auto', lineHeight: '1.5' }}>
            A <strong>Gravity Tech</strong> cria plataformas personalizadas, integrações de APIs, dashboards gerenciais e automações (WhatsApp, ERPs e e-commerces) que aceleram resultados e aumentam suas vendas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a 
              href="https://gravitytech.web.app/#contato" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ 
                padding: '0.65rem 1.4rem', 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
                color: '#FFFFFF'
              }}
            >
              Solicitar Orçamento Grátis ↗
            </a>
            <a 
              href="https://gravitytech.web.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Conhecer a Gravity Tech
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <strong>Gravity Calculadora</strong> — Precificação Financeira Auditada para Mercado Livre, Shopee, TikTok Shop, Amazon, Shein e Temu.
          <br />
          Desenvolvido por <a href="https://gravitytech.web.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#A855F7', textDecoration: 'none', fontWeight: 700 }}>Gravity Tech</a> — Tecnologia que Transforma.
        </p>
      </footer>

      <SavedSimulationsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedList={savedSimulations}
        onDeleteSimulation={handleDeleteSimulation}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
