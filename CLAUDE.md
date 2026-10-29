# SisGov

SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país e acompanha efeitos de leis no orçamento, indicadores e opinião da população.

## Leitura inicial

1. `README.md`
2. `AGENTS.md`

## Não abrir sem o autor pedir

- `docs/v1/desenho/` — desenhos e estudos (pesado)
- `docs/referencia/` — histórico
- `docs/arte/PROMPTS.md` — prompts das artes
- `docs/conteudo/rede.md` — referência da rede
- `docs/Exemplos/` — referência externa

Referência técnica utilizável: `docs/arquitetura/`.

## Como trabalhar (economia de tokens)

- Fluxo enxuto por padrão: proposta curta no chat, o autor aprova, implementa-se. Sem spec, plano em arquivo, ledger ou subagente revisor, a menos que o autor peça.
- Revisão independente (subagente) só a pedido do autor.
- Ignorar o ruído do hook `typescript-patterns-enforcer` nos testes.
- Ler `RETOMAR.md` e só a parte aberta do `PLANO.md`; o histórico fica em `PLANO-feito.md` (não abrir sem precisar).
