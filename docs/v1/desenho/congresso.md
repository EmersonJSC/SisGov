# Câmara e Senado (V1-11)

**Status:** APROVADO (13/out) e implementado (V1-11). Resultado da prova na
seção 10.

## 0. Resumo

O Congresso tem **6 bancadas mais o seu partido** (blocos de partidos), mas o tamanho delas e o
voto delas **saem da rede**, não da estatística copiada. A eleição real de
2026 serve de **prova**, como os 10 programas serviram para a bússola: o
modelo tem que chegar perto dela sozinho.

São três camadas, cada uma de um método estudado:

1. **Quem elegeu quem.** Os 2.090 perfis sintéticos escolhem bancada pela
   distância na bússola e pelos segmentos (voto espacial probabilístico). As
   cadeiras saem da soma desses votos pela regra do país.
2. **Como cada cadeira vota.** Pelo humor dos segmentos que a elegeram
   (representação diádica), pela bússola, pelo partido e pelos acordos.
3. **As cadeiras mudam no mandato.** Quando o eleitor de uma bancada fica
   irritado, cadeiras trocam de bancada (o troca-troca real).

Os nomes dos partidos reais ficam só na calibragem (`src/conteudo/bussola/`);
no jogo aparecem as bancadas.

## 0.1 As três camadas

### Camada 1: as cadeiras saem dos perfis

- Cada bancada tem um ponto na bússola. Cada perfil também tem um ponto,
  tirado dos atributos dele: renda e ocupação puxam a economia; valores e
  religião puxam os costumes (regra a calibrar, inferida).
- A chance de um perfil votar numa bancada cai com a distância entre os dois
  e sobe com a ligação dos segmentos dele com ela. É o **modelo de voto
  espacial probabilístico** (logit multinomial), o padrão da ciência
  política para simular eleição a partir de eleitores (Adams, Merrill e
  Grofman, 2005; Desposato, 2004, com regras do Brasil).
- Somando os 2.090 perfis pelo peso de cada um, sai a fatia de votos de cada
  bancada. A **Câmara** reparte as 513 cadeiras pela regra proporcional
  (quociente e sobras, como o Código Eleitoral). O **Senado** é por maioria
  em cada estado, o que dá mais cadeiras para quem ganha (aproximação a
  calibrar).
- **Prova:** a composição que sai do modelo tem que ficar perto da eleita em
  2026 (tabela da seção 2), bancada por bancada, dentro de uma tolerância.
  Se não ficar, o erro mostra o que falta na rede, como aconteceu com a
  bússola.
- Bônus: com isso, cada bancada **sabe quem votou nela** (quanto do eleitor
  dela é pobre, evangélico, do agro…). A coluna "Representa" da seção 2 deixa
  de ser escrita à mão e passa a ser calculada.

### Camada 2: o voto de cada cadeira

Cada cadeira olha para o eleitor que a elegeu. É a **representação
diádica**: o deputado vota conforme a opinião da sua base (Miller e Stokes,
1963, e os estudos que seguiram). A nota de cada bancada numa lei soma:

1. O efeito da lei no **humor dos segmentos que a elegeram**, pesado pela
   fatia de cada um no eleitor dela.
2. A **distância na bússola** entre a lei e a bancada.
3. A **disciplina** e os **acordos** com o governo (mais de 80% da base
   segue o líder, Figueiredo e Limongi).
4. As **frentes** (agro, evangélica), que são a parte de cada bancada eleita
   por esses segmentos.

A nota vira a chance de cada cadeira votar sim, com sorteio de semente.

### Camada 3: as cadeiras andam no mandato

Na vida real, **122 deputados (1 em cada 4) trocaram de partido** na janela
de março de 2026. No jogo:

- Uma vez por ano, parte das cadeiras de uma bancada cujo eleitor ficou
  irritado passa para a bancada mais próxima dos segmentos insatisfeitos.
- Um governo popular atrai cadeiras do centro para a base (adesismo); um
  governo impopular perde.
- Quando houver eleição (versão 2), a camada 1 roda de novo com o humor do
  momento.

## 1. Os números de verdade (servem de prova, não de entrada)

