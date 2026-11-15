# Auditoria P1-L01 (fase 3a + 3b)

Lote: blocos `[JOGO-1.1-01]` a `[JOGO-1.3-23]` (55 requisitos). Só o código foi lido como prova. Caminhos relativos a `src/`. Sem proposta de conserto.

Mapa geral do que foi tocado (entra na Prova de cada veredito):
- Ordem do turno: `motor/turno/index.ts:54-76` (lista `ETAPAS`), `avancarTurno` em `:79-110`.
- Estado: `motor/estado/index.ts` (campo `encerrada`, `eleicao`, `efeitos`, `fatos`, `anteriores`, `governo`, `congresso`).
- Leis: `motor/leis/tipos.ts`, `motor/leis/validar.ts`, `motor/leis/valor.ts`, `motor/leis/colisao.ts`.
- Efeitos: `motor/efeitos/index.ts`; entra em `motor/turno/etapas/congresso.ts:220-305` (`leisNovas`) e `:307-310` (`efeitosVencem`).
- Congresso: `motor/politica/{voto,pauta,sessao,tramitacao,constantes}.ts`, etapa `motor/turno/etapas/congresso.ts`.
- Grupos e eleição: `motor/grupos/index.ts`, `motor/eleicao/*`, `motor/turno/etapas/eleicao.ts`.
- Dinheiro: `motor/contas/index.ts`, `motor/turno/etapas/economia.ts`, `motor/turno/etapas/populacao.ts`, `motor/populacao/index.ts`, `motor/calculos/index.ts`.
- Governo: `motor/governo/{index,orgaos,ministerios,tipos}.ts`, `motor/pessoas/*`, `partida/comeco.ts`.
- Mídia e fatos: `motor/midia/*`, `motor/fatos/index.ts`, `partida/jornal.ts` (texto), `conteudo/mundo/jornal/manchetes.json`.
- Tela recebe dado por `partida/visao.ts` e `partida/tiposVisao.ts` (não descido).

Testes citados: "regra de hoje" = confere o que o código faz e o GDD de 14/nov; "antiga" = confere regra que o GDD já não tem.

---

## Parte 1.1

### [JOGO-1.1-01] Fim da partida pela perda do poder federal
- Veredito: PELA METADE
- Prova: a derrota na eleição encerra: `motor/turno/etapas/eleicao.ts:311` `encerrada: !eleicao.venceu`, e `motor/turno/index.ts:84-85` `if (estado.encerrada) throw new Error("partida encerrada: o governo perdeu a eleição")`. Falta o resto da regra: não existe sucessão nem vice assumindo (grep `vice|sucess|morre` no `motor/` só acha a chapa em `partida/comeco.ts:25`, sem efeito no turno); não existe "placar final" aberto (ver 1.1-04); empate em 0 votos cai em `apoio > 50` (`etapas/eleicao.ts:271` `venceu: apoio > 50`), perde por padrão.
- Teste: `partida/partida.test.ts:51` (perde no turno 24, partida acaba) e `partida/salvar.test.ts:20` (regra de hoje).

### [JOGO-1.1-02] Histórico do governo gravado a cada turno
- Veredito: FALTA
- Prova: nenhum campo guarda uma linha por turno. O mais próximo é `motor/estado/index.ts` `anteriores` (só os 4 últimos turnos de índices de jogabilidade, `motor/turno/index.ts:42` `TURNOS_GUARDADOS = 4`, `:100-103`) e `mudanca` (PIB e dívida do último turno). Não grava melhorou, mais atacado, pops que mais gostaram/odiaram. grep `historico|histórico|resumão|placar` em `motor/` e `partida/` não acha nada de histórico.
- Teste: nenhum.

### [JOGO-1.1-03] Resumão a cada 4 anos
- Veredito: FALTA
- Prova: sem função nem campo de resumão. `motor/estado/index.ts` não tem lista de histórico para resumir; a única contagem de 24 turnos é `DESGASTE_POR_TURNO = 2.25/24` (`motor/eleicao/index.ts:26`) e `TURNOS_DO_MANDATO = 24` das trocas de ministro (`motor/governo/index.ts:140`).
- Teste: nenhum.

### [JOGO-1.1-04] Placar final é o histórico inteiro
- Veredito: FALTA
- Prova: ao encerrar, o estado fica com `eleicao` (a última: apoio, margem, rodadas, chapas; `motor/eleicao/index.ts:35-49`) e `encerrada: true`, sem histórico nem "motivo". A tela só escreve "A partida terminou." (`tela/mapa/ResultadoDoTurno.tsx:116`).
- Teste: nenhum.

### [JOGO-1.1-05] Partido continua quando muda a pessoa
- Veredito: FALTA
- Prova: nenhuma pessoa do partido deixa o cargo sozinha: o motor não tem morte, renúncia nem sucessão (grep `morre|morte|falece|sucess` sem achado fora do `judiciario`, onde juiz se aposenta: `motor/judiciario/index.ts:604`). O único jeito de pessoa sair é o jogador demitir ministro (`motor/governo/index.ts:187-217` `nomear`). O partido do jogador permanece porque nada o troca, não por uma regra de continuidade.
- Teste: nenhum.

### [JOGO-1.1-06] Ficha da pessoa decide o que ela faz
- Veredito: PELA METADE
- Prova: a ficha pesa em duas coisas: competência muda atraso e força das leis da caixa (`motor/governo/ministerios.ts:82-85` `ajusteDaCompetencia`) e honestidade entra na corrupção do órgão (`motor/governo/orgaos.ts:155-159` `corrupcaoSeguinte`, `desonesto = ((MAXIMO - honestidade)/MAXIMO)*POR_DESONESTIDADE`). Isso vira escândalo (`motor/governo/index.ts:262-270`). Não existe trair, errar, brilhar nem morrer. `Ficha.lealdade` só é validada (`governo/index.ts:105-113`) e mostrada na tela (`tela/mapa/Governo.tsx:28`); `habilidade` e `carisma` idem (grep `\.carisma|\.habilidade` no motor só acha a validação). Não há sorteio por pessoa: a corrupção é determinística.
- Teste: `motor/governo/governo.test.ts:128`, `:232`, `:259` (regra de hoje, só competência e honestidade).

