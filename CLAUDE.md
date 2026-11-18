# SisGov

SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país e acompanha efeitos de leis no orçamento, indicadores e opinião da população.

## GDD congelado (15/nov/2026)

O `docs/jogo/gdd.md` está **congelado** durante a construção da V1. Vale para todo chat, agente e skill, e vale também quando o pedido vem do autor.

- Não se reescreve, reorganiza, resume nem "melhora" o GDD. Não se cria GDD novo, versão nova nem documento que o substitua.
- Ideia nova, mudança de regra ou "e se…" vai para `docs/jogo/depois-da-v1.md`, com data, numa linha. O GDD não é tocado.
- Se o autor pedir para mudar o GDD, lembrar do congelamento e perguntar: "vai para o depois-da-v1 ou você quer descongelar?". Só descongela com a palavra "descongelar" dita pelo autor.
- Leitura do autor: antes de construir uma seção que entra na V1, o autor lê essa seção uma vez e corrige o que não concorda. É a única hora em que o texto muda por discordância; corrigido, a seção volta a congelar. Discordância em seção que não está sendo construída vai para o depois-da-v1.
- Número de balanceamento (pesos, limites, custos) não é do GDD: o GDD guarda a ideia, o número mora no código e se ajusta sem descongelar (autor, 16/nov).
- Exceção: erro que impede construir (duas regras que se contradizem, número faltando no que está sendo feito agora). Corrige-se a linha mínima, com a marca `(corrigido na construção, data)`, avisando o autor.
- Só se constrói o que está no **Escopo da V1** (seção 0 do `docs/jogo/plano-de-desenvolvimento.md`). Pedido fora dele vai para o depois-da-v1, mesmo vindo do autor, salvo se ele mudar o escopo dizendo isso.
- Se o código e o GDD discordam, o código se ajusta ao GDD ou a divergência vai para o depois-da-v1. Nunca se reescreve o GDD para caber no código.

## Leitura inicial

1. `README.md`
2. `RETOMAR.md` e `docs/jogo/gdd.md` (o jogo como deve ser, por mecânica: Sociedade, Economia e Máquina pública no meio, Política, Mídia, Mundo, Tela e Narrativas em volta; o feito e a ordem estão no plano; recomeço de 31/out/2026, o projeto antigo está em `docs/historico/projeto-antigo/` e na tag `projeto-antigo-2026-10-31`, não abrir sem precisar)

## Não abrir sem o autor pedir

- `docs/v1/desenho/` — desenhos e estudos (pesado)
- `docs/referencia/` — histórico
- `docs/arte/PROMPTS.md` — prompts das artes
- `docs/conteudo/rede.md` — referência da rede
- `docs/Exemplos/` — referência externa (nada do Democracy 4 entra no projeto)

Antes de responder ou propor sobre uma mecânica, ler a parte dela no GDD (Regras, No motor hoje, Em aberto). Ideia nova vai para `docs/jogo/depois-da-v1.md` (GDD congelado).

Como construir: `docs/jogo/plano-de-desenvolvimento.md` (camadas, roteiro por passo). O que foi substituído está em `docs/historico/`.

## Como trabalhar

- Fluxo enxuto: proposta curta no chat, o autor aprova, implementa-se. Sem spec, plano em arquivo, ledger ou subagente revisor, a menos que o autor peça.
- Um passo por vez. Ideia nova vai para `docs/jogo/depois-da-v1.md`; avisar e perguntar antes de abrir frente nova.
- Refatorar e mudar comportamento são pedidos separados.
- Na terceira tentativa sem fechar uma tarefa, parar e rever com o autor.
- Durante a mecânica: testes do que mudou e `npx tsc -b` (nunca `--noEmit`). O `npm run check` completo roda só ao terminar a mecânica inteira (ex.: o Grupos todo), não por camada.
- Commit com o assunto na frente (`tempo: …`, `mundo: …`, `conserto: …`). Trabalho direto na `main`. `git push` só com a palavra do autor.
- Atualizar o `RETOMAR.md` antes de encerrar a rodada.
- Mostrar na tela antes de dizer que está pronto.
- O motor não conhece nomes de leis, partidos ou países. Leis e índices são do mundo; o país declara só o estado inicial.
- Jogabilidade primeiro, realidade como base: lei inventada é permitida e número não precisa de precisão empírica.
- Ignorar o ruído do hook `typescript-patterns-enforcer` nos testes.
