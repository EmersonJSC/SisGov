# VII. Mídia, VIII. Mundo e X. Narrativas e eventos

> Rascunho de 14/nov/2026. Só junta o que já está decidido nas fontes. Nada foi
> inventado. Toda frase leva a fonte entre colchetes. Conflito entre fontes vem
> marcado "⚠ CONFLITO" e não foi resolvido.
>
> Legenda do motor: ✅ feito, ◐ pela metade, ☐ falta. R = requisito em
> `requisitos.md`.
>
> Fontes curtas: gdd.md, mecanicas.md, requisitos.md, midia.md
> (`src/motor/midia/`), mundo.md (`src/motor/mundo/`), fatos.md
> (`src/motor/fatos/`), acaso.md, deriva.md, mercado.md (`src/motor/mercado/`),
> Países.tsv e Países-governos.tsv (`gdd-novo/fontes/`, abas "leis - Países" e
> "leis - Países - governos").

## O lugar das três partes no jogo

- O jogo tem três grandes mecânicas (Gosto/população, Economia, Leis). Mídia,
  Mundo e Narrativas ficam em volta delas. [pedido do autor ao rascunho]
- O ciclo do jogo é: a economia mexe no pop, o pop mexe na política, a política
  (as leis) mexe na economia. [mecanicas.md:42-43]
- Princípio 8: dados primeiro, narrativa depois. Primeiro os números que o
  texto vai ler; frases, manchetes e eventos leem esses números. [gdd.md:117-118]
- Princípio 2.4: o país vive sozinho. Empresas abrem e fecham, a mídia escolhe
  lado, os outros países mudam de ideia. [gdd.md:57-59]
- Decidido em 13/nov: hoje a mídia não pesa em nada. O jornal só mostra
  manchetes; nenhuma notícia mexe em grupo, voto ou aprovação. [gdd.md:2085-2089]

---

# VII. Mídia

## VII.1 Emissoras e redes

1. **O que é:** as 8 maiores mídias do país (mais as redes), cada uma com dono,
   lado na bússola, audiência por grupo e credibilidade. [gdd.md:1093-1097]
2. **O que o jogador faz e sente:** governa sabendo que cada lei passa por um
   filtro, e pode mexer nesse filtro, pagando por isso. [gdd.md:1090-1091]
   O grupo sente a lei pelo que assiste. [gdd.md:1099-1100]
3. **Peças:**
   - Emissora: dono (privado, estatal, estrangeiro ou rede), bússola, audiência
     (fração de cada grupo, de 0 a 1), credibilidade (0 a 100). [midia.md:17-19]
   - Gerador de audiência: perto na bússola, mais; longe, quase nada; vezes o
     alcance da mídia. [midia.md:21-22]
   - Redes: sem dono único, rápidas, polarizam, espalham boato quando a
     instrução é baixa. [gdd.md:1108-1109]
   - Perfil da emissora e dos jornalistas, na rede social. [gdd.md:1118-1120]
   - Mídia é empresa: tem lucro, dono e pode ser comprada na bolsa. [gdd.md:1110]
4. **Regras decididas:**
   - O país declara as 8 maiores com nome e especificações. Se não declarar, o
     gerador de empresas cria a partir do histórico do país. [gdd.md:1093-1095]
     (07/nov) [gdd.md:160-164]
   - Nomes seguem a regra de conteúdo: nenhuma empresa real; o que tem marca ou
     dono ganha nome alternativo parecido. [gdd.md:164] [gdd.md:2201-2205]
   - Dono que muda de lado: a posição anda para a do novo dono em alguns turnos;
     redação forte e credibilidade alta freiam. Estatal muda com o governo; da
     bolsa, com quem comprou; de família quase não é vendida; estrangeira segue o
     interesse de fora. [gdd.md:1132-1135]
   - Emissora estatal: audiência própria, credibilidade baixa no início.
     [gdd.md:1105-1106]
   - O partido tem mídias aliadas e porta-voz. Aliada pega em engano perde
     credibilidade junto. [gdd.md:1144-1145]
   - Índices da mídia: Liberdade de imprensa, Credibilidade da imprensa,
     Concentração da mídia, Desinformação, Polarização, Violência contra a
     imprensa. [gdd.md:1151-1152]
5. **Ligações:**
   - Recebe: grupos (audiência por grupo) [midia.md:18-19]; dono e bolsa
     (Economia) [gdd.md:1110]; lei de mídia (Leis) [gdd.md:1104-1107].
   - Entrega: filtro da opinião do grupo (Gosto/população) [gdd.md:1098-1100];
     fatos do turno (Política) [requisitos.md:321].
6. **Referências:** os índices da mídia vêm do acervo de leis e índices, sem
   jogo de referência citado nas fontes. **ESTUDAR** (como outros jogos tratam
   mídia como filtro).
7. **No motor hoje:** ◐ R14.1, Brasil com 8 mídias inventadas e as redes no
   estado; ninguém lê audiência nem credibilidade. [requisitos.md:304]
   [midia.md:19-20] ☐ R14.5 leis de mídia agindo. [requisitos.md:311]
   ☐ R14.6 redes. [requisitos.md:312] Só o Brasil tem `midias.json`.
   [midia.md:50] Perfil da mídia e das redes na tela também falta. [midia.md:49]
8. **Em aberto:**
   - Nomes parecidos com os reais, como os juízes? [mecanicas.md:802]
   - A mídia vira empresa na bolsa: como liga a Companhias (5.6) e Bolsa (5.8)?
     [mecanicas.md:801]
   - Emissora estatal: audiência e credibilidade em números. [mecanicas.md:800]

## VII.2 Noticiário: jornal e pauta

1. **O que é:** o jornal do turno, que traz as notícias de maior impacto, e a
   pauta, que é o que cada mídia escolhe noticiar. [gdd.md:1115-1119]
2. **O que o jogador faz e sente:** lê as manchetes do turno no mapa
   (princípio 8) [gdd.md:1103]; na rede social abre o perfil da emissora e vê o
   que ela anda postando sobre o país. [gdd.md:1119-1120]
3. **Peças:**
   - Impacto: peso do tamanho (1, 2, 3) × força do fato × apelo do tipo. O jornal
     guarda as 3 maiores. [midia.md:29-34]
   - Manchetes: molde por tipo de fato, com `{lei}`, `{quem}`, `{caixa}`,
     `{area}`, `{programa}`. [midia.md:38-42]
   - Pauta: cada mídia escolhe uns 3 fatos por turno. [gdd.md:1115-1117]
   - Enquadramento: o efeito de uma lei na opinião passa pela mídia.
     [gdd.md:1098-1100]
4. **Regras decididas:**
   - O jornal roda na etapa 9b, depois de todos os módulos que escrevem fatos;
     só entram fatos deste turno. [midia.md:26-28]
   - O texto das manchetes é do mundo (`mundo/jornal/manchetes.json`); o motor
     não conhece texto. [midia.md:7-11]
   - Tipo de fato novo precisa de molde, e um teste confere. [midia.md:41-42]
   - Pauta: escolhida pelo tamanho do fato, o lado da mídia, o interesse do dono
     e o medo (censura, corte de verba). O que ela repete vira o assunto mais
     importante para quem assiste. [gdd.md:1115-1117]
   - Enquadramento: mídia longe de você amplia quem perde; mídia perto amplia
     quem ganha. [gdd.md:1098-1100]
   - Pauta e escândalos: a mídia expõe fichas fracas (honestidade, lealdade) e
     crises; a amiga demora a noticiar, a inimiga corre. [gdd.md:1101-1102]
   - A mídia lê a mesa: vetar lei popular ou assinar lei impopular vira
     manchete. [gdd.md:2007-2008]
