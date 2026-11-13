# SisGov — Requisitos

> O que o jogo pronto precisa ter, tirado do [GDD](gdd.md), e **como cada
> mecânica se constrói**. Refeito em 12/nov/2026 com as decisões de 11 e 12/nov
> (governo, Congresso, programas, eleição, mundo leve). A ordem de construir
> está no fim e no [plano](plano-de-desenvolvimento.md); a arquitetura, em
> [arquitetura.md](arquitetura.md).
>
> **Status:** ✅ feito · ◐ parcial · ☐ falta. Medido no código em 12/nov.
> Requisito novo só entra depois de decidido no GDD (seção 18).

## Como ler a construção

Cada sistema traz um bloco **Construção** com as mesmas 6 perguntas de
desenvolvedor:

1. **Dados:** de que aba da planilha vem, e para qual JSON o exportador manda.
2. **Estado:** o que o motor guarda de turno a turno.
3. **Módulo:** a pasta do motor que cuida disso (arquitetura, seção 4).
4. **Turno:** em que etapa roda.
5. **Fatos:** o que avisa aos outros e o que ouve deles.
6. **Tela e teste:** o que o jogador vê; o que o teste confere (direção, não número).

**Módulo** é uma pasta do motor com uma tarefa só e uma porta de entrada
(`index.ts`). Serve para mexer numa mecânica sem quebrar as outras: o
Congresso não sabe como a mídia funciona, só ouve o fato "manchete contra".

**Fato do turno** é um aviso que um módulo deixa no turno ("lei aprovada",
"decreto derrubado", "programa formado"). Quem se importa lê. É o que liga
Congresso, mesa, mídia, programas e grupos sem um chamar o outro.

## Resumo

| Sistema (GDD)          | ✅     | ◐      | ☐       |
| ---------------------- | ------ | ------ | ------- |
| 4. Partida e turno     | 3      | 2      | 7       |
| 5. Partido             | 0      | 0      | 5       |
| 6. Governo             | 0      | 1      | 21      |
| 7. Leis e programas    | 9      | 4      | 8       |
| 8. Bússola             | 4      | 1      | 1       |
| 9. Índices             | 3      | 2      | 3       |
| 10. Contas             | 3      | 1      | 2       |
| 11. População e grupos | 5      | 3      | 11      |
| 12. Congresso          | 2      | 1      | 16      |
| 13. Eleição            | 2      | 1      | 8       |
| 14. Mídia              | 0      | 0      | 10      |
| 15. Mundo              | 2      | 1      | 8       |
| 16. Economia           | 4      | 4      | 31      |
| 17. Tela e mesa        | 3      | 2      | 10      |
| **Total**              | **40** | **23** | **141** |

---

## 4. Partida e turno

- ✅ **R4.1** Turno de 2 meses; mandato de 4 anos = 24 turnos.
- ✅ **R4.2** Passar o turno: efeitos chegam com o atraso declarado.
- ✅ **R4.3** Escolher o país: `brasil-2026` (12/nov; 476 leis com o valor de hoje, 19 partidos com nome e cor, companhias inventadas). Dívida: juros comem 16% do PIB e a dívida vai de 78% a 107% em 24 turnos; calibrar na Economia.
- ◐ **R4.4** A partida acaba quando o partido perde o poder federal (hoje só pela eleição; ver R6.13).
- ✅ **R4.11** Mundo sai da planilha: `npm run exportar` grava leis e índices (12/nov).
- ✅ **R4.12** Fatos do turno: mesa de fatos (memória curta, como RAM) em `motor/fatos`; cada etapa escreve, cada módulo pergunta o que precisa; fato gera fato; some em 1–3 turnos pelo tamanho. Hoje escrevem Congresso (lei aprovada/derrubada) e Política (base, eleição); a tela mostra como manchete no Resultado do turno (12/nov).
- ✅ **R4.5** Criar o partido: nome e sigla; não escolhe lado. (12/nov; a sigla vira o id e não pode repetir a de outro partido.)
- ✅ **R4.6** Montar a chapa entre pessoas de todos os partidos (nasce a coligação). (12/nov)
- ✅ **R4.8** O lado do partido sai da chapa; o jogo nunca pede lado. (12/nov: média da bússola da chapa → 5 grupos que ele defende.)
- ◐ **R4.9** (12/nov: feito o partido novo com 6% das cadeiras e o antigo governo na oposição ou na coligação. Falta a Aprovação começar alta.) Começo com história: o partido que governava vira oposição (ou entra na coligação, se o jogador quiser); partido novo, poucas cadeiras, presidente popular.
- ✅ **R4.10** Tela de início em sequência: país → partido → chapa → ministérios → iniciar. (12/nov, no estilo da Art Bible.)
- ☐ **R4.7** Placar final: tempo no poder e país deixado.

