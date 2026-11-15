# P1-L02: requisitos das seções 1.4 e 1.5

## 1.4-a-partida-comeco-mandato-e-fim.md

### Parte A: extração

**1. ENTIDADES**

| Nome | O que guarda | Linha |
| --- | --- | --- |
| País | dados em `conteudo/paises/<id>/`: estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos | L313 |
| Partido do jogador | nome, sigla (vira o id), lado (da média da bússola da chapa), 5 grupos que defende | L280, L307, L308 |
| Chapa | três vagas: presidente do partido, candidato a presidente, vice; pessoas de todos os partidos | L281 |
| Coligação | partidos que entram pela chapa; o antigo governo pode entrar | L281, L299 |
| Governo | tamanho (régua: Enxuto, Clássico, Do país, Inchado), caixas, ministros | L282, L301 |
| Ministro | cadeira sorteada pela chapa, trocável por uma de três cartas (técnico, aliado, do partido) ou por qualquer pessoa da lista | L301 |
| Mandato | duração dada pela lei do país (4 anos = 24 turnos) | L304 |
| Desgaste | sobe sempre; maior no mandato seguinte | L286, L304 |
| Aprovação | valor inicial declarado pelo país | L297, L298 |
| Placar | quanto tempo o partido governou e que país deixou | L305 |
| Fato do turno | aviso que um módulo deixa e quem se importa lê | L315 |
| Rede da pessoa | perfil de rede social, sem rótulo de lado; uma só, sem nome, resume todas as redes | L284, L303 |
| Verba de inteligência / Poderes da agência | definem quais informações pessoais aparecem | L303 |
| Registro de espionagem | guarda cada ato de espiar; pode vazar | L293, L303 |
| Histórico do país | golpes, crises, guerras, governos, empresas e mídias tradicionais declarados; o resto vem dos geradores | L294 |
| Partida salva | estado salvo; salva sozinho | L292, L309 |

**2. REGRAS**

| Quando acontece | O que muda | Quanto | Linha |
| --- | --- | --- | --- |
| Começo | o país começa como está; o partido que governava vira oposição | não diz | L297 |
| Começo | o jogador pode pôr o partido que governava na coligação | não diz | L299 |
| Começo | partido novo nasce com cadeiras | 6% das cadeiras | L300 |
| Começo | a Aprovação inicial é a que o país declara; sem "lua de mel" à parte | valor do país | L298 |
| Escolha do governo | tamanho vem da régua; ministros sorteados pela chapa; cada cadeira troca por 3 cartas ou pela lista | não diz (tamanho de cada degrau) | L301 |
| Criar o partido | a sigla vira o id e não repete | não diz | L308 |
| Montar a chapa | o lado do partido sai da média da bússola da chapa e define 5 grupos | 5 grupos | L307 |
| Fim do mandato | há eleição; vencer abre outro mandato com desgaste maior | não diz (quanto maior) | L304 |
| Perda do poder federal | a partida termina; sem vitória final | não diz | L305 |
| Vice de outro partido assume | a partida acaba (decisão do autor, 14/nov; consta fora das linhas desta seção) | nada | L338 |
| Espiar | informação pessoal aparece conforme Verba de inteligência e Poderes da agência; fere a privacidade; fica no registro que pode vazar | não diz | L303 |
| Todo turno | sem pontos de ação | nada | L310 |
| Todo turno | o desgaste sobe sempre | não diz | L286 |
| Cada turno do jogo | salva sozinho | não diz (frequência) | L309 |

**3. NÚMEROS**

| Valor | A que se refere | Linha |
| --- | --- | --- |
| 3 | vagas da chapa | L281 |
| 4 | graus da régua do governo | L282 |
| 6% | cadeiras do partido novo | L300 |
| 3 | cartas por cadeira de ministro | L301 |
| 4 anos = 24 turnos | mandato (exemplo, vem da lei do país) | L304 |
| 5 | grupos que o partido defende | L307 |

**4. LIGAÇÕES**

| Liga | Linha |
| --- | --- |
| Lê o país: estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos | L313 |
| Entrega partido e chapa ao Partido e à Política (base de grupos, posição na bússola) | L314 |
| Entrega governo e ministros a Leis (instituições, ministros, caixas) | L314 |
| Entrega fatos do turno a Congresso, mesa, mídia, programas e eleição | L314, L315 |
| Lê Verba de inteligência e Poderes da agência | L303 |

**5. BURACOS**

- Quantos ministérios tem cada degrau da régua (Enxuto, Clássico, Do país, Inchado); o GDD não dá.
- Quanto o desgaste sobe por turno e quanto a mais no segundo mandato.
- Como o sorteio de ministros pela chapa é feito (peso, semente).
- Se a sigla repetida é recusada na tela de criação ou trocada sozinha.
- Quais os arquivos obrigatórios para um país ser jogável (L335).
- Caso com 0: partido novo com 0 cadeiras arredondadas; chapa com pessoa de um só partido; sigla vazia.
- Outros caminhos de perder o poder fora da eleição (L338).
- Em que turno exato o auto-salvamento roda e se sobrescreve a anterior.
- Partida salva de formato antigo (L339): perde ou remenda.
- Quais fatos cada mecânica ainda não escreve (L336) e se fato gera fato (L337).
- O que o jogador de fato vê no registro vazado e quem o recebe.
- A história de entrada aparece como texto, tela ou só nos números (L334).

### Parte B: requisitos

