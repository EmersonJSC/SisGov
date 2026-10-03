# Separação entre motor e cenário

**Chamado:** SG017

**Data:** 2 de outubro de 2026

**Estado:** implementado

## Regra central

O motor é o mesmo para todos os países. Ele não reconhece Brasil, Estados Unidos, partidos, leis ou quantidades predefinidas de indicadores e políticas. Sua responsabilidade é calcular as consequências declaradas e devolver valores e explicações para a camada de jogo.

Cada país é um pacote de conteúdo com estado inicial, políticas já implantadas, indicadores, relações e regras institucionais próprias. Trocar de país significa carregar outro pacote e iniciar o motor com os valores daquele pacote. O motor não muda de comportamento nem contém condições pelo nome do país.

## Indicadores e apresentação

O pacote define N indicadores e N políticas. Não existe regra que imponha quatro indicadores ou qualquer outra quantidade fixa. A interface recebe a lista de indicadores do cenário e cria uma bolha para cada item; a posição é calculada a partir da quantidade e da ordem da lista, sem layouts definidos pelo ID de um indicador brasileiro.

O valor inicial de cada indicador vem do JSON do cenário. Depois de iniciar a partida, o motor recalcula os valores somente pelas relações, controles e consequências ativas do pacote.

## Fronteiras de responsabilidade

```text
pacote do país → estado inicial, políticas e relações
camada de jogo → decisões, autorização, implantação e fim da partida
motor → cálculos numéricos e explicações
interface → bolhas, telas e decisões enviadas ao jogo
```

O núcleo público não importa React, componentes visuais nem conteúdo de um país. A interface não recalcula regras do motor.

## Verificação

- a validação não impõe quantidade fixa de indicadores;
- testes importam o núcleo sem carregar React;
- o mapa posiciona qualquer lista de indicadores sem usar IDs fixos;
- a troca futura de país depende apenas de outro pacote de conteúdo compatível.
