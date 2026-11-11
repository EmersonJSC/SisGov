# SisGov — Documento de design (GDD)

> **O jogo como ele deve ser quando estiver pronto.** Este documento narra a
> ideia do SisGov e de cada sistema: o que o jogador faz, como funciona, o
> que ele sente. Não é plano nem lista de tarefas. Daqui saem os requisitos.
>
> - **O que já está feito e em que ordem construir:** [plano de desenvolvimento](plano-de-desenvolvimento.md).
> - **Onde parei:** `RETOMAR.md`.
> - **Comportamento exato de cada peça:** `src/motor/<módulo>/<módulo>.md`.
>
> Quando o código e o GDD discordam, o GDD diz para onde ir. Ideia nova entra
> na seção 18 (Perguntas em aberto) até o autor decidir; decidida, passa
> para o sistema dela.

---

## 1. O jogo em uma frase

**Você é o partido que acabou de vencer a eleição num país, e precisa
continuar no poder governando por leis.**

- **Quem joga é o partido**, não uma pessoa. Presidentes, ministros e
  candidatos passam; o partido fica enquanto vencer. É o partido que monta a
  chapa, escolhe quem preside, quem é ministro e com quem se coliga.
- **O governo age por leis.** O Estado não levanta fábrica com as próprias
  mãos: ele aprova leis que cobram, gastam, regulam, compram, vendem e
  patrocinam. O Estado pode comprar empresas e ações e financiar obras, mas
  quem constrói é a economia.
- **Não há meta pronta.** O jogador leva o país para onde quiser. Quem joga
  bem tende a enriquecer e industrializar o país, mas o jogo não cobra isso.
- **Perder** é deixar o poder: perder a eleição, ou ver a Presidência cair
  nas mãos de outro partido e não conseguir recuperá-la.
- **Gênero:** simulador político de governo, com uma economia viva de
  empresas, obras e bolsa (inspiração no Victoria 3, só como ideia).

## 2. O que faz o SisGov ser o SisGov

1. **Política de verdade, não gestão.** O difícil não é achar a lei certa: é
   aprovar, pagar e sobreviver a ela. Cada lei passa pelo Congresso, pela
   mídia, pelos grupos e pelo cofre.
2. **Você é um partido com gente dentro.** Pessoas com ficha (presidente,
   vice, ministros, líder do partido) erram, brilham, traem e morrem. O
   partido sobrevive a elas, ou não.
3. **A conta sempre chega.** O que agrada hoje cobra depois, pela
   contabilidade, pela economia ou pela urna.
4. **O país vive sozinho.** Empresas abrem e fecham, a mídia escolhe lado,
   potências mudam de ideia. O jogador governa um país que se mexe, não um
   painel parado.

### A base do jogo: um ciclo

**A Bússola é a raiz do jogo.** Tudo o que existe no ciclo tem posição nela, e é
essa posição que liga as peças: a distância diz quem gosta de quê (seção 8).

**População, Economia e Governo controlam uns aos outros, com a População no
centro.** A economia controla os pops, os pops controlam as leis, as leis
controlam a economia e os pops, e os pops controlam a economia. O ciclo não tem
começo nem fim: mexer numa ponta volta pela outra.

| De | Para | Como controla |
|---|---|---|
| População | Economia | trabalha, consome e investe |
| Economia | População | paga salário, dá emprego e define preços |
| Economia | Governo | gera o dinheiro dos impostos |
| Governo | Economia | cobra, gasta e regula por lei |
| Governo | População | dá serviços, renda e direitos |
| População | Governo | vota, apoia e protesta |

- **Política não é um quarto pilar.** Partidos, grupos, Congresso e eleição são
  o caminho pelo qual a População controla o Governo.
- **Mundo não é pilar.** Potências, comércio e preços de fora pressionam os três.
- **Bolsa é onde o ciclo vira preço.** Lei muda lucro, lucro muda a ação, a ação
  muda o patrimônio dos pops, e os pops reagem no voto e no investimento.

## 3. Princípios (as regras que nunca mudam)

1. **Leis são o núcleo do governo.** Tudo o que o Estado faz passa por lei;
   mudar uma lei muda o jogo.
2. **Decisão de governo é uma bolha de lei no mapa**, nunca um painel de
   gestão. Regra nova (propriedade, mercado, mídia) chega ao jogador como
   lei. As **decisões do partido** (chapa, ministros, coligação, campanha)
   são escolhas curtas sobre pessoas e alianças, feitas em momentos certos,
   também sem painel. O que **os outros** propõem (leis do Congresso,
   situações, pedidos) chega como **papel na mesa** (seção 17).
   **Lei x decisão (08/nov):** lei é regra permanente e tem bolha; **decisão do
   presidente** é o que aparece ao clicar num país ou numa companhia (Ato ou
   Operação), tem custo, tempo e reação, e é limitada pelas leis.
3. **Nenhuma lei é um controle só que faz coisa grande.** Cada tema se divide
   em leis menores, cada uma com uma escolha de verdade.
4. **Nada é bom ou ruim.** Toda lei tem ganhadores, perdedores e
   consequências; textos e cores descrevem, não elogiam nem condenam. Parecer
   de direita ou de esquerda é resultado, nunca objetivo. O jogo é um teste:
   nunca fala de lado político ao jogador e nunca pede que ele escolha um
   lado. Só mostra consequências. O lado do partido sai das pessoas que o
   jogador escolhe (a chapa).
5. **Nada aparece do nada (realismo).** A conta sempre fecha: todo dinheiro
   do Estado entra por uma lei (imposto, venda, taxa) ou por um bem do Estado
   (lucro de estatal, dividendo de ação, juros recebidos), e todo gasto sai
   por uma lei ou por uma obrigação (juros da dívida). Gastar exige imposto,
   dívida ou emissão. O custo do que é popular chega pela contabilidade, não
   por uma regra "popular custa caro".
6. **O que dá resultado demora.** Cada efeito declara quanto tempo leva para
   chegar inteiro. O jogador sente a conta chegar.
7. **Decisão no turno, nada neutro.** Toda escolha mexe em algo visível;
   esperar também é uma opção.
8. **Dados primeiro, narrativa depois.** Primeiro os números que o texto vai
   ler; frases, manchetes e eventos leem esses números.
9. **Jogabilidade primeiro, realidade como base.** Lei inventada vale se for
   plausível; número na ordem de grandeza certa, sem precisão empírica.
10. **O motor conhece o Estado, não os nomes.** O motor sabe calcular
    (Laffer, evasão, juros, mercado, eleição), mas não conhece nome de lei,
    partido, pessoa ou país. Leis, índices, partidos e mídias são dados do
    mundo; o país declara só o estado de partida e os rótulos locais.
11. **O Congresso é a trava, não o jogo.** O jogador pode propor qualquer
    coisa; o exorbitante o Congresso barra. Fora isso, o que segura é a
    consequência.
12. **Pessoas são fichas, não roteiros.** Presidente, ministros e líderes
    são gerados com atributos; o que eles fazem sai da ficha e do país, não
    de uma história escrita.
13. **Toda lei chega ao pop.** Por renda, emprego, preço, serviço ou direito.
    Lei que só mexe na opinião não basta: o pop precisa sentir a mudança na vida.

## 4. Uma partida

### Começo

1. **Escolhe o país** (países reais ou declarados, cada um com economia, Congresso,
   partidos, mídias e grupos próprios).
2. **Cria o partido:** dá um nome e uma sigla. O jogador não escolhe lado,
   posição nem bússola; o partido nasce sem lado.
3. **Monta a chapa:** três vagas: presidente do partido, candidato a
   presidente e vice. Clicar numa vaga abre a lista de pessoas de todos os
   partidos do país (é assim que nascem as coligações). Clicar numa pessoa
   abre o perfil dela (ver "A rede da pessoa"). A chapa já venceu.
4. **Monta o ministério:** escolhe os ministérios e os ministros. Pode
   deixar o jogo sortear os ministros (pela ideologia da chapa) ou escolher
   cada um.
5. Inicia o jogo e governa.

**Histórico do país (07/nov):** cada país declara dados históricos (golpes,
crises, guerras, governos, empresas e mídias tradicionais). O que o país não
declara, os geradores criam a partir desse histórico: o gerador de empresas cria
as empresas e as mídias, e o gerador de organizações cria as organizações de
partida. Nomes seguem a seção 19: nenhuma empresa real.

O lado político do partido vem das pessoas da chapa e dos aliados que ela
traz: a posição na bússola e a base de grupos saem delas. O jogador descobre
o lado do próprio governo pelas consequências, não por um rótulo.

### A rede da pessoa

Cada pessoa da lista tem um perfil de rede social, como o de uma rede
real. É por ele que o jogador conhece a pessoa:

- **O que ela posta:** opiniões, fotos, o que anda curtindo, quem segue.
- **Onde ela vai e o que frequenta:** lugares, eventos, companhias.
- **O que ela diz sobre os temas do país:** a opinião aparece em texto
  solto, nunca como rótulo de esquerda ou direita.

O perfil é gerado da ficha da pessoa (bússola, origem, grupos, honestidade).
Nada diz "esta pessoa é de tal lado"; o jogador deduz, como na vida real.

**A rede do presidente e a inteligência (07/nov):** a rede é uma só, sem nome, e
resume todas as redes do país: o jogador sente o país vivo. Ela é diferente das
redes das empresas, que são prédios da economia. Cada perfil tem **"Informações
pessoais descobertas"**, uma narrativa gerada da ficha da pessoa. Quanto mais
Verba de inteligência e Poderes da agência, mais aparece: onde trabalha, rotina,
o que gosta e não gosta, o que assiste, opiniões pelos posts compartilhados, com
quem fala, dívidas e segredos. O jogador deve pensar "eles têm todos esses
dados?". Proteção de dados alta reduz o que se vê; cada espiada pode vazar e
virar escândalo. **Botão Espiar:** a partir do nível médio de inteligência, ver
dados pessoais é uma espiada que fere a privacidade e fica num **registro**. O
registro pode vazar um dia (pela Independência dos investigadores, pela imprensa
livre, pela corrupção interna da agência, pelo Controle da agência) e virar
escândalo. A chance sobe com a importância de quem foi espiado: espiar um
zé-ninguém quase ninguém procura; espiar um líder, juiz ou jornalista, sim.

### O turno (2 meses)

1. **Lê o país** no mapa: bolhas de leis e índices crescendo e encolhendo,
   grupos satisfeitos ou não, mídias a favor ou contra, potências mais perto
   ou mais longe, manchetes do turno.
2. **Age:** propõe leis (vendo antes quem ganha e quem perde), troca
   ministro, negocia com aliados. Em tempo de campanha, faz campanha.
3. **Despacha a mesa:** assina, veta, recusa, encaminha ou deixa na pilha
   os papéis que chegaram (leis aprovadas pelo Congresso, situações,
   pedidos).
4. **O Congresso vota.** Passa quem tem votos; o exorbitante cai.
5. **Passa o turno:** efeitos chegam, alguns agora, outros anos depois; a
   mídia reage; acontecem fatos (escândalo, choque de preço, atentado).

### Mandato e fim

- O mandato tem a duração da lei do país (4 anos = 24 turnos). No fim há
  eleição; vencer abre outro mandato, com o desgaste maior.
- A partida termina quando o partido deixa o poder. Não há vitória final: o
  placar é quanto tempo o partido governou e que país deixou.

### Por que é difícil escolher

- O que dá resultado demora; o que agrada hoje cobra depois.
- Cada lei agrada um grupo e irrita outro, e o apoio anda devagar.
- Para aprovar é preciso aliado, e aliado cobra (ministério, lei, verba).
- A mídia decide o que o eleitor vê das suas leis.
- O desgaste sobe sempre: quanto mais tempo no poder, menos margem de erro.

### O que o jogador deve sentir

- **Quando dá certo:** um grupo que estava contra passa a apoiar, a
  indústria volta a contratar, um ministro bom vira candidato forte, a
  eleição é vencida por pouco.
