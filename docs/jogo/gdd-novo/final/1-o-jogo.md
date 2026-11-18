## Parte 1. O jogo

### 1.1 Visão

**O que é**
- SisGov é um simulador de governo em português. Quem joga assume a Presidência de um país, assina leis e vê o efeito no dinheiro, nos indicadores e na opinião da população.
- Em uma frase: você é o partido que acabou de vencer a eleição e precisa continuar no poder governando por leis.
- Gênero: simulador político de governo, com economia viva de empresas, obras e bolsa.

**O que faz o SisGov ser o SisGov**
- **Política de verdade, não gestão.** O difícil é aprovar, pagar e sobreviver à lei. Cada lei passa pelo Congresso, pela mídia, pelos grupos e pelo cofre.
- **Você é um partido com gente dentro.** Pessoas com ficha erram, brilham, traem e morrem; o partido sobrevive a elas, ou não.
- **A conta sempre chega.** O que agrada hoje cobra depois, pela contabilidade, pela economia ou pela urna.
- **O país vive sozinho.** Empresas abrem e fecham, a mídia escolhe lado, os outros países mudam de ideia.
- **O gosto vem do bolso, da bússola e da memória.** Todo mundo e toda lei têm lado na Bússola (esquerda ou direita na economia, libertário ou tradicional nos costumes), e nenhuma lei é neutra. Mas o que mais pesa é o bolso: o que a lei faz com o dinheiro e a vida de cada um (14/nov).
- **Toda lei é uma bolha no mapa.** O jogador decide abrindo a bolha. Painéis só mostram.

**O jogador** (faz e sente)
- Quem joga é o partido, não uma pessoa. Presidentes, ministros e candidatos passam; o partido fica enquanto vencer.
- O governo age por leis. O Estado pode comprar empresas e ações e financiar obras, mas quem constrói é a economia.
- Governar é administrar a máquina pública (instituições, ministros, verbas e leis), seja de esquerda ou de direita.
- Não há meta pronta: o jogador leva o país para onde quiser.
- O jogador controla tudo o que um governo controla.
- Quando dá certo, ele sente um grupo contrário passar a apoiar, a indústria voltar a contratar, a eleição vencida por pouco. Quando dá errado, entende por quê, e nunca parece azar.
- Vê o país mudar sem placar: PIB, empresas, empregos, pessoas enriquecendo ou empobrecendo.
- O que o autor chama de "jogo não está jogável" é o jogador não sentir modificação, não importa o que faça. Dilemas, eventos e ligações genéricos não bastam.

**Público**
- O jogador é criativo, gosta de testar o extremo e de números, mesmo os que não aparecem na tela. Por isso a lei tem régua com número, não duas ou três opções em palavras.
- O autor recusou cortar um núcleo de cerca de 40 leis: o jogo deve ter centenas de caminhos. Quem foca numa área (segurança, por exemplo) pode ganhar a eleição nessa promessa.

**Regras**
- Perder é perder o poder federal; a partida acaba. Jogar como oposição fica para depois. (12/nov)
- Países reais podem entrar: as 10 maiores economias jogáveis; empresa, pessoa e direito autoral seguem de fora. (08/nov)
- Narrativas e gatilhos só depois do motor e dos índices prontos (o mesmo que "depois da V1 jogável"). (07/nov)
- O jogo não fala de lado político ao jogador. O lado do partido sai das pessoas da chapa.
- Antes de qualquer lei: "um presidente real assinaria e pronto, ou é um processo?".
- Fora do jogo pronto: guerra iniciada pelo país, pesquisa e tecnologia como árvore.

**Ligações**
- A visão chega às demais partes pelos princípios (1.3) e pelo ciclo (1.2).

**Referências**
- Victoria 3: só como ideia. A ligação economia, pop e política dele é a mais elogiada do gênero; Frostpunk tem ligação fraca; Democracy 4 tem ligação que ninguém entende. Nada do Democracy 4 entra (nome, número, ligação).
- Estudo de mercado do Victoria 3: `mercado-vic3-referencia.md`.
- Referência de "visão" para um jogo de governo com personagens: **ESTUDAR**.

**No motor hoje**
- ✅ Escolher país: `brasil-2026` (R4.3).
- ◐ A partida só acaba pela eleição (R4.4).
- ☐ Placar final: tempo no poder e país deixado (R4.7).
- A visão em si não é peça de código.

**Em aberto**
- O que o placar final mostra (tempo no poder, país deixado: quais números, comparados com o começo?).
- Jogar como oposição depois de perder o poder: para depois.

