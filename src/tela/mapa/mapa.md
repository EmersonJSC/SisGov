# Mapa político (herdado da tela antiga)

Decidido com o autor em 01/nov/2026: a tela do jogo é o mapa da tela antiga,
reaproveitado. Os componentes vieram do projeto antigo (commit `f62c3fef`,
`src/ui/mapa/`) quase sem mudança; eles só leem a `VisaoPartida`, que agora é
montada por `src/partida/visao.ts` a partir do motor novo.

## Comportamento esperado da fatia 1 (escrito antes)

- Presidência no centro; uma esfera por área de `mundo/areas/areas.json`
  (Economia, Proteção social, Segurança e instituições, Meio ambiente), com
  retrato provisório em SVG (sem pessoa real).
- Abrir a esfera mostra as leis dela, com nome e ícone. A lei de mandato é
  constitucional e aparece também na Presidência.
- Bolhas: os índices de jogabilidade e, no anel de fora, os grupos (bolha do
  tipo "grupo", tamanho pela satisfação).
- Passar o mouse numa lei acende as setas para os índices e grupos que ela
  mexe: verde melhora, vermelho piora (pela `avaliacao` do índice), com o
  atraso em meses.
- Só olhar: mudar lei, passar turno e a barra do topo ficam para as fatias 2
  e 3. O botão "Painel" leva à tela de tabelas, que ainda faz o jogo.

## Fica de fora

Jornal, censo, pressão, bússola, gabinete, orçamento e índices essenciais
como bolhas. Ícone próprio só para as leis cujo id bate com o do projeto
antigo; as outras usam o ícone reserva.