**Construção**

- Dados: país em `conteudo/paises/<id>/` (estado inicial, leis vigentes, Congresso, ministérios, programas de antes, rótulos). Brasil 2026 e Brasil 2003 são países diferentes.
- Estado: `turno`, `fatos` do último turno.
- Módulo: `turno` só chama os módulos em ordem e junta os fatos; regra de cada coisa fica no módulo dela (hoje o `turno` tem 1.552 linhas com regra dentro: tirar aos poucos, cada vez que um módulo novo nascer).
- Tela: menu de início em telas curtas; o turno mostra os fatos como manchetes.
- Teste: mesma semente e mesmos pedidos, mesma partida; todo fato tem tipo conhecido.

## 5. O partido

- ☐ **R5.1** Ficha do partido: bússola (da chapa), base, cadeiras, caixa, desgaste, coesão.
- ☐ **R5.2** Governar longe da base derruba a coesão; o partido muda de lugar devagar.
- ☐ **R5.3** Presidente do partido pesa na negociação e na campanha; troca custa coesão.
- ☐ **R5.4** Caixa: entra por financiamento (lei), sai na campanha; doação privada traz interesse.
- ☐ **R5.5** Coesão baixa: deputados do próprio partido votam contra.

**Construção**

- Estado: `partido` (bússola, caixa, coesão, desgaste).
- Módulo: `congresso` (o partido do jogador é um partido do Congresso com caixa e coesão).
- Fatos: ouve "lei aprovada" (distância da base) e "escândalo"; emite "coesão caiu".
- Teste: governar sempre longe da base derruba a coesão em poucos turnos.

## 6. Governo: presidente, ministros, órgãos, justiça, estados

**Pessoas e fichas**

- ◐ **R6.1** Retratos genéricos (feito); ficha com atributos (falta).
- ◐ **R6.6** Gerador de pessoas; envelhecem, se aposentam e morrem. (12/nov: o gerador existe e o país declara só os nomes. Falta envelhecer, aposentar e morrer.)
- ◐ **R6.11** Perfil de rede social da pessoa, gerado da ficha; sem rótulo de lado. (12/nov: posts, lugares e quem segue; falta a "Informações pessoais descobertas" e o Espiar.)
- ✅ **R6.12** Lista de pessoas por vaga (chapa, ministério), com o perfil ao clicar. (12/nov)
- ☐ **R6.2** Presidente pesa por carisma (aprovação), honestidade (escândalo) e habilidade (Congresso).

**Ministérios** (12/nov)

- ✅ **R6.10** Ministério é uma caixa com nome e zero ou mais esferas e subesferas; cada uma numa caixa só; a sobra vai ao gabinete. (12/nov: moldes na aba Ministérios; a lei traz `esfera` e `subesfera`.)
- ◐ **R6.14** O país começa com os ministérios reais (aba Ministérios - países); o jogador muda no menu; depois só pela lei Organização dos ministérios. (12/nov: Brasil 2026 com 32 caixas. Feito o menu de montar o governo (passo 9). Faltam os outros países e a lei Organização dos ministérios.)
- ◐ **R6.15** Toda caixa tem ministro, custa estrutura e agrada quem é parecido com ele; muitas caixas dão foco e custam; superministério divide a competência. (12/nov: toda caixa tem ministro e o superministério divide a competência. Faltam: custo de estrutura, foco e agradar quem é parecido com o ministro.)
- ✅ **R6.7** Ficha do ministro: competência, habilidade, carisma, honestidade, lealdade, bússola, origem. (12/nov: cinco notas, bússola e origem. Agem competência e honestidade; habilidade, carisma e lealdade esperam Congresso, mídia e fatos do ministro.)
- ◐ **R6.8** A ficha muda a força e o atraso das leis das esferas da caixa e o rendimento dos órgãos dela. (12/nov: competência muda força e atraso. Falta o rendimento dos órgãos, que é R7.11.)
- ☐ **R6.9** Fatos do ministro (escândalo, crise, demissão barulhenta, vira candidato) e custo de troca.

**Órgãos** (11/nov)

- ✅ **R6.16** Um órgão por esfera, sob o ministério dela; verba (da lei), necessidade, rendimento = verba ÷ necessidade, corrupção interna. (12/nov: verba, necessidade, rendimento e corrupção; o rendimento ainda não age sobre a lei, é R7.11.)
- ✅ **R6.17** Verba de sobra vira corrupção; cargos de livre nomeação e ministro desonesto também. (12/nov: sobra de verba, cargos de livre nomeação e ministro desonesto; escândalo ao cruzar 60.)
- ☐ **R6.18** Ficha do órgão só de leitura no mapa (cor do rendimento, fila, leis que mexem).

**Perder o poder** (12/nov)

