import React from 'react';
import { Bookmark, Trash2, FileSpreadsheet, Printer, X, Zap, ShoppingBag, Video } from 'lucide-react';
import { formatBRL, formatPct } from './PricingCalculator';

export default function SavedSimulationsModal({ isOpen, onClose, savedList, onDeleteSimulation, onClearAll }) {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (savedList.length === 0) return;

    const headers = ["Data", "Identificação", "Marketplace", "Preço Venda (R$)", "CMV (R$)", "Lucro Líquido (R$)", "Margem Líquida (%)", "Preço Alvo Sugerido (R$)"];
    
    const rows = savedList.map(item => [
      `"${item.date || ''}"`,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${item.marketplace === 'shopee' ? 'Shopee' : item.marketplace === 'tiktok' ? 'TikTok Shop' : 'Mercado Livre'}"`,
      `"${(item.precoVenda || 0).toFixed(2).replace('.', ',')}"`,
      `"${(item.custoProd || 0).toFixed(2).replace('.', ',')}"`,
      `"${(item.lucro || 0).toFixed(2).replace('.', ',')}"`,
      `"${(item.margemPct || 0).toFixed(2).replace('.', ',')}%"`,
      `"${(item.precoMargAlvo || 0).toFixed(2).replace('.', ',')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `gravity_simulacoes_excel_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const getMpBadge = (mp) => {
    if (mp === 'shopee') return <span className="badge badge-shopee"><ShoppingBag size={11} /> Shopee</span>;
    if (mp === 'tiktok') return <span className="badge badge-tiktok"><Video size={11} /> TikTok</span>;
    return <span className="badge badge-ml"><Zap size={11} /> ML</span>;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Bookmark size={18} style={{ color: 'var(--accent)' }} /> Histórico de Simulações Salvas ({savedList.length})
          </h3>
          <button type="button" className="btn btn-outline" onClick={onClose} style={{ padding: '0.25rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        {savedList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Nenhuma simulação salva ainda. Clique em <strong>"Salvar Simulação"</strong> na calculadora para guardar seus produtos!
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleExportCSV} style={{ fontSize: '0.78rem' }}>
                  <FileSpreadsheet size={14} style={{ color: '#10B981' }} /> Exportar para Excel (CSV)
                </button>
                <button type="button" className="btn btn-outline" onClick={handlePrintPDF} style={{ fontSize: '0.78rem' }}>
                  <Printer size={14} /> Imprimir PDF
                </button>
              </div>

              <button type="button" className="btn btn-outline" onClick={onClearAll} style={{ fontSize: '0.78rem', color: 'var(--danger)' }}>
                <Trash2 size={14} /> Limpar Tudo
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedList.map((item) => (
                <div key={item.id} style={{ padding: '0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      {getMpBadge(item.marketplace)}
                      <strong style={{ fontSize: '0.92rem' }}>{item.title}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Preço Venda: <strong>{formatBRL(item.precoVenda)}</strong> | CMV: {formatBRL(item.custoProd)}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.lucro >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '0.2rem' }}>
                      Lucro: {formatBRL(item.lucro)} ({formatPct(item.margemPct)})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem', color: 'var(--danger)' }}
                      onClick={() => onDeleteSimulation(item.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
