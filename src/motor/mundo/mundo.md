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

### Pedaço 2: a opinião de cada potência (aprovado em 01/nov/2026)

**Posição do país na bússola** = média das leis vigentes, eixo por eixo:

- lei de opções: a posição da opção em vigor;
- lei contínua: a reta entre a posição do mínimo e a do máximo, no valor
  atual (não legislada = mínimo);
- lei que não declara um eixo não entra na média desse eixo; eixo que
  nenhuma lei declara fica em 0. Todas as leis valem igual.

**Opinião desejada** de cada potência = 100 × (1 − f²), onde f = distância ÷
2√2 (a maior distância possível, de um canto ao oposto). Curva, não reta
(decidido em 01/nov): 100 com o país na mesma posição, 0 no canto oposto, e
a potência perdoa a diferença pequena (f = 0,25 dá 94; f = 0,5 dá 75) mas a
nota despenca perto do oposto (f = 0,75 dá 44).

**Opinião** (0 a 100), uma por potência:

- a de partida vem do país (`opinioes` no `estado-inicial.json`); o país
  precisa declarar todas as potências, e só elas;
- a cada turno, depois das leis novas, anda 10% da distância até a desejada;
- separada da opinião dos pops; sem potências nas regras, não há opinião.

Partida salva antes do pedaço 2 carrega com as opiniões de partida do país.

### Pedaço 3: reputação internacional (01/nov/2026)

- **Reputação** = média das opiniões das potências, pesada pelo `peso`
  (soma dos pesos é 1, então fica de 0 a 100).
- O índice que recebe a reputação é declarado em `potencias.json`
  (`indice_reputacao`); o motor não sabe o nome. Esse índice é calculado a
  cada turno, na etapa do mundo, e vale também no turno 0. O valor que o
  país declarou para ele no `estado-inicial.json` não conta.
- As leis deixam de mexer direto nela (saem os efeitos da pena de morte,
  terras indígenas e áreas protegidas); a bússola faz o trabalho.
- Sem potências nas regras, o índice continua como era (base + leis).
- A escala da opinião desejada fica como está (decidido em 01/nov): hoje as
  potências não chegam a odiar o país porque faltam leis nas pontas da
  bússola; testa de novo quando houver mais leis.

### Pedaços seguintes (ainda sem código)

- **Segurança externa** (aprovado em 02/nov/2026, sem corte): o país parte do
  **poder defensivo** e perde, em pontos, o quanto as potências o desgostam:
  `segurança externa = poder defensivo − (100 − reputação)`, travada em 0 a
  100. Como a reputação já é a média das opiniões pesada pelo `peso`, a
  potência grande pesa mais e não há limiar: quanto pior a opinião, maior a
  perda. Com opinião 100 de todas, a segurança é o próprio poder defensivo.
  Hoje as opiniões ficam em 86–99 (perda de uns 7 pontos); só passa a pesar
  de verdade com leis nas pontas da bússola (passo 13). Os dois índices são
  declarados em `potencias.json` (`indice_poder_defensivo` e
  `indice_seguranca_externa`, opcionais); o motor não sabe os nomes. Calculada
  na etapa do mundo, no turno 0 também; o valor do `estado-inicial.json` não
  conta. O país pode ser atacado, mas nunca começa guerra; o ataque em si
  fica para depois.
- `npm run mundo` mostra uma lei mudada movendo cada opinião para o lado
  certo, a média batendo e a segurança caindo com potência hostil.
- O mapa mostra as potências e a opinião de cada uma.

**Fica de fora:** comércio (vai ser automático, com o mercado), sanções,
ataques, potência que muda de posição sozinha.
