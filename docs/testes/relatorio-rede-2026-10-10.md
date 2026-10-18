# SisGov — testes de partidas, conflitos e resistência da rede

Data: 10/10/2026. Código observado na rodada adicional: `c19d69124cdfc0e08386e3dbff3de2bdccec5603`.

## Escopo e método

Relatório solicitado pelo autor: reúne as duas estratégias econômicas, os três ciclos setoriais, os testes de estresse e uma rodada adicional de ações potencialmente problemáticas. Nenhuma regra, lei ou implementação foi corrigida nesta investigação. Este documento registra evidências; não concede aceite nem altera o status dos chamados, que permanece no PLANO.md.

As partidas foram executadas por `criarPartida`, `mudarLei`, `encerrarTurno`, `preverLei` e `verPartida`, a mesma API usada pela tela. Não foram partidas clicadas no navegador; interação visual, cliques simultâneos, recarga, armazenamento e desempenho do navegador não foram testados. Problemas de interface citados abaixo foram identificados por leitura do componente e reprodução das entradas na API.

Cenário Brasil 2026, semente 123, modo `teste` (o padrão da tela, sem aprovação do Congresso). Políticas implantam-se gradualmente. Os primeiros comparativos duraram 16 turnos; estresse, até 64 ou até a primeira falha. Mesma situação inicial em cada comparação. Não foram injetados valores diretamente nos indicadores nem modificados os JSONs de conteúdo.

Os indicadores são as escalas internas do jogo; PIB aqui é índice, não crescimento percentual do PIB real. Contas são percentuais do PIB e diferenças entre elas são pontos percentuais. Situações podem mostrar um valor anterior ao limiar de ativação: um número positivo na visão não prova que a crise já está ativa.

Evidências completas da rodada de estresse e dos testes adicionais: [JSON de resultados](evidencias-rede-2026-10-10.json). Inclui escolhas, amostras, erros, sequências aleatórias e estados anteriores às falhas. Os primeiros comparativos são transcritos das execuções registradas na conversa; não foram repetidos nesta rodada.

## Achados prioritários, já reproduzidos

### A1 — Limites de dívida e cofre impedem o próximo turno

Severidade: alta; impede continuidade da partida.

| Estratégia | Primeiro turno que falha | Posição imediatamente anterior, % do PIB |
|---|---:|---:|
| Nenhuma medida nova | 60 | Dívida 298,4661 |
| Todos os tributos no mínimo zero e leis orçamentárias no máximo permitido | 31 | Dívida 295,6555 |
| Todos os tributos no máximo e leis orçamentárias no mínimo | 41 | Cofre 94,5073 |

Mensagem: `O novo saldo está fora do domínio declarado.` Dívida tem domínio −100 a 300. Dívida negativa representa o cofre. A atualização do estoque rejeita o passo que sair do intervalo, em vez de produzir uma consequência jogável. É possível bloquear tanto uma trajetória deficitária quanto uma superavitária.

Reprodução: criar partida; aplicar o conjunto de mudanças de `estresse_anterior.runs[].changes` no JSON; encerrar turnos até o indicado. A base não exige nenhuma alteração. Código relevante: `src/conteudo/mundo/indicadores/variaveis.json` (`divida_publica`) e `src/engine/mechanisms/updateStock.ts`.

Sugestão: tratar capacidade de financiamento e crises como regras explícitas de jogo; não usar um teto de domínio como encerramento acidental. Não existe limite econômico universal de dívida/PIB ou de ativos líquidos correspondente a esses valores.

### A2 — Teto fiscal descarta parte do déficit

Severidade: alta; distorce contas e financiamento.

Impostos zero e orçamento máximo, turno 16:

| Conta | % do PIB |
|---|---:|
| Receita | 10,39 |
| Gasto | 67,67 |
| Juros | 29,96 |
| Déficit pela diferença entre as três contas | 87,24 |
| Déficit registrado | 30,00 |

