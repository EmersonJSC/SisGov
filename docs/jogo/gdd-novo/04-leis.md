# IV. Leis

Rascunho do GDD novo, parte IV. Junta o que já está decidido e espalhado. Nada foi inventado: faltou fonte, vira **ESTUDAR** ou "Em aberto". Conflito entre fontes aparece como **⚠ CONFLITO**, sem escolha. Estado de cada fonte: 14/nov/2026, salvo quando a data vem na frase.

Números de partida, vindos das planilhas em `docs/jogo/gdd-novo/fontes/`: 511 linhas de lei em "gdd - Leis.tsv"; 512 linhas em "gdd - Leis por instituição.tsv"; 34 instituições com lei na coluna Instituição; 4 abas de apoio (degraus 1032 linhas, efeitos 1359 linhas) [contagem de "gdd - Leis.tsv", "gdd - Leis por instituição.tsv", "gdd - Leis - degraus.tsv", "gdd - Leis - efeitos.tsv"]. O plano diz 512 leis, 251 de régua e 261 de degraus [planos/leis.md:13].

---

## IV.1 O que é uma lei (as regras)

1. **O que é.** Uma lei é uma pergunta que o presidente responde e que fica valendo. [o-que-e-uma-lei.md:18]

2. **O que o jogador faz e sente.**
   - O jogador propõe, muda e revoga leis. [gdd.md:521]
   - Toda lei aparece como uma bolha no mapa. Mecânica nova não vira painel de gestão. [memória feedback_lei_e_bolha] [gdd.md:90]
   - O laço vivido: vê um problema, procura as leis que mexem nele, escolhe quanto mover sabendo quem perde, paga no Congresso e nos grupos, espera o atraso, vê o efeito (inclusive o que não queria), e o efeito cria o próximo problema. [o-que-e-uma-lei.md:238-247]
   - Cada lei só precisa servir a esse laço. Se não ajuda em nenhum passo, não é do jogo. [o-que-e-uma-lei.md:247-248]
   - O jogo deve ter centenas de caminhos. O autor recusou um núcleo de 40 leis (08/nov). [memória project_caminhos_sem_nucleo] [gdd.md:674-676]

3. **Peças.** Uma lei tem sete peças: [o-que-e-uma-lei.md:43-50]
   - a pergunta, uma só; se responde duas, são duas leis [o-que-e-uma-lei.md:43];
   - as respostas possíveis (o jeito) [o-que-e-uma-lei.md:44];
   - o dono, que é a instituição que executa [o-que-e-uma-lei.md:45];
   - a entrada no motor (o canal), que é o primeiro número que a lei mexe [o-que-e-uma-lei.md:46-47];
   - quem ganha e quem paga [o-que-e-uma-lei.md:48];
   - o lado, para onde puxa na bússola [o-que-e-uma-lei.md:49];
   - o tempo até o efeito aparecer [o-que-e-uma-lei.md:50].
   - Sem canal ou sem quem ganha e paga, a lei não está pronta. [o-que-e-uma-lei.md:52-53]
   - O molde da lei na planilha: nome e texto, instituição, tipo, forma, quórum (comum, absoluta, constitucional ou mandato), bússola, canal, efeitos, ganho e custo. Uma lei sem canal não entra no jogo. [planos/leis.md:40-54]
   - Duas camadas: essenciais (estrutura do Estado, mudam pouco) e jogabilidade (as políticas). [gdd.md:527-528]
   - Toda lei mora numa das 36 instituições, ou nas regras dos poderes. Instituição não é ministério. [gdd.md:523-526] [memória project_esfera_ministerio]

4. **Regras decididas.**
   - **O que não é lei** (14/nov): processo (vai para Processo), consequência (vira índice), caso a caso (papel na mesa ou evento), opção de menu (Posição por país ou Operação), o que acontece uma vez (Ato), informação (marca na régua de outra lei). [o-que-e-uma-lei.md:28-37]
   - **Princípio 1:** leis são o núcleo do governo; mudar uma lei muda o jogo. [gdd.md:88-89]
   - **Princípio 3:** nenhuma lei é um controle só que faz coisa grande; o tema se divide em leis menores, cada uma com escolha de verdade. [gdd.md:99-100] A regra vem do autor, que cobrou duas vezes (01/nov): "as leis têm que ser jogáveis". [memória feedback_leis_se_dividem]
   - Antes de desenhar a lei, 4 perguntas do autor (03/nov e 04/nov): quanto; em partes ou só no todo; processo ou lei; "um presidente real assinaria e pronto?". [memória feedback_lei_ou_processo] [planos/leis.md:78-79]
   - **Princípio 13:** toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que só mexe na opinião não basta. [gdd.md:131-132]
   - **Princípio 4:** nada é bom ou ruim; toda lei tem ganhadores, perdedores e consequências. [gdd.md:101-103]
   - **Princípio 5:** nada aparece do nada; todo dinheiro do Estado entra por uma lei ou por um bem do Estado e sai por uma lei ou obrigação. [gdd.md:107-112]
   - **Princípio 9:** jogabilidade primeiro, realidade como base; lei inventada vale se for plausível. [gdd.md:119-120]
   - **Princípio 10:** o motor não conhece nome de lei; a lei declara, o motor calcula. [gdd.md:121-124] [gdd.md:554-556]
   - **Nada = não legislada** (14/nov): nenhum degrau "nada, nenhum, sem regra" e nenhuma régua que no mínimo não faz nada. A lei existe quando age; revogar é voltar ao nada. O país declara só a lei que tem de verdade; o resto é o cardápio do jogador. A lei essencial não se revoga e pode ter o degrau "nenhum". [gdd.md:541-546]
   - O país declara as leis que tem. Lei que não faz sentido no país não aparece; lei que não cabe ao presidente fica **inativa** e alguém pode propô-la. [gdd.md:570-572]
   - O texto da tela sai dos números da lei: texto e motor nunca discordam. [gdd.md:569]
   - **Juntar** quando duas leis mexem no mesmo número ou uma é degrau da outra. **Separar** quando os degraus são coisas diferentes, quando a lei tem dois números, ou quando cada estrato ou setor pede o seu valor. [gdd.md:547-551]
   - Régua por estrato ou por setor vira uma lei por estrato ou setor, ligadas pelo "Parte de". [gdd.md:538-539] A planilha tem 55 leis com "Parte de" preenchido. [contagem de "gdd - Leis.tsv"]
   - **Leis e decisões** (08/nov): lei é regra permanente e tem bolha. A decisão do presidente é o que aparece ao clicar num país ou companhia (Ato ou Operação), com custo, tempo e reação, e é limitada pelas leis. [gdd.md:96-98] [gdd.md:635-637] [memória feedback_leis_x_decisoes]
   - **Mercado indireto** (08/nov): não existe lei que dê lucro a um produto. Leis mexem em demanda e custo, e a cadeia espalha. [memória feedback_mercado_indireto]
   - **Resultado emerge** (04/nov): a lei muda só um número. Se é boa ou ruim sai do estado do país, nunca de condição escrita na lei. [memória feedback_resultado_emerge]
   - **Os dois lados legislam:** esquerda e direita têm leis próprias; zerar uma lei de um lado não é política do outro. Ao listar as leis de uma instituição, conferir o equilíbrio dos lados. [gdd.md:677-680] [o-que-e-uma-lei.md:213-215] [memória feedback_lados_equilibrados]
   - **Sem limite de leis por instituição** (07/nov); não se corta um núcleo (08/nov). [gdd.md:674-676]
   - **Sem pontos de ação:** o limite vem do mundo (Congresso cheio) e só atrasa, nunca proíbe (11/nov). [memória feedback_sem_pontos_de_acao]
   - **Jogável não é demorado:** a decisão acontece no turno; nenhuma opção com efeito neutro (02/nov). [memória feedback_jogavel_nao_demorado] [gdd.md:115-116]
   - **Aprovação sem sorteio:** vem do Congresso e dos grupos, nunca de um dado. [gdd.md:2054-2055]
   - **Mudar de ideia custa:** propor e desistir de uma lei não pode ser de graça. [gdd.md:2053]
   - **O Congresso é a trava, não o jogo:** o jogador pode propor qualquer coisa; o exorbitante o Congresso barra. [gdd.md:125-127]
   - **Dinheiro:** a lei diz onde mexe no dinheiro e na vida (quem paga, quem recebe, que preço sobe, que emprego abre). O gosto nasce daí. A bússola continua, com peso menor que o bolso. [mecanicas.md:47-51]
   - A lei é medida pelo país da partida ("2 salários médios do país"), nunca por país real. [gdd.md:2208-2209]

5. **Ligações.**
   - Gosto/população: toda lei chega ao pop; o motor calcula o efeito em cada pop e o gosto nasce daí. [mecanicas.md:47-49] Hoje a satisfação do grupo lê renda, índices cobrados e bússola; só imposto de renda e transferência mexem no bolso; as outras cerca de 480 leis agradam ou irritam só pelo ponto na bússola. [mecanicas.md:56-60]
   - Economia: a lei entra por imposto, verba, transferência, preço, regra ou direito (IV.4). [o-que-e-uma-lei.md:46]
   - Estado: a lei mora numa instituição e age pelo rendimento dela (IV.11). [planos/leis.md:93-98]
   - Política: a bússola da lei define quem gosta; quórum e voto no Congresso decidem se passa. [planos/leis.md:48] [gdd.md:125-127]

6. **Referências.** Victoria 3 (ligação economia, pop e política, a mais elogiada pelos jogadores) [mecanicas.md:42-45]. Victoria 3: sorteio para passar lei irritou; propor e cancelar virou truque [pesquisa-jogadores-14nov.md:28-30]. Frostpunk: "dá para desbloquear tudo, nada renuncia nada" [pesquisa-jogadores-14nov.md:26-27].

7. **No motor hoje.**
   - Feito: duas camadas, régua e degraus (R7.1) [requisitos.md:153]; a lei declara efeito, força, atraso, bússola e base (R7.2) [requisitos.md:154]; validador com arquivo, campo e motivo (R7.3) [requisitos.md:155]; país declara as leis que tem (R7.4) [requisitos.md:156]; texto sai dos números (R7.5) [requisitos.md:157]; 512 leis saíram da planilha (R7.14) [requisitos.md:158].
   - Pela metade: toda lei chega ao pop (R7.12): 120 de 512 chegam por um caminho do motor e 392 esperam a triagem [requisitos.md:163]. Temas em pacotes (R7.6) [requisitos.md:162]. Leis padronizadas por instituição (R7.22): base pronta, faltam as 4 ondas [requisitos.md:165]. Toda lei numa instituição (R7.13) [requisitos.md:164].
   - Pela planilha de hoje: 338 de 511 leis ainda têm canal "espera" (320 delas "triagem"); canais já preenchidos: regra 74, verba 70, imposto 16, direito 9, transferência 4. [contagem de "gdd - Leis.tsv"] ⚠ CONFLITO (números): requisitos diz 120 de 512 chegam por um caminho [requisitos.md:163]; a contagem da planilha dá 173 de 511 fora de "espera". Sem escolha; vale conferir qual é a mais nova.
   - Dados de partida do plano: 100 leis não mexem em nada; 47 leis estão no centro da bússola e nenhum grupo reage a elas; só cerca de 80 têm dinheiro de verdade [planos/leis.md:15-21].

8. **Em aberto.**
   - Como medir a força de um grupo e quanto ela muda a popularidade de uma lei. [gdd.md:2131]
   - O que fazer com as 100 leis que não mexem em nada. [mecanicas.md:423-424]
   - Se cada instituição e cada lei responde a um dos poderes. [gdd.md:2117-2118]
   - Instituições sem jogo (Estados e municípios, Religião, Turismo, Indústria; Funcionalismo tem uma lei) entram quando as leis forem refeitas. [gdd.md:2065-2067]
   - O motor ainda não faz a lei mudar o gosto pelo bolso, só por imposto de renda e transferência. [mecanicas.md:56-60]

---

## IV.2 Tipos de lei