### [JOGO-1.4-01] Escolher o país
- R antigo: R4.3
- GDD: L277–L280, L313
- Regra: No começo da partida, o jogador escolhe um país entre os declarados em `conteudo/paises/<id>/`, e o estado inicial, as leis vigentes, o Congresso, os ministérios, os programas de antes e os rótulos vêm dele.
- Entra: a lista de países declarados e a pasta do país escolhido.
- Sai: o estado inicial da partida com as leis vigentes e o Congresso do país.
- Aceite: escolher o Brasil de 2026 começa com as leis vigentes e as cadeiras declaradas por ele; nenhuma lei ou partido vem de fora da pasta.
- Extremos: com 0 países declarados não há partida; com um só país a escolha é essa; trocar de país depois de iniciar não existe, só recomeçar.
- Depende de: JOGO-1.4-25

### [JOGO-1.4-02] Criar o partido com nome e sigla
- R antigo: R4.5
- GDD: L280
- Regra: Na criação do partido, o jogador informa nome e sigla e não escolhe lado, posição nem bússola.
- Entra: nome e sigla digitados.
- Sai: a ficha do partido do jogador.
- Aceite: nome "Frente Nova" (exemplo) e sigla "FN" (exemplo) criam o partido; nenhum campo de lado é pedido.
- Extremos: nome ou sigla vazios não criam partido; [ABERTO: tamanho máximo de nome e sigla].
- Depende de: JOGO-1.4-03

### [JOGO-1.4-03] Sigla vira o id e não repete
- R antigo: R4.5
- GDD: L308
- Regra: A sigla do partido do jogador vira o id dele, e a criação recusa uma sigla igual à de outro partido do país.
- Entra: sigla digitada e as siglas dos partidos do país.
- Sai: id do partido ou recusa da sigla.
- Aceite: sigla "PT" (exemplo) já existente no Brasil de 2026 é recusada; "FN" (exemplo) livre vira o id "FN".
- Extremos: [ABERTO: se a comparação ignora maiúsculas]; [ABERTO: sigla igual de partido extinto].
- Depende de: JOGO-1.4-02

### [JOGO-1.4-04] Montar a chapa de três vagas
- R antigo: R4.6
- GDD: L281
- Regra: Na montagem da chapa, o jogador preenche as vagas de presidente do partido, candidato a presidente e vice com pessoas de qualquer partido do país.
- Entra: a lista de pessoas de todos os partidos.
- Sai: a chapa com as três pessoas.
- Aceite: presidente do partido de um partido pequeno, candidato de outro e vice de um terceiro formam uma chapa válida.
- Extremos: [ABERTO: a mesma pessoa em duas vagas é permitida]; vaga vazia impede iniciar.
- Depende de: JOGO-1.4-25

### [JOGO-1.4-05] A chapa gera a coligação
- R antigo: R4.6
- GDD: L281
- Regra: Cada partido de onde sai uma pessoa da chapa, que não seja o do jogador, entra na coligação do jogador.
- Entra: o partido de cada pessoa da chapa.
- Sai: a lista de partidos da coligação.
- Aceite: chapa com uma pessoa do partido A e outra do partido B (exemplo) deixa A e B na coligação.
- Extremos: chapa só com pessoas do partido do jogador gera coligação vazia; todos de partidos diferentes geram coligação com todos eles; se a chapa muda no começo, a coligação se refaz.
- Depende de: JOGO-1.4-04

### [JOGO-1.4-06] Lado do partido pela média da chapa
- R antigo: R4.8
- GDD: L307
- Regra: Quando a chapa fica pronta, a média da bússola das pessoas dela define o lado do partido e os 5 grupos que ele defende.
- Entra: a posição na bússola (economia e costumes) de cada pessoa da chapa.
- Sai: a posição do partido na bússola e os 5 grupos que ele defende.
- Aceite: três pessoas com economia -2, 0 e +2 (exemplo) dão média 0 no eixo da economia; os 5 grupos escolhidos a partir dessa posição passam a ser defendidos [ABERTO: como os 5 grupos são escolhidos a partir da média].
- Extremos: chapa com as três pessoas na mesma posição dá o partido nessa posição; [ABERTO: desempate quando a média cai entre dois grupos]; trocar uma pessoa da chapa refaz a média.
- Depende de: JOGO-1.4-04

### [JOGO-1.4-07] Partido novo nasce com 6% das cadeiras
- R antigo: R4.9
- GDD: L297, L300
- Regra: No começo da partida, o partido do jogador entra no Congresso com 6% das cadeiras.
- Entra: o total de cadeiras de cada casa do Congresso do país.
- Sai: as cadeiras do partido novo por casa.
- Aceite: uma casa de 513 cadeiras (exemplo) dá 31 cadeiras (exemplo de arredondamento) ao partido novo.
- Extremos: casa de 0 cadeiras dá 0; [ABERTO: arredondamento de 6% e de que partidos saem as cadeiras].
- Depende de: JOGO-1.4-01

### [JOGO-1.4-08] O antigo governo vira oposição ou coligação
- R antigo: R4.9
- GDD: L297, L299, L300
- Regra: No começo da partida, o partido que governava o país vai para a oposição, e o jogador pode, nesse momento, pôr esse partido na coligação.
- Entra: o partido que governava, declarado pelo país, e a escolha do jogador.
- Sai: a posição do antigo governo (oposição ou coligação).
- Aceite: sem a escolha do jogador, o partido que governava em 2026 fica na oposição; com a escolha, entra na coligação.
- Extremos: [ABERTO: o que acontece se o país não declara quem governava]; se o partido que governava já está na coligação pela chapa, a escolha não muda nada.
- Depende de: JOGO-1.4-05

### [JOGO-1.4-09] A Aprovação inicial é declarada pelo país
- R antigo: R4.9
- GDD: L297, L298
- Regra: No começo da partida, a Aprovação do presidente começa no valor que o país declara no estado de partida, sem regra de lua de mel à parte.
- Entra: o valor de Aprovação declarado pelo país.
- Sai: a Aprovação do turno 1.
- Aceite: país que declara Aprovação 70 (exemplo) começa o turno 1 com 70; no turno 2 a Aprovação vem só das regras normais do jogo.
- Extremos: país que não declara Aprovação [ABERTO: valor de partida padrão]; valor 0 ou máximo declarado vale como está.
- Depende de: JOGO-1.4-25