5. **Ligações:**
   - Recebe: todos os fatos do turno (Política, Leis, Economia) [requisitos.md:321]
     [midia.md:24-26]; audiência e credibilidade [midia.md:45].
   - Entrega: fatos "manchete contra/a favor" lidos por Congresso e grupos
     [requisitos.md:321]; voto no Congresso (manchete contra tira votos)
     [gdd.md:1011].
6. **Referências:** o jogo antigo Democracy 4 não entra (regra de conteúdo)
   [gdd.md:2200]. Outras referências de noticiário: **ESTUDAR**.
7. **No motor hoje:** ✅ R14.4 jornal do turno, 3 maiores no topo do Resultado
   do turno. [requisitos.md:305] ☐ R14.3 pauta. [requisitos.md:306] ☐ R14.2
   enquadramento. [requisitos.md:307] ☐ R17.9 a mídia lê a mesa.
   [requisitos.md:439] O jornal é um só e neutro; o mesmo fato não sai a favor
   numa mídia e contra noutra ainda. [midia.md:46-47] O jornal não é janela
   própria. [midia.md:48]
8. **Em aberto:**
   - Como o jornal mostra a mesma notícia por mídias diferentes. [mecanicas.md:810]
   - De onde saem os posts da rede da emissora (dos fatos e da pauta) e se é a
     mesma rede do perfil das pessoas. [mecanicas.md:816-817]
   - Teste esperado: o mesmo fato sai a favor na mídia perto do governo e contra
     na longe. [requisitos.md:323]

## VII.3 Fato e versão, mentira, escândalo e vazamento

1. **O que é:** todo fato do turno tem uma verdade, e pode sair numa versão fiel,
   enviesada ou falsa, em qualquer mídia, inclusive a sua. [gdd.md:1111-1113]
2. **O que o jogador faz e sente:** pode plantar notícia falsa, vazar dado à
   mídia amiga ou abafar escândalo, sabendo que descoberta vira escândalo.
   [gdd.md:1121-1125] [gdd.md:1146-1147]
3. **Peças:**
   - Versão: fiel, enviesada, falsa. [gdd.md:1111-1112]
   - Mentira descoberta (regra de descoberta). [gdd.md:1126-1131]
   - Escândalo em ciclo: semente, investigação, publicação, repercussão,
     desgaste, esquecimento. [gdd.md:1146-1147]
   - Vazamento: fonte, jornalista, publicação; seu, de rival ou da agência.
     [gdd.md:1148]
   - Jornalistas: perfis na rede, redação forte ou fraca; o investigativo
     descobre segredos; pode ser ameaçado, preso ou agredido. [gdd.md:1149-1150]
4. **Regras decididas:**
   - O pop acredita conforme a credibilidade; a verdade só aparece com
     investigação. Engano descoberto derruba a credibilidade de quem publicou.
     [gdd.md:1112-1114]
   - A cada turno que uma versão falsa circula, a chance de ser descoberta sobe
     com: redação forte das mídias longe de você, Liberdade de imprensa,
     Independência dos investigadores, checagem e instrução alta, tamanho da
     mentira, pessoas que sabem e tempo. Cai com censura, medo, corrupção e mídia
     amiga dominante. [gdd.md:1126-1130]
   - Descoberta vira escândalo; se o rastro chega ao presidente, cai a
     honestidade. Só enviesada é difícil de provar. [gdd.md:1130-1131]
   - A mesma regra da mentira descoberta vale para o rastro do papel duvidoso na
     mesa (corrupção). [gdd.md:1994-1997]
   - Espiar alguém fica num registro que pode vazar e virar escândalo; a chance
     sobe com a importância de quem foi espiado. [gdd.md:190-196]
   - Estatística: o presidente pode esconder os números da mídia ou mentir neles;
     o jogador vê o índice real, a mídia vê com atraso e desconfiança (13/nov).
     [gdd.md:2038-2040]
5. **Ligações:**
   - Recebe: índices (Liberdade de imprensa, Independência dos investigadores)
     [gdd.md:1127-1128]; rastro da corrupção (Leis, Política) [gdd.md:1994-1997].
   - Entrega: escândalo a Política e ao Congresso (honestidade, impeachment, CPI)
     [gdd.md:1996-1997]; credibilidade da mídia [gdd.md:1114].
6. **Referências:** nenhuma citada. **ESTUDAR** (ciclo de escândalo em jogos
   políticos).
7. **No motor hoje:** ☐ R14.10 fato e versão, mentira descoberta.
   [requisitos.md:310] Os tipos `escandalo` e `manchete-contra` existem na mesa de
   fatos, mas só o Congresso os lê, por ora. [fatos.md:54-55]
8. **Em aberto:**
   - A regra da descoberta serve também ao rastro de corrupção e ao Espiar: uma
     regra só? [mecanicas.md:827-828]
   - Escândalo em ciclo e vazamento: regras e números. [mecanicas.md:832-834]
   - Jornalistas: perfis, redação, ameaça. [mecanicas.md:838-839]

## VII.4 A mídia muda o lado do pop e mobiliza a raiva

1. **O que é:** duas coisas diferentes. A mídia empurra o pop na bússola, devagar.
   E a mídia faz a raiva do grupo subir, rápido. [gdd.md:1153] [gdd.md:1168]
2. **O que o jogador faz e sente:** vê no mapa uma seta para onde o grupo vai na
   bússola e qual mídia empurra; vê o grupo pulsar vermelho e sair manchete.
   [gdd.md:1164-1165] [gdd.md:1178]
3. **Peças:**
   - Deriva do pop pela mídia que assiste. [gdd.md:1154-1155]
   - Bolha e polarização. [gdd.md:1156-1157]
   - Redes empurram mais rápido. [gdd.md:1158-1159]
   - Raiva do grupo, 0 a 100. [gdd.md:1169]
4. **Regras decididas (11/nov):**
   - A cada turno o pop anda um pouco na bússola para as mídias que assiste,
     pesadas pela audiência nele e pela credibilidade. [gdd.md:1154-1155]
   - Bolha: o pop assiste mais a mídia perto dele e larga a longe; a polarização
     nasce sozinha. [gdd.md:1156-1157]
   - Redes: só jovens e engajados, para o lado mais perto do pop, nunca para o
     centro; instrução baixa deixa o boato pegar. [gdd.md:1158-1159]
   - A vida pesa mais que a TV: a mídia muda o lado, a satisfação vem do que a
     lei faz na vida do pop. Mídia que diz o contrário do que ele vive perde
     credibilidade com ele. [gdd.md:1160-1162]
   - Freio: instrução alta e redação forte. [gdd.md:1163]
   - Raiva sobe em 1 ou 2 turnos quando uma mídia repete um fato contra o grupo
     (qualquer mídia, inclusive a do governo, da oposição e das organizações);
     cai sozinha em poucos turnos quando a pauta muda. [gdd.md:1169-1171]
   - Com satisfação alta, pouco efeito. Com satisfação baixa, os radicais crescem
     e o grupo protesta. Com satisfação baixa e organização com líder: greve,
     sabotagem e, poucos, atentado. Vale o limite de cada grupo. [gdd.md:1172-1175]
   - O presidente também mobiliza: a base contra o Congresso derruba a
     paciência; mobilizar demais cria radicais do próprio lado. [gdd.md:1176-1177]
   - O jogador compra ou cria mídia, dá publicidade, censura: efeito em mandatos,
     custo na hora (liberdade, escândalo, reputação). [gdd.md:1166-1167]
