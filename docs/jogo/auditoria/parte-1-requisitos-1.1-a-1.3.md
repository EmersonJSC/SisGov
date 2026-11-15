# P1-L01 — Requisitos da Parte 1 (JOGO): 1.1, 1.2, 1.3

Fonte: `gdd.md` L120–L273 (números de linha dos arquivos de seção, relidos).

---

## 1.1-visao.md

### Parte A: extração

**1. ENTIDADES**

| Nome | O que guarda | Linha |
| --- | --- | --- |
| Partido do jogador | quem joga; sobrevive a presidentes, ministros e candidatos enquanto vencer | L124, L136 |
| Pessoa com ficha | erra, brilha, trai, morre | L129 |
| Lei | regra do governo; tem bolha no mapa; tem régua com número | L133, L146 |
| Histórico do governo | PIB, Segurança, Saúde e outros números; o que melhorou; o que foi mais atacado; pops que mais gostaram e que mais odiaram | L153 |
| Resumão | resumo de tudo, a cada 4 anos | L153 |
| Placar final | o histórico inteiro | L153 |
| País jogável | as 10 maiores economias (reais) | L154 |
| Bússola | eixos economia (esquerda/direita) e costumes (libertário/tradicional); todo pop e toda lei têm posição | L132 |
| Opinião/gosto | bolso + bússola + memória | L132 |

**2. REGRAS**

| Quando acontece | O que muda | Quanto | Linha |
| --- | --- | --- | --- |
| O partido perde o poder federal | a partida acaba | não diz | L151 |
| O vice de outro partido assume | a partida também acaba (ver 5.2) | não diz | L152 |
| Passa o turno | o histórico do governo recebe os números do turno | não diz | L153 |
| De 4 em 4 anos | aparece o resumão do histórico | 4 anos | L153 |
| Fim da partida | o placar final é o histórico inteiro | não diz | L153 |
| Lei é proposta | passa por Congresso, mídia, grupos e cofre; mídia e grupos decidem em conjunto, o Congresso é a "voz" dos grupos | não diz | L128 |
| Aprovar lei e medida provisória | não pode ser tão difícil que o jogador não jogue | não diz | L128 |
| Lei é avaliada por um pop | gosto vem do bolso (mais forte), da bússola e da memória; nenhuma lei é neutra na bússola | não diz peso | L132 |
| O que agrada hoje | cobra depois (contabilidade, economia ou urna) | não diz | L130 |
| Passa o turno sem ação do jogador | empresas abrem e fecham, a mídia escolhe lado, outros países mudam de ideia | não diz | L131 |
| Muda o presidente, ministro ou candidato | o partido continua | não diz | L136 |
| Governo age | por leis; o Estado pode comprar empresas e ações e financiar obras; quem constrói é a economia | não diz | L137 |
| Dá errado | o jogador entende por quê, nunca parece azar | não diz | L141 |
| Chapa montada | o lado político do partido sai das pessoas da chapa | não diz | L156 |
| Jogador escolhe país | países reais podem entrar; empresa, pessoa e direito autoral reais ficam de fora | 10 economias | L154 |
| Campanha | quem foca numa área (ex.: segurança) pode ganhar a eleição nessa promessa | não diz | L147 |

**3. NÚMEROS**

| Valor | A que se refere | Linha |
| --- | --- | --- |
| 4 anos | intervalo do resumão | L153 |
| 10 | maiores economias jogáveis | L154 |
| cerca de 40 | leis do núcleo que o autor recusou cortar | L147 |

**4. LIGAÇÕES**

| O que esta seção lê ou altera em outra | Linha |
| --- | --- |
| Lê Congresso, mídia, grupos e cofre para passar lei (Política, Mídia, Economia) | L128 |
| Lê pessoas com ficha (Política/Pessoas) | L129 |
| Lê Sociedade (opinião: bolso, bússola, memória) | L132 |
| Lê Máquina pública (instituições, ministros, verbas, leis) | L138 |
| Lê Mundo e Mídia (o país vive sozinho) | L131 |
| Lê Economia (empresas, obras, ações do Estado) | L137 |
| Lê a Política (eleição, promessa por área; sucessão pelo vice, 5.2) | L147, L152 |
| Lê chapa/partido (lado do partido) | L156 |
| Lê Narrativas (V1 com gatilhos) | L155 |
| Chega às demais partes pelos princípios (1.3) e pelo ciclo (1.2) | L160 |

**5. BURACOS**

| O que falta dizer | Linha |
| --- | --- |
| Peso exato de bolso, bússola e memória na opinião | L132 |
| O que é "perder o poder federal" em coligação, ou com derrota por 0 votos de diferença | L151 |
| Com que frequência o histórico é gravado (por turno?) e por quanto tempo é guardado | L153 |
| Como se mede "o que foi mais atacado" e "o que melhorou" | L153 |
| Se o resumão cobre só o mandato ou o histórico inteiro | L153 |
| Quais são as 10 maiores economias e qual critério (PIB nominal? ano?) | L154 |
| Fórmula do voto entre Congresso, mídia e grupos | L128 |
| O que acontece com a partida se o presidente morre no meio do mandato e o vice é do mesmo partido | L136, L152 |
| O que a pessoa morta deixa (vaga, cargo, ministério sem titular) | L129 |
| Como a promessa por área pesa no voto e quanto | L147 |
| Que dado explica o resultado ruim para "não parecer azar" | L141 |
| Se obra financiada pelo Estado pode atrasar ou parar por falta de construção civil | L137 |

### Parte B: requisitos

### [JOGO-1.1-01] Fim da partida pela perda do poder federal
- R antigo: R4.4
- GDD: L151–L152
- Regra: Quando o partido do jogador deixa de ocupar o poder federal, inclusive quando o vice de outro partido assume a Presidência, o motor encerra a partida e abre o placar final.
- Entra: situação do poder federal (quem ocupa a Presidência) após cada eleição ou sucessão
- Sai: estado da partida "encerrada" e o fato do turno "partido perdeu o poder"
- Aceite: Brasil-2026, o partido do jogador perde a eleição do turno 24 (exemplo); a partida acaba e o histórico fica fechado.
- Extremos: com 0 de diferença de votos, [ABERTO: regra de desempate]; com vitória, a partida segue; vice de outro partido assumindo por morte no turno 10 (exemplo) encerra a partida (L152); sucessão no meio do turno vale no fim do turno [ABERTO: confirmar].
- Depende de: JOGO-1.1-02

