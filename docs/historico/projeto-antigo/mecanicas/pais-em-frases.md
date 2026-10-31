# País em frases

> **Status: PROPOSTA (28/out/2026).** Aguardando aprovação do autor.
> Item 2 da ordem de 25/out no [PLANO](../../../PLANO.md).

## 1. O que é

O mapa diz como o país está em frases, não em números internos do motor.

## 2. Regras

### 2.1 O encanamento sai do mapa — e é bem menos do que parece

Passo de conta não é indicador, e sai do mapa pela área `Dados internos`, que
já era a convenção.

**Mas o critério não é "parece conta".** A visão descarta uma ligação quando
origem ou alvo está fora do mapa, então esconder um nó esconde as setas que
passam por ele — e a seta é como o jogador vê a causa, que é a premissa do
jogo. A regra é:

> **Nó que é origem de seta para uma bolha visível fica no mapa**, mesmo que
> pareça um passo intermediário.

Na primeira tentativa (28/out) escondi onze nós. Sete eram explicação de bolha
visível e tiveram de voltar; sobraram quatro. Quem descobriu foi o teste
`naoEsconderSeta`, não o julgamento de quem escreveu. Os sete:

| nó | o que explicava |
| --- | --- |
| `salario_minimo_efetivo` | desemprego, desigualdade, custo trabalhista, empresários |
| `reajuste_nominal_do_minimo` | greve geral, aposentados, pobres, trabalhadores |
| `meta_primario`, `primario_sem_corte`, `hiato_da_meta` | o contingenciamento: a regra fiscal explicada |
| `juros_hiato` | o juro implícito |
| `carga_evento_demanda` | a pressão hospitalar |

O que sobrou escondido são três bandeiras tiradas de lei
(`existe_salario_minimo`, `reajuste_segue_crescimento`, `subordinacao_bc`) e
uma contagem usada como escala (`beneficios_atrelados_ao_minimo`) — nenhuma
com seta para bolha visível.

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

### 2.3 Porcentagem vira gente contável, por conta

Indicador em porcentagem não precisa de faixa escrita à mão: a frase sai de
uma função. `emCada()` acha a fração de denominador pequeno mais perto do
valor e escreve em palavras.

| valor | frase |
| --- | --- |
| 8,3% | uma pessoa em cada doze |
| 25% | uma pessoa em cada quatro |
| 50% | metade das pessoas |
| 90% | nove pessoas em cada dez |
| 0% e 100% | nenhuma pessoa · todas as pessoas |

Os extremos têm leitura própria porque "dez em cada dez" é pior que "todas".
O sujeito vem do indicador (`pessoa`, `ocupado`) e carrega gênero, porque o
numeral concorda: "uma pessoa em cada doze", mas "um ocupado em cada doze".

Isso cobre de uma vez a maioria dos indicadores do mapa, sem conteúdo por
indicador. Faixa redigida à mão fica só para quem não é porcentagem de gente
(PIB em índice, desmatamento em km², Gini).

### 2.4 A frase descreve, não julga

Sai o `tom: "bom" | "ruim"` das faixas. O jogo não diz ao jogador que a lei
dele é ruim nem que o caminho dele é errado: diz o que aconteceu e com o que
comparar. Quem julga é quem joga.

Isso vale também para cor: verde e vermelho julgam. A faixa pode ter intensidade
(quanto o valor é extremo) sem ter sinal (se isso é bom).

### 2.5 Comparação em vez de adjetivo

Em vez de "desemprego alto", "o desemprego é o maior desde 2017".

**Decidido pelo autor (28/out): a referência é o passado do próprio país.** O
motor já guarda o valor dos turnos anteriores, e é a comparação que o jogador
entende sem estudar nada.

Ficam de fora por ora, e não entram sem o autor pedir:

- **O país sem as decisões do jogador** (o piloto automático, já na visão como
  `semVoce`), que responderia "o que eu causei?". É mais difícil de ler: exige
  o jogador entender que existe um país paralelo.
- **Outro país**, que exige dado comparável e arrisca comparação desonesta.

### 2.6 Três jeitos de ter frase, e só um dá trabalho

Nem todo indicador precisa de faixa redigida. A escolha é pela unidade:

| Jeito | Quando | Exemplo |
| --- | --- | --- |
| **Função** | porcentagem de gente | `emCada()`: "uma pessoa em cada doze" |
| **Modelo com o número** | quantidade que se entende sozinha | "perdem-se 22 mil km² de floresta por ano" |
| **Faixa escrita** | índice ou jargão sem leitura direta | Gini, HHI, PIB em índice |

**O número entra na frase quando ele é a notícia** (observação do autor,
28/out). Esconder "22 mil km²" atrás de "a floresta recua rápido" tira
justamente o dado que o jogador precisa para decidir. Já "índice de atividade
44,7" não informa nada e tem de sair.

Isso reduz muito a fase 3: só o terceiro jeito custa redação. Os dois
primeiros são código e valem para qualquer país.

