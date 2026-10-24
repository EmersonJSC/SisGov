# Mecânica 1 da nova ordem: Economia em reais e caixa do governo

> **Status: PROPOSTA (24/out/2026), para o autor aprovar.** Junta o que estava
> espalhado: A2 e A3 (travas das leis de valor), fases 5 e 6 do
> [orçamento](orcamento.md) e o pedaço da população que o caixa precisa.
> Tela de referência: aba Orçamento de
> [amostras/telas-v2.html](../amostras/telas-v2.html).
> Regra de trabalho (24/out): construir primeiro, calibrar no fim. Os números
> abaixo são de partida; os testes desta mecânica checam comportamento, não
> números exatos.

## 1. O que é

O país passa a ter uma economia em reais por baixo, e o caixa do governo sai
dela. Cada imposto cobra sobre uma base que existe no jogo (salários, lucros,
consumo, patrimônio), e cada gasto grande é uma lei. O jogador vê de onde vem e
para onde vai cada real, e nenhum real fica sem dono.

## 2. Regras

### 2.1 A economia em reais (todo mês)

| Número | De onde sai | O que move |
| --- | --- | --- |
| **PIB em reais** | estoque: cresce pelo crescimento real + inflação | o ritmo da economia (índice `pib`), a inflação |
| **População** | estoque: + nascimentos − mortes ± migração | taxas do país; as leis mexem nelas na mecânica 3 |
| **Ocupados** | população em idade de trabalhar × participação × (1 − desemprego) | desemprego, participação |
| **Salários (massa salarial)** | ocupados × salário médio | produtividade, salário mínimo, custo do trabalho, informalidade |
| **Lucros** | PIB − salários − impostos sobre o consumo | o que sobra dos salários; produtividade e confiança |
| **Consumo das famílias** | renda das famílias × quanto gastam | índice Consumo (já existe), crédito, inflação |
| **Patrimônio** | estoque: + poupança + valorização | juros, crédito, preço dos imóveis |
| **Mortes no ano** | população × taxa de mortalidade | saúde da população (já existe) |

Os índices de hoje (Consumo, Produtividade, Desemprego, Investimento,
Confiança) continuam e passam a **mover** esses números em reais. Nada é
apagado.

### 2.2 Impostos: alíquota × base, menos o que escapa

**arrecadação = alíquota × base × (1 − o que escapa)**

| Imposto | Base |
| --- | --- |
| Renda das pessoas | salários e outras rendas, nas faixas que pagam |
| Contribuição sobre os salários (lei nova, sai da previdência) | salários formais |
| Consumo | consumo das famílias |
| Lucro das empresas | lucros |
| Dividendos | parte dos lucros que é distribuída (cai quando a alíquota sobe) |
| Imóveis urbanos, terras rurais | patrimônio em imóveis e em terras |
| Heranças | patrimônio de quem morre no ano (mortes × patrimônio médio) |
| Grandes fortunas | patrimônio dos mais ricos |
| Transações bancárias | dinheiro que circula (PIB × giro do crédito) |

**O que escapa** sobe com a alíquota: sonegação, informalidade, lucro guardado,
dinheiro saindo do país. A curva de cada imposto vem das curvas de hoje, que já
têm esse formato de pico e queda. A diferença é que a base agora é visível e
reage à economia.

### 2.3 Gastos: cada um é uma lei

| Gasto | Conta | Lei |
| --- | --- | --- |
| Aposentadorias e pensões | beneficiários × benefício médio | existe (regras); o valor passa a sair da conta |
| Salário dos servidores | servidores × salário médio | **nova**: quantidade e salário |
| Seguro-desemprego | desempregados cobertos × valor | **nova** (hoje está dentro de outra) |
| Renda de idosos e pessoas com deficiência pobres | beneficiários × valor | **nova** como programa |
| Pisos de saúde e educação | % da receita | existe |
| Verbas e programas | o valor da lei, em reais | existem |
| Juros da dívida | dívida × juro médio | não é lei: vem da dívida e da Selic |

