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

[Escopo](docs/jogo/escopo.md) e [plano](docs/jogo/plano-de-desenvolvimento.md)
aprovados. **Passo 2b (Fundação) fechado:** pastas `motor/`, `partida/`,
`tela/`, `scripts/`; fronteiras no lint (import proibido quebra o lint,
conferido); `package.json` só com os scripts novos; vitest só em `src/` e
`scripts/`; README, AGENTS, CLAUDE.md e a skill `sisgov-mecanica` apontam
para o projeto novo; `npm run check` verde.

Próximo: **passo 3**, proposta curta do formato da lei (imposto de renda
contínua com base `renda` + pena de morte de opções) para o autor aprovar.

`_lixo/superpowers-antigo/` (336 MB) espera o autor apagar.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- O vitest só procura teste em `src/` e `scripts/`; sem isso roda os testes antigos de `arquivo/` e trava.