---

### 1.2 As 3 mecânicas

**O que é**
- O jogo gira em torno de três mecânicas, que se controlam em ciclo: **Gosto** (a população e como ela funciona), **Economia** e **Leis** (decidido em 14/nov).
- Ao redor delas ficam Congresso, eleição, partido, Judiciário, mídia, mundo, tela e narrativas.
- Congresso, partidos, grupos e eleição são o caminho pelo qual a população controla o governo. Mundo não é mecânica: pressiona as três. A mídia é lente: age em cima dos fatos que já existem, não cria fato novo (14/nov).
- Cada mecânica tem seu lugar:
  - **Leis:** a lei e quem a executa. Instituições, ministros, caixas e a fronteira do governo ficam aqui, porque a lei mora numa instituição e a instituição fica com um ministro (decisão C1, 14/nov).
  - **Economia:** as contas do Estado (Tesouro, receita, gasto, dívida), porque são dinheiro (decisão C1, 14/nov).
  - **Política** (em volta): presidente, vice, sucessão, pessoas e governadores (decisão C1, 14/nov).
  - A parte "Estado" deixa de existir como mecânica própria.

**O jogador** (faz e sente)
- Mexe numa ponta (uma lei) e sente a volta pela outra: o ciclo não tem começo nem fim.
- O jogo quer a ligação do Victoria 3: a economia mexe no pop, o pop mexe na política, a política (as leis) mexe na economia.

**Peças**
- **Gosto:** a população e como ela funciona. O gosto é bolso (o mais forte) mais bússola (peso menor) mais memória (14/nov).
- **Economia:** dinheiro, empresas, preços, bolsa, e as contas do Estado. Tão importante quanto as outras duas.
- **Leis:** o que o governo decide, e as instituições, ministros e caixas que executam.
- **Em volta:** Congresso, eleição, partido, Judiciário, mídia, mundo, tela e narrativas.
- A bolsa é onde o ciclo vira preço: lei muda lucro, lucro muda a ação, a ação muda o patrimônio dos pops, e os pops reagem no voto e no investimento.

**Regras**
- Toda lei chega ao pop, por renda, emprego, preço, serviço ou direito. (05/nov)
- A lei não diz quem gosta dela: diz onde mexe no dinheiro e na vida, e o gosto nasce daí. A Bússola continua, com peso menor que o bolso. Tudo o que existe no ciclo tem posição na Bússola, e a distância diz quem gosta de quê, mas ela não é mais "a raiz". (14/nov)
- Nenhum dinheiro some: todo real gasto ou cobrado vira renda de alguém, circula, fica guardado ou sai do país. (14/nov)
- O porquê à vista: todo número que o jogador sente mostra de onde veio ao passar o mouse (SisGovpedia). (14/nov)
- Ordem decidida: primeiro o dinheiro (caminho e conservação), depois o gosto pelo bolso, depois a revisão das leis instituição por instituição. (14/nov)
- Cada módulo (população, leis, economia) funciona sozinho; as ligações vêm depois, no conteúdo das leis. (31/out)
- Pop, grupo e organização são camadas diferentes; organização nasce durante a partida. (06/nov)

**Ligações**

| De | Para | Como controla |
| --- | --- | --- |
| Gosto (população) | Economia | trabalha, consome e investe |
| Economia | Gosto (população) | paga salário, dá emprego e define preços |
| Economia | Leis (governo) | gera o dinheiro dos impostos |
| Leis (governo) | Economia | cobra, gasta e regula por lei |
| Leis (governo) | Gosto (população) | dá serviços, renda e direitos |
| Gosto (população) | Leis (governo) | vota, apoia e protesta |

**Referências**
- Victoria 3 (ligação economia, pop e política).
- Como fazer a opinião sem copiar outro jogo: **ESTUDAR**.
- Como a mídia mexe em cada uma das 3 mecânicas: **ESTUDAR** (14/nov).

**No motor hoje**
- Hoje (conferido 14/nov) a satisfação do grupo lê renda, índices cobrados e bússola das leis. O bolso só se mexe por imposto de renda e transferência. As outras cerca de 480 leis agradam ou irritam só pelo ponto chutado na bússola. A verba gasta não chega a ninguém, exceto a transferência.
- A mecânica de cada ponta está nas partes seguintes do GDD.

**Em aberto**
- Como a renda de cada pop sai de salário e lucro sem o turno 0 mudar de valor; quanto falta de trabalhador freia a produção.
- Opinião central: estruturar direito uma mecânica própria, com a mesma régua para todo ator, desenhada inteira antes do código e antes de padronizar as leis (10b).

