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
  **Índices:** o campo `area` deles é o nome do tema ("Saúde"), não uma das 8 áreas; a área vem das leis ligadas
  (`areaDoIndice` em `organico.ts`). 75 leis e 12 índices não têm ligação nenhuma (dado do motor): listar para o autor.
  **Hierarquia (13/nov, NÃO commitada):** trindade (3 rostos + sigla do partido no meio) → 32 ministros (rosto) →
  30 instituições (escudo com o ícone da esfera) → leis; índices presos ao ministro responsável (maioria das leis
  ligadas a ele; senão o do tema). Dados em `src/partida/hierarquia.ts` (`visao.hierarquia`); layout em `organico.ts`;
  `TrindadeDoMapa.tsx`; fios de hierarquia em ouro no canvas. Bolha sem nenhuma ligação no motor fica com anel
  tracejado ("sem efeito"). **Anel afrouxado e Três Poderes (NÃO commitados; refeitos 3 vezes em 13/nov):** ministros num anel de raio 840 (fatia
  proporcional ao que cuidam), ligados entre si, leis em pétalas para fora. **Miolo em camadas concêntricas** (ideia do autor):
  trindade do partido no centro (Executivo, com halo), os 9 juízes de mentira do Judiciário PARADOS em volta dela (anel de
  raio 235, ligados ao vizinho, cada um com aura; a animação de giro foi tirada porque os juízes saíam do lugar) e, por fora, o anel de cadeiras do Congresso (faixa 335–395; Senado em 2 filas de bolinhas maiores): Câmara na
  metade de cima, Senado na de baixo, uma bolinha por cadeira na cor do partido (desenhadas no canvas, `assentos.ts`),
  voltadas para dentro; aura de raio 440 mantém leis e índices fora. `poderes.ts`, `PoderesDoMapa.tsx`. Mouse no anel acende a
  pauta (vazia no começo), na órbita as constitucionais e pétreas. **Falta:** o estudo do grafo
  (script que exporta nós e ligações e classifica cada solta), pétrea sem dado, retratos melhores.
  **Prioridade visual (13/nov):** Ministro (58) > Instituição (46) > Índice (30) > Lei (16), nesta ordem de tamanho e de
  desenho (o de cima fica por cima); visão padrão "Padrão" (leis pequenas e apagadas, ministros e instituições com nome
  e brilho); Ligações, Nível, Dinheiro e Popularidade são filtros que pesam dentro da faixa de cada degrau
  (`FAIXA_DO_RAIO`). A câmera se reenquadra sozinha quando o mapa assenta, se o autor não mexeu.
  **Autor pediu (13/nov):** levantar os requisitos do mapa cruzando GDD §17 com R11, R12 e R14 antes de mexer em mais
  código; requisitos.md está defasado (mapa mudou; o jornal mínimo da mídia existe, commit e37a665b).
  **Alerta de índice e pulsos (13/nov, NÃO commitados):** `saudeDosIndices.ts` (saúde 0–100; crítico, preocupante, normal,
  bom por nível + tendência; o motor guarda `estado.anterior`, os valores do turno anterior). Nível = cor do anel (vermelho/
  verde) e brilho; tendência = seta ▼▲ no canto. **ACHADO:** a tendência com corte de 5 pontos por turno NUNCA dispara (mesmo
  mudando o imposto de renda de 27,5% para 45%, nenhum índice mexe mais de 0,65 ponto por turno): decidir outra janela (ex.:
  comparar com 4 turnos atrás) ou outro corte. Pulso dourado = recurso saindo do centro (`fluxos.ts`: força pela verba que
  cada ministério, instituição e lei de gasto recebe; vários neons pequenos por fio, cada um no seu tempo; instituição e
  ministro mostram "Recebe X% do PIB"); alerta vermelho/verde pelo caminho trindade → ministro → índice. Fios de efeito só
  correm com a bolha em foco. **Desempenho do fundo:** `prepararFundo` monta uma vez; por quadro ~1 ms de JS e ~15 traços
  agrupados, descarta o que está fora da tela, reduz em gesto e desenha a meia taxa parado. **Navegação:** pinça e roda dão
  zoom, dois dedos arrastam (`gestos.ts`), setas, + − e 0 no teclado, botões + − Enquadrar, duplo clique. **Espalhar:** ministro
  repele ministro, instituição repele instituição, índice repele índice (folga maior por degrau). O painel do navegador do
  Claude parou de gerar quadros no fim: pintura, pinça de verdade e o espalhamento final não foram vistos em movimento.
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
- Vite às vezes guarda um módulo vazio quando o arquivo muda no meio da escrita ("does not provide an export"): `touch` no arquivo e recarregar.

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

