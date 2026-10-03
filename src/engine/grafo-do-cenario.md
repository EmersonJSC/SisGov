# Grafo do cenário

**Chamado:** SG021

**Data:** 2 de outubro de 2026

**Estado:** implementado

## Estrutura interna

O grafo transforma o pacote válido em nós e relações imutáveis. Cada variável é um nó. Cada uso de uma consequência por uma política, evento, situação ou dilema torna-se uma relação separada.

Uma relação preserva origem, destino, mecanismo, parâmetros, atraso, duração, a definição de consequência e a fonte que a ativa. Também registra os caminhos dos dois arquivos de conteúdo. Essa identidade permite explicar depois por que um indicador mudou.

## Relações paralelas e ciclos

Duas políticas podem usar consequências diferentes com o mesmo destino. Uma mesma fonte pode até usar duas vezes a mesma consequência. Esses usos não são fundidos: recebem IDs próprios e permanecem auditáveis.

Uma consequência pode ter a mesma variável como origem e destino. O grafo preserva essa autorrelação. O significado temporal dela será aplicado pelo executor em passos futuros; construir o grafo não tenta resolver ciclos nem calcular equilíbrio.

## Exemplo

A política `material-escolar` pode criar a relação `material-escolar:0:melhora-educacao`. A relação leva de `verba_educacao` a `educacao_publica` e registra que veio de `politicas/material-escolar.json` e de `cosequencias/melhora-educacao.json`.
