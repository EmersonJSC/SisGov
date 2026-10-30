# Onde parei

Bilhete da última sessão, para a próxima conversa começar sabendo.
Status de mecânica é no [PLANO](PLANO.md); aqui fica só o estado do momento.

**Atualizado em 29/out/2026 (M8.3, fatia A: chapa e ministros).**

## M8 em curso: fatia A feita, faltam B, D e a promessa

**Fatia A (29/out):** a partida tem vice e um ministro por área do governo (as 11 áreas de `politica.json`, `game/eleicao/chapa.ts`). A primeira tela escolhe presidente, vice e ministros (aba por área, `Gabinete.tsx`), com o botão "Sortear ministros": 2/3 saem o mais perto do ponto médio da chapa, 1/3 de fora (cota de coalizão). O que ficar vago o jogo sorteia na posse. Na eleição (turno da escolha) o partido vê novos vices e ministros e decide manter ou trocar; a troca vale se vencer (`chapaNova` em `EstadoDaEleicao`). O limite de mandatos segue o `limiteDeMandatos` do país (a lei estender ou encurtar ainda não existe). Testes: `eleicao.test.ts` 16, `tsc -b` limpo. **Visto na tela** a primeira tela (escolher, sortear, tomar posse, sem erro de console); **a troca de chapa dentro do tablet da eleição não foi vista na tela**, só por teste.

**Conserto da tela (29/out, `d423764c`):** a primeira tela rola e vem em dois passos (chapa; depois ministros). Visto na tela.

**Fatia B (29/out), popularidade do ministro:** `game/gabinete.ts`. A nota de cada ministro é a satisfação média dos 3 grupos mais perto do ponto dele na bússola (o ponto do grupo é a média dos perfis de eleitor), pesada pelo tamanho. Não é guardada: sai do estado, e como a satisfação já vem do aquecimento, nasce calibrada pelo país (decisão do autor: nada de 50 para todos). A média das notas, fora de 50, ×0,1 com teto ±4, soma em todos os grupos em `prepareGameMonth` (popularidade do motor) e em `valoresComReacao` (eleição e Congresso). Tela: seção "Gabinete" no tablet da Eleição (cargo, nome, nota, grupos leais). Testes: `gabinete.test.ts` 3, `gatilhos.test` ajustado (sem gatilho **e sem gabinete** os valores são os do motor), `eleicao`, `camadas`; `tsc -b` limpo. **Visto na tela** (notas de 34% a 54%, sem erro de console). **Pesos (0,1 e ±4) são chute.**

**Fatia D, passo 1 (30/out), lealdade exclusiva:** `gruposLeais` agora reparte os grupos: cada grupo é leal a um só ministro, fechando primeiro os pares (grupo, ministro) mais perto na bússola, com cota de ⌈grupos ÷ ministros⌉ por ministro (2 com 21 grupos e 11 ministros). Motivo: só com "o mais perto", um ministro levou 19 dos 21 grupos, porque os ministros nascem juntos na bússola. Ministro sem grupo leal teria nota neutra (50), mas a cota garante ao menos 1 cada. Visto na tela (1 a 2 grupos por ministro, notas de 35% a 60%). Limite: os ministros nascem sem ligação com a área, então "Saúde" pode ficar com Ricos e Classe média; a ideologia dele vem do sorteio da chapa. Se incomodar, o ponto do ministro deveria puxar para o lado típico da área.

**Decisões do autor (29/out):** a cada eleição o jogo pergunta se mantém ou troca; passados 2 mandatos seguidos a troca é obrigatória, se a lei assim mandar. Ministro é o da bolha (um por área), no centro dela. O Senado só olha a lei, não a popularidade do ministro. Grupos são leais ao ministro pelo lado ideológico dele (conta, não sorteio).

