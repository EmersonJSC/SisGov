# IX. Tela

Rascunho do GDD novo, parte IX. Junta o que já está decidido e espalhado. Nada foi inventado: faltou fonte, vira **ESTUDAR** ou "Em aberto". Conflito entre fontes aparece como **⚠ CONFLITO**, sem escolha. Estado de cada fonte: 14/nov/2026, salvo quando a data vem na frase.

Legenda do motor/tela: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`.

Siglas das fontes: gdd.md = `docs/jogo/gdd.md`; mecanicas.md = `docs/jogo/mecanicas.md`; requisitos.md = `docs/jogo/requisitos.md`; arquitetura.md = `docs/jogo/arquitetura.md`; mesa.md = `src/motor/mesa/mesa.md`; tres-aneis = `docs/jogo/interface/mapa-em-tres-aneis.md` (30/out); area-aberta = `docs/jogo/interface/area-aberta.md` (21-22/out); direcao-de-arte, estilos-de-arte, briefing-icones, artes-de-tela = `docs/arte/`.

A tela é "em volta" das três grandes mecânicas. Ela só lê o jogo e chama a partida; não calcula. [gdd.md:2023] [arquitetura.md:20]

---

## IX.1 Mapa

1. **O que é.** O mapa é a tela onde o jogador propõe leis e vê o país como está: bolhas soltas, puxadas por uma hierarquia por baixo. [gdd.md:1906] [gdd.md:1911]

2. **O que o jogador faz e sente.**
   - Lê o país no mapa: bolhas de leis e índices crescendo e encolhendo, grupos satisfeitos ou não, mídias, países, manchetes. [gdd.md:200-202]
   - Decisão de governo é uma bolha de lei no mapa, nunca um painel de gestão. [gdd.md:90-91] [memória feedback_lei_e_bolha]
   - Telas de leitura são aceitas; a decisão fica na lei. [memória feedback_lei_e_bolha]
   - Lei assinada aparece e muda no mapa como bolha. [gdd.md:2010]
   - Pronto quando (30/out): de longe se leem os anéis, passando o mouse numa lei dá para seguir lei, índice e grupo sem procurar, e nenhuma bolha nem rótulo se sobrepõe. [mapa-em-tres-aneis.md:75-79]

3. **Peças.** Do centro para fora: [gdd.md:1912]
   - **Miolo, os Três Poderes em camadas.** O Executivo é a trindade do partido (presidente do partido, presidente eleito e vice, na cor do partido, sigla no meio). Os juízes ficam em volta dela. O Congresso é um anel de cadeiras por fora, Câmara em cima e Senado embaixo, voltadas para dentro. [gdd.md:1913-1917]
   - **Anel de ministros**, com rosto, cada um com uma fatia pelo que cuida. Sob cada um, as **instituições** (escudo). Das instituições saem as **leis**, em pétalas para fora. [gdd.md:1918-1920]
   - **Índices** presos ao ministro responsável; **grupos** num anel de fora; **potências** mais longe. [gdd.md:1922-1923]
   - **Escudo da instituição:** frase curta ("12 na fila · 2 na sua mesa") e cor do rendimento (verde rende, amarelo falta verba, vermelho sobra e vira corrupção). [gdd.md:427-429]
   - **Leis não promulgadas** ficam fora do mapa, num botão no canto, com a folha para promulgar. [gdd.md:1920-1921] [requisitos.md:417]
   - **Prioridade visual:** Ministro > Instituição > Índice > Lei. Ministros e instituições sempre com nome e destaque; a lei aparece pequena e recuada. [gdd.md:1925-1926]
   - **Visões** (filtros "Ligações", "Nível", "Dinheiro", "Popularidade"): pesam as bolhas dentro do degrau de cada uma, sem passar para o de cima. [gdd.md:1926-1928]
   - **Fios:** hierarquia em ouro; efeito verde (melhora) e vermelho (piora), que só correm com a bolha em foco. Bolha sem ligação nenhuma tem anel tracejado. [gdd.md:1929-1930]
   - **Alerta do índice:** a cor do anel diz o nível (crítico a bom); a seta diz se subiu ou desceu. [gdd.md:1931-1932]
   - **Barra do topo:** caixa, dívida, PIB, apoio, eleição e passar o turno. [requisitos.md:419]
   - **Navegação:** busca, enquadrar, miniatura, pinça, roda, setas e teclado. [requisitos.md:420]
   - **Painel Atrapalham / Ajudam** de ministro, instituição e índice. [requisitos.md:418]
   - **Trocar ministro pelo mapa:** o painel do ministério clicado traz a troca e o preço dela. [requisitos.md:422]
   - **O que a bolha escreve em cada setor** (a bolha mostra, o painel não manda): Construção civil abre as duas filas de obras [gdd.md:1783-1784]; cartão da obra diz o motivo do atraso e acende as bolhas das leis que resolvem [gdd.md:1797]; Cultura mostra "12 na fila · 2 na sua mesa · 9 bens em risco" [gdd.md:1840]; Defesa civil mostra selo verde, amarelo ou vermelho, o Preparo e os últimos 3 desastres [gdd.md:1864-1865]; lei de verba mostra o cadeado do gasto travado [gdd.md:1532-1536]; compra de cotas mostra ritmo, custo e se a meta será batida [gdd.md:1584-1585]; a bolha da lei mostra o placar previsto do Congresso [gdd.md:855-856].
   - **Mapa elétrico (não é mapa político):** a tela mostra a rede de energia, com os estados ligados por linhas, verde quando sobra e vermelho quando falta. [gdd.md:1645-1646]
   - **Tela do Congresso:** sem painel, tudo no mapa: anel de cadeiras, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha do quórum, "até aqui passa" na régua. [gdd.md:996-1005]
   - **Grupo que pulsa vermelho** no mapa quando a raiva sobe, e sai manchete. [gdd.md:1178]

4. **Regras decididas.**
   - **Mapa orgânico, hierarquia por baixo (13/nov).** [gdd.md:1911]
   - **As 8 áreas antigas saem (13/nov):** o mapa se organiza só pela hierarquia. [gdd.md:1924] [arquitetura.md:210-212]
   - **Prioridade visual e filtros (13/nov).** [gdd.md:1925-1928] [requisitos.md:415]
   - **Só as leis promulgadas ficam no mapa (13/nov).** [gdd.md:1920] [requisitos.md:417]
   - **Seta de tendência (13/nov):** compara com 8 meses atrás (4 turnos) e aparece a partir de 2 pontos de saúde, porque o índice anda devagar e um turno só não mostrava nada. [gdd.md:1931-1934] [requisitos.md:416]
   - **Índice preso ao ministro (13/nov):** ao que leva a maior parte das leis ligadas a ele. [gdd.md:724-725]
   - **Visível e invisível (07/nov):** o visível aparece na tela; o invisível só se sente pelo que acontece (greve, surto, notícia). [gdd.md:726-727]
   - **Congresso como anel de cadeiras, uma por deputado na cor do partido (11/nov).** [gdd.md:996-998]
   - **Linhas só no foco (30/out, antes do recomeço de 31/out):** sem foco, nenhuma ligação aparece. Com o mouse numa lei acende lei, índices, grupos; num índice, as leis que o mexem e os grupos; num grupo, os índices dele. Bate com a regra de 13/nov dos fios que só correm com a bolha em foco. [mapa-em-tres-aneis.md:29] [gdd.md:1929-1930]
   - **Nível de detalhe pelo zoom (30/out, antes do recomeço de 31/out; só consta nesta fonte):** de longe, ponto colorido; de perto, ficha com nome. [mapa-em-tres-aneis.md:59]
   - **Mapa em tela, direção:** funções de posição puras e testadas; o motor não lê posição. [mapa-em-tres-aneis.md:66-68]
   - **Desempenho:** fios no canvas, câmera no `viewBox`, ~1 ms de JS por quadro parado; tecla F mede os quadros. [arquitetura.md:207-208]

5. **Ligações (o que o mapa mostra de cada mecânica).**
   - **Gosto/população:** grupos no anel de fora; grupo pulsa vermelho quando a raiva sobe; a ficha do grupo mostra uma seta para onde ele vai na bússola e qual mídia o empurra. [gdd.md:1922] [gdd.md:1164-1165] [gdd.md:1178]
   - **Economia:** índices presos aos ministros; cadeado nas bolhas de lei de verba; mapa elétrico; filas de obras. [gdd.md:1922] [gdd.md:1535] [gdd.md:1645] [gdd.md:1783]
   - **Leis:** só as promulgadas ficam no mapa, em pétalas das instituições. [gdd.md:1920]
   - **Política:** trindade e Congresso no miolo; placar previsto na bolha da lei. [gdd.md:1913-1917] [gdd.md:855]
   - **Judiciário:** juízes no miolo coloridos pelo lado; passar o mouse mostra a fila ("320 processos · 2 seus"); Justiça e prisões é um escudo sob o ministro. [gdd.md:470-471]

6. **Referências.**
   - O estilo da tela cita Victoria 3, Suzerain, Papers Please e Frostpunk só como referência estética. [direcao-de-arte.md:15]
   - Para o mapa em si (bolhas sobre hierarquia, órbitas): **ESTUDAR** (nenhuma fonte cita jogo ou estudo para essa forma). A "órbita" aparece só como metáfora no levantamento de estilos. [estilos-de-arte.md:63]

7. **No motor/tela hoje.**
   - ✅ R17.1 mapa orgânico. [requisitos.md:412]
   - ✅ R17.12 mapa por ministério e instituição, sem as 8 áreas. [requisitos.md:413]
   - ◐ R17.16 Três Poderes no miolo; juízes de verdade por tribunal desde 14/nov; em aberto se cada instituição e lei responde a um poder. [requisitos.md:414]
   - ✅ R17.17 prioridade visual e visões; Popularidade sem dado, porque o motor não calcula popularidade por lei. [requisitos.md:415]
   - ✅ R17.18 alerta do índice. [requisitos.md:416]
   - ✅ R17.19 leis promulgadas. [requisitos.md:417]
   - ✅ R17.20 Atrapalham / Ajudam. [requisitos.md:418]
   - ✅ R17.21 barra do topo. [requisitos.md:419]
   - ✅ R17.22 navegação. [requisitos.md:420]
   - ✅ R17.24 trocar ministro pelo mapa. [requisitos.md:422]
   - Mapa 18.1 ✅: miolo com trindade, STF e TSE, Congresso; índices do país num anel por fora (14/nov). [mecanicas.md:941-945]
   - Código: `src/tela/mapa/` (organico.ts com `d3-force`, BolhaDoMapa, MapaOrganico, fundo em canvas). [arquitetura.md:194-205]
   - Falta tirar do código o campo `area` dos índices, que ainda serve para achar o ministro quando nenhuma lei liga neles. [arquitetura.md:210-214] [arquitetura.md:254]

8. **Em aberto.**
   - Se cada instituição e cada lei responde a um dos poderes. [gdd.md:2116-2118]
   - Como cabem no mapa, sem virar painel: lista de companhias, tela do Mundo e mapa elétrico. [mecanicas.md:960-963]
   - A lei de Tipos (Lei com prazo, Ato, Posição por país, Operação) precisa de um jeito de aparecer: bolha com relógio, botão, menu do país, lista de companhias. [mecanicas.md:446-448] (R7.16 ☐)
   - ⚠ CONFLITO (estrutura do mapa):
     - Versão de 30/out (tres-aneis, antes do recomeço de 31/out): centro é a Presidência; **anel 1** são as leis em fatias por **área** (11 áreas); **anel 2** índices e situações; **anel 3** grupos. [mapa-em-tres-aneis.md:20-25] E o passo 3 faz as áreas virarem setores de anel com as leis à vista. [mapa-em-tres-aneis.md:53-58]
     - Versão de 13/nov (gdd): miolo dos Três Poderes, anel de ministros, instituições sob eles, leis em pétalas para fora, índices presos ao ministro, grupos fora; as 8 áreas saem. [gdd.md:1911-1924]
     - A de 13/nov revoga as áreas de forma explícita, mas não cita o desenho em três anéis pelo nome. Não escolhi: pergunta ao autor se o arquivo tres-aneis fica como histórico.
   - ⚠ CONFLITO (janelas abrem de onde):
     - Ver IX.3.

---

## IX.2 Mesa (assinar e carimbar)

1. **O que é.** A mesa é onde chegam os papéis que pedem o presidente: o que os outros põem na frente do jogador. [gdd.md:1906-1907] [mecanicas.md:902]

2. **O que o jogador faz e sente.**
   - Despacha a pilha de papéis do turno, um a um, com carimbo. [gdd.md:1938-1939]
   - Há a mesa do presidente (governo) e a mesa do partido. [gdd.md:1939-1940]
   - Despachar a mesa é o passo 3 do turno: assina, veta, recusa, encaminha ou deixa na pilha. [gdd.md:205-207]
   - **O Congresso usa a mesa como arma:** a oposição com votos aprova leis em lote, longe da bússola do jogador. Ele veta uma a uma (cada veto irrita quem aprovou e vira manchete) ou deixa passar o que não dá tempo de ler. [gdd.md:1957-1959]
   - Papel novo importante abre a mesa sozinho e o botão pulsa (vaga de juiz). [mecanicas.md:933-935]
   - Papel duvidoso chega disfarçado mas visível: o texto parece normal e traz pistas (preço acima do comum, intermediário, pressa, "apoio à campanha"). Só a música e o som mudam. [gdd.md:1986-1988]
   - O papel de calamidade "tem povo": o que houve; quem sofre, com nome e voz; o que fazer, com as opções na primeira tela. O mesmo texto sai como notícia. [gdd.md:1866-1868]

3. **Peças.**
   - **Carimbos:** Assinar, Vetar (só lei), Recusar, Encaminhar ao ministro, ou deixar na pilha. [gdd.md:1941-1942]
   - **Papéis do presidente:** lei aprovada pelo Congresso; situações (enchente, greve, empresa quebrando, acordo de país); pedidos (aliado, ministro, governador). [gdd.md:1943-1953]
   - **Papéis do partido:** doador, político que quer se filiar, deputado que votou contra (expulsar ou perdoar), aliado propõe coligação. [gdd.md:1954-1956]
   - **Famílias de papel** (sem lista papel por papel; o conteúdo sai dos números do momento): Leis, Crises, Pedidos, Ofertas, Instituições, Partido, Duvidosos. [gdd.md:1969-1977]
   - **Papéis novos do Congresso:** emenda, partido ameaça sair, promessa com prazo, veto derrubado, CPI aberta, aviso do presidente da casa. [gdd.md:1006-1007]
   - **Aviso:** só informa e some no turno seguinte (lei aprovada, decreto, veto derrubado, veto mantido). [mesa.md:90-92]
   - **Veto com observação:** o presidente veta e diz o valor que assinaria. O Congresso escolhe: derrubar o veto (quórum da aba Derrubar veto), aceitar a observação (maioria simples, sem voltar à mesa) ou nada (a lei cai). Em lei com abas, a observação pode ser só numa parte. [gdd.md:1978-1984]
   - **Encaminhar ao ministro** é conforto, não obrigação: o ministro decide pela ficha. Competente acerta mais, desleal decide a favor dele, desonesto assina o que rende propina. [gdd.md:2001-2003]
   - **Papéis duvidosos** (porta da corrupção): ganho é dinheiro de campanha, voto do aliado e termômetro; custo é a corrupção do órgão e o rastro, que pode ser descoberto a cada turno (regra da mentira descoberta, seção 14). Recusar irrita quem pediu; denunciar sobe a aprovação e faz inimigo. [gdd.md:1985-2000]

4. **Regras decididas.**
   - **Silêncio:** lei ignorada até o prazo vira lei sozinha ou cai, conforme a regra do país (sanção tácita ou veto tácito). [gdd.md:1945-1947] [mesa.md:99-102]
   - **Sem limite de papéis (11/nov):** o freio é do mundo; cada papel tem prazo e ignorar tem consequência. [gdd.md:1960-1962]
   - **Prazos (11/nov, calibrar no fim):** lei aprovada e emenda 1 turno; situação urgente 1 turno (piora, vira crise e manchete); situação calma 3 turnos; pedido de aliado 2 turnos; partido ameaça sair 1 turno; promessa até 4 turnos; papel do partido 2 turnos. [gdd.md:1963-1968]
   - **Famílias sem roteiro (11/nov).** [gdd.md:1969-1970] E nada de roteiro: todo papel nasce do estado do país e das fichas (princípios 8 e 12). [gdd.md:2009-2010]
   - **Veto com observação (11/nov).** [gdd.md:1978]
   - **Papéis duvidosos (11/nov).** [gdd.md:1985]
   - **Ignorar tem consequência**, conforme o papel: lei passa, situação piora, aliado ignorado se afasta, doador vai para outro partido. [gdd.md:2004-2006]
   - **A mídia lê a mesa:** vetar lei popular ou assinar lei impopular vira manchete. [gdd.md:2007-2008]
   - **Papel não tem texto guardado:** a tela escreve o conteúdo a partir da lei e do valor (R17.7). A mesa é refeita no fim de cada turno. [mesa.md:93-95]
   - **Pedido do jogador:** `{ tipo: "carimbar", papel, carimbo: "assinar" | "vetar", observacao? }`; papel que não está na mesa ou que é só aviso dá erro. [mesa.md:104-108]
   - **Fatos:** o carimbo vira `papel-assinado` ou `papel-vetado`; ignorar vira `papel-ignorado`. [mesa.md:101-102]
   - **Arte da mesa:** pilha física de papéis com carimbos *Sancionar*, *Vetar com Observação*, *Encaminhar*. [direcao-de-arte.md:97-99]

5. **Ligações.**
   - **Gosto/população:** quem pediu fica chateado ao recusar; denunciar sobe a aprovação; aliado ignorado se afasta; manchete por veto popular. [gdd.md:1998-1999] [gdd.md:2005] [gdd.md:2007-2008]
   - **Economia:** situação vira gasto, lei proposta ou efeito direto ao assinar; crise de enchente ou apagão sai dos dados do país. [gdd.md:1948-1951] [gdd.md:1972]
   - **Leis:** assinar vira lei; vetar devolve ao Congresso. [gdd.md:1944-1945]
   - **Política:** instituição manda caso disputado e vistoria; partido manda doador e filiação; governadores pedem obra. [gdd.md:1975-1976] [gdd.md:1952-1953]
   - **Corrupção:** papel duvidoso deixa rastro, que pode virar escândalo, CPI e fato do impeachment. [gdd.md:1994-1997]

6. **Referências.**
   - *Papers, Please* aparece entre as referências estéticas do jogo. [direcao-de-arte.md:15] Não há fonte dizendo o que se copia dele na mesa: **ESTUDAR**.
   - Sobre pilha de papéis e carimbo como jogo (ritmo, quantos por turno, como o jogador sente): **ESTUDAR**.

7. **No motor/tela hoje.**
   - ◐ R17.6 carimbos: feitos assinar e vetar com observação na janela Mesa; faltam recusar, encaminhar e pilha. [requisitos.md:434] [mecanicas.md:906-907]
   - ◐ R17.7 famílias de papel: só a família Leis (e a vaga de juiz). Faltam crises, pedidos, ofertas, instituições, partido. [requisitos.md:435] [mecanicas.md:911-912]
   - ◐ R17.13 prazos: papel de lei vale 1 turno; falta crise que piora e aliado que se afasta. [requisitos.md:436] [mecanicas.md:916-917]
   - ☐ R17.14 papéis duvidosos com rastro. [requisitos.md:437]
   - ☐ R17.8 encaminhar ao ministro. [requisitos.md:438]
   - ☐ R17.9 a mídia lê a mesa. [requisitos.md:439]
   - ☐ R17.10 mesa do partido. [requisitos.md:440] [mecanicas.md:744-746]
   - ✅ Papel importante abre a mesa sozinho e o botão pulsa (14/nov). [mecanicas.md:933-935]
   - Tela: `MesaDePapeis.tsx`; o botão Mesa fica ao lado de Passar o turno. [arquitetura.md:214] [requisitos.md:421]

8. **Em aberto.**
   - Situações (crises): saem dos dados; duas ou três respostas com ganho e custo. A pensar: como cada setor desenha os seus papéis. [mecanicas.md:919-923]
   - Como os pedidos de governadores entram na mesa (R6.23 ☐). [mecanicas.md:586-589]
   - Prazos são "de partida, calibrar no fim". [gdd.md:1963]

---

## IX.3 Janelas (Mercado, Governo, Programas, Eleição, Mesa e outras)

1. **O que é.** Telas por cima do mapa que o jogador abre para ler ou decidir algo que não cabe numa bolha. [requisitos.md:421] [arquitetura.md:214-215]

2. **O que o jogador faz e sente.**
   - Abre pela peça do mapa onde aquilo mora: o clique na trindade abre o Governo, os medidores de apoio e eleição abrem a Eleição, o do PIB abre o Mercado. [requisitos.md:421]
   - A folha da lei abre no mapa; antes de assinar mostra "a conta que vem". [requisitos.md:417] [gdd.md:2020-2022]
   - A janela da lei mostra o placar previsto da votação. [requisitos.md:246]

3. **Peças.**
   - **Menu no brasão:** Salvar, Carregar, Recomeçar. [requisitos.md:421]
   - **Governo:** pelo clique na trindade. [requisitos.md:421]
   - **Eleição:** pelos medidores de apoio e eleição; mostra a Aprovação (satisfação média dos pops, pesada pelo tamanho). [requisitos.md:421] [requisitos.md:206]
   - **Mercado:** pelo medidor do PIB. [requisitos.md:421]
   - **Mesa:** botão ao lado de Passar o turno. [requisitos.md:421]
   - **Programas:** botão ao lado de Leis não promulgadas. Antes de uma lei desfazer um programa, a tela avisa. [requisitos.md:421] [gdd.md:599-600]
   - **Pregão** (minigame da bolsa; protótipo sem motor) fica escondido. [requisitos.md:421] [requisitos.md:388]
   - **Tela do Mundo:** ranking por PIB com a relação de cada país com você (inimigo, rival, neutro, amigo, aliado); clicar num país abre a ficha (dados, relação, o que está em vigor: tratados, sanções, bases, ajuda) e as formas de se aproximar ou se afastar. [gdd.md:1248-1254]
   - **Lista de companhias** (operações das estatais como papéis na mesa). [mecanicas.md:352]
   - **Menu do país e da companhia:** o que aparece ao clicar num país ou numa companhia é decisão do presidente (Ato ou Operação), não lei. [gdd.md:96-98] [memória feedback_leis_x_decisoes]
   - **Telas dos Programas:** bolha do programa no mapa, com as leis que faltam. [requisitos.md:185]

4. **Regras decididas.**
   - **Onde moram as janelas (13/nov):** a lista de IX.3.3 (R17.23). [requisitos.md:421]
   - **Decisão do presidente aparece ao clicar num país ou companhia (08/nov).** [gdd.md:96-98]
   - **Lei x decisão (08/nov):** isso evita o mapa encher de bolhas e a decisão do dia a dia se perder. [memória feedback_leis_x_decisoes]
   - **Sem painel de gestão:** o jogo tem janelas de leitura e escolha, mas decisão de governo continua sendo bolha de lei. [gdd.md:90-91] [arquitetura.md:237]

5. **Ligações.**
   - **Gosto/população:** a Eleição mostra a Aprovação. [requisitos.md:206]
   - **Economia:** Mercado e Pregão (preço, lucro, bolsa). [gdd.md:1487-1491]
   - **Leis:** Programas, folha da lei, não promulgadas. [requisitos.md:417] [requisitos.md:185]
   - **Política:** Governo (régua e caixas de ministérios), Eleição, Mesa. [requisitos.md:146] [requisitos.md:421]

6. **Referências.**
   - Para o desenho de cada janela (Mercado, Mundo, lista de companhias): **ESTUDAR** (nenhuma fonte cita jogo ou estudo). O Victoria 3 serve de referência do mercado, não da tela. [gdd.md:45]

7. **No motor/tela hoje.**
   - ✅ R17.23 as janelas já têm casa. [requisitos.md:421]
   - Código: `Governo.tsx`, `Eleicao.tsx`, `Mercado.tsx`, `MesaDePapeis.tsx`, `Pregao.tsx`, `NaoPromulgadas.tsx`, `DocumentoLei.tsx`. [arquitetura.md:204] [arquitetura.md:214-215] (lista de arquivos em `src/tela/mapa/`, conferida na pasta)
   - ◐ R16.15 Pregão: protótipo na tela. [requisitos.md:388] [mecanicas.md:365-367]
   - ☐ R15.12 Tela do Mundo: ranking com a relação e a ficha do país. [requisitos.md:337] [mecanicas.md:894-896]

8. **Em aberto.**
   - ⚠ CONFLITO (as janelas abrem de onde):
     - Versão de arquitetura.md (13/nov): "As janelas Governo, Programas, Eleição, Mesa, Mercado e Pregão existem, mas nada as abre (o autor vai dizer onde moram)". [arquitetura.md:214-215]
     - Versão de requisitos.md R17.23 (13/nov): diz onde cada uma mora e marca ✅. [requisitos.md:421]
     - As duas têm a mesma data. Não escolhi. Provavelmente a arquitetura ficou desatualizada, mas isso é palpite: confirmar com o autor.
   - Como lista de companhias, tela do Mundo e mapa elétrico cabem sem virar painel. [mecanicas.md:960-963]

---

## IX.4 O comum às duas telas

1. **O que é.** O que mapa e mesa dividem: fichas das pessoas, momentos curtos do partido, manchetes, votação, passar o turno, causa e efeito. [gdd.md:2012-2023]

2. **O que o jogador faz e sente.**
   - Abre a ficha de uma pessoa por cima do mapa. [gdd.md:2014-2015]
   - Vê as escolhas do partido (ministério, chapa, coligação, campanha) como telas curtas, não painéis. [gdd.md:2016-2017]
   - Lê as manchetes do turno e passa o turno. [gdd.md:2018]
   - Entende o porquê: "o corte na saúde de dois anos atrás virou fila agora"; nunca parece azar. [gdd.md:233-235]
   - Vê o país mudar sem placar: PIB, empresas, empregos, riqueza das pessoas. [gdd.md:236-237]
   - Ao propor uma lei vê antes quem ganha e quem perde. [gdd.md:203]
   - A lei diz "efeito em N turnos", para o jogador planejar e não achar que ela falhou. [gdd.md:2051-2052]

3. **Peças.**
   - **Fichas** de pessoas (presidente, vice, ministros, líderes): retrato genérico, atributos, posição na bússola. [gdd.md:2014-2015]
   - **Atributos do ministro:** competência, habilidade política, carisma, honestidade, lealdade, bússola e origem. [gdd.md:297-305]
   - **Ficha só de leitura da instituição:** ministro, verba × necessidade numa barra, corrupção interna, fila e leis que mexem nela. [gdd.md:429-431]
   - **Rede da pessoa:** perfil de rede social gerado da ficha (o que posta, onde vai, o que diz sobre os temas do país), sem rótulo de esquerda ou direita; "Informações pessoais descobertas" cresce com a inteligência; botão Espiar fica num registro que pode vazar. [gdd.md:172-196]
   - **Momentos do partido:** montar ministério, chapa, coligação, campanha. [gdd.md:2016-2017]
   - **Causa e efeito (12/nov):** a bolha do índice mostra "o que empurra" (leis e índices que mexem nele, com seta, força e turnos até chegar); a bolha da lei, antes de assinar, mostra "a conta que vem" (o que cada índice deve fazer em 1 e em 4 anos); o gráfico do índice marca o turno em que cada lei foi assinada. [gdd.md:2019-2022]
   - **Promessa de campanha** fica na tela até a eleição. [gdd.md:1064-1065]
   - **Dinheiro na moeda do país.** [gdd.md:2023]
   - **Manchetes do turno** e Resultado do turno (fatos como manchete). [gdd.md:2018] [requisitos.md:65]
   - **Votação, passar o turno, resultado do turno.** [requisitos.md:427]

4. **Regras decididas.**
   - **Texto da tela sai dos números da lei:** texto e motor nunca discordam. [gdd.md:569] [requisitos.md:157]
   - **Texto para leigo:** lei e opção com exemplo do dia a dia, sem jargão. [memória feedback_texto_para_leigo]
   - **Sem cortar a escolha:** texto simples, mas sem tirar a régua numérica; o jogador é criativo, testa extremos e gosta de números, mesmo os que não aparecem. [memória user_publico_alvo]
   - **Nome da lei:** palavras de todo dia, "o que + de quem/sobre o quê"; sigla e nome técnico nunca no nome; o nome real do país pode aparecer embaixo, menor. [o-que-e-uma-lei.md:108-112]
   - **Nada diz "esta pessoa é de tal lado":** o jogador deduz. [gdd.md:180-181]
   - **Retratos genéricos para pessoas e empresas (autor, 08/nov);** nenhuma pessoa, empresa ou direito autoral real. [gdd.md:2201-2202]
   - **A tela não calcula:** só lê a visão da partida e manda pedidos. [gdd.md:2023] [arquitetura.md:29]
   - **A narrativa vem depois dos dados;** a tela escreve a partir dos números. [gdd.md:117-118] [memória project_narrativas_no_final]
   - **Nada neutro (princípio 7):** toda escolha mexe em algo visível. [gdd.md:115-116]

5. **Ligações.**
   - **Gosto/população:** a ficha do grupo mostra a seta de bússola e a mídia que empurra. [gdd.md:1164-1165] Os números de gosto aparecem divididos por parte ao passar o mouse (ver IX.8). [mecanicas.md:182-183]
   - **Economia:** "conta que vem" da lei, "o que empurra" do índice. [gdd.md:2019-2022]
   - **Leis:** prévia de quem ganha e perde antes de propor; programa avisa antes de desfazer. [gdd.md:203] [gdd.md:599-600]
   - **Política:** fichas de pessoas, placar previsto, termômetro dos partidos; "Ao passar o dedo, o partido mostra os dois motivos que mais pesam no voto dele". [gdd.md:855-858] [gdd.md:871-872]

6. **Referências.**
   - CK3 mostra cada parte do gosto com o seu número ao passar o mouse. [mecanicas.md:180-183]
   - Para fichas de pessoas por cima de mapa e perfil de rede social: **ESTUDAR** (nenhuma fonte cita jogo).

7. **No motor/tela hoje.**
   - ✅ R17.2 votação, passar o turno, resultado do turno. [requisitos.md:427]
   - ◐ R17.4 fichas por cima do mapa: retrato feito; atributos faltam. [requisitos.md:429] [mecanicas.md:947-949]
   - ◐ R6.1 retratos genéricos (feitos, provisórios: o autor não gostou); ficha com atributos falta. [requisitos.md:100] [mecanicas.md:965-967]
   - ◐ R17.5 prévia de quem ganha e perde antes de propor. [requisitos.md:430] [mecanicas.md:954]
   - ◐ R17.15 causa e efeito: feitos os fios de efeito e o painel Atrapalham / Ajudam; faltam a conta que vem e o gráfico. [requisitos.md:423] [mecanicas.md:951-954]
   - ☐ R17.11 momentos do partido como telas curtas (chapa, coligação, campanha). [requisitos.md:441] [mecanicas.md:956-958] (o começo da partida tem telas de chapa, governo e ministros, ver IX.5.)
   - A seta de tendência já existe na tela; o voto ainda não a usa. [gdd.md:2048-2050]

8. **Em aberto.**
   - Retratos: o autor não gostou dos genéricos. [mecanicas.md:965-967]
   - Opinião: como o jogador vê a opinião de cada ator sem virar painel. [mecanicas.md:168-170]
   - Como mostrar o bolso de um pop virando gosto do grupo sem virar painel. [mecanicas.md:187-188]
   - A mídia lê e escreve na mesa (R17.9 ☐); o jornal só mostra manchetes, nenhuma notícia mexe em grupo, voto ou aprovação (13/nov, corrigir quando fizermos mídia). [gdd.md:2085-2089]

---

## IX.5 Tela inicial e começo da partida em passos

1. **O que é.** A sequência de telas curtas antes do mandato: país, partido, chapa, governo, ministros, iniciar. [requisitos.md:70] [arquitetura.md:155]

2. **O que o jogador faz e sente.**
   - Escolhe o país (reais ou declarados, cada um com economia, Congresso, partidos, mídias e grupos próprios). [gdd.md:138-139]
   - Cria o partido: nome e sigla. Não escolhe lado, posição nem bússola. [gdd.md:140-141]
   - Monta a chapa: três vagas (presidente do partido, candidato, vice). Clicar numa vaga abre a lista de pessoas de todos os partidos (assim nascem as coligações); clicar numa pessoa abre o perfil dela. A chapa já venceu. [gdd.md:142-145]
   - Monta o governo: primeiro o tamanho, numa régua (Enxuto, Clássico, Do país, Inchado); se quiser, arrasta instituições entre os ministérios. [gdd.md:153-155]
   - Escolhe ministros: o jogo sorteia pela chapa e cada cadeira pode ser trocada por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista. [gdd.md:155-157]
   - Inicia o jogo e governa. [gdd.md:158]
   - Entra com uma história: "no meio de uma polarização, você surge como a salvação do país". Partido novo, poucas cadeiras, presidente popular, Aprovação alta. [gdd.md:146-150]
   - Descobre o lado do próprio governo pelas consequências, não por um rótulo. [gdd.md:166-168]

3. **Peças.**
   - **País:** `EtapaPais`. **Partido:** `EtapaPartido`. **Chapa:** `EtapaChapa` e `ListaDePessoas`. **Governo:** `EtapaGoverno`. **Ministros:** `EtapaMinisterios`. **Iniciar:** `EtapaIniciar`. [arquitetura.md:153-155] (nomes dos arquivos conferidos na pasta `src/tela/inicio/`)
   - **Governo:** régua de tamanhos; "Ajustar caixas" abre a mesa onde o jogador arrasta as instituições (escudos) entre os ministérios, cria e tira ministério; a bandeja é a caixa da sobra. Mostra só efeitos que o motor tem: ministro mais carregado, o que fica sem ministério próprio, cadeiras sem pasta. [arquitetura.md:157-161]
   - **Ministros:** uma cadeira por caixa, com retrato e quanto o ministro rende ali. [arquitetura.md:162-164]
   - **Histórico do país:** cada país declara dados históricos; o resto os geradores criam. [gdd.md:160-164]

4. **Regras decididas.**
   - **Partido nasce sem lado (12/nov);** o lado sai da chapa: média da bússola da chapa, 5 grupos que ele defende (R4.8). [gdd.md:140-141] [requisitos.md:68]
   - **A sigla vira o id e não pode repetir a de outro partido (12/nov).** [requisitos.md:66]
   - **O país começa como está; o partido que governava vira oposição (12/nov).** No começo, o jogador pode pôr o antigo governo na coligação. [gdd.md:146-152]
   - **Governo em régua e caixas (13/nov).** [gdd.md:153-157]
   - **Estilo da tela de início: o da Art Bible (13/nov).** [requisitos.md:70]
   - **Tela de abertura (Art Bible):** a mesa do governante vista de cima; navegação física (fichas, dossiês com fotos presas, carimbo SISGOV); botão principal em placa de ferro fundido rebitada com tipografia em latão. [direcao-de-arte.md:87-90]
   - **Tela de carregamento (Art Bible):** vista monumental da capital; indicador de progresso mecânico (bússola de Estado ou fita de telex); doutrinas de governo datilografadas. [direcao-de-arte.md:92-95]
   - **Menu de início em telas curtas; o turno mostra os fatos como manchetes.** [requisitos.md:78]

5. **Ligações.**
   - **Gosto/população:** a chapa define a base de grupos e a bússola do partido. [gdd.md:166-167] [requisitos.md:68]
   - **Economia:** o país traz economia própria; a Aprovação começa alta. [gdd.md:138-139] [gdd.md:148-149]
   - **Leis:** o país declara as leis em vigor. [gdd.md:570-571] [arquitetura.md:224-225]
   - **Política:** a chapa dá coligação; o antigo governo vai à oposição ou à coligação; ministros dão cadeiras do Congresso. [gdd.md:144-145] [gdd.md:150-151] [gdd.md:328-329]

6. **Referências.** Para telas de começo de partida em jogo de estratégia política: **ESTUDAR** (nenhuma fonte cita). A Art Bible cita Suzerain e Papers Please como estética. [direcao-de-arte.md:15]

7. **No motor/tela hoje.**
   - ✅ R4.5 criar partido. [requisitos.md:66]
   - ✅ R4.6 chapa entre pessoas de todos os partidos. [requisitos.md:67]
   - ✅ R4.8 lado sai da chapa. [requisitos.md:68]
   - ◐ R4.9 partido novo com 6% das cadeiras e antigo governo na oposição ou coligação; falta a Aprovação começar alta. [requisitos.md:69] [mecanicas.md:74-76]
   - ✅ R4.10 tela de início em sequência (13/nov, no estilo da Art Bible). [requisitos.md:70]
   - Governo: régua e caixas; Ministros: cadeiras e cartas. [requisitos.md:146]

8. **Em aberto.**
   - A Aprovação começa alta: de quanto e quanto tempo dura a lua de mel. [mecanicas.md:78-79]
   - A história de entrada aparece como texto, tela ou só nos números. [mecanicas.md:80-81]
   - Outros países: só o Brasil 2026 existe; o que um país precisa declarar para ser jogável (arquivos obrigatórios). [mecanicas.md:82-83]
   - Placar final e fim de partida: o que a tela mostra (R4.7 ☐). [mecanicas.md:102-107]

---

## IX.6 Salvar e carregar

1. **O que é.** Guardar a partida e voltar a ela. [gdd.md:2018] [mecanicas.md:109]

2. **O que o jogador faz e sente.** Salva e carrega pelo menu no brasão; a partida salva sozinha a cada turno. [requisitos.md:421]

3. **Peças.**
   - Menu no brasão: Salvar, Carregar, Recomeçar. [requisitos.md:421]
   - Salvar sozinho a cada turno. [requisitos.md:421]
   - Módulo `salvar.ts` na camada de partida. [arquitetura.md:149]

4. **Regras decididas.**
   - O menu no brasão e o salvar sozinho a cada turno valem desde 13/nov (R17.23). [requisitos.md:421]
   - Salvar e carregar é caso de uso da partida, não da tela. [arquitetura.md:28]

5. **Ligações.** Guarda o estado de todas as mecânicas. A fonte não detalha o formato. **ESTUDAR** o que entra no arquivo.

6. **Referências.** **ESTUDAR** (nenhuma fonte cita jogo para salvar e carregar).

7. **No motor/tela hoje.**
   - ◐ R17.3 funciona; ficou sem botão, e o menu no brasão (R17.23) deu a casa. [requisitos.md:428] [requisitos.md:421]
   - ✅ Salva sozinho e tem o menu no brasão. [mecanicas.md:111]

8. **Em aberto.** Partida salva antiga quando o formato muda: hoje se perde ou se remenda no código. [mecanicas.md:112-113]

---

## IX.7 Ícones e direção de arte (só o que define a tela)

1. **O que é.** A identidade visual do jogo: o jogador está sentado no gabinete máximo do Estado, não navegando numa página da web. [direcao-de-arte.md:10]

2. **O que o jogador faz e sente.**
   - Sente objetos físicos reais: pastas de arquivo pardo, documentos de papel pesado, fotos 3x4 presas, placas de ferro e latão. [direcao-de-arte.md:22-26]
   - Sente som de coisas materiais: baque de carimbo, estalo metálico, papel deslizando, clique de telex. [direcao-de-arte.md:41-45]

3. **Peças.**
   - **Quatro pilares (Art Bible):** fisicalidade e peso (a mesa do poder); brutalismo institucional universal; analógico imperfeito (datilografia, carimbo de borracha com falha, caneta-tinteiro); som como textura. [direcao-de-arte.md:19-45]
   - **Paleta:** papel oficial `#efe4cc` a `#dfd2b5`; tinta datilográfica `#252320`; ferro e aço `#1c1e21` a `#2c2f33`; latão e âmbar `#d4af37` a `#f0a030`; carimbo confidencial `#9e2a2b` (urgência, vetos, crises); carimbo chancelaria `#1d3557` (homologações, promulgações, quórum); concreto cívico `#303331` a `#1c1e1d`. [direcao-de-arte.md:53-61]
   - **Proibido:** aspecto plastificado de IA; botão retangular simples com borda de 1px; cantos arredondados de app; gradiente neon; simetria digital perfeita (documentos têm micro-rotação de -1º a +3º); Arial, Roboto, Helvetica crus. [direcao-de-arte.md:69-76]
   - **Obrigatório:** tratamento manual das artes geradas por IA (grão, bordas); texturas tangíveis; viewport fixo 16:9. [direcao-de-arte.md:78-81]
   - **Telas citadas:** abertura (mesa de fundação), carregamento, Congresso e mesa de despacho (semicírculo com termômetros gravados em placas de votação analógico). [direcao-de-arte.md:87-99]
   - **Ícones das esferas (30):** desenhados à mão em `scripts/icones-leis/esferas.ts`, traço de tinta com mancha clara. [briefing-icones.md:5]
   - **Ícones das leis (512):** um ícone do game-icons.net no selo, com a bolinha da esfera no pé. [briefing-icones.md:6]
   - **Ícones dos índices (147):** um ícone do game-icons.net, sem bolinha. [briefing-icones.md:7]
   - **Crédito obrigatório (CC BY 3.0):** o jogo precisa citar o game-icons.net e seus autores numa tela de créditos. [briefing-icones.md:8]
   - **Gerar ícones:** `npm run icones` gera os SVGs e a folha `docs/arte/folha-de-icones.html`; `npm run icones:buscar -- <palavra>` procura. [briefing-icones.md:12-13]
   - **Imagens de tela:** pasta `public/arte/` (fundos, faixas, cenas); arquivo que falta não quebra, a tela usa um substituto. Sem texto, sem bandeira, marca ou pessoa real reconhecível; espaço calmo para a interface escrever em cima; JPG 2560 × 1440 (fundos e cenas). [artes-de-tela.md:11-26]
   - **Levantamento de 7 estilos (12/nov, agente Sonnet; a decisão é do autor):** vetor chapado, pixel, gravura, xilogravura, aquarela, cartografia antiga, colagem. [estilos-de-arte.md:3] [estilos-de-arte.md:7-67]
   - **Premissa do levantamento:** o mapa tem centenas de bolhas e muito texto pequeno; o estilo precisa de contorno claro, poucas cores por elemento e textura contida. [estilos-de-arte.md:5]
   - **Recomendação do estudo de encaixe (12/nov, ainda não decidida pelo autor):** vetor chapado como sistema, xilogravura como assinatura, cartografia só no fundo do mapa e no carregamento, colagem só na abertura; a Art Bible passa a valer como tom. [estilos-de-arte.md:102]
   - **Fixo, segundo o estudo:** paleta da Art Bible; contorno grosso e uniforme; carimbo xilográfico em toda ação; serifa de máquina em papel e título, sans na interface. [estilos-de-arte.md:104]
   - **Descartados no estudo:** pixel e aquarela. [estilos-de-arte.md:115]

