# País em frases

> **Status: PROPOSTA (28/out/2026).** Aguardando aprovação do autor.
> Item 2 da ordem de 25/out no [PLANO](../../../PLANO.md).

## 1. O que é

O mapa diz como o país está em frases, não em números internos do motor.

## 2. Regras

### 2.1 O encanamento sai do mapa

Passo de conta não é indicador. O motor precisa do hiato da meta e do primário
antes do corte; o jogador não tem o que fazer com eles. Eles saem do mapa pela
área `Dados internos`, que já era a convenção.

**`medida.tecnico` não quer dizer "esconder".** Quer dizer "sem estatística
real". A aprovação do governo é técnica nesse sentido — é construto do jogo, não
número de instituto de pesquisa — e é a bolha mais importante da tela. Confundir
as duas coisas apaga a aprovação do jogo.

### 2.2 Cada bolha tem faixas com frase

No molde das réguas que já existem (`conteudo/mundo/reguas.json`): a faixa diz
até que valor vale e a frase que a descreve.

| Hoje | Depois |
| --- | --- |
| Atividade econômica: 44,7 | A economia está parada |
| Concentração de mercado: 31% | Poucas empresas dominam a maioria dos setores |

A frase descreve o **estado**, não o movimento. O movimento vem da comparação
(2.4).

### 2.3 A frase descreve, não julga

Sai o `tom: "bom" | "ruim"` das faixas. O jogo não diz ao jogador que a lei
dele é ruim nem que o caminho dele é errado: diz o que aconteceu e com o que
comparar. Quem julga é quem joga.

Isso vale também para cor: verde e vermelho julgam. A faixa pode ter intensidade
(quanto o valor é extremo) sem ter sinal (se isso é bom).

### 2.4 Comparação em vez de adjetivo

Em vez de "desemprego alto", "o desemprego é o maior desde 2017".

**Decidido pelo autor (28/out): a referência é o passado do próprio país.** O
motor já guarda o valor dos turnos anteriores, e é a comparação que o jogador
entende sem estudar nada.

Ficam de fora por ora, e não entram sem o autor pedir:

- **O país sem as decisões do jogador** (o piloto automático, já na visão como
  `semVoce`), que responderia "o que eu causei?". É mais difícil de ler: exige
  o jogador entender que existe um país paralelo.
- **Outro país**, que exige dado comparável e arrisca comparação desonesta.

### 2.5 O número não desaparece, recua

A bolha mostra a frase. O número real aparece ao abrir a bolha, na medida de
verdade (`medida.valor`), nunca nos pontos do motor.

Razão: o jogador precisa ver quanto mexeu quando muda uma lei, senão perde a
noção de causa e efeito — que é o jogo inteiro. Esconder a frase atrás do
número é ruído; jogar o número fora é tirar o aprendizado.

## 3. Entradas e saídas

- **Lê:** valor da bolha, a medida real, o valor do piloto automático
  (`semVoce`) e o histórico de turnos.
- **Entrega:** a frase de cada bolha para o mapa, o jornal e a janela da bolha.

## 4. No código

- `conteudo/mundo/reguas.json`: **não é a casa das frases.** As 30 réguas são
  indexadas por **id de lei** e o único consumidor é `ui/mapa/ReguaDaLei.tsx`,
  a régua da janela da lei; `reguas.test.ts` exige uma para cada lei com
  deslizante. O `mede: "variavel"` quer dizer "a régua desta lei mostra um
  índice que ela move", não "régua de indicador". Pôr as frases das bolhas aqui
  as endereçaria por lei, que é errado.
  O que se aproveita é só o **molde** da faixa (`{ate, rotulo}`) e a lição de
  neutralidade: as faixas de lei hoje dizem "faixa saudável" e "alto:
  informalidade e desemprego" — é desse julgamento que o jogo sai (2.3).
- **Casa proposta das frases:** `faixas` na própria variável, em
  `conteudo/mundo/indicadores/variaveis.json`, ao lado de `medida`,
  `faixaVisual` e `avaliacao`. A descrição do indicador fica num lugar só, e o
  endereçamento é pelo id do indicador.
- `avaliacao: "maior_pior" | "maior_melhor"` também carrega direção de valor.
  Fica (dizer que mais desemprego é pior não julga a ideologia do jogador), mas
  entra na revisão de neutralidade da fase 3.
- `app/partida/pressao.ts`, `nosForaDoMapa`: exclui `Dados internos` do mapa.
  A parte 1 usou isso, sem código novo.
- `app/partida/visao.ts:349`: a visão já omite `medida` de quem é `tecnico`.
- `ui/mapa/formatos.ts`, `valorNaTela`: converte pontos do motor para a medida
  real; é por onde a frase entra na tela.

## 5. Fases

| Fase | O que se constrói | Estado |
| --- | --- | --- |
| 1. Encanamento fora | 11 passos de conta vão para `Dados internos`; teste que separa conta de país | **feito** (28/out, `paisEmFrases.test.ts`) |
| 2. Piloto do tom | ~10 bolhas de áreas diferentes ganham faixas com frase, para o autor aprovar o tom | a fazer |
| 3. Lote | as ~140 restantes, em lotes por área; `tom` sai das réguas de lei | a fazer |

A fase 2 vem antes da 3 de propósito: são ~440 frases no total, e escrever
todas num tom que o autor rejeita é o desperdício mais caro possível.

## 6. Piloto do tom (fase 2, para o autor aprovar)