1. **O que é.** O tipo diz quanto tempo a lei vale e como ela aparece: Lei, Lei com prazo, Ato, Posição por país ou Operação. [gdd.md:531-532] [gdd.md:573-578]

2. **O que o jogador faz e sente.**
   - **Lei:** fica valendo, tem bolha. [gdd.md:573]
   - **Lei com prazo:** acaba sozinha e volta a "não legislada"; a bolha tem relógio. Exemplo: Anistia fiscal, uma janela de 1 a 3 turnos. O jogo lembra quantas vezes foi usada. [gdd.md:638-640] [planos/leis.md:102-103]
   - **Ato:** acontece uma vez, como botão ou papel. Exemplos: Graça, suspender a regra fiscal, visita de Estado. Fica como botão na instituição, com custo na hora. [gdd.md:574-575] [planos/leis.md:104-105]
   - **Posição por país:** nível decidido no menu do país, que fica valendo (Sanções, Aliança). [gdd.md:575-576]
   - **Operação:** em etapas, sobre uma companhia, com papéis na mesa; vive na lista de companhias e não vira bolha. [gdd.md:576-578]

3. **Peças.**
   - Lei com escolha: além do valor, o jogador marca a que ela se aplica na própria bolha (exemplo: Incentivo a setores marca os setores). Os nomes vêm dos dados. [gdd.md:641-643]
   - Posição por país e Operação só ficam marcadas na planilha; entram com o Mundo e as Companhias. [gdd.md:532] [planos/leis.md:106-107]
   - Planilha: 1 Lei com prazo e 1 Ato marcados; as demais têm o tipo em branco (Lei). [contagem de "gdd - Leis.tsv"]

4. **Regras decididas.**
   - Tipo, jeito e canal são os três eixos de classificação; a folha mostra os três ao jogador (14/nov). [gdd.md:529-530]
   - Lei com prazo e Ato nascem com a primeira lei que os usa: Anistia fiscal na onda 1, Graça na onda 2 (aprovado 14/nov). [planos/leis.md:6-9]
   - As opções do menu de país ou companhia não são leis; as leis decidem o que o presidente pode fazer (Alcance das sanções, Aprovação de tratados, Autorização para estatizar e vender, Indenização). [gdd.md:635-637]
   - Se tudo vira lei, o mapa enche de bolhas e a decisão do dia a dia se perde. [memória feedback_leis_x_decisoes]
   - Só se mexe em companhias, nunca em fábrica solta. [memória feedback_leis_x_decisoes]

5. **Ligações.**
   - Economia: Operação age sobre companhias, com papéis na mesa. [gdd.md:576-578]
   - Mundo: Posição por país entra com o Mundo. [planos/leis.md:106-107]
   - Estado: o Ato tem custo na hora; a Anistia fiscal arrecada enquanto vale, menos a cada uso repetido. [planos/leis.md:104-105] [leis.md (src/motor/leis):44-45]

6. **Referências.** **ESTUDAR** (nenhuma fonte de jogo ou estudo ligada a tipos de lei).

7. **No motor hoje.**
   - Feito no motor: `tipo` é `lei` (ausente), `prazo` (acaba depois de `prazo_turnos`; o estado guarda o fim em `prazos` e os usos em `usos`) ou `ato` (aprovado, os efeitos entram e a lei não fica; `valores.perdao_da_divida` tira parte da dívida). [src/motor/leis/leis.md:30-38]
   - ⚠ CONFLITO (estado): o código descreve prazo e Ato prontos [src/motor/leis/leis.md:33-38], mas requisitos marca R7.16 como ☐ [requisitos.md:168] e mecânicas diz "Falta: Lei com prazo, Ato, Posição por país, Operação" [mecanicas.md:446]. O plano diz que prazo e Ato nascem com a primeira lei [planos/leis.md:8-9]. Sem escolha.
   - Falta: Posição por país e Operação (Mundo e Economia). [planos/leis.md:106-107]

8. **Em aberto.**
   - Como cada tipo aparece: bolha com relógio, botão, menu do país, lista de companhias. [mecanicas.md:447-448]
   - Se a "lei com escolha" (marcar setores na bolha) é a mesma coisa que o jeito Escolha que a regra de 14/nov revogou. [gdd.md:641-643] [o-que-e-uma-lei.md:59-60]

---

## IV.3 Jeitos: Régua, Verba e Níveis

1. **O que é.** O jeito é como o jogador mexe na lei; são três, e só três: Régua, Verba ou Níveis. [o-que-e-uma-lei.md:57-60]

2. **O que o jogador faz e sente.**
   - Toda lei é um slider. [o-que-e-uma-lei.md:59]
   - **Régua:** qualquer valor entre o mínimo e o máximo faz sentido; não gasta direto. [o-que-e-uma-lei.md:71-72]
   - **Verba:** também é número, mas tira dinheiro do orçamento e dá a uma instituição; disputa o caixa e entra no déficit. [o-que-e-uma-lei.md:73-75]
   - **Níveis:** poucos degraus fixos (3 a 5), cada um uma coisa diferente, sem meio entre eles ("meia cannabis" não existe). [o-que-e-uma-lei.md:67-68] [o-que-e-uma-lei.md:75-77]
   - A régua não limita o jogador: vai ao extremo que algum país real já usou (IR dos EUA chegou a 91% nos anos 1950). Quem para o exagero são as consequências. [o-que-e-uma-lei.md:92-97]

3. **Peças.**
   - Árvore de decisão: número com unidade real e meio que faz sentido? Se sai do orçamento como gasto, é Verba; se não, Régua. Se não, Níveis. [o-que-e-uma-lei.md:62-69]
   - Para pôr em ordem respostas de "jeitos diferentes": ordenar pelo quanto o Estado entra ou sai, ou por quantas pessoas a lei alcança. Sem ordem possível, são leis diferentes ou nem é lei. [o-que-e-uma-lei.md:78-80]
   - Sinais de jeito errado: [o-que-e-uma-lei.md:82-90]
     - Níveis que são números disfarçados ("pouco, médio, muito") viram Régua.
     - Régua cujo meio não existe (metade de um monopólio) vira Níveis.
     - Duas respostas só é slider faltando resposta: achar degraus do meio, ligar com outra lei ou apagar.
     - Dois números na mesma lei: separar.
     - Cada estrato ou setor pede o seu número: uma lei por estrato ou setor, ligadas pelo "Parte de".
   - Formas especiais (GDD, 08/nov): **Régua por setor** (uma aba por setor, como a Tarifa de importação) e **Divisão de 100%** (fatias que somam a verba toda; subir uma derruba as outras, como a Divisão da verba de ciência). [gdd.md:580-582]
   - Marcas na régua: a régua mostra marcas calculadas pelo motor, sem virar lei nova (na Verba das aposentadorias: quanto cada aposentado recebe, "compra o mesmo que no ano passado"). Vale para toda verba e imposto. [gdd.md:2184-2187] "Perfeito", disse o autor da régua em % do PIB com marcas. [SKILL sisgov-lei-boa:21-23]
   - Juntar antes de criar: leis que respondem à mesma pergunta viram degraus de uma só, e vizinhas viram uma régua. O alvo é o menor número de leis que cobre todas as decisões do presidente. [o-que-e-uma-lei.md:99-104]

4. **Regras decididas.**
   - Decidido em 14/nov: a Escolha saiu; toda lei é Régua, Verba ou Níveis. Opções sem ordem viram degraus de Níveis. [o-que-e-uma-lei.md:59-60] [o-que-e-uma-lei.md:280]
   - Duas respostas é slider faltando resposta (completar, ligar ou apagar). [o-que-e-uma-lei.md:281]
   - Régua sem limite: vai ao extremo real; quem para são as consequências. [o-que-e-uma-lei.md:282]
   - Nenhuma lei vira botão (régua em que só uma ponta serve, que funciona como interruptor). [o-que-e-uma-lei.md:132-136] [o-que-e-uma-lei.md:283]
   - Um número com unidade real: %, anos, salários mínimos; unidade livre (km/h, mandatos, % acima de 100). [gdd.md:534-535] [requisitos.md:158]
   - Régua de 14/nov: Verba é "régua em % do PIB que vira gasto (canal verba ou transferência)". [gdd.md:535]
   - Níveis: "escada ordenada de 3 a 5 degraus reais, num lado só da bússola". [gdd.md:536]
   - Quando a escada é de verdade, cada degrau é uma coisa real (Liberação das drogas, Autonomia das Forças Armadas em 5 níveis). [SKILL sisgov-lei-boa:24-25]
   - Duas opções e poucas opções para tema de números são ruins (câmbio "solto ou travado"; Reajuste com 3 opções: "isso é realista?"). [SKILL sisgov-lei-boa:38-39]

   **⚠ CONFLITO 1 (Escolha).** O GDD §7 (14/nov, regras de classificação) ainda lista o jeito **Escolha**: "opções sem ordem, cada uma com ganho e custo", e a forma "Escolha", "Dois controles", "Meta e prazo". [gdd.md:537] [gdd.md:580-582] O mesmo GDD diz que "níveis e escolha" são lei de opções no motor. [gdd.md:552] O plano das leis lista a forma Escolha [planos/leis.md:47]. O motor aceita `jeito: escolha` [src/motor/leis/leis.md:30-32] e a planilha ainda tem 7 leis com jeito Escolha. [contagem de "gdd - Leis.tsv"] Contra isso, `o-que-e-uma-lei.md` (14/nov, "revisado com o autor no mesmo dia") diz que a Escolha saiu. [o-que-e-uma-lei.md:3] [o-que-e-uma-lei.md:59-60] [o-que-e-uma-lei.md:280] Esta fonte revoga a outra de forma explícita; mesmo assim o GDD, o plano, o motor e a planilha ainda não foram ajustados. Fica registrado, sem escolha.

   **⚠ CONFLITO 2 (formas "Dois controles" e "Meta e prazo").** O GDD §7 cita as formas "Dois controles" e "Meta e prazo" [gdd.md:580-581]. Requisitos diz que as formas especiais foram divididas: dois controles em duas leis, divisão de 100% em pesos, régua por setor geral (R7.15). [requisitos.md:159] E "dois números na mesma lei: separar". [o-que-e-uma-lei.md:87] Sem escolha.

   **⚠ CONFLITO 3 ("um lado por lei" × "régua sem limite").** O GDD §7: "Um lado por lei. Cada lei vai de 'nada' a 'mais' num lado da bússola, nunca de um extremo ao outro", com exceção escrita (08/nov) para as leis de valor ou escala (Imposto de renda, Imposto sobre empresas, Liberação das drogas e dos jogos), que usam o valor inicial do país como zero e podem cruzar o meio; "verbas e tetos têm um lado só, com pouca força". [gdd.md:646-653] Mais: a Escada de níveis é "num lado só da bússola". [gdd.md:536] A fonte de 14/nov diz "régua sem limite", "vai ao extremo real". [o-que-e-uma-lei.md:92-97] Observação: um trata da bússola e o outro da faixa do controle, mas o pedido de conferência pede registrar. Em 03/nov o autor também decidiu que nenhuma lei vai de extremo a extremo do eixo (esquerda e direita em leis diferentes). [memória feedback_lei_ou_processo] O motor guarda `bussola.ate`: acima dele a lei fica na ponta (100% de imposto é tão extremo quanto 90%), e a faixa do controle não mexe no equilíbrio. [src/motor/leis/leis.md:20-23] Sem escolha.

   **⚠ CONFLITO 4 ("nada" como degrau).** A skill cita como exemplo de escada boa a Liberação das drogas "nada, bebida, cigarro, cannabis, cocaína, crack". [SKILL sisgov-lei-boa:24-25] O desenho de 05/nov tem nível 0 "tudo proibido". [fase-1-redes.md:75-82] A regra de 14/nov diz: nenhum degrau "nada, nenhum, sem regra"; o nada é a lei não legislada. [gdd.md:541-543] O motor recusa degrau que não faz nada. [src/motor/leis/leis.md:35-38] Sem escolha.

   **⚠ CONFLITO 5 (Verba e transferência).** A fonte de 14/nov define Verba como número que tira dinheiro do orçamento e dá a uma **instituição**. [o-que-e-uma-lei.md:73-75] O GDD §7 diz que a Verba é régua em % do PIB que vira gasto, com canal **verba ou transferência**. [gdd.md:535] No motor, transferência é um canal separado, com `para` (renda de um estrato de pops). [src/motor/leis/leis.md:24-27] Sem escolha.

