## Parte 8. Tela

A tela é "em volta" das três grandes mecânicas (Gosto, Economia, Leis). Ela só lê o jogo e chama a partida; não calcula. Legenda do motor e da tela: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`.

---

### 8.1 Mapa

**O que é.** O mapa é a tela onde o jogador propõe leis e vê o país como está: bolhas soltas, puxadas por uma hierarquia por baixo. É um mapa orgânico, organizado só pela hierarquia (13/nov). As 8 áreas antigas saem (13/nov), e com elas saem o desenho em três anéis por área (30/out), as artes por área e as bolhas por área.

**O jogador**
- Lê o país no mapa: bolhas de leis e índices crescendo e encolhendo, grupos satisfeitos ou não, mídias, países, manchetes.
- Decisão de governo é uma bolha de lei no mapa, nunca um painel de gestão. Telas de leitura são aceitas; a decisão fica na lei.
- Lei assinada aparece e muda no mapa como bolha.
- Pronto quando (30/out): passando o mouse numa lei dá para seguir lei, índice e grupo sem procurar, e nenhuma bolha nem rótulo se sobrepõe.

**Peças.** Do centro para fora:
- **Miolo, os Três Poderes em camadas.** O Executivo é a trindade do partido (presidente do partido, presidente eleito e vice, na cor do partido, sigla no meio). Os juízes ficam em volta dela, e são juízes de verdade por tribunal (14/nov). O Congresso é um anel de cadeiras por fora, Câmara em cima e Senado embaixo, voltadas para dentro.
- **Anel de ministros**, com rosto, cada um com uma fatia pelo que cuida. Sob cada um, as **instituições** (escudo). Das instituições saem as **leis**, em pétalas para fora.
- **Índices** presos ao ministro responsável; **grupos** num anel de fora; **potências** mais longe.
- **Escudo da instituição:** frase curta ("12 na fila · 2 na sua mesa") e cor do rendimento (verde rende, amarelo falta verba, vermelho sobra e vira corrupção).
- **Leis não promulgadas** ficam fora do mapa, num botão no canto, com a folha para promulgar.
- **Prioridade visual:** Ministro > Instituição > Índice > Lei. Ministros e instituições sempre com nome e destaque; a lei aparece pequena e recuada.
- **Visões** (filtros "Ligações", "Nível", "Dinheiro", "Popularidade"): pesam as bolhas dentro do degrau de cada uma, sem passar para o de cima.
- **Fios:** hierarquia em ouro; efeito verde (melhora) e vermelho (piora), que só correm com a bolha em foco. Bolha sem ligação nenhuma tem anel tracejado.
- **Alerta do índice:** a cor do anel diz o nível (crítico a bom); a seta diz se subiu ou desceu.
- **Barra do topo:** caixa, dívida, PIB, apoio, eleição e passar o turno.
- **Navegação:** busca, enquadrar, miniatura, pinça, roda, setas e teclado.
- **Painel Atrapalham / Ajudam** de ministro, instituição e índice.
- **Trocar ministro pelo mapa:** o painel do ministério clicado traz a troca e o preço dela.
- **O que a bolha escreve em cada setor** (a bolha mostra, o painel não manda): Construção civil abre as duas filas de obras; o cartão da obra diz o motivo do atraso e acende as bolhas das leis que resolvem; Cultura mostra "12 na fila · 2 na sua mesa · 9 bens em risco"; Defesa civil mostra selo verde, amarelo ou vermelho, o Preparo e os últimos 3 desastres; lei de verba mostra o cadeado do gasto travado; compra de cotas mostra ritmo, custo e se a meta será batida; a bolha da lei mostra o placar previsto do Congresso.
- **Mapa elétrico (não é mapa político):** a tela mostra a rede de energia, com os estados ligados por linhas, verde quando sobra e vermelho quando falta.
- **Tela do Congresso:** sem painel, tudo no mapa: anel de cadeiras, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha do quórum, "até aqui passa" na régua.
- **Grupo que pulsa vermelho** no mapa quando a raiva sobe, e sai manchete.

**Regras**
- Mapa orgânico, hierarquia por baixo (13/nov).
- As 8 áreas antigas saem; o mapa se organiza só pela hierarquia (13/nov). A "bolinha da esfera" vira a instituição (13/nov).
- Prioridade visual e filtros (13/nov).
- Só as leis promulgadas ficam no mapa (13/nov).
- Seta de tendência (13/nov): compara com 8 meses atrás (4 turnos) e aparece a partir de 2 pontos de saúde, porque o índice anda devagar e um turno só não mostrava nada.
- Índice preso ao ministro (13/nov): ao que leva a maior parte das leis ligadas a ele.
- Visível e invisível (07/nov): o visível aparece na tela; o invisível só se sente pelo que acontece (greve, surto, notícia).
- Congresso como anel de cadeiras, uma por deputado na cor do partido (11/nov).
- Linhas só no foco (30/out): sem foco, nenhuma ligação aparece. Com o mouse numa lei acende lei, índices, grupos; num índice, as leis que o mexem e os grupos; num grupo, os índices dele. Bate com a regra de 13/nov dos fios que só correm com a bolha em foco.
- Nível de detalhe pelo zoom (30/out; só consta nesta fonte, nenhuma fonte nova diz o contrário): de longe, ponto colorido; de perto, ficha com nome.
- Mapa em tela, direção (30/out): funções de posição puras e testadas; o motor não lê posição.
- Desempenho: fios no canvas, câmera no `viewBox`, cerca de 1 ms de JS por quadro parado; a tecla F mede os quadros.

**Ligações**
- **Gosto:** grupos no anel de fora; grupo pulsa vermelho quando a raiva sobe; a ficha do grupo mostra uma seta para onde ele vai na bússola e qual mídia o empurra.
- **Economia:** índices presos aos ministros; cadeado nas bolhas de lei de verba; mapa elétrico; filas de obras.
- **Leis:** só as promulgadas ficam no mapa, em pétalas das instituições.
- **Política:** trindade e Congresso no miolo; placar previsto na bolha da lei.
- **Judiciário:** juízes no miolo coloridos pelo lado; passar o mouse mostra a fila ("320 processos · 2 seus"); Justiça e prisões é um escudo sob o ministro.

**Referências.** O estilo da tela cita Victoria 3, Suzerain, Papers Please e Frostpunk só como referência estética. Para o mapa em si (bolhas sobre hierarquia): **ESTUDAR**.

**No motor hoje**
- ✅ R17.1 mapa orgânico.
- ✅ R17.12 mapa por ministério e instituição, sem as 8 áreas.
- ◐ R17.16 Três Poderes no miolo; juízes de verdade por tribunal desde 14/nov; em aberto se cada instituição e lei responde a um poder.
- ✅ R17.17 prioridade visual e visões; Popularidade sem dado, porque o motor não calcula popularidade por lei.
- ✅ R17.18 alerta do índice.
- ✅ R17.19 leis promulgadas.
- ✅ R17.20 Atrapalham / Ajudam.
- ✅ R17.21 barra do topo.
- ✅ R17.22 navegação.
- ✅ R17.24 trocar ministro pelo mapa.
- ✅ Mapa 18.1: miolo com trindade, STF e TSE, Congresso; índices do país num anel por fora (14/nov).
- Código: `src/tela/mapa/` (organico.ts com `d3-force`, BolhaDoMapa, MapaOrganico, fundo em canvas).
- ☐ Tirar do código o campo `area` dos índices, que ainda serve para achar o ministro quando nenhuma lei liga neles.

**Em aberto**
- Se cada instituição e cada lei responde a um dos poderes.
- Como cabem no mapa, sem virar painel: lista de companhias, tela do Mundo e mapa elétrico.
- A lei de Tipos (Lei com prazo, Ato, Posição por país, Operação) precisa de um jeito de aparecer: bolha com relógio, botão, menu do país, lista de companhias (R7.16 ◐: Lei com prazo e Ato feitos; Posição por país e Operação faltam).

---

### 8.2 Mesa (assinar e carimbar)

**O que é.** A mesa é onde chegam os papéis que pedem o presidente: o que os outros põem na frente do jogador.

**O jogador**
- Despacha a pilha de papéis do turno, um a um, com carimbo. Há a mesa do presidente (governo) e a mesa do partido.
- Despachar a mesa é o passo 3 do turno: assina, veta, recusa, encaminha ou deixa na pilha.
- **O Congresso usa a mesa como arma:** a oposição com votos aprova leis em lote, longe da bússola do jogador. Ele veta uma a uma (cada veto irrita quem aprovou e vira manchete) ou deixa passar o que não dá tempo de ler.
- Papel novo importante abre a mesa sozinho e o botão pulsa (vaga de juiz).
- Papel duvidoso chega disfarçado mas visível: o texto parece normal e traz pistas (preço acima do comum, intermediário, pressa, "apoio à campanha"). Só a música e o som mudam.
- O papel de calamidade "tem povo": o que houve; quem sofre, com nome e voz; o que fazer, com as opções na primeira tela. O mesmo texto sai como notícia.

**Peças**
- **Carimbos:** Assinar, Vetar (só lei), Recusar, Encaminhar ao ministro, ou deixar na pilha.
- **Papéis do presidente:** lei aprovada pelo Congresso; situações (enchente, greve, empresa quebrando, acordo de país); pedidos (aliado, ministro, governador).
- **Papéis do partido:** doador, político que quer se filiar, deputado que votou contra (expulsar ou perdoar), aliado propõe coligação.
- **Famílias de papel** (sem lista papel por papel; o conteúdo sai dos números do momento): Leis, Crises, Pedidos, Ofertas, Instituições, Partido, Duvidosos.
- **Papéis novos do Congresso:** emenda, partido ameaça sair, promessa com prazo, veto derrubado, CPI aberta, aviso do presidente da casa.
- **Aviso:** só informa e some no turno seguinte (lei aprovada, decreto, veto derrubado, veto mantido).
- **Veto com observação:** o presidente veta e diz o valor que assinaria. O Congresso escolhe: derrubar o veto (quórum da aba Derrubar veto), aceitar a observação (maioria simples, sem voltar à mesa) ou nada (a lei cai). Em lei com abas, a observação pode ser só numa parte.
- **Encaminhar ao ministro** é conforto, não obrigação: o ministro decide pela ficha. Competente acerta mais, desleal decide a favor dele, desonesto assina o que rende propina.
- **Papéis duvidosos** (porta da corrupção): ganho é dinheiro de campanha, voto do aliado e termômetro; custo é a corrupção do órgão e o rastro, que pode ser descoberto a cada turno (regra da mentira descoberta). Recusar irrita quem pediu; denunciar sobe a aprovação e faz inimigo. O dinheiro vai ao bolso de alguém e deixa rastro (14/nov).
- **Arte da mesa:** pilha física de papéis com carimbos *Sancionar*, *Vetar com Observação*, *Encaminhar*.

**Regras**
- Silêncio: lei ignorada até o prazo vira lei sozinha ou cai, conforme a regra do país (sanção tácita ou veto tácito).
- Sem limite de papéis (11/nov): o freio é do mundo; cada papel tem prazo e ignorar tem consequência.
- Prazos (11/nov, de partida, calibrar no fim): lei aprovada e emenda 1 turno; situação urgente 1 turno (piora, vira crise e manchete); situação calma 3 turnos; pedido de aliado 2 turnos; partido ameaça sair 1 turno; promessa até 4 turnos; papel do partido 2 turnos.
- Famílias sem roteiro (11/nov): todo papel nasce do estado do país e das fichas (princípios 8 e 12).
- Veto com observação (11/nov).
- Papéis duvidosos (11/nov).
- Ignorar tem consequência, conforme o papel: lei passa, situação piora, aliado ignorado se afasta, doador vai para outro partido.
- A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete.
- Papel não tem texto guardado: a tela escreve o conteúdo a partir da lei e do valor (R17.7). A mesa é refeita no fim de cada turno.
- Pedido do jogador: `{ tipo: "carimbar", papel, carimbo: "assinar" | "vetar", observacao? }`; papel que não está na mesa ou que é só aviso dá erro.
- Fatos: o carimbo vira `papel-assinado` ou `papel-vetado`; ignorar vira `papel-ignorado`.
- O veto vale para toda lei (regra do GDD; o código hoje só vê a lei emendada).

**Ligações**
- **Gosto:** quem pediu fica chateado ao recusar; denunciar sobe a aprovação; aliado ignorado se afasta; manchete por veto popular.
- **Economia:** situação vira gasto, lei proposta ou efeito direto ao assinar; crise de enchente ou apagão sai dos dados do país.
- **Leis:** assinar vira lei; vetar devolve ao Congresso.
- **Política:** instituição manda caso disputado e vistoria; partido manda doador e filiação; governadores pedem obra.
- **Corrupção:** papel duvidoso deixa rastro, que pode virar escândalo, CPI e fato do impeachment.

**Referências.** *Papers, Please* é referência estética do jogo; não há fonte dizendo o que se copia dele na mesa: **ESTUDAR**. Sobre pilha de papéis e carimbo como jogo (ritmo, quantos por turno, como o jogador sente): **ESTUDAR**.

**No motor hoje**
- ◐ R17.6 carimbos: feitos assinar e vetar com observação na janela Mesa; faltam recusar, encaminhar e pilha.
- ◐ R17.7 famílias de papel: só a família Leis (e a vaga de juiz). Faltam crises, pedidos, ofertas, instituições, partido.
- ◐ R17.13 prazos: papel de lei vale 1 turno; falta crise que piora e aliado que se afasta.
- ☐ R17.14 papéis duvidosos com rastro.
- ☐ R17.8 encaminhar ao ministro.
- ☐ R17.9 a mídia lê a mesa.
- ☐ R17.10 mesa do partido.
- ✅ Papel importante abre a mesa sozinho e o botão pulsa (14/nov).
- Tela: `MesaDePapeis.tsx`; o botão Mesa fica ao lado de Passar o turno.

**Em aberto**
- Situações (crises): saem dos dados; duas ou três respostas com ganho e custo. A pensar: como cada setor desenha os seus papéis.
- Como os pedidos de governadores entram na mesa (R6.23 ☐).
- Os prazos são "de partida, calibrar no fim".

---

### 8.3 Janelas (Mercado, Governo, Programas, Eleição, Mesa e outras)

**O que é.** Telas por cima do mapa que o jogador abre para ler ou decidir algo que não cabe numa bolha.

**O jogador**
- Abre pela peça do mapa onde aquilo mora: o clique na trindade abre o Governo, os medidores de apoio e eleição abrem a Eleição, o do PIB abre o Mercado.
- A folha da lei abre no mapa; antes de assinar mostra "a conta que vem".
- A janela da lei mostra o placar previsto da votação.

**Peças** (onde cada janela mora, R17.23, 13/nov)
- **Menu no brasão:** Salvar, Carregar, Recomeçar.
- **Governo:** pelo clique na trindade.
- **Eleição:** pelos medidores de apoio e eleição; mostra a Aprovação (satisfação média dos pops, pesada pelo tamanho).
- **Mercado:** pelo medidor do PIB.
- **Mesa:** botão ao lado de Passar o turno.
- **Programas:** botão ao lado de Leis não promulgadas. Antes de uma lei desfazer um programa, a tela avisa.
- **Pregão** (minigame da bolsa; protótipo sem motor) fica escondido.
- **Tela do Mundo:** ranking por PIB com a relação de cada país com você (inimigo, rival, neutro, amigo, aliado); clicar num país abre a ficha (dados, relação, o que está em vigor: tratados, sanções, bases, ajuda) e as formas de se aproximar ou se afastar.
- **Lista de companhias** (operações das estatais como papéis na mesa).
- **Menu do país e da companhia:** o que aparece ao clicar num país ou numa companhia é decisão do presidente (Ato ou Operação), não lei.
- **Telas dos Programas:** bolha do programa no mapa, com as leis que faltam.

**Regras**
- Onde moram as janelas (13/nov): a lista acima (R17.23). A frase antiga "nada as abre" está superada.
- Decisão do presidente aparece ao clicar num país ou companhia (08/nov).
- Lei x decisão (08/nov): isso evita o mapa encher de bolhas e a decisão do dia a dia se perder.
- Sem painel de gestão: o jogo tem janelas de leitura e escolha, mas decisão de governo continua sendo bolha de lei.

**Ligações**
- **Gosto:** a Eleição mostra a Aprovação.
- **Economia:** Mercado e Pregão (preço, lucro, bolsa).
- **Leis:** Programas, folha da lei, não promulgadas.
- **Política:** Governo (régua e caixas de ministérios), Eleição, Mesa.

**Referências.** Para o desenho de cada janela (Mercado, Mundo, lista de companhias): **ESTUDAR**. O Victoria 3 serve de referência do mercado, não da tela.

**No motor hoje**
- ✅ R17.23 as janelas já têm casa (conferir na tela).
- Código: `Governo.tsx`, `Eleicao.tsx`, `Mercado.tsx`, `MesaDePapeis.tsx`, `Pregao.tsx`, `NaoPromulgadas.tsx`, `DocumentoLei.tsx`.
- ◐ R16.15 Pregão: protótipo na tela.
- ☐ R15.12 Tela do Mundo: ranking com a relação e a ficha do país.

**Em aberto**
- Como lista de companhias, tela do Mundo e mapa elétrico cabem sem virar painel.

---

### 8.4 O comum às duas telas

**O que é.** O que mapa e mesa dividem: fichas das pessoas, momentos curtos do partido, manchetes, votação, passar o turno, causa e efeito.

**O jogador**
- Abre a ficha de uma pessoa por cima do mapa.
- Vê as escolhas do partido (ministério, chapa, coligação, campanha) como telas curtas, não painéis.
- Lê as manchetes do turno e passa o turno.
- Entende o porquê: "o corte na saúde de dois anos atrás virou fila agora"; nunca parece azar.
- Vê o país mudar sem placar: PIB, empresas, empregos, riqueza das pessoas.
- Ao propor uma lei vê antes quem ganha e quem perde.
- A lei diz "efeito em N turnos", para o jogador planejar e não achar que ela falhou. O atraso zero significa que o efeito vem no turno seguinte.

**Peças**
- **Fichas** de pessoas (presidente, vice, ministros, líderes): retrato genérico, atributos, posição na bússola.
- **Atributos do ministro:** competência, habilidade política, carisma, honestidade, lealdade, bússola e origem.
- **Ficha só de leitura da instituição:** ministro, verba × necessidade numa barra, corrupção interna, fila e leis que mexem nela.
- **Rede da pessoa:** perfil de rede social gerado da ficha (o que posta, onde vai, o que diz sobre os temas do país), sem rótulo de esquerda ou direita; "Informações pessoais descobertas" cresce com a inteligência; botão Espiar fica num registro que pode vazar.
- **Momentos do partido:** montar ministério, chapa, coligação, campanha.
- **Causa e efeito (12/nov):** a bolha do índice mostra "o que empurra" (leis e índices que mexem nele, com seta, força e turnos até chegar); a bolha da lei, antes de assinar, mostra "a conta que vem" (o que cada índice deve fazer em 1 e em 4 anos); o gráfico do índice marca o turno em que cada lei foi assinada.
- **Promessa de campanha** fica na tela até a eleição.
- **Dinheiro na moeda do país.**
- **Manchetes do turno** e Resultado do turno (fatos como manchete).
- **Votação, passar o turno, resultado do turno.**

**Regras**
- Texto da tela sai dos números da lei: texto e motor nunca discordam.
- Texto para leigo: lei e opção com exemplo do dia a dia, sem jargão.
- Sem cortar a escolha: texto simples, mas sem tirar a régua numérica; o jogador é criativo, testa extremos e gosta de números, mesmo os que não aparecem.
- Nome da lei: palavras de todo dia, "o que + de quem/sobre o quê"; sigla e nome técnico nunca no nome; o nome real do país pode aparecer embaixo, menor.
- Nada diz "esta pessoa é de tal lado": o jogador deduz.
- Retratos genéricos para pessoas e empresas (autor, 08/nov); nenhuma pessoa, empresa ou direito autoral real.
- A tela não calcula: só lê a visão da partida e manda pedidos.
- A narrativa vem depois dos dados; a tela escreve a partir dos números.
- Nada neutro (princípio 7): toda escolha mexe em algo visível.

**Ligações**
- **Gosto:** a ficha do grupo mostra a seta de bússola e a mídia que empurra. Os números de gosto aparecem divididos por parte ao passar o mouse (ver 8.8).
- **Economia:** "conta que vem" da lei, "o que empurra" do índice.
- **Leis:** prévia de quem ganha e perde antes de propor; programa avisa antes de desfazer.
- **Política:** fichas de pessoas, placar previsto, termômetro dos partidos; ao passar o dedo, o partido mostra os dois motivos que mais pesam no voto dele.

**Referências.** CK3 mostra cada parte do gosto com o seu número ao passar o mouse. Para fichas de pessoas por cima de mapa e perfil de rede social: **ESTUDAR**.

**No motor hoje**
- ✅ R17.2 votação, passar o turno, resultado do turno.
- ◐ R17.4 fichas por cima do mapa: retrato feito; atributos faltam.
- ◐ R6.1 retratos genéricos (feitos, provisórios: o autor não gostou); ficha com atributos falta.
- ◐ R17.5 prévia de quem ganha e perde antes de propor.
- ◐ R17.15 causa e efeito: feitos os fios de efeito e o painel Atrapalham / Ajudam; faltam a conta que vem e o gráfico.
- ☐ R17.11 momentos do partido como telas curtas (chapa, coligação, campanha). O começo da partida já tem telas de chapa, governo e ministros (ver 8.5).
- A seta de tendência já existe na tela; o voto ainda não a usa.

**Em aberto**
- Retratos: o autor não gostou dos genéricos.
- Opinião: como o jogador vê a opinião de cada ator sem virar painel.
- Como mostrar o bolso de um pop virando gosto do grupo sem virar painel.
- A mídia age em cima dos fatos que já existem (é lente, não fonte nova). Ela lê e escreve na mesa (R17.9 ☐); o jornal só mostra manchetes, nenhuma notícia mexe em grupo, voto ou aprovação (13/nov, corrigir quando fizermos mídia). ESTUDAR como a mídia mexe em cada uma das 3 mecânicas.

---

### 8.5 Tela inicial e começo da partida em passos

**O que é.** A sequência de telas curtas antes do mandato: país, partido, chapa, governo, ministros, iniciar. O menu de início é em telas curtas; o turno mostra os fatos como manchetes.

**O jogador**
- Escolhe o país (reais ou declarados, cada um com economia, Congresso, partidos, mídias e grupos próprios).
- Cria o partido: nome e sigla. Não escolhe lado, posição nem bússola.
- Monta a chapa: três vagas (presidente do partido, candidato, vice). Clicar numa vaga abre a lista de pessoas de todos os partidos (assim nascem as coligações); clicar numa pessoa abre o perfil dela. A chapa já venceu.
- Monta o governo: primeiro o tamanho, numa régua (Enxuto, Clássico, Do país, Inchado); se quiser, arrasta instituições entre os ministérios.
- Escolhe ministros: o jogo sorteia pela chapa e cada cadeira pode ser trocada por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista.
- Inicia o jogo e governa.
- Entra com uma história: "no meio de uma polarização, você surge como a salvação do país". Partido novo, poucas cadeiras, presidente popular, Aprovação alta.
- Descobre o lado do próprio governo pelas consequências, não por um rótulo.

**Peças**
- **País:** `EtapaPais`. **Partido:** `EtapaPartido`. **Chapa:** `EtapaChapa` e `ListaDePessoas`. **Governo:** `EtapaGoverno`. **Ministros:** `EtapaMinisterios`. **Iniciar:** `EtapaIniciar`.
- **Governo:** régua de tamanhos; "Ajustar caixas" abre a mesa onde o jogador arrasta as instituições (escudos) entre os ministérios, cria e tira ministério; a bandeja é a caixa da sobra. Mostra só efeitos que o motor tem: ministro mais carregado, o que fica sem ministério próprio, cadeiras sem pasta.
- **Ministros:** uma cadeira por caixa, com retrato e quanto o ministro rende ali.
- **Histórico do país:** cada país declara dados históricos; o resto os geradores criam.

**Regras**
- Partido nasce sem lado (12/nov); o lado sai da chapa: média da bússola da chapa, 5 grupos que ele defende (R4.8).
- A sigla vira o id e não pode repetir a de outro partido (12/nov).
- O país começa como está; o partido que governava vira oposição (12/nov). No começo, o jogador pode pôr o antigo governo na coligação.
- Governo em régua e caixas (13/nov).
- Estilo da tela de início: o da Art Bible (13/nov).
- Tela de abertura (Art Bible): a mesa do governante vista de cima; navegação física (fichas, dossiês com fotos presas, carimbo SISGOV); botão principal em placa de ferro fundido rebitada com tipografia em latão.
- Tela de carregamento (Art Bible): vista monumental da capital; indicador de progresso mecânico (bússola de Estado ou fita de telex); doutrinas de governo datilografadas.

**Ligações**
- **Gosto:** a chapa define a base de grupos e a bússola do partido.
- **Economia:** o país traz economia própria; a Aprovação começa alta.
- **Leis:** o país declara as leis em vigor.
- **Política:** a chapa dá coligação; o antigo governo vai à oposição ou à coligação; ministros dão cadeiras do Congresso.

**Referências.** Para telas de começo de partida em jogo de estratégia política: **ESTUDAR**. A Art Bible cita Suzerain e Papers Please como estética.

**No motor hoje**
- ✅ R4.5 criar partido.
- ✅ R4.6 chapa entre pessoas de todos os partidos.
- ✅ R4.8 lado sai da chapa.
- ◐ R4.9 partido novo com 6% das cadeiras e antigo governo na oposição ou coligação; falta a Aprovação começar alta.
- ✅ R4.10 tela de início em sequência (13/nov, no estilo da Art Bible).
- Governo: régua e caixas; Ministros: cadeiras e cartas.

**Em aberto**
- A Aprovação começa alta: de quanto e quanto tempo dura a lua de mel.
- A história de entrada aparece como texto, tela ou só nos números.
- Outros países: só o Brasil 2026 existe; o que um país precisa declarar para ser jogável (arquivos obrigatórios).
- Placar final e fim de partida: o que a tela mostra (R4.7 ☐).

---

### 8.6 Salvar e carregar

**O que é.** Guardar a partida e voltar a ela. É caso de uso da partida, não da tela (módulo `salvar.ts`).

**O jogador.** Salva e carrega pelo menu no brasão; a partida salva sozinha a cada turno.

**Peças**
- Menu no brasão: Salvar, Carregar, Recomeçar.
- Salvar sozinho a cada turno.

**Regras**
- O menu no brasão e o salvar sozinho a cada turno valem desde 13/nov (R17.23).

**Ligações.** Guarda o estado de todas as mecânicas. A fonte não detalha o formato: **ESTUDAR** o que entra no arquivo.

**Referências.** **ESTUDAR** (nenhuma fonte cita jogo para salvar e carregar).

**No motor hoje**
- ◐ R17.3 funciona; ficou sem botão, e o menu no brasão (R17.23) deu a casa.
- ✅ Salva sozinho e tem o menu no brasão.

**Em aberto**
- Partida salva antiga quando o formato muda: hoje se perde ou se remenda no código.

---

### 8.7 Ícones e direção de arte (só o que define a tela)

**O que é.** A identidade visual do jogo: o jogador está sentado no gabinete máximo do Estado, não navegando numa página da web. Vale o `docs/arte/direcao-de-arte.md` (a Art Bible). Ela rege qualquer nova maquete, arte de personagem, textura ou componente. As artes de `public/arte/` (fundos, faixas, cenas, retratos) foram apagadas de propósito, e o `artes-de-tela.md` (22/out, "Dossiê Tropical", faixas por área) não vale mais.

**O jogador**
- Sente objetos físicos reais: pastas de arquivo pardo, documentos de papel pesado, fotos 3x4 presas, placas de ferro e latão.
- Sente som de coisas materiais: baque de carimbo, estalo metálico, papel deslizando, clique de telex.

**Peças**
- **Quatro pilares (Art Bible):** fisicalidade e peso (a mesa do poder); brutalismo institucional universal; analógico imperfeito (datilografia, carimbo de borracha com falha, caneta-tinteiro); som como textura.
- **Paleta:** papel oficial `#efe4cc` a `#dfd2b5`; tinta datilográfica `#252320`; ferro e aço `#1c1e21` a `#2c2f33`; latão e âmbar `#d4af37` a `#f0a030`; carimbo confidencial `#9e2a2b` (urgência, vetos, crises); carimbo chancelaria `#1d3557` (homologações, promulgações, quórum); concreto cívico `#303331` a `#1c1e1d`.
- **Proibido:** aspecto plastificado de IA; botão retangular simples com borda de 1px; cantos arredondados de app; gradiente neon; simetria digital perfeita (documentos têm micro-rotação de -1º a +3º); Arial, Roboto, Helvetica crus.
- **Obrigatório:** tratamento manual das artes geradas por IA (grão, bordas); texturas tangíveis; viewport fixo 16:9.
- **Telas citadas:** abertura (mesa de fundação), carregamento, Congresso e mesa de despacho (semicírculo com termômetros gravados em placas de votação analógico).
- **Ícones das esferas (30):** desenhados à mão em `scripts/icones-leis/esferas.ts`, traço de tinta com mancha clara (briefing de 12/nov).
- **Ícones das leis (512):** um ícone do game-icons.net no selo. A bolinha no pé do selo, que era da esfera, passa a ser da instituição (13/nov).
- **Ícones dos índices (147):** um ícone do game-icons.net, sem bolinha.
- **Crédito obrigatório (CC BY 3.0):** o jogo precisa citar o game-icons.net e seus autores numa tela de créditos.
- **Gerar ícones:** `npm run icones` gera os SVGs e a folha `docs/arte/folha-de-icones.html`; `npm run icones:buscar -- <palavra>` procura.
- **Imagens de tela (22/out, só as regras gerais):** sem texto, sem bandeira, marca ou pessoa real reconhecível; espaço calmo para a interface escrever em cima; JPG 2560 × 1440 (fundos e cenas); arquivo que falta não quebra, a tela usa um substituto.
- **Levantamento de 7 estilos (12/nov, agente Sonnet; a decisão é do autor):** vetor chapado, pixel, gravura, xilogravura, aquarela, cartografia antiga, colagem. Premissa: o mapa tem centenas de bolhas e muito texto pequeno; o estilo precisa de contorno claro, poucas cores por elemento e textura contida.
- **Recomendação do estudo de encaixe (12/nov):** vetor chapado como sistema, xilogravura como assinatura, cartografia só no fundo do mapa e no carregamento, colagem só na abertura; a Art Bible passa a valer como tom. Fixo, segundo o estudo: paleta da Art Bible; contorno grosso e uniforme; carimbo xilográfico em toda ação; serifa de máquina em papel e título, sans na interface. Descartados no estudo: pixel e aquarela.