### [JOGO-1.1-02] Histórico do governo gravado a cada turno
- R antigo: R4.7
- GDD: L153–L153
- Regra: Ao fim de cada turno, o motor grava no histórico do governo o valor de cada índice, o que melhorou, o que foi mais atacado, e os pops que mais gostaram e que mais odiaram.
- Entra: índices do turno, valores do turno anterior, opinião por pop, críticas da mídia
- Sai: uma linha de histórico por turno
- Aceite: no turno 1 do Brasil-2026, o histórico tem 1 linha com o PIB inicial (exemplo); ao fim do turno 24, tem 24 linhas.
- Extremos: com índice 0, grava 0; com índice no máximo, grava o máximo; sem nenhum pop com opinião a favor, o campo "mais gostaram" fica vazio [ABERTO: valor de "vazio"].
- Depende de: nenhum

### [JOGO-1.1-03] Resumão a cada 4 anos
- R antigo: R4.7
- GDD: L153–L153
- Regra: A cada 4 anos de partida (24 turnos), o motor monta o resumão do histórico e o entrega como dado à tela.
- Entra: histórico do governo dos últimos 24 turnos
- Sai: o resumão (índices, melhorou, mais atacado, pops que mais gostaram e que mais odiaram)
- Aceite: no turno 24 aparece o resumão do mandato; no turno 48, o segundo [ABERTO: se cobre só os turnos 25 a 48 ou o histórico inteiro].
- Extremos: com a partida acabando antes de 4 anos, [ABERTO: se há resumão parcial]; com mandato de duração diferente de 4 anos, [ABERTO: se o intervalo segue o mandato]; sem dado de algum índice, o item fica sem valor.
- Depende de: JOGO-1.1-02

### [JOGO-1.1-04] Placar final é o histórico inteiro
- R antigo: R4.7
- GDD: L153–L153
- Regra: Ao fim da partida, o motor entrega como placar final o histórico completo do governo, sem nota única.
- Entra: histórico do governo, motivo do fim da partida
- Sai: o placar final (histórico inteiro e motivo do fim)
- Aceite: partida do Brasil-2026 encerrada no turno 30 entrega as 30 linhas de histórico e o motivo "perdeu o poder federal" (exemplo).
- Extremos: partida encerrada no turno 1, o placar tem 1 linha; partida no máximo de turnos, o placar tem todos; [ABERTO: tempo máximo da partida].
- Depende de: JOGO-1.1-02, JOGO-1.1-01

### [JOGO-1.1-05] Partido continua quando muda a pessoa
- R antigo: novo
- GDD: L136–L136
- Regra: Quando o presidente, um ministro ou um candidato deixa o cargo, o partido do jogador segue como o jogador e a partida continua enquanto ele ocupar o poder federal.
- Entra: troca de ocupante de cargo; situação do poder federal
- Sai: o cargo preenchido por outra pessoa; o fato do turno "troca de presidente" ou "troca de ministro"
- Aceite: presidente do partido morre no turno 10 (exemplo); o vice do mesmo partido assume e o jogador continua com o mesmo partido.
- Extremos: com 0 pessoas disponíveis para o cargo, [ABERTO: regra de vaga]; no máximo de trocas num turno, todas se aplicam em ordem [ABERTO: ordem]; troca no meio do turno vale no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.1-01

### [JOGO-1.1-06] Ficha da pessoa decide o que ela faz
- R antigo: novo
- GDD: L129–L129
- Regra: Quando uma pessoa do partido age (erra, brilha, trai ou morre), o motor decide pela ficha dela e pelo estado do país.
- Entra: ficha da pessoa, estado do país
- Sai: o evento da pessoa como fato do turno
- Aceite: ministro de ficha com lealdade baixa [ABERTO: nome do campo] pode trair; com a mesma ficha em outro estado do país, a chance muda (exemplo).
- Extremos: com ficha toda em 0, [ABERTO: o que faz]; com ficha no máximo, [ABERTO: se ainda erra]; morte no meio do turno aplica o efeito no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.3-17

### [JOGO-1.1-07] Voto da lei conjunto de mídia e grupos
- R antigo: R12 (Congresso), sem número preciso
- GDD: L128–L128
- Regra: Quando uma lei vai a voto, o resultado sai de grupos e mídia juntos, com o Congresso como voz dos grupos, e o jogo não deixa a aprovação difícil a ponto de travar o jogador.
- Entra: apoio dos grupos, posição da mídia, cadeiras do Congresso
- Sai: lei aprovada ou derrubada, como fato do turno
- Aceite: lei com apoio de grupos que somam 60% das cadeiras (exemplo) é aprovada no Brasil-2026.
- Extremos: com apoio 0, a lei é derrubada; com apoio no máximo, passa; [ABERTO: valor mínimo de aprovação]; revogação no meio do turno cancela o voto [ABERTO: confirmar].
- Depende de: JOGO-1.3-16

### [JOGO-1.1-08] Gosto da lei por bolso, bússola e memória
- R antigo: novo
- GDD: L132–L132
- Regra: Quando um pop avalia uma lei, o gosto sai do efeito dela no bolso do pop (peso maior), da distância na bússola e da memória, e nenhuma lei é neutra na bússola.
- Entra: efeito da lei na renda do pop, posição do pop e da lei na bússola, memória do pop
- Sai: opinião do pop sobre a lei
- Aceite: pop pobre de posição de esquerda (exemplo) ganha renda com a lei e aprova mesmo que a lei esteja do lado da direita.
- Extremos: com efeito no bolso 0, o gosto vem só da bússola e da memória; com efeito no máximo, vence [ABERTO: pesos de bolso, bússola e memória]; revogação no meio do turno faz a memória guardar a lei [ABERTO: quanto].
- Depende de: JOGO-1.2-08

### [JOGO-1.1-09] O país roda sem ação do jogador
- R antigo: novo
- GDD: L131–L131
- Regra: Quando o jogador passa o turno sem propor nada, o motor ainda abre e fecha empresas, a mídia reage e os outros países mudam de posição.
- Entra: estado de empresas, mídias e países de fora
- Sai: fatos do turno de empresa aberta ou fechada, manchete, mudança de posição do país
- Aceite: no Brasil-2026, passar 1 turno sem ação muda ao menos 1 índice ou fato (exemplo).
- Extremos: com 0 empresas, nada abre ou fecha; com no máximo de empresas, [ABERTO: teto de aberturas por turno]; sem lei nenhuma em vigor, ainda ocorrem fatos.
- Depende de: JOGO-1.2-01

### [JOGO-1.1-10] Obra do Estado é feita pela economia
- R antigo: novo
- GDD: L137–L137
- Regra: Quando o Estado financia uma obra, o prédio só é construído pela construção civil da economia, nunca pelo Estado direto.
- Entra: verba da obra, capacidade da construção civil
- Sai: obra na fila da construção civil; prédio pronto como fato do turno
- Aceite: o Estado financia uma escola; ela entra na fila da construção civil e sai pronta quando a fila anda [ABERTO: tempo].
- Extremos: com capacidade da construção civil 0, a obra fica na fila; com verba 0, a obra não entra; revogar a verba no meio do turno [ABERTO: o que acontece com o que já foi gasto].
- Depende de: JOGO-1.2-03

