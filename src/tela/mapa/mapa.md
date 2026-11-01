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

## Comportamento esperado da fatia 2 (escrito antes)

- Clicar numa lei no mapa abre a janela da lei do projeto antigo: papel com
  timbre (órgão da área, selo com o ícone), que se arrasta pelo timbre e
  fecha no X. Uma janela por vez; clicar em outra lei troca a janela.
- Página da esquerda: tipo da lei, nome, descrição e o controle:
  - lei contínua: deslizador em %, na faixa e no passo da lei, com o número
    exato ao lado;
  - lei de opções: duas opções viram dois botões; três ou mais, deslizador
    com degraus. A opção vigente diz "em vigor".
- Página da direita, "Efeitos":
  - sem mudança: as setas diretas da lei (índices e grupos), com a cor de
    melhora/piora e o atraso;
  - com mudança: o que a própria lei muda, conta do motor e não estimativa
    da tela: pontos em cada índice (contribuição nova − de hoje, com o
    atraso) e pontos de satisfação em cada grupo. Efeito em cadeia (índice →
    grupo) não aparece; isso é a prévia, que fica para depois.
- "Enviar ao Congresso" põe o pedido na fila do turno (a mesma do Painel),
  com o carimbo "Enviado". Lei na fila mostra "Na fila do Congresso: vai a
  voto ao passar o turno" e "Tirar da fila". Voltar ao valor vigente não é
  pedido.
- Presidência: "Constituição" e "1 lei constitucional" (plural certo).
- Passar o turno continua no Painel até a fatia 3.

## Fica de fora

Jornal, censo, pressão, bússola, gabinete, orçamento e índices essenciais
como bolhas. Ícone próprio só para as leis cujo id bate com o do projeto
antigo; as outras usam o ícone reserva.
