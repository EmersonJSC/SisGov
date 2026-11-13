# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**12/nov/2026**

## Onde está

Construindo pela **ordem de construir** de [docs/jogo/requisitos.md](docs/jogo/requisitos.md).
Feitos: 1 a 9 (9 = Começo da partida, commit 6a1ccf4d). Agora o **passo 10: padronizar o visual**,
barra do topo commitada (0963da58); **ícones das leis NÃO commitados**:

- `src/tela/estilo/mesa.css`: cores, fontes e a placa de ferro (`.placa-ferro`) da Art Bible,
  comuns à tela inicial e à barra. Tokens em `:root`.
- `src/tela/mapa/BarraDoTopo.tsx` + `.css` (refeita do zero, 2ª versão, inspirada em Victoria 3 e
  Frostpunk: ícone + número + barra, detalhe em bilhete ao passar o mouse): brasão e país à
  esquerda; medidores no centro (caixa, dívida, PIB, apoio, eleição); data e placa de passar o turno
  à direita. Classes `topo-*`. Aprovada pelo autor ("vamos manter assim").
- Cheats de teste (`src/tela/cheats.ts`, `useCheats.ts`), valem na tela inicial: `senado` liga e
  desliga o Senado (`opcoes.semSenado`); `pular` começa direto (Partido de Teste, chapa sugerida).
- **Os menus saíram a pedido do autor** (Governo, Programas, Eleição, Mesa, Mercado, Bolsa, Salvar,
  Carregar, Recomeçar): as janelas existem no `TelaMapa`, mas nada as abre; Salvar e Recomeçar
  também ficaram sem botão. O autor vai dizer onde cada coisa mora.
- A rede social (do presidente, das mídias) não tem lugar na tela; o autor vai pensar com outro modelo.
- Retrato das pessoas: DiceBear Notionists, provisório (o autor não gostou: "todos parecem a mesma
  pessoa"). Trocar só `src/tela/inicio/aparencia.ts` e `Foto.tsx`.

- **Ícones (NÃO commitados):** o autor escolheu o **game-icons.net** (CC BY 3.0, crédito no jogo) para
  as **512 leis** (selo + bolinha da esfera no pé) e os **147 índices** (sem bolinha); as 30 esferas
  seguem desenhadas à mão. Pacote `@iconify-json/game-icons` (dev). Receita: skill `sisgov-icones`;
  `npm run icones` gera SVGs, manifests e `docs/arte/folha-de-icones.html`; `npm run icones:buscar -- <palavra>`
  acha o nome do ícone. Conferidos só na folha, **não vistos dentro do jogo**; alguns nomes são
  chute (ex.: `contract` vira setas, não papel) e o autor vai apontar os que não leem.

- **Mapa só com leis promulgadas (NÃO commitado):** as que o país não tem saem do mapa e ficam no botão
  "Leis não promulgadas" (canto do mapa, `src/tela/mapa/NaoPromulgadas.tsx`); escolher uma abre a folha
  para promulgar. **Brasil montado** em `leis-vigentes.json`: só as leis que o Brasil tem (436; 76 não
  promulgadas) e `nomes` com o nome local de 34 leis (Selic, Bolsa Família, Lei Maria da Penha...),
  lido em `src/partida/visao.ts`. Critério: lei no "nada" da régua ou da escada saiu.

- **Mapa orgânico, vivo (NÃO commitado; autor aprovou a ideia em 13/nov).** Estilo Democracy 4: bolhas soltas,
  índices como centros grandes, leis penduradas, fios verde (+) e vermelho (−) com um raio que corre por eles.
  Peças em `src/tela/mapa/`: `organico.ts` (simulação `d3-force`, bolha = objeto com raio/peso), `useMapaVivo.ts`
  (anda a simulação quadro a quadro e escreve direto no SVG), `MapaOrganico.tsx` (câmera, mouse, arrastar bolha,
  hover com anel de alcance, bilhete, pulso quando o valor muda no turno), `BolhaDoMapa.tsx`, `ControlesDoMapa.tsx`
  (visões, busca, enquadrar, miniatura), `visoes.ts` (o que dá peso), `vistaDoMapa.ts` (câmera pura), `fundoDoMapa.ts`
  (canvas de fundo: manchas, fios e raios), `organico.css`. **Desempenho (13/nov):** fios em SVG custavam ~5 mil escritas
  por quadro (6 fps); passaram para o canvas, a câmera escreve o `viewBox` direto e a bolha só reescreve a posição se
  mudou. JS por quadro: ~1 ms parado, ~6 ms simulando/zoom (o painel do navegador é minúsculo e limita os quadros:
  pintura não foi medida; o autor confere na tela dele). Zoom/arrasto: ícones somem em movimento (classe
  `movendo`, volta 150 ms depois) e a roda é somada por quadro. Se ainda lagar: bolhas no canvas com ícones
  pré-desenhados (demo em `public/demos/bolhas-canvas.html`, fora dos commits; abrir em localhost:5199/demos/bolhas-canvas.html).
  **Visões:** Ligações (padrão), Nível (funciona), Dinheiro (75 leis com `fluxo`: imposto verde, verba vermelha),
  Popularidade (**sem dado: o motor não calcula popularidade por lei; `saldoAnual` vale 0 em todas**; o botão avisa).
  Falta: popularidade por lei, instituições do jogador (junto dos índices, outro destaque; não existem na
  `VisaoPartida`), mídia, missão (administrar um setor público; GDD §18), crédito do game-icons na tela,
  `MapaPolitico.tsx`/`layout.ts` sem uso (apagar é pedido à parte).
- **Lista do Brasil:** `docs/jogo/leis-do-brasil.md` para o autor conferir (435 promulgadas, 77 não).

## Próximo

Autor olhar a folha de ícones e apontar os que não leem bem (trocar só o nome no arquivo da esfera). Depois: o mapa (bolhas como selos de papel, ícones de área). Onde fica cada coisa
que saiu da barra: o autor vai dizer.

## Pendências do autor

- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md) (47 itens; I é o passo 9).
- Decidir o que "programa anda no passo do ministro mais fraco" significa (item 32): hoje é
  esperar 0 ou 1 turno.
- Dívidas: lembrança pesar no voto; perguntar o nome ao refazer programa; Aprovação começar
  alta no começo (R4.9); pessoas envelhecerem e morrerem (R6.6).

## Armadilhas

- `manifest-leis.json` tem 220 ids de leis antigas que não existem mais (e 14 SVGs soltos em `src/assets/svg/leis/`); limpar é um pedido à parte.

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits do passo (a Art Bible
  `docs/arte/direcao-de-arte.md` segue a tela inicial; commitar à parte se o autor quiser).
- Classes CSS da tela inicial levam prefixo `ini-` e as da barra `topo-`: o `mapa.css` já tem `.carimbo`, `.selo`, `.nota`
  e outras, e as regras dele vazam.
- Não usar `<main>` fora do mapa: `tela.css` põe largura e margem em `main:not(.area-mapa)`.
- Pacote novo no `package.json` deixa o `npm run dev` aberto com "Outdated Optimize Dep" (página em branco): reiniciar o servidor.
- O servidor do Vite pode servir arquivo novo vazio ou módulo velho: `touch` nos arquivos e recarregar.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
