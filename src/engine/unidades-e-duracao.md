# Unidades e duração do motor

**Chamado:** SG012

**Data:** 1 de outubro de 2026

**Estado:** decisão definida

## Unidade temporal do cenário

Cada cenário declara uma única duração para o passo técnico. Atrasos, durações, implantação e dissipação são expressos em quantidades inteiras desses passos. Consequências de um mesmo cenário não misturam dias, semanas, meses e anos em seus parâmetros executáveis.

Exemplo:

```text
duração do passo: 1 mês
atraso: 2 passos = 2 meses
duração: 18 passos = 18 meses
implantação: 4 passos = 4 meses
```

A duração do passo não determina a duração do turno do jogador. A camada de jogo poderá executar vários passos técnicos dentro de um turno, conforme as regras definidas posteriormente para o ciclo da partida.

Outro cenário pode escolher uma duração de passo diferente. A conversão pertence à preparação do conteúdo e não varia entre consequências durante a execução do mesmo cenário.

## Modos temporais

Os efeitos distinguem explicitamente três modos:

- `unico`: ocorre uma vez e não usa um número artificial de passos para representar instantaneidade;
- `fixo`: permanece por uma quantidade inteira e positiva de passos;
- `continuo`: permanece enquanto sua origem estiver ativa, sem duração máxima fictícia.

O atraso é uma quantidade inteira de passos igual ou maior que zero. Duração zero, duração negativa, duração fracionária e duração fixa ausente são inválidas. Um efeito contínuo não usa números como `999999` para representar permanência. Dissipação poderá prolongar a memória depois do encerramento conforme o mecanismo definido posteriormente.

## Catálogo mínimo de unidades

O catálogo inicial distingue pelo menos:

- `indice_0_1`;
- `indice_0_100`;
- `percentual_0_100`;
- `moeda`;
- `moeda_por_passo`;
- `taxa_por_passo`;
- `quantidade`;
- `quantidade_por_passo`.

Índice, percentual e taxa por tempo não são equivalentes. O motor não faz conversões implícitas entre unidades. Um mecanismo que converta uma grandeza em outra declara parâmetros compatíveis, e somas exigem contribuições na unidade do destino.

O cenário pode apresentar a moeda com nome, símbolo e escala próprios. Essas informações de apresentação não alteram a compatibilidade matemática entre `moeda` e `moeda_por_passo`.

## Tolerância numérica

Comparações aproximadas usam tolerância absoluta de `1e-9` combinada com tolerância relativa de `1e-12`. Dois valores `a` e `b` são considerados equivalentes quando:

```text
abs(a - b) <= max(1e-9, 1e-12 × max(abs(a), abs(b)))
```

Essa tolerância serve para comparações e verificações matemáticas, não para arredondar valores exibidos, esconder resultado fora do domínio ou corrigir automaticamente conteúdo inválido.

## Exemplos de validade

São válidos:

- um efeito único com atraso zero;
- um efeito fixo com duração de 6 passos;
- um efeito contínuo ligado à vigência de sua origem;
- uma contribuição em `moeda_por_passo` destinada a um valor com essa mesma unidade.

São inválidos:

- efeito fixo com duração zero, negativa, fracionária ou ausente;
- atraso negativo ou fracionário;
- soma direta de `percentual_0_100` com `indice_0_1`;
- soma de `moeda` com `moeda_por_passo`;
- valor não finito, como `NaN` ou infinito.

## Resultado da revisão

Cada cenário usa uma duração comum de passo. Os efeitos declaram modo temporal sem durações fictícias, e tempos discretos usam quantidades inteiras de passos. Unidades incompatíveis permanecem distintas, e a tolerância numérica tem regra única e explícita.