5. **Ligações:**
   - Recebe: audiência e credibilidade (Mídia); instrução e redação (índices).
     [gdd.md:1154-1155] [gdd.md:1163]
   - Entrega: bússola do pop (Gosto/população) [requisitos.md:194]; raiva do
     grupo (Gosto/população) [requisitos.md:227]; protesto, greve, atentado
     (Política). [gdd.md:1172-1175]
6. **Referências:** Victoria 3 como ideia geral do ciclo, não da mídia
   [mecanicas.md:42-45]. Para a mídia: **ESTUDAR**.
7. **No motor hoje:** ◐ R8.5, pops deslizam com a vida (feito) e com a mídia
   (falta, R14.8). [requisitos.md:194] ☐ R14.8. [requisitos.md:308] ☐ R14.9.
   [requisitos.md:309] ◐ R11.19, raiva do grupo existe, falta a mídia mobilizar.
   [requisitos.md:227] Fato `grupo-com-raiva`: ninguém escreve nem lê ainda.
   [fatos.md:56]
8. **Em aberto:** a pergunta de como medir a força de um grupo e quanto ela muda
   a popularidade de uma lei, citada na Base do jogo. [gdd.md:2131]

## VII.5 Atos do presidente e leis de mídia

1. **O que é:** o que o presidente faz com a mídia (atos) e as regras permanentes
   sobre ela (leis). [gdd.md:1104-1107] [gdd.md:1121-1125]
2. **O que o jogador faz e sente:** dá entrevista, faz pronunciamento, vaza dado,
   pressiona o dono, corta ou dá publicidade, e escolhe entre segurança e
   risco. [gdd.md:1121-1125] [gdd.md:1136-1141]
3. **Peças:**
   - Atos: entrevista, coletiva, pronunciamento em rede nacional, vazar dado a
     mídia amiga, pressionar o dono, cortar ou dar publicidade, nomear na
     emissora estatal, processar jornalista, negar credencial, plantar notícia
     falsa. [gdd.md:1121-1125]
   - Leis: verba de publicidade do governo, emissora estatal, regulação, limite
     de dono estrangeiro, concessão, censura e banimento. [gdd.md:1104-1107]
   - Campanha: leis Horário eleitoral gratuito e Propaganda paga. [gdd.md:1142-1143]
4. **Regras decididas:**
   - Entrevista amiga é segura; hostil rende mais e pode editar e armar pergunta;
     preparar ou improvisar. [gdd.md:1121-1123]
   - A hostilidade vem da distância da mídia até você, do tema (escândalo aberto
     endurece) e do formato (ao vivo não tem edição, mas arrisca gafe; gravada
     pode ser editada se a mídia é hostil). [gdd.md:1136-1139]
   - Respostas: direto (seguro, rende pouco), desviar para tema parecido
     (funciona se preparado), atacar a mídia (sobe a base, cai a confiança dos
     neutros), improvisar (pode render muito ou virar gafe, conforme carisma e
     honestidade). [gdd.md:1139-1141]
   - Publicidade agrada quem recebe. Censura e banimento calam a mídia e cobram
     liberdades, reputação internacional e radicais. [gdd.md:1104-1107]
   - Plantar notícia falsa é arriscado: descoberta vira escândalo.
     [gdd.md:1125]
   - Campanha: as duas leis decidem quem aparece na mídia na eleição.
     [gdd.md:1142-1143]
   - Regra geral: opções do menu de país ou companhia são decisões (Ato ou
     Operação), não leis; as leis só controlam. (08/nov) [memória leis-x-decisoes]
     Ato é "acontece uma vez". [gdd.md:574-575]
5. **Ligações:**
   - Recebe: carisma e honestidade do presidente (Política) [gdd.md:1140-1141];
     verba (Economia) [gdd.md:1104].
   - Entrega: base e confiança dos neutros (Gosto/população) [gdd.md:1139-1140];
     liberdades e reputação (índices) [gdd.md:1106-1107]; quem aparece na eleição
     (Política) [gdd.md:1142-1143].
6. **Referências:** nenhuma citada. **ESTUDAR** (entrevista como minigame).
7. **No motor hoje:** ☐ R14.5. [requisitos.md:311] ☐ R14.11.
   [requisitos.md:313]
8. **Em aberto:** custo e duração de cada ato com a mídia (entrevista, pressão,
   processo, notícia falsa). Ficam para as narrativas. [gdd.md:2157-2158]
   [mecanicas.md:851-854]

---

# VIII. Mundo

## VIII.1 Os países e as fichas

1. **O que é:** os outros países do mundo, como o jogador os vê e como o motor os
   roda. [gdd.md:1182-1191]
2. **O que o jogador faz e sente:** abre a tela do Mundo, vê o ranking por PIB
   com a relação de cada país com ele, clica num país e abre a ficha.
   [gdd.md:1252-1254]
3. **Peças:**
   - País jogável (11) e país do mundo (30 maiores, vizinhos, resto do mundo).
     [gdd.md:1182-1185]
   - País leve: ficha leve, simulada sem leis nem pops. [gdd.md:1189-1194]
   - Ficha leve: campos listados no GDD e na planilha. [gdd.md:1217-1224]
     [Países.tsv:1]
   - Governos que já existiram, por período, como pontos na bússola.
     [gdd.md:1225-1237]
   - Regime separado da bússola. [gdd.md:1238-1242]
4. **Regras decididas:**
   - Países reais (08/nov): as 10 maiores economias e a Rússia (12/nov) são
     jogáveis. O mundo tem os 30 maiores, mais os vizinhos do país jogado e o
     resto do mundo num bloco só. [gdd.md:1182-1185] [memória project_paises_reais]
     A planilha lista 30 países, 11 jogáveis. [Países.tsv:1-31]
   - Nomes e números reais ficam em arquivo de dados, com data e fonte; o motor
     continua sem conhecer nomes. [gdd.md:1184-1186]
   - Jogar no passado é só outro arquivo de país (Brasil-2026, Brasil-2003); para
     o motor são países diferentes. [gdd.md:1186-1187]
   - Um motor, dois jeitos de rodar (12/nov): só o país jogado roda inteiro; os
     outros são leves; ao escolher um, a ficha leve sai do mundo e a completa
     entra. Não se roda o mundo todo. [gdd.md:1188-1191]
   - País leve: economia resumida (PIB, crescimento, inflação, o que produz,
     compra e vende), governo (lado na bússola, força do governo, poder militar)
     e relação com cada país. [gdd.md:1192-1194]
   - A ficha leve: sistema de governo, regime (V-Dem), jeito, vizinhos; PIB,
     população, crescimento, inflação, dívida e reservas, o que vende e compra
     (3 a 5 produtos), ciência por produto, pobreza e violência (geram migração
     e refugiados); lado na bússola, força do governo (0 a 100), próxima eleição,
     poder militar (0 a 100), arma nuclear; opinião sobre cada país e blocos. Os
     30 usam a mesma ficha; os 11 jogáveis têm também o estado inicial completo.
     [gdd.md:1217-1223]
   - Fontes públicas com data: FMI, Banco Mundial, SIPRI, Comtrade, V-Dem.
     [gdd.md:1223-1224] Dados baixados ficam em `~/Documentos/SisGov-dados/`, fora
     do jogo. [gdd.md:1235-1237]
   - Muda por dentro sem leis: eleição a cada 4 anos (economia mal tende a virar o
     lado) e crise (força do governo baixa traz golpe ou guerra civil).
     [gdd.md:1199-1200]
   - Governos que já existiram (12/nov): a cada eleição (no partido único, troca
     de ala) o novo governo cai perto de um ponto da história, com pouca sorte.
     Crise econômica puxa para pontos do lado oposto; muito imigrante chegando
     puxa para os mais tradicionais. [gdd.md:1225-1231]
   - Pontos dos estudos (12/nov): econômico do V-Party (V-Dem); costumes de 6
     medidas do V-Party ajustadas à escala GAL-TAN do Global Party Survey; Europa
     depois de 2019 pelo CHES 2024. [gdd.md:1232-1236] A planilha traz 191 linhas
     de governo por país e período. [Países-governos.tsv:1-192]
   - Regime separado da bússola (12/nov): a bússola diz o que o governo quer; o
     regime (4 do V-Dem) diz como segura o poder. Não se somam; os dois pesam na
     opinião entre países. O sistema de governo é uma terceira coluna.
     [gdd.md:1238-1242]
   - A virada muda o país: opinião recalculada pela nova distância; o lado
     econômico muda tarifa e vontade de acordo; costumes à direita fecham a
     fronteira; governo mais autoritário gasta mais com militares e age mais;
     entra ou sai de blocos e alianças. [gdd.md:1243-1247]
   - Histórico do país: cada país declara golpes, crises, guerras, governos,
     empresas e mídias tradicionais. (07/nov) [gdd.md:160-162]
