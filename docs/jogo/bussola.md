# A bússola política (a base do jogo)

Escrito em 01/nov/2026. Resume como a bússola funciona hoje e para onde ela
cresce. O comportamento de cada peça está no `.md` do módulo
(`src/motor/leis/leis.md`, `src/motor/mundo/mundo.md`).

## O que é

Um plano com **2 eixos**, cada um indo de −1 a +1:

| Eixo | −1 | +1 |
|---|---|---|
| `economico` | esquerda | direita |
| `social` | libertário | autoritário |

Os 2 eixos dão **4 polos** (os quatro cantos). Uma posição é um ponto
contínuo no plano, não uma casinha de matriz: dá para estar em 0,37 de
econômico e −0,62 de social. A maior distância possível é de um canto ao
oposto: 2√2 (≈ 2,83).

## Quem tem posição

- **Lei:** cada opção (lei de opções) ou cada ponta da faixa (lei contínua,
  `bussola.min` e `bussola.max`) tem um ponto. A lei pode falar de só um eixo.
- **Grupo:** posição própria, mais um peso por eixo; a reação do grupo a uma
  lei conta eixo por eixo.
- **Pop:** posição que desliza devagar com a vida dele (ideia do escopo,
  seção 11; ainda não feita).
- **Potência:** posição fixa (passo 11). Cada uma tem opinião própria do país.
- **O país:** não é declarado. Sai das leis vigentes.

## Posição do país

Média simples das leis vigentes, eixo por eixo (`posicaoDoPais`):

- lei de opções: o ponto da opção em vigor;
- lei contínua: reta entre o ponto do mínimo e o do máximo, no valor atual
  (não legislada = mínimo da faixa);
- lei que não declara um eixo não entra na média desse eixo;
- eixo que nenhuma lei declara fica em 0.

Hoje todas as leis valem igual.

## Opinião das potências

- **Desejada** = 100 × (1 − f²), com f = distância ÷ 2√2. Curva: 100 no mesmo
  ponto, 0 no canto oposto, perdoa a diferença pequena e despenca perto do
  oposto (f 0,25 → 94; 0,5 → 75; 0,75 → 44). Decidido pelo autor em 01/nov.
- **Opinião** anda 10% da distância até a desejada por turno.
- **Reputação internacional** = média das opiniões pesada pelo `peso` de cada
  potência. Nenhuma lei mexe nela direto: ela só reflete a bússola.

## Limites de hoje

- Com as 15 leis atuais o país fica perto do centro (f ≲ 0,4); as desejadas
  ficam entre 86 e 99. Faltam leis nas pontas (principalmente autoritário);
  testar de novo no passo 13.
- As opiniões de partida dos países de teste (55 a 85) estão abaixo das
  desejadas: a reputação sobe sozinha nos primeiros turnos. Ajuste de números
  pendente de decisão do autor.

## Como cresce (ainda não feito)

- **3º ou 4º eixo:** é só acrescentar o nome em `EIXOS`
  (`src/motor/leis/tipos.ts`) e declarar o eixo nos JSONs. Só a conta fica
  presa a 2 em três lugares: o tipo `PontoBussola`, os acumuladores de
  `posicaoDoPais` e o `hypot` da distância (a distância máxima vira 2√N).
  Refatorar para laço sobre `EIXOS` é pedido separado.
- **Peso por lei** (`peso_bussola` em cada lei): lei grande puxa mais o país
  que lei pequena. Mudança de comportamento, pedido separado.
- **Potência que muda de posição** com o tempo: fica fora do passo 11.
