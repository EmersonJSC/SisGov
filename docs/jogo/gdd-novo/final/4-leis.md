## Parte 4. Leis (e quem as executa)

Esta parte tem duas metades. Primeiro, as regras das leis: o que é uma lei, tipos, jeitos, canais, escassezes, programas, processos, força e atraso, lei boa e lei ruim, índices. Depois, "Quem executa": a lei mora numa instituição, e a instituição fica com um ministro. Por isso instituições, ministros, caixas e fronteira do governo entram aqui (14/nov). As contas do Estado (Tesouro, receita, gasto, dívida) ficam na Parte de Economia. Presidente, vice, sucessão, pessoas e governadores ficam na Parte Política.

Números de partida (14/nov): 511 leis na planilha `gdd.xlsx`; 34 instituições com lei; 73 programas no motor; 4 abas de apoio (degraus com 1032 linhas, efeitos com 1359 linhas). A planilha tem 256 leis de forma régua e 255 de degraus.

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R é o requisito em `requisitos.md`.

---

### 4.1 O que é uma lei

**O que é.** Uma lei é uma pergunta que o presidente responde e que fica valendo.

**O jogador.**
- Propõe, muda e revoga leis.
- Toda lei aparece como uma bolha no mapa. Mecânica nova não vira painel de gestão.
- O laço vivido: vê um problema, procura as leis que mexem nele, escolhe quanto mover sabendo quem perde, paga no Congresso e nos grupos, espera o atraso, vê o efeito (inclusive o que não queria), e o efeito cria o próximo problema.
- Cada lei só precisa servir a esse laço. Se não ajuda em nenhum passo, não é do jogo.
- O jogo deve ter centenas de caminhos. O autor recusou um núcleo de 40 leis (08/nov).

**Peças.** Uma lei tem sete peças:
- a pergunta, uma só; se responde duas, são duas leis;
- as respostas possíveis (o jeito);
- o dono, que é a instituição que executa;
- a entrada no motor (o canal), que é o primeiro número que a lei mexe;
- quem ganha e quem paga;
- o lado, para onde puxa na bússola;
- o tempo até o efeito aparecer.

Sem canal ou sem quem ganha e paga, a lei não está pronta.
- O molde da lei na planilha: nome e texto, instituição, tipo, forma, quórum (comum, absoluta, constitucional ou mandato), bússola, canal, efeitos, ganho e custo. Uma lei sem canal não entra no jogo.
- Duas camadas: essenciais (estrutura do Estado, mudam pouco) e jogabilidade (as políticas).
- Toda lei mora numa das 36 instituições, ou nas regras dos poderes. Instituição não é ministério.

**Regras**
- **O que não é lei** (14/nov): processo (vai para Processo), consequência (vira índice), caso a caso (papel na mesa ou evento), opção de menu (Posição por país ou Operação), o que acontece uma vez (Ato), informação (marca na régua de outra lei).
- **Princípio 1:** leis são o núcleo do governo; mudar uma lei muda o jogo.
- **Princípio 3:** nenhuma lei é um controle só que faz coisa grande; o tema se divide em leis menores, cada uma com escolha de verdade. A regra vem do autor, que cobrou duas vezes (01/nov): "as leis têm que ser jogáveis".
- Antes de desenhar a lei, 4 perguntas do autor (03/nov e 04/nov): quanto; em partes ou só no todo; processo ou lei; "um presidente real assinaria e pronto?".
- **Princípio 13:** toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. Lei que só mexe na opinião não basta.
- **Princípio 4:** nada é bom ou ruim; toda lei tem ganhadores, perdedores e consequências.
- **Princípio 5** (reescrito em 14/nov): nada aparece do nada, e nenhum dinheiro some, nem o ilegal. Todo dinheiro do Estado entra por uma lei ou por um bem do Estado e sai por uma lei ou obrigação. O dinheiro desviado vai para o bolso de alguém e deixa rastro.
- **Princípio 9:** jogabilidade primeiro, realidade como base; lei inventada vale se for plausível.
- **Princípio 10:** o motor não conhece nome de lei; a lei declara, o motor calcula.
- **Nada = não legislada** (14/nov): nenhum degrau "nada, nenhum, sem regra" e nenhuma régua que no mínimo não faz nada. A lei existe quando age; revogar é voltar ao nada. O país declara só a lei que tem de verdade; o resto é o cardápio do jogador. Só a lei essencial pode ter o degrau "nenhum", e ela não se revoga.
- O país declara as leis que tem. Lei que não faz sentido no país não aparece; lei que não cabe ao presidente fica **inativa** e alguém pode propô-la.
- O texto da tela sai dos números da lei: texto e motor nunca discordam.
- **Juntar** quando duas leis mexem no mesmo número ou uma é degrau da outra. **Separar** quando os degraus são coisas diferentes, quando a lei tem dois números, ou quando cada estrato ou setor pede o seu valor.
- Régua por estrato ou por setor vira uma lei por estrato ou setor, ligadas pelo "Parte de". A planilha tem 55 leis com "Parte de" preenchido.
- **Leis e decisões** (08/nov): lei é regra permanente e tem bolha. A decisão do presidente é o que aparece ao clicar num país ou companhia (Ato ou Operação), com custo, tempo e reação, e é limitada pelas leis.
- **Mercado indireto** (08/nov): não existe lei que dê lucro a um produto. Leis mexem em demanda e custo, e a cadeia espalha.
- **Resultado emerge** (04/nov): a lei muda só um número. Se é boa ou ruim sai do estado do país, nunca de condição escrita na lei.
- **Os dois lados legislam:** esquerda e direita têm leis próprias; zerar uma lei de um lado não é política do outro. Ao listar as leis de uma instituição, conferir o equilíbrio dos lados.
- **Sem limite de leis por instituição** (07/nov); não se corta um núcleo (08/nov).
- **Sem pontos de ação:** o limite vem do mundo (Congresso cheio) e só atrasa, nunca proíbe (11/nov).
- **Jogável não é demorado:** a decisão acontece no turno; nenhuma opção com efeito neutro (02/nov).
- **Aprovação sem sorteio:** vem do Congresso e dos grupos, nunca de um dado.
- **Mudar de ideia custa:** propor e desistir de uma lei não pode ser de graça.
- **O Congresso é a trava, não o jogo:** o jogador pode propor qualquer coisa; o exorbitante o Congresso barra.
- **Dinheiro:** a lei diz onde mexe no dinheiro e na vida (quem paga, quem recebe, que preço sobe, que emprego abre). O gosto nasce daí. A bússola continua, com peso menor que o bolso.
- A lei é medida pelo país da partida ("2 salários médios do país"), nunca por país real.

**Ligações**
- Gosto: toda lei chega ao pop; o motor calcula o efeito em cada pop e o gosto nasce daí. Hoje a satisfação do grupo lê renda, índices cobrados e bússola; só imposto de renda e transferência mexem no bolso; as outras cerca de 480 leis agradam ou irritam só pelo ponto na bússola.
- Economia: a lei entra por imposto, verba, transferência, preço, regra ou direito (4.4).
- Estado: a lei mora numa instituição e age pelo rendimento dela (4.11).
- Política: a bússola da lei define quem gosta; quórum e voto no Congresso decidem se passa.

**Referências.** Victoria 3: ligação entre economia, pop e política, a mais elogiada pelos jogadores. Victoria 3: sorteio para passar lei irritou; propor e cancelar virou truque. Frostpunk: "dá para desbloquear tudo, nada renuncia nada".

**No motor hoje**
- ✅ Duas camadas, régua e degraus (R7.1). ✅ A lei declara efeito, força, atraso, bússola e base (R7.2). ✅ Validador com arquivo, campo e motivo (R7.3). ✅ País declara as leis que tem (R7.4). ✅ Texto sai dos números (R7.5). ✅ 511 leis saíram da planilha (R7.14).
- ◐ Toda lei chega ao pop (R7.12): 120 leis chegam por um caminho do motor e as outras esperam a triagem. ◐ Temas em pacotes (R7.6). ◐ Leis padronizadas por instituição (R7.22): base pronta, faltam as 4 ondas. ◐ Toda lei numa instituição (R7.13).
- Pela planilha de hoje: 338 de 511 leis ainda têm canal "espera" (320 delas "triagem"); canais já preenchidos: regra 74, verba 70, imposto 16, direito 9, transferência 4.
- Dados de partida do plano: 100 leis não mexem em nada; 47 leis estão no centro da bússola e nenhum grupo reage a elas; só cerca de 80 têm dinheiro de verdade.

**Em aberto**
- Como medir a força de um grupo e quanto ela muda a popularidade de uma lei.
- O que fazer com as 100 leis que não mexem em nada.
- Se cada instituição e cada lei responde a um dos poderes.
- Instituições sem jogo (Estados e municípios, Religião, Turismo, Indústria; Funcionalismo tem uma lei) entram quando as leis forem refeitas.
- O motor ainda não faz a lei mudar o gosto pelo bolso, só por imposto de renda e transferência.
- Números que não batem: o requisito R7.12 diz 120 leis por um caminho do motor; a contagem da planilha dá 173 de 511 fora de "espera". Conferir qual é a mais nova.

---

### 4.2 Tipos de lei

**O que é.** O tipo diz quanto tempo a lei vale e como ela aparece: Lei, Lei com prazo, Ato, Posição por país ou Operação.

**O jogador**
- **Lei:** fica valendo, tem bolha.
- **Lei com prazo:** acaba sozinha e volta a "não legislada"; a bolha tem relógio. Exemplo: Anistia fiscal, uma janela de 1 a 3 turnos. O jogo lembra quantas vezes foi usada.
- **Ato:** acontece uma vez, como botão ou papel. Exemplos: Graça, suspender a regra fiscal, visita de Estado. Fica como botão na instituição, com custo na hora.
- **Posição por país:** nível decidido no menu do país, que fica valendo (Sanções, Aliança).
- **Operação:** em etapas, sobre uma companhia, com papéis na mesa; vive na lista de companhias e não vira bolha.

