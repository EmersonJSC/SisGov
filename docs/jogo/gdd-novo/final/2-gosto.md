## Parte 2. Gosto (a população e como ela funciona)

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`. O GDD é a meta; onde o motor está atrás (grupos 16 contra 25, pops 25 contra 32), isso vem dito em "No motor hoje".

**Abertura.**

- População, Economia e Governo controlam uns aos outros, com a População no centro. O ciclo não tem começo nem fim.
- A população trabalha, consome e investe (para a Economia). Vota, apoia e protesta (para o Governo). A Economia paga salário, dá emprego e define preços. O Governo dá serviços, renda e direitos.
- Política não é um quarto pilar. Partidos, grupos, Congresso e eleição são o caminho pelo qual a População controla o Governo.
- Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que só mexe na opinião não basta.
- **Gosto = bolso (mais forte) + bússola (peso menor) + memória (14/nov).** A lei não diz quem gosta dela: o gosto nasce do que o motor calcula. A bússola continua, como a parte da ideologia, mas não é mais a raiz do jogo.
- Três camadas (06/nov): o **pop** é quem a pessoa é na economia. O **grupo** é como as pessoas agem juntas na política. A **organização** tem nome, líder e ação própria.
- **A mídia é lente (14/nov).** Ela age sobre fatos que já existem e não cria gosto novo. Em cada seção abaixo há uma linha "Mídia" dizendo o que as fontes já decidem e o que falta ESTUDAR.
- Referência da ligação "a economia mexe no pop, o pop mexe na política, a política mexe na economia": Victoria 3, elogiado pelos jogadores. Outros jogos são criticados por ligação fraca (Frostpunk) ou que ninguém entende (Democracy 4).

---

### 2.1 Pops e o bolso de cada um

**O que é.** Um pop é uma fatia da população (uma profissão num estrato) que trabalha, ganha, consome e vota. É o centro do jogo.

**O jogador** (faz e sente)
- Não escolhe pop. Ele passa leis, e cada pop sente de um jeito.
- Quando a economia muda, cada pop sente de um jeito, e a renda nunca é uma parte fixa do PIB.
- Na tela vê o país mudar sem placar: pessoas enriquecem ou empobrecem, empregos aparecem ou somem.

**Peças**
- **Tipos:** 32 pops em 4 blocos: fora do trabalho (5), donos (5), conta própria (4) e empregados (18).
- **Como separar:** primeiro a situação (trabalha ou não), depois o vínculo e a ocupação. Estudantes, Aposentados e Crianças não têm estrato fixo.
- **Dados de cada pop (colunas da planilha):** tamanho, estrato, renda (vezes a média), bússola econômica e social, onde trabalha, se vive de lucro, para onde sobe e desce, para onde pode estudar.
- **Dados dentro do pop:** faixas de idade, cidade ou campo, vínculo de trabalho (formal, informal, público, próprio), escolaridade (fundamental, médio, superior), patrimônio e filhos por pessoa.
- **Renda:** sai de salário, lucro, aluguel e transferência, nunca de uma parte fixa do PIB. Hoje, a renda disponível é a bruta menos imposto mais transferência.
- **Subir e descer de estrato:** pela renda real contra o esperado. Sobe só com o índice exigido (ex.: instrução). Até 1% do pop por turno e 30% do total declarado. Pobre não desce e rico não sobe.
- **Estudar e mudar de setor:** até 0,5% do pop por turno vezes a instrução. O destino precisa pagar 5% a mais.
- **Cesta e bolso (feito no motor):** compara o preço da cesta com a renda de cada pop e mostra fome e carência. Conta quantos ficam abaixo da renda necessária para pagar conta, plano ou casa.
- **Ponto de partida do estudo (Ipea, Brasil 2021):** a revisão mapeia cada pop no estudo do Ipea.

**Regras**
- 32 pops em 4 blocos, com crianças, estudantes e aposentados sem estrato fixo.
- Renda vem de salário, lucro, aluguel e transferência (05/nov).
- Cada pop tem a sua bússola (R11.7, 03/nov).
- A lei vai ao pop pelo bolso: o motor calcula o efeito em cada pop (14/nov).
- Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula, fica guardado ou sai do país (14/nov).
- Resultado emerge: a lei muda só um número. Se ela é boa ou ruim sai da renda do pop contra a conta, nunca de condição escrita na lei (04/nov).
- A cesta é uma fatia da renda por estrato (meta do GDD).

**Ligações**
- Recebe da Economia: salário, emprego, preços, lucro, aluguel.
- Recebe das Leis: renda direta (imposto de renda e transferência), mudança de pop, serviço.
- Entrega à Economia: trabalho, consumo e investimento.
- Entrega aos Grupos: os pops são a base dos grupos (cada grupo soma frações dos pops).
- Entrega à Bolsa: o patrimônio dos pops muda com a ação, e eles reagem no voto e no investimento.
- Mídia: a mídia não muda a renda nem o preço. Ela só decide o quanto o pop percebe e como conta o que ele vive. **ESTUDAR** como a mídia entra no bolso.

**Referências**
- Victoria 3: pops no centro (prédio sem pop não faz nada; pop com salário compra).
- Ipea Nota Técnica 64: ordem situação, vínculo, ocupação.
- OIT (ISCO-08, ICSE-18, força de trabalho), Oesch, Great British Class Survey, Pew, ESeC: cada um dá um corte da lista de pops. O ESeC diz que 25 a 35 pops bastam para um jogo.
- Democracy 4: a pessoa em vários grupos para o voto.

**No motor hoje**
- ◐ R11.1 Pops com renda da economia: a renda ainda é parte fixa do PIB.
- ✅ R11.5 Pops mudam de setor estudando. ✅ R11.6 Sobem e descem de estrato. ✅ R11.7 Cada pop tem bússola e desliza com a vida.
- ☐ R11.8 Dados dentro do pop. ☐ R11.12 32 pops em 4 blocos, com crianças. O motor tem 25 tipos (8 pobres, 11 médios, 6 ricos); o GDD é a meta.
- A cesta no motor dá a mesma quantia por pessoa; a meta é a fatia da renda por estrato.
- O índice Desemprego e o pop Desempregados ainda não se ligam. O emprego e o salário saem da renda do pop, não o contrário.
- Uma lei só (Transferência de renda) divide verba para um estrato.

**Em aberto**
- Quantos tipos de pop rodam de verdade no motor sem pesar.
- Como a lei mira "idosos do campo" sem multiplicar pops.
- Como a renda sai de salário e lucro sem o turno 0 mudar de valor.
- Como a conta do bolso de Crianças lê a família (Crianças não têm renda própria).
- Faltam pesca e artesãos como pops próprios? O estudo diz que faltam; a revisão trata pesca em "Pequenos agricultores e pescadores".

---

### 2.2 Demografia (vida)

**O que é.** Gente nasce, envelhece e morre. Jovem vira estudante e trabalhador. Idoso se aposenta.

**O jogador** (faz e sente). É daqui que saem a Previdência, a escola e a procura por saúde. O jogador sente isso pelas leis dessas áreas. (Como ele vê, não está decidido.)

**Peças**
- **Faixas de idade dentro do pop:** criança, jovem (15 a 29), adulto (30 a 59) e idoso (60+).
- **Filhos por pessoa:** quantas crianças dependem de cada pessoa do pop, em média. Liga com benefício por filho, natalidade e bolso.
- **Nascido fora (08/nov):** dado dentro do pop, com o país de origem e a situação (legal, sem documento, refugiado). Alimenta imigração, remessas e a tensão com imigrantes.
- **Pops que mudam:** estudar e ir ao setor que paga mais leva turnos.

**Regras**
- Imigração aumenta o PIB. O salário cai um pouco só nos pops parecidos com os imigrantes. O crime não sobe por ser imigrante, e sim pelo desemprego e pela falta de acesso a serviços (08/nov).
- Natalidade e mortalidade pelo padrão de vida: é o que o estudo propõe aproveitar do Victoria 3, ainda sem decisão do autor. Ver 2.3.

**Ligações**
- Entrega à Previdência, à Educação e à Saúde (idosos, estudantes, procura).
- Recebe do Mercado: o pop estuda e vai ao setor que paga mais.
- Entrega à Economia (imigração e PIB).
- Mídia: a mídia pode dar tom à tensão com imigrantes sobre fatos que já existem (desemprego, serviços). **ESTUDAR.**

**Referências**
- Victoria 3: natalidade e mortalidade caem quando o padrão de vida sobe, a mortalidade mais rápido. Abaixo de um ponto a população encolhe.
- Pew: idade, escolaridade e lugar separam muito a política (EUA).
- OIT: quem tem idade de trabalhar se divide em empregado, desempregado e fora da força de trabalho.

**No motor hoje**
- ☐ R11.9 Nascer, envelhecer, morrer. ☐ R11.8 Dados de idade dentro do pop.
- Estudantes e Aposentados têm tamanho fixo.
- Pessoas (elenco): idade de 35 a 74, e envelhecer, aposentar e morrer ainda não existem.
- Imigração (nascido fora): sem R próprio na seção 11 dos requisitos.

**Em aberto**
- Regras e números de nascer, envelhecer e morrer, e como ficam nas faixas do pop.
- Números de natalidade e mortalidade; como mexem em Previdência, escola e saúde.

---

### 2.3 Padrão de vida

**O que é.** No Victoria 3, o padrão de vida (1 a 99) de cada grupo de pessoas vem da renda líquida contra o custo das necessidades. No SisGov, o padrão de vida é a leitura da vida do pop: o que ele ganha contra o que precisa pagar. Hoje ele se apoia na **cesta** (fome e carência) e no **bolso** (quem paga conta, plano ou casa). O que importa para o jogo é a **variação**: a piora do padrão de vida é o que gera radicais (14/nov, ver 2.6).

**O jogador** (faz e sente). Sente pelas consequências: fome, contas que não fecham, gente que se radicaliza quando a vida piora.

**Peças**
- **Cesta e bolso:** ver 2.1.
- **Índice "Padrão de vida":** existe e os grupos o cobram (ex.: Sindicatos pedem "mais Padrão de vida, menos Desemprego, mais Saúde").

**Regras**
- Radicais nascem da **piora** do padrão de vida, não do nível (14/nov).
- Preço alto dos bens encarece as necessidades e derruba o padrão de vida.

**Ligações**
- No Victoria 3, o padrão de vida mexe em natalidade, mortalidade, lealdade (radicais e lealistas) e na força política do grupo.
- Entrega ao bolso do gosto (2.4) e aos radicais e lealistas (2.6).
- Mídia: a mídia não muda o padrão de vida; ela muda o quanto a piora é notada e culpada em alguém. **ESTUDAR.**

**Referências.** Victoria 3, diário 13 (padrão de vida). O estudo recomenda aproveitar "quase tudo" para população e grupos: padrão de vida por grupo (renda × custo de vida), radicais e lealistas pela **variação**, e natalidade e mortalidade pelo padrão. O estudo é de 22/out e "não decide nada"; a parte dos radicais foi decidida pelo autor em 14/nov.

**No motor hoje.** Não há padrão de vida por pop. Cesta e bolso existem. Os radicais ainda crescem pelo nível da satisfação (ver 2.6).

**Em aberto**
- O padrão de vida vira um número por pop? Ele substitui, soma-se a ou fica ao lado da cesta e do bolso?
- O bolso do gosto (renda, preço do que ele compra, emprego, serviço que recebe) é a mesma coisa que o padrão de vida, ou o padrão é só uma parte dele?

---

### 2.4 Opinião (bolso + bússola + memória)

**O que é.** A régua comum de gostar e não gostar, para todo ator, feita de bolso, ideologia e memória.

**O jogador** (faz e sente)
- Quando dá certo: um grupo que estava contra passa a apoiar; a eleição é vencida por pouco.
- Quando dá errado: entende por quê. Nunca parece azar.
- **Porquê à vista:** ao passar o mouse, cada parte com o seu número ("Operários: −6 imposto, +4 salário mínimo, −3 ideologia"), como faz o CK3. Todo número que o jogador sente mostra de onde veio (SisGovpedia).
- A SisGovpedia é uma enciclopédia em camadas: a frase curta, depois o porquê, depois a conta.
- A bússola é interna: o jogador não a vê, só sente o apoio, a satisfação e os votos. O jogo nunca fala de lado político ao jogador.

**Peças**
- **Bolso (o mais forte):** renda, preço do que ele compra, emprego, serviço que recebe. Calculado pelo motor a partir do que a lei mexe.
- **Ideologia (bússola), com peso menor.**
- **Memória:**
  - Tirar dói mais do que dar agrada (no CK3, aumentar exigência custa −15 e reduzir dá +5).
  - O ganho de um benefício antigo some com o tempo, mas a raiva de cortar continua.
  - O eleitor julga a melhora, não o ideal: desemprego de 12% caindo a 10% agrada; de 6% subindo a 8% irrita.
  - Mágoa passageira: pontos da bússola com força descontada pelo tempo (hoje, o ministro demitido). Cada grupo perde força vezes parecença, e as mágoas somadas tiram no máximo 15 pontos.
- **Satisfação do grupo (como funciona hoje):** 0 a 100, começa em 50 (o marco do turno 0) e soma renda, índices cobrados e leis.
  - Renda: 1 ponto por 1% de diferença, até ±25, contra a renda esperada. Crescer no ritmo normal não agrada ninguém.
  - Índices cobrados: 1 ponto por ponto, até ±15 por índice.
  - Leis (bússola): quanto cada lei se aproximou do grupo desde o marco. Uma lei move o grupo no máximo ±15.
  - Na meta do GDD, a satisfação é renda contra o esperado, leis perto ou longe, e o que a mídia que o grupo vê diz.
- **Raiva do grupo (0 a 100):** separada da satisfação.
- **Aprovação:** satisfação média dos pops, pesada pelo tamanho; é lida pelo Congresso e pela eleição (R9.9).
- **Lista à mão de quem gosta:** evitar. Tropico, Stellaris e Democracy 4 fazem isso, e o veterano adivinha tudo; vira tarefa; "falta contexto". Com 500 leis, vira sorteio.
- **Régua para todo ator** (ideia do autor, 13/nov): grupo, partido, ministro, juiz, mídia e potência com a mesma régua, feita de ideologia, interesse e memória que some com o tempo, e faixas que destravam o que o ator faz (apoia, cobra, protesta, trai).
- **A rede da pessoa e o Botão Espiar:** ver a subseção abaixo.

**Regras**
- A lei não diz quem gosta dela (14/nov).
- Gosto = bolso (mais forte) + bússola (peso menor) + memória (14/nov).
- Tirar dói mais do que dar agrada (14/nov).
- Benefício vira costume; a raiva de cortar fica (14/nov).
- Eleitor julga a melhora, não o nível (14/nov).
- Porquê visível ao passar o mouse (14/nov).
- Evitar lista à mão de quem gosta (14/nov).
- Uma lei nunca decide sozinha o humor de um grupo: limite de ±15 (01/nov).
- Até a mídia pesar, a troca de ministro cobra direto nos grupos parecidos com quem saiu (13/nov).

**Mídia como lente (14/nov).** A mídia age sobre fatos que já existem e não cria gosto novo. O efeito da lei na opinião deve passar pela mídia (R14.2 ☐) e a mídia mobiliza a raiva (R14.9 ☐). **ESTUDAR** como ela mexe em cada uma das três peças do gosto: no bolso (o que o pop percebe), na bússola (empurra quem a assiste, R14.8 ☐) e na memória (o que fica lembrado e por quanto tempo).

**Ligações**
- Recebe das Leis: onde a lei mexe no dinheiro e na vida (quem paga, quem recebe, preço, emprego, serviço).
- Recebe da Economia: renda, preço, emprego.
- Recebe da Bússola: a ideologia.
- Recebe de Índices: grupos cobram índices.
- Recebe da Mídia (falta): ver acima.
- Entrega ao Congresso: nota do partido soma grupos que ele defende, povo (grupos pesados por pessoas), aprovação do governo.
- Entrega ao partido: o termômetro anda 1/4 do caminho até a satisfação dos grupos dele.
- Entrega à Eleição: aprovação (R9.9).

**Referências**
- CK3: cada causa da opinião visível ao passar o mouse; −15 contra +5.
- Victoria 3: padrão de vida caindo e desemprego radicalizam; riqueza dá peso político. Ponto fraco: o porquê nem sempre aparece.
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
- Frostpunk e Democracy 4: ligação fraca ou opaca.
- Aviso das próprias fontes: elas "podem estar velhas" e são lição, não conteúdo.

**No motor hoje**
- Satisfação lê renda, índices e leis pela bússola. ◐ R11.4 (falta mídia e programas).
- O bolso só se mexe por imposto de renda e transferência. As outras cerca de 480 leis agradam ou irritam só pelo ponto chutado na bússola. A verba gasta não chega a ninguém, exceto a transferência.
- ◐ R11.19 Raiva separada da satisfação.
- ☐ Memória, faixas e régua comum para todo ator: tudo "A pensar".
- A seta de tendência na tela compara com 8 meses atrás (corte de 2 pontos); o voto ainda não a usa.
- Ordem decidida: primeiro o dinheiro (caminho e conservação), depois o gosto pelo bolso, depois a revisão das leis instituição por instituição.

**Em aberto**
- Os pesos entre bolso, ideologia e memória.
- Como o bolso de um pop vira gosto do grupo que o atravessa.
- Como mostrar sem virar painel.
- Escala da régua (0 a 100? −100 a +100?) e se ela substitui satisfação, termômetro e opinião das potências ou fica por cima.
- O que fica lembrado (traição, promessa, programa, escândalo), com que força e em quanto tempo some.
- Em cada faixa, o ator apoia, cobra, protesta ou trai? Quais ações cada tipo tem?
- O limite de ±15 por lei e a fórmula da distância valem como a "parte política" do gosto, ou mudam com o bolso e a memória?
- "Evitar lista à mão" vale também para o Congresso? O partido "defende" grupos por lista.

#### A rede da pessoa

Cada pessoa da lista tem um perfil de rede social, como o de uma rede real. É por ele que o jogador conhece a pessoa:

- **O que ela posta:** opiniões, fotos, o que anda curtindo, quem segue.
- **Onde ela vai e o que frequenta:** lugares, eventos, companhias.
- **O que ela diz sobre os temas do país:** a opinião aparece em texto solto, nunca como rótulo de esquerda ou direita.

O perfil é gerado da ficha da pessoa (bússola, origem, grupos, honestidade). Nada diz "esta pessoa é de tal lado"; o jogador deduz, como na vida real.

**A rede do presidente e a inteligência (07/nov).** A rede é uma só, sem nome, e resume todas as redes do país: o jogador sente o país vivo. Ela é diferente das redes das empresas, que são prédios da economia. Cada perfil tem **"Informações pessoais descobertas"**, uma narrativa gerada da ficha da pessoa. Quanto mais Verba de inteligência e Poderes da agência, mais aparece: onde trabalha, rotina, o que gosta e não gosta, o que assiste, opiniões pelos posts compartilhados, com quem fala, dívidas e segredos. O jogador deve pensar "eles têm todos esses dados?". Proteção de dados alta reduz o que se vê; cada espiada pode vazar e virar escândalo.

**Botão Espiar.** A partir do nível médio de inteligência, ver dados pessoais é uma espiada que fere a privacidade e fica num **registro**. O registro pode vazar um dia (pela Independência dos investigadores, pela imprensa livre, pela corrupção interna da agência, pelo Controle da agência) e virar escândalo. A chance sobe com a importância de quem foi espiado: espiar um zé-ninguém quase ninguém procura; espiar um líder, juiz ou jornalista, sim.

---

### 2.5 Bússola

**O que é.** A régua comum das peças: dois eixos de −1 a +1, que mostra para onde as escolhas levam o país, sem decidir nada sozinha. No gosto ela é a parte da ideologia, com peso menor que o bolso (14/nov).

**O jogador** (faz e sente)
- Não vê a bússola. Sente o apoio, a satisfação e os votos.
- O jogo nunca fala de lado político e nunca pede que o jogador escolha um lado. O lado do partido sai das pessoas da chapa.
- "Parecer de direita ou de esquerda é resultado, nunca objetivo."

**Peças**
- **Eixos:** `economico` (esquerda − ↔ direita +) e `social` (libertário e verde − ↔ autoritário e tradicional +). O meio ambiente mora no lado de baixo do eixo social (01/nov).
- **Peso por eixo:** cada grupo declara o quanto liga para cada eixo (0 a 1).
- **Quem tem posição:** leis (um ponto por opção, ou um em cada ponta da faixa), partidos, grupos, pops, mídias, ministros, países e juízes.
- **Posição do país:** média das leis vigentes, com peso por lei.
- **Pops deslizam devagar (a bússola do pop move):** a vida deles puxa (renda real abaixo do esperado puxa para a esquerda, acima para a direita, só no eixo econômico) e o governo também (satisfeito se aproxima da posição do país; insatisfeito se afasta, os dois eixos). Até ±0,02 por eixo por turno. Teto: 0,3 de onde começou. Isso muda os votos do Congresso e a satisfação.
- **Bússola do grupo:** a declarada mais a média, por pessoas, do deslize dos pops dele.
- **Padrões:** o jogo percebe padrões (cortar várias verbas é "corte de gastos") sem lei com esse nome.
- **Lei no motor:** a lei diz onde fica na bússola, nunca qual grupo gosta dela. Lei sem bússola não mexe na ideologia de ninguém.

**Regras**
- Quem gosta sai da distância, nunca de uma lista de grupos na lei (01/nov).
- Lei grande empurra mais o país.
- Eixo GAL-TAN (Chapel Hill) para o social (01/nov).
- A bússola continua como a parte da ideologia na opinião, com peso menor que o bolso (14/nov).
- Grupo novo só declara a própria posição; nenhuma lei precisa mudar.
- O jogo nunca escreve "esquerda" ou "direita" ao jogador (princípio 4).
- A bússola do pop move (03/nov).

**Mídia como lente.** A mídia empurra quem a assiste: decidido no GDD, e o motor deixa "para depois" (R14.8 ☐). Como lente, ela puxa a bússola do pop sobre fatos que existem, sem inventar posição. **ESTUDAR** o tamanho do empurrão e quem a mídia alcança.

**Ligações**
- Entrega às Leis e aos Grupos: a distância.
- Entrega ao Congresso: o partido nasce dos grupos que defende; a bússola do partido é a média deles.
- Entrega à Chapa e às pessoas do elenco: a bússola da pessoa é em torno da do partido de origem (desvio 0,25); técnico em torno do centro (desvio 0,45).
- Entrega ao Partido do jogador: a bússola é a média da chapa.
- Recebe da Mídia (falta).

**Referências**
- Chapel Hill (GAL-TAN) para o eixo social.
- Lipset e Rokkan: quatro divisões históricas, garantem grupos dos dois lados de cada divisão.
- Terceiro eixo (paz × militarismo): **ESTUDAR**, "precisa de estudo".

**No motor hoje**
- ✅ R8.1 eixos. ✅ R8.2 posição de leis, partidos, grupos e potências. ✅ R8.3 país = média das leis. ✅ R8.4 quem gosta sai da distância.
- ◐ R8.5 pops deslizam com a vida (feito) e com a mídia (falta; R14.8).
- ☐ R8.6 padrões.
- Falta: mídias e organizações com posição usada no motor.

**Em aberto**
- Entra um terceiro eixo (paz × militarismo, talvez um cubo)? Precisa de estudo.
- Quais padrões existem, quem os lê (mídia, grupos) e o que causam.

---

### 2.6 Grupos de interesse

**O que é.** Pops organizados pelos seus interesses, que atravessam os pops: cada pop se divide entre vários grupos, em partes diferentes.

**O jogador** (faz e sente)
- Vê um grupo que estava contra passar a apoiar.
- Ir contra um grupo forte custa mais, mas o jogador continua livre.
- Grupo descontente fala com o ministro da instituição dele; sem ministro, vai direto ao presidente ou pressiona pelo Congresso (13/nov).

**Peças**
- **25 grupos em 3 tipos:** econômicos (10), identidade e valores (9) e causa (6).
- **Lista da planilha:** Sindicatos, Sem trabalho formal, Servidores públicos, Educação e saúde, Pequenos negócios, Classe profissional, Indústria e grandes empresas, Finanças, Agronegócio, Agricultura familiar e sem-terra, Religiosos conservadores, Religiosos sociais, Laicos, Direitos e minorias, Povos originários, Regionalistas, Nacionalistas, Aposentados e idosos, Jovens e estudantes, Ambientalistas, Armamentistas, Lei e ordem, Militares e polícia, Liberais de mercado, Cultura e imprensa.
- **O que cada grupo declara:** quem entra, o que defende, divisão social, bússola econômica e social, o que cobra, tamanho, se pode pegar em armas, organização (1 a 5), dinheiro (1 a 5).
- **Membros:** fração de cada pop que pertence ao grupo (0 a 1); grupos podem se sobrepor. A planilha "Grupos - pops" é a matriz pop por grupo (32 linhas, 25 colunas).
- **Cobra:** índices e o sentido que o grupo quer (1 sobe, −1 desce).
- **Satisfação:** ver 2.4.
- **Radicais e lealistas:** radicais pesam na polarização, na violência política e no risco de atentado; lealistas seguram o voto do seu partido.
  - **Radicais nascem da piora do padrão de vida, não do nível (14/nov, ver 2.3).** O que vale é a queda: quem vive mal faz tempo, mas estável, não se radicaliza por isso; quem viu a vida piorar, sim.
  - Hoje no motor (por nível): alvo dos radicais = 5 + 2 × (35 − satisfação), se abaixo de 35; senão 5. Alvo dos lealistas = 5 + 2 × (satisfação − 65), se acima de 65; senão 5. Cada um anda no máximo 1 ponto por turno. Começam em 5.
  - "Uma crise curta não vira revolta; um mandato inteiro vira."
- **Força do grupo:** quanto mais força (gente e dinheiro), mais populares as leis perto dele. Lei popular passa mais fácil, e o Congresso pode tentar aprová-la sozinho.
- **Três reações do insatisfeito:** protestar, ficar leal ou sair. Ver 2.8.
- **Limite de cada grupo:** um grupo pacifista nunca pega em armas; no máximo forma movimento de rua.
- **O país declara:** os grupos fortes dele e a satisfação de partida.

**Regras**
- Grupo não escolhe lei.
- A lei diz onde fica na bússola, nunca qual grupo gosta dela (01/nov).
- Grupos de todos os lados de cada divisão (Lipset e Rokkan).
- Todo lado gera extremistas (princípio 4).
- Três tipos de grupo: econômico, identidade e valores, causa.
- Tudo é medido contra o marco do turno 0: todo grupo parte de 50.
- Resultado emerge: o grupo reage ao estado do país, não a um limite escrito (04/nov).
- Radicais pela piora do padrão de vida (14/nov).

**Mídia como lente.** A satisfação do grupo no GDD inclui "o que a mídia que ele vê diz". A mídia não cria o descontentamento: ela mostra, esconde ou amplia fatos que já existem, e mobiliza a raiva (R14.9 ☐). **ESTUDAR** como ela mexe nos radicais (aumenta a piora percebida?) e nos lealistas.

**Ligações**
- Recebe dos pops: o tamanho vem de pessoas por pop; o grupo cresce e encolhe sozinho.
- Recebe de Índices: o que ele cobra.
- Entrega ao Congresso: o partido defende grupos, e a nota do voto soma a distância na bússola × peso, mais o "povo".
- Entrega à Eleição: lealistas seguram o voto do seu partido.
- Entrega às Organizações: radicais de vários grupos próximos na bússola.
- Entrega aos Ministérios: grupo descontente fala com o ministro da instituição.
- Entrega ao pop (bússola): pop satisfeito (média dos grupos) se aproxima do governo.

**Referências**
- Victoria 3: radicais e lealistas; peso (clout) pela riqueza e pelo voto. Peso × aprovação para a mecânica 8.
- Democracy 4: pessoa em vários grupos; cinismo de quem foi agradado rápido.
- Britannica (tipos de interesse), Lipset e Rokkan (divisões).
- McCauley e Moskalenko, Gómez e outros (radicalização): só parte dos radicais vira organização.

**No motor hoje**
- ✅ R11.2 Grupos com bússola, tamanho e satisfação. ✅ R11.3 Radicais e lealistas (ainda pelo nível, a meta é pela piora). ◐ R11.4 Satisfação lê renda, índices e leis.
- ☐ R11.13 25 grupos atravessam os pops. O motor tem 16 grupos; o GDD é a meta. Os números e os nomes dos cenários do `grupos.md` são "da época dos 4 grupos".
- ☐ R11.11 Grupo forte torna mais populares as leis perto dele.

**Em aberto**
- Como medir a força de um grupo (gente e dinheiro) e quanto ela muda a popularidade de uma lei.
- Como o bolso de um pop vira gosto do grupo que o atravessa.
- Quanto de piora, em quanto tempo, vira radical, e quando o radical volta a esfriar.
- Se o êxodo aparece como índice ou só como gente mudando de pop.

---

### 2.7 Organizações

**O que é.** Uma organização tem nome, líder e ação própria, nasce durante a partida de radicais de vários grupos ou do lucro e da falta de Estado, e vive, racha e acaba.

**O jogador** (faz e sente)
- Várias existem, poucas preocupam. A ameaça é pequena, relevante, grave ou crítica.
- No mapa: pequenas aparecem discretas; graves viram alerta e eventos.
- Enfrenta com polícia, inteligência, negociação, e força militar contra organização grande e armada.
- Resposta mal feita pode criar mais radicais; caçar chefes pode rachar a organização.

**Peças**
- **Gerador:** não há lista fixa. Cria organizações conforme os grupos agradam ou não ao governo e agem. Os tipos da planilha são moldes.
- **Gatilho:** grupos com muitos radicais e insatisfação longa criam chance (e os radicais nascem da piora, ver 2.6).
- **Quem pode:** o grupo tem limite (coluna "Pode pegar em armas").
- **Organização política:** nasce de radicais de vários grupos próximos na bússola. Armamentistas ligados a conservadores e religiosos fundamentalistas são uma mistura perigosa. A mistura define nome, alvo e objetivo.
- **Insatisfação não basta:** precisa de ideia, líder ou rede; só parte dos radicais usa violência.
- **Atributos:** gente, dinheiro, armas, poder, organização. Dão a ameaça.
- **Moldes da planilha (12):** 6 políticos (Movimento de rua, Extremistas religiosos, Revolucionários, Milícia política, Radicais ambientais, Separatistas), 4 de crime (Facção de presídio, Tráfico, Milícia de bairro, Rede corrupta) e 2 legais (Igreja, Sindicato ou associação).
- **Nome (gerador):** tipo + ideia + lugar ou símbolo. Duas organizações não usam o mesmo nome; nenhum nome é real.
- **Crime organizado:** nasce do lucro (mercado ilegal, presídio lotado, favela, falta de Estado, corrupção). Vende, corrompe e disputa território.
- **Organizações legais (07/nov):** igrejas, sindicatos e associações, sem armas. A igreja é também dono sem lucro. Tem vertente (bússola) e engajamento: quietista, ativa ou militante.
- **Corrupção interna:** toda organização tem. Sobe com dinheiro fácil, isenção, sigilo e repasse sem controle; desce com fiscalização. Passa do limite: escândalo, racha, perda de apoio. O dinheiro dela vai ao bolso de alguém e deixa rastro (14/nov).
- **Financiamento:** outros países, empresas na bolsa e doadores podem pagar. Todo pagamento deixa rastro.
- **Investigação:** polícia, órgãos e imprensa descobrem quem paga. Pode prender líderes, cortar dinheiro, derrubar ações, gerar sanção e escândalo.
- **Mudar:** rachar, virar partido, virar crime (ou trocar a causa pelo lucro).
- **Acabar:** polícia, inteligência, negociação, perda de apoio.
- **Presos com nome (07/nov):** líder preso ganha ficha. Para os grupos aliados vira preso político; a bancada pede Anistia e o presidente pode dar a Graça (ato, não lei).
- **Certeza x peso da pena:** o crime reage forte à certeza de punição e pouco ao peso das penas. Pena dura é popular, lota presídios e custa caro.

**Regras**
- Pop, grupo e organização são camadas diferentes (06/nov).
- Nomes sempre inventados; extremistas em todos os lados.
- Não há lista fixa; o gerador cria.
- Cada grupo tem limite (pacifista nunca pega em armas).
- Organização política precisa de ideia ou líder, não só raiva.
- Crime não precisa de grupo para nascer.
- Organização legal tem engajamento político (07/nov).
- Financiamento e rastro (ideia do autor).
- Nenhum dinheiro some, nem o ilegal: ele vai ao bolso de alguém e deixa rastro (14/nov).

**Mídia como lente.** A imprensa investiga e revela quem paga, e pode virar escândalo. A mídia não cria a organização: ela mostra ou esconde o que já existe. **ESTUDAR** como a mídia dá tamanho à ameaça e ao recrutamento.

**Ligações**
- Recebe de Grupos: radicais de vários grupos.
- Recebe da Economia: o lucro do crime e do mercado ilegal.
- Recebe da Justiça e prisões: presídio lotado, facção, certeza da punição.
- Entrega à Bolsa: investigação derruba ações.
- Entrega ao Mundo: financiamento por outros países; sanção.
- Entrega ao Congresso: bancada pede Anistia; igreja elege bancada, negocia leis.
- Entrega à Política: igrejas militantes agem em toda eleição.
- Entrega ao Governo: ameaça a gente, polícia e Defesa.

**Referências**
- McCauley e Moskalenko, Gómez e outros: radicalização.
- Della Porta: violência em protestos; organização é peça própria.
- RAND (268 grupos terroristas que acabaram: política 43%, polícia 40%, vitória 10%, força militar 7%), Cronin.
- Gambetta e Varese (máfia vende proteção), Skarbek (facções de presídio).
- Estudo de vícios: caça aos chefes.
- Nenhum jogo é citado para organizações. **ESTUDAR** referência de jogo.

**No motor hoje**
- ☐ R11.14 Organizações políticas. ☐ R11.15 Crime organizado. ☐ R11.16 Gerador. ☐ R11.18 Financiadores e rastro.
- "Falta: tudo." Igrejas e sindicatos já aparecem como donos sem lucro na Economia.

**Em aberto**
- Regras e números de nascer e crescer, ações de cada tipo, como o jogador as enfrenta.

---

### 2.8 Saída (informal, emigrar, tirar dinheiro)

**O que é.** O grupo insatisfeito tem três reações: protestar, ficar leal ou sair. Sair tem três caminhos: informalidade, tirar o dinheiro do país ou emigrar.

**O jogador** (faz e sente)
- Fuga da regra: a regra forte demais alcança menos gente (informal, ilegal), conforme a verba de quem fiscaliza; junto, a sonegação que cresce com o imposto (14/nov).
- Sente a conta chegar por esse canal.

**Peças**
- **Informalidade:** hoje só o encargo do Seguro na folha faz formal virar informal.
- **Tirar o dinheiro do país:** sem regra além do nome. O dinheiro que sai não some: sai do país (14/nov).
- **Emigrar:** hoje só Profissionais de saúde, o único caso em que a população muda.
- **Nascido fora:** é o outro lado, imigração. Ver 2.2.
- **Protesto e lealdade** passam pelos radicais e lealistas (2.6).

**Regras**
- Três reações e três caminhos de saída.
- A regra forte demais alcança menos gente (14/nov).

**Mídia como lente.** A mídia não faz ninguém sair; ela pode dar a notícia que acelera a fuga de dinheiro ou de gente sobre uma piora que já existe. **ESTUDAR.**

**Ligações**
- Recebe dos Grupos: insatisfação.
- Entrega à Economia: informal deixa de pagar imposto; dinheiro e gente saem do país.
- Entrega às Leis: fiscalização (verba de quem fiscaliza).
- Entrega à Saúde e à Imigração (profissionais de saúde que emigram).

**Referências.** Nenhuma achada. **ESTUDAR.**

**No motor hoje**
- ☐ R11.10 Insatisfeito sai: informalidade, fuga de dinheiro, emigração.
- ◐ Só dois casos soltos: o Seguro na folha e os profissionais de saúde.

**Em aberto**
- Quando alguém sai: o que leva à informalidade, à fuga de dinheiro e à emigração, e com que números.

---

### 2.9 Lugar (estados)

**O que é.** Todo pop tem campo e cidade e fica num estado. Cada país declara todos os seus estados, as pessoas de cada um e como se dividem.

**O jogador** (faz e sente). A tela não está descrita nas fontes.

**Peças**
- **Estado vale para tudo:** pops, prédios, voto e energia.
- **Fallback:** se o país não declarar a divisão de um pop num estado, vale a divisão nacional.
- **País sem estados:** declara um só; regionalistas e separatistas não aparecem.
- **Campo e cidade:** hoje só a Moradia separa os pops do campo, sem êxodo de pop.

**Regras**
- Lugar (08/nov): todo pop tem campo e cidade e fica num estado.
- O país declara os estados.

**Mídia como lente.** **ESTUDAR** se a mídia tem alcance por estado.

**Ligações**
- Entrega ao Voto (por estado), à Energia, a Governadores e à Moradia e Terra.
- Entrega às Organizações: regionalistas e separatistas só existem com estados.

**Referências.** Pew: cidade ou campo separa muito a política (EUA). Nenhum jogo citado para estados. **ESTUDAR.**

**No motor hoje**
- ☐ R11.17 Pops por estado ("medido possível em 12/nov").
- ◐ Campo e cidade só na Moradia.

**Em aberto**
- Se entra na V1 ou depois, e o que depende disso (voto por estado, energia, governadores).
- Se o êxodo aparece como índice ou só como gente mudando de pop.

<!-- revisor: Tirei: "bússola é a raiz do jogo" (07/nov), superada por bolso + bússola + memória (B, 14/nov); o conflito "bússola do pop não move nada" (populacao.md velho; vale grupos.md, A); "16 grupos / 25 pops" virou nota do motor atrás do GDD (A); "68 das 71 leis" e a contagem de leis (número velho, A). Radicais: o código (nível) fica em "No motor hoje" e o GDD vale pela piora (C4); a fórmula do alvo foi mantida como estado do motor. Padrão de vida: o rascunho dizia "sem decisão"; reescrevi 2.3 com a piora (C4) e mandei para Em aberto se vira número por pop e se é igual ao bolso. Mídia: as linhas "Mídia como lente" citam só R14.2, R14.8 e R14.9 do rascunho; o resto é ESTUDAR (C3), sem inventar efeito. Para Em aberto (sem decisão no 08-conflitos): a fórmula de satisfação (bolso+bússola+memória) contra o limite ±15 e a distância; "evitar lista" no Congresso (campo defende); como o bolso vira gosto de grupo. "Nenhum dinheiro some" foi aplicado em organizações (rastro) e saída. Cesta por fatia de renda aparece como regra meta do GDD (A). Imigração sem R próprio, mantido. -->