### [JOGO-1.4-10] Tamanho do governo numa régua
- R antigo: R6.25
- GDD: L282, L301
- Regra: Antes das caixas, o jogador escolhe o tamanho do governo em um de quatro degraus (Enxuto, Clássico, Do país, Inchado), e o degrau define quantas caixas o governo tem.
- Entra: o degrau escolhido e a estrutura de ministérios do país.
- Sai: o número de caixas do governo.
- Aceite: "Do país" no Brasil de 2026 dá as caixas do governo declarado pelo país; "Enxuto" dá menos caixas [ABERTO: quantas caixas por degrau].
- Extremos: degrau mínimo com menos caixas que instituições faz a caixa levar mais instituições inteiras; trocar o degrau depois de sortear ministros refaz as cadeiras.
- Depende de: JOGO-1.4-01

### [JOGO-1.4-11] Ministros sorteados pela chapa
- R antigo: R6.26
- GDD: L301
- Regra: Depois do tamanho, cada cadeira de ministro recebe uma pessoa sorteada com base na chapa.
- Entra: a chapa, a lista de pessoas e as caixas do governo.
- Sai: um ministro por cadeira.
- Aceite: um governo de 19 cadeiras (exemplo) sai com 19 ministros sorteados.
- Extremos: [ABERTO: regra do sorteio pela chapa (peso por partido e coligação)]; [ABERTO: lista com menos pessoas que cadeiras]; a mesma pessoa em duas cadeiras é impossível.
- Depende de: JOGO-1.4-05, JOGO-1.4-10

### [JOGO-1.4-12] Trocar o ministro por três cartas ou pela lista
- R antigo: R6.26
- GDD: L301
- Regra: Para cada cadeira, o jogador troca o ministro sorteado por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista.
- Entra: a cadeira e a lista de pessoas.
- Sai: o novo ministro na cadeira.
- Aceite: numa cadeira de ministério (exemplo) as três cartas são um técnico, um aliado e uma pessoa do partido do jogador; escolher o aliado o põe na cadeira.
- Extremos: [ABERTO: o que acontece se faltar uma das três cartas]; [ABERTO: pessoa já em outra cadeira]; trocar de novo antes de iniciar é livre.
- Depende de: JOGO-1.4-11

### [JOGO-1.4-13] Ministros fazem parte do começo
- R antigo: R6.26
- GDD: L302
- Regra: A partida só inicia depois que todas as cadeiras de ministro estão preenchidas, e o passo "Governo" da ordem de construção inclui esses ministros.
- Entra: as cadeiras do governo e os ministros escolhidos.
- Sai: o governo completo no estado do turno 1.
- Aceite: com 1 cadeira vazia (exemplo) iniciar é recusado; com todas preenchidas o turno 1 abre com os ministros.
- Extremos: [ABERTO: governo de 0 cadeiras existe]; cadeira vaga por troca de ministro depois do começo é caso da Parte 4.
- Depende de: JOGO-1.4-12

### [JOGO-1.4-14] Sequência de montagem do começo
- R antigo: R4.10
- GDD: L306
- Regra: A montagem do começo exige os passos nesta ordem: país, partido, chapa, governo, ministros, iniciar, e cada passo lê o resultado do anterior.
- Entra: os resultados de cada passo.
- Sai: a partida iniciada, com o estado do turno 1.
- Aceite: sem chapa o passo "governo" não abre; com tudo feito, "iniciar" cria a partida no turno 1.
- Extremos: voltar a um passo anterior refaz os seguintes; iniciar sem ministros é recusado.
- Depende de: JOGO-1.4-01, JOGO-1.4-02, JOGO-1.4-04, JOGO-1.4-10, JOGO-1.4-13

### [JOGO-1.4-15] Mandato pela lei do país
- R antigo: R4.1
- GDD: L304
- Regra: A duração do mandato do presidente é a que a lei do país declara, em turnos, e o fim dele marca a eleição.
- Entra: a lei do país sobre o mandato.
- Sai: o turno da eleição.
- Aceite: mandato de 4 anos no Brasil de 2026 = 24 turnos; a eleição cai no turno 24 (exemplo).
- Extremos: [ABERTO: limite mínimo de mandato]; [ABERTO: mandato alterado por lei no meio da partida vale para o corrente ou o seguinte].
- Depende de: JOGO-1.5-01

### [JOGO-1.4-16] Vencer a eleição abre outro mandato
- R antigo: R4.4
- GDD: L304
- Regra: Quando o partido vence a eleição no fim do mandato, começa um novo mandato com desgaste maior que o anterior.
- Entra: o resultado da eleição e o desgaste atual.
- Sai: o novo mandato e o desgaste mais alto.
- Aceite: desgaste 30 (exemplo) no fim do primeiro mandato sobe para 45 (exemplo) no começo do segundo.
- Extremos: [ABERTO: quanto o desgaste cresce por mandato e se há teto]; [ABERTO: limite de reeleições pela lei do país].
- Depende de: JOGO-1.4-15

### [JOGO-1.4-17] O desgaste sobe sempre
- R antigo: novo
- GDD: L286
- Regra: A cada turno de governo, o desgaste do partido sobe.
- Entra: o desgaste atual.
- Sai: o desgaste do turno seguinte.
- Aceite: desgaste 10 (exemplo) no turno 1 vira 12 (exemplo) no turno 2.
- Extremos: [ABERTO: quanto sobe por turno]; [ABERTO: o que acontece no máximo do desgaste].
- Depende de: JOGO-1.4-16