### [JOGO-1.1-07] Voto da lei conjunto de mídia e grupos
- Veredito: PELA METADE
- Prova: o voto de cada partido soma grupos que ele defende, povo, base/oposição, termômetro, aprovação, conta, paciência, moedas e ministério (`motor/politica/voto.ts:148-200`, pesos em `:15-24`), sem sorteio (`:241-273`). A mídia entra só como fatos `escandalo` e `manchete-contra` (`voto.ts:166-170`): `manchete-contra` ninguém escreve (grep, só `voto.ts` e `jornal.ts` citam) e a credibilidade/audiência das mídias nunca é lida (ver Código sem dono). Nada impede travar: lei sem maioria cai e fica barrada 2 turnos (`motor/politica/sessao.ts:174-185` `barrar`, `constantes.ts:42` `TURNOS_BARRADA = 2`); não existe freio que "não deixe a aprovação difícil a ponto de travar", só a paciência que pune (`voto.ts:177-178`).
- Teste: `motor/politica/politica.test.ts:102`, `:115`, `:362` (regra de hoje, sem a regra de mídia).

### [JOGO-1.1-08] Gosto da lei por bolso, bússola e memória
- Veredito: PELA METADE
- Prova: o gosto é por grupo, não por pop. `motor/grupos/index.ts:157-179` `pontosLei`: só a distância na bússola (`(d0 - d1) * peso * PONTOS_EIXO`, limite ±15 por lei, `:64`); o bolso entra como a renda real do grupo contra o esperado (`:237-238`, até ±25), não como efeito da lei no bolso do pop; leis são somadas contra o marco sem teto total (`pontosLeis`, `:182-198`), então a soma da bússola pode passar o bolso (peso maior exigido). Memória: só `pontosMagoas` (ministro demitido, 3 turnos, `governo/index.ts:140-150`) e o marco do turno 0; sem memória de leis do passado. "Nenhuma lei é neutra na bússola" não é exigido: lei sem `bussola` devolve `null` e "não puxa o grupo" (`grupos/index.ts:171-176`); 9 opções das leis de amostra não têm `bussola` (as opções de `deficit.json`, `superavit` etc.).
- Teste: `motor/grupos/grupos.test.ts:55`, `:146` (regra de hoje, grupo).

### [JOGO-1.1-09] O país roda sem ação do jogador
- Veredito: PELA METADE
- Prova: passar turno sem pedido roda todas as etapas (`motor/turno/index.ts:79`, `pedidos: Pedido[] = []`): sorteio de crescimento (`etapas/economia.ts:104` `sortearNormal`), preços e choques do mundo (`etapas/mundo.ts:47-62`), opiniões das potências (`:37-45`), jornal (`etapas/midia.ts`). Não existe empresa que abre: só o fechamento gradual de setor em prejuízo (`motor/mercado/construcoes.ts:66-69`, `TURNOS_ATE_FECHAR = 3`, `FECHAMENTO_POR_TURNO`) e obras de investimento privado. Outros países só mudam a opinião sobre o país (`motor/mundo/index.ts:259` `andarOpinioes`); a posição das potências é fixa no JSON.
- Teste: `partida/partida.test.ts:51` (joga 24 turnos vazios; não prova mudança de índice).

### [JOGO-1.1-10] Obra do Estado é feita pela economia
- Veredito: PELA METADE
- Prova: casas, rede de saneamento e vagas de atendimento disputam o mesmo setor de construção civil: `motor/turno/etapas/obras.ts:21-42` `ritmoDasObras` → `motor/saneamento/index.ts:159-170` `ritmoDoSetor` (`Math.min(1, setor*folga*trabalhoInicial/trabalho)`) com `tamanhoDoSetor` = capacidade pronta do setor ÷ turno 0 (`obras.ts:14-19`). Mas é um ritmo escalar que desacelera, não uma fila por obra do Estado; só moradia, saneamento e atendimento passam por aí. Não há obra genérica (escola, estrada) que entre na fila (`ConstrucoesNoEstado` em `mercado/construcoes.ts:28` é o investimento privado). O pagamento da obra não vira renda do setor.
- Teste: `partida/moradia.test.ts:89`, `partida/saneamento.test.ts`, `partida/atendimento.test.ts` (regra de hoje, só essas três redes).

### [JOGO-1.1-11] Resultado ruim traz a causa
- Veredito: PELA METADE
- Prova: o estado guarda a contribuição de cada lei a cada índice de jogabilidade (`motor/efeitos/index.ts:15-25` `EfeitoEmCurso {lei, indice, de, para, atraso, idade}`), de onde dá para derivar a causa; mas ninguém compara turno a turno nem grava a causa quando o índice piora. A tela recalcula por conta própria quais leis ajudam/atrapalham (`tela/mapa/afetadas.ts`, "Só da tela"). Os tipos `VisaoGrupo.gosta/odeia` (`partida/tiposVisao.ts:277-279`) existem sem produtor (grep). Índices essenciais (PIB, inflação) e renda de pop não têm origem guardada.
- Teste: nenhum da causa.

### [JOGO-1.1-12] Régua numérica na lei
- Veredito: PELA METADE
- Prova: 256 das 511 leis de amostra são `continua` com `faixa` e `passo` (`motor/leis/tipos.ts:100-147`), mas 255 são `opcoes` (7 `escolha`, 56 `niveis` pelos campos `jeito`), e o validador aceita `opcoes` com 2 opções (`motor/leis/validar.ts:344-346` `opcoes.length < 2`). O `passo` não é imposto: `motivoValorInvalido` só confere a faixa (`motor/leis/valor.ts:11-12`); `passo` só é lido em `motor/politica/valores.ts:31` (arredondar o valor cedido) e `motor/programas/direcao.ts:27`.
- Teste: `motor/leis/validar.test.ts` (não conferido linha a linha; valida formato, não regra de régua).