`resultado_fiscal` é limitado a −30/+30, e `juros_da_divida` também. A dívida é alimentada pelo resultado fiscal limitado. O déficit excedente não é contabilizado integralmente. Zerar tributos não zera imediatamente a receita: existe implantação gradual e há fontes não tributárias.

Mesmo sem saturação, a suavização independente das contas causa desencontro: na base, turno 16, receita − gasto − juros difere do resultado mostrado em cerca de −0,058 ponto do PIB. No primeiro turno do cenário de gastos máximos, a diferença já é −3,649 pontos, antes do déficit atingir o teto.

Reprodução: comparar `contas.receita - contas.gasto - contas.juros` a `contas.resultado` a cada turno. Código: `computeNetwork.ts` aplica limite e suavização aos nós calculados; `resultado-fiscal--divida-publica.json` transmite o resultado ao estoque.

Sugestão: preservar identidades contábeis; aplicar atrasos aos mecanismos econômicos que justificam atraso, sem amortecer separadamente uma soma contábil.

## Novos achados desta rodada

### N1 — Controles oferecem valores que o jogo rejeita

Severidade: média; jogador pode selecionar o extremo do controle e receber erro.

| Lei | Valor inicial | Máximo calculado pelo controle | Máximo aceito pela partida |
|---|---:|---:|---:|
| Piso de educação | 660.000 | 1.980.000 | 1.200.000 |
| Piso de saúde | 516.000 | 1.548.000 | 1.440.000 |
| Transferência de renda | 168.000 | 504.000 | 360.000 |

Unidade numérica do jogo: milhões por ano. A função `faixaNumerica` usa três vezes o nível/meta para valores monetários. `verPartida` retorna o domínio da variável, cujo máximo está ausente nesses casos, enquanto `policyLevelRulesFromContent` aplica o teto da lei em percentual do PIB. As duas partes discordam.

Reprodução: partida nova; calcular a ponta direita da barra usando `max(1000, max(nivel, meta) × 3)`; chamar `mudarLei` com esse valor. As três entradas foram recusadas. O campo numérico também recebe máximo indefinido da visão. Não houve arraste real da barra no navegador.

Referências: `src/ui/mapa/Documentos.tsx` (`faixaNumerica`, `ControleNumerico`), `src/app/partida.ts` (`verPartida`) e `src/game/policyRulesFromContent.ts`.

Sugestão: expor à interface os mesmos limites efetivos usados pela validação, incluindo tetos da lei e do país.

### N2 — A previsão falha antes de a partida deixar de avançar

Severidade: média; retira informação do jogador próximo da crise. É uma consequência adicional de A1.

Na base, turno 57, dívida de 285,7814% do PIB, testar separadamente:

- IVA para 30;
- IRPF para 60;
- piso de educação para zero;
- piso de saúde para zero.

Todas as previsões de quatro trimestres falharam com o erro de estoque. Entretanto, cada mudança permitiu avançar os turnos 58 e 59; só o 60 falhou. Exemplo do IVA: dívida 292,0841 no turno 58 e 298,2720 no 59.

A janela solicita sempre quatro trimestres de previsão; o horizonte de exibição seleciona uma parte dessa série. Logo, uma falha mais adiante impede obter a previsão curta pela mesma chamada. `preverLei` calcula a trajetória sem mudança antes da alternativa e retorna ao primeiro erro. Não foi demonstrado que alguma das quatro medidas conseguiria resgatar a partida por quatro turnos.

Referências: `src/app/partida.ts` (`preverLei`, `simularTrimestres`) e `src/ui/mapa/Janelas.tsx`.

Sugestão: devolver o trecho válido com indicação do turno e motivo da interrupção; calcular alternativas sem depender do sucesso completo da trajetória-base.

### N3 — Horizonte inválido é aceito pela API de previsão

Severidade: baixa; fragilidade da API. A interface atual solicita quatro turnos, portanto não foi comprovada exposição pelos controles atuais.

