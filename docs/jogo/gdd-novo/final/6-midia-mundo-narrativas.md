## Parte 6. Mídia

Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em `requisitos.md`.

**Lugar no jogo.** O jogo tem três mecânicas: Gosto (a população e como ela funciona), Economia e Leis. Mídia, Mundo e Narrativas ficam em volta delas. O ciclo é: a economia mexe no pop, o pop mexe na política, a política (as leis) mexe na economia. Princípio 8: dados primeiro, narrativa depois. Os números vêm antes; frases, manchetes e eventos leem esses números. Princípio 2.4: o país vive sozinho. Empresas abrem e fecham, a mídia escolhe lado, os outros países mudam de ideia.

Decidido em 13/nov: hoje a mídia não pesa em nada. O jornal só mostra manchetes; nenhuma notícia mexe em grupo, voto ou aprovação.

### 6.1 A mídia como lente das três mecânicas

**O que é:** a mídia é uma lente. Ela age em cima dos fatos que já existem e não é uma fonte nova do gosto da população (14/nov). Sem fato, não há notícia. O que a mídia muda é como o fato chega: quem o vê, com que força, de que lado.

**O jogador:** governa sabendo que cada lei passa por um filtro, e pode mexer nesse filtro, pagando por isso. Sente a mídia como o jeito pelo qual o país recebe o que ele fez.

**Peças:** as emissoras e redes (6.2), o jornal e a pauta (6.3), fato e versão (6.4), a deriva e a raiva (6.5), os atos e as leis de mídia (6.6).

**Regras:**
- A mídia não cria satisfação. A satisfação vem do que a lei faz na vida do pop; a mídia muda o lado na bússola e a raiva (11/nov, ver 6.5). (14/nov)
- Como a mídia mexe em cada mecânica, com o que as fontes já dizem:
  - **Gosto:** o grupo sente a lei pelo que assiste. A mídia empurra o pop na bússola devagar (deriva), faz a raiva do grupo subir rápido, e o pop acredita no que lê conforme a credibilidade da emissora. Entra pela audiência por grupo.
  - **Economia:** a mídia é empresa, com lucro, dono e compra na bolsa. A publicidade do governo é verba. A versão falsa e o escândalo mexem em honestidade e reputação, que pesam depois no resto.
  - **Leis:** as leis de mídia (publicidade, emissora estatal, regulação, concessão, censura, banimento) controlam o filtro. A manchete contra tira votos no Congresso. A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete. A mídia expõe o rastro do papel duvidoso.

**Ligações:** Gosto (audiência, bússola do pop, raiva), Economia (dono, bolsa, verba), Leis (leis de mídia, voto no Congresso), Política (escândalo, honestidade).

**Referências:** nenhum jogo de referência citado nas fontes. **ESTUDAR** como a mídia mexe em cada uma das 3 mecânicas (Gosto, Economia, Leis).

**No motor hoje:** ☐ nenhuma das três lê a mídia ainda. Só o jornal do turno existe (6.3).

**Em aberto:** o que o estudo trouxer sobre como a mídia mexe em cada mecânica. Faltam números para as ligações com Economia (publicidade, lucro da emissora).

### 6.2 Emissoras e redes

**O que é:** as 8 maiores mídias do país (mais as redes), cada uma com dono, lado na bússola, audiência por grupo e credibilidade.

**O jogador:** governa sabendo que cada lei passa por um filtro, e pode mexer nesse filtro, pagando por isso. O grupo sente a lei pelo que assiste.

**Peças:**
- Emissora: dono (privado, estatal, estrangeiro ou rede), bússola, audiência (fração de cada grupo, de 0 a 1), credibilidade (0 a 100).
- Gerador de audiência: perto na bússola, mais; longe, quase nada; vezes o alcance da mídia.
- Redes: sem dono único, rápidas, polarizam, espalham boato quando a instrução é baixa.
- Perfil da emissora e dos jornalistas, na rede social.
- Mídia é empresa: tem lucro, dono e pode ser comprada na bolsa.

**Regras:**
- O país declara as 8 maiores com nome e especificações. Se não declarar, o gerador de empresas cria a partir do histórico do país. (07/nov)
- Nomes seguem a regra de conteúdo: nenhuma empresa real; o que tem marca ou dono ganha nome alternativo parecido.
- Dono que muda de lado: a posição anda para a do novo dono em alguns turnos; redação forte e credibilidade alta freiam. Estatal muda com o governo; da bolsa, com quem comprou; de família quase não é vendida; estrangeira segue o interesse de fora.
- Emissora estatal: audiência própria, credibilidade baixa no início.
- O partido tem mídias aliadas e porta-voz. Aliada pega em engano perde credibilidade junto.
- Índices da mídia: Liberdade de imprensa, Credibilidade da imprensa, Concentração da mídia, Desinformação, Polarização, Violência contra a imprensa.

**Ligações:**
- Recebe: grupos (audiência por grupo); dono e bolsa (Economia); lei de mídia (Leis).
- Entrega: filtro da opinião do grupo (Gosto); fatos do turno (Política).

**Referências:** os índices vêm do acervo de leis e índices. Sem jogo de referência citado. **ESTUDAR** (como outros jogos tratam mídia como filtro).

