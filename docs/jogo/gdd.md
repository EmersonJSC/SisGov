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

## 3. Princípios (as regras que nunca mudam)

1. **Leis são o núcleo do governo.** Tudo o que o Estado faz passa por lei;
   mudar uma lei muda o jogo.
2. **Decisão de governo é uma bolha de lei no mapa**, nunca um painel de
   gestão. Regra nova (propriedade, mercado, mídia) chega ao jogador como
   lei. As **decisões do partido** (chapa, ministros, coligação, campanha)
   são escolhas curtas sobre pessoas e alianças, feitas em momentos certos,
   também sem painel. O que **os outros** propõem (leis do Congresso,
   situações, pedidos) chega como **papel na mesa** (seção 17).
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

## 4. Uma partida

### Começo

1. **Escolhe o país** (países inventados, cada um com economia, Congresso,
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

## 7. Leis

**O que o jogador faz:** propõe, muda e revoga leis.

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
- **Todo dinheiro passa por lei** (princípio 5). Não existe receita ou gasto
  "fora das leis": o que o país já gasta no começo está nas leis de partida.
- O texto da tela sai dos números da lei: texto e motor nunca discordam.
- O país declara as leis que tem; a que falta fica "não legislada" e pode
  ser proposta. Lei que não faz sentido no país não aparece.
- **Revogar** é propor a lei de volta a "não legislada"; também passa pelo
  Congresso.

## 8. Bússola política

**É a régua do jogo:** mostra para onde as escolhas levam o país, sem
decidir nada sozinha.

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
  internacional, segurança externa, aprovação.
- Índice novo só com decisão do autor.

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

- **Pops** (profissão × estrato, até ~25) com tamanho em pessoas, emprego,
  salário, capital e posição na bússola. A renda vem da economia.
- **Pops mudam:** estudam e vão para o setor que paga mais (formar gente
  leva turnos; universidades são construções); sobem ou descem de estrato.
- **Grupos de interesse** leem os pops: cada um com posição na bússola,
  tamanho, satisfação, radicais e lealistas. O país declara os grupos fortes
  dele (agro num, indústria noutro) e a satisfação de partida.
- **Satisfação** mede a vida do grupo (renda contra o esperado, leis perto ou
  longe dele, o que a mídia que ele vê diz).
- **Radicais** pesam na polarização, na violência política e no risco de
  atentado; **lealistas** seguram o voto do seu partido.

## 12. Congresso e coligação

**O que o jogador faz:** junta votos.

- **Partidos do país:** nome, cadeiras, posição na bússola, grupos que
  defendem, presidente com ficha.
- **Toda mudança de lei é votada.** Pedir mais de 1/3 da faixa de uma vez é
  exorbitante e cai.
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

- Duração e reeleição são leis essenciais do país. Mudar a duração no meio
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
- A campanha é nacional e mira **grupos**. Se o país declara regiões, há
  ação regional, sempre dentro da eleição nacional.

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

- **As mídias do país** (até ~5 grandes, declaradas pelo país, mais as
  redes): cada uma com dono
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

## 15. Mundo

- **Potências** (~5, sem nome real): posição na bússola, peso, opinião sobre
  o país que anda pela distância, interesses econômicos (compram, vendem,
  investem).
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

### Mercado

- **Produtos** do mundo, agrupados em setores, com cadeia entre setores (o
  que um setor produz é insumo de outro: aço → máquinas → veículos). A
  cadeia é o que liga uma empresa à outra na bolsa: lei que encarece o aço
  derruba o lucro da montadora.
- **Dois mercados:** o do país e o do mundo, com ciclos e choques de preço.
  O país produz uma parte e compra o resto.
- **Demanda dos pops:** o que chega a cada pop depende de quanto há, de
  quanto custa e de quem pode pagar; falta de comida vira fome.
- **Comércio:** importa o que falta e exporta o que sobra, pelas tarifas,
  subsídios e acordos (leis).
- **Energia e infraestrutura** são capacidade, não estoque: usinas, rede e
  ferrovias contra a demanda. Faltar encarece e trava a indústria.
- Setores com regra própria: moradia (própria, aluguel, programa do
  governo), remédios, militar (demanda pelo tamanho das forças).

### Construções

- Cada setor tem **construções** (fazenda, fábrica, usina, ferrovia,
  universidade) que existem para o cálculo; o jogador as vê em conjunto ("≈
  N fazendas"). Elas **produzem, empregam e dão lucro**.
- **O PIB é a soma do que as construções produzem.** Sobe quando uma obra
  termina, cai quando uma construção fecha. As bases dos impostos saem das
  construções e dos pops.
- **Obra:** cada tipo tem custo e prazo; obra mais difícil (usina,
  siderúrgica) pesa mais nos dois. Obras entram numa fila.
- **Construção civil** decide **quantas obras andam ao mesmo tempo** e quão
  rápido. Construção civil forte = mais obras e mais rápidas.
- **Corrupção** atrasa e encarece obras.

### Lucro e salário

- **Receita** = o que a construção produz × preço do produto no país.
- **Salário** = empregos × salário do setor; vai aos pops que trabalham ali.
  Sobe quando falta gente e o lucro é alto; cai quando sobra gente. Leis de
  trabalho (salário mínimo, participação nos lucros) mexem aqui.
- **Lucro** = receita − salários − insumos − impostos. Vai para o dono:
  - privado nacional: uma parte dividida entre os investidores (pops donos
    de capital e acionistas), outra para a reserva de investimento;
  - estrangeiro: sai do país (a lei de remessa de lucro decide quanto);
  - estatal: vai ao cofre;
  - cooperativa: vai para os trabalhadores.
- Construção com prejuízo por vários turnos fecha e demite.

### Empresas e dono

- **Empresa = conjunto de construções** de um setor. O país declara as de
  partida.
- **Dono:** Estado, privado nacional, estrangeiro ou cooperativa.
- **Quem paga a obra é o dono:**
  - **Privado:** o lucro enche a **reserva de investimento**, que abre obras
    nas empresas que dão mais lucro. Juro alto encarece o crédito e reduz o
    investimento.
  - **Estatal:** cresce quando o jogador põe verba nela (por lei). Paga do
    cofre; sem cofre, da dívida, e com juro alto essa dívida sai mais cara.
- **O Estado patrocina:** lei de incentivo, crédito barato ou obra pública
  num setor puxa o investimento privado para lá, sem o Estado ser dono.
- **Atos do Estado** (sempre por lei): estatizar (comprar ou tomar), criar
  estatal, transformar em cooperativa, vender a empresa inteira ou só uma
  construção (ex.: uma hidrelétrica grande). Empresas de energia podem ser
  vendidas; transporte fica no fundo do cálculo, sem decisão própria.
- **Ficha da empresa na bolsa:** clicar numa empresa (ex.: a petrolífera
  nacional) mostra as construções dela, da extração ao refino, e quanto cada
  uma produz.
- **Leis de propriedade** dizem como: indenização, prazo, regra pós-venda,
  política estatal, triagem estrangeira, remessa de lucro, fábrica de fora,
  concorrência.

### Bolsa (minigame Pregão)

- Ações em blocos de 2%, negociadas no turno. **Ação dá dividendo, não dá
  mando:** o dono só muda pelos atos do Estado.
- Preço do bloco = lucro da empresa × múltiplo; lei que baixa o lucro baixa
  o preço, e a cadeia espalha o efeito.
- Compradores (pops ricos, fundos, multinacionais, potências) com caixa
  próprio: vender muito de uma vez derruba o preço.
- O Estado compra e vende de verdade: o dinheiro entra e sai do cofre;
  grupos, mídia e potências reagem.
- O valor da compra da propriedade depende do valor na bolsa.

## 17. Tela: mapa e mesa

Duas telas de jogo: o **mapa** (o que você propõe e o país como está) e a
**mesa** (o que os outros põem na sua frente).

### Mapa

- Leis são bolhas agrupadas em áreas; índices, grupos, mídias e potências
  aparecem no mesmo mapa.

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

**Economia**
- Quanto do lucro privado vai aos investidores e quanto à reserva.
- Custo e prazo de cada tipo de obra (números).
- Se a verba da estatal é uma lei por estatal ou por setor.

**Mundo**
- Como um ataque acontece e como termina.

**Fora do jogo pronto (decidido):** guerra iniciada pelo país, alianças
militares, partido único jogável, tribunal superior, pesquisa e tecnologia
como árvore.

## 19. Regras de conteúdo

- Nada do Democracy 4 (nome, número, ligação). Victoria 3 só como ideia.
- Nenhum país, pessoa ou empresa real. Retratos genéricos.
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
| Onde parei | `RETOMAR.md` |
| Como cada peça se comporta | `src/motor/<módulo>/<módulo>.md` |
| Referência do mercado do Victoria 3 | [mercado-vic3-referencia.md](mercado-vic3-referencia.md) |
| Escopo, experiência e bússola antigos | `docs/historico/` |