**Fatia D, passo 2 (30/out), ministro porta-voz:** `game/pedidos.ts` (puro) e `app/partida/pedidos.ts`. Por turno, cada ministro pode trazer um pedido (chance 2% + 2% × articulação, dobra se a nota dele está abaixo de 45); no máximo um por turno, e o que ninguém respondeu caduca no turno seguinte. O pedido é a opção de uma lei da área dele (`ESTRUTURAS[país].ministerios`) mais alinhada com o ponto médio dos grupos leais (produto escalar com o vetor da bússola), nunca a que já vale nem lei na fila. Aceitar chama `mudarLei` (vai ao Congresso se a lei pede) e dá +3 de satisfação aos grupos leais; recusar dá −3. O favor fica em `election.favores`, decai pela metade por turno e entra por `pontosDoGabinete` (popularidade do governo e eleição). O Senado só vê a lei. Tela: seção "Pedido do ministro" na Eleição do tablet, com Aceitar e Recusar. Testes: `pedidos.test.ts` 2; `gabinete`, `eleicao`, `gatilhos`, `camadas` seguem verdes. Visto na tela (pedido no 1º turno, Recusar respondeu). **O "e depende…" do autor ficou cortado:** pus como dependências a articulação do ministro e a insatisfação dos grupos dele; ajustar se era outra coisa. Limites: a nota do ministro (`notasDoGabinete`) não lê o favor; os pesos (3, 2%, 45) são chute.

**Promessa contra ação (30/out):** `game/promessa.ts`. O lado que o presidente quer é o do ponto dele na bússola em relação ao `compass.inicio`; se o ponto atual do governo andou ao contrário nesse eixo, a soma do caminho contrário, acima de 1 ponto de tolerância, tira 0,5 de satisfação por ponto de todos os grupos (teto 4). Não cumprir o que prometeu (ficar parado) não pesa; só o caminho contrário. Entra junto com o gabinete por `pontosDoGoverno` (motor em `prepareGameMonth` e `valoresComReacao`). Tela: frase na Bússola, em "Como o seu governo está sendo visto", só quando pesa (sem mostrar o lado do presidente). Testes: `promessa.test.ts` 2; `gabinete`, `gatilhos`, `camadas` verdes. Visto: Bússola abre sem erro e sem a frase no começo; **a frase em si não vi na tela** (só no teste). Limites: usa o ponto do presidente, não as frases dele; os números (1, 0,5, 4) são chute.

**Carisma vivo (30/out):** `game/carisma.ts` + `app/partida/carisma.ts`; `EstadoDaEleicao.carismaViva` (desvio ±1,5), 20% por turno rumo ao alvo (satisfação média ±30 e promessa quebrada); vale no voto do presidente que concorre (`candidatosDaEleicao`) e na ficha. Reinicia com presidente novo. Chutes: 1,5 / 20% / 30 / 0,5. Falta o lado dos ataques da mídia (M13). Teste `carisma.test.ts`.

**Turno de 2 meses (30/out):** `MESES_POR_TURNO=2`, mandato de 24 turnos, `turnosDoConteudo`/`chanceNoTurno` em `calendario.ts` convertem o conteúdo escrito em trimestres (implantação, intervalos, janelas, chances, investigação, pedidos). Congresso `turnosPorAno` 6, pesquisas e escolha da eleição reescaladas. Falta conferir na tela e rodar a suíte; próximo: M9.