5. **Ligações.**
   - Economia/Estado: Verba entra direto nas contas como gasto em fração do PIB (`conta: "gasto"`), sem cálculo. [src/motor/leis/leis.md:5-8]
   - Gosto: a posição na bússola (`bussola`) diz onde a lei fica, no mínimo e no máximo da faixa ou em cada opção. Quem gosta sai da distância até cada grupo. [src/motor/leis/leis.md:17-19]
   - Política: Divisão de 100% e Parte de ligam leis entre si. [gdd.md:538-539] [gdd.md:581-582]

6. **Referências.**
   - Democracy 4 passou a cobrar pelo tamanho do passo, porque política barata e só com ganho vai ao máximo e o slider vira botão. [pesquisa-jogadores-14nov.md:15-18]
   - Sid Meier (GDC 2012): troca e decisão que depende da situação fazem a decisão interessante. [pesquisa-jogadores-14nov.md:10-12]

7. **No motor hoje.**
   - Feito: `forma: "continua"` (valor em fração dentro de `faixa`, com `passo`; `unidade` fração, meses ou anos) e `forma: "opcoes"` (ao menos duas opções com efeitos). [src/motor/leis/leis.md:5-14]
   - Feito: `jeito` (`regua`, `verba`, `niveis` de 3 a 5 degraus, `escolha`), obrigatório na lei já triada. [src/motor/leis/leis.md:30-32]
   - Planilha: 191 leis com jeito preenchido (Verba 74, Níveis 56, Régua 54, Escolha 7); 320 ainda sem jeito (triagem). [contagem de "gdd - Leis.tsv"] Formas: 256 régua, 255 degraus. [contagem de "gdd - Leis.tsv"]
   - Falta: R7.17, a fatia da divisão valer o peso dela sobre a soma, quando a mecânica ler. [requisitos.md:169]
   - O validador cobra o jeito das leis já triadas. [gdd.md:552-553]

8. **Em aberto.**
   - O número "255 degraus" na planilha inclui Escolha; falta decisão de como as 7 Escolhas viram Níveis. **ESTUDAR** (nenhuma fonte diz como).
   - Se a verba também precisa passar no teste do botão (lado só de "mais"). Em 14/nov a Verba vai de "não legislada" a mais num lado só (gdd.md:649-652), e a regra do botão pede que as duas pontas sirvam a alguém (o-que-e-uma-lei.md:132-136).

---

## IV.4 Canais (como a lei chega ao pop)

1. **O que é.** O canal é o mecanismo genérico do motor pelo qual a lei chega à vida do pop; a lei aponta o canal e o motor calcula, sem conhecer a lei. [planos/leis.md:56-59]

2. **O que o jogador faz e sente.** O jogador vê, na bolha, a linha "como chega a você", o canal em texto de leigo. [planos/leis.md:149]

3. **Peças.** Seis canais: [planos/leis.md:61-68]
   - **Imposto:** cobra de uma base (renda, consumo, lucro, emissões, terra) pela curva de Laffer; tira renda ou sobe preço.
   - **Verba:** gasto do governo vai à instituição; o rendimento dela vira serviço.
   - **Transferência:** gasto vira renda de um estrato de pops.
   - **Preço e custo:** mexe no preço ou no custo de um setor do mercado.
   - **Regra de módulo:** muda um número de um módulo (moradia, atendimento, saneamento, Judiciário, Congresso, eleição).
   - **Direito:** muda uma liberdade; índices de liberdade e quem gosta pela bússola.
   - Mais o canal provisório `espera`, com a razão ("triagem" até a onda da lei, ou a mecânica que falta). [src/motor/leis/leis.md:27-29]
   - "Emprego" (62 leis no acervo) não tem canal hoje: depende de prédios que contratam (R16.27). "Governo" (81 leis no acervo) são regras do Estado; o canal é regra de módulo. [planos/leis.md:70-74]

4. **Regras decididas.**
   - Canal é obrigatório; uma lei sem canal não entra no jogo (aprovado 14/nov). [planos/leis.md:54] [planos/leis.md:6-8]
   - Direito conta como chegar ao pop (decisão 4, recomendado e aprovado). [planos/leis.md:179-181] [planos/leis.md:6]
   - Lei cujo canal ainda não existe fica no jogo só com o efeito em índice, marcada "espera mecânica" (decisão 3, aprovada). [planos/leis.md:176-178] [planos/leis.md:6]
   - O validador confere que o canal bate com o que a lei faz. [src/motor/leis/leis.md:29-30]
   - Base de imposto nova é entrada nova em `BASES`: a lei diz `"calculo": { "base": "renda" }` e o motor faz a conta. [src/motor/calculos/calculos.md:3-4]
   - Cada lei de imposto declara quem paga do bolso (`incide`): renda e movimentação, todos; patrimônio, aplicações, imóvel e capital, o rico; folha, o pobre e o médio. Consumo, lucro, emissões, terra e bancos não tiram renda dos pops direto. [src/motor/calculos/calculos.md:32-37]
   - Receita, PIB e juros vêm do cálculo, nunca de `efeitos`. [src/motor/leis/leis.md:5-8]

5. **Ligações.**
   - Economia: preço e custo de setor (`valores` nas fichas de setor). [planos/leis.md:66]
   - Gosto/população: transferência (`para`) e imposto de renda mexem no bolso. [planos/leis.md:63-65] [mecanicas.md:56-58]
   - Estado: a receita de cada base é calibrada pelo país; a `receita_fora_das_leis` caiu o que as leis novas passaram a arrecadar. [src/motor/calculos/calculos.md:37-40]

6. **Referências.** Victoria 3: impostos em 5 níveis por tipo (por pessoa, terra, consumo, renda, dividendos); gastos são salários e insumos dos prédios do governo. [pesquisa-jogadores-14nov.md:70-72] Saez, Slemrod e Giertz (2012) para a curva da renda. [src/motor/calculos/calculos.md:11-13]

7. **No motor hoje.**
   - Imposto: sim (`calculos`). Verba: em parte (verba e rendimento sim; serviço só em atendimento e saneamento). Transferência: sim. Preço e custo: sim. Regra de módulo: sim, módulo a módulo. Direito: sim. [planos/leis.md:63-68]
   - Planilha: regra 74, verba 70, imposto 16, direito 9, transferência 4, espera 338. [contagem de "gdd - Leis.tsv"]
   - Falta: canal de Emprego (R16.27 ☐) [requisitos.md:401]; verba que chega a quem recebe, exceto a transferência. [mecanicas.md:59-60]

8. **Em aberto.** Se alguma lei de Governo precisa de canal próprio além de "regra de módulo". **ESTUDAR** (nenhuma fonte levanta o caso).

---

## IV.5 Ponto doce e regulador

1. **O que é.** A lei não tem um valor certo fixo; tem um **ponto doce**, o valor em que o ganho ainda compensa o custo, e um **regulador**, o número do mundo que move esse ponto e obriga o jogador a voltar à lei. [o-que-e-uma-lei.md:147-155]

2. **O que o jogador faz e sente.** Perto do extremo da régua o ganho cai e o custo sobe. O jogador tem de voltar à lei quando o mundo muda; sem isso, descobre o valor certo uma vez e nunca mais pensa. [o-que-e-uma-lei.md:148-149] [o-que-e-uma-lei.md:192-194]

3. **Peças.**
   - O ponto doce vem do mundo, não do fim da régua. [o-que-e-uma-lei.md:149-150]
   - O regulador é algo que muda sozinho: idade da população, inflação, preço do petróleo, ciclo da economia, eleição. Se o ponto doce muda só com a estratégia do jogador, vira receita pronta (aconteceu com o imposto do Victoria 2). [o-que-e-uma-lei.md:158-164]
   - Exemplos: transferência de renda, regulada por quantos pobres existem; verba da saúde, pela idade da população; IR do rico, pela dívida e economia. [o-que-e-uma-lei.md:154-161]
   - Por canal: [o-que-e-uma-lei.md:168-173]
     - Imposto: Laffer (subir demais encolhe a base; o país declara onde começa).
     - Verba: verba acima do que a instituição precisa vira corrupção.
     - Transferência: vaza para quem não precisa quando cobre mais que os pobres.
     - Regra e direito: nada ainda.
   - **Fuga da regra** (proposta, ainda não decidida): quanto mais forte a regra, mais gente foge (salário mínimo alto empurra para o informal; proibir demais cria mercado ilegal; licença difícil vira obra sem licença); quanto foge depende da verba de quem fiscaliza. É a "Laffer" das regras. [o-que-e-uma-lei.md:175-180]

4. **Regras decididas (14/nov).**
   - Toda lei tem regulador; o ponto doce vem do mundo. [o-que-e-uma-lei.md:284]
   - Teste 6 de resposta de verdade: a lei diz qual número do mundo muda o valor certo dela; lei sem regulador é cenário. [o-que-e-uma-lei.md:134-136]
   - Teste 3 sem motor rodando: escrever o caso em que cada resposta ganha; sem caso, a lei falha. [o-que-e-uma-lei.md:138-141] [o-que-e-uma-lei.md:287]
   - Evasão: fração da base que escapa do fisco, declarada pelo país. [src/motor/calculos/calculos.md:16]
   - O país declara o pico de Laffer; o motor deriva `e = (1 − pico)/pico`. Sem declaração, usa pico 0,6 e evasão 0,1. [src/motor/calculos/calculos.md:14-16]
   - Fuga da regra entra também na lista de ideias do GDD: a regra forte demais alcança menos gente, conforme a verba de quem fiscaliza, junto com a sonegação que cresce com o imposto. [gdd.md:2056-2058]
   - Lei de regra custa: fiscalizar pede trabalho à instituição (sobe a necessidade dela); sem verba para isso, a regra alcança menos gente. Esse custo vai a bolsos (salário de fiscal, compra de equipamento); a multa de quem foi pego vai ao Tesouro. [mecanicas.md:439-442]

5. **Ligações.**
   - Economia: Laffer, evasão e juros em `motor/calculos`. [src/motor/calculos/calculos.md:6-19] [src/motor/calculos/calculos.md:42-54]
   - Gosto: a transferência que passa dos pobres vaza para o estrato de cima. [o-que-e-uma-lei.md:155-157] [mecanicas.md:475]
   - Estado: verba de sobra vira corrupção `12 × (rendimento − 1)` por turno. [mecanicas.md:434-436]
   - Política: o regulador pode ser a eleição (perto da eleição, baixar agrada). [o-que-e-uma-lei.md:160-161]

6. **Referências.** SimCity 2000 (imposto bom entre 7 e 9%); Civ IV ("ciência sempre no máximo"); Victoria 2 (receita pronta do imposto). [pesquisa-jogadores-14nov.md:19-22] Sid Meier: boa uma vez pode ser chata na décima. [pesquisa-jogadores-14nov.md:10-12] Democracy 4: fim de jogo "resolvido"; remédios são demanda que cresce, complacência e eleitor que julga a tendência. [pesquisa-jogadores-14nov.md:23-25]

7. **No motor hoje.**
   - Feito: imposto pela curva de Laffer com pico declarado pelo país; verba de sobra vira corrupção; transferência que cobre mais que os pobres vaza para o estrato de cima (para a transferência principal). [mecanicas.md:473-475] [o-que-e-uma-lei.md:170-172]
   - Falta: sonegação que cresce com o imposto e cai com a fiscalização (hoje fixa); pouca verba enfraquece a lei (R7.11). [mecanicas.md:476-477]
   - Falta: fuga da regra para leis de regra e direito. [mecanicas.md:478-479]

8. **Em aberto.**
   - Fuga da regra: decidir se entra e como. [o-que-e-uma-lei.md:179-180]
   - O regulador de cada lei sai da revisão instituição por instituição. [mecanicas.md:479-480]
   - Marcas na régua (IV.3): saber de onde o motor tira cada marca. [gdd.md:2184-2187]

