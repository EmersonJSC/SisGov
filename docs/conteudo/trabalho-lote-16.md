# Lote 16 — emprego, aprendizagem e cuidado

> **Status: REFERÊNCIA TÉCNICA.** Revisão pelo índice, 19/out/2026. Os números
> abaixo são hipóteses de jogo observadas em ensaio, não estimativas empíricas.

## Decisões de catálogo

| Lei | Decisão | Por quê |
| --- | --- | --- |
| `intermediacao-e-qualificacao` | Manter e completar | Postos de recolocação e cursos curtos são uma alavanca de execução. O ensino técnico define a estrutura educacional e o seguro-desemprego protege renda; não são duplicatas. |
| `reducao-de-jornada-subsidiada` | Manter e esclarecer | Subsidiar horas cortadas é diferente de fixar a jornada legal. A opção parcial agora descreve o que o controle efetivamente faz. |
| `trabalho-infantil-e-aprendizagem` | Manter nesta rodada | A idade mínima e a aprendizagem estão ligadas nas opções atuais; a opção dual exige ensino técnico. Uma separação futura só se justifica se o jogador precisar combiná-las livremente. |
| `licenca-parental` | Manter | Define distribuição e duração da licença; difere de creches e política de natalidade. |

Nenhuma ficha nova foi necessária. A busca do índice e as relações por
dependência/indicador não revelaram duplicata inequívoca nesse conjunto.

## Hipóteses editadas no índice

- A recolocação ampla custa diretamente `0,3% do PIB/ano`; a rede local custa
  `0,05%`. Seu efeito direto no desemprego chega com um turno de atraso e vai
  de `0` a `−0,5` ponto percentual. Esses valores foram propostos pela IA.
- O subsídio parcial de jornada tinha efeito excessivo no desemprego: a
  simulação inicial zerou o indicador. O coeficiente foi reduzido de `−0,12`
  para `−0,015`; o da aprendizagem dual, de `−0,25` para `−0,05`.
- A opção de subsídio parcial deixou de prometer um acionamento automático de
  crise. O jogador escolhe a regra e pode encerrá-la depois.

## Ensaio no motor

Partidas com semente 7, sem ocorrências e eleição, alterações aplicadas
diretamente e 16 turnos. A rota de contenção usa recolocação e subsídio em zero,
idade mínima de 14 anos com exceções e licença materna curta. A rota de formação
usa recolocação ampla, subsídio parcial, aprendizagem dual e licença
compartilhada. A referência mantém o Brasil inicial.

| Rota no turno 16 | PIB (índice) | Dívida (% PIB) | Desemprego (%) | Gasto público (% PIB) | Trabalho infantil (índice) | Satisfação |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Referência | 43,461 | 114,847 | 6,235 | 30,873 | 4,137 | 48,930 |
| Contenção | 43,642 | 113,601 | 6,231 | 30,993 | 7,409 | 48,731 |
| Formação e cuidado | 52,094 | 109,503 | 2,565 | 32,569 | 1,957 | 53,458 |

Na rota de formação, o desemprego foi `5,597` no turno 1, `4,383` no 4,
`3,094` no 8 e `2,565` no 16. A formação ampliou oportunidades juvenis de
`59,059` na referência para `77,612`; a qualificação subiu de `65,297` para
`82,572`. A contenção elevou evasão escolar de `8,010` para `8,726`.

As três partidas terminaram sem erro, divisão por zero ou indicador fora da
faixa. Os três testes focais passaram: gasto e desemprego da recolocação,
custo e emprego do subsídio, e trava da aprendizagem dual sem ensino técnico.
O ensaio usa `aplicarMeta`, isolando a rede; não testa votação no Congresso.

**Limite de equilíbrio:** formação e cuidado elevou muito PIB e produtividade
em 16 turnos (`52,094` contra `43,461`; produtividade `27,307` contra
`18,078`). O desemprego deixou de zerar, mas o ganho agregado ainda deve ser
comparado com outros setores no balanceamento geral. A dívida cresce até mesmo
na referência; este lote não resolve a dinâmica fiscal estrutural.