**No motor hoje:** ◐ R14.1, Brasil com 8 mídias inventadas e as redes no estado; ninguém lê audiência nem credibilidade. ☐ R14.5 leis de mídia agindo. ☐ R14.6 redes. Só o Brasil tem `midias.json`. Perfil da mídia e das redes na tela também falta.

**Em aberto:**
- Nomes parecidos com os reais, como os juízes?
- A mídia vira empresa na bolsa: como liga a Companhias (5.6) e Bolsa (5.8)?
- Emissora estatal: audiência e credibilidade em números.

### 6.3 Noticiário: jornal e pauta

**O que é:** o jornal do turno, que traz as notícias de maior impacto, e a pauta, que é o que cada mídia escolhe noticiar.

**O jogador:** lê as manchetes do turno no mapa (princípio 8). Na rede social abre o perfil da emissora e vê o que ela anda postando sobre o país.

**Peças:**
- Impacto: peso do tamanho (1, 2, 3) × força do fato × apelo do tipo. O jornal guarda as 3 maiores.
- Manchetes: molde por tipo de fato, com `{lei}`, `{quem}`, `{caixa}`, `{area}`, `{programa}`.
- Pauta: cada mídia escolhe uns 3 fatos por turno.
- Enquadramento: o efeito de uma lei na opinião passa pela mídia.

**Regras:**
- O jornal roda na etapa 9b, depois de todos os módulos que escrevem fatos; só entram fatos deste turno.
- O texto das manchetes é do mundo (`mundo/jornal/manchetes.json`); o motor não conhece texto.
- Tipo de fato novo precisa de molde, e um teste confere.
- Pauta: escolhida pelo tamanho do fato, o lado da mídia, o interesse do dono e o medo (censura, corte de verba). O que ela repete vira o assunto mais importante para quem assiste.
- Enquadramento: mídia longe de você amplia quem perde; mídia perto amplia quem ganha.
- Pauta e escândalos: a mídia expõe fichas fracas (honestidade, lealdade) e crises; a amiga demora a noticiar, a inimiga corre.
- A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira manchete.

**Ligações:**
- Recebe: todos os fatos do turno (Política, Leis, Economia); audiência e credibilidade.
- Entrega: fatos "manchete contra/a favor" lidos por Congresso e grupos; voto no Congresso (manchete contra tira votos).

**Referências:** o Democracy 4 não entra (regra de conteúdo). Outras referências de noticiário: **ESTUDAR**.

**No motor hoje:** ✅ R14.4 jornal do turno, 3 maiores no topo do Resultado do turno. ☐ R14.3 pauta. ☐ R14.2 enquadramento. ☐ R17.9 a mídia lê a mesa. O jornal é um só e neutro; o mesmo fato não sai a favor numa mídia e contra noutra ainda. O jornal não é janela própria.

**Em aberto:**
- Como o jornal mostra a mesma notícia por mídias diferentes.
- De onde saem os posts da rede da emissora (dos fatos e da pauta) e se é a mesma rede do perfil das pessoas.
- Teste esperado: o mesmo fato sai a favor na mídia perto do governo e contra na longe.

### 6.4 Fato e versão, mentira, escândalo e vazamento

**O que é:** todo fato do turno tem uma verdade, e pode sair numa versão fiel, enviesada ou falsa, em qualquer mídia, inclusive a sua.

**O jogador:** pode plantar notícia falsa, vazar dado à mídia amiga ou abafar escândalo, sabendo que descoberta vira escândalo.

**Peças:**
- Versão: fiel, enviesada, falsa.
- Mentira descoberta (regra de descoberta).
- Escândalo em ciclo: semente, investigação, publicação, repercussão, desgaste, esquecimento.
- Vazamento: fonte, jornalista, publicação; seu, de rival ou da agência.
- Jornalistas: perfis na rede, redação forte ou fraca; o investigativo descobre segredos; pode ser ameaçado, preso ou agredido.

**Regras:**
- O pop acredita conforme a credibilidade; a verdade só aparece com investigação. Engano descoberto derruba a credibilidade de quem publicou.
- A cada turno que uma versão falsa circula, a chance de ser descoberta sobe com: redação forte das mídias longe de você, Liberdade de imprensa, Independência dos investigadores, checagem e instrução alta, tamanho da mentira, pessoas que sabem e tempo. Cai com censura, medo, corrupção e mídia amiga dominante.
- Descoberta vira escândalo; se o rastro chega ao presidente, cai a honestidade. Só enviesada é difícil de provar.
- A mesma regra da mentira descoberta vale para o rastro do papel duvidoso na mesa (corrupção). A corrupção vai ao bolso de alguém e deixa rastro (14/nov).
- Espiar alguém fica num registro que pode vazar e virar escândalo; a chance sobe com a importância de quem foi espiado.
- Estatística: o presidente pode esconder os números da mídia ou mentir neles; o jogador vê o índice real, a mídia vê com atraso e desconfiança (13/nov).

**Ligações:**
- Recebe: índices (Liberdade de imprensa, Independência dos investigadores); rastro da corrupção (Leis, Política).
- Entrega: escândalo a Política e ao Congresso (honestidade, impeachment, CPI); credibilidade da mídia.

**Referências:** nenhuma citada. **ESTUDAR** (ciclo de escândalo em jogos políticos).

**No motor hoje:** ☐ R14.10 fato e versão, mentira descoberta. Os tipos `escandalo` e `manchete-contra` existem na mesa de fatos, mas só o Congresso os lê, por ora. Falta a mídia emitir "manchete contra/a favor".