### [JOGO-1.1-11] Resultado ruim traz a causa
- R antigo: novo
- GDD: L141–L141
- Regra: Quando um índice piora, o motor guarda junto a causa (lei, fato ou índice que empurrou), para a tela mostrar por quê.
- Entra: variação do índice, lista de efeitos e fatos que agiram
- Sai: a causa principal gravada junto à variação
- Aceite: a Segurança cai 3 pontos (exemplo) e a causa gravada é a lei com o maior efeito negativo naquele turno.
- Extremos: com variação 0, sem causa; com queda causada só por evento de fora, a causa é o fato de fora; [ABERTO: quantas causas se guardam].
- Depende de: JOGO-1.2-10

### [JOGO-1.1-12] Régua numérica na lei
- R antigo: R7.1
- GDD: L146–L146
- Regra: Toda lei com valor é entregue ao jogador como régua com número, e não como duas ou três opções em palavras.
- Entra: definição da lei (régua com mínimo, máximo, unidade)
- Sai: o valor escolhido pelo jogador gravado na lei
- Aceite: lei de limite (exemplo) aceita qualquer valor entre o mínimo e o máximo, em passos finos [ABERTO: tamanho do passo].
- Extremos: no mínimo, é como "nada"; no máximo, o teto da régua; revogar volta à lei "não legislada" (R7.8).
- Depende de: JOGO-1.3-05

### [JOGO-1.1-13] País real jogável
- R antigo: R4.3
- GDD: L154–L154
- Regra: Quando o jogador escolhe o país, o motor oferece as 10 maiores economias, com empresas, pessoas e direitos autorais reais de fora.
- Entra: lista de países declarados, estado inicial de cada país
- Sai: país da partida, com estado inicial e rótulos locais
- Aceite: Brasil-2026 aparece na lista com seus índices de partida e companhias inventadas.
- Extremos: com 0 países declarados, a partida não começa; com 10 países, todos aparecem; [ABERTO: critério de "maiores economias"].
- Depende de: JOGO-1.3-15

### [JOGO-1.1-14] Lado do partido sai da chapa
- R antigo: R4.8
- GDD: L156–L156
- Regra: Quando a chapa é montada, o motor calcula o lado do partido pela média da bússola das pessoas da chapa, sem o jogador escolher lado.
- Entra: bússola de cada pessoa da chapa
- Sai: bússola do partido
- Aceite: chapa com duas pessoas de bússola (-2, +1) e (0, +3) (exemplo) dá o partido em (-1, +2).
- Extremos: com 0 pessoas na chapa, [ABERTO: valor]; com todas no extremo, o partido fica no extremo; trocar uma pessoa no meio do turno recalcula no fim do turno [ABERTO: confirmar].
- Depende de: JOGO-1.3-07

### [JOGO-1.1-15] Promessa por área pesa na eleição
- R antigo: novo
- GDD: L147–L147
- Regra: Quando o jogador foca uma área na campanha, os pops que priorizam essa área pesam mais na intenção de voto dele.
- Entra: área escolhida na campanha, prioridade de cada pop, desempenho do índice da área
- Sai: intenção de voto por pop
- Aceite: partido foca Segurança (exemplo) e o índice sobe; os pops que priorizam Segurança aumentam o apoio.
- Extremos: com a área em 0 de resultado, a promessa fere o apoio [ABERTO: quanto]; com o índice no máximo, o efeito para; sem foco, vale a opinião geral.
- Depende de: JOGO-1.1-08

---

## 1.2-as-3-mecanicas.md

### Parte A: extração

**1. ENTIDADES**

| Nome | O que guarda | Linha |
| --- | --- | --- |
| Sociedade | os pops, sociedade viva que reage ao setor público; a Opinião é uma peça | L182, L207 |
| Opinião | bolso (mais forte) + bússola (peso menor) + memória | L207 |
| Economia | empresas, pops que trabalham, dinheiro, preços, bolsa, contas do Estado | L183, L208 |
| Máquina pública | leis, instituições, ministros, caixas, fronteira do governo | L184, L197 |
| Política | Congresso, partidos, grupos, eleição, presidente, vice, sucessão, pessoas, governadores | L193, L199 |
| Mundo | outros países, comércio, preços de fora | L194 |
| Mídia | lente sobre fatos existentes | L195 |
| Pop, grupo, organização | camadas diferentes; organização nasce na partida | L220 |
| Instituição | onde a lei mora; fica com um ministro | L197 |

**2. REGRAS**

| Quando acontece | O que muda | Quanto | Linha |
| --- | --- | --- | --- |
| Sociedade age | manda demandas e apoio à Máquina pública | não diz | L186 |
| Máquina pública converte | demandas em leis e serviços | não diz | L187 |
| Lei sai | volta para Sociedade e Economia | não diz | L188 |
| Reação da Sociedade | vira nova entrada | não diz | L189 |
| Sociedade trabalha, consome, investe | afeta a Economia | não diz | L226 |
| Economia paga salário, dá emprego, define preços | afeta a Sociedade | não diz | L227 |
| Economia gera dinheiro dos impostos | alimenta a Máquina pública | não diz | L228 |
| Máquina pública cobra, gasta e regula por lei | afeta a Economia | não diz | L229 |
| Máquina pública dá serviços, renda, direitos | afeta a Sociedade | não diz | L230 |
| Sociedade vota, apoia, protesta | afeta a Máquina pública | não diz | L231 |
| Mundo pressiona | as três mecânicas, sem fazer parte delas | não diz | L194 |
| Mídia atua | só em cima de fatos existentes; não cria fato novo | não diz | L195 |
| Toda lei existe | chega ao pop por renda, emprego, preço, serviço ou direito | não diz | L214 |
| Lei é escrita | não diz quem gosta; diz onde mexe no dinheiro e na vida; o gosto nasce daí | não diz | L215 |
| Bússola | tem peso menor que o bolso; todo ator do ciclo tem posição na bússola | não diz | L215 |
| Qualquer real gasto ou cobrado | vira renda de alguém, circula, fica guardado ou sai do país | não diz | L216 |
| Número sentido pelo jogador | mostra de onde veio ao passar o mouse | não diz | L217 |
| Módulo roda | população, leis e economia funcionam sozinhos; ligações vêm no conteúdo das leis | não diz | L219 |
| Organização | nasce durante a partida | não diz | L220 |
| Lei muda lucro | a ação muda; o patrimônio dos pops muda; pops reagem no voto e no investimento | não diz | L211 |
| Lei mora | numa instituição, que fica com um ministro | não diz | L197 |

**3. NÚMEROS**

| Valor | A que se refere | Linha |
| --- | --- | --- |
| 3 | mecânicas principais | L181 |
| 6 | ligações do ciclo (tabela) | L226–L231 |

**4. LIGAÇÕES**