| Dado                                      | Valor                                                                                                | Fonte                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Câmara eleita em 2026 (posse em fev/2027) | 513 cadeiras; PL 121, federação PT 88, federação União-PP 87…                                        | CNN Brasil, contagem da Câmara com 99,99% das urnas |
| Senado a partir de 2027                   | 81 cadeiras; PL 28, PT 9, MDB 8…                                                                     | CNN Brasil                                          |
| Disciplina                                | mais de 80% da base vota como o líder do governo manda, desde 1989                                   | Figueiredo e Limongi (Revista Pesquisa FAPESP)      |
| Sucesso do Executivo                      | 77,3% dos projetos do presidente viram lei; 83,5% das leis aprovadas são do Executivo                | idem                                                |
| Frente do agro                            | cerca de 330 deputados e 47 senadores ligados ao agro após 2026 (estimativa do presidente da frente) | Canal Rural, 6/out/2026                             |
| Frente evangélica                         | 219 deputados e 26 senadores (fev/2025)                                                              | Agência Câmara                                      |

Os números da eleição ainda podem mudar um pouco (candidaturas sub judice).
As frentes são listas de assinatura e incham: muita gente assina e não vota
junto sempre. Por isso entram com um peso menor (seção 4).

## 2. As 5 bancadas (primeira versão)

> Substituída pelas 6 bancadas da seção 5.1. Fica como registro da soma real
> por partido.

Cadeiras eleitas em 2026, somadas por bancada: é o **alvo da prova** da
camada 1, não o número que o jogo usa. A lista partido → bancada fica em
`bussola/`. O ponto na bússola é a média dos partidos no V-Party, pesada
pelas cadeiras. A coluna "Representa" é só um palpite para conferir: no
jogo ela sai da camada 1.

| Bancada         | Partidos (calibragem)                               |  Câmara | Senado | Bússola (eco, cost.) | Representa                                                                                |
| --------------- | --------------------------------------------------- | ------: | -----: | -------------------- | ----------------------------------------------------------------------------------------- |
| Direita         | PL, Novo                                            |     131 |     31 | (7,4; 7,2)           | Conservadores, Evangélicos, Agronegócio, Empresários, Interior                            |
| Centrão         | União-PP, Republicanos, Podemos, Missão             |     156 |     19 | (5,3; 1,9)           | Evangélicos, Agronegócio, Interior, Pequenos empreendedores                               |
| Centro          | PSD, MDB, PSDB-Cidadania, PRD-Solidariedade, Avante |     102 |     16 | (2,4; -1,3)          | Interior, Classe média, Aposentados, Servidores públicos                                  |
| Centro-esquerda | Federação PT-PCdoB-PV, PSB, PDT                     |     109 |     14 | (-1,9; -4,7)         | Pobres, Trabalhadores com carteira, Periferias, Agricultura familiar, Servidores públicos |
| Esquerda        | PSOL-Rede                                           |      15 |      1 | (-6; -8)             | Progressistas, Ambientalistas, Jovens, Informais e de aplicativo                          |
| **Total**       |                                                     | **513** | **81** |                      |                                                                                           |

Inferido, não medido (a conferir):

- **PL:** o V-Party mede o PL de 2018, antes do grupo do Bolsonaro chegar
  (2021). Uso o ponto do PSL de 2018, que era esse grupo.
- **Novo, União, Podemos e PSOL** não estão no V-Party 2018 com esses nomes:
  União = DEM + PSL; Novo e PSOL estimados pelos programas. Vão marcados como
  estimativa no arquivo.
- **Senado:** o senador sem partido entra no Centro.

## 3. A disposição de cada bancada

A disposição (0 a 100) é o humor da bancada com o seu governo. Ela:

- **Sobe** quando os segmentos que a bancada representa ficam mais
  satisfeitos e **cai** quando ficam insatisfeitos (média dos segmentos dela,
  com atraso de 1 turno).
- **Sobe** quando o seu governo anda para perto do ponto dela na bússola e
  **cai** quando se afasta.
- **Muda** com os acordos (pedidos do Congresso, no V1-12) e com a aprovação
  do governo (presidente popular arrasta o centro).
- **Começa** em 50 para todos. A sua bancada começa alta (seção 5).

## 4. O voto (base para o V1-12)

Está na camada 2 (seção 0.1). O V1-12 usa essa nota para a tramitação.

## 5. O seu partido (decisão do autor, 13/out)

**Regra: o jogo nunca pergunta o lado do jogador.** O sistema descobre pelas
leis que ele faz, como a bússola já faz.