| Horizonte solicitado | Resposta | Meses retornados |
|---|---|---:|
| 0 | Sucesso | 0 |
| −1 | Sucesso | 0 |
| 0,5 | Sucesso | 3 |
| NaN | Sucesso | 0 |

Reprodução: `preverLei(partida, "controle-de-precos", 100, horizonte)`. A função não exige número inteiro positivo e finito. O laço com comparação numérica explica a série vazia ou o arredondamento implícito. Infinito não foi executado, pois a ausência de limite poderia prender a execução; esse risco é inferido do código, não reproduzido.

Sugestão: validar o horizonte e impor um orçamento de cálculo explícito quando necessário.

### N4 — Repetir uma decisão sem efeito infla o histórico

Severidade: baixa; risco de crescimento desnecessário, sem travamento observado.

Aplicar 2.000 vezes `salario-minimo = 67` na partida inicial manteve o mesmo resultado numérico do primeiro turno, mas elevou `acoes` a 2.000 e o histórico da lei a 2.001 entradas. O trecho de repetição levou aproximadamente 41,5 ms neste ambiente; isso não demonstra lentidão perceptível no navegador.

Reprodução pela API; não foram feitos 2.000 cliques. Código: `changePolicyTarget` sempre acrescenta histórico; a camada da partida incrementa ações.

Sugestão: tratar atribuir a mesma meta como operação sem efeito, se o produto não precisar registrar tentativas repetidas.

## Inconsistências de conteúdo e balanceamento

Estas observações não devem ser tratadas automaticamente como exceções de código.

### B1 — Cortar o piso de educação tem penalidade pequena no experimento

Partida: piso de educação zero, ensino integral 100, ensino superior gratuito universal 100; demais leis originais. Após 16 turnos:

| Indicador | Base sem mudanças | Combinação |
|---|---:|---:|
| Aprendizagem | 40,11 | 39,84 |
| PIB, índice | 47,43 | 47,66 |
| Gasto, % PIB | 30,77 | 26,95 |
| Dívida, % PIB | 111,97 | 99,06 |

Programas têm custos independentes: não é gasto educacional total zero. O sinal preocupante é economizar bastante com impacto pequeno na aprendizagem. Não foi isolada a contribuição de cada lei; requer teste de ablação antes de atribuir a causa a uma ligação específica.

### B2 — Câmeras não dependem da existência de polícia profissional

Combinação aceita: `modelo-de-policia=0`, `cameras-corporais=100`, `combate-crime-organizado=100`. No turno 16, violência letal 11,13 contra 18,98 na base e letalidade policial praticamente zero. Câmeras têm consequências próprias; a combinação não é barrada nessa porta de entrada.

O estado de exceção pode implicar outros agentes de coerção. Portanto, o resultado não prova sozinho um benefício impossível; a dependência e a descrição institucional precisam ser definidas. Não foi executado um teste isolando somente as câmeras nessa combinação.

### B3 — Sistema de saúde privado aceita gasto público máximo

`sistema-de-saude=0`, piso de saúde e farmácia popular nos máximos. Turno 16: saúde 75,54, gasto 39,58% PIB, dívida 145,18% PIB; bloqueio no turno 38. A ausência de restrição foi observada; decidir se a combinação é proibida ou uma política mista exige definição de conteúdo.

### B4 — Indicadores chegam ao piso e mascaram intensidade adicional

Na estratégia comunista da rodada inicial, desigualdade ficou próxima de zero. Na estratégia de impostos zero/orçamento máximo, no turno 16, PIB 71,85, pobreza, desemprego e inflação próximos de zero, saúde 99,43, mas confiança empresarial 12,61 e popularidade 0,81. Isso sugere benefícios setoriais muito fortes apesar do desequilíbrio fiscal; o truncamento das contas agrava a interpretação. Chegar ao limite de um índice, por si só, não é falha aritmética.

### B5 — Nem todo resultado contraintuitivo é bug

