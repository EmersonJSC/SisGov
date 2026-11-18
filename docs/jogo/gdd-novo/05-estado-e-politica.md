# V. Estado e VI. Política (rascunho, 14/nov/2026)

Partes V e VI do GDD novo. Junta o que já está decidido nos documentos antigos. Nada é invenção desta parte. Cada frase leva a fonte entre colchetes. Onde duas fontes se contradizem, aparece "⚠ CONFLITO" e nenhuma é escolhida, a menos que a mais nova revogue a outra por escrito.

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R é o requisito em `requisitos.md`.

Como as três grandes mecânicas se ligam a estas duas partes (decisão de 14/nov): o jogo gira em Gosto (população), Economia e Leis. Congresso, eleição, partido e Judiciário ficam "em volta": são o caminho pelo qual a população controla o governo. [decisão de 14/nov, passada pelo autor nesta rodada; mecanicas.md:40-45]

---

# V. ESTADO

**Lugar em aberto: parte própria, dentro de Leis ou dentro de Economia.** Onde ficam o Tesouro e as instituições na estrutura do GDD ainda não foi decidido (decisão de 14/nov, passada pelo autor nesta rodada). O caminho do dinheiro também espera: o autor quer terminar os ministros, depois o mapa, depois padronizar as leis, e só então o caminho do dinheiro. [gdd.md:2100-2112]

---

## V.1 Presidente e vice

1. **O que é.** A ficha da pessoa que lidera o governo e a ficha do vice. [gdd.md:266]

2. **O que o jogador faz e sente.**
   - O jogador não é o presidente: é o partido. As fichas não decidem por ele; mudam o quanto ele consegue e podem cair. [gdd.md:26-28; gdd.md:344-346]
   - O presidente dá o tom: carisma pesa na aprovação, honestidade no risco de escândalo, habilidade política na relação com o Congresso. [gdd.md:266-268]
   - O vice costuma vir de um partido aliado. É o preço da coligação e um risco: se ele assumir, o poder sai do partido do jogador e a partida acaba. [gdd.md:269-270]

3. **Peças.** Ficha do presidente, ficha do vice. As cinco notas da ficha estão em V.4. [gdd.md:266-270; governo.md:33-35]

4. **Regras decididas.**
   - Vice de outro partido assumindo acaba a partida (12/nov). [gdd.md:280-281]
   - A chapa do começo reúne pessoas de todos os partidos e disso nasce a coligação (12/nov). [requisitos.md:67]

5. **Ligações.**
   - Recebe: aprovação e honestidade vindas da população (aprovação é a satisfação média, ver VI.3). [gdd.md:1083-1085]
   - Entrega: Congresso (habilidade), mídia e eleitor (carisma), escândalo (honestidade). [gdd.md:266-268]

6. **Referências.** —  ESTUDAR (nenhuma fonte cita jogo ou estudo sobre a ficha do presidente).

7. **No motor hoje.**
   - ☐ A ficha do presidente pesar em aprovação, escândalo e Congresso (R6.2). [requisitos.md:104; mecanicas.md:555-556]
   - ✅ Escolher a chapa no começo (R4.6). [requisitos.md:67]

8. **Em aberto.** —

---

## V.2 Sucessão

1. **O que é.** O que acontece quando o presidente deixa o cargo antes do fim do mandato. [gdd.md:272-277]

2. **O que o jogador faz e sente.** Sofre o fato. Se assume alguém do próprio partido, o governo continua com choque de aprovação (simpatia ou caos) e a ficha nova no lugar. Se assume alguém de outro partido, mesmo aliado, a partida acaba. [gdd.md:278-281]

3. **Peças.** Morte, assassinato, renúncia e afastamento (impeachment); vice; linha de sucessão do país. [gdd.md:274-277]

4. **Regras decididas.**
   - A chance de cada saída depende do país: polarização, radicais, segurança pública e escândalos. [gdd.md:274-276]
   - Quem assume é o vice, depois a linha de sucessão do país. [gdd.md:277]
   - Sucessor de outro partido acaba a partida (12/nov). [gdd.md:280-281]
   - Impeachment: a oposição abre o pedido, o Congresso aceita e, quando o país tem Senado, o Senado julga. Pesam a maioria contra, radicais altos, poucos lealistas e escândalos. [gdd.md:282-284]

5. **Ligações.**
   - Recebe: radicais, polarização, segurança pública, escândalos. [gdd.md:274-276]
   - Entrega: aprovação (choque), fim da partida, fatos "presidente morreu" e "impeachment aberto". [gdd.md:278-279; requisitos.md:138-148 (bloco Construção, Fatos)]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.** ☐ Falta tudo: morte, assassinato, renúncia, vice assumindo (R6.3); impeachment (R6.5). [mecanicas.md:692-699; requisitos.md:127-128]

8. **Em aberto.** A chance de cada saída pelo país (idade, radicais, segurança). [mecanicas.md:695]

---

## V.3 Pessoas (fichas)

1. **O que é.** Os personagens do jogo: presidente, vice, ministros, juízes, candidatos, gente do partido e dos aliados. Cada um tem ficha. [gdd.md:286-291; gdd.md:52-54]

2. **O que o jogador faz e sente.** Vê que presidentes, ministros e candidatos passam e o partido fica. Precisa formar nomes novos, porque as pessoas envelhecem, se aposentam e morrem. [gdd.md:26-28; gdd.md:290-291]

3. **Peças.**
   - Gerador de personagens: cria as fichas no começo e ao longo da partida (novos nomes no partido, nos aliados, técnicos). [gdd.md:288-289]
   - Notas: competência, habilidade, carisma, honestidade e lealdade, de 5 a 95, normais em torno de 55. [pessoas.md:14-15]
   - Origem: partido (pelo peso das cadeiras) ou técnico sem partido. [pessoas.md:10-12]
   - Bússola: em torno da do partido de origem (desvio 0,25); técnico em torno do centro (desvio 0,45). [pessoas.md:11-13]
   - Idade de 35 a 74 e nome (próprio mais sobrenome, sem repetir). [pessoas.md:16-17]
   - Perfil de rede social gerado da ficha, sem rótulo de lado. [requisitos.md:102]
   - Retrato: o motor não guarda desenho; a tela desenha com DiceBear a partir do id. [pessoas.md:35-42]

4. **Regras decididas.**
   - O motor não conhece nomes: o país declara listas de nomes e a mesma semente gera as mesmas pessoas. [pessoas.md:3-4]
   - O jogo nunca pede lado ao jogador; o lado do partido sai da média da bússola da chapa (12/nov). [requisitos.md:68]
   - Juízes do Brasil têm nomes parecidos com os reais, nunca os reais (GDD regras de conteúdo). [judiciario.md:22-27]

5. **Ligações.**
   - Recebe: partidos do país (cadeiras e bússola). [pessoas.md:7-8]
   - Entrega: ministros, chapa, juízes, candidatos. [pessoas.md:19-23]

6. **Referências.** Retrato: DiceBear (CC0, código MIT). [pessoas.md:37-39] Outras: ESTUDAR.

7. **No motor hoje.**
   - ✅ Gerador e lista de pessoas por vaga (R6.12). [requisitos.md:101-103; mecanicas.md:560]
   - ◐ Perfil de rede social: posts, lugares e quem segue; falta "informações pessoais descobertas" e o Espiar (R6.11). [requisitos.md:102]
   - ◐ Retratos genéricos, provisórios (R6.1). [requisitos.md:100]
   - ☐ Envelhecer, aposentar e morrer para todos; hoje só os juízes envelhecem. [mecanicas.md:561; judiciario.md:33-34; pessoas.md:17]

8. **Em aberto.**
   - Fichas declaradas pelo país com nomes parecidos com os reais, como os juízes, também para políticos? [mecanicas.md:562-563]
   - O autor não gostou dos retratos genéricos. [mecanicas.md:967]

---

## V.4 Ministros

1. **O que é.** A ficha de quem chefia as instituições que o jogador der a ele; a competência dele mexe no efeito das leis dessas instituições. [gdd.md:380-382]

2. **O que o jogador faz e sente.** Escolhe quem ocupa cada ministério e quando trocar. O melhor técnico pode ser de outro partido, o aliado exige ministérios para votar com o jogador e o ministro popular vira rival dentro do partido. [gdd.md:295-308]