### [JOGO-1.1-13] País real jogável
- Veredito: PELA METADE
- Prova: só um país real existe: `conteudo/paises/` tem `brasil-2026`, `teste` e `teste-pobre`; só o Brasil tem `pessoas.json` e `governo.json`, e `partida/paises.ts:36-39` `paisesJogaveis` exige os dois, então o Brasil é o único jogável. Não há as 10 maiores economias.
- Teste: `partida/setor.test.ts:41`, `partida/visao.test.ts:61` (usam os países de teste).

### [JOGO-1.1-14] Lado do partido sai da chapa
- Veredito: CERTO
- Prova: `partida/comeco.ts:80-88` `centroDoGoverno`: `if (c) return bussolaMedia(fichasDaChapa(c, pessoas));` e `motor/pessoas/ministros.ts:105-118` `bussolaMedia`: `fichas.reduce((soma, f) => soma + (f.bussola[eixo] ?? 0), 0) / fichas.length`, arredondado a 2 casas; o partido novo usa a mesma média (`partida/comeco.ts:104` `defendeDaBussola(bussolaMedia(chapa), grupos)`). O jogador não escolhe lado. (A escala da bússola no código é −1 a +1; o exemplo do requisito usa −2..+3, só o método é o mesmo.)
- Teste: `motor/pessoas/pessoas.test.ts:97` e `partida/comeco.test.ts:106` (regra de hoje; nenhum teste chama `bussolaMedia` direto).

### [JOGO-1.1-15] Promessa por área pesa na eleição
- Veredito: PELA METADE
- Prova: `motor/eleicao/promessa.ts:53-68` `pesoDoGrupo`: o grupo que cobra o índice prometido pesa 2 e os demais 0,25 (`:14-15`), aplicado a `efeitoDaPromessa` em `turno/etapas/eleicao.ts:189-206`. Mas é por grupo (não por pop); a promessa é uma meta de índice ou programa (`PedidoPrometer`), não "focar uma área"; e o efeito só vem do cumprimento (`promessa.ts:42-43` `tamanho*(2*cumprido-1)*EFEITO_MAXIMO`, máximo 6 pontos), avaliado no turno anterior ao fim do mandato (`etapas/eleicao.ts:326`).
- Teste: `partida/partida.test.ts:561`, `:574`, `:612` e `motor/eleicao/eleicao.test.ts:180-228` (regra de hoje).

---

## Parte 1.2

### [JOGO-1.2-01] Ciclo do turno entre as três mecânicas
- Veredito: NÃO SE APLICA
- Prova: requisito-síntese dos 1.2-02 a 1.2-07; cada elo é auditado neles. A ordem das etapas está em `motor/turno/index.ts:54-76`.
- Teste: nenhum.

### [JOGO-1.2-02] Sociedade move a Economia
- Veredito: PELA METADE
- Prova: a renda dos pops é uma fatia fixa do PIB: `motor/populacao/index.ts:121-170` `calcularPops`, `renda_bruta = (parcela_renda * entrada.pib_nominal) / pessoas`. O PIB não nasce do trabalho nem do consumo dos pops: vem de tendência + sorteio e do investimento privado (`etapas/economia.ts:102-150`). O consumo dos pops entra como demanda por produto que mexe no preço (`motor/mercado/demanda.ts:101` `contaDoPais`, chamada em `etapas/jogabilidade.ts:35`). Não há investimento dos pops nem oferta de trabalho.
- Teste: `motor/mercado/demanda.test.ts` (preço e cesta; regra de hoje).

### [JOGO-1.2-03] Economia paga e define preços para a Sociedade
- Veredito: PELA METADE
- Prova: preço sai de demanda, oferta e mundo (`motor/mercado/demanda.ts:54-66` `precoDoPais`). Salário e vaga não são decisão da empresa: `motor/mercado/emprego.ts:181` `empregoDoPais` calcula empregos a partir dos pops do estado (o sentido é contrário ao do requisito), e a renda do pop é `parcela_renda` do PIB. "Empresa contrata 100 e 100 pops passam a ter salário" não existe.
- Teste: `motor/mercado/mercado.test.ts` (regra de hoje, preço/oferta).

### [JOGO-1.2-04] Economia financia o Estado
- Veredito: CERTO
- Prova: `motor/turno/etapas/economia.ts:405-413` `fluxosDoTurno`: `receitaPct = arrecadacao(regras, estado.leis, e) + regras.pais.receita_fora_das_leis + arrecadacaoDasJanelas(...)`, `receita: (receitaPct/100) * pibTurno`; a arrecadação por lei é a alíquota da lei em vigor sobre `pib_nominal * parcela_pib * tamanho` (`:249-282` `arrecadacaoPorLei`, curva em `motor/calculos/renda.ts:23-33`). A receita entra no cofre/dívida em `:443-455` (`contas` → `fecharTurno`). O exemplo "10% de R$ 1 bi dá R$ 100 mi" não vale literalmente: a curva de Laffer e a evasão reduzem (`renda.ts:31-32`); a regra ("na medida das leis de imposto em vigor") é cumprida.
- Teste: `motor/calculos/renda.test.ts`, `motor/contas/contas.test.ts:23-60` (regra de hoje).

### [JOGO-1.2-05] Máquina pública cobra, gasta e regula por lei
- Veredito: PELA METADE
- Prova: cobrar e gastar saem da lei (`etapas/economia.ts:359-376` `gastoPorLei`, só `forma continua` com `conta: "gasto"`). Mas o gasto não "entra na Economia como verba": o dinheiro vira renda só nas leis com `para` (`etapas/populacao.ts:30-57` `transferenciasPorEstrato`); entre as 511 leis de amostra, 74 têm `conta: "gasto"` e só 4 têm `para`. Verba de instituição aumenta o rendimento do órgão (`motor/governo/orgaos.ts:121-123`), não paga ninguém.
- Teste: `motor/governo/governo.test.ts:216` (rendimento; regra de hoje).