**M9 fatia A (30/out):** cada projeto da fila mostra a chance de sim de cada bancada e o motivo que mais pesa; seu partido em dourado. Não vi a fila na tela (só o plenário); teste em `tramitacao.test.ts`. **Fatia B (30/out):** cada votação feita guarda o motivo de cada bancada (`porBancada.motivo`) e o tablet mostra em "Por que cada bancada votou assim"; não vi na tela. `tramitacao.test.ts` 23/23 (a falha antiga foi carga). **Quem mudou de lado:** a votação guarda a `chance` da bancada; o tablet marca "mudou de lado" quando o voto da maioria contraria o lado esperado (chance ≥ 50%). Não vi na tela. **Pétrea (fatia D):** `enviarAoCongresso` numa pétrea não muda a lei nem entra na fila; as bancadas perdem `humor.petrea` (-10) e cada grupo perde `petreaNaPopulacao` (4 pontos, via `favores`, que decaem à metade por turno); a tela avisa. Constantes chutadas. Não vi na tela: o tablet das leis pode travar a pétrea (cadeado) antes de chegar aqui. Falta: conferir isso na tela e o plenário fiel. Teste `ocorrencias` "mesma semente" estourou 120 s com a máquina carregada (lentidão, rodar sozinho).

**Ordem do autor (30/out):** ministros são tempero (não mexem na jogabilidade) e ficam para o final; não abrir item deles até ele chamar. O jogo ainda não é desafiador nem aceitável como jogo depois de escolher a chapa: essa é a prioridade.

**Falta, na ordem:** M13 Mídia (ataques entram no carisma). O ministro hoje só tem ficha e opinião; a gestão dele ainda não mexe na eficácia das leis. 3 testes (`contasSemFuros` ×2, `ocorrenciasVariedade`) estouram tempo por lentidão, não por asserção; a decidir antes da calibragem.

**Atualizado antes em 29/out (M7.3, grupos reagem aos gatilhos, feita).**

## Grupos fechado (30/out), pushado

Tudo na `main` e pushado (`f74f0849`; depois dele, itens 2, 4 e 5 até `b1a8596a`). Passos feitos hoje: (1) o bolso entra na satisfação do perfil (±10, só eleição e Congresso); (2) `pacoteVivo` usa o eleitorado inteiro vivo (emprego, renda, valores, religião), em cache por turno; (3) radicais e lealistas na tela (topo do painel Eleitorado e em cada grupo); (4) desempregado com ponto de economia. Limites (13) a (17) no PLANO, item 3. Visto na tela: "aprovação 45% · 11% contra · 6% a favor" e a mesma linha em cada grupo, sem erro de console.

**Check (30/out):** `npm run check` rodou: 649/650, a única falha era `camadas.test` (UI importava `game/congresso/polarizacao`; corrigido pelo re-export em `app/partida/tipos.ts`, teste agora verde).

**País em frases fechado (30/out):** a Informalidade mostra "38,6%" e "Em % de ocupados informais" (`jaEPorcento` em `formatos.ts`; teste em `medida.test.ts`; visto no boletim).

**Item 4 fechado (30/out):** `taxa_mortalidade` virou calculado, com seta de `saude_populacao` (coef −0,3, termo 29,62, atraso 1; neutra no início). Pandemia agora mata (+3‰). Mexer no coeficiente pede refazer o termo (o motor não escala o termo pela população). Falta o `npm run check`.

**Item 5 fechado (30/out):** `taxa_natalidade` virou calculado, com seta da fecundidade (`natalidade`, coef 0,2446, termo 6,115, atraso 1; neutra: 12‰). Política de natalidade intensa agora sobe a taxa e a população. `populacaoEmPessoas.test` ajustado (natalidade e mortalidade são calculadas; o teste as derruba a cada turno).

**Check dos itens 2, 4 e 5 (30/out):** passou, 652/652, e foi pushado (`b1a8596a`). O 1º check achou 4 falhas: o país mínimo declarava `taxa_natalidade`/`taxa_mortalidade` (D-41, calculada não leva valor no país) e as duas variáveis estavam sem `medida`. Corrigido (`conserto: taxas … com medida`). Coeficientes de natalidade e mortalidade são chutes, a calibrar.