- ☐ **R6.13** Caminhos: eleição, morte, assassinato, renúncia, impeachment, moção (parlamentarismo), golpe, guerra civil, ala rival; vice de outro partido assumindo acaba a partida.
- ☐ **R6.3** Sucessão pelo vice e pela linha do país; do mesmo partido, choque de aprovação.
- ☐ **R6.5** Impeachment: fato grave, aprovação < 30%, 2/3; Senado julga se houver.
- ☐ **R6.19** Caminho autoritário: cada passo sobe a raiva dos contrários; sem armas leais, sobe o Risco de golpe.

**Justiça e estados**

- ☐ **R6.20** Justiça: fila de processos, independência, caso em etapas (rastro, investigação, processo, sentença).
- ☐ **R6.21** Corrupção em cadeia: rastro nunca some; a chance de achar usa a independência de hoje.
- ☐ **R6.22** Tribunal superior: cadeiras com lado; vaga vira papel; suspende lei que bate em direito.
- ☐ **R6.23** Governadores: partido, bússola e termômetro; aliado faz a verba render, oposição atrasa e culpa.

**Construção**

- Dados: abas Ministérios e Ministérios - países → `mundo/ministerios.json` (moldes) e `paises/<id>/ministerios.json`; coluna Subesfera da aba Leis vai em cada lei (`esfera`, `subesfera`); órgão por esfera em `mundo/orgaos.json`.
- Estado: `pessoas` (fichas), `ministerios` (caixa → esferas, ministro), `orgaos` (corrupção, fila), `justica` (rastros, casos).
- Módulo: `governo` (ministérios, fichas, órgãos, sucessão); `justica` dentro de `governo` até crescer.
- Turno: depois dos efeitos e antes dos índices (a ficha muda força e atraso; o órgão muda o rendimento da verba).
- Fatos: emite "ministro caiu", "escândalo", "presidente morreu", "impeachment aberto"; ouve "papel assinado" (rastro), "CPI".
- Tela: caixas no mapa com retrato do ministro; ficha por cima; órgão como prédio pequeno.
- Teste: ministro competente faz a mesma lei chegar antes; verba acima da necessidade sobe a corrupção do órgão; vice de outro partido assumindo acaba a partida.

## 7. Leis e programas

**Leis**

- ✅ **R7.1** Duas camadas e duas formas (régua e degraus).
- ✅ **R7.2** A lei declara efeito, força, atraso, bússola e base; o motor calcula.
- ✅ **R7.3** Validador com arquivo, campo e motivo.
- ✅ **R7.4** País declara as leis que tem; o resto fica "não legislada".
- ✅ **R7.5** Texto da tela sai dos números da lei.
- ✅ **R7.14** Leis saem da planilha (512 no jogo, 12/nov); unidade livre (km/h, mandatos, % acima de 100).
- ✅ **R7.15** Formas especiais divididas: dois controles em duas leis, divisão de 100% em pesos, régua por setor geral.
- ✅ **R7.9** Colisão: leis que colidem não valem juntas.
- ✅ **R7.10** Processo: índice que anda sozinho (deriva).
- ◐ **R7.6** Temas em pacotes de leis pequenas (planilha completa; 5 escolhas de lista fora: vistos por país, setores, verba das estatais, ministérios).
- ◐ **R7.7** Todo dinheiro passa por lei (leis de propriedade ainda sem efeito).
- ◐ **R7.12** Toda lei chega ao pop por renda, emprego, preço, serviço ou direito (hoje quase todas só por índice).
- ◐ **R7.13** Toda lei e índice numa esfera (planilha sim; no jogo ainda nas 8 áreas antigas).
- ☐ **R7.8** Revogar = propor a volta a "não legislada", com voto.
- ☐ **R7.11** Lei age pelo órgão: a regra funciona na medida da verba do órgão (ver R6.16).
- ☐ **R7.16** Tipos de lei: Lei com prazo (acaba sozinha), Ato, Posição por país, Operação.
- ☐ **R7.17** Parte da divisão: a fatia vale o peso dela sobre a soma, quando a mecânica ler.

**Programas** (12/nov)

- ✅ **R7.18** 73 programas (aba Programas; 1 espera leis que o jogo ainda não tem): forma-se quando a maior parte das leis anda o mínimo na direção dele dentro do mandato; desfaz-se se elas voltam. (12/nov)
- ◐ **R7.19** Lembrança e nostalgia: formado, os grupos lembram (pesa no voto); desfeito, vira nostalgia; recriado, o jogo pergunta se usa o mesmo nome. (12/nov: a lembrança de cada grupo é guardada e a nostalgia fica; refeito, volta com o mesmo nome. Falta pesar no voto e perguntar o nome.)
- ◐ **R7.20** Nome: o país dá o nome próprio; senão o gerador cria pelos moldes e pelas 4 palavras; o jornal anuncia. (12/nov: feito; o jornal do turno anuncia o programa formado.)
- ✅ **R7.21** Programa espalhado por vários ministérios anda no passo do ministro mais fraco. (12/nov: o programa espera o maior atraso entre as leis dele, 0 ou 1 turno.)

