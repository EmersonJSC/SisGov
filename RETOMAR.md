# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**01/nov/2026**

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
