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

## Comportamento esperado da fatia 3 (escrito antes)

- Barra do topo do antigo: país, data, três números com dica ao passar o
  mouse:
  - Caixa: resultado nominal do turno em % do PIB, verde se sobra e
    vermelho se falta; dica com receita, gasto, juros pagos e resultado;
  - Dívida: dívida em % do PIB; dica com cofre e taxa de juros;
  - Apoio: apoio se a eleição fosse hoje (vence acima de 50), verde ou
    vermelho; dica com desgaste, grupo mais insatisfeito e quantos meses
    faltam para a eleição.
- Botão "Passar o turno (N pedidos)" na barra. Ao passar, o motor anda um
  turno com a fila, a fila esvazia e abre o documento "Resultado do turno":
  cada pedido com o nome da lei, o valor pedido, aprovada ou rejeitada, o
  placar e o voto de cada partido; se houve eleição, quem venceu e o apoio.
  Fecha no X e some no turno seguinte. Turno sem votação nem eleição não
  abre nada.
- Partida encerrada: o botão vira "Partida encerrada" e fica desligado; o
  resultado da eleição continua aberto.
- O Painel continua (salvar, carregar, recomeçar, tabelas) até o autor
  decidir tirar.

## Comportamento esperado da fatia 4 (escrito antes)

O autor mandou tirar o Painel (01/nov/2026). O mapa é a única tela do jogo.

- Na barra do topo, no lugar da aba "Painel", três botões: Salvar, Carregar
  e Recomeçar.
  - Salvar guarda a partida no navegador e diz "Partida salva." no aviso.
  - Carregar volta à partida salva (aviso "Partida carregada."); desligado se
    não há partida salva.
  - Recomeçar volta à tela de escolher país e semente.
- Somem a tela de tabelas, a lista de leis dela e o botão "Mapa".

## Comportamento esperado da fatia 5 (escrito antes, 02/nov/2026)

As superpotências do mundo (passo 11, peça 6) aparecem no mapa, de dentro
para fora: leis, índices, grupos e, por último, as potências.

- As 5 potências ficam num anel logo atrás do anel dos grupos, só um pouco
  mais para fora, em ângulos fixos e iguais. Nenhuma encosta num grupo.
- Cada uma é um **losango** (os grupos são hexágonos e os índices, círculos)
  com o nome embaixo. O anel de opinião em volta vai de 0 a 100, na cor da
  opinião (vermelho a verde); o número fica dentro. O tamanho segue o peso
  na reputação (a de maior peso é a maior).
- Passando o mouse: dica com o nome, a descrição, a opinião sobre o país e o
  peso na reputação.
- Barra do topo: dois chips novos, "Reputação" (média pesada das opiniões)
  e "Seg. externa" (segurança externa), com dica; verde acima de 70,
  vermelho abaixo de 40.
- Passar o turno: a opinião das potências anda junto com o motor (uma lei
  que muda a bússola muda os números no turno seguinte).
- Sem potências nas regras do mundo: o anel e os chips não aparecem.

Fica de fora: ligação potência ↔ índice no foco, empresas em volta,
comércio, sanções e ataques.

## Comportamento esperado da fatia 6 (escrito antes, 02/nov/2026)

Leis contínuas (imposto, verba, regra em %) ganham faixa larga e um controle
novo. O jogo é permissivo: quem bloqueia é o Congresso (pedido de mais de 1/3
da faixa cai), não a tela.

- **Faixa de 0 a 100%** em todas as leis contínuas que são % (impostos e
  verbas). Leis em meses/anos (serviço militar, idade) ficam como estão.
- **Sem caixa de número.** Só o controle de arrastar.
- **Controle em jogo:** trilho grosso e arredondado que enche até o pino; o
  pino é grande e leva o valor em cima (ex.: "42%"). O cheio usa a cor da
  zona onde o pino está. Setas do teclado mexem pelo passo da lei.
- **Régua em cima do trilho:** marcas em 0, 25, 50, 75 e 100%, e uma marca
  fina no valor em vigor (para ver o quanto se está mexendo).
- **Zonas de alerta no trilho** (cor + texto curto embaixo do pino):
  - Imposto (lei com cálculo): verde até 80% do pico da receita; amarelo de
    80% do pico até o pico ("perto do pico: a receita quase para de subir");
    vermelho depois do pico ("a receita cai a partir daqui"). O pico vem do
    que o país declara (`pico` da base), não do código da lei.
  - Verba (lei com `conta: gasto`): verde enquanto o gasto total cabe na
    receita; vermelho acima disso ("daqui para cima abre déficit"). A marca é
    o valor da verba em que gasto e receita se igualam hoje. Se o país já está
    em déficit, a marca é o valor em vigor: cortar fica verde, subir fica
    vermelho (cortar verba nunca piora o déficit). Na verba o trilho fica neutro
    (sem faixas de cor); só o pino, o enchimento e o aviso mudam de cor.
  - Sem zona (regra ou lei sem esses dados): trilho neutro, só a régua.
- O alerta só avisa; arrastar até 100% continua possível.

Fica de fora: avisar do efeito nos grupos, curva de Laffer desenhada, zona
para leis de opções (continuam com os degraus de hoje).

## Fica de fora

Jornal, censo, pressão, bússola, gabinete, orçamento e índices essenciais
como bolhas. Ícone próprio só para as leis cujo id bate com o do projeto
antigo; as outras usam o ícone reserva.