**Piso do salário mínimo fechado (30/out):** carteira e servidor ganham no mínimo o salário mínimo da lei (`bolso.piso` + `seguePiso` em `mundo/populacao.json`, lido em `game/congresso/bolso.ts`). Neutro no início; só sobe. Visto por script (`scripts/teste/piso-minimo.ts`: com o mínimo em 100%, carteira pobre vai de R$ 1.862 a R$ 2.468/mês); **não visto jogando na tela** (a lei do mínimo exige criar partida e votar). Testes: `bolso.test` 33 e `bolsoNaSatisfacao.test` 4; `tsc -b` limpo. Falta `npm run check` e push.

**Check do piso (29/out):** passou, rodado pelo autor em outra sessão. Falta o push (só com a palavra do autor).

**Reorganização (29/out):** o jogo agora é mapeado por mecânicas e submecânicas em `docs/jogo/mecanicas/mapa-das-mecanicas.md` (proposta; o PLANO ainda não foi remanejado). Ordem: M7 primeiro; M2 por último (motor antes, conteúdo lei por lei no fim, com a calibragem).

**M7.1 feita (29/out):** a `popularidade_governo` agora lê o eleitorado vivo (emprego, renda, valores, religião e bolso), o mesmo da eleição. O motor aceita uma `approval` opcional em `advanceExecution` (`ProfileApproval.perfis[].ajuste` = bolso); o jogo a monta por mês em `prepareGameMonth` com `aprovacaoViva` (`game/congresso/index.ts`). Turno 0 não muda (45%). Testes: `aprovacaoViva.test.ts` 4, mais `paisV1`, `tramitacao`, `jornal`, `mesaDoSalarioMinimo`, `populacao`, `gruposSociais`, `camadas`; `tsc -b` limpo. Visto na tela: turno 0 em 45%, um turno encerrado sem erro de console (a queda a 41% veio junto com uma ocorrência de escândalo, então não prova a M7.1 sozinha). **Falta `npm run check`** (só ao fechar a M7 inteira). O limite (13) do PLANO ("a aprovação do motor não lê o bolso") deixou de valer. Sem remanejar o PLANO ainda.

**M7.2 feita (29/out), gatilhos:** `mundo/gatilhos.json` define 11 gatilhos (corte e expansão de gastos, agenda de mercado, estatista, conservadora, liberal nos costumes, social, linha dura, verde, pró-trabalhador, reforma constitucional). `game/gatilhos/index.ts` os liga a partir do `history` de cada lei (mudança de meta nos últimos 4 turnos, mínimo 3) e do caminho da bússola (rumo ≥ 0,3 em 4 turnos); nada é guardado no estado. A Bússola mostra "Como o seu governo está sendo visto". Testes: `gatilhos.test.ts` 14, `tsc -b` limpo. **Visto na tela só o estado vazio** (turno 0, sem erro de console); a ativação está provada por teste, não jogando. Limiares (3 em 4, 0,3) são chutes, a calibrar. **M7 fechada (29/out), `npm run check`:** formato, lint e build passaram; nos testes, 20 de 122 arquivos rodaram até eu parar (~31 min) e 5 testes estouraram tempo por carga (`contasSemFuros`, `ocorrencias`, `ocorrenciasVariedade`, `pisosVinculados`); `pisosVinculados` passa sozinho e leva o mesmo tempo sem a M7. O restante da suíte não foi rodado; autor aceitou assim. **Eleição e Congresso leem a reação (29/out):** `valoresComReacao` (`app/partida/bussola.ts`) soma a reação dos gatilhos à satisfação `grupo_x` (0 a 100) e é o que `passarTurnoNaEleicao`, `renovarCongresso`, `passarTurnoNoCongresso` e `retratoDoCongresso` recebem como `valores`; devolve o mesmo objeto enquanto a reação não muda (o eleitorado vivo é guardado por valores). Testes em `gatilhos.test.ts` (27). **Gatilhos fiscais feitos (29/out):** `arrocho-fiscal` e `farra-fiscal` (regra `fiscal`: resultado fiscal andou ±2,5 pontos do PIB em 4 turnos). O `caminho` da bússola passou a guardar `resultado` por turno (campo opcional, saves antigos não ligam nada). Dívida não é guardada: nenhuma regra a usa. São 13 gatilhos; `gatilhos.test.ts` 24 verdes, `tsc -b` limpo; `scripts/teste/gatilhos-fiscais.ts` mostra o resultado guardado (sem mexer nas leis o déficit só anda ~0,27 por turno, então não liga sozinho; limiar 2,5 é chute). `npm run check` só ao fechar a M7 inteira.