4. **Regras decididas.**
   - **O estilo antigo dos ícones (néon e disco de vidro) saiu em 12/nov;** está no git. [briefing-icones.md:3]
   - **A Art Bible rege qualquer nova maquete, arte de personagem, textura ou componente.** (Sem data no arquivo.) [direcao-de-arte.md:103]
   - **Tela de início no estilo da Art Bible (13/nov).** [requisitos.md:70]
   - **Carimbo é a cara da ação:** o carimbo real tem falha de pressão em um canto, tinta irregular e rotação imperfeita. [direcao-de-arte.md:37]
   - **Nada de Democracy 4 (nome, número, ligação); Victoria 3 só como ideia.** [gdd.md:2200]
   - **Retratos genéricos para pessoas e empresas; nome de moeda, cargo e instituição comum pode usar; o que tem marca ganha nome alternativo parecido.** [gdd.md:2201-2205]
   - **Partidos reais:** entram com nome e cor; logotipo, símbolo e marca não entram (12/nov). [gdd.md:2206-2207]
   - **Texto de tela:** sem Arial/Roboto/Helvetica crus. [direcao-de-arte.md:76]

5. **Ligações.** Cor de cada ministério dá a cor da lei, que clareia o tom pela instituição (13/nov). [requisitos.md:413] A cor do anel do índice diz o nível. [gdd.md:1931] A cor do escudo da instituição diz o rendimento. [gdd.md:427-429] Fios de efeito: verde melhora, vermelho piora. [gdd.md:1929-1930] "Nada é bom ou ruim": cores e textos descrevem, não elogiam nem condenam. [gdd.md:101-103]

