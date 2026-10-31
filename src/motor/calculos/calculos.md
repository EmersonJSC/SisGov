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
