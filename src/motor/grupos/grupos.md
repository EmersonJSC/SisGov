# Grupos de interesse

> 03/nov: o mundo tem 16 grupos (operários, serviços e domésticos, gente do campo,
> sem trabalho formal, educação e saúde, burocracia, militares, pequeno comércio,
> escritório/técnicos/tecnologia, estudantes, cultura e imprensa, aposentados,
> indústria, finanças, donos de terra, ambientalistas). Os números e nomes dos
> cenários abaixo são da época dos 4 grupos (trabalhadores, classe média,
> empresários, ambientalistas).

Um **grupo** lê os pops. Os tipos de grupo são do mundo
(`conteudo/mundo/grupos/`); o motor não conhece os nomes. Cada grupo declara:

- `membros`: que fração de cada pop pertence a ele (0 a 1). Grupos podem se
  sobrepor (um ambientalista também é trabalhador ou classe média).
- `cobra`: índices (essenciais ou de jogabilidade) e o sentido que o grupo
  quer (`1` = subir, `-1` = descer).

- `bussola`: posição do grupo em dois eixos, de −1 a +1, e `peso` de cada
  eixo (0 a 1, o quanto o grupo liga para ele):
  - `economico`: esquerda (−) ↔ direita (+);
  - `social`: verde, libertário (−) ↔ tradicional, autoritário (+). O meio
    ambiente mora aqui, do lado de baixo (eixo GAL-TAN da pesquisa Chapel
    Hill; decidido com o autor em 01/nov/2026).

A lei diz **onde fica na bússola**, nunca qual grupo gosta dela (bússola,
01/nov/2026; substitui a lista `grupos` de cada lei):

- lei contínua: `"bussola": { "min": {…}, "max": {…} }`, a posição no mínimo
  e no máximo da faixa; o valor de agora fica na reta entre os dois;
- lei de opções: cada opção traz `"bussola": {…}`;
- eixo que a lei não cita é 0 nas duas pontas: ninguém reage a ele. Lei sem
  `bussola` não mexe na ideologia de ninguém (ex.: duração do mandato).

Grupo novo só declara a própria posição; nenhuma lei precisa mudar.

## Satisfação (0 a 100)

Tudo é medido contra o **marco**, o estado do turno 0: no começo da partida
todo grupo está em 50. A cada turno, satisfação = 50 + renda + índices + leis,
presa entre 0 e 100.

- **Renda:** renda real média dos membros (renda dos pops ÷ nível de preços,
  pesada pelas pessoas), comparada com a **renda esperada**: a do marco
  crescendo na tendência do país (passo 9, 01/nov/2026). 1 ponto por 1% de
  diferença, até ±25. Crescer no ritmo normal não agrada ninguém; só crescer
  acima dele, ou a lei que dá renda, sobe a satisfação.
- **Índices cobrados:** 1 ponto por ponto do índice, no sentido que o grupo
  quer, até ±15 por índice.
- **Leis (bússola):** eixo por eixo, o quanto cada lei **se aproximou** do
  grupo desde o marco: (distância no marco − distância agora) × peso do
  eixo × 50. Aproximar soma, afastar tira; um grupo de centro reclama da
  lei que vai para qualquer ponta. Lei não legislada conta como o mínimo da
  faixa. Ex.: imposto sobre empresas vai de +0,6 (0%) a −0,6 (60%); subir
  10 pontos de imposto anda 0,2 para a esquerda; os empresários (+0,7, peso
  1. perdem 10 pontos, os trabalhadores (−0,5, peso 1) ganham 10. Uma lei
     só move o grupo no máximo **±15** (como um índice): nenhuma lei sozinha
     decide o humor de um grupo.

## Pops deslizam na bússola (R8.5, 03/nov)

A bússola é interna: o jogador não a vê, só sente o apoio, a satisfação e os
votos. Cada pop tem a sua (`pops.json`) e anda um pouco por turno (`deslize`
no estado, quanto andou desde o começo). Duas forças, até ±0,02 por eixo:

- **vida** (só econômico): renda real abaixo do que se espera puxa o pop para a
  esquerda, acima para a direita (cheia a ±25%);
- **governo** (os dois eixos): pop satisfeito (média dos grupos dele) se
  aproxima da posição do país; insatisfeito se afasta.

Teto: 0,3 de onde começou, sempre entre −1 e +1. A bússola do grupo é a
declarada mais a média, por pessoas, do deslize dos pops dele (turno 0 = a
declarada). Isso muda os votos do Congresso e a satisfação. A mídia fica para
depois.

## Radicais e lealistas (% do grupo)

- Alvo dos radicais = 5 + 2 × (35 − satisfação), se a satisfação está abaixo
  de 35; senão 5.
- Alvo dos lealistas = 5 + 2 × (satisfação − 65), se está acima de 65;
  senão 5.
- Cada um anda no máximo **1 ponto por turno** rumo ao alvo. Começam em 5.

Uma crise curta não vira revolta; um mandato inteiro de insatisfação vira.

## Comportamento esperado da bússola (escrito antes), `npm run grupos` e `npm run congresso`

- sem mudar nada: igual a antes (a bússola só conta o que mudou);
- transferência 2% → 4%: trabalhadores sobem como antes; empresários caem
  já no turno 1 (antes só caíam no fim, pela dívida); ambientalistas quase
  não mudam;
- imposto sobre empresas 25% → 35%: empresários caem uns 10 pontos;
  trabalhadores sobem um pouco (antes não mexiam);
- áreas protegidas 10% → 20%: ambientalistas sobem; empresários caem um
  pouco; classe média quase não muda;
- pena de morte para crimes graves: classe média sobe, ambientalistas caem
  (antes ninguém reagia);
- duração do mandato: ninguém reage;
- Congresso: o partido vota pelos pontos que a mudança dá aos grupos que
  ele defende (soma pesada; sinal decide). Transferência 2% → 4% continua
  passando; o Movimento Verde continua contra o licenciamento frouxo.

Observado (01/nov, com o limite de ±15 por lei, que entrou ao medir: a pena
de morte tirava 55 pontos dos ambientalistas de uma vez):

- sem mudar nada: igual a antes;
- transferência 2% → 4%: trabalhadores 68 (como antes), empresários 38 já no
  turno 1, classe média 45 (está em cima da lei e reclama dos dois lados),
  ambientalistas 53;
- imposto sobre empresas 35%: empresários 38, trabalhadores 60 (sobem mais
  que "um pouco"), classe média 45;
- áreas protegidas 20%: ambientalistas 61, empresários 44, classe média 45;
- pena de morte para crimes graves (prévia): ambientalistas −15, classe
  média +4,5, empresários −3; duração do mandato: ninguém reage;
- Congresso: transferência 2% → 4% passa com 110 (igual). **Mudou:**
  imposto de renda 20% → 30% agora passa com 110 (verde e centro votam com
  o governo: a classe média quase não perde, a lei estava perto dela);
  licenciamento frouxo passa com 150, os ambientalistas caem a 29 e o verde
  sai da base no turno 8.

O comportamento de antes da bússola (passo 9) está no git.