### [JOGO-1.2-06] Máquina pública entrega serviço, renda e direito
- Veredito: PELA METADE
- Prova: serviço proporcional à verba existe: `motor/governo/orgaos.ts:121-123` `rendimentoDoOrgao = verba / necessidade` e `:206-217` `rendimentoDasLeis` com teto 1; 50% da verba rende 50% dos efeitos das leis do órgão (`rendimento.test.ts:48`). A renda transferida não passa pelo órgão: `transferenciasPorEstrato` usa o gasto da lei inteiro (menos o corte fiscal), sem o rendimento nem a corrupção. Direito não depende de verba (nenhum código liga lei de `canal: direito` a verba). O exemplo 100%/50% vale só para o efeito sobre índices.
- Teste: `motor/governo/rendimento.test.ts:48`, `:52`, `:56` (regra de hoje).

### [JOGO-1.2-07] Sociedade vota, apoia e protesta
- Veredito: PELA METADE
- Prova: a opinião do grupo vira voto (`motor/eleicao/votos.ts:30-53` `primeiroTurno`, grupo dá ao governo `(satisfacao - desgaste)/100 + ajuste`) e apoio no Congresso (`motor/politica/relacao.ts`, termômetro puxado pela `satisfacaoDoPartido`, `etapas/politica.ts:21-30`). Protesto não existe: `radicais` e `lealistas` são calculados (`motor/grupos/index.ts:249-258`, `:307-308`) e validados (`invariantes.ts:49-52`), mas nenhum módulo os lê (grep). O fato `grupo-com-raiva` está no tipo e ninguém o escreve.
- Teste: `motor/grupos/grupos.test.ts:117` (radicais andam; regra de hoje, sem leitor).

### [JOGO-1.2-08] Opinião do pop (bolso, bússola, memória)
- Veredito: PELA METADE
- Prova: `motor/grupos/index.ts:228-247` `satisfacao`: `pontos = renda (±25) + Σ índices cobrados (±15 cada) + pontosLeis (bússola, ±15 por lei) + mágoa`, 50 + pontos. A conta é do grupo, não do pop; bússola e índices cobrados somados por muitas leis/índices não têm teto conjunto, então o peso "bolso maior, bússola menor" não é garantido; memória = só mágoa de ministro (`:215-225`). O pop tem bússola própria (`deslizarPops`, `:366-408`) mas ela não entra no gosto: quem entra é a bússola fixa do grupo, deslocada pela média do deslize (`gruposComDeslize`, `:318-343`).
- Teste: `motor/grupos/grupos.test.ts:55`, `:88`, `:244-292` (regra de hoje).

### [JOGO-1.2-09] Toda lei chega ao pop por um canal
- Veredito: PELA METADE
- Prova: `canal` é obrigatório e validado (`motor/leis/validar.ts:119-137` `conferirCanal`), mas é só um rótulo que o motor confere contra os campos (`imposto` ↔ `calculo`, `transferencia` ↔ `para`, `verba` ↔ `conta`); o efeito não é aplicado "por esse canal": o único consumo fora da validação é o texto da tela (`partida/visao.ts:143` `COMO_CHEGA`, `:191`). Das 511 leis de amostra, 338 têm `canal: "espera"` (CANAIS inclui "espera", `leis/tipos.ts:44-52`), ou seja, sem canal real. Os canais `preco`, `regra`, `direito` não têm conferência nem leitor genérico.
- Teste: `motor/leis/validar.test.ts` (formato; não conferido o canal linha a linha).

### [JOGO-1.2-10] Origem de cada número sentido
- Veredito: PELA METADE
- Prova: igual a 1.1-11. Há `estado.efeitos` por lei e índice de jogabilidade (`motor/efeitos/index.ts:15-25`), mas não há "origem" entregue por número: nem renda do pop, nem índices essenciais, nem fatos como causa; `partida/visao.ts` não monta origem (só `tela/mapa/afetadas.ts`, cálculo da tela).
- Teste: nenhum.

### [JOGO-1.2-11] Lei não traz quem gosta dela
- Veredito: PELA METADE
- Prova: a lei não tem lista de apoiadores: o tipo `Lei` (`motor/leis/tipos.ts:80-177`) só traz `bussola`, `efeitos`, `calculo`, `para` etc., e o gosto é calculado em `motor/grupos/index.ts:157-179` a partir da posição da lei (bússola) e do grupo. Mas só a bússola entra (não "o que a lei faz no dinheiro e na vida"), e o cálculo é por grupo.
- Teste: `motor/grupos/grupos.test.ts:146` (regra de hoje).

### [JOGO-1.2-12] Módulos funcionam sozinhos
- Veredito: PELA METADE
- Prova: os módulos pesados são opcionais em `Regras` (`motor/turno/regras.ts:56-95`, vários `?`) e as etapas se pulam sem eles (`etapas/mundo.ts:38` `if (!regras.potencias) return estado`; `congresso.ts:115` `if (!regras.congresso)` passa tudo). `calcularPops` é função pura (`populacao/index.ts:121`). Mas população, leis e economia não rodam desligadas entre si: `popsEGrupos` lê leis e economia; `avancarTurno` sempre roda a economia real. Não há opção de turno "só população".
- Teste: `partida/partida.test.ts:387` ("país sem governo.json joga como antes") e `:27` (`semCongresso`) (regra de hoje).

### [JOGO-1.2-13] Organização nasce na partida
- Veredito: FALTA
- Prova: grep `organiza` no `motor/` e `partida/`: nada; o glossário "organização" não tem tipo nem estado (`Estado` em `motor/estado/index.ts` não tem campo).
- Teste: nenhum.

