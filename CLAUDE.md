# SisGov

SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país e acompanha efeitos de leis no orçamento, indicadores e opinião da população.

## Leitura inicial

1. `README.md`
2. `RETOMAR.md` e só a parte aberta do `PLANO.md` (histórico em `PLANO-feito.md`, não abrir sem precisar)

## Não abrir sem o autor pedir

- `docs/v1/desenho/` — desenhos e estudos (pesado)
- `docs/referencia/` — histórico
- `docs/arte/PROMPTS.md` — prompts das artes
- `docs/conteudo/rede.md` — referência da rede
- `docs/Exemplos/` — referência externa (nada do Democracy 4 entra no projeto)

Referência técnica utilizável: `docs/arquitetura/` e os `.md` de `src/engine/`.

## Como trabalhar

- Fluxo enxuto: proposta curta no chat, o autor aprova, implementa-se. Sem spec, plano em arquivo, ledger ou subagente revisor, a menos que o autor peça.
- Uma mecânica por vez. Ideia nova vai para o PLANO; avisar e perguntar antes de abrir frente nova.
- Refatorar e mudar comportamento são pedidos separados.
- Na terceira tentativa sem fechar uma tarefa, parar e rever com o autor.
- Durante o dia: testes do que mudou e `npx tsc -b` (nunca `--noEmit`). O `npm run check` completo roda só ao terminar a mecânica inteira (ex.: o Grupos todo), não por camada.
- Commit com o assunto na frente (`tempo: …`, `mundo: …`, `conserto: …`). Trabalho direto na `main`. `git push` só com a palavra do autor.
- Atualizar o `RETOMAR.md` antes de encerrar a rodada.
- Mostrar na tela antes de dizer que está pronto.
- O motor não conhece nomes de leis, partidos ou países. Leis e índices são do mundo; o país declara só o estado inicial.
- Jogabilidade primeiro, realidade como base: lei inventada é permitida e número não precisa de precisão empírica.
- Ignorar o ruído do hook `typescript-patterns-enforcer` nos testes.
