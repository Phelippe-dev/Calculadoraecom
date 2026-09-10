import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Zap, ShoppingBag, Video, Bookmark } from 'lucide-react';
import FormattedInput from './FormattedInput';

// ============================================================
// TABELAS OFICIAIS 2026 — SHOPEE BRASIL
// Fonte: Shopee Central do Vendedor (Março/2026)
// ============================================================
export const SHOPEE_FAIXAS = [
  {
    label: 'Até R$ 79,99',
    min: 0, max: 79.99,
    comissao: 20.0,    // inclui taxa de transação + frete grátis obrigatorio
    taxaFixa: 4.00,
    subsidioFrete: 20.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 20,00',
  },
  {
    label: 'R$ 80,00 a R$ 99,99',
    min: 80, max: 99.99,
    comissao: 14.0,
    taxaFixa: 16.00,
    subsidioFrete: 30.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 30,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'R$ 100,00 a R$ 199,99',
    min: 100, max: 199.99,
    comissao: 14.0,
    taxaFixa: 20.00,
    subsidioFrete: 30.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 30,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'R$ 200,00 a R$ 499,99',
    min: 200, max: 499.99,
    comissao: 14.0,
    taxaFixa: 26.00,
    subsidioFrete: 40.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 40,00',
    subsidioPixPct: 5.0,
  },
  {
    label: 'Acima de R$ 500,00',
    min: 500, max: Infinity,
    comissao: 14.0,
    taxaFixa: 28.00,
    subsidioFrete: 40.00,
    descFrete: 'Subsídio oficial de Frete Grátis de até R$ 40,00',
    subsidioPixPct: 8.0,
  },
];

// ============================================================
// TABELAS OFICIAIS 2026 — MERCADO LIVRE BRASIL
// Fonte: Central do Vendedor ML (Regras de Frete & Comissões 2026)
// ============================================================
export const ML_CATEGORIAS = [
  { label: 'Geral / Utilidades Domésticas', classico: 11, premium: 16 },
  { label: 'Ferramentas / Construção', classico: 11, premium: 16 },
  { label: 'Alimentos / Bebidas / Pets', classico: 12, premium: 17 },
  { label: 'Calçados / Bolsas / Acessórios', classico: 13, premium: 18 },
  { label: 'Moda / Roupas / Têxteis', classico: 14, premium: 19 },
  { label: 'Esportes / Lazer / Brinquedos', classico: 11, premium: 16 },
  { label: 'Informática / Eletrônicos', classico: 10, premium: 15 },
  { label: 'Celulares / Smartphones', classico: 10, premium: 15 },
  { label: 'Saúde / Beleza / Higiene', classico: 12, premium: 17 },
  { label: 'Automotivo / Moto Peças', classico: 11, premium: 16 },
  { label: 'Livros / Papelaria', classico: 10, premium: 15 },
  { label: 'Indústria e Comércio', classico: 11, premium: 16 },
];

export const ML_FRETE_BASE = [
  { label: 'Até 300g', pesoMax: 0.3, freteBase: 18.50 },
  { label: '300g a 500g', pesoMax: 0.5, freteBase: 21.90 },
  { label: '500g a 1kg', pesoMax: 1.0, freteBase: 24.50 },
  { label: '1kg a 2kg', pesoMax: 2.0, freteBase: 28.90 },
  { label: '2kg a 5kg', pesoMax: 5.0, freteBase: 36.50 },
  { label: '5kg a 10kg', pesoMax: 10.0, freteBase: 48.00 },
  { label: 'Acima de 10kg', pesoMax: 999, freteBase: 65.00 },
];

export const ML_REPUTACAO = [
  { label: 'MercadoLíder Platinum / Gold — 70% Off no Frete', descPct: 70 },
  { label: 'MercadoLíder Silver — 50% Off no Frete', descPct: 50 },
  { label: 'Reputação Verde Escuro — 40% Off no Frete', descPct: 40 },
  { label: 'Reputação Verde Claro — 20% Off no Frete', descPct: 20 },
  { label: 'Sem Reputação / Amarela — 0% Off no Frete', descPct: 0 },
];

export const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
export const formatPct = (v) => `${(v || 0).toFixed(2).replace('.', ',')}%`;

