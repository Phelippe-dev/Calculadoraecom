import React, { useState } from 'react';
import { Award, Zap, ShoppingBag, Video, DollarSign, AlertTriangle } from 'lucide-react';
import FormattedInput from './FormattedInput';
import { SHOPEE_FAIXAS, parseBRL, formatBRL, formatPct } from './PricingCalculator';

export default function MarketplaceComparator() {
  // Inicializados totalmente limpos
  const [custoProd, setCustoProd] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [embalagem, setEmbalagem] = useState('');
  const [imposto, setImposto] = useState('');

  const numPreco = parseBRL(precoVenda);
  const numCusto = parseBRL(custoProd);
  const numEmb = parseBRL(embalagem);
  const numImp = parseBRL(imposto);

  // 1. Mercado Livre Calculation (Standard Premium, Verde Escuro, Full, 500g-1kg)
  const calcML = () => {
    const pctComissao = 16.0; // Premium Geral
    const freteBase = 24.50; // 500g - 1kg
    const descFretePct = 40; // Verde escuro

    let taxaFixa = 0;
    let custoFrete = 0;

    if (numPreco > 0 && numPreco < 79.00) {
      taxaFixa = freteBase * 0.32;
    } else if (numPreco >= 79.00) {
      custoFrete = freteBase * ((100 - descFretePct) / 100) * 0.92; // Full
    }

    const valorComissao = (numPreco * pctComissao) / 100;
    const valorImposto = (numPreco * numImp) / 100;
    const totalCustos = valorComissao + taxaFixa + custoFrete + valorImposto + numEmb + numCusto;
    const lucro = numPreco > 0 ? numPreco - totalCustos : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    return {
      key: 'ml',
      name: 'Mercado Livre',
      badgeClass: 'badge-ml',
      accentColor: 'var(--ml-yellow)',
      accentBg: 'var(--ml-yellow-bg)',
      icon: <Zap size={18} style={{ color: 'var(--ml-yellow)' }} />,
      pctComissao,
      taxasPlataforma: valorComissao + taxaFixa + custoFrete,
      valorImposto,
      totalCustos,
      lucro,
      margemPct,
      detalheTaxas: `Comissão ${pctComissao}% + ${taxaFixa > 0 ? `Taxa ${formatBRL(taxaFixa)}` : `Frete ${formatBRL(custoFrete)}`}`
    };
  };

  // 2. Shopee Calculation (CNPJ, Tabela Oficial Faixas)
  const calcShopee = () => {
    const faixa = SHOPEE_FAIXAS.find(f => numPreco >= f.min && numPreco <= f.max) || SHOPEE_FAIXAS[0];
    let pctTotal = faixa.comissao;
    let taxaFixa = faixa.taxaFixa;

    const valorComissao = (numPreco * pctTotal) / 100;
    const valorImposto = (numPreco * numImp) / 100;
    const totalCustos = valorComissao + taxaFixa + valorImposto + numEmb + numCusto;
    const lucro = numPreco > 0 ? numPreco - totalCustos : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    return {
      key: 'shopee',
      name: 'Shopee Brasil',
      badgeClass: 'badge-shopee',
      accentColor: 'var(--shopee-orange)',
      accentBg: 'var(--shopee-orange-bg)',
      icon: <ShoppingBag size={18} style={{ color: 'var(--shopee-orange)' }} />,
      pctComissao: pctTotal,
      taxasPlataforma: valorComissao + taxaFixa,
      valorImposto,
      totalCustos,
      lucro,
      margemPct,
      detalheTaxas: `${faixa.label}: ${faixa.comissao}% + Taxa ${formatBRL(taxaFixa)}`
    };
  };

  // 3. TikTok Shop Calculation (Regra oficial 2026: 10% < R$50 | 6% >= R$50 + Frete Coparticipado 6%)
  const calcTikTok = () => {
    const pctComissao = numPreco < 50.00 ? 10.0 : 6.0;
    const taxaFixa = numPreco < 50.00 ? 4.00 : 6.00;
    const freteGratis = Math.min((numPreco * 6.0) / 100, 50.00);

    const valorComissao = (numPreco * pctComissao) / 100;
    const valorImposto = (numPreco * numImp) / 100;
    const totalCustos = valorComissao + taxaFixa + freteGratis + valorImposto + numEmb + numCusto;
    const lucro = numPreco > 0 ? numPreco - totalCustos : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    return {
      key: 'tiktok',
      name: 'TikTok Shop',
      badgeClass: 'badge-tiktok',
      accentColor: 'var(--tiktok-cyan)',
      accentBg: 'var(--tiktok-cyan-bg)',
      icon: <Video size={18} style={{ color: 'var(--tiktok-cyan)' }} />,
      pctComissao,
      taxasPlataforma: valorComissao + taxaFixa + freteGratis,
      valorImposto,
      totalCustos,
      lucro,
      margemPct,
      detalheTaxas: `Comissão ${pctComissao}% + Taxa ${formatBRL(taxaFixa)} + Frete 6%`
    };
  };

  const results = [calcML(), calcShopee(), calcTikTok()];

  // Find winner (highest profit among ML, Shopee, TikTok)
  const winner = results.reduce((max, curr) => curr.lucro > max.lucro ? curr : max, results[0]);

  return (
    <div className="tab-panel">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '5px solid var(--accent)' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge badge-success">
              MATRIZ COMPARATIVA DE MARGEM &amp; LUCRO LADO A LADO
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Comparador Multi-Marketplace Simultâneo</h2>
            <p>Compare as margens reais entre Mercado Livre, Shopee e TikTok Shop para o mesmo produto.</p>
          </div>
        </div>
      </div>

      {/* Explicit Clarification Banner */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.25rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4'
      }}>
        <div style={{ fontWeight: 700, color: 'var(--warning)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <AlertTriangle size={15} /> AVISO IMPORTANTE SOBRE O COMPARATIVO:
        </div>
        Este comparador analisa rigorosamente as <strong>comissões oficiais, tarifas fixas por item, fretes base e alíquota de imposto</strong> de cada plataforma. 
        <strong> NÃO estão inclusos cupons patrocinados pelo vendedor nem orçamento de tráfego pago (Mercado Ads, Shopee Ads ou TikTok Ads)</strong>, pois estes investimentos de mídia dependem da estratégia individual de cada loja.
      </div>

      {/* Inputs Globais */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3><DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Parâmetros Gerais do Produto</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          <div className="form-group">
            <label>Custo do Produto (CMV)</label>
            <FormattedInput type="currency" id="compCusto" value={custoProd} onChange={e => setCustoProd(e.target.value)} placeholder="Ex: 35,00" />
          </div>
          <div className="form-group">
            <label>Preço de Venda Simulado</label>
            <FormattedInput type="currency" id="compPreco" value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} placeholder="Ex: 89,90" />
          </div>
          <div className="form-group">
            <label>Embalagem e Insumos</label>
            <FormattedInput type="currency" id="compEmb" value={embalagem} onChange={e => setEmbalagem(e.target.value)} placeholder="Ex: 3,00" />
          </div>
          <div className="form-group">
            <label>Imposto Simples (%)</label>
            <FormattedInput type="decimal" id="compImp" value={imposto} onChange={e => setImposto(e.target.value)} placeholder="Ex: 6,0" />
          </div>
        </div>
      </div>

      {/* Results Comparison Grid */}
      <div className="comparator-grid">
        {results.map((item) => {
          const isWinner = winner.key === item.key && item.lucro > 0 && numPreco > 0;
          return (
            <div
              key={item.key}
              className={`compare-card ${isWinner ? 'winner' : ''}`}
              style={{ borderTop: `4px solid ${item.accentColor}` }}
            >
              {isWinner && (
                <div className="winner-ribbon">
                  <Award size={13} /> Campeão de Margem
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
                <div style={{ padding: '0.5rem', background: item.accentBg, borderRadius: 'var(--radius-sm)' }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.detalheTaxas}</p>
                </div>
              </div>

              {/* Profit & Margin display */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Lucro Líquido Real
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.lucro >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '0.2rem' }}>
                  {formatBRL(item.lucro)}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: item.lucro >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '0.1rem' }}>
                  Margem: {formatPct(item.margemPct)}
                </div>
              </div>

              {/* Fee Breakdown list */}
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="dre-row">
                  <span>Preço de Venda:</span>
                  <span style={{ fontWeight: 600 }}>{formatBRL(numPreco)}</span>
                </div>
                <div className="dre-row" style={{ color: 'var(--danger)' }}>
                  <span>Taxas da Plataforma:</span>
                  <span>− {formatBRL(item.taxasPlataforma)}</span>
                </div>
                <div className="dre-row" style={{ color: 'var(--danger)' }}>
                  <span>Custo CMV + Emb:</span>
                  <span>− {formatBRL(numCusto + numEmb)}</span>
                </div>
                <div className="dre-row" style={{ color: 'var(--danger)' }}>
                  <span>Imposto ({numImp}%):</span>
                  <span>− {formatBRL(item.valorImposto)}</span>
                </div>
                <div className="dre-row total" style={{ color: item.lucro >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  <span>Retorno sobre Custo (ROI):</span>
                  <span>{numCusto > 0 && item.lucro > 0 ? formatPct((item.lucro / numCusto) * 100) : '0,00%'}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
