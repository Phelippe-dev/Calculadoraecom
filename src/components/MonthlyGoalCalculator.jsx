import React, { useState } from 'react';
import { 
  TrendingUp, Calendar, Bookmark, FileSpreadsheet, 
  Printer, Zap, ShoppingBag, Video, RotateCcw
} from 'lucide-react';
import FormattedInput from './FormattedInput';
import { parseBRL, formatBRL, formatPct } from './PricingCalculator';

export default function MonthlyGoalCalculator({ onSaveSimulation }) {
  // Configurações Globais (Tempo e Sazonalidade)
  const [diaAtual, setDiaAtual] = useState('');
  const [diasNoMes, setDiasNoMes] = useState('31');
  const [curvaSazonalidade, setCurvaSazonalidade] = useState('dia20_forte');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dados por Marketplace
  const [fatML, setFatML] = useState('');
  const [margemML, setMargemML] = useState('');
  const [metaML, setMetaML] = useState('');

  const [fatShopee, setFatShopee] = useState('');
  const [margemShopee, setMargemShopee] = useState('');
  const [metaShopee, setMetaShopee] = useState('');

  const [fatTikTok, setFatTikTok] = useState('');
  const [margemTikTok, setMargemTikTok] = useState('');
  const [metaTikTok, setMetaTikTok] = useState('');

  // Processamento de Tempo
  const rawDiaAtual = parseInt(diaAtual, 10);
  const numDiaAtual = isNaN(rawDiaAtual) ? 1 : Math.max(1, Math.min(31, rawDiaAtual));
  const numDiasNoMes = Math.max(28, Math.min(31, parseInt(diasNoMes, 10) || 31));
  const diasRestantes = Math.max(0, numDiasNoMes - numDiaAtual);
  const pctMesPercorrido = (numDiaAtual / numDiasNoMes) * 100;

  // Botão Rápido: Usar Data de Hoje
  const handleUseToday = () => {
    const now = new Date();
    setDiaAtual(String(now.getDate()));
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    setDiasNoMes(String(lastDay));
  };

  // Botão Rápido: Limpar Campos
  const handleClear = () => {
    setFatML(''); setMargemML(''); setMetaML('');
    setFatShopee(''); setMargemShopee(''); setMetaShopee('');
    setFatTikTok(''); setMargemTikTok(''); setMetaTikTok('');
  };

  // Fatores Sazonais
  const getFactorRestante = () => {
    switch (curvaSazonalidade) {
      case 'dia20_forte': return 1.20;
      case 'forte': return 1.35;
      case 'conservadora': return 0.85;
      case 'linear': default: return 1.0;
    }
  };
  const fatorSazonal = getFactorRestante();

  // Função Base de Projeção com Run Rate e Diferencial de Ritmo
  const calcProjection = (fatStr, margemStr, metaStr, customFactor = fatorSazonal) => {
    const fat = parseBRL(fatStr);
    const margem = parseBRL(margemStr);
    const meta = parseBRL(metaStr);

    const mediaPassada = numDiaAtual > 0 ? fat / numDiaAtual : 0;
    const mediaProjetada = mediaPassada * customFactor;
    const faturamentoRestante = diasRestantes * mediaProjetada;
    const projecaoFinal = fat + faturamentoRestante;
    const lucroFinal = (projecaoFinal * margem) / 100;
    const atingimentoMeta = meta > 0 ? (projecaoFinal / meta) * 100 : 0;

    // Cálculo do Ritmo Diário Necessário para bater a meta
    const faltaParaMeta = Math.max(0, meta - fat);
    const ritmoNecessario = diasRestantes > 0 ? faltaParaMeta / diasRestantes : 0;
    const diferencaRitmo = mediaProjetada - ritmoNecessario;

    return { 
      fat, margem, meta, 
      mediaPassada, mediaProjetada, faturamentoRestante, 
      projecaoFinal, lucroFinal, atingimentoMeta,
      faltaParaMeta, ritmoNecessario, diferencaRitmo
    };
  };

  const projML = calcProjection(fatML, margemML, metaML);
  const projShopee = calcProjection(fatShopee, margemShopee, metaShopee);
  const projTikTok = calcProjection(fatTikTok, margemTikTok, metaTikTok);

  // Totais da Empresa
  const totalFatAtual = projML.fat + projShopee.fat + projTikTok.fat;
  const totalMeta = projML.meta + projShopee.meta + projTikTok.meta;
  const totalProjecaoFinal = projML.projecaoFinal + projShopee.projecaoFinal + projTikTok.projecaoFinal;
  const totalLucroFinal = projML.lucroFinal + projShopee.lucroFinal + projTikTok.lucroFinal;

  const mediaPassadaTotal = numDiaAtual > 0 ? totalFatAtual / numDiaAtual : 0;
  const mediaProjetadaTotal = projML.mediaProjetada + projShopee.mediaProjetada + projTikTok.mediaProjetada;
  const totalFaltaParaMeta = Math.max(0, totalMeta - totalFatAtual);
  const ritmoNecessarioTotal = diasRestantes > 0 ? totalFaltaParaMeta / diasRestantes : 0;
  const diferencaRitmoTotal = mediaProjetadaTotal - ritmoNecessarioTotal;

  const totalAtingimento = totalMeta > 0 ? (totalProjecaoFinal / totalMeta) * 100 : 0;
  const totalMargemMedia = totalProjecaoFinal > 0 ? (totalLucroFinal / totalProjecaoFinal) * 100 : 0;

  // Análise de Cenários Globais (Sensibilidade)
  const calcCenario = (fator) => {
    const ml = calcProjection(fatML, margemML, metaML, fator);
    const sh = calcProjection(fatShopee, margemShopee, metaShopee, fator);
    const tk = calcProjection(fatTikTok, margemTikTok, metaTikTok, fator);
    const fatTotal = ml.projecaoFinal + sh.projecaoFinal + tk.projecaoFinal;
    const lucroTotal = ml.lucroFinal + sh.lucroFinal + tk.lucroFinal;
    return { fatTotal, lucroTotal };
  };

  const cenarioConservador = calcCenario(0.85);
  const cenarioBase = { fatTotal: totalProjecaoFinal, lucroTotal: totalLucroFinal };
  const cenarioAcelerado = calcCenario(1.25);

  // Share de Canais (% do Faturamento)
  const shareML = totalProjecaoFinal > 0 ? (projML.projecaoFinal / totalProjecaoFinal) * 100 : 0;
  const shareShopee = totalProjecaoFinal > 0 ? (projShopee.projecaoFinal / totalProjecaoFinal) * 100 : 0;
  const shareTikTok = totalProjecaoFinal > 0 ? (projTikTok.projecaoFinal / totalProjecaoFinal) * 100 : 0;

  // Salvar Simulação de Projeção
  const handleSaveProjection = () => {
    if (totalProjecaoFinal === 0) return;
    
    if (onSaveSimulation) {
      onSaveSimulation({
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        title: `Projeção Consolidada (Dia ${numDiaAtual}/${numDiasNoMes})`,
        marketplace: 'consolidado',
        precoVenda: totalProjecaoFinal,
        custoProd: Math.max(0, totalProjecaoFinal - totalLucroFinal),
        lucro: totalLucroFinal,
        margemPct: totalMargemMedia,
        precoMargAlvo: totalMeta > 0 ? totalMeta : totalProjecaoFinal
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Canal", "Faturado Atual", "Ritmo Atual/Dia", "Meta Mensal", "Ritmo Necessário/Dia", "Projeção Final", "Margem", "Lucro Projetado", "% Atingimento"];
    const rows = [
      ["Mercado Livre", formatBRL(projML.fat), formatBRL(projML.mediaPassada), formatBRL(projML.meta), formatBRL(projML.ritmoNecessario), formatBRL(projML.projecaoFinal), formatPct(projML.margem), formatBRL(projML.lucroFinal), `${projML.atingimentoMeta.toFixed(1)}%`],
      ["Shopee", formatBRL(projShopee.fat), formatBRL(projShopee.mediaPassada), formatBRL(projShopee.meta), formatBRL(projShopee.ritmoNecessario), formatBRL(projShopee.projecaoFinal), formatPct(projShopee.margem), formatBRL(projShopee.lucroFinal), `${projShopee.atingimentoMeta.toFixed(1)}%`],
      ["TikTok Shop", formatBRL(projTikTok.fat), formatBRL(projTikTok.mediaPassada), formatBRL(projTikTok.meta), formatBRL(projTikTok.ritmoNecessario), formatBRL(projTikTok.projecaoFinal), formatPct(projTikTok.margem), formatBRL(projTikTok.lucroFinal), `${projTikTok.atingimentoMeta.toFixed(1)}%`],
      ["CONSOLIDADO DA EMPRESA", formatBRL(totalFatAtual), formatBRL(mediaPassadaTotal), formatBRL(totalMeta), formatBRL(ritmoNecessarioTotal), formatBRL(totalProjecaoFinal), formatPct(totalMargemMedia), formatBRL(totalLucroFinal), `${totalAtingimento.toFixed(1)}%`]
    ];

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => `"${e[0]}";"${e[1]}";"${e[2]}";"${e[3]}";"${e[4]}";"${e[5]}";"${e[6]}";"${e[7]}";"${e[8]}"`)].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `projecao_financeira_ecommerce_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatusBadge = (proj) => {
    if (!proj.meta || proj.meta === 0) return null;
    if (proj.fat >= proj.meta) {
      return (
        <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          🏆 Meta Batida!
        </span>
      );
    }
    if (proj.diferencaRitmo >= 0) {
      return (
        <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          🚀 No Ritmo (+{formatBRL(proj.diferencaRitmo)}/dia)
        </span>
      );
    }
    return (
      <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        ⚠️ Acelerar (-{formatBRL(Math.abs(proj.diferencaRitmo))}/dia)
      </span>
    );
  };

  const RenderMarketplaceCard = ({ title, icon, color, accentBg, proj, setFat, setMargem, setMeta, fatStr, margemStr, metaStr }) => (
    <div style={{ border: `1px solid ${color}40`, borderRadius: 'var(--radius-md)', padding: '1rem', background: accentBg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontWeight: 700 }}>
            {icon} {title}
          </div>
          {renderStatusBadge(proj)}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', display: 'block' }}>Faturado Até Hoje (R$)</label>
            <FormattedInput type="currency" value={fatStr} onChange={e => setFat(e.target.value)} placeholder="0,00" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', display: 'block' }}>Margem Média (%)</label>
              <FormattedInput type="decimal" value={margemStr} onChange={e => setMargem(e.target.value)} placeholder="0,0" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', display: 'block' }}>Meta Mensal (R$)</label>
              <FormattedInput type="currency" value={metaStr} onChange={e => setMeta(e.target.value)} placeholder="Opcional" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projeção Final</span>
          {proj.meta > 0 && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: proj.atingimentoMeta >= 100 ? 'var(--success)' : 'var(--warning)' }}>
              {proj.atingimentoMeta.toFixed(1)}% da Meta
            </span>
          )}
        </div>
        
        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          {formatBRL(proj.projecaoFinal)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Lucro Projetado:</span>
          <strong style={{ color: 'var(--success)' }}>{formatBRL(proj.lucroFinal)}</strong>
        </div>

        {/* Ritmo Diário */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          <span>Ritmo Atual: {formatBRL(proj.mediaPassada)}/dia</span>
          {proj.meta > 0 && diasRestantes > 0 && proj.faltaParaMeta > 0 && (
            <span style={{ color: proj.diferencaRitmo >= 0 ? '#60A5FA' : 'var(--danger)' }}>
              Precisa: {formatBRL(proj.ritmoNecessario)}/dia
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="tab-panel">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '5px solid #A855F7' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              PLANEJAMENTO &amp; PROJEÇÃO 2026
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Painel de Projeção &amp; Metas Multi-Canal</h2>
            <p>Acompanhe o ritmo diário das vendas, compare com suas metas e projete o fechamento de caixa agrupando Mercado Livre, Shopee e TikTok Shop.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSaveProjection} 
              disabled={totalProjecaoFinal === 0}
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
            >
              <Bookmark size={14} /> {savedSuccess ? 'Salvo no Histórico!' : 'Salvar Projeção'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleExportCSV} style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <FileSpreadsheet size={14} style={{ color: '#10B981' }} /> Exportar Excel
            </button>
            <button type="button" className="btn btn-outline no-print" onClick={() => window.print()} style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}>
              <Printer size={14} /> PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* PARÂMETROS GLOBAIS DE TEMPO */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: '#A855F7' }} /> Configurações de Tempo e Sazonalidade
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={handleUseToday} 
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', color: '#A855F7', borderColor: 'rgba(168, 85, 247, 0.4)' }}
              >
                📅 Usar Data de Hoje
              </button>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={handleClear} 
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              >
                <RotateCcw size={13} /> Limpar
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <div className="form-group">
              <label>Dia Atual do Mês (1 a 31)</label>
              <input 
                type="number" 
                className="text-input" 
                value={diaAtual} 
                onChange={e => setDiaAtual(e.target.value)} 
                min="1" 
                max="31" 
                placeholder="Ex: 10" 
              />
            </div>
            <div className="form-group">
              <label>Total de Dias no Mês</label>
              <select className="select-input" value={diasNoMes} onChange={e => setDiasNoMes(e.target.value)}>
                <option value="31">31 Dias (Jan, Mar, Mai, Jul, Ago, Out, Dez)</option>
                <option value="30">30 Dias (Abr, Jun, Set, Nov)</option>
                <option value="28">28 Dias (Fevereiro)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Curva de Sazonalidade (Dias Restantes)</label>
              <select className="select-input" value={curvaSazonalidade} onChange={e => setCurvaSazonalidade(e.target.value)}>
                <option value="dia20_forte">🔥 Padrão E-commerce (+20% ritmo na 2ª quinzena)</option>
                <option value="forte">🚀 Super Alta (+35% no ritmo final)</option>
                <option value="linear">📊 Linear (Manter média exata)</option>
                <option value="conservadora">📉 Conservador (-15% de desaquecimento)</option>
              </select>
            </div>
          </div>
        </div>

        {/* COLUNAS DE MARKETPLACES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <RenderMarketplaceCard 
            title="Mercado Livre" icon={<Zap size={18} />} color="#FBBF24" accentBg="rgba(251, 191, 36, 0.05)"
            proj={projML} setFat={setFatML} setMargem={setMargemML} setMeta={setMetaML}
            fatStr={fatML} margemStr={margemML} metaStr={metaML}
          />
          <RenderMarketplaceCard 
            title="Shopee" icon={<ShoppingBag size={18} />} color="#F97316" accentBg="rgba(249, 115, 22, 0.05)"
            proj={projShopee} setFat={setFatShopee} setMargem={setMargemShopee} setMeta={setMetaShopee}
            fatStr={fatShopee} margemStr={margemShopee} metaStr={metaShopee}
          />
          <RenderMarketplaceCard 
            title="TikTok Shop" icon={<Video size={18} />} color="#06B6D4" accentBg="rgba(6, 182, 212, 0.05)"
            proj={projTikTok} setFat={setFatTikTok} setMargem={setMargemTikTok} setMeta={setMetaTikTok}
            fatStr={fatTikTok} margemStr={margemTikTok} metaStr={metaTikTok}
          />
        </div>

        {/* CONSOLIDADO DA EMPRESA */}
        <div className="card" style={{ borderTop: '4px solid #A855F7' }}>
          <div className="card-header">
            <h3><TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#A855F7' }} />
              Painel Executivo Consolidado (Visão Global da Empresa)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: '#C084FC', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Faturamento Projetado</div>
              <div style={{ color: '#A855F7', fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>{formatBRL(totalProjecaoFinal)}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                Faturado até hoje: <strong>{formatBRL(totalFatAtual)}</strong> ({pctMesPercorrido.toFixed(0)}% do mês)
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Lucro Líquido Projetado</div>
              <div style={{ color: '#10B981', fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>{formatBRL(totalLucroFinal)}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                Margem Líquida Média: <strong>{formatPct(totalMargemMedia)}</strong>
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Ritmo de Vendas Diário</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>
                {formatBRL(mediaPassadaTotal)} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ dia realizado</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                Projeção restante: <strong>{formatBRL(mediaProjetadaTotal)} / dia</strong>
              </div>
            </div>

            {totalMeta > 0 && (
              <div style={{ 
                background: totalAtingimento >= 100 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                border: `1px solid ${totalAtingimento >= 100 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`, 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)' 
              }}>
                <div style={{ color: totalAtingimento >= 100 ? 'var(--success)' : 'var(--warning)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Atingimento da Meta Global
                </div>
                <div style={{ color: totalAtingimento >= 100 ? 'var(--success)' : 'var(--warning)', fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>
                  {totalAtingimento.toFixed(1)}%
                </div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                  Meta Total: <strong>{formatBRL(totalMeta)}</strong>
                  {diasRestantes > 0 && totalFaltaParaMeta > 0 && (
                    <div style={{ marginTop: '0.2rem', fontSize: '0.76rem', color: diferencaRitmoTotal >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {diferencaRitmoTotal >= 0 
                        ? `🚀 Ritmo suficiente (+${formatBRL(diferencaRitmoTotal)}/dia)` 
                        : `⚠️ Faltam ${formatBRL(ritmoNecessarioTotal)}/dia (+${formatBRL(Math.abs(diferencaRitmoTotal))}/dia p/ bater)`}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Share de Canais (Distribuição Visual de Faturamento) */}
          {totalProjecaoFinal > 0 && (
            <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Composição do Faturamento por Canal (Share)
                </span>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                  <span style={{ color: '#FBBF24' }}>● ML: {shareML.toFixed(1)}%</span>
                  <span style={{ color: '#F97316' }}>● Shopee: {shareShopee.toFixed(1)}%</span>
                  <span style={{ color: '#06B6D4' }}>● TikTok: {shareTikTok.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', background: 'var(--bg-input)' }}>
                <div style={{ width: `${shareML}%`, background: '#FBBF24', transition: 'width 0.4s ease' }} title={`Mercado Livre: ${shareML.toFixed(1)}%`} />
                <div style={{ width: `${shareShopee}%`, background: '#F97316', transition: 'width 0.4s ease' }} title={`Shopee: ${shareShopee.toFixed(1)}%`} />
                <div style={{ width: `${shareTikTok}%`, background: '#06B6D4', transition: 'width 0.4s ease' }} title={`TikTok Shop: ${shareTikTok.toFixed(1)}%`} />
              </div>
            </div>
          )}

          {/* Análise de Cenários Comparativos */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📊 Análise de Sensibilidade da Empresa (Cenários de Fechamento)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 700 }}>📉 Cenário Conservador (-15%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {formatBRL(cenarioConservador.fatTotal)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Lucro: {formatBRL(cenarioConservador.lucroTotal)}
                </div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#C084FC', fontWeight: 700 }}>🎯 Cenário Base (Ritmo Projetado)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#A855F7', marginTop: '0.2rem' }}>
                  {formatBRL(cenarioBase.fatTotal)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Lucro: {formatBRL(cenarioBase.lucroTotal)}
                </div>
              </div>

              <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>🚀 Cenário Acelerado (+25%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {formatBRL(cenarioAcelerado.fatTotal)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Lucro: {formatBRL(cenarioAcelerado.lucroTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Barra Visual de Progresso do Mês */}
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              <span>Progresso do Mês: Dia {isNaN(rawDiaAtual) ? '-' : numDiaAtual} de {numDiasNoMes} ({isNaN(rawDiaAtual) ? '0' : pctMesPercorrido.toFixed(0)}% concluído)</span>
              <span>Faltam {isNaN(rawDiaAtual) ? '-' : diasRestantes} dias úteis/corridos</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${isNaN(rawDiaAtual) ? 0 : pctMesPercorrido}%`,
                  background: 'linear-gradient(90deg, #A855F7 0%, #00F2FE 100%)'
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