6. **Referências.**
   - Suzerain, Papers Please, Frostpunk, Victoria 3, brutalismo cívico. [direcao-de-arte.md:15]
   - game-icons.net para os ícones. [briefing-icones.md:6-8]

7. **No motor/tela hoje.**
   - Ícones: 30 esferas, 512 de leis e 147 de índices (números do briefing de 12/nov). [briefing-icones.md:5-7]
   - ◐ R6.1 retratos genéricos provisórios. [requisitos.md:100]
   - Pasta `public/arte/` marcada como removida no `git status` do início desta sessão (faixas, cenas, fundos, retratos). Não conferi o motivo; não está em nenhuma fonte lida.

8. **Em aberto.**
   - Decisões do autor ainda abertas no estudo de encaixe (12/nov): (1) revogar o briefing futurista dos ícones e refazer cerca de 270 em vetor chapado; (2) Art Bible como tom ou como regra de textura; (3) abertura em colagem ou xilogravura com vetor; (4) retratos em xilogravura ou gravura; (5) uma ou duas tintas; (6) fundo cartográfico com teto de contraste de cerca de 10%. [estilos-de-arte.md:106-113]
   - ⚠ CONFLITO (o estilo visual):
     - Art Bible (sem data): materialidade analógica; mesa de ferro, papel e latão; texturas tangíveis. [direcao-de-arte.md:10-12] [direcao-de-arte.md:80]
     - Briefing de ícones, hoje (12/nov): ícones game-icons.net no selo; o estilo néon saiu. [briefing-icones.md:3-8]
     - Estudo de estilos (12/nov): "há três direções em conflito nos documentos": Art Bible (analógico), briefing futurista dos ícones (néon e vidro) e "Dossiê Tropical" das artes de tela. [estilos-de-arte.md:87]
     - Artes de tela (22/out, "VIGENTE"): pede o estilo "Dossiê Tropical" definido em `PROMPTS.md` (não aberto). [artes-de-tela.md:3] [artes-de-tela.md:25-27]
     - Area-aberta (21-22/out, proposta): medalha holográfica com aro de metal, anel de bússola e selos como carimbos. [area-aberta.md:85-102]
     - Requisitos (13/nov): a tela de início usa "o estilo da Art Bible". [requisitos.md:70]
     - Não escolhi. Pergunta ao autor: o que vale hoje? (o estudo diz que a decisão é dele).
   - ⚠ CONFLITO (artes de tela obsoletas): artes-de-tela.md pede `faixas/` por área (economia, empresas, saúde etc.) e fala de "área aberta", mas as 8 áreas saíram em 13/nov. [artes-de-tela.md:42] [artes-de-tela.md:159-172] [gdd.md:1924]
   - ⚠ CONFLITO (bolha da lei): area-aberta (21-22/out) descreve cor e forma por tipo de lei (dourado, verde, azul, roxo...), selos e arco de bússola; a bolha atual é a do mapa orgânico (13/nov), sem essas formas. Não há fonte dizendo se os selos e formas por tipo voltam. [area-aberta.md:47-81] [gdd.md:1925-1930]
   - Fonte de dado: a bolha da lei traz o selo do ícone do game-icons.net com a bolinha da esfera no pé (briefing 12/nov); como a esfera virou instituição (13/nov), não há fonte dizendo o que a bolinha representa hoje. [briefing-icones.md:6] [memória project_esfera_ministerio]

