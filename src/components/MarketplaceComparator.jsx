import React, { useState } from 'react';
import { Award, Zap, ShoppingBag, Video, Package, Shirt, DollarSign, AlertTriangle } from 'lucide-react';
import FormattedInput from './FormattedInput';
import { 
  SHOPEE_FAIXAS, parseBRL, formatBRL, formatPct, 
  ML_CATEGORIAS, AMAZON_CATEGORIAS, SHEIN_CATEGORIAS 
} from './PricingCalculator';

export default function MarketplaceComparator() {
  // Inicializados totalmente limpos
  const [custoProd, setCustoProd] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [embalagem, setEmbalagem] = useState('');
  const [imposto, setImposto] = useState('');
  
  // Categorias específicas
  const [mlCategoria, setMlCategoria] = useState(0);
  const [mlTipoAnuncio, setMlTipoAnuncio] = useState('premium');
  const [amazonCategoria, setAmazonCategoria] = useState(0);
  const [sheinCategoria, setSheinCategoria] = useState(0);

  const numPreco = parseBRL(precoVenda);
  const numCusto = parseBRL(custoProd);
  const numEmb = parseBRL(embalagem);
  const numImp = parseBRL(imposto);

  // 1. Mercado Livre Calculation (Standard Premium, Verde Escuro, Full, 500g-1kg)
  const calcML = () => {
    const cat = ML_CATEGORIAS[mlCategoria] || ML_CATEGORIAS[0];
    const pctComissao = mlTipoAnuncio === 'premium' ? cat.premium : cat.classico;
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

    if (numPreco > 0 && numPreco < 8.99) {
      taxaFixa = Math.min(faixa.taxaFixa, numPreco * 0.50);
    }

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

  // 4. Amazon Brasil Calculation (Plano Pro, DBA Logística 300g-500g)
  const calcAmazon = () => {
    const cat = AMAZON_CATEGORIAS[amazonCategoria] || AMAZON_CATEGORIAS[0];
    const pctComissao = cat.comissao;
    const freteDBA = 15.90; // Faixa padrão 300g a 500g

    const valorComissao = numPreco > 0 ? Math.max(1.00, (numPreco * pctComissao) / 100) : 0;
    const valorImposto = (numPreco * numImp) / 100;
    const totalCustos = valorComissao + freteDBA + valorImposto + numEmb + numCusto;
    const lucro = numPreco > 0 ? numPreco - totalCustos : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    return {
      key: 'amazon',
      name: 'Amazon Brasil',
      badgeClass: 'badge-amazon',
      accentColor: 'var(--amazon-orange)',
      accentBg: 'var(--amazon-orange-bg)',
      icon: <Package size={18} style={{ color: 'var(--amazon-orange)' }} />,
      pctComissao,
      taxasPlataforma: valorComissao + freteDBA,
      valorImposto,
      totalCustos,
      lucro,
      margemPct,
      detalheTaxas: `${cat.label.slice(0, 24)}: ${pctComissao}% + Frete DBA ${formatBRL(freteDBA)}`
    };
  };

  // 5. Shein Brasil Calculation (Envio Integrado 300g-500g, Sem taxa fixa)
  const calcShein = () => {
    const cat = SHEIN_CATEGORIAS[sheinCategoria] || SHEIN_CATEGORIAS[0];
    const pctComissao = cat.comissao;
    const freteShein = 13.90; // Faixa padrão 300g a 500g

    const valorComissao = (numPreco * pctComissao) / 100;
    const valorImposto = (numPreco * numImp) / 100;
    const totalCustos = valorComissao + freteShein + valorImposto + numEmb + numCusto;
    const lucro = numPreco > 0 ? numPreco - totalCustos : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    return {
      key: 'shein',
      name: 'Shein Brasil',
      badgeClass: 'badge-shein',
      accentColor: 'var(--shein-pink)',
      accentBg: 'var(--shein-pink-bg)',
      icon: <Shirt size={18} style={{ color: 'var(--shein-pink)' }} />,
      pctComissao,
      taxasPlataforma: valorComissao + freteShein,
      valorImposto,
      totalCustos,
      lucro,
      margemPct,
      detalheTaxas: `${cat.label}: ${pctComissao}% (Sem Taxa Fixa) + Frete ${formatBRL(freteShein)}`
    };
  };

  const results = [calcML(), calcShopee(), calcTikTok(), calcAmazon(), calcShein()];

  // Find winner (highest profit among all 5 marketplaces)
  const winner = results.reduce((max, curr) => curr.lucro > max.lucro ? curr : max, results[0]);

  return (
    <div className="tab-panel">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '5px solid var(--accent)' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge badge-success">
              MATRIZ COMPARATIVA DE MARGEM &amp; LUCRO LADO A LADO (5 MARKETPLACES)
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Comparador Multi-Marketplace Simultâneo</h2>
            <p>Compare as margens reais entre Mercado Livre, Shopee, TikTok Shop, Amazon e Shein para o mesmo produto.</p>
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
        Este comparador analisa rigorosamente as <strong>comissões oficiais, tarifas fixas por item, fretes logísticos base (300g-500g) e alíquota de imposto</strong> de cada plataforma com as regras vigentes de 2026. 
        <strong> NÃO estão inclusos cupons de desconto concedidos pelo vendedor nem orçamento de tráfego pago (Ads)</strong>, permitindo uma comparação limpa de viabilidade orgânica de cada marketplace.
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

      {/* Configurações Específicas por Categoria */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>Categorias Específicas do Produto</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Defina a categoria em que o produto concorre em cada marketplace</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ml-yellow)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={14} /> Categoria Mercado Livre
            </label>
            <select className="select-input" value={mlCategoria} onChange={e => setMlCategoria(Number(e.target.value))}>
              {ML_CATEGORIAS.map((c, i) => (
                <option key={i} value={i}>{c.label} ({c.classico}% / {c.premium}%)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ml-yellow)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={14} /> Tipo Anúncio ML
            </label>
            <select className="select-input" value={mlTipoAnuncio} onChange={e => setMlTipoAnuncio(e.target.value)}>
              <option value="classico">Clássico (10% a 14%)</option>
              <option value="premium">Premium (15% a 19%)</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--amazon-orange)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Package size={14} /> Categoria Amazon Brasil
            </label>
            <select className="select-input" value={amazonCategoria} onChange={e => setAmazonCategoria(Number(e.target.value))}>
              {AMAZON_CATEGORIAS.map((c, i) => (
                <option key={i} value={i}>{c.label} ({c.comissao}%)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--shein-pink)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Shirt size={14} /> Categoria Shein Brasil
            </label>
            <select className="select-input" value={sheinCategoria} onChange={e => setSheinCategoria(Number(e.target.value))}>
              {SHEIN_CATEGORIAS.map((c, i) => (
                <option key={i} value={i}>{c.label} ({c.comissao}%)</option>
              ))}
            </select>
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
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{item.detalheTaxas}</p>
                </div>
              </div>

              {/* Profit & Margin display */}
              <div style={{ padding: '0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Lucro Líquido Real
                </div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: item.lucro >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '0.2rem' }}>
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
