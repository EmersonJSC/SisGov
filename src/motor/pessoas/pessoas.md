# Pessoas e o partido do jogador

O motor não conhece nomes. O país declara listas de nomes (`pessoas.json`); o
gerador sorteia o elenco pela semente: mesma semente, mesmas pessoas.

## Gerador (`gerarPessoas`)

- **Entrada:** nomes próprios (f e m), sobrenomes, quantidade, fração de
  técnicos e os partidos com cadeiras e bússola.
- **Origem:** partido pelo peso das cadeiras, ou técnico (sem partido).
- **Bússola:** em torno da bússola do partido de origem (desvio 0,25); técnico
  em torno do centro (desvio 0,45). A bússola do partido é a média dos grupos
  que ele defende (`bussolaDoPartido`).
- **Notas:** competência, habilidade, carisma, honestidade e lealdade,
  normais em torno de 55 (desvio 18), de 5 a 95.
- **Nome:** próprio + sobrenome, sem repetir; repetiu, ganha 2º sobrenome.
- **Idade:** de 35 a 74. Envelhecer, aposentar e morrer ainda não existem.

## Ministros sorteados (`sortearMinistros`)

Cada caixa, na ordem, fica com quem tem maior nota de
`competência/100 + 0,8 × (1 − distância à chapa) + 0,3 × acaso`. A chapa e quem
o jogador já pôs não entram. O que o jogador escolheu fica.

## Partido do jogador

- **Lado:** a bússola é a média da chapa; o partido defende os 5 grupos mais
  perto dela (`defendeDaBussola`), peso total 1,2.
- **Cadeiras:** 6% do Congresso, tiradas na proporção dos partidos de origem da
  chapa (de todos, se a chapa for só de técnicos). Vale para Câmara e Senado.
- **Coligação:** o partido novo e os partidos de origem das três pessoas. O
  partido que governava vira oposição, ou entra se o jogador pedir.
- **Id:** a sigla em minúsculas; não pode repetir a de outro partido.

## Rosto (fora do motor)

O motor não guarda desenho. A tela inicial desenha cada pessoa com o DiceBear
(`@dicebear/core` + `@dicebear/notionists`, desenho CC0, código MIT) em
`src/tela/inicio/aparencia.ts`: o id é a semente, então a mesma pessoa tem sempre
o mesmo rosto. O fundo vem da paleta da mesa e só mulher não tem barba. O estilo
**não** tem tom de pele, cor de cabelo nem cabelo por sexo: a variedade de pele
do elenco não aparece no retrato.