| O que esta seção lê ou altera em outra | Linha |
| --- | --- |
| Liga Sociedade (Parte 2), Economia (Parte 3), Máquina pública (Parte 4) | L181–L184 |
| Liga Política (Parte 5) como caminho de controle | L193 |
| Liga Mundo (Parte 7) como ambiente de fora | L194 |
| Liga Mídia (Parte 6) como lente | L195 |
| Contas do Estado ficam na Economia (Parte 3) | L198 |
| Presidente, vice, sucessão, pessoas, governadores ficam na Política (Parte 5) | L199 |
| SisGovpedia / tela (Parte 8) recebe a origem de cada número | L217 |
| Bolsa: lucro → ação → patrimônio dos pops → voto e investimento | L211 |

**5. BURACOS**

| O que falta dizer | Linha |
| --- | --- |
| Peso exato de bolso, bússola e memória | L207, L215 |
| Quanto cada ligação do ciclo transmite por turno (valor, atraso) | L226–L231 |
| Ordem de cálculo das três mecânicas no turno | L186–L189 |
| O que é "dinheiro que sai do país" e para onde vai | L216 |
| Como a renda do pop sai de salário e lucro sem mudar o turno 0 (em aberto) | L244 |
| Quanto falta de trabalhador freia a produção (em aberto) | L244 |
| O que a origem do número inclui (cadeia completa? só a causa maior?) | L217 |
| Valor de entrada ausente quando um módulo roda sozinho | L219 |
| Como uma organização nasce: gatilho e quantidade | L220 |
| Duas leis no mesmo alvo do ciclo | L214 |
| Revogar lei no meio do ciclo: o que volta à Sociedade | L188 |

### Parte B: requisitos

### [JOGO-1.2-01] Ciclo do turno entre as três mecânicas
- R antigo: novo
- GDD: L186–L189
- Regra: Em cada turno, a Sociedade manda apoio e demanda à Máquina pública, a Máquina pública devolve leis e serviços, e a reação da Sociedade vira entrada do turno seguinte.
- Entra: apoio e demanda dos pops; leis em vigor; serviços prestados
- Sai: reação dos pops gravada para o turno seguinte
- Aceite: Brasil-2026, turno 1 com uma lei nova de renda (exemplo); no turno 2 a opinião dos pops beneficiados já reflete a lei.
- Extremos: com 0 leis novas, a reação vem só dos serviços; com todas as leis em vigor, o ciclo segue sem travar; lei revogada no meio do turno gera reação no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.2-07, JOGO-1.2-08

### [JOGO-1.2-02] Sociedade move a Economia
- R antigo: novo
- GDD: L226–L226
- Regra: Ao fim do turno, os pops trabalham, consomem e investem, e isso entra como oferta de trabalho, demanda e capital na Economia.
- Entra: pops (emprego, renda, poupança)
- Sai: demanda e oferta de trabalho por setor
- Aceite: pop com renda de R$ 3.000 (exemplo) gasta [ABERTO: parcela] e alimenta a demanda dos setores de consumo.
- Extremos: com renda 0, o pop só usa poupança; com poupança no máximo, [ABERTO: teto]; sem emprego, a oferta de trabalho existe e a renda vem só de transferência.
- Depende de: JOGO-1.2-07

### [JOGO-1.2-03] Economia paga e define preços para a Sociedade
- R antigo: novo
- GDD: L227–L227
- Regra: Ao fim do turno, as empresas pagam salário, abrem ou fecham vagas e definem preços, e o pop recebe a renda e paga o preço.
- Entra: empresas (produção, lucro), preços, vagas
- Sai: renda do pop, emprego do pop, preço pago
- Aceite: empresa que contrata 100 pessoas (exemplo) faz 100 pops passarem a ter salário.
- Extremos: com 0 vagas, ninguém é contratado; com todas as vagas cheias, o excesso de procura sobe salário [ABERTO: quanto]; empresa fechada no meio do turno demite no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.2-02

### [JOGO-1.2-04] Economia financia o Estado
- R antigo: novo
- GDD: L228–L228
- Regra: Ao fim do turno, a Economia gera os impostos que entram nas contas da Máquina pública, na medida das leis de imposto em vigor.
- Entra: base de cada imposto, alíquota da lei
- Sai: receita do Estado no turno
- Aceite: alíquota 10% sobre base de R$ 1 bilhão (exemplo) dá receita de R$ 100 milhões.
- Extremos: com alíquota 0, receita 0; com alíquota no máximo, [ABERTO: efeito sobre a base]; revogar o imposto no meio do turno vale no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.2-05

### [JOGO-1.2-05] Máquina pública cobra, gasta e regula por lei
- R antigo: novo
- GDD: L229–L229
- Regra: Ao fim do turno, a lei em vigor cobra, gasta ou regula, e o resultado entra na Economia como imposto, verba ou regra.
- Entra: leis em vigor com seus valores
- Sai: imposto cobrado, verba paga e regra aplicada à Economia
- Aceite: lei de verba de R$ 500 milhões (exemplo) coloca esse valor na instituição, que o gasta.
- Extremos: com a lei em 0, nada muda; com a lei no máximo, o gasto exige imposto, dívida ou emissão (JOGO-1.3-10); revogada no meio do turno, a verba para no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.3-01

### [JOGO-1.2-06] Máquina pública entrega serviço, renda e direito
- R antigo: novo
- GDD: L230–L230
- Regra: Ao fim do turno, a instituição entrega serviço, transferência de renda e direito ao pop, na medida da verba que recebeu.
- Entra: verba da instituição, lei em vigor, pop
- Sai: serviço recebido, renda recebida e direito do pop
- Aceite: instituição com verba de 100% da lei (exemplo) entrega 100% do serviço; com 50%, entrega 50% [ABERTO: relação].
- Extremos: com verba 0, nada; com verba no máximo, entrega no teto do rendimento [ABERTO: teto]; verba cortada no meio do turno vale no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.2-05

### [JOGO-1.2-07] Sociedade vota, apoia e protesta
- R antigo: novo
- GDD: L231–L231
- Regra: Ao fim do turno, a opinião de cada pop vira voto, apoio e protesto, e chega à Máquina pública como pressão sobre leis e eleição.
- Entra: opinião do pop
- Sai: apoio de cada grupo, protesto como fato do turno, voto na eleição
- Aceite: pops com opinião abaixo de 20% (exemplo) fazem o protesto subir naquele turno.
- Extremos: com opinião 0, protesto no máximo [ABERTO: valor]; com opinião no máximo, apoio total; sem eleição no turno, só apoio e protesto.
- Depende de: JOGO-1.1-08

