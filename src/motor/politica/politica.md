# Política: Congresso

Passo 8 (01/nov/2026). Regime da V1: presidencialismo, câmara única,
maioria simples. Os **partidos são do país** (`paises/<id>/congresso.json`):
cada país tem os seus, com nomes próprios. O motor só conhece "partido",
"cadeiras", "governo" e "coligação".

Cada partido declara:

- `cadeiras`: quantas tem no Congresso;
- `defende`: os grupos do mundo que representa e o peso de cada um
  (`{ "trabalhadores": 1, "ambientalistas": 0.3 }`).

O país declara também o partido do `governo` (o do jogador), a `coligacao`
inicial (a base, que inclui o governo) e a `maioria` (fração das cadeiras
que precisa votar sim; 0,5 = mais da metade).

## Votação

Todo pedido de mudar lei vai a voto na etapa 1 do turno. Pedido derrotado
não muda nada. Sem Congresso nas regras, todo pedido passa (scripts de
economia).

- **Exorbitante:** lei contínua que anda mais de 1/3 da faixa num pedido só.
  Todos votam não, até o governo.
- **Opinião do partido:** soma, pelos grupos que defende, do peso × os
  pontos que a mudança daria ao grupo pela bússola (motor/grupos: o quanto
  a lei se aproxima dele). Lei não legislada conta como o mínimo da faixa
  (ou nenhuma opção).
- **Voto:** o partido do governo vota sim. Os outros: opinião > 0, sim;
  < 0, não; = 0, a base vota sim e a oposição vota não.
- Passa quando os votos sim passam de `maioria` × total de cadeiras.

## A base reage

Na etapa 9, cada partido da coligação (menos o governo) olha a satisfação
média dos grupos que defende, pesada pelo `defende`. Abaixo de 35, ele sai
da coligação e vira oposição. Voltar à base, fazer coligação nova e mudar
cadeiras vêm com a eleição (passo 9).

## Comportamento esperado (escrito antes), país de teste, `npm run congresso`

Teste tem 200 cadeiras; base = trabalhista + verde + centro (110).

- transferência de renda 2% → 4%: base vota sim (trabalhista e centro
  defendem trabalhadores, verde é neutro e acompanha), oposição não; passa
  com 110;
- imposto de renda 20% → 30%: verde e centro defendem a classe média e
  votam contra; só o governo vota sim; cai (com a bússola, passa: ver
  abaixo);
- transferência de renda 2% → 6% (40% da faixa): exorbitante, todos votam
  não; cai;
- licenciamento ambiental frouxo: o liberal (empresários) vota com o
  governo, o verde vota contra; passa. Ao longo do mandato os
  ambientalistas perdem satisfação; se caírem abaixo de 35, o verde sai da
  base.

Observado (01/nov): os três primeiros casos como o esperado (110 × 90,
60 × 140, 0 × 200). O licenciamento frouxo passa com 135; os ambientalistas
caem a 41 e voltam a 48 no fim do mandato, então o verde fica na base. Uma
lei só não racha a base; a saída está coberta pelo teste do módulo.

Com a bússola (01/nov): o imposto de renda 20% → 30% passa com 110 (verde e
centro votam com o governo); o licenciamento frouxo passa com 150 e o verde
sai da base no turno 8, quando os ambientalistas ficam abaixo de 35.