- **Quando dá errado:** entende por quê ("o corte na saúde de dois anos
  atrás virou fila agora"; "o ministro corrupto caiu e levou a aprovação").
  Nunca parece azar.
- Vê o país mudar sem placar: PIB cresce ou encolhe, empresas abrem ou
  fecham, empregos aparecem ou somem, pessoas enriquecem ou empobrecem.

## 5. O partido (você)

**O que o jogador faz:** decide quem fala pelo partido, com quem ele se
alia e o quanto ele se afasta da própria história.

- **Criação:** o jogador dá só nome e sigla. A posição na bússola e a base
  saem das pessoas da chapa, não de uma escolha de lado.
- **Ficha do partido:** posição na bússola (vem da chapa), grupos da
  base, cadeiras no Congresso, caixa do partido, desgaste, coesão interna.
- **Base e identidade.** Governar longe da posição do partido irrita a base:
  os lealistas viram descontentes, a coesão cai, deputados do próprio
  partido começam a votar contra. O partido pode mudar de lugar, mas devagar
  e pagando.
- **Presidente do partido.** Escolhido pelo jogador entre as fichas do
  partido. Comanda a negociação com outros partidos e a campanha; a ficha
  dele pesa nas duas. Pode ser trocado, com custo de coesão.
- **Caixa do partido.** Entra por financiamento (público ou privado, pela
  lei de financiamento de campanha) e sai na campanha. Dinheiro privado vem
  com interesse de quem doou.
- **Coesão.** Mede se o partido vota unido. Cai com governo longe da base,
  escândalo, troca de líder e derrota; sobe com vitória e com a base
  satisfeita.

## 6. Governo: presidente, sucessão e ministros

### Presidente e vice

- São fichas (ver abaixo). O presidente dá o tom: carisma pesa na
  aprovação, honestidade no risco de escândalo, habilidade política na
  relação com o Congresso.
- O vice costuma vir de um partido aliado: é o preço da coligação.

### Sucessão

- O presidente pode **morrer, ser assassinado, renunciar ou ser afastado**
  (impeachment). A chance depende do país: polarização, radicais, segurança
  pública, escândalos.
- **Quem assume é o vice**, depois a linha de sucessão do país.
- **Sucessor do seu partido:** o governo continua, com um choque de
  aprovação (simpatia ou caos) e a ficha nova no lugar.
- **Sucessor de outro partido:** você **continua jogando**, mas com
  **desvantagem até a próxima eleição**: o presidente é de outro partido e
  puxa para a bússola dele, pode vetar leis suas, troca ministros seus pelos
  dele, e a mídia e os eleitores passam a dividir o crédito e a culpa. Você
  continua no governo como partido da base (ou sai dele) e tenta recuperar a
  Presidência na urna.
- **Impeachment:** a oposição abre o pedido; o Congresso aceita e, quando o
  país tem Senado, o Senado julga. Pesa a maioria contra você, radicais
  altos e poucos lealistas, e escândalos.

### Pessoas

- Um **gerador de personagens** cria as fichas no começo da partida e ao
  longo dela (novos nomes no partido, nos aliados, técnicos).
- Pessoas **envelhecem, se aposentam e morrem** de causa natural. Por isso o
  partido precisa formar nomes novos.

### Ministros (fichas de RPG)

**O que o jogador faz:** escolhe quem ocupa cada ministério e quando trocar.

- **Ficha gerada** para cada candidato a ministro:
  - **Competência** (técnica da área): faz as leis da área chegarem mais
    rápido e com mais força; ministro fraco atrasa e desperdiça verba.
  - **Habilidade política:** ajuda a aprovar as leis da área no Congresso.
  - **Carisma:** como a mídia e o eleitor o veem.
  - **Honestidade:** baixa aumenta corrupção na área e risco de escândalo.
  - **Lealdade:** baixa e ele vaza, sabota ou sai atirando.
  - **Posição na bússola** e **origem** (partido, grupo, técnico sem
    partido).
- **Por que é difícil:** o melhor técnico pode ser de outro partido; o
  aliado exige ministérios para votar com você; o ministro popular vira
  rival dentro do partido.
- **Opinião:** grupos e mídias gostam ou não do ministro pela distância na
  bússola e pela origem dele. Nomear alguém próximo de um grupo agrada esse
  grupo.
- **Fatos:** escândalo (honestidade), crise na área (competência), demissão
  barulhenta (lealdade), ministro que vira candidato (carisma).
- **Troca:** demitir custa um pouco (mídia e coesão); manter alguém sob
  escândalo custa mais com o tempo.
- **Ministérios mudam:** o jogador pode criar, fundir ou extinguir
  ministérios (por lei). Mais ministérios dão mais cargos para aliados e
  custam verba; fundir economiza e tira cargo de alguém.
- **Ministério é um conjunto de esferas.** A esfera é a menor peça, e toda lei
  e todo índice pertencem a uma (seção 7). Criar um ministério é juntar
  esferas; apagar é redistribuí-las. Infraestrutura pode ser Transporte,
  Energia e Saneamento, e outro governo pode separar tudo. A divisão muda com
  quem governa, como na realidade.

## 7. Leis

**O que o jogador faz:** propõe, muda e revoga leis.

- **Esferas.** São 29, a classificação do que um país faz; a lista e o que
  cada uma cobre estão em `docs/jogo/leis.xlsx`. Esfera não é ministério: é a
  peça com que os ministérios se montam (seção 6). As esferas se interligam.
- **Duas camadas.** _Essenciais_: estrutura do Estado (mandato, regime,
  reeleição, impostos básicos); mudam pouco. _Jogabilidade_: as políticas.
- **Duas formas.** _Contínua_ quando tem valor (alíquota, gasto em % do PIB),
  com faixa própria. _Opções_ quando não tem (pena de morte).
- **A lei declara, o motor calcula.** A lei diz os efeitos, a força
  (fraca/média/forte), o atraso em turnos, a posição na bússola e qual
  cálculo do motor usa. Não traz fórmula própria.
- **Temas viram pacotes de leis pequenas:** imposto de renda (quanto, como
  cobra, faixas), armas, corrupção, direitos, drogas, ensino, saúde
  (público e apoio ao privado), trabalho (salário mínimo, demissão), comércio
  (tarifa, subsídio), propriedade, mídia, financiamento de campanha.
- **Força e atraso (08/nov):** cada lei tem uma Força (fraca, média, forte) e um Atraso em
  turnos (um turno são 2 meses; "0" é na hora). Estão nas colunas Força e Atraso da
  aba Leis, como palpite de partida (atraso vem do "Quando aparece" do roteiro,
  força do passo 6). O autor revisa; a calibração fica para o motor.
- **Origem dos números (08/nov):** todo número da planilha é um valor de partida.
  Cada um é de um de três tipos: **estudo** (tem fonte), **ordem de grandeza** ou
  **chute de jogo**. A calibração fica para o motor. Valores convertidos de uma
  palavra (esquerda, direita) usam 0,4 e estão marcados na coluna "Bússola: origem".
- **Todo dinheiro passa por lei** (princípio 5). Não existe receita ou gasto
  "fora das leis": o que o país já gasta no começo está nas leis de partida.
- O texto da tela sai dos números da lei: texto e motor nunca discordam.
- O país declara as leis que tem; a que falta fica "não legislada" e pode
  ser proposta. Lei que não faz sentido no país não aparece. Lei que não cabe ao presidente
  (ex.: é de outra esfera de governo) fica **inativa** e alguém pode propô-la.
- **Tipos (08/nov):** **Lei** (fica valendo, bolha), **Lei com prazo** (acaba
  sozinha, bolha com relógio), **Ato** (acontece uma vez, botão ou papel: Graça,
  suspender a regra fiscal, visita de Estado), **Posição por país** (nível decidido
  no menu do país que fica valendo, como Sanções e Aliança) e **Operação** (em etapas,
  sobre uma companhia, com papéis na mesa; vive na lista de companhias e não vira
  bolha). **Programa** é um pacote de leis que resolve um problema (ex.:
  Tarifa social: luz, água e gás); a planilha marca na coluna Programa. A **forma** de uma lei é separada do tipo: Régua, Níveis, Escolha,
  Dois controles, Meta e prazo ou **Régua por setor** (a lei tem uma aba por setor,
  cada uma com a sua régua, como a Tarifa de importação) ou **Divisão de 100%** (fatias que somam a verba toda: subir uma derruba as outras, como a Divisão da verba de ciência). Por onde chega ao motor: Dinheiro, Preço, Regra,
  Direito ou Serviço.
- **Leis controlam decisões:** as opções do menu de um país ou de uma companhia
  não são leis; as leis decidem o que o presidente pode fazer (ex.: Alcance das
  sanções, Aprovação de tratados, Autorização para estatizar e vender, Indenização).
- **Lei com prazo:** a lei diz quando acaba e volta sozinha a "não legislada"
  (ex.: Anistia fiscal, uma janela de 1 a 3 turnos). O jogo lembra quantas vezes
  ela foi usada.
- **Lei com escolha:** além do valor, o jogador marca a que ela se aplica na
  própria bolha (ex.: Incentivo a setores marca os setores). Os nomes vêm dos
  dados, não do motor.
- **Revogar** é propor a lei de volta a "não legislada"; também passa pelo
  Congresso.
- **Um lado por lei.** Cada lei vai de "nada" a "mais" num lado da bússola,
  nunca de um extremo ao outro. Um tema tem leis nos 6 lados (esquerda,
  direita, libertário, autoritário, verde, tradicional).
  **Exceção escrita (08/nov):** leis de valor ou de escala (Imposto de renda,
  Imposto sobre empresas, Liberação das drogas e dos jogos) usam o valor inicial do
  país como zero e podem cruzar o meio. Verbas e tetos têm um lado só, com pouca
  força. Quando o dono pode ser Estado ou privado (usinas, rede, venda de energia),
  são duas leis de lados opostos que colidem; fica para a esfera Energia.
- **Build:** o jogador combina leis de lados diferentes como quiser. Só
  leis que **colidem** não valem juntas (teto de aluguel × aluguel livre).
- **Processo:** estoque que anda sozinho pelos turnos (casas, favelas,
  terra dividida), empurrado pelas leis em vigor. Não é painel com meta: o
  extremo da bússola é um caminho, e cada lei anda um pouco nele.
- **Órgão faz, o jogador não escolhe:** o jogador nunca escolhe a fazenda, a
  fábrica ou a obra. Lei de regra diz o quê; lei de verba dá força ao órgão
  responsável. A regra funciona na medida da verba; verba muito acima do
  necessário vira corrupção. Obra nova é lei separada (seção 16, Construções).
- **Roteiro da lei:** toda lei passa pelos mesmos 8 passos: entrada (dinheiro,
  regra, preço ou direito), filtro, prédio, pop, economia, índices, política e
  conta. A lei declara a entrada e onde age; os outros passos são regras gerais
  do jogo. O roteiro de cada lei fica em `docs/jogo/leis.xlsx`, aba
  `Leis - roteiro`.
- **Verba tem lado, mas pequeno (07/nov):** nenhuma lei é neutra. A verba vai
  de zero a um empurrão pequeno num lado só (serviços puxam um pouco à esquerda;
  polícia e defesa, um pouco ao tradicional). O empurrão forte fica nas leis de
  "como" (público ou privado, força da polícia, quem controla). Leis de regra que
  atravessam o meio da bússola serão corrigidas uma a uma (32 na planilha em
  07/nov; Segurança pública já corrigida).
- **Sem limite de leis por esfera (07/nov):** tudo bem chegar a umas 500 leis. Se
  ficar demais, reduz-se depois; o jogo pode começar com um núcleo escolhido.
- **Os dois lados legislam:** o lado de mais regra e o de menos regra têm leis
  próprias. Zerar uma lei de esquerda não é uma política de direita; a direita
  ganha leis como livre negociação e contratos flexíveis. Ao listar as leis de
  uma esfera, conferir o equilíbrio entre os lados.
- **Filtro da verba:** a corrupção desvia parte de toda verba, conforme o índice,
  e o desvio deixa rastro. O que chega ao prédio vira salário e insumos, e parte
  dos insumos pode ser importada. Vaga é por pop: sem gente formada, fica vazia e
  o salário sobe.

## 8. Bússola política

**É a raiz do jogo e a base de tudo (seção 2).** É a régua comum das peças:
mostra para onde as escolhas levam o país, sem decidir nada sozinha.

- **Eixos** de −1 a +1: `economico` (esquerda − ↔ direita +) e `social`
  (libertário/verde − ↔ autoritário/tradicional +), mais os eixos que o
  autor decidir (seção 18).
- Têm posição: leis (um ponto por opção, ou um em cada ponta da faixa),
  partidos, grupos, pops, mídias, ministros, potências.
- **A posição do país** é a média das leis vigentes, com peso por lei (lei
  grande empurra mais).
- **Quem gosta sai da distância**, nunca de uma lista de grupos escrita na
  lei.
- **Pops deslizam devagar** com a vida deles: quem empobrece tende a se
  mover; a mídia empurra quem a assiste.
- O jogo percebe padrões (cortar várias verbas é "corte de gastos") sem
  existir lei com esse nome.

## 9. Índices

- **Essenciais** (do motor, com as contas entre eles): população, ocupados,
  desemprego, PIB real e nominal, crescimento, preços, inflação, receita,
  gasto, resultado, dívida, juros.
- **Jogabilidade** (dados do mundo): padrão de vida, instrução,
  industrialização, saúde, segurança pública, pobreza, desigualdade,
  corrupção, liberdades, polarização, meio ambiente, reputação
  internacional, segurança externa, aprovação, índice da bolsa e confiança do
  mercado.
- Índice novo só com decisão do autor.
- **Todo índice tem efeito.** Ele muda algo no país, além de ser cobrado pelos
  grupos. Efeito de cada índice e esfera dele: `docs/jogo/leis.xlsx`.
- **Visível e invisível (07/nov):** o visível aparece na tela. O invisível o
  motor calcula, e o jogador só o sente pelo que acontece (greve, surto, notícia).
- **Índice é gatilho:** as narrativas futuras disparam quando um índice sobe ou
  passa de um limite ("os sindicatos estão crescendo no país"). Por isso, cada
  esfera ganha quantos índices fizerem sentido (aba Índices, coluna Na tela). Os
  gatilhos só se escrevem com as narrativas, depois do motor e dos índices
  prontos.

## 10. Contas do Estado

- Receita, gasto, juros, cofre e dívida separados. Sobra vai ao cofre; falta
  sai do cofre e depois vira dívida.
- **Juros** sobem com dívida acima da tolerância do país e com inflação.
- **Emissão de moeda** cobre falta sem dívida, e paga em inflação.
- **Calote** apaga dívida e derruba reputação, juros e investimento por anos.
- **Regra fiscal** (lei): quanto da sobra abate dívida, teto de gasto,
  déficit e superávit.
- **Bens do Estado:** estatais e ações rendem lucro e dividendo ao cofre e
  podem ser vendidos.
- O dinheiro aparece na moeda do país, por ano, além de % do PIB.

## 11. População e grupos

- **Pops:** 32 tipos em 4 blocos: fora do trabalho, donos, conta própria e
  empregados. Cada um tem tamanho em pessoas, emprego, salário, capital e posição
  na bússola. São o centro do jogo (seção 2). A lista está em `docs/jogo/leis.xlsx`.
- **Como separar:** primeiro a situação (trabalha ou não), depois o vínculo e a
  ocupação. Estudantes, Aposentados e Crianças não têm estrato fixo.
- **Renda:** sai de salário, lucro, aluguel e transferência, nunca de uma parte
  fixa do PIB. Quando a economia muda, cada pop sente de um jeito.
- **Dados dentro do pop:** cada tipo guarda faixas de idade,
  cidade ou campo, vínculo de trabalho, escolaridade e patrimônio. Assim a lei
  mira idosos ou o campo sem multiplicar a lista de pops.
- **Nascido fora (08/nov):** mais um dado dentro do pop, com o país de origem e
  a situação (legal, sem documento, refugiado). Alimenta as leis de Imigração, as
  remessas de dinheiro e a tensão com imigrantes. Imigração aumenta o PIB; o
  salário cai um pouco só nos pops parecidos com os imigrantes; o crime não sobe
  por ser imigrante, e sim pelo desemprego e pela falta de acesso a serviços.
- **Lugar (08/nov):** todo pop tem campo e cidade e fica num **estado**. Cada país
  declara todos os seus estados, as pessoas de cada um e como se dividem. Estado vale
  para tudo: pops, prédios, voto e energia. Se o país não declarar a divisão de um
  pop num estado, vale a divisão nacional. País sem estados declara um só; nesse
  caso regionalistas e separatistas não aparecem.
- **Vida:** gente nasce, envelhece e morre. Jovem vira estudante e trabalhador;
  idoso se aposenta. É daqui que saem Previdência, escola e procura por saúde.
- **Pops mudam:** estudam e vão para o setor que paga mais (formar gente
  leva turnos; universidades são construções); sobem ou descem de estrato.
- **Grupos de interesse:** 25, econômicos, de identidade e valores e de causa.
  São pops organizados pelos seus interesses, e atravessam os pops: cada pop se divide entre vários grupos, em partes
  diferentes. Cada grupo tem posição na bússola,
  tamanho, satisfação, radicais e lealistas. O país declara os grupos fortes
  dele (agro num, indústria noutro) e a satisfação de partida.
- **Satisfação** mede a vida do grupo (renda contra o esperado, leis perto ou
  longe dele, o que a mídia que ele vê diz).
- **Radicais** pesam na polarização, na violência política e no risco de
  atentado; **lealistas** seguram o voto do seu partido.
- **Três reações:** quem está insatisfeito pode protestar, ficar leal ou sair.
  Protesto e lealdade passam pelos radicais e lealistas. **Sair** tem três
  caminhos: ir para a informalidade, tirar o dinheiro do país ou emigrar.
- **Grupo forte puxa a opinião.** Grupo não escolhe lei. Quanto mais força ele
  tem, em gente e em dinheiro, mais populares ficam as leis perto dele. Lei
  popular passa mais fácil, e o Congresso pode tentar aprová-la sozinho (seção
  12). O jogador continua livre, mas ir contra custa mais.

### Organizações

**Três camadas:** o pop é quem a pessoa é na economia; o grupo é como as pessoas
agem juntas na política; a organização tem nome, líder e ação própria.

- **Não existe lista fixa.** Um gerador cria organizações conforme os grupos
  agradam ou não ao governo e agem. Elas surgem, crescem, racham, mudam e acabam.
  Os tipos da planilha são moldes.
- **Cada grupo tem limite:** um grupo pacifista nunca pega em armas; pode, no
  máximo, formar movimento de rua.
- **Organização política** nasce de radicais de **vários grupos** próximos na
  bússola. Armamentistas ligados a conservadores e religiosos fundamentalistas
  são uma mistura perigosa. A mistura define nome, alvo e objetivo. Precisa de
  ideia ou líder: raiva sozinha não basta, e só parte dos radicais usa violência.
- **Várias existem, poucas preocupam.** Cada uma tem gente, dinheiro, armas, poder
  e organização, que dão a ameaça: pequena, relevante, grave ou crítica.
- **Financiamento:** potências, empresas na bolsa e doadores podem pagar
  organizações por interesse. Todo pagamento deixa rastro.
- **Investigação:** polícia, órgãos e imprensa podem descobrir quem paga. Isso
  prende líderes, corta dinheiro, derruba ações, gera sanção e escândalo.
- **Crime organizado** nasce do lucro: mercado ilegal, presídio lotado, favela,
  falta de Estado e corrupção. Vende, corrompe e disputa território.
- **O que fazem:** protesto, greve, sabotagem, atentado e crime.
- **Como mudam:** resposta mal feita pode criar mais radicais; caçar chefes pode
  rachar; a organização pode virar partido ou trocar a causa pelo lucro.
- **Como acabam:** polícia, inteligência, negociação e perda de apoio. Força
  militar serve contra organização grande e armada.
- **Organizações legais (07/nov):** igrejas, sindicatos e associações também são
  organizações, sem armas. A igreja é ao mesmo tempo dono sem lucro (seção 16) e
  organização. Cada igreja tem uma **vertente** (posição na bússola, conservadora
  ou social) e um **engajamento**: quietista não entra na política; ativa age
  quando uma lei toca seus temas; militante age em toda eleição (pede votos, elege
  bancada, negocia leis, financia campanhas). Leis contra seus valores e líder
  ambicioso sobem o engajamento.
- **Corrupção interna:** toda organização tem. Sobe com dinheiro fácil, isenção,
  sigilo e repasse sem controle; desce com fiscalização. Passa do limite:
  escândalo, racha, perda de apoio, e quem está ligado cai junto.
- **Presos com nome (07/nov):** líderes de organizações presos ganham ficha. Para
  os grupos aliados, viram presos políticos: a bancada pede Anistia, e o presidente
  pode dar a Graça (ato, não lei). Vale para qualquer lado, inclusive o líder de uma
  organização que tentou golpe de Estado.
- **Certeza x peso da pena:** o crime reage forte à Certeza de punição e pouco ao
  Peso das penas. Pena dura é popular, lota presídios e custa caro.
- **Todo lado gera extremistas** (princípio 4): religiosos, revolucionários,
  milícias, radicais ambientais e separatistas. Nenhum nome é real.

## 12. Congresso e coligação

**O que o jogador faz:** junta votos.

- **Partidos do país:** nome, cadeiras, posição na bússola, grupos que
  defendem, presidente com ficha.
- **Toda mudança de lei é votada.** Pedir mais de 1/3 da faixa de uma vez é
  exorbitante e cai.
- **Lei popular anda.** Ela ganha votos mais fácil e o Congresso pode propô-la
  por conta própria, mesmo sem o jogador pedir.
- **Coligação de governo:** o jogador convida partidos para a base. Cada um
  cobra: ministérios, leis perto da bússola dele, verba para os grupos
  dele. Partido da base com os grupos insatisfeitos sai; partido que saiu
  pode voltar se for atendido.
- **Negociação:** por lei, o jogador pode ceder (mudar a proposta, dar
  ministério) para ganhar votos. A habilidade política do presidente, do
  ministro da área e do presidente do partido pesa.
- **Oposição:** os partidos fora da base agem contra você: votam contra,
  aprovam leis deles quando têm votos, dão entrevistas, mobilizam grupos e
  chamam protestos.
- **Veto:** o que o Congresso aprova chega à mesa do presidente (seção 17)
  para assinar ou vetar; o Congresso pode derrubar o veto.
- **Uma ou duas casas:** o país declara se tem só Câmara ou Câmara e
  Senado.
- **Regimes:** presidencialismo e parlamentarismo (no parlamentarismo, perder
  a base derruba o governo). O motor deixa a porta aberta para partido
  único, sem que ele faça parte do jogo pronto.
- Cadeiras mudam a cada eleição, pelo voto.

## 13. Eleição, campanha e mandatos

### Mandatos

- Duração e reeleição são leis essenciais do país (07/nov: Duração de 1 a 10
  anos ou indefinida; Mandatos seguidos, Intervalo para voltar e Limite total de
  mandatos). Mudar a duração no meio
  do mandato é possível e caro (Congresso, mídia, liberdades).
- **Limite de reeleição:** o presidente sai; o partido continua com outro
  candidato. Por isso o partido precisa formar nomes.

### Chapa

- Antes da eleição o jogador monta a chapa: candidato e vice, entre fichas
  do partido e dos aliados. Ministro com bom desempenho vira candidato
  natural; vice de aliado traz os votos dele.

### Coligação eleitoral

- Partidos se juntam para a eleição: somam tempo de TV, caixa e eleitores, e
  cobram lugar na chapa e no futuro governo. Pode ser diferente da
  coligação de governo.

### Campanha

- Abre nos últimos turnos do mandato (ex.: 3 turnos, 6 meses).
- **O que o jogador faz:** gasta o caixa do partido e o tempo do candidato
  em **ações de campanha** com alvo: comício (um grupo), TV (todo o público,
  pela mídia), redes (jovens e grupos mais engajados), debate (arrisca:
  carisma contra o adversário), promessa (vira lei esperada; descumprir
  cobra no mandato seguinte).
- Lei de financiamento de campanha decide de onde vem o dinheiro.
- A campanha é nacional e mira **grupos**, com ação por estado, sempre dentro da
  eleição nacional.

### A eleição

- Cada grupo vota pela satisfação, pela distância na bússola até os
  candidatos, pela campanha e pela mídia que assiste; o peso é o tamanho
  do grupo. Desgaste do partido no poder entra contra.
- **Desgaste** sobe a cada mandato e com escândalos; o jogador reduz, nunca
  zera.
- O eleitor percebe o déficit e a inflação, não a contabilidade.
- Resultado: Presidência e cadeiras do Congresso.

## 14. Mídia

**O que o jogador faz:** governa sabendo que cada lei passa por um filtro, e
pode mexer nesse filtro, pagando por isso.

- **As mídias do país** (as 8 maiores, declaradas pelo país com nome e
  especificações; se o país não declarar, o gerador de empresas cria, a partir do
  histórico do país; mais as redes): cada uma com dono
  (privado, estatal, estrangeiro), posição na bússola, audiência por grupo,
  credibilidade.
- **Enquadramento:** o efeito de uma lei na opinião passa pela mídia. Mídia
  longe de você amplia quem perde ("o imposto que tirou seu salário"); mídia
  perto amplia quem ganha. Grupos sentem a lei pelo que assistem.
- **Pauta e escândalos:** a mídia expõe fichas fracas (honestidade, lealdade)
  e crises; a mídia amiga demora a noticiar, a inimiga corre.
- **Manchetes** do turno saem dos dados e aparecem no mapa (princípio 8).
- **Leis de mídia:** verba de publicidade do governo (agrada quem recebe),
  emissora estatal (audiência própria, credibilidade baixa no início),
  regulação, limite de dono estrangeiro, concessão, censura e banimento
  (calam a mídia e cobram liberdades, reputação internacional e radicais).
- **Redes:** sem dono único, rápidas, polarizam; espalham boato quando a
  instrução é baixa.
- Mídia é empresa: tem lucro, dono e pode ser comprada na bolsa.
- **Fato e versão:** todo fato do turno tem uma verdade e pode sair numa
  versão fiel, enviesada ou falsa, em qualquer mídia, inclusive a sua. O pop
  acredita conforme a credibilidade; a verdade só aparece com investigação.
  Engano descoberto derruba a credibilidade de quem publicou.
- **Pauta:** cada mídia escolhe uns 3 fatos por turno pelo tamanho do fato, o
  lado dela, o interesse do dono e o medo (censura, corte de verba). O que ela
  repete vira o assunto mais importante para quem assiste.
- **Jornal e redes das emissoras:** o jornal traz a notícia de maior impacto
  do turno; na rede social o jogador abre o perfil da emissora e vê o que ela
  anda postando sobre o país. Cada emissora tem perfil, com seus jornalistas.
- **Atos do presidente:** entrevista (amiga é segura; hostil rende mais e pode
  editar e armar pergunta; preparar ou improvisar), coletiva, pronunciamento
  em rede nacional, vazar dado a mídia amiga, pressionar o dono, cortar ou dar
  publicidade, nomear na emissora estatal, processar jornalista, negar
  credencial, plantar notícia falsa (arriscado: descoberta vira escândalo).
- **Mentira descoberta:** a cada turno que uma versão falsa circula, a chance
  de ser descoberta sobe com redação forte das mídias longe de você, Liberdade
  de imprensa, Independência dos investigadores, checagem e instrução alta,
  tamanho da mentira, pessoas que sabem e tempo. Cai com censura, medo,
  corrupção e mídia amiga dominante. Descoberta vira escândalo; se o rastro
  chega ao presidente, cai a honestidade. Só enviesada é difícil de provar.
- **Dono que muda de lado:** a posição anda para a do novo dono em alguns
  turnos; redação forte e credibilidade alta freiam. Estatal muda com o
  governo; da bolsa, com quem comprou; de família quase não é vendida;
  estrangeira segue o interesse de fora.
- **Entrevista:** a hostilidade da mídia vem da distância dela até você, do tema
  (escândalo aberto endurece) e do formato (ao vivo não tem edição, mas arrisca
  gafe; gravada pode ser editada se a mídia é hostil). O jogador escolhe: responder
  direto (seguro, rende pouco), desviar para tema parecido (funciona se preparado),
  atacar a mídia (sobe a base, cai a confiança dos neutros) ou improvisar (pode
  render muito ou virar gafe, conforme carisma e honestidade).
- **Campanha:** leis Horário eleitoral gratuito e Propaganda paga na campanha
  (Estado e eleições) decidem quem aparece na mídia na eleição.
- **Partido:** tem mídias aliadas e porta-voz; em eleição, propaganda e
  debate. Aliada pega em engano perde credibilidade junto.
- **Escândalo em ciclo:** semente, investigação, publicação, repercussão,
  desgaste, esquecimento. A amiga abafa, a inimiga amplia.
- **Vazamento:** fonte, jornalista, publicação; seu, de rival ou da agência.
- **Jornalistas:** perfis na rede, redação forte ou fraca; o investigativo
  descobre segredos; pode ser ameaçado, preso ou agredido.
- **Índices:** Liberdade de imprensa, Credibilidade da imprensa, Concentração
  da mídia, Desinformação, Polarização, Violência contra a imprensa.

## 15. Mundo

- **Países reais (08/nov):** as **10 maiores economias** têm ficha completa e
  são jogáveis; o ranking mostra os **30 maiores** (do 11º ao 30º, ficha
  simples), mais os vizinhos do país jogado e o resto do mundo num bloco só. O
  país jogado sai da lista dos outros. Nomes e números reais ficam em arquivo de
  dados, com data e fonte; o motor continua sem conhecer nomes.
- **Ficha completa:** PIB e posição, lado na bússola, poder militar, o que
  compra e vende, opinião sobre você, relação com cada outro país. **Ficha
  simples:** PIB, lado, opinião e comércio com você.
- **Relação entre países:** cada par é aliado, amigo, neutro, rival ou inimigo;
  muda com o tempo e com o que você faz. Aproximar-se de A faz os rivais de A
  desconfiarem de você.
- **Tela do Mundo:** ranking por PIB com a relação de cada país com você; clicar
  num país abre a ficha (dados, relação, o que está em vigor: tratados, sanções,
  bases, ajuda) e as formas de se aproximar ou se afastar dele.
- **Cada país** tem posição na bússola, peso, opinião sobre o seu que anda pela
  distância e interesses econômicos (compram, vendem, investem).
- **Posições por país (Relações exteriores):** no menu do país, o jogador decide o
  nível de cada uma só para aquele país (não são leis): relações diplomáticas, acordo
  comercial, aliança militar, base estrangeira, sanções, operações no exterior,
  extradição e polícia, ajuda dada, ajuda condicionada aceita e proteção ao
  investidor. As **leis** que as controlam e valem para o país todo: Verba da
  diplomacia, Tribunal internacional, Inspeções nucleares, Aprovação de tratados
  (presidente, Congresso ou referendo) e Alcance das sanções. Cada ação muda a opinião do país pela
  distância na bússola e a dos aliados e rivais dele.
- **Atos do presidente com países** (não são leis): visita de Estado, receber o
  líder, apoiar ou criticar em público, mediar conflito entre dois países.
  Custo e duração ficam para as narrativas.
- **Reputação internacional** = média das opiniões, pesada pelo peso.
- **Potência reage:** acordo, investimento, crédito mais barato quando
  gosta; tarifa, sanção, fuga de capital quando não gosta.
- **Sanção** passa pelo mercado: se a potência é a maior produtora de um
  produto e sanciona o país, esse produto fica caro no seu mercado. Quanto
  mais o país depende dele, mais dói.
- **Segurança externa** cai quando potência forte não gosta do país. **O
  país pode ser atacado, mas não revida nem começa guerra.** Um ataque cobra
  economia, vidas e aprovação; a defesa vem das leis militares.
- Potências mudam de posição ao longo das décadas.

## 16. Economia

**O que o jogador faz:** cria as condições (imposto, juro, regra, verba,
propriedade) e, como Estado, compra, vende e patrocina. Quem produz e
constrói é a economia.

A Economia é um dos três pilares (seção 2), tão importante quanto População e
Governo: ela paga os pops e o Estado, e é controlada pelos dois.

### Glossário (08/nov)

| Termo | O que é |
|---|---|
| **Esfera** | Um tema de leis (Saúde, Impostos). Ministério é um conjunto de esferas. |
| **Lei** | Regra permanente. Tem bolha no mapa. |
| **Lei com prazo** | Lei que acaba sozinha. |
| **Ato** | Decisão do presidente que acontece uma vez (Graça, visita de Estado, suspender a regra fiscal). |
| **Posição por país** | Nível que o presidente decide no menu de um país e que fica valendo até mudar (Sanções, Aliança). |
| **Operação** | Decisão em etapas sobre uma companhia, com papéis na mesa (Estatização, Privatização). |
| **Programa** | Reservado: um pacote de leis que resolve um problema. Ainda não definido. |
| **Companhia** | A dona. Tem ações, reserva de investimento e várias empresas. |
| **Empresa** | A parte de uma companhia em um setor. É um conjunto de prédios. |
| **Prédio** | A unidade que produz ou presta serviço: fábrica, fazenda, usina, hospital. (Antes aparecia como "construção".) |
| **Obra** | O ato de construir um prédio novo. Entra na fila da construção civil. |
| **Construção civil** | O setor que faz as obras. |
| **Órgão** | A repartição do Estado de uma esfera (um prédio do Estado). Recebe a verba por lei e executa; sofre corrupção. O jogador dá a verba, não escolhe fábrica nem fazenda. |
| **Ação (cota)** | Fatia de uma empresa. Dá dividendo, não dá mando. |
| **Estatal** | Empresa cujo dono é o Estado. |
| **Serviço do Estado** | Prédio do Estado fora do mercado (hospital, escola, delegacia). |

### Mercado

- **Setores:** 15, aprovados em 05/nov; lista e prédios em `docs/jogo/leis.xlsx`.
  Setor separa atividade, nunca tipo de bem: quem compra luxo é um pop, não um setor.
- **Produtos** do mundo, agrupados em setores, com cadeia entre setores (o
  que um setor produz é insumo de outro: aço → máquinas → veículos). A
  cadeia é o que liga uma empresa à outra na bolsa: lei que encarece o aço
  derruba o lucro da montadora.
- **Dois mercados:** o do país e o do mundo, com ciclos e choques de preço.
  O país produz uma parte e compra o resto.
- **O mercado se move por demanda e custo, nunca por lei de produto (08/nov):**
  não existe lei que dê lucro à carne ou ao aço. As leis mexem em todas as
  empresas ou na demanda e no custo, e a cadeia espalha o efeito. Para aquecer o
  aço: subsídio para comprar máquinas aquece máquinas e, junto, o aço. Para
  vender mais carne: o Bolsa Família faz as famílias comprarem alimento.
- **Demanda dos pops:** o que chega a cada pop depende de quanto há, de
  quanto custa e de quem pode pagar; falta de comida vira fome.
- **Comércio:** importa o que falta e exporta o que sobra, pelas tarifas,
  subsídios e acordos (leis).
- **Energia e infraestrutura** são capacidade, não estoque: usinas, rede e
  ferrovias contra a demanda. Faltar encarece e trava a indústria.
- Setores com regra própria: moradia (abaixo), remédios, militar (demanda
  pelo tamanho das forças).

### Terra e moradia (campo × cidade)

**O que o jogador faz:** escolhe leis de terra no campo e de moradia na
cidade; as duas pontas se ligam pela gente que se muda.

- **Moradia é estoque local**, não produto do mundo: não se importa casa.
  Há casa **formal** e **precária** (favela).
- **Quem constrói:** empresas (pelo lucro), governo (por lei) e pops. Pobre
  autoconstrói precário, classe média financia, rico investe para alugar.
- **Estoque em 3 faixas (07/nov):** casas de pobres, de classe média e de ricos,
  mais a favela, cada faixa com casas ocupadas e vazias. Casa sem morador não
  some. O aluguel de cada faixa reage às casas vazias dela.
- **Quem constrói muda o ritmo:** o Estado constrói pela verba, sem lucro, na
  velocidade da construção civil, e tira obras do privado. A empresa constrói
  quando o preço passa do custo. O pop autoconstrói pela renda, e a posse segura
  acelera. Obra leva turnos; muitas obras juntas criam ciclos de alta e queda.
- **Casas descem de faixa:** todo turno parte das casas desce uma faixa (cerca
  de 2% por ano). Sem obra nova, a descida para, e a classe média disputa as
  casas dos pobres.
- **Três índices:** déficit (famílias sem casa), preço (aluguel e compra
  contra a renda) e favela (parte das casas que é precária).
- **Leis da cidade em 4 alavancas** (Construir, Terra urbana, Aluguel,
  Ocupação), cada uma com leis nos 6 lados; colisões só dentro da mesma
  alavanca.
- **Campo:** a terra rural é de donos grandes, de pequenos agricultores ou
  de ninguém (parada). Quanto mais concentrada, menos gente vive dela.
- **Êxodo:** todo turno um pouco da gente do campo vai para a cidade quando
  a renda esperada lá (salário × chance de emprego) passa a do campo.
  Concentração de terra e máquinas no campo empurram; renda no campo segura.
- **A ponte:** quem chega à cidade pede casa. Se a cidade não constrói no
  mesmo ritmo, sobe o déficit; o pobre autoconstrói e sobe a favela.
- **Reforma agrária é processo, não lei:** terra parada → desapropriada ou
  comprada → assentamento → título. Cada lei empurra uma etapa.
- **Antes de toda lei:** "um presidente real assinaria e pronto, ou é um
  processo?" Se é processo, as leis são as peças que ele assina.
- **Fazendas em 3 tamanhos** (pequena, média, grande), cada uma com parte
  produtiva e parte parada. Concentração = parte da terra nas grandes.
- **Imposto sobre terra e imóvel parado** vai de 0 a 100%, como todo
  imposto: a curva de Laffer do motor decide quanto arrecada; quem paga
  vende, produz ou aluga, e a base parada encolhe.
- **Desapropriar:** o órgão de terras vistoria fazendas (quantas, pela
  verba); a abaixo da regra entra no prazo de defesa do dono; depois é
  desapropriada e paga pela lei de indenização.
- **Leis do campo nos 6 lados** (o que é terra parada, indenização, crédito
  para comprar terra, título de posse, reserva de mata…). Mexem no campo e, pelo êxodo, na cidade. Lei
  nenhuma fala das duas: a ligação é a gente.
- **Tensão:** produzir mais no campo (máquinas, fazenda grande) solta gente
  para a cidade; dividir a terra segura gente e irrita o dono de terra.

### Prédios e obras

- Cada setor tem **prédios** (fazenda, fábrica, usina, ferrovia,
  universidade) que existem para o cálculo; o jogador os vê em conjunto ("≈
  N fazendas"). Eles **produzem, empregam e dão lucro**.
- **O PIB é a soma do que os prédios produzem.** Sobe quando uma obra
  termina, cai quando um prédio fecha. As bases dos impostos saem dos
  prédios e dos pops.
- **Obra:** cada tipo tem custo e prazo; obra mais difícil (usina,
  siderúrgica) pesa mais nos dois. Obras entram numa fila.
- **Construção civil** decide **quantas obras andam ao mesmo tempo** e quão
  rápido. Construção civil forte = mais obras e mais rápidas.
- **Corrupção** atrasa e encarece obras.
- **Verba de obra é separada (07/nov):** a verba de cada área (saúde, educação,
  presídios) mantém o que existe: salários e insumos. Construir prédio novo é a Verba de
  construção, dividida em 100% entre as áreas, na esfera Infraestrutura e transporte. A obra entra na fila da construção civil
  e disputa operários e cimento com o privado. Prédio pronto sem verba da área
  fica vazio.
- **Serviços do Estado** são prédios fora do mercado: hospital, escola, delegacia,
  tribunal, presídio, quartel e repartição. Pagos pelo orçamento, dão emprego e
  salário, sem lucro. Cortar verba fecha prédio, demite pop e reduz o serviço.
- **Terceirizar:** por lei, o Estado pode passar à empresa privada o que aceita
  terceirização, como segurança, presídios, hospitais e escolas.
- **Prédio precisa de gente.** Sem trabalhadores com a formação certa, ele
  produz menos, mesmo pronto. O desemprego sai daqui: quem não acha vaga vai
  para Desempregados, e o índice acompanha.

### Consumo

- **Quem compra:** pops, pequenos mercados, mercados, outros prédios, Estado e
  exterior. Todo produto tem comprador.
- **Pop compra pela cesta:** cada estrato divide a renda entre comida, moradia,
  transporte, lazer e outras categorias; quem ganha mais gasta parte menor com
  comida e poupa mais.
- **Comércio é ponte:** produto vai ao atacado, aos pequenos mercados ou aos
  mercados, e daí ao pop. Serviços chegam direto.

### Trabalho

- **Qualificação:** todo emprego exige um dos quatro níveis: elementar,
  operacional, técnico ou superior. Prédio só contrata quem tem o nível.
- **Salário:** a qualificação define o piso do pop. A disputa por gente sobe o
  salário, e sobra de gente o segura. O lucro limita a alta e pode pagar bônus
  pequeno. Piso legal e negociação coletiva seguram quedas e aproximam salários.
  O salário cai devagar: antes de cair muito, o prédio demite.
- **Formação e Estado:** salário alto atrai estudo, que traz gente anos depois.
  Salário público é por lei, mas se ficar baixo o Estado perde gente.
- **Sem vaga,** a pessoa vai para Desempregados, Informais ou Autônomos.

### Lucro e salário

**Caminho do lucro:** receita − insumos = valor adicionado, e a soma de todos é o
PIB. Dele saem salários, encargos, desgaste, juros e imposto sobre lucro. O que
sobra se divide entre reinvestir e pagar dividendo. Salário e dividendo viram
renda dos pops, que voltam a consumir, poupar e investir.

- **Receita** = o que o prédio produz × preço do produto no país.
- **Salário** = empregos × salário do setor; vai aos pops que trabalham ali.
  Sobe quando falta gente e o lucro é alto; cai quando sobra gente. Leis de
  trabalho (salário mínimo, participação nos lucros) mexem aqui.
- **Lucro** = receita − salários − insumos − impostos. Vai para o dono:
  - privado nacional: uma parte dividida entre os investidores (pops donos
    de capital e acionistas), outra para a reserva de investimento;
  - estrangeiro: sai do país (a lei de remessa de lucro decide quanto);
  - estatal: vai ao cofre;
  - cooperativa: vai para os trabalhadores;
  - mista: divide por cotas;
  - conta própria: salário e lucro são uma renda só, a renda mista.
- Prédio com prejuízo por vários turnos fecha e demite.

### Empresas e dono

- **Empresa = conjunto de prédios** de um setor. O país declara as de
  partida.
- **Dono:** Estado, privado nacional, estrangeiro, cooperativa ou entidade sem
  lucro (igrejas e beneficentes: vivem de dízimo e doação, dão assistência, entram
  na política e, com pouca fiscalização, podem desviar). O jogo não tem religiões
  com nome; a fé vive nos grupos religiosos.
- **Quem paga a obra é o dono:**
  - **Privado:** o lucro enche a **reserva de investimento**, que abre obras
    nas empresas que dão mais lucro. Juro alto encarece o crédito e reduz o
    investimento.
  - **Estatal:** cresce quando o jogador põe verba nela (por lei). Paga do
    cofre; sem cofre, da dívida, e com juro alto essa dívida sai mais cara.
- **O Estado patrocina:** lei de incentivo, crédito barato ou obra pública
  num setor puxa o investimento privado para lá, sem o Estado ser dono.
- **Operações do Estado** (decisões do presidente, limitadas por lei): estatizar
  (comprar ou tomar), criar estatal, transformar em cooperativa, vender a
  companhia ou um prédio (ex.: uma hidrelétrica grande). Empresas de energia podem
  ser vendidas; transporte fica no fundo do cálculo, sem decisão própria.
- **Ficha da empresa na bolsa:** clicar numa empresa (ex.: a petrolífera
  nacional) mostra os prédios dela, da extração ao refino, e quanto cada
  uma produz.
- **Leis de propriedade** dizem como: indenização, prazo, regra pós-venda,
  política estatal, triagem estrangeira, remessa de lucro, fábrica de fora,
  concorrência.

### Dinheiro

- **Juros:** o Banco Central reage à inflação e à economia, conforme a autonomia
  dada por lei. Juros de mercado somam o risco do país.
- **Crédito:** bancos emprestam depósitos e reservas a pops, prédios e Estado.
  Confiança e lucro ampliam; juros e calote reduzem. Crédito farto infla a bolsa.
- **Inflação** vem de demanda acima da oferta, custos, expectativas e emissão.
- **Câmbio:** valor da moeda contra o mundo. Moeda fraca ajuda exportar e encarece
  importados e dívida externa; moeda forte faz o contrário.
- **Regime:** o país escolhe dois de três: câmbio estável, capital livre e juros
  próprios. Reservas seguram o câmbio até acabar.

### Bolsa (minigame Pregão)

- **A bolsa funciona sem o governo.** Empresas abrem capital, investidores
  compram e vendem, e os preços andam pelo lucro e pela confiança. O governo pode
  regulamentar e entrar, mas ela não depende dele.
- **Mercado precisa de base.** Propriedade, contratos, regras claras, moeda
  estável e apoio da população sustentam a bolsa. Sem isso, ela encolhe ou quebra.
- **Cada país escolhe o caminho.** O país liberal regulamenta o mínimo para
  o mercado funcionar; outro coordena empresas e sindicatos; outro é dono das
  grandes empresas. Cada caminho exige a própria estrutura e cobra um preço, sem
  lado certo (princípio 4).
- Ações são negociadas no turno, sem blocos fixos. **Ação dá dividendo, não dá
  mando:** o dono só muda pelos atos do Estado.
- Preço do bloco = lucro da empresa × múltiplo × humor do mercado; lei que baixa
  o lucro baixa o preço, e a cadeia espalha o efeito.
- **Múltiplo** cai com juros e risco, e sobe com crescimento esperado. O risco
  sobe com corrupção, dívida, regra fraca, ameaça de estatizar e violência.
- **Humor** é a distância entre preço e valor justo. Nasce de alta recente, crédito
  barato, confiança do mercado e notícias, sem sorteio, e volta ao justo aos poucos.
- **Índice da bolsa** mostra o valor médio das empresas; **confiança do mercado**
  mostra quanto investidores confiam nas regras e no futuro do país.
- **Alta e quebra:** novidade, euforia, aperto e pânico nascem do lucro e do
  crédito. A quebra reduz patrimônio, consumo, investimento e emprego.
- **Cada investidor reage de um jeito:** pequenos seguem a moda, ricos olham lucro,
  bancos usam crédito, fundos ficam mais tempo, estrangeiros saem rápido.
- Compradores (pops ricos, fundos, multinacionais, potências) com caixa
  próprio: vender muito de uma vez derruba o preço.
- O Estado compra e vende de verdade: o dinheiro entra e sai do cofre;
  grupos, mídia e potências reagem.
- O valor da compra da propriedade depende do valor na bolsa.
- **Pops têm patrimônio na bolsa:** ação sobe ou cai e muda a riqueza de quem é
  dono. Dividendo vira renda, e a queda vira reação no voto e no investimento.

### Orçamento e dívida (08/nov)

- **Regra fiscal em 4 leis:** Meta de resultado, Teto de gasto, Limite da dívida
  e Punição se descumprir. Em crise o presidente pode suspender a regra por ato;
  se a crise é real a Credibilidade fiscal cai pouco, se não, cai muito.
- **Cada lei abre a sua figura** (a decisão continua na lei, não num painel):
  Gasto mínimo, envelopes com cadeado; Meta, cofrinho com linha-alvo; Teto,
  velocímetro com limite; Limite da dívida, caixa d'água com linha máxima (a parte
  em moeda de fora tem outra cor e balança com o câmbio); Punição, luzes de painel;
  Revisão de gastos, pente fino em verde, amarelo e vermelho, com o quanto vai
  liberar antes de aplicar; Prazo da dívida, escada de vencimentos; Fundo
  soberano, barra de reserva.
- **Gasto mínimo obrigatório no jogo:** a bolha da lei mostra os envelopes; em
  cada lei de verba, a régua mostra o cadeado (a verba trava na marca e diz
  "travado por lei"); o resumo do orçamento tem uma barra com a parte travada
  (cinza, com cadeado) e a parte livre; o mapa mostra um cadeado na bolha; em
  crise, aviso "só X% livre para cortar".
- **Revisão de gastos:** recupera parte do que cada área perde no caminho (cerca
  de 1/4 na média, 1/2 na base zero; valores de partida), com conflito com
  servidores.
- **Dívida em moeda de fora:** juros menores, mas a parte em moeda de fora sobe
  junto quando a moeda cai (dívida de 80% do PIB, 30% em moeda de fora, moeda cai
  20%: a dívida vai a 84,8%).

### Moeda e bancos (08/nov)

- **Câmbio como corredor:** a lei Faixa do câmbio tem dois controles, o preço-alvo
  do dólar (−20% a +40% sobre o início) e a largura da faixa (0% travado a 30%
  quase solto). O gráfico mostra o preço andando dentro do corredor; ao bater na
  parede, o jogador decide no turno: gastar reservas, subir os juros, fechar a
  saída de dinheiro (só se tiver Controle de capital) ou deixar o corredor
  quebrar. Faixa estreita, mais decisões e preço previsível; larga, poucas
  decisões e mais oscilação. No extremo, usa-se a moeda de um país da lista do
  Mundo. Reservas são um índice (a "gasolina"), não uma lei.
- **Resgate de bancos é evento, não lei:** cada banco que quebra tem ficha
  (tamanho, dono, dívida, quem perde) e o jogador escolhe: deixar quebrar, ficar
  com o banco (vira estatal, pode vender depois), emprestar com condições ou
  salvar sem condições. Seguro-depósito e Exigência de capital mudam o cardápio e
  a gravidade.
- **Criptomoedas:** quando a moeda vai mal, parte do povo compra cripto; a lei
  decide se vai ao mercado paralelo, se paga imposto ou se entra livre.
- **Autonomia do Banco Central** destrava a Taxa básica de juros: com autonomia, a
  régua só mostra a decisão do banco.

### Empresas e estatais (08/nov)

- **Camadas:** ação (fatia que dá dividendo, sem mando), empresa (conjunto de
  prédios de um setor, com dono que manda) e prédio (a fábrica, a usina). Trocar o
  dono não mexe no prédio. A companhia dona tem reserva e várias empresas.
- **Lista de companhias:** a porta de entrada. Filtro por setor, por tipo de dono
  ou todas; colunas de setor, número de empresas, lucro, valor na bolsa, empregos,
  parte do Estado, dividendo e risco político; ordena por qualquer coluna. Em cada
  companhia: comprar cotas, estatizar, privatizar (se for do Estado) e transformar
  em cooperativa. "Criar estatal" fica no topo, por setor. Cada uma é uma
  **Operação** (não uma lei): vive na lista, mostra o andamento e termina. Só
  mexemos em companhias, nunca em fábrica solta.
- **Leis que controlam as operações:** Indenização, Prazo de pagamento, Regra
  depois da venda, Política da empresa estatal, Limite de aviso ao mercado, Ação de
  ouro e Autorização para estatizar e vender (presidente, Congresso ou plebiscito).
- **Verba das estatais** (Empresas e estatais, por setor, régua em % do PIB) mantém
  e opera o que existe; **Construção de estatais** (Infraestrutura e transporte, por
  setor) paga obras novas, na fila da construção civil.
- **Comprar cotas (jogo A):** meta de participação, prazo em anos e discrição
  (limite de compra por turno). O jogo divide a meta pelos turnos e compra o que
  houver à venda; comprar mais sobe o preço. A tela mostra ritmo, custo e se a meta
  será batida (verde, amarelo, vermelho). Passar do **Limite de aviso ao mercado**
  (lei do país, 1% a 20% ou nunca) avisa o mercado e sobe preço e risco. Sem a meta
  no prazo, fica o que conseguiu e pode estender. Ação dá dividendo, não dá mando.
- **Estatização e privatização (jogo B):** o jogador só decide querer ou não; o
  resto chega como **papéis para assinar na mesa**, preparados pelos órgãos. Dois
  caminhos para estatizar: **oferta pública** (preço com prêmio e prazo; os
  acionistas decidem, cada tipo reage de um jeito) ou **obrigar a vender**
  (desapropria e paga pela Indenização). Alvo: sócio, controle ou dono total. Na
  privatização o método é bolsa, leilão, venda direta ou concessão; no leilão o
  jogador vê os compradores e define o **preço mínimo** (alto esvazia, baixo vende
  barato).
- **Pedidos na mesa:** empresas e compradores também mandam pedidos para comprar
  empresas estatais.
- **O partido** não compra nem vende: quem faz é o Estado, por lei ou decreto, e o
  Congresso pode precisar autorizar (voto). O partido ataca ou defende nas mídias e
  nas redes sociais. Doação de companhia é conflito de interesse.
- **Papéis na mesa:** quais e com que conteúdo, a definir no planejamento final.

### Comércio exterior e capital (08/nov)

- **Régua por setor:** Tarifa de importação, Imposto sobre exportação e Subsídio às
  exportações têm uma aba por setor (mais uma aba "Todos" que mexe todas juntas).
  Nenhuma lei dá lucro a um produto: mexe em tarifa, custo ou setor inteiro.
- **Leis:** Tarifa de importação, Facilitação aduaneira, Zonas francas, Imposto sobre
  exportação, Subsídio às exportações, Defesa comercial, Controle de exportação de
  produtos estratégicos, Venda de armas ao exterior, mais Triagem de compra
  estrangeira, Remessa de lucro ao exterior e Fábrica estrangeira no país.
- **Evidência:** a tarifa recai quase toda sobre quem compra; abrir o comércio sobe a
  produtividade com ganhadores e perdedores; menos burocracia nos portos corta o custo
  (10 a 20% em simulações); zonas francas dependem da governança.

### Energia (08/nov)

- **Energia nunca vem do nada:** gerada = gasto das companhias + gasto da população +
  perdas na rede. O gasto da companhia vem de quantos prédios ela tem e de quanto
  produzem; a geração, das usinas que ela tiver. Gasto e perdas são **contas**, na
  ficha da companhia e do país; os índices são Energia gerada, Energia gasta, Preço
  da energia, Matriz limpa e Acesso à energia.
- **Por estado:** o arquivo do país declara companhias, usinas (tipo e quanto geram) e
  todos os estados, com usinas próprias e linhas ligadas aos vizinhos. Se um estado
  precisa de mais do que recebe, há **apagão, que é evento**, mesmo com energia
  sobrando no país.
- **Produtividade é conta por companhia:** vem de máquinas e tecnologia, gestão,
  qualificação, pesquisa, concorrência, regras e insumos (energia e transporte). O
  índice Produtividade é a média de todas as companhias.
- **Quem constrói:** as companhias, com a própria reserva, se der lucro (a lei só diz
  quanto podem entrar); o Estado, pelos Investimentos por fonte.
- **Mapa elétrico (não é mapa político):** a tela mostra a rede, com os estados ligados
  por linhas, quanto cada um gera e gasta, verde quando sobra e vermelho quando falta.
- **O que o jogador faz:** encomenda uma usina num estado e numa fonte (Operação, paga
  com os Investimentos por fonte); escolhe quem fica sem luz quando falta energia;
  segura a conta de luz (lei pegadinha: agrada agora, a conta volta maior); estatiza ou
  vende a companhia de energia. **As linhas são automáticas:** o presidente só define o
  dinheiro, porque o jogo não é de construção.
- **Companhia federal de energia:** ao estatizar, ela é criada automaticamente, e as
  usinas encomendadas são dela.
- **Gráfico do futuro:** uma linha mostra quanto o país vai gastar, e outra quanto vai
  gerar, contando as obras em andamento. O jogador vê a falta chegando anos antes.
- **Cada fonte é uma aposta:** hidrelétrica sofre com seca; solar e eólica pedem rede e
  reserva; térmica é rápida, depende do preço do combustível e polui; nuclear demora
  6 anos, dá muita energia estável e traz o risco de acidente e a questão do urânio.
- **Comércio de energia** (Posição por país, em degraus): nenhum, compra quando falta,
  contrato longo, rede ligada, usina dos dois países. Quanto mais fundo, mais barato
  e mais preso; com a rede ligada, o vizinho pode cortar se a relação piorar.
- **Urânio:** a lei Enriquecimento de urânio é uma escada (nenhum, combustível de usina,
  pesquisa e medicina, nível de bomba); cada degrau sobe a desconfiança dos outros
  países, e o nível de bomba destrava o Projeto nuclear militar. **Vender urânio em
  segredo** é Ato: fica num registro que pode vazar, como o Espiar, e vira escândalo
  e sanções. Quanto mais perigoso o comprador, maior o dinheiro e o risco.
- **Mineração e petróleo** é esfera própria: petróleo, gás, combustíveis e minério (ver
  Minério, adiante).

### Meio ambiente (09/nov)

- **O órgão faz o trabalho:** cada país declara o seu órgão ambiental. Ele recebe a verba
  da Fiscalização ambiental, escolhe sozinho onde agir, multa e licencia. Não existe
  botão de pressionar: pressão só como resposta a um papel, e fica no registro que
  pode vazar.
- **De onde vem o desmatamento:** do lucro do agro contra o risco de punição. Carne e
  soja caras avançam sobre a mata, sem nenhuma lei escrever isso. A Reserva da fazenda
  (esfera Terra) define o que é ilegal; baixá-la é uma anistia disfarçada.
- **O que o partido faz:** o jogador é o partido. O presidente assina as leis e responde
  aos papéis. Lei dura racha os deputados conforme o estado de cada um, e chega o papel
  "expulsar ou perdoar". O governador pede alívio por papel: atendeu, fica no registro;
  negou, ele fala mal do partido. A companhia poluidora oferece dinheiro em troca de
  voto. Sem a Presidência, os deputados propõem leis e convocam o chefe do órgão, e o
  partido ataca nas mídias.
- **Independência do órgão:** com o presidente mandando, a licença nunca é negada e o
  órgão fica mais corrupto. Com chefe com mandato, chega o papel: assinar por cima, com
  escândalo, ou atrasar e arriscar o apagão. Independente, você não assina: espera ou
  muda a lei. Trocar o chefe é um Ato que só existe nos dois primeiros degraus.
- **Licença:** toda licença que passa sem exame sobe na hora o Desmatamento ou as
  Emissões, e os países compram menos do agro. Obra do Estado sempre passa pelo órgão; a
  certificadora privada vale só para obras privadas.
- **Conta, índice e evento:** emissões são conta por companhia. Os índices são Emissões
  de carbono, Desmatamento e Qualidade do ar, que alimenta o índice Meio ambiente lido
  pela Saúde ambiental. Queimadas e vazamentos são eventos. O número do desmatamento
  por estado aparece dentro do papel.
- **Produtos novos:** Terras raras, Baterias e Veículos elétricos. Terras raras vêm de
  importação ou do que o país declarar, servem também às usinas eólicas, e quem produz
  pode sancionar pelo mercado. O Subsídio a carros elétricos sobe a Energia gasta.

### Ciência e pesquisa (09/nov)

- **Nível de tecnologia por produto:** um número, sem árvore. Fábrica de produto acima
  do nível produz caro e pouco, e o mundo avança: quem para fica para trás.
- **Dois números:** o **nível próprio** vem da verba e de gente formada; é lento e caro,
  ninguém tira, e sozinho basta para subir. O **nível emprestado** vem de cooperação,
  fábrica estrangeira ou cópia; é rápido, cai quando cortam o acesso, e só vira próprio
  com técnicos e verba naquele setor. Cópia entra como emprestado, sem dono para cortar.
- **Companhias:** cada uma tem conta de gasto em pesquisa, paga do lucro, que sobe a
  Produtividade dela e o nível do produto. Cada uma fica um pouco atrás do nível do
  país: patente longa aumenta essa distância, invenção aberta diminui.
- **Verba:** a Verba de ciência e tecnologia diz quanto; a Divisão reparte 100% dela em
  7 fatias (Ciência básica, Saúde e remédios, Indústria e chips, Energia e baterias,
  Agro, Defesa, Espaço). Cada fatia tem cadeado e rende menos quanto maior. O que passa
  do que os técnicos dão conta vira corrupção do órgão.
- **Tempo:** investir é apostar que o partido segue no poder. Se seguir, colhe; se perder,
  o sucessor colhe e os dois disputam o crédito nas mídias. Um gráfico do futuro por
  produto mostra o que vem. Cortar dói na hora: cientista demitido vai embora, e
  recomeçar custa mais do que manter.
- **O partido:** o órgão escolhe onde ficam os **polos de pesquisa**, que formam técnicos e
  atraem fábricas do produto para o estado. O governador pede o polo por papel, e polo
  político em estado sem técnicos rende menos. O deputado pede emenda de pesquisa.
  Edição de genes racha a bancada conforme a Bússola: "expulsar ou perdoar".
- **Limites da pesquisa** são três leis: Edição de genes em pessoas, Testes em animais e
  Pesquisa com vírus perigosos. Vazamento chega como papel: abafar, e fica no registro,
  ou divulgar, com crise menor agora.
- **Programa espacial:** a lei escolhe só o alvo (satélite, foguete, astronauta, estação ou
  Lua), qualquer um direto. A fatia Espaço define o ritmo, e o gráfico mostra o ano
  previsto. Mirar alto gasta em peças que só rendem ao chegar. Anunciar o ano é Ato
  opcional. Marte está fora (autor). **A Lua é corrida:** a tela mostra em que ponto cada
  potência está, quem chega primeiro leva a maior parte da reputação, e entrar no
  programa de outro país, pela Cooperação científica, sai mais barato e a glória é dele.

### Agricultura e pesca (09/nov)

- **A briga central:** o produtor quer preço alto, e a cidade quer comida barata. Quando a
  comida dispara, chega o papel **comida cara**: soltar o estoque (o preço cai, o
  produtor perde e o estoque acaba), travar a exportação (Ato temporário, dentro do limite
  do Controle de exportação), importar (gasta dólares e quebra o produtor) ou não fazer
  nada (protesto e queda da aprovação).
- **Nenhuma lei dá lucro a produto:** mexem no custo ou em quem compra, e a cadeia
  espalha. A produção é por estado, em fazendas pequenas, médias e grandes.
- **O dinheiro depende de quem recebe:** ajuda ao produtor sobe o preço e o aluguel da
  terra. Subsídio sem teto valoriza a terra do grande e expulsa o pequeno; crédito com
  teto e compra do pequeno quase não fazem isso.
- **O campo fala com o resto:** máquina subsidiada empurra gente para a cidade, irrigação
  disputa água com a hidrelétrica na seca, e grão disputa com a ração. Sementes
  transgênicas dependem do nível de tecnologia do agro; conferir crédito por satélite
  depende do Programa espacial ou de comprar imagem de fora.
- **Compra pública:** o Estado compra uma parte da sobra de grãos, nunca do que falta. O
  estoque é conta e estraga.
- **O partido:** o governador pede socorro na seca e disputa a irrigação por papel; a
  bancada do agro racha ou cobra as leis duras; o doador rural oferece dinheiro por voto.
- **Pesca:** o peixe é contado por mar compartilhado, então a frota do vizinho pesa na sua
  conta. O Acordo de pesca é Posição por país. O mar fica com a Fiscalização ambiental, e a
  ficha do órgão mostra quanto vai para lá.
- **Eventos:** seca, colapso da pesca e carne contaminada, que chega como papel: abafar ou
  recolher.

### Terra (09/nov)

- **A fila é visível:** o órgão de terras mostra quantas fazendas há em cada etapa: vistoria,
  prazo de defesa, terra obtida, assentamento e título. Cada lei empurra uma etapa, e o
  partido não escolhe fazenda.
- **Duas contas por estado:** **Preço da terra** (compra em massa sobe; Agricultura usa
  também) e **Segurança da terra** (cai com desapropriação e ocupação, mesmo pagando bem;
  com ela baixa, os donos investem menos, e ondas repetidas pioram).
- **Comprar ou desapropriar:** comprar só alcança quem aceita vender, terra pior e longe,
  com mais fracasso. Desapropriar pega a fazenda da fila e assusta os donos.
- **Assentamento:** sem apoio, a família vende, vai embora e a terra reconcentra. Instalado,
  o assentado é pequeno produtor de Agricultura. Título sobe o investimento e deixa
  exposto a vender; sem poder vender fica protegido e investe menos.
- **Movimentos sem-terra** nascem sozinhos quando a terra se concentra e ocupam fazendas.
- **Papéis na mesa** (não são leis): fazenda de deputado aliado entrou na fila, ou vistoria
  comprada: segurar ou deixar correr. Segurar fica no registro, sobe a corrupção do órgão
  e a fazenda vira alvo preferido de ocupação. O governador manda ou não a polícia ao
  despejo. O movimento aliado ocupa a fazenda do seu doador: você fica com um dos dois.

### Construção civil (09/nov)

- **Duas filas, um setor:** a fila pública e a fila privada usam a mesma capacidade de
  construir. A lei Prioridade das obras diz qual vem primeiro, e o que uma não usa a
  outra usa. É aqui que o partido escolhe um lado.
- **O jogador só vê a fila e mexe só pelas leis.** A bolha Construção civil abre as duas
  filas, que mostram a companhia e o que ela está construindo. Para subir a obra de um
  setor, dá-se mais dinheiro a ele.
- **Público:** constrói o que o país mais precisa e o que o governo pagou, sem olhar lucro.
  Companhia do Estado pode dar lucro, e isso é bom para o Estado.
- **Privado:** constrói onde dá lucro. A companhia cresce por conta própria e constrói
  quando atinge o lucro necessário.
- **Dinheiro:** verba de construção com Divisão de 100% entre as áreas. Subir uma fatia
  derruba as outras; aumentar a verba sobe tudo.
- **Preço:** muita obra sobe cimento e salário, e o mesmo dinheiro rende menos.
- **Quem constrói:** a construtora nacional é uma companhia do Estado, na lista de
  companhias, e cresce pela Verba das estatais e pela fatia Estatais da Verba de construção. A privada
  cresce com impostos e incentivos ao setor, ou com a venda da nacional. A capacidade do
  país é a soma das duas. Cartel só nasce entre as privadas.
- **Cartão da obra:** diz o motivo do atraso e Quem resolve acende as bolhas das leis.
- **Papéis, que também saem como notícia:** obra cara (adiar obras públicas, importar
  cimento por um tempo, trazer operários de fora ou não fazer nada); cartel (acordo com
  delator, punir duro, ou prender e estatizar); companhia que quebrou, por golpe ou crise
  (deixar quebrar, estatizar ou vender); emenda de deputado.
- **Eleição:** inaugurar dá voto; obra inacabada na campanha vira ataque.

### Transporte (09/nov)

- **Competência:** o presidente só assina o que é federal. Ônibus da cidade, passagem,
  rodízio e estacionamento são municipais; o arquivo do país declara. O federal age por
  regra geral ou programa, como o passe livre onde a cidade aderir.
- **Fala de gente:** cada lei diz quem é atendido e quem paga. Direito de quem trabalha
  vai para Trabalho, e família removida por obra vai para Moradia.
- **Dinheiro:** a Verba de conservação mantém o que existe; obra nova sai da fatia
  Transportes da Verba de construção. O órgão reparte, e linhas e rotas são automáticas.
- **Táxi e aplicativo:** Regularização dos aplicativos, Concorrência entre táxi e
  aplicativo e o Desconto no carro de quem vive de dirigir.
- **Carro elétrico:** Carregadores nas estradas federais, Quem pode vender recarga e
  Elétrico paga a estrada, além do Subsídio a carros elétricos e do Fim dos carros a
  combustão.
- **Multa justa:** o Peso da multa escolhe se a multa é igual para todos, pelo preço do
  carro ou pelo salário.
- **Megaobra e Encomendar usina** seguem como escolha direta do presidente: são
  promessas com papéis, não arrumação de fila.

### Cultura e patrimônio (09/nov)

- **Uma fila no órgão de Patrimônio,** com a forma da fila de Terra. Os grupos pedem
  sozinhos, conforme tamanho e insatisfação. Etapas: Pedido, Estudo, Decisão e Conservação,
  e cada lei empurra uma: Quem pode pedir, O que pode ser protegido, Direito do dono e
  Preço de museu e parque federal. O partido não escolhe o casarão.
- **Dois tipos de pedido:** proteger (casarão, terreiro, festa, monumento) e retirar
  (estátua ou nome de ditador e escravocrata, símbolo de fé em repartição federal).
- **Quem decide:** o órgão resolve os casos calmos. O disputado vira papel na mesa e notícia.
- **Símbolo de fé segue a Religião do Estado:** com Estado laico, o pedido de tirar a imagem
  costuma passar; com religião oficial, a imagem fica e o pedido morre. Mexe na Tensão
  religiosa. Não há lei própria.
- **Estátua vira disputa entre grupos:** um pede para retirar e outro para proteger a mesma
  estátua. Papel: tirar, pôr placa ou deixar.
- **Cada sim é conta para sempre:** a fatia Patrimônio paga a conservação, e se ela não
  acompanha, os bens começam a estragar. **Cada não é definitivo:** o casarão recusado vira
  estacionamento e não volta.
- **Na bolha:** "12 na fila · 2 na sua mesa · 9 bens em risco". Bens em risco é índice:
  bens protegidos sem o dinheiro da conservação. Os outros dois são números da fila.
- **Efeito:** quem pediu aprova, quem perdeu reclama, e o que é protegido leva turista a
  Hotel e restaurante.
- **Papéis:** casarão do deputado aliado entrou na fila; Museu em risco (tirar de outra
  fatia ou arriscar o incêndio); dia sagrado (o fiel faz a prova noutro dia, e o colega
  cobre o plantão).
- **Fora da fila:** Verba de cultura e esporte com Divisão de 100%, Empresa banca cultura e
  desconta do imposto, Conteúdo nacional, Meia-entrada, Idade para filme e TV e o Ato Sediar
  grande evento. Férias subsidiadas e Feriados nacionais ficam em Trabalho.
- **Fora do jogo:** clube, torcida, estádio e categoria feminina. Um governo nacional não
  controla isso.
- **Na programação:** a fila deve nascer genérica, porque serve a Terra e ao Patrimônio.

### Defesa civil (09/nov)

- **O desastre chega sozinho:** a gravidade sai do clima e do país. O estrago é a gravidade
  menos o índice **Preparo contra desastres**, que sobe devagar com verba e cai sozinho a
  cada turno. Cortar a verba sobra dinheiro agora, e a conta vem no desastre seguinte.
- **O partido não opera:** bombeiros são dos estados, e encosta e uso do solo são das
  cidades. O federal dá dinheiro e regra geral, e o órgão age sozinho. O jogador não escolhe
  a região socorrida; a ajuda segue a gravidade.
- **Governador:** com aliado, a verba rende mais; com oposição, ele demora e culpa o
  presidente.
- **Na bolha:** selo verde, amarelo ou vermelho, o Preparo e os últimos 3 desastres, com
  quanto o preparo evitou.
- **O papel tem povo:** o que houve; quem sofre, com nome e voz ("Dona Lúcia, 4 filhos,
  perdeu a casa"); o que fazer, com as opções na primeira tela. Sem resposta, vale esperar,
  a pior opção. O mesmo texto sai como notícia.
- **Papéis:** enchente (liberar a reserva inteira, metade com contrapartida do governador,
  ou esperar o estado pedir); encosta cede (ajudar as famílias, remover o bairro vizinho ou
  só reforçar o aviso); barragem rompe (socorrer e cobrar a empresa, ou acordo rápido e
  silêncio, com escândalo se vazar); prefeito pede ajuda (com fiscalização, mais lento, ou
  sem, com risco de desvio); incêndio na mata (mandar o Exército, tirando da Defesa, ou
  deixar ao estado); reconstrução (reabrir a estrada ou pagar o aluguel de quem ficou sem
  casa).
- **Leis:** Verba da defesa civil com Divisão de 100% (Prevenção, Resposta, Reconstrução),
  Alerta de desastre, Reserva de emergência, Ajuda a quem perdeu a casa e Verba só com regra
  de área de risco. Remoção de área de risco e Aluguel social seguem em Moradia.

### Minério (09/nov)

- **O jogador não escolhe mina.** A lei decide quem fica com o dinheiro e quem paga a conta;
  a companhia abre onde dá lucro.
- **Sem índice próprio:** mina fechando já aparece no Desemprego e no papel.
- **Quem aparece:** o garimpeiro, a cidade da mina, a aldeia e a vila abaixo da barragem, com
  o número de famílias que ganham e perdem. Quem foi ignorado em papéis anteriores cobra
  mais forte.
- **Leis:** Imposto sobre o minério, Garimpo, Áreas abertas à mineração, Parte do dono da
  terra, Prazo para acabar com barragem velha, O que a mina deixa quando fecha e De onde
  veio o ouro.
- **Reaproveita:** Destino dos royalties reparte também o imposto do minério e ganha a fatia
  cidades da mina. Garantia contra acidentes vale para barragem. Imposto sobre exportação e
  Controle de exportação têm minério e terras raras como setores. Terras indígenas e
  Exploração em áreas protegidas seguem decidindo onde pode ter mina.
- **Papéis:** barragem com rachadura (parar a mina ou deixar rodar); garimpeiros invadem a
  aldeia (expulsar com a polícia, negociar uma área ou deixar); mina anuncia fechamento
  (socorrer a cidade, treinar para outro trabalho ou deixar quebrar); mineradora ameaça
  demitir (baixar o imposto ou recusar).

## 17. Tela: mapa e mesa

Duas telas de jogo: o **mapa** (o que você propõe e o país como está) e a
**mesa** (o que os outros põem na sua frente).

### Mapa

- Leis são bolhas agrupadas em áreas; índices, grupos, organizações, mídias e
  potências aparecem no mesmo mapa.

### Mesa (assinar e carimbar)

**O que o jogador faz:** despacha a pilha de papéis do turno, um a um, com
carimbo. Há a **mesa do presidente** (governo) e a **mesa do partido**.

- **Carimbos:** _Assinar_, _Vetar_ (só lei), _Recusar_, _Encaminhar ao
  ministro_, ou deixar na pilha.
- **Papéis do presidente:**
  - **Lei aprovada pelo Congresso:** assinar vira lei; vetar devolve ao
    Congresso, que pode derrubar o veto. O papel tem prazo; **ignorado até o
    prazo, vira lei sozinho** (o país declara a regra: silêncio é sanção ou
    é veto).
  - **Situações:** saem dos dados do país (enchente pede verba de
    emergência, greve pede reajuste, empresa quebrando pede socorro,
    potência oferece acordo). Duas ou três respostas, cada uma com ganho e
    custo; assinar pode virar gasto, lei proposta ou efeito direto.
  - **Pedidos:** aliado pede ministério ou verba, ministro pede demissão,
    governador pede obra.
- **Papéis do partido:** doador oferece dinheiro com interesse, político
  conhecido quer se filiar, deputado que votou contra (expulsar ou perdoar),
  aliado propõe coligação.
- **O Congresso usa a mesa como arma.** A oposição com votos aprova leis em
  lote, longe da sua bússola. Você veta uma a uma (cada veto irrita quem
  aprovou e vira manchete) ou deixa passar o que não dá tempo de ler.
- **Tempo do presidente:** só dá para despachar alguns papéis por turno
  pessoalmente. O resto fica na pilha ou vai ao ministro.
- **Encaminhar ao ministro** poupa tempo, e o ministro decide pela ficha:
  competente acerta mais, desleal decide a favor dele, desonesto assina o
  que rende propina.
- **Ignorar tem consequência**, conforme o papel: lei passa, situação piora
  (enchente sem verba vira crise e manchete), aliado ignorado se afasta,
  doador vai para outro partido.
- **A mídia lê a mesa:** vetar lei popular ou assinar lei impopular vira
  manchete.
- **Nada de roteiro:** todo papel nasce do estado do país e das fichas
  (princípios 8 e 12). Lei assinada aparece e muda no mapa como bolha.

### Comum às duas
- **Fichas** de pessoas (presidente, vice, ministros, líderes) abrem por
  cima do mapa: retrato genérico, atributos, posição na bússola.
- **Momentos do partido** (montar ministério, chapa, coligação, campanha)
  são telas curtas de escolha, não painéis.
- Manchetes do turno, votação, passar o turno, salvar e carregar.
- Dinheiro na moeda do país. A tela só lê e chama a partida; não calcula.

## 18. Perguntas em aberto (requisitos a decidir)

Ideia nova entra aqui. Decidida pelo autor, vai para o sistema dela.

**Partido e governo**
- O que o presidente de outro partido pode fazer contra você e quanto dura.
- Quantos ministérios o país tem no começo.

**Mesa**
- Quantos papéis o presidente despacha por turno; prazo de cada papel.
- Se o veto pode ser parcial (vetar só um trecho da lei).
- Lista dos tipos de situação e de pedido.

**Mídia e campanha**
- Quantas ações de campanha por turno.

**Bússola**
- Quais eixos novos entram (talvez 3 eixos, um cubo; candidato: paz ×
  militarismo). Precisa de estudo.

**Base do jogo (05/nov)**
- Como a renda de cada pop sai de salário e lucro sem o turno 0 mudar de valor.
- Quanto falta de trabalhador freia a produção.
- Regras e números de nascer, envelhecer e morrer, e como ficam nas faixas do pop.
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração.
- Como medir a força de um grupo e quanto ela muda a popularidade de uma lei.
- Quais serviços do Estado aceitam terceirização além dos já listados na planilha.

**Economia**
- Quanto do lucro privado vai aos investidores e quanto à reserva.
- Custo e prazo de cada tipo de obra (números).
- Se a verba da estatal é uma lei por estatal ou por setor.

**Terra e moradia**
- Se o êxodo aparece como índice ou só como gente mudando de pop.
- Lista das leis do campo nos 6 lados e as colisões delas.
- Se a desapropriação de terra parada é uma lei só (campo e cidade) ou duas.
- Números: velocidade do êxodo, custo da casa, ritmo da autoconstrução.
- **Tomar e dar destino (04/nov):** o Estado toma terra ou empresa
  (desapropriação, estatização; a Indenização diz quanto paga) e o bem tomado
  precisa de um destino: **comunidade** (dona coletiva, não vende; esquerda/
  verde), **Estado** (fica dono e arrenda; autoritário) ou **famílias com
  título** (direita). Cada destino é uma lei própria, de "nada" a "mais" no seu
  lado, nunca uma lei de 3 opções. Falta decidir: o que acontece quando duas
  leis de destino valem juntas (divide? colide?), se empresa e terra usam as
  mesmas leis, e o que a comunidade produz. Substitui "Dono da terra",
  "Terra comunal" e "Arrendamento", recusadas (cruzavam a bússola ou
  dependiam de terra que o Estado ainda não tem).
- **Ocupação de terra (04/nov):** "Terra invadida fica de fora" (fazenda
  ocupada sai da fila da reforma agrária por 2/4/8 anos) foi retirada:
  misturava ocupação, fila e prazo, e a fila (vistoria → desapropriação) ainda
  não existe. Voltar quando a fila existir, como leis separadas nos dois lados:
  uma que castiga a ocupação (autoritário) e uma que a acelera (esquerda), e
  dizer quais terras entram (só improdutivas?). Entrou em 09/nov: Terra ocupada sai da fila e Terra ocupada anda na frente;
  quem entra é definido por O que conta como terra parada.
- **Saneamento e a bússola (04/nov):** o pacote da rede tem esquerda, direita e
  verde. O lado tradicional/autoritário fica vazio por decisão do autor: o tema
  não tem lei natural desse lado, e não se inventa lei só para preencher.
- **Área da saúde (04/nov):** 19 leis aprovadas pelo autor. Feitas: Verba,
  Abertura de planos, Limite aos planos, Atenção preventiva, Telemedicina livre
  Serviço obrigatório (4 níveis, de quem estudou de graça até lugar sorteado),
  Seguro na folha (4 níveis, de sem seguro até formais e família), Cobertura
  gratuita (4 níveis, de só urgência até tudo para todos), Coparticipação, Dedução
  do plano, Conta de saúde, Filantrópicos, Carreira exclusiva, Gestão privada,
  Missões médicas, Saúde ambiental, Vacinação e Direito de recusar (05/nov, 4
  níveis cada). O Imposto sobre vícios virou a parte **Vícios** da saúde, com 12
  leis e 3 índices fechados em 05/nov: desenho em
  [fase-1-redes.md](fase-1-redes.md). Colisões:
  Cobertura × Coparticipação, Carreira × Gestão, Vacinação × Recusar, Limite ×
  Dedução, Seguro × Conta, Conta × Cobertura.
- **Redes (05/nov):** suspenso. Saúde e saneamento são parecidos, não iguais; os
  mecanismos se decidem depois da planilha `docs/jogo/leis.xlsx`.
- **Formação de profissionais (04/nov):** fica na área da educação, não na
  saúde. Um profissional se forma pelo público ou pelo privado. Leis para ver
  quando a educação for avaliada: vagas públicas, faculdades privadas e
  validação de diploma estrangeiro. Em 07/nov entraram mais 15 ideias de lei e o
  índice Vagas na escola na planilha; faltam conferir os roteiros. Validação de
  diploma estrangeiro e Ensino técnico ficam no centro da Bússola: os estudos não
  dão lado, e a reação vem do efeito nos pops.
- **Sistema judiciário (07/nov):** tribunais e juízes como peça do jogo; a
  Indicação de juízes e o Foro especial mexem nele. Desenhar depois.
- **Capital nova (09/nov):** ideia de megaobra guardada; não entrou na lista.
- **Custo dos atos com a mídia (08/nov):** quanto cada ato (entrevista,
  pressão, processo, notícia falsa) desgasta e por quanto tempo o efeito dura
  fica para as narrativas, quando definirmos o que vários índices batendo
  metas juntos significam.
- **Crises do dinheiro (08/nov):** corrida ao banco, resgate banco a banco e
  ataque à moeda são eventos de decisão, a escrever nas narrativas; as leis de
  Moeda e bancos só montam o cardápio.
- **Compra escondida por laranjas (08/nov):** o partido tentar comprar ação sem
  avisar, virando escândalo se descoberto; ideia para depois.
- **Caminhos sem núcleo reduzido (08/nov):** o jogo deve ter centenas de caminhos
  possíveis, por isso não se corta um núcleo de ~40 leis. O jogador pode focar numa
  área (ex.: segurança pública), gastando uma **cota** ali, e ganhar a eleição pela
  promessa mesmo sem focar no resto. A definir: o que é a cota e como a promessa
  entra na eleição.
- **Problema de otimização: estados × pops (08/nov):** com pops divididos por estado, o
  Brasil passa de 32 para 32 × 27 = 864 pops. Estudar quanto isso pesa no turno do
  motor, antes de programar.
- **Governadores (08/nov):** com estados em tudo, falta desenhar quem governa cada um.
  Quem cuida de luz, gás e água muda por país (no Brasil a luz é federal e o gás
  canalizado é estadual; nos EUA a distribuição é regulada por cada estado). O arquivo
  do país declara; lei que não cabe ao presidente fica inativa e alguém pode propô-la.
  O jogo pode mostrar ou gerar avatar para governadores, mas eles têm pouca influência.
- **Aba dos 30 países (08/nov):** pesquisar PIB, lado na bússola, poder militar e
  relações entre os países; deixada para o planejamento (autor).
- **Vírus para fins militares (09/nov):** saiu de Ciência e pesquisa; decidir em Defesa
  se vira lei ou degrau.
- **Para as narrativas (09/nov, autor):** massacre no campo chega como papel; dono na fila
  desmata para provar que produz; Liberação de armas sobe o Conflito no campo.
- **Planejamento final (08/nov):** depois das esferas, montar a planilha completa
  com tudo o que foi organizado e as mecânicas, e o documento que, junto com
  este GDD, escreve todo o jogo e toda a mecânica, passo a passo.
- **Medida provisória (07/nov):** caminho para aprovar qualquer lei na hora, sem
  esperar o Congresso. Vale por um prazo; se o Congresso não votar, cai. Cada uso
  irrita o Congresso, mais a cada vez. O nome é rótulo do país; no motor é um
  decreto provisório. Desenhar com o Congresso (seção 12).
- **Marcas na régua da lei (07/nov):** a lei contínua mostra, sobre a régua,
  marcas de referência calculadas pelo motor, sem virar lei nova. Exemplo na
  Verba das aposentadorias: quanto cada aposentado recebe em dinheiro, a marca
  "compra o mesmo que no ano passado" (acompanha os preços) e a marca "acompanha
  quem trabalha" (acompanha os salários). O jogador vê se está subindo ou
  cortando de verdade. Vale para toda verba e imposto.
- **Leis das forças armadas (07/nov):** o Regime dos militares, da Previdência,
  abre leis na Defesa (soldo, carreira, tamanho das forças). Ver quando a Defesa
  for avaliada.
- **Organizações (06/nov):** fechadas na seção 11. Faltam regras e números de
  nascer e crescer, ações de cada tipo e como o jogador as enfrenta.
- **Programas reais (11/nov):** a coluna "Programa real (de quem)" da planilha
  liga cada lei aos programas de governos reais que ela faz. Uso futuro: um
  desbloqueio ("você imitou o programa tal do presidente tal") quando o jogador
  monta as mesmas leis, e campanhas de imitar um presidente ou construir o país
  a partir dele. Presidente real entra só na campanha e no desbloqueio, nunca no
  texto da lei.
- **Caminhos até a casa (04/nov):** governos de lados diferentes chegam à casa
  por caminhos diferentes, e o setor privado tem seus ganhos e perdas por lei.

**Órgãos**
- Órgãos do Estado como peça do jogo (um fiscal ambiental, um de terras, um
  de vigilância sanitária…), com verba, necessidade e corrupção. Cada
  processo tem o seu. Falta decidir: lista, se ficam sob os ministérios
  (seção 6), se o ministro mexe na força deles, nomes fictícios.

**Mundo**
- Como um ataque acontece e como termina.
- Mídia (R14, R8.5, R11.4): quando abrir e como empurra a bússola dos pops. Autor
  quer ir com calma; pops e grupos fecham sem ela.

**Fora do jogo pronto (decidido):** guerra iniciada pelo país, partido único jogável, tribunal superior, pesquisa e tecnologia
como árvore.

## 19. Regras de conteúdo

- Nada do Democracy 4 (nome, número, ligação). Victoria 3 só como ideia.
- **Países reais podem entrar** (autor, 08/nov); pessoa, empresa e o que tem
  direito autoral não. Retratos genéricos para pessoas e empresas.
- O que é público e sem marca pode ser usado (nomes de moedas, cargos,
  instituições comuns); o que tem marca ou dono ganha nome alternativo
  parecido.
- Lei e texto se medem pelo próprio país da partida ("2 salários médios do
  país"), nunca por país real.
- Antes de publicar: conferir com advogado.

## 20. Mapa dos documentos

| Pergunta | Onde |
|---|---|
| O que é o jogo e por quê | este GDD |
| Requisitos e status de cada um | [requisitos.md](requisitos.md) |
| O que está feito, ordem e como construir | [plano-de-desenvolvimento.md](plano-de-desenvolvimento.md) |
| Planilha de leis, índices, esferas, ligações, pops, grupos, organizações e economia | `docs/jogo/leis.xlsx` |
| Onde parei | `RETOMAR.md` |
| Como cada peça se comporta | `src/motor/<módulo>/<módulo>.md` |
| Referência do mercado do Victoria 3 | [mercado-vic3-referencia.md](mercado-vic3-referencia.md) |
| Escopo, experiência e bússola antigos | `docs/historico/` |
