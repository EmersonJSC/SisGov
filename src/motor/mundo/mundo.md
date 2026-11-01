# Mundo: as grandes potências

As potências são do mundo (`conteudo/mundo/potencias/potencias.json`); o
motor não conhece os nomes. Elas lembram blocos reais, mas **não usam nome
real** (decidido com o autor em 01/nov/2026).

## Comportamento esperado (escrito antes; passo 11)

### Pedaço 1: o JSON das potências

Cada potência declara:

- `id` (kebab-case), `nome` e `descricao`;
- `bussola`: posição nos dois eixos (`economico`, `social`), de −1 a +1,
  os mesmos dos grupos (`src/motor/grupos/grupos.md`). **Os dois eixos são
  obrigatórios**: potência sem posição não entra;
- `peso`: o quanto ela conta no mundo (0 a 1). A soma dos pesos é 1;
- `relacoes`: para cada **outra** potência, de −1 (rivais) a +1 (aliadas).
  Toda potência cita todas as outras, e o par tem o mesmo valor dos dois
  lados.

O validador recusa: potência sem posição, eixo fora de −1 a +1, peso fora de
0 a 1 ou soma diferente de 1, relação com potência que não existe, relação
consigo mesma, relação faltando, relação diferente nos dois lados, id
repetido.

### Pedaços seguintes (ainda sem código)

- **Opinião** (0 a 100): uma por potência, a de partida declarada pelo país.
  A cada turno anda um passo pequeno na direção da opinião que a potência
  "gostaria" de ter: quanto mais perto o país está dela na bússola, mais
  alta. Separada da opinião dos pops.
- **Reputação internacional** = média das opiniões pesada pelo `peso`. As
  leis deixam de mexer direto nela; a bússola faz o trabalho.
- **Segurança externa** (0 a 100, índice novo): cai quando potência forte tem
  opinião ruim do país. O país pode ser atacado, mas nunca começa guerra; o
  ataque em si fica para depois.
- `npm run mundo` mostra uma lei mudada movendo cada opinião para o lado
  certo, a média batendo e a segurança caindo com potência hostil.
- O mapa mostra as potências e a opinião de cada uma.

**Fica de fora:** comércio (vai ser automático, com o mercado), sanções,
ataques, potência que muda de posição sozinha.