### 2.7 O número não desaparece, recua

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
  informalidade e desemprego" — é desse julgamento que o jogo sai (2.4).
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
- `app/partida/frase.ts` (28/out): `emCada()` escreve porcentagem em gente
  (2.3) e `partePerdidaPorAno()` usa a floresta do país. Teste em
  `frase.test.ts`.
- **Território do país** (28/out): `territorio.florestaMilKm2` em
  `paises/<pais>/pais.json`, com `fonte`. O tipo está em `PaisV2` e em
  `ScenarioManifest.territorio`; `expandirPais.ts` repassa, e o campo precisou
  entrar na lista de chaves previstas do cenário em `validateContentFile.ts`
  (o validador recusa chave nova, e o teste pegou isso). O motor não lê: quem
  usa é a camada da partida.

## 5. Fases

| Fase | O que se constrói | Estado |
| --- | --- | --- |
| 1. Encanamento fora | 4 nós sem seta visível vão para `Dados internos`; teste que separa conta de país e o invariante `naoEsconderSeta` | **feito** (28/out, `paisEmFrases.test.ts`) |
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
país foram separados em 25/out.

**A moldura de tempo também sai, por estar errada.** Eu havia proposto "nesse
ritmo, a floresta acaba em algumas décadas" para o corte de 22 mil km² por ano.
O Brasil tem cerca de 5.000 mil km² de floresta: 5.000 ÷ 22 dá **227 anos**,
não décadas. A frase soava concreta e era falsa por quase dez vezes. Projeção
de esgotamento exigiria a área de floresta por país e uma conta que ninguém
pediu; o indicador mede ritmo, então a frase fala de ritmo.

Pela observação do autor de 28/out, o desmatamento é do segundo jeito de 2.6:
a frase **traz o número**, porque é importante saber quanto se está
desmatando. Não há faixa a redigir — é um modelo:

> **perdem-se {área} mil km² de floresta por ano** — cerca de {parte} da
> floresta do país

Com os números do Brasil: "perdem-se 22 mil km² de floresta por ano — cerca de
0,4% da floresta do país". A parte só aparece onde o país declarou a floresta;
sem ela, fica só a área.

A faixa continua existindo para a cor e o tamanho da bolha, mas sem frase
própria.

"Devagar" e "rápido" comparam ritmo, não julgam valor — a régua de 2.4 continua
valendo. A área perdida em km² fica a um clique, pela decisão de 2.7.

**Com a floresta declarada pelo país (28/out), a frase pode dizer a parte.** O
país agora declara `territorio.florestaMilKm2`; o Brasil tem 4.966 mil km²
(FAO, 2020). Daí sai a parte perdida por ano:

| desmatamento | parte da floresta por ano |
| --- | --- |
| 6 mil km² | 0,12% |
| 22 mil km² | 0,44% |

**E o dado desmente a frase dramática.** Mesmo no pior corte da régua,
perde-se menos de meio por cento da floresta por ano. Não há como dizer
"acaba em décadas" com honestidade — a aritmética dá séculos. Se a frase for
falar de parte, ela dirá "perde-se cerca de meio por cento da floresta por
ano", que é verdade e é menos impressionante do que a intuição sugere.

Isso é informação de desenho, não problema: o indicador de desmatamento pesa
no jogo pelo que ele move na rede (clima, pressão internacional, povos
originários), não por esgotar a floresta dentro de um mandato.

**Lição para a fase 3:** frase que embute conta ("dura um século", "equivale a
X") precisa da conta feita e conferida. Sem dado por trás, a frase descreve o
que o indicador mede e nada mais.

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
2. **A referência de comparação é o passado do próprio país** (2.5). Piloto
   automático e comparação entre países ficam fora.

3. **Frase na frente, número ao abrir** (2.7): confirmado pelo autor.
4. **Os cortes de faixa** (5%, 9%, 14% de desemprego) ficam como estão. São
   escolha de jogo, não estatística; mexer neles antes de ver o jogo rodando
   seria adivinhar. Entram na calibragem (item 10 da ordem).
5. **Área de floresta por país: não entra.** O autor dispensou, e a frase do
   desmatamento deixou de precisar quando a projeção de tempo saiu (seção 6).

**Em aberto:**

6. **O desmatamento não chega ao clima nem à poluição.** Hoje ele move
   queimadas, enchente, estiagem e os ambientalistas; o autor aponta (28/out)
   que deve mover também aquecimento e poluição. O indicador
   `emissoes_carbono` existe e não recebe seta do desmatamento. É trabalho de
   rede (mecânica 5), não desta; fica anotado para não se perder.
7. **"Concentração de mercado" como nome de bolha** é jargão, e nenhuma frase
   salva um título que o jogador não entende. O autor deixou para depois,
   junto com uma revisão do indicador. Candidatos: "Domínio de poucas
   empresas", "Poder das grandes empresas".