**Regras**
- O estilo antigo dos ícones (néon e disco de vidro) saiu em 12/nov; está no git.
- A Art Bible rege qualquer nova maquete, arte de personagem, textura ou componente (decisão do autor, 14/nov: vale o `direcao-de-arte.md`).
- Tela de início no estilo da Art Bible (13/nov).
- Carimbo é a cara da ação: o carimbo real tem falha de pressão em um canto, tinta irregular e rotação imperfeita.
- Nada de Democracy 4 (nome, número, ligação); Victoria 3 só como ideia.
- Retratos genéricos para pessoas e empresas; nome de moeda, cargo e instituição comum pode usar; o que tem marca ganha nome alternativo parecido.
- Partidos reais: entram com nome e cor; logotipo, símbolo e marca não entram (12/nov).
- Texto de tela: sem Arial/Roboto/Helvetica crus.
- A cor de cada ministério dá a cor da lei, que clareia o tom pela instituição (13/nov). Por isso a cor por tipo de lei da proposta de 21-22/out (dourado, verde, azul, roxo) saiu, e também a medalha holográfica com aro de metal.

**Ligações.** A cor do anel do índice diz o nível. A cor do escudo da instituição diz o rendimento. Fios de efeito: verde melhora, vermelho piora. "Nada é bom ou ruim": cores e textos descrevem, não elogiam nem condenam.

