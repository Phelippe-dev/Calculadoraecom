import React, { useState } from 'react';
import { BookOpen, Zap, ShoppingBag, Video, Info, CheckCircle2, ShieldCheck, AlertCircle, Truck, Percent, Award, AlertTriangle, Users } from 'lucide-react';
import { ML_CATEGORIAS, ML_FRETE_BASE, ML_REPUTACAO, SHOPEE_FAIXAS, formatBRL } from './PricingCalculator';

export default function RulesGuide() {
  const [guideTab, setGuideTab] = useState('ml');

  return (
    <div className="tab-panel">
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge badge-success">CENTRAL DE AUDITORIA 2026</span>
            <h2 style={{ marginTop: '0.4rem' }}>Guia Oficial de Taxas, Comissões e Regras 2026</h2>
            <p>Consulte as tabelas e regulamentos oficiais vigentes no Mercado Livre, Shopee e TikTok Shop.</p>
          </div>
          <div className="segmented-control" style={{ maxWidth: '380px' }}>
            <button type="button" className={`seg-btn seg-btn-ml ${guideTab === 'ml' ? 'active' : ''}`} onClick={() => setGuideTab('ml')}>
              <Zap size={14} /> Mercado Livre
            </button>
            <button type="button" className={`seg-btn seg-btn-shopee ${guideTab === 'shopee' ? 'active' : ''}`} onClick={() => setGuideTab('shopee')}>
              <ShoppingBag size={14} /> Shopee
            </button>
            <button type="button" className={`seg-btn seg-btn-tiktok ${guideTab === 'tiktok' ? 'active' : ''}`} onClick={() => setGuideTab('tiktok')}>
              <Video size={14} /> TikTok Shop
            </button>
          </div>
        </div>
      </div>

      {guideTab === 'ml' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>          {/* Card Destaque Atualização 24/08/2026 */}
          <div className="card" style={{ borderLeft: '4px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} /> Atualização Mercado Livre (Vigência 24/08/2026)
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p>• <strong>Frete Mercado Envios:</strong> Nova tabela por peso real, cubagem (dimensões) e distância para itens acima e abaixo de R$ 19.</p>
              <p>• <strong>Envios Flex Dinâmico:</strong> Custo e bonificação calculados por peso, volume da embalagem e raio de entrega.</p>
              <p>• <strong>Mercado Envios Full:</strong> Reajuste na armazenagem diária, coletas e cobrança por estoque sem conformidade.</p>
              <p>• <strong>Tarifa Fixa (&lt; R$ 79):</strong> Cobrança operacional dinâmica proporcional à cubagem do produto.</p>
              <p style={{ marginTop: '0.2rem', color: '#f59e0b', fontWeight: 600 }}>
                📌 <strong>Ação:</strong> Atualize as medidas (A x L x C) e o peso no painel para evitar fretes inflados por estimativa de cubagem.
              </p>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--ml-yellow)' }}>
            <h3 style={{ color: 'var(--ml-yellow)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} /> Regras Oficiais Mercado Livre 2026
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <p>• <strong>Clássico vs. Premium:</strong> Clássico (10% a 14% de comissão). Premium (15% a 19% com parcelamento em até 12x sem juros).</p>
              <p>• <strong>Produtos &lt; R$ 79,00:</strong> Sem frete grátis obrigatório. Taxa de gestão logística de 32% sobre o frete base.</p>
              <p>• <strong>Produtos &ge; R$ 79,00:</strong> Frete grátis obrigatório ao comprador, com desconto de até 70% conforme a reputação do vendedor.</p>
              <p>• <strong>Desconto Full:</strong> Vendedores no Mercado Envios Full recebem 8% de desconto extra no custo do frete grátis.</p>
              <p>• <strong>Programa de Afiliados:</strong> Comissão adicional de 3% a 7% para vendas via parceiros afiliados.</p>
            </div>
          </div>

          {/* Tabela de Envio e Peso Mercado Livre */}
          <div className="card">
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} style={{ color: 'var(--ml-yellow)' }} />
              Tabela Oficial de Taxas de Envio &amp; Peso Mercado Envios 2026
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Tabela oficial de fretes base e tarifas de gestão logística (&lt; R$79 = 32% do frete base)
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Faixa de Peso</th>
                    <th style={{ padding: '0.6rem' }}>Frete Base Bruto</th>
                    <th style={{ padding: '0.6rem' }}>Tarifa Fixa (&lt; R$ 79,00)</th>
                    <th style={{ padding: '0.6rem' }}>Com 40% Off (Verde Escuro)</th>
                    <th style={{ padding: '0.6rem' }}>Com 70% Off (Platinum/Gold)</th>
                  </tr>
                </thead>
                <tbody>
                  {ML_FRETE_BASE.map((f, idx) => {
                    const tarifaFixaLow = f.freteBase * 0.32;
                    const freteVerdeEscuro = f.freteBase * 0.60;
                    const fretePlatinum = f.freteBase * 0.30;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</td>
                        <td style={{ padding: '0.6rem', color: 'var(--warning)' }}>{formatBRL(f.freteBase)}</td>
                        <td style={{ padding: '0.6rem', color: 'var(--danger)', fontWeight: 600 }}>{formatBRL(tarifaFixaLow)}</td>
                        <td style={{ padding: '0.6rem', color: 'var(--ml-yellow)' }}>{formatBRL(freteVerdeEscuro)}</td>
                        <td style={{ padding: '0.6rem', color: 'var(--success)', fontWeight: 700 }}>{formatBRL(fretePlatinum)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela de Comissões ML */}
          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Tabela de Comissões por Categoria (ML 2026)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Categoria</th>
                    <th style={{ padding: '0.6rem' }}>Anúncio Clássico</th>
                    <th style={{ padding: '0.6rem' }}>Anúncio Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {ML_CATEGORIAS.map((cat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{cat.label}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--warning)' }}>{cat.classico}%</td>
                      <td style={{ padding: '0.6rem', color: 'var(--ml-yellow)', fontWeight: 700 }}>{cat.premium}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela de Desconto Reputação ML */}
          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Desconto no Frete Grátis por Reputação</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {ML_REPUTACAO.map((rep, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ml-yellow)' }}>{rep.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Desconto no frete grátis: {rep.descPct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {guideTab === 'shopee' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--shopee-orange)' }}>
            <h3 style={{ color: 'var(--shopee-orange)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> Regras Oficiais Shopee Brasil 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>• <strong>Comissão Escalonada por Faixa:</strong> A comissão é dividida em faixas de preço final do produto. Itens até R$79,99 possuem comissão de 20% + R$4,00 de taxa fixa. Itens a partir de R$80,00 cobram 14% de comissão base com taxas fixas progressivas.</p>
              <p>• <strong>🔥 Nova Atualização de Afiliados Shopee 2026:</strong> Vendedores que ativam o Programa Oficial de Afiliados Shopee configuram comissão adicional entre <strong>2,5% e 10,0%</strong> para divulgadores parceiros. A Shopee aplica um <strong>teto máximo de cobrança por item de R$ 20,00</strong> por venda convertida por afiliado.</p>
              <p>• <strong>Programa de Frete Grátis Obrigatório:</strong> Todas as contas participantes do programa de Frete Grátis já possuem o cupom de frete embutido de até R$ 20, R$ 30 ou R$ 40 dependendo do valor.</p>
              <p>• <strong>Subsídio Especial PIX:</strong> A Shopee concede subsídio de 5% a 8% nos custos de comissão para pedidos pagos via PIX nas faixas superiores.</p>
              <p>• <strong>Contas CPF de Alto Volume:</strong> Contas operadas como CPF que venderem mais de 450 itens em 90 dias sofrem acréscimo de R$ 3,00 por item enviado.</p>
            </div>
          </div>

          {/* Destaque Atualização Afiliados Shopee */}
          <div className="card" style={{ border: '1px solid var(--shopee-orange-border)', background: 'var(--shopee-orange-bg)' }}>
            <h3 style={{ color: 'var(--shopee-orange)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Nova Regra do Programa de Afiliados Shopee 2026
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p>📌 <strong>Comissão de Afiliados Padrão:</strong> 2,5% a 5,0% (configurável pelo vendedor no Painel de Afiliados da Shopee).</p>
              <p>📌 <strong>Comissão Extra em Campanhas de Influenciadores:</strong> Até 10,0% para produtos em destaque.</p>
              <p>🛡️ <strong>Teto Máximo Protegido:</strong> O teto máximo cobrado pela Shopee no programa de afiliados é de <strong>R$ 20,00 por unidade vendida</strong>, mesmo para produtos de ticket alto.</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Tabela Oficial de Faixas de Preço Shopee 2026</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Faixa de Preço</th>
                    <th style={{ padding: '0.6rem' }}>Comissão (%)</th>
                    <th style={{ padding: '0.6rem' }}>Taxa Fixa (R$)</th>
                    <th style={{ padding: '0.6rem' }}>Subsídio Frete</th>
                    <th style={{ padding: '0.6rem' }}>Subsídio PIX</th>
                  </tr>
                </thead>
                <tbody>
                  {SHOPEE_FAIXAS.map((faixa, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--shopee-orange)' }}>{faixa.label}</td>
                      <td style={{ padding: '0.6rem' }}>{faixa.comissao}%</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{formatBRL(faixa.taxaFixa)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Até {formatBRL(faixa.subsidioFrete)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--success)' }}>{faixa.subsidioPixPct ? `${faixa.subsidioPixPct}%` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {guideTab === 'tiktok' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--tiktok-cyan)' }}>
            <h3 style={{ color: 'var(--tiktok-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={18} /> Guia Completo de Regras &amp; Taxas TikTok Shop 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <p>• <strong>Comissão Base Escalonada por Preço:</strong> Produtos com preço final menor que <strong>R$ 50,00</strong> possuem comissão base de <strong>10% + R$ 4,00</strong> de tarifa fixa. Produtos a partir de <strong>R$ 50,00</strong> possuem comissão reduzida para <strong>6% + R$ 6,00</strong> por unidade vendida.</p>
              <p>• <strong>Programa de Frete Grátis Coparticipado (TikTok Shipping):</strong> Taxa de <strong>6%</strong> sobre o valor do produto, com teto máximo cobrado de <strong>R$ 50,00 por item</strong>.</p>
              <p>• <strong>Taxa de Processamento de Pagamento (Gateway TikTok):</strong> Cobrança de <strong>2,0%</strong> sobre o total do pedido referente à liquidação de cartão, PIX e boleto.</p>
              <p>• <strong>Isenção Promocional de 60 Dias para Vendedores Novos:</strong> Vendedores recém-cadastrados ganham <strong>0% de comissão base</strong> nos primeiros 60 dias de operação (permanecem apenas as taxas de frete e processamento se ativadas).</p>
              <p>• <strong>Comissão de Afiliados (Creator Marketplace):</strong> O vendedor define a comissão dos criadores (geralmente entre 10% e 15%), acrescida de <strong>1,5% de taxa de intermediação de plataforma</strong> da TikTok Creator Store.</p>
              <p>• <strong>Cupons de Live Commerce &amp; Flash Sales:</strong> Em campanhas oficiais de Lives com cupons patrocinados pelo TikTok, o valor do subsídio recebido entra como receita no repasse financeiro.</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} style={{ color: 'var(--tiktok-cyan)' }} />
              Matriz Completa de Tarifas TikTok Shop Brasil 2026
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Tipo de Tarifa / Categoria</th>
                    <th style={{ padding: '0.6rem' }}>Alíquota (%) / Custo Fixos</th>
                    <th style={{ padding: '0.6rem' }}>Condições &amp; Detalhes da Regra</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Comissão Base (&lt; R$ 50,00)</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>10,0% + R$ 4,00 / item</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Aplicada automaticamente em itens abaixo de R$ 50,00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Comissão Base (&gt;= R$ 50,00)</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>6,0% + R$ 6,00 / item</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Alíquota com desconto para itens a partir de R$ 50,00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Frete Grátis Coparticipado</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>6,0% (Teto R$ 50,00)</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Garante frete grátis aos compradores na plataforma</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Processamento Financeiro</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>2,0% por pedido</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Taxa administrativa de recebimento (Cartão, PIX, Boleto)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--success)' }}>Isenção Conta Nova</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--success)' }}>0,0% nos primeiros 60 dias</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Isenção total da comissão base para novos vendedores</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Intermediação de Afiliados</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>1,5% da comissão do criador</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Taxa da plataforma TikTok Creator Store sobre vendas via afiliados</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
