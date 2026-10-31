# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)). Passo 2: descobrir por que o
PIB nominal não cresce (12,03 → 12,15 mi em 24 turnos com ~5% de inflação; esperado ~+22%).

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (24 turnos, ~6 min).
Hoje: satisfação 44,4 × 44,5, dívida 97 × 105%, os dois vencem a eleição.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Bolsonaro aprova só 8 leis e a bússola para em (1,2; −0,1), longe de (7,3; 7,7).

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.
