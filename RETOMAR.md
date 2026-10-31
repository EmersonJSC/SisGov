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

Passo 1 do [escopo novo](docs/jogo/escopo.md): **o autor aprovar o escopo**.
Pontos em aberto nele: quantas leis na V1 e a lista de grupos genéricos.
Depois, passo 3: escrever a primeira lei no modelo novo.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- `package.json` ainda lista scripts do código antigo (rede, fichas…); não rodam.