3. **Peças.**
   - Cinco notas: competência (leis da área chegam mais rápido e com mais força; fraco atrasa e desperdiça verba), habilidade política (aprovar as leis da área), carisma (como mídia e eleitor o veem), honestidade (baixa sobe corrupção e risco de escândalo) e lealdade (baixa e ele vaza, sabota ou sai atirando). Mais bússola e origem. [gdd.md:297-305]
   - Opinião: grupos e mídias gostam ou não pela distância na bússola e pela origem. [gdd.md:309-311]
   - Fatos: escândalo, crise na área, demissão barulhenta, ministro que vira candidato. [gdd.md:312-313]
   - Troca: a qualquer momento, com revolta e polêmica. [gdd.md:314-317]

4. **Regras decididas.**
   - Troca a qualquer momento, sem esperar turno nem lei; o demitido reage pela lealdade, o partido dele se irrita no Congresso e a mídia cobra; manter alguém sob escândalo custa mais com o tempo (13/nov). [gdd.md:314-317]
   - Competência: até 3 instituições o ministro rende inteiro; com mais, rende √(3 ÷ instituições). [gdd.md:326-327; governo.md:27-29]
   - Efeito na lei: acima de 70 de competência a lei chega 1 turno antes, abaixo de 30 chega 1 turno depois; força = 0,6 + 0,008 × competência. [governo.md:41-48]
   - O ministro não mexe na verba, que é lei; a ficha dele muda a instituição (competência alta, rende mais; honestidade baixa, mais corrupção). [gdd.md:419-421]
   - Troca pelo jogador: sempre vira o fato "ministro demitido", inclusive técnico; a 1ª troca dos últimos 24 turnos é notícia pequena, a 2ª média, da 3ª em diante grande; mágoa de 6 pontos mais 3 por troca anterior, sumindo em 3 turnos nos grupos parecidos com quem saiu; partido do demitido perde 8 de termômetro (13/nov). [governo.md:70-80]
   - No começo, ministros sorteados pela chapa e trocados por três cartas (técnico, aliado, do seu partido) ou pela lista (13/nov). [requisitos.md:110; pessoas.md:19-23]
   - Ministro na caixa de uma instituição sem ministro (Eleições, Regras dos poderes) não existe: a lei anda como com competência 50 e o órgão como com honestidade 70. [governo.md:21-23]

5. **Ligações.**
   - Recebe: caixa que ele leva (V.5), Congresso (moeda Ministério), partido de origem. [gdd.md:328-329; gdd.md:917-918]
   - Entrega: força e atraso das leis (Leis), corrupção e rendimento da instituição (V.6), termômetro do partido no Congresso, mágoa nos grupos (Gosto/população), notícia (mídia). [governo.md:41-48; governo.md:70-80]

6. **Referências.** O Brasil juntou a economia num superministério em 2019 e separou de novo em 2023. [gdd.md:339-340] Outros: ESTUDAR.

7. **No motor hoje.**
   - ✅ Ficha (R6.7): agem competência e honestidade; habilidade, carisma e lealdade esperam Congresso, mídia e fatos do ministro. [requisitos.md:113; governo.md:33-37]
   - ✅ Ministros no começo (R6.26). [requisitos.md:110]
   - ◐ A ficha muda força, atraso e rendimento (R6.8). [requisitos.md:114]
   - ◐ Trocar a qualquer momento (R6.24): feito partido ressentido, notícia maior a cada troca e mágoa de 3 turnos; falta a reação do demitido pela lealdade e a mídia ter efeito. [requisitos.md:115]
   - ✅ Trocar ministro pelo mapa (R17.24). [requisitos.md:422]
   - ☐ Fatos do ministro: escândalo, crise, demissão barulhenta, vira candidato (R6.9). [requisitos.md:116; mecanicas.md:569-570]
   - ⚠ CONFLITO (de prioridade, ver abaixo).

   ⚠ CONFLITO: a memória de 30/out diz que ministros são "tempero" e ficam para o final, e que não se deve propor mais itens de ministro (escândalo, troca, demissão, lealdade) até o autor chamar. [memória project_ministros_no_final:8-12] Já o GDD de 13/nov traz troca, demissão barulhenta, fatos do ministro e a ordem do autor "terminar os ministros" antes do mapa e das leis. [gdd.md:314-317; gdd.md:2110-2112] Nenhuma das duas revoga a outra por escrito. Não foi escolhida.

8. **Em aberto.**
   - Opinião central: ministros têm lealdade que nada lê. Uma régua de opinião única para todo ator (grupo, partido, ministro, juiz, mídia) está por desenhar. [gdd.md:2075-2084; mecanicas.md:141-146]
   - Ministério sem pasta só dá cadeira ao Congresso; agradar grupos parecidos com o ministro ainda não existe. [gdd.md:2062-2064]

---

## V.5 Ministérios (caixas)

1. **O que é.** Uma caixa com nome onde cabem instituições inteiras, de zero até quantas o jogador quiser. [gdd.md:318-322]

2. **O que o jogador faz e sente.** Muitas caixas dão mais cargos e foco, com mais custo. Poucas (superministério) economizam, mas a competência do ministro se divide. Programa espalhado por várias caixas depende de vários ministros e anda no passo do mais fraco. [gdd.md:330-333]

3. **Peças.**
   - Caixa com instituições: o ministro rende e a ficha dele muda leis e órgãos dela. [gdd.md:329-330]
   - Ministério sem pasta (ex.: Mulheres, Pesca): só cargo para aliado, é a moeda "Ministério" do Congresso. [gdd.md:322-324; gdd.md:328-329]
   - Gabinete do chefe de governo: recebe as instituições que nenhuma caixa levar; pesa 3 a mais. [gdd.md:320-322; requisitos.md:108]
   - Moldes de caixas sugeridas (35 linhas: básico, comum, superministério, de causa). [Ministérios (geral).tsv:2-33]
   - Régua de tamanho: Enxuto (9), Clássico (19), Do país, Inchado (do país mais 5 sem pasta). [requisitos.md:109]
   - Lei Organização dos ministérios: escada de quem pode mexer nas caixas. [gdd.md:335-338]

4. **Regras decididas.**
   - Cada instituição fica numa caixa só; a que sobra vai para o gabinete (13/nov). [gdd.md:320-322]
   - Toda caixa tem um ministro, custa estrutura e agrada quem é parecido com ele. [gdd.md:328-329]
   - No começo o país vem com os ministérios reais dele e o jogador muda no menu. [gdd.md:334-335]
   - Depois, pela lei Organização dos ministérios, escada em 4 degraus (13/nov): 1) livre, por decreto; 2) medida provisória e o Congresso confirma; 3) só por lei; 4) algumas caixas fixas na Constituição. O país declara o degrau inicial. [gdd.md:335-338]
   - A divisão muda com quem governa (como na realidade). [gdd.md:339-340]
   - O motor confere ao iniciar: recusa instituição em duas caixas, instituição sem ministro numa caixa, falta de gabinete ou a mesma pessoa em dois cargos. [governo.md:24-26]
   - A lei vai para a caixa que leva a instituição dela; senão, para a sobra (gabinete). [governo.md:20-21]

5. **Ligações.**
   - Recebe: instituições, ministro, escolha do jogador. [gdd.md:318-325]
   - Entrega: moeda Ministério ao Congresso; custo de estrutura (caminho do dinheiro, ainda não feito); agrado aos grupos parecidos. [gdd.md:328-329; requisitos.md:112; gdd.md:2105-2109]

6. **Referências.** Caixas de 11 países reais (Brasil, EUA, China, Alemanha, Japão, Índia, Reino Unido, França, Itália, Canadá, Rússia). [leis - Ministérios - países.tsv:2-11] Planilha de caixas genéricas. [Ministérios (geral).tsv:2-33]

7. **No motor hoje.**
   - ✅ Instituições, caixas e gabinete (R6.10). [requisitos.md:108]
   - ✅ Régua de tamanho e "Ajustar caixas" (R6.25). [requisitos.md:109]
   - ◐ O país começa com os ministérios dele; Brasil com 34 caixas, faltam os outros países e a lei Organização dos ministérios (R6.14). [requisitos.md:111]
   - ◐ Toda caixa tem ministro e divide a competência; faltam o custo de estrutura e agradar quem é parecido (R6.15). [requisitos.md:112]

