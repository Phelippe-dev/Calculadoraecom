import React, { useState } from 'react';
import { Target, Zap, ShoppingBag, Video, DollarSign, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import FormattedInput from './FormattedInput';
import { SHOPEE_FAIXAS, ML_CATEGORIAS, ML_FRETE_BASE, ML_REPUTACAO, parseBRL, formatBRL, formatPct } from './PricingCalculator';

export default function ReversePricingCalculator() {
  const [calcMode, setCalcMode] = useState('margin'); // 'margin' or 'profit'
  const [targetValue, setTargetValue] = useState('20,0'); // 20% or R$ 20
  
  const [custoProd, setCustoProd] = useState('35,00');
  const [embalagem, setEmbalagem] = useState('3,00');
  const [imposto, setImposto] = useState('6,0');

  const numCusto = parseBRL(custoProd);
  const numEmb = parseBRL(embalagem);
  const numImp = parseBRL(imposto);
  const numTarget = parseBRL(targetValue);

  // 1. Mercado Livre Reverse Calculation
  const solveML = () => {
    const commPct = 16.0; // Premium
    const freteBase = 24.50; // 500g-1kg
    const repDesc = 40; // Verde escuro (40% off)
    const freteHigh = freteBase * ((100 - repDesc) / 100) * 0.92; // Full
    const feeLow = freteBase * 0.32; // < R$79

    const baseCost = numCusto + numEmb;

    if (calcMode === 'margin') {
      const denom = 1 - ((commPct + numImp + numTarget) / 100);
      if (denom <= 0) return { price: 0, profit: 0 };

      // High scenario (Preço >= 79)
      const pHigh = (baseCost + freteHigh) / denom;
      if (pHigh >= 79.00) {
        const profit = pHigh * (numTarget / 100);
        return { price: pHigh, profit, fee: pHigh * (commPct / 100) + freteHigh };
      }
      // Low scenario (Preço < 79)
      const pLow = (baseCost + feeLow) / denom;
      const profit = pLow * (numTarget / 100);
      return { price: pLow, profit, fee: pLow * (commPct / 100) + feeLow };
    } else {
      // Fixed Profit (R$)
      const pctVar = (commPct + numImp) / 100;
      const denom = 1 - pctVar;
      if (denom <= 0) return { price: 0, profit: 0 };

      const pHigh = (baseCost + freteHigh + numTarget) / denom;
      if (pHigh >= 79.00) {
        return { price: pHigh, profit: numTarget, fee: pHigh * (commPct / 100) + freteHigh };
      }
      const pLow = (baseCost + feeLow + numTarget) / denom;
      return { price: pLow, profit: numTarget, fee: pLow * (commPct / 100) + feeLow };
    }
  };

  // 2. Shopee Reverse Calculation
  const solveShopee = () => {
    const baseCost = numCusto + numEmb;

    for (let f of SHOPEE_FAIXAS) {
      let comm = f.comissao;
      let fix = f.taxaFixa;

      if (calcMode === 'margin') {
        const denom = 1 - ((comm + numImp + numTarget) / 100);
        if (denom <= 0) continue;
        const pCalculated = (baseCost + fix) / denom;
        if (pCalculated >= f.min && pCalculated <= f.max) {
          const profit = pCalculated * (numTarget / 100);
          return { price: pCalculated, profit, fee: pCalculated * (comm / 100) + fix };
        }
      } else {
        const denom = 1 - ((comm + numImp) / 100);
        if (denom <= 0) continue;
        const pCalculated = (baseCost + fix + numTarget) / denom;
        if (pCalculated >= f.min && pCalculated <= f.max) {
          return { price: pCalculated, profit: numTarget, fee: pCalculated * (comm / 100) + fix };
        }
      }
    }
    // Fallback last faixa
    const fLast = SHOPEE_FAIXAS[SHOPEE_FAIXAS.length - 1];
    if (calcMode === 'margin') {
      const denom = 1 - ((fLast.comissao + numImp + numTarget) / 100);
      const price = denom > 0 ? (baseCost + fLast.taxaFixa) / denom : 0;
      return { price, profit: price * (numTarget / 100), fee: price * (fLast.comissao / 100) + fLast.taxaFixa };
    } else {
      const denom = 1 - ((fLast.comissao + numImp) / 100);
      const price = denom > 0 ? (baseCost + fLast.taxaFixa + numTarget) / denom : 0;
      return { price, profit: numTarget, fee: price * (fLast.comissao / 100) + fLast.taxaFixa };
    }
  };

  // 3. TikTok Shop Reverse Calculation
  const solveTikTok = () => {
    const baseCost = numCusto + numEmb;
    const fsPct = 6.0; // Frete coparticipado 6%

    // Try Bracket 1 (< R$50)
    let comm1 = 10.0;
    let fix1 = 4.00;
    if (calcMode === 'margin') {
      let denom1 = 1 - ((comm1 + fsPct + numImp + numTarget) / 100);
      let p1 = denom1 > 0 ? (baseCost + fix1) / denom1 : 0;
      if (p1 > 0 && p1 < 50.00) {
        return { price: p1, profit: p1 * (numTarget / 100), fee: p1 * ((comm1 + fsPct) / 100) + fix1 };
      }
    } else {
      let denom1 = 1 - ((comm1 + fsPct + numImp) / 100);
      let p1 = denom1 > 0 ? (baseCost + fix1 + numTarget) / denom1 : 0;
      if (p1 > 0 && p1 < 50.00) {
        return { price: p1, profit: numTarget, fee: p1 * ((comm1 + fsPct) / 100) + fix1 };
      }
    }

    // Bracket 2 (>= R$50)
    let comm2 = 6.0;
    let fix2 = 6.00;
    if (calcMode === 'margin') {
      let denom2 = 1 - ((comm2 + fsPct + numImp + numTarget) / 100);
      let p2 = denom2 > 0 ? (baseCost + fix2) / denom2 : 0;
      return { price: p2, profit: p2 * (numTarget / 100), fee: p2 * ((comm2 + fsPct) / 100) + fix2 };
    } else {
      let denom2 = 1 - ((comm2 + fsPct + numImp) / 100);
      let p2 = denom2 > 0 ? (baseCost + fix2 + numTarget) / denom2 : 0;
      return { price: p2, profit: numTarget, fee: p2 * ((comm2 + fsPct) / 100) + fix2 };
    }
  };

  const resML = solveML();
  const resShopee = solveShopee();
  const resTikTok = solveTikTok();

  return (
    <div className="tab-panel">
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '5px solid var(--success)' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge badge-success">ENGENHARIA DE PREÇO REVERSO</span>
            <h2 style={{ marginTop: '0.4rem' }}>Calculadora de Preço Alvo Recomendado</h2>
            <p>Informe quanto você deseja lucrar e obtenha o preço exato a ser cobrado em cada marketplace.</p>
          </div>
        </div>
      </div>

      <div className="alignment-grid">
        {/* Left Inputs */}
        <div className="card">
          <div className="card-header">
            <h3><Target size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Defina sua Meta Financeira</h3>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Modo de Cálculo Alvo
            </label>
            <div className="segmented-control">
              <button
                type="button"
                className={`seg-btn ${calcMode === 'margin' ? 'active' : ''}`}
                onClick={() => setCalcMode('margin')}
              >
                Por % de Margem Líquida
              </button>
              <button
                type="button"
                className={`seg-btn ${calcMode === 'profit' ? 'active' : ''}`}
                onClick={() => setCalcMode('profit')}
              >
                Por Lucro Fixo (R$)
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>{calcMode === 'margin' ? 'Margem Líquida Alvo (%)' : 'Lucro Líquido Desejado por Peça (R$)'}</label>
            <FormattedInput
              type={calcMode === 'margin' ? 'decimal' : 'currency'}
              id="targetValInput"
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
              placeholder={calcMode === 'margin' ? 'Ex: 20,0' : 'Ex: 25,00'}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Custo do Produto (CMV)</label>
            <FormattedInput type="currency" id="revCusto" value={custoProd} onChange={e => setCustoProd(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Embalagem e Insumos</label>
            <FormattedInput type="currency" id="revEmb" value={embalagem} onChange={e => setEmbalagem(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Imposto Simples (%)</label>
            <FormattedInput type="decimal" id="revImp" value={imposto} onChange={e => setImposto(e.target.value)} />
          </div>
        </div>

        {/* Right Output Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Mercado Livre Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--ml-yellow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-ml"><Zap size={12} /> Mercado Livre</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Anúncio Premium</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Preço Sugerido de Venda:</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ml-yellow)', margin: '0.2rem 0' }}>
              {formatBRL(resML.price)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
              <span>Lucro: <strong style={{ color: 'var(--success)' }}>{formatBRL(resML.profit)}</strong></span>
              <span>Taxas ML Est.: <strong>{formatBRL(resML.fee)}</strong></span>
            </div>
          </div>

          {/* Shopee Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--shopee-orange)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-shopee"><ShoppingBag size={12} /> Shopee Brasil</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Conta CNPJ</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Preço Sugerido de Venda:</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--shopee-orange)', margin: '0.2rem 0' }}>
              {formatBRL(resShopee.price)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
              <span>Lucro: <strong style={{ color: 'var(--success)' }}>{formatBRL(resShopee.profit)}</strong></span>
              <span>Taxas Shopee Est.: <strong>{formatBRL(resShopee.fee)}</strong></span>
            </div>
          </div>

          {/* TikTok Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--tiktok-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-tiktok"><Video size={12} /> TikTok Shop</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Comissão Julho/2026</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Preço Sugerido de Venda:</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tiktok-cyan)', margin: '0.2rem 0' }}>
              {formatBRL(resTikTok.price)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
              <span>Lucro: <strong style={{ color: 'var(--success)' }}>{formatBRL(resTikTok.profit)}</strong></span>
              <span>Taxas TikTok Est.: <strong>{formatBRL(resTikTok.fee)}</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
