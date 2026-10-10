# Mecanismos da rede

**Estado:** implementado no SG141 (9/out/2026). Fonte:
`src/engine/mechanisms/calculateContribution.ts`.

Toda consequência liga um nó de **origem** a um nó **alvo** e escolhe um
mecanismo. O mecanismo diz quanto a origem contribui para o alvo a cada passo.
É sempre determinístico: mesma entrada, mesmo resultado, em qualquer país
(D-39).

| Mecanismo | Parâmetros | Contribuição (x = entrada) | Quando usar |
|---|---|---|---|
| `afim` | `coeficiente`, `termoConstante` | c·x + k | relação reta, proporcional |
| `saturacao` | `maximo`, `escala` | máximo·(1 − e^(−x/escala)) | efeito com teto: depois de um ponto, gastar mais quase não muda nada |
| `retornos_decrescentes` | `coeficiente`, `escala` | c·escala·ln(1 + x/escala) | cada unidade a mais rende menos, mas nunca para de render |
| `limiar` | `limiar`, `coeficiente`, `direcao` (`acima`/`abaixo`) | c·max(0, x − L) ou c·max(0, L − x) | só age depois de um ponto (ex.: pressão hospitalar acima de 70) |

- `saturacao` e `retornos_decrescentes` exigem origem com domínio mínimo ≥ 0.
- `escala` é sempre > 0. Um `maximo` ou `coeficiente` negativo faz o efeito
  reduzir o alvo.

## Normalização (razão entre nós)

Qualquer consequência pode ler a origem como razão antes do mecanismo:

```json
"normalizacao": { "divisor": "pib", "multiplicador": 100 }
```

A entrada vira `origem ÷ divisor × multiplicador` (ex.: gasto por habitante,
participação de um gasto no total). É uma ferramenta opcional, não uma regra:
o PIB importa e país rico gasta mais. O divisor precisa ter domínio
com mínimo > 0, e origem e divisor são lidos do mesmo retrato (mesmo atraso).

### Produto entre nós (`fator`, D-50)

A normalização também multiplica:

```json
"normalizacao": { "fator": "consumo", "multiplicador": 0.00708333 }
```

A entrada vira `origem × fator ÷ divisor × multiplicador` (divisor e fator são
opcionais, mas um dos dois é obrigatório). É assim que o orçamento entra na
rede (SG157): imposto = alíquota × base; juros = taxa × dívida. O fator é lido
do mesmo retrato da origem; quando é uma bolha calculada, ela é calculada
antes do alvo. A tela recebe também uma seta do fator para o alvo
(`mecanismo: "produto"`).

### Leitura do nível (`leitura`)

A origem de uma lei entrega nível × eficácia. Com `"leitura": "nivel"`, a
consequência lê só o nível: a conta de dinheiro custa ou arrecada o que foi
aprovado, funcione a lei bem ou mal. Todas as setas de lei para receita e gasto
usam essa leitura.

## Ordem no mês e ciclos

As bolhas calculadas entram depois de quem as alimenta (origem, divisor e
fator). Num ciclo, entra primeiro a bolha de menor ID do ciclo, e ela lê o mês
anterior no elo que fecha o ciclo (D-42). Quem só depende de um ciclo, sem
fazer parte dele, espera o ciclo inteiro (corrigido no SG157: antes podia
entrar cedo e ler o mês anterior sem necessidade).

## Explicação

Cada contribuição registra mecanismo, parâmetros, valor da origem, entrada
usada (a razão, se houver) e resultado. É isso que a tela "Por que mudou?"
(SG146) vai mostrar.

## Trimestre → mês

O conteúdo é escrito por trimestre e executado por mês. A conversão reescreve
os parâmetros de forma exata para cada mecanismo (testado em
`nonLinearMechanisms.test.ts`), então escrever por trimestre continua valendo.