### [JOGO-1.4-18] A partida termina quando o partido perde o poder federal
- R antigo: R4.4
- GDD: L305, L338
- Regra: Quando o partido do jogador deixa de governar o país, a partida termina e não há vitória final; se o vice de outro partido assume a Presidência, o partido deixou de governar e a partida acaba.
- Entra: o fato "perdeu o poder" (da eleição, da posse do vice de outro partido ou de outro caminho).
- Sai: o fim da partida e o placar.
- Aceite: derrota no segundo turno da eleição do turno 24 (exemplo) encerra a partida; presidente que morre no turno 10 com vice de outro partido (exemplo) também encerra.
- Extremos: [ABERTO: os outros caminhos de perder o poder (mecânica 12)]; perder no último turno do mandato; partida encerrada não aceita novos pedidos.
- Depende de: JOGO-1.4-16

### [JOGO-1.4-19] Placar: o histórico inteiro do partido no poder
- R antigo: R4.7
- GDD: L305, L338
- Regra: No fim da partida, o placar entrega quanto tempo o partido governou e o histórico do país que ele deixou, sem nota única (decisão do autor, GDD L152).
- Entra: os turnos governados e o histórico da partida (índices, fatos, leis).
- Sai: o placar final, com o histórico inteiro, como dado para a tela.
- Aceite: 30 turnos governados (exemplo) com o histórico dos índices e fatos desses 30 turnos compõem o placar.
- Extremos: perda no turno 1 dá placar de 1 turno e histórico de 1 turno; [ABERTO: o que o histórico inclui e em que granularidade].
- Depende de: JOGO-1.4-18

### [JOGO-1.4-20] Sem pontos de ação por turno
- R antigo: novo
- GDD: L310
- Regra: Em cada turno, o jogador propõe quantas leis quiser, e nenhum contador de pontos de ação limita o que ele pode pedir.
- Entra: os pedidos do jogador no turno.
- Sai: nada (a ausência de limite).
- Aceite: 10 pedidos de lei no mesmo turno (exemplo) entram todos; o que segura é o Congresso cheio, que só atrasa.
- Extremos: com 0 pedidos o turno passa; [ABERTO: teto técnico de pedidos por turno].
- Depende de: JOGO-1.5-17

### [JOGO-1.4-21] Salvar sozinho
- R antigo: R17.3
- GDD: L292, L309
- Regra: A partida salva sozinha a cada turno, e o menu do brasão permite salvar, carregar e recomeçar.
- Entra: o estado da partida ao fim do turno.
- Sai: a partida salva.
- Aceite: ao passar do turno 5 para o 6 (exemplo) a partida salva guarda o turno 6.
- Extremos: [ABERTO: frequência exata do auto-salvamento e se sobrescreve a anterior]; [ABERTO: carregar uma partida de formato antigo perde ou remenda].
- Depende de: JOGO-1.5-03

### [JOGO-1.4-22] Fato do turno: aviso que um módulo deixa
- R antigo: R4.12
- GDD: L290, L315
- Regra: Quando um módulo faz algo que os outros devem saber, ele deixa um fato do turno, e os módulos que se importam o leem sem chamar o módulo de origem.
- Entra: o fato escrito por um módulo.
- Sai: o fato disponível a Congresso, mesa, mídia, programas, grupos e eleição.
- Aceite: o Congresso aprova uma lei e deixa o fato "lei aprovada"; o jornal e os programas o leem no mesmo turno.
- Extremos: [ABERTO: encadeamento (fato gera fato)]; 0 fatos no turno deixa a lista vazia; [ABERTO: quais mecânicas ainda não escrevem fato].
- Depende de: JOGO-1.5-10

### [JOGO-1.4-23] Entrega do partido e da chapa à Política
- R antigo: novo
- GDD: L314
- Regra: Ao iniciar, a partida entrega o partido e a chapa ao Partido e à Política, que os usam para a base de grupos e a posição na bússola.
- Entra: a ficha do partido e a chapa.
- Sai: a base de grupos e a posição na bússola do partido no estado da Política.
- Aceite: o partido "FN" (exemplo) chega à Política com os 5 grupos que defende e a posição da média da chapa.
- Extremos: partido sem chapa não inicia; chapa com pessoa trocada depois do começo é caso da Parte 5.
- Depende de: JOGO-1.4-06

### [JOGO-1.4-24] Entrega do governo e dos ministros a Leis
- R antigo: novo
- GDD: L314
- Regra: Ao iniciar, a partida entrega o governo e os ministros a Leis, que os usa como instituições, ministros e caixas.
- Entra: as caixas e os ministros escolhidos.
- Sai: instituições, ministros e caixas no estado de Leis.
- Aceite: um ministro numa caixa chega a Leis ligado às instituições dela.
- Extremos: [ABERTO: caixa sem ministro é impossível]; [ABERTO: instituição fora de qualquer caixa].
- Depende de: JOGO-1.4-13

### [JOGO-1.4-25] O país declara só o estado inicial
- R antigo: R4.3
- GDD: L313
- Regra: Cada país declara em `conteudo/paises/<id>/` o estado inicial, as leis vigentes, o Congresso, os ministérios, os programas de antes e os rótulos, e o motor não contém nome de lei, partido ou país.
- Entra: os arquivos do país.
- Sai: o estado inicial da partida.
- Aceite: dois países diferentes, com outros partidos e leis vigentes, começam sem mudar o motor.
- Extremos: [ABERTO: lista de arquivos obrigatórios para o país ser jogável]; país com 0 leis vigentes; arquivo faltando.
- Depende de: nada