**Construção (programas)**

- Dados: abas Programas e Programas - leis → `mundo/programas/programas.json` (`npm run programas`); moldes de nome em `mundo/programas/nomes.json`; país em `paises/<id>/programas.json` (`nomes` e `formados`, com a lembrança dos grupos se ele quiser dizê-la).
- Estado: `programas` (formados, turno em que formou, lembrança por grupo, nome dado).
- Módulo: `programas`.
- Turno: depois do Congresso e da mesa (lei assinada conta na hora da aprovação).
- Fatos: ouve "lei aprovada"; emite "programa formado", "programa desfeito" (o jornal e os grupos leem).
- Tela: bolha do programa na esfera, com as leis que faltam; aviso antes de uma lei desfazer.
- Teste: aprovar 3 de 4 leis na direção forma; voltar uma desfaz e deixa nostalgia.

## 8. Bússola

- ✅ **R8.1** Eixos `economico` e `social`, de −1 a +1.
- ✅ **R8.2** Leis, partidos, grupos e potências têm posição.
- ✅ **R8.3** Posição do país = média das leis com peso.
- ✅ **R8.4** Quem gosta sai da distância.
- ◐ **R8.5** Pops deslizam com a vida (feito) e com a mídia (falta; R14.8).
- ☐ **R8.6** O jogo percebe padrões ("corte de gastos").

## 9. Índices

- ✅ **R9.1** Índices essenciais do motor.
- ✅ **R9.2** Índices de jogabilidade do mundo (147, da planilha; valor de partida 50 se o país não disser).
- ✅ **R9.8** Seis índices principais marcados (aba Índices, coluna Principal).
- ◐ **R9.3** Inflação que se move.
- ◐ **R9.4** Todo índice tem efeito além da cobrança dos grupos.
- ☐ **R9.5** Desemprego e ocupados se movem com a economia (R16.27).
- ☐ **R9.6** Índice da bolsa.
- ✅ **R9.9** Aprovação = satisfação média dos pops pesada pelo tamanho. (12/nov: é `satisfacaoMedia`, lida pelo Congresso e pela eleição; aparece na janela Eleição.)

## 10. Contas do Estado

- ✅ **R10.1** Receita, gasto, juros, cofre e dívida separados.
- ✅ **R10.2** Juros sobem com dívida e inflação.
- ✅ **R10.3** Regra fiscal por lei.
- ◐ **R10.4** Dinheiro na moeda do país.
- ☐ **R10.5** Emissão de moeda.
- ☐ **R10.6** Calote.

## 11. População e grupos

- ◐ **R11.1** Pops com renda vinda da economia (renda ainda é parte fixa do PIB; R16.26).
- ✅ **R11.2** Grupos com bússola, tamanho e satisfação.
- ✅ **R11.3** Radicais e lealistas.
- ◐ **R11.4** Satisfação lê renda, índices e leis (falta mídia e programas).
- ✅ **R11.5** Pops mudam de setor estudando.
- ✅ **R11.6** Pops sobem e descem de estrato.
- ✅ **R11.7** Cada pop tem bússola e desliza com a vida.
- ◐ **R11.19** Raiva do grupo (0–100), separada da satisfação (falta: mídia mobiliza).
- ☐ **R11.8** Pop guarda idade, cidade ou campo, vínculo, escolaridade, patrimônio.
- ☐ **R11.9** Nascer, envelhecer, morrer.
- ☐ **R11.10** Insatisfeito sai: informalidade, fuga de dinheiro, emigração.
- ☐ **R11.11** Grupo forte torna mais populares as leis perto dele.
- ☐ **R11.12** 32 pops em 4 blocos, com crianças.
- ☐ **R11.13** 25 grupos atravessam os pops.
- ☐ **R11.14** Organizações políticas nascem de radicais e têm líder e ação.
- ☐ **R11.15** Crime organizado nasce do mercado ilegal e da falta de Estado.
- ☐ **R11.16** Gerador de organizações.
- ☐ **R11.17** Pops por estado (medido possível em 12/nov).
- ☐ **R11.18** Financiadores de organizações e rastro.

## 12. Congresso

**Voto** (11–12/nov)