### [JOGO-1.2-14] Mídia só atua sobre fato existente
- Veredito: PELA METADE
- Prova: o jornal só lê fatos que já existem: `motor/midia/jornal.ts:103-114` `jornalDoTurno` filtra `fatos` do turno e ordena por impacto (`:91-97`), sem criar fato. Mas a mídia não "muda como o fato chega ao pop": `credibilidade`, `audiencia`, `bussola` e `dono` das mídias só são validados (`motor/midia/index.ts:34-57`); `fecharJornal` (`:23-29`) mantém a credibilidade e escolhe as 3 maiores notícias. Sem fato no turno, o jornal fica vazio (OK com o aceite).
- Teste: `motor/midia/midia.test.ts:17-64` (regra de hoje, seleção e ordem).

### [JOGO-1.2-15] Mundo pressiona sem fazer parte
- Veredito: PELA METADE
- Prova: preços do mundo andam com choques sorteados e ciclo (`motor/mercado/preco.ts:70-88` `andarChoques`, `:102-122` `andarPrecos` com `PASSO`) e entram no preço interno pela fração importada (`demanda.ts:54-66`); opinião das potências vira reputação e segurança externa (`etapas/mundo.ts:15-35`). O atraso do preço de fora existe (`PASSO`). O efeito na Máquina pública não existe (nenhuma lei nem receita lê o mundo), e não há comércio entre países além do preço.
- Teste: `motor/mundo/mundo.test.ts:133-217`, `motor/mercado/*.test.ts` (regra de hoje).

### [JOGO-1.2-16] Bolsa liga lei, lucro, ação e voto
- Veredito: FALTA
- Prova: grep `acao|ação|dividendo|patrimonio|bolsa` no `motor/` só acha as bases de imposto `patrimonio`, `aplicacoes`, `capital` em `motor/calculos/index.ts:34-60` (alíquotas, sem ativo) e o lucro dos setores (`etapas/economia.ts` `lucroDosSetores`); não existe preço de ação, patrimônio do pop acionista nem reação do pop à ação.
- Teste: nenhum.

### [JOGO-1.2-17] Lei mora numa instituição com ministro
- Veredito: PELA METADE
- Prova: `esfera` é opcional na lei (`motor/leis/tipos.ts:87` `esfera?: string`) e o validador só exige kebab-case se existir (`validar.ts:49-50`); nada confere que a instituição existe (grep `esfera` em `turno/inicio.ts`: nenhum). Lei sem esfera cai em "ninguém" e rende inteira (`governo/orgaos.ts:217` `?? 1`; `ministerios.ts:52`). A instituição ganha ministro pela caixa (`governo/ministerios.ts:45-52` `caixaDaInstituicao`), mas instituições de `poder` ficam sem ministro de propósito (`governo/tipos.ts:28-37`). Nas 511 leis de amostra todas têm `esfera`.
- Teste: `motor/governo/governo.test.ts:142` (regra de hoje).

---

## Parte 1.3

### [JOGO-1.3-01] Todo ato do Estado passa por lei
- Veredito: PELA METADE
- Prova: receita e gasto "fora das leis" são parâmetros fixos do país: `motor/turno/regras.ts:31-34` (`receita_fora_das_leis`, `gasto_fora_das_leis`), somados em `etapas/economia.ts:409` e `:416`. Instituição sem verba em lei e sem necessidade "rende o que rende (1)" (`orgaos.ts:120-123` `necessidade > 0 ? verba/necessidade : 1`), então age sem lei de verba. Verba de lei existente gasta pela lei (`gastoPorLei`).
- Teste: `motor/governo/governo.test.ts:216` (regra de hoje).

### [JOGO-1.3-02] Decisão de governo é bolha de lei
- Veredito: NÃO SE APLICA
- Prova: requisito de tela (bolha no mapa). O motor só fornece a lei como dado (`partida/visao.ts`, sem descer na tela).
- Teste: nenhum.

### [JOGO-1.3-03] Decisão do partido sem painel e papéis na mesa
- Veredito: PELA METADE
- Prova: a mesa só tem sanção/aviso de lei e vaga de tribunal (`motor/mesa/index.ts:8-52`, famílias `leis` e `justica`). Convite de coligação e oferta de ministério existem como fatos (`ministerio-oferecido`, `partido-entrou-na-base`: `motor/governo/index.ts`, `motor/politica/relacao.ts`), mas não chegam como papel na mesa.
- Teste: `motor/mesa/mesa.test.ts:25-79` (regra de hoje, só leis).

### [JOGO-1.3-04] Ato e Operação limitados pelas leis
- Veredito: PELA METADE
- Prova: Ato existe só como `tipo: "ato"` da lei (acontece uma vez, `motor/turno/etapas/congresso.ts:264-270`, conta `usos`; efeito `perdao_da_divida` em `:267-270`) e como pedido `decretar`. Custo e reação: custo apenas o cansaço de decreto (`politica/constantes.ts:39-40`); sem reação do país visitado. Entre as 511 leis de amostra, só `renegociacao-da-divida.json` é `ato`. Operação sobre companhia e Posição por país não existem (grep `operacao|companhia` no `motor/` sem estado correspondente); o clique em país não é estado do motor.
- Teste: `motor/politica/politica.test.ts:540-580` (decreto; regra de hoje).

### [JOGO-1.3-05] Tema vira leis menores
- Veredito: FALTA
- Prova: o molde não recusa lei de controle único: `forca: "forte"` com a régua inteira é aceita (`motor/leis/validar.ts:163-164` só confere o nome da força; `areas-protegidas.json` tem efeito forte em régua). O campo `parte_de` (55 leis de amostra) não é lido por nenhum código (grep `parte_de` só acha JSON).
- Teste: nenhum.

### [JOGO-1.3-06] Lei traz ganhadores, perdedores e consequências
- Veredito: FALTA
- Prova: o tipo `Lei` (`motor/leis/tipos.ts:80-177`) não tem campo de ganhadores/perdedores; eles só emergem do cálculo por grupo (`grupos/index.ts:157-179`). Consequências no tempo existem como `efeitos[].atraso_turnos` (ver 1.3-11), mas não há declaração por pop e nenhuma checagem no validador.
- Teste: nenhum.

