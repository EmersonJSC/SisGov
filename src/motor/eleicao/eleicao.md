# Eleição e desgaste

Passo 9 (01/nov/2026); dois turnos, adversários e promessa no passo 8 da ordem de construir (12/nov/2026), descritos na seção "Eleição em dois turnos" abaixo. O motor não conhece o nome da lei de mandato: ele
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

## Eleição em dois turnos (passo 8, 12/nov/2026)

Código: `tipos.ts`, `chapas.ts`, `votos.ts`, `promessa.ts`; a etapa do turno é
`turno/etapas/eleicao.ts` (a etapa Política ficou só com a base e o desgaste).

**Quando.** Mandato de M turnos. No turno M−1 vota o **primeiro turno**; no
turno M sai o **resultado**: se alguém passou da metade no primeiro, vale ele;
senão, o **segundo turno** entre os dois mais votados. Perdeu, a partida acaba
no turno M (o último turno jogável); ganhou, o mandato novo começa em M.
`estado.eleicao` só é preenchido no resultado; antes disso o primeiro turno
fica em `estado.campanha.primeiro`.

**Adversários (R13.9).** O governo e a coligação dele formam uma chapa. Cada
partido da oposição lança a sua, e os que defendem os mesmos grupos
(semelhança ≥ 0,6 entre o que defendem) se coligam, do maior para o menor.
Sem Congresso no país, o governo enfrenta uma oposição só.

**Voto.** No primeiro turno cada grupo dá ao governo a sua satisfação (menos
o desgaste, mais o que a promessa pesa) e reparte o resto entre as chapas da
oposição pelo quanto cada uma defende aquele grupo. Com uma oposição só, dá a
mesma conta de antes (apoio = satisfação média − desgaste). No segundo turno,
quem votou numa chapa que saiu vai para o governo na medida em que a chapa
dela se parece com ele (só 1/4 disso, pela rejeição) e o resto vai para o
rival: oposição dividida em partidos muito diferentes pode dar ao governo uma
chance que não tinha no primeiro.

**Aprovação (R9.9).** É a satisfação média dos grupos pesada pelas pessoas:
`satisfacaoMedia`. Já era o que o Congresso e a eleição liam; agora aparece na
janela Eleição.

**Promessa (R13.11).** Uma meta do mandato: um **índice** (valor de hoje →
meta) ou um **programa** (formá-lo). O tamanho vai de 0 a 1 (quanto do domínio
do índice a meta atravessa, cheio com 30%; programa vale 0,5). É avaliada no
primeiro turno: cumprimento de 0 a 1 (chegar perto vale em parte); o efeito no
voto do governo é `tamanho × (2 × cumprimento − 1) × 0,06`, então cumprida dá
voto, quebrada tira e a metade não muda nada. Cumprimento abaixo de 0,5 soma
desgaste (`tamanho × 1`). Índice **principal** (lista em
`mundo/indicadores/principais.json`) pesa em todos os grupos; subíndice pesa
mais em quem o cobra; programa, mais em quem gostou dele (lembrança > 0).
**Trocar** a promessa no meio do mandato conta a antiga como quebrada
(`campanha.quebradas`). Fatos: `meta-cumprida`, `meta-quebrada`,
`segundo-turno`.

**Ficam de fora.** O prêmio ainda não desconta o que o país faria sozinho
("prometer o que acontece de qualquer jeito dá quase nada"); chapa de partido
e candidato (R13.4–R13.6), campanha (R13.7), reduzir o desgaste (R13.8),
mídia e bússola dos candidatos no voto (R13.3).