8. **Em aberto.**
   - Custo fixo por ministério e por cargo: sem ele o governo Inchado não tem desvantagem. [gdd.md:2109; mecanicas.md:532-534]
   - Tipos de parlamento: reformular com as caixas livres (quem controla o quê na coabitação). [gdd.md:2070-2072]
   - Ministério é gente para dar atenção extra a uma instituição; grupo descontente fala com o ministro da instituição, ou vai direto ao presidente ou ao Congresso. [gdd.md:2034-2037]

---

## V.6 Instituições

1. **O que é.** O órgão que executa a lei. É a menor peça do governo; substituiu a esfera em 13/nov. [gdd.md:380-382; memória project_esfera_ministerio:11]

2. **O que o jogador faz e sente.** Não escolhe fazenda, fábrica ou obra: passa leis que dão verba e regras ao órgão, e o órgão age sozinho pelo turno. [memória feedback_orgaos_e_verba:11-13] No mapa vê um escudo com frase curta ("12 na fila · 2 na sua mesa") e a cor do rendimento: verde rende, amarelo falta verba, vermelho sobra e vira corrupção. Clicar abre ficha só de leitura. [gdd.md:427-432]

3. **Peças.**
   - As 36 instituições (conferidas com a lista de funções de governo da ONU): Agricultura e pesca, Água e saneamento, Assistência social, Ciência e pesquisa, Comércio exterior e capital, Comunicação e tecnologia, Concorrência e consumidor, Controle e transparência, Cultura, Defesa, Defesa civil, Educação, Eleições, Energia, Esporte, Estados e municípios, Estatais, Funcionalismo, Imigração, Impostos, Indústria (com construção civil), Infraestrutura e transporte, Justiça e prisões, Meio ambiente, Mineração e petróleo, Moeda e bancos, Moradia (com urbanismo), Orçamento e dívida (com estatística), Previdência, Relações exteriores, Religião, Saúde, Segurança pública, Terra, Trabalho, Turismo. [gdd.md:401-409; Instituições novas.tsv:2-37]
   - Miolo (3 poderes): regras dos poderes (medida provisória, indicação de juízes, quórum, foro privilegiado, iniciativa popular), que não são de instituição. [gdd.md:398-400; Instituições novas.tsv:38]
   - Quatro números por instituição: verba, necessidade, rendimento e corrupção interna. [gdd.md:423-426]

4. **Regras decididas.**
   - Lei é a regra do país; instituição executa; ministro chefia. [gdd.md:380-382]
   - A lei mora numa instituição, nunca num ministério; cada instituição tem um dono só por vez. [gdd.md:383-385]
   - Instituição é órgão, não tema: a pergunta é "quem executa?". Tema com naturezas diferentes se divide pela função; a licença segue o produto (apostas na Fazenda, drogas na Saúde). [gdd.md:386-389]
   - Todo país tem todas as instituições, mesmo pequenas; a pequena é um caminho que o jogador pode crescer (Brasil religioso faz Religião crescer). [gdd.md:390-392]
   - Eleições não tem ministro (13/nov): fica sempre com o Judiciário, ligada só à corte eleitoral quando os tribunais existirem. [gdd.md:393-397]
   - Instituição não tem chefe próprio (13/nov): quem manda é o ministro. [gdd.md:420-421]
   - Verba vem da lei. Necessidade é a verba do começo mais 5% a cada lei ativa a mais (nunca abaixo de 20%). Rendimento = verba ÷ necessidade (1 sem verba em lei): pouca verba, a fila anda devagar; verba demais, a sobra vira corrupção. [gdd.md:423-426; governo.md:54-57]
   - Corrupção (0 a 100): a cada turno desfaz 8% e soma 12 × (rendimento − 1) quando sobra verba, 1,2 × cargos de livre nomeação e 1,6 × (100 − honestidade) ÷ 100 do ministro. Começa no equilíbrio do governo de hoje. Ao cruzar 60 vira o fato "escândalo". Pesos de partida. [governo.md:58-66; requisitos.md:121]
   - Saíram: Vícios, Direitos e liberdades, Estado e eleições, Empresas e estatais (divididas), Saneamento e Cultura e esporte (juntadas ou separadas). As leis delas serão refeitas instituição por instituição. [gdd.md:410-412]
   - Corrupção em cadeia (12/nov): o rastro não some; baixar a independência dos investigadores faz a corrupção de cada órgão subir sozinha, o rendimento cair e o serviço piorar. [gdd.md:473-480]
   - Regra do dinheiro (14/nov): nenhum dinheiro some; a corrupção não apaga o dinheiro, ele vai para o bolso de alguém e deixa rastro. [mecanicas.md:279-287]
   - Lei de regra custa (14/nov, "quer"): fiscalizar uma regra pede trabalho à instituição e sobe a necessidade dela. Esse custo vai a bolsos (salário de fiscal, equipamento) e a multa de quem foi pego vai ao Tesouro. [mecanicas.md:439-442]

5. **Ligações.**
   - Recebe: leis de gasto (verba) e leis ativas (necessidade) (Leis); ministro (competência e honestidade); lei de cargos de livre nomeação. [governo.md:54-61]
   - Entrega: rendimento que age na lei; corrupção e fato "escândalo" (Congresso lê; CPI); verba de salário e compras que viram renda (Economia, ainda por fazer). [requisitos.md:114; governo.md:63-64; mecanicas.md:526-531]
   - Tesouro: impostos e receita entram no Tesouro (cofre ou dívida), que paga as leis de verba. [gdd.md:2102-2104]

6. **Referências.**
   - Lista de funções de governo da ONU (aba Conferência ONU, 10 áreas). [Conferência ONU.tsv:1-67; gdd.md:401]
   - Argentina maquiou a inflação de 2007 a 2015 (para Estatística). [gdd.md:2038-2040]
   - Instituições na planilha antiga (por esfera, com índices que mexem). [Instituições.tsv:1-36]

7. **No motor hoje.**
   - ✅ 36 instituições, verba, necessidade, rendimento, corrupção (R6.10, R6.16, R6.17). [requisitos.md:108; 120-121]
   - ◐ Ficha da instituição no mapa, só de leitura: escudo sob o ministro e painel Atrapalham/Ajudam; falta rendimento, corrupção e fila (R6.18). [requisitos.md:122]
   - ✅ Lei age pelo órgão (R7.11): efeito × rendimento, teto 1 (14/nov). [requisitos.md:167]
   - ☐ Instituições sem lei: Estados e municípios, Religião, Turismo, Indústria; Funcionalismo com uma. [gdd.md:2065-2067; mecanicas.md:582-583; Instituições novas.tsv:33-37]
   - ☐ Caminho do dinheiro (R10.7). [mecanicas.md:524-525]

   ⚠ CONFLITO (R7.11, mesma data 14/nov):
   - Versão A: R7.11 feita; "a regra funciona na medida da verba do órgão"; o rendimento age na lei desde 14/nov. [requisitos.md:114; requisitos.md:120; requisitos.md:167]
   - Versão B: R7.11 ☐; "pouca verba ainda não enfraquece a lei"; o efeito do rendimento "espera R7.11". [mecanicas.md:437-438; governo.md:47-48] Esta é também a frase que o autor passou nesta rodada.
   - Não foi escolhida.

8. **Em aberto.**
   - Onde ficam o Tesouro e as instituições na estrutura do GDD (decisão de 14/nov passada nesta rodada).
   - Caminho do dinheiro: a proposta a pensar é impostos, Tesouro, verba por lei, máquina do ministério, filtro da corrupção (parte do dinheiro some de verdade), instituição, população. [gdd.md:2105-2109]. O filtro da corrupção "some de verdade" conflita com "nenhum dinheiro some" (ver mecanicas.md:285-287); a mecânica 8.2 pede: quanto a corrupção some de verdade. [mecanicas.md:532-534]
   - Estatística: o presidente pode parar de medir, esconder os números da mídia ou mentir nelas; o jogador vê o real, a mídia vê com atraso. [gdd.md:2038-2040]
   - Se cada instituição e cada lei responde a um dos poderes. [gdd.md:2117-2118]

---

## V.7 A fronteira do governo

1. **O que é.** A linha entre o que o jogador controla direto e o que só influencia. [gdd.md:342-346]

2. **O que o jogador faz e sente.** O jogador é o governo; as fichas não decidem por ele. [gdd.md:344-346]

