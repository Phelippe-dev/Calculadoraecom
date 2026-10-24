import React, { useState } from 'react';
import { Zap, ShoppingBag, Video, Package, Shirt, Info, Truck, Users } from 'lucide-react';
import { 
  ML_CATEGORIAS, ML_FRETE_BASE, ML_REPUTACAO, 
  SHOPEE_FAIXAS, AMAZON_CATEGORIAS, AMAZON_FRETE_DBA, 
  SHEIN_CATEGORIAS, SHEIN_FRETE, formatBRL 
} from './PricingCalculator';

export default function RulesGuide() {
  const [guideTab, setGuideTab] = useState('ml');

  return (
    <div className="tab-panel">
      {/* Header */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header flex-header">
          <div>
            <span className="badge badge-success">CENTRAL DE AUDITORIA &amp; TARIFAS 2026</span>
            <h2 style={{ marginTop: '0.4rem' }}>Guia Oficial de Taxas, Comissões e Regras 2026</h2>
            <p>Consulte as tabelas e regulamentos oficiais vigentes no Mercado Livre, Shopee, TikTok Shop, Amazon Brasil e Shein.</p>
          </div>
          <div className="segmented-control" style={{ maxWidth: '620px' }}>
            <button type="button" className={`seg-btn seg-btn-ml ${guideTab === 'ml' ? 'active' : ''}`} onClick={() => setGuideTab('ml')}>
              <Zap size={14} /> Mercado Livre
            </button>
            <button type="button" className={`seg-btn seg-btn-shopee ${guideTab === 'shopee' ? 'active' : ''}`} onClick={() => setGuideTab('shopee')}>
              <ShoppingBag size={14} /> Shopee
            </button>
            <button type="button" className={`seg-btn seg-btn-tiktok ${guideTab === 'tiktok' ? 'active' : ''}`} onClick={() => setGuideTab('tiktok')}>
              <Video size={14} /> TikTok Shop
            </button>
            <button type="button" className={`seg-btn seg-btn-amazon ${guideTab === 'amazon' ? 'active' : ''}`} onClick={() => setGuideTab('amazon')}>
              <Package size={14} /> Amazon
            </button>
            <button type="button" className={`seg-btn seg-btn-shein ${guideTab === 'shein' ? 'active' : ''}`} onClick={() => setGuideTab('shein')}>
              <Shirt size={14} /> Shein
            </button>
          </div>
        </div>
      </div>

      {/* GUIA MERCADO LIVRE */}
      {guideTab === 'ml' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Regras de Logística Atualizadas */}
          <div className="card" style={{ borderLeft: '4px solid var(--ml-yellow)' }}>
            <h3 style={{ color: 'var(--ml-yellow)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} /> Regras de Logística e Frete (Vigentes 2026)
            </h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>• <strong>Reajuste de Frete (Mercado Envios):</strong> Atualização na tabela oficial para pacotes acima e abaixo de R$ 19,00. O frete agora varia com base no peso real, cubagem (dimensões da embalagem) e distância da entrega.</p>
              <p>• <strong>Envios Flex Dinâmico:</strong> Fim da tarifa/bônus fixo único. O custo do Flex passa a ser calculado individualmente considerando tamanho da caixa, peso e raio de distância.</p>
              <p>• <strong>Reajuste no Mercado Envios Full:</strong> Novas tabelas de armazenagem diária, coletas e regras mais rígidas para produtos sem conformidade de estoque.</p>
              <p>• <strong>Tarifa Operacional por Unidade (&lt; R$ 79,00):</strong> Cobrança operacional proporcional à cubagem em substituição à antiga taxa fixa fixa linear por unidade.</p>
              <p style={{ marginTop: '0.2rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                📌 <strong>Ação Recomendada:</strong> Revise as dimensões (A x L x C) e o peso cadastrado de todos os seus SKUs no painel do Mercado Livre para evitar acréscimos indevidos por estimativa de cubagem.
              </p>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--ml-yellow)' }}>
            <h3 style={{ color: 'var(--ml-yellow)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} /> Regras Oficiais Mercado Livre 2026
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    Desconto no frete grátis: {rep.descPct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GUIA SHOPEE */}
      {guideTab === 'shopee' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--shopee-orange)' }}>
            <h3 style={{ color: 'var(--shopee-orange)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> Regras Oficiais Shopee Brasil 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p>• <strong>Comissão Escalonada por Faixa:</strong> A comissão inclui transação + frete grátis integrado. Itens até R$ 79,99 possuem comissão de 20% + R$ 4,50 de taxa fixa. Para itens de super baixo ticket (até R$ 8,99), a taxa fixa é limitada a metade do preço do produto.</p>
              <p>• <strong>Fim do Teto de Comissão:</strong> O antigo teto limite de R$ 100 por item foi extinto pela Shopee. Itens de ticket alto agora pagam 14% integralmente.</p>
              <p>• <strong>Faixa Acima de R$ 500,00:</strong> 14% de comissão + R$ 26,00 de tarifa fixa por item.</p>
              <p>• <strong>Programa de Afiliados Shopee 2026:</strong> O vendedor configura entre <strong>2,5% e 10,0%</strong> para divulgadores parceiros, com <strong>teto de cobrança protegido de R$ 20,00</strong> por venda.</p>
              <p>• <strong>Subsídio Especial PIX:</strong> O comprador recebe 5% ou 8% de desconto automático no Pix subsidiado pela Shopee (sem alterar a receita nominal líquida do vendedor).</p>
              <p>• <strong>Contas CPF de Alto Volume:</strong> Contas CPF que venderem mais de 450 itens em 90 dias sofrem acréscimo de R$ 3,00 por item enviado.</p>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid var(--shopee-orange-border)', background: 'var(--shopee-orange-bg)' }}>
            <h3 style={{ color: 'var(--shopee-orange)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Programa de Afiliados Shopee 2026
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <p>📌 <strong>Comissão de Afiliados Padrão:</strong> 2,5% a 5,0% (configurável pelo vendedor no Painel de Afiliados da Shopee).</p>
              <p>📌 <strong>Comissão Extra em Campanhas de Influenciadores:</strong> Até 10,0% para produtos em destaque.</p>
              <p>🛡️ <strong>Teto Máximo Protegido:</strong> O teto máximo cobrado pela Shopee no programa de afiliados é de <strong>R$ 20,00 por unidade vendida</strong>.</p>
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
                    <th style={{ padding: '0.6rem' }}>Desconto PIX Comprador</th>
                  </tr>
                </thead>
                <tbody>
                  {SHOPEE_FAIXAS.map((faixa, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--shopee-orange)' }}>{faixa.label}</td>
                      <td style={{ padding: '0.6rem' }}>{faixa.comissao}%</td>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{formatBRL(faixa.taxaFixa)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-primary)' }}>Até {formatBRL(faixa.subsidioFrete)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--success)' }}>{faixa.subsidioPixPct ? `${faixa.subsidioPixPct}% (Subsidiado Shopee)` : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* GUIA TIKTOK SHOP */}
      {guideTab === 'tiktok' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--tiktok-cyan)' }}>
            <h3 style={{ color: 'var(--tiktok-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={18} /> Guia Completo de Regras &amp; Taxas TikTok Shop 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <p>• <strong>Comissão Base Escalonada por Preço:</strong> Produtos com preço menor que <strong>R$ 50,00</strong> possuem comissão base de <strong>10% + R$ 4,00</strong> de tarifa fixa. Produtos a partir de <strong>R$ 50,00</strong> possuem comissão reduzida para <strong>6% + R$ 6,00</strong> por unidade vendida.</p>
              <p>• <strong>Programa de Frete Grátis Coparticipado (TikTok Shipping):</strong> Taxa de <strong>6%</strong> sobre o valor do produto, com teto máximo cobrado de <strong>R$ 50,00 por item</strong>.</p>
              <p>• <strong>Isenção Promocional de 60 Dias para Vendedores Novos:</strong> Vendedores recém-cadastrados ganham <strong>0% de comissão base</strong> nos primeiros 60 dias de operação.</p>
              <p>• <strong>Comissão de Afiliados (Creator Marketplace):</strong> O vendedor define a comissão dos criadores (geralmente entre 10% e 15%) diretamente no painel do TikTok Shop.</p>
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
                    <td style={{ padding: '0.6rem', color: 'var(--text-primary)' }}>Aplicada automaticamente em itens abaixo de R$ 50,00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Comissão Base (&gt;= R$ 50,00)</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>6,0% + R$ 6,00 / item</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-primary)' }}>Alíquota com desconto para itens a partir de R$ 50,00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--tiktok-cyan)' }}>Frete Grátis Coparticipado</td>
                    <td style={{ padding: '0.6rem', fontWeight: 600 }}>6,0% (Teto R$ 50,00)</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-primary)' }}>Garante frete grátis aos compradores na plataforma</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--success)' }}>Isenção Conta Nova</td>
                    <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--success)' }}>0,0% nos primeiros 60 dias</td>
                    <td style={{ padding: '0.6rem', color: 'var(--text-primary)' }}>Isenção total da comissão base para novos vendedores</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* GUIA AMAZON BRASIL */}
      {guideTab === 'amazon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--amazon-orange)' }}>
            <h3 style={{ color: 'var(--amazon-orange)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} /> Guia Oficial de Tarifas Amazon Brasil 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <p>• <strong>Planos de Venda:</strong> No <strong>Plano Profissional</strong> (R$ 19,00/mês, com 1º ano gratuito para novos cadastros), você <strong>não paga taxa fixa de R$ 2,00 por item</strong>. No <strong>Plano Individual</strong> (sem mensalidade), é cobrado R$ 2,00 fixo por item vendido além da comissão.</p>
              <p>• <strong>Comissão por Categoria (Taxa de Indicação):</strong> Incide sobre o valor total do pedido. A comissão varia de <strong>10% a 15%</strong> na maioria das categorias, com um <strong>piso mínimo de R$ 1,00</strong> por unidade vendida.</p>
              <p>• <strong>DBA (Delivery by Amazon):</strong> O vendedor mantém o estoque em seu galpão, e a transportadora da Amazon realiza a coleta e entrega ao consumidor final com custos reduzidos tabelados por peso.</p>
              <p>• <strong>FBA (Fulfillment by Amazon):</strong> A Amazon armazena, embala e despacha os produtos a partir de seus Centros de Distribuição (CDs), além de oferecer o selo Prime com frete grátis para clientes.</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} style={{ color: 'var(--amazon-orange)' }} />
              Tabela de Frete DBA &amp; FBA Amazon Brasil
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Faixa de Peso</th>
                    <th style={{ padding: '0.6rem' }}>DBA (Delivery by Amazon)</th>
                    <th style={{ padding: '0.6rem' }}>FBA (Fulfillment by Amazon CD)</th>
                  </tr>
                </thead>
                <tbody>
                  {AMAZON_FRETE_DBA.map((f, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--amazon-orange)', fontWeight: 600 }}>{formatBRL(f.valor)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--success)', fontWeight: 600 }}>{formatBRL(f.valor + 2.50)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Comissões por Categoria Amazon Brasil</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Categoria</th>
                    <th style={{ padding: '0.6rem' }}>Comissão Oficial (%)</th>
                    <th style={{ padding: '0.6rem' }}>Tarifa Mínima</th>
                  </tr>
                </thead>
                <tbody>
                  {AMAZON_CATEGORIAS.map((cat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{cat.label}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--amazon-orange)', fontWeight: 700 }}>{cat.comissao}%</td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>R$ 1,00 por item</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* GUIA SHEIN BRASIL */}
      {guideTab === 'shein' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--shein-pink)' }}>
            <h3 style={{ color: 'var(--shein-pink)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shirt size={18} /> Guia Oficial de Vendedores Shein Brasil 2026
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <p>• <strong>Sem Taxa Fixa por Item:</strong> Diferente de outros marketplaces, a Shein <strong>não cobra taxa fixa por item vendido</strong> nem mensalidade para manter a loja ativa!</p>
              <p>• <strong>Comissão por Categoria:</strong> A alíquota é de <strong>20% para Moda Feminina</strong> e <strong>18% para as demais categorias</strong> (Moda Masculina, Infantil, Calçados, Bolsas, Casa, Decoração e Beleza).</p>
              <p>• <strong>Isenção Inicial de 30 Dias:</strong> Novos sellers contam com benefício de <strong>0% de comissão nos primeiros 30 dias</strong> após a aprovação da conta.</p>
              <p>• <strong>Logística Integrada Shein:</strong> O envio é realizado via transportadoras parceiras oficiais ou pontos de coleta credenciados, com tabelas competitivas por peso e subsídios frequentes de frete aos compradores.</p>
              <p>• <strong>Sem Comissão em Devoluções:</strong> Em pedidos cancelados ou reembolsados pelo cliente, a comissão não é cobrada.</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={18} style={{ color: 'var(--shein-pink)' }} />
              Tabela de Envio Integrado Shein Brasil por Peso
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Faixa de Peso</th>
                    <th style={{ padding: '0.6rem' }}>Custo de Envio Vendedor</th>
                    <th style={{ padding: '0.6rem' }}>Condições de Coleta</th>
                  </tr>
                </thead>
                <tbody>
                  {SHEIN_FRETE.map((f, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 700, color: 'var(--text-primary)' }}>{f.label}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--shein-pink)', fontWeight: 700 }}>{formatBRL(f.valor)}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--text-secondary)' }}>Postagem em Ponto de Coleta ou Coleta no Endereço</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Comissões Oficiais por Categoria Shein Brasil</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.6rem' }}>Categoria</th>
                    <th style={{ padding: '0.6rem' }}>Comissão Oficial (%)</th>
                    <th style={{ padding: '0.6rem' }}>Tarifa Fixa por Item</th>
                  </tr>
                </thead>
                <tbody>
                  {SHEIN_CATEGORIAS.map((cat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.6rem', fontWeight: 600 }}>{cat.label}</td>
                      <td style={{ padding: '0.6rem', color: 'var(--shein-pink)', fontWeight: 700 }}>{cat.comissao}%</td>
                      <td style={{ padding: '0.6rem', color: 'var(--success)', fontWeight: 600 }}>R$ 0,00 (Isento)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
