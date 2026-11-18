# I. O jogo (rascunho, 14/nov/2026)

Parte I do GDD novo, mais os anexos de regras de conteúdo e glossário. Junta o que já está decidido. Nada é invenção desta parte. Cada frase leva a fonte entre colchetes.

---

## I.1 Visão e identidade

1. **O que é.** SisGov é um simulador de governo em português: quem joga assume a Presidência de um país, assina leis e vê o efeito no dinheiro, nos indicadores e na opinião da população. [resumo-para-outro-chat.md:7-9] Em termos do GDD: você é o partido que acabou de vencer a eleição e precisa continuar no poder governando por leis. [gdd.md:23-24]

2. **O que o jogador faz e sente.**
   - Quem joga é o partido, não uma pessoa. Presidentes, ministros e candidatos passam; o partido fica enquanto vencer. [gdd.md:26-28]
   - O governo age por leis. O Estado pode comprar empresas e ações e financiar obras, mas quem constrói é a economia. [gdd.md:29-32]
   - Governar é administrar a máquina pública (instituições, ministros, verbas e leis), seja de esquerda ou de direita. [gdd.md:33-36]
   - Não há meta pronta: o jogador leva o país para onde quiser. [gdd.md:37-38]
   - O jogador controla tudo o que um governo controla. [gdd.md:39-40]
   - Quando dá certo, ele sente um grupo contrário passar a apoiar, a indústria voltar a contratar, a eleição vencida por pouco. Quando dá errado, entende por quê, e nunca parece azar. [gdd.md:230-235]
   - Vê o país mudar sem placar: PIB, empresas, empregos, pessoas enriquecendo ou empobrecendo. [gdd.md:236-237]
   - O que o autor chama de "jogo não está jogável" é o jogador não sentir modificação, não importa o que faça. Dilemas, eventos e ligações genéricos não bastam. [memória project_jogo_nao_sente]
   - O jogador é criativo, gosta de testar o extremo e de números, mesmo os que não aparecem na tela. Por isso a lei tem régua com número, não duas ou três opções em palavras. [memória user_publico_alvo; resumo-para-outro-chat.md:18-19]
   - O autor recusou cortar um núcleo de ~40 leis: o jogo deve ter centenas de caminhos. Quem foca numa área (segurança, por exemplo) pode ganhar a eleição nessa promessa. [memória project_caminhos_sem_nucleo]

3. **Peças.** O que faz o SisGov ser o SisGov (quatro pontos):
   - **Política de verdade, não gestão.** O difícil é aprovar, pagar e sobreviver à lei. Cada lei passa pelo Congresso, pela mídia, pelos grupos e pelo cofre. [gdd.md:49-51]
   - **Você é um partido com gente dentro.** Pessoas com ficha erram, brilham, traem e morrem; o partido sobrevive a elas, ou não. [gdd.md:52-54]
   - **A conta sempre chega.** O que agrada hoje cobra depois, pela contabilidade, pela economia ou pela urna. [gdd.md:55-56]
   - **O país vive sozinho.** Empresas abrem e fecham, a mídia escolhe lado, os outros países mudam de ideia. [gdd.md:57-59]
   - **Gênero:** simulador político de governo, com economia viva de empresas, obras e bolsa. [gdd.md:44-45]
   - **A Bússola é a raiz.** Todo mundo e toda lei têm lado: esquerda ou direita (economia), libertário ou tradicional (costumes). Nenhuma lei é neutra. [resumo-para-outro-chat.md:10-12; gdd.md:63-64]
   - **Toda lei é uma bolha no mapa.** O jogador decide abrindo a bolha. Painéis só mostram. [resumo-para-outro-chat.md:16-17]

4. **Regras decididas.**
   - Perder é perder o poder federal; a partida acaba. Jogar como oposição fica para depois. [gdd.md:41-43] (12/nov)
   - Países reais podem entrar: as 10 maiores economias jogáveis; empresa, pessoa e direito autoral seguem de fora. [memória project_paises_reais] (08/nov)
   - Narrativas e gatilhos só depois do motor e dos índices prontos. [memória project_narrativas_no_final] (07/nov)
   - O jogo não fala de lado político ao jogador. O lado do partido sai das pessoas da chapa. [gdd.md:103-106]
   - Antes de qualquer lei: "um presidente real assinaria e pronto, ou é um processo?". [resumo-para-outro-chat.md:133-134]
   - Fora do jogo pronto: guerra iniciada pelo país, pesquisa e tecnologia como árvore. [gdd.md:2195-2196] (decidido)