5. **Ligações:**
   - Recebe: leis do país jogado (Leis), que movem a bússola dele
     [mundo.md:29-35]; economia do jogador (Economia) [requisitos.md:344].
   - Entrega: preço e oferta do mundo (Economia) [mercado.md:25-30]; papéis na
     mesa (Leis/Política) [gdd.md:1197-1198]; reputação e segurança externa (índices).
     [mundo.md:52-65]
6. **Referências:** FMI, Banco Mundial, SIPRI, ONU Comtrade, V-Dem, V-Party, Global
   Party Survey, CHES. [gdd.md:1223-1224] [gdd.md:1232-1236] Jogo de referência
   para país com IA: **ESTUDAR**.
7. **No motor hoje:** ✅ R15.1 potências com bússola, peso e relações (inventadas,
   falta trocar pelos 30 reais). [requisitos.md:327] ☐ R15.7 países reais.
   [requisitos.md:330] ☐ R15.8 país leve. [requisitos.md:331] ☐ R15.10 governos
   que já existiram. [requisitos.md:333] Passo 13 da ordem de construir.
   [requisitos.md:476]
8. **Em aberto:** o jeito de cada país (pragmático, ideológico, agressivo) hoje é
   palpite na aba Países; conferir por busca rápida na hora de calibrar.
   [gdd.md:2152-2153]

## VIII.2 A IA dos países e o cardápio

1. **O que é:** o jeito como os países leves decidem o que fazer entre si e com o
   jogador. [gdd.md:1195-1198]
2. **O que o jogador faz e sente:** recebe como papel na mesa o que toca nele
   (proposta, ou aviso com 1 turno para reagir). [gdd.md:1213-1215]
3. **Peças:**
   - IA em 3 passos por turno: lê, decide, age. [gdd.md:1195-1198]
   - Cardápio: comércio, dinheiro, segurança, palavra. [gdd.md:1201-1207]
   - Linhas vermelhas. [gdd.md:1208-1210]
   - Jeito do país. [gdd.md:1211-1212]
4. **Regras decididas (12/nov):**
   - Lê (distância na bússola, comércio, o que cada país fez com ele), decide no
     mesmo cardápio do jogador e age. [gdd.md:1195-1198]
   - Comércio: acordo, tarifa, sanção num produto. Dinheiro: investe, empresta
     barato, ajuda; ou tira o capital e corta o crédito. Segurança: aliança, pede
     base; rival e, no fim, ataque, só país forte contra inimigo de defesa fraca.
     Palavra: visita, apoio ou crítica em público, chamar o embaixador.
     [gdd.md:1203-1207]
   - Linhas vermelhas mexem forte e rápido: virar ditadura (para os democráticos),
     atacar ou sancionar aliado dele, calote, pegar empresa dele sem pagar, fugir
     das inspeções nucleares. [gdd.md:1208-1210]
   - Jeito: pragmático (pesa comércio), ideológico (pesa bússola) ou agressivo
     (pesa força); o mesmo ato irrita um e quase não mexe no outro.
     [gdd.md:1211-1212]
   - Um degrau por vez, com aviso: nada vai de amigo a sanção num turno.
     [gdd.md:1213-1215]
   - Guerra ou sanção entre dois países leves mexe nos preços do mercado do
     jogador. [gdd.md:1215-1216]
   - Financiamento: outros países podem pagar organizações por interesse; todo
     pagamento deixa rastro. [gdd.md:806-807]
5. **Ligações:**
   - Recebe: bússola e governo do país jogado (Leis) [gdd.md:1195-1196]; comércio
     (Economia). [gdd.md:1196]
   - Entrega: papéis na mesa [gdd.md:1197-1198]; preços (Economia)
     [gdd.md:1215-1216].
6. **Referências:** nenhuma citada. **ESTUDAR** (IA diplomática em jogos de
   estratégia).
7. **No motor hoje:** ◐ R15.3 a opinião das potências anda; falta o cardápio.
   [requisitos.md:329] ☐ R15.9 IA em 3 passos. [requisitos.md:332] Teste esperado:
   virar ditadura derruba a opinião dos democráticos em um turno; nada vai de
   amigo a sanção num turno só. [requisitos.md:345]
8. **Em aberto:** potência que muda de posição sozinha ficou de fora na primeira
   versão do motor. [mundo.md:85] Ver ⚠ CONFLITO em VIII.3.

## VIII.3 Opinião, relação e reputação

1. **O que é:** o quanto cada país gosta de cada outro. Vira a relação que a tela
   mostra e a reputação internacional do jogador. [gdd.md:1248-1251]
2. **O que o jogador faz e sente:** vê cada país como inimigo, rival, neutro,
   amigo ou aliado; aproximar-se de A faz os rivais de A desconfiarem dele.
   [gdd.md:1248-1250]
3. **Peças:**
   - Opinião de cada país sobre cada outro. [gdd.md:1201-1203]
   - Relação (faixas da opinião). [gdd.md:1248-1249]
   - Reputação internacional. [gdd.md:1250-1251]
   - Opinião da potência sobre o país jogado, pela bússola. [mundo.md:29-41]
4. **Regras decididas:**
   - Versão da planilha e do GDD (12/nov): opinião de −100 a +100; anda com a
     distância na bússola, o comércio e o que um fez com o outro.
     [gdd.md:1201-1203] Vira a relação. [gdd.md:1248-1249]
   - Reputação internacional = média das opiniões sobre você, pesada pelo
     tamanho de cada país. [gdd.md:1250-1251]
   - Versão do motor (01/nov e 02/nov): posição do país na bússola = média das
     leis vigentes, eixo por eixo; todas as leis valem igual. [mundo.md:29-35]
   - Opinião desejada = 100 × (1 − f²), com f = distância ÷ 2√2. Curva, não reta
     (decidido em 01/nov). [mundo.md:37-41]
   - Opinião (0 a 100) por potência; a cada turno anda 10% da distância até a
     desejada; separada da opinião dos pops. [mundo.md:43-50]
   - Reputação = média das opiniões das potências, pesada pelo `peso` (soma 1). O
     índice que a recebe é declarado em `potencias.json`. [mundo.md:52-57]
   - As leis deixam de mexer direto na reputação; a bússola faz o trabalho.
     [mundo.md:59-61]
   - O validador recusa potência sem posição, peso fora de 0 a 1, relação faltando
     ou diferente nos dois lados. [mundo.md:11-25]