**Em aberto:**
- A regra da descoberta serve também ao rastro de corrupção e ao Espiar: uma regra só?
- Escândalo em ciclo e vazamento: regras e números.
- Jornalistas: perfis, redação, ameaça.

### 6.5 A mídia muda o lado do pop e mobiliza a raiva

**O que é:** duas coisas diferentes. A mídia empurra o pop na bússola, devagar. E a mídia faz a raiva do grupo subir, rápido.

**O jogador:** vê no mapa uma seta para onde o grupo vai na bússola e qual mídia empurra; vê o grupo pulsar vermelho e sair manchete.

**Peças:**
- Deriva do pop pela mídia que assiste.
- Bolha e polarização.
- Redes empurram mais rápido.
- Raiva do grupo, 0 a 100.

**Regras (11/nov):**
- A cada turno o pop anda um pouco na bússola para as mídias que assiste, pesadas pela audiência nele e pela credibilidade.
- Bolha: o pop assiste mais a mídia perto dele e larga a longe; a polarização nasce sozinha.
- Redes: só jovens e engajados, para o lado mais perto do pop, nunca para o centro; instrução baixa deixa o boato pegar.
- A vida pesa mais que a TV: a mídia muda o lado, a satisfação vem do que a lei faz na vida do pop. Mídia que diz o contrário do que ele vive perde credibilidade com ele.
- Freio: instrução alta e redação forte.
- Raiva sobe em 1 ou 2 turnos quando uma mídia repete um fato contra o grupo (qualquer mídia, inclusive a do governo, da oposição e das organizações); cai sozinha em poucos turnos quando a pauta muda.
- Com satisfação alta, pouco efeito. Com satisfação baixa, os radicais crescem e o grupo protesta. Com satisfação baixa e organização com líder: greve, sabotagem e, poucos, atentado. Vale o limite de cada grupo.
- Os radicais nascem da piora do padrão de vida, não do nível (14/nov).
- O presidente também mobiliza: a base contra o Congresso derruba a paciência; mobilizar demais cria radicais do próprio lado.
- O jogador compra ou cria mídia, dá publicidade, censura: efeito em mandatos, custo na hora (liberdade, escândalo, reputação).

**Ligações:**
- Recebe: audiência e credibilidade (Mídia); instrução e redação (índices).
- Entrega: bússola do pop (Gosto); raiva do grupo (Gosto); protesto, greve, atentado (Política).

**Referências:** Victoria 3 como ideia geral do ciclo, não da mídia. Para a mídia: **ESTUDAR**.

**No motor hoje:** ◐ R8.5, pops deslizam com a vida (feito) e com a mídia (falta, R14.8). ☐ R14.8. ☐ R14.9. ◐ R11.19, raiva do grupo existe, falta a mídia mobilizar. Fato `grupo-com-raiva`: ninguém escreve nem lê ainda.

**Em aberto:** como medir a força de um grupo e quanto ela muda a popularidade de uma lei (pergunta citada na Base do jogo).

### 6.6 Atos do presidente e leis de mídia

**O que é:** o que o presidente faz com a mídia (atos) e as regras permanentes sobre ela (leis).

**O jogador:** dá entrevista, faz pronunciamento, vaza dado, pressiona o dono, corta ou dá publicidade, e escolhe entre segurança e risco.

**Peças:**
- Atos: entrevista, coletiva, pronunciamento em rede nacional, vazar dado a mídia amiga, pressionar o dono, cortar ou dar publicidade, nomear na emissora estatal, processar jornalista, negar credencial, plantar notícia falsa.
- Leis: verba de publicidade do governo, emissora estatal, regulação, limite de dono estrangeiro, concessão, censura e banimento.
- Campanha: leis Horário eleitoral gratuito e Propaganda paga.

**Regras:**
- Entrevista amiga é segura; hostil rende mais e pode editar e armar pergunta; preparar ou improvisar.
- A hostilidade vem da distância da mídia até você, do tema (escândalo aberto endurece) e do formato (ao vivo não tem edição, mas arrisca gafe; gravada pode ser editada se a mídia é hostil).
- Respostas: direto (seguro, rende pouco), desviar para tema parecido (funciona se preparado), atacar a mídia (sobe a base, cai a confiança dos neutros), improvisar (pode render muito ou virar gafe, conforme carisma e honestidade).
- Publicidade agrada quem recebe. Censura e banimento calam a mídia e cobram liberdades, reputação internacional e radicais.
- Plantar notícia falsa é arriscado: descoberta vira escândalo.
- Campanha: as duas leis decidem quem aparece na mídia na eleição.
- Regra geral: opções do menu de país ou companhia são decisões (Ato ou Operação), não leis; as leis só controlam. (08/nov) Ato é "acontece uma vez".

**Ligações:**
- Recebe: carisma e honestidade do presidente (Política); verba (Economia).
- Entrega: base e confiança dos neutros (Gosto); liberdades e reputação (índices); quem aparece na eleição (Política).

**Referências:** nenhuma citada. **ESTUDAR** (entrevista como minigame).

**No motor hoje:** ☐ R14.5. ☐ R14.11.

**Em aberto:** custo e duração de cada ato com a mídia (entrevista, pressão, processo, notícia falsa). Ficam para as narrativas (ver 9.4).

---