A rodada de segurança reduziu violência, mas também reduziu sensação de segurança. Há uma ligação positiva de nível do modelo policial para sensação de segurança; reduzir de 75 para 25 retira contribuição dessa ligação. O pacote altera várias leis, por isso essa ligação não foi provada como causa única.

Congelar preços, privatizar tudo e abrir capitais elevou o indicador de desabastecimento de 15 para 26,60 no turno 16. O número exibido não deve ser confundido com intensidade de crise ativa sem verificar seu limiar.

## O que resistiu aos testes adicionais

- 461 valores: todas as opções discretas e extremos finitos das regras efetivas, testados individualmente como ações na partida nova. Nenhuma recusa inesperada. Não foram avançadas 461 partidas distintas.
- Três partidas de 24 turnos; oito escolhas aleatórias por turno: 576 ações ao todo. Nenhuma falha de turno ou número não finito observado. Sequências e sementes estão no JSON. Gerador de escolhas iniciado em 98765; cada partida do jogo usa semente 123.
- Inverter a ordem de três decisões independentes (preços 100, IRPF 50, piso de saúde 720.000) produziu diferença numérica máxima zero após quatro turnos.
- Subir salário mínimo para 100 e voltar a 67 antes de avançar produziu diferença máxima zero em relação à base após quatro turnos.
- Repetir a mesma decisão 2.000 vezes não duplicou seu efeito numérico.
- A partida original permaneceu idêntica após os ramos testados.
- Previsão de controle de preços 100 por quatro turnos coincidiu com a execução: nenhum erro nos indicadores retornados pela previsão e nenhuma divergência de exibição nesses efeitos. Isso não prova todos os horizontes nem todos os indicadores de situação.
- Na rodada anterior, IRPF −1, 101, NaN e infinito foram recusados.
- Alternar privatização, preços e IRPF a cada turno não produziu NaN/infinito; falhou no turno 60 pelo limite fiscal já descrito.

Não foram executados `npm run check`, testes unitários completos ou testes de navegador nesta rodada: o objeto foi a execução exploratória da partida, sem mudança de implementação.

## Comparativos iniciais reunidos

### Governos capitalista e comunista — 16 turnos

**Interpretação retirada:** os pacotes desta primeira rodada foram mal caracterizados. Consulte a [nova rodada com estratégias produtivas e revisão anual](estrategias-produtivas-2026-10-10.md). Os valores abaixo permanecem apenas como registro da execução anterior.

Rótulos dados aos conjuntos de escolhas; não são troca integral de regime político nem prova sobre economias reais. Medidas escolhidas no início e mantidas, sem adaptação estratégica posterior. Naquela rodada não houve uma terceira partida-base: os deltas são contra o início, não efeito causal isolado de tendência.

| Indicador | Inicial | Capitalista | Comunista |
|---|---:|---:|---:|
| PIB, índice | 45 | 53,20 | 44,33 |
| Renda familiar, índice | 45 | 48,13 | 43,66 |
| Desigualdade | 52 | 60,31 | ~0 |
| Pobreza | 25 | 28,32 | 8,12 |
| Desemprego | 6 | 3,74 | 8,12 |
| Inflação | 5 | ~0 | 4,26 |
| Investimento | 35 | 32,25 | 13,18 |
| Produtividade | 35 | 50,14 | 37,79 |
| Déficit, % PIB | 7,71 | 13,82 | 30,00 |
| Dívida, % PIB | 77 | 121,31 | 160,82 |

O déficit comunista de 30% já estava próximo do teto artificial encontrado depois. Não deve ser usado como medida fiel do déficit sem verificar receita, gasto e juros.

Escolhas numéricas (capitalista / comunista; demais leis mantidas):

