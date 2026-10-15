# Eleição, partido e personagens (V1-39)

**Status:** APROVADO pelo Emerson em 15/out/2026 (respostas na seção 10).
Nada programado ainda. A 1ª versão tratava o jogador como o
presidente; o Emerson corrigiu: **o jogador é o partido**.

## 0. Resumo

**Você é um partido.** No começo do jogo você dá o nome a ele. O partido
escolhe quem disputa a Presidência, governa por meio desse presidente e
responde nas urnas.

**Os personagens.** Um gerador monta os nomes que podem ser candidatos:
alguns são **pessoas reais** (com o ponto na bússola tirado dos dados, como
Lula, FHC ou Bolsonaro), outros são **gerados do nada** (nome, origem,
carreira, ideologia e uma biografia curta). Cada personagem tem um lado e uma
ideologia, mas o jogo não os mostra: ficam subentendidos no que ele pensa. É isso que traz a história e o enredo para o jogo.

**O candidato.** Antes de cada eleição o partido escolhe um personagem. Se
ele for muito diferente da base do partido, a base estranha: parte dos seus
eleitores e das suas cadeiras não acompanha. Vice fica para depois.

**A eleição.** No turno 16 votam os **2.090 perfis sintéticos** do V1-08,
entre o seu candidato e os candidatos dos outros campos (também saídos do
gerador). Cada perfil decide pela distância na bússola e pela economia do
mandato. Se ninguém passa de 50% dos válidos, há 2º turno. Pesquisas mostram
a intenção de voto ao longo do mandato.

**Depois.** Se o seu candidato vence, o partido governa mais um mandato e o
Congresso é refeito. Se perde, o jogo acaba com o balanço (oposição fica
para a versão 2). Regras do Brasil no JSON do país; método no JSON do mundo.

## 1. O que existe hoje (medido em 15/out no código)

- `src/game/congresso/calculo.ts` já tem a eleição como peça:
  `chancesDoPerfil` (logit com distância na bússola e bônus) e `eleger`
  (soma dos perfis pelo peso; sai a fatia e o eleitor de cada candidato).
  A eleição presidencial **reaproveita as duas funções**.
- **O seu partido já existe** no Congresso (V1-11, `partidoDoJogador`): um
  bloco que começa com 5% das cadeiras, cujo ponto é o rumo das suas leis e
  que atrai cadeiras pelo troca-troca. Este documento dá a ele um nome, uma
  base e um candidato.
- `bussola/referencias.json` tem **66 personalidades reais** com ponto na
  bússola (V-Party), 5 delas brasileiras (Brizola, Lula, Dilma, FHC,
  Bolsonaro). É a semente dos personagens reais.
- `paises/brasil/politica.json` ainda tem o `estadoPolitico` antigo (3
  partidos fictícios e 4 perfis). **Sai** com este chamado.
- Leis eleitorais existem no motor (`law.eleicao`), mas nada as usa ao votar.
- No fim do turno 16 nada acontece.

Limite: no teste de mandato de 15/out, inflação e desemprego quase não
mexem. O voto econômico depende disso e será recalibrado depois do V1-38.

## 2. O partido

### 2.1 Começo do jogo

1. **Nome do partido.** A primeira tela pede o nome (e a sigla, opcional,
   gerada a partir do nome se ficar em branco). Esse nome aparece no
   Congresso, nas notícias e nas pesquisas no lugar de "seu partido".
2. **Escolha do candidato** entre os personagens gerados (seção 3).
3. O jogo começa como hoje: o candidato já venceu a eleição de 2026 e o
   partido entra no governo com poucas cadeiras (decisão 1 da seção 10).

### 2.2 O ponto e a base do partido

- **A bússola é do país, não do partido.** Ela mostra onde estão as leis em
  vigor e anda com cada lei aprovada, como no `bussola.md` (sem mudança).
