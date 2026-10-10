# Orçamento na rede

**Estado:** proposta aprovada pelo autor em 10/out/2026 (D-47 a D-50).
Implementação no chamado SG157, por fases. **Fase 1 feita em 10/out**
(ver "Como ficou a fase 1").

## A ideia

O jogo inteiro é a movimentação do grafo. O orçamento não é um sistema ao
lado da rede: **é parte dela**.

- **Quanto o país arrecada** é a soma das bolhas que geram receita: impostos,
  estatais, royalties, apostas…
- **Quanto o país gasta** é a soma das bolhas que custam: piso da educação,
  câmeras corporais, seguro-desemprego, folha do funcionalismo…
- **Os juros da dívida** são uma bolha como as outras: incham quando a dívida
  ou a taxa sobem e, quando ficam altos demais, viram uma situação que pisca.
- **O resultado** de cada mês é receita − gasto − juros. O foco do jogo é o
  equilíbrio entre **superávit** e **déficit**.
- **A dívida** é uma bolha lenta (estoque): o déficit soma, o superávit abate.
- **O caixa não é o centro.** Ele só aparece depois que a dívida acaba: aí o
  superávit vai para um cofre, que pode ser emprestado (efeito no PIB a
  estudar, fase 4).

Para o jogador, os estados e municípios ficam implícitos: existe um governo
só, com números coerentes entre si.

## Como o Democracy 4 faz (referência, não modelo)

Nos dados de exemplo (`docs/Exemplos/simulation/policies.csv`), cada política
tem custo e/ou receita entre um mínimo e um máximo conforme o nível, e esse
valor é multiplicado pelo estado do país: o seguro-desemprego custa mais com
desemprego alto; o imposto de renda arrecada mais com PIB alto e emprego
alto. Orçamento = receitas − custos − juros; o déficit vira dívida. Não há
cofre. O SisGov segue a mesma lógica, mas com tudo visível como bolha e
explicável pelas setas.

## Como está hoje (10/out)

| Peça                                         | Hoje                                                               | Problema                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Receita                                      | 93% vem do agregado "impostos ainda não modelados" (2,05 tri)      | as 8 leis de imposto não arrecadam                                                    |
| Gasto                                        | 9 leis de gasto + agregado "previdência" (950 bi)                  | custo das opções (câmeras etc.) não entra; leis de gasto em escala de União + estados |
| Juros                                        | fórmula fixa no módulo fiscal                                      | não é bolha                                                                           |
| Dívida                                       | duas: `divida_publica` (bolha, % do PIB) e `fiscal.totalDebt` (R$) | dois números para a mesma coisa                                                       |
| Caixa                                        | gasta até zerar e só então emite dívida                            | o jogador vê o caixa "zerar em 3 turnos"                                              |
| Arrecadação, gasto público, resultado fiscal | bolhas calculadas por pesos                                        | separadas da conta de verdade                                                         |

## Os nós do orçamento

Visíveis no mapa como bolhas. A proposta era guardá-los em R$; na fase 1
ficaram em % do PIB e a tela mostra em R$ (D-51, ver "Como ficou a fase 1"):

| Nó               | Tipo     | Recebe de                                                                                                                                                           |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Receita          | índice   | cada imposto: alíquota × base (consumo, renda, emprego, lucro); estatais, royalties, apostas                                                                        |
| Gasto            | índice   | leis de gasto (o nível é o gasto); custo de cada opção das outras leis; custos que reagem (seguro × desemprego, previdência × envelhecimento, folha × estabilidade) |
| Juros da dívida  | índice   | taxa de juros × dívida                                                                                                                                              |
| Resultado        | índice   | receita (+), gasto (−), juros (−)                                                                                                                                   |
| Dívida pública   | estoque  | resultado: déficit soma, superávit abate; mínimo 0                                                                                                                  |
| Juros explosivos | situação | juros ÷ receita acima de um ponto: surge e pisca                                                                                                                    |
| Cofre (fase 4)   | estoque  | superávit quando a dívida é zero                                                                                                                                    |

As bolhas de hoje que medem o mesmo (`arrecadacao`, `gasto_publico`,
`resultado_fiscal`, `juros_da_divida`, `divida_publica`) passam a ser estas,
em vez de existirem em paralelo. As consequências que liam essas bolhas em
% do PIB passam a ler a razão pelo PIB (`normalizacao`).

## O que o motor precisa

Um único recurso novo: **produto entre dois nós** (alíquota × base,
taxa × dívida). Proposta: estender a `normalizacao`, que já divide a origem
por outro nó, para também multiplicar:

```json
"normalizacao": { "fator": "consumo", "multiplicador": 0.01 }
```

A entrada vira `origem × fator × multiplicador`. Continua determinístico,
explicável (a explicação registra o fator) e vale para qualquer país (D-39).
Estoque em moeda já existe (`updateStock`, taxa `moeda_por_passo`).