### [JOGO-1.4-26] Histórico do país: declarado primeiro, gerado depois
- R antigo: novo
- GDD: L294
- Regra: No começo da partida, o histórico do país (golpes, crises, guerras, governos, empresas e mídias tradicionais) vem do que o país declara, e os geradores criam o que ele não declara, sem empresa real.
- Entra: o histórico declarado pelo país.
- Sai: o histórico completo do país.
- Aceite: um país que declara 2 golpes e nenhuma guerra (exemplo) começa com 2 golpes declarados e guerras criadas pelo gerador.
- Extremos: país sem histórico declarado tem tudo gerado; nenhum nome de empresa real sai do gerador.
- Depende de: JOGO-1.4-25

### [JOGO-1.4-27] Rede da pessoa sem rótulo de lado
- R antigo: novo
- GDD: L284, L285, L303
- Regra: Cada pessoa aparece com o perfil de rede social dela, sem rótulo de lado, e a rede é uma só, sem nome, e resume as redes do país.
- Entra: a ficha da pessoa e as redes do país.
- Sai: o perfil de rede da pessoa, como dado para a tela.
- Aceite: o perfil de um deputado mostra o que ele publica e não traz o texto "direita" ou "esquerda".
- Extremos: [ABERTO: o que mostrar de pessoa sem posts]; o lado do governo também nunca vira rótulo (L285).
- Depende de: nada

### [JOGO-1.4-28] Espiar: informação pessoal pela inteligência
- R antigo: novo
- GDD: L293, L303
- Regra: Quando o jogador usa o botão Espiar sobre uma pessoa, as informações pessoais que aparecem dependem da Verba de inteligência e dos Poderes da agência.
- Entra: a Verba de inteligência, os Poderes da agência e a ficha da pessoa.
- Sai: os campos pessoais revelados.
- Aceite: com Verba de inteligência baixa (exemplo) aparecem poucos campos; com alta, mais.
- Extremos: [ABERTO: quais informações aparecem em cada nível]; [ABERTO: com Verba de inteligência 0, Espiar existe]; no máximo todos os campos.
- Depende de: JOGO-1.4-27

### [JOGO-1.4-29] Espiar fere a privacidade e fica no registro que vaza
- R antigo: novo
- GDD: L293, L303
- Regra: Cada Espiar fere a privacidade da pessoa e grava uma linha no registro, que pode vazar.
- Entra: o ato de espiar.
- Sai: a linha no registro e o fato do turno se o registro vazar.
- Aceite: 3 usos de Espiar (exemplo) deixam 3 linhas no registro.
- Extremos: [ABERTO: chance e efeito do vazamento e o custo da privacidade ferida]; registro vazio não vaza.
- Depende de: JOGO-1.4-28, JOGO-1.4-22

## 1.5-o-turno.md

### Parte A: extração

**1. ENTIDADES**

| Nome | O que guarda | Linha |
| --- | --- | --- |
| Turno | 2 meses, 6 por ano | L347 |
| `avancarTurno(regras, estado, pedidos)` | recebe regras, estado e pedidos; devolve novo estado | L348 |
| Semente / acaso | mora no estado | L348, L364 |
| Pedidos | o que o jogador faz no turno (propor lei, trocar ministro, negociar, campanha, despachar a mesa) | L353–L354 |
| Mesa | papéis que o jogador assina, veta, recusa, encaminha ou deixa na pilha | L354 |
| Lei não legislada | lei do mundo fora da lista do país | L365 |
| Efeito | declara quanto tempo leva para chegar inteiro | L366 |
| Fatos do turno | somem em 1 a 3 turnos, pelo tamanho | L368 |
| Seta de tendência | compara com 8 meses atrás, corte de 2 pontos | L369 |
| Paciência do Congresso | perde-se ao propor e desistir de uma lei | L371 |
| Invariantes | checagem final do turno | L360, L375 |
| Etapas | Congresso, Leis novas, Efeitos, Economia real, Preços e juros, Contas, Moradia, Jogabilidade, Pops e grupos, Governo, Programas, Política, Eleição, Mídia, Invariantes | L360 |

**2. REGRAS**

| Quando acontece | O que muda | Quanto | Linha |
| --- | --- | --- | --- |
| Ao passar o turno | `avancarTurno` devolve novo estado; o anterior não muda | nada muda no anterior | L348, L364 |
| Mesma semente e mesmos pedidos | mesma partida | igual | L348 |
| Lei do mundo fora da lista do país | fica não legislada: não arrecada, não gasta, não mexe em índice | zero | L365 |
| Pedido legisla a lei | efeitos andam de zero até o valor novo | não diz (curva) | L365 |
| Todo efeito | declara o tempo até chegar inteiro; atraso zero = turno seguinte | 0 ou mais turnos | L366 |
| Cada turno | etapas na ordem do L360 | 15 etapas | L360 |
| Fatos do turno | somem em 1 a 3 turnos | 1 a 3 turnos, pelo tamanho | L368 |
| Votação | passa quem tem votos; o exorbitante cai; sem sorteio | não diz (limiar) | L355, L370 |
| Propor e desistir | o Congresso perde paciência (propor a mesma lei de novo fica mais difícil) e o presidente perde Aprovação | não diz | L371 |
| Lei proposta | mostra "efeito em N turnos" | N | L372 |
| Seta de tendência | compara com 8 meses atrás | corte de 2 pontos | L369 |
| Fim do turno | confere invariantes | não diz | L360, L375 |

**3. NÚMEROS**

| Valor | A que se refere | Linha |
| --- | --- | --- |
| 2 meses | duração do turno | L347 |
| 6 | turnos por ano | L347 |
| 5 | passos do jogador | L351 |
| 15 | etapas do motor (contando 6b, 8b, 8c, 9a, 9b como etapas próprias) | L360 |
| 1 a 3 turnos | vida de um fato do turno | L368 |
| 8 meses (= 4 turnos) | janela da seta de tendência | L369 |
| 2 pontos | corte da seta de tendência | L369 |
| 0 | atraso mínimo do efeito (= turno seguinte) | L366 |
| ~2.500 linhas | tamanho do módulo `turno` hoje (dívida técnica, não requisito) | L367 |

