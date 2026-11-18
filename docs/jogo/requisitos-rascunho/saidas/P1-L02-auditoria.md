# P1-L02: auditoria (3a mapa + 3b veredito)

Lote: 29 blocos JOGO-1.4-* (começo, mandato e fim) e 21 blocos JOGO-1.5-* (o turno). Pastas lidas: `src/motor/turno/` (index, comum, inicio, regras, etapas/congresso, eleicao, politica, midia, programas, governo, invariantes), `src/partida/` (index, comeco, inicio, gabinete, salvar, previa, visao, saudeDosIndices, perfil, jornal, paises), `src/motor/fatos/`, e de apoio `motor/pessoas/partido.ts`, `motor/pessoas/ministros.ts`, `motor/eleicao/`, `motor/efeitos/`, `motor/politica/{pauta,sessao,voto,relacao}`, `motor/mesa/`, `motor/governo/index.ts`, `motor/contas/`, `motor/acaso/`, e `tela/App.tsx` + `tela/inicio/*` onde a regra mora na tela.

Convenções: "tela" = a regra só existe em `src/tela/`. Todos os testes citados conferem a regra de hoje (13-14/nov), salvo onde dito.

---

## JOGO-1.4: começo, mandato e fim

### [JOGO-1.4-01] Escolher o país
- Veredito: CERTO
- Prova: `partida/paises.ts:18` `paisesDisponiveis()` lista as pastas de `conteudo/paises/*/*.json`; `paises.ts:27` `paisesJogaveis` filtra as que têm `pessoas` e `governo` (hoje só `brasil-2026`; `teste` e `teste-pobre` não têm). `partida/index.ts:536-542` `criarPartida` lê `estado-inicial`, `leis-vigentes`, `congresso` da pasta; `index.ts:586-609` leis vigentes, Congresso, governo, programas e rótulos (`vigentes.nomes`) vêm do país. Pasta sem arquivo: `paises.ts:12` "país X: falta Y.json" (0 países = nenhuma partida). Chamadores: `tela/App.tsx` `comecar`, `tela/inicio/TelaInicio.tsx:62` (país inicial = `paisesJogaveis()[0]`). Leitor do JSON: `arquivoPais` (paises.ts:10).
- Teste: `partida/comeco.test.ts:31` (regra de hoje; usa brasil-2026). Nenhum teste de "0 países".

### [JOGO-1.4-02] Criar o partido com nome e sigla
- Veredito: CERTO
- Prova: `partida/comeco.ts:22-23` `ComecoDoJogador.partido = { nome, sigla }`, sem campo de lado/bússola. `comeco.ts:57-58` `if (nome.trim().length < 3) return "o partido precisa de um nome"`; `comeco.ts:60-61` sigla de 2 a 8 caracteres (resolve o [ABERTO] de tamanho: mínimo 3 no nome, sigla 2-8, sem máximo de nome). Chamador: `partida/index.ts:546` `motivoComecoInvalido` dentro de `criarPartida`; a tela repete a checagem (ver Duplicados). Leitor: nenhum JSON.
- Teste: `partida/comeco.test.ts:82` (só a sigla repetida); nome vazio sem teste.

### [JOGO-1.4-03] Sigla vira o id e não repete
- Veredito: CERTO
- Prova: `comeco.ts:43-49` `idDoPartidoDoJogador` = sigla sem acento, minúscula, só `[a-z0-9]`; `comeco.ts:62-63` `if (idsDePartidos.includes(id)) return "a sigla X já é de outro partido"`. Comparação ignora maiúsculas (resolve o [ABERTO]); "PT" vira `pt`, que existe em `brasil-2026/congresso.json`. Partido extinto: não existe no motor.
- Teste: `partida/comeco.test.ts:82-88` (sigla "PT" recusada, regra de hoje).

### [JOGO-1.4-04] Montar a chapa de três vagas
- Veredito: CERTO
- Prova: `comeco.ts:25` `chapa: { presidente, candidato, vice }` ids de pessoas; `comeco.ts:64-67` recusa pessoa repetida (resolve o [ABERTO]: não permite) e pessoa que não existe (vaga vazia). O elenco é todos os partidos: `partida/inicio.ts:48` `prepararComeco` devolve `elencoDe(...)` inteiro (gerador `elencoDoPais`, `partida/index.ts:211`). Tela: `TelaInicio.tsx:101` `podeSeguir` do passo 2 exige `chapa !== null`.
- Teste: `partida/comeco.test.ts:82` (pessoa repetida recusada).

### [JOGO-1.4-05] A chapa gera a coligação
- Veredito: CERTO
- Prova: `comeco.ts:101-103` `origens` = partidos de origem da chapa, sem os "tecnico"; `comeco.ts:120-126` `coligacao: [id, ...origens, ...(coligarGoverno ? [congresso.governo] : [])]` (sem repetição). Recalcula a cada `criarPartida`, então trocar a chapa refaz. O código inclui o próprio partido do jogador na coligação (a regra fala "que não seja o do jogador": o governo precisa estar na coligação, invariante `invariantes.ts:60`). Chamador: `index.ts:554`; leitor: `estadoInicial` recebe `coligacao: congresso.coligacao` (`index.ts:605`).
- Teste: `partida/comeco.test.ts:56` (regra de hoje).

### [JOGO-1.4-06] Lado do partido pela média da chapa
- Veredito: CERTO
- Prova: `comeco.ts:104` `defendeDaBussola(bussolaMedia(chapa), grupos)`; `motor/pessoas/ministros.ts:23` `bussolaMedia` (média por eixo, 2 casas); `motor/pessoas/partido.ts:13-41` escolhe os 5 grupos (`GRUPOS_DEFENDIDOS = 5`) de menor distância à média, peso decrescente com a distância, soma `PESO_TOTAL = 1.2`. Resolve o [ABERTO]: os 5 mais próximos; empate fica pela ordem do `sort`. Chamador: `comPartidoDoJogador` -> `comPartidoNovo` (partido.ts:66).
- Teste: `motor/pessoas/pessoas.test.ts:97` (grupos mais perto pesam mais).