---

## IX.8 SisGovpedia (dicas em camadas)

1. **O que é.** A enciclopédia do jogo, aberta pelas dicas ao passar o mouse, em camadas: a frase curta, depois o porquê, depois a conta. [gdd.md:2044-2045]

2. **O que o jogador faz e sente.**
   - Passa o mouse sobre um número que ele sente (gosto, preço, salário) e vê de onde veio. [mecanicas.md:54-55]
   - Passa o mouse no nome da lei e lê uma frase de leigo que diz o que muda na vida de alguém, com exemplo. [o-que-e-uma-lei.md:113-114]
   - Passa o mouse no grupo e vê cada parte do gosto com o seu número ("Operários: −6 imposto, +4 salário mínimo, −3 ideologia"). [mecanicas.md:182-183]
   - Passa o mouse em partido indeciso e vê os dois motivos que mais pesam no voto dele. [gdd.md:871-872]
   - Passa o mouse nos juízes e vê a fila ("320 processos · 2 seus"). [gdd.md:470-471]

3. **Peças.**
   - **Camada 1:** a frase curta. **Camada 2:** o porquê. **Camada 3:** a conta. [gdd.md:2044-2045]
   - **Dica do número sentido:** a origem de gosto, preço, salário. [mecanicas.md:54-55]
   - **Dica da lei:** frase de leigo com exemplo. [o-que-e-uma-lei.md:113-114]
   - **Marcas na régua da lei (07/nov):** a régua mostra marcas calculadas pelo motor, sem virar lei nova (ex.: quanto cada aposentado recebe, "compra o mesmo que no ano passado"). [gdd.md:2184-2187]

