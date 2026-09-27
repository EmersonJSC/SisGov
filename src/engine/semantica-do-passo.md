# Semântica do passo do motor

**Chamado:** SG009

**Data:** 26 de setembro de 2026

**Decisão:** atualização síncrona por retrato imutável

## Problema

O motor precisa definir se um valor calculado durante um passo pode ser lido imediatamente por outro nó no mesmo passo. Essa escolha determina a interpretação de cadeias, ciclos e a reprodutibilidade da simulação.

## Comparação

Considere uma cadeia artificial: A é uma entrada com valor 4; B é calculado como `2 × A`; C é calculado como `B + 1`. Os valores iniciais de B e C são 0.

| Política                             | Primeiro passo                                   | Segundo passo |
| ------------------------------------ | ------------------------------------------------ | ------------- |
| Atualização síncrona                 | B = 8; C = 1, pois C lê B = 0 do retrato inicial | B = 8; C = 9  |
| Propagação imediata na ordem A, B, C | B = 8; C = 9                                     | B = 8; C = 9  |

Na propagação imediata, se C for calculado antes de B, C continua em 1 no primeiro passo. Assim, a ordem de cadastro ou iteração passa a mudar o resultado. Para evitar isso, a propagação imediata exigiria regras adicionais de ordenação para cadeias e uma política especial para ciclos.

## Escolha

Cada passo seguirá esta sequência:

1. Validar os comandos recebidos e aplicá-los somente às entradas controláveis em uma cópia de trabalho.
2. Fixar essa cópia como o retrato de leitura do passo.
3. Calcular todos os próximos valores usando exclusivamente esse retrato.
4. Validar os resultados e confirmar todos os valores juntos em um novo estado.

Uma relação sem atraso adicional ainda lê o retrato do passo; portanto, cada conexão acrescenta um passo técnico à propagação. Na cadeia acima, A afeta B ao fim do primeiro passo e C ao fim do segundo.

## Ciclos

Os ciclos são válidos e não são resolvidos dentro de um único passo. Em um ciclo A ↔ B, o novo valor de A lê o valor anterior de B, e o novo valor de B lê o valor anterior de A. Autorrelações seguem a mesma regra: leem o valor anterior do próprio nó.

O motor não repete cálculos até estabilizar, não depende de ordenação topológica e não procura uma solução de equilíbrio implícita. A evolução de um ciclo ocorre em passos sucessivos e pode ser reproduzida a partir do mesmo estado e dos mesmos comandos.

## Consequências

- A ordem de cadastro dos nós não altera a trajetória, salvo a tolerância numérica documentada para somas futuras.
- Cadeias longas têm atraso explícito e observável, o que exige escolher uma duração de passo adequada no SG012.
- Propagação dentro do mesmo passo só poderá ser adicionada mais tarde como um mecanismo explícito, com regras próprias para ciclos.
- O executor dos SG025–SG032 deve manter leitura e confirmação separadas e atômicas.

## Chamados afetados

SG010, SG011, SG012, SG013, SG014, SG025, SG026, SG027, SG028, SG029, SG030, SG031 e SG032.