3. **Peças.**
   - Controla (12/nov): leis (propor, assinar, vetar, decretar se a lei deixar); pessoas (nomear e demitir ministros, indicar juiz na vaga); verbas, sempre por lei; estatais (Operações); exterior (posições por país e atos); polícia federal e Forças Armadas, dentro da lei de autonomia delas; emissora estatal e inteligência; a mesa inteira. [gdd.md:348-352]
   - Só influencia (12/nov): Congresso (moedas, termômetro, paciência), Justiça (indicação e pressão, com rastro), governadores (verba e termômetro), mídia privada, empresas, grupos e pops, banco central (se a lei de independência deixar). [gdd.md:353-356]

4. **Regras decididas.** Os dois pontos acima, ambos de 12/nov. [gdd.md:342-356] Opções de menu de país e de companhia são Ato ou Operação, não lei; as leis só controlam essas decisões. [memória feedback_leis_x_decisoes:7]

5. **Ligações.** Toda a parte V e VI, Mundo, Mídia, Economia. [gdd.md:348-356]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.** Não é uma peça de código; é regra de desenho. —

8. **Em aberto.** —

---

## V.8 Governadores

1. **O que é.** O governador de cada estado, com partido, lugar na bússola e termômetro com o presidente. [gdd.md:499-505]

2. **O que o jogador faz e sente.** Não governa estado nem escolhe obra. Negocia pela instituição Estados e municípios; o ministro dela faz a verba render e esquenta o termômetro. [gdd.md:512-517]

3. **Peças.**
   - Verba: aliado faz a verba federal render mais; oposição demora a gastar e culpa o presidente na mídia local. [gdd.md:506-507]
   - Congresso: os deputados do estado puxam um pouco para o governador. [gdd.md:508-509]
   - Mesa: pede obra, socorro e polo (família Pedidos). [gdd.md:510]
   - Eleição: aliado faz campanha pelo presidente no estado; oposição, contra. [gdd.md:511]
   - Estados e municípios (13/nov): leis de repasse e de dívida dos estados moram nela. [gdd.md:512-515]

4. **Regras decididas.**
   - Quem cuida de luz, gás e água muda por país: o arquivo do país declara; a lei que não cabe ao presidente fica inativa (11/nov). [gdd.md:499-502]
   - Pops por estado pesam pouco no motor (medido em 12/nov: possível, com cálculo uma vez por tipo de pop). [gdd.md:516-517]
   - Guerra civil racha o país por estados e governadores da oposição se rebelam. [gdd.md:493-494]

5. **Ligações.**
   - Recebe: verba federal, termômetro, bússola. [gdd.md:504-507]
   - Entrega: Congresso (bancada do estado), mesa (pedidos), eleição (campanha no estado), mídia local. [gdd.md:506-511]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.** ☐ Falta tudo (R6.23): partido, bússola, termômetro; verba rende mais com aliado; pedidos na mesa; campanha no estado. [requisitos.md:137; mecanicas.md:588-589]

8. **Em aberto.** Estados e municípios ainda não tem lei. [gdd.md:2065-2066]

---

# VI. POLÍTICA

(Em volta das 3 mecânicas: o caminho pelo qual a população controla o governo. [decisão de 14/nov, passada nesta rodada])

---

## VI.1 Partido (você)

1. **O que é.** O jogador é o partido: decide quem fala por ele, com quem ele se alia e o quanto ele se afasta da própria história. [gdd.md:239-242; gdd.md:26-28]

2. **O que o jogador faz e sente.** Dá nome e sigla. Governar longe da posição do partido irrita a base: lealistas viram descontentes, a coesão cai e deputados do próprio partido votam contra. [gdd.md:244-251]

3. **Peças.**
   - Ficha: posição na bússola (vem da chapa), grupos da base, cadeiras, caixa, desgaste, coesão. [gdd.md:246-247]
   - Presidente do partido: escolhido entre as fichas; comanda negociação e campanha; troca com custo de coesão. [gdd.md:252-254]
   - Caixa: entra por financiamento (público ou privado, pela lei de financiamento de campanha) e sai na campanha; dinheiro privado vem com interesse de quem doou. [gdd.md:255-257]
   - Coesão: mede se o partido vota unido; cai com governo longe da base, escândalo, troca de líder e derrota; sobe com vitória e base satisfeita. [gdd.md:258-260]
   - Mesa do partido: doador, filiação, expulsar ou perdoar, coligação. [mecanicas.md:744-746]

4. **Regras decididas.**
   - O jogador dá só nome e sigla; a bússola e a base saem das pessoas da chapa (12/nov). [gdd.md:244-246; requisitos.md:66-68]
   - O partido muda de lugar na bússola, mas devagar e pagando. [gdd.md:250-251]
   - Cadeiras do partido novo: 6% do Congresso, tiradas dos partidos de origem da chapa; a sigla vira o id e não pode repetir. [pessoas.md:27-33]
   - O partido defende os 5 grupos mais perto da média da bússola da chapa, peso total 1,2. [pessoas.md:27-28]
   - O partido que governava vira oposição, ou entra na coligação se o jogador pedir. [pessoas.md:31-32]

5. **Ligações.**
   - Recebe: chapa, financiamento (lei), resultado e escândalo. [gdd.md:246-260]
   - Entrega: coesão ao voto do Congresso (fiéis e livres); caixa à campanha; bússola ao eleitor. [gdd.md:866-868; gdd.md:1046-1048]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.**
   - ✅ Criar o partido, montar a chapa, o lado sair da chapa (R4.5, R4.6, R4.8). [requisitos.md:66-68]
   - ◐ Começo com história: partido novo com 6% e o antigo governo na oposição; falta a Aprovação começar alta (R4.9). [requisitos.md:69]
   - ☐ Ficha do partido, coesão, presidente do partido, caixa (R5.1 a R5.5). [requisitos.md:83-87; mecanicas.md:722]
   - ☐ Mesa do partido (R17.10) e momentos do partido como telas curtas (R17.11). [requisitos.md:440-441]
   - A coesão já entra no voto do Congresso (padrão 0,7 por partido). [politica.md:29-31]

   ⚠ CONFLITO (leve): mecanicas.md diz que o Partido está "nada feito" (R5.1 a R5.5). [mecanicas.md:722; mecanicas.md:30] Já requisitos.md marca como feitos criar o partido, a chapa e o lado (R4.5, R4.6, R4.8). [requisitos.md:66-68] Parecem escopos diferentes (criação x ficha), mas as fontes não dizem isso. Não foi escolhida.

8. **Em aberto.**
   - Quanto longe é longe; quanto o partido pode andar na bússola por mandato. [mecanicas.md:732-733]

---

## VI.2 Congresso e coligação (o coração do voto)

1. **O que é.** Os partidos do país votam toda mudança de lei; o jogador junta votos. [gdd.md:836-843]

2. **O que o jogador faz e sente.**
   - Vê, antes da votação, quantos votos tem a favor, contra e indecisos; o placar previsto é o real, sem sorteio. [gdd.md:855-858]
   - Negocia com indecisos oferecendo moedas, e cada moeda cobra depois. [gdd.md:869-872; gdd.md:914-915]
   - Convida partidos para a base; cada um cobra e sai ou entra pelo termômetro. A oposição vota contra, aprova leis dela quando tem votos, vai à mídia e mobiliza grupos. [gdd.md:844-846]

3. **Peças.**
   - Partidos do país: nome, cadeiras, bússola, grupos que defendem, presidente com ficha. Cadeiras mudam a cada eleição. [gdd.md:840-841]
   - Casas e sistema: só Câmara ou Câmara e Senado; presidencialismo, parlamentarismo, semipresidencialismo ou partido único; sistema eleitoral (proporcional, misto, distrital) é lei do jogo; monarquia sem eleição só nos países leves. [gdd.md:847-851]
   - Voto por partido: nota de −1 a +1 (bússola, ganho dos grupos, base ou oposição, apoio da população, aprovação, conta da lei). [gdd.md:859-868; politica.md:14-24]
   - Fiéis e livres pela coesão. [gdd.md:866-868; politica.md:29-31]
   - Indecisos: nota entre −0,12 e +0,12. [politica.md:33]
   - Quórum por classe: comum, absoluta, constitucional, mandato. [gdd.md:904-911]
   - As 6 moedas: ceder na régua, ministério, cargos, emenda, promessa de lei, decreto. [gdd.md:914-944]
   - Decreto: fato consumado e alcance em 4 degraus. [gdd.md:925-940]
   - Preço que sobe a cada compra. [gdd.md:941-944]
   - Paciência do Congresso (0 a 100, por casa). [gdd.md:945-951]
   - Termômetro por partido (0 a 100). [gdd.md:952-963]
   - Congresso agindo sozinho: rejeitar, emendar, derrubar veto, propor lei, travar a pauta, CPI, impeachment, moção de desconfiança. [gdd.md:964-979]
   - Bancadas temáticas. [gdd.md:980-983]
   - Lobby das companhias. [gdd.md:984-987]
   - Congresso sobrecarregado (carga da casa). [gdd.md:988-995]
   - Partido único por dentro: congresso do partido, alas, expurgo. [gdd.md:894-903]
   - Tela: anel de cadeiras no miolo, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha de quórum. [gdd.md:996-1007]