**M7.3 feita (29/out), grupos e frases reagem aos gatilhos:** cada gatilho em `mundo/gatilhos.json` ganha `reacoes` (grupo, pontos de satisfação, frase e, opcional, `areas`: só reage se a decisão caiu nelas). O corte e a expansão de gastos dependem da área: corte na saúde derruba pobres e periferias, em educação derruba jovens e famílias com filhos, na defesa os conservadores. Os pontos mexem na satisfação do grupo na tela (`gruposDaPartida`) e na popularidade do motor (`aprovacaoViva(content, valores, reacoes)`, via `prepareGameMonth`); somam por grupo com teto de ±8. A fala do grupo no jornal vira a frase da reação, e o jornal ganha a linha de leitura da imprensa (neutra sem gatilho). Testes: `gatilhos.test.ts` 20, mais `aprovacaoViva`, `jornal`, `gruposSociais`, `camadas`; `tsc -b` limpo. Script: `scripts/teste/gatilhos-na-tela.ts` (liga o corte à mão). **Visto na tela só o estado sem gatilho** (frase neutra no Jornal, sem erro de console); a reação está provada por teste e script. **Limite:** a eleição e o Congresso (`pacoteVivo`) ainda não leem a reação, só a popularidade e a tela; pontos (±3/±4, teto 8) e as ~70 frases são chutes, a calibrar e revisar na revisão de texto. **Falta `npm run check`** (só ao fechar a M7 inteira).

**Próximos itens (não abrir sem perguntar):** antipartido/desgaste.

## (histórico) Os quatro achados da camada B, corrigidos em 29/out

- **Aposentadoria × reajuste:** o benefício agora é valor médio × `nivel_reajuste_de_beneficios`/100 (tabela: campo `reajuste`). Na tela, aposentado sobra R$ 2.343/mês, abaixo de carteira e servidor, e a lei de reajuste mostra "aposentados, R$ 631 a mais".
- **Imposto sobre consumo:** a arrecadação do motor é dividida entre todos que consomem (benefício incluso). A soma dos perfis fecha com a arrecadação (razão 1,000000, teste novo).
- **Lucros:** empresário, agro patronal e pequeno empreendedor (`capital: true`, sem salário) repartem `lucros`; pagam também renda de empresas e dividendos. Os lucros fecham (teste novo).
- **Quem pagou:** `quemPagouAConta` agora agrega por ocupação × renda e mostra as 6 faixas que mais sentiram.
- Testes: `bolso.test.ts` 22 e `censo` + `treemap`, 38/38; `tsc -b`, eslint e prettier limpos. **`npm run check` completo ainda não rodou sobre estas correções.**

**Calibragem aberta, não é bug:** empresário sobra R$ 95 mil/mês e agro patronal R$ 89 mil, porque `lucros` (6,8 mi contra 3,6 mi de salários) é repartido por 6,7% do eleitorado. O número vem do motor; vai para a calibragem (item 12 do PLANO).

**Menores ainda abertos:** salário médio negativo sem guarda; `MESES = 12` repetido em três lugares; a prévia compara só o último mês do horizonte; `censoDoPais(content)` sem valores devolve bolso zerado; a parte do eleitorado arredonda para "0%" nas ocupações pequenas.

## Por onde continuar

