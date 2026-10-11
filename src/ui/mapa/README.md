# Mapa político (tela principal)

A tela principal do jogo: Presidência no centro, onze esferas em anel, uma
por **área do governo** (D-64): Economia, Empresas e comércio, Trabalho,
Previdência e assistência, Saúde, Educação, Infraestrutura, Meio ambiente,
Segurança e defesa, Direitos, Governo e instituições. Cada área agrupa
ministérios reais (os 38 do Brasil 2026, em
`conteudo/paises/brasil/ministerios.json`); as leis ficam dentro das esferas
e os indicadores no anel externo. Lê só a
`VisaoPartida` (`src/app/partida.ts`); não importa nada do motor.

## Arquivos

| Arquivo             | O que faz                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `TelaPrincipal.tsx` | Estado da partida, seleção, prévia e turno. Monta barra, mapa e painel.                       |
| `MapaPolitico.tsx`  | SVG navegável: câmera, animação das esferas, nós, setas e foco.                               |
| `Janelas.tsx`       | Várias janelas abertas: cada uma com o próprio rascunho e a própria prévia; cascata e frente. |
| `Documentos.tsx`    | Documento da lei (redação, relatório de impacto, assinatura) e boletim do indicador.          |
| `layout.ts`         | Posições (funções puras, testadas em `src/tests/mapaPolitico.test.ts`).                       |
| `intensidade.ts`    | Tamanho e anel de cada nó (D-43): bolha pelo valor na escala, lei pelo quanto está ligada.    |
| `relacoes.ts`       | Setas a partir das `ligacoes`; bom/ruim pela `avaliacao` da bolha.                            |
| `camera.ts`         | Zoom mínimo/máximo, limites de arraste e a vista inicial (o anel dos ministérios).            |
| `busca.ts`          | A lupa: acha leis e indicadores por nome, opção, descrição, tema e palavras do dia a dia.     |
| `BuscaDeLeis.tsx`   | Janela da lupa (botão da barra, "/" ou Ctrl+K) com os resultados e "onde fica cada assunto".  |
| `Retrato.tsx`       | Retratos provisórios em SVG.                                                                  |
| `icones.ts`         | Gerado por `scripts/icones/gerar.py` a partir de `scripts/icones/mapa.json`.                  |

## Navegação

- **Mouse:** arrastar move (com inércia ao soltar); a roda aproxima no ponto
  do cursor; encostar o cursor numa borda da tela por um instante faz o mapa
  andar para aquele lado.
- **Touchpad:** dois dedos movem o mapa; a pinça aproxima.
- **Teclado:** setas ou WASD andam, + e − aproximam, Esc fecha.
- **Vista inicial:** o anel dos ministérios enche a tela. O botão de visão
  geral volta a ela; clicado de novo, mostra o mapa inteiro (grupos e
  indicadores de fora).
- **De longe** (zoom abaixo de 0,62) a esfera fechada vira cartaz: o tema em
  letra grande, com tamanho mínimo na tela.

## Regras de leitura do mapa

- **Esfera fechada:** retrato de quem coordena a área, título, número de
  ministérios e de leis ("2 ministérios · 18 leis"). Nenhuma lei aparece na
  visão geral.
- **Esfera aberta:** cresce, as vizinhas encolhem e abrem espaço, a câmera vai
  até ela. As leis ficam numa grade alinhada à tela, para os rótulos nunca se
  cruzarem; as de um mesmo ministério ficam juntas, numa fatia, com o nome
  da pasta na borda da esfera (`layout.pastas`). Ministério sem lei aparece
  na lupa ("onde fica cada assunto"), não no mapa.
- **Lente constitucional:** as leis com `processo: "emenda-constitucional"`
  são do ministério e também da Presidência. Elas ficam na parte da esfera
  que cobre a Presidência (um nó só, nunca duplicado). Com a Presidência
  aberta, as 38 aparecem dentro dela, cada grupo voltado para o seu
  ministério.
- **Foco (passar o cursor ou selecionar):** só as relações diretas aparecem.
  Leis ligadas a um indicador surgem como contas na borda das esferas
  fechadas; o resto do mapa esmaece.
- **Setas:** verde melhora, vermelho piora, cinza neutro (pela `avaliacao` da
  bolha); tracejada tem atraso, com o selo de meses; pontilhada roxa muda a
  eficácia de uma lei.
- **Fundo da visão geral:** cada indicador liga-se ao ministério (ou aos dois)
  cujas leis mais o afetam. É a soma de consequências reais, não enfeite.
- **Tamanho (D-43):** cada bolha incha conforme o valor na própria escala
  (raio entre 19 e 42, entre proporcional ao raio e à área). O anel mostra a
  posição exata na escala e tem cor de verde (bom) a vermelho (ruim) pela
  `avaliacao`. Situação abaixo do surgimento vira um ponto apagado; acima,
  cresce com a gravidade, fica vermelha e pisca quando é séria. Lei incha
  pelo quanto está ligada (opções: posição; dinheiro e impostos: comparados
  com as leis do mesmo tipo no início da partida). Ao passar o turno, tudo
  incha ou desincha com animação e o valor mostra a variação. As posições
  não mudam: o layout reserva o tamanho máximo.