- **Ideologia do partido.** O partido tem um ponto próprio, guardado à parte
  e usado só para medir o estranhamento da base (2.3). Ele nasce no ponto do
  primeiro presidente escolhido (o partido nasce em volta de quem o lidera)
  e, a cada novo presidente, anda uma parte (`passoDaIdeologia`, inferido
  0,3) em direção a ele. Assim o lado aparece na pessoa que você escolhe, sem
  o jogo perguntar.
- **Base do partido.** São os perfis que votam no partido, que o V1-11 já
  calcula (`eleitor` de cada candidato em `eleger`). A tela mostra a base por
  segmento: "o seu eleitor é 40% pobre, 30% evangélico…".

### 2.3 A base estranha

Quando o partido escolhe um candidato, mede-se a distância na bússola entre
o candidato e o ponto do partido. Até uma **tolerância** (inferida: 2 pontos
da bússola), nada acontece. Acima dela, o **estranhamento** cresce com a
distância e tem três efeitos, todos no JSON:

1. **No voto:** os perfis da base do partido perdem nota pelo candidato
   (além da distância, que já pesa sozinha). Parte deles vota no adversário
   ou anula.
2. **No Congresso:** a disciplina das cadeiras do partido cai
   (`disciplinaDoJogador`, hoje 0,9) pelo resto do mandato, e o troca-troca
   tira cadeiras do partido para a bancada mais perto da base.
3. **Na notícia:** uma manchete do tipo "Base do partido reage à escolha de
   X", que o jogador vê antes de confirmar (com o tamanho do estranhamento).

Exemplo real que serve de referência: o PT com Dilma em 2010 (candidata sem
história no partido, aceita pela base por causa de Lula) e a migração de
eleitores tucanos para Bolsonaro em 2018 (base que não seguiu o candidato do
partido). Ficam como exemplos, não como regra.

## 3. O gerador de personagens

### 3.1 O que é um personagem

| Campo | Exemplo | Para que serve |
| --- | --- | --- |
| Nome | "Helena Duarte Siqueira" | Narrativa, notícias |
| Real ou gerado | gerado | Real tem ponto dos dados; gerado tem ponto sorteado |
| Idade, gênero, estado de origem | 54, mulher, Pernambuco | Narrativa; origem dá um pequeno bônus regional (versão 2) |
| Carreira | sindicalista, empresária, militar, pastor, juíza, economista, médica, professora, policial, ruralista, artista, prefeita, governadora, deputada | Liga a segmentos (pastor → Evangélicos; sindicalista → Trabalhadores) |
| Ponto na bússola | economia −3,5, costumes +1,2 | O voto espacial |
| Lado (oculto) | esquerda, centro, direita | Sai do ponto; só o motor usa |
| Ideologia (oculta) | trabalhismo | Escolhe as opiniões; nunca aparece na tela |
| Opiniões | "O salário mínimo tem de subir acima da inflação" | O que o jogador lê; dela ele deduz o lado |
| Carisma | 0 a 3 | Bônus pequeno na nota de todos os perfis |
| Experiência | 0 a 3 | Bônus pequeno; dá ar de "nome conhecido" |
| Biografia | 3 ou 4 frases | O enredo (seção 3.4) |

### 3.2 Personagens reais

- Saem de uma lista no JSON do país, começando pelas 5 personalidades
  brasileiras que a bússola já tem, com o mesmo ponto (V-Party), mais outras
  com fonte (por exemplo, nomes de governadores e ministros, com o ponto do
  partido deles no V-Party).
- Só fatos públicos: nome, carreira, partido de origem, cargos. **Nenhum
  atributo inventado que possa ofender** (escândalo, crime, vício) é dado a
  pessoa real. Carisma e experiência de pessoa real vêm de regra simples
  (cargos que ocupou), escrita no JSON.
- Uma opção no JSON (`personagensReais: true/false`) desliga as pessoas
  reais, para quem preferir um Brasil só fictício.

### 3.3 Personagens gerados do nada

1. **Lado e ideologia.** Sorteia-se uma ideologia da lista do mundo (3.5),
   respeitando a quantidade pedida por campo.
2. **Ponto.** O centro da ideologia na bússola mais um desvio sorteado
   (ninguém é igual ao rótulo).