0. **Fechar a camada C** (revisão e `npm run check`, ver o topo).
1. **Camada C, partes seguintes**: valores, religião. A renda pela sobra está feita (30/out, só leitura): `app/partida/rendaViva.ts` move peso entre pobre/média/rica quando a sobra do perfil, em salários médios, muda desde o turno 0 (`GameState.valoresIniciais`, novo e opcional). Uma faixa por vez; só o censo usa, a eleição e os grupos não. Script: `scripts/teste/renda-viva.ts`. Visto na tela só no turno 0 (sem variação); o movimento está provado por teste e script, não jogando. Limite: a distância entre faixas é a das médias do início, e o rico quase não se move (chute de direção, calibragem).
   **Valores e religião feitos (30/out, só leitura):** `app/partida/faixasVivas.ts` move peso entre faixas por fluxos declarados em `mundo/populacao.json` (`mudancas`), pela pressão do país desde o turno 0. Valores: segurança, escolaridade, desigualdade. Religião: fluxos diretos entre as três (católico e sem religião → evangélico; católico e evangélico → sem religião). Solto de propósito, a calibrar. Visto na tela só no turno 0; movimento provado por teste e por `scripts/teste/valores-vivos.ts`. **A camada C está completa.** O `npm run check` completo roda só quando o Grupos inteiro terminar.
2. **Ligar o bolso na satisfação** (hoje ele só aparece na tela, decisão de
   29/out). Tem desenho próprio; mexe no que já está calibrado.
3. (feito) Ponta solta da Informalidade.
4. (feito) Saúde → mortalidade. 5. (feito) Natalidade.

## O que fechou nesta rodada

**País em frases** (fase 3): a bolha diz como está em vez de mostrar pontos do
motor. 55 das 192 falam; o resto cai no número, de propósito.

**Censo da população** (Grupos, camada A): a aba População, uma ficha por
atributo — pizza até seis faixas, treemap acima disso. Duas telas foram
descartadas antes por não se lerem (lista de barras, cem bonecos).

**Bolso e ocupação** (Grupos, camada B): cada perfil tem renda, imposto,
benefício e sobra, repartidos dos agregados que o motor já calcula. O censo
mostra quanto sobra por faixa, e a lei diz no bolso de quem ela bate.

## Decisões desta rodada, para não refazer a conversa

- **O agregado manda, o perfil divide.** A economia continua calculando o bolo;
  os 2.090 perfis repartem. A virada para "o perfil manda e o PIB é a soma" (o
  Victoria 3 inteiro) fica para depois e continua barata, porque o bolso guarda
  a **fonte** do dinheiro com nome.
- **Os setores econômicos vão existir** (indústria, serviços, agro). Hoje são só
  nome dentro de ocorrências de lobby; a ocupação segura o lugar deles, e eles
  entram pela fonte sem reescrever a camada B.
- **O bolso só mostra, não mexe na satisfação** — por ora.
- **Faixa escrita se julga jogando**: as frases de Gini, HHI e PIB em índice vão
  para a revisão manual bolha por bolha, lá na frente, não agora.

## Limitação conhecida, que não é bug

O imposto é proporcional: todos pagam a mesma fração do que ganham. O sistema
brasileiro é regressivo no consumo e progressivo na renda. Entra na calibragem
(item 12 do PLANO).

## Ferramentas que ficaram

- `npx vite-node scripts/teste/frases-das-bolhas.ts` — a frase de cada bolha
- `npx vite-node scripts/teste/bolso-dos-perfis.ts` — ganha/paga/sobra por faixa

Foram esses dois scripts que acharam o que os testes não achavam: a fração que
mentia em valores pequenos, e o imposto em 61% da renda.

## Armadilhas do projeto, aprendidas na marra

- **`npx tsc --noEmit` não checa nada aqui** — sai 0 com erro na cara. O projeto
  usa project references: o comando é `npx tsc -b`.
- **Reescrever um arquivo grande com o dev server ligado** pode fazer o Vite
  cachear um módulo vazio e dar tela branca. `Ctrl+Shift+R` resolve.
