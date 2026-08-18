import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Zap, AlertCircle, CheckCircle2, Bookmark, FileSpreadsheet, Printer, Sparkles, BarChart2, Flame, ArrowUpRight } from 'lucide-react';
import FormattedInput from './FormattedInput';
import { SHOPEE_FAIXAS, parseBRL, formatBRL, formatPct } from './PricingCalculator';

export default function MonthlyGoalCalculator({ onSaveSimulation }) {
  // Inputs da Projeção Mensal em Andamento
  const [faturamentoAtual, setFaturamentoAtual] = useState('');
  const [diaAtual, setDiaAtual] = useState('13');
  const [diasNoMes, setDiasNoMes] = useState('31');
  const [margemLucroMedia, setMargemLucroMedia] = useState('20');
  const [curvaSazonalidade, setCurvaSazonalidade] = useState('dia20_forte'); // 'linear', 'dia20_forte', 'conservadora', 'forte'
  const [marketplace, setMarketplace] = useState('ml');

  const numFatAtual = parseBRL(faturamentoAtual);
  const numDiaAtual = Math.max(1, Math.min(31, parseInt(diaAtual, 10) || 1));
  const numDiasNoMes = Math.max(28, Math.min(31, parseInt(diasNoMes, 10) || 31));
  const numMargemPct = parseBRL(margemLucroMedia);

  const diasRestantes = Math.max(0, numDiasNoMes - numDiaAtual);
  const mediaDiariaPassada = numDiaAtual > 0 ? numFatAtual / numDiaAtual : 0;

  // Fatores de peso sazonal para os dias restantes (considerando o impulso do dia 20 - vale salarial)
  const getFactorRestante = () => {
    switch (curvaSazonalidade) {
      case 'dia20_forte':
        // Considera alta rotação no dia 20 (vale/adiantamento) (+20% de ritmo nos dias restantes)
        return 1.20;
      case 'forte':
        // Super pico de vendas (+35% de ritmo)
        return 1.35;
      case 'conservadora':
        // Fim de mês mais fraco (-15% de ritmo)
        return 0.85;
      case 'linear':
      default:
        // Mantém a exata média diária passada
        return 1.0;
    }
  };

  const fatorSazonal = getFactorRestante();
  const mediaDiariaProjetada = mediaDiariaPassada * fatorSazonal;
  const faturamentoRestanteProjetado = diasRestantes * mediaDiariaProjetada;
  const faturamentoTotalProjetado = numFatAtual + faturamentoRestanteProjetado;

  // Lucro Projetado
  const lucroTotalProjetado = (faturamentoTotalProjetado * numMargemPct) / 100;
  const lucroAtualAcumulado = (numFatAtual * numMargemPct) / 100;

  // Porcentagem do mês percorrida
  const pctMesPercorrido = (numDiaAtual / numDiasNoMes) * 100;

  // Funções de Salvar e Exportar
  const handleSaveProjection = () => {
    if (onSaveSimulation && numFatAtual > 0) {
      onSaveSimulation({
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        title: `Projeção Mensal (Faturado R$ ${numFatAtual.toFixed(2)} no dia ${numDiaAtual})`,
        marketplace: marketplace,
        precoVenda: faturamentoTotalProjetado,
        custoProd: faturamentoTotalProjetado - lucroTotalProjetado,
        lucro: lucroTotalProjetado,
        margemPct: numMargemPct,
        precoMargAlvo: faturamentoTotalProjetado
      });
      alert('✅ Projeção mensal salva com sucesso no histórico!');
    }
  };

  const handleExportCSV = () => {
    const headers = ["Métrica de Projeção Mensal", "Valor Calculado"];
    const rows = [
      ["Faturamento Acumulado Até Hoje", formatBRL(numFatAtual)],
      ["Dia Atual do Mês", `${numDiaAtual}º dia`],
      ["Total de Dias no Mês", `${numDiasNoMes} dias`],
      ["Média Diária Realizada (Passado)", formatBRL(mediaDiariaPassada)],
      ["Média Diária Projetada (Futuro)", formatBRL(mediaDiariaProjetada)],
      ["Comportamento Sazonal (Dia 5 / Dia 20)", curvaSazonalidade],
      ["PROJEÇÃO FINAL DE FATURAMENTO MENSAL", formatBRL(faturamentoTotalProjetado)],
      ["Margem Líquida Média", formatPct(numMargemPct)],
      ["PROJEÇÃO FINAL DE LUCRO LÍQUIDO MENSAL", formatBRL(lucroTotalProjetado)],
      ["Lucro Já Acumulado Até Hoje", formatBRL(lucroAtualAcumulado)],
    ];

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => `"${e[0]}";"${e[1]}"`)].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `projecao_mensal_faturamento_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="tab-panel">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '5px solid #A855F7' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              SIMULADOR DE RITMO &amp; SAZONALIDADE MENSAL 2026
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Projeção Mensal de Faturamento &amp; Lucro</h2>
            <p>Insira quanto você já faturou até o dia atual para projetar o resultado exato no final do mês.</p>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveProjection} style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <Bookmark size={14} /> Salvar Projeção
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleExportCSV} style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <FileSpreadsheet size={14} style={{ color: '#10B981' }} /> Exportar Excel
            </button>
            <button type="button" className="btn btn-outline no-print" onClick={handlePrintPDF} style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <Printer size={14} /> PDF
            </button>
          </div>
        </div>
      </div>

      <div className="alignment-grid">
        {/* Painel de Dados do Vendedor */}
        <div className="card">
          <div className="card-header">
            <h3><Calendar size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Dados das Vendas em Andamento</h3>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label>Faturamento Acumulado Até Hoje (R$)</label>
            <FormattedInput
              type="currency"
              id="faturamentoAtual"
              value={faturamentoAtual}
              onChange={e => setFaturamentoAtual(e.target.value)}
              placeholder="Ex: 10.000,00"
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Digite o valor total faturado desde o 1º dia do mês até hoje.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="form-group">
              <label>Dia Atual do Mês</label>
              <input
                type="number"
                className="text-input"
                value={diaAtual}
                onChange={e => setDiaAtual(e.target.value)}
                min="1"
                max="31"
                placeholder="Ex: 13"
              />
            </div>

            <div className="form-group">
              <label>Dias no Mês</label>
              <select className="select-input" value={diasNoMes} onChange={e => setDiasNoMes(e.target.value)}>
                <option value="31">31 Dias (Jan, Mar, Mai, Jul, Ago, Out, Dez)</option>
                <option value="30">30 Dias (Abr, Jun, Set, Nov)</option>
                <option value="28">28 Dias (Fevereiro)</option>
              </select>
            </div>
          </div>

          {/* Ajuste Fino de Sazonalidade */}
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label>Projeção da 2ª Quinzena (Comportamento do Dia 20)</label>
            <select className="select-input" value={curvaSazonalidade} onChange={e => setCurvaSazonalidade(e.target.value)}>
              <option value="dia20_forte">🔥 Padrão E-commerce — Impulso do Dia 20 (+20% no ritmo do vale/adiantamento)</option>
              <option value="forte">🚀 Super Alta Sazonalidade (+35% no ritmo final do mês)</option>
              <option value="linear">📊 Ritmo Constante (Manter exatamente a mesma média diária)</option>
              <option value="conservadora">📉 Conservador (-15% de desaquecimento de fim de mês)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Margem Líquida Média da Loja (%)</label>
            <FormattedInput
              type="decimal"
              id="margemLucroMedia"
              value={margemLucroMedia}
              onChange={e => setMargemLucroMedia(e.target.value)}
              placeholder="Ex: 20,0"
            />
          </div>
        </div>

        {/* Painel de Resultados da Projeção */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Card Principal de Faturamento Projetado */}
          <div className="card" style={{ borderTop: '4px solid #A855F7' }}>
            <div className="card-header">
              <h3><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Projeção Final de Faturamento no Fim do Mês
              </h3>
            </div>

            <div className="metrics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div className="metric-card" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div className="metric-title" style={{ color: '#C084FC' }}>Faturamento Projetado (Final do Mês)</div>
                <div className="metric-value" style={{ color: '#A855F7', fontSize: '1.55rem' }}>
                  {formatBRL(faturamentoTotalProjetado)}
                </div>
              </div>

              <div className="metric-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="metric-title" style={{ color: '#10B981' }}>Lucro Líquido Projetado (Final do Mês)</div>
                <div className="metric-value" style={{ color: '#10B981', fontSize: '1.55rem' }}>
                  {formatBRL(lucroTotalProjetado)}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Média Diária Realizada (Até Dia {numDiaAtual})</div>
                <div className="metric-value" style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>
                  {formatBRL(mediaDiariaPassada)} / dia
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">
                  Média Diária Projetada {diasRestantes > 0 ? `(Dias ${numDiaAtual + 1} ao ${numDiasNoMes})` : '(Mês Concluído)'}
                </div>
                <div className="metric-value" style={{ color: 'var(--warning)', fontSize: '1.15rem' }}>
                  {formatBRL(mediaDiariaProjetada)} / dia
                </div>
              </div>
            </div>

            {/* Barra Visual de Progresso do Mês */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Progresso do Mês: Dia {numDiaAtual} de {numDiasNoMes} ({pctMesPercorrido.toFixed(0)}% concluído)</span>
                <span>Faltam {diasRestantes} dias</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${pctMesPercorrido}%`,
                    background: 'linear-gradient(90deg, #A855F7 0%, #00F2FE 100%)'
                  }}
                />
              </div>
            </div>

            {/* Status Alert Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: numFatAtual > 0 ? 'var(--success-bg)' : 'var(--warning-bg)',
              border: `1px solid ${numFatAtual > 0 ? 'var(--success-border)' : 'var(--warning-border)'}`
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: numFatAtual > 0 ? 'var(--success)' : 'var(--warning)' }}>
                {numFatAtual > 0
                  ? `🚀 Com R$ ${numFatAtual.toFixed(2)} faturados até o dia ${numDiaAtual}, você está no ritmo para fechar o mês em ${formatBRL(faturamentoTotalProjetado)}!`
                  : '💡 Digite o valor faturado até hoje para ver a projeção do final do mês.'}
              </div>
            </div>
          </div>

          {/* DRE Simplificado do Mês Projetado */}
          <div className="card">
            <div className="card-header">
              <h3>📊 Resumo Financeiro da Projeção Mensal</h3>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div className="dre-row">
                <span>(+) Faturamento Acumulado (Dia 1 ao {numDiaAtual}):</span>
                <span style={{ fontWeight: 700 }}>{formatBRL(numFatAtual)}</span>
              </div>
              <div className="dre-row" style={{ color: 'var(--warning)' }}>
                <span>(+) Faturamento Estimado (Dia {numDiaAtual + 1} ao {numDiasNoMes}):</span>
                <span style={{ fontWeight: 700 }}>+ {formatBRL(faturamentoRestanteProjetado)}</span>
              </div>
              <div className="dre-row total" style={{ color: 'var(--text-primary)' }}>
                <span>(=) Faturamento Total Projetado no Mês:</span>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{formatBRL(faturamentoTotalProjetado)}</span>
              </div>
              <div className="dre-row" style={{ color: 'var(--success)', fontWeight: 700, paddingTop: '0.3rem' }}>
                <span>(=) Lucro Líquido Estimado ({formatPct(numMargemPct)}):</span>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{formatBRL(lucroTotalProjetado)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
