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

## Normalização (D-40)

Qualquer consequência pode ler a origem como razão antes do mecanismo:

```json
"normalizacao": { "divisor": "pib", "multiplicador": 100 }
```

A entrada vira `origem ÷ divisor × multiplicador`. Com o PIB como divisor e
multiplicador 100, o mecanismo recebe o **gasto em % do PIB**: "1% do PIB em
educação" tem a mesma força em qualquer país. O divisor precisa ter domínio
com mínimo > 0, e origem e divisor são lidos do mesmo retrato (mesmo atraso).

## Explicação

Cada contribuição registra mecanismo, parâmetros, valor da origem, entrada
usada (a razão, se houver) e resultado. É isso que a tela "Por que mudou?"
(SG146) vai mostrar.

## Trimestre → mês

O conteúdo é escrito por trimestre e executado por mês. A conversão reescreve
os parâmetros de forma exata para cada mecanismo (testado em
`nonLinearMechanisms.test.ts`), então escrever por trimestre continua valendo.