- ✅ **R12.1** Toda mudança de lei é votada.
- ✅ **R12.2** Partidos do país com cadeiras, bússola e grupos.
- ✅ **R12.11** Placar previsto = placar real, sem sorteio; muda só com fato do turno, que aparece. (12/nov: `placarPrevisto` usa a mesma conta da votação; tela na janela da lei.)
- ✅ **R12.12** Nota do partido: bússola, grupos, base ou oposição, apoio da população, aprovação e **conta da lei** (% do PIB, pesando mais com déficit alto); exorbitante é a lei que perde a maioria pela conta. (12/nov: voto.ts; pesos de partida, a calibrar.)
- ✅ **R12.13** Fiéis e livres pela coesão; ano de eleição puxa o voto para o povo. (12/nov.)
- ✅ **R12.14** Quórum por classe (comum, absoluta, constitucional, mandato), mudado pela lei Quórum das votações. (12/nov: coluna Classe na planilha, 59 leis fora da comum.)
- ✅ **R12.7** Duas casas em sequência: Câmara no turno 1, Senado no turno 2; Senado muda, volta à Câmara; país de uma casa vota uma vez. (12/nov: Brasil com Senado de 81 cadeiras; Senado emenda a lei de régua que cai pela conta.)
- ☐ **R12.15** Bancadas temáticas e lobby das companhias.

**Moedas e relação**

- ✅ **R12.3** Coligação: convidar (oposição acima de 70), sair (termômetro abaixo de 20), voltar pelo convite (12/nov). Falta cobrar o que o partido pediu na mesa (passo Mesa).
- ◐ **R12.4** Seis moedas: ceder na régua, ministério, cargos, emenda, promessa de lei, decreto; cada compra sobe o preço do próximo voto. Falta: botões de promessa e decreto na tela; ceder, cargos, emenda e ministério têm botão (12/nov).
- ✅ **R12.16** Termômetro por partido (0–100): base sai abaixo de 20; oposição entra acima de 70. (12/nov: convite pelo pedido `convidar`.)
- ✅ **R12.17** Paciência por casa (0–100): abaixo de 30 a casa pune o governo. (12/nov.)
- ✅ **R12.18** Carga da casa: passou do limite, a lei entra na fila (sem pontos de ação). (12/nov: carga padrão 3 por casa.)
- ◐ **R12.19** Decreto: vale já, Congresso confirma em 2 turnos; fato consumado; alcance pela lei Poder de decreto (4 degraus). Falta: os grupos que ganhavam ficarem com raiva de quem derruba (fato `grupo-com-raiva`; depende dos grupos) e o botão na tela.

**A casa agindo**

- ✅ **R12.6** Veto com observação e derrubada do veto. (12/nov: só vale para lei emendada; observação guardada na votação.)
- ☐ **R12.5** Rejeitar, emendar, propor lei popular, travar a pauta, CPI.
- ☐ **R12.10** Lei popular passa mais fácil; o Congresso propõe por conta própria.
- ☐ **R12.8** Sistemas: presidencialismo, parlamentarismo (moção), semipresidencialismo (coabitação), partido único (alas, congresso do partido, expurgo).
- ☐ **R12.9** Cadeiras mudam a cada eleição.

**Construção**

- Dados: `paises/<id>/congresso.json` (casas, partidos com nome e cor reais, cadeiras, bússola, grupos, coesão, quórum de partida, sistema); classe de cada lei (coluna nova na planilha).
- Estado: `congresso` (por casa: paciência, carga, fila; por partido: termômetro, preço que sobe, coesão; votações em andamento com turno de cada casa; decretos vigentes).
- Módulo: `congresso` (nasce do `politica` de hoje).
- Turno: primeira etapa (pedidos do jogador → votações).
- Fatos: emite "lei aprovada", "lei rejeitada", "emenda", "veto derrubado", "decreto derrubado", "partido saiu da base", "CPI aberta"; ouve "manchete contra", "escândalo", "grupo com raiva", "aprovação".
- Tela: semicírculo, termômetro em arco, ponteiro da paciência, barra de carga, placar com linha do quórum, "até aqui passa" na régua.
- Teste: placar previsto igual ao apurado; lei cara perde votos com déficit alto; Senado que muda devolve à Câmara; decreto derrubado deixa os grupos que ganhavam com raiva de quem derrubou.

## 13. Eleição, campanha e mandatos

- ✅ **R13.1** Mandato e eleição pela lei do país.
- ✅ **R13.2** Desgaste sobe sempre.
- ◐ **R13.3** Voto por grupo (satisfação feita; falta bússola dos candidatos, campanha e mídia).
- ✅ **R13.9** Adversários são os partidos de oposição, que lançam chapa e podem se coligar. (12/nov)
- ✅ **R13.10** Dois turnos: segundo no último turno jogável do mandato, primeiro no anterior. (12/nov)
- ◐ **R13.11** Promessa: meta do mandato (principal, subíndice ou programa), prêmio pelo tamanho, cumprir em parte vale em parte, avaliada no primeiro turno; trocar é quebrar. (12/nov: tudo feito, falta descontar o que o país faria sozinho.)
- ☐ **R13.4** Limite de reeleição: o partido troca de candidato.
- ☐ **R13.5** Chapa entre fichas do partido e aliados.
- ☐ **R13.6** Coligação eleitoral (TV, caixa, eleitores; cobra lugar).
- ☐ **R13.7** Campanha nos últimos turnos: ações com alvo pagas pelo caixa, rendimento cai ao repetir.
- ☐ **R13.8** Reduzir o desgaste (nunca zera).

