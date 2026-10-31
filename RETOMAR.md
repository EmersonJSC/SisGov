# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

Frente única: **governos opostos têm que terminar diferentes** (ordem completa no
[mapa](docs/jogo/mecanicas/mapa-das-mecanicas.md)).

Feito: PIB nominal consertado (setas `*--pib-nominal` com coeficiente 0,01 → 0,25;
estava 25× fraco). Agora 12,8 → 16,3 mi em 24 turnos (+28%).

Mesmo assim os dois seguem iguais (24 turnos, semente 7):

| | Mujica | Bolsonaro |
|---|---|---|
| Satisfação | 47,5 → 44,9 | 47,5 → 44,6 |
| Dívida | 79,6 → 95% | 79,6 → 101% |
| Bússola final | (0,1; −3) | (1,2; −0,1) |
| Eleição | venceu | venceu |

Próximo suspeito: **o programa do Bolsonaro em `src/conteudo/bussola/programas.json`**.
As 16 leis chegam todas ao alvo (8 já valiam, 8 passaram, nenhuma caiu), e mesmo assim
a bússola para em (1,2; −0,1), longe de (7,3; 7,7). Não é o Congresso: é o programa
fraco ou o peso das leis na bússola.

Termômetro: `npx vite-node scripts/teste/mandato.ts -- mujica,bolsonaro` (~6 min).

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026`, `cooperacaoInternacional`: economia.
- `gabinete`: ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.
