# Orçamento na rede

**Estado:** proposta aprovada pelo autor em 10/out/2026 (D-47 a D-50).
Implementação no chamado SG157, por fases. **As quatro fases foram feitas
em 10/out** (ver "Como ficou a fase 1" a "… fase 4").

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
o turno lê dívida e resultado da rede. **Saiu no SG105** (ver "Uma conta
só").

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
3. **Calibração do Brasil.** Setor público inteiro (D-53): receita ≈ 31% do
   PIB, gasto ≈ 31%, juros ≈ 7,5%: o jogo começa com déficit de uns 7–8% do
   PIB, o primeiro problema a resolver. Situação de juros explosivos. Estabilidade: 8 turnos sem ação
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
- **Módulo fiscal antigo:** continuava rodando no turno, mas nada na tela lia
  dele. Saiu no SG105, com os agregados.

Brasil no turno 0 (hipótese): receita 18,5% do PIB (R$ 2,2 tri), gasto 19,2%
(R$ 2,3 tri), juros 7,4% (R$ 891 bi), déficit 8,2% (R$ 980 bi), dívida 77%
(R$ 9,2 tri). Sem nenhuma ação, a dívida passa de 98% em 8 turnos.

**Limite conhecido (fase 3):** os índices que servem de base (consumo, PIB)
ainda oscilam muito de um turno para outro (o consumo cai de 48 para 26 no
primeiro turno), e a receita oscila junto. É a calibração dos índices (D-41,
SG144), não a conta.

## Como ficou a fase 2

- **Custo de cada opção** em `docs/fichas/custos.json`: para cada lei de
  opções que mexe no orçamento, quanto cada opção custa (`gasto`) ou arrecada
  (`receita`, negativo = renúncia), em % do PIB. O conversor gera uma seta por
  lado com o mecanismo `pontos` (D-52): entre duas opções, a reta que as liga
  (a lei anda mês a mês até a meta, e o custo anda junto). O custo pode estar
  nas pontas do eixo (matriz energética, refugiados) ou no meio.
- **Custos que reagem** (`escala`, D-52): seguro-desemprego × desemprego;
  previdência, previdência rural, pensão por morte, pensão social e cuidados
  de longa duração × envelhecimento; contribuições da previdência × renda das
  famílias; royalties × produção mineral; dividendos das estatais × PIB.
- **Estatais e royalties** arrecadam pelas leis `empresas-estatais-e-privatizacao`
  e `regime-do-petroleo-e-mineracao`; **renúncias** (Simples, zona franca,
  mecenato) tiram receita.
- **Previdência** tem os dois lados: contribuições na receita e benefícios no
  gasto, na mesma lei.
- Os efeitos das fichas sobre gasto e receita dessas leis saíram (a tabela os
  substitui). Leis sem tabela (idade mínima, regra fiscal…) continuam com
  `FORCA_FISCAL`.
- **Folha do funcionalismo:** entrou como custo das opções de estabilidade dos
  servidores e do modelo de polícia; não reage a nada ainda.
- **Tela:** cada opção mostra quanto custa ou arrecada por ano, com o país
  como está; a seta desemprego → gasto aparece no mapa.
- **Setor público inteiro (D-53):** como os pisos de saúde e educação já são
  do país todo, as contas passaram a valer para União, estados e municípios
  juntos. Brasil no turno 0 (hipótese): receita 31,7% do PIB (R$ 3,8 tri),
  gasto 31% (R$ 3,7 tri), juros 7,4% (R$ 890 bi), déficit 6,8% (R$ 810 bi),
  dívida 77%.

**Achado para a fase 3:** com a receita presa às bases, a oscilação dos
índices aparece no orçamento: o déficit vai de 6,8% para 15,8% do PIB no
primeiro turno e volta. Um teste com inércia nas bolhas (cada bolha anda
metade do caminho até o valor que recebe, por mês) reduziu o maior salto da
receita de 8,7 para 2,8 pontos em 8 turnos sem ação. Sobram dois problemas
que a inércia não resolve: o turno 0 não é um ponto de equilíbrio (a
confiança nas instituições cai de 68 para 46 no primeiro turno) e a inflação
começa em 91.

## Como ficou a fase 3

- **Turno 0 = Brasil 2026** (D-55). O estado inicial declara o cenário e o
  valor de 108 índices e situações (inflação 5%, desemprego 6%, Selic 15%,
  pobreza 25%…, todos hipóteses próximas do real). A parte que a rede não
  explica vira o nó "Contexto do Brasil 2026", visível no boletim de cada
  indicador. Receita, gasto, juros e resultado não têm contexto: saem só das
  leis (D-47).
- **Estabilidade** (D-54, D-56). As bolhas andam metade do caminho por mês; o
  que uma lei entrega não passa da opção mais forte; efeito "só na última
  opção" vira rampa. Em 8 turnos sem ação nenhum índice pula mais de 3% da
  escala.
- **Contas** (escolha do autor: déficit real). Receita 31,4% do PIB, gasto
  31%, juros 8,1% (0,7 × Selic × dívida), déficit 7,7%. A dívida passa de 77%
  para cerca de 93% em dois anos e 112% em quatro, se nada for feito.
- **Juros explosivos.** Situação = parte da receita que vai para os juros
  (juros ÷ receita × 100). Surge acima de 32% (começa em 26%); quando surge,
  aumenta o risco-país e os juros e derruba a confiança das empresas e a
  popularidade. Sem ação, aparece no terceiro ano: dá tempo de reagir dentro
  do mandato.
- **Referências** das bases e dos custos que reagem passaram a ser os valores
  do Brasil 2026 (consumo 50, renda 45, PIB 45, desemprego 6).

## Como ficou a fase 4 (cofre e empréstimos)

**O que é o cofre.** A bolha "Dívida pública" guarda a posição líquida do
governo e pode ficar abaixo de zero (até −100% do PIB). Abaixo de zero, a
diferença é o **cofre** (D-57):

- o superávit primeiro abate a dívida; quando ela acaba, enche o cofre;
- o déficit primeiro gasta o cofre; só depois volta a criar dívida;
- os juros continuam sendo taxa × dívida: com dívida negativa ficam
  negativos, ou seja, o cofre **rende** (aparece como "rendimento do cofre");
- a situação "Cofre do Tesouro" (boa, verde, não pisca) aparece no mapa
  quando há cofre; a barra troca "Dívida" por "Cofre".

**O que fazer com o cofre: a lei "Uso do cofre" (fundo soberano).** Cada
efeito é proporcional ao tamanho do cofre (escala: cofre ÷ 10% do PIB), então
a lei não faz nada enquanto há dívida:

| Opção                 | Efeito (com cofre de 10% do PIB)                                                                                  | Exemplo real           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Guardar no Tesouro    | só o rendimento; reputação +1                                                                                     | Chile                  |
| Fundo no exterior     | reputação +4; inflação −0,5; corrupção +0,5                                                                       | Noruega                |
| Emprestar às empresas | crédito +8, investimento +5 → PIB; inflação +0,8; corrupção +2                                                    | Temasek, BNDES 2008–14 |
| Investir em obras     | gasto +2% do PIB (o cofre diminui); investimento +3; infraestrutura +0,5 por trimestre; inflação +1; corrupção +3 | China                  |

**Efeito no PIB (o estudo).** Emprestar não é gasto: o dinheiro volta, então o
cofre não encolhe, mas vira crédito e investimento, que já empurram o PIB
pela rede. Obras são gasto: o cofre encolhe, a infraestrutura cresce devagar e
o investimento sobe na hora. Guardar e aplicar fora não mexem no PIB, mas
seguram a inflação e protegem o país na próxima crise (o cofre cobre os
déficits). O preço de pôr o dinheiro para girar é a inflação e a corrupção.

**No Brasil 2026** a dívida é de 77% do PIB, então o cofre está longe: serve
para partidas longas e para cenários com pouca dívida. A lei já vem em
"guardar".

**Para depois:** empréstimos com calote (parte do cofre emprestado não
volta numa recessão); quanto investir em cada obra (B-17).

## Contas sem furos (SG159, D-59)

O relatório de testes de 10/out achou dois furos, corrigidos: (1) o resultado
tinha teto de 30% do PIB e era amortecido separado das partes, então parte do
déficit sumia e a conta não fechava; (2) dívida e cofre tinham limite de
escala, e passar dele travava o turno. Agora as quatro contas respondem na
hora (`resposta: 1`) e têm domínio aberto; dívida e cofre não têm limite; a
escala das bolhas para desenhar vem de `faixaVisual`. Uma crise de dívida de
verdade (calote, socorro) é regra de jogo a desenhar (SG106), não um limite
de escala.

## Uma conta só (SG105)

O livro fiscal paralelo (`domain/fiscal`, `GameState.fiscal`, a ficha
`fiscal` do estado inicial com caixa, agregados e crédito, e o relatório
fiscal do trimestre) saiu. O turno prepara os três meses só pelo motor; caixa
e dívida existem uma vez, na rede. O juro da dívida nova entra no mês
seguinte: os juros de um mês leem a dívida do fim do mês anterior. Testes:
`turnoSemFiscalAntigo.test.ts` (16 turnos sem erro, conta fechando a cada
turno).

## Pisos vinculados à receita (SG137, D-25)

O piso da saúde e o da educação deixaram de ser valores em R$: o nível da
lei é a **parte da receita** que vai para a área (modo
`percentual_orcamento`, base `receita_total`, unidade `percentual_receita`,
de 0 a 40%). O dinheiro que entra na rede é nível × arrecadação ÷ 100, em %
do PIB (`normalizacao.fator: "arrecadacao"`, multiplicador 0,01): o elo do
gasto, os efeitos da ficha e as ligações com os grupos leem esse valor, com a
faixa em % do PIB da ficha como escala.

Consequência para o jogador: **subir imposto também aumenta saúde e
educação** e uma recessão corta as duas, como a vinculação constitucional
faz no Brasil. Brasil 2026: saúde 13,69% e educação 17,51% da receita, o
mesmo dinheiro de antes (4,3% e 5,5% do PIB), então o orçamento do turno 0 não
mudou. Na tela, o controle mostra a % e quanto ela vale por ano.

## Questões abertas

- PIB em R$ como nó (hoje o PIB da rede é um índice 0–100 e o PIB em R$ é
  fixo): necessário para "% do PIB" mudar com a economia. Proposta: fase 3.
