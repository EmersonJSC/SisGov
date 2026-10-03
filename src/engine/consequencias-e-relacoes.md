# Consequências e relações do motor

**Chamado:** SG011

**Data:** 1 de outubro de 2026

**Estado:** decisão definida

## Contribuições separadas por origem

Políticas, eventos, dilemas, situações e efeitos herdados podem afetar o mesmo indicador. Cada causa produz sua própria contribuição, e o destino combina as contribuições conforme o mecanismo definido. Uma causa não sobrescreve silenciosamente as demais.

Mesmo quando a interface apresenta um valor total, o jogador deve poder consultar com clareza o que está afetando o indicador. Cada contribuição preserva pelo menos a origem, o destino, o mecanismo, o valor produzido e seu estado temporal.

Exemplo artificial:

```text
Educação inicial:            40
Verba educacional:           +3
Programa de materiais:       +2
Formação de professores:     +1
Evento negativo:             -2
Educação resultante:         44
```

O valor resultante é 44, mas as parcelas `+3`, `+2`, `+1` e `-2` continuam disponíveis para explicação e inspeção.

## Identidade de cada uso

Uma definição de consequência pode ser reutilizada por políticas, eventos, dilemas, situações e estados herdados. Cada uso recebe identidade própria e mantém sua origem. Encerrar um uso remove ou dissipa somente a contribuição correspondente, sem afetar outros usos da mesma definição.

A auditabilidade é um requisito geral do jogo. O jogador deve conseguir seguir uma política desde a decisão, autorização e implantação até cada consequência e sua participação no indicador resultante. A explicação preserva os identificadores da definição, do uso e da origem, mesmo quando a interface também apresenta totais agregados.

Exemplo artificial:

```text
Definição: melhoria gradual da educação
Uso 1: programa de materiais → +2
Uso 2: programa de alimentação → +1
Total apresentado: +3
```

Os dois usos permanecem independentes. Desativar o programa de materiais não remove a contribuição do programa de alimentação.

## Mecanismos implementados pelo motor

O JSON não contém fórmulas livres nem código executável. O motor oferece um catálogo de mecanismos implementados, validados, testados e explicáveis. Cada consequência seleciona um desses mecanismos e fornece somente referências e parâmetros aceitos pelo contrato correspondente.

O conjunto inicial permanece pequeno: contribuição fixa, contribuição proporcional, transformação afim e soma das contribuições no destino. Produto, condições, respostas limitadas e respostas graduais são acrescentados quando um cenário concreto exigir, sempre com contrato, validação de unidades e testes próprios.

Cada mecanismo declara todas as dependências que lê e produz uma contribuição por uso. Uma contribuição inativa vale zero, inclusive quando o mecanismo possui um termo constante. JavaScript, `eval` e expressões matemáticas arbitrárias não são aceitos nos arquivos de conteúdo.

## Combinação no destino

O primeiro recorte combina por soma as contribuições destinadas ao mesmo valor. Não existem prioridade, substituição, sinergia, saturação ou retorno decrescente implícitos. Quando um cenário exigir um desses comportamentos, ele será incluído como mecanismo explícito do motor.

Exemplo de relações paralelas:

```text
uso materiais-educacao → educação: +2
uso formacao-educacao  → educação: +3
total no destino: +5
```

As duas relações são preservadas, embora tenham o mesmo destino. O mecanismo declara todas as dependências que lê, e o uso declara um destino existente e compatível. Leituras não declaradas, destinos inexistentes e contribuições destinadas a um `controle` são inválidos.

Exemplo conceitual de dois usos da mesma definição:

```json
{
  "definicao": "melhoria_gradual_educacao",
  "usos": [
    {
      "id": "materiais-educacao",
      "origem": "programa_materiais",
      "destino": "educacao"
    },
    {
      "id": "alimentacao-educacao",
      "origem": "programa_alimentacao",
      "destino": "educacao"
    }
  ]
}
```

O formato definitivo será fechado no SG015. O exemplo fixa apenas que as identidades dos usos não podem ser deduzidas ou fundidas pela definição compartilhada.

## Resultado da revisão

Cada uso de consequência produz uma contribuição auditável. Relações paralelas são somadas no destino e continuam identificadas separadamente. O JSON escolhe mecanismos implementados pelo motor e informa seus parâmetros, sem fórmulas livres. Interações, produtos, respostas limitadas e outros comportamentos serão acrescentados somente quando um cenário concreto exigir contrato e testes próprios.