**Construção**

- Estado: `eleicao` (promessa com meta e base, chapas, resultado do 1º turno).
- Módulo: `eleicao`; a Aprovação (R9.9) é conta da `populacao`/`grupos`, lida aqui.
- Turno: última etapa, só nos turnos de eleição.
- Fatos: ouve "programa formado" (promessa de programa), "escândalo"; emite "eleição vencida/perdida", "segundo turno".
- Teste: promessa pequena cumprida rende pouco; perder no segundo turno acaba a partida.

## 14. Mídia

- ◐ **R14.1** Mídias do país (8 maiores e redes): dono, bússola, audiência por grupo, credibilidade. (12/nov: Brasil com 8 mídias inventadas e as redes, no estado; ninguém lê ainda, é o passo 12.)
- ✅ **R14.4** Jornal do turno: a notícia de maior impacto sai dos fatos. (12/nov: as 3 maiores, no topo do Resultado do turno.)
- ☐ **R14.3** Pauta: cada mídia escolhe uns 3 fatos (tamanho, lado, dono, medo).
- ☐ **R14.2** Enquadramento: o efeito da lei na opinião passa pela mídia.
- ☐ **R14.8** A mídia muda o lado do pop devagar (bolha, redes, freio da instrução).
- ☐ **R14.9** A mídia mobiliza a raiva (R11.19).
- ☐ **R14.10** Fato e versão; mentira descoberta.
- ☐ **R14.5** Leis de mídia agindo (publicidade, emissora estatal, regulação, censura).
- ☐ **R14.6** Redes: rápidas, polarizam, boato com instrução baixa.
- ☐ **R14.11** Atos do presidente com a mídia (entrevista, pronunciamento…).

**Construção**

- Dados: `paises/<id>/midias.json` (nome inventado, dono, bússola, audiência, credibilidade); manchetes por moldes em `mundo/jornal/manchetes.json`.
- Estado: `midias` (credibilidade, pauta do turno).
- Módulo: `midia`.
- Turno: depois de todos os módulos que emitem fatos.
- Fatos: ouve todos; emite "manchete contra/a favor de X" (Congresso e grupos leem).
- Tela: jornal do turno; a mídia no mapa; perfil da emissora.
- Teste: o mesmo fato sai a favor na mídia perto do governo e contra na longe.

## 15. Mundo

- ✅ **R15.1** Potências com bússola, peso e relações (inventadas; trocar pelos 30 reais).
- ✅ **R15.2** Reputação = média das opiniões pesada; segurança externa.
- ◐ **R15.3** Potência reage (opinião anda; falta o cardápio).
- ☐ **R15.7** Países reais: os 30 maiores, vizinhos e resto do mundo; 11 jogáveis com as duas fichas.
- ☐ **R15.8** País leve: ficha leve (economia resumida, governo, regime, poder militar, jeito).
- ☐ **R15.9** IA em 3 passos com o cardápio (comércio, dinheiro, segurança, palavra), linhas vermelhas e um degrau por vez com aviso.
- ☐ **R15.10** Governos que já existiram: a cada eleição o novo governo cai perto de um ponto da história.
- ☐ **R15.11** Posições por país no menu do país (não são leis).
- ☐ **R15.4** Sanção pelo mercado.
- ☐ **R15.5** Ataque externo (sem revide).
- ☐ **R15.12** Tela do Mundo: ranking com a relação e a ficha do país.

**Construção**

- Dados: abas Países e Países - governos → `mundo/paises-leves.json`.
- Estado: `mundo` (por país leve: governo, opinião sobre cada um, posições).
- Módulo: `mundo`.
- Turno: depois da economia do jogador; o que toca o jogador vira papel.
- Teste: virar ditadura derruba a opinião dos democráticos em um turno; nada vai de amigo a sanção num turno só.

## 16. Economia

A V1 pede só R16.26 e R16.27 (passo 10 da ordem); o resto vem depois.

**Mercado**

- ✅ **R16.1** Produtos em setores, mercado do país e do mundo.
- ✅ **R16.2** Demanda dos pops; falta de comida vira fome.
- ✅ **R16.3** Energia como capacidade (usinas contra demanda).
- ◐ **R16.4** Comércio por tarifa, subsídio e acordo.
- ◐ **R16.5** Cadeia entre setores (aço → máquinas → veículos).
- ☐ **R16.6** Setores com regra própria (moradia, remédios, militar).