5. **Ligações.** A visão é entregue às demais partes pelos princípios (I.5) e pelo ciclo (I.2). —

6. **Referências.**
   - Victoria 3: só como ideia. [gdd.md:44-45; gdd.md:2200]
   - A ligação economia → pop → política → economia do Victoria 3 é a mais elogiada do gênero; Frostpunk tem ligação fraca; Democracy 4 tem ligação que ninguém entende. [mecanicas.md:42-45]
   - Nada do Democracy 4 entra (nome, número, ligação). [gdd.md:2200]
   - Estudo de mercado do Victoria 3: [mercado-vic3-referencia.md] (citado em gdd.md:2225; não lido nesta parte).
   - Referência de "visão" para um jogo de governo com personagens: ESTUDAR.

7. **No motor hoje.**
   - ✅ Escolher país: `brasil-2026`. [requisitos.md:62] (R4.3)
   - ◐ A partida só acaba pela eleição. [requisitos.md:63] (R4.4)
   - ☐ Placar final: tempo no poder e país deixado. [requisitos.md:71] (R4.7)
   - A "visão" em si não é peça de código. —

8. **Em aberto.**
   - O que o placar final mostra (tempo no poder, país deixado: quais números, comparados com o começo?). [mecanicas.md:106-107]
   - Jogar como oposição depois de perder o poder: para depois. [gdd.md:2123]

---

## I.2 O ciclo das 3 mecânicas

1. **O que é.** O jogo gira em torno de três grandes mecânicas, que se controlam em ciclo: Gosto (a população e como ela funciona), Economia e Leis. [decisão do autor, 14/nov, passada na tarefa; não encontrei escrita com esses três nomes em mecanicas.md]

2. **O que o jogador faz e sente.** O jogador mexe numa ponta (uma lei) e sente a volta pela outra: o ciclo não tem começo nem fim. [gdd.md:68-69] O jogo quer a ligação do Victoria 3: a economia mexe no pop, o pop mexe na política, a política (as leis) mexe na economia. [mecanicas.md:42-44]

3. **Peças.**
   - **Gosto:** a população e como ela funciona. [decisão do autor, 14/nov, passada na tarefa]
   - **Economia:** [decisão do autor, 14/nov, passada na tarefa]. Hoje no GDD é um dos três pilares, "tão importante quanto População e Governo". [gdd.md:1279-1280]
   - **Leis:** [decisão do autor, 14/nov, passada na tarefa].
   - **Em volta:** Congresso, eleição, partido, Judiciário, mídia, mundo, tela e narrativas. [decisão do autor, 14/nov, passada na tarefa]
   - Hoje o GDD diz que Política não é um quarto pilar: partidos, grupos, Congresso e eleição são o caminho pelo qual a População controla o Governo. Mundo não é pilar: pressiona os três. [gdd.md:80-82]
   - Bolsa é onde o ciclo vira preço: lei muda lucro, lucro muda a ação, a ação muda o patrimônio dos pops, e os pops reagem no voto e no investimento. [gdd.md:83-84]

4. **Regras decididas.**
   - ⚠ CONFLITO: o GDD (14/nov, §2) diz que os três pilares são **População, Economia e Governo**, com a População no centro. [gdd.md:66-67] A decisão de 14/nov diz que as três mecânicas são **Gosto, Economia e Leis**, com Congresso e demais "em volta". [decisão do autor, 14/nov, passada na tarefa] Nenhuma das duas fontes diz que revoga a outra. Não escolhi.
   - A Bússola é a raiz: tudo o que existe no ciclo tem posição nela, e a distância diz quem gosta de quê. [gdd.md:63-64] (07/nov) [memória project_base_ciclo]
   - Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. [gdd.md:131-132] (05/nov) [memória project_base_ciclo]
   - A lei não diz quem gosta dela: diz onde mexe no dinheiro e na vida, e o gosto nasce daí. A Bússola continua, com peso menor que o bolso. [mecanicas.md:47-51] (14/nov)
   - ⚠ CONFLITO: "Nenhuma lei fala de grupo; quem gosta sai da Bússola" [resumo-para-outro-chat.md:132] (08/nov) e "gostar de uma lei sai da distância entre a lei e a pessoa na Bússola" [resumo-para-outro-chat.md:12-13] contra "o gosto nasce do bolso; a Bússola tem peso menor" [mecanicas.md:49-51] (14/nov). A versão de 14/nov não diz "substitui" o resumo, e diz que a Bússola "continua". Não escolhi.
   - Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula, fica guardado ou sai do país. [mecanicas.md:52-53] (14/nov)
   - O porquê à vista: todo número que o jogador sente mostra de onde veio ao passar o mouse (SisGovpedia). [mecanicas.md:54-55] (14/nov)
   - Ordem decidida: primeiro o dinheiro (caminho e conservação), depois o gosto pelo bolso, depois a revisão das leis instituição por instituição. [mecanicas.md:62-64] (14/nov)
   - Cada módulo (população, leis, economia) funciona sozinho; as ligações vêm depois, no conteúdo das leis. [memória feedback_modulos_independentes] (31/out)
   - Pop, grupo e organização são camadas diferentes; organização nasce durante a partida. [memória project_tres_camadas] (06/nov)

