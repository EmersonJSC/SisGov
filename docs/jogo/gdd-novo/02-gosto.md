# II. Gosto (a população e como ela funciona)

> Rascunho de 14/nov/2026. Só junta o que já está decidido nas fontes. Nada foi
> inventado. Toda frase leva a fonte entre colchetes. Conflito entre fontes vem
> marcado "⚠ CONFLITO" e não foi resolvido.
>
> Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em
> `requisitos.md`.

## II.0 O lugar da População no jogo

- População, Economia e Governo controlam uns aos outros, com a População no
  centro. O ciclo não tem começo nem fim. [gdd.md:66-69]
- A população trabalha, consome e investe (para a Economia). Vota, apoia e
  protesta (para o Governo). [gdd.md:73,78]
- Economia paga salário, dá emprego e define preços para a população. Governo
  dá serviços, renda e direitos. [gdd.md:74,77]
- Política não é um quarto pilar. Partidos, grupos, Congresso e eleição são o
  caminho pelo qual a População controla o Governo. [gdd.md:80-81]
- Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que
  só mexe na opinião não basta. [gdd.md:131-132]
- O Victoria 3 é a referência da ligação "a economia mexe no pop, o pop mexe na
  política, a política mexe na economia". Os jogadores a elogiam. Outros jogos
  são criticados por ligação fraca (Frostpunk) ou que ninguém entende
  (Democracy 4). [mecanicas.md:42-45]
- Três camadas (fechado em 06/nov/2026): o pop é quem a pessoa é na economia. O
  grupo é como as pessoas agem juntas na política. A organização tem nome, líder
  e ação própria. [gdd.md:792-793] [memória project_tres_camadas]
- ⚠ CONFLITO (bússola contra bolso), vale para todo este capítulo:
  - Versão de 07/nov/2026 (GDD, seção 2): "A Bússola é a raiz do jogo… a distância
    diz quem gosta de quê". [gdd.md:63-64] [memória project_base_ciclo]
  - Versão de 14/nov/2026 (mecânicas): "A lei não diz quem gosta dela… o gosto
    nasce" do que o motor calcula no bolso. "A bússola continua, como a parte da
    ideologia na opinião, com peso menor que o bolso." [mecanicas.md:47-51]
  - Não resolvido. A de 14/nov não diz que revoga a de 07/nov. Ela diz que a
    bússola "continua", com peso menor. O autor precisa dizer se "raiz do jogo"
    continua valendo.

---

## II.1 Pops e o bolso de cada um

**1. O que é.** Um pop é uma fatia da população (uma profissão num estrato) que
trabalha, ganha, consome e vota; é o centro do jogo. [populacao.md:1-3]
[gdd.md:749-751]

**2. O que o jogador faz e sente.**
- O jogador não escolhe pop. Ele passa leis, e cada pop sente de um jeito.
  [gdd.md:754-755] [gdd.md:131-132]
- Quando a economia muda, cada pop sente de um jeito, e a renda nunca é uma
  parte fixa do PIB (regra de desenho). [gdd.md:754-755]
- Na tela, o jogador vê o país mudar sem placar: pessoas enriquecem ou
  empobrecem, empregos aparecem ou somem. [gdd.md:236-237]

**3. Peças.**
- **Tipos:** 32 pops em 4 blocos: fora do trabalho (5), donos (5), conta própria
  (4) e empregados (18). [gdd.md:749-751] [leis - Pops.tsv, contagem das linhas]
- **Como separar:** primeiro a situação (trabalha ou não), depois o vínculo e a
  ocupação. Estudantes, Aposentados e Crianças não têm estrato fixo.
  [gdd.md:752-753] [leis - Pops - revisão.tsv]
- **Dados de cada pop (colunas da planilha):** tamanho, estrato, renda (vezes a
  média), bússola econômica e social, onde trabalha, se vive de lucro, para onde
  sobe e desce, para onde pode estudar. [leis - Pops.tsv, cabeçalho]
- **Dados dentro do pop:** faixas de idade, cidade ou campo, vínculo de trabalho
  (formal, informal, público, próprio), escolaridade (fundamental, médio,
  superior), patrimônio e filhos por pessoa. [gdd.md:756-758] [leis - Pops -
  dados.tsv, cabeçalho]
- **Renda:** sai de salário, lucro, aluguel e transferência, nunca de uma parte
  fixa do PIB. [gdd.md:754-755]
- **Renda disponível hoje:** bruta menos imposto mais transferência. [populacao.md:11-16]
- **Subir e descer de estrato:** pela renda real contra o esperado. Sobe só com
  o índice exigido (ex.: instrução). Até 1% do pop por turno e 30% do total
  declarado. Pobre não desce e rico não sobe. [populacao.md:21-31]
- **Estudar e mudar de setor:** até 0,5% do pop por turno vezes a instrução.
  O destino precisa pagar 5% a mais. [populacao.md:55-60]
- **Cesta e bolso (feito no motor):** compara o preço da cesta com a renda de
  cada pop e mostra fome e carência. Conta quantos ficam abaixo da renda
  necessária para pagar conta, plano ou casa. [leis - Pops - como funciona.tsv,
  linhas Cesta e Bolso]
- **Resultado emerge:** a lei muda só um número. Se ela é boa ou ruim sai da
  renda do pop contra a conta, nunca de condição escrita na lei (04/nov/2026).
  [memória feedback_resultado_emerge]
- **Ponto de partida do estudo (Ipea, Brasil 2021):** a revisão mapeia cada pop
  no estudo do Ipea. [leis - Pops - revisão.tsv]

**4. Regras decididas.**
- 32 pops em 4 blocos, com crianças, estudantes e aposentados sem estrato
  fixo (revisão da planilha, sem data na fonte). [leis - Pops - revisão.tsv]
- Renda vem de salário, lucro, aluguel e transferência (05/nov/2026 aprovou a
  base; GDD). [gdd.md:754-755] [memória project_base_ciclo]
- Bússola do pop: cada pop tem a sua (R11.7, 03/nov/2026). [grupos.md:66-70]
  [requisitos.md:226]
- A lei vai ao pop pelo bolso: motor calcula o efeito em cada pop (14/nov/2026).
  [mecanicas.md:47-49]
- Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula,
  fica guardado ou sai do país (14/nov/2026). [mecanicas.md:52-53]

**5. Ligações.**
- Recebe da Economia: salário, emprego, preços, lucro, aluguel (renda por
  pop). [gdd.md:74] [requisitos.md:220]
- Recebe das Leis: renda direta (imposto de renda e transferência), mudança de
  pop, serviço. [leis - Pops - como funciona.tsv, linhas "Da lei ao pop"]
- Entrega à Economia: trabalho, consumo e investimento. [gdd.md:73]
- Entrega aos Grupos: os pops são a base dos grupos (cada grupo soma frações dos
  pops). [grupos.md:13-14]
