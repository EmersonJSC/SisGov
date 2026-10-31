# SisGov

SisGov é um simulador de governo em português. Quem joga governa um país
aprovando leis e acompanha o efeito delas no orçamento, nos indicadores e na
opinião da população, até a eleição. Vencer é manter-se no poder.

O projeto recomeçou do zero em 31/out/2026. O código antigo está na tag
`projeto-antigo-2026-10-31`.

## Antes de começar

1. [RETOMAR.md](RETOMAR.md): onde parei e o próximo passo.
2. [docs/jogo/escopo.md](docs/jogo/escopo.md): o que o jogo é e a ordem de construção.
3. [docs/jogo/plano-de-desenvolvimento.md](docs/jogo/plano-de-desenvolvimento.md): como construir, passo a passo.
4. [CLAUDE.md](CLAUDE.md): regras de trabalho.

## Estrutura

A dependência só desce; o lint barra import na direção errada.

- `src/tela`: React. Mostra e envia pedidos; não calcula.
- `src/partida`: monta a partida (mundo + país), chama o motor, salva e carrega.
- `src/motor`: regras do Estado e cálculos estudados, em TS puro, sem JSON.
- `src/conteudo`: JSON do mundo (`mundo/`) e dos países (`paises/`).
- `scripts/`: jogam a partida sem tela para conferir cada passo.

## Ambiente

```bash
npm ci          # instalar dependências
npm run dev     # ambiente de desenvolvimento
npm run check   # formatação, lint, tipos, build e testes
```
