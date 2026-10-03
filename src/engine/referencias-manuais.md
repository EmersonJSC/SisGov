# Referências manuais do motor

**Chamado:** SG014

**Data:** 2 de outubro de 2026

**Estado:** decisão definida

## Finalidade

Estas contas definem resultados esperados sem depender do futuro executor. Todos os nomes, relações e coeficientes são artificiais. Eles verificam os contratos do motor e não afirmam que uma política pública real produz esses efeitos.

## Cadeia de três valores

O exemplo usa um controle aplicado A, um valor calculado B e outro valor calculado C.

```text
A: investimento implantado
B: indicador artificial de educação
C: indicador artificial de qualificação

B = 40 + A
C = B - 10
```

Estado inicial:

```text
A = 0
B = 40
C = 30
```

Antes do primeiro passo, a camada de jogo envia o comando `A = 1`.

| Momento        | A   | B   | C   | Valores lidos                                        |
| -------------- | --- | --- | --- | ---------------------------------------------------- |
| Inicial        | 0   | 40  | 30  | —                                                    |
| Após o passo 1 | 1   | 41  | 30  | B lê A = 1; C lê B = 40                              |
| Após o passo 2 | 1   | 41  | 31  | B lê A = 1; C lê B = 41 confirmado no passo anterior |

O exemplo confirma que cada relação avança um passo e que todos os cálculos leem o mesmo retrato.

## Saldo acumulável

O exemplo usa unidade monetária e passo de um mês.

```text
dívida inicial = 100
déficit por passo = +8
pagamento por passo = -3
fluxo líquido = +5
```

| Momento        | Dívida anterior | Fluxo líquido | Dívida resultante |
| -------------- | --------------- | ------------- | ----------------- |
| Após o passo 1 | 100             | +5            | 105               |
| Após o passo 2 | 105             | +5            | 110               |

O déficit é um resultado válido. O estoque conserva o saldo anterior e recebe entradas e saídas; não é recalculado do zero.

## Convergência por autorrelação

O exemplo usa um índice artificial de 0 a 100 e uma transformação afim implementada pelo motor:

```text
próximo H = 0,5 × H anterior + 50
H inicial = 0
```

| Momento        | H anterior | Cálculo       | H resultante |
| -------------- | ---------- | ------------- | ------------ |
| Após o passo 1 | 0          | 0,5 × 0 + 50  | 50           |
| Após o passo 2 | 50         | 0,5 × 50 + 50 | 75           |

Os passos seguintes produzem 87,5; 93,75; 96,875 e assim por diante. O valor se aproxima de 100 pela regra do mecanismo; não existe corte posterior para 100.

## Ciclo de feedback

O exemplo usa dois valores calculados artificiais:

```text
próximo X = Y anterior + 1
próximo Y = X anterior ÷ 2

X inicial = 10
Y inicial = 0
```

| Momento        | X anterior | Y anterior | X resultante | Y resultante |
| -------------- | ---------- | ---------- | ------------ | ------------ |
| Após o passo 1 | 10         | 0          | 1            | 5            |
| Após o passo 2 | 1          | 5          | 6            | 0,5          |

O motor não tenta resolver o equilíbrio do ciclo dentro do passo. X e Y leem o mesmo retrato e evoluem ao longo do tempo.

## Lei e consequência artificiais

Para provar o fluxo de conteúdo sem antecipar uma lei real, o exemplo de cadeia pode ser empacotado como uma política fictícia chamada `programa_teste_educacao`. Depois de autorização simulada pela bancada, sua implantação envia o controle A ao motor. A consequência usa o mecanismo afim para contribuir com B, e B contribui com C no passo seguinte.

A política, os indicadores e os coeficientes existem somente para teste. A documentação e o JSON devem identificá-los como artificiais e sem fonte empírica.

## Resultado da revisão

As quatro referências produzem resultados determinados por contas independentes do executor. Elas cobrem propagação por passo, estoque, convergência, autorrelação e feedback. O futuro executor estará correto nesses casos quando reproduzir os valores dentro da tolerância definida no SG012 e preservar todo o estado diante de uma falha.