- **Documentos:** cada lei ou indicador clicado abre a sua própria janela
  (um papel oficial), no meio da tela e em cascata; as já abertas não mudam.
  Clicar numa janela aberta (ou de novo no nó) a traz para a frente; até 8
  ficam abertas. Cada janela pode ser arrastada pelo timbre (clique duplo
  centraliza) e guarda o próprio rascunho e a própria prévia. O mapa destaca
  a janela da frente e desliza quando ela esconde o nó. Ao marcar uma nova redação, o
  motor simula o país com e sem a mudança por 1 ano (`preverLei(..., 4)`) e
  o relatório mostra um placar (quantos melhoram/pioram), cartões com a
  variação, a força (1–5 marcas na escala de cada indicador), se o efeito é
  direto ou em cadeia, e o que ainda não reage no horizonte (atraso ou
  limiar). "Assinar" carimba o documento e aplica a mudança. Clicar num
  indicador abre o boletim: valor, régua, o que empurra para cima e para
  baixo.
- **Fim do turno:** cada indicador que mudou pelo menos 0,2% da sua escala
  pisca em verde ou vermelho e ganha uma etiqueta com a variação, de tamanho
  fixo na tela; um botão oculta ou mostra as etiquetas.
- **Contas (SG157, SG159):** a barra de cima mostra as contas como uma
  conta: **Entra − Sai = Falta** (ou Sobra), com os juros dentro do "Sai"
  ("leis R$ 3,7 tri + juros R$ 970 bi") e o destino do resultado ("vira
  dívida", "abate a dívida", "vai para o cofre"). Cada parte abre o boletim
  da bolha. Depois vem a Dívida, em R$ e em % do PIB, lidas da
  `VisaoPartida.contas`. Quando a dívida acaba, "Dívida" vira "Cofre" e os
  juros viram "rendimento do cofre" (D-57). O documento da lei diz quanto ela
  arrecada ou custa por ano e por mês (`saldoAnual`), e o relatório de impacto
  abre com o efeito da mudança no resultado ("Contas públicas"). Cada opção
  da lei mostra quanto custa ou arrecada por ano (`VisaoOpcao.saldoAnual`).
  A seta `produto` (consumo → receita, dívida → juros, desemprego → gasto)
  aparece como as outras.
- **Contexto (D-55):** o boletim do indicador mostra a parte do valor que vem
  do contexto do cenário ("Contexto do Brasil 2026").
- **Marca do jogador (D-58):** o que o jogador fez aparece em ouro: lei
  mudada com aro e caneta (a esfera fechada mostra quantas), bolha mexida por
  ele com onda, flash e etiqueta grande "· você", resumo do turno começando
  por "Suas decisões" e boletim com "Sua marca" (comparado com o país no
  piloto automático). O movimento natural do país fica com etiqueta pequena e
  apagada, sem piscar. É destaque, não peso: a simulação é a mesma.
- **Grupos sociais (SG143):** onze medalhões hexagonais roxos, bem maiores
  que as bolhas (raio 58 → 104: incham com a satisfação), num anel próprio por
  fora dos indicadores (`ELIPSE_GRUPOS`), com o nome sempre à vista (~12 px
  em qualquer zoom) e a satisfação no centro. São eles que decidem se as
  leis passam, por isso não se confundem com lei (círculo pequeno) nem com
  indicador (círculo com anel). A barra mostra a aprovação do governo (média
  dos grupos pelo peso) e quantos grupos estão satisfeitos; clicar abre o
  boletim com cada grupo.
- **Lista dos grupos (`PainelGrupos`):** à esquerda, recolhível (aberta de
  saída em telas com 1200 px ou mais). Do mais ao menos satisfeito: ícone,
  nome, % do eleitorado, satisfação com a variação do turno, barra colorida e
  o que o grupo mais gosta (verde) e mais odeia (vermelho); o grupo escolhido
  mostra os três maiores de cada lado. Clicar num grupo ou num motivo abre o
  documento dele. Aberta, a lista cobre `LARGURA_PAINEL_GRUPOS` px e a câmera
  centra a visão geral no que sobra (`ocupado.esquerda`).
- **Câmera:** escala entre a visão geral (no mínimo 0,2) e 1,35; o mapa não sai
  da vista. O botão de alvo volta à visão geral. Esc fecha a seleção e depois
  a área.

## Implementado × provisório × planejado

- **Implementado:** esferas, lente, foco, documento da lei com prévia de 1 ano
  pelo motor (`preverLei`), boletim do indicador, turno com resumo e bolhas que
  piscam.
- **Provisório:** retratos (sem nome nem mecânica) até o SG150/SG152; ícones
  escolhidos por id na interface (poderiam ir para o JSON da lei); aprovação
  do partido aparece como "—" porque a API ainda não a calcula.
- **Planejado (fora daqui):** leis com mais de um ministério (`ministerios[]`
  já é aceito: o nó mostra pontos das outras cores); grupos sociais como nós
  (SG143); votação no Congresso no modo `real`.

## Ícones

Os desenhos vêm do Material Design Icons (licença em
`public/licenses/material-design-icons.txt`). Para trocar o ícone de uma lei
ou bolha, edite `scripts/icones/mapa.json` e rode
`python3 scripts/icones/gerar.py <pasta com os .svg do MDI>` (por exemplo,
`svg/` do pacote `@mdi/svg`).
