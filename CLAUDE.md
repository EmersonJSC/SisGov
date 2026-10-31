# SisGov

SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país e acompanha efeitos de leis no orçamento, indicadores e opinião da população.

## Leitura inicial

1. `README.md`
2. `RETOMAR.md` e `docs/jogo/escopo.md` (regras e ordem de construção; recomeço de 31/out/2026, o projeto antigo está em `docs/historico/projeto-antigo/` e na tag `projeto-antigo-2026-10-31`, não abrir sem precisar)

## Não abrir sem o autor pedir

- `docs/v1/desenho/` — desenhos e estudos (pesado)
- `docs/referencia/` — histórico
- `docs/arte/PROMPTS.md` — prompts das artes
- `docs/conteudo/rede.md` — referência da rede
- `docs/Exemplos/` — referência externa (nada do Democracy 4 entra no projeto)

Como construir: `docs/jogo/plano-de-desenvolvimento.md` (camadas, roteiro por passo). `docs/arquitetura/` é do projeto antigo.

## Como trabalhar

- Fluxo enxuto: proposta curta no chat, o autor aprova, implementa-se. Sem spec, plano em arquivo, ledger ou subagente revisor, a menos que o autor peça.
- Um passo por vez. Ideia nova vai para a seção 11 do escopo; avisar e perguntar antes de abrir frente nova.
- Refatorar e mudar comportamento são pedidos separados.
- Na terceira tentativa sem fechar uma tarefa, parar e rever com o autor.
- Durante a mecânica: testes do que mudou e `npx tsc -b` (nunca `--noEmit`). O `npm run check` completo roda só ao terminar a mecânica inteira (ex.: o Grupos todo), não por camada.
- Commit com o assunto na frente (`tempo: …`, `mundo: …`, `conserto: …`). Trabalho direto na `main`. `git push` só com a palavra do autor.
- Atualizar o `RETOMAR.md` antes de encerrar a rodada.
- Mostrar na tela antes de dizer que está pronto.
- O motor não conhece nomes de leis, partidos ou países. Leis e índices são do mundo; o país declara só o estado inicial.
- Jogabilidade primeiro, realidade como base: lei inventada é permitida e número não precisa de precisão empírica.
- Ignorar o ruído do hook `typescript-patterns-enforcer` nos testes.
