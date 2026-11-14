# Onde parei

**13/nov/2026**

## Onde está

Passo **10a, Mapa da raiz às pontas** (ordem de construir em
[docs/jogo/requisitos.md](docs/jogo/requisitos.md)). Ordem do autor: 10a mapa → 10b leis → 10c dinheiro.

- Item 1, miolo: Eleições e Regras dos poderes ficam com os poderes, sem ministro; no mapa, Regras
  acima do Congresso e Eleições abaixo, do lado do Judiciário (fffa115a). Judiciário segue de mentira.
- Item 2, trocar ministro pelo mapa: painel do ministério clicado; polêmica que cresce no mandato e
  mágoa de 3 turnos nos grupos parecidos com quem saiu (26e14e42).
- Item 3, áreas: mapa por ministério (da3f8e65); refatoração tirou `MapaPolitico.tsx`, `layout.ts` e
  `mundo/areas` (cc4e6108).
- Item 4, seta de tendência: compara com 8 meses atrás (4 turnos), corte de 2 pontos; o motor guarda
  `estado.anteriores` (45e74905).
- Item 5, janelas: menu no brasão (salvar, carregar, recomeçar; salva sozinho a cada turno), Governo
  na trindade, Eleição e Mercado nos medidores, Mesa e Programas em botões. **NÃO commitado.**

## Próximo

**10a terminado.** O autor disse em 13/nov que o item 5 "não era o que era para estar fazendo":
perguntar o que ele queria antes de seguir. Antes do 10b: desenhar com o autor a **opinião
central** (GDD §18).

## Pendências do autor

- Opinião central: estruturar direito, mecânica própria (não copiar outro jogo).
- Tribunais no Judiciário (STF, STJ, TSE como rótulos do país; GDD §18), quando o Judiciário for de verdade.
- A mídia não pesa em nada (GDD §18): corrigir quando fizermos mídia e polêmica.
- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; nunca `git push`. `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits.
- `npm run format:check` falha em 16 arquivos antigos (scripts de ícones, JSONs do Brasil): não são da
  rodada; formatar é pedido à parte.
- O índice ainda tem `area` = tema (nome de instituição antiga); o mapa usa só para achar o ministro.
- Vite às vezes serve módulo vazio ("does not provide an export"): `touch` no arquivo e recarregar.
- Pacote novo deixa o `npm run dev` em branco ("Outdated Optimize Dep"): reiniciar o servidor.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
- Classes CSS da tela inicial levam `ini-`, as da barra `topo-`; não usar `<main>` fora do mapa.
- `manifest-leis.json` tem 220 ids de leis que não existem mais; limpar é pedido à parte.

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

Ministros terminados (commit 46c0b3ce). **13/nov, não commitado:** `arquitetura.md` refeita do código;
GDD atualizado com a remontagem e com as decisões do autor (Judiciário × Justiça e prisões; Eleições
com o Judiciário por padrão; ministro troca a qualquer momento com polêmica; instituição sem chefe;
áreas saem; Estados e municípios fala com os governadores). Planilha renomeada: `gdd-remontagem.xlsx`
→ `docs/jogo/gdd.xlsx` (o que se constrói); `leis.xlsx` é o acervo. Pendências no GDD §18 "Pendências
da remontagem". `requisitos.md` atualizado (13/nov: 72 feitos, 41 parciais, 105 faltam; passos 10a mapa, 10b leis,
10c dinheiro na ordem de construir). Depois: o mapa da raiz às pontas
(tirar as áreas do código); depois padronizar as leis; depois o caminho do dinheiro.

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

**Remontagem (13/nov), da base para as pontas.** Planilha `docs/jogo/gdd.xlsx` (montada junto com o autor; gerada com `uv run --with openpyxl`, openpyxl não está instalado); molde do Brasil à parte em `docs/jogo/molde-brasil.xlsx`. Decidido e no GDD (seção 6, Instituições): lei mora na instituição; jogador distribui instituições entre ministros; instituição é órgão, não tema; lista de 36 (+ Regras dos poderes), todas em todo país; Eleições sem ministro; Organização dos ministérios vira escada de 4 degraus. Maquete aprovada: `docs/jogo/interface/maquetes/gabinete.html` (passo 1 régua do tamanho + "Ajustar caixas"; passo 2 cadeiras com rosto e 3 cartas: técnico, aliado, do partido).
**Etapa A feita (não commitada):** motor com instituições (`mundo/ministerios/instituicoes.json`) e caixas livres ({id, nome, instituicoes, ministro, sobra}); 157 leis mudaram o campo `esfera` para a instituição nova, `subesfera` saiu; moldes viraram caixas sugeridas genéricas; Brasil declara 34 caixas (as de causa sem instituição: Pesca, Mulheres…); `ComecoDoJogador.caixas` já existe; mapa mostra as 37. `scripts/gerar-governo.ts` apagado (lia a planilha antiga). **Etapa B feita (não commitada):** tela inicial com os passos Governo (régua Enxuto 9 / Clássico 19 / Do país / Inchado, "Ajustar caixas" arrastando escudos, nome automático pelo molde parecido) e Ministros (cadeiras com retrato e "rende", três cartas: técnico, aliado, do seu partido; "Ver todos" abre a lista). Governos prontos em `mundo/ministerios/tamanhos.json`; regras em `partida/gabinete.ts`. Efeitos mostrados só os que existem no motor (atenção, sobra, sem pasta, partidos com ministro). **Ordem do autor (13/nov):** terminar os ministros → mapa da raiz às pontas (corrigir mapa e mecânicas) → padronizar as leis → caminho do dinheiro (custo da máquina por ministério, corrupção tirando dinheiro de verdade). Anotado no GDD §18 "Caminho do dinheiro"; não adiantar.

**Leis: enxugar (13/nov, começou).** Passo 1 feito: `npm run inventario` gera `docs/jogo/leis-inventario.md` (512 leis; 78 sem ligação, 31 só grupos, 198 com nome parecido (famílias), 67 com mesmo efeito, 77 que o país não declara). Próximo: rascunho das regras da lei (uma página) para o autor corrigir; depois cortar por esfera, uma por vez. Também nesta rodada (não commitado): pulsação da verba removida; alerta e foco vibram; flash de mudança testado e removido (autor não gostou; repensar depois); lei com tamanho por dinheiro + importância na visão Padrão; espaço pessoal e miolo reservado no mapa; títulos de lei só no mouse; botão ao lado de ministro/instituição/índice abre o painel "Atrapalham / Ajudam" (`afetadas.ts`, `PainelDeAfetadas`); tecla F mede fps.

---

**12/nov/2026**

## Onde está

Construindo pela **ordem de construir** de [docs/jogo/requisitos.md](docs/jogo/requisitos.md)
(seção "Ordem de construir"). Feitos: 1 Brasil 2026, 2 Fatos do turno, 3 Congresso novo,
4 Mesa mínima, 5 Governo, 6 Programas, 7 Jornal mínimo, **8 Eleição nova** (`src/motor/eleicao`: chapas, dois turnos, promessa; janela Eleição na barra do topo; `eleicao.md`). Antes: 7 Jornal mínimo (`src/motor/midia`, `midia.md`; 9 mídias do
Brasil em `midias.json`; jornal com as 3 maiores notícias no Resultado do turno; manchetes em
`mundo/jornal/manchetes.json`). Antes: 6 Programas (motor `src/motor/programas`, doc `programas.md`,
`npm run programas`, janela Programas na barra do topo; 73 programas do mundo, nomes do
Brasil em `paises/brasil-2026/programas.json`). Limpeza do código feita (turno em etapas).
A tela inteira (MapaPolitico, janelas, CSS) será reformulada: não mexer antes.

## Próximo

**Passo 9: Começo da partida** (ver "Ordem de construir" em requisitos.md). Propor curto ao autor
antes de começar.

## Pendências do autor

- Conferir as direções da planilha lidas como "sobe" e as dívidas de
  [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md) (43 itens; F passo 6, G passo 7, H passo 8).
- Decidir o que "programa anda no passo do ministro mais fraco" significa (item 32): hoje é
  esperar 0 ou 1 turno.
- Dívidas do passo 6: lembrança pesar no voto, perguntar o nome ao refazer programa,
  programas já formados no começo da partida.

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/direcao-de-arte.md` e `docs/jogo/interface/*` ficam fora dos commits.
- O servidor do Vite pode servir arquivo novo vazio ou módulo velho: `touch` nos arquivos e recarregar.
- Para ver um programa formado na tela: Salvar, editar `localStorage["sisgov-partida"]` (valores em
  `estado.leis`), Carregar e passar o turno.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.

---

**12/nov/2026**

## Onde está

Fase de **desenho das leis na planilha** ([docs/jogo/leis.xlsx](docs/jogo/leis.xlsx)); código parado.
Contagens vêm só da planilha (script), não deste texto (hoje: 527 leis, 10 delas substituídas, 147 índices, 517 roteiros).
**As 30 esferas estão desenhadas** (09/nov). Rodada de **arrumação** feita em 08/nov: Bússola em números
(coluna "Bússola: origem"), glossário no GDD §16, tipos de lei (Lei, Lei com prazo, Ato,
Posição por país, Operação), "construção" virou "prédio", "programa" reservado.

## Próximo

Feito (08/nov): as 25 leis que cruzavam o meio da Bússola foram arrumadas (20 viraram lado único,
4 têm a exceção escrita, 3 de Energia serão refeitas na esfera Energia). Colunas Força e
Atraso nos efeitos: colunas criadas; Atraso preenchido, Força fica "média" por padrão e só se calibra no fim, com todas as leis (autor, 08/nov). Efeito e cobrador dos índices também ficam para a calibração. Comércio exterior e capital desenhada em 08/nov (nova forma "Régua por setor"). Energia fechada (mapa elétrico, urânio, comércio de energia) e esfera nova Mineração e petróleo criada. Meio ambiente fechada em 09/nov (órgão com independência em escada, licença sem exame com custo na hora). Ciência e pesquisa fechada em 09/nov (nível próprio e emprestado por produto, verba dividida em 100%, Lua como corrida, sem Marte). Agricultura e pesca fechada em 09/nov (produtor contra cidade, papel comida cara, peixe por mar compartilhado). Toda esfera nova passa pela sala de 4 especialistas em game design (sistemas, interface, experiência, escopo), que propõem e votam antes de chegar ao autor. Terra fechada em 09/nov (fila visível, Preço e Segurança da terra por estado). Infraestrutura e transporte fechada em 09/nov (duas filas num setor só; o jogador só vê e mexe pelas leis; construtora nacional como companhia; táxi, aplicativo e elétricos). Cultura e esporte fechada em 09/nov (fila de pedidos no órgão de Patrimônio; bem protegido custa para sempre; estátua e símbolo de fé são pedidos, não leis). Defesa civil fechada em 09/nov (índice Preparo contra desastres; desastre chega sozinho; partido não escolhe a região). Minério fechado em 09/nov (7 leis, garimpeiro no centro, sem índice próprio). Estudo final, parte 1 (encaixe por script) aplicada em 09/nov: repetidas juntadas, leis fora do federal tiradas, índices Integração e Bens em risco criados, 7 leis de duas opções viraram escada ou régua. Parte 2 (programas reais de 4 governos, 8 ministros leves e presidente forte) rodada em 09/nov: de 94 programas, 72 cabem, 14 em parte, 1 não cabe, 7 são evento. O autor ainda decide as 12 leis propostas: Cobertura mínima do plano, Ajuda para comprar plano, Obrigação de ter plano, Quem não paga Imposto de renda, Complemento ao estado pobre, Repasse só com meta, Violência doméstica, Proteção ao cliente de banco, Aposentadoria dos servidores, Tarifa por país, Independência das agências, Estradas com pedágio. Coluna "Programa real (de quem)" criada em 11/nov: 118 leis ligadas a 84 programas de Lula, FHC, Trump e Obama (uso futuro: desbloqueio "você imitou o programa tal" e campanhas por presidente, GDD §18). Duas partidas no papel feitas em 11/nov (esquerda e direita, haiku; relatórios no scratchpad, somem). Achado: o efeito das leis só está no roteiro (passo 6); 78 de 144 índices sem lei listada, 426 ligações de mão única, nomes que não batem em Liga com; verbas viram "só suba", cortar verba não dá lado à direita. Consertado por script em 11/nov: índices preenchidos pelo passo 6 do roteiro e pela Liga com (sem lei: só 4, que vêm de contas e agora dizem de quais índices saem em "Recebe de"), ligações nos dois sentidos, 16 nomes trocados pelo nome certo. Aprovadas para escrever (mostrar antes): as 12 leis do teste, com o Obamacare, e saúde mental, imposto sobre bancos, quantas famílias recebem a Transferência. Índices novos Violência contra a mulher e Saúde mental criados (11/nov), esperando as leis. 15 leis novas escritas com roteiro em 11/nov (3 de plano de saúde, Saúde mental, Faixa sem Imposto de renda, Imposto sobre bancos, Quem recebe a Transferência, Complemento ao estado pobre, Repasse só com meta, Violência doméstica, Proteção ao cliente de banco, Aposentadoria dos servidores, Independência das agências, Estradas com pedágio, Tarifa por país) e degraus novos em Zonas francas e Preferência a empresas nacionais. Rodada da direita em 11/nov (2 agentes Opus, um propõe e outro ataca): 20 leis de direita escritas com roteiro (Reposição de servidores, Estabilidade do servidor, Cargos de livre nomeação, Venda de imóveis parados, Profissões com registro, Transporte interno por empresa de fora, Licença para banco novo, Aprovação de remédio feito fora, Moeda de fora nos contratos, Salário de entrada do jovem, Conta de demissão, Parte da pena cumprida presa, Pena maior para quem repete o crime, Fazer parte de facção é crime, Legítima defesa, Ensino em casa, Crédito da casa perdoado por filho, Quem perde a ação trabalhista paga, Comércio aberto no domingo, Reserva compensada em outra terra) e degraus em Direito de greve, Restrição a protestos e Abertura de empresa. Econômico agora: 173 esquerda, 115 direita. Partidas de novo em 11/nov, com roteiro: jogou melhor, travou na economia. Consertado: toda verba entra no Gasto; Receita e Gasto entram no Resultado primário; Ocupados, Produtividade, Crédito, Investimento estrangeiro, Juros, Saldo comercial e Gasto entram no PIB real; as 60 contas genéricas apontam para o Resultado primário. leis pedidas nas partidas escritas em 11/nov: Imposto sobre imóvel caro, Imposto sobre movimentação financeira, Escola em tempo integral, Pena para corrupção; Teto de juros virou Régua por setor (cartão, cheque especial, pessoal, consignado). Prazo de validade de programa recusado (tira autonomia). Grandes fortunas virou o programa "Imposto dos ricos" (imóvel caro, aplicações grandes, bens de luxo, herança, dividendos, saída); a antiga ficou Substituída. Degraus escritos de uma vez em 11/nov (4 agentes sonnet): 108 leis (83 viraram escada de 3 a 5 degraus, 25 viraram régua), marcadas "Degraus escritos em 11/nov" na coluna Revisão. As 3 de Energia "sem mecânica" já eram Substituída. As 41 telas do roteiro com "muda" ganharam direção (sobe/cai). Fable fica para depois de tudo pronto (autor). Congresso em desenho com o autor, peça por peça (feito em 11/nov: coração do voto, tempo da lei até 2 turnos, 4 regimes com a China como partido único por alas, quórum e programa Reforma política com 3 leis novas; moedas, paciência do Congresso e termômetro de cada partido (base e oposição); o Congresso agindo sozinho (8 ações); bancadas e lobby das companhias; Congresso sobrecarregado (sem pontos de ação); tela (7 peças), ligações com o resto e ano de eleição; CONGRESSO FECHADO; Mesa: sem limite de papéis por turno, freio é prazo e volume; prazos de cada papel; papéis duvidosos disfarçados, diferença só na música e no som; veto com observação em toda lei; 7 famílias de papel; MESA FECHADA; Órgãos: um por esfera, sob o ministério, ministro muda pela ficha, números verba, necessidade, rendimento e corrupção, ficha só de leitura no mapa; CONGRESSO, MESA E ÓRGÃOS FECHADOS em 11/nov) (rascunho de um agente Opus em scratchpad/congresso/desenho.md, pode sumir); depois Mesa e papéis, e Órgãos. Atraso e força: calibrar no motor (grafo), não no papel. Depois, revisão final por um agente Fable imparcial (cota própria), lendo o GDD e um resumo da planilha, não as linhas. Depois, jogar as partidas de novo com o roteiro junto. "Cabe" só diz que a lei está na lista, não que o motor faz o efeito.
Sem núcleo reduzido (autor): o jogo tem centenas de caminhos; a "cota" de foco e a promessa de
campanha ficam em GDD §18.