- O seu partido é **um bloco a mais**, fora das 6 bancadas. Ele ganhou a
  eleição de 2026 (pode ser lido como terceira via, PT ou PL, mas o jogo não
  diz), e começa com **poucas cadeiras**.
- **O ponto dele na bússola é o seu ponto** (o rumo das suas leis). Começa
  no ponto do país e anda com você.
- **As cadeiras andam até ele** pela camada 3: cada ano, parte das cadeiras
  das bancadas mais perto do seu ponto, cujo eleitor está satisfeito, passa
  para o seu partido. Se você vai para a direita, quem vem é da direita; se
  vai para a esquerda, vem da esquerda. Se você fica impopular, elas saem.
- As cadeiras do seu partido votam com você quase sempre (mais de 80%,
  como a base real segue o líder).

Para outros países, a configuração diz quantas casas há (o Brasil tem duas;
um país pode ter uma), quantas cadeiras cada uma tem, as bancadas e as
regras de votação.

## 5.1 Extremos e grupos de pressão (decisão do autor, 13/out)

As bancadas passam a ser **6 mais o seu partido**: Extrema esquerda,
Esquerda, Centro, Centrão, Direita e Extrema direita. O ponto de cada uma na
bússola vem de partidos de referência medidos no V-Party (já em
`bussola/referencias.json`), não do Brasil:

| Bancada          | Referências (V-Party)                            | Bússola (eco, cost.) |
| ---------------- | ------------------------------------------------ | -------------------- |
| Extrema esquerda | A Esquerda (DE), França Insubmissa, Podemos (ES) | (-7,8; -5,6)         |
| Esquerda         | PT, PSB, PDT                                     | (-1,9; -4,7)         |
| Centro           | PSD, MDB, PSDB                                   | (2,4; -1,3)          |
| Centrão          | PP, Republicanos, DEM                            | (5,2; 1,0)           |
| Direita          | DEM, PRO (AR), Renovação Nacional (CL)           | (4,9; -1,3)          |
| Extrema direita  | PSL de 2018, Vox, Liga                           | (6,8; 6,3)           |

Quantas cadeiras cada uma tem sai da camada 1. A prova compara somas, porque
partido real não se divide em extremo e não extremo: Extrema esquerda mais
Esquerda tem que dar perto de 124 (PT e federação, PSB, PDT, PSOL-Rede), e
assim por diante.

**Grupos de pressão ligados a um extremo.** Alguns grupos de `pressao.md`
são de um lado só (os "vistos como E" ou "D"). Eles pesam no humor da
bancada do seu lado: quando os Militares da reserva, o Movimento armamentista
ou a Rede de influenciadores de direita se mobilizam, a Extrema direita
endurece; quando as Frentes populares de esquerda ou os Movimentos por terra
se mobilizam, a Extrema esquerda endurece.

## 5.2 Frentes: voto mais influência (decisão do autor, 13/out)

Uma frente (agro, evangélica, armas, sindical…) é a parte de cada bancada
que vota junto com um grupo. O tamanho dela vem de duas coisas:

1. **Voto:** a fatia do eleitor da bancada que é daquele segmento (camada 1).
   Se 30% dos votos do Centro vieram do agro, 30% do Centro já pende para o
   agro.
2. **Influência:** o dinheiro e a mídia do grupo de pressão ligado
   (`pressao.md` 3.2, mais o patrocínio). Influência alta puxa mais cadeiras
   para a frente, além das que o voto deu. É o lobby, o financiamento de
   campanha e as emendas: o agro no Brasil pesa mais no Congresso do que o
   tamanho do seu eleitorado.

**A influência muda com as leis.** Hoje os recursos de cada grupo são fixos
(1 a 3). Passam a andar: lei que beneficia o grupo aumenta o dinheiro dele
com o tempo; lei que o prejudica diminui. Exemplo: uma reforma agrária tira
terra e renda do agro, a influência do agro cai e a frente do agro perde
força nas votações seguintes. Um imposto sobre apostas enfraquece as casas
de apostas; liberar armas fortalece a indústria de armas.

Isso vira um minijogo de ordem: enfraquecer um grupo antes de votar a lei que
ele bloquearia. O custo é a reação do grupo (pressão) no meio do caminho.

## 5.3 Frentes dos dois lados e força pela pressão social (pedido do autor, 13/out)