- Entrega à Bolsa: o patrimônio dos pops muda com a ação, e eles reagem no voto
  e no investimento. [gdd.md:83-84]

**6. Referências.**
- Victoria 3: pops no centro (prédio sem pop não faz nada; pop com salário
  compra). [pesquisa-jogadores-14nov.md:58]
- Ipea Nota Técnica 64: ordem situação, vínculo, ocupação. [leis - Pops -
  estudos.tsv, linha Classes no Brasil]
- OIT (ISCO-08, ICSE-18, força de trabalho), Oesch, Great British Class Survey,
  Pew, ESeC: cada um dá um corte da lista de pops. [leis - Pops - estudos.tsv]
- ESeC diz que 25 a 35 pops bastam para um jogo. [leis - Pops - estudos.tsv,
  linha Classes na Europa]
- Democracy 4: a pessoa em vários grupos para o voto. [victoria3-e-democracy4.md:235]

**7. No motor hoje.**
- ◐ R11.1 Pops com renda da economia: a renda ainda é parte fixa do PIB.
  [requisitos.md:220]
- ✅ R11.5 Pops mudam de setor estudando. ✅ R11.6 Sobem e descem de estrato.
  ✅ R11.7 Cada pop tem bússola e desliza com a vida. [requisitos.md:224-226]
- ☐ R11.8 Dados dentro do pop. ☐ R11.12 32 pops em 4 blocos, com crianças.
  [requisitos.md:228,232]
- Hoje o motor tem 25 tipos (8 pobres, 11 médios, 6 ricos). [populacao.md:34]
  A planilha tem 32. [leis - Pops.tsv, contagem]
- ⚠ CONFLITO (o que a bússola do pop faz):
  - `populacao.md` diz que a bússola do pop "por enquanto só descreve o pop, ainda
    não move nada". [populacao.md:34-35]
  - `grupos.md` (03/nov/2026) diz que a bússola do pop anda por turno e "isso
    muda os votos do Congresso e a satisfação". [grupos.md:66-80]
  - O requisito R8.5 e a planilha dizem que o deslize funciona. [requisitos.md:194]
    [leis - Pops - como funciona.tsv, linha Bússola]
  - Não escolhi. Parece que o `populacao.md` ficou velho, mas ele não diz isso.
- Desemprego: o índice Desemprego e o pop Desempregados não se ligam. [leis -
  Pops - como funciona.tsv, linha Desemprego]
- Pop e emprego: o emprego e o salário saem da renda do pop, não o contrário.
  [leis - Pops - como funciona.tsv, linha Emprego e salário]
- Uma lei só (Transferência de renda) divide verba para um estrato. [leis -
  Pops - como funciona.tsv, linhas Transferência e Divisão da verba]

**8. Em aberto.**
- Quantos tipos de pop rodam de verdade no motor sem pesar. [mecanicas.md:203]
- Como a lei mira "idosos do campo" sem multiplicar pops. [mecanicas.md:203-204]
- Como a renda sai de salário e lucro sem o turno 0 mudar de valor.
  [gdd.md:2127] [mecanicas.md:210]
- Como a conta do bolso de Crianças lê a família (Crianças não têm renda
  própria). [leis - Pops.tsv, linha Crianças, coluna Observação]
- Faltam pesca e artesãos como pops próprios? O estudo diz que faltam; a revisão
  trata pesca em "Pequenos agricultores e pescadores". [leis - Pops - estudos.tsv]
  [leis - Pops - revisão.tsv]

---

## II.2 Demografia (vida)

**1. O que é.** Gente nasce, envelhece e morre. Jovem vira estudante e
trabalhador. Idoso se aposenta. [gdd.md:769-770]

**2. O que o jogador faz e sente.** É daqui que saem a Previdência, a escola e a
procura por saúde. [gdd.md:770-771] O jogador sente isso pelas leis dessas áreas.
(Como ele vê, não está decidido.)

**3. Peças.**
- **Faixas de idade dentro do pop:** criança, jovem (15 a 29), adulto (30 a 59) e
  idoso (60+). [leis - Pops - dados.tsv, cabeçalho]
- **Filhos por pessoa:** quantas crianças dependem de cada pessoa do pop, em
  média. Liga com benefício por filho, natalidade e bolso. [leis - Pops - como
  funciona.tsv, linha Filhos por pessoa]
- **Nascido fora (08/nov/2026):** dado dentro do pop, com o país de origem e a
  situação (legal, sem documento, refugiado). Alimenta imigração, remessas e a
  tensão com imigrantes. [gdd.md:759-763]
- **Pops que mudam:** estudar e ir ao setor que paga mais leva turnos. [gdd.md:771-772]

**4. Regras decididas.**
- Imigração aumenta o PIB. O salário cai um pouco só nos pops parecidos com os
  imigrantes. O crime não sobe por ser imigrante, e sim pelo desemprego e pela
  falta de acesso a serviços (08/nov/2026). [gdd.md:761-763]
- Natalidade e mortalidade pelo padrão de vida: é o que o estudo propõe
  aproveitar do Victoria 3, ainda sem decisão do autor. Ver II.3.
  [victoria3-e-democracy4.md:231-234]

**5. Ligações.**
- Entrega à Previdência, à Educação e à Saúde (idosos, estudantes, procura).
  [gdd.md:770-771] [leis - Pops - como funciona.tsv, linha Idade]
- Recebe do Mercado: o pop estuda e vai ao setor que paga mais. [gdd.md:771-772]
- Entrega à Economia (imigração e PIB). [gdd.md:760-761]

**6. Referências.**
- Victoria 3: natalidade e mortalidade caem quando o padrão de vida sobe, a
  mortalidade mais rápido. Abaixo de um ponto a população encolhe. [victoria3-e-democracy4.md:209-211]
- Pew: idade, escolaridade e lugar separam muito a política (EUA). [leis - Pops - estudos.tsv]
- OIT: quem tem idade de trabalhar se divide em empregado, desempregado e fora da
  força de trabalho. [leis - Pops - estudos.tsv]

**7. No motor hoje.**
- ☐ R11.9 Nascer, envelhecer, morrer. [requisitos.md:229] [mecanicas.md:212-214]
- Estudantes e Aposentados têm tamanho fixo. [leis - Pops - como funciona.tsv,
  linha Idade]
- Pessoas (elenco): idade de 35 a 74, e envelhecer, aposentar e morrer ainda não
  existem. [pessoas.md:17]
- ☐ R11.8 Dados de idade dentro do pop. [requisitos.md:228]
- Imigração (nascido fora): sem R próprio em `requisitos.md` na seção 11 que
  eu li; **não achei** onde está. (Ver "Para o revisor".)

**8. Em aberto.**
- Regras e números de nascer, envelhecer e morrer, e como ficam nas faixas do
  pop. [gdd.md:2129]
