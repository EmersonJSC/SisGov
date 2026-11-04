# Deriva

Índice que anda sozinho pelos turnos, empurrado por outro índice (o
"processo" da arquitetura). Aprovado em 04/nov/2026.

- O índice é **base + leis**; a deriva move a **base**, um pouco a cada turno.
- Quem empurra mede contra o turno 0: o país começa parado e só anda quando
  algo muda (uma lei, o PIB, outra deriva).
- Passo por turno = sentido × taxa × (quem empurra hoje − no turno 0) ×
  escala. Taxa: `fraca` 2%, `media` 5%, `forte` 10% da distância.
- A base fica dentro do domínio já contando as leis: não acumula além do teto.
- As ligações ficam no mundo (`mundo/indicadores/derivas.json`); o motor não
  sabe os nomes.
- Não equilibrado: a taxa só dá a direção.