---

## IV.6 Escassezes e o que torna a lei jogável

1. **O que é.** As escassezes são o custo de mudar uma lei: dinheiro, Congresso e gente. Toda lei usa ao menos uma. [o-que-e-uma-lei.md:196-204] [o-que-e-uma-lei.md:285]

2. **O que o jogador faz e sente.** O jogador vê o custo ao mudar a lei: a verba disputa o orçamento, a lei gasta apoio e tempo na fila do Congresso, um grupo perde e cobra na eleição. [o-que-e-uma-lei.md:198-202]

3. **Peças.**
   - **Dinheiro:** a verba disputa o orçamento. [o-que-e-uma-lei.md:198]
   - **Congresso:** a lei gasta apoio e tempo na fila. [o-que-e-uma-lei.md:199]
   - **Gente:** um grupo perde e cobra na eleição. [o-que-e-uma-lei.md:200]
   - Podem se misturar, e é o normal (IR do rico custa gente e Congresso). Lei que não usa nenhuma é a lei que todo mundo liga. [o-que-e-uma-lei.md:201-204]
   - As cinco exigências para a lei ser jogável (além do custo de mudar): ganho e custo em lugares diferentes; depende do estado do país; mexe em algo que existe; custa mudar; espalha pela cadeia. [o-que-e-uma-lei.md:184-205]
   - Seis testes de cada resposta: alguém defende; muda um número; ninguém ganha sempre; o jogador vê; não vira botão; tem regulador. [o-que-e-uma-lei.md:116-136]
   - Sete exigências do **conjunto** de leis de uma instituição: [o-que-e-uma-lei.md:208-232]
     - os lados legislam;
     - cada índice da instituição tem alavanca para os dois sentidos;
     - barato e caro, rápido e lento;
     - uma tensão dentro (duas leis puxam em sentidos contrários);
     - sem repetição;
     - sem buraco (toda decisão real tem uma lei);
     - obriga a abrir mão (se dá para ligar tudo de bom, nada é escolha);
     - do problema até a lei, em um ou dois cliques; índice sem lei para algum lado é **buraco**; lei que não mexe em nenhum índice está **solta**.

4. **Regras decididas.**
   - Teste 3 ("ninguém ganha sempre") é o mais importante: é ele que faz o resultado emergir. [o-que-e-uma-lei.md:138-141]
   - O conjunto obriga a abrir mão e liga cada problema às leis (14/nov). [o-que-e-uma-lei.md:286]
   - O limite não vem de pontos de ação: vem do mundo (Congresso cheio) e só atrasa (11/nov). [memória feedback_sem_pontos_de_acao]
   - Eleitor se acostuma: o ganho de um benefício antigo some com o tempo, mas a raiva de cortar continua (ideia, 14/nov). [gdd.md:2046-2047]
   - Eleitor julga a melhora: compara com antes, não com o ideal (ideia, 14/nov). [gdd.md:2048-2050]

5. **Ligações.**
   - Gosto: a escassez "gente" é o grupo que perde e cobra. [o-que-e-uma-lei.md:200]
   - Economia/Estado: a escassez "dinheiro" entra no déficit e disputa o caixa. [o-que-e-uma-lei.md:73-75]
   - Política: a escassez "Congresso" é o apoio gasto e a fila. [o-que-e-uma-lei.md:199]

6. **Referências.** Frostpunk (nada renuncia nada) [pesquisa-jogadores-14nov.md:26-27]; Democracy 4 (slider vira botão sem custo; passou a cobrar pelo passo) [pesquisa-jogadores-14nov.md:15-18]; Victoria 3 (sorteio para passar lei; propor e cancelar virou truque) [pesquisa-jogadores-14nov.md:28-30].

7. **No motor hoje.** Feito: corrupção da verba de sobra. [mecanicas.md:434-436] Falta: custo na gente e no Congresso por lei declarado de forma própria. **ESTUDAR** (nenhuma fonte diz o que o motor faz hoje com a escassez "gente" por lei).

8. **Em aberto.**
   - A "cota" de foco numa área e a promessa de campanha ainda precisam de desenho. [memória project_caminhos_sem_nucleo]
   - Mudar de ideia custa: ainda sem desenho. [gdd.md:2053]

---

## IV.7 Nome e texto da lei

1. **O que é.** O nome diz o que a lei controla, em palavras de todo dia, no mesmo molde para todas: **o que + de quem/sobre o quê**. [o-que-e-uma-lei.md:107-110]

2. **O que o jogador faz e sente.** Ao passar o mouse, uma frase de leigo diz o que muda na vida de alguém, com exemplo. [o-que-e-uma-lei.md:113-114]

3. **Peças.**
   - Exemplos: "Imposto sobre consumo", "Imposto de renda do rico", "Piso da saúde". [o-que-e-uma-lei.md:109-110]
   - O nome real do país (IBS, CBS, Selic) pode aparecer embaixo, menor, como rótulo do país. [o-que-e-uma-lei.md:111-112]
   - SisGovpedia: enciclopédia aberta pelas dicas ao passar o mouse, em camadas (frase curta, porquê, conta). [gdd.md:2044-2045]
   - Mostrar o atraso: a lei diz "efeito em N turnos". [gdd.md:2051-2052]

4. **Regras decididas.**
   - Sigla e nome técnico nunca no nome. [o-que-e-uma-lei.md:111]
   - Texto de leigo, com exemplo do dia a dia, sem jargão ("indexação", "faixa", "acompanha a inflação" foram rejeitados). [memória feedback_texto_para_leigo] [SKILL sisgov-lei-boa:71-73]
   - Frase enigmática ou metafórica é ruim ("Cidade que não fica isolada: confuso"); dizer o que muda. [SKILL sisgov-lei-boa:62]
   - Não detalhar além do necessário; número fino fica para a calibração do fim. [SKILL sisgov-lei-boa:74-76]
   - Nenhum nome de país na lei; nome local ("Selic") é rótulo do país. [SKILL sisgov-lei:35]
   - A lei não cita grupo: quem gosta sai da distância na bússola. [SKILL sisgov-lei:43-47]
   - Países reais podem entrar (08/nov); a lei continua genérica ("2 salários médios do país"). [memória project_paises_reais] [gdd.md:2201-2202]
   - Lei, opção e programa podem ter origem em programa real, só como desbloqueio e campanha, nunca no texto da lei. [gdd.md:2179-2183]

5. **Ligações.** Gosto: o texto lido do jogador sai dos números da lei. [gdd.md:569]

6. **Referências.** Nada do Democracy 4 (nome, número, ligação); Victoria 3 só como ideia. [gdd.md:2200]

7. **No motor hoje.** Feito: texto sai dos números (R7.5). [requisitos.md:157] Falta: SisGovpedia (ideia guardada). [gdd.md:2044-2045]

8. **Em aberto.** ⚠ Nota para o revisor: a skill sisgov-lei fala em "público e privado são esferas separadas" [SKILL sisgov-lei:41-42]; desde 13/nov o jogo usa instituição, não esfera. [memória project_esfera_ministerio] Ver Para o revisor.

---

## IV.8 Programas

1. **O que é.** Programa é um pacote de leis que resolve um problema (exemplo: Tarifa social, que junta luz, água e gás). A palavra é do autor e não se usa para outra coisa. [gdd.md:578-580] [memória feedback_leis_x_decisoes]

2. **O que o jogador faz e sente.**
   - O jogador junta leis do mesmo pacote; quando a maior parte anda na direção do programa, ele se forma e o jornal anuncia ("Governo lança o Mais Escola"). [gdd.md:591-592] [gdd.md:602-605]
   - O programa não mexe no país além das leis; o ganho é de memória. [gdd.md:613-614]
   - Tema com partes vira programa; o autor aprovou Tarifa social em 3 leis, "formando um programa". [SKILL sisgov-lei-boa:27]

3. **Peças.**
   - 74 pacotes, da Saúde à Cultura, com lados equilibrados: 22 de esquerda, 22 de direita (contando os que são também tradicionais ou autoritários), 14 do meio, 4 verdes e o resto de outros lados. [gdd.md:584-588] A aba Programas diz o lado, as instituições e as palavras do nome. A aba Programas - leis diz a **direção** (sobe, desce, liga, mais fechado) e o **mínimo** que conta (1 degrau, 10% da régua, 1 fatia da divisão). [gdd.md:588-590]
   - Colunas do TSV de programas: Programa, Lado, Esferas, Leis, Forma-se com, Tema, Bem, Mal, Público, Programas reais parecidos. [cabeçalho de "leis - Programas.tsv"]
   - Colunas do TSV de leis por programa: Programa, Lei, Esfera, Subesfera, Forma, Direção, Mínimo; 314 linhas. [cabeçalho e contagem de "leis - Programas - leis.tsv"]
   - Programas reais: a aba lista os de governos reais parecidos; os que são lei caem num programa, ficam fora as posições por país e as leis soltas. [gdd.md:631-634] Uso futuro: desbloqueio ("você imitou o programa tal do presidente tal") e campanhas. [gdd.md:2179-2183]
   - **Gerador de nomes:** moldes com lacunas ("Minha ___, Minha ___", "___ para Todos", "Mais ___", "País sem ___", "Bolsa ___", "Pacto pela ___", "Programa Nacional de ___", "Ordem e ___", "___ Livre") preenchidos com as 4 palavras do programa (tema, bem, mal, público). O lado do partido escolhe o molde: esquerda puxa "para Todos" e "sem ___", direita "Livre" e "Responsável", autoritário "Ordem e ___". [gdd.md:606-612]

4. **Regras decididas (12/nov).**
   - **Forma-se** quando a maior parte das leis da lista (3 de 4, 2 de 3) anda pelo menos o mínimo na direção do programa dentro de um mandato. Só lei de verdade entra: Operação, Ato e Posição por país ficam de fora. [gdd.md:591-593]
   - **Vários ministérios:** programa com leis em mais de uma caixa anda no passo do ministro mais fraco: usa o atraso e a força desse ministro. [gdd.md:594-596]
   - **Miúdos:** conta quando a lei é aprovada, não quando o efeito chega; a janela é o mandato atual; lei em dois programas conta para os dois; lei com prazo conta enquanto vale. Antes de uma lei desfazer um programa, a tela avisa. [gdd.md:597-601]
   - **Nome:** o JSON do país pode dar o nome próprio; sem nome do país, o gerador cria e o jornal anuncia. Moldes são do mundo; o motor não conhece nomes. [gdd.md:602-612]
   - **Lembrança:** formado, os grupos que gostam guardam a lembrança (força pelo tempo que durou e pelo que ganharam), que pesa no voto e cai devagar. [gdd.md:615-617]
   - **Nostalgia:** desfeito (as leis voltam abaixo da maioria), a lembrança vira nostalgia: quem gostava sente falta e cobra de quem desfez. [gdd.md:618-620]
   - **Recriado:** o jogo pergunta se o governo quer usar o mesmo nome. Mesmo nome: a nostalgia volta de uma vez como apoio, mas a raiva de quem odiava volta junto e parte do crédito fica com o partido que criou. Nome novo: começa do zero, sem bagagem. [gdd.md:621-625]
   - **Rebatizar:** quem está no poder pode trocar o nome de um programa herdado; a lembrança do nome antigo fica com o partido que o criou. [gdd.md:626-627]
   - O país declara os programas que já existiam (nome, partido que criou, força da lembrança). A memória é guardada pelo código do programa. [gdd.md:628-630]
   - **Simulador de governo** (31/out): programas não servem de termômetro; medir por decisão, lei por lei, nunca por programa de personalidade. [memória feedback_simulador_de_governo]
   - Programa inventado (o jogador junta leis livres e o jogo cria um programa novo) está guardado para depois. [gdd.md:2167-2168]

5. **Ligações.**
   - Gosto/população: lembrança e nostalgia pesam no voto e nos grupos (ainda não lê no motor). [gdd.md:615-620] [src/motor/programas/programas.md:34-40]
   - Política: o programa usa o ministro mais fraco da caixa (seção Governo). [gdd.md:594-596]
   - Mídia: o jornal anuncia o programa formado, com o nome. [gdd.md:604-605] [src/motor/programas/programas.md:62-65]