5. **Ligações.**

   | De | Para | Como controla | Fonte |
   | --- | --- | --- | --- |
   | População | Economia | trabalha, consome e investe | [gdd.md:73] |
   | Economia | População | paga salário, dá emprego e define preços | [gdd.md:74] |
   | Economia | Governo | gera o dinheiro dos impostos | [gdd.md:75] |
   | Governo | Economia | cobra, gasta e regula por lei | [gdd.md:76] |
   | Governo | População | dá serviços, renda e direitos | [gdd.md:77] |
   | População | Governo | vota, apoia e protesta | [gdd.md:78] |

   (A tabela usa os nomes da seção 2 do GDD; ver o conflito de nomes acima.)

6. **Referências.** Victoria 3 (ligação economia, pop e política). [mecanicas.md:42-45] Estudo de como fazer a opinião sem copiar outro jogo: ESTUDAR. [RETOMAR.md:38; gdd.md:2079-2080]

7. **No motor hoje.**
   - Hoje (conferido 14/nov): a satisfação do grupo lê renda, índices cobrados e bússola das leis. O bolso só se mexe por imposto de renda e transferência. As outras ~480 leis agradam ou irritam só pelo ponto chutado na bússola. A verba gasta não chega a ninguém, exceto a transferência. [mecanicas.md:56-60]
   - Mecânica de cada ponta: ver as partes II (Gosto), III (Economia) e IV (Leis) do GDD novo. —

8. **Em aberto.**
   - Onde ficam Tesouro e instituições (dentro de qual das três mecânicas, ou em volta). EM ABERTO. [decisão do autor, 14/nov, passada na tarefa]
   - O nome e o lugar do que hoje se chama "Governo" no ciclo. [conflito acima]
   - Como a renda de cada pop sai de salário e lucro sem o turno 0 mudar de valor; quanto falta de trabalhador freia a produção. [gdd.md:2127-2128]
   - Opinião central: estruturar direito uma mecânica própria, com a mesma régua para todo ator, desenhada inteira antes do código e antes de padronizar as leis (10b). [gdd.md:2075-2084]

---

## I.3 A partida: começo, mandato e fim

1. **O que é.** O esqueleto do jogo: escolher o país, montar o começo, passar turnos, acabar. [mecanicas.md:70]

2. **O que o jogador faz e sente.**
   - Escolhe o país e cria o partido com nome e sigla. Não escolhe lado, posição nem bússola. [gdd.md:138-141]
   - Monta a chapa de três vagas (presidente do partido, candidato a presidente, vice) com pessoas de todos os partidos; é assim que nascem as coligações. A chapa já venceu. [gdd.md:142-145]
   - Monta o governo: primeiro o tamanho numa régua (Enxuto, Clássico, Do país, Inchado), depois as caixas e os ministros. [gdd.md:153-157]
   - Inicia e governa. [gdd.md:158]
   - Conhece cada pessoa pelo perfil de rede social dela, sem rótulo de lado: o jogador deduz, como na vida real. [gdd.md:172-181]
   - Descobre o lado do próprio governo pelas consequências, não por um rótulo. [gdd.md:166-168]
   - Sente o que é difícil: o resultado demora, cada lei agrada um grupo e irrita outro, aliado cobra, a mídia decide o que o eleitor vê, o desgaste sobe sempre. [gdd.md:222-226]