### [JOGO-1.4-07] Partido novo nasce com 6% das cadeiras
- Veredito: CERTO
- Prova: `motor/pessoas/partido.ts:10` `FRACAO_DE_ESTREIA = 0.06`; `partido.ts:73-76` `tomarCadeiras(antes, doadores, Math.round(total * 0.06))`; `partido.ts:80` `cadeiras: cadeirasTomadas(antes, depois)`. Ressalva: `tomarCadeiras` arredonda por doador (`partido.ts:54`), então o total tomado pode diferir do alvo por um ou dois (o próprio comentário em `partido.ts:59` diz); o Senado repete a conta em `comeco.ts:105-115`.
- Teste: `partida/comeco.test.ts:31` (só confere entre 10 e 60 cadeiras e total constante); `motor/pessoas/pessoas.test.ts:107`.

### [JOGO-1.4-08] O antigo governo vira oposição ou coligação
- Veredito: CERTO
- Prova: `comeco.ts:119` `governo: id` (o partido novo); o antigo governo continua em `partidos` e só entra em `coligacao` se `coligarGoverno` (`comeco.ts:124`). Oposição = quem não está na coligação (`eleicao.ts:126-137` `chapasDaEleicao` / `montarChapas`). Tela: `EtapaPartido`/`TelaInicio.tsx:117` repassa `coligarGoverno`.
- Teste: `partida/comeco.test.ts:46` (regra de hoje).

### [JOGO-1.4-09] A Aprovação inicial é declarada pelo país
- Veredito: ERRADO
- Prova: o país declara `jogabilidade.popularidade_governo` (`brasil-2026/estado-inicial.json:48` = 45; teste/teste-pobre = 50) e `variaveis.json:597` define o índice "Aprovação" como `tipo: calculado`. Só 3 leis o tocam por efeito (`cargos-de-livre-nomeacao`, `obrigacao-de-ter-plano`, `segurar-a-conta-de-luz`) e nenhum código do motor ou da tela lê o valor (grep `popularidade_governo` em `motor/`, `partida/`, `tela/`: só `icones.ts`). A Aprovação que o jogo usa de fato é `satisfacaoMedia(grupos) - desgaste`: `partida/index.ts:435-437` `apoioAtual`, `motor/eleicao/index.ts:66` `satisfacaoMedia`, `tela/mapa/BarraDoTopo.tsx:130`, `tela/mapa/Eleicao.tsx:89`. A satisfação dos grupos sai dos pops no turno, não de número declarado. Diferença: país que declara 70 começa com 70 no índice `popularidade_governo` (morto), mas o medidor mostra a satisfação média calculada dos grupos. Ver Duplicados.
- Teste: nenhum.

### [JOGO-1.4-10] Tamanho do governo numa régua
- Veredito: CERTO
- Prova: `partida/gabinete.ts:19-24` `TAMANHOS` = enxuto, classico, pais, inchado; `gabinete.ts:53-64` `governoPronto`: "pais" devolve as caixas do `governo.json`; "inchado" = país + 5 "sem pasta" (`SEM_PASTA_A_MAIS = 5`); enxuto/clássico vêm de `conteudo/mundo/ministerios/tamanhos.json` (9 e 19 caixas; Brasil "do país" = 34). Resolve o [ABERTO]. Chamador: `TelaInicio.tsx:76`, `EtapaGoverno.tsx`; as caixas escolhidas chegam a `criarPartida` via `comeco.caixas` (`index.ts:561`).
- Teste: `partida/gabinete.test.ts:29` (a régua cresce, regra de hoje).

### [JOGO-1.4-11] Ministros sorteados pela chapa
- Veredito: CERTO
- Prova: `partida/index.ts:292-314` `ministrosDoComeco` chama `sortearMinistros(semente + 1, caixas, elenco, centroDoGoverno(comeco,...), {escolhidos}, chapa)`; `motor/pessoas/ministros.ts:44-71` nota = competência/100 + 0,8 x (1 - distância à bússola da média da chapa) + 0,3 x acaso; a chapa fica de fora (`fora`). Um ministro por caixa.
- Teste: `partida/comeco.test.ts:66` (sem repetir, fora da chapa) e `motor/pessoas/pessoas.test.ts:81`.

### [JOGO-1.4-12] Trocar o ministro por três cartas ou pela lista
- Veredito: CERTO
- Prova: só na tela. `tela/inicio/EtapaMinisterios.tsx:127-140` três cartas: "O técnico" (`origem === "tecnico"`), "O aliado" (outro partido que não os da chapa), "O do seu partido" (origem entre os partidos da chapa), cada uma a melhor competência entre os livres; `EtapaMinisterios.tsx:243` `verTodos` abre a lista inteira. A escolha vira `comeco.ministros`, lida em `ministrosDoComeco` (`index.ts:311` `{...declarados, ...comeco?.ministros}`). O motor não conhece "carta". "O do seu partido" quer dizer partidos de onde vieram as pessoas da chapa, já que o partido novo não tem filiados.
- Teste: nenhum (tela); `partida/comeco.test.ts:66` cobre o que o motor faz com a escolha.

### [JOGO-1.4-13] Ministros fazem parte do começo
- Veredito: CERTO
- Prova: `motor/governo/index.ts:82-83` `motivoCaixasInvalidas`: `ministros.find((id) => !pessoas.includes(id))` -> `ministro "X" não existe`, o que inclui `""`; `partida/index.ts:287` `carregarGoverno` lança `país "X" › governo: ...`. Na prática o sorteio preenche toda cadeira (`sortearMinistros` não deixa vazia), então a cadeira vazia só aparece se faltar pessoa livre. Tela: a etapa "Ministros" vem antes de "Iniciar" (`TelaInicio.tsx:32-39`).
- Teste: nenhum direto de cadeira vazia; `partida/comeco.test.ts:66-80` mostra a partida abrindo com todos os ministros.