4. **Regras decididas.**
   - **Ideia registrada em 14/nov** na seção Leis jogáveis do GDD. [gdd.md:2042-2045]
   - **O porquê à vista (14/nov):** todo número que o jogador sente mostra de onde veio ao passar o mouse. [mecanicas.md:54-55]
   - **Texto para leigo, com exemplo do dia a dia, sem jargão.** [memória feedback_texto_para_leigo]
   - **Texto e motor nunca discordam:** a dica sai dos números. [gdd.md:569]
   - **Sem lista escrita à mão de quem gosta de cada lei** (veterano adivinha tudo, vira tarefa, "falta contexto"). [mecanicas.md:184-186]

5. **Ligações.**
   - **Gosto/população:** parte do bolso, ideologia e memória, cada uma com o seu número. [mecanicas.md:176-183]
   - **Economia:** preço e salário com origem. [mecanicas.md:54-55]
   - **Leis:** frase do nome, marcas na régua. [o-que-e-uma-lei.md:113-114] [gdd.md:2184-2187]
   - **Política:** motivos do voto do partido. [gdd.md:871-872]

6. **Referências.** CK3: mostra cada parte do gosto com o seu número ao passar o mouse. [mecanicas.md:180-183] Democracy 4, Tropico e Stellaris aparecem só como exemplo do que evitar (lista à mão), e nada do Democracy 4 entra no projeto. [mecanicas.md:184-186] [gdd.md:2200] Para a enciclopédia em camadas em si (como abre, como se navega entre camadas): **ESTUDAR**.