**Peças**
- Lei com escolha: além do valor, o jogador marca a que ela se aplica na própria bolha (exemplo: Incentivo a setores marca os setores). Os nomes vêm dos dados.
- Posição por país e Operação só ficam marcadas na planilha; entram com o Mundo e as Companhias.
- Planilha: 1 Lei com prazo e 1 Ato marcados; as demais têm o tipo em branco (Lei).

**Regras**
- Tipo, jeito e canal são os três eixos de classificação; a folha mostra os três ao jogador (14/nov).
- Lei com prazo e Ato nascem com a primeira lei que os usa: Anistia fiscal na onda 1, Graça na onda 2 (aprovado 14/nov).
- As opções do menu de país ou companhia não são leis; as leis decidem o que o presidente pode fazer (Alcance das sanções, Aprovação de tratados, Autorização para estatizar e vender, Indenização).
- Se tudo vira lei, o mapa enche de bolhas e a decisão do dia a dia se perde.
- Só se mexe em companhias, nunca em fábrica solta.

**Ligações**
- Economia: Operação age sobre companhias, com papéis na mesa.
- Mundo: Posição por país entra com o Mundo.
- Estado: o Ato tem custo na hora; a Anistia fiscal arrecada enquanto vale, menos a cada uso repetido.

**Referências.** **ESTUDAR** (nenhuma fonte de jogo ou estudo ligada a tipos de lei).

**No motor hoje**
- ◐ Tipos (R7.16): Lei com prazo e Ato feitos. `tipo` é `lei` (ausente), `prazo` (acaba depois de `prazo_turnos`; o estado guarda o fim em `prazos` e os usos em `usos`) ou `ato` (aprovado, os efeitos entram e a lei não fica; `valores.perdao_da_divida` tira parte da dívida).
- ☐ Posição por país e Operação (dependem do Mundo e da Economia).

**Em aberto**
- Como cada tipo aparece: bolha com relógio, botão, menu do país, lista de companhias.
- Se a "lei com escolha" (marcar setores na bolha) é a mesma coisa que o jeito Escolha, que saiu em 14/nov (ver 4.3), ou se vira Régua por setor.

---

### 4.3 Jeitos: Régua, Verba e Níveis

**O que é.** O jeito é como o jogador mexe na lei; são três, e só três: Régua, Verba ou Níveis. O jeito Escolha saiu (14/nov): as 7 leis que tinham Escolha viram Níveis na revisão.

**O jogador**
- Toda lei é um slider.
- **Régua:** qualquer valor entre o mínimo e o máximo faz sentido; não gasta direto.
- **Verba:** também é número, mas vira gasto do orçamento. Cobre dois canais: a verba que vai a uma **instituição** (canal verba) e a que vira renda de um estrato de **pops** (canal transferência). Disputa o caixa e entra no déficit.
- **Níveis:** poucos degraus fixos (3 a 5), cada um uma coisa diferente, sem meio entre eles ("meia cannabis" não existe).
- A régua não limita o jogador: vai ao extremo que algum país real já usou (IR dos EUA chegou a 91% nos anos 1950). Quem para o exagero são as consequências.

**Peças**
- Árvore de decisão: número com unidade real e meio que faz sentido? Se sai do orçamento como gasto, é Verba; se não, Régua. Se não, Níveis.
- Para pôr em ordem respostas de "jeitos diferentes": ordenar pelo quanto o Estado entra ou sai, ou por quantas pessoas a lei alcança. Sem ordem possível, são leis diferentes ou nem é lei. Opções sem ordem viram degraus de Níveis.
- Sinais de jeito errado:
  - Níveis que são números disfarçados ("pouco, médio, muito") viram Régua.
  - Régua cujo meio não existe (metade de um monopólio) vira Níveis.
  - Duas respostas só é slider faltando resposta: achar degraus do meio, ligar com outra lei ou apagar.
  - Dois números na mesma lei: separar em duas leis (a antiga forma "Dois controles" saiu, 14/nov).
  - Cada estrato ou setor pede o seu número: uma lei por estrato ou setor, ligadas pelo "Parte de".
- Formas especiais (08/nov): **Régua por setor** (uma aba por setor, como a Tarifa de importação) e **Divisão de 100%** (fatias que somam a verba toda; subir uma derruba as outras, como a Divisão da verba de ciência). A forma "Meta e prazo" saiu: vira duas leis ou uma Lei com prazo.
- Marcas na régua: a régua mostra marcas calculadas pelo motor, sem virar lei nova (na Verba das aposentadorias: quanto cada aposentado recebe, "compra o mesmo que no ano passado"). Vale para toda verba e imposto. "Perfeito", disse o autor da régua em % do PIB com marcas.
- Juntar antes de criar: leis que respondem à mesma pergunta viram degraus de uma só, e vizinhas viram uma régua. O alvo é o menor número de leis que cobre todas as decisões do presidente.

**Regras**
- Decidido em 14/nov: a Escolha saiu; toda lei é Régua, Verba ou Níveis.
- Duas respostas é slider faltando resposta (completar, ligar ou apagar).
- Régua sem limite: vai ao extremo real; quem para são as consequências.
- **Um lado por lei e régua sem limite convivem.** A régua vai ao extremo real, mas num lado só da bússola: cada lei vai de "não legislada" a "mais" num lado, nunca de um extremo ao outro (03/nov). Exceção escrita (08/nov) para as leis de valor ou escala (Imposto de renda, Imposto sobre empresas, Liberação das drogas e dos jogos), que usam o valor inicial do país como zero e podem cruzar o meio. Verbas e tetos têm um lado só, com pouca força. O motor guarda `bussola.ate`: acima dele a lei fica na ponta (100% de imposto é tão extremo quanto 90%), e a faixa do controle não mexe no equilíbrio.
- Nenhuma lei vira botão (régua em que só uma ponta serve, que funciona como interruptor).
- Um número com unidade real: %, anos, salários mínimos; unidade livre (km/h, mandatos, % acima de 100).
- Verba (14/nov): régua em % do PIB que vira gasto, pelo canal verba (instituição) ou transferência (pop).
- Níveis: escada ordenada de 3 a 5 degraus reais, num lado só da bússola. Cada degrau é uma coisa real (Liberação das drogas, Autonomia das Forças Armadas em 5 níveis).
- Nenhum degrau "nada": o nada é a lei não legislada. Só a lei essencial pode ter o degrau "nenhum" (14/nov). O motor recusa degrau que não faz nada.
- Duas opções e poucas opções para tema de números são ruins (câmbio "solto ou travado"; Reajuste com 3 opções: "isso é realista?").

**Ligações**
- Economia e Estado: Verba entra direto nas contas como gasto em fração do PIB (`conta: "gasto"`), sem cálculo.
- Gosto: a posição na bússola (`bussola`) diz onde a lei fica, no mínimo e no máximo da faixa ou em cada opção. Quem gosta sai da distância até cada grupo.
- Política: Divisão de 100% e Parte de ligam leis entre si.

**Referências**
- Democracy 4 passou a cobrar pelo tamanho do passo, porque política barata e só com ganho vai ao máximo e o slider vira botão.
- Sid Meier (GDC 2012): troca e decisão que depende da situação fazem a decisão interessante.

**No motor hoje**
- ✅ `forma: "continua"` (valor em fração dentro de `faixa`, com `passo`; `unidade` fração, meses ou anos) e `forma: "opcoes"` (ao menos duas opções com efeitos).
- ✅ `jeito` (`regua`, `verba`, `niveis` de 3 a 5 degraus), obrigatório na lei já triada. O motor ainda aceita `escolha` e a planilha ainda tem 7 leis com esse jeito; a revisão os converte em Níveis.
- Planilha: 191 leis com jeito preenchido (Verba 74, Níveis 56, Régua 54, Escolha 7); 320 ainda sem jeito (triagem).
- ☐ R7.17: a fatia da divisão valer o peso dela sobre a soma, quando a mecânica ler.
- R7.15 feito: as formas especiais foram divididas (dois controles em duas leis, divisão de 100% em pesos, régua por setor geral).

**Em aberto**
- Se a verba também precisa passar no teste do botão (lado só de "mais"). Em 14/nov a Verba vai de "não legislada" a mais num lado só, e a regra do botão pede que as duas pontas sirvam a alguém.

---

### 4.4 Canais (como a lei chega ao pop)

**O que é.** O canal é o mecanismo genérico do motor pelo qual a lei chega à vida do pop; a lei aponta o canal e o motor calcula, sem conhecer a lei.

**O jogador.** Vê, na bolha, a linha "como chega a você", o canal em texto de leigo.

**Peças.** Seis canais:
- **Imposto:** cobra de uma base (renda, consumo, lucro, emissões, terra) pela curva de Laffer; tira renda ou sobe preço.
- **Verba:** gasto do governo vai à instituição; o rendimento dela vira serviço.
- **Transferência:** gasto vira renda de um estrato de pops.
- **Preço e custo:** mexe no preço ou no custo de um setor do mercado.
- **Regra de módulo:** muda um número de um módulo (moradia, atendimento, saneamento, Judiciário, Congresso, eleição).
- **Direito:** muda uma liberdade; índices de liberdade e quem gosta pela bússola.
- Mais o canal provisório `espera`, com a razão ("triagem" até a onda da lei, ou a mecânica que falta).
- "Emprego" (62 leis no acervo) não tem canal hoje: depende de prédios que contratam (R16.27). "Governo" (81 leis no acervo) são regras do Estado; o canal é regra de módulo.