5. **Ligações:**
   - Recebe: leis (Leis) pela bússola [mundo.md:29-35]; comércio (Economia)
     [gdd.md:1202-1203].
   - Entrega: reputação internacional e segurança externa (índices)
     [mundo.md:52-80]; opinião de potência sobre ditadura (Política)
     [gdd.md:1208-1209].
6. **Referências:** curva da opinião: decisão do autor de 01/nov, sem estudo citado.
   **ESTUDAR**.
7. **No motor hoje:** ✅ R15.2 reputação e segurança externa. [requisitos.md:328]
   ◐ R15.3. [requisitos.md:329] ☐ R15.12 tela do Mundo com ranking e ficha.
   [requisitos.md:337] O mapa mostra as potências e a opinião de cada uma
   (02/nov). [mundo.md:83]
8. **Em aberto:**
   - A escala da opinião fica como está; hoje as potências não chegam a odiar o
     país porque faltam leis nas pontas; testar de novo com mais leis.
     [mundo.md:63-65]
   - ⚠ CONFLITO 1 (escala e fórmula da opinião):
     - Versão A (01/nov/2026, motor): opinião de 0 a 100, só pela bússola do país
       jogado; relação entre potências de −1 a +1, igual nos dois lados.
       [mundo.md:19] [mundo.md:37-50]
     - Versão B (12/nov/2026, GDD): opinião de −100 a +100, entre todos os
       países, pela bússola, comércio e o que um fez com o outro. [gdd.md:1201-1203]
     - Não resolvido. O GDD não diz que revoga o motor. O autor precisa dizer se
       a versão B passa a valer e se a curva 100 × (1 − f²) continua.
   - ⚠ CONFLITO 2 (potência parada ou que muda):
     - Versão A (02/nov/2026): potência que muda de posição sozinha fica de fora.
       [mundo.md:85]
     - Versão B (12/nov/2026): países mudam por dentro (eleição, crise, governos
       que já existiram). [gdd.md:1199-1200] [gdd.md:1225-1231]
     - A de 12/nov não cita a de 02/nov, mas é mais nova e trata de outro
       momento (passo 13). O autor confirma.
   - ⚠ CONFLITO 3 (peso na reputação):
     - Versão A (01/nov): pesada pelo `peso` declarado de cada potência, soma 1.
       [mundo.md:18] [mundo.md:52-53]
     - Versão B (12/nov): pesada pelo tamanho de cada país. [gdd.md:1250-1251]
     - Pode ser a mesma coisa (peso = tamanho). Não está escrito. O autor confirma.
   - ⚠ CONFLITO 4 (nome real):
     - Versão A (01/nov/2026): potências lembram blocos reais, mas não usam nome
       real. [mundo.md:4-5]
     - Versão B (08/nov/2026): países reais entram; a regra antiga "nenhum país
       real" não vale mais. [gdd.md:1182-1185] [memória project_paises_reais]
     - A de 08/nov revoga a antiga explicitamente (memória). Vale a de 08/nov. O
       `mundo.md` ainda descreve as potências inventadas, até o passo 13
       trocá-las. [requisitos.md:327]

## VIII.4 Comércio e preços de fora

1. **O que é:** o mercado do mundo, que fornece o que falta ao país e compra o que
   sobra, com preço próprio que o país não controla. [gdd.md:1312-1313]
   [mercado.md:25-28] [mercado.md:46]
2. **O que o jogador faz e sente:** vê no mercado do mundo o que está em alta ou
   em baixa e quem vende mais barato; sente a sanção ou a guerra de fora no preço
   do mercado dele. [mercado.md:53-56] [gdd.md:1215-1216]
3. **Peças:**
   - Dois mercados: o do país e o do mundo, com ciclos e choques de preço.
     [gdd.md:1312]
   - Cobertura por produto, do país e de cada potência. [mercado.md:22-24]
     [mercado.md:37-39]
   - Preço do mundo por produto. [mercado.md:46-51]
   - Ciclo e choque. [mercado.md:78-95]
   - Leis de comércio exterior: Tarifa de importação, Facilitação aduaneira, Zonas
     francas, Imposto e Subsídio à exportação, Defesa comercial, Controle de
     exportação, Venda de armas ao exterior, Triagem de compra estrangeira, Remessa
     de lucro e Fábrica estrangeira. [gdd.md:1618-1624]
   - Câmbio: valor da moeda contra o mundo. [gdd.md:1482-1483]
4. **Regras decididas:**
   - Importa o que falta e exporta o que sobra, pelas tarifas, subsídios e
     acordos (leis). [gdd.md:1321-1322]
   - Produto que falta vem do mercado do mundo ou fica faltando; nunca aparece do
     nada. A sobra é vendida a alguém ou fica parada. (14/nov) [mecanicas.md:301-303]
   - Preço do mundo: alvo = 100 × (demanda ÷ oferta)^1,5, entre 40 e 250; anda 25%
     do caminho por turno, mais ruído de ±2% que depende só do turno e do produto.
     (02/nov) [mercado.md:46-51]
   - Ciclo: a demanda do mundo ondula igual para todos, fator = 1 + 8% ×
     sen(2π × turno ÷ 24), ou seja, 4 anos. (02/nov) [mercado.md:81-83]
   - Choque: a cada turno, cada produto sem choque tem 2% de chance; fator de 1,3
     a 1,8 (ou o inverso); some 40% por turno; termina abaixo de 2%. Sorteio por
     turno e produto, não gasta o acaso da partida. (02/nov) [mercado.md:84-90]
   - Sanção passa pelo mercado: se o país que sanciona é o maior produtor de um
     produto, ele fica caro no mercado do jogador; quanto mais depende, mais dói.
     [gdd.md:1266-1268]
   - A tarifa recai quase toda sobre quem compra; abrir o comércio sobe a
     produtividade com ganhadores e perdedores. [gdd.md:1625-1627]
   - Nenhuma lei dá lucro a um produto; leis mexem em demanda e custo.
     (08/nov) [gdd.md:1314-1318] [gdd.md:1618-1620]
   - O mercado do mundo ainda lê as potências como fornecedoras; a dependência de
     uma potência é a média do que o país compra dela. [mercado.md:25-30]
5. **Ligações:**
   - Recebe: leis de comércio (Leis) [gdd.md:1618-1624]; sanções e guerra entre
     países leves (Mundo) [gdd.md:1215-1216].
   - Entrega: preço e falta de produto (Economia); fome (Gosto/população)
     [gdd.md:1319-1320]; câmbio e dívida externa (Economia). [gdd.md:1482-1483]
6. **Referências:** Victoria 3, só como ideia, e o documento
   `mercado-vic3-referencia.md`. [gdd.md:2200] [gdd.md:2219-2225]
7. **No motor hoje:** ✅ preço do mundo, ciclo e choque por produto (fatia 5a,
   02/nov). [mercado.md:78-95] ◐ R16.4 tarifa, subsídio e acordo pela metade.
   [mecanicas.md:391] ☐ R15.4 sanção pelo mercado. [requisitos.md:335]
8. **Em aberto:**
   - Régua por setor no comércio exterior; sanção que passa pelo mercado.
     [mecanicas.md:392]
   - Ciclo econômico e crise "de verdade" só quando o mundo tiver países
     funcionando (14/nov). [mecanicas.md:306-308]
   - ⚠ CONFLITO 5 (ciclo e crise):
     - Versão A (02/nov/2026): o motor já tem ciclo de 4 anos e choques de preço no
       mundo. [mercado.md:81-95]
     - Versão B (14/nov/2026): o Victoria 3 não tem ciclo e crise e o SisGov vai
       ter, "de verdade" quando o mundo tiver países funcionando.
       [mecanicas.md:271-272] [mecanicas.md:306-308]
     - Parece que B é uma versão mais completa de A, não uma troca. Não está
       escrito. O autor confirma o que "de verdade" muda.

