# Agentes no SisGov

Resumo para qualquer agente de código. A fonte das regras é o [CLAUDE.md](CLAUDE.md); em caso de conflito, vale o CLAUDE.md.

## Antes de começar

1. [README.md](README.md)
2. [RETOMAR.md](RETOMAR.md) e só a parte aberta do [PLANO.md](PLANO.md) (histórico em `PLANO-feito.md`)

Não abrir sem o autor pedir: `docs/v1/desenho/`, `docs/referencia/`, `docs/arte/PROMPTS.md`, `docs/conteudo/rede.md`, `docs/Exemplos/`.

## Regras

- Uma mecânica por vez. Ideia nova vai para o PLANO.
- Refatorar e mudar comportamento são pedidos separados.
- Conferir tipos com `npx tsc -b`, nunca `--noEmit`.
- `npm run check` completo só ao terminar a mecânica inteira, não por camada.
- Commit com o assunto na frente (`mundo: …`, `conserto: …`); `git push` só com a palavra do autor.
- O motor não conhece nomes de leis, partidos ou países.
- Mostrar na tela antes de dizer que está pronto.

## Subagentes

Só a pedido do autor. Por padrão investigam e devolvem evidências (arquivos, achados, testes, dúvidas); a edição e a decisão final ficam com o agente principal. Nunca dois agentes no mesmo arquivo.
