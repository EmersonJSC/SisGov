# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**12/nov/2026**

## Onde está

Construindo pela **ordem de construir** de [docs/jogo/requisitos.md](docs/jogo/requisitos.md)
(seção "Ordem de construir"). Feitos: 1 Brasil 2026, 2 Fatos do turno, 3 Congresso novo,
4 Mesa mínima, 5 Governo, 6 Programas, 7 Jornal mínimo, 8 Eleição nova (commit b8f24c59) e
**9 Começo da partida** (NÃO commitado):

- `src/motor/pessoas` (`pessoas.md`): gerador de pessoas pela semente (o país declara só nomes em
  `paises/brasil-2026/pessoas.json`; as 81 fichas fixas de `governo.json` saíram), ministros
  sorteados pela chapa, partido do jogador (lado pela bússola da chapa, 6% das cadeiras).
- `src/partida/comeco.ts` (`ComecoDoJogador` em `opcoes.comeco`), `inicio.ts` (dados da tela),
  `perfil.ts` + `mundo/pessoas/perfil.json` (perfil de rede), `paises.ts` (leitura dos arquivos).
  `criarPartida` sem `comeco` continua como antes (o partido do país governa).
- Tela inicial no estilo da Art Bible (`src/tela/inicio/`): abertura, país, partido, chapa com
  fotos 3x4 desenhadas pelo DiceBear (Notionists, sem tom de pele, `tela/inicio/aparencia.ts`), ministérios, termo de posse; lista de pessoas com perfil. Só países com `pessoas.json`
  e `governo.json` aparecem (os de teste ficam de fora).
  A tela do mapa (MapaPolitico, janelas, CSS) será reformulada: não mexer antes.

## Próximo

Commitar o passo 9 (com a palavra do autor), depois o **passo 10** da ordem de construir
(ver requisitos.md). Propor curto ao autor antes de começar.

## Pendências do autor

- Conferir [docs/jogo/codigo-a-conferir.md](docs/jogo/codigo-a-conferir.md) (47 itens; I é o passo 9).
- Decidir o que "programa anda no passo do ministro mais fraco" significa (item 32): hoje é
  esperar 0 ou 1 turno.
- Dívidas: lembrança pesar no voto; perguntar o nome ao refazer programa; Aprovação começar
  alta no começo (R4.9); pessoas envelhecerem e morrerem (R6.6).

## Armadilhas

- Não abrir docs/v1/desenho, docs/referencia, docs/arte/PROMPTS.md, docs/conteudo/rede.md, docs/Exemplos.
- Nada é commitado sem a palavra do autor; `arquivo/`, `public/arte`, `public/demos`,
  `docs/arte/*` e `docs/jogo/interface/*` ficam fora dos commits do passo (a Art Bible
  `docs/arte/direcao-de-arte.md` segue a tela inicial; commitar à parte se o autor quiser).
- Classes CSS da tela inicial levam prefixo `ini-`: o `mapa.css` já tem `.carimbo`, `.selo`, `.nota`
  e outras, e as regras dele vazam.
- Não usar `<main>` fora do mapa: `tela.css` põe largura e margem em `main:not(.area-mapa)`.
- O servidor do Vite pode servir arquivo novo vazio ou módulo velho: `touch` nos arquivos e recarregar.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