## Parte 7. Mundo

### 7.1 Os países e as fichas

**O que é:** os outros países do mundo, como o jogador os vê e como o motor os roda.

**O jogador:** abre a tela do Mundo, vê o ranking por PIB com a relação de cada país com ele, clica num país e abre a ficha.

**Peças:**
- País jogável (11) e país do mundo (30 maiores, vizinhos, resto do mundo).
- País leve: ficha leve, simulada sem leis nem pops.
- Ficha leve: campos listados abaixo e na planilha de países.
- Governos que já existiram, por período, como pontos na bússola.
- Regime separado da bússola.

**Regras:**
- Países reais (08/nov): as 10 maiores economias e a Rússia (12/nov) são jogáveis. O mundo tem os 30 maiores, mais os vizinhos do país jogado e o resto do mundo num bloco só. A planilha lista 30 países, 11 jogáveis. Isso vale sobre as potências inventadas do motor, que saem no passo 13.
- Nomes e números reais ficam em arquivo de dados, com data e fonte; o motor continua sem conhecer nomes.
- Jogar no passado é só outro arquivo de país (Brasil-2026, Brasil-2003); para o motor são países diferentes.
- Um motor, dois jeitos de rodar (12/nov): só o país jogado roda inteiro; os outros são leves; ao escolher um, a ficha leve sai do mundo e a completa entra. Não se roda o mundo todo.
- País leve: economia resumida (PIB, crescimento, inflação, o que produz, compra e vende), governo (lado na bússola, força do governo, poder militar) e relação com cada país.
- A ficha leve: sistema de governo, regime (V-Dem), jeito, vizinhos; PIB, população, crescimento, inflação, dívida e reservas, o que vende e compra (3 a 5 produtos), ciência por produto, pobreza e violência (geram migração e refugiados); lado na bússola, força do governo (0 a 100), próxima eleição, poder militar (0 a 100), arma nuclear; opinião sobre cada país e blocos. Os 30 usam a mesma ficha; os 11 jogáveis têm também o estado inicial completo.
- Fontes públicas com data: FMI, Banco Mundial, SIPRI, Comtrade, V-Dem. Dados baixados ficam em `~/Documentos/SisGov-dados/`, fora do jogo.
- Países mudam por dentro sem leis. Essa é a meta: eleição a cada 4 anos (economia mal tende a virar o lado) e crise (força do governo baixa traz golpe ou guerra civil).
- Governos que já existiram (12/nov): a cada eleição (no partido único, troca de ala) o novo governo cai perto de um ponto da história, com pouca sorte. Crise econômica puxa para pontos do lado oposto; muito imigrante chegando puxa para os mais tradicionais.
- Pontos dos estudos (12/nov): econômico do V-Party (V-Dem); costumes de 6 medidas do V-Party ajustadas à escala GAL-TAN do Global Party Survey; Europa depois de 2019 pelo CHES 2024. A planilha traz 191 linhas de governo por país e período.
- Regime separado da bússola (12/nov): a bússola diz o que o governo quer; o regime (4 do V-Dem) diz como segura o poder. Não se somam; os dois pesam na opinião entre países. O sistema de governo é uma terceira coluna.
- A virada muda o país: opinião recalculada pela nova distância; o lado econômico muda tarifa e vontade de acordo; costumes à direita fecham a fronteira; governo mais autoritário gasta mais com militares e age mais; entra ou sai de blocos e alianças.
- Histórico do país: cada país declara golpes, crises, guerras, governos, empresas e mídias tradicionais. (07/nov)

**Ligações:**
- Recebe: leis do país jogado (Leis), que movem a bússola dele; economia do jogador (Economia).
- Entrega: preço e oferta do mundo (Economia); papéis na mesa (Leis, Política); reputação e segurança externa (índices).

**Referências:** FMI, Banco Mundial, SIPRI, ONU Comtrade, V-Dem, V-Party, Global Party Survey, CHES. Jogo de referência para país com IA: **ESTUDAR**.

**No motor hoje:** ✅ R15.1 potências com bússola, peso e relações (inventadas, falta trocar pelos 30 reais). ☐ R15.7 países reais. ☐ R15.8 país leve. ☐ R15.10 governos que já existiram. Passo 13 da ordem de construir. O `mundo.md` ainda descreve as potências inventadas até o passo 13 trocá-las. A potência que muda de posição sozinha ficou fora da primeira versão do motor (02/nov); o GDD (12/nov) é a meta e o motor está atrás.

**Em aberto:** o jeito de cada país (pragmático, ideológico, agressivo) hoje é palpite na aba Países; conferir por busca rápida na hora de calibrar.

### 7.2 A IA dos países e o cardápio

**O que é:** o jeito como os países leves decidem o que fazer entre si e com o jogador.

**O jogador:** recebe como papel na mesa o que toca nele (proposta, ou aviso com 1 turno para reagir).

**Peças:**
- IA em 3 passos por turno: lê, decide, age.
- Cardápio: comércio, dinheiro, segurança, palavra.
- Linhas vermelhas.
- Jeito do país.