3. **Peças.**
   - Começo da partida. [mecanicas.md:72]
   - Fatos do turno. [mecanicas.md:93]
   - Fim e placar. [mecanicas.md:102]
   - Salvar e carregar. [mecanicas.md:109]
   - A rede da pessoa e a inteligência (botão Espiar, registro que pode vazar). [gdd.md:170-196]
   - Histórico do país: cada país declara golpes, crises, guerras, governos, empresas e mídias tradicionais; o que não declara, os geradores criam. [gdd.md:160-164]

4. **Regras decididas.**
   - Como se chega lá: o país começa como está e o partido que governava vira oposição. O jogador entra com uma história ("no meio de uma polarização, você surge como a salvação do país"): partido novo, poucas cadeiras, presidente popular. A Aprovação começa alta e a base se constrói com coligação. [gdd.md:146-150] (12/nov)
   - No começo, o jogador pode pôr o partido que governava na coligação. [gdd.md:150-151] (12/nov)
   - Governo: o tamanho vem numa régua; os ministros são sorteados pela chapa e cada cadeira troca por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista. [gdd.md:153-157] (13/nov)
   - A rede é uma só, sem nome, e resume todas as redes do país. Informações pessoais aparecem conforme a Verba de inteligência e os Poderes da agência; espiar fere a privacidade e fica num registro que pode vazar. [gdd.md:183-196] (07/nov)
   - Mandato: a duração da lei do país (4 anos = 24 turnos). No fim há eleição; vencer abre outro mandato, com desgaste maior. [gdd.md:214-215]
   - A partida termina quando o partido perde o poder federal. Não há vitória final: o placar é quanto tempo o partido governou e que país deixou. [gdd.md:216-218]
   - Partido novo com 6% das cadeiras; o antigo governo vai para a oposição ou para a coligação. [mecanicas.md:74-76]
   - Tela de início em sequência: país, partido, chapa, governo, ministros, iniciar. [requisitos.md:70] (13/nov)
   - O lado do partido sai da média da bússola da chapa, que define os 5 grupos que ele defende. [requisitos.md:68] (12/nov)
   - A sigla do partido vira o id e não pode repetir a de outro. [requisitos.md:66] (12/nov)
   - Salva sozinho; menu no brasão. [mecanicas.md:111] (R17.3, R17.23)
   - Sem pontos de ação por turno: o limite vem do mundo (Congresso cheio), só atrasa, nunca proíbe. [memória feedback_sem_pontos_de_acao] (11/nov)
   - ⚠ CONFLITO: ministros "ficam para o final do projeto; prioridade é o jogo jogável" [memória project_ministros_no_final] (30/out) contra a partida atual com ministros na tela de início e o passo 5 "Governo" na ordem de construir [requisitos.md:465; requisitos.md:70] (12-13/nov). Nenhuma diz que revoga a outra. Não escolhi.

5. **Ligações.**
   - Recebe: país (dados em `conteudo/paises/<id>/`: estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos). [requisitos.md:75]
   - Entrega: partido e chapa ao Partido e à Política (base de grupos e posição na bússola); governo e ministros ao Estado; fatos do turno a Congresso, mesa, mídia, programas e eleição. [requisitos.md:75-76; requisitos.md:28-35]
   - Fato do turno é um aviso que um módulo deixa e quem se importa lê: liga Congresso, mesa, mídia, programas e grupos sem um chamar o outro. [requisitos.md:32-35]

6. **Referências.**
   - Jogo de partida com começo escolhido e fim por perda do poder: ESTUDAR.
   - Rede social do político como forma de conhecer pessoa: ESTUDAR.

7. **No motor hoje.**
   - ✅ R4.1 Turno de 2 meses, mandato de 24 turnos. [requisitos.md:60]
   - ✅ R4.3 País `brasil-2026`. [requisitos.md:62]
   - ◐ R4.4 Acaba só pela eleição. [requisitos.md:63]
   - ✅ R4.5 Criar partido. ✅ R4.6 Chapa. ✅ R4.8 Lado pela chapa. ✅ R4.10 Tela de início. [requisitos.md:66-70]
   - ◐ R4.9 Falta a Aprovação começar alta. [requisitos.md:69]
   - ✅ R4.11 Mundo sai da planilha `gdd.xlsx` (`npm run leis`). [requisitos.md:64]
   - ✅ R4.12 Fatos do turno em `motor/fatos`; hoje escrevem Congresso e Política. [requisitos.md:65]
   - ☐ R4.7 Placar final. [requisitos.md:71]
   - Salvar e carregar: feito (R17.3, R17.23). Partida salva antiga é trocada pelo valor de partida do país ao carregar. [mecanicas.md:111; RETOMAR.md:24-26]
   - Resumo no requisitos.md: 9 feitos, 2 parciais, 1 faltando na seção Partida e turno. [requisitos.md:57-58]