**4. LIGAÇÕES**

| Liga | Linha |
| --- | --- |
| O turno chama Congresso, efeitos, economia, contas, moradia, população, grupos, governo, programas, política, eleição e mídia, e fecha conferindo invariantes | L375 |
| Ordem por mapa de dependência em `docs/jogo/arquitetura.md` | L375 |
| Fatos do turno juntados de todos os módulos | L367 |
| Mídia lê fatos que já existem (lente), ver 1.2 | L389 |
| Desistir de lei lê e altera a paciência do Congresso e a Aprovação | L371 |

**5. BURACOS**

- Quais condições os invariantes conferem e o que acontece se um falhar.
- A curva de "efeito anda de zero até o valor novo" (linear, outra).
- O que acontece com efeitos em andamento quando a lei é revogada no meio, ou quando duas leis mexem no mesmo alvo.
- Desistir de lei: quanto de paciência e de Aprovação custa, e quando conta como desistir.
- "Pelo tamanho" dos fatos: qual tamanho dá 1, 2 ou 3 turnos.
- Ordem de quem lê o fato de quem no mesmo turno quando entrarem mídia, organizações e mundo (L388).
- Como a "Jogabilidade" (etapa 7) se relaciona com as demais: o GDD só dá o nome.
- Ordem entre mesa e votação dentro do turno (passo 3 do jogador x etapa 1 do motor).
- Caso de turno com 0 pedidos e com todos os pedidos.
- Efeito com atraso maior que o tempo restante do mandato.
- Como ficam os fatos de um turno em partida carregada.

### Parte B: requisitos

### [JOGO-1.5-01] O turno dura 2 meses
- R antigo: R4.1
- GDD: L347
- Regra: Cada turno corresponde a 2 meses de calendário do jogo, e um ano tem 6 turnos.
- Entra: o turno atual e a data de partida.
- Sai: a data do turno.
- Aceite: o turno 7 (exemplo) é o primeiro do segundo ano.
- Extremos: [ABERTO: se existe turno 0]; turno acima do fim do mandato abre o mandato seguinte.
- Depende de: nada

### [JOGO-1.5-02] Mesma semente e mesmos pedidos dão a mesma partida
- R antigo: novo
- GDD: L348
- Regra: `avancarTurno(regras, estado, pedidos)` devolve um novo estado, e, com a mesma semente e os mesmos pedidos, devolve sempre o mesmo estado.
- Entra: as regras, o estado e os pedidos do turno.
- Sai: o novo estado.
- Aceite: rodar 24 turnos (exemplo) duas vezes com a mesma semente e os mesmos pedidos dá estados finais idênticos.
- Extremos: com 0 pedidos continua determinístico; pedido repetido conta duas vezes.
- Depende de: JOGO-1.5-03, JOGO-1.5-04

### [JOGO-1.5-03] O estado anterior não muda
- R antigo: novo
- GDD: L364
- Regra: Ao passar o turno, o estado do turno anterior continua igual, e o motor devolve outro estado.
- Entra: o estado do turno N.
- Sai: o estado do turno N+1, sem alterar o do turno N.
- Aceite: depois de `avancarTurno`, o estado passado como entrada continua com o mesmo caixa e os mesmos índices que tinha antes (exemplo: caixa 100 antes e depois).
- Extremos: com 0 pedidos o novo estado tem os mesmos valores nos campos que não mudam; erro no meio do turno não deixa o estado de entrada alterado.
- Depende de: nada

### [JOGO-1.5-04] O acaso mora no estado
- R antigo: novo
- GDD: L348, L364
- Regra: A semente e a posição do sorteio ficam guardadas no estado, e cada sorteio do turno avança a posição dentro do novo estado.
- Entra: a semente e a posição no estado.
- Sai: a posição do sorteio no novo estado.
- Aceite: dois sorteios no turno 3 (exemplo) levam a posição de 10 a 12 (exemplo) no estado do turno 4.
- Extremos: com 0 sorteios a posição não muda; salvar e carregar mantém a sequência.
- Depende de: nada

### [JOGO-1.5-05] Ordem das etapas do turno
- R antigo: novo
- GDD: L360, L375
- Regra: O motor roda as etapas do turno nesta ordem: Congresso, Leis novas, Efeitos, Economia real, Preços e juros, Contas, Moradia, Jogabilidade, Pops e grupos, Governo, Programas, Política, Eleição, Mídia, Invariantes.
- Entra: o estado e os pedidos.
- Sai: o novo estado, com os fatos de cada etapa.
- Aceite: uma lei aprovada na etapa 1 já conta nas Leis novas (etapa 2) do mesmo turno; um fato emitido em Política (etapa 9) é lido pela Mídia (etapa 9b) no mesmo turno.
- Extremos: a eleição só roda nos turnos de eleição; [ABERTO: a ordem fica certa quando entrarem mídia, organizações e mundo]; etapa sem trabalho passa sem mudar nada.
- Depende de: JOGO-1.5-10

### [JOGO-1.5-06] Lei fora da lista do país fica não legislada
- R antigo: novo
- GDD: L365
- Regra: Uma lei do mundo que não está na lista de leis vigentes do país não arrecada, não gasta e não mexe em índice até ser legislada.
- Entra: a lista de leis vigentes do país e as leis do mundo.
- Sai: efeito zero das leis não legisladas.
- Aceite: lei do mundo ausente da lista do Brasil de 2026 (exemplo) contribui com 0 de receita, 0 de gasto e 0 de efeito em índice.
- Extremos: país com lista vazia roda sem efeito de lei; [ABERTO: revogar no meio do turno devolve a lei ao estado não legislado, e os efeitos em curso param ou decaem].
- Depende de: JOGO-1.4-25