- **Sem trava por lei:** saem os tetos em % do PIB das verbas e o teto de 40%
  dos pisos. O piso que vem da Constituição (`pisoPorLei`) continua.
- **Um limite só:** a soma dos gastos não passa de 100% do PIB.
- **Verbas em reais e inflação:** a verba vale o número que está na lei. Com
  inflação, ela compra menos a cada ano, e a janela da lei mostra isso ("vale
  4,8% menos que há um ano").

### 2.4 Sobra e falta

- **Falta:** vira dívida (já existe), e a dívida puxa juros e risco-país (já
  existe).
- **Sobra:** a lei "Destino da sobra" reparte entre pagar a dívida e o
  **fundo soberano**. O fundo rende e pode cobrir um déficit numa crise.

### 2.5 O que o jogador vê

A aba Orçamento da amostra: entra e sai lado a lado, agrupados; cada linha
abre a lei; ao passar o mouse aparece a conta ("10% × R$ 600 bi distribuídos,
15% escapam"); no topo, o caixa do ano e a dívida.

## 3. Entradas e saídas

- **Lê:** índices da rede (consumo, produtividade, desemprego, investimento,
  confiança, saúde, inflação), leis de imposto e de gasto, dados do país.
- **Entrega:** receita, gasto, resultado, dívida e fundo em reais e em % do
  PIB; as bases para a tela; população e mortes para as mecânicas 3 (população)
  e 6 (eleição).

## 4. No código

- **Conteúdo (rede):** estoques novos `pib_nominal`, `populacao`,
  `patrimonio`; calculados `ocupados`, `massa_salarial`, `lucros`,
  `consumo_reais`, `mortes`; cada imposto troca a curva "alíquota → % do PIB"
  por alíquota × base × (1 − escape).
- **País:** `economia.json` ganha os números de partida (população, ocupados,
  salário médio, patrimônio, taxas), com fonte.
- **App:** `app/partida/contas.ts` lê tudo em reais; a visão entrega a lista de
  linhas do orçamento com a conta de cada uma.
- **Tela:** aba Orçamento (fase 6). O topo novo e as outras abas ficam para a
  versão 2.

## 5. Fases

1. PIB em reais e população mínima (habitantes, ocupados, mortes).
2. Bases: salários, lucros, consumo, patrimônio.
3. Impostos pela base. Contribuição sobre os salários vira lei própria.
4. Gastos com lei: servidores, seguro-desemprego, renda de idosos pobres;
   previdência pela conta; saem as travas por lei; entra o limite de 100% do PIB.
5. Sobra e fundo soberano.
6. Tela de orçamento.

Cada fase: implementar, testes de comportamento, `npm run check` (GPT),
commit. Sem recalibrar números até o fim do ciclo de jogo.

## 6. Testes (comportamento)

- Subir a alíquota de um imposto aumenta a arrecadação até um ponto e depois
  ela cai.
- Mais desemprego diminui a massa salarial e a arrecadação sobre salários.
- Mais mortes (ou mais patrimônio) aumentam a base do imposto sobre heranças.
- Contratar servidores aumenta o gasto na conta exata (quantidade × salário).
- Nenhum gasto acima de 1% do PIB fica sem lei.
- Uma verba pode ir de 0 até o limite de 100% do PIB; o piso constitucional
  continua.
- Com sobra, o fundo soberano cresce na parte que a lei manda.

## 7. Para o autor decidir

1. **Servidores:** uma lei com dois controles (quantidade e salário) ou duas
   leis?
2. **Verbas e inflação:** a verba perde valor sozinha (o jogador reajusta)
   ou existe uma lei "reajustar as verbas pela inflação"?
3. **Patrimônio:** um número só ou dividido entre imóveis, terras e
   financeiro (para os impostos de imóveis, terras e fortunas)?