4. **Regras decididas.**
   - Placar previsto = placar real; só muda por fato do turno, e o fato aparece (11/nov). [gdd.md:855-858]
   - Conta da lei (12/nov): quanto a lei sobe o gasto em % do PIB, pesando mais nos partidos que ligam para contas e com déficit alto. Exorbitante é a lei que perde a maioria por causa da conta. [gdd.md:862-865]
   - Tempo da lei (12/nov): turno 1 Câmara, turno 2 Senado; se o Senado muda o texto, volta à Câmara no turno 3 e vai à mesa; o veto pode ser derrubado no mesmo turno; país de uma casa vota uma vez; regra do poder e mandato votam duas vezes. Sem urgência. [gdd.md:873-881]
   - Sistemas (11/nov): o motor do voto, o placar e as moedas são iguais; muda quem vota e como o jogador cai. Presidencialismo cai por impeachment; parlamentarismo por moção; semipresidencialismo sem maioria vira coabitação (primeiro-ministro manda na economia e nos serviços; presidente fica com Defesa, Exterior e veto); partido único cai pela ala rival. [gdd.md:882-893; gdd.md:372-373]
   - Quórum (11/nov): cada lei declara a classe; a lei Quórum das votações muda os valores. Mexer no próprio mandato pede quórum de mandato e custa paciência e grupos; "vale só no próximo mandato" tira o custo extra. [gdd.md:904-911]
   - Moedas (11/nov), cada uma cobra depois: ceder (a lei faz menos); ministério (aliado fiel enquanto o ministro ficar; tira cargo do próprio partido); cargos (órgão menos eficiente, mais corrupção; reserva pela lei Cargos de livre nomeação); emenda (sai do orçamento; reserva pela lei Emendas dos parlamentares); promessa (lei do aliado em até 4 turnos; descumprir enfurece); decreto (vale já, sem voto, se a lei Poder de decreto deixar; o Congresso tem 2 turnos para confirmar). [gdd.md:916-928]
   - Fato consumado (12/nov): derrubar decreto custa a quem derruba, porque os grupos que ganhavam ficam com raiva dos partidos que votaram contra. [gdd.md:929-933]
   - Alcance do decreto (12/nov), 4 degraus: nenhum; só verba e preço; tudo menos impostos, regras do poder e mandato; tudo, sem confirmar. Decretar dentro da lei não é passo autoritário; subir ao degrau 4 ou decretar por fora é. [gdd.md:934-938]
   - Decreto que só cumpre uma lei fica fora do jogo; o motor faz sozinho (12/nov). [gdd.md:939-940]
   - Preço que sobe (12/nov): cada compra ensina que o governo paga; quem entrou por compra sai quando o caixa ou os cargos acabam. [gdd.md:941-944]
   - Paciência (11/nov): cai com decreto, veto, ir à mídia contra o Congresso e lei demais; sobe sozinha e mais no turno sem lei nova; abaixo de 30 toda lei do governo perde votos e o Congresso aprova leis caras e populares por conta própria. [gdd.md:945-951; politica.md:83-85]
   - Termômetro (11/nov): sobe com ministério, cargos, emenda, leis perto do lado dele e grupos dele satisfeitos; cai com leis longe, grupos insatisfeitos, promessa descumprida e pedido ignorado. Na base: abaixo de 30 vira "ameaça sair", abaixo de 20 sai. Na oposição: acima de 70 aceita convite. [gdd.md:952-961]
   - Congresso sobrecarregado (11/nov): sem pontos de ação; o freio é a casa. Passou do limite, a lei entra na fila e não é votada naquele turno; nada é proibido. [gdd.md:988-995; memória feedback_sem_pontos_de_acao:11]
   - Lei derrotada fica 2 turnos barrada. [gdd.md:966; politica.md:53]
   - Ano de eleição: no último ano do mandato o deputado vota mais com o povo que com o partido. [gdd.md:1017-1018]
   - Sem sorteio para a lei passar: a aprovação vem do Congresso e dos grupos, nunca de um dado (14/nov). [gdd.md:2054-2055]
   - Veto: na lei emendada pelo Senado; observação guardada; o Congresso derruba com o quórum absoluto. [requisitos.md:264; politica.md:51]

5. **Ligações.**
   - Recebe (Gosto/população): grupos (insatisfeito baixa o termômetro e acorda a bancada), aprovação, mídia (manchete contra), corrupção (o que a CPI acha), companhias (lobby), eleição (as cadeiras). [gdd.md:1008-1012]
   - Entrega: coesão do partido do presidente, corrupção (emenda secreta, cargos), orçamento (emendas), aprovação (CPI, veto derrubado, promessa quebrada), eleição seguinte. [gdd.md:1013-1016]
   - Leis: toda lei passa pelo Congresso (placar e quórum). [gdd.md:842-843]
   - Fatos que escreve: lei aprovada ou rejeitada, emenda, veto, decreto, promessa, partido entra ou sai. [politica.md:86-90]

6. **Referências.**
   - Decreto = "medida provisória" do Brasil; o nome é rótulo do país. [gdd.md:925-928]
   - Países por sistema (corte suprema única, corte constitucional separada, tribunais por tema) estão em VI.4. [gdd.md:2093-2096]
   - Referência de jogo ou estudo para o modelo de voto: ESTUDAR.

7. **No motor hoje.**
   - ✅ Toda mudança de lei é votada (R12.1); partidos do país (R12.2); placar previsto = real (R12.11); nota do partido (R12.12); fiéis e livres (R12.13); quórum por classe (R12.14); duas casas (R12.7). [requisitos.md:244-250]
   - ✅ Coligação: convidar, sair, voltar (R12.3); termômetro (R12.16); paciência (R12.17); carga (R12.18); veto e derrubada (R12.6). [requisitos.md:255; 257-259; 264]
   - ◐ Seis moedas (R12.4): faltam botões de promessa e decreto na tela. [requisitos.md:256]
   - ◐ Decreto (R12.19): falta a raiva dos grupos que ganhavam e o botão. [requisitos.md:260]
   - ☐ Rejeitar sozinho, emendar sozinho, propor lei popular, travar a pauta, CPI (R12.5, R12.10). [requisitos.md:265-266]
   - ☐ Bancadas e lobby (R12.15). [requisitos.md:251]
   - ☐ Sistemas parlamentarismo, semipresidencialismo, partido único (R12.8). [requisitos.md:267]
   - ☐ Cadeiras mudam a cada eleição (R12.9). [requisitos.md:268]
   - Obs.: sem Congresso nas regras do país, todo pedido passa. [politica.md:6-7]

8. **Em aberto.**
   - Quais das 6 moedas cobram depois de verdade e o preço que sobe. [mecanicas.md:659-660]
   - Fato consumado e alcance do decreto em 4 degraus (como entram no código). [mecanicas.md:669-670]
   - Tipos de parlamento com as caixas livres. [gdd.md:2070-2072]
   - Se o voto do Senado na vaga de juiz deve pesar mais a distância (a base tem 60 de 81 senadores). [mecanicas.md:607-608]
   - Mídia pesar no voto: a mídia não pesa em nada hoje; polêmica (troca de ministro, escândalo, decreto derrubado) precisa de efeito pela mídia. [gdd.md:2085-2089]
   - Opinião central (régua comum de opinião: grupo, partido, ministro, juiz, mídia). [gdd.md:2075-2084]
   - Eleitor se acostuma e julga a melhora; o voto ainda não usa. [gdd.md:2046-2050]

---