O módulo fiscal (`domain/fiscal`, `GameState.fiscal`) deixa de fazer a conta:
o turno lê dívida e resultado da rede. O código fica até a fase 1 provar
que a rede fecha a mesma conta; depois sai.

## Tela

- Barra superior: **Receita · Gasto · Superávit/Déficit · Dívida** (o caixa
  sai; aparece só quando houver cofre).
- Cada lei mostra no mapa e no documento quanto arrecada (+R$) ou custa
  (−R$) por ano e por mês (D-28).
- O relatório de impacto mostra o efeito no resultado antes de assinar.
- Juros incham e desincham; a situação "Juros explosivos" pisca.

## Fases (SG157)

1. **Motor e esqueleto.** Produto entre nós; nós de receita, gasto, juros,
   resultado e dívida em R$; leis de gasto e impostos ligados; agregados
   removidos; o turno lê a dívida da rede; nova barra superior.
   _Aceite:_ subir a alíquota do IVA aumenta a receita no mesmo turno; queda
   do consumo reduz a receita nos turnos seguintes; o déficit soma na dívida
   e o superávit abate.
2. **Custos de todas as leis.** Custo por opção (SG138), custos que reagem
   (seguro-desemprego, previdência, folha), estatais e royalties.
3. **Calibração do Brasil.** Receita ≈ 18% do PIB, gasto ≈ 19%, juros ≈ 7,5%:
   o jogo começa com déficit de uns 8% do PIB, o primeiro problema a
   resolver. Situação de juros explosivos. Estabilidade: 8 turnos sem ação
   mudam pouco.
4. **Cofre e empréstimos (estudo).** O que fazer com superávit quando a
   dívida acaba; efeito de emprestar no PIB.

## Como ficou a fase 1

- **Unidade interna: % do PIB.** As bolhas de receita, gasto, juros e
  resultado ficam em % do PIB, e a dívida em % do PIB (estoque). Assim o
  conteúdo do mundo vale para qualquer país (D-39): nenhum número em reais do
  Brasil entra no catálogo. A tela converte para R$ pelo PIB do país
  (`pib_nominal`, um controle que o país declara; hoje constante).
- **Lei de gasto → gasto:** elo contábil `recursos ÷ PIB × 100`, coeficiente 1.
- **Imposto → receita:** `alíquota × base × fator` (`normalizacao.fator`). Bases:
  consumo (IVA), renda das famílias (IR das pessoas), PIB (os demais). O fator
  sai de `ARRECADACAO_POR_PONTO ÷ BASE_REFERENCIA` no conversor (hipótese).
- **Juros:** `0,8 × taxa de juros × dívida ÷ 100` (`taxa_juros` × `divida_publica`).
- **Resultado:** receita − gasto − juros (três setas de coeficiente ±1).
- **Dívida:** recebe −resultado ÷ 4 por trimestre (déficit soma, superávit
  abate; mínimo 0).
- **Leis regulatórias:** os efeitos das fichas sobre gasto e receita usam a
  tabela `FORCA_FISCAL` (fraca/média/forte = 0,1/0,25/0,45% do PIB com a lei
  no máximo) até a fase 2 dar custo por opção.
- **Saíram:** efeitos de ficha sobre juros (os juros vêm só de taxa × dívida),
  sobre o resultado (viram efeito no gasto quando a lei não tinha um) e as
  contas paralelas de leis de gasto e de imposto.
- **Conta de dinheiro lê o nível** (`"leitura": "nivel"`): a lei custa o que
  foi aprovado, sem a eficácia.
- **Módulo fiscal antigo:** continua rodando no turno, mas nada na tela lê
  dele. Os agregados ficam só lá e saem junto com ele.

Brasil no turno 0 (hipótese): receita 18,5% do PIB (R$ 2,2 tri), gasto 19,2%
(R$ 2,3 tri), juros 7,4% (R$ 891 bi), déficit 8,2% (R$ 980 bi), dívida 77%
(R$ 9,2 tri). Sem nenhuma ação, a dívida passa de 98% em 8 turnos.

**Limite conhecido (fase 3):** os índices que servem de base (consumo, PIB)
ainda oscilam muito de um turno para outro (o consumo cai de 48 para 26 no
primeiro turno), e a receita oscila junto. É a calibração dos índices (D-41,
SG144), não a conta.

## Questões abertas

- PIB em R$ como nó (hoje o PIB da rede é um índice 0–100 e o PIB em R$ é
  fixo): necessário para "% do PIB" mudar com a economia. Proposta: fase 3.
- Pisos da saúde e da educação como % da receita (D-25) dentro da rede:
  o piso lê a receita (produto), então gasto acompanha a arrecadação.