### [JOGO-1.4-14] Sequência de montagem do começo
- Veredito: PELA METADE
- Prova: a ordem país, partido, chapa, governo, ministros, iniciar existe como fita de passos na tela (`TelaInicio.tsx:32-39` `ETAPAS`), mas `podeSeguir` (`TelaInicio.tsx:98-105`) só barra o passo do partido (`motivoDoPartido === null`) e o da chapa (`chapa !== null`); governo, ministros e iniciar são `true`. No motor, `criarPartida` aceita `comeco` ausente (`partida/index.ts:545,553`: sem começo o partido do país governa, sem partido, chapa ou ministros do jogador), então a ordem não é regra do motor. Diferença com o aceite: "iniciar cria a partida no turno 1" -> `turno/inicio.ts:289` `turno: 0`; o primeiro `avancarTurno` leva a 1.
- Teste: nenhum.

### [JOGO-1.4-15] Mandato pela lei do país
- Veredito: CERTO
- Prova: `motor/eleicao/index.ts:62-75` `turnosMandato` acha a lei de opções com `mandato_anos` e devolve `anos * TURNOS_POR_ANO` (4 anos = 24); `turno/etapas/eleicao.ts:323-326` `decorrido >= mandato` -> `fecharMandato`, `decorrido === mandato - 1` -> `rodadaUm`. O motor não conhece o nome da lei (varre os valores vigentes). País sem a lei: `null`, sem eleição (`eleicao.ts:322`).
- Teste: `partida/partida.test.ts:44` (48 meses no começo) e `:51` (derrota no turno 24); `motor/eleicao/eleicao.test.ts:53`.

### [JOGO-1.4-16] Vencer a eleição abre outro mandato
- Veredito: PELA METADE
- Prova: `turno/etapas/eleicao.ts:296-312` `fecharMandato`: se `venceu`, `inicio_mandato: estado.turno`, `campanha: CAMPANHA_VAZIA`, zera `cargosUsados/emendasUsadas`; o `desgaste` NÃO é tocado (continua o acumulado). Diferença com o aceite (30 -> 45 no começo do segundo mandato): o código mantém 30 e segue somando `DESGASTE_POR_TURNO`; não há degrau a mais por mandato. "Maior que o anterior" só vale no sentido de acumular, pois o primeiro mandato começou em 0 (`inicio.ts:315`).
- Teste: `partida/partida.test.ts:63` (vence e começa outro mandato; não confere desgaste).

### [JOGO-1.4-17] O desgaste sobe sempre
- Veredito: CERTO
- Prova: `turno/etapas/politica.ts:35` `const desgaste = estado.desgaste + DESGASTE_POR_TURNO` em todo turno; `motor/eleicao/index.ts:26` `DESGASTE_POR_TURNO = 2.25 / 24` (~0,094 por turno; o aceite "10 -> 12" é só exemplo). Nada subtrai desgaste (grep: só soma de `desgasteDaQuebra`, `eleicao.ts:179`). Leitores: voto (`motor/eleicao/votos.ts:34`), `apoioAtual`, invariante `invariantes.ts:71`.
- Teste: nenhum que confira a subida; `motor/eleicao/eleicao.test.ts:60` e `:154` usam o desgaste como entrada.

### [JOGO-1.4-18] A partida termina quando o partido perde o poder federal
- Veredito: PELA METADE
- Prova: `turno/etapas/eleicao.ts:311` `encerrada: !eleicao.venceu`; `turno/index.ts:87-88` `if (estado.encerrada) throw new Error("partida encerrada: ...")`; segundo turno entra em `resultado` (`eleicao.ts:246-283`, `venceu: apoio > 50`). Falta o caso do vice de outro partido assumir: não há morte, renúncia ou sucessão no motor (grep vice/morre em `motor/` e `partida/`: só a ficha da trindade, `hierarquia.ts`).
- Teste: `partida/partida.test.ts:51` (perde no turno 24 e acaba); `partida/salvar.test.ts:20` (encerrada salva encerrada).

### [JOGO-1.4-19] Placar: o histórico inteiro do partido no poder
- Veredito: FALTA
- Prova: não existe placar de fim de partida: nenhum código soma "turnos governados" nem monta histórico de índices e fatos (grep placar/histórico em `motor/` e `partida/`: só `placarPrevisto`, que é de votação). O estado guarda só `anteriores` (4 turnos, `turno/index.ts:101`) e fatos de 1 a 3 turnos; a tela só mostra "A partida terminou" (`tela/mapa/ResultadoDoTurno.tsx:116`). Dado que sairia para a tela: `estado.eleicao` (`Eleicao`, último resultado) e `estado.turno`.
- Teste: nenhum.

### [JOGO-1.4-20] Sem pontos de ação por turno
- Veredito: CERTO
- Prova: nenhum contador de pontos de ação em `motor/` ou `partida/` (grep "pontos de ação" vazio). `motor/politica/pauta.ts:26-40` `entrarNaPauta` aceita todo `mudar_lei`; o limite é a carga da casa (`pauta.ts:94-100`: `usada[casa] >= carga` -> `return [t]`, a lei espera). Ressalva: `pauta.ts:34-35` lei derrotada recente lança erro (`falha("... só volta no turno N")`), um bloqueio por tempo que derruba o turno inteiro em vez de só atrasar.
- Teste: nenhum específico; `partida/partida.test.ts:182` (Câmara num turno, Senado no seguinte).