**Aprovado e feito (13/out).**

**O problema que a primeira votação mostrou.** A proibição total do aborto
passou com 18 dos 27 votos da Extrema esquerda. Medido: a frente evangélica
contava 45% dentro da Extrema esquerda e puxava o sim; não havia nenhuma
frente do outro lado puxando o não; e a bússola e o humor do eleitor pesavam
pouco.

**O que muda:**

1. **Frentes dos dois lados.** Entram frentes com os grupos de pressão que já
   existem:
   - direitos das mulheres: feminista;
   - diversidade: LGBT, movimento negro, matriz africana;
   - direitos humanos e povos: povos originários, quilombolas, pastorais;
   - e os movimentos conservadores de costumes entram na frente evangélica.
2. **A força anda com a pressão social, a cada turno.** O fator de influência
   hoje só cai com as leis que machucam o grupo. Passa a subir também com o
   nível de pressão do grupo (0 a 3, `pressao.md`). Exemplo: o feminicídio sobe
   a pressão do movimento feminista, a frente das mulheres ganha força e a
   liberação do aborto ganha votos, mesmo com a frente evangélica contra. É
   assim que o jogador enfraquece uma frente grande: mudando a opinião pública
   e a situação do país, não só por lei.
3. **A frente só pesa onde a base dela é forte.** Hoje toda bancada tem um
   pedaço de toda frente (a influência era somada por igual). Passa a ser a
   parte do eleitor da bancada na base do grupo vezes quanto ela passa da
   média do país: onde a base é fraca, a frente quase some.
4. **Prova nova:** uma lei polêmica de costumes divide o Congresso como na
   vida real (esquerda contra, direita a favor, centro dividido), e uma
   lei de costumes do outro lado divide ao contrário. Fica como teste.

**Feito.** Frentes novas e as contas em `mundo/congresso.json`
(`influencia.pesoDaPressao` 0,25, `teto` 2, `voto.escalaDaBussola` de 1 para
0,3, porque uma lei sozinha mexe pouco no ponto do país e o voto ficava sem
lado). Testes em `congresso.test.ts` e `tramitacao.test.ts`. Medido no turno
0, chance de cada bancada votar sim:

| Lei                        | Extr. esq. | Esquerda | Centro | Centrão | Direita | Extr. dir. |
| -------------------------- | ---------- | -------- | ------ | ------- | ------- | ---------- |
| Aborto: proibição total    | 0,20       | 0,21     | 0,90   | 0,91    | 0,78    | 0,90       |
| Aborto: sem lei penal      | 0,84       | 0,98     | 0,17   | 0,04    | 0,14    | 0,01       |
| Armas: posse e porte fácil | 0,18       | 0,37     | 0,97   | 0,96    | 0,96    | 0,93       |
| Armas: quase proibidas     | 0,75       | 0,94     | 0,18   | 0,06    | 0,14    | 0,01       |

A proibição total ainda passa (350 votos na Câmara), agora com a esquerda
contra (7 de 27 e 22 de 106 votam sim). É o problema do jogador que o autor
descreveu: o Centro vota com a direita nos costumes, e para virar isso é
preciso subir a pressão do outro lado.

**Depois (chamado próprio):** ferramentas do jogador para mudar a opinião
pública (campanha, comunicação, aliados na mídia).

**Medida provisória depois da derrota.** Se o Congresso derrubar a lei, o
presidente pode baixá-la por medida provisória. Na vida real isso é proibido
na mesma sessão (art. 62, § 10); no jogo vale, com um custo de humor bem
maior que a medida provisória comum. Os ganhos e perdas dos segmentos vêm
sozinhos, porque a lei vale na hora.

## 5.4 Prova com votações reais da Câmara (13/out)

**Pergunta do autor:** isso tem base científica? **Resposta:** o método
(voto pela distância ideológica, como o "ponto ideal" que a ciência política
tira das votações nominais) tem; os pesos eram estimativa. Por isso a prova:
votações nominais reais do Plenário (2023 a 2025, dados abertos da Câmara),
com uma lei parecida no jogo, comparadas com a chance que o modelo dá a cada
grupo no turno 0.