**Regras (12/nov):**
- Lê (distância na bússola, comércio, o que cada país fez com ele), decide no mesmo cardápio do jogador e age.
- Comércio: acordo, tarifa, sanção num produto. Dinheiro: investe, empresta barato, ajuda; ou tira o capital e corta o crédito. Segurança: aliança, pede base; rival e, no fim, ataque, só país forte contra inimigo de defesa fraca. Palavra: visita, apoio ou crítica em público, chamar o embaixador.
- Linhas vermelhas mexem forte e rápido: virar ditadura (para os democráticos), atacar ou sancionar aliado dele, calote, pegar empresa dele sem pagar, fugir das inspeções nucleares.
- Jeito: pragmático (pesa comércio), ideológico (pesa bússola) ou agressivo (pesa força); o mesmo ato irrita um e quase não mexe no outro.
- Um degrau por vez, com aviso: nada vai de amigo a sanção num turno.
- Guerra ou sanção entre dois países leves mexe nos preços do mercado do jogador.
- Financiamento: outros países podem pagar organizações por interesse; todo pagamento deixa rastro.

**Ligações:**
- Recebe: bússola e governo do país jogado (Leis); comércio (Economia).
- Entrega: papéis na mesa; preços (Economia).

**Referências:** nenhuma citada. **ESTUDAR** (IA diplomática em jogos de estratégia).

**No motor hoje:** ◐ R15.3 a opinião das potências anda; falta o cardápio. ☐ R15.9 IA em 3 passos. Teste esperado: virar ditadura derruba a opinião dos democráticos em um turno; nada vai de amigo a sanção num turno só.

**Em aberto:** nenhum além do que está em 7.1 (países que mudam por dentro).

### 7.3 Opinião, relação e reputação

**O que é:** o quanto cada país gosta de cada outro. Vira a relação que a tela mostra e a reputação internacional do jogador.

**O jogador:** vê cada país como inimigo, rival, neutro, amigo ou aliado; aproximar-se de A faz os rivais de A desconfiarem dele.

**Peças:**
- Opinião de cada país sobre cada outro.
- Relação (faixas da opinião).
- Reputação internacional.
- Opinião da potência sobre o país jogado, pela bússola.

**Regras:**
- A meta é a do GDD (12/nov): opinião de −100 a +100 entre todos os países; anda com a distância na bússola, o comércio e o que um fez com o outro. Vira a relação.
- Reputação internacional = média das opiniões sobre você, pesada pelo tamanho de cada país. O `peso` declarado de cada potência no motor é tratado como o mesmo que o tamanho.
- As leis deixam de mexer direto na reputação; a bússola faz o trabalho.

**Ligações:**
- Recebe: leis (Leis) pela bússola; comércio (Economia).
- Entrega: reputação internacional e segurança externa (índices); opinião de potência sobre ditadura (Política).

**Referências:** a curva da opinião é decisão do autor de 01/nov, sem estudo citado. **ESTUDAR**.

**No motor hoje (o motor está atrás do GDD):**
- ✅ R15.2 reputação e segurança externa. ◐ R15.3. ☐ R15.12 tela do Mundo com ranking e ficha. O mapa mostra as potências e a opinião de cada uma (02/nov).
- Posição do país na bússola = média das leis vigentes, eixo por eixo; todas as leis valem igual (01/nov e 02/nov).
- Opinião desejada = 100 × (1 − f²), com f = distância ÷ 2√2. Curva, não reta (01/nov).
- Opinião de 0 a 100 por potência, só pela bússola do país jogado; a cada turno anda 10% da distância até a desejada; separada da opinião dos pops. Relação entre potências de −1 a +1, igual nos dois lados.
- Reputação = média das opiniões das potências, pesada pelo `peso` (soma 1). O índice que a recebe é declarado em `potencias.json`.
- O validador recusa potência sem posição, peso fora de 0 a 1, relação faltando ou diferente nos dois lados.

**Em aberto:**
- A escala da opinião do motor fica como está até virar −100 a +100; hoje as potências não chegam a odiar o país porque faltam leis nas pontas; testar de novo com mais leis.
- A curva 100 × (1 − f²) continua na escala nova?
- Se o `peso` declarado não for igual ao tamanho do país, qual dos dois pesa na reputação?

### 7.4 Comércio e preços de fora

**O que é:** o mercado do mundo, que fornece o que falta ao país e compra o que sobra, com preço próprio que o país não controla.

**O jogador:** vê no mercado do mundo o que está em alta ou em baixa e quem vende mais barato; sente a sanção ou a guerra de fora no preço do mercado dele.

**Peças:**
- Dois mercados: o do país e o do mundo, com ciclos e choques de preço.
- Cobertura por produto, do país e de cada potência.
- Preço do mundo por produto.
- Ciclo e choque.
- Leis de comércio exterior: Tarifa de importação, Facilitação aduaneira, Zonas francas, Imposto e Subsídio à exportação, Defesa comercial, Controle de exportação, Venda de armas ao exterior, Triagem de compra estrangeira, Remessa de lucro e Fábrica estrangeira.
- Câmbio: valor da moeda contra o mundo.