### [JOGO-1.4-21] Salvar sozinho
- Veredito: CERTO
- Prova: `tela/App.tsx:74-79` `passar`: `const depois = avancar(...)`, `guardar(depois)` (comentário "salva sozinho a cada turno") grava `salvarPartida(depois)` em `localStorage` (`App.tsx:19-20`); o novo turno (`depois`) é o que fica salvo. Menu: `App.tsx:105-110` `onSalvar`, `onCarregar`, `onRecomecar`. `partida/salvar.ts:13-22` grava país, semente, opções e estado; `carregarPartida` (`salvar.ts:24-60`) recria regras pelo país e migra leis. É regra de tela, não do motor.
- Teste: `partida/salvar.test.ts:11` (volta igual e continua igual), `:52` (migração de lei).

### [JOGO-1.4-22] Fato do turno: aviso que um módulo deixa
- Veredito: PELA METADE
- Prova: o mecanismo existe: `motor/fatos/index.ts` `novoFato`, `consultar`, `envelhecerFatos`; cada módulo junta o que emite em `estado.fatos` (`congresso.ts:153`, `politica.ts:36-40`, `governo.ts:74`, `programas.ts:44`) e outros leem sem chamar a origem: `politica/voto.ts:166` e `relacao.ts:50` via `consultar`, `governo/index.ts` (parâmetro `fatos`), mídia `motor/midia/jornal.ts:46`. Aceite falha em parte: a Política emite `lei-aprovada` (`sessao.ts:159`) e o jornal a lê no mesmo turno (`etapas/midia.ts:13`), mas os programas NÃO leem esse fato: `etapas/programas.ts:30-40` olha `valores: estado.leis`, sem `fatos`. Dois tipos são lidos e nunca escritos: `manchete-contra` e `grupo-com-raiva`.
- Teste: `motor/fatos/fatos.test.ts:27,40` (regra de hoje); `partida/partida.test.ts:138`.

### [JOGO-1.4-23] Entrega do partido e da chapa à Política
- Veredito: CERTO
- Prova: `partida/comeco.ts:93-144` `comPartidoDoJogador`: partido com `defende` (5 grupos, da média da chapa), `governo: id`, `coligacao` e `partidos` com o partido novo (`cor: COR_DO_JOGADOR`); `partida/index.ts:591-593` `congressoDasRegras(congresso)` entra em `regras.congresso` e `index.ts:605` a coligação entra em `estadoInicial`. A posição da chapa na bússola não é guardada: o partido vive só pelos grupos que defende (`bussolaDoPartido(p.defende, grupos)`).
- Teste: `partida/comeco.test.ts:31`.

### [JOGO-1.4-24] Entrega do governo e dos ministros a Leis
- Veredito: CERTO
- Prova: `partida/index.ts:556-562` `carregarGoverno(...)` com `ministrosDoComeco(...)` e `comeco?.caixas`; `index.ts:608` `governo: governo.declarado` -> `turno/inicio.ts:323-330` `iniciarGoverno(...)`. Uso: `turno/etapas/congresso.ts:222-225` `ajusteDaLei(regras.governo, estado.governo.caixas, lei)` (ministro da caixa da instituição da lei ajusta atraso e força) e `previa.ts` não o usa (ver 1.5-16).
- Teste: `partida/hierarquia.test.ts:14,25,36` (instituição e lei com ministro); `partida/partida.test.ts:308`.

### [JOGO-1.4-25] O país declara só o estado inicial
- Veredito: CERTO
- Prova: grep de nomes de país, lei e partido em `src/motor/` e `src/partida/` (excluindo testes): nenhum (`brasil`, `stf`, `selic`, `pt` ausentes; só um exemplo em comentário, `partida/index.ts:120`). Tudo vem de `conteudo/paises/<id>/`: `estado-inicial`, `leis-vigentes`, `congresso`, `governo`, `programas`, `midias`, `empresas`, `producao`, `judiciario`, `pessoas`. A constante `TECNICO = "tecnico"` é um rótulo de origem do mundo repetido no motor (ver Duplicados). Dois países, `teste` e `teste-pobre`, rodam pelo mesmo motor.
- Teste: `partida/conteudo.test.ts:97` (valida a produção de todos os países); `partida/partida.test.ts` roda `teste`.

### [JOGO-1.4-26] Histórico do país: declarado primeiro, gerado depois
- Veredito: PELA METADE
- Prova: existem declarados `programas.json` (`formados`, `partida/index.ts:317-336`), `midias.json` (`index.ts:339-348`), `empresas.json` (`empresasDoPais`, `index.ts:748`) e `judiciario.json`, e o gerador de pessoas (`elencoDoPais`, `index.ts:211`) cria o elenco. Falta o resto: golpes, crises, guerras e governos anteriores não têm campo, tipo, estado nem gerador (grep golpe/guerra/crise em `motor/` e `partida/`: nada). Empresas e mídias não são geradas se o país não declara (`index.ts:340,749`: lista vazia).
- Teste: `partida/partida.test.ts:417,453` (programas e jornal do Brasil); nenhum de gerador de histórico.

### [JOGO-1.4-27] Rede da pessoa sem rótulo de lado
- Veredito: CERTO
- Prova: `partida/perfil.ts:66-77` `perfilDaPessoa`: `usuario`, `posts` (frases do mundo por tom do eixo, `perfil.json`), `lugares`, `segue` (3 pessoas mais próximas na bússola) sem campo nem palavra de lado; determinístico (hash do id, `perfil.ts:26`). Chamador: `perfilDeUmaPessoa` (`inicio.ts:85`) -> `tela/inicio/ListaDePessoas.tsx:58`. "Rede única, sem nome, resumo das redes do país" é conteúdo, sem código.
- Teste: `partida/comeco.test.ts:105-114` (sem "esquerda" ou "direita", só em um perfil, regra de hoje).