**Referências.** Suzerain, Papers Please, Frostpunk, Victoria 3, brutalismo cívico. game-icons.net para os ícones.

**No motor hoje**
- Ícones: 30 esferas, 512 de leis e 147 de índices (números do briefing de 12/nov).
- ◐ R6.1 retratos genéricos provisórios.
- As artes de `public/arte/` não existem mais (apagadas de propósito); a tela usa o substituto. As novas seguem a Art Bible.

**Em aberto**
- Decisões do estudo de encaixe (12/nov) ainda sem resposta, agora sob a Art Bible: (1) refazer cerca de 270 ícones em vetor chapado; (2) Art Bible como tom ou como regra de textura; (3) abertura em colagem ou xilogravura com vetor; (4) retratos em xilogravura ou gravura; (5) uma ou duas tintas; (6) fundo cartográfico com teto de contraste de cerca de 10%.
- Selos e arco de bússola na bolha da lei (proposta de 21-22/out): nenhuma fonte nova diz se voltam; a bolha atual é a do mapa orgânico.
- Os 30 ícones das esferas foram feitos antes de a esfera virar instituição: o que a bolinha e esses ícones representam agora.

---

### 8.8 SisGovpedia (dicas em camadas)

**O que é.** A enciclopédia do jogo, aberta pelas dicas ao passar o mouse, em camadas: a frase curta, depois o porquê, depois a conta. Ideia registrada em 14/nov na seção Leis jogáveis do GDD.