### [JOGO-1.3-07] O jogo não fala de lado
- Veredito: NÃO SE APLICA
- Prova: requisito de texto/tela. grep `direita|esquerda` em `tela/` e `partida/` só acha geometria de câmera (`tela/mapa/camera.ts`) e nenhum texto de lado; o `lado` do fato (`motor/fatos/index.ts:59`) é dado de bússola, não texto.
- Teste: nenhum.

### [JOGO-1.3-08] Nenhum dinheiro some
- Veredito: ERRADO
- Prova: do lado do Estado a conta fecha (`motor/contas/index.ts:85-94` `motivoContaNaoFecha`, chamado em `motor/turno/index.ts:99-101`), mas o dinheiro gasto não vira renda de alguém: só as 4 leis com `para` pagam pops (`etapas/populacao.ts:30-57`); as 70 outras leis de verba (74 com `conta: gasto`) saem do cofre e não entram em nenhuma renda (a verba só sobe o `rendimento` do órgão, `orgaos.ts:121`). Corrupção é um número 0 a 100 (`governo/tipos.ts:81`, `orgaos.ts:155-160`), sem dinheiro desviado nem destino. Bases de imposto sem `incide` (consumo, lucro, emissões, terra, bancos: `calculos/index.ts:26-42`) arrecadam sem tirar renda de pop direto. Nenhum código trata o dinheiro ilegal.
- Teste: nenhum da regra (os testes de contas conferem só cofre/dívida, `motor/contas/contas.test.ts:23-60`, regra de hoje, incompleta).

### [JOGO-1.3-09] Corrupção deixa rastro
- Veredito: PELA METADE
- Prova: quando a corrupção do órgão cruza 60, vira fato `escandalo` com a instituição e o ministro (`motor/governo/index.ts:262-270`, `orgaos.ts:22` `LIMITE_DO_ESCANDALO`, `:189-190`). Falta "quem recebeu" e valor desviado: não existem ator receptor nem montante.
- Teste: `motor/governo/governo.test.ts:259` (regra de hoje, só o fato).

### [JOGO-1.3-10] A conta do Estado fecha
- Veredito: PELA METADE
- Prova: o resultado vira cofre ou dívida: `motor/contas/index.ts:60-82` `fecharTurno` (falta paga pelo cofre até onde há, o resto vira dívida) e a invariante `:85-94`, exceto o perdão de dívida por ato (`:91`). Falta a emissão (grep `emiss` só acha a base de imposto `emissoes`), e parte da entrada "por bem do Estado" é um percentual fixo do PIB sem origem (`receita_fora_das_leis`, `regras.ts:31-32`). Cofre negativo é recusado pela invariante (`etapas/invariantes.ts:21` `cofre < 0`), então a dívida tem de absorver.
- Teste: `motor/contas/contas.test.ts:23-60` (regra de hoje).

### [JOGO-1.3-11] Efeito declara quanto tempo leva
- Veredito: CERTO
- Prova: `motor/efeitos/index.ts:28-31` `contribuicao`: `fracao = e.atraso === 0 ? 1 : Math.min(1, e.idade / e.atraso)`; `e.de + (e.para - e.de) * fracao`: anda em linha reta e chega inteiro no fim do atraso, como pede a 1.5 (L365). Conferido pelo Opus em 14/nov; o rascunho do requisito tinha lido "só chega depois".
- Teste: `partida/partida.test.ts:308` (ministro competente adianta; regra de hoje).

### [JOGO-1.3-12] Toda escolha mexe em algo visível
- Veredito: PELA METADE
- Prova: passar o turno sem pedido é válido (`avancarTurno(regras, estado, pedidos = [])`, `motor/turno/index.ts:79-82`) e o turno altera índices pelo sorteio e pelos fatos; não existe fato "esperou" nem checagem de que cada escolha mude um dado. Pedido que cai no Congresso não muda lei nem efeito (`partida/partida.test.ts:27`), mas gera votação visível.
- Teste: `partida/partida.test.ts:27` (regra de hoje).

### [JOGO-1.3-13] Texto e evento leem os números
- Veredito: PELA METADE
- Prova: a manchete é um molde fixo por tipo de fato com ids trocados por nomes: `partida/jornal.ts:42-61` `manchete` (valores: `lei`, `quem`, `caixa`, `area`, `tribunal`, `programa`, `meta`), moldes em `conteudo/mundo/jornal/manchetes.json` ("Congresso aprova {lei}"). Nenhum número do turno entra (queda de PIB, valor do índice). Os fatos nascem de dados (votação, corrupção, eleição), mas o texto não cita valor.
- Teste: `partida/partida.test.ts:462`, `:479` (regra de hoje, só ids e nomes).

### [JOGO-1.3-14] Lei inventada com número plausível
- Veredito: PELA METADE
- Prova: o validador confere formato e limites duros (`validar.ts:189-200` faixa, `:240-244` `arrecada` ≤ 10, fração ≤ 1) e o pedido do jogador é recusado fora da faixa (`valor.ts:11-12`); não há conferência de ordem de grandeza do país. O aceite "15.000% recusado" funciona só por a faixa de fração ter `max ≤ 1` (`validar.ts:195-196`).
- Teste: `motor/leis/validar.test.ts` (regra de hoje, formato).

### [JOGO-1.3-15] Motor sem nomes
- Veredito: CERTO
- Prova: grep dos 511 ids de lei entre aspas em `motor/**/*.ts` (fora de testes): nenhum achado; grep de `brasil` no motor: nenhum. Os ids que o motor precisa chegam como dado: `Regras.indiceReputacao`, `fisco.regra_fiscal.lei_teto_gasto` (`turno/regras.ts`, `etapas/economia.ts:498`), `congresso.leis.quorum` (`politica/sessao.ts:50`), `governo.leis.cargos`. Ressalvas (estrutura, não nome de lei): `ESTRATOS = ["pobre","medio","rico"]` (`populacao/index.ts:6`), `"tecnico"` (`governo/index.ts:43`), `camara/senado`, os 16 índices essenciais (`estado/index.ts:25-42`) e as bases de imposto (`calculos/index.ts:26-60`) são fixos no motor.
- Teste: `partida/setor.test.ts:41` e `partida/visao.test.ts:61` jogam países de teste (regra de hoje).