Seis bolhas de áreas diferentes, nas medidas reais que o jogador vê. O tom
proposto: **frase curta, concreta, sem adjetivo de valor**. Onde dá, a
quantidade vira uma coisa imaginável (uma pessoa em cada doze, uma área
conhecida) em vez de um número solto.

**PIB real** (índice, jan/2025 = 100)

| até | frase |
| --- | --- |
| 95 | a economia encolheu |
| 102 | a economia está parada |
| 115 | a economia cresce devagar |
| — | a economia cresce rápido |

**Desemprego** (taxa de desocupação, %)

| até | frase |
| --- | --- |
| 5 | quase todo mundo que procura trabalho encontra |
| 9 | uma pessoa em cada doze procura trabalho sem achar |
| 14 | uma pessoa em cada oito está sem trabalho |
| — | mais de uma pessoa em cada sete está sem trabalho |

**Inflação** (ao consumidor em 12 meses, %)

| até | frase |
| --- | --- |
| 2 | os preços estão quase parados |
| 6 | os preços sobem devagar |
| 12 | os preços sobem rápido: o salário compra menos a cada mês |
| — | os preços disparam |

**Desigualdade** (Gini da renda domiciliar per capita)

| até | frase |
| --- | --- |
Pela observação do autor, a frase fala das **classes**, não da distância
abstrata: o que muda com a desigualdade é quem se parece com quem.

| até | frase |
| --- | --- |
| 0,40 | ricos, classe média e pobres vivem em mundos próximos |
| 0,50 | a classe média está mais perto dos pobres do que dos ricos |
| — | uma minoria no topo concentra a renda; o resto se parece entre si |

Nenhuma delas afirma proporção ("os 10% mais ricos ganham 12 vezes"), porque
esse número teria de vir de fonte e hoje viria da minha cabeça. Se o autor
quiser a proporção, ela entra como `leitura` do indicador, com fonte.

**Desmatamento** (área desmatada por ano, mil km²)

Sergipe sai: o autor está certo e eu tinha errado contra o próprio desenho do
projeto. Comparar com um estado brasileiro prende o mundo ao Brasil, e mundo e
país foram separados em 25/out. A comparação genérica é com **a própria
floresta do país** e o tempo que ela dura nesse ritmo — vale em qualquer país,
e o número sai de `paises/<pais>/` (área de floresta), não do mundo.

| até | frase |
| --- | --- |
| 1 | a floresta está praticamente de pé |
| 6 | nesse ritmo, a floresta dura mais de um século |
| 22 | nesse ritmo, a floresta acaba em algumas décadas |
| — | nesse ritmo, a floresta acaba dentro de uma geração |

O "nesse ritmo" é honesto: é uma projeção do presente, não uma previsão. E
responde o que o jogador quer saber — se dá tempo de consertar.

**Concentração de mercado** (% de setores com HHI acima de 2.500)

O autor marcou como não entendível, e estava certo: "setor" e "HHI" são
jargão, e a frase anterior descrevia a estatística em vez do que ela significa.
O que o jogador sente da concentração é **quem manda no preço** e se ele tem
para onde ir. A frase passa a dizer isso, e "mercado" substitui "setor".

| até | frase |
| --- | --- |
| 10 | em quase todo mercado há empresas disputando o cliente |
| 30 | em parte dos mercados, poucas empresas mandam no preço |
| — | em quase todo mercado, poucas empresas mandam no preço |

A unidade técnica (`% de setores com HHI acima de 2.500`) continua na janela da
bolha, para quem quiser o número. O mapa mostra a frase.

**O que o autor decide aqui:**

1. O tom serve? Compare com o que existe hoje nas réguas de lei ("faixa
   saudável", "alto: informalidade e desemprego"): essas julgam, estas
   descrevem.
2. As comparações de área (Distrito Federal, Sergipe) prendem o jogo ao Brasil,
   e o mundo foi separado do país em 25/out. Ou a comparação vai para
   `paises/brasil/`, ou o mundo usa só número. **Conferir os km² antes de
   valer**: estão de memória, não de fonte.
3. Os cortes de faixa (5%, 9%, 14% de desemprego) são de jogo, não de
   estatística. Precisam de régua do autor ou servem como estão?

## 7. Testes (comportamento)

- Nenhum passo de conta tem bolha no mapa; o motor continua calculando todos.
- As coisas do país ficam no mapa mesmo sem estatística real (a aprovação).
- Toda bolha do mapa tem nome e área.
- Toda bolha com faixas tem frase em cada faixa, e as faixas cobrem a escala
  inteira sem buraco.
- Nenhuma faixa de indicador tem `tom` de julgamento.

## 8. Decidido e em aberto

**Decidido (28/out):**

1. **O tom serve** — frase curta e concreta, sem adjetivo de valor. Aprovado
   sobre o piloto da seção 6, com três frases refeitas pelas observações do
   autor (desigualdade por classes, desmatamento sem estado brasileiro,
   concentração sem jargão).
2. **A referência de comparação é o passado do próprio país** (2.4). Piloto
   automático e comparação entre países ficam fora.

**Em aberto:**

3. **Confirmar 2.5:** frase na frente, número ao abrir.
4. **Os cortes de faixa** (5%, 9%, 14% de desemprego) são de jogo, não de
   estatística, e hoje saíram do meu julgamento. Servem como estão ou o autor
   tem régua própria?
5. **A área de floresta por país**, que a frase do desmatamento passa a exigir
   em `paises/<pais>/` para o "nesse ritmo, dura…" ter conta por trás.
