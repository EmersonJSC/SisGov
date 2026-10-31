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