**Regras:**
- Importa o que falta e exporta o que sobra, pelas tarifas, subsídios e acordos (leis).
- Produto que falta vem do mercado do mundo ou fica faltando; nunca aparece do nada. A sobra é vendida a alguém ou fica parada. (14/nov)
- Preço do mundo: alvo = 100 × (demanda ÷ oferta)^1,5, entre 40 e 250; anda 25% do caminho por turno, mais ruído de ±2% que depende só do turno e do produto. (02/nov)
- Ciclo: a demanda do mundo ondula igual para todos, fator = 1 + 8% × sen(2π × turno ÷ 24), ou seja, 4 anos. (02/nov)
- Choque: a cada turno, cada produto sem choque tem 2% de chance; fator de 1,3 a 1,8 (ou o inverso); some 40% por turno; termina abaixo de 2%. Sorteio por turno e produto, não gasta o acaso da partida. (02/nov)
- Ciclo e crise de verdade (14/nov): vêm quando o mundo tiver países funcionando. Complementam o ciclo de 4 anos e os choques de preço que já existem; não os trocam. O Victoria 3 não tem ciclo e crise, e o SisGov vai ter.
- Sanção passa pelo mercado: se o país que sanciona é o maior produtor de um produto, ele fica caro no mercado do jogador; quanto mais depende, mais dói.
- A tarifa recai quase toda sobre quem compra; abrir o comércio sobe a produtividade com ganhadores e perdedores.
- Nenhuma lei dá lucro a um produto; leis mexem em demanda e custo. (08/nov)
- O mercado do mundo ainda lê as potências como fornecedoras; a dependência de uma potência é a média do que o país compra dela.

**Ligações:**
- Recebe: leis de comércio (Leis); sanções e guerra entre países leves (Mundo).
- Entrega: preço e falta de produto (Economia); fome (Gosto); câmbio e dívida externa (Economia).

**Referências:** Victoria 3, só como ideia, e o documento `mercado-vic3-referencia.md`.

**No motor hoje:** ✅ preço do mundo, ciclo e choque por produto (fatia 5a, 02/nov). ◐ R16.4 tarifa, subsídio e acordo pela metade. ☐ R15.4 sanção pelo mercado. Ciclo e crise de verdade: ☐.

**Em aberto:** régua por setor no comércio exterior; sanção que passa pelo mercado.

### 7.5 Posições por país, atos, sanções e aliança

**O que é:** o menu que abre ao clicar num país. O jogador decide o nível de cada relação só para aquele país. Não são leis.

**O jogador:** aproxima-se ou afasta-se de um país; cada ação muda a opinião dele e a dos aliados e rivais dele.

**Peças:**
- Posições por país: relações diplomáticas, acordo comercial, aliança militar, base estrangeira, sanções, operações no exterior, extradição e polícia, ajuda dada, ajuda condicionada aceita e proteção ao investidor.
- Leis do país todo: Verba da diplomacia, Tribunal internacional, Inspeções nucleares, Aprovação de tratados (presidente, Congresso ou referendo) e Alcance das sanções.
- Atos do presidente com países: visita de Estado, receber o líder, apoiar ou criticar em público, mediar conflito entre dois países.

**Regras:**
- Posição por país: nível decidido no menu do país que fica valendo, como Sanções e Aliança. (08/nov)
- Ato acontece uma vez (visita de Estado é exemplo). (08/nov)
- As opções do menu de país ou companhia são decisões (Ato ou Operação), e as leis as controlam (Alcance das sanções, Aprovação de tratados, Indenização, Autorização para estatizar e vender). (08/nov)
- Sanção ou alinhamento: aproximar-se de A faz os rivais de A desconfiarem.
- Acordo de pesca é Posição por país.
- Ditadura que funciona custa caro: sanções, investimento de fora caindo, gente estudada indo embora. (12/nov)
- Investigação de financiamento estrangeiro de organização pode gerar sanção e escândalo.

**Ligações:**
- Recebe: leis de diplomacia (Leis); dinheiro e verba (Economia).
- Entrega: opinião dos países, reputação e segurança externa (índices); preços (Economia).

**Referências:** nenhuma citada para o menu. **ESTUDAR** (diplomacia em jogos de estratégia).

**No motor hoje:** ◐ R7.16 tipos de lei: Lei com prazo e Ato feitos; Posição por país falta (☐ R15.11, posições por país no menu do país). ☐ R15.4 sanção pelo mercado.

**Em aberto:** custo e duração dos atos com países ficam para as narrativas (ver 9.4).

### 7.6 Segurança externa, ataque e guerra fora do jogo

**O que é:** o quanto o país está seguro de fora. Cai quando país forte não gosta dele. O país pode ser atacado, mas não revida nem começa guerra.

**O jogador:** vê a segurança cair se o mundo o desgosta; sofre ataque com custo em economia, vidas e aprovação; defende-se pelas leis militares.

**Peças:**
- Segurança externa e poder defensivo.
- Ataque externo.
- Guerra entre países leves, só como efeito nos preços.

**Regras:**
- Segurança externa = poder defensivo − (100 − reputação), travada em 0 a 100. Sem limiar: quanto pior a opinião, maior a perda. (02/nov)
- Os dois índices são declarados em `potencias.json` (opcionais); o motor não sabe os nomes. Calculada na etapa do mundo, no turno 0 também.
- Um ataque cobra economia, vidas e aprovação; a defesa vem das leis militares.
- Guerra iniciada pelo país está fora do jogo pronto (decidido).
- Ataque entre países: só país forte contra inimigo de defesa fraca, no fim da escada de segurança.
- Guerra civil (dentro do país) vem de grupos grandes com raiva e armas divididas. (12/nov)
- Crise com força do governo baixa traz golpe ou guerra civil nos países leves.
- Vírus para fins militares: decidir na Defesa se vira lei ou degrau. (09/nov)