8. **Em aberto.**
   - A Aprovação começa alta: de quanto e quanto tempo dura a lua de mel? [mecanicas.md:78-79]
   - A história de entrada aparece como texto, tela ou só nos números? [mecanicas.md:80-81]
   - O que um país precisa declarar para ser jogável (lista de arquivos obrigatórios)? Só o Brasil 2026 existe. [mecanicas.md:82-83]
   - Quais mecânicas ainda não escrevem fato (ministro, instituição, economia, mundo) e quais fatos cada uma precisa. [mecanicas.md:98-99]
   - Regras de encadeamento: fato gera fato (escândalo, CPI, queda). [mecanicas.md:100]
   - Os outros caminhos de perder o poder (mecânica 12) e o placar final. [mecanicas.md:105-107]
   - Partida salva antiga quando o formato muda (hoje se perde ou se remenda no código). [mecanicas.md:112-113]

---

## I.4 O turno

1. **O que é.** Um turno dura 2 meses (6 por ano). [gdd.md:198; memória project_jogo_nao_sente] Em código: `avancarTurno(regras, estado, pedidos)` devolve um novo estado; mesma semente e mesmos pedidos dão a mesma partida. [turno.md:3-5]

2. **O que o jogador faz e sente.** Cinco passos: [gdd.md:200-210]
   1. **Lê o país** no mapa: bolhas de leis e índices, grupos satisfeitos ou não, mídias, países, manchetes. [gdd.md:200-202]
   2. **Age:** propõe leis (vendo antes quem ganha e quem perde), troca ministro, negocia com aliados; em tempo de campanha, faz campanha. [gdd.md:203-204]
   3. **Despacha a mesa:** assina, veta, recusa, encaminha ou deixa na pilha os papéis. [gdd.md:205-207]
   4. **O Congresso vota.** Passa quem tem votos; o exorbitante cai. [gdd.md:208]
   5. **Passa o turno:** efeitos chegam, alguns agora, outros anos depois; a mídia reage; acontecem fatos (escândalo, choque de preço, atentado). [gdd.md:209-211]

3. **Peças.** Ordem das etapas no motor hoje (passo 8): [turno.md:7-25]
   1. Congresso. 2. Leis novas. 3. Efeitos. 4. Economia real. 5. Preços e juros. 6. Contas. 6b. Moradia. 7. Jogabilidade. 8. Pops e grupos. 8b. Governo. 8c. Programas. 9. Política. 9a. Eleição. 9b. Mídia. 10. Invariantes.
   - Detalhe de cada etapa: [turno.md:9-25] (não repito aqui).

4. **Regras decididas.**
   - O estado anterior não muda; o acaso mora no estado. [turno.md:3-4]
   - Lei do mundo fora da lista do país fica não legislada: não arrecada, não gasta, não mexe em índice. Um pedido a legisla e os efeitos andam de zero até o valor novo. [turno.md:27-29]
   - Cada efeito declara quanto tempo leva para chegar inteiro. [gdd.md:113-114] (princípio 6)
   - O módulo `turno` só chama os módulos em ordem e junta os fatos; a regra fica no módulo dela. Hoje o `turno` tem ~2.500 linhas com regra dentro, para tirar aos poucos. [requisitos.md:77]
   - Fatos do turno somem em 1 a 3 turnos, pelo tamanho. [requisitos.md:65] (12/nov)
   - A seta de tendência na tela compara com 8 meses atrás, corte de 2 pontos. [git log, commit 45e74905]
   - Sem sorteio para a lei passar: a aprovação vem do Congresso e dos grupos. [gdd.md:2052-2053] (14/nov)
   - Mudar de ideia custa: propor e desistir de uma lei não pode ser de graça. [gdd.md:2051] (14/nov)
   - Mostrar o atraso: a lei diz "efeito em N turnos". [gdd.md:2049-2050] (14/nov)

5. **Ligações.** O turno chama Congresso, efeitos, economia, contas, moradia, população, grupos, governo, programas, política, eleição e mídia, e fecha conferindo invariantes. [turno.md:9-25] A ordem por mapa de dependência está em `docs/jogo/arquitetura.md`. [gdd.md:2222] (não lido nesta parte)

