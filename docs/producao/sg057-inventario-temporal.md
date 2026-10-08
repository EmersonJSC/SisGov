# SG057-A — inventário e aceite temporal

Atualizado em 8 de outubro de 2026. Aceite técnico dos FIX-V1-02/04.
Os manifestos do Brasil e da bancada declaram `unidadeTemporal:
"trimestre"`; seus valores de origem permanecem trimestrais.

## Preparação mensal implementada

`src/game/prepareMonthlyContent.ts` prepara uma cópia mensal antes de criar a
execução: converte frações de resposta, atrasos e durações fixas, atualiza o índice
de definições e reconstrói o grafo. A memória histórica de uma execução criada
com esse grafo comporta os atrasos convertidos. Conteúdo já mensal não é convertido
novamente; conteúdo sem unidade explícita é recusado nessa preparação. O motor
genérico mantém compatibilidade com os exemplos técnicos antigos sem calendário.

Contribuições recorrentes em unidades `_por_passo` têm coeficiente e constante
divididos por três; contribuições únicas preservam o total e níveis preservam
sua magnitude. Bases, estados iniciais, limites e condições de variáveis de fluxo
também são convertidos; coeficientes compensam a unidade mensal da origem.
A preparação está conectada ao início da bancada, antes de criar a execução,
e não converte saves em andamento. O helper trimestral evita
reconverter as frações de um conteúdo explicitamente mensal.

Testes cobrem duração 3 → 9, atrasos e histórico, equivalência de implantação,
imutabilidade, idempotência, distinção entre taxas e efeitos únicos, unidade
ausente e unidade inválida. Os testes adicionais abaixo cobrem acumulação,
origens variáveis e propagação mensal.

### Semântica de propagação adotada

Atrasos explícitos trimestrais são multiplicados por três. A leitura implícita
do retrato anterior entre nós calculados passa a ser mensal, como a avaliação
de eventos e situações. Essa é uma mudança explícita de ritmo, não equivalência
integral de trajetórias trimestrais: não acrescentamos atrasos artificiais a
relações que não os declaram. O teste de cadeia comprova que a ordem das variáveis
não muda o resultado e que a saída intermediária só chega no mês seguinte.
Para controles variáveis, o estoque integra a taxa de cada mês; não usa a taxa
do último mês como se tivesse vigorado durante todo o trimestre.

## Inventário para a migração

- `PolicyFile.respostaTemporal`: frações trimestrais de implantação e degradação.
  O helper trimestral já usa `1 - (1 - taxa)^(1/3)` por mês. Não dividir essas
  frações por três nem converter novamente conteúdo já mensal.
- `ConsequenceFile.atrasoPassos`: quantidade de retratos anteriores consultados
  pelo motor. No primeiro cenário existem valores de 0 a 3; a bancada visual
  também tem atraso 1. Declarar a unidade na preparação do pacote e converter
  atrasos trimestrais para meses antes de construir o grafo.
- `duracao.fixo.passos`: o evento `evento-eleva-pressao` declara 3 passos.
  A duração anterior de três turnos deve corresponder a nove passos mensais.
  O grafo copia a duração do conteúdo: modificar apenas o pacote depois de
  construir o grafo não corrige a execução.
- `duracao.unico`: memória de disparo por relação; não multiplicar sua magnitude
  ou reativá-la automaticamente em cada mês. Testar o total no trimestre.
- `duracao.continuo`: distinguir contribuição para nível calculado de taxa que
  acumula em estoque. Níveis não devem ser divididos por três; taxas uniformes
  por trimestre exigem conversão por tempo. Uma ocorrência única aplicada ao
  estoque não deve perder dois terços do seu valor nessa conversão.
- Propagação: mesmo sem atraso explícito, nós calculados usam o retrato do passo,
  portanto cadeias podem reagir mais cedo com três avaliações. Comparar cadeias
  no mesmo calendário e documentar eventual recalibração, não apenas multiplicar
  `atrasoPassos` e presumir equivalência de toda a dinâmica.
- `advanceExecution.duration`: multiplicador de integração de estoque, padrão 1.
  Não altera atrasos nem duração fixa. Usar `1/3` isoladamente não migra o motor.
- Calendários institucionais já expressos em meses, como renovação de 48 meses,
  não precisam de multiplicação. A resposta política e seus prazos são contrato
  de SG057-B2; receitas, despesas e juros são detalhados em SG060-A/B.
- Dissipação e intervalo de repetição não têm campos executáveis nos tipos
  `ConsequenceFile`/`OccurrenceFile` atuais. Não inventar uma conversão para eles;
  exigir unidade explícita quando forem implementados.

## Checklist de aceite

### Validação dos valores acumulados

`src/tests/monthlyAccumulation.test.ts` acrescenta seis testes de execução real
do motor, com dados sintéticos e taxas constantes. A comparação considera um
passo trimestral original contra três passos mensais preparados:

- Receitas 120 e despesas 90: caixa inicial 100 termina o trimestre em 130,
  com variação mensal de 10, não de 30. O mesmo princípio é verificado com
  déficit e saldo líquido zero, em cada fechamento de 60 trimestres/180 meses.
- Efeito único líquido de 30: aplicado uma única vez, mantém caixa em 130
  durante nove meses, sem reduzir o total nem repetir a recompensa.
- Efeito fixo de três trimestres: acumula 10 por mês durante nove meses,
  termina em 190 e permanece em 190 nos três meses seguintes.
- Estoque inicial permanece 100; preparar novamente um pacote já mensal
  produz a mesma execução e não altera os parâmetros trimestrais originais.

Três testes adicionais cobrem bases de fluxo, condições e limites, controles
variáveis (10 + 20 + 30 acumulam 60) e uma cadeia calculada com resultado
independente da ordem das variáveis. Não representam financiamento automático,
dívida e juros de SG060-A/B. A interface usa agora o pacote preparado; os valores
anuais demonstrativos do mapa mantêm sua unidade anual, não viram receitas mensais.

### Situação dos critérios

- [x] Três passos mensais por clique e diário mensal com resumo trimestral.
- [x] Equivalência das frações de implantação e degradação.
- [x] Continuidade de meses absolutos 1–3, depois 4–6, sem mutar o estado anterior.
- [x] Rejeição de início fora da fronteira, negativo, fracionário ou não finito;
      proteção contra perda de precisão do contador.
- [x] Falha sintética no segundo ou terceiro mês não confirma meses anteriores;
      tentativa posterior parte do mesmo estado e mantém a decisão pendente.
- [x] Unidade temporal explícita e validada na preparação do conteúdo.
- [x] Migração de atrasos, duração fixa e taxas, sem converter duas vezes.
- [x] Provas de duração de nove meses, propagação e contribuições únicas/contínuas
      no mesmo calendário, incluindo estoques.

O aceite cobre o contrato mensal da bancada, não uma partida política completa.
O pacote preparado que a interface utiliza também é testado por 16 trimestres
(48 meses), preservando contadores absolutos e a taxa trimestral de implantação.

Os testes de falha tardia usam os meses anteriores reais e injetam somente a
falha; não demonstram a transação política/econômica completa de SG061.
SG060 e SG061 não precisam estar implementados para executar este checklist.