**Ligações:**
- Recebe: reputação (Mundo); leis militares (Leis); demanda por tamanho das forças (Economia).
- Entrega: economia, vidas e aprovação (Economia, Gosto, Política).

**Referências:** SIPRI para poder militar. Mais: **ESTUDAR**.

**No motor hoje:** ◐ segurança externa feita; o ataque em si "fica para depois". ☐ R15.5 ataque externo sem revide.

**Em aberto:** como um ataque acontece e como termina.

---

## Parte 9. Narrativas e eventos

### 9.1 A mesa de fatos

**O que é:** a memória curta da partida, como uma RAM. Cada módulo escreve o que aconteceu e lê o que precisa.

**O jogador:** vê os fatos como manchetes no Resultado do turno. Vê o fato que muda um placar do Congresso.

**Peças:** ficha do fato (tipo, turno, tamanho, sobre, quem, lado) e a lista de tipos.

**Regras (12/nov, R4.12):**
- Cada etapa do turno põe na mesa o que fez.
- O módulo pergunta só o que interessa (por tipo, assunto, envolvido, tamanho mínimo ou turno); ninguém percorre a lista.
- Fato gera fato: quem vem depois na ordem das etapas já lê o novo.
- Some aos poucos: pequeno 1 turno, médio 2, grande 3; a força cai a cada turno.
- A mesa é curto prazo; o que deve durar mais (rancor, promessa quebrada) o módulo guarda no próprio estado.
- Nenhum módulo chama outro; eles se encontram só na mesa.
- Tipo novo: acrescentar em `TIPOS_DE_FATO` e na tabela.
- Hoje há 31 tipos, de lei aprovada a eleição vencida, juiz nomeado, regra fiscal estourou, escândalo e grupo com raiva.

**Ligações:**
- Recebe: Congresso, Política, Mesa, Programas, Eleição, Judiciário, Contas.
- Entrega: jornal (Mídia), grupos (Gosto) e Congresso (Política).

**Referências:** nenhuma de jogo; é arquitetura do projeto.

**No motor hoje:** ✅ R4.12. Não escrevem fato ainda: ministro, instituição, economia, mundo.

**Em aberto:**
- Quais mecânicas ainda não escrevem fato e quais fatos cada uma precisa.
- Regras de encadeamento (escândalo → CPI → queda).
- A ordem das etapas do turno com mídia, organizações e mundo entrando.

### 9.2 Gatilhos

**O que é:** um índice que sobe ou passa de um limite dispara uma narrativa (por exemplo, "os sindicatos estão crescendo no país").

**O jogador:** sente o país vivo: o texto lê os números. Hoje o jogador, o que quer que faça, não sente modificação, e isso é o que o autor chama de não jogável.

**Peças:** índices visíveis e invisíveis; limites. O invisível o motor calcula e o jogador só sente pelo que acontece (greve, surto, notícia).

**Regras:**
- Índice é gatilho (07/nov).
- Cada instituição ganha quantos índices fizerem sentido (aba Índices, coluna Na tela).
- Os gatilhos só se escrevem com as narrativas, depois do motor e dos índices prontos (07/nov). "Depois do motor e dos índices prontos" e "depois da V1 jogável" contam como a mesma coisa: o marco é um só. Ele vem depois da V1 jogável.
- Agora: criar índices (visíveis e invisíveis) por esfera; não escrever gatilhos.
- Dados primeiro, narrativa depois.

**Ligações:**
- Recebe: índices (Economia, Gosto, Leis).
- Entrega: eventos e manchetes.

**Referências:** nenhuma citada. **ESTUDAR** (gatilho por limite de índice).

**No motor hoje:** ☐ nada. Existe o motor de deriva, que move um índice empurrado por outro (ver 9.5). Não há passo próprio para as narrativas na ordem de construir.

**Em aberto:** o que vários índices batendo metas juntos significam.

### 9.3 Eventos e crises

**O que é:** coisas que acontecem sozinhas no país, saídas dos dados, e que chegam ao jogador como papel na mesa.

**O jogador:** recebe a situação com 2 ou 3 respostas, cada uma com ganho e custo; esperar é uma opção, a pior.

**Peças:**
- Família "Crises" da mesa (índices e eventos): enchente, greve, banco quebrando, apagão.
- Eventos de cada setor, já desenhados no GDD: apagão; queimadas e vazamentos; seca, colapso da pesca, carne contaminada; desastre de Defesa civil; resgate de bancos; massacre no campo.
- Choque de preço do mundo.
- Fatos aleatórios do turno: escândalo, choque de preço, atentado.

**Regras:**
- O papel nasce do estado do país e das fichas, sem roteiro. (11/nov)
- Prazos (11/nov, calibrar no fim): situação urgente 1 turno (piora, vira crise e manchete); situação calma 3 turnos (quem pede fica chateado e a oferta some).
- Ignorar tem consequência: situação piora; enchente sem verba vira crise e manchete.
- O desastre chega sozinho: a gravidade sai do clima e do país; o estrago é a gravidade menos o índice Preparo contra desastres.
- O papel tem povo: o que houve, quem sofre (com nome e voz), o que fazer. O mesmo texto sai como notícia.
- O apagão é evento: acontece num estado que precisa de mais energia do que recebe, mesmo com energia sobrando no país.
- Resgate de bancos é evento, não lei: cada banco que quebra tem ficha e o jogador escolhe (deixar quebrar, estatizar, emprestar com condições, salvar sem condições).
- Crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à moeda) são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.
- Massacre no campo chega como papel; dono na fila desmata para provar que produz; Liberação de armas sobe o Conflito no campo.
- Emissões são conta por companhia; queimadas e vazamentos são eventos.
- Ciclo e crise de verdade quando o mundo tiver países funcionando (14/nov). Complementam o ciclo de 4 anos e os choques que já existem (ver 7.4).
- Sem sorteio para a lei passar; a aprovação vem do Congresso e dos grupos, nunca de um dado. O placar previsto é o real.

