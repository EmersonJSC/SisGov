# Onde parei

Reescrito do zero a cada rodada; o anterior vai para o topo de
[docs/historico/retomar.md](docs/historico/retomar.md) (não abrir sem precisar).

**31/out/2026**

## Próximo

A economia vai ser redesenhada e é a próxima frente. Antes de código, o autor diz o
que está errado ou faltando nela; depois, proposta curta no chat.

## Quebrado de propósito (não consertar agora)

- `contasSemFuros` A1 e A2, `brasil2026` (juros), `cooperacaoInternacional`: economia, voltam com a economia nova.
- `gabinete` (ministro sem grupo leal com 25 grupos): ministros, no final.

## Pontas soltas

- `npm run populacao:ligacoes` falha com "Lei desconhecida: reforma-agraria".
- Não joguei uma partida na tela até a eleição depois do turno de 2 meses.
- Esperando o autor: industrialização (índice ou setores), mídia na V1, estado dos grupos.

## Jeito de trabalhar (combinado em 31/out)

- Toda rodada fecha um item, interno ou visível.
- Nada de teste em mecânica que ainda vai mudar.
- Ideia nova vira uma linha no fim do PLANO; o mapa não é reescrito.

## Armadilhas

- `npx tsc -b`, nunca `--noEmit`.
- `pkill -f` mata o próprio shell; `sleep` no Bash é bloqueado.
- Scripts `vite-node` ficam em `src/`.
