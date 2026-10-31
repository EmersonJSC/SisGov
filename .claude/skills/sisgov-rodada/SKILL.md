---
name: sisgov-rodada
description: Use before ending any SisGov work session or when context is about to be compacted — rewrites RETOMAR.md so the next session knows where things stopped.
---

# Encerrar a rodada

O autor tem TDAH: o `RETOMAR.md` é a memória entre sessões. Atualizar
**toda** rodada, mesmo no meio de um passo.

1. Copiar o corpo atual do `RETOMAR.md` (da data para baixo) para o **topo**
   de `docs/historico/retomar.md`, logo abaixo do cabeçalho, se a data ou o
   assunto mudou. Mesma data e mesmo assunto: só reescrever.
2. Reescrever o `RETOMAR.md` do zero, curto:
   - **data** (`**31/out/2026**`);
   - **onde está**: passo atual e o que já está feito nele, em uma frase cada;
   - **próximo**: uma ação só, concreta ("proposta do formato X para o autor
     aprovar"), e se espera decisão do autor;
   - **pendências do autor** (ex.: pasta para apagar, decisão em aberto);
   - **armadilhas**: manter as que ainda valem, somar a nova que custou
     tempo nesta rodada, tirar a que não vale mais.
3. Nada de histórico, justificativa longa ou lista de tudo que foi feito:
   isso está no git.
4. Commit junto com o trabalho da rodada ou sozinho (`docs: retomar …`).