| Lei | Capitalista | Comunista |
|---|---:|---:|
| empresas-estatais-e-privatizacao | 0 | 100 |
| defesa-da-concorrencia | 100 | 33 |
| banco-de-desenvolvimento | 33 | 100 |
| politica-industrial | 33 | 100 |
| controle-de-capitais | 0 | 100 |
| acesso-ensino-superior | 25 | 100 |
| sistema-de-saude | 25 | 100 |
| regra-fiscal | 67 | 0 |
| modelo-tributario | 50 | 100 |
| imposto-renda-pessoas | 24 | 50 |
| imposto-sobre-consumo | 22 | 12 |
| imposto-renda-empresas | 25 | 40 |
| imposto-grandes-fortunas | 0 | 3,5 |
| transferencia-de-renda | 144.000 | 360.000 |
| salario-minimo | 33 | 100 |
| sistema-previdenciario | 33 | 100 |
| investimento-em-infraestrutura | 120.000 | 240.000 |
| investimento-pesquisa | 100.000 | 200.000 |
| reforma-agraria | Original | 100 |

### Ciclos setoriais — diferenças contra base sem novas decisões no turno 16

| Indicador | Segurança | Saúde | Educação |
|---|---:|---:|---:|
| PIB, índice | +0,114 | +0,046 | +4,830 |
| Produtividade | +0,190 | +0,430 | +6,885 |
| Investimento | −0,841 | −1,023 | +2,893 |
| Confiança empresarial | −1,841 | −2,023 | +2,638 |
| Renda familiar | −0,042 | +0,191 | +2,411 |
| Desigualdade | −0,444 | −1,259 | −7,512 |
| Pobreza | −0,114 | −0,491 | −1,961 |
| Desemprego | +0,203 | −0,164 | −0,554 |
| Violência letal | −3,096 | −0,372 | −3,822 |
| Crime organizado | −2,936 | −0,111 | −5,305 |
| Sensação de segurança | −5,612 | +0,340 | +3,601 |
| Saúde da população | +1,810 | +3,375 | +2,477 |
| Pressão hospitalar | −2,087 | −2,463 | −3,434 |
| Aprendizagem | +0,201 | −0,027 | +1,045 |
| Escolaridade | +0,046 | +0,015 | +0,702 |
| Qualificação do trabalho | +0,070 | +0,007 | +7,714 |
| Receita, pontos do PIB | +0,255 | +0,102 | +1,952 |
| Gasto, pontos do PIB | −0,434 | +1,990 | +4,308 |
| Resultado fiscal, pontos do PIB | +0,809 | −2,669 | −3,612 |
| Dívida, pontos do PIB | −1,748 | +7,304 | +12,394 |

Receita, PIB e dívida não foram ajustados diretamente; mudaram pela rede. O pacote de educação não teve o mesmo custo do pacote de segurança: isso não é um ranking de eficiência por real gasto. Diferença contra base mede efeito combinado, sem demonstrar cada caminho causal ou feedback individual.

Reprodução dos pacotes:

- Segurança: drogas 60; armas 0; penas máximas 0; encarceramento 0; modelo policial 25; câmeras 100; gestão de presídios 50; combate ao crime organizado 50.
- Saúde: sistema 75; piso 720.000; saúde mental 100; regulação de planos 75; farmácia 24.000; vigilância epidemiológica 24.000. Sistema e saúde mental já estavam nesses níveis.
- Educação: piso 900.000; ensino obrigatório 100; acesso superior 75; integral 100; técnico 67; pesquisa 276.000; avaliação das escolas 33. Ensino obrigatório já estava nesse nível.

## Ordem sugerida para uma futura correção

1. Preservar as identidades fiscais e impedir que limites artificiais descartem déficits/juros.
2. Substituir bloqueios de estoque por comportamento jogável e diagnóstico com o nome do indicador.
3. Alinhar os limites mostrados nos controles aos limites efetivamente aceitos.
4. Tornar previsões úteis quando somente parte do horizonte é calculável.
5. Revisar dependências entre leis e efeitos de cortar financiamento; testar uma medida por vez e depois suas combinações.
6. Validar horizontes e evitar histórico redundante.

Nenhuma dessas sugestões foi implementada ou recebeu aceite neste relatório.