### [JOGO-1.3-16] Congresso barra só o exorbitante
- Veredito: ERRADO
- Prova: o Congresso barra toda lei sem maioria, não só a exorbitante: `motor/politica/pauta.ts:122-123` `if (!v.aprovada) return ... negar(s, v)` e `sessao.ts:174-185` `barrar` (2 turnos, `constantes.ts:42`); e repropor a barrada é recusado com erro (`pauta.ts:28-30` `falha(... só volta no turno ...)`). `exorbitante` é só uma marca (`voto.ts:256` `!aprovada && passa(sem.sim, sem.total)`: reprovou por causa da conta e passaria sem ela), lida só pela tela (`tela/mapa/PlacarDaLei.tsx:85`). Nada garante "aprovar não trava o jogo".
- Teste: `motor/politica/politica.test.ts:115`, `:130`, `:362` (regra de hoje do código; contradiz o princípio 11).

### [JOGO-1.3-17] Pessoa age pela ficha e pelo país
- Veredito: PELA METADE
- Prova: igual a 1.1-06: duas fichas diferentes dão efeito e corrupção diferentes na mesma crise (`ministerios.ts:82-85`, `orgaos.ts:155-160`), em função da verba/estado do órgão (`orgaos.ts:150-160`), sem roteiro escrito. Só competência e honestidade agem; lealdade, habilidade e carisma não.
- Teste: `motor/governo/governo.test.ts:128`, `:232` (regra de hoje).

### [JOGO-1.3-18] Toda lei chega ao pop
- Veredito: PELA METADE
- Prova: o validador recusa lei sem canal declarado (`validar.ts:120-121` `canal precisa ser ...`), mas aceita `"espera"` (`:122-126`) e 338 das 511 leis de amostra estão em `espera` (`jeito` ausente em 320). O canal não é verificado contra um caminho real até o pop.
- Teste: `motor/leis/validar.test.ts` (regra de hoje, formato).

### [JOGO-1.3-19] O resultado emerge do estado do país
- Veredito: PELA METADE
- Prova: o tipo `Lei` não tem condição escrita ("se pobreza > X"): nenhum campo de condição em `leis/tipos.ts` nem nas 511 leis de amostra. Mas o efeito sobre índices tem `sentido` fixo e intensidade linear na faixa (`motor/leis/valor.ts:28-38` `efeitosDoValor`), então a mesma lei não muda de sentido pelo estado. O que emerge: transferência e imposto dependem de PIB e pesos (`populacao.ts:30-57`, `populacao/index.ts:150-165`) e a corrupção, da verba contra a necessidade.
- Teste: nenhum.

### [JOGO-1.3-20] Lei vai de nada a mais num lado só
- Veredito: PELA METADE
- Prova: a régua parte do mínimo = "nada" (`leis/valor.ts:20-22` `valorDesligado`; `leis/colisao.ts:58-62` `leiAtiva`), mas a `bussola` da lei tem `min` e `max` livres de −1 a +1 (`validar.ts:140-147`) e a opção pode ficar do outro lado; não há conferência de "lado só" nem de lados equilibrados (conteúdo).
- Teste: nenhum.

### [JOGO-1.3-21] Texto da lei para leigo
- Veredito: NÃO SE APLICA
- Prova: conteúdo e texto (`nome`, `descricao`, `rotulo` nas leis; o motor não os valida nem lê: `partida/visao.ts:174-248` só os repassa).
- Teste: nenhum.

### [JOGO-1.3-22] Cada decisão tem consequência própria
- Veredito: PELA METADE
- Prova: cada lei tem efeitos próprios por índice (`EfeitoEmCurso.lei/indice`, `motor/efeitos/index.ts:15-25`) e sem traço de personalidade, mas a "origem do número" não é entregue (1.2-10) e decisões que não são lei (Ato/Operação) quase não existem (1.3-04).
- Teste: nenhum.

### [JOGO-1.3-23] Sem pontos de ação
- Veredito: PELA METADE
- Prova: a fila por carga existe: `motor/politica/pauta.ts:96-105` `votarPauta` (`usada[casa] >= carga ? [t]`), `constantes.ts:45` `CARGA_PADRAO = 3`; lei que não coube espera e a casa se cansa (`constantes.ts:35-38`). Mas o motor proíbe em outros pontos: lei derrotada não pode ser reproposta por 2 turnos (`pauta.ts:28-30`), lei que colide com outra é recusada (`etapas/congresso.ts:107-112` `throw new Error("pedido: ... colide com ...")`), e a regra fiscal barra pedidos (`:62-88`).
- Teste: `motor/politica/politica.test.ts:362`, `:380`, `:392` (regra de hoje do código).

---

## Contagem

- CERTO: 4 (1.1-14, 1.2-04, 1.3-11, 1.3-15)
- ERRADO: 2 (1.3-08, 1.3-16)
- PELA METADE: 37
- VELHO: 0
- DUPLICADO: 0
- FALTA: 8 (1.1-02, 1.1-03, 1.1-04, 1.1-05, 1.2-13, 1.2-16, 1.3-05, 1.3-06)
- NÃO SE APLICA: 4 (1.2-01, 1.3-02, 1.3-07, 1.3-21)
- Total: 55

## Código sem dono