**Regras**
- Canal é obrigatório; uma lei sem canal não entra no jogo (aprovado 14/nov).
- Direito conta como chegar ao pop (decisão 4, aprovada).
- Lei cujo canal ainda não existe fica no jogo só com o efeito em índice, marcada "espera mecânica" (decisão 3, aprovada).
- O validador confere que o canal bate com o que a lei faz.
- Base de imposto nova é entrada nova em `BASES`: a lei diz `"calculo": { "base": "renda" }` e o motor faz a conta.
- Cada lei de imposto declara quem paga do bolso (`incide`): renda e movimentação, todos; patrimônio, aplicações, imóvel e capital, o rico; folha, o pobre e o médio. Consumo, lucro, emissões, terra e bancos não tiram renda dos pops direto.
- Receita, PIB e juros vêm do cálculo, nunca de `efeitos`.

**Ligações**
- Economia: preço e custo de setor (`valores` nas fichas de setor).
- Gosto: transferência (`para`) e imposto de renda mexem no bolso.
- Estado: a receita de cada base é calibrada pelo país; a `receita_fora_das_leis` caiu o que as leis novas passaram a arrecadar.

**Referências.** Victoria 3: impostos em 5 níveis por tipo (por pessoa, terra, consumo, renda, dividendos); gastos são salários e insumos dos prédios do governo. Saez, Slemrod e Giertz (2012) para a curva da renda.

**No motor hoje**
- Imposto: ✅ (`calculos`). Verba: ◐ (verba e rendimento sim; serviço só em atendimento e saneamento). Transferência: ✅. Preço e custo: ✅. Regra de módulo: ✅, módulo a módulo. Direito: ✅.
- Planilha: regra 74, verba 70, imposto 16, direito 9, transferência 4, espera 338.
- ☐ Canal de Emprego (R16.27). ☐ Verba que chega a quem recebe, exceto a transferência.

**Em aberto.** Se alguma lei de Governo precisa de canal próprio além de "regra de módulo". **ESTUDAR** (nenhuma fonte levanta o caso).

---

### 4.5 Ponto doce e regulador

**O que é.** A lei não tem um valor certo fixo; tem um **ponto doce**, o valor em que o ganho ainda compensa o custo, e um **regulador**, o número do mundo que move esse ponto e obriga o jogador a voltar à lei.

**O jogador.** Perto do extremo da régua o ganho cai e o custo sobe. O jogador tem de voltar à lei quando o mundo muda; sem isso, descobre o valor certo uma vez e nunca mais pensa.

**Peças**
- O ponto doce vem do mundo, não do fim da régua.
- O regulador é algo que muda sozinho: idade da população, inflação, preço do petróleo, ciclo da economia, eleição. Se o ponto doce muda só com a estratégia do jogador, vira receita pronta (aconteceu com o imposto do Victoria 2).
- Exemplos: transferência de renda, regulada por quantos pobres existem; verba da saúde, pela idade da população; IR do rico, pela dívida e economia.
- Por canal:
  - Imposto: Laffer (subir demais encolhe a base; o país declara onde começa).
  - Verba: verba acima do que a instituição precisa vira corrupção.
  - Transferência: vaza para quem não precisa quando cobre mais que os pobres.
  - Regra e direito: nada ainda.
- **Fuga da regra** (proposta, ainda não decidida): quanto mais forte a regra, mais gente foge (salário mínimo alto empurra para o informal; proibir demais cria mercado ilegal; licença difícil vira obra sem licença); quanto foge depende da verba de quem fiscaliza. É a "Laffer" das regras. Está também na lista de ideias do GDD, junto com a sonegação que cresce com o imposto.

**Regras (14/nov)**
- Toda lei tem regulador; o ponto doce vem do mundo.
- Teste 6 de resposta de verdade: a lei diz qual número do mundo muda o valor certo dela; lei sem regulador é cenário.
- Teste 3 sem motor rodando: escrever o caso em que cada resposta ganha; sem caso, a lei falha.
- Evasão: fração da base que escapa do fisco, declarada pelo país.
- O país declara o pico de Laffer; o motor deriva `e = (1 − pico)/pico`. Sem declaração, usa pico 0,6 e evasão 0,1.
- Lei de regra custa: fiscalizar pede trabalho à instituição (sobe a necessidade dela); sem verba para isso, a regra alcança menos gente. Esse custo vai a bolsos (salário de fiscal, compra de equipamento); a multa de quem foi pego vai ao Tesouro.

**Ligações**
- Economia: Laffer, evasão e juros em `motor/calculos`.
- Gosto: a transferência que passa dos pobres vaza para o estrato de cima.
- Estado: verba de sobra vira corrupção `12 × (rendimento − 1)` por turno.
- Política: o regulador pode ser a eleição (perto da eleição, baixar agrada).

**Referências.** SimCity 2000 (imposto bom entre 7 e 9%); Civ IV ("ciência sempre no máximo"); Victoria 2 (receita pronta do imposto). Sid Meier: boa uma vez pode ser chata na décima. Democracy 4: fim de jogo "resolvido"; remédios são demanda que cresce, complacência e eleitor que julga a tendência.

**No motor hoje**
- ✅ Imposto pela curva de Laffer com pico declarado pelo país; verba de sobra vira corrupção; transferência que cobre mais que os pobres vaza para o estrato de cima (para a transferência principal).
- ✅ Pouca verba enfraquece a lei (R7.11, 14/nov): ver 4.11.
- ☐ Sonegação que cresce com o imposto e cai com a fiscalização (hoje fixa).
- ☐ Fuga da regra para leis de regra e direito.

**Em aberto**
- Fuga da regra: decidir se entra e como.
- O regulador de cada lei sai da revisão instituição por instituição.
- Marcas na régua (4.3): saber de onde o motor tira cada marca.

---

### 4.6 Escassezes e o que torna a lei jogável

**O que é.** As escassezes são o custo de mudar uma lei: dinheiro, Congresso e gente. Toda lei usa ao menos uma.

**O jogador.** Vê o custo ao mudar a lei: a verba disputa o orçamento, a lei gasta apoio e tempo na fila do Congresso, um grupo perde e cobra na eleição.

**Peças**
- **Dinheiro:** a verba disputa o orçamento.
- **Congresso:** a lei gasta apoio e tempo na fila.
- **Gente:** um grupo perde e cobra na eleição.
- Podem se misturar, e é o normal (IR do rico custa gente e Congresso). Lei que não usa nenhuma é a lei que todo mundo liga.
- As cinco exigências para a lei ser jogável (além do custo de mudar): ganho e custo em lugares diferentes; depende do estado do país; mexe em algo que existe; custa mudar; espalha pela cadeia.
- Seis testes de cada resposta: alguém defende; muda um número; ninguém ganha sempre; o jogador vê; não vira botão; tem regulador.
- Sete exigências do **conjunto** de leis de uma instituição:
  - os lados legislam;
  - cada índice da instituição tem alavanca para os dois sentidos;
  - barato e caro, rápido e lento;
  - uma tensão dentro (duas leis puxam em sentidos contrários);
  - sem repetição;
  - sem buraco (toda decisão real tem uma lei);
  - obriga a abrir mão (se dá para ligar tudo de bom, nada é escolha);
  - do problema até a lei, em um ou dois cliques; índice sem lei para algum lado é **buraco**; lei que não mexe em nenhum índice está **solta**.

**Regras**
- Teste 3 ("ninguém ganha sempre") é o mais importante: é ele que faz o resultado emergir.
- O conjunto obriga a abrir mão e liga cada problema às leis (14/nov).
- O limite não vem de pontos de ação: vem do mundo (Congresso cheio) e só atrasa (11/nov).
- Eleitor se acostuma: o ganho de um benefício antigo some com o tempo, mas a raiva de cortar continua (ideia, 14/nov).
- Eleitor julga a melhora: compara com antes, não com o ideal (ideia, 14/nov).

**Ligações**
- Gosto: a escassez "gente" é o grupo que perde e cobra.
- Economia e Estado: a escassez "dinheiro" entra no déficit e disputa o caixa.
- Política: a escassez "Congresso" é o apoio gasto e a fila.

**Referências.** Frostpunk (nada renuncia nada); Democracy 4 (slider vira botão sem custo; passou a cobrar pelo passo); Victoria 3 (sorteio para passar lei; propor e cancelar virou truque).

**No motor hoje.** ✅ Corrupção da verba de sobra. ☐ Custo na gente e no Congresso por lei declarado de forma própria. **ESTUDAR** (nenhuma fonte diz o que o motor faz hoje com a escassez "gente" por lei).

**Em aberto**
- A "cota" de foco numa área e a promessa de campanha ainda precisam de desenho.
- Mudar de ideia custa: ainda sem desenho.

---

### 4.7 Nome e texto da lei

**O que é.** O nome diz o que a lei controla, em palavras de todo dia, no mesmo molde para todas: **o que + de quem/sobre o quê**.

**O jogador.** Ao passar o mouse, lê uma frase de leigo que diz o que muda na vida de alguém, com exemplo.

**Peças**
- Exemplos: "Imposto sobre consumo", "Imposto de renda do rico", "Piso da saúde".
- O nome real do país (IBS, CBS, Selic) pode aparecer embaixo, menor, como rótulo do país.
- SisGovpedia: enciclopédia aberta pelas dicas ao passar o mouse, em camadas (frase curta, porquê, conta).
- Mostrar o atraso: a lei diz "efeito em N turnos".

**Regras**
- Sigla e nome técnico nunca no nome.
- Texto de leigo, com exemplo do dia a dia, sem jargão ("indexação", "faixa", "acompanha a inflação" foram rejeitados).
- Frase enigmática ou metafórica é ruim ("Cidade que não fica isolada: confuso"); dizer o que muda.
- Não detalhar além do necessário; número fino fica para a calibração do fim.
- Nenhum nome de país na lei; nome local ("Selic") é rótulo do país.
- A lei não cita grupo: quem gosta sai da distância na bússola.
- Países reais podem entrar (08/nov); a lei continua genérica ("2 salários médios do país").
- Lei, opção e programa podem ter origem em programa real, só como desbloqueio e campanha, nunca no texto da lei.