**Remontagem (13/nov), da base para as pontas.** Planilha `docs/jogo/gdd-remontagem.xlsx` (montada junto com o autor; gerada com `uv run --with openpyxl`, openpyxl não está instalado); molde do Brasil à parte em `docs/jogo/molde-brasil.xlsx`. Decidido e no GDD (seção 6, Instituições): lei mora na instituição; jogador distribui instituições entre ministros; instituição é órgão, não tema; lista de 36 (+ Regras dos poderes), todas em todo país; Eleições sem ministro; Organização dos ministérios vira escada de 4 degraus. Maquete aprovada: `docs/jogo/interface/maquetes/gabinete.html` (passo 1 régua do tamanho + "Ajustar caixas"; passo 2 cadeiras com rosto e 3 cartas: técnico, aliado, do partido).
**Etapa A feita (não commitada):** motor com instituições (`mundo/ministerios/instituicoes.json`) e caixas livres ({id, nome, instituicoes, ministro, sobra}); 157 leis mudaram o campo `esfera` para a instituição nova, `subesfera` saiu; moldes viraram caixas sugeridas genéricas; Brasil declara 34 caixas (as de causa sem instituição: Pesca, Mulheres…); `ComecoDoJogador.caixas` já existe; mapa mostra as 37. `scripts/gerar-governo.ts` apagado (lia a planilha antiga). **Etapa B feita (não commitada):** tela inicial com os passos Governo (régua Enxuto 9 / Clássico 19 / Do país / Inchado, "Ajustar caixas" arrastando escudos, nome automático pelo molde parecido) e Ministros (cadeiras com retrato e "rende", três cartas: técnico, aliado, do seu partido; "Ver todos" abre a lista). Governos prontos em `mundo/ministerios/tamanhos.json`; regras em `partida/gabinete.ts`. Efeitos mostrados só os que existem no motor (atenção, sobra, sem pasta, partidos com ministro). **Ordem do autor (13/nov):** terminar os ministros → mapa da raiz às pontas (corrigir mapa e mecânicas) → padronizar as leis → caminho do dinheiro (custo da máquina por ministério, corrupção tirando dinheiro de verdade). Anotado no GDD §18 "Caminho do dinheiro"; não adiantar.

**Leis: enxugar (13/nov, começou).** Passo 1 feito: `npm run inventario` gera `docs/jogo/leis-inventario.md` (512 leis; 78 sem ligação, 31 só grupos, 198 com nome parecido (famílias), 67 com mesmo efeito, 77 que o país não declara). Próximo: rascunho das regras da lei (uma página) para o autor corrigir; depois cortar por esfera, uma por vez. Também nesta rodada (não commitado): pulsação da verba removida; alerta e foco vibram; flash de mudança testado e removido (autor não gostou; repensar depois); lei com tamanho por dinheiro + importância na visão Padrão; espaço pessoal e miolo reservado no mapa; títulos de lei só no mouse; botão ao lado de ministro/instituição/índice abre o painel "Atrapalham / Ajudam" (`afetadas.ts`, `PainelDeAfetadas`); tecla F mede fps.
