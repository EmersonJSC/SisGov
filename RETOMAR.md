# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

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