3. **Carreira.** Sorteada entre as compatíveis com a ideologia (um ruralista
   socialista é raro, mas possível com chance baixa).
4. **Nome, gênero, idade e origem.** Nomes e sobrenomes das listas mais
   comuns do IBGE (Censo 2010, "Nomes no Brasil"); origem pesada pela
   população de cada estado; idade entre 35 (mínimo da Constituição para
   presidente, art. 14) e 75.
5. **Carisma e experiência.** Sorteados, com a carreira puxando (governadora
   tem mais experiência que artista).
6. **Biografia** pelos moldes da seção 3.4.

Tudo com a semente da partida: a mesma semente gera os mesmos personagens.

### 3.4 A narrativa (biografia e opiniões)

**Regra (Emerson, 15/out): o personagem não declara lado nem ideologia.** A
tela nunca escreve "esquerda", "direita", "trabalhista" ou "liberal" sobre
ele. O jogador deduz o lado lendo a biografia e as opiniões, como faz com um
político de verdade. Lado e ideologia existem só dentro do motor.

**Opiniões.** Cada personagem mostra de 3 a 5 frases sobre temas concretos
(salário mínimo, impostos, privatização, armas, aborto, drogas, religião na
escola, meio ambiente, polícia). Cada frase do JSON tem um ponto na bússola;
o gerador escolhe as que ficam mais perto do ponto do personagem, de temas
diferentes. Exemplos: "Empresa pública estratégica não se vende"; "O
cidadão de bem tem direito de se defender"; "A escola não é lugar de
religião".

**Franqueza (Emerson, 15/out).** Como na vida real, uns falam por rodeios e
outros dizem tudo. Cada frase tem uma **intensidade** (1 sutil, 2 clara, 3
explícita) e cada personagem tem uma **franqueza** sorteada de 0 a 3 (a
carreira puxa: pastor e sindicalista tendem a falar mais claro que
economista e juíza). A franqueza decide o tipo de frase escolhida:

| Franqueza | Frases | Exemplo (mesmo ponto) |
| --- | --- | --- |
| 0 discreto | Só sutis | "O Brasil precisa voltar a crescer com responsabilidade" |
| 1 moderado | Sutis e claras | "O governo gasta demais e cobra imposto demais" |
| 2 direto | Claras e uma explícita | "Vou privatizar o que não é estratégico" |
| 3 sem filtro | Explícitas | "Sou de direita e conservador, com orgulho" |

Só a frase explícita, dita pelo próprio personagem, pode nomear um lado; o
jogo, nas fichas e nos rótulos, nunca o faz. Um discreto é difícil de ler:
o jogador pode escolher alguém que a base vai estranhar sem perceber, o que é
parte do jogo. A franqueza também pode virar efeito no voto mais tarde
(versão 2: o explícito mobiliza a base e afasta o centro).


Cada carreira e cada ideologia tem frases-molde no JSON, com lacunas:

> "{nome} nasceu em {cidade}, {estado}, em {ano}. {frase da carreira}.
> {frase da ideologia}. {frase do caminho até a política}."

Exemplos de frases (a escrever com base em trajetórias reais, sem citar
pessoas): carreira "Começou como metalúrgico e liderou greves no ABC"; "Foi
juíza federal e ganhou fama em processos de corrupção"; opinião
"Defende a presença do Estado na economia e os direitos trabalhistas"
(a frase descreve o que pensa, sem rótulo).
Isso dá variedade sem escrever centenas de biografias à mão, e o mesmo molde
serve para outros países.

### 3.5 As ideologias (lista do mundo, primeira versão)

Cada uma tem um centro na bússola, as carreiras mais comuns e uma frase.

| Lado | Ideologias |
| --- | --- |
| Esquerda | socialismo, trabalhismo, social-democracia, ecologismo |
| Centro | social-liberalismo, democracia cristã, desenvolvimentismo, fisiologismo (centrão) |
| Direita | liberalismo econômico, liberal-conservadorismo, conservadorismo religioso, nacional-populismo |