| Votação real                              | Lei no jogo               | Modelo (E / C / D) | Real (E / C / D)   |
| ----------------------------------------- | ------------------------- | ------------------ | ------------------ |
| Marco temporal (PL 490/2007)              | terras indígenas → 33     | 0,21 / 0,90 / 0,74 | 0,03 / 0,86 / 0,99 |
| Licenciamento (PL 2159/2021)              | licenciamento → 33        | 0,13 / 0,88 / 0,80 | 0,01 / 0,91 / 1,00 |
| Invasores de terra (PL 709/2023)          | reforma agrária → 0       | 0,12 / 0,89 / 0,81 | 0,10 / 0,94 / 0,99 |
| Progressão com 80% (PL 1112/2023)         | penas e progressão → 100  | 0,31 / 0,81 / 0,68 | 0,38 / 0,99 / 1,00 |
| Sustar decreto de armas (PDL 3/2023)      | armas → 100               | 0,33 / 0,97 / 0,96 | 0,01 / 0,76 / 0,98 |
| Feminicídio com pena maior (PL 4015/2023) | violência doméstica → 100 | 0,94 / 0,39 / 0,29 | 1,00 / 0,92 / 0,61 |

(Valores do modelo com `inclinacao` 4; com 6, a usada agora, ficam um pouco
mais firmes.)

**Resultado:** 16 de 18 lados certos; erro médio de 0,15 (0,17 antes de
subir a `inclinacao` de 4 para 6, o que combina com a disciplina de mais de
80% dos partidos). Os dois erros são a mesma lei: no Brasil o centro e a
direita também votam por pena maior para o feminicídio, e o jogo trata a
proteção da mulher como pauta só da esquerda. Corrigir isso é mexer no
conteúdo da lei (bússola dela e grupos que reagem), não na conta do voto.

**Corrigido pela pesquisa (13/out, Marco E).** A lei contra a violência
doméstica foi recodificada pelos temas do Manifesto Project, sem olhar a
votação para escolher os números:

- a lei especial junta a proteção da mulher (per706, igualdade) e a pena mais
  dura (per605, lei e ordem), que puxam para lados opostos nos costumes:
  `medidas-protetivas` passou de [0; −0,5] para [0; 0];
- a proteção integral soma a rede de abrigos e atendimento (per504, gasto do
  Estado): `protecao-integral` passou de [−0,5; −1] para [−0,25; 0];
- os conservadores perdem pouco (−0,03 em vez de −0,1): na lei do feminicídio
  de 2015 a bancada evangélica votou a favor e só pediu "sexo feminino" no
  lugar de "gênero".

Resultado: 17 de 18 lados certos e erro médio de 0,124 (antes, 16 e 0,151).
O feminicídio ficou em 0,93 / 0,66 / 0,46 contra o real 1,00 / 0,92 / 0,61.
O que sobra é a direita (46% contra 61%): o voto ainda pesa que a proteção
integral aumenta o gasto e que a oposição vota menos com o governo. A
catraca subiu para 17 lados e erro de 0,13.

Ficou como teste de catraca (`bussola/votacoes-reais.json` e
`tramitacao.test.ts`): o modelo não pode piorar. Duas votações importantes
ficaram de fora porque o jogo já começa com elas valendo (arcabouço fiscal e
igualdade salarial).

## 6. O que o jogador vê (decisão do autor, 13/out)

O Congresso **não aparece fisicamente** no jogo: não tem painel nem
plenário. Ele é um mecanismo por trás. Você manda a lei pelo tablet, as duas
casas votam lá dentro com as três camadas, e volta para você só o resultado
(passou, adiou ou caiu, com o placar). O que importa é o mecanismo da votação.

## 7. Arquivos

- `paises/brasil/politica.json`: as casas, as cadeiras, as 5 bancadas, as
  frentes e a fonte de cada número. Substitui os 3 partidos de teste que
  estão lá hoje (marcados como hipótese).
- `bussola/congresso.json`: a lista partido real → bancada e os pontos do
  V-Party, para a calibragem e o teste.
- `mundo/`: só o formato (casas, bancadas, frentes), sem nada do Brasil.

## 8. Checagem do D4

Não usa nada do D4: o D4 não tem Congresso com bancadas e votação. Os números
vêm da eleição de 2026, do V-Party e dos estudos citados.

## 9. Respostas do autor (13/out)

1. Três camadas, com a eleição de 2026 só como prova: **sim**.
2. Escolher bancada: **nunca**. O seu partido nasce pequeno e anda com as
   suas leis (seção 5).
