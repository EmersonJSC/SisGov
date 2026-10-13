# Câmara e Senado (V1-11)

**Status:** EM REVISÃO (13/out). Desenho da etapa 0; o código só começa com
a aprovação do autor.

## 0. Resumo

O Congresso vira **5 bancadas** (blocos de partidos), cada uma com cadeiras
na Câmara e no Senado, um ponto na bússola, os segmentos que ela representa e
uma **disposição** (0 a 100) com o seu governo. A composição de partida é a
eleita em 4/out/2026, que toma posse junto com você. Os nomes dos partidos
reais ficam só na calibragem (`src/conteudo/bussola/`); no jogo aparecem as
bancadas.

Por cima das bancadas há as **frentes** (agro, evangélica), que cortam todas
elas: um deputado do centro que é da frente do agro vota com o agro quando a
lei mexe com o campo.

## 1. Os números de verdade

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

Cadeiras somadas dos partidos (a lista partido → bancada fica em
`bussola/`). O ponto na bússola é a média dos partidos no V-Party, pesada
pelas cadeiras.

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

Para cada bancada e cada lei, uma nota soma quatro coisas:

1. **O que a lei faz aos segmentos dela** (já sai da rede: as ligações da lei
   com os segmentos).
2. **A distância na bússola:** a lei puxa o país para perto ou para longe do
   ponto da bancada.
3. **A disposição** da bancada com o governo.
4. **As frentes:** a parte da bancada que é da frente do agro ou da
   evangélica pesa mais o efeito da lei no agro ou nos evangélicos.

A nota vira a chance de cada cadeira votar sim. Os votos saem por sorteio com
semente (mesma semente, mesma votação), então nem toda cadeira vota igual. A
disciplina medida (mais de 80% com o líder) calibra quanto a bancada racha.

## 5. O seu partido

Você escolhe, no começo, **qual bancada é a sua**. As cadeiras dela votam com
você quase sempre (disciplina alta, mas não 100%, como na vida real). As
outras você conquista com o que faz e com acordos.

Para outros países, a configuração diz quantas casas há (o Brasil tem duas;
um país pode ter uma), quantas cadeiras cada uma tem, as bancadas e as
regras de votação.

## 6. O painel

Um semicírculo por casa, dividido nas 5 bancadas, com a cor da disposição.
Sem ponto por deputado. Ao tocar numa bancada aparecem: cadeiras, ponto na
bússola, segmentos que representa, quanto dela é de cada frente e por que a
disposição mudou.

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

1. **As 5 bancadas** (Direita, Centrão, Centro, Centro-esquerda, Esquerda)
   servem? Recomendo.
2. **A composição de partida** é a eleita em 2026, que toma posse com você?
   Recomendo (a outra opção é a de 2023 a 2026).
3. **O seu partido:** você escolhe uma das 5 bancadas no começo? Recomendo.
4. **As frentes** (agro e evangélica) cortando as bancadas entram já no V1-11?
   Recomendo.

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
- Zucco e Lauderdale, "Ideal Point Estimates of Brazilian Legislators
  (1989-2011)", LSE (método dos pontos).