**Terra e moradia (campo × cidade)**

- ☐ **R16.17** Moradia é estoque local (formal e precária) e sai do mercado do mundo.
- ☐ **R16.18** Quem constrói: empresas, governo (lei) e pops (pobre autoconstrói, médio financia, rico investe).
- ✅ **R16.19** Índices déficit, preço e favela (deriva em `derivas.json`, 04/nov; não equilibrado).
- ☐ **R16.20** Leis da cidade em 4 alavancas × 6 lados, com colisões.
- ☐ **R16.21** Terra rural de donos grandes, pequenos ou parada; concentração muda quanta gente vive do campo.
- ☐ **R16.22** Êxodo: gente do campo vai à cidade quando a renda esperada lá passa a do campo.
- ☐ **R16.23** Quem chega à cidade pede casa; sem oferta, sobe déficit e favela.
- ☐ **R16.24** Leis do campo nos 6 lados, ligadas à cidade só pelo êxodo.
- ☐ **R16.25** Bem tomado pelo Estado (terra ou empresa) ganha destino por lei: comunidade, Estado ou famílias com título; uma lei por destino (GDD §18, a decidir).

**Construções** (pilar 1)

- ☐ **R16.7** Construções produzem, empregam e dão lucro; o PIB é a soma delas.
- ☐ **R16.8** Obra com custo e prazo por tipo, em fila; construção civil decide quantas andam.
- ☐ **R16.9** Lucro = receita − salários − insumos − impostos; prejuízo seguido fecha.
- ☐ **R16.10** Corrupção atrasa e encarece obras.

**Empresas e dono** (pilar 2)

- ◐ **R16.11** Empresas declaradas pelo país (feito `empresas.json`; falta ligar às construções).
- ☐ **R16.12** Lucro vai ao dono (investidores e reserva, exterior, cofre, trabalhadores).
- ☐ **R16.13** Reserva privada abre obras; verba estatal por lei; patrocínio do Estado.
- ☐ **R16.14** Atos do Estado por lei (estatizar, criar, vender, cooperativa) com leis de propriedade.

**Bolsa** (pilar 3)

- ◐ **R16.15** Pregão: blocos de 2%, dividendo sem mando (protótipo na tela).
- ☐ **R16.16** Preço = lucro × múltiplo; compradores com caixa; cofre real; ficha da empresa.
- ☐ **R16.28** Ações fazem parte do patrimônio dos pops; dividendo vira renda.
- ☐ **R16.29** Bolsa funciona sem o governo: empresas, investidores e preços andam sozinhos.
- ☐ **R16.34** Preço da ação sai de lucro, juros, risco, crescimento esperado e humor.
- ☐ **R16.35** Investidores com caixa e comportamento próprio geram alta, euforia, pânico e quebra.
- ☐ **R16.30** Base do mercado e leis para regulamentar ou entrar, com caminhos liberal, coordenado e Estado dono.
- ☐ **R16.31** Serviços do Estado são prédios fora do mercado: pagos pelo orçamento, com emprego e sem lucro.
- ☐ **R16.32** Terceirizar serviços do Estado por lei, como segurança, presídios, hospitais e escolas.

**Ligação entre pops e economia** (base do jogo)

- ☐ **R16.26** A renda do pop sai de salário, lucro, aluguel e transferência.
- ☐ **R16.27** Falta de trabalhador freia a produção; o desemprego sai daí.
- ☐ **R16.36** Consumo: pops, pequenos mercados, mercados, prédios, Estado e exterior compram.
- ☐ **R16.37** Prédio contrata por qualificação; salário sai de qualificação, lucro e disputa por gente.
- ☐ **R16.38** Crédito de bancos a pops, prédios e Estado.
- ☐ **R16.39** Câmbio, regime e reservas ligam comércio, inflação, dívida e investidores.
- ☐ **R16.33** Caminho do lucro completo: valor adicionado, salário, encargos, desgaste, juros, imposto, reinvestimento e dividendo.

## 17. Tela e mesa

