# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

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