6. **Referências.** Plano de desenvolvimento (a ordem das etapas veio da seção 5 do plano). [turno.md:7] Referência externa de ordem de turno em simulador de governo: ESTUDAR.

7. **No motor hoje.**
   - ✅ R4.1, R4.2 (turno e efeitos com atraso). [requisitos.md:60-61]
   - ✅ R4.12 Fatos. [requisitos.md:65]
   - Etapas feitas até o passo 8: todas as listadas em I.4 item 3. [turno.md:7-25]
   - Comportamento esperado testado (passo 4): imposto de renda mais alto dá mais arrecadação até o pico e padrão de vida menor, que chega em 2 turnos. [turno.md:31-32]

8. **Em aberto.**
   - A ordem das etapas fica certa quando entrarem mídia, organizações e mundo? (quem lê o fato de quem no mesmo turno) [mecanicas.md:90-91]
   - Efeito da mídia: hoje o jornal só mostra manchetes e nenhuma notícia mexe em grupo, voto ou aprovação. [gdd.md:2085-2089]
   - Passo do turno "Governo" e "Programas" dentro das três mecânicas: ver lugar de Tesouro e instituições (I.2 item 8).

---

## I.5 Princípios (as regras que nunca mudam)

1. **Leis são o núcleo do governo.** Tudo o que o Estado faz passa por lei; mudar uma lei muda o jogo. [gdd.md:88-89]
2. **Decisão de governo é uma bolha de lei no mapa**, nunca um painel de gestão. Decisões do partido (chapa, ministros, coligação, campanha) são escolhas curtas, sem painel. O que os outros propõem chega como papel na mesa. [gdd.md:90-95; memória feedback_lei_e_bolha]
   - **Lei x decisão (08/nov):** lei é regra permanente e tem bolha; decisão do presidente (Ato ou Operação) aparece ao clicar num país ou companhia, tem custo, tempo e reação, e é limitada pelas leis. [gdd.md:96-98; memória feedback_leis_x_decisoes]
3. **Nenhuma lei é um controle só que faz coisa grande.** Cada tema se divide em leis menores, cada uma com escolha de verdade. [gdd.md:99-100; memória feedback_leis_se_dividem]
4. **Nada é bom ou ruim.** Toda lei tem ganhadores, perdedores e consequências; textos e cores descrevem. Parecer de direita ou esquerda é resultado, nunca objetivo. O jogo nunca fala de lado ao jogador. [gdd.md:101-106]
5. **Nada aparece do nada (realismo).** A conta sempre fecha: todo dinheiro do Estado entra por lei ou por bem do Estado, e todo gasto sai por lei ou obrigação. Gastar exige imposto, dívida ou emissão. [gdd.md:107-112]
6. **O que dá resultado demora.** Cada efeito declara quanto tempo leva. [gdd.md:113-114]
7. **Decisão no turno, nada neutro.** Toda escolha mexe em algo visível; esperar também é opção. [gdd.md:115-116] Jogável não é demorado: a decisão acontece agora, esperar é vantagem que o jogador escolhe, nunca obrigação. [memória feedback_jogavel_nao_demorado]
8. **Dados primeiro, narrativa depois.** Frases, manchetes e eventos leem os números. [gdd.md:117-118]
9. **Jogabilidade primeiro, realidade como base.** Lei inventada vale se plausível; número na ordem de grandeza certa, sem precisão empírica. [gdd.md:119-120]
10. **O motor conhece o Estado, não os nomes.** Leis, índices, partidos e mídias são dados do mundo; o país declara só o estado de partida e os rótulos locais. [gdd.md:121-124]
11. **O Congresso é a trava, não o jogo.** O jogador propõe qualquer coisa; o exorbitante o Congresso barra. Fora isso, o que segura é a consequência. [gdd.md:125-127]
12. **Pessoas são fichas, não roteiros.** O que elas fazem sai da ficha e do país, não de história escrita. [gdd.md:128-130]
13. **Toda lei chega ao pop.** Por renda, emprego, preço, serviço ou direito. [gdd.md:131-132]