7. **No motor/tela hoje.** ☐ Falta. A fonte não aponta requisito R para a SisGovpedia. Já existe a frase da lei ao passar o mouse nos juízes (fila) e o motivo do voto do partido no desenho do Congresso (R12), mas não vi código lido por mim. [gdd.md:470-471] [gdd.md:871-872]

8. **Em aberto.**
   - Onde as três camadas moram (balão, painel lateral, janela) e como se navega: nenhuma fonte diz.
   - Quais números têm dica e em que ordem entram.
   - Como mostrar o gosto do bolso sem virar painel. [mecanicas.md:187-188]
   - Se a SisGovpedia ganha requisito R próprio em `requisitos.md`.

---

## Para o revisor

**(a) Todos os ⚠ CONFLITO**
1. **Estrutura do mapa (IX.1):** tres-aneis (30/out: leis em fatias por área no anel interno, índices no anel do meio, grupos fora) contra gdd.md 13/nov (miolo dos poderes, ministros, instituições, leis em pétalas; áreas saem).
2. **Onde abrem as janelas (IX.3):** arquitetura.md (13/nov, "nada as abre") contra requisitos.md R17.23 (13/nov, onde cada uma mora).
3. **Estilo visual (IX.7):** Art Bible (analógico, sem data) contra briefing de ícones (12/nov), estudo de estilos (12/nov, três direções em conflito, decisão aberta), artes de tela (22/out, Dossiê Tropical) e area-aberta (21-22/out, medalha holográfica); requisitos R4.10 usa a Art Bible.
4. **Artes de tela por área (IX.7):** artes-de-tela (22/out, faixas por área) contra a saída das áreas (13/nov).
5. **Bolha da lei (IX.7):** area-aberta (selos, formas por tipo) contra o mapa de 13/nov; e a "bolinha da esfera" do briefing contra a troca de esfera por instituição.
6. Atualização, não conflito: gdd.md:1915-1916 diz que os juízes são "de mentira até o motor tê-lo"; gdd.md:2098, R17.16 e mecanicas.md:941 dizem que já são de verdade desde 14/nov. Usei a mais nova.

