# Câmara e Senado (V1-11)

**Status:** EM REVISÃO (13/out). Desenho da etapa 0; o código só começa com
a aprovação do autor.

## 0. Resumo

O Congresso tem **5 bancadas** (blocos de partidos), mas o tamanho delas e o
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

## 2. As 5 bancadas

Cadeiras eleitas em 2026, somadas por bancada: é o **alvo da prova** da
camada 1, não o número que o jogo usa. A lista partido → bancada fica em
`bussola/`. O ponto na bússola é a média dos partidos no V-Party, pesada
pelas cadeiras. A coluna "Representa" é só um palpite para conferir: no
jogo ela sai da camada 1.

| Bancada         | Partidos (calibragem)                               |  Câmara | Senado | Bússola (eco, cost.) | Representa                                                                                |
| --------------- | --------------------------------------------------- | ------: | -----: | -------------------- | ----------------------------------------------------------------------------------------- |
| Direita         | PL, Novo                                            |     131 |     31 | (7,4; 7,2)           | Conservadores, Evangélicos, Agronegócio, Empresários, Interior                            |
| Centrão         | União-PP, Republicanos, Podemos, Missão             |     156 |     19 | (5,3; 1,9)           | Evangélicos, Agronegócio, Interior, Pequenos empreendedores                               |
| Centro          | PSD, MDB, PSDB-Cidadania, PRD-Solidariedade, Avante |     102 |     16 | (2,3; -1,1)          | Interior, Classe média, Aposentados, Servidores públicos                                  |
| Centro-esquerda | Federação PT-PCdoB-PV, PSB, PDT                     |     109 |     14 | (-2,2; -5,7)         | Pobres, Trabalhadores com carteira, Periferias, Agricultura familiar, Servidores públicos |
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

## 5. O seu partido

Você escolhe, no começo, **qual bancada é a sua**. As cadeiras dela votam com
você quase sempre (disciplina alta, mas não 100%, como na vida real). As
outras você conquista com o que faz e com acordos.

Para outros países, a configuração diz quantas casas há (o Brasil tem duas;
um país pode ter uma), quantas cadeiras cada uma tem, as bancadas e as
regras de votação.

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

## 9. Perguntas para você

1. As **três camadas** (cadeiras saindo dos perfis, voto pela base que
   elegeu, troca-troca no mandato), com a eleição de 2026 só como prova?
   Recomendo.
2. **O seu partido:** você escolhe uma das 5 bancadas no começo? Recomendo.
3. **As frentes** (agro e evangélica) saem da camada 1, como a parte de cada
   bancada eleita por esses segmentos? Recomendo.

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
