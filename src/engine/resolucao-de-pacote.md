# Resolução do pacote

**Chamado:** SG019

**Data:** 2 de outubro de 2026

**Estado:** implementado

## O que esta etapa conecta

O manifesto é a lista de arquivos de um país, escrita pelo desenvolvedor. O resolvedor lê cada caminho listado, confirma seu tipo e junta as definições por ID. Ele não usa a ordem da lista como prioridade: as coleções devolvidas ficam ordenadas por ID.

Uma política aponta para consequências por ID. Cada consequência aponta para a variável de origem e para a variável de destino. O estado inicial também aponta para variáveis por ID. Se qualquer uma dessas ligações não existir, o pacote inteiro é recusado antes da partida.

## Exemplo

`material-escolar` declara a consequência `melhora-educacao`. Essa consequência declara `verba_educacao` como origem e `educacao_publica` como destino. O resolvedor só aceita o pacote se os três IDs existirem nos respectivos arquivos.

Isso ainda não significa que a relação pode ser calculada. Por exemplo, descobrir se a unidade da verba é compatível, se o alvo pode receber contribuição e se os parâmetros fazem sentido é responsabilidade do SG020.

Quando a partida abre, a interface recebe somente as políticas já conferidas e as mostra como escolhas. O jogador pode escolher `material-escolar`; ele nunca precisa escrever o ID `melhora-educacao` nem mexer nos arquivos que o resolvedor conferiu.

## Proteções

O resolvedor recusa arquivo ausente, caminho repetido no manifesto, tipo de arquivo errado, ID duplicado e referência quebrada. Ele também aceita os arquivos de evento, situação e dilema para que eles possam apontar para consequências; o comportamento temporal deles continua para a fase própria.
