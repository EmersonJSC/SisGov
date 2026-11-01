# Eleição e desgaste

Passo 9 (01/nov/2026). O motor não conhece o nome da lei de mandato: ele
procura, entre as leis vigentes, a lei de opções cujas opções declaram
`mandato_anos`. A duração é a da opção vigente; mandato de N anos = 6N
turnos. Sem lei de mandato vigente, não há eleição.

## Desgaste

Todo governo se desgasta: **2,25 pontos por mandato de 4 anos**, ou seja,
2,25 ÷ 24 por turno, sempre, mesmo depois de ganhar a eleição. O jogador
ainda não reduz o desgaste (expande depois).

## Apoio e voto

Apoio do governo = média da satisfação dos grupos, pesada pelas pessoas de
cada grupo − desgaste. O adversário fica com 100 − apoio. Grupos que se
sobrepõem (um ambientalista também é trabalhador) contam nos dois.

## Eleição

No último turno do mandato (turno − início do mandato = 6N), na etapa 9:

- apoio acima de 50: o governo vence; começa outro mandato com o desgaste
  que já tinha;
- 50 ou menos: o governo perde e a **partida termina**. Avançar um turno
  depois disso é erro.

O resultado fica no estado: turno, apoio, adversário, desgaste, margem e o
voto de cada grupo (satisfação e peso em pessoas).

## Comportamento esperado (escrito antes), `npm run eleicao`

País de teste declara mandato de 4 anos: eleição no turno 24.

- governo parado: os grupos ficam perto de 50 (a renda cresce só no ritmo
  esperado), o desgaste é 2,25 e o governo **perde por pouco** (apoio
  perto de 48);
- transferência de renda 2% → 4%: os trabalhadores, o maior grupo, sobem
  uns 18 pontos e o governo **vence**;
- imposto sobre empresas 25% → 35%: os empresários caem, mas são poucos;
  o governo perde por um pouco mais que parado;
- o país pobre se comporta igual: parado perde por pouco.

Ficam de fora: reduzir o desgaste, radicais e lealistas no voto, perder o
poder fora da eleição, cadeiras mudando depois da eleição, limite de
reeleição.
