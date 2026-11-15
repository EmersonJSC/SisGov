---
name: sisgov-mecanica
description: Use when working on any SisGov mechanic, law, indicator, budget line or economy number — before grepping the repo to find where something lives or how the engine reads it.
---

# Mecânica do SisGov

Mapa do repositório depois do recomeço de 31/out/2026. Ler antes de sair
procurando.

## Onde fica cada coisa

| O que | Onde |
| --- | --- |
| Onde parei | `RETOMAR.md` |
| O jogo como deve ser, por mecânica (ler a parte antes de mexer) | `docs/jogo/gdd.md`: 1 O jogo · 2 Sociedade · 3 Economia · 4 Máquina pública (leis, instituições, ministros) · 5 Política · 6 Mídia · 7 Mundo · 8 Tela · 9 Narrativas |
| O que falta construir (R1…R19) | `docs/jogo/requisitos.md` (cada bloco diz a parte do GDD) |
| Pesquisas e referências | `docs/jogo/estudos/` |
| O que foi substituído (GDD antigo, mapa de mecânicas, regras de leis de 14/nov) | `docs/historico/` |
| Como construir (camadas, roteiro, "começa com / expande depois") | `docs/jogo/plano-de-desenvolvimento.md` |
| Regras e cálculos do Estado | `src/motor/<modulo>/` (cada módulo com `index.ts` e `.md`) |
| Montar, salvar e carregar a partida | `src/partida/` |
| Tela | `src/tela/` |
| Índices de jogabilidade | `src/conteudo/mundo/indicadores/variaveis.json` |
| Uma lei | `src/conteudo/mundo/leis/<id>.json` (a partir do passo 3) |
| Estado de partida de um país | `src/conteudo/paises/<id>/` |
| Scripts que jogam sem tela | `scripts/` |

Código antigo: tag `projeto-antigo-2026-10-31` e
`arquivo/codigo-antigo-2026-10-31/`. Um grep acerta lá e engana; peça antiga
só volta lida e quando o passo pede.

## Não abrir sem o autor pedir

`docs/v1/desenho/`, `docs/referencia/`, `docs/arte/PROMPTS.md`,
`docs/conteudo/rede.md`, `docs/Exemplos/`.

## Fatos que enganam

**`npx tsc --noEmit` não checa nada neste projeto.** O projeto usa project
references: o comando certo é `npx tsc -b` (o que `npm run build` roda).

**Camadas são lint, não combinado.** `motor/` não importa React, JSON,
`conteudo/`, `partida/` nem `tela/`; `tela/` não importa `conteudo/`. O erro
aparece no `npm run lint` (regras em `eslint.config.js`).

**Turno é 2 meses; mandato de N anos = 6N turnos.** N vem de uma lei
essencial do país.

## Ruído conhecido do hook

O plugin `typescript-patterns-enforcer` acusa violações (`no-magic-numbers`,
`no-loop-statements`) que o `npm run check` do projeto não cobra. Conferir se
a violação é de uma linha sua antes de mexer.

## Outras skills do projeto

`sisgov-passo` (abrir e fechar passo), `sisgov-lei` (JSON de lei),
`sisgov-calculo` (cálculo estudado no motor), `sisgov-rodada` (RETOMAR).