### [JOGO-1.4-28] Espiar: informação pessoal pela inteligência
- Veredito: FALTA
- Prova: nenhum botão, pedido, tipo de `Pedido` ou campo de Verba de inteligência/Poderes ligado a "espiar" (`motor/turno/regras.ts:84-91` lista os pedidos: congresso, carimbar, nomear, prometer, indicar). Hoje o perfil aparece inteiro na tela inicial (`perfil.ts`), sem custo nem nível de informação.
- Teste: nenhum.

### [JOGO-1.4-29] Espiar fere a privacidade e fica no registro que vaza
- Veredito: FALTA
- Prova: não existe registro de espionagem nem privacidade; `motor/governo/tipos.ts:16` tem só um comentário "vaza, sabota" sobre baixa de ministro. Nada grava linha por uso.
- Teste: nenhum.

---

## JOGO-1.5: o turno

### [JOGO-1.5-01] O turno dura 2 meses
- Veredito: CERTO
- Prova: 2 meses e 6 por ano aparecem como constantes: `motor/turno/comum.ts:5` `TURNOS_POR_ANO = 6`, `partida/visao.ts:62` `MESES_DO_TURNO = 2`, `partida/index.ts:444` `(inicio_mandato + mandato - turno) * 2`, `partida/previa.ts:43` `MESES_POR_TURNO = 2`. O estado só guarda o número do turno (`estado.turno`), sem calendário: "turno 7 = primeiro do segundo ano" vale por conta (6 por ano), não por data. Constantes repetidas: ver Duplicados.
- Teste: `partida/partida.test.ts:44` (48 meses = 24 turnos).

### [JOGO-1.5-02] Mesma semente e mesmos pedidos dão a mesma partida
- Veredito: CERTO
- Prova: `motor/turno/index.ts:82-110` `avancarTurno(regras, estado, pedidos)` devolve novo estado; o acaso é `estado.acaso` (`economia.ts:104` `sortearNormal(estado.acaso)`, `economia.ts:145` guarda o próximo); outros sorteios (juízes, pessoas, ministros) usam semente derivada (`motor/judiciario/index.ts:175`, `pessoas/gerar.ts:23`). Nenhum `Math.random`/`Date.now` em `motor/` ou `partida/` (grep).
- Teste: `partida/partida.test.ts:160` (12 turnos, teste, mesa de fatos igual; só compara os fatos, não o estado todo); `partida/salvar.test.ts:11`.

### [JOGO-1.5-03] O estado anterior não muda
- Veredito: CERTO
- Prova: `motor/turno/index.ts:90-94` `proximo = { ...estado, turno: +1, fatos: envelhecerFatos(...) }` e as etapas devolvem objetos novos (`congresso.ts:147-154`, `politica.ts:41-47`). Ponto de risco que já copia: `motor/politica/sessao.ts:90` `ec: structuredClone(e.estado)` (a Sessão faz `push` em pauta, sanção e decretos, `pauta.ts:32`, `moedas.ts:124`). `congresso.ts:229-231` copia prazos, usos e fatos antes de `delete`/`push`. Não achei mutação do estado de entrada.
- Teste: nenhum que compare o estado de entrada antes e depois.

### [JOGO-1.5-04] O acaso mora no estado
- Veredito: PELA METADE
- Prova: `motor/estado/index.ts:56` `acaso: Acaso` (inteiro de 32 bits, `motor/acaso/index.ts:5`); `turno/inicio.ts:289` `acaso: semear(inicio.semente)`; só a economia avança (`economia.ts:104,145`, 2 sorteios por turno via Box-Muller). A semente NÃO fica no `Estado`: fica em `Partida.semente` (`partida/index.ts:95-99`). Os demais sorteios não andam no estado: usam semente + deslocamento (`judiciario/index.ts:148,175,188`), sem posição guardada.
- Teste: nenhum da posição do sorteio; `partida/partida.test.ts:160` (determinismo).

### [JOGO-1.5-05] Ordem das etapas do turno
- Veredito: PELA METADE
- Prova: `motor/turno/index.ts:57-79` `ETAPAS`: congresso, leisNovas, efeitosVencem, judiciario, economiaReal, precosEJuros, capacidades, contas, moradia, saneamento, atendimento, indicesJogabilidade, mundo, precosDoMundo, popsEGrupos, governo, programas, politica, eleicao, midia, invariantes (21). As 15 do GDD estão na mesma ordem relativa; sobram 6 que a regra não lista: judiciário, capacidades, saneamento, atendimento, mundo, preços do mundo. "Aprovada na etapa 1 conta na 2": `congresso.ts:150` grava `votacoes`, `leisNovas` (`congresso.ts:255`) as lê. "Fato de Política lido pela Mídia": `politica.ts:36-40` antes de `midia.ts:13`. Parte da etapa 10 fica fora de `invariantes`: `turno/index.ts:97` confere a conta do Tesouro.
- Teste: nenhum da ordem.

### [JOGO-1.5-06] Lei fora da lista do país fica não legislada
- Veredito: CERTO
- Prova: o estado só guarda as vigentes (`turno/inicio.ts:279` `leis: { ...inicio.leis }`, de `leis-vigentes.json`); toda soma varre `estado.leis`, não `regras.leis`: `economia.ts:73,239,256,344,367,393` (`for ... of Object.entries(leis)`), fila de efeitos só das vigentes (`efeitos/index.ts:48` `filaInicial`). Lei ausente: 0 arrecadação, 0 gasto, 0 efeito.
- Teste: `partida/partida.test.ts:14` (só confere arrecadação; gasto e índice sem teste).

### [JOGO-1.5-07] Um pedido legisla e o efeito anda de zero ao valor novo
- Veredito: CERTO
- Prova: `efeitos/index.ts:72-101` `enfileirar`: `de = antiga ? contribuicao(antiga) : 0` (lei nova parte de 0), `para = pontos x ajuste.forca`; `efeitos/index.ts:27-31` `contribuicao` = `de + (para - de) x min(1, idade/atraso)` (linha reta). Chamador: `turno/etapas/congresso.ts:278` em `leisNovas`.
- Teste: nenhum direto de `enfileirar` fora de `partida/previa.test.ts:34`.