Os centros saem das personalidades e partidos de referência que a bússola já
tem (média dos partidos de cada família no V-Party), não de chute.
A lista é nossa; nada vem da lista de grupos do Democracy 4.

### 3.6 Quem aparece para escolher

- **Para você:** 4 a 6 personagens, cobrindo os três lados por dentro (pelo
  menos um de cada, sem dizer qual é qual), um ou dois reais se a opção estiver ligada. Na primeira escolha não
  há estranhamento (o partido ainda não tem base). Nas seguintes, o jogo
  mostra o estranhamento de cada um antes de confirmar.
- **Para a oposição:** cada outro campo recebe um personagem gerado, do lado
  dele, com o ponto puxado para o eleitor mediano (`convergencia`, 0,3;
  candidato a presidente fala para o centro, Downs 1957).
- **Reeleição:** o seu presidente pode concorrer de novo uma vez (EC
  16/1997). Depois disso, o partido tem de escolher outro, o que resolve o
  limite de mandatos de forma natural.

## 4. Como a eleição funciona de verdade

### 4.1 Regras do Brasil (as que entram no jogo)

| Regra | Fonte | No jogo |
| --- | --- | --- |
| Mandato de 4 anos, eleição no 1º domingo de outubro | CF, art. 77 | Turno 16 (último trimestre do ano 4) |
| Maioria absoluta dos votos válidos; senão, 2º turno entre os dois primeiros | CF, art. 77, §§ 2º e 3º | Regra `maioriaAbsoluta` com 2º turno |
| Branco e nulo não contam como válidos | Lei 9.504/97, art. 2º | Só os votos válidos repartem |
| Uma reeleição seguida | EC 16/1997 | Personagem com 2 mandatos seguidos não concorre |
| Idade mínima de 35 anos para presidente | CF, art. 14, § 3º | Gerador |
| Lei que muda o processo eleitoral não vale na eleição que ocorra até 1 ano depois | CF, art. 16 (anualidade) | Lei eleitoral aprovada nos últimos 4 turnos só vale na eleição seguinte |
| No ano da eleição, é proibido criar programa social novo | Lei 9.504/97, art. 73, § 10 | Para depois (decisão 5) |
| Voto obrigatório de 18 a 70 anos; facultativo de 16 a 17 e acima de 70 | CF, art. 14 | Comparecimento por idade |
| Senado renova 2/3 e 1/3 alternadamente | CF, art. 46 | 2030: 54 cadeiras; 2034: 27 |
| Câmara renova inteira, proporcional | CF, art. 45; Código Eleitoral | Camada 1 do V1-11 (D'Hondt) |

Comparecimento real: cerca de 79% no 1º turno de 2022, com brancos e nulos
perto de 4% (TSE).

### 4.2 Reeleição no Brasil (a prova)

Quatro presidentes tentaram a reeleição; três venceram.

| Ano | Presidente | Ótimo/bom (aprox.) | Resultado |
| --- | --- | --- | --- |
| 1998 | FHC | ~40% | 53,1% no 1º turno, venceu |
| 2006 | Lula | ~50% | 60,8% no 2º turno, venceu |
| 2014 | Dilma | ~40% | 51,6% no 2º turno, venceu |
| 2022 | Bolsonaro | ~38% | 49,1% no 2º turno, perdeu |

Resultados do TSE. **As avaliações são aproximadas e serão conferidas** nas
séries do Datafolha antes da calibragem. Com ~40% de ótimo/bom o presidente
fica no fio da navalha; com 50%, vence com folga. O resultado de 2026 entra
quando o 2º turno (25/out) terminar.

### 4.3 O que a pesquisa acadêmica diz

- **Voto econômico.** O eleitor julga o governo pela economia, olhando para
  trás e para o país (retrospectivo e sociotrópico). Lewis-Beck e Stegmaier
  (2000); no Brasil, inflação e desemprego pesam mais que o PIB (Carreirão,
  2007).
- **Custo de governar.** Governos perdem em média cerca de 2 pontos por
  mandato só por ter governado (Paldam, 1986; Nannestad e Paldam, 2002).
- **Voto espacial probabilístico.** O eleitor escolhe o mais próximo, com
  ruído (Adams, Merrill e Grofman, 2005). Já usado no V1-11.
- **Partido e candidato.** No Brasil o voto presidencial é muito pessoal e a
  identificação partidária é baixa, com exceção do PT (Samuels e Zucco,
  2018). Por isso o candidato pesa mais que o partido na nota, e o
  estranhamento da base é um efeito moderado, não um desastre.
- **Benefícios sociais.** O Bolsa Família pesou no voto em Lula em 2006
  (Zucco, 2008). No jogo isso entra sozinho pela satisfação dos segmentos.
- **Erro das pesquisas.** A pesquisa da véspera subestimou Bolsonaro em
  cerca de 6 a 7 pontos dos válidos em 2018 e 2022 (Datafolha × TSE).

## 5. Como outros jogos fazem (e o que não copiamos)

| Jogo | Como é | O que levamos |
| --- | --- | --- |
| Democracy 4 | Você é o governo; eleitores simulados votam pela felicidade | Só a ideia pública de eleição no fim do mandato (`diferenciacao-d4.md`) |
| Crusader Kings | Personagens gerados com traços e biografia que contam a história | A ideia de personagem gerado com traços; nada de traços ou textos |
| Football Manager | Você é o clube; contrata e escolhe pessoas | A ideia de ser a instituição, não a pessoa |
| Tropico | Facções votam pela satisfação | Nada |
| The Political Machine | Campanha estado a estado | Versão 2 (campanha) |

O que é nosso: o jogador é o partido; personagens reais com ponto tirado de
dados e personagens gerados com ideologias da política brasileira; base que
estranha o candidato; eleitor de dados reais (V1-08); regras reais do país.

## 6. O voto

### 6.1 A fórmula

Para cada perfil `p` e candidato `c`:

```
nota(p, c) = −sensibilidade × distância(ponto do perfil, ponto de c)
           + carisma(c) + experiencia(c) + carreira(p, c)
           + [só o candidato do governo] economico + governo(p) − custoDeGovernar
           + [só o seu candidato, perfis da base] −estranhamento
```

- `economico` = `pesoEconomico` × mudança no mandato de `inflacao`,
  `desemprego` e `renda_familias`, cada uma pela sua escala (igual para todos).
- `governo(p)` = `bonusDoGoverno` × (satisfação do perfil − 50) ÷ 50. Já
  existe no V1-11.
- `carreira(p, c)`: bônus pequeno nos segmentos ligados à carreira.
- O termo do governo vale para o candidato do partido no poder, mesmo que
  seja outra pessoa: o eleitor julga o governo do partido.

A chance de voto é o logit de sempre (`chancesDoPerfil`) e a soma pelos
pesos dá a fatia (`eleger`). Nada de fórmula nova no motor.

### 6.2 Comparecimento e votos válidos

Cada perfil comparece com a chance da faixa de idade (tabela do TSE). Branco
e nulo saem como fração fixa e não contam.

### 6.3 Segundo turno

Se ninguém passa de 50% dos válidos, os dois primeiros vão ao 2º turno, um
turno a mais no calendário, sem leis, só com notícia e pesquisa.

### 6.4 Sorte

Resultado final = modelo + desvio sorteado com a semente, desvio-padrão
`ruido` (2 pontos, a ordem do erro das pesquisas). Desligável para testes.

## 7. Pesquisas

- **Quando:** uma por ano nos três primeiros anos; uma por turno no ano 4.
  Antes de o partido escolher o candidato do próximo mandato, a pesquisa
  testa os nomes possíveis ("com X você teria 44%, com Y 39%").
- **O que mostram:** 1º turno, 2º turno simulado, aprovação e o voto por
  segmento (onde o partido ganha e perde).
- **Como saem:** modelo + erro de amostra (2.000 entrevistas, ±2 pontos) +
  viés do instituto sorteado por partida. Margem de erro na tela.
- **Onde:** notícia no tablet e painel próprio (tela no Marco F).

## 8. Depois da eleição

**Vencer.**
- Novo mandato de 16 turnos. O presidente é o candidato eleito.
- Congresso refeito pela camada 1 do V1-11, com o humor de agora. O partido
  recebe parte dos votos do candidato (`arrasto`, inferido 0,5).
- Lua de mel do `capital.md` de novo, mais fraca se o presidente for o
  mesmo (`luaDeMelDaReeleicao`, 0,5); inteira se for um nome novo.

**Perder.** Fim de jogo com o balanço: resultado por segmento (quem largou o
partido), indicadores do começo e do fim, caminho do país na bússola,
leis aprovadas e revogadas, e os presidentes que o partido teve.

## 9. Configuração (tudo em JSON)

- `mundo/eleicao.json`: pesos do voto, `custoDeGovernar`, `convergencia`,
  `ruido`, pesquisas, `arrasto`, `luaDeMelDaReeleicao`, estranhamento
  (`tolerancia`, `pesoNoVoto`, `quedaDaDisciplina`, `passoDaIdeologia`).
- `mundo/personagens.json`: ideologias (centro na bússola, carreiras), opiniões (frase, tema e ponto na bússola),
  carreiras (segmentos ligados, faixa de carisma e experiência), moldes das
  biografias, faixas de idade.
- `paises/brasil/eleicao.json`: calendário (turno 16), regra de maioria e
  2º turno, limite de mandatos, anualidade, campos de bancadas, comparecimento
  por idade, brancos e nulos, renovação do Senado.
- `paises/brasil/personagens.json`: listas de nomes e sobrenomes (IBGE),
  peso de cada estado, personagens reais com fonte, `personagensReais`,
  quantos aparecem para escolher.

Números inferidos levam `"nota"` dizendo que são de partida. O salvo (V1-33)
guarda: nome do partido, personagens gerados, presidente atual e seus
mandatos, pesquisas publicadas, viés do instituto, economia no início do
mandato e o resultado da última eleição.

## 10. Decisões (respostas do Emerson, 15/out)

1. **Começo:** o jogo começa no governo. Na primeira tela você escolhe o
   presidente (entre os personagens gerados) e dá o nome ao partido.
2. **A bússola continua sendo do país** (correção do Emerson, 15/out): ela
   mostra as leis em vigor e não muda. O partido tem uma ideologia própria,
   que nasce no ponto do primeiro presidente e serve para a base estranhar
   candidatos (2.2 e 2.3).
3. **Pessoas reais:** sim, só com fatos públicos e com opção para desligar.
4. **Oposição:** um personagem gerado por campo (dois adversários).
5. **Condutas vedadas no ano 4:** ficam para depois.
6. **Sorte de 2 pontos no resultado:** sim.

## 11. Aceite e testes

1. **Mandato parado plausível:** 10 mandatos `nada`, sementes diferentes; o
   2º turno fica entre 45% e 55%.
2. **Bem avaliado vence, mal avaliado perde:** os 10 programas da bússola, 10
   sementes cada; governo com 50% de aprovação vence 9 em 10; com 30%, perde
   9 em 10.
3. **Base estranha:** o mesmo mandato com um candidato perto e um longe do
   ponto do partido; o longe perde votos da base e disciplina.
4. **Gerador:** mesma semente, mesmos personagens; todos com 35 anos ou mais;
   pelo menos um de cada lado na escolha; nenhum rótulo do jogo diz o lado ou
   a ideologia (só frase explícita dita pelo personagem); nenhuma pessoa real com atributo
   inventado.
5. **Vencer e perder:** vencer abre o mandato 2 com Congresso refeito e
   salvo/carga iguais; perder fecha com o balanço; terceiro mandato seguido
   do mesmo presidente é recusado.

## 12. Não entra

Vice, primárias internas, campanha e debates, propaganda, coligações,
fundir ou trocar de partido, jogar na oposição depois de perder, eleições de
governador e prefeito, presidente que discorda do partido (versão 2).

## Fontes

- Constituição Federal, arts. 14, 16, 45, 46 e 77; EC 16/1997.
- Lei 9.504/1997 (Lei das Eleições), arts. 2º e 73.
- TSE, estatísticas eleitorais 1998 a 2022.
- Datafolha, avaliação do governo (1998, 2006, 2014, 2022; a conferir).
- IBGE, Censo 2010, "Nomes no Brasil" (nomes e sobrenomes mais comuns).
- V-Party (V-Dem), via `bussola/referencias.json`.
- Lewis-Beck e Stegmaier (2000), *Annual Review of Political Science* 3.
- Paldam (1986), *European Journal of Political Economy* 2; Nannestad e
  Paldam (2002), *The cost of ruling*.
- Adams, Merrill e Grofman (2005), *A Unified Theory of Party Competition*.
- Downs (1957), *An Economic Theory of Democracy*.
- Samuels e Zucco (2018), *Partisans, Antipartisans, and Nonpartisans:
  Voting Behavior in Brazil*. Cambridge.
- Carreirão (2007), *Opinião Pública* 13(2).
- Zucco (2008), *Journal of Latin American Studies* 40(1).

## 13. Como ficou (implementação, 15/out)

**Código.** `src/game/eleicao/` (tipos, gerador de personagens, voto e
mandato), `src/app/partida/eleicao.ts` (fachada: `primeirosCandidatos`,
`verEleicao`, `escolherCandidato`), dados em `mundo/eleicao.json`,
`mundo/personagens.json` (12 ideologias, 17 carreiras, 77 opiniões em 11
temas) e `paises/brasil/eleicao.json`. `criarPartida` recebe `partido` e
`presidente`; o estado fica em `GameState.election` e vai no salvo.

**Diferenças do desenho, decididas na calibragem:**
- **Sensibilidade da urna 0,1** (o Congresso usa 0,3). Prova
  (`scripts/eleicao/prova.ts`) com os 2º turnos de 2006, 2014, 2018 e 2022,
  só pela bússola: erro médio de 10 pontos com 0,1 e de 19 com 0,3. Só a
  distância não explica 2018 e 2022 (Bolsonaro, muito longe do eleitor
  médio, perderia de lavada); a conjuntura tem de pesar mais.
- **Costumes pesam metade na urna** (`pesoDosCostumes` 0,5).
- **Vantagem do cargo** de 0,8 para o presidente que concorre (3 de 4
  presidentes foram reeleitos). Com 0,5, o partido ficava fora do 2º turno
  em 7 de 20 sementes no turno 0; com 0,8, em 1 de 20.
- **Pessoas reais não ganham frases inventadas**: só a biografia com cargos
  e datas. Brizola fica fora (morto em 2004).
- **O 2º turno sai junto com o 1º**, no turno 16 (não é um turno a mais).
- **Ficaram para depois:** lua de mel (o capital político ainda não está no
  código), tirar o `estadoPolitico` antigo de `politica.json`, e o partido
  no Congresso continua no ponto da bússola do país.

**Testes de mandato (modo real, 16 turnos).**
- 10 mandatos parados (sementes 1 a 10): o partido venceu 5 e perdeu 5;
  aprovação final entre 40% e 48%. Nas derrotas, o candidato ficou em 3º no
  1º turno três vezes, perdeu um 2º turno por 49,8 a 50,2 e outro por 42,6.
- Semente 1 (presidente de centro): programa de Piñera, aprovação 53,7, venceu
  no 1º turno com 66%; Bolsonaro, 43,5, venceu no 2º com 63,9; Mujica, 41,7,
  venceu no 2º com 63,8. O peso da aprovação ainda é fraco perto da posição
  do candidato: a calibrar depois do V1-38 (economia que mexe).
- `npm run check`: formato, lint e build ok; 414 testes (406 + 8 da eleição)
  verdes. Os dois testes de contas com 40 a 80 turnos rodam sem eleição
  (`criarPartida({ eleicao: false })`).