---

### 1.3 Princípios (as regras que nunca mudam)

1. **Leis são o núcleo do governo.** Tudo o que o Estado faz passa por lei; mudar uma lei muda o jogo.
2. **Decisão de governo é uma bolha de lei no mapa**, nunca um painel de gestão. Decisões do partido (chapa, ministros, coligação, campanha) são escolhas curtas, sem painel. O que os outros propõem chega como papel na mesa.
   - **Lei x decisão (08/nov):** lei é regra permanente e tem bolha; decisão do presidente (Ato ou Operação) aparece ao clicar num país ou companhia, tem custo, tempo e reação, e é limitada pelas leis.
3. **Nenhuma lei é um controle só que faz coisa grande.** Cada tema se divide em leis menores, cada uma com escolha de verdade.
4. **Nada é bom ou ruim.** Toda lei tem ganhadores, perdedores e consequências; textos e cores descrevem. Parecer de direita ou esquerda é resultado, nunca objetivo. O jogo nunca fala de lado ao jogador.
5. **Nenhum dinheiro some (14/nov).** Vale para toda a economia, inclusive o ilegal. Todo real gasto, cobrado, desviado ou ganho fora da lei vira renda de alguém, circula, fica guardado ou sai do país. A corrupção vai ao bolso de alguém e deixa rastro. Para o Estado, isso quer dizer que a conta sempre fecha: todo dinheiro do Estado entra por lei ou por bem do Estado, e todo gasto sai por lei ou obrigação. Gastar exige imposto, dívida ou emissão.
6. **O que dá resultado demora.** Cada efeito declara quanto tempo leva.
7. **Decisão no turno, nada neutro.** Toda escolha mexe em algo visível; esperar também é opção. Jogável não é demorado: a decisão acontece agora, esperar é vantagem que o jogador escolhe, nunca obrigação.
8. **Dados primeiro, narrativa depois.** Frases, manchetes e eventos leem os números.
9. **Jogabilidade primeiro, realidade como base.** Lei inventada vale se plausível; número na ordem de grandeza certa, sem precisão empírica.
10. **O motor conhece o Estado, não os nomes.** Leis, índices, partidos e mídias são dados do mundo; o país declara só o estado de partida e os rótulos locais.
11. **O Congresso é a trava, não o jogo.** O jogador propõe qualquer coisa; o exorbitante o Congresso barra. Fora isso, o que segura é a consequência.
12. **Pessoas são fichas, não roteiros.** O que elas fazem sai da ficha e do país, não de história escrita.
13. **Toda lei chega ao pop.** Por renda, emprego, preço, serviço ou direito.
14. **O resultado emerge.** A lei não traz condição escrita ("se pobreza > X"); a mesma lei muda de sentido pelo estado do país, pela renda contra a conta.
15. **Lados equilibrados.** A lei vai de "nada" a "mais" num lado só; os dois lados da Bússola têm leis próprias.
16. **Texto para leigo.** Lei e opção com exemplo do dia a dia, sem jargão, sem cortar a régua numérica.
17. **Simulador de governo, não de personalidade.** Cada decisão deve ter consequência própria e sentida.
18. **Sem pontos de ação.** O limite vem do mundo (Congresso cheio) e só atrasa, nunca proíbe. (11/nov)

---

### 1.4 A partida: começo, mandato e fim

**O que é**
- O esqueleto do jogo: escolher o país, montar o começo, passar turnos, acabar.

**O jogador** (faz e sente)
- Escolhe o país e cria o partido com nome e sigla. Não escolhe lado, posição nem bússola.
- Monta a chapa de três vagas (presidente do partido, candidato a presidente, vice) com pessoas de todos os partidos; é assim que nascem as coligações. A chapa já venceu.
- Monta o governo: primeiro o tamanho numa régua (Enxuto, Clássico, Do país, Inchado), depois as caixas e os ministros.
- Inicia e governa.
- Conhece cada pessoa pelo perfil de rede social dela, sem rótulo de lado: o jogador deduz, como na vida real.
- Descobre o lado do próprio governo pelas consequências, não por um rótulo.
- Sente o que é difícil: o resultado demora, cada lei agrada um grupo e irrita outro, aliado cobra, a mídia decide o que o eleitor vê, o desgaste sobe sempre.

**Peças**
- Começo da partida.
- Fatos do turno.
- Fim e placar.
- Salvar e carregar.
- A rede da pessoa e a inteligência (botão Espiar, registro que pode vazar).
- Histórico do país: cada país declara golpes, crises, guerras, governos, empresas e mídias tradicionais; o que não declara, os geradores criam. Nenhuma empresa real.

