# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**12/nov/2026**

## Onde está

Construindo pela **ordem de construir** de [docs/jogo/requisitos.md](docs/jogo/requisitos.md).
Feitos: 1 a 9 (9 = Começo da partida, commit 6a1ccf4d). Agora o **passo 10: padronizar o visual**,
começando pela barra do topo (NÃO commitado):

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

## Próximo

Esperar o autor dizer onde fica cada coisa que saiu da barra; depois seguir padronizando o visual
(`mapa.css` ainda tem regras velhas da barra, `.chip-dica` e `.aba-topo` são usadas por outras telas).

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
- Classes CSS da tela inicial levam prefixo `ini-` e as da barra `topo-`: o `mapa.css` já tem `.carimbo`, `.selo`, `.nota`
  e outras, e as regras dele vazam.
- Não usar `<main>` fora do mapa: `tela.css` põe largura e margem em `main:not(.area-mapa)`.
- Pacote novo no `package.json` deixa o `npm run dev` aberto com "Outdated Optimize Dep" (página em branco): reiniciar o servidor.
- O servidor do Vite pode servir arquivo novo vazio ou módulo velho: `touch` nos arquivos e recarregar.
- `tsx` não roda scripts com `import.meta.glob`; usar `vite-node`.