Princípios que estão fora do GDD §3 mas aparecem em outras fontes:
- **Resultado emerge:** a lei não traz condição escrita ("se pobreza > X"); a mesma lei muda de sentido pelo estado do país, pela renda contra a conta. [memória feedback_resultado_emerge]
- **Lados equilibrados:** a lei vai de "nada" a "mais" num lado só; os dois lados da Bússola têm leis próprias. [memória feedback_lados_equilibrados; resumo-para-outro-chat.md:36-37]
- **Texto para leigo:** lei e opção com exemplo do dia a dia, sem jargão, sem cortar a régua numérica. [memória feedback_texto_para_leigo; memória user_publico_alvo]
- **Simulador de governo, não de personalidade:** cada decisão deve ter consequência própria e sentida. [memória feedback_simulador_de_governo]
- **Sem pontos de ação:** o limite vem do mundo e só atrasa. [memória feedback_sem_pontos_de_acao] (já citado em I.3)

---

## Anexo A. Regras de conteúdo

- Nada do Democracy 4 (nome, número, ligação). Victoria 3 só como ideia. [gdd.md:2200]
- Países reais podem entrar (autor, 08/nov); pessoa, empresa e o que tem direito autoral não. Retratos genéricos para pessoas e empresas. [gdd.md:2201-2202]
- O que é público e sem marca pode ser usado (nomes de moedas, cargos, instituições comuns); o que tem marca ou dono ganha nome alternativo parecido. [gdd.md:2203-2205]
- Partidos reais (12/nov) entram com nome e cor; logotipo, símbolo e marca não. [gdd.md:2206-2207]
- Presidentes reais entram só em campanha (imitar um presidente) e no desbloqueio "você imitou o programa tal", via coluna "Programa real (de quem)"; nunca no texto da lei. [memória project_paises_reais; gdd.md:2179-2183] (11/nov)
- Lei e texto se medem pelo próprio país da partida ("2 salários médios do país"), nunca por país real. [gdd.md:2208-2209]
- Nomes de empresas e mídias: nenhuma empresa real. [gdd.md:163-164]
- Nomes de organizações (crime, terrorismo): sempre inventados e extremistas em todos os lados. [memória project_tres_camadas]
- Antes de publicar: conferir com advogado. [gdd.md:2210]
- ⚠ CONFLITO (resolvido pela própria fonte): a regra antiga "nenhum país real" não vale mais. [memória project_paises_reais] Anotado só para o revisor; não é conflito aberto.

## Anexo B. Glossário

| Termo | O que é | Fonte |
| --- | --- | --- |
| Esfera | Antigo: tema de leis. Desde 13/nov a lei mora numa instituição. | [gdd.md:1286] |
| Subesfera | Antigo: saiu em 13/nov; a caixa leva instituições inteiras. | [gdd.md:1287] |
| Lei | Regra permanente. Tem bolha no mapa. | [gdd.md:1288] |
| Lei com prazo | Lei que acaba sozinha. | [gdd.md:1289] |
| Ato | Decisão do presidente que acontece uma vez (Graça, visita de Estado, suspender a regra fiscal). | [gdd.md:1290] |
| Posição por país | Nível que o presidente decide no menu de um país e que vale até mudar (Sanções, Aliança). | [gdd.md:1291] |
| Operação | Decisão em etapas sobre uma companhia, com papéis na mesa (Estatização, Privatização). | [gdd.md:1292] |
| Programa | Pacote de leis que resolve um problema. Forma-se quando a maior parte das leis anda na direção dele num mandato; o país ou o gerador dá o nome. A palavra é só para isso. | [gdd.md:1293; memória feedback_leis_x_decisoes] |
| Companhia | A dona. Tem ações, reserva de investimento e várias empresas. | [gdd.md:1294] |
| Empresa | A parte de uma companhia em um setor. Conjunto de prédios. | [gdd.md:1295] |
| Prédio | A unidade que produz ou presta serviço (fábrica, fazenda, usina, hospital). Antes aparecia como "construção". | [gdd.md:1296] |
| Obra | O ato de construir um prédio novo. Entra na fila da construção civil. | [gdd.md:1297] |
| Construção civil | O setor que faz as obras. | [gdd.md:1298] |
| Órgão | O mesmo que instituição (13/nov): a repartição do Estado que executa as leis dela. Recebe verba por lei e sofre corrupção. | [gdd.md:1299] |
| Ação (cota) | Fatia de uma empresa. Dá dividendo, não dá mando. | [gdd.md:1300] |
| Estatal | Empresa cujo dono é o Estado. | [gdd.md:1301] |
| Serviço do Estado | Prédio do Estado fora do mercado (hospital, escola, delegacia). | [gdd.md:1302] |
| Pop, grupo, organização | Pop é quem a pessoa é na economia; grupo é interesse organizado que atravessa os pops; organização nasce na partida, com nome, líder e ação. | [memória project_tres_camadas] |
| Bússola | Raiz do jogo: eixos esquerda/direita e libertário/tradicional; a distância diz quem gosta de quê. | [resumo-para-outro-chat.md:10-13; gdd.md:63-64] |
| Bolha | Como a lei aparece ao jogador no mapa. | [resumo-para-outro-chat.md:16-17] |
| Mesa | Onde o jogador despacha os papéis do turno (mesa do presidente e mesa do partido). | [gdd.md:1936-1939] |
| Fato do turno | Aviso que um módulo deixa no turno; quem se importa lê. | [requisitos.md:32-35] |
| Módulo | Pasta do motor com uma tarefa só e uma porta de entrada (`index.ts`). | [requisitos.md:28-31] |
| Ação x empresa x prédio (exemplo da padaria) | Ação é uma fatia do dono, só lucro; empresa é a padaria inteira, quem é dono manda; construção é uma loja. | [resumo-para-outro-chat.md:112-118] |
| SisGovpedia | Enciclopédia do jogo, aberta pelas dicas ao passar o mouse, em camadas. | [gdd.md:2038-2040] |
| Planilhas | `leis.xlsx` é o acervo; `gdd.xlsx` é o que se constrói. | [gdd.md:11-13] |