### [JOGO-1.5-08] Todo efeito declara quanto tempo leva
- Veredito: CERTO
- Prova: `motor/leis/tipos.ts:77` campo `atraso_turnos` obrigatório em cada efeito (validado em `validar.ts`); `efeitos/index.ts:41` `atraso: Math.max(atual.atraso, efeito.atraso_turnos)` por índice; `efeitos/index.ts:104-108` `envelhecer` soma 1 idade por turno até o atraso. Contagem: o pedido é processado em `leisNovas` e `efeitosVencem` no mesmo turno, então no turno t0+1 a idade já é 1; com atraso 4, chega inteiro em t0+4. O ministro altera o atraso (`ajuste.atraso`, `efeitos/index.ts:95`).
- Teste: nenhum direto.

### [JOGO-1.5-09] Atraso zero vem no turno seguinte
- Veredito: CERTO
- Prova: `efeitos/index.ts:29` `const fracao = e.atraso === 0 ? 1 : Math.min(1, e.idade / e.atraso)`. O pedido do turno t0 é aprovado quando o contador passa a t0+1 e o efeito já vale inteiro nesse estado; sem Congresso a conta é a mesma (`congresso.ts:115-128`). Com Congresso, Câmara e Senado em turnos diferentes empurram o início (`partida.test.ts:182`).
- Teste: nenhum direto de atraso 0.

### [JOGO-1.5-10] O módulo `turno` só chama os módulos e junta os fatos
- Veredito: PELA METADE
- Prova: `turno/index.ts:95` `ETAPAS.reduce(...)` chama cada etapa, mas as etapas guardam regra: `etapas/eleicao.ts:259-271` decide `venceu: apoio > 50`, o segundo turno e o desgaste da quebra (`:149-186`); `etapas/congresso.ts:62-88` `barradoPelaRegraFiscal` (regra fiscal), `:220-305` `leisNovas` (revogação, prazo, ato, perdão); `etapas/politica.ts:51-73` `fatosDaBase`. A regra do voto fica em `motor/politica/voto.ts` (isso está certo). Etapas somam ~2.600 linhas (`economia.ts` 521, `eleicao.ts` 328, `congresso.ts` 310...). O GDD já chama isso de dívida (L367).
- Teste: nenhum.

### [JOGO-1.5-11] Fatos do turno somem em 1 a 3 turnos
- Veredito: CERTO
- Prova: `motor/fatos/index.ts:48` `DURACAO = { pequeno: 1, medio: 2, grande: 3 }`; `novoFato` põe `restam`; `envelhecerFatos` (`fatos/index.ts:77`) tira 1 e filtra `restam > 0`, chamada em `turno/index.ts:93` antes das etapas. O tamanho é declarado por quem emite o fato (resposta à pergunta 1a). Fato pequeno emitido no turno t vale em t e some em t+1.
- Teste: `motor/fatos/fatos.test.ts:27` (regra de hoje).

### [JOGO-1.5-12] Seta de tendência compara com 8 meses atrás
- Veredito: PELA METADE
- Prova: janela certa: `turno/index.ts:81,101-104` guarda até `TURNOS_GUARDADOS = 4` turnos de `jogabilidade`; `partida/visao.ts:478` `anterior: estado.anteriores?.at(-1)?.[v.id]` (o mais antigo). Corte de 2 pontos em `partida/saudeDosIndices.ts:23,66-69` (`<= -2` piorando, `>= 2` melhorando; 2 exato conta). Diferenças: (a) a diferença é em "saúde" normalizada pela faixa do índice (0-100 da faixa, invertida se "maior é pior"), não em pontos do índice; (b) o rótulo é "piorando/melhorando", não alta/queda; (c) índice neutro nunca ganha seta (`saudeDosIndices.ts:54-55`); (d) nos 4 primeiros turnos a janela é menor que 8 meses. O motor não entrega o valor de 8 meses atrás como campo (só `mudancaDaSaude`).
- Teste: `partida/saudeDosIndices.test.ts:74,95` (regra de hoje, 13/nov).

### [JOGO-1.5-13] Sem sorteio para a lei passar
- Veredito: CERTO
- Prova: `motor/politica/voto.ts:1` "Sem sorteio: a mesma conta serve..."; `voto.ts:253` `passa = sim > quorum * total + FOLGA`; nenhuma chamada a `sortear`/`acaso` em `motor/politica/` (grep). Entram nota dos partidos, apoio do povo (`apoioDoPovo`), aprovação, termômetro, fatos de escândalo e conta (`voto.ts:158-180`).
- Teste: `partida/partida.test.ts:171` (placar previsto = votação).

### [JOGO-1.5-14] O exorbitante cai na votação
- Veredito: PELA METADE
- Prova: `voto.ts:255-256` `exorbitante = !aprovada && passa(sem.sim, sem.total)`, isto é, só a lei que passaria SEM a conta do gasto e cai COM ela. A lei que perde por outro motivo cai (`pauta.ts:134-138` `negar` -> `barrar`) mas não é marcada exorbitante. Nenhuma outra definição de "exorbitante" (conta de gasto e déficit só). O marcador é lido só pela tela (`PlacarDaLei.tsx:85`, `ResultadoDoTurno.tsx:263`), e `pauta.ts:153` o zera quando o Senado emenda.
- Teste: `partida/partida.test.ts:27` (lei só muda com voto); nenhum do marcador.

### [JOGO-1.5-15] Desistir de uma lei custa paciência e Aprovação
- Veredito: FALTA
- Prova: o `Pedido` não tem retirar/desistir (`motor/turno/regras.ts:84-91`; `politica/tipos.ts` tem mudar_lei, oferecer, decretar, vetar, assinar, convidar). A paciência existe (`politica/constantes.ts:32-34`, `relacao.ts:83-92`), mas cai por QUANTIDADE de leis novas e por cansaço da casa (`CANSACO_POR_LEI = 2`), não por propor e desistir. A Aprovação não é mexida por pedido. Substituir a lei na pauta (`pauta.ts:31`) apaga a anterior sem custo.
- Teste: nenhum.