### [JOGO-1.2-08] Opinião do pop (bolso, bússola, memória)
- R antigo: novo
- GDD: L207–L207
- Regra: Quando o motor calcula a opinião de um pop, soma bolso (peso maior), bússola (peso menor) e memória.
- Entra: efeito no bolso, distância na bússola, memória do pop
- Sai: opinião do pop
- Aceite: pop (exemplo) perde 5% de renda, a lei está a 1 ponto de distância na bússola; a opinião cai pelo bolso mais que pela bússola.
- Extremos: com os três termos em 0, a opinião é neutra [ABERTO: valor]; com todos no máximo, a opinião vai ao teto; revogação no meio do turno atualiza a memória [ABERTO: confirmar].
- Depende de: nenhum

### [JOGO-1.2-09] Toda lei chega ao pop por um canal
- R antigo: R7.12
- GDD: L214–L214
- Regra: Toda lei declara o canal por onde chega ao pop (renda, emprego, preço, serviço ou direito) e o motor aplica o efeito por esse canal.
- Entra: canal declarado na lei
- Sai: efeito aplicado no pop pelo canal
- Aceite: lei que muda um benefício declara canal "renda" e muda a renda dos pops beneficiados.
- Extremos: com lei sem canal, o validador recusa; com efeito 0, nada chega; revogada no meio do turno, o canal para no turno seguinte [ABERTO: confirmar].
- Depende de: nenhum

### [JOGO-1.2-10] Origem de cada número sentido
- R antigo: novo
- GDD: L217–L217
- Regra: O motor guarda, para todo número que o jogador sente, de onde ele veio (lei, fato ou índice), e entrega isso à tela.
- Entra: efeitos aplicados no turno por número
- Sai: lista de origens por número, para a tela
- Aceite: a renda de um pop mudou em 2%; a origem lista a lei com o maior efeito e o fato de maior peso (exemplo).
- Extremos: com número sem origem (0 efeitos), mostra "sem causa nova"; com muitas origens, [ABERTO: quantas guardar].
- Depende de: JOGO-1.2-09

### [JOGO-1.2-11] Lei não traz quem gosta dela
- R antigo: novo
- GDD: L215–L215
- Regra: A lei declara onde mexe no dinheiro e na vida; o motor calcula o gosto de cada pop a partir disso e da bússola, e a lei não guarda lista de quem a apoia.
- Entra: efeitos declarados da lei, posição da lei na bússola
- Sai: gosto calculado por pop
- Aceite: duas leis com o mesmo efeito de renda e posições opostas na bússola dão gostos diferentes só pela distância (exemplo).
- Extremos: lei sem efeito no bolso, só a bússola e a memória pesam; lei com efeito no máximo, o bolso domina [ABERTO: pesos].
- Depende de: JOGO-1.2-08

### [JOGO-1.2-12] Módulos funcionam sozinhos
- R antigo: novo
- GDD: L219–L219
- Regra: Os módulos de população, leis e economia rodam um turno completo com os outros desligados, e as ligações entre eles vêm do conteúdo das leis.
- Entra: estado de cada módulo
- Sai: estado do módulo no fim do turno
- Aceite: população roda um turno sem leis e sem economia, mantendo os pops e a opinião vindos da memória (exemplo).
- Extremos: sem o outro módulo, a entrada vale 0 [ABERTO: valor de entrada ausente]; com todos ligados, a ordem do turno vale.
- Depende de: JOGO-1.2-01

### [JOGO-1.2-13] Organização nasce na partida
- R antigo: novo
- GDD: L220–L220
- Regra: Durante a partida, uma organização nasce de um grupo e passa a existir com nome, líder e ação, como camada separada de pop e de grupo.
- Entra: estado do grupo, gatilho de criação
- Sai: nova organização no estado da partida
- Aceite: grupo organizado de trabalhadores gera uma organização depois de [ABERTO: gatilho] (exemplo).
- Extremos: com 0 grupos, nenhuma nasce; no máximo de organizações, [ABERTO: teto]; a organização sobrevive à revogação da lei que a criou [ABERTO: confirmar].
- Depende de: nenhum

### [JOGO-1.2-14] Mídia só atua sobre fato existente
- R antigo: novo
- GDD: L195–L195
- Regra: Quando a mídia atua, ela lê um fato do turno que já existe e muda como ele chega ao pop, sem criar fato novo.
- Entra: fatos do turno, posição da mídia
- Sai: manchete e mudança de percepção sobre o fato
- Aceite: com 0 fatos no turno, a mídia produz 0 manchetes de fato [ABERTO: se há manchete de rotina].
- Extremos: com fato de grandeza máxima, [ABERTO: regra da manchete]; fato revogado no meio do turno não gera manchete nova.
- Depende de: JOGO-1.2-01

### [JOGO-1.2-15] Mundo pressiona sem fazer parte
- R antigo: novo
- GDD: L194–L194
- Regra: Quando comércio, preços de fora ou outros países mudam, o motor aplica o efeito na Sociedade, na Economia e na Máquina pública sem tratar o Mundo como uma das três mecânicas.
- Entra: estado dos outros países, preços de fora
- Sai: pressão sobre preços, comércio e leis do país
- Aceite: preço de fora de uma commodity sobe 10% (exemplo) e o preço interno do setor sobe com atraso [ABERTO: atraso].
- Extremos: com preço de fora 0, [ABERTO: regra]; com mudança máxima, [ABERTO: teto de choque].
- Depende de: JOGO-1.2-01

### [JOGO-1.2-16] Bolsa liga lei, lucro, ação e voto
- R antigo: novo
- GDD: L211–L211
- Regra: Quando uma lei muda o lucro de uma empresa, o preço da ação muda, o patrimônio dos pops que têm a ação muda, e esses pops reagem no voto e no investimento.
- Entra: lucro da empresa, preço da ação, ações do pop
- Sai: patrimônio do pop, voto e investimento
- Aceite: lucro cai 10% (exemplo) e a ação cai; o patrimônio do pop acionista cai na mesma proporção das ações dele.
- Extremos: com 0 ações no pop, nada muda; com lucro 0, a ação cai [ABERTO: piso]; lei revogada no meio do turno recompõe o lucro no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.2-08

### [JOGO-1.2-17] Lei mora numa instituição com ministro
- R antigo: R7.13
- GDD: L197–L197
- Regra: Toda lei é guardada numa instituição, e a instituição fica com um ministro responsável.
- Entra: lei, instituição, ministro
- Sai: associação lei → instituição → ministro no estado da partida
- Aceite: toda lei do Brasil-2026 aponta uma instituição, e toda instituição aponta um ministro.
- Extremos: instituição sem ministro, [ABERTO: regra de vaga]; lei sem instituição, o validador recusa; mudança de ministro no meio do turno vale no turno seguinte [ABERTO: confirmar].
- Depende de: nenhum

---

## 1.3-principios-as-regras-que-nunca-mudam.md

### Parte A: extração

**1. ENTIDADES**