**O jogador**
- Passa o mouse sobre um número que ele sente (gosto, preço, salário) e vê de onde veio.
- Passa o mouse no nome da lei e lê uma frase de leigo que diz o que muda na vida de alguém, com exemplo.
- Passa o mouse no grupo e vê cada parte do gosto com o seu número ("Operários: −6 imposto, +4 salário mínimo, −3 ideologia").
- Passa o mouse em partido indeciso e vê os dois motivos que mais pesam no voto dele.
- Passa o mouse nos juízes e vê a fila ("320 processos · 2 seus").

**Peças**
- **Camada 1:** a frase curta. **Camada 2:** o porquê. **Camada 3:** a conta.
- **Dica do número sentido:** a origem de gosto, preço, salário.
- **Dica da lei:** frase de leigo com exemplo.
- **Marcas na régua da lei (07/nov):** a régua mostra marcas calculadas pelo motor, sem virar lei nova (ex.: quanto cada aposentado recebe, "compra o mesmo que no ano passado").

**Regras**
- O porquê à vista (14/nov): todo número que o jogador sente mostra de onde veio ao passar o mouse.
- Texto para leigo, com exemplo do dia a dia, sem jargão.
- Texto e motor nunca discordam: a dica sai dos números.
- Sem lista escrita à mão de quem gosta de cada lei (veterano adivinha tudo, vira tarefa, "falta contexto").