**Ligações.** Gosto: o texto lido pelo jogador sai dos números da lei.

**Referências.** Nada do Democracy 4 (nome, número, ligação); Victoria 3 só como ideia.

**No motor hoje.** ✅ Texto sai dos números (R7.5). ☐ SisGovpedia (ideia guardada).

---

### 4.8 Programas

**O que é.** Programa é um pacote de leis que resolve um problema (exemplo: Tarifa social, que junta luz, água e gás). A palavra é do autor e não se usa para outra coisa.

**O jogador**
- Junta leis do mesmo pacote; quando a maior parte anda na direção do programa, ele se forma e o jornal anuncia ("Governo lança o Mais Escola").
- O programa não mexe no país além das leis; o ganho é de memória.
- Tema com partes vira programa; o autor aprovou Tarifa social em 3 leis, "formando um programa".

**Peças**
- 73 programas no motor, da Saúde à Cultura, com lados equilibrados. O desenho da planilha tem 74 pacotes (o de Economia verde ficou de fora por falta de leis): 22 de esquerda, 22 de direita (contando os que são também tradicionais ou autoritários), 14 do meio, 4 verdes e o resto de outros lados. A aba Programas diz o lado, as instituições e as palavras do nome. A aba Programas - leis diz a **direção** (sobe, desce, liga, mais fechado) e o **mínimo** que conta (1 degrau, 10% da régua, 1 fatia da divisão).
- Colunas do TSV de programas: Programa, Lado, Esferas, Leis, Forma-se com, Tema, Bem, Mal, Público, Programas reais parecidos.
- Colunas do TSV de leis por programa: Programa, Lei, Esfera, Subesfera, Forma, Direção, Mínimo; 314 linhas.
- Programas reais: a aba lista os de governos reais parecidos (110 citados); os que são lei caem num programa, ficam fora as posições por país e as leis soltas. Uso futuro: desbloqueio ("você imitou o programa tal do presidente tal") e campanhas.
- **Gerador de nomes:** moldes com lacunas ("Minha ___, Minha ___", "___ para Todos", "Mais ___", "País sem ___", "Bolsa ___", "Pacto pela ___", "Programa Nacional de ___", "Ordem e ___", "___ Livre") preenchidos com as 4 palavras do programa (tema, bem, mal, público). O lado do partido escolhe o molde: esquerda puxa "para Todos" e "sem ___", direita "Livre" e "Responsável", autoritário "Ordem e ___".

**Regras (12/nov)**
- **Forma-se** quando a maior parte das leis da lista (3 de 4, 2 de 3) anda pelo menos o mínimo na direção do programa dentro de um mandato. Só lei de verdade entra: Operação, Ato e Posição por país ficam de fora.
- **Vários ministérios:** programa com leis em mais de uma caixa anda no passo do ministro mais fraco: usa o atraso e a força desse ministro.
- **Miúdos:** conta quando a lei é aprovada, não quando o efeito chega; a janela é o mandato atual; lei em dois programas conta para os dois; lei com prazo conta enquanto vale. Antes de uma lei desfazer um programa, a tela avisa.
- **Nome:** o JSON do país pode dar o nome próprio; sem nome do país, o gerador cria e o jornal anuncia. Moldes são do mundo; o motor não conhece nomes.
- **Lembrança:** formado, os grupos que gostam guardam a lembrança (força pelo tempo que durou e pelo que ganharam), que pesa no voto e cai devagar.
- **Nostalgia:** desfeito (as leis voltam abaixo da maioria), a lembrança vira nostalgia: quem gostava sente falta e cobra de quem desfez.
- **Recriado:** o jogo pergunta se o governo quer usar o mesmo nome. Mesmo nome: a nostalgia volta de uma vez como apoio, mas a raiva de quem odiava volta junto e parte do crédito fica com o partido que criou. Nome novo: começa do zero, sem bagagem.
- **Rebatizar:** quem está no poder pode trocar o nome de um programa herdado; a lembrança do nome antigo fica com o partido que o criou.
- O país declara os programas que já existiam (nome, partido que criou, força da lembrança). A memória é guardada pelo código do programa.
- **Simulador de governo** (31/out): programas não servem de termômetro; medir por decisão, lei por lei, nunca por programa de personalidade.
- Programa inventado (o jogador junta leis livres e o jogo cria um programa novo) está guardado para depois.

**Ligações**
- Gosto: lembrança e nostalgia pesam no voto e nos grupos (o motor ainda não lê).
- Política: o programa usa o ministro mais fraco da caixa (4.19 e 4.20).
- Mídia: o jornal anuncia o programa formado, com o nome.

**Referências.** Programas reais de governos reais (110 citados na planilha). Nenhuma referência de jogo ou estudo. **ESTUDAR** (outros jogos que tenham pacote de leis).

**No motor hoje**
- ✅ 73 programas formam-se pelas leis (R7.18); ✅ passo do ministro mais fraco (R7.21).
- Conta: a lei "andou" quando, desde o começo do mandato, o valor se moveu na direção pedida pelo menos o mínimo; o programa espera o maior atraso entre as leis dele.
- Estado: `estado.programas = { mandato, referencia, formando, vidas }`; fatos `programa-formado` e `programa-desfeito`.
- ◐ Lembrança e nostalgia pesando no voto (R7.19). ◐ Nome pelo gerador e rebatizar (R7.20).
- O Brasil 2026 já começa com Farmácia Popular, Saúde da Família e Bolsa Família.
- Dívidas do código: lembrança pesar no voto; perguntar o nome ao refazer; conferir direções ambíguas da planilha ("aberto", "mais livre", "mais curto") lidas como `sobe`; 21 ligações a leis que o jogo ainda não tem.

**Em aberto**
- Programas de Drogas e Apostas só se formam quando as leis de Vícios ("A criar") forem escritas.
- Leis que faltam aos programas: ajuda para a empresa reduzir a jornada sem demitir; controle de natalidade.
- Programas esperam a Opinião (mecânica 3) para a lembrança.

---

### 4.9 Processos

**O que é.** Processo é um estoque que anda sozinho pelos turnos (casas, favelas, terra dividida), empurrado pelas leis em vigor.

**O jogador.** Não vê painel com meta, ritmo ou "quanto por turno" (isso é slider). Cada lei anda um pouco pelo caminho; o extremo da bússola é um caminho, não o destino.

**Peças**
- O processo tem estoque, ritmo e fases; as leis são as peças que um presidente assina.
- Exemplo (04/nov): "Reforma agrária 0 a X%" não é lei, é processo; as leis são o que é terra parada, como indeniza, verba de assentamento, prazo do título.
- Exemplo de molde (03/nov): "urbanizar favelas" com obra pública, incentivo, título, remoção, solo, mutirão; tabela de moradia com 3 processos × 6 lados.
- Exemplos de má lei por ser processo: Órgão anticorrupção, Reforma agrária.

**Regras**
- Um processo tem um órgão com verba (lei contínua % do PIB) e leis de regra; o efeito da regra é a regra vezes quanto da verba necessária existe.
- Modelo de builds (03/nov): o jogador combina leis de lados diferentes como quiser; só as que **colidem** não valem juntas (4.10).
- Processo é "andar" por esse caminho, "um pouco com cada lei, nunca de uma vez".
- O tema precisa de leis em todos os lados da bússola, não só três.

**Ligações**
- Economia: moradia e terra são estoques.
- Gosto: favela empurra saúde, segurança e saneamento (índice).
- Estado: o órgão responsável recebe a verba e age sozinho.

**Referências.** Reforma agrária e favelas foram os casos de teste do autor (03/nov e 04/nov).

**No motor hoje.** ✅ Índice que anda sozinho (deriva), R7.10. ✅ Índices déficit, preço e favela já derivam (R16.19).

**Em aberto.** Quais temas são processo (reforma agrária, moradia, terras) e quais leis empurram cada etapa.

---

### 4.10 Colisão e revogar

**O que é.** Colisão: leis que se anulam e não valem juntas. Revogar: propor a volta de uma lei a "não legislada".

**O jogador**
- Na bolha da lei aparece o botão "Revogar", que passa pelo Congresso como qualquer mudança.
- Combina leis de lados diferentes; só as que colidem não valem juntas (teto de aluguel × aluguel livre).

**Peças**
- Quando o dono pode ser Estado ou privado (usinas, rede, venda de energia), são duas leis de lados opostos que colidem (feito em Energia).
- Revogar leva a lei ao valor desligado (`valorDesligado`: mínimo da régua ou primeiro degrau); aprovado, a lei sai de `estado.leis` e os efeitos voltam a zero.

**Regras**
- Revogar também passa pelo Congresso.
- Lei essencial não se revoga.
- A colisão do jogo vale para a lei inteira: é um "ou" (decisão de 05/nov sobre vícios).
- Colisões dos vícios: Venda pelo Estado × Lojas licenciadas, e Monopólio × Licenças de apostas.

**Ligações.** Política: a revogação vai ao Congresso; a lei com prazo volta sozinha, sem voto.

**Referências.** **ESTUDAR**.

**No motor hoje.** ✅ Colisão (R7.9). ✅ Revogar com voto (R7.8, 14/nov): botão na folha da lei, lei essencial não se revoga; o pedido `mudar_lei` com `revogar: true`.

**Em aberto.** O desenho da tela que avisa quando uma revogação desfaz um programa (o aviso antes é decidido) fica para a Tela.

---

### 4.11 Lei pela instituição

**O que é.** O efeito de toda lei passa pelo rendimento da instituição onde ela mora: pouca verba, a lei rende menos; verba demais, a sobra vira corrupção.

**O jogador.** Nunca escolhe a fazenda, a fábrica ou a obra. Leis de regra dizem o quê; leis de verba dão força ao órgão responsável; o órgão age sozinho.