6. **Referências.** Programas reais de governos reais (110 citados na planilha) [gdd.md:631-634]. Nenhuma referência de jogo ou estudo. **ESTUDAR** (outros jogos que tenham pacote de leis).

7. **No motor hoje.**
   - Feito: 73 programas formam-se pelas leis (R7.18); passo do ministro mais fraco (R7.21). [mecanicas.md:457-458] [requisitos.md:173] [requisitos.md:176]
   - Conta: a lei "andou" quando, desde o começo do mandato, o valor se moveu na direção pedida pelo menos o mínimo; o programa espera o maior atraso entre as leis dele. [src/motor/programas/programas.md:14-32]
   - Estado: `estado.programas = { mandato, referencia, formando, vidas }`; fatos `programa-formado` e `programa-desfeito`. [src/motor/programas/programas.md:60-65]
   - Pela metade: lembrança e nostalgia pesando no voto (R7.19 ◐) e nome pelo gerador e rebatizar (R7.20 ◐). [requisitos.md:174-175] [mecanicas.md:459-460]
   - O Brasil 2026 já começa com Farmácia Popular, Saúde da Família e Bolsa Família. [src/motor/programas/programas.md:50-58]
   - Dívidas do código: lembrança pesar no voto; perguntar o nome ao refazer; conferir direções ambíguas da planilha ("aberto", "mais livre", "mais curto") lidas como `sobe`; 21 ligações a leis que o jogo ainda não tem. [src/motor/programas/programas.md:67-75]
   - ⚠ CONFLITO (número): GDD diz 74 pacotes [gdd.md:584]; requisitos e mecânicas dizem 73 (com 1 esperando leis) [requisitos.md:173] [mecanicas.md:457]; o motor diz que "Economia verde" ficou de fora por falta de leis [src/motor/programas/programas.md:74-75]; o TSV tem 74 linhas de programa. [contagem de "leis - Programas.tsv"] Sem escolha.

8. **Em aberto.**
   - Programas de Drogas e Apostas só se formam quando as leis de Vícios ("A criar") forem escritas. [gdd.md:2171-2172]
   - Leis que faltam aos programas: ajuda para a empresa reduzir a jornada sem demitir; controle de natalidade. [gdd.md:2169-2170]
   - Programas esperam a Opinião (mecânica 3) para a lembrança. [planos/leis.md:124]

---

## IV.9 Processos

1. **O que é.** Processo é um estoque que anda sozinho pelos turnos (casas, favelas, terra dividida), empurrado pelas leis em vigor. [gdd.md:656-658]

2. **O que o jogador faz e sente.** O jogador não vê painel com meta, ritmo ou "quanto por turno" (isso é slider). Cada lei anda um pouco pelo caminho; o extremo da bússola é um caminho, não o destino. [gdd.md:657-658] [memória feedback_lei_ou_processo]

3. **Peças.**
   - O processo tem estoque, ritmo e fases; as leis são as peças que um presidente assina. [memória feedback_lei_ou_processo]
   - Exemplo (04/nov): "Reforma agrária 0 a X%" não é lei, é processo; as leis são o que é terra parada, como indeniza, verba de assentamento, prazo do título. [memória feedback_lei_ou_processo]
   - Exemplo de molde (03/nov): "urbanizar favelas" com obra pública, incentivo, título, remoção, solo, mutirão; tabela de moradia com 3 processos × 6 lados. [memória feedback_lei_ou_processo]
   - Exemplos de má lei por ser processo: Órgão anticorrupção, Reforma agrária. [SKILL sisgov-lei-boa:42]

4. **Regras decididas.**
   - Um processo tem um órgão com verba (lei contínua % do PIB) e leis de regra; o efeito da regra é a regra vezes quanto da verba necessária existe. [memória feedback_orgaos_e_verba]
   - Modelo de builds (03/nov): o jogador combina leis de lados diferentes como quiser; só as que **colidem** não valem juntas. [memória feedback_lei_ou_processo] [gdd.md:654-656]
   - Processo é "andar" por esse caminho, "um pouco com cada lei, nunca de uma vez". [memória feedback_lei_ou_processo]
   - O tema precisa de leis em todos os lados da bússola, não só três. [memória feedback_lei_ou_processo]

5. **Ligações.**
   - Economia: moradia e terra são estoques (seção 5.9 de mecânicas). [mecanicas.md:372]
   - Gosto: favela empurra saúde, segurança e saneamento (índice). [indices-avaliacao.md:14]
   - Estado: o órgão responsável recebe a verba e age sozinho. [memória feedback_orgaos_e_verba]

6. **Referências.** Reforma agrária e favelas foram os casos de teste do autor (03/nov e 04/nov). [memória feedback_lei_ou_processo]

7. **No motor hoje.** Feito: índice que anda sozinho (deriva), R7.10. [requisitos.md:161] [mecanicas.md:464] Índices déficit, preço e favela já derivam (R16.19). [requisitos.md:364]

8. **Em aberto.** Quais temas são processo (reforma agrária, moradia, terras) e quais leis empurram cada etapa. [mecanicas.md:465-466]

---

## IV.10 Colisão e revogar

1. **O que é.** Colisão: leis que se anulam e não valem juntas. Revogar: propor a volta de uma lei a "não legislada". [gdd.md:654-656] [gdd.md:644-645]

2. **O que o jogador faz e sente.**
   - Na bolha da lei aparece o botão "Revogar", que passa pelo Congresso como qualquer mudança. [planos/leis.md:109-112]
   - O jogador pode combinar leis de lados diferentes; só as que colidem não valem juntas (teto de aluguel × aluguel livre). [gdd.md:654-656]

3. **Peças.**
   - Quando o dono pode ser Estado ou privado (usinas, rede, venda de energia), são duas leis de lados opostos que colidem (feito em Energia). [gdd.md:651-653]
   - Revogar leva a lei ao valor desligado (`valorDesligado`: mínimo da régua ou primeiro degrau); aprovado, a lei sai de `estado.leis` e os efeitos voltam a zero. [src/motor/leis/leis.md:46-49]

4. **Regras decididas.**
   - Revogar também passa pelo Congresso. [gdd.md:644-645]
   - Lei essencial não se revoga. [gdd.md:545-546] [requisitos.md:166]
   - A colisão do jogo vale para a lei inteira: é um "ou" (decisão de 05/nov sobre vícios). [fase-1-redes.md:101-103]
   - Colisões dos vícios: Venda pelo Estado × Lojas licenciadas, e Monopólio × Licenças de apostas. [fase-1-redes.md:101]

5. **Ligações.** Política: a revogação vai ao Congresso; a lei com prazo volta sozinha, sem voto. [gdd.md:638-640] [gdd.md:644-645]

6. **Referências.** **ESTUDAR**.

7. **No motor hoje.**
   - Feito: colisão (R7.9) [requisitos.md:160]; revogar com voto (R7.8, 14/nov): botão na folha da lei, lei essencial não se revoga [requisitos.md:166]; o pedido `mudar_lei` com `revogar: true`. [src/motor/leis/leis.md:46-49]
   - ⚠ CONFLITO (estado): mecânicas.md ainda diz "Falta: revogar com voto (R7.8 ☐)" [mecanicas.md:453] e requisitos marca R7.8 como ✅. [requisitos.md:166] O plano aprovado diz que a base (revogar incluído) foi feita em 14/nov. [planos/leis.md:6-8] Sem escolha.

8. **Em aberto.** Como o jogo avisa quando uma revogação desfaz um programa: a tela avisa antes (decidido) [gdd.md:600-601]; o desenho da tela fica para a Tela.

---

## IV.11 Lei pela instituição

1. **O que é.** O efeito de toda lei passa pelo rendimento da instituição onde ela mora: pouca verba, a lei rende menos; verba demais, a sobra vira corrupção. [planos/leis.md:93-98]

2. **O que o jogador faz e sente.** O jogador nunca escolhe a fazenda, a fábrica ou a obra. Leis de regra dizem o quê; leis de verba dão força ao órgão responsável; o órgão age sozinho. [gdd.md:659-662] [memória feedback_orgaos_e_verba]

3. **Peças.**
   - Cada instituição tem verba (das leis de gasto dela), necessidade, rendimento = verba ÷ necessidade e corrupção interna; quem manda é o ministro. [requisitos.md:120]
   - O ministro (que muda o rendimento) também importa. [planos/leis.md:97-98]
   - **Filtro da verba:** a corrupção desvia parte de toda verba, conforme o índice, e o desvio deixa rastro. O que chega ao prédio vira salário e insumos, e parte dos insumos pode ser importada. Vaga é por pop: sem gente formada, fica vazia e o salário sobe. [gdd.md:681-684]
   - **Verba tem lado, mas pequeno (07/nov):** nenhuma lei é neutra; a verba vai de zero a um empurrão pequeno num lado só (serviços puxam um pouco à esquerda; polícia e defesa, um pouco ao tradicional). O empurrão forte fica nas leis de "como". [gdd.md:668-673]
   - Obra nova é lei separada (seção 16, Prédios e obras). [gdd.md:661-662]

4. **Regras decididas.**
   - A regra funciona na medida da verba; verba muito acima do necessário vira corrupção (04/nov). O autor rejeitou a régua da lei andar aos poucos até o alvo. [memória feedback_orgaos_e_verba]
   - Decisão 5 do plano (aprovada): o efeito de toda lei vezes o rendimento da instituição, com teto em 100%. [planos/leis.md:182-183] [planos/leis.md:6]
   - Lei sem órgão (regras dos poderes) rende inteira. [src/motor/leis/leis.md:52-53]
   - Dar ao partido o trabalho do órgão é ruim: "O PARTIDO não escolhe as OPERAÇÕES"; o órgão recebe a verba e age sozinho. [SKILL sisgov-lei-boa:57]
   - Virar jogo de construção é ruim ("ligar dois estados com uma linha: o presidente não toma a decisão disso"). [SKILL sisgov-lei-boa:56]

5. **Ligações.**
   - Estado: corrupção soma `12 × (rendimento − 1)` por turno quando sobra verba. [mecanicas.md:434-436]
   - Economia: efeito da lei em índice = valor × rendimento do órgão (`rendimentoDasLeis`, `motor/governo`). [src/motor/leis/leis.md:51-53]
   - Política: a ficha do ministro muda a força e o atraso das leis da caixa. [requisitos.md:114]

6. **Referências.** **ESTUDAR** (outros jogos com órgão e verba).

7. **No motor hoje.**
   - Feito: R7.11 (14/nov), efeito vezes o rendimento da instituição, teto 1. [requisitos.md:167] [src/motor/leis/leis.md:51-53]
   - Feito: corrupção por verba parada (R6.17). [mecanicas.md:434-436]
   - ⚠ CONFLITO (estado): mecânicas.md ainda diz "Falta: a regra funciona na medida da verba (R7.11 ☐)" [mecanicas.md:437-438] e requisitos.md marca R7.11 ✅ [requisitos.md:167]. Sem escolha.
   - Falta: serviços do Estado como prédios fora do mercado (R16.31 ☐) e terceirizar por lei (R16.32 ☐). [requisitos.md:395-396] [mecanicas.md:405-408]
   - Falta: caminho do dinheiro (impostos → Tesouro → verba → máquina do ministério → filtro da corrupção → instituição). [gdd.md:2100-2112]

8. **Em aberto.**
   - Custo de máquina: sem custo de máquina, o governo Inchado não tem desvantagem. [gdd.md:2109]
   - Ordem do autor: terminar os ministros, depois o mapa, depois padronizar as leis e só então o caminho do dinheiro. [gdd.md:2110-2112]

---

## IV.12 Roteiro da lei (8 passos)

1. **O que é.** Toda lei passa pelos mesmos 8 passos: entrada (dinheiro, regra, preço ou direito), filtro, prédio, pop, economia, índices, política e conta. [gdd.md:663-665]

2. **O que o jogador faz e sente.** O jogador vê na bolha como a lei chega à vida das pessoas (a linha "como chega a você"). [planos/leis.md:32-34] [planos/leis.md:149]

