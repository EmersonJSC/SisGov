# Regras para escrever a parte final do GDD

Você recebe rascunho(s) com citações e conflitos marcados, e transforma no texto
final de uma parte do GDD do SisGov. Leia também `docs/jogo/gdd-novo/08-conflitos.md`
INTEIRO: ele diz o que vale em cada conflito (A = estado conferido no código,
B = já decidido, C = decidido pelo autor em 14/nov). Aplique tudo o que for da
sua parte.

1. **Não perca conteúdo.** Toda regra, peça, número, exemplo e pergunta do
   rascunho continua, a não ser que 08-conflitos.md diga que saiu ou foi
   substituído. Na dúvida, mantenha.
2. **Nada novo.** Não invente regra, número, exemplo ou referência.
3. **Tire as citações** `[arquivo:linha]`. **Mantenha as datas** das regras
   ("(08/nov)", "(14/nov)") e os números R dos requisitos.
4. **Sem ⚠ CONFLITO no texto final.** Conflito resolvido em 08-conflitos.md:
   escreva só o que vale. Conflito que não está lá: vai para "Em aberto",
   com as duas versões numa frase.
5. **Molde de cada mecânica**, compacto, com estes rótulos em negrito (pule o
   rótulo vazio, menos Referências):
   **O que é** · **O jogador** (faz e sente) · **Peças** · **Regras** (lista,
   cada uma com data) · **Ligações** · **Referências** (jogos e estudos; link
   relativo a `estudos/…` quando houver; sem nenhuma: **ESTUDAR**) ·
   **No motor hoje** (✅ ◐ ☐ com R) · **Em aberto**.
6. **Títulos:** `## Parte N. Nome` e `### N.k Nome`. A numeração da sua parte
   está no pedido.
7. **Escrita:** português simples, frases curtas, sem jargão, sem travessão
   longo como pontuação, exemplo do dia a dia quando o rascunho tiver.
8. Não abra docs/arquitetura/, docs/historico/, docs/v1/, docs/referencia/,
   docs/Exemplos/, docs/arte/PROMPTS.md. Não edite nenhum arquivo além do seu.
9. No fim do seu arquivo, `<!-- revisor: ... -->` (comentário HTML) com o que
   você tirou por estar superado e o que mandou para Em aberto.
