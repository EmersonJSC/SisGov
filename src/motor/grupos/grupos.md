# Grupos de interesse

Um **grupo** lê os pops. Os tipos de grupo são do mundo
(`conteudo/mundo/grupos/`); o motor não conhece os nomes. Cada grupo declara:

- `membros`: que fração de cada pop pertence a ele (0 a 1). Grupos podem se
  sobrepor (um ambientalista também é trabalhador ou classe média).
- `cobra`: índices (essenciais ou de jogabilidade) e o sentido que o grupo
  quer (`1` = subir, `-1` = descer).

A lei declara o que cada grupo quer dela (passo 7b, 01/nov/2026):

- lei contínua: `"grupos": { "<grupo>": "mais" | "menos" }`;
- lei de opções: cada opção traz `"grupos": { "<grupo>": "apoia" | "rejeita" }`.

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
- **Leis contínuas:** o quanto a lei andou da posição do marco, em fração da
  faixa, × 50 (atravessar a faixa inteira = 50 pontos). Lei não legislada
  conta como o mínimo da faixa.
- **Leis de opções:** apoia = +1, rejeita = −1, nada = 0; (nota de agora −
  nota do marco) × 5.

## Radicais e lealistas (% do grupo)

- Alvo dos radicais = 5 + 2 × (35 − satisfação), se a satisfação está abaixo
  de 35; senão 5.
- Alvo dos lealistas = 5 + 2 × (satisfação − 65), se está acima de 65;
  senão 5.
- Cada um anda no máximo **1 ponto por turno** rumo ao alvo. Começam em 5.

Uma crise curta não vira revolta; um mandato inteiro de insatisfação vira.

## Comportamento esperado (escrito antes), país de teste, `npm run grupos`

- turno 1 sem mudar nada: todos perto de 50 (só o sorteio do crescimento
  mexe com os empresários);
- transferência de renda 2% → 4% do PIB: trabalhadores sobem uns 15 pontos
  (renda + lei); classe média e empresários quase não mudam no turno 1; no
  fim do mandato a dívida maior pesa um pouco nos empresários;
- imposto sobre empresas 25% → 35%: empresários caem uns 8 pontos;
- áreas protegidas 10% → 20%: ambientalistas sobem (lei + meio ambiente
  depois do atraso); empresários não mudam;
- um mandato sem mudar nada: satisfação perto de 50 (o sorteio do
  crescimento decide se fica um pouco acima ou abaixo); radicais e
  lealistas ficam em 5. (Antes do passo 9 subia uns 8 pontos só com o
  tempo, e o governo parado se reelegia.)
