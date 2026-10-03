# Diagnóstico do pacote

**Chamado:** SG023

**Data:** 2 de outubro de 2026

**Estado:** implementado

## Avisos e erros

Erros impedem que um pacote seja carregado. Avisos são observações sobre um pacote válido e não alteram a partida. O desenvolvedor recebe ambos durante a autoria; o jogador recebe somente políticas e indicadores que passaram pelo carregamento.

## O que é analisado

O diagnóstico lista ciclos, componentes desconectados, conteúdo sem uso numérico e arquivos distribuídos na pasta do pacote que não foram incluídos pelo manifesto.

Um ciclo não é erro. Por exemplo, educação pode influenciar saúde e saúde influenciar educação em passos posteriores. O aviso torna esse comportamento auditável sem o remover ou tentar resolvê-lo de forma instantânea.

Arquivos órfãos não entram no grafo nem ficam ocultos: o carregador os informa como aviso. Políticas, eventos, situações e dilemas sem consequência numérica também são avisados para que o desenvolvedor confirme se o conteúdo é intencional.