3. **Peças.** A lei declara a entrada e onde age; os outros passos são regras gerais do jogo. [gdd.md:665-666] No acervo, o roteiro tem as colunas: Entrada (o que a lei muda), Filtro (o que atrapalha), Prédio (quem muda de comportamento), Pop (quem sente), Economia (para onde vai o dinheiro), Índices (o que muda na tela), Política (quem reage), Conta (quem paga depois), Quando aparece e Revisão. [cabeçalho de "leis - Leis - roteiro.tsv"; 518 linhas]

4. **Regras decididas.** O roteiro de cada lei fica na aba "Leis - roteiro" do acervo. [gdd.md:666-667] A coluna "Chega ao pop" do acervo tem seis valores: Direito 130, Serviço 86, Renda 85, Governo 81, Preço 76, Emprego 62. [planos/leis.md:22-24]

5. **Ligações.**
   - Gosto: o passo "pop" mede quem sente. [gdd.md:664]
   - Economia: o passo "economia" diz para onde vai o dinheiro. [gdd.md:664]
   - Política: o passo "política" diz quem reage. [gdd.md:664-665]

6. **Referências.** Victoria 3: pops no centro, métodos de produção, preço por oferta e procura. [pesquisa-jogadores-14nov.md:58-63]

7. **No motor hoje.** Pela metade: mecânicas marca o roteiro como "A pensar"; toda lei chega ao pop (R7.12 ◐): hoje quase todas só mexem em índice. [mecanicas.md:428-430]

8. **Em aberto.** Por que 443 das 529 leis do acervo estão como "Ideia" e o JSON foi exportado sem padrão. [planos/leis.md:24-25]

---

## IV.13 Força e atraso

1. **O que é.** Cada lei tem uma Força (fraca, média, forte) e um Atraso em turnos; o turno tem 2 meses. [gdd.md:561-563]

2. **O que o jogador faz e sente.** O que dá resultado demora: cada efeito declara quanto tempo leva para chegar inteiro, e o jogador sente a conta chegar. [gdd.md:113-114] A lei diz "efeito em N turnos", para o jogador planejar. [gdd.md:2051-2052]

3. **Peças.**
   - Colunas Força e Atraso na aba Leis, como palpite de partida: o atraso vem do "Quando aparece" do roteiro; a força vem do passo 6. [gdd.md:562-564]
   - Tamanho do efeito inteiro: fraca 2, média 5, forte 10 pontos (calibrado no 6d). O efeito é o tamanho total, não por turno. [src/motor/efeitos/efeitos.md:6-8]
   - Lei contínua: o efeito cresce com a posição do valor na faixa (no mínimo, nada; no máximo, inteiro). Lei de opções: os efeitos da opção, inteiros. [src/motor/efeitos/efeitos.md:9-11]
   - Ao mudar a lei, a contribuição anda em linha reta do valor de hoje ao novo em `atraso_turnos` turnos; depois fica parada. [src/motor/efeitos/efeitos.md:11-13]
   - No começo da partida, as leis vigentes já estão inteiras. [src/motor/efeitos/efeitos.md:14-15]
   - Efeito: índice de jogabilidade, `sentido` ±1, `forca` por nível, `atraso_turnos`. [src/motor/leis/leis.md:15-16]
   - Planilha: aba "Leis - efeitos" (Lei, Degrau, Índice, Sentido, Força, Atraso) com 1359 linhas. [cabeçalho e contagem de "gdd - Leis - efeitos.tsv"]

4. **Regras decididas.**
   - Todo número da planilha é valor de partida, de um de três tipos: **estudo** (tem fonte), **ordem de grandeza** ou **chute de jogo**. A calibração fica para o motor. Valores convertidos de uma palavra (esquerda, direita) usam 0,4 e estão marcados na coluna "Bússola: origem". [gdd.md:565-568]
   - Força por nível, nunca número solto; todo efeito declara o atraso em turnos. [SKILL sisgov-lei:33-34]
   - Efeito só nos índices de jogabilidade; efeito em receita, PIB, juros, dívida não se escreve na lei. [SKILL sisgov-lei:28-32]
   - A lei contínua pode ter `calculo.estrato`, `encolhe`, `escala_gasto`, `para.pesos`, `arrecada`. [src/motor/leis/leis.md:39-45]
   - Lei declara: efeitos, força, atraso, posição na bússola e qual cálculo usa; não traz fórmula própria. [gdd.md:554-556]

   **⚠ CONFLITO 6 (atraso zero).** GDD: atraso "0" é na hora. [gdd.md:562] Motor: `atraso_turnos` 0 = no turno seguinte. [src/motor/efeitos/efeitos.md:11-12] Sem escolha.

5. **Ligações.**
   - Estado: o ministro muda força e atraso (competência) das leis da caixa. [requisitos.md:114] [src/motor/programas/programas.md:29-31]
   - Gosto: o efeito vai ao índice; o grupo cobra o índice. [src/motor/efeitos/efeitos.md:3-4]

6. **Referências.** Atraso desconhecido tira do jogador a noção de quando agir (design de atraso). [pesquisa-jogadores-14nov.md:13-14]

7. **No motor hoje.** Feito: efeito, força, atraso e bússola declarados e calculados (R7.2). [requisitos.md:154] Falta: mostrar "efeito em N turnos" na tela (ideia). [gdd.md:2051-2052]

8. **Em aberto.** A calibração fina fica para o fim ("Não abrir revisão lei por lei"). [SKILL sisgov-lei-boa:76]

---

## IV.14 Processo de revisão por instituição

1. **O que é.** Cada lei atual é conferida contra as regras de `o-que-e-uma-lei.md`, uma instituição de cada vez, começando por Impostos. [o-que-e-uma-lei.md:252-255]

2. **O que o jogador faz e sente.** Nada diretamente; é o trabalho do autor na planilha. [o-que-e-uma-lei.md:273-274]

3. **Peças.** Cinco passos: [o-que-e-uma-lei.md:259-271]
   1. O que a instituição liga: índices, mercados, grupos, contas, e que outras instituições dividem tema.
   2. As perguntas do presidente: que decisões reais ele toma nessa área, sem olhar as leis atuais.
   3. Cruzar: para cada lei, qual pergunta responde, os testes, o regulador, as escassezes, o extremo da régua e o veredito (fica, muda o jeito, junta com, divide em, sai, vira outra coisa, troca o nome). Para cada pergunta sem lei: buraco. Depois, a seção do conjunto.
   4. Revisão da saída do modelo simples.
   5. Decisão do autor; só depois se mexe nos JSON.
   - Quatro **ondas** (aprovadas em 14/nov): [planos/leis.md:133-141]
     - Onda 1: Impostos, Previdência, Assistência social, Orçamento e dívida, Moeda e bancos (dinheiro no bolso, canais prontos).
     - Onda 2: Saúde, Educação, Segurança pública, Justiça e prisões, Moradia, Água e saneamento (serviço).
     - Onda 3: Trabalho, Energia, Agricultura e pesca, Indústria, Mineração e petróleo, Comércio exterior, Concorrência e consumidor, Infraestrutura e transporte, Ciência e pesquisa, Comunicação e tecnologia (preço e custo).
     - Onda 4: o resto (Meio ambiente, Terra, Imigração, Cultura, Esporte, Turismo, Religião, Defesa, Defesa civil, Relações exteriores, Estatais, Funcionalismo, Estados e municípios, Controle e transparência, Eleições, Regras dos poderes).
   - Vereditos do plano: fica, junta, divide, vira índice/evento/Ato/Operação/Posição, espera mecânica, sai. [planos/leis.md:80-88]

4. **Regras decididas.**
   - A saída de cada instituição é uma tabela na planilha `gdd.xlsx`, não um documento novo. [o-que-e-uma-lei.md:273-274]
   - Revisão por onda, 4 revisões no total (decisão 2). [planos/leis.md:173-175] [planos/leis.md:6]
   - Fonte da verdade: a planilha `gdd.xlsx`, com exportador para o JSON e validador (decisão 1). O autor mexe na planilha; o código lê o JSON. [planos/leis.md:116-118] [planos/leis.md:172-173]
   - Cada onda, sem parar no meio: preencher a triagem e o molde, autor revisa a onda inteira, exporta e faz o que faltar no motor, commit. [planos/leis.md:151-156]
   - Antes da onda 1 (a base): aba Leis com o molde, exportador e validador, lei pela instituição, revogar, lei com prazo e Ato, e a linha "como chega a você". [planos/leis.md:143-149]
   - Equilíbrio de lados conferido antes de fechar cada instituição. [planos/leis.md:90-91]
   - Instituição inflada se reduz juntando leis. [o-que-e-uma-lei.md:99-104] [o-que-e-uma-lei.md:288]
   - Pronto quando: nenhuma lei sem canal, nenhuma sem nada, nenhuma no centro da bússola sem motivo escrito; planilha → JSON pelo exportador; revogar, prazo, ato e lei pela instituição com teste; a bolha diz como a lei chega à vida das pessoas. [planos/leis.md:158-166]
   - Na planilha, os passos 1 a 3 vão a um modelo simples com `o-que-e-uma-lei.md` na mão. [o-que-e-uma-lei.md:255-257] ⚠ ver Para o revisor: a memória "Agentes simples" (haiku/sonnet para o estudo) e o "Construir junto" (sem rodada de agentes) podem se contradizer.
   - `npm run leis` gera os JSONs; `npm run leis:planilha` faz o caminho de volta. [src/motor/leis/leis.md:54-56] [requisitos.md:64]

5. **Ligações.**
   - Estado: instituição inflada se reduz; ministério é caixa de instituições inteiras. [memória project_esfera_ministerio]
   - Planilha "gdd - Leis por instituição.tsv": colunas Instituição, Lei, O que faz, Dinheiro, Índices que mexe, Devia estar em (autor); 56 linhas com a coluna "Devia estar em" preenchida. [cabeçalho e contagem do TSV]
   - Planilha "gdd - Instituições novas.tsv": colunas Instituição, De onde vem, Tem ministro?, Situação, Leis (lembrete), Anotações do autor; 37 linhas "decidida". [cabeçalho e contagem do TSV]

6. **Referências.** Autor: "Não abrir revisão lei por lei" (calibração) [SKILL sisgov-lei-boa:76]. Estudos de jogadores. [pesquisa-jogadores-14nov.md:8-30]

7. **No motor hoje.** Feito: base da onda 1 (planilha, exportador, validador, lei pela instituição, revogar). [planos/leis.md:6-8] Falta: as 4 ondas (R7.22 ◐). [requisitos.md:165]

8. **Em aberto.**
   - Se a ordem das ondas muda (decisão 6, aprovada como recomendado). [planos/leis.md:184] [planos/leis.md:6]
   - Leis a reestruturar: padronizar o formato; o dinheiro que ainda entra e sai "fora das leis" se resolve aí. [gdd.md:2073-2074]
   - Pendência: a lei Organização dos ministérios (escada de 4 degraus) ainda não existe. [gdd.md:2068-2069]

---

## IV.15 Lei boa e lei ruim

1. **O que é.** A lista de casos que o autor classificou, com as palavras dele; cada lei passa por esta página antes de ser mostrada. [SKILL sisgov-lei-boa:8-10]

2. **O que o jogador faz e sente.** O autor julga a lei pelo que o jogador consegue fazer com ela. [SKILL sisgov-lei-boa:8]

3. **Peças.** Seis conferências antes de mostrar uma lei: já existe na planilha; tipo (Lei, Lei com prazo, Ato, Posição, Operação); em que setor, preço, custo ou índice mexe; ganho e custo; número ou degraus reais; um leigo entende a frase. [SKILL sisgov-lei-boa:86-93]

4. **Regras decididas. O que faz uma lei boa (casos do autor).** [SKILL sisgov-lei-boa:12-32]

