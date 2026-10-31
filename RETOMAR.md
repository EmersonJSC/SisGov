# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Recomeço do projeto

O projeto recomeçou do zero. `src/` tem só os índices novos e um `main.tsx`
de espera; `npx tsc -b` passa.

Backup: tag `projeto-antigo-2026-10-31` e `arquivo/codigo-antigo-2026-10-31/`
(código); tag `mundo-antigo-2026-10-31` e `arquivo/mundo-antigo-2026-10-31/`
(conteúdo); `docs/historico/projeto-antigo/` (PLANO, escopo e mecânicas antigos).

## Próximo

[Escopo novo](docs/jogo/escopo.md) aprovado em 31/out (passo 1 fechado).
[Plano de desenvolvimento](docs/jogo/plano-de-desenvolvimento.md) escrito,
**aguarda o autor** (camadas motor/conteudo/partida/tela, passo de fundação
antes do passo 3). Aprovado, faz a fundação; depois o passo 3 (uma lei
contínua e uma de opções).

Removidas `.codex` e `.agents` (vazias); `.superpowers` (336 MB, rascunhos
antigos) foi para `_lixo/superpowers-antigo/` para o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- `package.json` ainda lista scripts do código antigo (rede, fichas…); não rodam.