**(b) O que ficou ESTUDAR**
- Referência para a forma do mapa (bolhas sobre hierarquia).
- Referência para mesa de papéis e carimbos (o que se copia do Papers, Please).
- Referência para o desenho das janelas (Mercado, Mundo, lista de companhias).
- Referência para ficha de pessoa e perfil de rede social.
- Referência para telas de começo de partida.
- O que entra no arquivo salvo e referência de salvar e carregar.
- Referência e desenho da SisGovpedia em camadas.

**(c) Fontes não lidas ou lidas só em parte**
- `docs/arte/icones-das-leis.md` (citado por briefing-icones e artes-de-tela; não estava na lista).
- `docs/arte/PROMPTS.md` (proibido; o "Dossiê Tropical" está definido só lá).
- `src/tela/mapa/mapa.md` (existe; não estava na lista).
- `docs/jogo/o-que-e-uma-lei.md`: lido só as linhas 105-122.
- `docs/jogo/gdd.md`: lido §4, §17, §18 e trechos de tela de §6, §7, §11, §12, §14, §15, §16 (por linhas). Não li §§ de economia por completo.
- `docs/jogo/mecanicas.md`: lido §1.5, §3.4-3.5, §17, §18 e trechos; sem leitura das outras mecânicas.
- `docs/jogo/requisitos.md`: lido §17 e linhas de R4, R6.1, R12, R15.12, R16.15; não li o resto.
- `docs/jogo/arquitetura.md`: lido só a §6 (Tela) e §8-9.
- Memórias lidas: lei_e_bolha, texto_para_leigo, leis_x_decisoes, esfera_ministerio, publico_alvo, narrativas_no_final (pelo índice e por grep); as de "como trabalhar" não entraram.
- Arquivos da pasta `src/tela/` foram conferidos só por listagem de nomes; não li código.
