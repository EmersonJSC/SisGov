# Restauração do estado

**Chamado:** SG039

**Estado:** implementado

O restaurador aceita somente snapshots com formato, versões, pacote e identidade de conteúdo compatíveis. Ele também verifica valores obrigatórios, passo, limite de histórico, memória das relações, ocorrências e memória gradual.

Snapshot incompleto, pacote alterado ou versão incompatível é recusado. A operação é pura: uma falha não modifica a execução que já está aberta, e uma restauração válida devolve uma cópia independente.