### [JOGO-1.5-16] A lei mostra "efeito em N turnos"
- Veredito: PELA METADE
- Prova: `partida/previa.ts:356-380` `previaDaLei` entrega, por índice, `atrasoMeses: e.atraso * 2`; não devolve o N único do efeito mais longo, nem "N = 1" para atraso 0 (entrega 0 meses). `previa.ts:364` chama `enfileirar(estado.efeitos, lei, valor)` sem o ajuste do ministro, então o atraso mostrado pode diferir do real (`congresso.ts:222-225` aplica `ajusteDaLei`). A tela formata cada linha (`tela/mapa/formatos.ts:131` `atraso(meses)`).
- Teste: `partida/previa.test.ts:34` (atraso em meses por opção).

### [JOGO-1.5-17] O jogador age com pedidos antes de passar o turno
- Veredito: CERTO
- Prova: `motor/turno/regras.ts:84-91` `Pedido = PedidoCongresso | PedidoCarimbar | PedidoNomear | PedidoPrometer | PedidoIndicar`; propor lei = `mudar_lei`; trocar ministro = `nomear` (`etapas/governo.ts:68`); negociar = `oferecer` e `convidar` (`politica/tipos.ts`); campanha = `prometer` (`etapas/eleicao.ts:105-121`, aceito em qualquer turno, não só em tempo de campanha); `avancarTurno(regras, estado, pedidos)` (`index.ts:82-86`).
- Teste: `partida/partida.test.ts:330` (nomear), `:519-610` (prometer), `:26` (mudar_lei).

### [JOGO-1.5-18] O jogador vê quem ganha e quem perde antes de propor
- Veredito: CERTO
- Prova: `partida/previa.ts:380-395` `previaDaLei` devolve `grupos: [{ id, pontos }]` (satisfação que a lei dá a cada grupo, contra hoje, via `pontosLeis`), filtrando os de efeito nulo; pontos positivos ganham, negativos perdem. Exportado em `partida/index.ts:700`.
- Teste: `partida/previa.test.ts:19` (sinais opostos para subir e descer).

### [JOGO-1.5-19] Despachar a mesa antes da votação
- Veredito: PELA METADE
- Prova: `motor/mesa/index.ts:51` `Carimbo = "assinar" | "vetar"`; `pauta.ts:44-80` `sancao` aceita assinar, vetar ou ignorar (ignorar vale o que o país declara, `congresso.ignorar`). Faltam "recusar" e "encaminhar", e "deixar na pilha" só existe como ignorar com prazo de 1 turno (`mesa/index.ts:62` `PRAZO_EM_TURNOS = 1`). Assinada vira lei, vetada volta ao Congresso (`derrubada-do-veto`); a mesa só traz papel de sanção (de lei emendada), aviso e indicação de juiz. Os carimbos entram nos pedidos (`congresso.ts:133-144` `traduzirCarimbos`).
- Teste: `partida/partida.test.ts:230,245,258` (assinar, vetar e ignorar).

### [JOGO-1.5-20] A mídia reage e os fatos acontecem ao passar o turno
- Veredito: PELA METADE
- Prova: `etapas/midia.ts:9-16` `fecharJornal(...)` -> `motor/midia/jornal.ts:46-57` `jornalDoTurno` ordena os fatos do turno por impacto (`jornal.ts:17-28`); a manchete sai de `partida/jornal.ts:42`. Escândalo é emitido por órgão corrupto (`motor/governo/index.ts:255-266`). Mas "reação" é só listar fatos: a mídia não mexe em opinião. Choque de preço existe como estado (`etapas/mundo.ts:50` `andarChoques`) mas não vira fato, e atentado não existe. `manchete-contra` e `grupo-com-raiva` não são escritos por ninguém.
- Teste: `partida/partida.test.ts:505` (jornal traz o maior fato do turno).

### [JOGO-1.5-21] Invariantes fecham o turno
- Veredito: PELA METADE
- Prova: `etapas/invariantes.ts:112-129` roda 6 conferências (contas, índices e leis, população, poder, serviços, fatos) e `turno/index.ts:97-98` confere `motivoContaNaoFecha`: "cofre - dívida variou o resultado (+perdão)" (`contas/index.ts:85-94`). Quando falha, `throw new Error("invariante no turno N: ...")` (`invariantes.ts:124-127`), o turno aborta; não deixa "aviso". Não há emissão de moeda no Tesouro (`Tesouro` só tem cofre, dívida, resultado, perdão; `contas/index.ts:7-14`), então "caixa, dívida e emissão" fecha só com caixa e dívida. `cofre < 0` também lança (`invariantes.ts:21`).
- Teste: nenhum de falha de invariante; `motor/contas/contas.test.ts` testa a conta.

---

## Contagem
- CERTO: 31
- ERRADO: 1
- PELA METADE: 14
- VELHO: 0
- DUPLICADO: 0
- FALTA: 4
- NÃO SE APLICA: 0
- Total: 50 (29 de 1.4 + 21 de 1.5)