**Regras**
- Como se chega lá: o país começa como está e o partido que governava vira oposição. O jogador entra com uma história ("no meio de uma polarização, você surge como a salvação do país"): partido novo, poucas cadeiras, presidente popular. A Aprovação começa alta e a base se constrói com coligação. (12/nov)
- No começo, o jogador pode pôr o partido que governava na coligação. (12/nov)
- Partido novo com 6% das cadeiras; o antigo governo vai para a oposição ou para a coligação.
- Governo: o tamanho vem numa régua; os ministros são sorteados pela chapa e cada cadeira troca por uma de três cartas (o técnico, o aliado, o do seu partido) ou por qualquer pessoa da lista. (13/nov)
- Os ministros fazem parte da partida desde o começo: a tela de início e o passo "Governo" da ordem de construção os incluem. (12 e 13/nov)
- A rede é uma só, sem nome, e resume todas as redes do país. Informações pessoais aparecem conforme a Verba de inteligência e os Poderes da agência; espiar fere a privacidade e fica num registro que pode vazar. (07/nov)
- Mandato: a duração da lei do país (4 anos = 24 turnos). No fim há eleição; vencer abre outro mandato, com desgaste maior.
- A partida termina quando o partido perde o poder federal. Não há vitória final: o placar é quanto tempo o partido governou e que país deixou.
- Tela de início em sequência: país, partido, chapa, governo, ministros, iniciar. (13/nov)
- O lado do partido sai da média da bússola da chapa, que define os 5 grupos que ele defende. (12/nov)
- A sigla do partido vira o id e não pode repetir a de outro. (12/nov)
- Salva sozinho; menu no brasão. (R17.3, R17.23)
- Sem pontos de ação por turno (princípio 18). (11/nov)

**Ligações**
- Recebe: país (dados em `conteudo/paises/<id>/`: estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos).
- Entrega: partido e chapa ao Partido e à Política (base de grupos e posição na bússola); governo e ministros a Leis (instituições, ministros, caixas); fatos do turno a Congresso, mesa, mídia, programas e eleição.
- Fato do turno é um aviso que um módulo deixa e quem se importa lê: liga Congresso, mesa, mídia, programas e grupos sem um chamar o outro.

**Referências**
- Jogo de partida com começo escolhido e fim por perda do poder: **ESTUDAR**.
- Rede social do político como forma de conhecer pessoa: **ESTUDAR**.

**No motor hoje**
- ✅ R4.1 Turno de 2 meses, mandato de 24 turnos.
- ✅ R4.3 País `brasil-2026`.
- ◐ R4.4 Acaba só pela eleição.
- ✅ R4.5 Criar partido. ✅ R4.6 Chapa. ✅ R4.8 Lado pela chapa. ✅ R4.10 Tela de início.
- ◐ R4.9 Falta a Aprovação começar alta.
- ✅ R4.11 Mundo sai da planilha `gdd.xlsx` (`npm run leis`).
- ✅ R4.12 Fatos do turno em `motor/fatos`; hoje escrevem Congresso e Política.
- ☐ R4.7 Placar final.
- Salvar e carregar: feito (R17.3, R17.23). Partida salva antiga é trocada pelo valor de partida do país ao carregar.
- Na seção Partida e turno dos requisitos: 9 feitos, 2 parciais, 1 faltando.

**Em aberto**
- A Aprovação começa alta: de quanto e quanto tempo dura a lua de mel?
- A história de entrada aparece como texto, tela ou só nos números?
- O que um país precisa declarar para ser jogável (lista de arquivos obrigatórios)? Só o Brasil 2026 existe.
- Quais mecânicas ainda não escrevem fato (ministro, instituição, economia, mundo) e quais fatos cada uma precisa.
- Regras de encadeamento: fato gera fato (escândalo, CPI, queda).
- Os outros caminhos de perder o poder (mecânica 12) e o placar final.
- Partida salva antiga quando o formato muda (hoje se perde ou se remenda no código).
- Ministros: a memória de 30/out está velha; refazer com o que já existe e o que falta (decisão C2, 14/nov).

---

### 1.5 O turno

**O que é**
- Um turno dura 2 meses (6 por ano).
- Em código: `avancarTurno(regras, estado, pedidos)` devolve um novo estado; mesma semente e mesmos pedidos dão a mesma partida.