## VI.3 Eleição, campanha e mandatos

1. **O que é.** O voto no fim do mandato que decide se o partido continua no poder, mais a campanha, a chapa e a duração do mandato. [gdd.md:1020-1086]

2. **O que o jogador faz e sente.**
   - Monta a chapa antes da eleição: candidato e vice, entre fichas do partido e dos aliados. [gdd.md:1033-1035]
   - Gasta o caixa do partido em ações de campanha com alvo, sem limite por turno; o freio é o caixa e o cansaço (repetir no mesmo grupo rende cada vez menos). [gdd.md:1046-1048]
   - Faz uma promessa de campanha, que fica na tela até a eleição. [gdd.md:1064-1065]
   - Sente a promessa cumprida subir o voto e a quebrada derrubar. [gdd.md:1068-1069]

3. **Peças.**
   - Mandatos: duração e reeleição (Duração de 1 a 10 anos ou indefinida; Mandatos seguidos; Intervalo para voltar; Limite total). [gdd.md:1024-1027]
   - Chapa. [gdd.md:1033-1035]
   - Coligação eleitoral: partidos somam tempo de TV, caixa e eleitores, e cobram lugar na chapa e no futuro governo; pode ser diferente da coligação de governo. [gdd.md:1039-1041]
   - Campanha: comício (um grupo), TV (todo o público, pela mídia), redes (jovens e engajados), debate (carisma contra o adversário), promessa. [gdd.md:1048-1051]
   - A eleição: cada grupo vota pela satisfação, pela distância na bússola até os candidatos, pela campanha e pela mídia; peso é o tamanho do grupo. [gdd.md:1058-1060]
   - Desgaste. [gdd.md:1061-1062]
   - Promessa. [gdd.md:1064-1076]
   - Adversários e dois turnos. [gdd.md:1077-1082]
   - Aprovação. [gdd.md:1083-1085]

4. **Regras decididas.**
   - Duração e reeleição são leis essenciais do país (07/nov); mudar a duração no meio do mandato é possível e caro. [gdd.md:1024-1027]
   - Limite de reeleição: o presidente sai, o partido continua com outro candidato. [gdd.md:1028-1029]
   - Campanha abre nos últimos turnos do mandato (ex.: 3 turnos). [gdd.md:1045]
   - A campanha é nacional e mira grupos, com ação por estado, sempre dentro da eleição nacional. [gdd.md:1053-1054]
   - A lei de financiamento de campanha decide de onde vem o dinheiro. [gdd.md:1052]
   - Desgaste sobe a cada mandato e com escândalos; o jogador reduz, nunca zera. [gdd.md:1061-1062] No código: 2,25 pontos por mandato de 4 anos, sempre. [eleicao.md:10-12]
   - O eleitor percebe o déficit e a inflação, não a contabilidade. [gdd.md:1063]
   - Promessa (12/nov): mira um índice principal com meta, um subíndice ou um programa; principal pesa em todos os grupos, subíndice e programa mais nos grupos que se importam; cumprida sobe o voto, quebrada derruba e sobe o desgaste. Tamanho: o prêmio depende da dificuldade. Em parte: chegar perto vale em parte. Quando: avaliada no primeiro turno da eleição; trocar a promessa no meio do mandato conta como quebrar. [gdd.md:1064-1076]
   - Fórmula no código: efeito no voto = tamanho × (2 × cumprimento − 1) × 0,06; cumprimento abaixo de 0,5 soma desgaste de tamanho × 1. [eleicao.md:79-90]
   - Adversários (12/nov): os partidos de oposição; cada um lança chapa e podem se coligar entre si. No código: se defendem os mesmos grupos (semelhança 0,6 ou mais) se coligam, do maior para o menor. [gdd.md:1077-1078; eleicao.md:61-65]
   - Dois turnos (12/nov): se ninguém passa da metade, os dois mais votados vão ao segundo. O segundo cai no último turno jogável do mandato e o primeiro no anterior. [gdd.md:1079-1082; eleicao.md:54-58]
   - Aprovação (12/nov): satisfação média de todos os pops, pesada pelo tamanho; a mesma conta do voto, sem campanha nem adversário. É o termômetro do mandato (puxa o deputado indeciso, abre CPI e impeachment). [gdd.md:1083-1085]
   - Perdeu, a partida acaba; ganhou, o mandato novo começa. [eleicao.md:54-58]
   - Resultado: Presidência e cadeiras do Congresso. [gdd.md:1086]
   - Cota e eleição pela promessa: quem foca numa área (ex.: segurança) pode ganhar a eleição nessa promessa. [memória project_caminhos_sem_nucleo:8]

5. **Ligações.**
   - Recebe (Gosto/população): satisfação de cada grupo, aprovação, mídia que o grupo assiste. [gdd.md:1058-1060; eleicao.md:66-69]
   - Recebe (Leis): leis de mandato e de financiamento, programa formado (promessa de programa). [gdd.md:1024-1027; requisitos.md:298]
   - Entrega: Presidência, cadeiras do Congresso, fim da partida, fatos "meta cumprida", "meta quebrada", "segundo turno". [gdd.md:1086; eleicao.md:89-90]

6. **Referências.**
   - Governos que já existiram: a cada eleição o novo governo cai perto de um ponto da história (R15.10, Mundo); dados em "leis - Países - governos.tsv" (bússola de cada governo por período, V-Party e CHES). [mecanicas.md:876-879; Países - governos.tsv:1-13]
   - Referência de jogo para a campanha: ESTUDAR.

7. **No motor hoje.**
   - ✅ Mandato e eleição pela lei do país (R13.1); desgaste sobe sempre (R13.2). [requisitos.md:282-283]
   - ✅ Adversários (R13.9) e dois turnos (R13.10). [requisitos.md:285-286]
   - ◐ Voto por grupo, falta bússola dos candidatos, campanha e mídia (R13.3). [requisitos.md:284]
   - ◐ Promessa (R13.11): falta descontar o que o país faria sozinho. [requisitos.md:287]
   - ✅ Aprovação (R9.9). [requisitos.md:206]
   - ☐ Limite de reeleição troca o candidato (R13.4); chapa entre fichas do partido e aliados (R13.5); coligação eleitoral (R13.6); campanha (R13.7); reduzir o desgaste (R13.8). [requisitos.md:288-292]
   - ☐ Placar final: tempo no poder e país deixado (R4.7). [requisitos.md:71]

8. **Em aberto.**
   - Como se reduz o desgaste (o GDD diz que o jogador reduz, nunca zera, sem dizer como). [gdd.md:1061-1062; requisitos.md:292]
   - Eleitor se acostuma (o ganho antigo some, a raiva de cortar fica) e julga a melhora (a seta de tendência existe; o voto ainda não usa). [gdd.md:2046-2050]
   - Mudar de ideia custa: propor e desistir de uma lei não pode ser de graça. [gdd.md:2053]
   - Cota de foco por área: o desenho da "cota" e da promessa estava pendente. [memória project_caminhos_sem_nucleo:12]
   - Placar final: quais números, comparados com o começo? [mecanicas.md:106-107]

---

## VI.4 Judiciário e Justiça e prisões

1. **O que é.** Duas coisas diferentes. Judiciário é um dos Três Poderes, no miolo do mapa: juízes e tribunais, sem ministro. Justiça e prisões é uma instituição do Executivo, sob um ministro: prisões, penas e a política de justiça. [gdd.md:434-447; mecanicas.md:595]

2. **O que o jogador faz e sente.**
   - Quando abre vaga no tribunal, chega um papel importante na mesa com três cartas (aliado do partido, técnico respeitado, nome do lado do Senado); a mesa abre sozinha e a vaga não vence. [gdd.md:452-456; judiciario.md:37-41]
   - O presidente só influencia a Justiça: indica juiz na vaga, pressiona com rastro, aumenta a corte; não julga ninguém. [gdd.md:441-443; gdd.md:446-447]
   - Vê os juízes no miolo, coloridos pelo lado; passar o mouse mostra a fila ("320 processos · 2 seus"). [gdd.md:470-472]