**Ligações**
- **Gosto:** parte do bolso, ideologia e memória, cada uma com o seu número (14/nov: Gosto = bolso + bússola + memória).
- **Economia:** preço e salário com origem.
- **Leis:** frase do nome, marcas na régua.
- **Política:** motivos do voto do partido.

**Referências.** CK3 mostra cada parte do gosto com o seu número ao passar o mouse. Democracy 4, Tropico e Stellaris aparecem só como exemplo do que evitar (lista à mão), e nada do Democracy 4 entra no projeto. Para a enciclopédia em camadas em si (como abre, como se navega entre camadas): **ESTUDAR**.

**No motor hoje.** ☐ Falta. Nenhum requisito R cobre a SisGovpedia. Já existem a fila ao passar o mouse nos juízes (desenho) e o motivo do voto do partido no desenho do Congresso (R12).

**Em aberto**
- Onde as três camadas moram (balão, painel lateral, janela) e como se navega: nenhuma fonte diz.
- Quais números têm dica e em que ordem entram.
- Como mostrar o gosto do bolso sem virar painel.
- Se a SisGovpedia ganha requisito R próprio em `requisitos.md`.

<!-- revisor: TIREI por superado: desenho em três anéis por área (tres-aneis, 30/out: anel 1 de leis por área; "de longe se leem os anéis" do critério de pronto); artes-de-tela.md (22/out, Dossiê Tropical, faixas por área, VIGENTE) por C10 e pela saída das áreas; medalha holográfica e cor por tipo de lei de area-aberta (21-22/out) por conflitar com a Art Bible e com a cor pelo ministério (13/nov); conflito das janelas (arquitetura "nada as abre") por R17.23; "juízes de mentira" por 14/nov; briefing futurista néon dos ícones (já saiu 12/nov). Conflito de estilo visual resolvido por C10 (vale direcao-de-arte.md). MANTIVE com data: linhas só no foco e zoom por nível de detalhe (30/out, nenhuma fonte nova contradiz); regras gerais de imagem de tela (22/out). Adicionei de 08-conflitos: veto de toda lei (A), atraso zero (C8), mídia como lente (C3), dinheiro com rastro (B), Gosto = bolso+bússola+memória (B), R7.16 ◐ (A). Não li area-aberta.md nem artes-de-tela.md, só o rascunho. MANDEI PARA EM ABERTO: selos e arco de bússola da bolha da lei (21-22/out); o que a bolinha e os 30 ícones das esferas representam depois que esfera virou instituição; 6 decisões do estudo de encaixe de estilos; campo `area` a tirar do código; "bolinha da esfera" virou da instituição por instrução do pedido (13/nov), sem outra fonte. -->
