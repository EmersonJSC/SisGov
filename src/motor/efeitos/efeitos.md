# Efeitos

Cada lei em vigor **contribui** pontos (escala 0–100) para índices de
jogabilidade. O índice é a base do país mais a soma das contribuições.

- Tamanho do efeito inteiro: `fraca` 1, `media` 3, `forte` 6 pontos
  (31/out/2026). É o tamanho total, não por turno: por turno, um efeito
  médio somaria 72 pontos num mandato e prenderia os índices em 0 ou 100.
- Lei contínua: o efeito cresce com a posição do valor na faixa (no mínimo,
  nada; no máximo, inteiro). Lei de opções: os efeitos da opção, inteiros.
- Ao mudar a lei, a contribuição anda em linha reta do valor de hoje ao novo
  em `atraso_turnos` turnos (0 = no turno seguinte). Depois fica parada
  enquanto a lei não mudar.
- No começo da partida, as leis vigentes já estão inteiras: o país declara
  os índices como estão hoje, com as leis que tem.