## VIII.5 Posições por país, atos, sanções e aliança

1. **O que é:** o menu que abre ao clicar num país. O jogador decide o nível de
   cada relação só para aquele país. Não são leis. [gdd.md:1255-1257]
2. **O que o jogador faz e sente:** aproxima-se ou afasta-se de um país; cada ação
   muda a opinião dele e a dos aliados e rivais dele. [gdd.md:1253-1254]
   [gdd.md:1261-1262]
3. **Peças:**
   - Posições por país: relações diplomáticas, acordo comercial, aliança militar,
     base estrangeira, sanções, operações no exterior, extradição e polícia, ajuda
     dada, ajuda condicionada aceita e proteção ao investidor. [gdd.md:1257-1259]
   - Leis do país todo: Verba da diplomacia, Tribunal internacional, Inspeções
     nucleares, Aprovação de tratados (presidente, Congresso ou referendo) e
     Alcance das sanções. [gdd.md:1259-1261]
   - Atos do presidente com países: visita de Estado, receber o líder, apoiar ou
     criticar em público, mediar conflito entre dois países. [gdd.md:1263-1264]
4. **Regras decididas:**
   - Posição por país: nível decidido no menu do país que fica valendo, como
     Sanções e Aliança. (08/nov) [gdd.md:575-576]
   - Ato acontece uma vez (visita de Estado é exemplo). (08/nov) [gdd.md:574-575]
   - As opções do menu de país ou companhia são decisões (Ato ou Operação), e as
     leis as controlam (Alcance das sanções, Aprovação de tratados, Indenização,
     Autorização para estatizar e vender). (08/nov) [memória leis-x-decisoes]
   - Sanção ou alinhamento: aproximar-se de A faz os rivais de A desconfiarem.
     [gdd.md:1249-1250]
   - Acordo de pesca é Posição por país. [gdd.md:1754]
   - Ditadura que funciona custa caro: sanções, investimento de fora caindo, gente
     estudada indo embora. (12/nov) [gdd.md:495-497]
   - Investigação de financiamento estrangeiro de organização pode gerar sanção e
     escândalo. [gdd.md:808-809]
5. **Ligações:**
   - Recebe: leis de diplomacia (Leis); dinheiro e verba (Economia)
     [gdd.md:1259-1261].
   - Entrega: opinião dos países, reputação e segurança externa (índices)
     [gdd.md:1261-1262] [gdd.md:1269]; preços (Economia) [gdd.md:1266-1268].
6. **Referências:** nenhuma citada para o menu. **ESTUDAR** (diplomacia em jogos de
   estratégia).
7. **No motor hoje:** ☐ R15.11 posições por país no menu do país.
   [requisitos.md:334] ☐ R15.4 sanção pelo mercado. [requisitos.md:335]
   [mecanicas.md:883]
8. **Em aberto:** custo e duração dos atos com países ficam para as narrativas.
   [gdd.md:1264-1265] [gdd.md:2157-2158]

## VIII.6 Segurança externa, ataque e guerra fora do jogo

1. **O que é:** o quanto o país está seguro de fora. Cai quando país forte não
   gosta dele. O país pode ser atacado, mas não revida nem começa guerra.
   [gdd.md:1269-1271]
2. **O que o jogador faz e sente:** vê a segurança cair se o mundo o desgosta;
   sofre ataque com custo em economia, vidas e aprovação; defende-se pelas leis
   militares. [gdd.md:1270-1271]
3. **Peças:**
   - Segurança externa e poder defensivo. [mundo.md:69-80]
   - Ataque externo. [gdd.md:1270-1271]
   - Guerra entre países leves, só como efeito nos preços. [gdd.md:1215-1216]
4. **Regras decididas:**
   - Segurança externa = poder defensivo − (100 − reputação), travada em 0 a 100.
     Sem limiar: quanto pior a opinião, maior a perda. (02/nov) [mundo.md:69-74]
   - Os dois índices são declarados em `potencias.json` (opcionais); o motor não
     sabe os nomes. Calculada na etapa do mundo, no turno 0 também. [mundo.md:76-80]
   - Um ataque cobra economia, vidas e aprovação; a defesa vem das leis militares.
     [gdd.md:1270-1271]
   - Guerra iniciada pelo país está fora do jogo pronto (decidido). [gdd.md:2195-2196]
     [requisitos.md:484] [mecanicas.md:991]
   - Ataque entre países: só país forte contra inimigo de defesa fraca, no fim da
     escada de segurança. [gdd.md:1205-1207]
   - Guerra civil (dentro do país) vem de grupos grandes com raiva e armas
     divididas. (12/nov) [gdd.md:493-494]
   - Crise com força do governo baixa traz golpe ou guerra civil nos países leves.
     [gdd.md:1199-1200]
   - Vírus para fins militares: decidir na Defesa se vira lei ou degrau. (09/nov)
     [gdd.md:2176]
5. **Ligações:**
   - Recebe: reputação (Mundo) [mundo.md:69-74]; leis militares (Leis)
     [gdd.md:1271]; demanda por tamanho das forças (Economia) [gdd.md:1325-1326].
   - Entrega: economia, vidas e aprovação (Economia, Gosto/população, Política)
     [gdd.md:1270-1271].
6. **Referências:** SIPRI para poder militar. [gdd.md:1223-1224] Mais:
   **ESTUDAR**.
7. **No motor hoje:** ◐ segurança externa feita, o ataque em si "fica para
   depois". [mundo.md:79-80] ☐ R15.5 ataque externo sem revide.
   [requisitos.md:336]
8. **Em aberto:** como um ataque acontece e como termina. [gdd.md:2151]
   [mecanicas.md:892]

---

# X. Narrativas e eventos

## X.1 A mesa de fatos

1. **O que é:** a memória curta da partida, como uma RAM. Cada módulo escreve o
   que aconteceu e lê o que precisa. [fatos.md:3-5]
2. **O que o jogador faz e sente:** vê os fatos como manchetes no Resultado do
   turno. [requisitos.md:65] Vê o fato que muda um placar do Congresso.
   [gdd.md:857-858]
3. **Peças:** ficha do fato (tipo, turno, tamanho, sobre, quem, lado) e a lista de
   tipos. [fatos.md:9-12] [fatos.md:24-56]
4. **Regras decididas (12/nov, R4.12):**
   - Cada etapa do turno põe na mesa o que fez. [fatos.md:9-12]
   - O módulo pergunta só o que interessa (por tipo, assunto, envolvido, tamanho
     mínimo ou turno); ninguém percorre a lista. [fatos.md:11-13]
   - Fato gera fato: quem vem depois na ordem das etapas já lê o novo.
     [fatos.md:15-16]
   - Some aos poucos: pequeno 1 turno, médio 2, grande 3; a força cai a cada turno.
     [fatos.md:17-18]
   - A mesa é curto prazo; o que deve durar mais (rancor, promessa quebrada) o
     módulo guarda no próprio estado. [fatos.md:19-20]
   - Nenhum módulo chama outro; eles se encontram só na mesa. [requisitos.md:30-34]
   - Tipo novo: acrescentar em `TIPOS_DE_FATO` e na tabela. [fatos.md:58]
   - Hoje há 31 tipos, de lei aprovada a eleição vencida, juiz nomeado, regra
     fiscal estourou, escândalo e grupo com raiva. [fatos.md:24-56]
