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

      <footer style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
        <p><strong>Gravity Calculadora</strong> — Precificação Financeira Auditada para Mercado Livre, Shopee e TikTok Shop — Regras Oficiais 2026.</p>
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