| Nome | O que guarda | Linha |
| --- | --- | --- |
| Lei | regra permanente, com bolha, com ganhadores e perdedores, atraso declarado | L252–L258 |
| Decisão (Ato, Operação) | decisão do presidente por clique em país ou companhia; tem custo, tempo e reação | L254 |
| Bolha | forma da lei no mapa | L253 |
| Papel na mesa | o que os outros propõem | L253 |
| Dinheiro | todo real, inclusive o ilegal, com origem e destino | L257 |
| Congresso | trava do exorbitante; voz dos grupos junto com a mídia | L263 |
| Pessoa (ficha) | fonte do que a pessoa faz | L264 |
| Canal | renda, emprego, preço, serviço ou direito | L265 |
| Bússola | dois lados com leis próprias | L267 |
| Dados do mundo | leis, índices, partidos e mídias | L262 |

**2. REGRAS**

| Quando acontece | O que muda | Quanto | Linha |
| --- | --- | --- | --- |
| Estado faz algo | passa por lei | não diz | L252 |
| Jogador decide governo | a decisão é uma bolha de lei no mapa, nunca painel de gestão | não diz | L253 |
| Decisões do partido (chapa, ministros, coligação, campanha) | são escolhas curtas, sem painel | não diz | L253 |
| Os outros propõem | chega como papel na mesa | não diz | L253 |
| Decisão do presidente (Ato ou Operação) | aparece no clique de país ou companhia; tem custo, tempo e reação; é limitada pelas leis | não diz | L254 |
| Tema de lei | se divide em leis menores, cada uma com escolha de verdade | não diz | L255 |
| Toda lei | tem ganhadores, perdedores e consequências; textos e cores descrevem | não diz | L256 |
| Jogo fala com o jogador | nunca fala de lado | não diz | L256 |
| Dinheiro gasto, cobrado, desviado ou ganho fora da lei | vira renda de alguém, circula, fica guardado ou sai do país | não diz | L257 |
| Corrupção | vai ao bolso de alguém e deixa rastro | não diz | L257 |
| Dinheiro do Estado | entra por lei ou por bem do Estado; sai por lei ou obrigação | não diz | L257 |
| Gasto do Estado | exige imposto, dívida ou emissão | não diz | L257 |
| Cada efeito | declara quanto tempo leva | não diz | L258 |
| Toda escolha | mexe em algo visível; esperar também é opção | não diz | L259 |
| Decisão | acontece agora; esperar é escolha do jogador, nunca obrigação | não diz | L259 |
| Frases, manchetes e eventos | leem os números | não diz | L260 |
| Lei inventada | vale se plausível; número na ordem de grandeza certa | não diz | L261 |
| Motor | conhece o Estado, não nomes; país declara só estado de partida e rótulos locais | não diz | L262 |
| Jogador propõe | qualquer coisa; o exorbitante o Congresso barra; o resto é freado pela consequência | não diz | L263 |
| Aprovação | não pode travar o jogo | não diz | L263 |
| Pessoa age | sai da ficha e do país, não de história escrita | não diz | L264 |
| Toda lei | chega ao pop por renda, emprego, preço, serviço ou direito | não diz | L265 |
| Lei | não traz condição escrita; muda de sentido pelo estado do país (renda contra a conta) | não diz | L266 |
| Lei | vai de "nada" a "mais" num lado só; os dois lados da Bússola têm leis próprias | não diz | L267 |
| Texto da lei e da opção | exemplo do dia a dia, sem jargão, com régua numérica | não diz | L268 |
| Decisão | tem consequência própria e sentida | não diz | L269 |
| Limite de leis por vez | vem do mundo (Congresso cheio), só atrasa, nunca proíbe | não diz | L270 |

**3. NÚMEROS**

| Valor | A que se refere | Linha |
| --- | --- | --- |
| 18 | princípios | L252–L270 |

**4. LIGAÇÕES**

| O que esta seção lê ou altera em outra | Linha |
| --- | --- |
| Leis e Máquina pública (Parte 4): bolha, divisão de leis, canal | L252–L255, L265 |
| Economia (Parte 3): conservação do dinheiro, imposto/dívida/emissão, atraso | L257–L258 |
| Política/Congresso (Parte 5): trava e voz dos grupos | L263 |
| Mídia (Parte 6): voz dos grupos, manchetes leem dados | L260, L263 |
| Tela (Parte 8): bolha, mesa, texto para leigo | L253, L268 |
| Narrativas (Parte 9): dados primeiro | L260 |
| Pessoas (Parte 5): ficha | L264 |
| Mundo/conteúdo: motor sem nomes | L262 |
| Bússola (Parte 2): lados | L267 |

**5. BURACOS**

| O que falta dizer | Linha |
| --- | --- |
| Como se mede o "exorbitante" que o Congresso barra (fica para a Parte 5) | L263 |
| Quanto tempo cada efeito leva (o princípio só pede que declare) | L258 |
| Quando o dinheiro ilegal vira renda de alguém e de quem | L257 |
| O que acontece quando o gasto excede imposto, dívida e emissão possíveis | L257 |
| Quem valida o "plausível" e a "ordem de grandeza certa" | L261 |
| O que é "Congresso cheio" (limite) e quanto é o atraso | L270 |
| Duas leis opostas no mesmo alvo, sem condição escrita | L266 |
| Revogar uma lei no meio do atraso: o efeito em curso continua? | L258 |
| Lei com valor 0 na régua ("nada") e no máximo ("mais") | L267 |
| Em que etapa a decisão do presidente (Ato/Operação) custa e reage | L254 |
| Como se testa "nada neutro" | L259 |

### Parte B: requisitos

### [JOGO-1.3-01] Todo ato do Estado passa por lei
- R antigo: novo
- GDD: L252–L252
- Regra: Toda ação do Estado que mexe em dinheiro, regra ou serviço é executada por uma lei em vigor; sem lei, o Estado não faz.
- Entra: leis em vigor
- Sai: ação do Estado aplicada ou bloqueada
- Aceite: sem lei de verba para a instituição (exemplo), a instituição não gasta.
- Extremos: com 0 leis, o Estado não faz nada novo [ABERTO: o que continua por obrigação]; revogada no meio do turno, a ação para no turno seguinte [ABERTO: confirmar].
- Depende de: nenhum

### [JOGO-1.3-02] Decisão de governo é bolha de lei
- R antigo: novo
- GDD: L253–L253
- Regra: Toda decisão de governo do jogador é uma lei com bolha no mapa, sem painel de gestão; o painel só mostra dados.
- Entra: lei em vigor ou proposta
- Sai: bolha da lei com os dados que a tela recebe
- Aceite: propor uma lei de imposto cria uma bolha dela no mapa.
- Extremos: sem lei, sem bolha; com todas as leis, uma bolha por lei; lei revogada some do mapa [ABERTO: quando].
- Depende de: JOGO-1.3-01