3. Frentes: **sim**, com voto e influência, e a influência muda com as
   leis (seção 5.2).
4. Extrema direita e extrema esquerda, com grupos de pressão ligados: **sim**
   (seção 5.1).

## 10. Feito e prova (13/out)

Código em `src/game/congresso/`, regras em `mundo/congresso.json`, bancadas e
prova em `bussola/congresso.json`, casas em `paises/brasil/politica.json`.
Relatório: `npx vite-node scripts/congresso/prova.ts`. Testes:
`src/tests/congresso.test.ts` (16).

**Camada 1, só com as 6 bancadas (perfis de agora):**

| Grupo    | Câmara: modelo | Câmara: real | Erro | Senado: modelo | Senado: real | Erro |
| -------- | -------------: | -----------: | ---: | -------------: | -----------: | ---: |
| Esquerda |            141 |          124 | +14% |             22 |           15 | +47% |
| Centro   |            251 |          257 |  −2% |             40 |           35 | +14% |
| Direita  |            121 |          132 |  −8% |             19 |           31 | −39% |

Passam 2 de 6 (tolerância de 10%): centro e direita na Câmara. O teste
trava esse resultado; a meta é passarem os seis.

**Por que não passa (medido, não ajustado à força):**

- **Esquerda alta na Câmara.** O eleitor brasileiro vota mais à esquerda
  para presidente do que para deputado (voto pessoal e clientelista no
  deputado). Uma grade de ajuste acerta tudo se apagar a diferença entre os
  perfis (fatores de 0,05 e 0,2), o que seria copiar a eleição; ficamos com
  fatores de 0,4, que mantêm o perfil importando.
- **Senado.** Os perfis não têm estado, e o Senado dá 3 cadeiras a cada
  estado; os estados menores e mais conservadores pesam mais. Os perfis
  também não cruzam território com valores (o IPF só cruza renda, ocupação,
  idade e religião). Sem isso, o Senado fica como a Câmara.
- **Frentes.** Na Câmara, o modelo dá 33% de agro (real: cerca de 64%,
  estimativa do presidente da frente) e 49% de evangélica (real: 43%).
  Faltam o agro como ocupação ligada ao interior e a religião ligada aos
  valores nos perfis.

**Próximos passos para a prova passar (a decidir):** cruzar nos perfis
religião × valores e território × valores (pesquisas Datafolha e Quaest
publicam esses cruzamentos), e dar estado aos perfis para o Senado.

**Turno 0 com o seu partido:** 26 deputados e 4 senadores (5%). Disposição
inicial: Extrema esquerda 49, Esquerda 63, Centro 61, Centrão 51, Direita 54,
Extrema direita 38 (o ponto inicial do jogador é o ponto do país).

**Valores inferidos, a calibrar no jogo:** bônus do governo (2), desvantagem
do partido novo (1), peso da influência na frente (0,3), passo da influência
(0,1 por turno). A taxa do troca-troca (6% ao ano) vem da janela de 2026.

## Fontes

- CNN Brasil, "PL terá maior bancada da Câmara; federação do PT mantém
  segundo lugar" (out/2026).
- CNN Brasil, "PL elege 19 senadores e terá a maior bancada do Senado"
  (out/2026).
- Canal Rural, "Lupion calcula 47 senadores e 330 deputados ligados ao agro"
  (6/out/2026).
- Agência Câmara, "Gilberto Nascimento é eleito presidente da Frente
  Parlamentar Evangélica" (25/fev/2025).
- Revista Pesquisa FAPESP, "Desconstruindo mitos" (Figueiredo e Limongi).
- V-Party, V-Dem Institute (pontos dos partidos, já em
  `bussola/referencias.json`).
- Miller e Stokes, "Constituency Influence in Congress", American Political
  Science Review, 1963 (representação diádica).
- Adams, Merrill e Grofman, "A Unified Theory of Party Competition",
  Cambridge, 2005 (voto espacial probabilístico).
- Desposato, "How Robust are Electoral Institutions? An Agent-Based Test of
  Electoral Rules and Ideal Points", 2004 (simulação com lista aberta, como
  no Brasil).
- Congresso em Foco, "Um em cada quatro deputados trocou de partido na
  janela" (abr/2026).
- Zucco e Lauderdale, "Ideal Point Estimates of Brazilian Legislators
  (1989-2011)", LSE (método dos pontos).