| Boa porque | Caso e palavra do autor |
|---|---|
| Mexe num mercado por preço, custo ou demanda | Subsídio a combustíveis: "perfeita, impacto direto no mercado de combustível"; Imposto sobre combustíveis: "perfeita, influencia diretamente o setor" |
| Liga em algo que já existe | Padrões de eficiência "afeta a produtividade da indústria"; Trabalho de presos tira vaga de quem está solto |
| Espalha pela cadeia | Subsídio para comprar máquinas aquece máquinas e aço; Bolsa Família aquece a carne |
| Tem número para testar o extremo | Verba das aposentadorias em % do PIB, com marcas na régua: "PERFEITO"; mandato de 1 a 10 anos e depois indefinido |
| Escada com degrau real | Liberação das drogas; Autonomia das Forças Armadas em 5 níveis |
| Régua por setor | Tarifa de importação em abas |
| Tema com partes vira programa | Tarifa social em 3 leis (luz, água, gás), "formando um programa" |
| Lei pegadinha | Segurar a conta de luz: "lei pegadinha" |
| Escolha com vítima | Escolher quem fica sem luz: "boa" |
| Papel que obriga a escolher | Assinar por cima, com escândalo, ou atrasar a licença e arriscar o apagão: "isso é perfeito" |
| Régua que reparte a verba | Divisão em 100%: "se eu subir em um setor, vai cair em outro" |
| O presidente assinaria e pronto | Se precisa de etapas, não é lei |

   **O que faz uma lei ruim (defeito, caso real, o que fazer).** [SKILL sisgov-lei-boa:36-67]

| Defeito | Caso real | O que fazer |
|---|---|---|
| Duas opções | Comando da Defesa; câmbio "solto ou travado" | Régua ou escada com degraus reais |
| Poucas opções para tema de números | Reajuste com 3 opções: "isso é realista?" | Régua com número |
| É informação, não lei | Reajuste das aposentadorias | Marca na régua da verba |
| Repete outra lei | Inteligência financeira e Verba de inteligência; Tarifa social em Energia | Procurar na planilha antes, juntar |
| É processo | Órgão anticorrupção; Reforma agrária | Leis empurram as etapas |
| É consequência | Caça aos chefes; Policiamento de manchas | Vira índice |
| Depende de cada caso | Resgate de bancos: "cada banco que quebre" | Vira decisão de evento |
| É opção do menu | Sanções, Estatização | Posição por país ou Operação; a lei controla os limites |
| Dá lucro a um produto | Lei que favorece a carne | Mexer em demanda ou custo |
| Ignora a mecânica criada | "Parte do Estado no setor" | Agir sobre companhias, nunca em fábrica solta |
| Mecânica sem jogo | Triângulo do câmbio: "não tem gameplay" | Dar uma decisão e algo que o jogador veja mudar |
| Só castiga | Trégua: "só debuff" | Toda lei tem ganho e custo |
| Extremo sem sentido | Derrubar a internet; perdoar toda a dívida; alvo Marte: "marte ta fora" | Reduzir ao que um governo faria |
| Literal demais | "Lei contra discriminação" | Dividir no que ela regula |
| Ignora como o setor funciona | "Escolha de quem vende a luz": "energia é monopólio natural" | Conferir a realidade do setor |
| Grande demais | Licenças de petróleo e gás: "dá pra ser mais leis" | Dividir no que o jogador decide |
| Específico demais | Xisto (fracking): "muito específico" | Tirar, ou degrau de lei maior |
| Fora da esfera | Petróleo discutido em Energia: "por que discutir aqui?" | Conferir setor e esfera |
| Virou jogo de construção | "o presidente não toma a decisão disso, não é um jogo de construção" | Fica automático; a lei só dá o dinheiro |
| Dá ao partido o trabalho do órgão | "O PARTIDO não escolhe as OPERAÇÕES" | O órgão age sozinho |
| Fala de empresa e não de gente | Concessão por tipo: "me falta um pouco de povo"; "não é um jogo sobre empresários e empresas, é sobre ser o presidente" | Dizer quem é atendido e quem paga; privatizar é Operação |
| É opção de cada caso | Como o Estado contrata obra: "mais opções para cada obra que uma lei" | Tirar, ou escolha no papel da obra |
| Não é do presidente | Passagem: "ônibus não é federal" | Ver a competência; federal age por programa (passe livre) |
| Direito de outra esfera | Proteção do operário em Infraestrutura | Levar à esfera dona do tema |
| Frase enigmática | Cidade que não fica isolada: "confuso" | Dizer o que muda, sem metáfora |
| Fundo demais para o governo | Quem manda no clube: "Não é um jogo de futebol" | Ver se um governo nacional controla isso |
| Repete a fila ou outra lei | Estátuas e nomes: "complexo, bate com o pedido lá em cima" | Vira pedido na fila; o que outra lei decide fica nela |
| Corte demais | Minério com 2 leis: "somente duas leis?" | Procurar o que o presidente ainda decide |
| Índice sem jogo | Cidades da mina: "não sei se faz sentido para o jogo" | Se Desemprego e o papel já mostram, não criar índice |
| Lado trocado | Verba de segurança "de direita" | O lado segue quem defende no mundo real; verba tem lado pequeno |

   - Índice, conta ou evento: nem todo número é índice. **Conta** da companhia ou do pop, vista na ficha (gasto de energia, produtividade: "por companhia, não é um índice"); **evento** é o que acontece num momento ("apagões são eventos!"); **índice** é o que resume o país. [SKILL sisgov-lei-boa:78-84]
   - Mais regras do formato da lei (skill sisgov-lei): a lei está na lista aprovada pelo autor (fora dela é proposta no chat); escrever o comportamento esperado em 2 a 4 frases; pesquisar a direção em estudo ou consenso, não em outro jogo; efeito sem base clara fica fraco ou fora. [SKILL sisgov-lei:13-20] Lei inventada vale se for plausível. [SKILL sisgov-lei:48]

5. **Ligações.** Gosto: "lei que fala de empresa e não de gente" quebra o princípio 13. [SKILL sisgov-lei-boa:58] [gdd.md:131-132]

6. **Referências.** O próprio autor; pesquisa de jogadores. [pesquisa-jogadores-14nov.md:8-30]

7. **No motor hoje.** Regra de trabalho, não de motor. Validador cobra jeito e canal das leis já triadas. [gdd.md:552-553] [src/motor/leis/leis.md:29-30]

8. **Em aberto.** Quando o autor elogiar ou rejeitar uma lei, acrescentar o caso à skill com as palavras dele. [SKILL sisgov-lei-boa:95]

---

## IV.16 Índices

1. **O que é.** Índice é o que resume o país numa escala de 0 a 100; é a base do país mais a soma das contribuições das leis em vigor. [src/motor/efeitos/efeitos.md:3-5] [SKILL sisgov-lei-boa:84]

2. **O que o jogador faz e sente.**
   - O jogador vê 6 índices principais: PIB real, Desemprego, Inflação, Saúde, Educação (Instrução) e Segurança pública (resume Homicídios, Crimes contra o patrimônio e Sensação de insegurança). Os outros são subíndices, embaixo do principal. [gdd.md:715-719]
   - Alerta do índice: cor do anel pelo nível, seta pela tendência (compara com 8 meses atrás, corte de 2 pontos). [requisitos.md:416]
   - **Visível e invisível (07/nov):** o visível aparece na tela; o invisível o motor calcula, e o jogador só o sente pelo que acontece (greve, surto, notícia). [gdd.md:726-727]
   - Painel Atrapalham / Ajudam de ministro, instituição e índice. [requisitos.md:418]

3. **Peças.**
   - **Essenciais** (do motor, com as contas entre eles): população, ocupados, desemprego, PIB real e nominal, crescimento, preços, inflação, receita, gasto, resultado, dívida, juros. [gdd.md:707-709]
   - **Jogabilidade** (dados do mundo): padrão de vida, instrução, industrialização, saúde, segurança pública, pobreza, desigualdade, corrupção, liberdades, polarização, meio ambiente, reputação internacional, segurança externa, aprovação, índice da bolsa e confiança do mercado. [gdd.md:710-714]
   - Planilha "leis - Índices.tsv": 147 índices (43 "Existe", 104 "A criar"; 6 com Principal = Sim). Colunas: Esfera, Índice, Situação, O que mede, Bom é, De onde vem, Leis que mexem direto, Recebe de, Efeito hoje, Efeito proposto, Cobrado por, Mecânica, Liga com, Arquivo, Ligação, Na tela, Revisão, Principal. [cabeçalho e contagem de "leis - Índices.tsv"]
   - **Índice tem dono (13/nov, feito 14/nov):** uma instituição, um poder ou o país; fica preso, no mapa, ao ministro que leva a maior parte das leis ligadas a ele. [gdd.md:724-725] [mecanicas.md:486-490] [indices-avaliacao.md:44-46]
   - **Índice é gatilho:** as narrativas futuras disparam quando um índice sobe ou passa de um limite; os gatilhos só se escrevem depois do motor e dos índices prontos. [gdd.md:728-732]
   - Estatística (ideia 13/nov): o presidente pode parar de medir, esconder os números da mídia ou mentir neles; o jogador vê o índice real, a mídia vê com atraso e desconfiança. [gdd.md:2038-2040]

4. **Regras decididas.**
   - **Índice novo só com decisão do autor.** [gdd.md:720] [SKILL sisgov-lei:30-32]
   - **Todo índice tem efeito:** ele muda algo no país, além de ser cobrado pelos grupos. [gdd.md:721-723]
   - **Avaliar um índice (04/nov):** ligar tudo o que ele exige e criar o que falta; registrar em `indices-avaliacao.md`. O avaliado vai para "Avaliados"; o que foi ligado ou criado e ainda não passou por avaliação vai para "Não avaliados". [memória feedback_avaliar_indices] [indices-avaliacao.md:3-8]
   - Um índice está **avaliado** quando o autor decidiu o que o move, o que ele piora ou melhora, e quais grupos o cobram; o número fino fica para o balanço final. [indices-avaliacao.md:3-5]
   - O índice sai da contagem; lei nenhuma mexe nele direto (requisito de rede, 05/nov). [fase-1-redes.md:62]
   - **Índice, conta ou evento:** não criar índice quando o papel e outro índice já mostram (caso Cidades da mina). [SKILL sisgov-lei-boa:66]
   - Cada índice da instituição tem alavanca para os dois sentidos; índice sem lei para algum lado é buraco. [o-que-e-uma-lei.md:216-217]
   - Valor de partida: 50 se o país não disser. [requisitos.md:200]
   - Aprovação = satisfação média dos pops pesada pelo tamanho (R9.9, 12/nov). [requisitos.md:206]

   **Avaliados** (registro de `indices-avaliacao.md`): [indices-avaliacao.md:12-16]

| Índice | Movido por | Empurra | Cobrado por | Data |
|---|---|---|---|---|
| Favela | contagem de casas, preço contra a renda dos pops, leis de moradia | piora saúde, segurança e saneamento | sem trabalho formal | 04/nov |
| Saúde | rede de atendimento, saneamento, favela, vacinação, saúde ambiental | melhora padrão de vida e reduz pobreza | operários, educação e saúde, aposentados | 05/nov |
| Saneamento | contagem da rede (verba, concessão, teto da tarifa, tratamento), conta contra a renda, favela | melhora saúde e meio ambiente | sem trabalho formal, gente do campo | 04/nov |

   - **Não avaliados** (ligados ou criados): Atendimento, Profissionais de saúde, Vacinação, Segurança, Meio ambiente, Padrão de vida, Desigualdade, Emprego informal. [indices-avaliacao.md:22-31]
   - Mudados no passo A do nível 3 (14/nov): Comida na mesa (juntou a Fome); Casas vazias; e novos sem fio ainda: Envelhecimento, Expectativa de vida, Turismo, Prática de esporte, Tensão com estados e municípios. [indices-avaliacao.md:33-42]
   - Ainda não existem: organizações criminosas (desenho pendente, GDD §18); Dependência de drogas, Dependência de jogos e Mercado ilegal (aprovados em 05/nov; desenho em `fase-1-redes.md`). [indices-avaliacao.md:48-53]
   - Desde 14/nov a lista por dono sai de `npx vite-node scripts/grafo-nivel3.ts`. [indices-avaliacao.md:44-46]

