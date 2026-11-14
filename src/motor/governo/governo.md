# Governo

Passo 5 da ordem de construir (12/nov/2026): ministérios com fichas, órgãos
por instituição e corrupção (instituições desde 13/nov). O motor não conhece
nome de ministério nem de pessoa: **instituições** e **moldes** (caixas
sugeridas) são do mundo (`mundo/ministerios/instituicoes.json` e
`moldes.json`, da `docs/jogo/gdd.xlsx`); **os ministérios do
começo, pessoas e quem manda em cada caixa** são do país
(`paises/<id>/governo.json`), e o jogador pode trocar as caixas no começo. País sem `governo.json`
joga como antes: as leis chegam como estão escritas.

Código: `tipos.ts`, `ministerios.ts` (caixas, ficha e ajuste), `orgaos.ts`
(verba, rendimento, corrupção), `indices.ts` (caches), `index.ts` (porta,
validação e a fase do turno).

## Ministério = caixa

- Uma caixa tem id, nome e uma lista de **instituições**, de zero em diante
  (R6.10). A lei mora numa instituição (o campo `esfera` do JSON da lei).
- A lei vai para a caixa que leva a instituição dela; senão para a **sobra**,
  que é o gabinete. Instituição **sem ministro** (Eleições, Regras dos poderes)
  não vai a caixa nenhuma: a lei anda como com um ministro de competência 50, e
  o órgão como com um chefe de honestidade 70.
- Cada instituição fica numa caixa só: o motor confere ao iniciar e recusa
  instituição em duas caixas, instituição sem ministro numa caixa, falta de
  gabinete ou a mesma pessoa em dois cargos.
- Toda caixa tem ministro (R6.15). O superministério divide a competência: o
  ministro que cuida de mais de 3 instituições rende `√(3 ÷ instituições)` do
  que a ficha diz (a sobra do gabinete conta as soltas e mais 3).

## Ficha (R6.7)

Cinco notas de 0 a 100: **competência**, **habilidade**, **carisma**,
**honestidade**, **lealdade**; mais bússola e **origem** (partido ou
`tecnico`). Hoje agem só a competência e a honestidade. Habilidade (aprovar
leis da área), carisma (mídia e eleitor) e lealdade (vazar, sabotar) esperam o
Congresso, a mídia e os fatos do ministro (R6.9).

## A ficha muda a lei (R6.8)

Quando uma lei passa, o efeito dela entra na fila com o **ajuste do ministro
da caixa da lei** (`ajusteDaLei`), usando a competência efetiva:

- acima de 70: chega 1 turno antes; abaixo de 30: 1 turno depois;
- força = 0,6 + 0,008 × competência (1 com 50; 1,4 com 100; 0,6 com 0).

A lei não sabe disso: o ajuste entra em `enfileirar`. O efeito sobre o
rendimento dos órgãos espera R7.11 (lei age pelo órgão).

## Órgãos (R6.16) e corrupção (R6.17)

Um órgão por instituição, sob a caixa que a leva.

- **Verba**: soma das leis de gasto da instituição, em % do PIB.
- **Necessidade**: a verba do começo, mais 5% a cada lei ativa a mais na instituição
  (nunca abaixo de 20%).
- **Rendimento** = verba ÷ necessidade (1 sem verba em lei).
- **Corrupção** (0–100). A cada turno desfaz 8% e soma: `12 × (rendimento − 1)`
  quando sobra verba, `1,2 × cargos` (lei de cargos de livre nomeação, 0 a 1 da
  faixa) e `1,6 × (100 − honestidade) ÷ 100` do ministro.
- **Começa no equilíbrio** do governo de hoje, então nada anda sozinho; só
  mudam nomear, cargos e verba.
- Cruzar **60** vira o fato `escandalo` (grande), com a instituição e o ministro; o
  Congresso já lê esse fato.

Os pesos são de partida; calibrar com o jogo inteiro.

## Mudar o governo

- **Nomear** (`{ tipo: "nomear", caixa, ministro }`): troca o ministro por
  alguém sem cargo. Vira os fatos `ministro-nomeado` e, se o demitido era de um
  partido, `ministro-demitido`; no turno seguinte esse partido perde 8 de
  termômetro no Congresso (ressentimento).
- **Polêmica da troca (13/nov):** a troca pedida pelo jogador sempre vira
  `ministro-demitido`, também a de técnico (sem partido em `quem`). A 1ª troca
  dos últimos 24 turnos é notícia pequena, a 2ª média, da 3ª em diante grande.
  Cada troca fica em `trocas` (turno, bússola de quem saiu, ordem) e
  `magoasDoGoverno` dá a mágoa: 6 pontos mais 3 por troca anterior do mandato,
  do turno seguinte em diante, sumindo em 3 turnos. Os grupos parecidos com
  quem saiu pagam (motor/grupos, `magoas`).
- **Moeda Ministério** (Congresso, `oferecer` com `moeda: "ministerio"`,
  `partido` e `caixa`): o fato `ministerio-oferecido` faz o governo nomear o
  candidato mais competente do partido. O partido vota mais com o governo
  enquanto tiver ministro (+0,3 na nota) e o preço dele sobe.

## Fora deste passo

Custo de estrutura por caixa e foco (R6.15), agradar grupos pela bússola do
ministro (R6.15), fatos do ministro e custo de troca (R6.9), a lei
Organização dos ministérios e o menu de montar o governo (passo 9), pessoas
que envelhecem e o gerador de personagens, justiça e rastros (R6.20+), o
rendimento dos órgãos agindo sobre as leis (R7.11). As pessoas do Brasil são
geradas por `npm run governo` com nomes inventados.