- `motor/eleicao/index.ts:76-102` `apurar`: ninguém chama no jogo; só o teste (`motor/eleicao/eleicao.test.ts:62`, `:70`). Segue a regra antiga (uma rodada, `apoio = satisfação média − desgaste`, `venceu: apoio > 50`). É de uma versão antiga.
- `motor/grupos/index.ts` campos `radicais` e `lealistas` (`:32-34`, `:249-258`, `:307-308`): vivo (recalculado todo turno, validado em `invariantes.ts:49-52`) mas sem leitor e sem regra no GDD.
- Mídia: `credibilidade`, `audiencia`, `bussola`, `dono` (`motor/midia/tipos.ts:122-132`) só validados em `midia/index.ts:34-57`; `credibilidade` guardada e nunca usada. Vivo, sem regra aplicada.
- `Ficha.lealdade`, `habilidade`, `carisma`, `idade` (`motor/governo/tipos.ts:9-23`): só validação e tela; `idade` só vale para juiz (`judiciario/index.ts:416`, `:604`). Sem regra no motor.
- Tipos de fato sem escritor: `manchete-contra`, `grupo-com-raiva` (`motor/fatos/index.ts:37-40`); `manchete-contra` só é lido (`politica/voto.ts:167`, `midia/jornal.ts:75`).
- `partida/tiposVisao.ts:277-279` `VisaoGrupo.gosta/odeia` e `VisaoMotivo` (`:254-261`): tipos sem produtor, de uma versão antiga (a mesma pasta traz "SG106", "V1-08", dilemas).
- Campos das leis `parte_de` e `origem`: nenhum leitor (ver Campos das leis).
- Estado `anteriores` e `mudanca` (`motor/estado/index.ts`): vivos, lidos pela tela (`partida/visao.ts:478-482`), mas sem regra de histórico no GDD (1.1-02 pede outra coisa).

## Duplicados

- Aprovação média dos grupos pesada pelas pessoas: `motor/eleicao/index.ts:66-74` `satisfacaoMedia` e `motor/politica/voto.ts:113-121` `aprovacao` (idênticas, uma sem guarda de zero). Em uso: as duas (a primeira pela tela `tela/mapa/Eleicao.tsx:89` e `partida/index.ts:436`, a segunda pelo voto do Congresso). A eleição de verdade usa outra conta (`motor/eleicao/votos.ts`), então a "aprovação" que a tela mostra não é o número que decide a eleição.
- Distância na bússola em três lugares: `motor/pessoas/ministros.ts:96-102` `distanciaNaBussola` (normalizada), `motor/grupos/index.ts:201-213` `parecenca` (média por eixo com peso) e `motor/pessoas/partido.ts:20-29` (distância própria em `defendeDaBussola`). Em uso: as três, cada uma num cálculo.
- Eleição: `apurar` (morta, antiga) contra `primeiroTurno/segundoTurno` + `etapas/eleicao.ts:246-283` `resultado` (em uso).
- Constante `TECNICO = "tecnico"` repetida em `motor/governo/index.ts:43` e `motor/governo/ministerios.ts:18`.
- `limitar`/`prender`/`entre` redefinidos por módulo (`politica/constantes.ts:3`, `grupos/index.ts:82`, `eleicao/votos.ts:14`, `eleicao/promessa.ts:17`, `invariantes.ts:15`).

## Campos das leis

Amostra (`conteudo/mundo/leis/`, 511 arquivos): `abertura-de-empresa.json` e outras 337 em `canal: espera/triagem`; `contribuicao-previdenciaria.json` (`calculo`, imposto); `auxilio-para-pessoas-com-deficiencia.json` e `pensao-para-idosos-pobres.json` (`para`, transferência); `aposentadoria-dos-servidores.json` (`escala_gasto`); `anistia-fiscal.json` (`tipo: prazo`, `prazo_turnos`, `arrecada`); `renegociacao-da-divida.json` (`tipo: ato`); `duracao-mandato.json` (`classe: mandato`, `mandato_anos` nas opções); `deficit.json` (`deficit_do_cofre`; as 3 opções sem `bussola`); `areas-protegidas.json` (efeito `forte`).

Campos que o motor usa:
- `versao`, `id`, `camada`, `forma` (tipos e validador, `leis/validar.ts:37-53`).
- `classe` (quórum, `politica/voto.ts:94-99`), `esfera` (instituição, `governo/orgaos.ts:217`), `canal` (só validação e rótulo de tela), `jeito` (só validação, `validar.ts:84-116`), `tipo` e `prazo_turnos` (`etapas/congresso.ts:229-277`).
- `faixa` (`valor.ts`), `unidade`, `rotulo_unidade` (validação e tela), `bussola` (lei e opção, `grupos/index.ts:136-151`), `efeitos` (`efeitos/index.ts:33-45`), `calculo` (`etapas/economia.ts:249-282`), `conta` (`:359-376`), `para` (`etapas/populacao.ts:30-57`), `encolhe` (`economia.ts` `fatorDaBase`), `escala_gasto` (`:339-358`), `arrecada` (`:391-405`), opção `valores`, `mandato_anos` (`eleicao/index.ts:52-63`), `deficit_do_cofre`, `superavit_ao_cofre` (`contas/index.ts:38-53`).

Campos presentes e ignorados pelo motor:
- `passo`: validado `> 0` (`validar.ts:199`) mas o valor do pedido não é conferido contra o passo (`valor.ts:11-12`); só arredonda o valor cedido (`politica/valores.ts:31`) e a direção dos programas (`programas/direcao.ts:27`).
- `espera`: só validação (`validar.ts:122-126`).
- `parte_de` (55 leis), `origem` (438 leis): nenhum leitor; fora do tipo `Lei` e do validador.
- `nome`, `descricao`, `rotulo` das opções: fora do tipo `Lei`; lidos só pela tela (`partida/visao.ts:174-248`).

Campos que o motor espera e as leis de amostra não têm:
- `esfera` é opcional no tipo mas toda lei precisa dele para render; todas as 511 têm.
- `jeito` é obrigatório "depois da triagem" (`validar.ts:56-58`, `:86-88`): 320 das 511 não têm (todas em `canal: espera/triagem`, isentas).
- `bussola` nas opções: 9 opções sem `bussola` (as das leis de contas como `deficit.json`) devolvem posição nula (`grupos/index.ts:150`); o requisito 1.1-08 pede que nenhuma lei seja neutra.
- Campos que o GDD pede e o motor não tem: ganhadores/perdedores (1.3-06), origem do efeito por canal (1.2-09), valor desviado/receptor da corrupção (1.3-08, 1.3-09).