### [JOGO-1.5-07] Um pedido legisla e o efeito anda de zero ao valor novo
- R antigo: novo
- GDD: L365
- Regra: Quando um pedido legisla uma lei, os efeitos dela andam de zero até o valor novo, no tempo que cada efeito declara.
- Entra: o pedido e o valor novo da lei.
- Sai: o efeito acumulado por turno.
- Aceite: lei com efeito de 3 pontos e atraso de 3 turnos (exemplo) leva o efeito de 0 a 3 pontos em 3 turnos.
- Extremos: [ABERTO: a curva entre zero e o valor novo]; valor novo igual a zero não move nada; [ABERTO: mudar o valor no meio do caminho parte do efeito atual ou de zero]; [ABERTO: duas leis no mesmo alvo somam ou têm prioridade].
- Depende de: JOGO-1.5-06, JOGO-1.5-08

### [JOGO-1.5-08] Todo efeito declara quanto tempo leva
- R antigo: R4.2
- GDD: L366
- Regra: Cada efeito de lei declara em quantos turnos chega inteiro, e o efeito só chega por inteiro depois desse prazo.
- Entra: o atraso declarado do efeito.
- Sai: a fração do efeito aplicada no turno.
- Aceite: efeito com atraso de 4 turnos (exemplo) só vale por inteiro no quarto turno depois do pedido.
- Extremos: atraso zero (ver JOGO-1.5-09); [ABERTO: atraso maior que o tempo restante do mandato segue depois da eleição]; [ABERTO: revogar a lei antes do fim, o que sobra do efeito].
- Depende de: nada

### [JOGO-1.5-09] Atraso zero vem no turno seguinte
- R antigo: R4.2
- GDD: L366
- Regra: Quando o atraso declarado de um efeito é zero, o efeito chega inteiro no turno seguinte ao do pedido.
- Entra: o atraso zero e o turno do pedido.
- Sai: o efeito inteiro no turno N+1.
- Aceite: pedido no turno 5 com atraso 0 (exemplo) mostra o efeito inteiro no turno 6, e nada no turno 5.
- Extremos: efeito pedido no último turno do mandato aparece no primeiro turno do seguinte; revogação no mesmo turno.
- Depende de: JOGO-1.5-08

### [JOGO-1.5-10] O módulo `turno` só chama os módulos e junta os fatos
- R antigo: novo
- GDD: L367, L375
- Regra: O módulo `turno` chama cada módulo na ordem e junta os fatos que eles deixam, e a regra de cada coisa fica no módulo dela.
- Entra: os módulos e os fatos de cada etapa.
- Sai: a lista de fatos do turno.
- Aceite: a regra do voto do Congresso mora no Congresso; o `turno` só a chama na etapa 1.
- Extremos: [ABERTO: o que o `turno` faz com etapa sem módulo]; as linhas com regra dentro do `turno` hoje são dívida técnica, não requisito de jogo.
- Depende de: JOGO-1.5-05

### [JOGO-1.5-11] Fatos do turno somem em 1 a 3 turnos
- R antigo: R4.12
- GDD: L368
- Regra: Cada fato do turno fica na memória de 1 a 3 turnos, conforme o tamanho dele, e depois some.
- Entra: o fato e o tamanho dele.
- Sai: o fato removido da memória no turno certo.
- Aceite: fato pequeno (exemplo) some em 1 turno; fato grande (exemplo) fica 3.
- Extremos: [ABERTO: qual tamanho dá 1, 2 ou 3 turnos]; [ABERTO: fato de tamanho 0]; [ABERTO: fato renovado no mesmo turno em que ia sumir].
- Depende de: JOGO-1.4-22

### [JOGO-1.5-12] Seta de tendência compara com 8 meses atrás
- R antigo: R17.18
- GDD: L369
- Regra: Para cada índice, o motor entrega o valor de 8 meses atrás (4 turnos), e a tendência é de alta ou de queda quando a diferença for de 2 pontos ou mais, e estável quando for menor.
- Entra: o valor atual do índice e o valor 4 turnos atrás.
- Sai: o dado de tendência (sobe, desce, estável) que a tela recebe.
- Aceite: índice 52 agora e 50 há 4 turnos (exemplo) dão alta (2 exato conta); 50 agora e 49 dão estável.
- Extremos: [ABERTO: nos primeiros 4 turnos não há valor de 8 meses atrás, o que entrega]; índice em 0 ou no máximo.
- Depende de: JOGO-1.5-01

### [JOGO-1.5-13] Sem sorteio para a lei passar
- R antigo: R12.11
- GDD: L355, L370
- Regra: A aprovação de uma lei vem da conta de votos do Congresso e do apoio dos grupos, sem nenhum sorteio, e passa quem tem votos.
- Entra: os votos do Congresso e o apoio dos grupos.
- Sai: lei aprovada ou rejeitada.
- Aceite: placar previsto de 60% de votos com quórum comum de 50% (exemplo) passa sempre, com qualquer semente.
- Extremos: [ABERTO: desempate em empate exato]; votos 0 rejeita; 100% passa.
- Depende de: JOGO-1.5-02

### [JOGO-1.5-14] O exorbitante cai na votação
- R antigo: R12.12
- GDD: L355
- Regra: Na votação do Congresso, a lei que o Congresso considera exorbitante cai, mesmo com o jogador propondo.
- Entra: o pedido de lei e a nota do Congresso sobre ela.
- Sai: lei rejeitada e o fato "lei rejeitada".
- Aceite: lei que perde a maioria no placar previsto (exemplo) cai com esse fato.
- Extremos: [ABERTO: definição de exorbitante (a Parte 5 trata da conta da lei)]; lei com apoio do Congresso e 0 votos de grupos.
- Depende de: JOGO-1.5-13