**Peças**
- Cada instituição tem verba (das leis de gasto dela), necessidade, rendimento = verba ÷ necessidade e corrupção interna; quem manda é o ministro.
- O ministro (que muda o rendimento) também importa.
- **Filtro da verba:** a corrupção desvia parte de toda verba, conforme o índice, e o desvio vai a um bolso e deixa rastro. O que chega ao prédio vira salário e insumos, e parte dos insumos pode ser importada. Vaga é por pop: sem gente formada, fica vazia e o salário sobe.
- **Verba tem lado, mas pequeno (07/nov):** nenhuma lei é neutra; a verba vai de zero a um empurrão pequeno num lado só (serviços puxam um pouco à esquerda; polícia e defesa, um pouco ao tradicional). O empurrão forte fica nas leis de "como".
- Obra nova é lei separada (seção 16, Prédios e obras).

**Regras**
- A regra funciona na medida da verba; verba muito acima do necessário vira corrupção (04/nov). O autor rejeitou a régua da lei andar aos poucos até o alvo.
- Decisão 5 do plano (aprovada): o efeito de toda lei vezes o rendimento da instituição, com teto em 100% (teto 1).
- Lei sem órgão (regras dos poderes) rende inteira.
- Dar ao partido o trabalho do órgão é ruim: "O PARTIDO não escolhe as OPERAÇÕES"; o órgão recebe a verba e age sozinho.
- Virar jogo de construção é ruim ("ligar dois estados com uma linha: o presidente não toma a decisão disso").

**Ligações**
- Estado: corrupção soma `12 × (rendimento − 1)` por turno quando sobra verba.
- Economia: efeito da lei em índice = valor × rendimento do órgão (`rendimentoDasLeis`, `motor/governo`).
- Política: a ficha do ministro muda a força e o atraso das leis da caixa.

**Referências.** **ESTUDAR** (outros jogos com órgão e verba).

**No motor hoje**
- ✅ R7.11 (14/nov): efeito da lei vezes o rendimento da instituição, teto 1 (`turno/etapas/jogabilidade.ts`). Pouca verba já enfraquece a lei.
- ✅ Corrupção por verba parada (R6.17).
- ☐ Serviços do Estado como prédios fora do mercado (R16.31) e terceirizar por lei (R16.32).
- ☐ Caminho do dinheiro (impostos, Tesouro, verba, máquina do ministério, filtro da corrupção, instituição).

**Em aberto**
- Custo de máquina: sem custo de máquina, o governo Inchado não tem desvantagem.
- Ordem do autor: terminar os ministros, depois o mapa, depois padronizar as leis e só então o caminho do dinheiro.

---

### 4.12 Roteiro da lei (8 passos)

**O que é.** Toda lei passa pelos mesmos 8 passos: entrada (dinheiro, regra, preço ou direito), filtro, prédio, pop, economia, índices, política e conta.

**O jogador.** Vê na bolha como a lei chega à vida das pessoas (a linha "como chega a você").

**Peças**
- A lei declara a entrada e onde age; os outros passos são regras gerais do jogo.
- No acervo, o roteiro tem as colunas: Entrada (o que a lei muda), Filtro (o que atrapalha), Prédio (quem muda de comportamento), Pop (quem sente), Economia (para onde vai o dinheiro), Índices (o que muda na tela), Política (quem reage), Conta (quem paga depois), Quando aparece e Revisão (518 linhas).

**Regras.** O roteiro de cada lei fica na aba "Leis - roteiro" do acervo. A coluna "Chega ao pop" do acervo tem seis valores: Direito 130, Serviço 86, Renda 85, Governo 81, Preço 76, Emprego 62.

**Ligações.** Gosto: o passo "pop" mede quem sente. Economia: o passo "economia" diz para onde vai o dinheiro. Política: o passo "política" diz quem reage.

**Referências.** Victoria 3: pops no centro, métodos de produção, preço por oferta e procura.

**No motor hoje.** ◐ O roteiro está como "A pensar"; toda lei chega ao pop (R7.12 ◐): hoje quase todas só mexem em índice.

**Em aberto.** Por que 443 das 529 leis do acervo estão como "Ideia" e o JSON foi exportado sem padrão.

---

### 4.13 Força e atraso

**O que é.** Cada lei tem uma Força (fraca, média, forte) e um Atraso em turnos; o turno tem 2 meses. Atraso zero é o turno seguinte (14/nov).

**O jogador.** O que dá resultado demora: cada efeito declara quanto tempo leva para chegar inteiro, e o jogador sente a conta chegar. A lei diz "efeito em N turnos", para ele planejar.

**Peças**
- Colunas Força e Atraso na aba Leis, como palpite de partida: o atraso vem do "Quando aparece" do roteiro; a força vem do passo 6.
- Tamanho do efeito inteiro: fraca 2, média 5, forte 10 pontos (calibrado no 6d). O efeito é o tamanho total, não por turno.
- Lei contínua: o efeito cresce com a posição do valor na faixa (no mínimo, nada; no máximo, inteiro). Lei de opções: os efeitos da opção, inteiros.
- Ao mudar a lei, a contribuição anda em linha reta do valor de hoje ao novo em `atraso_turnos` turnos; depois fica parada. `atraso_turnos` 0 = no turno seguinte.
- No começo da partida, as leis vigentes já estão inteiras.
- Efeito: índice de jogabilidade, `sentido` ±1, `forca` por nível, `atraso_turnos`.
- Planilha: aba "Leis - efeitos" (Lei, Degrau, Índice, Sentido, Força, Atraso) com 1359 linhas.

**Regras**
- Todo número da planilha é valor de partida, de um de três tipos: **estudo** (tem fonte), **ordem de grandeza** ou **chute de jogo**. A calibração fica para o motor. Valores convertidos de uma palavra (esquerda, direita) usam 0,4 e estão marcados na coluna "Bússola: origem".
- Força por nível, nunca número solto; todo efeito declara o atraso em turnos.
- Efeito só nos índices de jogabilidade; efeito em receita, PIB, juros, dívida não se escreve na lei.
- A lei contínua pode ter `calculo.estrato`, `encolhe`, `escala_gasto`, `para.pesos`, `arrecada`.
- Lei declara: efeitos, força, atraso, posição na bússola e qual cálculo usa; não traz fórmula própria.

**Ligações.** Estado: o ministro muda força e atraso (competência) das leis da caixa. Gosto: o efeito vai ao índice; o grupo cobra o índice.

**Referências.** Atraso desconhecido tira do jogador a noção de quando agir (design de atraso).

**No motor hoje.** ✅ Efeito, força, atraso e bússola declarados e calculados (R7.2). ☐ Mostrar "efeito em N turnos" na tela (ideia).

**Em aberto.** A calibração fina fica para o fim ("Não abrir revisão lei por lei").

---

### 4.14 Processo de revisão por instituição

**O que é.** Cada lei atual é conferida contra as regras desta parte, uma instituição de cada vez, começando por Impostos.

**O jogador.** Nada diretamente; é o trabalho do autor na planilha.

**Peças.** Cinco passos:
1. O que a instituição liga: índices, mercados, grupos, contas, e que outras instituições dividem tema.
2. As perguntas do presidente: que decisões reais ele toma nessa área, sem olhar as leis atuais.
3. Cruzar: para cada lei, qual pergunta responde, os testes, o regulador, as escassezes, o extremo da régua e o veredito (fica, muda o jeito, junta com, divide em, sai, vira outra coisa, troca o nome). Para cada pergunta sem lei: buraco. Depois, a seção do conjunto.
4. Revisão da saída do modelo simples.
5. Decisão do autor; só depois se mexe nos JSON.

Quatro **ondas** (aprovadas em 14/nov):
- Onda 1: Impostos, Previdência, Assistência social, Orçamento e dívida, Moeda e bancos (dinheiro no bolso, canais prontos).
- Onda 2: Saúde, Educação, Segurança pública, Justiça e prisões, Moradia, Água e saneamento (serviço).
- Onda 3: Trabalho, Energia, Agricultura e pesca, Indústria, Mineração e petróleo, Comércio exterior, Concorrência e consumidor, Infraestrutura e transporte, Ciência e pesquisa, Comunicação e tecnologia (preço e custo).
- Onda 4: o resto (Meio ambiente, Terra, Imigração, Cultura, Esporte, Turismo, Religião, Defesa, Defesa civil, Relações exteriores, Estatais, Funcionalismo, Estados e municípios, Controle e transparência, Eleições, Regras dos poderes).

Vereditos do plano: fica, junta, divide, vira índice/evento/Ato/Operação/Posição, espera mecânica, sai.

**Regras**
- A saída de cada instituição é uma tabela na planilha `gdd.xlsx`, não um documento novo.
- Revisão por onda, 4 revisões no total (decisão 2).
- Fonte da verdade: a planilha `gdd.xlsx`, com exportador para o JSON e validador (decisão 1). O autor mexe na planilha; o código lê o JSON.
- Cada onda, sem parar no meio: preencher a triagem e o molde, autor revisa a onda inteira, exporta e faz o que faltar no motor, commit.
- Antes da onda 1 (a base): aba Leis com o molde, exportador e validador, lei pela instituição, revogar, lei com prazo e Ato, e a linha "como chega a você".
- Equilíbrio de lados conferido antes de fechar cada instituição.
- Instituição inflada se reduz juntando leis.
- Pronto quando: nenhuma lei sem canal, nenhuma sem nada, nenhuma no centro da bússola sem motivo escrito; planilha para JSON pelo exportador; revogar, prazo, ato e lei pela instituição com teste; a bolha diz como a lei chega à vida das pessoas.
- Na planilha, os passos 1 a 3 vão a um modelo simples com as regras desta parte na mão.
- `npm run leis` gera os JSONs; `npm run leis:planilha` faz o caminho de volta.