## Anexo C. Mapa dos documentos (do GDD atual)

- O que é o jogo e por quê: este GDD. [gdd.md:2216]
- Requisitos e status: `requisitos.md`. [gdd.md:2217]
- Mecânicas e submecânicas, o que falta pensar: `mecanicas.md`. [gdd.md:2218]
- O que está feito e a ordem: `plano-de-desenvolvimento.md`. [gdd.md:2219]
- Acervo: `leis.xlsx`; o que se constrói: `gdd.xlsx`. [gdd.md:2220-2221]
- Como o código está montado: `arquitetura.md`. [gdd.md:2222]
- Onde parei: `RETOMAR.md`. [gdd.md:2223]
- Como cada peça se comporta: `src/motor/<módulo>/<módulo>.md`. [gdd.md:2224]
- Referência do mercado do Victoria 3: `mercado-vic3-referencia.md`. [gdd.md:2225]
- Esta lista vai mudar com o GDD novo (a pasta `gdd-novo/` é temporária). [00-inventario.md:3-4]

---

## Para o revisor

**(a) ⚠ CONFLITO**
1. Nomes dos pilares: População, Economia e Governo (gdd.md:66-67, 14/nov) contra Gosto, Economia e Leis, com Congresso e demais "em volta" (decisão 14/nov passada na tarefa). Ver I.2.
2. Gosto pela Bússola (resumo-para-outro-chat.md:12-13 e :132, 08/nov; gdd.md:63-64) contra gosto pelo bolso, Bússola com peso menor (mecanicas.md:47-51, 14/nov). Ver I.2.
3. Ministros no final (memória project_ministros_no_final, 30/out) contra ministros já na partida e no passo 5 da ordem (requisitos.md, 12-13/nov). Ver I.3.
4. Item sem conflito aberto, anotado no Anexo A: "nenhum país real" antigo foi revogado de forma explícita.

**(b) ESTUDAR**
1. Referência de visão para jogo de governo com personagens (I.1).
2. Como fazer a opinião central sem copiar outro jogo (I.2).
3. Jogo de partida com começo escolhido e fim por perda do poder (I.3).
4. Rede social do político como forma de conhecer pessoa (I.3).
5. Referência externa de ordem de turno (I.4).

**(c) Fontes que não consegui ler ou não li**
- A decisão das "3 mecânicas" (Gosto, Economia, Leis) não está escrita em mecanicas.md "A base" nem em outro arquivo lido; só na instrução desta tarefa.
- Não li: `plano-de-desenvolvimento.md`, `arquitetura.md`, `mercado-vic3-referencia.md`, `o-que-e-uma-lei.md` (fora do escopo desta parte).
- A seção 8 (Bússola) do GDD e as seções 6, 12, 13 foram citadas só por ponteiro, não lidas.
- Nota: o princípio de memória "Narrativas no final" e "Ministros no final" tem datas anteriores ao GDD atual; conferir se ainda valem.
- Linhas citadas do git log (45e74905) não têm número de linha.