3. **Peças.**
   - Tribunais do país (função genérica: constitucional, última instância, eleitoral, trabalho, militar); o rótulo (STF, TSE) é do país. [gdd.md:2090-2093; judiciario.md:9-12]
   - Juízes: nome, sexo, idade, anos na corte, origem, bússola. [judiciario.md:20-22]
   - Vaga e indicação (lei "Quem escolhe os juízes": carreira, presidente indica e Senado aprova, presidente indica livre). [gdd.md:452-458; judiciario.md:16-18]
   - Presidente da corte: mandato de 2 anos (12 turnos), o mais antigo que ainda não presidiu; o TSE vem do STF. [judiciario.md:51-57]
   - Independência do Judiciário. [judiciario.md:47-49]
   - Fila de processos. [gdd.md:441-443]
   - Caso em etapas: rastro, investigação, processo, sentença. [gdd.md:448-451]
   - Suspender lei. [gdd.md:463-465]
   - Corrupção em cadeia. [gdd.md:473-480]
   - Eleições: instituição sem ministro, pendurada no tribunal eleitoral. [gdd.md:393-397]

4. **Regras decididas.**
   - Judiciário não tem ministro e não entra em caixa. [gdd.md:439-441]
   - Eleições fica sempre com o Judiciário (13/nov); no mapa o escudo fica abaixo do anel do Congresso. [gdd.md:393-397]
   - Fila de processos: pouca verba, fila lenta e o caso prescreve. [gdd.md:442-443]
   - Um caso anda: rastro, investigação, processo, sentença. Condena se a prova existe de verdade, conforme a independência; Foro especial manda o político ao tribunal de cima, mais lento; Delação premiada acelera. Vale para papel duvidoso, líder de organização e escândalo de ministro. [gdd.md:448-451]
   - Quem escolhe os juízes (lei, 14/nov): escada de três degraus. Na carreira o próprio tribunal preenche com um técnico e nada chega à mesa. [gdd.md:452-455; judiciario.md:35-36]
   - O Senado vota: a base do governo aprova; fora dela, só quem está perto na bússola; barrado, a vaga continua, as cartas mudam e chega papel novo. [judiciario.md:42-45]
   - Enquanto a vaga está aberta, o tribunal decide com menos gente. [judiciario.md:46]
   - Aposentadoria abre vaga; cada turno soma 2 meses de idade. [judiciario.md:33-34]
   - Aumentar a corte sai da lei e vira ação numa fatia futura (14/nov). [gdd.md:457-458]
   - Suspender lei: quando a lei bate em direito (degrau extremo de censura, pena de morte, mandato sem fim); chance pela distância entre o tribunal e a lei; chega o papel "tribunal suspendeu a lei". [gdd.md:463-465]
   - O presidente aceita, aumenta a corte (caro no Congresso e na mídia), pressiona o juiz (papel duvidoso, rastro) ou ignora a decisão (crise institucional; liberdade e reputação caem; Risco de golpe sobe). [gdd.md:466-469]
   - Corrupção em cadeia (12/nov): o rastro não some; a chance de ser descoberto usa a independência dos investigadores de hoje, não a da época; se ela sobe, os rastros antigos aparecem de uma vez (escândalo, processo, até prisão do ex-presidente). [gdd.md:473-477]
   - Tribunais genéricos (13/nov): três jeitos no mundo (corte suprema única, corte constitucional separada, tribunais por tema). [gdd.md:2090-2096]
   - Impeachment segue com o Congresso. [gdd.md:472]
   - Justiça e prisões: o ministro faz as leis dela andarem; não julga ninguém. [gdd.md:445-447]

5. **Ligações.**
   - Recebe: leis (Quem escolhe os juízes, Independência dos investigadores), presidente (indicação), Senado (aprova), verba (fila). [gdd.md:443-444; gdd.md:452-458]
   - Entrega: independência da Justiça (índice), fatos "juiz aposentado", "juiz nomeado", "indicado barrado", "corte novo presidente"; suspender lei (Leis); condenação e escândalo (Gosto/população, Congresso). [judiciario.md:35-57; gdd.md:463-465]

6. **Referências.**
   - Corte suprema faz tudo: EUA, Índia, Japão, Reino Unido. Corte constitucional separada: Alemanha, Itália, França. Tribunais por tema: Brasil, Alemanha. [gdd.md:2093-2096]
   - Brasil: STF de 11 cadeiras e TSE só com presidente, nomes parecidos com os reais. [mecanicas.md:599-601; judiciario.md:23-27]
   - Argentina e outros: ESTUDAR (não citados).

7. **No motor hoje.**
   - ✅ Tribunais e juízes (14/nov). [mecanicas.md:597-601]
   - ✅ Vaga e indicação (14/nov). [mecanicas.md:603-608]
   - ✅ Presidente da corte (14/nov). [mecanicas.md:610-614]
   - ✅ Eleições sem ministro, com o Judiciário (R6.27). [requisitos.md:134]
   - ◐ Judiciário (R6.20): independência sai de quem senta; falta fila e caso. [requisitos.md:133]
   - ◐ Tribunal superior (R6.22): falta suspender lei. [requisitos.md:136]
   - ☐ Fila de processos, caso em etapas, suspender lei, corrupção em cadeia (R6.21). [mecanicas.md:616-639; requisitos.md:135]
   - ☐ Papéis duvidosos deixam rastro (R17.14). [requisitos.md:437]

   ⚠ CONFLITO (independência): em 13/nov o GDD diz que a independência vem "pelas leis Indicação de juízes e Independência dos investigadores". [gdd.md:443-444] Em 14/nov diz que a "Independência da Justiça sobe com técnicos e cai com juízes do partido do presidente", e o código calcula pela composição da corte. [gdd.md:456-458; judiciario.md:47-49] A segunda é mais nova, mas não revoga a primeira por escrito. Não foi escolhida. Também o nome da lei muda: "Indicação de juízes" (13/nov) e "Quem escolhe os juízes" (14/nov). [gdd.md:444; gdd.md:452]

   ⚠ CONFLITO (Eleições x Justiça, 13/nov): a planilha diz que Eleições é "ligada à Justiça (muda por país)". [Instituições novas.tsv:29] O GDD diz que ela fica com o Judiciário "e não com a instituição Justiça e prisões" e que "nenhuma caixa a leva". [gdd.md:393-397] O GDD traz a marca "(13/nov)" e substitui a ligação com a Justiça; a planilha não foi atualizada. Pelo exemplo dado na tarefa ("Eleições não tem ministro (13/nov)" revoga), vale o GDD, mas fica para o revisor confirmar.

8. **Em aberto.**
   - Fila genérica: de onde vêm os processos, quem os julga, o que o jogador vê. [mecanicas.md:619-620]
   - O presidente da corte faz alguma coisa no jogo (pauta da fila)? [mecanicas.md:613-614]
   - Quais leis "batem em direito" (marca na lei?). [mecanicas.md:632-633]
   - O voto do Senado na vaga deve pesar mais a distância? [mecanicas.md:607-608]
   - Se cada instituição e cada lei responde a um dos poderes. [gdd.md:2117-2118]

---

## VI.5 Como se perde o poder

1. **O que é.** Os caminhos pelos quais o partido deixa o poder federal. Perder o poder federal acaba a partida. [gdd.md:358-360; gdd.md:41-43]

2. **O que o jogador faz e sente.** Sofre, e entende por quê; perder não parece azar. [gdd.md:230-235]

3. **Peças.** Caminhos (12/nov): [gdd.md:362-370]
   - Eleição: voto no fim do mandato; acaba se outro partido vence.
   - Morte, assassinato, renúncia: idade, atentado, escândalo grande; acaba se o vice é de outro partido.
   - Impeachment (presidencialismo): fato grave, aprovação abaixo de 30%, 2/3 dos votos; acaba se o vice é de outro partido.
   - Moção de desconfiança (parlamentarismo): a base sai e a maioria vota contra; acaba se a nova maioria não é sua.
   - Golpe: Risco de golpe alto, Forças Armadas pouco leais; sempre.
   - Guerra civil: grupos grandes com raiva e armas divididas; acaba se o governo perde a capital.
   - Ala rival (partido único): perder o congresso do partido; sempre.

4. **Regras decididas.**
   - No semipresidencialismo, perder a maioria não tira a Presidência: vira coabitação e o jogo segue (12/nov). [gdd.md:372-373]
   - Jogar como oposição depois de perder: para depois. [gdd.md:41-43; gdd.md:2123]
   - Impeachment precisa de fato (crime ou escândalo), aprovação abaixo de 30% e 2/3 dos votos. [gdd.md:976-977]
   - Moção de desconfiança derruba o governo por maioria simples. [gdd.md:978-979]
   - Se a ala rival ganha o comando do partido único, a partida acaba (12/nov). [gdd.md:902-903]