**Ligações**
- Estado: instituição inflada se reduz; ministério é caixa de instituições inteiras.
- Planilha "Leis por instituição": colunas Instituição, Lei, O que faz, Dinheiro, Índices que mexe, Devia estar em (autor); 56 linhas com "Devia estar em" preenchida.
- Planilha "Instituições novas": colunas Instituição, De onde vem, Tem ministro?, Situação, Leis (lembrete), Anotações do autor; 37 linhas "decidida".

**Referências.** Autor: "Não abrir revisão lei por lei" (calibração). Estudos de jogadores.

**No motor hoje.** ✅ Base da onda 1 (planilha, exportador, validador, lei pela instituição, revogar). ◐ As 4 ondas (R7.22).

**Em aberto**
- Se a ordem das ondas muda (decisão 6, aprovada como recomendado).
- Leis a reestruturar: padronizar o formato; o dinheiro que ainda entra e sai "fora das leis" se resolve aí.
- Pendência: a lei Organização dos ministérios (escada de 4 degraus, ver 4.20) ainda não existe.

---

### 4.15 Lei boa e lei ruim

**O que é.** A lista de casos que o autor classificou, com as palavras dele; cada lei passa por esta página antes de ser mostrada.

**O jogador.** O autor julga a lei pelo que o jogador consegue fazer com ela.

**Peças.** Seis conferências antes de mostrar uma lei: já existe na planilha; tipo (Lei, Lei com prazo, Ato, Posição, Operação); em que setor, preço, custo ou índice mexe; ganho e custo; número ou degraus reais; um leigo entende a frase.

**Regras. O que faz uma lei boa (casos do autor).**

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

**O que faz uma lei ruim (defeito, caso real, o que fazer).**

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
| Fora da esfera | Petróleo discutido em Energia: "por que discutir aqui?" | Conferir setor e instituição |
| Virou jogo de construção | "o presidente não toma a decisão disso, não é um jogo de construção" | Fica automático; a lei só dá o dinheiro |
| Dá ao partido o trabalho do órgão | "O PARTIDO não escolhe as OPERAÇÕES" | O órgão age sozinho |
| Fala de empresa e não de gente | Concessão por tipo: "me falta um pouco de povo"; "não é um jogo sobre empresários e empresas, é sobre ser o presidente" | Dizer quem é atendido e quem paga; privatizar é Operação |
| É opção de cada caso | Como o Estado contrata obra: "mais opções para cada obra que uma lei" | Tirar, ou escolha no papel da obra |
| Não é do presidente | Passagem: "ônibus não é federal" | Ver a competência; federal age por programa (passe livre) |
| Direito de outra esfera | Proteção do operário em Infraestrutura | Levar à instituição dona do tema |
| Frase enigmática | Cidade que não fica isolada: "confuso" | Dizer o que muda, sem metáfora |
| Fundo demais para o governo | Quem manda no clube: "Não é um jogo de futebol" | Ver se um governo nacional controla isso |
| Repete a fila ou outra lei | Estátuas e nomes: "complexo, bate com o pedido lá em cima" | Vira pedido na fila; o que outra lei decide fica nela |
| Corte demais | Minério com 2 leis: "somente duas leis?" | Procurar o que o presidente ainda decide |
| Índice sem jogo | Cidades da mina: "não sei se faz sentido para o jogo" | Se Desemprego e o papel já mostram, não criar índice |
| Lado trocado | Verba de segurança "de direita" | O lado segue quem defende no mundo real; verba tem lado pequeno |

- Índice, conta ou evento: nem todo número é índice. **Conta** da companhia ou do pop, vista na ficha (gasto de energia, produtividade: "por companhia, não é um índice"); **evento** é o que acontece num momento ("apagões são eventos!"); **índice** é o que resume o país.
- Mais regras do formato da lei: a lei está na lista aprovada pelo autor (fora dela é proposta no chat); escrever o comportamento esperado em 2 a 4 frases; pesquisar a direção em estudo ou consenso, não em outro jogo; efeito sem base clara fica fraco ou fora. Lei inventada vale se for plausível.

**Ligações.** Gosto: "lei que fala de empresa e não de gente" quebra o princípio 13.

**Referências.** O próprio autor; pesquisa de jogadores.

**No motor hoje.** Regra de trabalho, não de motor. O validador cobra jeito e canal das leis já triadas.

**Em aberto.** Quando o autor elogiar ou rejeitar uma lei, acrescentar o caso à skill `sisgov-lei-boa` com as palavras dele.

---

### 4.16 Índices

**O que é.** Índice é o que resume o país numa escala de 0 a 100; é a base do país mais a soma das contribuições das leis em vigor.

**O jogador**
- Vê 6 índices principais: PIB real, Desemprego, Inflação, Saúde, Educação (Instrução) e Segurança pública (resume Homicídios, Crimes contra o patrimônio e Sensação de insegurança). Os outros são subíndices, embaixo do principal.
- Alerta do índice: cor do anel pelo nível, seta pela tendência (compara com 8 meses atrás, corte de 2 pontos).
- **Visível e invisível (07/nov):** o visível aparece na tela; o invisível o motor calcula, e o jogador só o sente pelo que acontece (greve, surto, notícia).
- Painel Atrapalham / Ajudam de ministro, instituição e índice.

**Peças**
- **Essenciais** (do motor, com as contas entre eles): população, ocupados, desemprego, PIB real e nominal, crescimento, preços, inflação, receita, gasto, resultado, dívida, juros.
- **Jogabilidade** (dados do mundo): padrão de vida, instrução, industrialização, saúde, segurança pública, pobreza, desigualdade, corrupção, liberdades, polarização, meio ambiente, reputação internacional, segurança externa, aprovação, índice da bolsa e confiança do mercado. É a lista curta do GDD; o motor tem 147 índices de jogabilidade.
- Planilha "Índices": 147 índices (43 "Existe", 104 "A criar"; 6 com Principal = Sim). Colunas: Esfera, Índice, Situação, O que mede, Bom é, De onde vem, Leis que mexem direto, Recebe de, Efeito hoje, Efeito proposto, Cobrado por, Mecânica, Liga com, Arquivo, Ligação, Na tela, Revisão, Principal.
- **Índice tem dono (13/nov, feito 14/nov):** uma instituição, um poder ou o país; fica preso, no mapa, ao ministro que leva a maior parte das leis ligadas a ele.
- **Índice é gatilho:** as narrativas futuras disparam quando um índice sobe ou passa de um limite; os gatilhos só se escrevem depois do motor e dos índices prontos.
- Estatística (ideia 13/nov): o presidente pode parar de medir, esconder os números da mídia ou mentir neles; o jogador vê o índice real, a mídia vê com atraso e desconfiança.

**Regras**
- **Índice novo só com decisão do autor.**
- **Todo índice tem efeito:** ele muda algo no país, além de ser cobrado pelos grupos.
- **Avaliar um índice (04/nov):** ligar tudo o que ele exige e criar o que falta; registrar em `indices-avaliacao.md`. O avaliado vai para "Avaliados"; o que foi ligado ou criado e ainda não passou por avaliação vai para "Não avaliados".
- Um índice está **avaliado** quando o autor decidiu o que o move, o que ele piora ou melhora, e quais grupos o cobram; o número fino fica para o balanço final.
- O índice sai da contagem; lei nenhuma mexe nele direto (requisito de rede, 05/nov).
- **Índice, conta ou evento:** não criar índice quando o papel e outro índice já mostram (caso Cidades da mina).
- Cada índice da instituição tem alavanca para os dois sentidos; índice sem lei para algum lado é buraco.
- Valor de partida: 50 se o país não disser.
- Aprovação = satisfação média dos pops pesada pelo tamanho (R9.9, 12/nov).

**Avaliados** (registro de `indices-avaliacao.md`):

| Índice | Movido por | Empurra | Cobrado por | Data |
|---|---|---|---|---|
| Favela | contagem de casas, preço contra a renda dos pops, leis de moradia | piora saúde, segurança e saneamento | sem trabalho formal | 04/nov |
| Saúde | rede de atendimento, saneamento, favela, vacinação, saúde ambiental | melhora padrão de vida e reduz pobreza | operários, educação e saúde, aposentados | 05/nov |
| Saneamento | contagem da rede (verba, concessão, teto da tarifa, tratamento), conta contra a renda, favela | melhora saúde e meio ambiente | sem trabalho formal, gente do campo | 04/nov |

- **Não avaliados** (ligados ou criados): Atendimento, Profissionais de saúde, Vacinação, Segurança, Meio ambiente, Padrão de vida, Desigualdade, Emprego informal.
- Mudados no passo A do nível 3 (14/nov): Comida na mesa (juntou a Fome); Casas vazias; e novos sem fio ainda: Envelhecimento, Expectativa de vida, Turismo, Prática de esporte, Tensão com estados e municípios.
- Ainda não existem: organizações criminosas (desenho pendente, GDD §18); Dependência de drogas, Dependência de jogos e Mercado ilegal (aprovados em 05/nov; desenho em `fase-1-redes.md`).
- Desde 14/nov a lista por dono sai de `npx vite-node scripts/grafo-nivel3.ts`.

**Ligações**
- Gosto: o índice é o que os grupos cobram.
- Economia: índices de preço, favela e déficit derivam da economia (R16.19).
- Estado: índice com dono preso à instituição, ao poder ou ao país.
- Política: aprovação lida pelo Congresso e pela eleição.

**Referências.** Suzerain: orçamento como número único ("aumentar não muda nada visível"). Victoria 3: padrão de vida de 1 a 99 pela riqueza.

**No motor hoje**
- ✅ Essenciais (R9.1), 147 de jogabilidade (R9.2), 6 principais marcados (R9.8), aprovação (R9.9).
- ◐ Inflação que se move (R9.3). ◐ Todo índice tem efeito (R9.4): 127 índices não levam a nada.
- ☐ Desemprego e ocupados se movem com a economia (R9.5, depende de R16.27). ☐ Índice da bolsa (R9.6).
- ◐ Causa e efeito, "o que empurra" no índice, "a conta que vem" na lei (R17.15).
- ✅ Dono (passo A, 14/nov).