### [JOGO-1.5-15] Desistir de uma lei custa paciência e Aprovação
- R antigo: novo
- GDD: L371
- Regra: Quando o jogador propõe uma lei e depois desiste dela, o Congresso perde paciência (propor a mesma lei de novo fica mais difícil) e o presidente perde Aprovação.
- Entra: o pedido de lei, a desistência, a paciência do Congresso e a Aprovação.
- Sai: a paciência do Congresso e a Aprovação reduzidas, e o fato do turno que avisa.
- Aceite: propor uma lei (exemplo) e retirá-la no mesmo turno reduz a Aprovação [ABERTO: quanto] e a paciência [ABERTO: quanto]; propor a mesma lei de novo no turno seguinte pede mais votos [ABERTO: quanto mais].
- Extremos: [ABERTO: desistir antes da votação custa]; [ABERTO: desistir várias vezes na mesma lei acumula]; [ABERTO: quanto tempo dura o custo da paciência].
- Depende de: JOGO-1.5-13

### [JOGO-1.5-16] A lei mostra "efeito em N turnos"
- R antigo: novo
- GDD: L366, L372
- Regra: Para cada lei, o motor entrega o prazo, em turnos, do efeito mais longo dela, para que a tela mostre "efeito em N turnos".
- Entra: os atrasos declarados dos efeitos da lei.
- Sai: o número N que a tela recebe.
- Aceite: lei com efeitos de atraso 2 e 6 (exemplo) entrega N = 6; lei só com atraso 0 entrega N = 1.
- Extremos: [ABERTO: se N é o maior atraso ou o do efeito principal]; [ABERTO: lei sem efeito].
- Depende de: JOGO-1.5-08

### [JOGO-1.5-17] O jogador age com pedidos antes de passar o turno
- R antigo: novo
- GDD: L351–L356
- Regra: Antes de passar o turno, o jogador entrega ao motor pedidos de propor leis, trocar ministro, negociar com aliados e, em tempo de campanha, fazer campanha.
- Entra: os pedidos do jogador.
- Sai: os pedidos ao `avancarTurno`.
- Aceite: um turno com 1 lei proposta e 1 ministro trocado (exemplo) entra com 2 pedidos.
- Extremos: com 0 pedidos o turno passa; [ABERTO: campanha fora de tempo de campanha é recusada].
- Depende de: JOGO-1.5-02

### [JOGO-1.5-18] O jogador vê quem ganha e quem perde antes de propor
- R antigo: novo
- GDD: L353
- Regra: Antes de propor uma lei, o motor entrega os grupos que ganham e os grupos que perdem com ela, para a tela mostrar.
- Entra: a lei e o estado atual.
- Sai: lista de ganhadores e perdedores da lei.
- Aceite: uma lei que aumenta imposto de uma faixa (exemplo) entrega os grupos dessa faixa como perdedores.
- Extremos: [ABERTO: lei que não mexe em ninguém dá lista vazia ou aviso]; a saída descreve e não classifica como boa ou ruim (princípio 4).
- Depende de: nada

### [JOGO-1.5-19] Despachar a mesa antes da votação
- R antigo: R17.2
- GDD: L354
- Regra: Em cada papel da mesa, o jogador escolhe assinar, vetar, recusar, encaminhar ou deixar na pilha, e a escolha entra nos pedidos do turno.
- Entra: os papéis da mesa e a escolha do jogador.
- Sai: o pedido de despacho de cada papel.
- Aceite: papel de lei aprovada assinado (exemplo) vira lei promulgada; vetado volta ao Congresso.
- Extremos: [ABERTO: consequência e prazo de papel deixado na pilha]; 0 papéis; pilha cheia.
- Depende de: JOGO-1.5-17

### [JOGO-1.5-20] A mídia reage e os fatos acontecem ao passar o turno
- R antigo: novo
- GDD: L356, L389
- Regra: Ao passar o turno, os efeitos chegam, a mídia reage aos fatos do turno e novos fatos (escândalo, choque de preço, atentado) podem acontecer.
- Entra: os efeitos com prazo, os fatos do turno e as regras de fatos.
- Sai: os novos fatos do turno e a reação da mídia como manchete.
- Aceite: um fato de escândalo (exemplo) no turno 7 aparece como manchete no jornal desse mesmo turno.
- Extremos: [ABERTO: como a mídia age em cima dos fatos (lente) e se a notícia mexe em grupo, voto ou aprovação]; 0 fatos novos deixa o jornal só com os existentes.
- Depende de: JOGO-1.5-05, JOGO-1.4-22

### [JOGO-1.5-21] Invariantes fecham o turno
- R antigo: novo
- GDD: L360, L375
- Regra: Na última etapa, o motor confere as invariantes do estado novo e avisa se alguma falha.
- Entra: o estado novo.
- Sai: o aviso de invariante violada.
- Aceite: caixa, dívida e emissão que não fecham com os fluxos do turno (exemplo) deixam o aviso.
- Extremos: [ABERTO: lista de invariantes conferidas e o que acontece quando falham]; o princípio 5 (nenhum dinheiro some) é invariante da Economia, não desta seção.
- Depende de: JOGO-1.5-05

## PERGUNTAS AO AUTOR

1. Fatos do turno "pelo tamanho" (L368): (a) tamanho pequeno 1 turno, médio 2, grande 3, com o tamanho declarado por quem emite o fato; (b) o tamanho é calculado pelo motor a partir do impacto nos índices.