5. **Ligações:**
   - Recebe: Congresso, Política, Mesa, Programas, Eleição, Judiciário, Contas.
     [fatos.md:24-52]
   - Entrega: jornal (Mídia), grupos (Gosto/população) e Congresso (Política).
     [requisitos.md:33-34] [requisitos.md:321]
6. **Referências:** nenhuma de jogo; é arquitetura do projeto. —
7. **No motor hoje:** ✅ R4.12. [requisitos.md:65] Não
   escrevem fato ainda: ministro, instituição, economia, mundo. [mecanicas.md:98-99]
8. **Em aberto:**
   - Quais mecânicas ainda não escrevem fato e quais fatos cada uma precisa.
     [mecanicas.md:98-99]
   - Regras de encadeamento (escândalo → CPI → queda). [mecanicas.md:100]
   - A ordem das etapas do turno com mídia, organizações e mundo entrando.
     [mecanicas.md:90-91]

## X.2 Gatilhos

1. **O que é:** um índice que sobe ou passa de um limite dispara uma narrativa
   (por exemplo, "os sindicatos estão crescendo no país"). [gdd.md:728-730]
   [mecanicas.md:977]
2. **O que o jogador faz e sente:** sente o país vivo: o texto lê os números.
   [gdd.md:117-118] [gdd.md:57-59] Hoje o jogador, o que quer que faça, não sente
   modificação, e isso é o que o autor chama de não jogável. [memória
   project_jogo_nao_sente]
3. **Peças:** índices visíveis e invisíveis; limites. O invisível o motor calcula e
   o jogador só sente pelo que acontece (greve, surto, notícia). [gdd.md:726-728]
4. **Regras decididas:**
   - Índice é gatilho (07/nov). [gdd.md:728-730]
   - Cada instituição ganha quantos índices fizerem sentido (aba Índices, coluna Na
     tela). [gdd.md:729-731]
   - Os gatilhos só se escrevem com as narrativas, depois do motor e dos índices
     prontos. (07/nov) [gdd.md:730-732] [memória project_narrativas_no_final]
   - Agora: criar índices (visíveis e invisíveis) por esfera; não escrever
     gatilhos. [memória project_narrativas_no_final]
   - Dados primeiro, narrativa depois. [gdd.md:117-118]
5. **Ligações:**
   - Recebe: índices (Economia, Gosto/população, Leis). [gdd.md:728-729]
   - Entrega: eventos e manchetes. [gdd.md:117-118]
6. **Referências:** nenhuma citada. **ESTUDAR** (gatilho por limite de índice).
7. **No motor hoje:** ☐ nada. Existe o motor de deriva, que move um índice
   empurrado por outro (ver X.5). [deriva.md:3-14] Passo da ordem de construir:
   não há passo próprio para as narrativas. [requisitos.md:459-479]
8. **Em aberto:**
   - O que vários índices batendo metas juntos significam. [gdd.md:2163]
   - ⚠ CONFLITO 6 (quando as narrativas entram):
     - Versão A (07/nov/2026): depois do motor e dos índices prontos.
       [gdd.md:730-732] [memória project_narrativas_no_final]
     - Versão B (gdd, seção 18, pendências): "Para as narrativas (depois da V1
       jogável)". [gdd.md:2155] A V1 acaba no passo 10c. [requisitos.md:456-457]
     - A economia completa e a população completa são os passos 16 e 17, depois da
       V1. [requisitos.md:479-480] Não resolvido. O autor diz qual é o marco.

## X.3 Eventos e crises

1. **O que é:** coisas que acontecem sozinhas no país, saídas dos dados, e que
   chegam ao jogador como papel na mesa. [gdd.md:209-210]
   [mecanicas.md:921-923]
2. **O que o jogador faz e sente:** recebe a situação com 2 ou 3 respostas, cada
   uma com ganho e custo; esperar é uma opção, a pior. [mecanicas.md:921-923]
   [gdd.md:1866-1868]
3. **Peças:**
   - Família "Crises" da mesa (índices e eventos): enchente, greve, banco
     quebrando, apagão. [gdd.md:1972]
   - Eventos de cada setor, já desenhados no GDD: apagão [gdd.md:1637-1639];
     queimadas e vazamentos [gdd.md:1692-1694]; seca, colapso da pesca, carne
     contaminada [gdd.md:1756-1757]; desastre de Defesa civil [gdd.md:1856-1875];
     resgate de bancos [gdd.md:1554-1558]; massacre no campo [gdd.md:2161-2163].
   - Choque de preço do mundo. [mercado.md:84-90]
   - Fatos aleatórios do turno: escândalo, choque de preço, atentado. [gdd.md:209-210]
4. **Regras decididas:**
   - O papel nasce do estado do país e das fichas, sem roteiro. (11/nov)
     [gdd.md:2009-2010] [gdd.md:1969-1970]
   - Prazos (11/nov, calibrar no fim): situação urgente 1 turno (piora, vira
     crise e manchete); situação calma 3 turnos (quem pede fica chateado e a
     oferta some). [gdd.md:1963-1966]
   - Ignorar tem consequência: situação piora; enchente sem verba vira crise e
     manchete. [gdd.md:2004-2006]
   - O desastre chega sozinho: a gravidade sai do clima e do país; o estrago é a
     gravidade menos o índice Preparo contra desastres. [gdd.md:1856-1858]
   - O papel tem povo: o que houve, quem sofre (com nome e voz), o que fazer. O
     mesmo texto sai como notícia. [gdd.md:1866-1868] [gdd.md:1798]
   - O apagão é evento: acontece num estado que precisa de mais energia do que
     recebe, mesmo com energia sobrando no país. [gdd.md:1637-1639]
   - Resgate de bancos é evento, não lei: cada banco que quebra tem ficha e o
     jogador escolhe (deixar quebrar, estatizar, emprestar com condições, salvar
     sem condições). [gdd.md:1554-1558]
   - Crises do dinheiro (corrida ao banco, resgate banco a banco, ataque à moeda)
     são eventos de decisão; as leis de Moeda e bancos só montam o cardápio.
     [gdd.md:2159-2160]
   - Massacre no campo chega como papel; dono na fila desmata para provar que
     produz; Liberação de armas sobe o Conflito no campo. [gdd.md:2161-2162]
   - Emissões são conta por companhia; queimadas e vazamentos são eventos.
     [gdd.md:1692-1694]
   - Ciclo e crise de verdade quando o mundo tiver países funcionando (14/nov).
     [mecanicas.md:306-308]
   - Sem sorteio para a lei passar; a aprovação vem do Congresso e dos grupos,
     nunca de um dado. [gdd.md:2054-2055] O placar previsto é o real.
     [gdd.md:855-858]
5. **Ligações:**
   - Recebe: índices e fichas (Economia, Gosto/população, Leis) [gdd.md:1972];
     clima e preparo [gdd.md:1856-1858].
   - Entrega: papel na mesa (Leis/Política) [gdd.md:1972]; manchete (Mídia)
     [gdd.md:1868]; raiva e escândalo (Gosto/população, Política).
6. **Referências:** Victoria 3 não tem ciclo e crise. [mecanicas.md:271-272]
   Referência de eventos de decisão: **ESTUDAR**.
7. **No motor hoje:** ◐ R17.13 prazos: ignorar tem consequência; falta crise e
   aliado se afastar. [requisitos.md:436] ◐ R17.7 só família Leis e vaga de juiz.
   [mecanicas.md:911] Falta crises, pedidos, ofertas, instituições, partido
   como papel. [mecanicas.md:912] Só o choque de preço do mundo roda
   hoje. [mercado.md:84-90]