**Em aberto**
- Efeito de cada índice (passo B): para cada um, o que ele muda no país além da cobrança dos grupos.
- Visível e invisível: quais o jogador vê e quais só sente.
- Principais: os subíndices embaixo de cada um e como somam.
- Gatilhos: limites que disparam narrativas, só depois do motor pronto.
- O que vários índices batendo metas juntos significam.
- Índice da bolsa (R9.6).

---

### 4.17 Serviços do Estado e Vícios

Esta seção guarda o que o autor decidiu em 05/nov em `fase-1-redes.md`. A **arquitetura** das redes ficou suspensa (05/nov) e os mecanismos "se decidem depois da planilha". O que ainda vale como desenho vem abaixo.

**O que é.** Rede é um serviço que o Estado presta (saúde, saneamento, educação, segurança); todas têm as mesmas peças: capacidade, desgaste, quem opera, privado, bolso, procura, índice, empurra, desvio.

**O jogador.** Vê o efeito na ficha e no mapa, com o dinheiro junto.

**Peças**
- Quatro redes: Saúde, Saneamento, Educação, Segurança. Moradia não é rede (é estoque de casas); proteção social é transferência de renda.
- Requisitos de uma rede: o índice sai da contagem; a mesma lei muda de sentido pelo estado do país, sem condição escrita; toda alavanca tem ganho e custo; o país começa parado (turno 0 nada anda sozinho); o motor não conhece nome de lei, índice nem instituição.
- **Vícios** (fechado em 05/nov): não é área própria nem rede; é consumo regulado em dois temas, drogas e jogos. 12 leis e 3 índices (Dependência de drogas, Dependência de jogos, Mercado ilegal).
- As 12 leis: Liberação das drogas, Imposto das drogas, Venda pelo Estado, Lojas licenciadas, Cuidado com o usuário, Liberação dos jogos, Imposto dos jogos, Monopólio do Estado, Licenças de apostas, Proteção do apostador, Propaganda e embalagem, Fiscalização e repressão.
- As escadas de liberação de Drogas e de Jogos têm 6 níveis (0 a 5), desenho de 05/nov.
- A conta do turno por tema, em 5 passos: procura, consumo legal, mercado ilegal, dependência, dinheiro. **Liberar sem ninguém vendendo não abre mercado.**
- Pesquisa de vícios (05/nov): proibir fortalece o crime; legalizar não acaba com o mercado ilegal na hora; contrabando vem do Estado fraco; dureza rende rápido e cobra depois.
- Na planilha de hoje, 11 linhas citam drogas ou jogos; Liberação das drogas ainda sem jeito.

**Regras**
- Fase em 3 momentos: desenhar a fase inteira, decidir tudo de uma vez, produzir até o fim sem parar.
- Vícios, colisões: Venda pelo Estado × Lojas licenciadas; Monopólio × Licenças de apostas.
- A Liberação cruza a bússola, exceção pedida pelo autor.

**Ligações**
- Saúde: dependência de drogas aumenta a procura da rede; a fila cresce e o `atendimento` cai.
- Segurança: repressão sobre mercado grande sobe `lotacao_presidios`.
- Atendimento no motor: planos primeiro, rede pública depois, profissionais e vagas.
- Custo das leis de saúde: fica em `custo`, fração do PIB que entra no gasto do governo, sem lei de verba.

**Referências.** `docs/jogo/estudos/vicios.md`: Portugal, Canadá, Uruguai, Suíça, Escócia, Noruega, Suécia, Singapura, Macau, Reino Unido, Brasil.

**No motor hoje.** ◐ Atendimento e saneamento têm código próprio (`motor/atendimento`, `motor/saneamento`). ☐ Serviços do Estado como prédios (R16.31) e terceirizar por lei (R16.32). O `motor/rede` está suspenso.

**Em aberto**
- Decisões 1 a 4 do desenho de redes (quais instituições, migrar antes, Educação com índice de vagas, Segurança com presídio na mesma rede) nunca foram aprovadas em fonte nova. **ESTUDAR** com o autor.
- Segurança e Educação não têm rede; as leis de Educação e Segurança só vêm quando essas redes forem desenhadas.
- Tribunal de drogas e Controle de lavagem esperam a Segurança.
- As escadas de Vícios (nível 0 "tudo proibido") precisam passar pela regra "nada = não legislada" na revisão da onda de Vícios.

---

## Quem executa a lei

Lei é a regra do país; instituição executa; ministro chefia. A lei mora numa instituição, nunca num ministério; cada instituição tem um dono só por vez.

### 4.18 Instituições

**O que é.** O órgão que executa a lei. É a menor peça do governo; substituiu a esfera em 13/nov.

**O jogador.** Não escolhe fazenda, fábrica ou obra: passa leis que dão verba e regras ao órgão, e o órgão age sozinho pelo turno. No mapa vê um escudo com frase curta ("12 na fila · 2 na sua mesa") e a cor do rendimento: verde rende, amarelo falta verba, vermelho sobra e vira corrupção. Clicar abre ficha só de leitura.

**Peças**
- As 36 instituições (conferidas com a lista de funções de governo da ONU): Agricultura e pesca, Água e saneamento, Assistência social, Ciência e pesquisa, Comércio exterior e capital, Comunicação e tecnologia, Concorrência e consumidor, Controle e transparência, Cultura, Defesa, Defesa civil, Educação, Eleições, Energia, Esporte, Estados e municípios, Estatais, Funcionalismo, Imigração, Impostos, Indústria (com construção civil), Infraestrutura e transporte, Justiça e prisões, Meio ambiente, Mineração e petróleo, Moeda e bancos, Moradia (com urbanismo), Orçamento e dívida (com estatística), Previdência, Relações exteriores, Religião, Saúde, Segurança pública, Terra, Trabalho, Turismo.
- Miolo (3 poderes): regras dos poderes (medida provisória, indicação de juízes, quórum, foro privilegiado, iniciativa popular), que não são de instituição.
- Quatro números por instituição: verba, necessidade, rendimento e corrupção interna.

**Regras**
- Instituição é órgão, não tema: a pergunta é "quem executa?". Tema com naturezas diferentes se divide pela função; a licença segue o produto (apostas na Fazenda, drogas na Saúde).
- Todo país tem todas as instituições, mesmo pequenas; a pequena é um caminho que o jogador pode crescer (Brasil religioso faz Religião crescer).
- Eleições não tem ministro (13/nov): fica sempre com o Judiciário, ligada só à corte eleitoral quando os tribunais existirem.
- Instituição não tem chefe próprio (13/nov): quem manda é o ministro.
- Verba vem da lei. Necessidade é a verba do começo mais 5% a cada lei ativa a mais (nunca abaixo de 20%). Rendimento = verba ÷ necessidade (1 sem verba em lei): pouca verba, a fila anda devagar; verba demais, a sobra vira corrupção.
- Corrupção (0 a 100): a cada turno desfaz 8% e soma 12 × (rendimento − 1) quando sobra verba, 1,2 × cargos de livre nomeação e 1,6 × (100 − honestidade) ÷ 100 do ministro. Começa no equilíbrio do governo de hoje. Ao cruzar 60 vira o fato "escândalo". Pesos de partida.
- Saíram: Vícios, Direitos e liberdades, Estado e eleições, Empresas e estatais (divididas), Saneamento e Cultura e esporte (juntadas ou separadas). As leis delas serão refeitas instituição por instituição.
- Corrupção em cadeia (12/nov): o rastro não some; baixar a independência dos investigadores faz a corrupção de cada órgão subir sozinha, o rendimento cair e o serviço piorar.
- Regra do dinheiro (14/nov): nenhum dinheiro some; a corrupção não apaga o dinheiro, ele vai para o bolso de alguém e deixa rastro.
- Lei de regra custa (14/nov): fiscalizar uma regra pede trabalho à instituição e sobe a necessidade dela. Esse custo vai a bolsos (salário de fiscal, equipamento) e a multa de quem foi pego vai ao Tesouro.
- Como a lei age pelo rendimento: ver 4.11.

**Ligações**
- Recebe: leis de gasto (verba) e leis ativas (necessidade) (Leis); ministro (competência e honestidade); lei de cargos de livre nomeação.
- Entrega: rendimento que age na lei; corrupção e fato "escândalo" (Congresso lê; CPI); verba de salário e compras que viram renda (Economia, ainda por fazer).
- Tesouro (Parte de Economia): impostos e receita entram no Tesouro (cofre ou dívida), que paga as leis de verba.

**Referências.** Lista de funções de governo da ONU (aba Conferência ONU, 10 áreas). Argentina maquiou a inflação de 2007 a 2015 (para Estatística). Instituições na planilha antiga (por esfera, com índices que mexem).

**No motor hoje**
- ✅ 36 instituições, verba, necessidade, rendimento, corrupção (R6.10, R6.16, R6.17).
- ◐ Ficha da instituição no mapa, só de leitura: escudo sob o ministro e painel Atrapalham/Ajudam; falta rendimento, corrupção e fila (R6.18).
- ✅ Lei age pelo órgão (R7.11): efeito × rendimento, teto 1 (14/nov).
- ☐ Instituições sem lei: Estados e municípios, Religião, Turismo, Indústria; Funcionalismo com uma.
- ☐ Caminho do dinheiro (R10.7).

**Em aberto**
- Caminho do dinheiro: a proposta a pensar é impostos, Tesouro, verba por lei, máquina do ministério, filtro da corrupção (o desvio vai a um bolso e deixa rastro), instituição, população. A mecânica pede definir quanto é desviado.
- Estatística: o presidente pode parar de medir, esconder os números da mídia ou mentir neles; o jogador vê o real, a mídia vê com atraso.
- Se cada instituição e cada lei responde a um dos poderes.

---

