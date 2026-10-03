# Semântica do passo do motor

**Chamado:** SG009

**Data:** 26 de setembro de 2026; decisão confirmada em 1 de outubro de 2026

**Estado:** decisão definida

**Decisão:** atualização síncrona por retrato imutável

## Problema

O motor precisa definir se um valor calculado durante um passo pode ser lido imediatamente por outro nó no mesmo passo. Essa escolha determina a interpretação de cadeias, ciclos e a reprodutibilidade da simulação.

## Exemplo artificial no jogo

Considere a cadeia `investimento implantado → qualidade da educação → qualificação profissional`. Ela serve apenas para demonstrar a ordem do cálculo; não define uma política, uma relação causal ou parâmetros do cenário final.

No exemplo, o investimento A começa em 0, a qualidade da educação B em 40 e a qualificação profissional C em 30. Para tornar a conta verificável, usam-se as regras artificiais `B = 40 + A` e `C = B - 10`. Antes do primeiro passo, um comando muda A para 1.

| Momento        | A   | B   | C   | Explicação                                                  |
| -------------- | --- | --- | --- | ----------------------------------------------------------- |
| Estado inicial | 0   | 40  | 30  | Valores antes do comando                                    |
| Primeiro passo | 1   | 41  | 30  | B lê A = 1; C ainda lê B = 40 no retrato do começo do passo |
| Segundo passo  | 1   | 41  | 31  | C agora lê B = 41, confirmado ao final do primeiro passo    |

Na alternativa de propagação imediata, C chegaria a 31 já no primeiro passo se B fosse calculado antes dele. Se C fosse calculado primeiro, continuaria em 30. Assim, a ordem de cadastro ou iteração poderia mudar o resultado. Evitar essa diferença exigiria regras adicionais de ordenação para cadeias e uma política especial para ciclos.

## Escolha

Cada passo seguirá esta sequência:

1. Validar os comandos recebidos e aplicá-los somente às entradas controláveis em uma cópia de trabalho.
2. Fixar essa cópia como o retrato de leitura do passo.
3. Calcular todos os próximos valores usando exclusivamente esse retrato.
4. Validar os resultados e confirmar todos os valores juntos em um novo estado.

Uma relação sem atraso adicional ainda lê o retrato do passo; portanto, cada conexão acrescenta um passo técnico à propagação. Na cadeia acima, A afeta B ao fim do primeiro passo e C ao fim do segundo.

O passo é uma atualização interna do motor. Ele não é necessariamente um turno do jogador. A duração de cada passo será definida no SG012, e a quantidade de passos executada em um turno será definida com o ciclo da partida. O tempo de implantação de uma política e os atrasos declarados por suas consequências são regras adicionais e não substituem esta ordem de propagação.

## Ciclos

Os ciclos são válidos e não são resolvidos dentro de um único passo. Em um ciclo A ↔ B, o novo valor de A lê o valor anterior de B, e o novo valor de B lê o valor anterior de A. Autorrelações seguem a mesma regra: leem o valor anterior do próprio nó.

O motor não repete cálculos até estabilizar, não depende de ordenação topológica e não procura uma solução de equilíbrio implícita. A evolução de um ciclo ocorre em passos sucessivos e pode ser reproduzida a partir do mesmo estado e dos mesmos comandos.

Essa regra não obriga todas as políticas e consequências a crescerem ou reagirem da mesma forma. O JSON poderá escolher força, atraso, duração, dissipação e um mecanismo entre os mecanismos implementados e validados pelo motor. A semântica do passo permanece comum a todo o grafo: mesmo com parâmetros e mecanismos diferentes, cada cálculo lê o retrato do começo do passo. Fórmulas livres e a escolha de uma política por resolver instantaneamente o equilíbrio de um ciclo não fazem parte desse contrato.

## Consequências

- A ordem de cadastro dos nós não altera a trajetória, salvo a tolerância numérica documentada para somas futuras.
- Cadeias longas têm atraso explícito e observável, o que exige escolher uma duração de passo adequada no SG012.
- Propagação dentro do mesmo passo só poderá ser adicionada mais tarde como um mecanismo explícito, com regras próprias para ciclos.
- O executor dos SG025–SG032 deve manter leitura e confirmação separadas e atômicas.

## Resultado da revisão

A decisão foi preservada. Cadeias e ciclos evoluem ao longo de passos sucessivos, enquanto cada consequência pode declarar no JSON seu comportamento entre os mecanismos suportados. Os exemplos desta decisão são artificiais e não antecipam as políticas nem os parâmetros do cenário final.

## Chamados afetados

SG010, SG011, SG012, SG013, SG014, SG025, SG026, SG027, SG028, SG029, SG030, SG031 e SG032.
