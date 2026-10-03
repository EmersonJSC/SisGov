# Coerência do pacote

**Chamado:** SG020

**Data:** 2 de outubro de 2026

**Estado:** implementado

## O que é conferido

Depois de confirmar que todos os IDs existem, o validador confere se eles podem trabalhar juntos. Cada variável declara unidade, domínio e valor inicial. O estado inicial deve informar um valor dentro desse domínio para todas as variáveis.

Uma política aponta para uma variável de `controle`, pois é a camada de jogo que aplica a decisão do jogador. Uma consequência não pode apontar para controle: ela produz resultado em uma variável calculada ou em um estoque. A unidade da contribuição também precisa ser igual à unidade do destino.

## Exemplo

`verba_educacao` pode ter unidade `moeda_por_passo` e ser controle. `educacao_publica` pode ter unidade `indice_0_100` e domínio de 0 a 100. A consequência entre elas declara que sua saída é `indice_0_100` e, por isso, pode contribuir para educação pública.

Se uma consequência tentar alterar `verba_educacao`, o pacote falha. Isso impediria o motor de mudar por conta própria uma decisão que somente a camada de jogo pode aplicar.

## Limites desta etapa

Esta validação não calcula uma trajetória nem modifica valores para caber no domínio. Ela apenas recusa um cadastro incoerente. A montagem das relações como grafo e o catálogo imutável ficam para SG021.