### [JOGO-1.3-03] Decisão do partido sem painel e papéis na mesa
- R antigo: R17.6
- GDD: L253–L253
- Regra: Decisões do partido (chapa, ministros, coligação, campanha) são escolhas curtas, e o que os outros propõem chega como papel na mesa do jogador.
- Entra: pedido de outro ator, escolha do jogador
- Sai: papel na mesa; escolha gravada
- Aceite: um aliado propõe uma coligação (exemplo) e ela chega como papel na mesa.
- Extremos: com 0 papéis, a mesa fica vazia; com papéis no máximo, [ABERTO: teto de papéis]; papel ignorado até o prazo segue a regra do país.
- Depende de: JOGO-1.3-02

### [JOGO-1.3-04] Ato e Operação limitados pelas leis
- R antigo: R7.16
- GDD: L254–L254
- Regra: Quando o presidente toma uma decisão (Ato ou Operação) pelo clique num país ou companhia, ela tem custo, tempo e reação, e só vale dentro do que as leis permitem.
- Entra: decisão, leis em vigor, custo, tempo
- Sai: custo debitado, reação do alvo, fato do turno
- Aceite: um Ato de visita de Estado (exemplo) debita o custo e gera reação do país visitado.
- Extremos: com custo 0, a reação ainda vem; com lei que proíbe, a decisão é bloqueada; Operação em etapas interrompida no meio [ABERTO: o que acontece com o custo].
- Depende de: JOGO-1.3-01

### [JOGO-1.3-05] Tema vira leis menores
- R antigo: R7.6
- GDD: L255–L255
- Regra: Cada tema é dividido em leis menores, e cada lei tem uma escolha de verdade; o molde não aceita lei de controle único com efeito grande.
- Entra: definição da lei
- Sai: validação da lei
- Aceite: um tema de aposentadoria é dividido em várias leis, cada uma com efeito pequeno (exemplo).
- Extremos: com 1 lei no tema, [ABERTO: regra de mínimo de leis]; no máximo de efeito de uma lei, [ABERTO: teto de efeito por lei].
- Depende de: nenhum

### [JOGO-1.3-06] Lei traz ganhadores, perdedores e consequências
- R antigo: novo
- GDD: L256–L256
- Regra: Toda lei declara ganhadores e perdedores entre os pops e as consequências no tempo, e o texto e a cor da lei descrevem sem chamar de boa ou ruim.
- Entra: efeitos da lei por pop e índice
- Sai: lista de ganhadores e perdedores para a tela
- Aceite: lei de imposto (exemplo) lista pops que pagam como perdedores e pops que recebem a verba como ganhadores.
- Extremos: lei sem perdedor, [ABERTO: se é permitida]; efeito 0, sem ganhadores nem perdedores; no máximo, a lista inclui todos os pops afetados.
- Depende de: JOGO-1.2-09

### [JOGO-1.3-07] O jogo não fala de lado
- R antigo: R4.8
- GDD: L256–L256
- Regra: Os textos entregues ao jogador não rotulam lei, ator ou resultado como de direita ou de esquerda; o lado aparece só como resultado nos dados.
- Entra: texto da lei, posição na bússola
- Sai: texto sem rótulo de lado
- Aceite: a bolha de lei mostra efeitos e números, sem a palavra "direita" ou "esquerda" como objetivo.
- Extremos: com bússola no centro, nada muda; com bússola no extremo, a regra vale igual.
- Depende de: JOGO-1.3-06

### [JOGO-1.3-08] Nenhum dinheiro some
- R antigo: R10.7
- GDD: L257–L257
- Regra: Todo real gasto, cobrado, desviado ou ganho fora da lei, inclusive no ilegal, vira renda de alguém, circula, fica guardado ou sai do país no mesmo turno.
- Entra: fluxos de dinheiro do turno com origem e destino
- Sai: soma dos fluxos conferida; erro se a conta não fechar
- Aceite: verba de R$ 100 milhões (exemplo) com 10% desviados deixa R$ 90 milhões na instituição e R$ 10 milhões na renda de um ator.
- Extremos: com fluxo 0, a soma é 0; no máximo de desvio, tudo vira renda de ator e a instituição recebe 0; revogação no meio do turno não deixa saldo sem dono.
- Depende de: nenhum

### [JOGO-1.3-09] Corrupção deixa rastro
- R antigo: R6.21
- GDD: L257–L257
- Regra: Quando dinheiro é desviado, o motor registra quem recebeu e deixa um rastro que pode virar fato do turno.
- Entra: valor desviado, órgão de origem
- Sai: renda do ator e registro do rastro
- Aceite: R$ 10 milhões desviados (exemplo) geram o registro do ator e do órgão.
- Extremos: com desvio 0, sem rastro; com desvio no máximo, o rastro pesa mais [ABERTO: regra]; desvio revogado não apaga o registro.
- Depende de: JOGO-1.3-08

### [JOGO-1.3-10] A conta do Estado fecha
- R antigo: R10.1
- GDD: L257–L257
- Regra: Todo dinheiro que entra no Estado entra por lei ou por bem do Estado, todo gasto sai por lei ou obrigação, e gastar acima da receita exige dívida ou emissão.
- Entra: receita, gasto, dívida, emissão
- Sai: saldo do cofre e dívida
- Aceite: gasto de R$ 120 (exemplo) com receita de R$ 100 exige R$ 20 de dívida ou emissão.
- Extremos: com gasto 0, o cofre só soma receita; com dívida no máximo, [ABERTO: o que ocorre, ver calote R10.6]; lei de gasto revogada no meio do turno corta o gasto do turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.3-08

### [JOGO-1.3-11] Efeito declara quanto tempo leva
- R antigo: R4.2
- GDD: L258–L258
- Regra: Todo efeito de lei declara o atraso em turnos e chega inteiro ao fim dele, andando do valor antigo ao novo nesse prazo (GDD 1.5).
- Entra: atraso declarado, turno de aprovação
- Sai: efeito aplicado no turno de chegada
- Aceite: efeito com atraso 3 (exemplo) aprovado no turno 5 está em 1/3 no turno 6 e inteiro no turno 8.
- Extremos: com atraso 0, chega no mesmo turno; com atraso no máximo, [ABERTO: teto]; revogada no meio do atraso, [ABERTO: o efeito em curso continua?].
- Depende de: nenhum

### [JOGO-1.3-12] Toda escolha mexe em algo visível
- R antigo: novo
- GDD: L259–L259
- Regra: Toda escolha do jogador muda ao menos um dado visível ao jogador, e passar o turno sem agir é uma escolha válida que o jogador pode fazer sem obrigação.
- Entra: escolha do jogador
- Sai: ao menos um dado visível alterado, ou o fato "esperou"
- Aceite: passar o turno sem agir registra o fato "esperou" no turno (exemplo).
- Extremos: com valor 0, a escolha ainda muda algo; com valor no máximo, idem; sem nada a decidir, o jogador pode passar o turno.
- Depende de: nenhum