5. **Ligações.**
   - Gosto: o índice é o que os grupos cobram. [indices-avaliacao.md:12] [gdd.md:721-723]
   - Economia: índices de preço, favela e déficit derivam da economia (R16.19). [requisitos.md:364]
   - Estado: índice com dono preso à instituição, ao poder ou ao país. [mecanicas.md:488-490]
   - Política: aprovação lida pelo Congresso e pela eleição. [requisitos.md:206]

6. **Referências.** Suzerain: orçamento como número único ("aumentar não muda nada visível"). [pesquisa-jogadores-14nov.md:49-50] Victoria 3: padrão de vida de 1 a 99 pela riqueza. [pesquisa-jogadores-14nov.md:64-65]

7. **No motor hoje.**
   - Feito: essenciais (R9.1), 147 de jogabilidade (R9.2), 6 principais marcados (R9.8), aprovação (R9.9). [requisitos.md:199-201] [requisitos.md:206]
   - Pela metade: inflação que se move (R9.3 ◐); todo índice tem efeito (R9.4 ◐: 127 índices não levam a nada). [requisitos.md:202-203] [mecanicas.md:494]
   - Falta: desemprego e ocupados se movem com a economia (R9.5, depende de R16.27); índice da bolsa (R9.6). [requisitos.md:204-205]
   - Pela metade: causa e efeito, "o que empurra" no índice, "a conta que vem" na lei (R17.15 ◐). [requisitos.md:423]
   - Dono: feito (passo A, 14/nov). [mecanicas.md:490]
   - ⚠ CONFLITO (número): o GDD cita "índices de jogabilidade" em lista curta (16 nomes) [gdd.md:710-714], enquanto o motor tem 147 [requisitos.md:200] [mecanicas.md:486]. Não é conflito de regra, só de granularidade; registrado para conferência.

8. **Em aberto.**
   - Efeito de cada índice (passo B): para cada um, o que ele muda no país além da cobrança dos grupos. [mecanicas.md:492-496]
   - Visível e invisível: quais o jogador vê e quais só sente. [mecanicas.md:498-500]
   - Principais: os subíndices embaixo de cada um e como somam. [mecanicas.md:502-505]
   - Gatilhos: limites que disparam narrativas, só depois do motor pronto. [mecanicas.md:507-509]
   - O que vários índices batendo metas juntos significam. [gdd.md:2163]
   - Índice da bolsa (R9.6). [requisitos.md:205]

---

## IV.17 Serviços do Estado e Vícios (conteúdo ligado às leis)

Esta seção guarda o que o autor decidiu em 05/nov em `fase-1-redes.md`. Conferido contra as fontes novas: a **arquitetura** ficou suspensa (autor, 05/nov) e os mecanismos "se decidem depois da planilha". [fase-1-redes.md:38-39] O que ainda vale como desenho vem abaixo; mecânicas diz que os serviços do Estado como prédios ainda **faltam**. [mecanicas.md:405-408]

1. **O que é.** Rede é um serviço que o Estado presta (saúde, saneamento, educação, segurança); todas têm as mesmas peças: capacidade, desgaste, quem opera, privado, bolso, procura, índice, empurra, desvio. [fase-1-redes.md:19-31]

2. **O que o jogador faz e sente.** O jogador vê o efeito na ficha e no mapa, com o dinheiro junto. [fase-1-redes.md:67]

3. **Peças.**
   - Quatro redes: Saúde, Saneamento, Educação, Segurança. Moradia não é rede (é estoque de casas); proteção social é transferência de renda. [fase-1-redes.md:21-34]
   - Requisitos de uma rede: o índice sai da contagem; a mesma lei muda de sentido pelo estado do país, sem condição escrita; toda alavanca tem ganho e custo; o país começa parado (turno 0 nada anda sozinho); o motor não conhece nome de lei, índice nem esfera. [fase-1-redes.md:60-67]
   - **Vícios** (fechado em 05/nov): não é área própria nem rede; é consumo regulado em dois temas, drogas e jogos. 12 leis e 3 índices (Dependência de drogas, Dependência de jogos, Mercado ilegal). [fase-1-redes.md:71-73] [fase-1-redes.md:105-111]
   - As 12 leis: Liberação das drogas, Imposto das drogas, Venda pelo Estado, Lojas licenciadas, Cuidado com o usuário, Liberação dos jogos, Imposto dos jogos, Monopólio do Estado, Licenças de apostas, Proteção do apostador, Propaganda e embalagem, Fiscalização e repressão. [fase-1-redes.md:86-99]
   - As escadas de liberação de Drogas e de Jogos têm 6 níveis (0 a 5). [fase-1-redes.md:75-82]
   - A conta do turno por tema, em 5 passos: procura, consumo legal, mercado ilegal, dependência, dinheiro. **Liberar sem ninguém vendendo não abre mercado.** [fase-1-redes.md:116-125]
   - Pesquisa de vícios (05/nov): proibir fortalece o crime; legalizar não acaba com o mercado ilegal na hora; contrabando vem do Estado fraco; dureza rende rápido e cobra depois. [vicios.md:9-24]
   - Na planilha de hoje, 11 linhas citam drogas ou jogos; Liberação das drogas ainda sem jeito. [contagem de "gdd - Leis.tsv"]

4. **Regras decididas.**
   - Fase em 3 momentos: desenhar a fase inteira, decidir tudo de uma vez, produzir até o fim sem parar. [fase-1-redes.md:7-15]
   - Vícios, colisões: Venda pelo Estado × Lojas licenciadas; Monopólio × Licenças de apostas. [fase-1-redes.md:101]
   - A Liberação cruza a bússola, exceção pedida pelo autor. [fase-1-redes.md:102-103]

5. **Ligações.**
   - Saúde: dependência de drogas aumenta a procura da rede; a fila cresce e o `atendimento` cai. [fase-1-redes.md:129-131]
   - Segurança: repressão sobre mercado grande sobe `lotacao_presidios`. [fase-1-redes.md:131-132]
   - Atendimento no motor: planos primeiro, rede pública depois, profissionais e vagas. [src/motor/atendimento/atendimento.md:7-15]
   - Custo das leis de saúde: fica em `custo`, fração do PIB que entra no gasto do governo, sem lei de verba. [src/motor/atendimento/atendimento.md:92-93]

6. **Referências.** `docs/jogo/estudos/vicios.md`: Portugal, Canadá, Uruguai, Suíça, Escócia, Noruega, Suécia, Singapura, Macau, Reino Unido, Brasil. [vicios.md:85-108]

7. **No motor hoje.** Atendimento e saneamento têm código próprio (`motor/atendimento`, `motor/saneamento`); mecânicas marca serviços do Estado como prédios (R16.31 ☐) e terceirizar por lei (R16.32 ☐) como falta. [mecanicas.md:405-408] Não achei fonte nova que diga que `motor/rede` foi feito; está "suspenso". [fase-1-redes.md:38-39]

8. **Em aberto.**
   - Decisões 1 a 4 do desenho de redes (quais esferas, migrar antes, Educação com índice de vagas, Segurança com presídio na mesma rede) nunca foram aprovadas em fonte nova. **ESTUDAR** com o autor. [fase-1-redes.md:147-153]
   - Segurança e Educação não têm rede; as leis de Educação e Segurança só vêm quando essas redes forem desenhadas. [fase-1-redes.md:141]
   - Tribunal de drogas e Controle de lavagem esperam a Segurança. [vicios.md:34]

---

## Para o revisor

### (a) Todos os ⚠ CONFLITO

1. **Escolha:** GDD §7 (14/nov), plano das leis, motor, planilha (7 leis) mantêm o jeito Escolha; `o-que-e-uma-lei.md` (14/nov) revoga explicitamente. [gdd.md:537] [planos/leis.md:47] [o-que-e-uma-lei.md:59-60] (IV.3)
2. **Formas "Dois controles" e "Meta e prazo"** (GDD §7) × R7.15 (formas divididas). [gdd.md:580-581] [requisitos.md:159] (IV.3)
3. **"Um lado por lei" × "régua sem limite"** (e níveis "num lado só"). [gdd.md:646-653] [o-que-e-uma-lei.md:92-97] (IV.3)
4. **"Nada" como degrau** (skill, Liberação das drogas; nível 0 "tudo proibido") × regra de 14/nov de que nada = não legislada. [SKILL sisgov-lei-boa:24-25] [fase-1-redes.md:75] [gdd.md:541-543] (IV.3)
5. **Verba e transferência:** "dá a uma instituição" × "canal verba ou transferência". [o-que-e-uma-lei.md:73-75] [gdd.md:535] (IV.3)
6. **Atraso zero:** "na hora" (GDD) × "no turno seguinte" (motor). [gdd.md:562] [src/motor/efeitos/efeitos.md:11-12] (IV.13)
7. **R7.16 (Lei com prazo e Ato) ☐** em requisitos e mecânicas × motor e plano que dizem pronto. (IV.2)
8. **R7.8 (revogar) ☐** em mecânicas × ✅ em requisitos e motor. (IV.10)
9. **R7.11 (lei pela instituição) ☐** em mecânicas × ✅ em requisitos e motor. (IV.11)
10. **Número de programas:** 74 (GDD) × 73 (requisitos e mecânicas). (IV.8)
11. **Quantas leis chegam ao pop por um caminho do motor:** 120 de 512 (requisitos) × 173 de 511 fora de "espera" (contagem do TSV). (IV.1)
12. **Número de leis:** 512 (plano, "Leis por instituição") × 511 linhas (`gdd - Leis.tsv`). (IV.intro)
13. **Granularidade dos índices** (16 nomes no GDD × 147 no motor): não é conflito de regra; registrado para conferência. (IV.16)

### (b) O que ficou ESTUDAR

- Tipos de lei: sem referência de jogo ou estudo. (IV.2)
- Colisão e revogar: sem referência. (IV.10)
- Lei pela instituição: outros jogos com órgão e verba. (IV.11)
- Programas: outros jogos com pacote de leis. (IV.8)
- Como as 7 leis com jeito Escolha na planilha viram Níveis. (IV.3)
- Se alguma lei de Governo precisa de canal próprio. (IV.4)
- O que o motor faz hoje com a escassez "gente" por lei. (IV.6)
- Decisões 1 a 4 do desenho de redes (05/nov) nunca aprovadas em fonte nova. (IV.17)

### (c) Fontes não lidas ou lidas só em parte

- Lidas só em parte: `gdd.md` (seções 7, 9, 3 e partes da 18; as demais não); `mecanicas.md` (seções 6, 7, "A base" e 5.13); `requisitos.md` (R4.11, R6, R7, R9 e linhas citadas); `atendimento.md` (trechos); `calculos.md` (inteiro); `vicios.md` (inteiro); `pesquisa-jogadores-14nov.md` (inteiro, só seção 1 usada de fato).
- TSV: só cabeçalhos, colunas e contagens ("gdd - Leis.tsv", "gdd - Leis por instituição.tsv", "gdd - Instituições novas.tsv", "leis - Leis - roteiro.tsv", "leis - Programas.tsv", "leis - Programas - leis.tsv", "leis - Índices.tsv", degraus e efeitos).
- Não lidos: `leis-inventario.md` e `leis-do-brasil.md` (relatórios gerados, só existem); `docs/jogo/mecanicas.md` seções além da 7; memórias fora de leis (por regra).
- `leis-situacao.md` (05/nov): lido; superado pela revisão de 14/nov (71 leis, "só leis de rede são reais" × 512 leis e revisão por instituição). Nada foi trazido dele.
- `fase-1-redes.md` (05/nov): trazido só o que ainda vale como desenho e os Vícios; arquitetura suspensa, não trazida como decisão.
- Skill `sisgov-lei` menciona "esferas" e "público e privado são esferas separadas" (esfera foi substituída por instituição em 13/nov): trecho desatualizado, não trazido como regra.
- Nota de memória: "Agentes simples" (haiku/sonnet para o estudo) e "Construir junto" (sem rodada de agentes) e `o-que-e-uma-lei.md:255-257` (passos 1 a 3 a um modelo simples) podem se contradizer; fora do tema leis, só sinalizado.