**O jogador** (faz e sente)
Cinco passos:
1. **Lê o país** no mapa: bolhas de leis e índices, grupos satisfeitos ou não, mídias, países, manchetes.
2. **Age:** propõe leis (vendo antes quem ganha e quem perde), troca ministro, negocia com aliados; em tempo de campanha, faz campanha.
3. **Despacha a mesa:** assina, veta, recusa, encaminha ou deixa na pilha os papéis.
4. **O Congresso vota.** Passa quem tem votos; o exorbitante cai.
5. **Passa o turno:** efeitos chegam, alguns agora, outros anos depois; a mídia reage; acontecem fatos (escândalo, choque de preço, atentado).

**Peças**
Ordem das etapas no motor hoje (passo 8):
1. Congresso. 2. Leis novas. 3. Efeitos. 4. Economia real. 5. Preços e juros. 6. Contas. 6b. Moradia. 7. Jogabilidade. 8. Pops e grupos. 8b. Governo. 8c. Programas. 9. Política. 9a. Eleição. 9b. Mídia. 10. Invariantes.
- Detalhe de cada etapa: `src/motor/turno/turno.md`.

**Regras**
- O estado anterior não muda; o acaso mora no estado.
- Lei do mundo fora da lista do país fica não legislada: não arrecada, não gasta, não mexe em índice. Um pedido a legisla e os efeitos andam de zero até o valor novo.
- Cada efeito declara quanto tempo leva para chegar inteiro (princípio 6). Atraso zero quer dizer que o efeito vem no turno seguinte. (14/nov)
- O módulo `turno` só chama os módulos em ordem e junta os fatos; a regra fica no módulo dela. Hoje o `turno` tem cerca de 2.500 linhas com regra dentro, para tirar aos poucos.
- Fatos do turno somem em 1 a 3 turnos, pelo tamanho. (12/nov)
- A seta de tendência na tela compara com 8 meses atrás, corte de 2 pontos.
- Sem sorteio para a lei passar: a aprovação vem do Congresso e dos grupos. (14/nov)
- Mudar de ideia custa: propor e desistir de uma lei não pode ser de graça. (14/nov)
- Mostrar o atraso: a lei diz "efeito em N turnos". (14/nov)

**Ligações**
- O turno chama Congresso, efeitos, economia, contas, moradia, população, grupos, governo, programas, política, eleição e mídia, e fecha conferindo invariantes. A ordem por mapa de dependência está em `docs/jogo/arquitetura.md`.

**Referências**
- Plano de desenvolvimento (a ordem das etapas veio da seção 5 do plano).
- Referência externa de ordem de turno em simulador de governo: **ESTUDAR**.

**No motor hoje**
- ✅ R4.1 e R4.2 (turno e efeitos com atraso).
- ✅ R4.12 Fatos.
- Etapas feitas até o passo 8: todas as listadas em Peças.
- Comportamento esperado testado (passo 4): imposto de renda mais alto dá mais arrecadação até o pico e padrão de vida menor, que chega em 2 turnos.

**Em aberto**
- A ordem das etapas fica certa quando entrarem mídia, organizações e mundo? (quem lê o fato de quem no mesmo turno)
- Efeito da mídia: hoje o jornal só mostra manchetes e nenhuma notícia mexe em grupo, voto ou aprovação. A mídia deve agir em cima dos fatos que já existem (lente); falta estudar como (ver 1.2).

<!-- revisor: Tirei por superado: o conflito de nomes dos pilares (vale Gosto, Economia, Leis); "A Bússola é a raiz" e "gosto pela bússola" de 08/nov (vale bolso + bússola + memória, 14/nov); o princípio 5 antigo (só o Estado), reescrito com "nenhum dinheiro some"; o conflito "ministros no final" (30/out) contra ministros na partida, ficou a partida e a memória foi para Em aberto (C2); os Em aberto "onde ficam Tesouro e instituições" e "nome do Governo no ciclo" (C1: Leis, Economia, Política); o Anexo C do rascunho (a seu cargo). Mandei para Em aberto: placar final, oposição, lua de mel, história de entrada, país jogável, fatos encadeados, outras formas de perder, partida salva antiga, renda do pop, opinião central, ministros (C2), mídia por mecânica (C3). Nota: os "5 passos" e as etapas 8b Governo e 8c Programas do turno ficam como estão; o lugar de cada uma nas 3 mecânicas decorre de C1 (Governo em Leis). Os princípios 14 a 18 vieram de "fora do GDD §3" do rascunho. Perguntas que ficaram nas partes seguintes, não aqui. -->
