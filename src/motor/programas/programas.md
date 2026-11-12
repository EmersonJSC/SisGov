# Programas

Passo 6 da ordem de construir (12/nov/2026). Um programa é um jeito de governar
feito de várias leis ("Saúde da família": verba, atenção preventiva, vacinação).
O motor não conhece nome de programa: os **programas** são do mundo (abas
Programas e Programas - leis da planilha, gerados por `npm run programas` em
`mundo/programas/programas.json`); os **moldes de nome** também
(`mundo/programas/nomes.json`); o **nome próprio** é do país
(`paises/<id>/programas.json`, campo `nomes`, opcional).

Código: `tipos.ts`, `direcao.ts` (quanto a lei andou), `nomes.ts`, `vida.ts`
(forma, espera, desfaz, lembrança), `index.ts` (porta, validação e o turno).

## A conta (R7.18)

- Cada programa lista leis com **direção** (`sobe`, `desce`, `muda`) e **mínimo**:
  `degrau` (um degrau da escada ou um passo da régua), `ativa` (a lei liga ou
  desliga) ou uma fração da régua (0,1 = 10%).
- A lei "andou" quando, desde o **começo do mandato**, o valor se moveu na
  direção pedida pelo menos o mínimo. Lei que já estava lá no começo não conta.
- O programa **forma-se** quando `minimo` das leis andaram (ex.: 3 de 4). Se o
  governo deixa as leis voltarem abaixo disso, **desfaz-se**.
- Mandato novo: o ponto de partida das leis passa a ser o de hoje. Programa já
  formado guarda o ponto de partida do mandato em que se formou e só se desfaz
  se as leis voltarem.

## Passo do ministro mais fraco (R7.21)

Cumprido o mínimo, o programa espera tantos turnos quanto o **maior atraso**
entre as leis dele (o atraso vem da competência do ministro de cada lei, 0 ou
1 turno; ministro competente não adianta nada). Se as leis voltam durante a
espera, o programa não se forma.

## Lembrança e nostalgia (R7.19)

Ao se formar, cada grupo guarda quanto gostou (+) ou detestou (−) do que as
leis andadas fizeram, de −1 a +1 (a mesma conta de `pontosLei`, na escala do
voto). Desfeito, a vida fica como `desfeito` com a mesma lembrança: é a
nostalgia. Refeito, volta com o **mesmo nome** (`vezes` conta quantas).
**Ainda não lê:** o voto do Congresso e os grupos (dívida abaixo).

## Nome (R7.20)

1. O país deu um nome próprio ao programa: vale ele.
2. Senão, um molde ("mais {bem}", "{tema} para {publico}"…) preenchido com as
   quatro palavras da planilha. O molde sai do id do programa: o mesmo
   programa tem sempre o mesmo nome.
3. Sem moldes, vale o nome da planilha.

## Programas que o país já tem

`paises/<id>/programas.json` pode listar `formados`: `{ "programa": "id",
"lembranca": { "grupo": nota } }`. Eles começam **formados desde o turno 0**,
com as leis de hoje contadas a partir do zero (referência vazia, então valem
"desde sempre"), o nome do país e, se o país não diz a `lembranca`, a que sai do
que as leis de hoje fazem a cada grupo (mesma conta da formação). O Brasil 2026
traz Farmácia Popular, Saúde da Família e Bolsa Família. Se as leis voltarem,
desfazem-se como qualquer outro.

## Estado e fatos

`estado.programas = { mandato, referencia, formando, vidas }`. A etapa do turno
(8c, depois do Governo, antes da Política) lê as leis já mudadas. Escreve na
mesa de fatos `programa-formado` (grande; médio se refeito) e `programa-desfeito`
(médio), com o id do programa em `sobre`.

## Dívidas

- A lembrança pesar no voto do Congresso e nos grupos (R7.19).
- Perguntar ao jogador se usa o mesmo nome quando o programa é refeito, e
  rebatizar.
- Direções ambíguas da planilha ("aberto", "mais livre", "mais curto"…) lidas
  como `sobe`; conferir uma a uma (`npm run programas` lista).
- 21 ligações a leis que o jogo ainda não tem (compra pública de comida, divisão
  da verba de construção…); "Economia verde" ficou de fora por falta de leis.