- ✅ **R17.1** Mapa: leis como bolhas em áreas; índices, grupos e potências.
- ✅ **R17.2** Votação, passar o turno, resultado do turno.
- ✅ **R17.3** Salvar e carregar.
- ◐ **R17.4** Fichas por cima do mapa (retrato feito; atributos faltam).
- ◐ **R17.5** Prévia de quem ganha e perde antes de propor.
- ☐ **R17.12** Mapa por ministério e esfera (hoje 8 áreas antigas, cheias demais).
- ◐ **R17.6** Mesa: carimbos assinar, vetar (com observação), recusar, encaminhar, pilha. (12/nov: feitos assinar e vetar com observação na janela Mesa; faltam recusar, encaminhar e pilha, que dependem de outras partes prontas: as outras famílias de papel.)
- ◐ **R17.7** Famílias de papel: leis, crises, pedidos, ofertas, órgãos, partido, duvidosos; conteúdo sai dos números. (12/nov: só a família Leis, com papel de sanção e avisos; o texto sai da lei e do valor. Faltam crises, pedidos, ofertas, órgãos, partido e duvidosos, que dependem de outras partes prontas: o módulo de cada um.)
- ◐ **R17.13** Prazos: ignorar tem consequência (lei passa sozinha ou cai, crise piora, aliado se afasta). (12/nov: papel de lei vale 1 turno; ignorar vira sanção tácita ou veto tácito pela regra do país, `ignorar`; falta crise e aliado se afastar, que dependem de outras partes prontas: Partido e as outras famílias.)
- ☐ **R17.14** Papéis duvidosos deixam rastro (R6.21).
- ☐ **R17.8** Encaminhar ao ministro: ele decide pela ficha.
- ☐ **R17.9** A mídia lê a mesa.
- ☐ **R17.10** Mesa do partido.
- ☐ **R17.11** Momentos do partido como telas curtas.
- ☐ **R17.15** Causa e efeito: "o que empurra" no índice, "a conta que vem" na lei, marca da lei no gráfico.

**Construção (mesa)**

- Estado: `mesa` (papéis com tipo, prazo, opções e quem pediu).
- Módulo: `mesa`.
- Turno: logo depois do Congresso (lei aprovada vira papel) e depois de cada módulo que pede algo.
- Fatos: ouve "lei aprovada", "emenda", "crise", "pedido"; emite "papel assinado/vetado/ignorado".
- Teste: lei ignorada até o prazo segue a regra do país (sanção ou veto).

---

## Ordem de construir

A ordem segue a dependência: primeiro o que os outros usam. Cada passo fecha
jogável (teste ou tela) antes do próximo. Até o passo 10 é a **V1**: o Brasil
de hoje jogado por um mandato inteiro, para mostrar a pessoas.

| #   | Passo                  | Requisitos                                        | Por que nesta ordem                                                                                                                         |
| --- | ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Brasil 2026            | R4.3                                              | Sem país de verdade, nada se mostra. Começa com o que o motor lê hoje; ministérios, mídias e programas de antes entram no passo de cada um. |
| 2   | Fatos do turno         | R4.12                                             | Congresso, mesa, programas, mídia e eleição conversam por fatos; sem eles, um chamaria o outro.                                             |
| 3   | Congresso novo         | R12.11–R12.14, R12.7, R12.16–R12.19, R12.4, R12.6 | É o coração da jogada: toda lei passa por ele.                                                                                              |
| 4   | Mesa mínima            | R17.6, R17.7 (só família Leis), R17.13            | Lei aprovada, emenda e veto chegam como papel.                                                                                              |
| 5   | Governo                | R6.10, R6.14, R6.15, R6.7, R6.8, R6.16, R6.17     | Ministério é moeda do Congresso; ficha muda força e atraso.                                                                                 |
| 6   | Programas              | R7.18–R7.21                                       | Usa leis aprovadas (3) e ministros (5).                                                                                                     |
| 7   | Jornal mínimo          | R14.1, R14.4                                      | Anuncia programa, escândalo e votação; dá sentido ao turno.                                                                                 |
| 8   | Eleição nova           | R9.9, R13.9–R13.11                                | Aprovação, promessa e dois turnos fecham o mandato.                                                                                         |
| 9   | Começo da partida      | R4.5, R4.6, R4.8–R4.10                            | Junta país, partido, chapa e ministérios num menu.                                                                                          |
| 10  | Base do jogo e tela V1 | R16.26, R16.27, R17.12, R17.15                    | O jogador sente a lei no bolso do pop e vê causa e efeito. **V1.**                                                                          |
| 11  | Perder o poder         | R6.13, R6.3, R6.5, R6.19                          | Sucessão, impeachment, golpe.                                                                                                               |
| 12  | Mídia completa         | R14.2, R14.3, R14.8–R14.11                        | Enquadramento, raiva, fato e versão.                                                                                                        |
| 13  | Mundo leve             | R15.7–R15.12                                      | Países reais com IA.                                                                                                                        |
| 14  | Justiça e estados      | R6.20–R6.23, R17.14                               | Rastro, tribunal, governadores.                                                                                                             |
| 15  | Partido e campanha     | R5.*, R13.4–R13.8, R17.10                         | Caixa, coesão, chapa, ações de campanha.                                                                                                    |
| 16  | Economia completa      | R16.*                                             | Construções, empresas, bolsa (plano, passo 12b).                                                                                            |
| 17  | População completa     | R11.8–R11.18                                      | Idade, saída, organizações, pops por estado.                                                                                                |

## Fora do jogo pronto

Guerra iniciada pelo país, pesquisa como árvore (GDD, seção 18).
