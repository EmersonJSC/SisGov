# Cálculos

Registro de bases. A lei diz `"calculo": { "base": "renda" }`; o motor faz a
conta. Base nova = entrada nova em `BASES`.

## renda — Laffer + evasão

`arrecadação = t × R × (1 − t)^e × (1 − evasão)`

- `t`: alíquota (fração); `R`: renda tributável com alíquota zero.
- `(1 − t)^e`: a base declarada encolhe quando a alíquota sobe. `e` é a
  elasticidade da renda tributável; com ela, a alíquota que maximiza a
  arrecadação é `1 / (1 + e)` (Saez, Slemrod & Giertz, 2012, _JEL_ 50(1)).
- **O país declara o pico** (`pico`); o motor deriva `e = (1 − pico)/pico`.
  Sem declaração, usa o padrão (pico 0,6; evasão 0,1).
- `evasão`: fração da base que escapa do fisco, declarada pelo país.

Simplificado: alíquota única (faixas ficam para "Expande depois"); evasão
fixa, não reage à alíquota nem à fiscalização ainda.

## consumo, lucro e emissões — mesma curva

Mesma conta da renda; muda só o que o país declara. O lucro tem pico mais
baixo que a renda (a empresa muda de lugar ou esconde o lucro com mais
facilidade). Emissões é o valor do que se polui; base pequena e pico baixo
(a indústria troca de processo ou esconde a emissão). Na V1 cada base é uma fatia fixa do PIB (`parcela_pib`); com o
mercado, o motor passa a somar a base dos prédios e dos pops (GDD, Parte 3).

## bases da onda 1 (14/nov) — mesma curva

`patrimonio` (herança, bens de luxo, saída do país), `aplicacoes`, `imovel`,
`capital` (dividendos), `movimentacao`, `folha` (contribuição da previdência) e
`bancos` (lucro dos bancos). A base diz quem paga do bolso (`incide`): a renda e
a movimentação, todos; patrimônio, aplicações, imóvel e capital, o rico; a
folha, o pobre e o médio. Consumo, lucro, emissões, terra e bancos não tiram
renda dos pops direto. A lei com `calculo.estrato` cobra só da parte da base
daquele estrato, pela parte da renda que ele tem (`parteDaRenda`). O Brasil
calibra cada base pela receita real de ordem de grandeza; a
`receita_fora_das_leis` caiu o que as leis novas passaram a arrecadar
(`scripts/receita-inicial.ts`).

## juros — prêmio pela dívida

`alvo = neutro + inflação + 0,05 × max(0, dívida − tolerância)`

- `neutro`: juro real neutro do país (% ao ano), declarado pelo país.
- `tolerância`: dívida (% do PIB) que o mercado aceita sem cobrar prêmio,
  declarada pelo país. Países com histórico de calote toleram menos dívida
  ("intolerância à dívida", Reinhart, Rogoff & Savastano, 2003, _BPEA_ 2003(1)).
- Prêmio de 5 pontos-base por ponto de dívida acima da tolerância: ordem de
  grandeza das estimativas de 3 a 5 pb (Laubach, 2009, _JEEA_ 7(4)), no
  topo da faixa porque o jogo começa por países emergentes.
- A taxa não pula: anda 20% do caminho até o alvo por turno (suavização da
  política monetária, Clarida, Galí & Gertler, 2000, _QJE_ 115(1)).

Simplificado: uma taxa só para o Banco Central e para a dívida inteira; sem
prazo da dívida; prêmio linear (sem crise de confiança).