**Ligações:**
- Recebe: índices e fichas (Economia, Gosto, Leis); clima e preparo.
- Entrega: papel na mesa (Leis, Política); manchete (Mídia); raiva e escândalo (Gosto, Política).

**Referências:** Victoria 3 não tem ciclo e crise. Referência de eventos de decisão: **ESTUDAR**.

**No motor hoje:** ◐ R17.13 prazos: ignorar tem consequência; falta crise e aliado se afastar. ◐ R17.7 só família Leis e vaga de juiz. Falta crises, pedidos, ofertas, instituições, partido como papel. Só o choque de preço do mundo roda hoje.

**Em aberto:**
- Como as situações (crises) saem dos dados.
- Crise que piora no prazo e aliado que se afasta.
- Como o evento "Papéis duvidosos" entra na mesa.
- Cada setor já tem seus papéis desenhados no GDD (5.12).

### 9.4 Atos com custo e duração

**O que é:** os atos do presidente com a mídia e com países, que precisam de custo e duração.

**O jogador:** escolhe um ato (entrevista, pressão, processo, notícia falsa; visita de Estado, receber o líder, apoiar ou criticar em público, mediar).

**Peças:** os atos já listados em 6.6 e 7.5.

**Regras:** nenhuma ainda de custo e duração. Ato é "acontece uma vez". (08/nov)

**Ligações:** Mídia e Mundo.

**Referências:** **ESTUDAR**.

**No motor hoje:** ☐ R14.11. ☐ R15.11.

**Em aberto:** custo e duração dos atos com a mídia e dos atos com países (para as narrativas, depois da V1 jogável).

### 9.5 O acaso e a deriva

**O que é:** o sorteio com semente (acaso) e o índice que anda sozinho pelos turnos (deriva).

**O jogador:** mesma semente e mesmos pedidos, mesma partida. Sente o país parado até algo mudar, e depois andar.

**Peças:**
- Acaso: sorteio com semente (mulberry32); o estado do gerador fica no estado da partida; função pura `sortear`.
- Deriva: índice que anda empurrado por outro (o "processo").

**Regras:**
- Acaso: mesma semente e mesmos pedidos, mesma partida.
- Deriva (aprovado em 04/nov/2026): o índice é base + leis; a deriva move a base, um pouco a cada turno.
- Quem empurra mede contra o turno 0: o país começa parado e só anda quando algo muda.
- Passo por turno = sentido × taxa × (quem empurra hoje − no turno 0) × escala. Taxa: fraca 2%, média 5%, forte 10% da distância.
- A base fica dentro do domínio, contando as leis: não acumula além do teto.
- As ligações ficam no mundo (`mundo/indicadores/derivas.json`); o motor não sabe os nomes.
- Não equilibrado: a taxa só dá a direção.
- Humor da bolsa nasce de alta recente, crédito, confiança e notícias, sem sorteio.
- A aprovação de lei nunca usa sorteio.

**Ligações:** Economia (índices) e Gosto (índices) por deriva; Mundo, preço de fora por choque sorteado.

**Referências:** nenhuma citada.

**No motor hoje:** ✅ `acaso` e `deriva` existem no motor (aprovado em 04/nov/2026).

**Em aberto:** quanto o acaso entra nos eventos (9.3). Não há fonte. Pergunta ao autor.

<!-- revisor:
Tirei por superado: "mídia como fonte do gosto" (C3, virou lente); potências inventadas como alvo (países reais, 08/nov); opinião 0 a 100 do motor como regra (virou "No motor hoje", a meta é -100 a +100); "potência que muda sozinha fica de fora" (meta é mudar por dentro); marcação de nome real como conflito.
Acrescentei a seção 6.1 (lente nas 3 mecânicas) só com o que as fontes já diziam; o resto ficou ESTUDAR. Ela fica no topo, então a numeração da Mídia vai de 6.1 a 6.6 (rascunho tinha VII.1 a VII.5).
Peso da reputação: tratado como igual ao tamanho do país (decisão do pedido). Fui para Em aberto só o caso de não serem iguais.
Ciclo e crise de verdade: tratado como complemento do ciclo de 4 anos e dos choques (7.4, 9.3).
Narrativas: "depois do motor e dos índices" = "depois da V1 jogável" (9.2).
Adicionei em 7.5 a linha R7.16 (Posição por país falta) vinda de 08-conflitos A; adicionei em 6.5 "radicais nascem da piora do padrão de vida" (C4), pois a seção trata de radicais.
Em aberto vindo de conflito não resolvido: a curva 100 x (1 - f^2) na escala nova (7.3).
Observação fora de conflito: tipos escandalo/manchete-contra só lidos pelo Congresso é estado, ficou em No motor hoje (6.4).
-->