### [JOGO-1.3-13] Texto e evento leem os números
- R antigo: R7.5
- GDD: L260–L260
- Regra: Frase, manchete e evento são gerados a partir dos valores do turno, e nunca de um texto fixo sem dado por trás.
- Entra: valores do turno
- Sai: texto com os números
- Aceite: a manchete de uma queda do PIB (exemplo) cita o valor da queda.
- Extremos: com valor 0, o texto diz "sem mudança" [ABERTO: texto]; com valor no máximo, o texto aponta o recorde.
- Depende de: JOGO-1.2-10

### [JOGO-1.3-14] Lei inventada com número plausível
- R antigo: novo
- GDD: L261–L261
- Regra: O validador aceita lei inventada se o número está na ordem de grandeza do país, e não exige precisão de dado empírico.
- Entra: lei, referência de ordem de grandeza
- Sai: aprovação ou recusa do validador
- Aceite: imposto de 15% (exemplo) passa; imposto de 15.000% é recusado.
- Extremos: no mínimo e no máximo da régua, passa; fora da régua, recusa; [ABERTO: o limite de "ordem de grandeza"].
- Depende de: nenhum

### [JOGO-1.3-15] Motor sem nomes
- R antigo: R4.11
- GDD: L262–L262
- Regra: O motor só lê leis, índices, partidos e mídias como dados do mundo, e o país declara apenas o estado de partida e os rótulos locais.
- Entra: dados do mundo, estado de partida do país
- Sai: partida montada sem nome fixo no motor
- Aceite: trocar o país Brasil-2026 por um país de teste não exige mudar o motor.
- Extremos: com 0 leis no país, a partida roda com "não legislada" em tudo; com todas as leis, idem.
- Depende de: nenhum

### [JOGO-1.3-16] Congresso barra só o exorbitante
- R antigo: R12.18
- GDD: L263–L263
- Regra: Quando o jogador propõe uma lei, o Congresso a barra só se for exorbitante; fora isso, o que segura é a consequência, e aprovar não pode travar o jogo.
- Entra: lei proposta, apoio dos grupos e da mídia
- Sai: lei aprovada ou barrada
- Aceite: lei de efeito moderado (exemplo) é aprovada; lei de efeito extremo é barrada [ABERTO: limite do exorbitante; definido na Parte 5].
- Extremos: efeito 0, aprovada; efeito máximo, barrada; revogação no meio do turno cancela a votação.
- Depende de: JOGO-1.1-07

### [JOGO-1.3-17] Pessoa age pela ficha e pelo país
- R antigo: novo
- GDD: L264–L264
- Regra: A ação de uma pessoa é calculada pela ficha e pelo estado do país, e não por um roteiro escrito.
- Entra: ficha, estado do país
- Sai: ação da pessoa como fato do turno
- Aceite: dois ministros de fichas diferentes (exemplo) reagem diferente à mesma crise.
- Extremos: ficha no mínimo ou no máximo, a ação segue a regra; ficha igual e país igual, o mesmo resultado dada a semente.
- Depende de: JOGO-1.1-06

### [JOGO-1.3-18] Toda lei chega ao pop
- R antigo: R7.12
- GDD: L265–L265
- Regra: Toda lei tem um canal (renda, emprego, preço, serviço ou direito) até o pop, e o validador recusa lei sem canal.
- Entra: canal declarado
- Sai: aceite ou recusa da lei
- Aceite: lei sem canal declarado é recusada com o motivo (exemplo).
- Extremos: com efeito 0 o canal ainda é exigido; no máximo, idem.
- Depende de: JOGO-1.2-09

### [JOGO-1.3-19] O resultado emerge do estado do país
- R antigo: novo
- GDD: L266–L266
- Regra: A lei não guarda condição do tipo "se pobreza > X"; o efeito dela muda de sentido pela renda do pop contra a conta dele.
- Entra: efeito da lei, renda e conta do pop
- Sai: efeito sentido pelo pop
- Aceite: a mesma lei de preço ajuda pop com renda alta e prejudica pop sem renda (exemplo).
- Extremos: renda 0, o efeito é só custo; renda no máximo, o efeito é só ganho [ABERTO: regra]; revogação no meio do turno volta à conta anterior.
- Depende de: JOGO-1.2-08

### [JOGO-1.3-20] Lei vai de nada a mais num lado só
- R antigo: novo
- GDD: L267–L267
- Regra: A régua de cada lei vai de "nada" a "mais" em um único lado, e cada lado da Bússola tem leis próprias.
- Entra: definição da régua
- Sai: validação da régua
- Aceite: um tema com dois lados vira duas leis, uma para cada lado (exemplo).
- Extremos: no mínimo "nada", a lei não tem efeito; no máximo "mais", o teto da régua; régua com valor negativo, o validador recusa.
- Depende de: JOGO-1.3-05

### [JOGO-1.3-21] Texto da lei para leigo
- R antigo: R7.5
- GDD: L268–L268
- Regra: O texto da lei e de cada opção traz um exemplo do dia a dia, sem jargão, mantendo a régua com número.
- Entra: texto da lei, valor da régua
- Sai: texto com exemplo
- Aceite: a lei traz uma frase do tipo "quem ganha R$ 2.000 passa a pagar R$ X" (exemplo).
- Extremos: com valor 0, o texto diz "nada muda"; com valor no máximo, o exemplo usa o teto.
- Depende de: JOGO-1.1-12

### [JOGO-1.3-22] Cada decisão tem consequência própria
- R antigo: novo
- GDD: L269–L269
- Regra: Cada decisão do jogador tem ao menos um efeito próprio que o jogador sente, e o resultado não depende de um traço de personalidade do jogador.
- Entra: decisão do jogador
- Sai: efeito próprio da decisão, com origem
- Aceite: duas leis diferentes no mesmo turno geram dois efeitos distinguíveis na origem do número.
- Extremos: com decisão de efeito 0, [ABERTO: se é recusada, ver JOGO-1.3-12]; com decisão no máximo, o efeito é o maior possível.
- Depende de: JOGO-1.2-10

### [JOGO-1.3-23] Sem pontos de ação
- R antigo: R12.18
- GDD: L270–L270
- Regra: Quando o Congresso está cheio, a lei nova entra na fila e atrasa, e o motor nunca proíbe o jogador de propor.
- Entra: carga da casa, limite da casa
- Sai: lei na fila com atraso
- Aceite: com a carga padrão de 3 por casa (exemplo, do R12.18) cheia, a quarta lei entra na fila.
- Extremos: com carga 0, passa direto; com fila no máximo, [ABERTO: teto da fila]; revogação de uma lei da fila libera a vaga no turno seguinte [ABERTO: confirmar].
- Depende de: JOGO-1.3-16

---

## PERGUNTAS AO AUTOR

1. O resumão a cada 4 anos cobre só os 4 anos que passaram (a) ou o histórico inteiro desde o início (b)? (L153)