8. **Em aberto:**
   - Como as situações (crises) saem dos dados. [mecanicas.md:921-923]
   - Crise que piora no prazo e aliado que se afasta. [mecanicas.md:917]
   - Como o evento "Papéis duvidosos" entra na mesa. [mecanicas.md:927]
   - Cada setor já tem seus papéis desenhados no GDD (5.12). [mecanicas.md:922-923]

## X.4 Atos com custo e duração

1. **O que é:** os atos do presidente com a mídia e com países, que precisam de
   custo e duração. [mecanicas.md:983-985]
2. **O que o jogador faz e sente:** escolhe um ato (entrevista, pressão, processo,
   notícia falsa; visita de Estado, receber o líder, apoiar ou criticar em
   público, mediar). [gdd.md:1121-1125] [gdd.md:1263-1264]
3. **Peças:** os atos já listados em VII.5 e VIII.5. —
4. **Regras decididas:** nenhuma ainda de custo e duração. Ato é "acontece uma vez".
   (08/nov) [gdd.md:574-575]
5. **Ligações:** Mídia e Mundo. [gdd.md:2157-2158]
6. **Referências:** **ESTUDAR**.
7. **No motor hoje:** ☐ R14.11. [requisitos.md:313] ☐ R15.11.
   [requisitos.md:334]
8. **Em aberto:** custo e duração dos atos com a mídia e dos atos com países
   (para as narrativas, depois da V1 jogável). [gdd.md:2155-2158]

## X.5 O acaso e a deriva

1. **O que é:** o sorteio com semente (acaso) e o índice que anda sozinho pelos
   turnos (deriva). [acaso.md:3-5] [deriva.md:3-4]
2. **O que o jogador faz e sente:** mesma semente e mesmos pedidos, mesma partida.
   [requisitos.md:79] Sente o país parado até algo mudar, e depois andar.
   [deriva.md:7-8]
3. **Peças:**
   - Acaso: sorteio com semente (mulberry32); o estado do gerador fica no estado
     da partida; função pura `sortear`. [acaso.md:3-5]
   - Deriva: índice que anda empurrado por outro (o "processo"). [deriva.md:3-4]
4. **Regras decididas:**
   - Acaso: mesma semente e mesmos pedidos, mesma partida. [acaso.md:3-4]
   - Deriva (aprovado em 04/nov/2026): o índice é base + leis; a deriva move a
     base, um pouco a cada turno. [deriva.md:3-6]
   - Quem empurra mede contra o turno 0: o país começa parado e só anda quando algo
     muda. [deriva.md:7-8]
   - Passo por turno = sentido × taxa × (quem empurra hoje − no turno 0) × escala.
     Taxa: fraca 2%, média 5%, forte 10% da distância. [deriva.md:9-10]
   - A base fica dentro do domínio, contando as leis: não acumula além do teto.
     [deriva.md:11]
   - As ligações ficam no mundo (`mundo/indicadores/derivas.json`); o motor não sabe
     os nomes. [deriva.md:12]
   - Não equilibrado: a taxa só dá a direção. [deriva.md:13-14]
   - Humor da bolsa nasce de alta recente, crédito, confiança e notícias, sem
     sorteio. [gdd.md:1504-1505]
   - A aprovação de lei nunca usa sorteio. [gdd.md:2054-2055]
5. **Ligações:** Economia (índices) e Gosto/população (índices) por deriva
   [deriva.md:3-6]; Mundo, preço de fora por choque sorteado [mercado.md:84-90].
6. **Referências:** nenhuma citada. —
7. **No motor hoje:** ✅ `acaso` e `deriva` existem no motor. [acaso.md:3-5]
   [deriva.md:3-4] (feito, aprovado em 04/nov/2026.)
8. **Em aberto:** quanto o acaso entra nos eventos (X.3). Não há fonte.
   Pergunta ao autor.

---

## Para o revisor

### (a) ⚠ CONFLITO

1. **Escala e fórmula da opinião entre países:** motor 0 a 100 só pela bússola
   [mundo.md:37-50] contra GDD de −100 a +100 por bússola, comércio e ações
   [gdd.md:1201-1203]. Ver VIII.3.
2. **Potência que muda sozinha:** "fica de fora" [mundo.md:85] contra países que
   mudam por dentro e governos que já existiram [gdd.md:1199-1200]
   [gdd.md:1225-1231]. Ver VIII.3.
3. **Peso na reputação:** `peso` declarado [mundo.md:52-53] contra "tamanho de cada
   país" [gdd.md:1250-1251]. Ver VIII.3.
4. **Nome real:** potências inventadas [mundo.md:4-5] contra países reais
   [gdd.md:1182]. A de 08/nov revoga explicitamente (memória project_paises_reais);
   vale a de 08/nov. Marcado só para o revisor ver que o `mundo.md` ficou velho.
5. **Ciclo e crise:** ciclo de 4 anos e choques já feitos [mercado.md:81-95] contra
   "ciclo e crise de verdade quando o mundo tiver países funcionando"
   [mecanicas.md:306-308]. Provável complemento; não está escrito.
6. **Quando as narrativas entram:** "depois do motor e dos índices prontos"
   [gdd.md:730-732] contra "depois da V1 jogável" [gdd.md:2155].
7. Sobre mídia, as fontes não se contradizem. Ponto a observar: a tabela de fatos
   diz que `escandalo` e `manchete-contra` são "(mídia)" e "só lido pelo Congresso
   por ora" [fatos.md:54-55], enquanto o requisito diz que a mídia emite
   "manchete contra/a favor" [requisitos.md:321]. É estado (falta), não conflito.

### (b) O que ficou ESTUDAR

- Referência de mídia como filtro de opinião (VII.1, VII.2, VII.3, VII.4, VII.5).
- Ciclo de escândalo (VII.3). Entrevista como minigame (VII.5).
- IA diplomática de países (VIII.2, VIII.5). Curva da opinião (VIII.3).
- Gatilho por limite de índice (X.2). Eventos de decisão (X.3). Atos com custo e
  duração (X.4).
- O acaso nos eventos (X.5): nenhuma fonte diz quanto o acaso entra.

### (c) Fontes não lidas ou lidas só em parte

- `gdd.md`: lidas as seções 14, 15, 18, as menções a evento/manchete/jornal em
  todo o arquivo e os trechos de Economia citados (Mercado, Dinheiro, Comércio
  exterior, Energia, Agricultura, Defesa civil). Não li o resto da Economia, o
  Congresso (§12, lido só nas linhas citadas) nem a Tela (§17, lida só a mesa).
- `mecanicas.md`: lidas §1.2, §1.3, §5.1, §5.11, §15, §16, §17 e §19. O resto, não.
- `requisitos.md`: lidos R4, R14, R15, a ordem de construir e as linhas de R17
  citadas. R12, R13 e R16 só por busca.
- `mercado.md` (fora da lista do pedido): lido só nas fatias 2, 3 e 5a.
- Planilhas: só o cabeçalho e uma linha de Países.tsv e o cabeçalho de
  Países-governos.tsv; os valores de cada país não foram conferidos.
- Memórias lidas: project_narrativas_no_final, project_paises_reais,
  project_jogo_nao_sente, feedback_leis_x_decisoes. As outras só pelo índice.
- Não abertas, por regra: docs/arquitetura, docs/historico, docs/v1,
  docs/referencia, docs/Exemplos, docs/arte/PROMPTS.md.
- Não existe fonte sobre rádio, TV a cabo ou imprensa regional, nem sobre regra
  de nascimento de organizações pela mídia. Não inventei.