## Revisão do Fable

1ª rodada (11/nov) feita, mas virou revisão de contas, não de game design, e gastou ~20% da cota (autor). Mantido tudo o que ele fez (autor: "não desfaça"): Teto da carga de impostos, Validade das regras, Aviso antes da multa, índice Preço do combustível, Confiança na aposentadoria com leis, colisões Polícia sem formato militar × Força letal e Sigilo bancário × Obrigação dos bancos, citações a Substituídas trocadas, 4 acertos no GDD.
Fable não se usa mais (autor, 11/nov). A opinião de game designer é dada na conversa.
Opinião de game design dada em 12/nov: escritos no GDD a promessa como meta (§13), o preço que sobe na compra de votos (§12), causa e efeito na tela (§17), corrupção em cadeia e caminho autoritário (§18). Cota decidida: 6 índices principais (coluna Principal na aba Índices), promessa mira principal, subíndice ou programa; a cota é a carga do Congresso.
Mundo em 12/nov (§15): só o país jogado roda inteiro; os outros são países leves com IA de 3 passos e cardápio (4 grupos, linhas vermelhas, jeito do país, um degrau por vez com aviso). Pops por estado medidos: possível (§18). Ficha leve e governos que já existiram como pontos na bússola decididos em 12/nov (§15); aba dos 10 países e 71 governos dos estudos feita; regime separado da bússola. Os 20 países do 11º ao 30º feitos em 12/nov, do jeito leve (Banco Mundial + busca; 121 governos na aba). Jeito segue palpite marcado na aba. Ranking do Banco Mundial 2025 põe a Rússia em 8º e o Brasil em 11º: Rússia jogável (autor, 12/nov): 11 jogáveis. GDD revisado em 12/nov (coerência: §18 só com perguntas abertas; Órgãos, Justiça, Caminho autoritário e Governadores na seção 6; decreto = medida provisória; §12 e §15 sem repetição). Mecânica de governo em 12/nov: o jogador é o governo; fronteira do governo e como se perde o poder na seção 6; perder o poder federal acaba a partida (vice de outro partido também). Ministérios em 12/nov: caixa com nome e zero ou mais esferas e subesferas (coluna Subesfera em 7 esferas), lei Organização dos ministérios, abas Ministérios (36 moldes) e Ministérios - países (11, leve). Programas em 12/nov: 74 pacotes nas abas Programas (lado, esferas, palavras do nome, programas reais) e Programas - leis (314 linhas com direção e mínimo); forma-se com a maior parte das leis andando na direção dentro do mandato; nome do país no JSON ou do gerador, anunciado pelo jornal (GDD, tipos de lei). Programa inventado pelo jogador fica para depois (§18). Lembrança e nostalgia em 12/nov: programa formado só dá memória aos grupos (sem efeito extra no motor); desfeito vira nostalgia; recriado pergunta se usa o mesmo nome (volta o apoio e a raiva, crédito em parte do criador); rebatizar é possível; o país traz no JSON os programas de antes. Partida no papel em 12/nov (Sonnet, relatório no scratchpad): decididos Aprovação (satisfação média dos pops), eleição (oposição como adversários, dois turnos no fim do mandato), começo (partido que governava vira oposição; partido novo, poucas cadeiras, presidente popular) e miúdos dos programas; depois decididos: Câmara e Senado votam em sequência (Senado muda, volta à Câmara), decreto como fato consumado, promessa com prêmio pelo tamanho e cumprir em parte, conta da lei no voto (exorbitante definido), partido que governava pode entrar na coligação, partidos reais com nome e cor (sem marca). Poder de decreto em 4 degraus (nenhum, verba e preço, tudo menos impostos e regras do poder, tudo sem confirmar); dentro da lei não é passo autoritário. Partida no papel fechada. Arquitetura aprovada em 12/nov (plano, seção 4: 13 módulos, fatos do turno, 2 portas, exportador da planilha) e ordem: 1 exportador, 2 brasil-2026, 3 Congresso, 4 Governo, 5 Programas e jornal, 6 Eleição, 7 Base do jogo, 8 tela da V1. Passo 1 (exportador) começou em 12/nov: colunas Degraus e Faixa na aba Leis, todas as 489 leis preenchidas (139+28 por script, 322 por 4 agentes Sonnet, marcadas "Degraus/faixa: rascunho 12/nov", 21 com "conferir"). Exportador feito em 12/nov (`npm run exportar`, scripts/exportar-planilha.ts + scripts/xlsx.ts, sem dependência): 358 leis novas em JSON (220 de degraus, 138 de régua; 68 à mão mantidas), 104 índices novos (valor de partida 50 se o país não declarar), cada esfera numa das 8 áreas do mapa; 56 leis fora por ora (forma especial ou unidade que o motor não tem: km/h, dias, mandatos, x salário). Grupos passaram a contar só leis que andaram (testes 5x mais rápidos, mesmo resultado). As 3 leis antigas de energia (quem constrói, opera e vende; Substituídas na planilha) apagadas a pedido do autor, com as camadas do mercado e 4 testes delas. 721 testes verdes, npm run check verde, visto na tela (Saúde com 39 leis). Unidade livre em 12/nov: lei contínua com unidade "livre" e rotulo_unidade (km/h, dias, mandatos, x o salário, % acima de 100); +23 leis (161 de régua), 33 ainda fora (forma especial, faixa dupla, meta negativa). Balão da régua não sai mais pelas pontas. Formas especiais em 12/nov (autor: "o tema vira várias leis"): dois controles e faixa dupla viram 2 leis ("Seguro-desemprego: valor" e ": duração", campo parte_de, força um nível abaixo); divisão de 100% vira uma lei de peso por fatia (0 a 10 pontos, sem lado nem efeito; parte = peso/soma, quando a mecânica ler); régua por setor vira régua geral por ora; faixa negativa na unidade livre. 512 leis no jogo; 5 fora (escolhas de lista: vistos por país, setores, verba das estatais, ministérios). Lado na bússola dos controles divididos é o da lei-mãe: conferir os invertidos ("a partir de quanto cobra", "teto de emissões") na calibração. Área Economia ficou com muitas leis no mapa (8 áreas para 30 esferas). Requisitos refeitos em 12/nov (docs/jogo/requisitos.md: 204 requisitos, cada sistema com o bloco Construção — dados, estado, módulo, turno, fatos, tela e teste — e a Ordem de construir em 17 passos, V1 no 10). Arquitetura num lugar só (arquitetura.md, seção 8). Brasil 2026 feito em 12/nov (passo 1): 476 leis com o valor de hoje por 4 agentes Sonnet (36 sem valor; saídas em arquivo/lote-brasil/), 3 colisões acertadas, Transferência de renda corrigida (agente pôs 30% do PIB), inicia, joga 24 turnos e aparece na tela; check verde. Skills novas: sisgov-ordem, sisgov-pais, sisgov-exportar, sisgov-lote. Fatos do turno feito em 12/nov (passo 2): mesa de fatos em src/motor/fatos (autor: "como uma RAM"; cada módulo pega o que precisa; fato gera fato; some em 1–3 turnos pelo tamanho; o que dura mais fica no estado do módulo); escrevem Congresso e Política; tela mostra "Fatos na mesa" no Resultado do turno; check verde (813). Congresso novo feito em 12/nov (passo 3, R12.3–R12.7, R12.11–R12.14, R12.16–R12.19): voto sem sorteio (nota do partido, fiéis e livres, quórum por classe, conta da lei com déficit), placar previsto = real (janela da lei), Câmara e Senado em sequência (Brasil com Senado de 81 cadeiras), Senado emenda, veto e derrubada, carga e paciência, termômetro com convite, 6 moedas (ceder, cargos, emenda, promessa; ministério espera o Governo), decreto com confirmação em 2 turnos; coluna Classe na planilha (59 leis fora da comum); doc em src/motor/politica/politica.md; 842 testes, check verde, visto na tela (Brasil: Câmara 381×132 igual ao previsto, Senado 59×22). Dívidas no passo: botão de promessa e decreto na tela; raiva dos grupos ao derrubar decreto; pesos do voto a calibrar. Mesa mínima feita em 12/nov (passo 4, família Leis): módulo src/motor/mesa (papel de sanção para a lei emendada, avisos de lei aprovada/decreto/veto, carimbos assinar e vetar com observação, prazo de 1 turno e regra do país para o papel ignorado, `ignorar` em congresso.json: Brasil = sanção tácita), fatos papel-assinado/vetado/ignorado, janela Mesa na barra do topo (visto na tela); o botão Vetar saiu do Resultado do turno. Dívidas: recusar, encaminhar e pilha; outras famílias de papel (crises, pedidos, ofertas, órgãos, partido). Limpeza antes do passo 5 (12/nov, autor pediu): `tramitar` virou 9 fases curtas sobre uma sessão (src/motor/politica: sessao, relacao, moedas, pauta, valores, constantes), moedas em tabela, filtro por tipo de pedido; achado e removido um ramo morto; 851 testes iguais; `npm run medir` (turno do Brasil 8 ms, placar 0,7 ms; orçamento 50 ms e 5 ms) e regras de código e dos dois nomes "mesa" na arquitetura, seção 5. Governo feito em 12/nov (passo 5): módulo src/motor/governo (ministério = caixa com esferas e subesferas; a lei traz `esfera`/`subesfera`; 36 moldes exportados da planilha; fichas com 5 notas; competência adianta/atrasa e reforça/enfraquece o efeito da lei da caixa; superministério divide a competência; órgão por esfera com verba, necessidade, rendimento e corrupção em equilíbrio no começo; escândalo ao cruzar 60); Brasil 2026 com 32 caixas e 81 pessoas inventadas (`npm run governo`); moeda Ministério do Congresso funcionando (partido vota mais com ministro, ressente ao perder); pedido nomear; janela Governo e botão Ministério no Negociar (vistos na tela); caches para não varrer as 512 leis (fase do governo 21 ms → 0,7 ms). Dívidas: custo de estrutura e foco, grupos gostarem do ministro, fatos do ministro (R6.9), lei Organização dos ministérios, menu de montar governo (passo 9), outros países, rendimento do órgão agindo na lei (R7.11), calibrar pesos. Lista de conferência para modelos mais fortes em docs/jogo/codigo-a-conferir.md (28 itens, 12/nov). Limpeza de 12/nov: turno/index.ts dividido em etapas/*.ts + inicio.ts (1.759 → 96 linhas), estadoInicial quebrado, validadores, visao, previa, atendimento e criarPartida em funções menores; fora da tela restam 6 funções entre 61 e 102 linhas; a tela (MapaPolitico, janelas, CSS) fica para a reformulação. Próximo: passo 6 da ordem, Programas.

## Faltam

Nenhuma esfera. Toda lei viva tem roteiro e mecânica.

## Pendências do autor

- Acesso a remédios completo em 11/nov: 5 leis novas (Teto do preço dos remédios, Remédio pago pelo governo na farmácia, Troca pelo genérico, Imposto sobre remédio, Onde se vende remédio). Governadores decididos em 11/nov (GDD §18): termômetro, verba, bancada do estado, pedidos e campanha. Campanha sem limite de ações (freio: caixa e cansaço), 11/nov. Mídia decidida em 11/nov: muda o lado do pop devagar (6 regras) e mobiliza a raiva do grupo (número rápido). Aba dos 30 países adiada (autor, 11/nov: não é importante agora). Próximo: o autor escolhe a frente; candidatas na revisão geral (calibração no motor, estado inicial, revisão do Fable).

- Vídeo de apresentação (5 min) em `arquivo/sisgov-apresentacao.mp4`, 09/nov: voz neural é rascunho; falta decidir a voz final e a chamada do fim.
- Aba "Leis - roteiro" fica separada (autor, 11/nov).
- Papéis das Operações feitos em 11/nov (molde de 3 papéis: autorização, proposta do órgão, resposta). DESENHO FECHADO. Construção civil feita em 11/nov: Regra da licitação, Teto do aditivo, Empreiteira condenada fora das obras, Exigência técnica das construções); próximo: revisão final pelo Fable (autor dá a palavra). (Congresso, Mesa, Órgãos e sistema judiciário desenhados em 11/nov; o tribunal superior entrou "por enquanto".)
- Estudo final de tudo depois das últimas esferas (autor, 09/nov).
- Aba dos 30 países e planejamento final (planilha completa + documento passo a passo).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; `arquivo/` e `docs/jogo/interface/mapa-em-tres-aneis.md` ficam fora.
- O scratchpad (venv do openpyxl) some entre sessões; recriar com `python3 -m venv v && v/bin/pip install openpyxl`.
- Países reais entram; empresa, pessoa e direito autoral não.
- Bases de estudo (V-Party, CHES) ficam em ~/Documentos/SisGov-dados/, fora do repositório; os scripts de conversão estão em scripts/ lá dentro.

---

**07/nov/2026**

## Onde está

**Saúde fechada** (18 leis, em "Avaliados"), `npm run check` verde. Os dois índices
anteriores, favela e saneamento, também. Agora o trabalho anda em **fases grandes**:
desenhar a fase, o autor decide tudo de uma vez, produzir até o fim sem parar.

## Próximo

Vícios fechado no desenho: 12 leis e 3 índices em
[docs/jogo/fase-1-redes.md](docs/jogo/fase-1-redes.md), seção 5; nada criado no código.
Autor mudou o método em 05/nov: primeiro a planilha com todas as leis
([docs/jogo/leis.xlsx](docs/jogo/leis.xlsx): 266 leis em 29 esferas aprovadas, e as abas Índices e Pops),
depois os mecanismos, e só com tudo pronto se programa. Ministério é um conjunto de esferas
(GDD, seções 6 e 7). Autor quer fundamentar a base, pops e leis: as abas Pops, Pops - como
funciona e Pops - estudos estão prontas. Decidido: os pops ganham dados dentro
deles (idade, lugar, vínculo, escolaridade, patrimônio). Base do jogo aprovada: População no centro,
ligada a Economia e Governo, num ciclo; toda lei chega ao pop (GDD, seções 2 e 3). GDD,
requisitos, plano e aba Ligações atualizados.
Aprovados: 15 setores, prédios do Estado e 32 pops em 4 blocos. Planilha
atualizada: Pops, Grupos (nova), 74 prédios, 266 leis e números dos dois países; o código e os
JSONs ainda têm 25 pops. Autor aprovou esses números como base. Grupo: pops organizados pelos interesses, atravessando os pops.
Três camadas fechadas: pop, grupo e organização (GDD, seção 11). 25 grupos aprovados na aba Grupos; abas Organizações, Organizações - vida e
Grupos - estudos prontas. Caminho do lucro aprovado (Economia - lucro e donos). Bolsa aprovada (Economia - ações e investidores), com Índice da bolsa e
Confiança do mercado na aba Índices. Base reunida: Pops - dados, Grupos - pops, Organizações - gerador e as abas
Economia de consumo, cesta, qualificação, trabalho e dinheiro. Números são ponto de partida. A
planilha reúne a mecânica para evitar perguntas básicas; programar por partes, nunca tudo de uma
vez. Roteiro de 8 passos aprovado (GDD, seção 7): aba Leis - roteiro com as 22 leis de Saúde e
Saneamento. Autor definiu em 07/nov: a Bússola é a raiz do jogo (GDD, seções 2 e 8).
Economia segue como pilar. Educação: 15 leis novas e índice Vagas na escola aprovados, com 19 roteiros. Trabalho: 21 leis
aprovadas e pesquisadas, com roteiros (132 leis no total). Previdência: 11 leis aprovadas, com roteiros (143 leis); aposentadoria é verba em % do PIB. Índices: 12 novos, coluna Na tela
(visível ou invisível); 93 índices. Gatilhos só com as narrativas, no fim. Assistência social: 15 leis (Transferência de renda é a verba; as outras dividem ou regram) e 4
índices novos; 156 leis, 65 índices. Moradia: 13 leis com roteiros
(163 leis). Filhos por pessoa na aba Pops - dados. Modelo de moradia aprovado (estoque em 3 faixas, quem constrói, casas descem de faixa) e índice Casas vazias. Impostos: 15 leis com roteiros, índices Sonegação e Saída de ricos (175 leis, 68 índices); lei com
prazo, lei com escolha e igreja como entidade sem lucro no GDD; medida provisória na seção 18.
Anistia perdoa multa de dívidas antigas, com índice Dívida atrasada (69 índices). Igreja é também
organização, com vertente e engajamento; corrupção interna em toda organização. Segurança pública: 29 leis com roteiros (inclui a agência de inteligência; Chefes presos e Dinheiro do crime apreendido viraram índices) e 6 índices novos; o índice Segurança pública será
substituído (197 leis, 75 índices). Verba tem lado pequeno (GDD, seção 7); faltam corrigir as
outras leis que atravessam o meio da bússola. Justiça e prisões: 22 leis com roteiros, 6 índices (Certeza de punição x Peso das penas), presos com
nome e Graça (215 leis, 81 índices). Esfera Transporte virou Infraestrutura e transporte; obra nova é lei separada (Construção de
hospitais, escolas, universidades, delegacias e presídios) (215 leis). Vícios: 14 leis com roteiros, prédios Fábrica de bebidas e cigarros e Casa de apostas, índice
Mortes no trânsito (217 leis, 84 índices). Defesa: 7 leis com roteiros (+ Missões de paz para versão futura), programa nuclear público ou secreto,
índice Risco de golpe; Venda de armas foi para Comércio exterior (223 leis, 85 índices, 74 prédios).
Sem limite de leis por esfera (autor, 07/nov); se ficar demais, reduz depois.
Direitos e liberdades: 13 leis com roteiros, índices Discriminação e Tensão religiosa visíveis (235
leis, 87 índices). Estado e eleições: 17 leis com roteiros, 3 índices (251 leis, 90 índices). Comunicação e tecnologia: 15 leis com
roteiros, 3 índices, mecânicas da mídia e a rede do presidente com a inteligência e o botão Espiar; 8 maiores mídias e histórico do país no GDD (266 leis, 93
índices). Mídia desenhada inteira em 08/nov (GDD §14, planilha Economia - como funciona, 10 linhas): fato e versão (notícia falsa existe), pauta, jornal e redes das emissoras, entrevista, atos do presidente, partido, escândalo em ciclo, vazamento, jornalistas, boato; 3 índices novos (96 índices). Mídia: regra da mentira descoberta e do dono que muda de lado escritas; entrevista e 2 leis do horário eleitoral escritas (268 leis); custo dos atos fica para as narrativas. Mídia fechada. Relações exteriores (08/nov): 13 leis com roteiros e 2 índices, Soberania e Tensão internacional (281 leis, 98 índices); mundo com países reais (10 maiores jogáveis, ranking de 30, vizinhos, resto) no GDD §15 e §19. Aba dos 30 países fica para o planejamento final (autor, 08/nov), junto com a planilha completa e o documento que, com o GDD, escreve todo o jogo passo a passo (GDD §18). Imigração (08/nov): 16 leis com roteiros e 5 índices (297 leis, 103 índices); 'nascido fora' é dado dentro do pop (GDD §11). Orçamento e dívida (08/nov): 14 leis novas com roteiros e 5 índices (311 leis, 108 índices); Regra fiscal em 4 leis; cada lei abre sua figura (GDD §16, 'Orçamento e dívida'). Déficit e Superávit ficam como estavam, 'a revisar'. Moeda e bancos (08/nov): 10 leis com roteiros e 6 índices (321 leis, 114 índices); câmbio é um corredor com preço-alvo e faixa; resgate de bancos e as crises ficam para as narrativas (GDD §16 e §18). Empresas e estatais (08/nov): 15 leis novas com roteiros e 5 índices; lista de companhias, cotas com meta e prazo, estatização e privatização por papéis na mesa (GDD §16). As 5 leis antigas ficam 'a revisar'. Tipos fechados em 08/nov: Lei, Lei com prazo, Ato, Operação (colunas Tipo e Forma padrão na aba Leis; 340 leis); decisões de país e de companhia não são leis; entram 4 leis de controle (Verba das estatais por setor, Construção de estatais, Autorização para estatizar e vender, Aprovação de tratados, Alcance das sanções). Princípio do mercado indireto no GDD §16. Falta definir o conteúdo de cada papel. Resumo para outro chat em docs/jogo/resumo-para-outro-chat.md (não está no git). Próximo: autor escolhe a próxima esfera (faltam 9; recomendo Comércio exterior e capital). Sem documento novo: tudo vai na planilha. Situação das leis em
[docs/jogo/leis-situacao.md](docs/jogo/leis-situacao.md): 22 verificadas, 49 a revisar.
Crime organizado só com a Segurança. Falta requisitos.md ganhar as redes.
Sem commit ainda: este desenho,
plano, GDD e o ajuste de formatação em `motor/atendimento`.

## Pontos em aberto da saúde (entram nas redes ou no balanço)

- A ficha não mostra dinheiro das leis de opções: o custo das 8 leis novas só
  aparece no gasto do governo.
- A Coparticipação mede o bolso contra a renda do próprio país: pesa pela
  desigualdade de renda, não pelo PIB. No `teste` a saúde cai mais que no
  `teste-pobre`, porque ele tem mais gente na rede.
- A fila de 45% no país `teste` é estado de teste, não balanço.
- A ficha mostra só um turno da deriva; o acumulado fica maior.
- `emprego_informal` ainda não tem grupo que cobre nem empurrão próprio.
- `acesso_remedios` vem do mercado; ver se entra na rede.

## Depois da saúde (ideias guardadas)

Caminhos até a casa, organizações criminosas (GDD §18), campo e a fila da terra.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- 93 commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.
- `docs/jogo/gdd.md` não passa no prettier: `--write` mexe em linhas de fora; não formatar.
- No zsh, `--include=*.ts` sem aspas quebra: pôr o padrão entre aspas.
- `jogar` nos testes falha depois do turno ~24: usar 20 turnos.
- `icones.ts` diz que é gerado, mas `scripts/icones/` não existe: lei nova entra à mão em `ICONE_LEI`, com desenho que já esteja em `DESENHOS`.
- `reputacao_internacional` vem das potências, não da base: mexer na `base` não faz nada; somar em `comReputacao`.

---

**04/nov/2026**

## Onde está

Frente atual: **pops e grupos** (o autor pediu fechar antes do Partido, porque
a chapa e o perfil de rede dependem deles). Feito em 03/nov: os **25 pops**
(8 pobres, 11 médios, 6 ricos) em `mundo/pops/pops.json`, cada um com bússola;
parcelas dos dois países refeitas somando o mesmo que os 6 antigos; grupos
reapontados; aparecem na tela do Mercado. Testes e `tsc -b` verdes.
Efeito visível: "sem emprego formal" subiu (35→38% no teste-pobre) por causa de
estudantes e aposentados, que não têm setor.

**16 grupos** no lugar dos 4 (`mundo/grupos/grupos.json`); os 25 pops têm casa;
os partidos dos países (`congresso.json`) defendem os novos ids; testes e `tsc -b`
verdes; aparecem no mapa.

O Partido (GDD §4, R4.5–R4.10, R6.11–R6.12) está escrito e commitado, sem código.

**R8.5 (vida) feito**: cada pop desliza na bússola (renda + satisfação), a do
grupo anda junto; interno, o jogador sente só apoio e votos. Falta a mídia.
Em 12 turnos parados o deslize é pequeno (~0,005); não equilibrado.

**R11.6 feito**: gente sobe e desce de estrato com a renda real e a instrução
(`Estado.migracao`, escadas `sobe`/`desce` em `pops.json`). Em 24 turnos
parados mexe ~1% e quase tudo é descida; não equilibrado. A tela ainda não mostra
"quem subiu" direto: só aparece nos grupos e no emprego.

**R11.5 feito**: pop estuda e muda para o setor que paga mais (`Estado.setores`,
`treina` em `pops.json`, velocidade pela instrução). Universidade NÃO é
construção (decisão do autor): é só o índice. Em 24 turnos tecnologia sobe
~50% de empregos no `teste`; não equilibrado.

## Próximo

Pops e grupos **fechados sem a mídia** (03/nov, check verde, 229 testes).
R8.5/R11.4 ◐ "falta mídia"; R16.7–R16.10 são das construções: não marcar.
Partido adiado pelo autor ("precisamos de algumas coisas antes").

**Frente atual: moradia (leis ↔ índices, por área).** Hoje moradia é produto
comerciável do mercado (`produtos.json`, `produtores.json`), sem demanda nem
índice. Decidido: vira estoque local, sai dos produtores do mundo; construída
por empresas, governo e pops privados (pobre autoconstrói precário, médio
financia, rico investe). Três índices em estudo (ids ainda não criados, o autor
aprova): déficit, preço e favela.
**Regras do autor (03/nov):** (1) processo = estoque que anda sozinho pelos
turnos, empurrado pelas leis em vigor; NÃO é painel com meta/ritmo; (2) cada lei
vai de "nada" a "mais" em UM lado da bússola, nunca de um extremo ao outro;
(3) leis em todos os lados. Proposta no chat: processo "urbanizar favelas" com
leis de esquerda, direita, libertário, autoritário e verde. **Molde aprovado
(03/nov):** jogador monta "builds"; só leis que se colidem não valem juntas
(como anti-armas × pró-armas). Próximo: propor as leis dos processos déficit e
preço, e a lista de colisões, antes de qualquer código. **Feito:** 3 índices em
`variaveis.json` (`deficit_habitacional`, `preco_moradia`, `favela`, calculados,
ainda sem cálculo no motor). Lista das 18 leis (3 índices × 6 lados) e 5
colisões enviada no chat; autor concordou em manter os 3 índices separados.
**04/nov:** criado `docs/jogo/arquitetura.md` (camadas, turno, peças: índice,
lei, processo, colisão, área). O autor quer "mudar algumas coisas antes de
continuar": esperar o que muda. Falta: criar as 18 leis, o cálculo, tirar
moradia dos produtores.
**04/nov (2):** autor aprovou ligar **campo × cidade** pelo êxodo. Anotado no
GDD (§7 build/colisão/processo; §16 "Terra e moradia"; §18 dúvidas) e nos
requisitos (R7.9–R7.10, R16.17–R16.24). Índice `concentracao_terra` aprovado e
criado; os 4 índices novos têm valor de partida nos 2 países (sem isso 12 testes
quebravam). 229 testes e `tsc -b` verdes. Autor rejeitou "Reforma agrária X%":
é processo em 4 etapas, leis são as peças. Nova pergunta antes de toda lei:
"presidente real assinaria e pronto?". Leis do campo refeitas no chat.
Aprovado: fazendas em 3 tamanhos; vistoria → defesa → desapropriação. Regra nova
(GDD §7): jogador não escolhe fazenda/fábrica; leis dão verba ao órgão, força pela
verba, excesso vira corrupção (NÃO "régua que anda"). Órgãos no GDD §18.
Imposto sobre terra parada: 0–100% com o Laffer que o motor já tem
(`modelo: laffer`). Autor achou dividido demais: lista enxuta (13 leis, 4
reaproveitadas: indenizacao, policia-ambiental, areas-protegidas,
saneamento-basico) enviada no chat. Depois: + "Dono da terra" (essencial,
opções privada/arrendada/coletiva/do Estado) e + "Teto de tamanho da terra";
triagem-estrangeira ganha efeito em terra; zoneamento recusado (complexo).
Lista final de 15 leis e 4 índices no chat: esperando aprovação para criar.
**04/nov (3):** autor aprovou criar. "Dono da terra" RECUSADA: ia de um lado da
bússola ao outro. Proposta de troca no chat: "Terra comunal" (V) e "Arrendamento
de terra pública" (A); a privada é o padrão sem lei; "do Estado" vira caminho.
Criadas as 5 do campo (`teto-tamanho-terra`, `imposto-terra-parada`,
`verba-orgao-terras`, `credito-compra-terra`, `terra-invadida`), área nova
"Terra e moradia" no mapa, base de cálculo `terra` (Laffer, parcela por país);
indenização vale para terra (só o texto). 234 testes e `tsc -b` verdes, visto na
tela. Falta no motor: progressividade, corrupção por verba demais, estoques.
"Terra comunal" e "Arrendamento" descartadas (confusas, dependiam de terra que
o Estado não tem). No lugar, mecânica **Tomar e dar destino** anotada no GDD
§18, R16.25 e `arquitetura.md` (peças Órgão e Destino). Criadas as 6 da cidade
(`verba-habitacao`, `credito-imobiliario` como gasto % PIB e não "% dos juros",
`teto-aluguel`, `despejo-rapido`, `remocao-area-risco`, `titulo-posse`);
saneamento ganha favela −, áreas protegidas ganha preço +. Área com 11 leis,
240 testes e `tsc -b` verdes, visto na tela. Falta: triagem-estrangeira em
terra, código das colisões (aluguel × despejo; título × remoção), estoques e
cálculo dos 4 índices, tirar moradia de `produtores.json`. Commit `fc76e2aa`.
**04/nov (4): deriva feita** (modelo aprovado: índice = base + leis + deriva).
`motor/deriva` move a base a cada turno, medindo quem empurra contra o turno
0 (país começa parado); ligações em `mundo/indicadores/derivas.json`
(concentração → déficit; crescimento → déficit −; déficit → preço e favela;
pobreza → favela). 244 testes e `tsc -b` verdes. Teste-pobre em 20 turnos:
verba de habitação máxima tira 5 do déficit, 3 do preço e 5 da favela; teto de
terra 5× tira 10 da concentração e 6 do déficit. Na tela: sem lei, déficit
35→35,5 e favela 30→30,3 (o Congresso recusou a verba). Não equilibrado.
**04/nov (5):** caixa "Sem Congresso (teste)" na tela inicial (toda lei
passa; a eleição continua). Na tela, teste-pobre, verba de habitação máxima,
12 turnos: déficit 35→30,5, favela 30→27,4. "Terra invadida" retirada (área
com 10 leis; nota no GDD §18). 243 testes e `tsc -b` verdes. Sem commit.
Commits `4a724781` e `52f607f9`.
**04/nov (6): freio feito.** Ligação de deriva pode ter `freio` (lei contínua);
pobreza → favela freada pela verba de habitação, verba máxima corta inteira
(decisão do autor). 244 testes e `tsc -b` verdes. Na partida quase não se vê:
a pobreza do teste-pobre fica parada em 45 por 24 turnos. Commit feito (motor: freio na deriva).
**04/nov (7): colisões feitas.** `mundo/colisoes/colisoes.json` (teto de
aluguel × despejo rápido; título de posse × remoção). É um "ou" (autor): o
jogador põe uma ou outra, nunca as duas, e nenhuma lei manda na outra. Para
trocar, revoga uma e propõe a outra no turno seguinte. A tela não cita a outra
lei. 248 testes e `tsc -b` verdes; visto na tela. Commit feito (motor: colisão).
**04/nov (8): estoque de casas feito.** `motor/moradia` conta casas formais,
precárias e obras; déficit e favela saem dessa conta (família = pessoas ÷ 3).
Governo constrói com a Verba de habitação; empresas constroem pelo preço, pelo
setor construção civil, por juro, imposto e corrupção; quem fica sem casa levanta
casa precária. Casas desgastam 4% ao ano. A obra leva cerca de 1 ano. Saíram as
derivas de déficit e favela e o freio; ficou déficit → preço. Verba no máximo, no
teste: déficit 20 → 16,3 e favela 15 → 14,2 em 18 turnos, visto na tela. A ficha
da Verba mostra os pontos por ano e o mapa mantém as setas.
Commit `3a88543d`.
**04/nov (9): êxodo simples e pobreza na conta de casas.** Os pops do campo são
o limite (o país não declara tamanho do campo, decisão do autor). Concentração
acima do turno 0 tira famílias do campo, aos poucos, e elas entram no déficit;
abaixo, famílias sem casa formal voltam e saem do déficit, mesmo abaixo do
começo. Pobreza acima do turno 0 faz mais famílias sem casa levantarem casa
precária. Sem índice novo; ninguém muda de pop. 261 testes e `tsc -b` verdes.
Teste, verba do órgão de terras 2%, 23 turnos: concentração 45, déficit 19,8 → 19,2
e favela 15,0 → 14,6 contra a partida sem lei; 19,2 visto na tela. Efeito pequeno.
Commit `c6d17746`.
**04/nov (10): ligação à vista.** O mapa tem seta concentração → déficit, e a
ficha da lei que mexe na concentração mostra o déficit no fim do êxodo ("aos
poucos"). Verba do órgão de terras a 1,95% no teste-pobre: −4,9 concentração,
−1,2 déficit, visto na tela. 264 testes e `tsc -b` verdes. Nessas leis, a ficha
avisa que o déficit vem pelo êxodo. Pobreza → favela segue sem seta nem linha na ficha. Commitado.
**04/nov (11): favela com consequência.** Favela acima do começo piora saúde,
segurança e o índice novo `saneamento` (deriva fraca); a lei de saneamento move
esse índice. Grupos cobram favela, déficit e preço (rentistas querem preço alto).
Derivas têm seta no mapa, visto na tela. 266 testes e `tsc -b` verdes. Commitado.
`docs/jogo/indices-avaliacao.md` separa índices avaliados e não avaliados.
Organizações criminosas estão no GDD §18. Save antigo mostra saneamento 0%.
**04/nov (12): saneamento avaliado.** `motor/saneamento` conta as
famílias ligadas à rede (`mundo/saneamento/saneamento.json`). Pacote: Verba de
saneamento, Concessão da rede, Teto da tarifa de água e Tratamento de esgoto, sem
efeito direto; concessão × teto colidem. Setas saneamento → saúde e meio
ambiente; Sem trabalho formal e Gente do campo cobram. Casas e rede disputam o
setor de construção: passou de 2× o trabalho do turno 0, as obras das duas
atrasam. Prazo base da rede: 6 turnos. Número sem balanço.
**04/nov (13): bolso.** A lei não sabe do país: a renda real de cada
pop contra a conta diz quem paga (`parteAbaixoDe`, `apertoDoBolso`). Moradia:
preço alto tira a casa de quem não paga, sobe a favela e a empresa só constrói
para quem paga; saiu a regra da pobreza. Rede: quem não paga é cortado, e o índice
conta os atendidos. Em 20 turnos: preço +20 dá favela +3,5 no `teste` e +7 no
`teste-pobre`; teto máximo dá saneamento −1,2 e +1,0; concessão máxima +1,9 e
+0,8. Ficha e mapa mostram. Renda é medida contra a média do próprio país, como
nas cestas.

**05/nov (19): Cobertura gratuita feita, commitada.** Peça nova `procura`: quanto cada pessoa usa a rede pública; a Coparticipação vai baixá-la. Fila cresce, planos encolhem, vaga parada se enche; saúde sobe (`cuidado_cedo`) e desigualdade cai (`renda_indireta`). Medido em 20 turnos, `teste`: Tudo para todos 55→46 de atendimento, saúde 50→52; com verba 6%, atendimento 55 e saúde 57,5. Próximo: Coparticipação, Dedução, Conta de saúde, Filantrópicos.

**05/nov (18): Seguro na folha feito, commitado.** Parte do salário cobre quem tem emprego formal, fora do orçamento (4 níveis). O segurado entra com os planos, mas pesa `peso_seguro` 1,2 (plano pesa 1,5; com 1,5 o seguro só piorava a fila). Planos passam de 18%: 30% no `teste` com Todo emprego. Custos: gente vai para `informais-urbanos` aos poucos, rede pública perde profissionais, desigualdade sobe. Deixa cortar a verba sem perder atendimento. Índice novo `emprego_informal` mostra a saída para o informal na ficha (parte das pessoas no pop informal). Próximo: Cobertura gratuita, Dedução, Coparticipação, Conta de saúde, Filantrópicos.

**05/nov (17): Atenção preventiva, Telemedicina livre e Serviço obrigatório feitas, commitadas (`a006d7d1`).** Atenção preventiva: verba (até 3% do PIB) que alcança parte da fila sem vaga nem profissional; rende mais no país pobre (0,5% do PIB: +6,6 no `teste-pobre`, +4,9 no `teste`). Telemedicina e Serviço esticam o profissional da rede pública (`valores.alcance`, `fraco`, `abandono`): só rendem onde falta profissional, e sozinhas no país sem parede mostram só o custo. Fichas conferidas na tela. Lei nova com `leis_alcance` é só JSON.

**05/nov (16): Abertura com custo, commitada.** Saúde de dois andares: "com plano × na fila" sobe a desigualdade (`desigualdadeDaRede`), então a verba e o Limite baixam esse custo. Mercado aberto em 20 turnos: `teste` +7,2 atendimento e +2,1 desigualdade; `teste-pobre` +3,6 e +3,4. Seta e ficha conferidas na tela.

**04/nov (15): verba da saúde corrigida, commitada.** A verba rende menos a cada ponto; vaga sem profissional vira corrupção e sai quando a vaga fecha ou o profissional chega. Instrução leva 6 anos para virar formados. "Médicos por habitante" virou "Profissionais de saúde", em "por mil habitantes". Planos param em cerca de 18% (Seguro na folha deve resolver).

**04/nov (14): saúde, primeira parte, commitada.** A bolha Atendimento mostra a fila ("45 % na fila da saúde"); a bolha Desigualdade passou a mostrar o Gini pelo mesmo conserto. Saúde virou área própria no
mapa. `motor/atendimento` conta vagas, planos e profissionais; índices novos
`atendimento` (mostra a fila da saúde) e `profissionais_saude`. Verba e Remoção
de área de risco não mexem mais direto na saúde. Leis novas: Abertura e Limite aos
planos, que colidem. Profissionais saem de `instrucao` e emigram quando perdem
renda real; a população cai. Em 20 turnos: verba acima de +2 pontos do PIB não
rende mais, porque falta profissional; abertura máxima dá atendimento +7,2 no
`teste` e +3,6 no `teste-pobre`. Número sem balanço.

**Próximo:** commit com a palavra do autor; depois as 16 leis da saúde que faltam
(lista no GDD §18), uma pergunta por vez. A educação é a próxima área.

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c, 46799fda, f8b8a705, 0d121456 e os de pops/grupos) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Freio do juro nas obras mede contra o juro de equilíbrio do turno 0 (`taxaAlvo`), não o declarado: o teste-pobre declara 10 e anda a 13.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**03/nov/2026**

## Onde está

**Premissa (autor, 02/nov):** bolsa moderna no lugar do mercado vitoriano e da
fatia 8. Minigame **Pregão**: blocos de 2%, tudo no mesmo turno, sem efeito
neutro. Quer tudo junto: várias empresas, criar empresa, cofre real.

**Feito nesta rodada (sem commit):**

- Passo 1: fatia 8 apagada (ficha.ts, propriedade.ts, fichas.json, Fichas.tsx,
  botão "Setores", previaDaFicha, 36 leis de setor, 5 leis de propriedade:
  metodo-venda, preco-minimo-venda, setores-do-estado, fabrica-no-exterior,
  acordo-com-potencias). Energia voltou às 3 camadas antigas. tsc e 187 testes ok.
- Ficam 8 leis na área "Propriedade" (indenizacao, prazo-pagamento,
  regra-pos-venda, politica-estatal, triagem-estrangeira, remessa-de-lucro,
  fabrica-de-fora, concorrencia); ainda sem efeito (campo `valores` no motor).
- Passo 2: `empresas.json` por país (teste: 5, teste-pobre: 3; nomes inventados),
  `empresasDoPais` em `src/partida/index.ts`, Pregão com uma aba por empresa.

**GDD reescrito (autor, 02/nov):** `docs/jogo/gdd.md` descreve o **jogo
pronto**, sem plano nem "depois". Entraram: você é o partido (chapa,
presidente do partido, coesão, caixa); sucessão (assassinato; sucessor de
outro partido = desvantagem até a eleição); ministros como fichas de RPG;
mídia com mecânica própria; coligação; campanha; mandatos e reeleição.
O feito e a ordem foram para o plano (seção 1). Ideia nova = GDD seção 18
(Perguntas em aberto).

**Mesa (autor, 03/nov):** GDD seção 17 virou "Tela: mapa e mesa". A mesa
recebe papéis (lei aprovada pelo Congresso, situação, pedido) para assinar,
vetar, recusar, encaminhar ao ministro ou ignorar; ignorar tem consequência.
Respostas do autor na seção 18 foram para os sistemas; a 18 tem só o que
segue aberto.

**Requisitos (03/nov):** `docs/jogo/requisitos.md`, 108 requisitos (R4.1…)
tirados do GDD com status medido no código: 31 feitos, 17 parciais, 60
faltam (~30% do jogo).

## Próximo

Pilar 1 do Mercado fechado (1a, 1b, 1c). Perguntar ao autor: pilar 2
(empresas) e pilar 3 (bolsa) ainda entram na 12b ou o autor muda de frente?
`npm run check` roda ao fechar a mecânica.

**Feito 03/nov: fatia 1a (46799fda), 1b (f8b8a705) e 1c (tela do Mercado: linha "Construções" por setor, lucro × o de antes, aviso de prejuízo e fechamento).**
`construcoes.ts` + `obras` em `produtos.json`; PIB real = capacidade pronta;
investimento privado abre obras (decisão A do autor). 1b: lucro por setor
(receita − salários − imposto), investimento vai para a margem relativa que
melhorou, 3 turnos de prejuízo fecham 5%/turno, setor do Estado não fecha.
Teste 2,0%/ano e teste-pobre 3,3%/ano, iguais ao 1a. Cenários:
`npm run construcoes`; testes `scripts/construcoes.test.ts` (10).

## Pendências do autor

- Jogar o Pregão (botão "Bolsa").
- Commits locais sem push (55eb0ff2, 5adddb3c) (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (talvez 3, GDD seção 18); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

---

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado.
Mercado tipo Vic3 em código até a fatia 7 (comida, Remédios, Energia).
**Fatia 8 (Propriedade) redesenhada e aprovada pelo autor em 02/nov:** o
protótipo v2 (barra de 50 blocos) foi descartado. **Regras gerais = leis
(bolhas)**; **decisão por setor = ficha do setor** (dono estatal/mista/privada,
importação, teto de capital estrangeiro, preço), e cada mudança é um projeto de
lei votado, que segue as leis gerais (indenização, método de venda, prazo,
triagem, Déficit e Superávit etc.). Tudo em `src/motor/mercado/mercado.md`,
fatia 8. Princípios 8 e 9 do escopo (bolha; dados antes da narrativa) escritos.
Skill nova `sisgov-gamedesign` (6 perguntas antes de desenhar).

## Próximo

**Fatia 8 (Propriedade) fechada em 02/nov** (passos 1 a 8; `npm run check` verde,
254 testes). Autor aprovou o jeito da janela "Setores" ("serve, depois
corrigimos"). Próxima ação: autor escolhe a frente seguinte (recomendo
confirmar Energia e Remédios na tela, depois o passo 13, leis em pacotes).
Ajuste menor para depois: depois de "Propor" o botão continua "Propor ao
Congresso" (não diz "na fila"). Investidores = opinião média das potências
(ficou assim; bolsa simulada foi para a seção 11 do escopo).

## Pendências do autor

- Confirmar Energia e Remédios na tela.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado.
- Eixos novos da bússola (paz × militarismo, seção 11); outro chat trata da economia militar.
- Equilibrar com "Brasil" e "EUA" só no fim (regra de país real).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**02/nov/2026**

## Onde está

Passos 11 (mundo) e 12 (mercado, sem a 5b) fechados; dinheiro na tela fechado
(`npm run check` verde, 137 testes). **Nova frente: mercado de verdade, bem
parecido com o do Vic3** (autor): a comida do país depende de pessoas, produção,
preço e de quem consegue pagar. Pesquisa salva em
`docs/jogo/mercado-vic3-referencia.md`. Desenho na
**fatia 6** de `src/motor/mercado/mercado.md`; **6a a 6d em código** (comida e Remédios como cestas; falta o autor confirmar Remédios na tela): demanda dos pops, oferta, preço
do país (faixa de 25% a 175%) e segurança alimentar. Autor decidiu: Agro é
grupo de pop, não produto; produtos novos **Grãos** e **Frutas**; todos os
produtos, mas a comida primeiro e só depois de confirmada na tela os outros.

## Próximo

**Fatia 8 (Propriedade e processos)**, desenho em `mercado.md`, ajustado em
02/nov após o protótipo: passos de **2%**, votação só no Congresso (câmara
única), e **sem cofre único**: venda e compra seguem duas leis novas de opções,
_Déficit_ e _Superávit_ (hoje fixas em `src/motor/contas`). Próximo: **protótipo
v2** (barra de 50 blocos, medidor de custo/destino) para o autor ver; depois
motor das duas leis fiscais, motor do processo, energia, setores, pacotes.

Autor olha a **Energia** (bolha "Infra", 8 leis: 5 verbas por fonte e 3 de
"quem constrói / opera / vende") e o bloco "Energia: capacidade contra demanda"
na janela Mercado, e confirma, junto com Remédios. Em aberto: as outras 5 leis do
pacote (tarifa social, subsídio à limpa, imposto sobre fóssil, licenciamento,
fiscalização nuclear), uma por vez; risco da nuclear. Depois, **uma regra
própria por vez**: Moradia, Infraestrutura (estradas, obras), Militar.
Industriais, informação e luxo ficam para depois. Equilibrar com "Brasil" e
"EUA" só no fim (ver a regra de país real). Demografia é etapa própria.

Outro chat trata da **economia das leis militares**. Em aberto: **eixos novos**
da bússola (paz × militarismo, seção 11).

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções foi criada sem confirmação explícita; ver se serve.
- Antes de publicar o jogo: checar com advogado (mecânicas não são protegidas, expressão é; ver pesquisa no chat de 02/nov).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**02/nov/2026**

## Onde está

**Passo 12 (mercado) em andamento.** **Passo 11 (mundo) fechado** em 02/nov: `npm run check` verde (107 testes),
plano e escopo com ✅. Fez: 5 potências (sem nome real) com opinião pela
bússola, reputação = média pesada, poder defensivo, segurança externa =
poder defensivo − (100 − reputação), leis de segurança (blocos A a E),
losangos no mapa e chips "Reputação" e "Seg. externa" na barra do topo.
Comportamento: `src/motor/mundo/mundo.md` e `src/tela/mapa/mapa.md` (fatia 5).
Sem tag (o passo 11 não fecha versão).

**Controle das leis em % (02/nov, depois do passo 11):** as 14 leis em % vão
de 0 a 100% (o Congresso é quem barra: mais de 1/3 da faixa cai). A bússola
continua calibrada pelo máximo antigo (`bussola.ate` na lei). O slider é
novo: régua em %, pino com o valor, marca do valor em vigor, zonas (imposto:
amarelo perto do pico da receita e vermelho depois; verba: vermelho acima do
ponto em que o gasto passa da receita) e sem caixa de número. Comportamento em
`src/tela/mapa/mapa.md` (fatia 6).

## Próximo

**Passo 12 (Mercado) fechado em 02/nov, sem a 5b** (`npm run check` verde, 134
testes). Fez: 7 setores e 22 produtos, cobertura do país, preço do mundo com
ciclo e choques, pops com setores e capital (empregos, salário e lucro), janela
Mercado. A janela é vitrine: PIB e impostos ainda não leem o mercado (5b, na
seção 11 do escopo).

**Dinheiro na tela fechada (02/nov):** barra do topo, Mercado (salários e lucro
por setor) e, ao lado dos controles das leis, "≈ arrecada/custa X por ano · Y
no turno" com a diferença contra o valor em vigor. Por ano e por turno juntos;
símbolo da moeda por país (`moeda` no `estado-inicial.json`); `estado.mudanca`.
Comportamento em `src/tela/mapa/mapa.md` (fatias 7, 8 e 9). `npm run check`
verde (137 testes). **Pergunta ao autor:** compra e vende do Mercado seguem em %
da demanda, porque o motor não tem o valor da demanda de cada produto; converter
pede uma regra nova. Depois: **mais pops** (e mais grupos) e a 5b do mercado.

Outro chat trata da **economia das leis militares**. Também em aberto: quais
**eixos novos** entram na bússola (paz × militarismo, seção 11).

## Pendências do autor

- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções (sem regra / permissão prévia / permissão e apagar) foi criada sem confirmação explícita; ver se serve.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**02/nov/2026**

## Onde está

Passo 11 (mundo) em andamento; comportamento esperado em
`src/motor/mundo/mundo.md`. Pedaços 1 a 6 feitos: potências, opinião (curva),
reputação e **segurança externa** = poder defensivo − (100 − reputação), sem
corte (autor aprovou; só pesa de verdade com leis nas pontas da bússola).
Índices novos: `poder_defensivo`, `seguranca_externa`, `lotacao_presidios`
(maior é pior); `seguranca` mostra "Segurança pública". Leis contínuas aceitam
`unidade: "meses" | "anos"` (usadas pelo serviço militar e pela idade do voluntário).

## Próximo

**Pedaço 6 feito** (02/nov): as 5 potências são losangos num anel logo atrás
dos grupos (nome, opinião no anel e dica ao passar o mouse), e a barra do topo
ganhou os chips "Reputação" e "Seg. externa" (`src/tela/mapa/mapa.md`, fatia 5).
Visto na tela. Passo 11 só falta fechar: `npm run check`, plano e escopo ✅.
Antes disso o autor ainda decide: como as leis militares funcionam na economia
(ele pediu) e quais eixos novos entram na bússola (paz × militarismo está no
escopo, seção 11). Depois: passo 12 Mercado. Ideia do autor, ainda não feita:
empresas em volta, perto do anel das potências (outra frente).
Leis de segurança: todas criadas (blocos A a E).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).
- Proteção de dados: lei única de 3 opções (sem regra / permissão prévia / permissão e apagar) foi criada sem confirmação explícita; ver se serve.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

---

**01/nov/2026**

## Onde está

Passo 11 (mundo) em andamento; comportamento esperado em
`src/motor/mundo/mundo.md`. Pedaços 1 a 3 feitos: as 5 potências (sem nome
real); opinião de cada uma anda 10% por turno rumo à desejada, que é uma
**curva** (100 × (1 − f²)); posição do país = média das leis na bússola;
reputação internacional = média das opiniões pesada pelo `peso`. A bússola
(2 eixos, 4 polos) está resumida em `docs/jogo/bussola.md`.

## Próximo

Pedaço 4: segurança externa (proposta feita ao autor no chat, espera o sim).
Feito nesta rodada: opiniões de partida dos testes perto da desejada; conta
da bússola em laço sobre `EIXOS` (aceita mais eixos). Falta o autor dizer
quais eixos novos entram (decisão dele). Peso por lei fica para o passo 13.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).

---

**01/nov/2026 (bússola política)**

## Onde está

O mapa é a única tela do jogo (fatias 1 a 4 feitas, `src/tela/mapa/mapa.md`).
Frente atual: **motor de leis**. Feito: **bússola política**. Leis (cada
ponta da faixa ou opção) e grupos têm posição em dois eixos; o grupo reage
eixo por eixo ao quanto a lei se aproximou dele, até ±15 por lei. Satisfação,
voto dos partidos, prévia e setas do mapa leem a bússola
(`src/motor/grupos/grupos.md`). A lista `grupos` saiu das leis.

## Próximo

Espera decisão do autor: o passo seguinte é o lote de leis novas, já com
bússola (índices órfãos Desigualdade e Polarização primeiro), ou os pops com
posição que desliza pela renda (seção 11 do escopo)?

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Commits locais sem push (push só com a palavra do autor).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupo de centro (perto da posição atual da lei) perde nos dois sentidos: é a bússola, não erro.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

**01/nov/2026 (tela: o mapa)**

## Onde está

Versão 1.0 enviada (`v1.0`). Frente nova, decidida com o autor: **a tela do
jogo é o mapa da tela antiga, reaproveitado** (`src/tela/mapa/`, lendo a
`VisaoPartida` de `src/partida/visao.ts`). Comportamento em
`src/tela/mapa/mapa.md`.
**Fatia 1 feita:** mapa com esferas, leis, bolhas e setas.
**Fatia 2 feita:** clicar numa lei abre a janela do antigo (`DocumentoLei.tsx`):
controle, efeitos diretos do motor (`partida/previa.ts`) e "Enviar ao
Congresso", que põe o pedido na fila do turno (a mesma do Painel).
**Fatia 3 feita:** barra do topo do antigo (`BarraDoTopo.tsx`: caixa, dívida,
apoio com dica) e "Passar o turno" no mapa, que abre o "Resultado do turno"
(`ResultadoDoTurno.tsx`: votações e eleição). O mapa já joga uma partida
inteira sem o Painel.
**Fatia 4 feita:** o Painel de tabelas saiu (e `Leis.tsx`); Salvar, Carregar e
Recomeçar agora ficam na barra do topo. O mapa é a única tela do jogo.

## Próximo

Frente A: mais leis e revogar lei. Proposta curta para o autor aprovar antes
de implementar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Mais leis e revogar lei (frente A) esperam o mapa ficar jogável.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (agora é a referência da tela; ainda sem commit): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).
- A tag `projeto-antigo-2026-10-31` não tem mais as leis antigas: para ver ou rodar a tela antiga, usar o commit `f62c3fef` (`git show f62c3fef:src/ui/mapa/…`; numa worktree, ligar `node_modules` e abrir direto no jogo trocando o estado inicial de `TelaPrincipal`).
- O `mapa.css` antigo trava a rolagem do `body`: tela que precisa rolar usa contêiner próprio (`.painel-rolagem`); o `main` da tela simples é `main:not(.area-mapa)`.
- `tela.css` só vale dentro de `.painel-rolagem` (a regra `section` global pintava a janela da lei de branco).
- Lei sem valor no país (ex.: áreas protegidas no teste-pobre) vira `naoLegislada`, no mínimo da faixa; `undefined × 100` dava NaN no mapa.
- Para testar muitos turnos no navegador, clicar "Passar o turno" por JavaScript em laço (a eleição do teste-pobre sai no turno 24).
- No navegador do Claude, o primeiro clique numa esfera ou lei às vezes não pega (o hover redesenha o nó): passar o mouse antes de clicar.
- Retratos do antigo são SVG genéricos (ok); fotos e nomes da tela de fundação são de pessoas reais e não entram.

**01/nov/2026 (passo 10, versão 1.0; commit e tag já enviados)**

## Onde está

**Passo 10 (Tela) fechado em 01/nov; versão 1.0 completa, tag `v1.0`
criada (sem push).**
Tela simples em React (`npm run dev`): escolher país e semente, grupos,
índices, leis com controle para propor, fila de pedidos, votação do
Congresso e resultado da eleição. Salvar e carregar no navegador
(`src/partida/salvar.ts`, texto JSON com país, semente e estado). Jogada uma
partida inteira na tela: parado perde em 24 turnos e a partida encerra;
transferência de renda vence e segue.

## Próximo

Conversar com o autor sobre o que vem depois da 1.0
(plano, seção 9; seção 11 do escopo guarda as ideias). O push do commit e da
tag `v1.0` espera a palavra do autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- A tela é a versão simples: o autor decide o que melhorar primeiro.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.
- A tela só lê/chama `src/partida`; salvar guarda país+semente+estado, as regras voltam do conteúdo.
- Renomear arquivo que o `main.tsx` importa exige `touch src/main.tsx` com o Vite rodando (cache).

---

**01/nov/2026**

## Onde está

**Passo 9 (Eleição e desgaste) fechado em 01/nov; versão 0.4 completa, tag
`v0.4` criada (sem push).**
Desgaste de 2,25 por mandato; a lei `duracao-mandato` (4 ou 5 anos, campo
`mandato_anos` nas opções) define o mandato; no fim dele o apoio (satisfação
pesada por pessoas − desgaste) decide, e perder encerra a partida
(`npm run eleicao`). Os grupos agora medem a renda contra o crescimento
esperado do país: parado, o governo perde por pouco; a transferência de
renda vence.

## Próximo

**Passo 10, Tela:** proposta curta para o autor aprovar. O push do
commit e da tag `v0.4` espera a palavra do autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.
- Grupos medem renda contra o crescimento esperado (`esperado` em `calcularGrupos`); mexer na tendência do país muda a satisfação de todos.

---

**01/nov/2026**

## Onde está

**Passo 8 (Congresso) fechado em 01/nov; versão 0.3 completa (passos 7 e 8),
tag `v0.3` publicada.**
Partidos são do país (`paises/<id>/congresso.json`): cadeiras, grupos que
defendem, governo e coligação. Toda mudança de lei vai a voto; mais de 1/3
da faixa num pedido é exorbitante e cai (`npm run congresso`). Scripts de
economia usam `criarPartida(pais, semente, { semCongresso: true })`.

## Próximo

**Passo 9, Eleição e desgaste:** proposta curta para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `0.6 × 1/3` dá 0,1999… no computador: comparação de limite precisa de folga.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

---

**01/nov/2026**

## Onde está

**Passo 7 (População e grupos) fechado em 01/nov.** 6 pops com renda pelo
motor (`npm run pops`); 4 grupos (trabalhadores, classe média, empresários,
ambientalistas) com satisfação, radicais e lealistas (`npm run grupos`).
Cada lei declara no JSON o que cada grupo quer dela. Versão 0.3 fecha com o
passo 8.

## Próximo

**Passo 8, Congresso:** proposta curta (o que entra, o que fica de fora, uma
decisão) para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 7 (População e grupos), parte 7a feita:** 6 pops (lista aprovada),
renda por pessoa calculada pelo motor (bruta − imposto de renda +
transferência); `npm run pops` confere. Imposto plano; lei de gasto com
`para: { estrato }` vira renda do estrato.

## Próximo

**7b, grupos:** proposta curta dos 4 grupos (quem forma cada um, o que
cobra, quais leis apoia ou rejeita) para o autor aprovar.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

**Passo 6 (Leis da V1) fechado em 01/nov, versão 0.2** (tag `v0.2`). 14 leis
conferidas por script; o país declara só as leis que tem; dois países de
teste (`teste` e `teste-pobre`); força dos efeitos 2/5/10.

## Próximo

**Proposta curta do passo 7 (População e grupos)** para o autor aprovar:
ler só a linha do passo 7 no plano e no escopo (seção 6). Espera o autor.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passo 5 (Contas) fechado e no GitHub. **Passo 6 (Leis da V1)**: 6a, 6b,
6c-0, 6c e 6d feitos; `npm run check` verde.

- 14 leis (impostos, gasto, pena de morte, 6 ambientais); o país declara só
  as leis que tem.
- 6d: força dos efeitos 2/5/10 pontos (era 1/3/6); segundo país
  `teste-pobre` só em JSON; `npm run paises` joga os dois.

## Próximo

Autor confere `npm run paises` e aprova **fechar o passo 6** (plano e escopo
com ✅, tag v0.2). Depois, abrir o passo 7 (Grupos) com proposta curta.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- Importar um script de outro script imprime a saída dele: não importar `mandato.ts` em outro script.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Passos 2b, 3 e **4 fechados: versão 0.1** (um mandato jogado por script),
com tag `v0.1` e enviada ao GitHub.

- `src/motor/turno`: `avancarTurno(regras, estado, pedidos)`, 10 etapas;
  as vazias pulam (`turno.md` diz o que cada uma faz hoje).
- `src/motor/efeitos`: força fraca/média/forte = 1/3/6 pontos, **tamanho
  inteiro** do efeito, que chega em linha reta ao longo do atraso.
- `src/motor/acaso`: semente no estado; mesma semente, mesma partida.
- `src/conteudo/paises/teste/`: país inventado (pico 0,5).
- `npm run mandato`: IR 10/30/50% → arrecadação sobe, padrão de vida cai.

## Próximo

**Passo 5, Contas**: proposta curta para o autor aprovar
(receita − gasto − juros → dívida; juros sobem com a dívida).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow) nem passa o arquivo no `argv`; script que também é importado por teste usa `import.meta.env.MODE !== "test"`.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.
- `git add docs` pega `docs/jogo/interface/mapa-em-tres-aneis.md` (não mexer): adicionar arquivo por arquivo.

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Onde está

[Escopo](docs/jogo/escopo.md) e [plano](docs/jogo/plano-de-desenvolvimento.md)
aprovados; passos 2b e **3 fechados**.

- `src/motor/estado`: ids dos índices essenciais.
- `src/motor/calculos`: registro de bases com `renda` (Laffer + evasão; o
  **país declara o pico**, padrão 0,6; fonte em `calculos.md`).
- `src/motor/leis`: tipo da lei e validador (erro com arquivo, campo, motivo).
- `src/conteudo/mundo/leis/`: `imposto-renda.json` e `pena-de-morte.json`.
- Contrato em `src/partida/conteudo.test.ts`: toda lei nova é validada sozinha.

## Próximo

**Passo 4, Turno mínimo:** proposta curta para o autor aprovar (turno,
fila de efeitos com atraso, acaso com semente, país de teste e
`scripts/mandato.ts`). Decisão em aberto para propor: quanto vale em número
cada força (`fraca`, `media`, `forte`).

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
- `vite-node` não roda arquivo fora do projeto (fs.allow); demo temporária vai em `rascunho/` e sai depois.
- `import.meta.glob` precisa de `src/vite-env.d.ts`.

---

**31/out/2026**

## Recomeço do mundo

Leis, índices, consequências, dilemas e eventos **apagados** para refazer do zero.
O jogo não roda até o mundo novo existir (de propósito).

Backup: tag `mundo-antigo-2026-10-31` e `arquivo/mundo-antigo-2026-10-31/`.

## Próximo

1. Escrever os índices novos (lista aprovada abaixo) em `src/conteudo/mundo/indicadores/`.
2. Modelo de lei: efeito declarado em unidade humana; o motor converte (sem a armadilha do ÷3).
3. Contas essenciais em TS só com identidades contábeis; o que é de lei ou país vai para JSON.
4. Primeiras leis genéricas, uma por vez, cada uma com o comportamento esperado escrito antes.
5. Adaptar módulos (economia, população, Congresso). Dilemas, eventos e ministros só depois.

## Índices aprovados

- **Essenciais** (física de qualquer país): população, ocupados, desemprego, PIB real,
  crescimento, inflação (nível de preços), PIB nominal, receita, gasto, resultado,
  dívida, taxa de juros.
- **Jogabilidade**: padrão de vida, instrução, industrialização, saúde, segurança,
  pobreza, desigualdade, corrupção, liberdades, polarização, meio ambiente,
  reputação internacional, aprovação; por grupo: satisfação, radicais, lealistas.

## Ainda aponta para o mundo antigo (refazer junto)

- `src/conteudo/mundo/`: bussola, gatilhos, pressao, populacao, reguas, congresso.
- `src/conteudo/paises/brasil/`: estado inicial e níveis das leis antigas.
- 57 ids citados em `src/game/` e `src/app/`.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)).

Feito: PIB nominal consertado (setas `*--pib-nominal` com coeficiente 0,01 → 0,25;
estava 25× fraco). Agora 12,8 → 16,3 mi em 24 turnos (+28%).

Mesmo assim os dois seguem iguais (24 turnos, semente 7):

|               | Mujica      | Bolsonaro   |
| ------------- | ----------- | ----------- |
| Satisfação    | 47,5 → 44,9 | 47,5 → 44,6 |
| Dívida        | 79,6 → 95%  | 79,6 → 101% |
| Bússola final | (0,1; −3)   | (1,2; −0,1) |
| Eleição       | venceu      | venceu      |

Próximo suspeito: **o programa do Bolsonaro em `src/conteudo/bussola/programas.json`**.
As 16 leis chegam todas ao alvo (8 já valiam, 8 passaram, nenhuma caiu), e mesmo assim
a bússola para em (1,2; −0,1), longe de (7,3; 7,7). Não é o Congresso: é o programa
fraco ou o peso das leis na bússola.

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (~6 min).

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)). Passo 2: descobrir por que o
PIB nominal não cresce (12,03 → 12,15 mi em 24 turnos com ~5% de inflação; esperado ~+22%).

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (24 turnos, ~6 min).
Hoje: satisfação 44,4 × 44,5, dívida 97 × 105%, os dois vencem a eleição.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Bolsonaro aprova só 8 leis e a bússola para em (1,2; −0,1), longe de (7,3; 7,7).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

A economia vai ser redesenhada e é a próxima frente. Antes de código, o autor diz o
que está errado ou faltando nela; depois, proposta curta no chat.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026` (juros), `cooperacaoInternacional`: economia, voltam com a economia nova.
- `gabinete` (ministro sem grupo leal com 25 grupos): ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Não joguei uma partida na tela até a eleição depois do turno de 2 meses.
- Esperando o autor: industrialização (índice ou setores), mídia na V1, estado dos grupos.

## Jeito de trabalhar (combinado em 31/out)

- Toda rodada fecha um item, interno ou visível.
- Nada de teste em mecânica que ainda vai mudar.
- Ideia nova vira uma linha no fim do PLANO; o mapa não é reescrito.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.

---

# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 31/out/2026 (mapa das mecânicas refeito em fases; próximo: Fase 0, base verde).**

## Mapa refeito em fases (31/out)

O autor pediu um plano em que **preencher o JSON de todas as leis = V1 pronta**. O [mapa das mecânicas](docs/jogo/mecanicas/mapa-das-mecanicas.md) agora vem em fases:

- **0. Base verde**
- **1. Contrato da lei e verificador**
- **2. Sistemas que leem o contrato:** economia fechada, a lei vira motivo, estado dos grupos, partido e fim de jogo, feed
- **3. Preenchimento**
- **4. Calibragem e acabamento**

O mapa tem também uma tabela das técnicas adotadas: núcleo isolado, passo fixo, orientado a dados, módulos que se falam por estado e tags, grafo com verificação, economia fechada e máquina de estados.

O PLANO aponta para essa ordem ("Ordem em vigor"). Os 48 efeitos em reais fixos deixaram de ser edição à mão: viram regra única no carregamento das leis (Fase 1).

**Esperando o autor:**

- Industrialização: índice simples ou setores?
- Mídia na V1?
- O estado dos grupos entra?

**Próximo:** Fase 0, que é acertar os 11 testes que falham (lista abaixo) e jogar uma partida na tela até a eleição. Na mesma rodada, propor no chat o contrato da lei (Fase 1).

## Estado em 31/out, fim da rodada

**Commits locais, sem push (só com a palavra do autor):** `959d89cc` população, `b20e435c` regra da lei no mapa (J2), `b0d73e87` formatação e lint, `2c0226d0` cache do `pacoteVivo` por memória, e o do tempo limite dos testes lentos de ocorrências. Fora de commit, por decisão do autor: `PLANO.md` (modificado), `arquivo/`, `docs/jogo/interface/mapa-em-tres-aneis.md`.

**`npm run check` (~36 min):** formato, lint e build passam. 14 testes falharam; 3 eram da população (lint/teste, corrigidos) e **11 falham igual no commit `53f77220`, antes da população**: `contasSemFuros` A1 e A2, `brasil2026` (juros), `fichaV3`, `mesaDoSalarioMinimo`, `cooperacaoInternacional`, `natalidadeNatalidade`, `saudeMortalidade`, `partida.test.ts` (2 de prévia), `previdenciaTransferenciaSeparada`. Causas por descobrir, em outra frente. `pisosVinculados` passa sozinho (92 s); o estouro no check veio da carga.

**Custo por turno:** gargalo era o cache do `pacoteVivo` derrubado por quem lê sem memória. Agora 1,70 s por turno contra 0,97 s antes da população (era 2,21 s). Sobram 6 montagens por turno (eram 3). Cortar mais = cache por conteúdo ou passar o pacote pronto entre os passos do turno, pedido de refatoração separado (anotado no PLANO). Por isso `ocorrencias.test.ts` (2 testes) e `ocorrenciasVariedade.test.ts` ganharam tempo limite de 240 s e 300 s; passam em 115 s e 180 s.

**Depois do check (31/out):** commits `e0698104` (ex-informal desempregado faz bico, 40% da renda da faixa), `5f112e57` (seguro-desemprego acaba com o tempo: 5 meses, corte linear de 1× a 2× pela memória da coorte) e o dos **4 grupos novos** (`grupo_centro`, `grupo_fora_do_mercado`, `grupo_metropoles`, `grupo_outras_religioes`; valores iniciais 48/50/47/52, ligações e efeitos de lei copiados dos grupos análogos por `scripts/populacao/ligacoes.ts`, que agora grava `efeitos` na lei e aceita filtro por segmento: `npm run populacao:ligacoes -- grupo_centro`). `pais:ancorar` **não** foi rodado inteiro (ajuste antigo mantido, mais 4 novos). Seis leis sem ligação para copiar ficam sem efeito no grupo: regra-fiscal, valor-da-meta-de-inflacao, taxa-basica-de-juros (centro); vagas-de-creche, quem-cuida-do-idoso-dependente (fora do mercado); policias-dos-estados (metrópoles). Teste: `populacao.test.ts` 13 verdes, censo 26. **Não vi na tela do app** (fluxo exige chapa e 11 ministros), só por script. A suíte inteira depois dos 4 grupos não tinha fechado quando escrevi isto: conferir contra as 11 falhas antigas.

**Próximo (substituído pelo mapa em fases, acima):** ~~resto da J5, depois J14~~. Pontas antigas: 47 efeitos em reais fixos (`normalizacao`); `transparencia_fiscal_internacional` sem lei; `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria" (não rodar sem checar).

## População J5 (31/out): passos 1, 2 e 3 feitos (falta a causa da memória)

Visão do autor: a população é uma IA de jogo (não LLM), módulo independente; cada pessoa pensa e lembra. Leis e economia falam com ela por tags e índices, sem nome de lei. **Feito (commitado em `959d89cc`):** (1) `game/congresso/motivos.ts`: satisfação = 50 + soma de motivos (`grupo`, `bolso`), produtores em lista; (3, só a mecânica) `game/congresso/pessoas.ts`: `pessoaDaChave` sorteia uma pessoa de um perfil por peso, nome e idade fixos pela semente, guarda em `EstadoDoCongresso.pessoas` (salvar e carregar, opcional) e devolve a mesma no segundo clique; `opiniaoDaPessoa` dá os motivos ordenados. A rede social (J14) só entrega a chave do post e passa os nomes de `eleicao.json`. Bússola ganhou a aba **População** (nuvem dos perfis, % por quadrante; `populacao` em `VisaoBussola`). Visto na tela. Testes: `motivos` 3, `pessoas` 4. **Passo 2 feito:** `Motivo` leva `tags`; memória de coorte do desemprego (`game/congresso/memoria.ts`, `EstadoDoCongresso.memoria`, atualizada em `passarTurnoNoCongresso` com `fracoesDeDesemprego` de `vivo.ts`) vira o produtor `memoria` (gratidão de quem voltou a trabalhar, desalento de quem espera há meses), parâmetros em `mundo/congresso.json` (`memoria`, chutes a calibrar). `pacoteVivo(content, valores, memoria?)`: a memória entra na chave do cache; passada em `passarTurnoNoCongresso`, `retratoDoCongresso`, eleição e nas telas da bússola, carisma e visão. **Não passada** (só usam pesos, não satisfação): `aprovacaoViva`, `pedidos`, `tramitacao.chancesDoProjeto`, `contas`, `prepareGameQuarter`. Também consertado: `passarTurnoNoCongresso` perdia `pessoas` no turno de troca-troca. Testes: `memoria` 6. Não há tela da memória (ela aparece na opinião da pessoa sorteada, J14). **Falta:** a causa (por tags ou índices, depende do módulo das leis), seguro e renda de bico do ex-informal. Faixas sem grupo na tela: feito (4 grupos novos, ver acima). **Lei como produtor de motivo (J2):** a lei incomoda quem ela afasta do ponto dele na bússola (distância do ponto do país ao da pessoa, antes e depois), mesma régua do voto do Congresso.

## Mapa das mecânicas refeito (30/out), substituído pela versão em fases de 31/out

`docs/jogo/mecanicas/mapa-das-mecanicas.md` agora é dividido em três partes: Motor (MO1–MO5), Jogo e conteúdo (J1–J13) e Interface (I1–I6). Há uma tabela com a numeração antiga M1–M13. Conferido no código: o motor está pronto. O "proporcional ao PIB" se faz com variável `derivado` (soma de produtos), sem código novo. A exclusão entre leis é regra do jogo (`validatePolicyAction.ts`). O teto de 4× é da tela (`Documentos.tsx`). **Frente escolhida pelo autor: J3 Economia**, que é só conteúdo, para poder pôr e tirar leis econômicas e equilibrar depois. **Motor fechado depois de rodar os testes:** 54 arquivos que usam o motor, 309 de 311 verdes, `tsc -b` limpo. As 2 falhas (`brasil2026`, `fichaV3`) são contas escritas para o turno de 3 meses. Os achados estão no PLANO, em "Achados da conferência do motor (30/out)": 47 efeitos em reais fixos em 11 leis de verba (a correção é só JSON) e `transparencia_fiscal_internacional` sem lei que a mova. Próximo passo: propor por onde começar a J3.

## Mapa em três anéis (30/out), passo 1 feito; faltam 2 e 3

Doc: `docs/jogo/interface/mapa-em-tres-aneis.md`. **Passo 1:** índices e situações (174) ficam em 2 a 5 anéis elípticos (`posicionarIndices` em `ui/mapa/layout.ts`), cada um no lugar livre mais perto do ângulo médio das áreas dele (desvio máximo 35°, teste novo). `relaxar` e `desembaracar` saíram. **Desvio do doc:** dois anéis não cabiam (medido: 111 de 174 com rótulo), então a caixa reservada no anel é só o nó (`caixaDaBolha()`, `raioBolhaReservado` 48) e o nome só aparece com zoom ≥ 1 (`ZOOM_DO_NOME`), em letra que encolhe no mundo, ou no foco. `espalharNoAnel` serve aos grupos. Visto na tela (visão geral e zoom, sem erro de console); **foco numa lei e num índice ainda não conferi**. Próximo: passo 2 (linhas só no foco), esperando o autor.

## Diagnóstico "o jogo responde?" (30/out), antes de mexer em grafo e dilemas

Scripts em `scripts/diagnostico/` (`vite-node`). Resultados, semente 4, 12 turnos:

- `mundo-responde.ts`: jogador parado × tudo no máximo × tudo no mínimo. ~4 ocorrências por turno, mas só 2 dilemas em 12 turnos; o resto é aviso de pressão de grupo (21 a 32), evento solto e fake news. 72 de 91 dilemas têm só sorte pura (~1% por turno).
- `uma-lei-por-vez.ts`: jogador normal mexe em UMA lei (17 leis amostradas). **A lei move bastante coisa**: 16 de 17 mudaram de 6 a 51 das 195 bolhas do mapa; só `regra-de-repasse` não mexeu nada (também serve de controle: sem efeito, não há ruído de sorte). Ou seja, o problema não é "nada se move" e sim "o que se move não vira dilema/evento sentido".
- Próximo (decidido pelo autor): olhar **bolha por bolha** e entender as leis de cada uma (M2.6), conforme o veredito acima.

## M8 em curso: fatia A feita, faltam B, D e a promessa

**Fatia A (29/out):** a partida tem vice e um ministro por área do governo (as 11 áreas de `politica.json`, `game/eleicao/chapa.ts`). A primeira tela escolhe presidente, vice e ministros (aba por área, `Gabinete.tsx`), com o botão "Sortear ministros": 2/3 saem o mais perto do ponto médio da chapa, 1/3 de fora (cota de coalizão). O que ficar vago o jogo sorteia na posse. Na eleição (turno da escolha) o partido vê novos vices e ministros e decide manter ou trocar; a troca vale se vencer (`chapaNova` em `EstadoDaEleicao`). O limite de mandatos segue o `limiteDeMandatos` do país (a lei estender ou encurtar ainda não existe). Testes: `eleicao.test.ts` 16, `tsc -b` limpo. **Visto na tela** a primeira tela (escolher, sortear, tomar posse, sem erro de console); **a troca de chapa dentro do tablet da eleição não foi vista na tela**, só por teste.

**Conserto da tela (29/out, `d423764c`):** a primeira tela rola e vem em dois passos (chapa; depois ministros). Visto na tela.

**Fatia B (29/out), popularidade do ministro:** `game/gabinete.ts`. A nota de cada ministro é a satisfação média dos 3 grupos mais perto do ponto dele na bússola (o ponto do grupo é a média dos perfis de eleitor), pesada pelo tamanho. Não é guardada: sai do estado, e como a satisfação já vem do aquecimento, nasce calibrada pelo país (decisão do autor: nada de 50 para todos). A média das notas, fora de 50, ×0,1 com teto ±4, soma em todos os grupos em `prepareGameMonth` (popularidade do motor) e em `valoresComReacao` (eleição e Congresso). Tela: seção "Gabinete" no tablet da Eleição (cargo, nome, nota, grupos leais). Testes: `gabinete.test.ts` 3, `gatilhos.test` ajustado (sem gatilho **e sem gabinete** os valores são os do motor), `eleicao`, `camadas`; `tsc -b` limpo. **Visto na tela** (notas de 34% a 54%, sem erro de console). **Pesos (0,1 e ±4) são chute.**

**Fatia D, passo 1 (30/out), lealdade exclusiva:** `gruposLeais` agora reparte os grupos: cada grupo é leal a um só ministro, fechando primeiro os pares (grupo, ministro) mais perto na bússola, com cota de ⌈grupos ÷ ministros⌉ por ministro (2 com 21 grupos e 11 ministros). Motivo: só com "o mais perto", um ministro levou 19 dos 21 grupos, porque os ministros nascem juntos na bússola. Ministro sem grupo leal teria nota neutra (50), mas a cota garante ao menos 1 cada. Visto na tela (1 a 2 grupos por ministro, notas de 35% a 60%). Limite: os ministros nascem sem ligação com a área, então "Saúde" pode ficar com Ricos e Classe média; a ideologia dele vem do sorteio da chapa. Se incomodar, o ponto do ministro deveria puxar para o lado típico da área.

**Decisões do autor (29/out):** a cada eleição o jogo pergunta se mantém ou troca; passados 2 mandatos seguidos a troca é obrigatória, se a lei assim mandar. Ministro é o da bolha (um por área), no centro dela. O Senado só olha a lei, não a popularidade do ministro. Grupos são leais ao ministro pelo lado ideológico dele (conta, não sorteio).

**Fatia D, passo 2 (30/out), ministro porta-voz:** `game/pedidos.ts` (puro) e `app/partida/pedidos.ts`. Por turno, cada ministro pode trazer um pedido (chance 2% + 2% × articulação, dobra se a nota dele está abaixo de 45); no máximo um por turno, e o que ninguém respondeu caduca no turno seguinte. O pedido é a opção de uma lei da área dele (`ESTRUTURAS[país].ministerios`) mais alinhada com o ponto médio dos grupos leais (produto escalar com o vetor da bússola), nunca a que já vale nem lei na fila. Aceitar chama `mudarLei` (vai ao Congresso se a lei pede) e dá +3 de satisfação aos grupos leais; recusar dá −3. O favor fica em `election.favores`, decai pela metade por turno e entra por `pontosDoGabinete` (popularidade do governo e eleição). O Senado só vê a lei. Tela: seção "Pedido do ministro" na Eleição do tablet, com Aceitar e Recusar. Testes: `pedidos.test.ts` 2; `gabinete`, `eleicao`, `gatilhos`, `camadas` seguem verdes. Visto na tela (pedido no 1º turno, Recusar respondeu). **O "e depende…" do autor ficou cortado:** pus como dependências a articulação do ministro e a insatisfação dos grupos dele; ajustar se era outra coisa. Limites: a nota do ministro (`notasDoGabinete`) não lê o favor; os pesos (3, 2%, 45) são chute.

**Promessa contra ação (30/out):** `game/promessa.ts`. O lado que o presidente quer é o do ponto dele na bússola em relação ao `compass.inicio`; se o ponto atual do governo andou ao contrário nesse eixo, a soma do caminho contrário, acima de 1 ponto de tolerância, tira 0,5 de satisfação por ponto de todos os grupos (teto 4). Não cumprir o que prometeu (ficar parado) não pesa; só o caminho contrário. Entra junto com o gabinete por `pontosDoGoverno` (motor em `prepareGameMonth` e `valoresComReacao`). Tela: frase na Bússola, em "Como o seu governo está sendo visto", só quando pesa (sem mostrar o lado do presidente). Testes: `promessa.test.ts` 2; `gabinete`, `gatilhos`, `camadas` verdes. Visto: Bússola abre sem erro e sem a frase no começo; **a frase em si não vi na tela** (só no teste). Limites: usa o ponto do presidente, não as frases dele; os números (1, 0,5, 4) são chute.

**Carisma vivo (30/out):** `game/carisma.ts` + `app/partida/carisma.ts`; `EstadoDaEleicao.carismaViva` (desvio ±1,5), 20% por turno rumo ao alvo (satisfação média ±30 e promessa quebrada); vale no voto do presidente que concorre (`candidatosDaEleicao`) e na ficha. Reinicia com presidente novo. Chutes: 1,5 / 20% / 30 / 0,5. Falta o lado dos ataques da mídia (M13). Teste `carisma.test.ts`.

**Turno de 2 meses (30/out):** `MESES_POR_TURNO=2`, mandato de 24 turnos, `turnosDoConteudo`/`chanceNoTurno` em `calendario.ts` convertem o conteúdo escrito em trimestres (implantação, intervalos, janelas, chances, investigação, pedidos). Congresso `turnosPorAno` 6, pesquisas e escolha da eleição reescaladas. Falta conferir na tela e rodar a suíte; próximo: M9.

**M9 fatia A (30/out):** cada projeto da fila mostra a chance de sim de cada bancada e o motivo que mais pesa; seu partido em dourado. Não vi a fila na tela (só o plenário); teste em `tramitacao.test.ts`. **Fatia B (30/out):** cada votação feita guarda o motivo de cada bancada (`porBancada.motivo`) e o tablet mostra em "Por que cada bancada votou assim"; não vi na tela. `tramitacao.test.ts` 23/23 (a falha antiga foi carga). **Quem mudou de lado:** a votação guarda a `chance` da bancada; o tablet marca "mudou de lado" quando o voto da maioria contraria o lado esperado (chance ≥ 50%). Não vi na tela. **Pétrea (fatia D):** `enviarAoCongresso` numa pétrea não muda a lei nem entra na fila; as bancadas perdem `humor.petrea` (-10) e cada grupo perde `petreaNaPopulacao` (4 pontos, via `favores`, que decaem à metade por turno); a tela avisa. Constantes chutadas. Não vi na tela: o tablet das leis pode travar a pétrea (cadeado) antes de chegar aqui. **Plenário fiel (fatia E):** a legenda de cada casa mostra a disposição de cada bancada com o governo (de bem ≥55, de mal ≤45, neutra), vista na tela. Falta: conferir a pétrea e a fila na tela. Teste `ocorrencias` "mesma semente" estourou 120 s com a máquina carregada (lentidão, rodar sozinho).

**Ordem do autor (30/out):** ministros são tempero (não mexem na jogabilidade) e ficam para o final; não abrir item deles até ele chamar. O jogo ainda não é desafiador nem aceitável como jogo depois de escolher a chapa: essa é a prioridade.

**Falta, na ordem:** M13 Mídia (ataques entram no carisma). O ministro hoje só tem ficha e opinião; a gestão dele ainda não mexe na eficácia das leis. 3 testes (`contasSemFuros` ×2, `ocorrenciasVariedade`) estouram tempo por lentidão, não por asserção; a decidir antes da calibragem.

**Atualizado antes em 29/out (M7.3, grupos reagem aos gatilhos, feita).**

## Grupos fechado (30/out), pushado

Tudo na `main` e pushado (`f74f0849`; depois dele, itens 2, 4 e 5 até `b1a8596a`). Passos feitos hoje: (1) o bolso entra na satisfação do perfil (±10, só eleição e Congresso); (2) `pacoteVivo` usa o eleitorado inteiro vivo (emprego, renda, valores, religião), em cache por turno; (3) radicais e lealistas na tela (topo do painel Eleitorado e em cada grupo); (4) desempregado com ponto de economia. Limites (13) a (17) no PLANO, item 3. Visto na tela: "aprovação 45% · 11% contra · 6% a favor" e a mesma linha em cada grupo, sem erro de console.

**Check (30/out):** `npm run check` rodou: 649/650, a única falha era `camadas.test` (UI importava `game/congresso/polarizacao`; corrigido pelo re-export em `app/partida/tipos.ts`, teste agora verde).

**País em frases fechado (30/out):** a Informalidade mostra "38,6%" e "Em % de ocupados informais" (`jaEPorcento` em `formatos.ts`; teste em `medida.test.ts`; visto no boletim).

**Item 4 fechado (30/out):** `taxa_mortalidade` virou calculado, com seta de `saude_populacao` (coef −0,3, termo 29,62, atraso 1; neutra no início). Pandemia agora mata (+3‰). Mexer no coeficiente pede refazer o termo (o motor não escala o termo pela população). Falta o `npm run check`.

**Item 5 fechado (30/out):** `taxa_natalidade` virou calculado, com seta da fecundidade (`natalidade`, coef 0,2446, termo 6,115, atraso 1; neutra: 12‰). Política de natalidade intensa agora sobe a taxa e a população. `populacaoEmPessoas.test` ajustado (natalidade e mortalidade são calculadas; o teste as derruba a cada turno).

**Check dos itens 2, 4 e 5 (30/out):** passou, 652/652, e foi pushado (`b1a8596a`). O 1º check achou 4 falhas: o país mínimo declarava `taxa_natalidade`/`taxa_mortalidade` (D-41, calculada não leva valor no país) e as duas variáveis estavam sem `medida`. Corrigido (`conserto: taxas … com medida`). Coeficientes de natalidade e mortalidade são chutes, a calibrar.

**Piso do salário mínimo fechado (30/out):** carteira e servidor ganham no mínimo o salário mínimo da lei (`bolso.piso` + `seguePiso` em `mundo/populacao.json`, lido em `game/congresso/bolso.ts`). Neutro no início; só sobe. Visto por script (`scripts/teste/piso-minimo.ts`: com o mínimo em 100%, carteira pobre vai de R$ 1.862 a R$ 2.468/mês); **não visto jogando na tela** (a lei do mínimo exige criar partida e votar). Testes: `bolso.test` 33 e `bolsoNaSatisfacao.test` 4; `tsc -b` limpo. Falta `npm run check` e push.

**Check do piso (29/out):** passou, rodado pelo autor em outra sessão. Falta o push (só com a palavra do autor).

**Reorganização (29/out):** o jogo agora é mapeado por mecânicas e submecânicas em `docs/jogo/mecanicas/mapa-das-mecanicas.md` (proposta; o PLANO ainda não foi remanejado). Ordem: M7 primeiro; M2 por último (motor antes, conteúdo lei por lei no fim, com a calibragem).

**M7.1 feita (29/out):** a `popularidade_governo` agora lê o eleitorado vivo (emprego, renda, valores, religião e bolso), o mesmo da eleição. O motor aceita uma `approval` opcional em `advanceExecution` (`ProfileApproval.perfis[].ajuste` = bolso); o jogo a monta por mês em `prepareGameMonth` com `aprovacaoViva` (`game/congresso/index.ts`). Turno 0 não muda (45%). Testes: `aprovacaoViva.test.ts` 4, mais `paisV1`, `tramitacao`, `jornal`, `mesaDoSalarioMinimo`, `populacao`, `gruposSociais`, `camadas`; `tsc -b` limpo. Visto na tela: turno 0 em 45%, um turno encerrado sem erro de console (a queda a 41% veio junto com uma ocorrência de escândalo, então não prova a M7.1 sozinha). **Falta `npm run check`** (só ao fechar a M7 inteira). O limite (13) do PLANO ("a aprovação do motor não lê o bolso") deixou de valer. Sem remanejar o PLANO ainda.

**M7.2 feita (29/out), gatilhos:** `mundo/gatilhos.json` define 11 gatilhos (corte e expansão de gastos, agenda de mercado, estatista, conservadora, liberal nos costumes, social, linha dura, verde, pró-trabalhador, reforma constitucional). `game/gatilhos/index.ts` os liga a partir do `history` de cada lei (mudança de meta nos últimos 4 turnos, mínimo 3) e do caminho da bússola (rumo ≥ 0,3 em 4 turnos); nada é guardado no estado. A Bússola mostra "Como o seu governo está sendo visto". Testes: `gatilhos.test.ts` 14, `tsc -b` limpo. **Visto na tela só o estado vazio** (turno 0, sem erro de console); a ativação está provada por teste, não jogando. Limiares (3 em 4, 0,3) são chutes, a calibrar. **M7 fechada (29/out), `npm run check`:** formato, lint e build passaram; nos testes, 20 de 122 arquivos rodaram até eu parar (~31 min) e 5 testes estouraram tempo por carga (`contasSemFuros`, `ocorrencias`, `ocorrenciasVariedade`, `pisosVinculados`); `pisosVinculados` passa sozinho e leva o mesmo tempo sem a M7. O restante da suíte não foi rodado; autor aceitou assim. **Eleição e Congresso leem a reação (29/out):** `valoresComReacao` (`app/partida/bussola.ts`) soma a reação dos gatilhos à satisfação `grupo_x` (0 a 100) e é o que `passarTurnoNaEleicao`, `renovarCongresso`, `passarTurnoNoCongresso` e `retratoDoCongresso` recebem como `valores`; devolve o mesmo objeto enquanto a reação não muda (o eleitorado vivo é guardado por valores). Testes em `gatilhos.test.ts` (27). **Gatilhos fiscais feitos (29/out):** `arrocho-fiscal` e `farra-fiscal` (regra `fiscal`: resultado fiscal andou ±2,5 pontos do PIB em 4 turnos). O `caminho` da bússola passou a guardar `resultado` por turno (campo opcional, saves antigos não ligam nada). Dívida não é guardada: nenhuma regra a usa. São 13 gatilhos; `gatilhos.test.ts` 24 verdes, `tsc -b` limpo; `scripts/teste/gatilhos-fiscais.ts` mostra o resultado guardado (sem mexer nas leis o déficit só anda ~0,27 por turno, então não liga sozinho; limiar 2,5 é chute). `npm run check` só ao fechar a M7 inteira.

**M7.3 feita (29/out), grupos e frases reagem aos gatilhos:** cada gatilho em `mundo/gatilhos.json` ganha `reacoes` (grupo, pontos de satisfação, frase e, opcional, `areas`: só reage se a decisão caiu nelas). O corte e a expansão de gastos dependem da área: corte na saúde derruba pobres e periferias, em educação derruba jovens e famílias com filhos, na defesa os conservadores. Os pontos mexem na satisfação do grupo na tela (`gruposDaPartida`) e na popularidade do motor (`aprovacaoViva(content, valores, reacoes)`, via `prepareGameMonth`); somam por grupo com teto de ±8. A fala do grupo no jornal vira a frase da reação, e o jornal ganha a linha de leitura da imprensa (neutra sem gatilho). Testes: `gatilhos.test.ts` 20, mais `aprovacaoViva`, `jornal`, `gruposSociais`, `camadas`; `tsc -b` limpo. Script: `scripts/teste/gatilhos-na-tela.ts` (liga o corte à mão). **Visto na tela só o estado sem gatilho** (frase neutra no Jornal, sem erro de console); a reação está provada por teste e script. **Limite:** a eleição e o Congresso (`pacoteVivo`) ainda não leem a reação, só a popularidade e a tela; pontos (±3/±4, teto 8) e as ~70 frases são chutes, a calibrar e revisar na revisão de texto. **Falta `npm run check`** (só ao fechar a M7 inteira).

**Próximos itens (não abrir sem perguntar):** antipartido/desgaste.

## (histórico) Os quatro achados da camada B, corrigidos em 29/out

- **Aposentadoria × reajuste:** o benefício agora é valor médio × `nivel_reajuste_de_beneficios`/100 (tabela: campo `reajuste`). Na tela, aposentado sobra R$ 2.343/mês, abaixo de carteira e servidor, e a lei de reajuste mostra "aposentados, R$ 631 a mais".
- **Imposto sobre consumo:** a arrecadação do motor é dividida entre todos que consomem (benefício incluso). A soma dos perfis fecha com a arrecadação (razão 1,000000, teste novo).
- **Lucros:** empresário, agro patronal e pequeno empreendedor (`capital: true`, sem salário) repartem `lucros`; pagam também renda de empresas e dividendos. Os lucros fecham (teste novo).
- **Quem pagou:** `quemPagouAConta` agora agrega por ocupação × renda e mostra as 6 faixas que mais sentiram.
- Testes: `bolso.test.ts` 22 e `censo` + `treemap`, 38/38; `tsc -b`, eslint e prettier limpos. **`npm run check` completo ainda não rodou sobre estas correções.**

**Calibragem aberta, não é bug:** empresário sobra R$ 95 mil/mês e agro patronal R$ 89 mil, porque `lucros` (6,8 mi contra 3,6 mi de salários) é repartido por 6,7% do eleitorado. O número vem do motor; vai para a calibragem (item 12 do PLANO).

**Menores ainda abertos:** salário médio negativo sem guarda; `MESES = 12` repetido em três lugares; a prévia compara só o último mês do horizonte; `censoDoPais(content)` sem valores devolve bolso zerado; a parte do eleitorado arredonda para "0%" nas ocupações pequenas.

## Por onde continuar

0. **Fechar a camada C** (revisão e `npm run check`, ver o topo).
1. **Camada C, partes seguintes**: valores, religião. A renda pela sobra está feita (30/out, só leitura): `app/partida/rendaViva.ts` move peso entre pobre/média/rica quando a sobra do perfil, em salários médios, muda desde o turno 0 (`GameState.valoresIniciais`, novo e opcional). Uma faixa por vez; só o censo usa, a eleição e os grupos não. Script: `scripts/teste/renda-viva.ts`. Visto na tela só no turno 0 (sem variação); o movimento está provado por teste e script, não jogando. Limite: a distância entre faixas é a das médias do início, e o rico quase não se move (chute de direção, calibragem).
   **Valores e religião feitos (30/out, só leitura):** `app/partida/faixasVivas.ts` move peso entre faixas por fluxos declarados em `mundo/populacao.json` (`mudancas`), pela pressão do país desde o turno 0. Valores: segurança, escolaridade, desigualdade. Religião: fluxos diretos entre as três (católico e sem religião → evangélico; católico e evangélico → sem religião). Solto de propósito, a calibrar. Visto na tela só no turno 0; movimento provado por teste e por `scripts/teste/valores-vivos.ts`. **A camada C está completa.** O `npm run check` completo roda só quando o Grupos inteiro terminar.
2. **Ligar o bolso na satisfação** (hoje ele só aparece na tela, decisão de
   29/out). Tem desenho próprio; mexe no que já está calibrado.
3. (feito) Ponta solta da Informalidade.
4. (feito) Saúde → mortalidade. 5. (feito) Natalidade.

## O que fechou nesta rodada

**País em frases** (fase 3): a bolha diz como está em vez de mostrar pontos do
motor. 55 das 192 falam; o resto cai no número, de propósito.

**Censo da população** (Grupos, camada A): a aba População, uma ficha por
atributo — pizza até seis faixas, treemap acima disso. Duas telas foram
descartadas antes por não se lerem (lista de barras, cem bonecos).

**Bolso e ocupação** (Grupos, camada B): cada perfil tem renda, imposto,
benefício e sobra, repartidos dos agregados que o motor já calcula. O censo
mostra quanto sobra por faixa, e a lei diz no bolso de quem ela bate.

## Decisões desta rodada, para não refazer a conversa

- **O agregado manda, o perfil divide.** A economia continua calculando o bolo;
  os 2.090 perfis repartem. A virada para "o perfil manda e o PIB é a soma" (o
  Victoria 3 inteiro) fica para depois e continua barata, porque o bolso guarda
  a **fonte** do dinheiro com nome.
- **Os setores econômicos vão existir** (indústria, serviços, agro). Hoje são só
  nome dentro de ocorrências de lobby; a ocupação segura o lugar deles, e eles
  entram pela fonte sem reescrever a camada B.
- **O bolso só mostra, não mexe na satisfação** — por ora.
- **Faixa escrita se julga jogando**: as frases de Gini, HHI e PIB em índice vão
  para a revisão manual bolha por bolha, lá na frente, não agora.

## Limitação conhecida, que não é bug

O imposto é proporcional: todos pagam a mesma fração do que ganham. O sistema
brasileiro é regressivo no consumo e progressivo na renda. Entra na calibragem
(item 12 do PLANO).

## Ferramentas que ficaram

- `npx vite-node scripts/teste/frases-das-bolhas.ts` — a frase de cada bolha
- `npx vite-node scripts/teste/bolso-dos-perfis.ts` — ganha/paga/sobra por faixa

Foram esses dois scripts que acharam o que os testes não achavam: a fração que
mentia em valores pequenos, e o imposto em 61% da renda.

## Armadilhas do projeto, aprendidas na marra

- **`npx tsc --noEmit` não checa nada aqui** — sai 0 com erro na cara. O projeto
  usa project references: o comando é `npx tsc -b`.
- **Reescrever um arquivo grande com o dev server ligado** pode fazer o Vite
  cachear um módulo vazio e dar tela branca. `Ctrl+Shift+R` resolve.