### 4.19 Ministros

**O que é.** A ficha de quem chefia as instituições que o jogador der a ele; a competência dele mexe no efeito das leis dessas instituições.

**O jogador.** Escolhe quem ocupa cada ministério e quando trocar. O melhor técnico pode ser de outro partido, o aliado exige ministérios para votar com o jogador e o ministro popular vira rival dentro do partido.

**Peças**
- Cinco notas: competência (leis da área chegam mais rápido e com mais força; fraco atrasa e desperdiça verba), habilidade política (aprovar as leis da área), carisma (como mídia e eleitor o veem), honestidade (baixa sobe corrupção e risco de escândalo) e lealdade (baixa e ele vaza, sabota ou sai atirando). Mais bússola e origem.
- Opinião: grupos e mídias gostam ou não pela distância na bússola e pela origem.
- Fatos: escândalo, crise na área, demissão barulhenta, ministro que vira candidato.
- Troca: a qualquer momento, com revolta e polêmica.

**Regras**
- Troca a qualquer momento, sem esperar turno nem lei; o demitido reage pela lealdade, o partido dele se irrita no Congresso e a mídia cobra; manter alguém sob escândalo custa mais com o tempo (13/nov).
- Competência: até 3 instituições o ministro rende inteiro; com mais, rende √(3 ÷ instituições).
- Efeito na lei: acima de 70 de competência a lei chega 1 turno antes, abaixo de 30 chega 1 turno depois; força = 0,6 + 0,008 × competência.
- O ministro não mexe na verba, que é lei; a ficha dele muda a instituição (competência alta, rende mais; honestidade baixa, mais corrupção).
- Troca pelo jogador: sempre vira o fato "ministro demitido", inclusive técnico; a 1ª troca dos últimos 24 turnos é notícia pequena, a 2ª média, da 3ª em diante grande; mágoa de 6 pontos mais 3 por troca anterior, sumindo em 3 turnos nos grupos parecidos com quem saiu; partido do demitido perde 8 de termômetro (13/nov).
- No começo, ministros sorteados pela chapa e trocados por três cartas (técnico, aliado, do seu partido) ou pela lista (13/nov).
- Ministro na caixa de uma instituição sem ministro (Eleições, Regras dos poderes) não existe: a lei anda como com competência 50 e o órgão como com honestidade 70.

**Ligações**
- Recebe: caixa que ele leva (4.20), Congresso (moeda Ministério), partido de origem.
- Entrega: força e atraso das leis (4.13), corrupção e rendimento da instituição (4.18), termômetro do partido no Congresso, mágoa nos grupos (Gosto/população), notícia (mídia).

**Referências.** O Brasil juntou a economia num superministério em 2019 e separou de novo em 2023. Outros: **ESTUDAR**.

**No motor hoje.** O básico está feito; faltam R6.9 e R6.15 (14/nov, a memória de 30/out está velha).
- ✅ Ficha (R6.7): agem competência e honestidade; habilidade, carisma e lealdade esperam Congresso, mídia e fatos do ministro.
- ✅ Ministros no começo (R6.26).
- ◐ A ficha muda força, atraso e rendimento (R6.8).
- ◐ Trocar a qualquer momento (R6.24): feito partido ressentido, notícia maior a cada troca e mágoa de 3 turnos; falta a reação do demitido pela lealdade e a mídia ter efeito.
- ✅ Trocar ministro pelo mapa (R17.24).
- ☐ Fatos do ministro: escândalo, crise, demissão barulhenta, vira candidato (R6.9).
- ◐ Toda caixa tem ministro (R6.15): ver 4.20.

**Em aberto**
- Opinião central: ministros têm lealdade que nada lê. Uma régua de opinião única para todo ator (grupo, partido, ministro, juiz, mídia) está por desenhar.
- Ministério sem pasta só dá cadeira ao Congresso; agradar grupos parecidos com o ministro ainda não existe.

---

### 4.20 Ministérios (caixas)

**O que é.** Uma caixa com nome onde cabem instituições inteiras, de zero até quantas o jogador quiser.

**O jogador.** Muitas caixas dão mais cargos e foco, com mais custo. Poucas (superministério) economizam, mas a competência do ministro se divide. Programa espalhado por várias caixas depende de vários ministros e anda no passo do mais fraco.

**Peças**
- Caixa com instituições: o ministro rende e a ficha dele muda leis e órgãos dela.
- Ministério sem pasta (ex.: Mulheres, Pesca): só cargo para aliado, é a moeda "Ministério" do Congresso.
- Gabinete do chefe de governo: recebe as instituições que nenhuma caixa levar; pesa 3 a mais.
- Moldes de caixas sugeridas (35 linhas: básico, comum, superministério, de causa).
- Régua de tamanho: Enxuto (9), Clássico (19), Do país, Inchado (do país mais 5 sem pasta).
- Lei Organização dos ministérios: escada de quem pode mexer nas caixas.

**Regras**
- Cada instituição fica numa caixa só; a que sobra vai para o gabinete (13/nov).
- Toda caixa tem um ministro, custa estrutura e agrada quem é parecido com ele.
- No começo o país vem com os ministérios reais dele e o jogador muda no menu.
- Depois, pela lei Organização dos ministérios, escada em 4 degraus (13/nov): 1) livre, por decreto; 2) medida provisória e o Congresso confirma; 3) só por lei; 4) algumas caixas fixas na Constituição. O país declara o degrau inicial.
- A divisão muda com quem governa (como na realidade).
- O motor confere ao iniciar: recusa instituição em duas caixas, instituição sem ministro numa caixa, falta de gabinete ou a mesma pessoa em dois cargos.
- A lei vai para a caixa que leva a instituição dela; senão, para a sobra (gabinete).

**Ligações**
- Recebe: instituições, ministro, escolha do jogador.
- Entrega: moeda Ministério ao Congresso; custo de estrutura (caminho do dinheiro, ainda não feito); agrado aos grupos parecidos.

**Referências.** Caixas de 11 países reais (Brasil, EUA, China, Alemanha, Japão, Índia, Reino Unido, França, Itália, Canadá, Rússia). Planilha de caixas genéricas.

**No motor hoje**
- ✅ Instituições, caixas e gabinete (R6.10).
- ✅ Régua de tamanho e "Ajustar caixas" (R6.25).
- ◐ O país começa com os ministérios dele; Brasil com 34 caixas, faltam os outros países e a lei Organização dos ministérios (R6.14).
- ◐ Toda caixa tem ministro e divide a competência; faltam o custo de estrutura e agradar quem é parecido (R6.15).

**Em aberto**
- Custo fixo por ministério e por cargo: sem ele o governo Inchado não tem desvantagem.
- Tipos de parlamento: reformular com as caixas livres (quem controla o quê na coabitação).
- Ministério é gente para dar atenção extra a uma instituição; grupo descontente fala com o ministro da instituição, ou vai direto ao presidente ou ao Congresso.

---

### 4.21 A fronteira do governo

**O que é.** A linha entre o que o jogador controla direto e o que só influencia.

**O jogador.** É o governo; as fichas não decidem por ele.

**Peças**
- Controla (12/nov): leis (propor, assinar, vetar, decretar se a lei deixar); pessoas (nomear e demitir ministros, indicar juiz na vaga); verbas, sempre por lei; estatais (Operações); exterior (posições por país e atos); polícia federal e Forças Armadas, dentro da lei de autonomia delas; emissora estatal e inteligência; a mesa inteira.
- Só influencia (12/nov): Congresso (moedas, termômetro, paciência), Justiça (indicação e pressão, com rastro), governadores (verba e termômetro), mídia privada, empresas, grupos e pops, banco central (se a lei de independência deixar).

**Regras.** Os dois pontos acima, ambos de 12/nov. Opções de menu de país e de companhia são Ato ou Operação, não lei; as leis só controlam essas decisões.

**Ligações.** Toda a Parte Política, Mundo, Mídia, Economia.

**Referências.** Nenhuma citada. **ESTUDAR**.

**No motor hoje.** Não é uma peça de código; é regra de desenho.

---

<!-- revisor:
Tirei por superado (08-conflitos.md): jeito Escolha (7 leis viram Níveis na revisão; o ESTUDAR de como converter caiu); formas "Dois controles" e "Meta e prazo" (R7.15, C9); os CONFLITOS 1 a 6 da IV (resolvidos: um lado por lei e régua sem limite convivem; nada = não legislada; Verba cobre canal verba e transferência; atraso 0 = turno seguinte); conflitos de estado R7.8, R7.11, R7.16 (✅ ✅ ◐); 512 para 511 leis; 74 para 73 programas (74 só no desenho da planilha); conflito de prioridade dos ministros (C2: básico feito, faltam R6.9 e R6.15); conflito de corrupção "some de verdade" (nenhum dinheiro some, princípio 5 reescrito); R7.11 corrigido: pouca verba já enfraquece a lei; conflito Eleições x Justiça (vale o Judiciário). A lei "Quem escolhe os juízes" e a Independência da Justiça não entram aqui (Parte Política). Tesouro e contas do Estado ficam em Economia (C1); presidente, vice, sucessão, pessoas e governadores, em Política.
Mandei para Em aberto: o número de leis que chegam ao pop (120 de 512 nos requisitos x 173 de 511 fora de "espera" na planilha); se a "lei com escolha" (marcar setores na bolha) é a mesma coisa do jeito Escolha que saiu; escadas de Vícios com nível 0 "tudo proibido" x regra do nada.
Notas: a skill sisgov-lei ainda fala em "esferas" e a skill/regra "Agentes simples" x "Construir junto" pode se contradizer (fora do tema, só sinalizado). Granularidade dos índices (16 nomes no GDD x 147 no motor) fica como nota nas Peças, não é conflito de regra. Nome do arquivo de regras em 4.14 passo 3: troquei a referência a `o-que-e-uma-lei.md` por "as regras desta parte".
-->