- Números de natalidade e mortalidade; como mexem em Previdência, escola e saúde.
  [mecanicas.md:215-216]

---

## II.3 Padrão de vida

**1. O que é.** No Victoria 3, o padrão de vida (1 a 99) de cada grupo de pessoas
vem da renda líquida contra o custo das necessidades. [victoria3-e-democracy4.md:204-207]
No SisGov **ainda não há decisão do autor** sobre ter ou não um número assim.

**2. O que o jogador faz e sente.** —

**3. Peças.**
- Hoje o jogo tem a **cesta** (fome e carência) e o **bolso** (quem paga conta,
  plano ou casa). [leis - Pops - como funciona.tsv, linhas Cesta e Bolso]
- Há índice "Padrão de vida" que os grupos cobram (ex.: Sindicatos pedem "mais
  Padrão de vida, menos Desemprego, mais Saúde"). [leis - Grupos.tsv, linha Sindicatos]

**4. Regras decididas.** —

**5. Ligações.**
- No Victoria 3, o padrão de vida mexe em natalidade, mortalidade, lealdade
  (radicais e lealistas) e na força política do grupo. [victoria3-e-democracy4.md:209-213]
- Preço alto dos bens encarece as necessidades e derruba o padrão de vida.
  [victoria3-e-democracy4.md:208]

**6. Referências.** Victoria 3, diário 13 (padrão de vida). [victoria3-e-democracy4.md:312]
O estudo recomenda aproveitar "quase tudo" para população e grupos: padrão de
vida por grupo (renda × custo de vida), radicais e lealistas pela **variação**, e
natalidade e mortalidade pelo padrão. [victoria3-e-democracy4.md:231-234]
Status do estudo: **ESTUDO**, "não decide nada" (22/out/2026). [victoria3-e-democracy4.md:3]

**7. No motor hoje.** Não há padrão de vida por pop. A tabela comparativa diz
"não" para o SisGov. [victoria3-e-democracy4.md:281] Cesta e bolso existem. [leis -
Pops - como funciona.tsv]

**8. Em aberto.**
- O autor quer um padrão de vida por pop? Ele substitui, soma-se a ou fica ao
  lado da cesta e do bolso? (Não achei decisão.)
- Ele é a fonte do "bolso" do gosto (II.4)? Em 14/nov o bolso é "renda, preço do
  que ele compra, emprego, serviço que recebe". [mecanicas.md:177-178] Não diz
  "padrão de vida".

---

## II.4 Opinião (bolso + bússola + memória)

**1. O que é.** A régua comum de gostar e não gostar, para todo ator, feita de
bolso, ideologia e memória. [mecanicas.md:141-146] [mecanicas.md:176-181]

**2. O que o jogador faz e sente.**
- Quando dá certo: um grupo que estava contra passa a apoiar; a eleição é vencida
  por pouco. [gdd.md:230-232]
- Quando dá errado: entende por quê. Nunca parece azar. [gdd.md:233-235]
- **Porquê à vista:** ao passar o mouse, cada parte com o seu número ("Operários:
  −6 imposto, +4 salário mínimo, −3 ideologia"), como faz o CK3. [mecanicas.md:182-183]
- Todo número que o jogador sente mostra de onde veio ao passar o mouse
  (SisGovpedia). [mecanicas.md:54-55]
- A SisGovpedia é uma enciclopédia em camadas: a frase curta, depois o porquê,
  depois a conta. [gdd.md:2044-2045]
- A bússola é interna: o jogador não a vê, só sente o apoio, a satisfação e os
  votos. [grupos.md:68-69]
- O jogo nunca fala de lado político ao jogador. [gdd.md:103-105]

**3. Peças.**
- **Bolso (o mais forte):** renda, preço do que ele compra, emprego, serviço que
  recebe. Calculado pelo motor a partir do que a lei mexe. [mecanicas.md:177-178]
- **Ideologia (bússola), com peso menor.** [mecanicas.md:179] [mecanicas.md:50-51]
- **Memória:**
  - Tirar dói mais do que dar agrada (no CK3, aumentar exigência custa −15 e
    reduzir dá +5). [mecanicas.md:180-181] [pesquisa-jogadores-14nov.md:41-42]
  - O ganho de um benefício antigo some com o tempo, mas a raiva de cortar
    continua. [gdd.md:2046-2047]
  - O eleitor julga a melhora, não o ideal: desemprego de 12% caindo a 10% agrada;
    de 6% subindo a 8% irrita. [gdd.md:2048-2050]
  - Mágoa passageira: pontos da bússola com força descontada pelo tempo (hoje, o
    ministro demitido). Cada grupo perde força vezes parecença, e as mágoas somadas
    tiram no máximo 15 pontos. [grupos.md:36-41]
- **Satisfação do grupo (como funciona hoje):** 0 a 100, começa em 50 (o marco do
  turno 0) e soma renda, índices cobrados e leis. [grupos.md:43-47]
  - Renda: 1 ponto por 1% de diferença, até ±25, contra a renda esperada. Crescer
    no ritmo normal não agrada ninguém. [grupos.md:49-53]
  - Índices cobrados: 1 ponto por ponto, até ±15 por índice. [grupos.md:54-55]
  - Leis (bússola): quanto cada lei se aproximou do grupo desde o marco. Uma lei
    move o grupo no máximo ±15. [grupos.md:56-64]
- **Raiva do grupo (0 a 100):** separada da satisfação. [requisitos.md:227]
- **Aprovação:** satisfação média dos pops, pesada pelo tamanho; é lida pelo
  Congresso e pela eleição. [requisitos.md:206] (R9.9)
- **Lista à mão de quem gosta:** evitar. Tropico, Stellaris e Democracy 4 fazem
  isso, e o veterano adivinha tudo; vira tarefa; "falta contexto". Com 500 leis,
  vira sorteio. [mecanicas.md:184-186] [pesquisa-jogadores-14nov.md:34-36]
- **Régua para todo ator** (ideia do autor, 13/nov/2026): grupo, partido,
  ministro, juiz, mídia e potência com a mesma régua, feita de ideologia,
  interesse e memória que some com o tempo, e faixas que destravam o que o ator
  faz (apoia, cobra, protesta, trai). [gdd.md:2075-2084] [mecanicas.md:143-146]
- **Rede da pessoa (como o jogador conhece o povo):** cada pessoa da lista tem
  perfil de rede social com o que posta, onde vai e o que diz sobre os temas.
  Nada diz "esta pessoa é de tal lado". [gdd.md:170-181]

**4. Regras decididas.**
- A lei não diz quem gosta dela (14/nov/2026). [mecanicas.md:47-49]
- Gosto = bolso (mais forte) + bússola (peso menor) + memória (14/nov/2026).
  [mecanicas.md:176-181]
- Tirar dói mais do que dar agrada (14/nov/2026). [mecanicas.md:180-181]
- Benefício vira costume; a raiva de cortar fica (14/nov/2026). [gdd.md:2046-2047]
- Eleitor julga a melhora, não o nível (14/nov/2026). [gdd.md:2048-2050]
- Porquê visível ao passar o mouse (14/nov/2026). [mecanicas.md:54-55,182-183]
- Evitar lista à mão de quem gosta (14/nov/2026). [mecanicas.md:184-186]
- Uma lei nunca decide sozinha o humor de um grupo: limite de ±15 (01/nov/2026).
  [grupos.md:62-64,109-110]
- Mídia não pesa ainda; até lá, a troca de ministro cobra direto nos grupos
  parecidos com quem saiu (13/nov/2026). [gdd.md:2085-2089]

**5. Ligações.**
- Recebe das Leis: onde a lei mexe no dinheiro e na vida (quem paga, quem
  recebe, preço, emprego, serviço). [mecanicas.md:47-49]
- Recebe da Economia: renda, preço, emprego. [mecanicas.md:177-178]
- Recebe da Bússola: a ideologia. [mecanicas.md:179]
- Entrega ao Congresso: nota do partido soma grupos que ele defende, povo
  (grupos pesados por pessoas), aprovação do governo. [politica.md:14-19]
- Entrega ao partido: o termômetro anda 1/4 do caminho até a satisfação dos
  grupos dele. [politica.md:79-80]
- Entrega à Eleição: aprovação (R9.9). [requisitos.md:206]
- Recebe da Mídia (falta): o efeito da lei na opinião deve passar pela mídia
  (R14.2 ☐) e a mídia mobiliza a raiva (R14.9 ☐). [requisitos.md:307,309]
- Recebe de Índices: grupos cobram índices. [grupos.md:15-16] [grupos.md:54-55]

**6. Referências.**
- CK3: cada causa da opinião visível ao passar o mouse; −15 contra +5.
  [pesquisa-jogadores-14nov.md:41-42]
- Victoria 3: padrão de vida caindo e desemprego radicalizam; riqueza dá peso
  político. Ponto fraco: o porquê nem sempre aparece. [pesquisa-jogadores-14nov.md:38-40]
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
  [pesquisa-jogadores-14nov.md:44-45]
- Frostpunk, Democracy 4 (ligação fraca ou opaca). [mecanicas.md:44-45]
- Aviso das próprias fontes: elas "podem estar velhas" e são lição, não conteúdo.
  [pesquisa-jogadores-14nov.md:4-6]

**7. No motor hoje.**
- Satisfação lê renda, índices e leis pela bússola. ◐ R11.4 (falta mídia e
  programas). [requisitos.md:223] [mecanicas.md:56-58]
- O bolso só se mexe por imposto de renda e transferência. As outras cerca de 480
  leis agradam ou irritam só pelo ponto chutado na bússola. A verba gasta não
  chega a ninguém, exceto a transferência. [mecanicas.md:56-60]
- ◐ R11.19 Raiva separada da satisfação. [requisitos.md:227]
- ☐ Memória, faixas e régua comum para todo ator: tudo "A pensar".
  [mecanicas.md:158-170]
- A seta de tendência na tela compara com 8 meses atrás (corte de 2 pontos); o
  voto ainda não a usa. [gdd.md:2048-2050] [commit 45e74905 no log do projeto]
- Ordem decidida: primeiro o dinheiro (caminho e conservação), depois o gosto
  pelo bolso, depois a revisão das leis instituição por instituição.
  [mecanicas.md:62-64]

**8. Em aberto.**
- Os pesos entre bolso, ideologia e memória. [mecanicas.md:187]
- Como o bolso de um pop vira gosto do grupo que o atravessa. [mecanicas.md:187-188]
- Como mostrar sem virar painel. [mecanicas.md:188] [mecanicas.md:168-170]
- Escala da régua (0 a 100? −100 a +100?) e se ela substitui satisfação,
  termômetro e opinião das potências ou fica por cima. [mecanicas.md:155-156]
- O que fica lembrado (traição, promessa, programa, escândalo), com que força e
  em quanto tempo some. [mecanicas.md:160-161]
- Em cada faixa, o ator apoia, cobra, protesta ou trai? Quais ações cada tipo
  tem? [mecanicas.md:165-166]
- ⚠ CONFLITO (como a satisfação do grupo é feita):
  - Código, 01/nov/2026: satisfação = 50 + renda + índices + leis (bússola), com
    leis medidas pela distância ao grupo. [grupos.md:43-47,56-64]
  - GDD, seção 11: satisfação é "renda contra o esperado, leis perto ou longe
    dele, o que a mídia que ele vê diz". [gdd.md:778-780]
  - Decisão de 14/nov: gosto soma bolso, bússola e memória, com o bolso mais
    forte. [mecanicas.md:176-181]
  - Não resolvido. A de 14/nov não diz que revoga a regra "±15 por lei" nem a
    fórmula da distância. Ela as coloca como "parte política do gosto". [mecanicas.md:174]
- ⚠ CONFLITO (radicais pelo nível ou pela variação):
  - Código: radicais crescem pelo nível da satisfação (alvo = 5 + 2 × (35 −
    satisfação) abaixo de 35). [grupos.md:84-90]
  - Estudo de 22/out: "radicais e lealistas pela variação do padrão de vida, não
    pelo nível". [victoria3-e-democracy4.md:233]
  - É um estudo, "não decide nada". Fica o conflito para o autor. [victoria3-e-democracy4.md:3]
- Se "evitar lista à mão" vale também para o Congresso: o partido "defende"
  grupos por lista (`defende`). [politica.md:1-4,16] Não achei decisão sobre
  isso.

---

## II.5 Bússola

**1. O que é.** A régua comum das peças: dois eixos de −1 a +1, que mostra para
onde as escolhas levam o país, sem decidir nada sozinha. [gdd.md:688-693]
[mecanicas.md:119]

**2. O que o jogador faz e sente.**
- O jogador não vê a bússola. Ele sente o apoio, a satisfação e os votos.
  [grupos.md:68-69]
- O jogo nunca fala de lado político e nunca pede que o jogador escolha um lado.
  O lado do partido sai das pessoas da chapa. [gdd.md:103-106]
- "Parecer de direita ou de esquerda é resultado, nunca objetivo." [gdd.md:102-103]

**3. Peças.**
- **Eixos:** `economico` (esquerda − ↔ direita +) e `social` (libertário e verde
  − ↔ autoritário e tradicional +). O meio ambiente mora no lado de baixo do
  eixo social (decidido em 01/nov/2026). [gdd.md:691-693] [grupos.md:18-23]
- **Peso por eixo:** cada grupo declara o quanto liga para cada eixo (0 a 1).
  [grupos.md:18-19]
- **Quem tem posição:** leis (um ponto por opção, ou um em cada ponta da faixa),
  partidos, grupos, pops, mídias, ministros, países. [gdd.md:694-695]
  Juízes também. [mecanicas.md:129-130]
- **Posição do país:** média das leis vigentes, com peso por lei. [gdd.md:696-697]
- **Pops deslizam devagar:** a vida deles puxa (renda real abaixo do esperado
  puxa para a esquerda, acima para a direita, só no eixo econômico) e o governo
  também (satisfeito se aproxima da posição do país; insatisfeito se afasta, os
  dois eixos). Até ±0,02 por eixo por turno. Teto: 0,3 de onde começou.
  [grupos.md:66-76]
- **Bússola do grupo:** a declarada mais a média, por pessoas, do deslize dos pops
  dele. [grupos.md:77-79]
- **Padrões:** o jogo percebe padrões (cortar várias verbas é "corte de gastos")
  sem lei com esse nome. [gdd.md:702-703]
- **Lei no motor:** a lei diz onde fica na bússola, nunca qual grupo gosta dela.
  Lei sem bússola não mexe na ideologia de ninguém. [grupos.md:25-32]

**4. Regras decididas.**
- Bússola como raiz do jogo e base de tudo (07/nov/2026). [memória project_base_ciclo]
  [gdd.md:63-64,688] Ver ⚠ CONFLITO em II.0.
- Quem gosta sai da distância, nunca de uma lista de grupos na lei (01/nov/2026).
  [gdd.md:698-699] [grupos.md:25-26]
- Lei grande empurra mais o país. [gdd.md:696-697]
- Eixo GAL-TAN (Chapel Hill) para o social (01/nov/2026). [grupos.md:21-23]
- A bússola continua como a parte da ideologia na opinião (14/nov/2026).
  [mecanicas.md:50-51]
- Grupo novo só declara a própria posição; nenhuma lei precisa mudar.
  [grupos.md:34]
- O jogo nunca escreve "esquerda" ou "direita" ao jogador (princípio 4).
  [gdd.md:101-106]
- A mídia empurra quem a assiste: decidido no GDD, mas o motor deixa "para
  depois". [gdd.md:700-701] [grupos.md:79-80]

**5. Ligações.**
- Entrega às Leis e aos Grupos: a distância. [gdd.md:698-699]
- Entrega ao Congresso: o partido nasce dos grupos que defende; a bússola do
  partido é a média deles. [pessoas.md:11-13]
- Entrega à Chapa e às pessoas do elenco: a bússola da pessoa é em torno da do
  partido de origem (desvio 0,25); técnico em torno do centro (desvio 0,45).
  [pessoas.md:11-13]
- Entrega ao Partido do jogador: a bússola é a média da chapa. [pessoas.md:25]
- Recebe da Mídia (falta). [requisitos.md:194]

**6. Referências.**
- Chapel Hill (GAL-TAN) para o eixo social. [grupos.md:21-23]
- Lipset e Rokkan: quatro divisões históricas, garantem grupos dos dois lados
  de cada divisão. [leis - Grupos - estudos.tsv]
- Terceiro eixo (paz × militarismo): **ESTUDAR**, "precisa de estudo".
  [gdd.md:2146-2147] [mecanicas.md:124-125]

**7. No motor hoje.**
- ✅ R8.1 eixos. ✅ R8.2 posição de leis, partidos, grupos e potências. ✅ R8.3
  país = média das leis. ✅ R8.4 quem gosta sai da distância. [requisitos.md:190-193]
- ◐ R8.5 pops deslizam com a vida (feito) e com a mídia (falta; R14.8).
  [requisitos.md:194]
- ☐ R8.6 padrões. [requisitos.md:195]
- Falta: mídias e organizações com posição usada no motor. [mecanicas.md:132]

**8. Em aberto.**
- Entra um terceiro eixo (paz × militarismo, talvez um cubo)? Precisa de estudo.
  [gdd.md:2146-2147] [mecanicas.md:124]
- Quais padrões existem, quem os lê (mídia, grupos) e o que causam.
  [mecanicas.md:137]
- Se "raiz do jogo" continua com o peso do bolso maior. Ver ⚠ CONFLITO em II.0.

---

## II.6 Grupos de interesse

**1. O que é.** Pops organizados pelos seus interesses, que atravessam os pops:
cada pop se divide entre vários grupos, em partes diferentes. [gdd.md:773-775]

**2. O que o jogador faz e sente.**
- O jogador vê um grupo que estava contra passar a apoiar. [gdd.md:230-231]
- Ir contra um grupo forte custa mais, mas o jogador continua livre. [gdd.md:787-788]
- Grupo descontente fala com o ministro da instituição dele; sem ministro, vai
  direto ao presidente ou pressiona pelo Congresso (13/nov/2026). [gdd.md:2034-2037]

**3. Peças.**
- **25 grupos em 3 tipos:** econômicos (10), identidade e valores (9) e causa (6).
  [gdd.md:773-774] [leis - Grupos.tsv, contagem por tipo]
- **Lista da planilha:** Sindicatos, Sem trabalho formal, Servidores públicos,
  Educação e saúde, Pequenos negócios, Classe profissional, Indústria e grandes
  empresas, Finanças, Agronegócio, Agricultura familiar e sem-terra, Religiosos
  conservadores, Religiosos sociais, Laicos, Direitos e minorias, Povos
  originários, Regionalistas, Nacionalistas, Aposentados e idosos, Jovens e
  estudantes, Ambientalistas, Armamentistas, Lei e ordem, Militares e polícia,
  Liberais de mercado, Cultura e imprensa. [leis - Grupos.tsv]
- **O que cada grupo declara:** quem entra, o que defende, divisão social,
  bússola econômica e social, o que cobra, tamanho, se pode pegar em armas,
  organização (1 a 5), dinheiro (1 a 5). [leis - Grupos.tsv, cabeçalho]
- **Membros:** fração de cada pop que pertence ao grupo (0 a 1); grupos podem se
  sobrepor. [grupos.md:13-14] A planilha "Grupos - pops" é a matriz pop por grupo
  (32 linhas, 25 colunas). [leis - Grupos - pops.tsv, cabeçalho]
- **Cobra:** índices e o sentido que o grupo quer (1 sobe, −1 desce). [grupos.md:15-16]
- **Satisfação:** ver II.4. [gdd.md:778-780]
- **Radicais e lealistas:** radicais pesam na polarização, na violência política e
  no risco de atentado; lealistas seguram o voto do seu partido. [gdd.md:780-781]
  - Alvo dos radicais = 5 + 2 × (35 − satisfação), se abaixo de 35; senão 5.
    [grupos.md:84-85]
  - Alvo dos lealistas = 5 + 2 × (satisfação − 65), se acima de 65; senão 5.
    [grupos.md:86-87]
  - Cada um anda no máximo 1 ponto por turno. Começam em 5. [grupos.md:88]
  - "Uma crise curta não vira revolta; um mandato inteiro vira." [grupos.md:90]
- **Força do grupo:** quanto mais força (gente e dinheiro), mais populares as leis
  perto dele. Lei popular passa mais fácil, e o Congresso pode tentar aprová-la
  sozinho. [gdd.md:785-788]
- **Três reações do insatisfeito:** protestar, ficar leal ou sair. Ver II.8.
  [gdd.md:782-784]
- **Limite de cada grupo:** um grupo pacifista nunca pega em armas; no máximo
  forma movimento de rua. [gdd.md:798-799]
- **O país declara:** os grupos fortes dele e a satisfação de partida. [gdd.md:776-777]

**4. Regras decididas.**
- Grupo não escolhe lei (GDD, sem data própria; seção 11). [gdd.md:785]
- A lei diz onde fica na bússola, nunca qual grupo gosta dela (01/nov/2026).
  [grupos.md:25-26]
- Grupos de todos os lados de cada divisão (Lipset e Rokkan). [leis - Grupos -
  estudos.tsv]
- Todo lado gera extremistas (princípio 4). [gdd.md:833]
- Três tipos de grupo: econômico, identidade e valores, causa. [leis - Grupos - estudos.tsv]
- Tudo é medido contra o marco do turno 0: todo grupo parte de 50. [grupos.md:45-47]
- Resultado emerge: o grupo reage ao estado do país, não a um limite escrito
  (04/nov/2026). [memória feedback_resultado_emerge]

**5. Ligações.**
- Recebe dos pops: o tamanho vem de pessoas por pop; o grupo cresce e encolhe
  sozinho. [grupos.md:13-14] [populacao.md:31-32]
- Recebe de Índices: o que ele cobra. [grupos.md:15-16]
- Entrega ao Congresso: o partido defende grupos, e a nota do voto soma a
  distância na bússola × peso, mais o "povo". [politica.md:16-17]
- Entrega à Eleição: lealistas seguram o voto do seu partido. [gdd.md:780-781]
- Entrega às Organizações: radicais de vários grupos próximos na bússola.
  [gdd.md:800-803]
- Entrega aos Ministérios: grupo descontente fala com o ministro da instituição.
  [gdd.md:2034-2036]
- Entrega ao pop (bússola): pop satisfeito (média dos grupos) se aproxima do
  governo. [grupos.md:74-75]

**6. Referências.**
- Victoria 3: radicais e lealistas; peso (clout) pela riqueza e pelo voto.
  [victoria3-e-democracy4.md:212-213,243] Peso × aprovação para a mecânica 8.
  [victoria3-e-democracy4.md:262]
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
  [pesquisa-jogadores-14nov.md:44-45]
- Britannica (tipos de interesse), Lipset e Rokkan (divisões). [leis - Grupos -
  estudos.tsv]
- McCauley e Moskalenko, Gómez e outros (radicalização): só parte dos radicais
  vira organização. [leis - Grupos - estudos.tsv]

**7. No motor hoje.**
- ✅ R11.2 Grupos com bússola, tamanho e satisfação. ✅ R11.3 Radicais e
  lealistas. ◐ R11.4 Satisfação lê renda, índices e leis. [requisitos.md:221-223]
- ☐ R11.13 25 grupos atravessam os pops. ☐ R11.11 Grupo forte torna mais
  populares as leis perto dele. [requisitos.md:231,233]
- ⚠ CONFLITO (quantos grupos):
  - Código: o mundo tem 16 grupos (nota de 03/nov/2026 em `grupos.md`).
    [grupos.md:3-8]
  - GDD e planilha: 25 grupos. [gdd.md:773] [leis - Grupos.tsv, contagem]
  - Não é conflito de regra, é o código atrás do desenho. Registro porque as duas
    estão escritas como verdade.
- `grupos.md` diz que os números e os nomes dos cenários dele são "da época dos 4
  grupos". [grupos.md:6-8]

**8. Em aberto.**
- Como medir a força de um grupo (gente e dinheiro) e quanto ela muda a
  popularidade de uma lei. [gdd.md:2131] [mecanicas.md:225-226]
- Como o bolso de um pop vira gosto do grupo que o atravessa. [mecanicas.md:187-188]
- Se o êxodo aparece como índice ou só como gente mudando de pop. [gdd.md:2141]

---

## II.7 Organizações

**1. O que é.** Uma organização tem nome, líder e ação própria, nasce durante a
partida de radicais de vários grupos ou do lucro e da falta de Estado, e vive,
racha e acaba. [gdd.md:792-797] [memória project_tres_camadas]

**2. O que o jogador faz e sente.**
- Várias existem, poucas preocupam. A ameaça é pequena, relevante, grave ou
  crítica. [gdd.md:804-805]
- No mapa: pequenas aparecem discretas; graves viram alerta e eventos. [leis -
  Organizações - gerador.tsv, linha Ameaça Mapa]
- O jogador enfrenta com polícia, inteligência, negociação, e força militar contra
  organização grande e armada. [gdd.md:815-816]
- Resposta mal feita pode criar mais radicais; caçar chefes pode rachar a
  organização. [gdd.md:813-814]

**3. Peças.**
- **Gerador:** não há lista fixa. Cria organizações conforme os grupos agradam ou
  não ao governo e agem. Os tipos da planilha são moldes. [gdd.md:795-797]
- **Gatilho:** grupos com muitos radicais e insatisfação longa criam chance.
  [leis - Organizações - gerador.tsv, linha Gatilho]
- **Quem pode:** o grupo tem limite (coluna "Pode pegar em armas"). [leis -
  Organizações - gerador.tsv, linha Quem pode]
- **Organização política:** nasce de radicais de vários grupos próximos na
  bússola. Armamentistas ligados a conservadores e religiosos fundamentalistas
  são uma mistura perigosa. A mistura define nome, alvo e objetivo. [gdd.md:800-803]
- **Insatisfação não basta:** precisa de ideia, líder ou rede; só parte dos
  radicais usa violência. [leis - Organizações - vida.tsv, linhas Nascer]
- **Atributos:** gente, dinheiro, armas, poder, organização. Dão a ameaça.
  [leis - Organizações - gerador.tsv, linhas Atributos e Ameaça] [gdd.md:804-805]
- **Moldes da planilha (12):** 6 políticos (Movimento de rua, Extremistas
  religiosos, Revolucionários, Milícia política, Radicais ambientais,
  Separatistas), 4 de crime (Facção de presídio, Tráfico, Milícia de bairro,
  Rede corrupta) e 2 legais (Igreja, Sindicato ou associação). [leis -
  Organizações.tsv]
- **Nome (gerador):** tipo + ideia + lugar ou símbolo. Duas organizações não usam
  o mesmo nome; nenhum nome é real. [leis - Organizações - gerador.tsv, linhas Nome]
- **Crime organizado:** nasce do lucro (mercado ilegal, presídio lotado, favela,
  falta de Estado, corrupção). Vende, corrompe e disputa território. [gdd.md:810-811]
- **Organizações legais (07/nov/2026):** igrejas, sindicatos e associações, sem
  armas. A igreja é também dono sem lucro (seção 16). Tem vertente (bússola) e
  engajamento: quietista, ativa ou militante. [gdd.md:817-823]
- **Corrupção interna:** toda organização tem. Sobe com dinheiro fácil, isenção,
  sigilo e repasse sem controle; desce com fiscalização. Passa do limite:
  escândalo, racha, perda de apoio. [gdd.md:824-826]
- **Financiamento:** outros países, empresas na bolsa e doadores podem pagar.
  Todo pagamento deixa rastro. [gdd.md:806-807]
- **Investigação:** polícia, órgãos e imprensa descobrem quem paga. Pode prender
  líderes, cortar dinheiro, derrubar ações, gerar sanção e escândalo. [gdd.md:808-809]
- **Mudar:** rachar, virar partido, virar crime (ou trocar a causa pelo lucro).
  [gdd.md:813-814] [leis - Organizações - vida.tsv]
- **Acabar:** polícia, inteligência, negociação, perda de apoio. [gdd.md:815-816]
- **Presos com nome (07/nov/2026):** líder preso ganha ficha. Para os grupos
  aliados vira preso político; a bancada pede Anistia e o presidente pode dar a
  Graça (ato, não lei). [gdd.md:827-830]
- **Certeza x peso da pena:** o crime reage forte à certeza de punição e pouco ao
  peso das penas. Pena dura é popular, lota presídios e custa caro. [gdd.md:831-832]

**4. Regras decididas.**
- Pop, grupo e organização são camadas diferentes (06/nov/2026). [memória project_tres_camadas]
- Nomes sempre inventados; extremistas em todos os lados. [memória project_tres_camadas]
  [gdd.md:833-834]
- Não há lista fixa; o gerador cria. [gdd.md:795]
- Cada grupo tem limite (pacifista nunca pega em armas). [gdd.md:798-799]
- Organização política precisa de ideia ou líder, não só raiva. [gdd.md:802-803]
- Crime não precisa de grupo para nascer. [leis - Organizações - gerador.tsv,
  linha Crime]
- Organização legal tem engajamento político (07/nov/2026). [gdd.md:817-823]
- Financiamento e rastro (ideia do autor, sem data na planilha). [leis -
  Organizações - gerador.tsv, linhas Dinheiro]

**5. Ligações.**
- Recebe de Grupos: radicais de vários grupos. [gdd.md:800-801]
- Recebe da Economia: o lucro do crime e do mercado ilegal. [gdd.md:810-811]
- Recebe da Justiça e prisões: presídio lotado, facção, certeza da punição.
  [gdd.md:810-811,831-832] [leis - Organizações.tsv, linha Facção de presídio]
- Entrega à Bolsa: investigação derruba ações. [gdd.md:808-809]
- Entrega ao Mundo: financiamento por outros países; sanção. [gdd.md:806-809]
- Entrega ao Congresso: bancada pede Anistia; igreja elege bancada, negocia
  leis. [gdd.md:827-830,820-823]
- Entrega à Política: igrejas militantes agem em toda eleição. [gdd.md:821-823]
- Entrega ao Governo: ameaça a gente, polícia e Defesa. [gdd.md:815-816]

**6. Referências.**
- McCauley e Moskalenko, Gómez e outros: radicalização. [leis - Grupos - estudos.tsv]
- Della Porta: violência em protestos; organização é peça própria. [leis - Grupos
  - estudos.tsv]
- RAND (268 grupos terroristas que acabaram: política 43%, polícia 40%, vitória
  10%, força militar 7%), Cronin. [leis - Grupos - estudos.tsv] [leis -
  Organizações - vida.tsv]
- Gambetta e Varese (máfia vende proteção), Skarbek (facções de presídio).
  [leis - Grupos - estudos.tsv]
- Estudo de vícios: caça aos chefes. [leis - Organizações - vida.tsv, linha Rachar]
- Nenhum jogo é citado para organizações. **ESTUDAR** referência de jogo.

**7. No motor hoje.**
- ☐ R11.14 Organizações políticas. ☐ R11.15 Crime organizado. ☐ R11.16
  Gerador. ☐ R11.18 Financiadores e rastro. [requisitos.md:234-236,238]
- "Falta: tudo." [mecanicas.md:236]
- Igrejas e sindicatos já aparecem como donos sem lucro na Economia (seção 16).
  [gdd.md:818]

**8. Em aberto.**
- Regras e números de nascer e crescer, ações de cada tipo, como o jogador as
  enfrenta. [gdd.md:2133-2134] [mecanicas.md:248-249]

---

## II.8 Saída (informal, emigrar, tirar dinheiro)

**1. O que é.** O grupo insatisfeito tem três reações: protestar, ficar leal ou
sair. Sair tem três caminhos: informalidade, tirar o dinheiro do país ou emigrar.
[gdd.md:782-784]

**2. O que o jogador faz e sente.**
- Fuga da regra: a regra forte demais alcança menos gente (informal, ilegal),
  conforme a verba de quem fiscaliza; junto, a sonegação que cresce com o imposto
  (14/nov/2026). [gdd.md:2056-2058]
- O jogador sente a conta chegar por esse canal. [gdd.md:113-114]

**3. Peças.**
- **Informalidade:** hoje só o encargo do Seguro na folha faz formal virar
  informal. [leis - Pops - como funciona.tsv, linha Mudança de pop]
- **Tirar o dinheiro do país:** sem regra além do nome. [gdd.md:783-784]
- **Emigrar:** hoje só Profissionais de saúde, o único caso em que a população
  muda. [leis - Pops - como funciona.tsv, linha Sair do país]
- **Nascido fora:** é o outro lado, imigração. Ver II.2. [gdd.md:759-763]
- **Protesto e lealdade** passam pelos radicais e lealistas. [gdd.md:782-783]

**4. Regras decididas.**
- Três reações e três caminhos de saída (GDD, seção 11). [gdd.md:782-784]
- A regra forte demais alcança menos gente (14/nov/2026). [gdd.md:2056-2058]

**5. Ligações.**
- Recebe dos Grupos: insatisfação. [gdd.md:782]
- Entrega à Economia: informal deixa de pagar imposto; dinheiro e gente saem do
  país. [gdd.md:783-784,2056-2058]
- Entrega às Leis: fiscalização (verba de quem fiscaliza). [gdd.md:2056-2058]
- Entrega à Saúde e à Imigração (profissionais de saúde que emigram). [leis - Pops
  - como funciona.tsv, linha Sair do país]

**6. Referências.** Nenhuma achada. **ESTUDAR.**

**7. No motor hoje.**
- ☐ R11.10 Insatisfeito sai: informalidade, fuga de dinheiro, emigração.
  [requisitos.md:230] [mecanicas.md:230-231]
- ◐ Só dois casos soltos: o Seguro na folha e os profissionais de saúde. [leis -
  Pops - como funciona.tsv, linhas Mudança de pop e Sair do país]

**8. Em aberto.**
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à
  emigração, e com que números. [gdd.md:2130] [mecanicas.md:232]

---

## II.9 Lugar (estados)

**1. O que é.** Todo pop tem campo e cidade e fica num estado. Cada país declara
todos os seus estados, as pessoas de cada um e como se dividem. [gdd.md:764-766]

**2. O que o jogador faz e sente.** — (A tela não está descrita nas fontes que li.)

**3. Peças.**
- **Estado vale para tudo:** pops, prédios, voto e energia. [gdd.md:766-767]
- **Fallback:** se o país não declarar a divisão de um pop num estado, vale a
  divisão nacional. [gdd.md:767]
- **País sem estados:** declara um só; regionalistas e separatistas não aparecem.
  [gdd.md:767-768]
- **Campo e cidade:** hoje só a Moradia separa os pops do campo, sem êxodo de pop.
  [leis - Pops - como funciona.tsv, linha Lugar]

**4. Regras decididas.**
- Lugar (08/nov/2026): todo pop tem campo e cidade e fica num estado. [gdd.md:764-768]
- País declara os estados. [gdd.md:765-766]

**5. Ligações.**
- Entrega ao Voto (por estado), à Energia, a Governadores e à Moradia e Terra.
  [gdd.md:766-767] [mecanicas.md:254-255] [leis - Pops - como funciona.tsv, linha Lugar]
- Entrega às Organizações: regionalistas e separatistas só existem com estados.
  [gdd.md:767-768] [leis - Organizações.tsv, linha Separatistas]

**6. Referências.** Pew: cidade ou campo separa muito a política (EUA). [leis - Pops
- estudos.tsv] Nenhum jogo citado para estados. **ESTUDAR**.

**7. No motor hoje.**
- ☐ R11.17 Pops por estado ("medido possível em 12/nov"). [requisitos.md:237]
  [mecanicas.md:253]
- ◐ Campo e cidade só na Moradia. [leis - Pops - como funciona.tsv, linha Lugar]

**8. Em aberto.**
- Se entra na V1 ou depois, e o que depende disso (voto por estado, energia,
  governadores). [mecanicas.md:254-255]
- Se o êxodo aparece como índice ou só como gente mudando de pop. [gdd.md:2141]

---

## Para o revisor

### (a) Todos os ⚠ CONFLITO

1. **Bússola como raiz × bolso mais forte** (II.0, repete em II.4 e II.5).
   - 07/nov: "a Bússola é a raiz do jogo… a distância diz quem gosta de quê".
     [gdd.md:63-64] [memória project_base_ciclo]
   - 14/nov: "A lei não diz quem gosta… a bússola continua, com peso menor que o
     bolso". [mecanicas.md:47-51]
2. **Bússola do pop: o que ela faz.** `populacao.md:34-35` (só descreve, não move
   nada) × `grupos.md:66-80` (03/nov, move votos e satisfação).
3. **Satisfação do grupo.** Código: 50 + renda + índices + leis (distância).
   [grupos.md:43-64] GDD: renda, leis, mídia. [gdd.md:778-780] 14/nov: bolso +
   bússola + memória. [mecanicas.md:176-181]
4. **Radicais pelo nível ou pela variação.** Código (nível):
   [grupos.md:84-90]. Estudo de 22/out (variação): [victoria3-e-democracy4.md:233].
5. **16 grupos × 25 grupos.** [grupos.md:3-8] × [gdd.md:773].
6. **25 pops (motor) × 32 pops (GDD e planilha).** [populacao.md:34] ×
   [gdd.md:749]. Registrado em II.1 como "o código atrás do desenho".
7. Contagem das leis: a planilha de pops diz "68 das 71 leis", e `mecanicas.md`
   diz "~480" e "512 leis no jogo". [leis - Pops - como funciona.tsv, linha
   Opinião] [mecanicas.md:23,57-58] Provavelmente a planilha é de outra data;
   não escolhi.

### (b) O que ficou ESTUDAR

- Referência de jogo para **organizações** (II.7).
- Referência para **saída** (informalidade, fuga de dinheiro, emigração) (II.8).
- Referência para **estados** (II.9).
- Terceiro eixo da bússola (paz × militarismo) (II.5).
- Padrão de vida no SisGov: não há decisão do autor (II.3).
- Escala e partes da **régua comum de opinião**, faixas e memória (II.4).
- Se "demografia" e "padrão de vida" usam o modelo de natalidade do Victoria 3
  (II.2 e II.3).

### (c) Fontes não lidas

- Dados das planilhas: só li cabeçalho e contagens de `leis - Pops - dados.tsv`,
  `leis - Pops.tsv`, `leis - Grupos.tsv`, `leis - Grupos - pops.tsv`, como pedido.
  Li inteiros `leis - Pops - como funciona`, `estudos` e `revisão`, `leis -
  Grupos - estudos`, `leis - Organizações`, `- vida` e `- gerador`.
- `victoria3-e-democracy4.md`: li só as seções 5 (população) e partes do resumo e
  da tabela; não li as outras.
- `gdd.md`: não li as seções 6, 12 (O coração do voto) e 14 (Mídia) por inteiro,
  só o que toca população. Nessas há ligações (nomear ministro agrada grupos
  parecidos; mídia empurra pop) que o revisor deve cruzar.
- `mecanicas.md`: li o índice, a "A base", e as seções 2, 3, 4. Não li a 5 (só
  o título 5.0 por citação), 6, 7, 12 (Perder o poder), 14, 15.
- `requisitos.md`: li R8, R11 e referências a R14, R9.9. Não li R12, R13 por
  inteiro.
- Memórias: li as de base em ciclo, três camadas, resultado emerge, países
  reais, lei ou processo, lei e bolha, órgãos e verba, jogo não sente e público-
  alvo. Não li as de "como trabalhar".
- Imigração ("nascido fora") não tem R em `requisitos.md` na seção 11 e não achei
  onde ele está.
- Itens do GDD que podem caber em outra parte do novo GDD: "A rede da pessoa"
  (gdd.md:170-196, puseram aqui em II.4 só a primeira parte) e a espionagem
  (Botão Espiar, gdd.md:183-196), que não resumi.
