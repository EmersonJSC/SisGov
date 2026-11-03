# Agentes no SisGov

Resumo para qualquer agente de código. A fonte das regras é o [CLAUDE.md](CLAUDE.md); em caso de conflito, vale o CLAUDE.md.

## Antes de começar

1. [README.md](README.md)
2. [RETOMAR.md](RETOMAR.md), [GDD](docs/jogo/gdd.md) e [plano de desenvolvimento](docs/jogo/plano-de-desenvolvimento.md)

Não abrir sem o autor pedir: `docs/v1/desenho/`, `docs/referencia/`, `docs/arte/PROMPTS.md`, `docs/conteudo/rede.md`, `docs/Exemplos/`.

## Regras

- Um passo por vez. Ideia nova vai para a seção 18 (Perguntas em aberto) do GDD.
- Refatorar e mudar comportamento são pedidos separados.
- Conferir tipos com `npx tsc -b`, nunca `--noEmit`.
- `npm run check` completo ao fechar o passo.
- Commit com o assunto na frente (`motor: …`, `mundo: …`, `conserto: …`); `git push` só com a palavra do autor.
- Camadas: `tela → partida → motor/conteudo`. O motor não conhece nomes de leis, partidos ou países.
- Mostrar na tela antes de dizer que está pronto.

## Subagentes

Só a pedido do autor. Por padrão investigam e devolvem evidências; a edição e a decisão final ficam com o agente principal. Nunca dois agentes no mesmo arquivo.