export const parseBRL = (str) => {
  if (str === null || str === undefined || str === '') return 0;
  if (typeof str === 'number') return str;
  const clean = String(str).replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export default function PricingCalculator({ currentMarketplace, onSaveSimulation }) {
  const [mp, setMp] = useState(currentMarketplace || 'ml');

  // Campos comuns INICIALIZADOS LIMPOS
  const [custoProd, setCustoProd] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [embalagem, setEmbalagem] = useState('');
  const [imposto, setImposto] = useState('');
  const [margemAlvo, setMargemAlvo] = useState('');

  // Campos ML
  const [mlCategoria, setMlCategoria] = useState(0);
  const [mlTipoAnuncio, setMlTipoAnuncio] = useState('premium');
  const [mlFreteIdx, setMlFreteIdx] = useState(2);          // 500g a 1kg
  const [mlRepIdx, setMlRepIdx] = useState(2);              // Verde Escuro
  const [mlModal, setMlModal] = useState('full');
  const [mlMercadoAds, setMlMercadoAds] = useState('');
  const [mlParcelamento, setMlParcelamento] = useState(false);

  // Campos Shopee
  const [shopeeTipoConta, setShopeeTipoConta] = useState('cnpj');
  const [shopeeCupom, setShopeeCupom] = useState('');
  const [shopeeCampanha, setShopeeCampanha] = useState(false);
  const [shopeePix, setShopeePix] = useState(false);
  const [shopeeAfiliado, setShopeeAfiliado] = useState('');
  const [shopeeAds, setShopeeAds] = useState('');

  // Campos TikTok Shop
  const [tikTokAds, setTikTokAds] = useState('');
  const [tikTokAffiliate, setTikTokAffiliate] = useState('');
  const [tikTokFreeShipping, setTikTokFreeShipping] = useState(true);
  const [tikTokIsencao, setTikTokIsencao] = useState(false);

  useEffect(() => {
    if (currentMarketplace) {
      setMp(currentMarketplace);
      document.documentElement.setAttribute('data-theme', currentMarketplace);
    }
  }, [currentMarketplace]);

  const handleMpChange = (newMp) => {
    setMp(newMp);
    document.documentElement.setAttribute('data-theme', newMp);
  };

  const numPreco = parseBRL(precoVenda);
  const numCusto = parseBRL(custoProd);
  const numEmb = parseBRL(embalagem);
  const numImp = parseBRL(imposto);
  const numMargAlvo = parseBRL(margemAlvo);

  // ============================================================
  // CÁLCULO MERCADO LIVRE
  // ============================================================
  const calcML = () => {
    const cat = ML_CATEGORIAS[mlCategoria];
    const pctComissao = mlTipoAnuncio === 'premium' ? cat.premium : cat.classico;
    const freteRow = ML_FRETE_BASE[mlFreteIdx];
    const repRow = ML_REPUTACAO[mlRepIdx];
    const numAcos = parseBRL(mlMercadoAds);

    let taxaFixa = 0;
    let custoFrete = 0;
    let custoParcelamento = 0;

    if (numPreco > 0 && numPreco < 79.00) {
      taxaFixa = freteRow.freteBase * 0.32;
    } else if (numPreco >= 79.00) {
      const descFator = (100 - repRow.descPct) / 100;
      custoFrete = freteRow.freteBase * descFator;
      if (mlModal === 'full') custoFrete = custoFrete * 0.92;
    }

    if (mlTipoAnuncio === 'premium' && mlParcelamento) {
      custoParcelamento = numPreco * 0.028;
    }

    const valorComissao = Number(((numPreco * pctComissao) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAcos) / 100).toFixed(2));
    const valorParcelamento = Number(custoParcelamento.toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));
    const valorFrete = Number(custoFrete.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorFrete + valorParcelamento + valorImposto + numEmb + numCusto + valorAds).toFixed(2));
    const lucro = numPreco > 0 ? Number((numPreco - totalCustos).toFixed(2)) : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    const computeMLPriceForMarg = (targetPct) => {
      if (numCusto === 0 && numEmb === 0) return 0;
      const pctVar = (pctComissao + numImp + numAcos + (mlTipoAnuncio === 'premium' && mlParcelamento ? 2.8 : 0)) / 100;
      const denom = 1 - (pctVar + targetPct / 100);
      if (denom <= 0) return 0;

      const descFator = (100 - repRow.descPct) / 100;
      let shippingHigh = freteRow.freteBase * descFator;
      if (mlModal === 'full') shippingHigh *= 0.92;
      const pHigh = (numCusto + numEmb + shippingHigh) / denom;
      if (pHigh >= 79.00) return pHigh;

      const feeLow = freteRow.freteBase * 0.32;
      const pLow = (numCusto + numEmb + feeLow) / denom;
      return pLow;
    };

    const precoBreak = computeMLPriceForMarg(0);
    const precoMargAlvo = computeMLPriceForMarg(numMargAlvo);

    return {
      pctComissao, valorComissao, taxaFixa: valorTaxaFixa, custoFrete: valorFrete, custoParcelamento: valorParcelamento,
      valorImposto, valorAds, totalCustos, lucro, margemPct,
      precoBreak, precoMargAlvo,
      cat, freteRow, repRow, numAcos
    };
  };

  // ============================================================
  // CÁLCULO SHOPEE BRASIL
  // ============================================================
  const calcShopee = () => {
    const faixa = SHOPEE_FAIXAS.find(f => numPreco >= f.min && numPreco <= f.max) || SHOPEE_FAIXAS[0];
    const numCupom = parseBRL(shopeeCupom);
    const numAfil = parseBRL(shopeeAfiliado);
    const numAds = parseBRL(shopeeAds);

    let pctTotal = faixa.comissao;
    let taxaFixa = faixa.taxaFixa;
    if (shopeeTipoConta === 'cpf_alto') taxaFixa += 3.00;
    if (shopeeCampanha) pctTotal += 2.5;

    let subsidioPixValor = 0;
    if (shopeePix && faixa.subsidioPixPct) {
      subsidioPixValor = Number(((numPreco * faixa.subsidioPixPct) / 100).toFixed(2));
    }

    const valorComissao = Number(((numPreco * pctTotal) / 100).toFixed(2));
    const valorCupom = Number(((numPreco * numCupom) / 100).toFixed(2));
    const valorAfil = Number(((numPreco * numAfil) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAds) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorCupom + valorAfil + valorAds + valorImposto + numEmb + numCusto - subsidioPixValor).toFixed(2));
    const lucro = numPreco > 0 ? Number((numPreco - totalCustos).toFixed(2)) : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    const computeShopeePriceForMarg = (targetPct) => {
      if (numCusto === 0 && numEmb === 0) return 0;
      const extraCPF = shopeeTipoConta === 'cpf_alto' ? 3.00 : 0;
      const extraCamp = shopeeCampanha ? 2.5 : 0;

      for (let f of SHOPEE_FAIXAS) {
        let pct = f.comissao + extraCamp;
        let fix = f.taxaFixa + extraCPF;
        let pixSub = (shopeePix && f.subsidioPixPct) ? f.subsidioPixPct : 0;

        const pctVar = (pct + numCupom + numAfil + numAds + numImp - pixSub) / 100;
        const denom = 1 - (pctVar + targetPct / 100);
        if (denom <= 0) continue;

        const pCalculated = (numCusto + numEmb + fix) / denom;
        if (pCalculated >= f.min && pCalculated <= f.max) {
          return pCalculated;
        }
      }
      const fLast = SHOPEE_FAIXAS[SHOPEE_FAIXAS.length - 1];
      let pct = fLast.comissao + extraCamp;
      let fix = fLast.taxaFixa + extraCPF;
      let pixSub = (shopeePix && fLast.subsidioPixPct) ? fLast.subsidioPixPct : 0;
      const pctVar = (pct + numCupom + numAfil + numAds + numImp - pixSub) / 100;
      const denom = 1 - (pctVar + targetPct / 100);
      return denom > 0 ? (numCusto + numEmb + fix) / denom : 0;
    };

    const precoBreak = computeShopeePriceForMarg(0);
    const precoMargAlvo = computeShopeePriceForMarg(numMargAlvo);

    return {
      faixa, pctTotal, valorComissao, taxaFixa: valorTaxaFixa, valorCupom, valorAfil, valorAds,
      subsidioPixValor, valorImposto, totalCustos, lucro, margemPct,
      precoBreak, precoMargAlvo
    };
  };

  // ============================================================
  // CÁLCULO TIKTOK SHOP BRASIL
  // ============================================================
  const calcTikTok = () => {
    const numAds = parseBRL(tikTokAds);
    const numAfil = parseBRL(tikTokAffiliate);

    let pctComissao = numPreco < 50.00 ? 10.0 : 6.0;
    if (tikTokIsencao) pctComissao = 0;

    let taxaFixa = numPreco < 50.00 ? 4.00 : 6.00;

    let custoFreteGratis = 0;
    if (tikTokFreeShipping) {
      custoFreteGratis = Math.min((numPreco * 6.0) / 100, 50.00);
    }

    const valorComissao = Number(((numPreco * pctComissao) / 100).toFixed(2));
    const valorFreteGratis = Number(custoFreteGratis.toFixed(2));
    const valorAfil = Number(((numPreco * numAfil) / 100).toFixed(2));
    const valorAds = Number(((numPreco * numAds) / 100).toFixed(2));
    const valorImposto = Number(((numPreco * numImp) / 100).toFixed(2));
    const valorTaxaFixa = Number(taxaFixa.toFixed(2));

    const totalCustos = Number((valorComissao + valorTaxaFixa + valorFreteGratis + valorAfil + valorAds + valorImposto + numEmb + numCusto).toFixed(2));
    const lucro = numPreco > 0 ? Number((numPreco - totalCustos).toFixed(2)) : 0;
    const margemPct = numPreco > 0 ? (lucro / numPreco) * 100 : 0;

    const computeTikTokPriceForMarg = (targetPct) => {
      if (numCusto === 0 && numEmb === 0) return 0;
      const fsPct = tikTokFreeShipping ? 6.0 : 0;

      let comm1 = tikTokIsencao ? 0 : 10.0;
      let pctVar1 = (comm1 + fsPct + numAfil + numAds + numImp) / 100;
      let denom1 = 1 - (pctVar1 + targetPct / 100);
      let p1 = denom1 > 0 ? (numCusto + numEmb + 4.00) / denom1 : 0;
      if (p1 > 0 && p1 < 50.00) return p1;

      let comm2 = tikTokIsencao ? 0 : 6.0;
      let pctVar2 = (comm2 + fsPct + numAfil + numAds + numImp) / 100;
      let denom2 = 1 - (pctVar2 + targetPct / 100);
      let p2 = denom2 > 0 ? (numCusto + numEmb + 6.00) / denom2 : 0;
      return p2;
    };

    const precoBreak = computeTikTokPriceForMarg(0);
    const precoMargAlvo = computeTikTokPriceForMarg(numMargAlvo);

    return {
      pctComissao, valorComissao, taxaFixa: valorTaxaFixa, custoFreteGratis: valorFreteGratis, valorAfil, valorAds,
      valorImposto, totalCustos, lucro, margemPct, precoBreak, precoMargAlvo
    };
  };

  const ml = calcML();
  const sh = calcShopee();
  const tk = calcTikTok();

  const res = mp === 'tiktok' ? tk : (mp === 'shopee' ? sh : ml);
  
  // Clean channel name without "Brasil" suffix for badge display
  const channelBadgeLabel = mp === 'tiktok' ? 'TIKTOK SHOP' : (mp === 'shopee' ? 'SHOPEE' : 'MERCADO LIVRE');
  const channelLabel = mp === 'tiktok' ? 'TikTok Shop' : (mp === 'shopee' ? 'Shopee' : 'Mercado Livre');
  
  const accent = mp === 'tiktok' ? 'var(--tiktok-cyan)' : (mp === 'shopee' ? 'var(--shopee-orange)' : 'var(--ml-yellow)');
  const accentBg = mp === 'tiktok' ? 'var(--tiktok-cyan-bg)' : (mp === 'shopee' ? 'var(--shopee-orange-bg)' : 'var(--ml-yellow-bg)');
  const accentBorder = mp === 'tiktok' ? 'var(--tiktok-cyan-border)' : (mp === 'shopee' ? 'var(--shopee-orange-border)' : 'var(--ml-yellow-border)');

  const margemColor = numPreco === 0
    ? 'var(--text-secondary)'
    : res.margemPct >= numMargAlvo && numMargAlvo > 0
    ? 'var(--success)' : res.margemPct >= 10
    ? 'var(--warning)' : 'var(--danger)';

  const margemIcon = res.margemPct >= numMargAlvo && numMargAlvo > 0 ? '✅' : res.margemPct >= 10 ? '⚠️' : '🚨';

  const handleApplySuggestedPrice = (sugPrice) => {
    if (sugPrice > 0) {
      setPrecoVenda(sugPrice.toFixed(2).replace('.', ','));
    }
  };

  const handleQuickSave = () => {
    if (onSaveSimulation && numPreco > 0) {
      onSaveSimulation({
        id: Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        title: `Simulação ${channelLabel} (${formatBRL(numPreco)})`,
        marketplace: mp,
        precoVenda: numPreco,
        custoProd: numCusto,
        lucro: res.lucro,
        margemPct: res.margemPct,
        precoMargAlvo: res.precoMargAlvo
      });
    }
  };

  return (
    <div className="tab-panel">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: `5px solid ${accent}` }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge" style={{ background: accentBg, color: accent, border: `1px solid ${accentBorder}` }}>
              {channelBadgeLabel}
            </span>
            <h2 style={{ marginTop: '0.4rem' }}>Calculadora de Precificação &amp; Margem Real</h2>
            <p>Precifique com exatidão matemática considerando todas as taxas e regras vigentes de 2026.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div className="segmented-control" style={{ maxWidth: '380px' }}>
              <button type="button" className={`seg-btn seg-btn-ml ${mp === 'ml' ? 'active' : ''}`} onClick={() => handleMpChange('ml')}>
                <Zap size={14} /> ML
              </button>
              <button type="button" className={`seg-btn seg-btn-shopee ${mp === 'shopee' ? 'active' : ''}`} onClick={() => handleMpChange('shopee')}>
                <ShoppingBag size={14} /> Shopee
              </button>
              <button type="button" className={`seg-btn seg-btn-tiktok ${mp === 'tiktok' ? 'active' : ''}`} onClick={() => handleMpChange('tiktok')}>
                <Video size={14} /> TikTok Shop
              </button>
            </div>
            {onSaveSimulation && (
              <button type="button" className="btn btn-outline" onClick={handleQuickSave} style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                <Bookmark size={13} /> Salvar Simulação
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="alignment-grid">
        {/* ===== COLUNA ESQUERDA — INPUTS ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Dados do produto */}
          <div className="card">
            <div className="card-header">
              <h3><Calculator size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Dados de Custos do Vendedor</h3>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Custo de Aquisição / CMV (R$)</label>
              <FormattedInput type="currency" id="custoProd" value={custoProd}
                onChange={e => setCustoProd(e.target.value)}
                placeholder="Ex: 35,00" />
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Preço de Venda Simulado (R$)</label>
              <FormattedInput type="currency" id="precoVenda" value={precoVenda}
                onChange={e => setPrecoVenda(e.target.value)}
                placeholder="Ex: 89,90" />
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Custo de Embalagem &amp; Insumos (R$)</label>
              <FormattedInput type="currency" id="embalagem" value={embalagem}
                onChange={e => setEmbalagem(e.target.value)}
                placeholder="Ex: 3,00" />
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Alíquota de Imposto — Simples / Lucro Presumido (%)</label>
              <FormattedInput type="decimal" id="imposto" value={imposto}
                onChange={e => setImposto(e.target.value)}
                placeholder="Ex: 6,0" />
            </div>

            <div className="form-group">
              <label>Margem Líquida Alvo Desejada (%)</label>
              <FormattedInput type="decimal" id="margemAlvo" value={margemAlvo}
                onChange={e => setMargemAlvo(e.target.value)}
                placeholder="Ex: 20,0" />
            </div>
          </div>

          {/* Configurações do Marketplace */}
          {mp === 'tiktok' ? (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações TikTok Shop</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Regra Oficial Julho/2026 (Comissão 10% &lt; R$50 | 6% &gt;= R$50)
                </p>
              </div>

              <div style={{ padding: '0.75rem', background: 'var(--tiktok-cyan-bg)', border: '1px solid var(--tiktok-cyan-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--tiktok-cyan)', fontWeight: 700, marginBottom: '0.3rem' }}>
                  REGRA APLICADA PARA O PREÇO DE R$ {numPreco.toFixed(2)}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Comissão Base: {tk.pctComissao}% + Tarifa Fixa por Item: {formatBRL(tk.taxaFixa)}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {numPreco < 50.00 ? 'Produtos abaixo de R$ 50,00 aplicam 10% de comissão + R$ 4,00 por item' : 'Produtos de R$ 50,00 ou mais aplicam 6% de comissão + R$ 6,00 por item'}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Comissão de Afiliados TikTok (%)</label>
                <FormattedInput type="decimal" id="tikTokAffiliate" value={tikTokAffiliate}
                  onChange={e => setTikTokAffiliate(e.target.value)}
                  placeholder="Ex: 12,0" />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Investimento Mídia GMV Max Ads (%)</label>
                <FormattedInput type="decimal" id="tikTokAds" value={tikTokAds}
                  onChange={e => setTikTokAds(e.target.value)}
                  placeholder="Ex: 5,0" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="tiktok_freeshipping" checked={tikTokFreeShipping} onChange={e => setTikTokFreeShipping(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="tiktok_freeshipping" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Programa de Frete Grátis Coparticipado TikTok (+6% taxa de serviço)
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="tiktok_isencao" checked={tikTokIsencao} onChange={e => setTikTokIsencao(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="tiktok_isencao" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Isenção Promocional de Conta Nova (0% de comissão base por 60 dias)
                  </label>
                </div>
              </div>
            </div>
          ) : mp === 'shopee' ? (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações Shopee</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Tabela Oficial Escalonada por Faixa de Preço — Vigente em 2026
                </p>
              </div>

              {numPreco > 0 && sh.faixa && (
                <div style={{ padding: '0.75rem', background: 'var(--shopee-orange-bg)', border: '1px solid var(--shopee-orange-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--shopee-orange)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    FAIXA OFICIAL APLICADA AUTOMATICAMENTE
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {sh.faixa.label} — Comissão {sh.faixa.comissao}% + Taxa Fixa {formatBRL(sh.faixa.taxaFixa)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {sh.faixa.descFrete}
                  </div>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Tipo de Conta do Vendedor</label>
                <select className="select-input" value={shopeeTipoConta} onChange={e => setShopeeTipoConta(e.target.value)}>
                  <option value="cnpj">CNPJ — Tabela Padrão Oficial</option>
                  <option value="cpf_alto">CPF com mais de 450 Pedidos em 90 dias (+R$ 3,00 taxa por item)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Cupom da Loja — Desconto do Vendedor (%)</label>
                <FormattedInput type="decimal" id="shopeeCupom" value={shopeeCupom}
                  onChange={e => setShopeeCupom(e.target.value)}
                  placeholder="Ex: 5,0" />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Programa de Afiliados Shopee (%) (Nova Regra 2026)</label>
                <FormattedInput type="decimal" id="shopeeAfiliado" value={shopeeAfiliado}
                  onChange={e => setShopeeAfiliado(e.target.value)}
                  placeholder="Ex: 5,0 (Teto max R$ 20,00)" />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Shopee Ads — Custo de Mídia Pago (%)</label>
                <FormattedInput type="decimal" id="shopeeAds" value={shopeeAds}
                  onChange={e => setShopeeAds(e.target.value)}
                  placeholder="Ex: 5,0" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="shopee_campanha" checked={shopeeCampanha} onChange={e => setShopeeCampanha(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="shopee_campanha" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Campanha de Destaque Shopee (+2,5% sobre o valor da venda)
                  </label>
                </div>

                {sh.faixa && sh.faixa.subsidioPixPct > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <input type="checkbox" id="shopee_pix" checked={shopeePix} onChange={e => setShopeePix(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label htmlFor="shopee_pix" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                      Pagamento via PIX — Subsídio Shopee (−{sh.faixa.subsidioPixPct}% de desconto no custo)
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3>⚙️ Configurações Mercado Livre</h3>
                <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  Tabela Oficial de Comissões e Frete Obrigatório por Reputação
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Categoria do Produto</label>
                <select className="select-input" value={mlCategoria} onChange={e => setMlCategoria(Number(e.target.value))}>
                  {ML_CATEGORIAS.map((c, i) => (
                    <option key={i} value={i}>{c.label} — Clássico {c.classico}% | Premium {c.premium}%</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Tipo de Anúncio ML</label>
                <select className="select-input" value={mlTipoAnuncio} onChange={e => setMlTipoAnuncio(e.target.value)}>
                  <option value="classico">Anúncio Clássico — {ML_CATEGORIAS[mlCategoria].classico}% de Comissão (Sem parcelamento sem juros)</option>
                  <option value="premium">Anúncio Premium — {ML_CATEGORIAS[mlCategoria].premium}% de Comissão (Permite 12x sem juros)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Modal Logístico ML</label>
                <select className="select-input" value={mlModal} onChange={e => setMlModal(e.target.value)}>
                  <option value="full">Mercado Envios Full — Fulfillment CD (−8% no custo do frete)</option>
                  <option value="flex">Mercado Envios Flex — Entrega Própria no Mesmo Dia</option>
                  <option value="coleta">Coleta / Agência — Ponto de Coleta Oficial</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Faixa de Peso / Cubagem do Produto</label>
                <select className="select-input" value={mlFreteIdx} onChange={e => setMlFreteIdx(Number(e.target.value))}>
                  {ML_FRETE_BASE.map((f, i) => (
                    <option key={i} value={i}>{f.label} — Frete Base R$ {f.freteBase.toFixed(2).replace('.', ',')}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Nível de Reputação / Desconto de Frete ML</label>
                <select className="select-input" value={mlRepIdx} onChange={e => setMlRepIdx(Number(e.target.value))}>
                  {ML_REPUTACAO.map((r, i) => (
                    <option key={i} value={i}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Mercado Ads — ACOS Atual (%)</label>
                <FormattedInput type="decimal" id="mlMercadoAds" value={mlMercadoAds}
                  onChange={e => setMlMercadoAds(e.target.value)}
                  placeholder="Ex: 15,0" />
              </div>

              {mlTipoAnuncio === 'premium' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <input type="checkbox" id="ml_parcelamento" checked={mlParcelamento} onChange={e => setMlParcelamento(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor="ml_parcelamento" style={{ fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
                    Incluir custo financeiro do parcelamento 12x sem juros (~2,8%)
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== COLUNA DIREITA — RESULTADO AUDITADO ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* KPIs principais */}
          <div className="card" style={{ borderTop: `4px solid ${accent}` }}>
            <div className="card-header">
              <h3><TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Resultado da Precificação — {channelLabel}
              </h3>
            </div>

            <div className="metrics-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div className="metric-card">
                <div className="metric-title">Lucro Líquido por Venda</div>
                <div className="metric-value" style={{ color: res.lucro >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.35rem' }}>
                  {formatBRL(res.lucro)}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">{margemIcon} Margem Líquida Real</div>
                <div className="metric-value" style={{ color: margemColor, fontSize: '1.35rem' }}>
                  {formatPct(res.margemPct)}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Total de Custos e Taxas</div>
                <div className="metric-value" style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>
                  {formatBRL(res.totalCustos)}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-title">Margem Alvo Configurada</div>
                <div className="metric-value" style={{ color: accent, fontSize: '1.1rem' }}>
                  {formatPct(numMargAlvo)}
                </div>
              </div>
            </div>

            {/* Visual Progress Bar for Target Margin */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                <span>Atingimento da Margem Alvo ({formatPct(numMargAlvo)})</span>
                <span>{formatPct(res.margemPct)} / {formatPct(numMargAlvo)}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, (res.margemPct / (numMargAlvo || 1)) * 100))}%`,
                    background: margemColor
                  }}
                />
              </div>
            </div>

            {/* Status Alert Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: res.margemPct >= numMargAlvo && numMargAlvo > 0 ? 'var(--success-bg)' : res.margemPct >= 10 ? 'var(--warning-bg)' : 'var(--danger-bg)',
              border: `1px solid ${res.margemPct >= numMargAlvo && numMargAlvo > 0 ? 'var(--success-border)' : res.margemPct >= 10 ? 'var(--warning-border)' : 'var(--danger-border)'}`,
              marginBottom: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem', color: margemColor }}>
                {numPreco === 0
                  ? '💡 Digite o Custo e o Preço de Venda para calcular a margem real'
                  : res.margemPct >= numMargAlvo && numMargAlvo > 0
                  ? `✅ Excelente! O preço de R$ ${numPreco.toFixed(2)} atingiu a margem alvo de ${formatPct(numMargAlvo)}`
                  : res.margemPct >= 10
                  ? `⚠️ Margem de ${formatPct(res.margemPct)} está abaixo do alvo de ${formatPct(numMargAlvo)}`
                  : `🚨 Risco de prejuízo! Margem de apenas ${formatPct(res.margemPct)}`}
              </div>

              {res.margemPct < numMargAlvo && res.precoMargAlvo > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Para atingir {formatPct(numMargAlvo)} de margem, o preço sugerido é <strong>{formatBRL(res.precoMargAlvo)}</strong></span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => handleApplySuggestedPrice(res.precoMargAlvo)}
                  >
                    Aplicar {formatBRL(res.precoMargAlvo)}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DRE detalhada e auditada do pedido */}
          <div className="card">
            <div className="card-header">
              <h3>📄 Demonstrativo DRE Auditado por Unidade Vendida</h3>
              <p style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                Desmembramento de cada alíquota e taxa oficial do pedido
              </p>
            </div>

            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div className="dre-row" style={{ fontWeight: 700 }}>
                <span>(+) Preço de Venda Final:</span>
                <span>{formatBRL(numPreco)}</span>
              </div>
              <div className="dre-row" style={{ color: 'var(--danger)' }}>
                <span>(−) Custo de Aquisição (CMV):</span>
                <span>− {formatBRL(numCusto)}</span>
              </div>
              <div className="dre-row" style={{ color: 'var(--danger)' }}>
                <span>(−) Embalagem e Insumos:</span>
                <span>− {formatBRL(numEmb)}</span>
              </div>
              <div className="dre-row" style={{ color: 'var(--danger)' }}>
                <span>(−) Imposto ({numImp}%):</span>
                <span>− {formatBRL(res.valorImposto)}</span>
              </div>

              {mp === 'tiktok' ? (
                <>
                  <div className="dre-row" style={{ color: 'var(--danger)' }}>
                    <span>(−) Comissão Base TikTok ({res.pctComissao}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  <div className="dre-row" style={{ color: 'var(--danger)' }}>
                    <span>(−) Tarifa Fixa por Item Vendido:</span>
                    <span>− {formatBRL(res.taxaFixa)}</span>
                  </div>
                  {res.custoFreteGratis > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Frete Grátis Coparticipado (6%):</span>
                      <span>− {formatBRL(res.custoFreteGratis)}</span>
                    </div>
                  )}
                  {res.valorAfil > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Comissão de Afiliados ({parseBRL(tikTokAffiliate)}%):</span>
                      <span>− {formatBRL(res.valorAfil)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Mídia GMV Max Ads ({parseBRL(tikTokAds)}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                </>
              ) : mp === 'shopee' ? (
                <>
                  <div className="dre-row" style={{ color: 'var(--danger)' }}>
                    <span>(−) Comissão Shopee ({res.pctTotal}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  <div className="dre-row" style={{ color: 'var(--danger)' }}>
                    <span>(−) Taxa Fixa por Item ({sh.faixa?.label}):</span>
                    <span>− {formatBRL(res.taxaFixa)}</span>
                  </div>
                  {res.valorCupom > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Cupom da Loja ({parseBRL(shopeeCupom)}%):</span>
                      <span>− {formatBRL(res.valorCupom)}</span>
                    </div>
                  )}
                  {res.valorAfil > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Comissão Afiliados ({parseBRL(shopeeAfiliado)}%):</span>
                      <span>− {formatBRL(res.valorAfil)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Shopee Ads ({parseBRL(shopeeAds)}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                  {res.subsidioPixValor > 0 && (
                    <div className="dre-row" style={{ color: 'var(--success)' }}>
                      <span>(+) Subsídio PIX Shopee ({sh.faixa?.subsidioPixPct}%):</span>
                      <span>+ {formatBRL(res.subsidioPixValor)}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="dre-row" style={{ color: 'var(--danger)' }}>
                    <span>(−) Comissão Mercado Livre ({res.pctComissao}%):</span>
                    <span>− {formatBRL(res.valorComissao)}</span>
                  </div>
                  {res.taxaFixa > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Tarifa Fixa Gestão Logística (&lt; R$79):</span>
                      <span>− {formatBRL(res.taxaFixa)}</span>
                    </div>
                  )}
                  {res.custoFrete > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Custo Frete Grátis Envios (&gt;= R$79):</span>
                      <span>− {formatBRL(res.custoFrete)}</span>
                    </div>
                  )}
                  {res.custoParcelamento > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Parcelamento 12x Sem Juros (~2.8%):</span>
                      <span>− {formatBRL(res.custoParcelamento)}</span>
                    </div>
                  )}
                  {res.valorAds > 0 && (
                    <div className="dre-row" style={{ color: 'var(--danger)' }}>
                      <span>(−) Mercado Ads ({res.numAcos}%):</span>
                      <span>− {formatBRL(res.valorAds)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="dre-row total" style={{ color: res.lucro >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                <span>(=) Lucro Líquido Final:</span>
                <span>{formatBRL(res.lucro)} ({formatPct(res.margemPct)})</span>
              </div>
            </div>
          </div>

          {/* Breakeven e Preço Sugerido */}
          <div className="card">
            <div className="card-header">
              <h3>🎯 Ponto de Equilíbrio &amp; Preço Sugerido</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preço Mínimo Breakeven (Zero Lucro / Zero Prejuízo):</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)' }}>
                    {formatBRL(res.precoBreak)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => handleApplySuggestedPrice(res.precoBreak)}
                >
                  Usar Breakeven
                </button>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: `1px solid ${accentBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preço Recomendado para {formatPct(numMargAlvo)} de Margem:</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: accent }}>
                    {formatBRL(res.precoMargAlvo)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
                  onClick={() => handleApplySuggestedPrice(res.precoMargAlvo)}
                >
                  Usar Alvo
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