5. **Ligações.** Recebe: aprovação, escândalo, Risco de golpe, lealdade das Forças Armadas, raiva dos grupos (Gosto/população). Entrega: fim da partida e placar final. [gdd.md:362-370; gdd.md:482-497]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.** ◐ Só a eleição acaba a partida (R4.4). ☐ Demais caminhos (R6.13). ☐ Sucessão (R6.3), impeachment (R6.5), golpe, guerra civil, ala rival. [requisitos.md:63; 126-128; mecanicas.md:690-716]

8. **Em aberto.**
   - Golpe: como o Risco de golpe sobe e como mede o apoio das Forças Armadas. [mecanicas.md:705-707]
   - Moção de desconfiança e ala rival dependem dos sistemas de governo (R12.8). [mecanicas.md:701-703; 714-716]
   - Placar final. [mecanicas.md:106-107]

---

## VI.6 Caminho autoritário

1. **O que é.** O preço de governar contra os freios: o custo vem de quem tem as armas e de quem tem raiva. [gdd.md:482-484]

2. **O que o jogador faz e sente.** Pode censurar, ignorar o tribunal, governar por decreto ou adiar a eleição. Cada passo sobe a raiva dos grupos contrários. [gdd.md:486-487]

3. **Peças.**
   - Passos autoritários (censurar, ignorar o tribunal, governar por decreto, adiar a eleição). [gdd.md:486-487]
   - Raiva alta com satisfação baixa: protesto, atentado e, no topo, tentativa de assassinato. [gdd.md:488-489]
   - Risco de golpe. [gdd.md:491-492]
   - Guerra civil: o país racha por estados e governadores da oposição se rebelam. [gdd.md:493-494]
   - Ditadura que funciona, mas cara: sanções, investimento de fora caindo, gente estudada indo embora, generais que podem trocar o presidente. [gdd.md:495-497]

4. **Regras decididas (12/nov).**
   - A chance de assassinato cai com a segurança do presidente; se der certo, vale a sucessão (vice de outro partido acaba a partida). [gdd.md:489-490]
   - Sem apoio armado (Forças Armadas pouco leais, polícia dividida, facções fortes), o Risco de golpe sobe a cada turno. [gdd.md:491-492]
   - Com as armas leais e o povo calmo, a ditadura funciona, mas cara. [gdd.md:495-497]
   - Decretar dentro da lei Poder de decreto não é passo autoritário; subir ao degrau 4 ou decretar por fora dela é. [gdd.md:937-938]
   - Ignorar a decisão do tribunal: crise institucional, liberdade e reputação caem, Risco de golpe sobe. [gdd.md:467-469]

5. **Ligações.**
   - Recebe: grupos (raiva e satisfação), Forças Armadas (lealdade), polícia, facções, governadores. [gdd.md:486-494]
   - Entrega: sucessão, golpe, guerra civil, sanções e investimento (Economia, Mundo). [gdd.md:495-497]

6. **Referências.** Nenhuma citada. ESTUDAR.

7. **No motor hoje.** ☐ Falta (R6.19): cada passo autoritário sobe a raiva; sem armas leais sobe o Risco de golpe; guerra civil racha por estados. [requisitos.md:129; mecanicas.md:709-712]

8. **Em aberto.** Golpe: como se mede o Risco de golpe. [mecanicas.md:705-707]

---

## Para o revisor

### (a) Todos os ⚠ CONFLITO

1. **Ministros: tempero para o fim x peça central (V.4).** Memória de 30/out: ministros ficam para o final e não se abrem itens de ministro até o autor chamar [memória project_ministros_no_final:8-12]. GDD de 13/nov e ordem do autor: "terminar os ministros" antes do mapa e das leis; troca, demissão barulhenta, fatos do ministro [gdd.md:314-317; gdd.md:2110-2112]. A memória é de antes do recomeço de 31/out. Não escolhido.
2. **R7.11 (lei age pelo órgão) feito x não feito (V.6), mesma data 14/nov.** Feito: [requisitos.md:114; 120; 167]. Não feito ("pouca verba ainda não enfraquece a lei"): [mecanicas.md:437-438; governo.md:47-48]. Não escolhido.
3. **Independência da Justiça (VI.4).** 13/nov: vem das leis Indicação de juízes e Independência dos investigadores [gdd.md:443-444]. 14/nov: vem de quem senta, técnicos contra juízes do partido [gdd.md:456-458; judiciario.md:47-49]. Nome da lei: "Indicação de juízes" x "Quem escolhe os juízes". Não escolhido.
4. **Eleições: "ligada à Justiça" (planilha) x "com o Judiciário, não com Justiça e prisões" (GDD 13/nov) (VI.4).** [Instituições novas.tsv:29; gdd.md:393-397]. Não escolhido.
5. **Partido: "nada feito" (mecanicas.md) x criar partido, chapa e lado feitos (requisitos.md) (VI.1).** [mecanicas.md:722; requisitos.md:66-68]. Conflito leve de escopo. Não escolhido.
6. **Aumentar a corte: lei x ação.** 13/nov: o presidente "aumenta a corte" pela lei Indicação de juízes, caro no Congresso e na mídia [gdd.md:466-467]. 14/nov: "sai da lei e vira ação numa fatia futura" [gdd.md:457-458]. Aqui a 14/nov diz explicitamente "sai da lei", então vale a mais nova; fica registrado só para o revisor conferir.
7. **Corrupção: "some de verdade" x "nenhum dinheiro some".** O caminho do dinheiro proposto em 13/nov tem um filtro em que parte do dinheiro some de verdade [gdd.md:2105-2108; mecanicas.md:532-534]; a regra de 14/nov diz que a corrupção não apaga o dinheiro, ele vai para o bolso de alguém [mecanicas.md:279-287]. A de 14/nov é mais nova e parece pedir a reformulação (mecanicas.md:526), mas não revoga por escrito. Não escolhido.
8. **Veto: GDD x código.** O GDD fala em assinar ou vetar toda lei aprovada [gdd.md:878-879]; o código só põe na mesa a lei emendada pelo Senado [mesa.md:8-10; requisitos.md:264]. Parece lacuna de implementação, não conflito de desenho; registrado só para o revisor.

### (b) O que ficou ESTUDAR

- Referência (jogo ou estudo) para: presidente e vice (ficha), sucessão, fronteira do governo, governadores, partido, modelo de voto do Congresso, campanha, caminho autoritário, perder o poder.
- Ligação da Estatística (parar de medir, esconder, mentir) com mídia e índices (só a Argentina citada).
- Referência de "visão" e de outras mecânicas além das já citadas.

### (c) Fontes não lidas ou lidas só em parte

- Lidas só no cabeçalho ou em parte: "gdd - Instituições.tsv" (antigo, por esfera), "leis - Ministérios.tsv", "leis - Ministérios - países.tsv" (só os nomes dos países e início das linhas), "leis - Países - governos.tsv" (só o cabeçalho e linhas do Brasil e Alemanha), "gdd - Conferência ONU.tsv" (lido, mas não conferi cada pedaço).
- Não lidas: "gdd - Ministérios (antigo).tsv", "leis - Esferas.tsv", `docs/jogo/plano-de-desenvolvimento.md`, `RETOMAR.md`, `docs/jogo/o-que-e-uma-lei.md`.
- `gdd.md` lido nas seções 5, 6, 12, 13, 18 e trechos de 17 só pelo título; seções 7 a 11, 14 a 16 e 19 não lidas.
- `mecanicas.md` lido nos §9 a §14, mais 1.4, 3, 6.3, 5.0, 5.13 e 8; `requisitos.md` lido nos R4, R5, R6, R7.11, R9.9, R12, R13 e R17.10 a R17.24 apenas por busca.
- Memórias lidas: project_ministros_no_final, project_esfera_ministerio, feedback_orgaos_e_verba, feedback_sem_pontos_de_acao, project_caminhos_sem_nucleo, project_tres_camadas, project_base_ciclo, feedback_resultado_emerge, feedback_leis_x_decisoes. As outras (índice) não foram abertas.
- Número de linhas citadas como "bloco Construção" do `requisitos.md` (V.2) apontam para o bloco que começa em 138; conferir se a linha exata está certa.