## Código sem dono
- `estado.mudanca` (`motor/estado/index.ts:121`, escrito em `motor/turno/index.ts:105-108`): nenhum leitor (grep `mudanca` em `motor/`, `partida/`, `tela/`). Morto.
- Fatos `manchete-contra` e `grupo-com-raiva` (`motor/fatos/index.ts:41-42`): lidos por `politica/voto.ts:166` e pesados em `midia/jornal.ts:17-18`, nenhum módulo os escreve. Morto de um lado só (o comentário de `fatos/index.ts:42` admite).
- `popularidade_governo` em `estado.jogabilidade` (declarado pelo país, 3 leis o alteram): vivo no estado, sem leitor. Morto (ver 1.4-09).
- `partida/inicio.ts:122` `chapaSugerida` e botão "Sugerir uma chapa" (`TelaInicio.tsx`), cheat "pular" (`TelaInicio.tsx:122`) e opções `semCongresso`/`semSenado`/`ajustes` (`partida/index.ts:461-470`): vivos, sem regra no GDD (atalhos de teste e de tela).
- `partida/salvar.ts:34-60` migração de partida salva (leis que saíram, opção trocada, campos novos): viva, sem regra no GDD (compatibilidade de arquivo).
- `partida/index.ts:662` `jogar`: sem chamador fora de testes e scripts (grep em `src/` sem `*.test.ts`: nenhum). Vivo só em teste.
- `PARTIDO_DE_PASSAGEM` (`partida/inicio.ts:94`): partido fictício "-" para sortear ministros antes de a pessoa dar o nome do partido. Vivo, gambiarra de montagem.
- `motor/pessoas/partido.ts:7-8` `GRUPOS_DEFENDIDOS = 5` e `PESO_TOTAL = 1.2`: vivos; o "5" tem dono em 1.4-06, o `1.2` é calibração sem regra no GDD.
- `motor/fatos/index.ts:34,35` tipos `regra-fiscal-estourou`, `corte-novo-presidente`: vivos (emitidos em `economia.ts:505` e `judiciario.ts:108`), de outros lotes.

## Duplicados
- **Aprovação do governo, três cálculos**: (1) índice `popularidade_governo`, declarado pelo país e alterado por 3 leis, sem leitor (morto); (2) `satisfacaoMedia(grupos) - desgaste` em `partida/index.ts:435` e `motor/eleicao/index.ts:66`, o que a tela e a eleição usam; (3) `aprovacao(grupos)` privado em `motor/politica/voto.ts:113`, cópia da média pesada de (2) (devolve 50 se não há pessoas, (2) não). Em uso: (2) e (3); morto: (1).
- **Validação de nome e sigla do partido**: `partida/comeco.ts:57-63` (motor) e `tela/inicio/escolhas.ts:57-67` `motivoDoPartido` (tela, `NOME_MINIMO = 3`, sigla 2-8). Mesma regra, dois lugares; ambos em uso (a tela barra, o motor confirma).
- **Cadeiras do partido novo**: `motor/pessoas/partido.ts:66-82` `comPartidoNovo` (Câmara) e `partida/comeco.ts:105-142` (Senado), a mesma conta de 6% reescrita.
- **TURNOS_POR_ANO = 6**: `turno/comum.ts:5`, `eleicao/index.ts:27`, `moradia/index.ts:9`, `saneamento/index.ts:7`, `atendimento/index.ts:7`, `mercado/capacidade.ts:10`, `mercado/construcoes.ts:72`. **Meses por turno = 2**: `partida/visao.ts:62`, `partida/previa.ts:43`, `motor/judiciario/index.ts:133`. **Mandato de 24 turnos** fixo em `motor/governo/index.ts:142` `TURNOS_DO_MANDATO`, separado de `turnosMandato`, e `DESGASTE_POR_TURNO = 2.25 / 24` em `eleicao/index.ts:26` também assume 24 turnos. Todos em uso.
- **`TECNICO = "tecnico"`**: 8 declarações (ex.: `partida/comeco.ts:17`, `motor/governo/index.ts:43`, `motor/governo/ministerios.ts:18`, `tela/inicio/EtapaMinisterios.tsx:25`). Em uso.
- **Atraso do efeito**: a prévia (`previa.ts:364`, sem ajuste do ministro) e o turno (`congresso.ts:278`, com `ajusteDaLei`) calculam o atraso por caminhos diferentes. Em uso os dois; os números podem divergir.

## Campos das leis
Amostra: `duracao-mandato` (opcoes com `mandato_anos`), `anistia-fiscal` (`tipo: prazo`, `prazo_turnos: 2`), `renegociacao-da-divida` (`tipo: ato`), `divida-em-moeda-estrangeira` (efeitos com `atraso_turnos`), `cargos-de-livre-nomeacao`, `segurar-a-conta-de-luz` (efeitos em `popularidade_governo`).
- **Usados por este lote**: `efeitos[].indice/sentido/forca/atraso_turnos` (`efeitos/index.ts:33-45`); `opcoes[].mandato_anos` (`eleicao/index.ts:72`); `tipo` ("ato" e "prazo") e `prazo_turnos` (`congresso.ts:264,273-274`); `conta: "gasto"` (`voto.ts:107`, `congresso.ts:69`); `classe` (quórum, `voto.ts:251`); `esfera` (verba e piso fiscal, `congresso.ts:79`, `ajusteDaLei`); `bussola` (posição da lei no fato, `posicaoDaLei`, `sessao.ts:155`); `canal`/`forma`/`faixa`/`passo` (valor e validação, `congresso.ts:99-112`).
- **Ignorados por este lote** (lidos por outros módulos ou por ninguém aqui): `origem`, `espera`, `jeito`, `parte_de`, `calculo`, `escala_gasto`, `encolhe`, `para`, `arrecada`, `unidade`, `rotulo_unidade`.
- **Esperados e ausentes**: nenhum campo de "tamanho do fato" (o tamanho vem do emissor no código, `sessao.ts:158` fixo em "medio" para `lei-aprovada`); nenhum campo de "efeito em N turnos" agregado (só `atraso_turnos` por efeito); `popularidade_governo` aparece em 3 leis mas nada o lê; as leis não trazem nada sobre desistir/retirar ou sobre Aprovação por pedido; o molde de lei não declara se a lei "mostra gente que ganha/perde" (isso vem de `pontosLeis` sobre `bussola` e `efeitos`).
