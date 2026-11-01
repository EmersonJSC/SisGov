# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

## Onde está

Versão 1.0 completa e enviada (`v1.0`). Nova frente, decidida pelo autor:
**a tela passa a seguir o mapa antigo**, no desenho de
`docs/jogo/interface/mapa-em-tres-aneis.md` (vale este, não a esfera que abre).
**Fatia 1 feita:** mapa estático em três anéis na tela (`src/tela/mapa/`):
leis em fatias por área, índices de jogabilidade, grupos. Quatro áreas em
`src/conteudo/mundo/areas/areas.json` (cada área lista os ids das leis).
Layout puro e testado (`layout.ts`); `src/partida/mapa.ts` entrega a estrutura
do mundo (`mapaDoMundo`). Comportamento em `src/tela/mapa/mapa.md`. Falta
commitar.

## Próximo

Fatia 2: **linhas só no foco** (passar o mouse numa lei acende lei → índice →
grupo) e clicar na lei abre a régua para propor o pedido; aí o mapa substitui
a tabela de leis. Proposta curta ao autor antes.

## Pendências do autor

- `_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.
- Decidir depois: mais leis e revogar lei (frente A) vs. seguir só a tela.

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
- O layout do mapa antigo (1400 linhas, `VisaoPartida`) não foi trazido: a ideia veio, o código foi escrito de novo e curto. O antigo está na tag `projeto-antigo-2026-10-31`.
