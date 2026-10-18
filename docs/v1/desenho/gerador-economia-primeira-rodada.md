# Gerador econômico: primeira rodada

> **Status: RASCUNHO DE DESENHO (18/out/2026).** Etapa de desenho do gerador; não declara índices calibrados nem altera o conteúdo carregado pelo jogo. A Ilha Teste é fictícia. Os valores e coeficientes iniciais descritos abaixo são **hipóteses de teste**.

## Objetivo desta rodada

Gerar, a partir de uma semente e parâmetros editáveis, diferentes estados iniciais de uma economia fictícia; manter as mesmas definições de índices e leis do mundo; simular decisões por vários turnos; apontar falhas; corrigir o gerador e repetir. A comparação deve usar a mesma semente antes e depois de cada ajuste.

O primeiro ciclo jogável será **produção, famílias e contas públicas**. Energia deixa de ser o centro da avaliação. O piloto de empresas existente informa o desenho de produção e propriedade, mas ainda não é economia nacional completa.

## O que fica no mundo e no país

- **Mundo:** catálogo global de leis, índices, mecanismos, condições e consequências. Cada lei é definida para poder ser associada a qualquer país onde suas condições e instituições permitam aplicá-la. O catálogo não se divide em “leis brasileiras” e “leis de outro país”; a mesma regra pode estar disponível globalmente e vigente em alguns países, sem estar vigente em todos. A adaptação ocorre por parâmetros e condições declarados, não por reescrever a lei para cada país.
- **País:** características, ministérios, semente, parâmetros iniciais, estoques, instituições e leis vigentes. O país fornece o contexto que a lei consulta: por exemplo, capacidade administrativa, estrutura produtiva, regime jurídico e presença do setor. Se um país não tem o setor ou a instituição exigida, a lei continua no catálogo global e fica indisponível ou sem aplicação naquele contexto, com a razão explicada.
- **Generator:** recebe a semente e uma configuração de cenário, monta um pacote completo, valida, simula e produz relatório. A mesma entrada deve gerar exatamente a mesma saída.

As leis de diferentes vertentes políticas coexistem no catálogo global. A orientação política e a constituição do país definem quais podem ser propostas, quais são incompatíveis e como uma mudança legal ocorre. Não se gera um catálogo separado por ideologia, nem se presume que uma vertente produz automaticamente resultados econômicos bons ou ruins. Uma incompatibilidade ou requisito precisa ter regra explícita; trocar um regime não altera retroativamente patrimônio, produção ou caixa.

**Teste de universalidade:** cada lei gerada deve declarar seus requisitos, as variáveis que usa, os parâmetros que o país fornece, o que ocorre quando um requisito falta e qual lei ou regra ela exclui. A IA testa a mesma definição contra contextos variados. Se a lei só funciona num contexto, o relatório identifica o requisito ausente; o gerador não cria uma exceção escondida por país.

## Núcleo econômico obrigatório

| Variável | Papel e unidade inicial proposta | Origem na planilha original ou lacuna |
| --- | --- | --- |
| População | estoque de pessoas; base para demanda e trabalho | Lacuna no conjunto de índices da aba `Índices`; já existe como referência estática na Ilha Teste. |
| PIB real | produção por período em moeda constante; bolha central | `PIB`, linha 117; a planilha mede nível real, não caixa. |
| PIB nominal | valor da produção no período, na moeda corrente; denominador fiscal | Necessário para a contabilidade; a referência atual da Ilha Teste é anual. |
| Consumo das famílias | fluxo real por período | `Consumo das famílias`, linha 24. |
| Investimento realizado | fluxo por período que forma capacidade futura | `Investimento`, linha 100; separar pedido, execução e capacidade entregue. |
| Capacidade produtiva e produtividade | estoques/condições que limitam produção | `Produtividade`, linha 129; capacidade agregada é lacuna a modelar. |
| Renda das famílias e desemprego | renda por período e porcentagem da força de trabalho | Linhas 139 e 39. |
| Nível de preços e inflação | nível acumulado e variação em 12 meses | `Inflação`, linha 92; nível de preços é lacuna necessária para PIB nominal. |
| Base tributável e arrecadação efetiva | fluxo por período; cobrança depende de base e execução | `Arrecadação`, linha 5, é carga tributária em % do PIB; fluxo monetário e base são lacunas. |
| Gasto executado e juros pagos | fluxos por período | `Gasto público`, linha 64, e `Juros da dívida`, linha 101. |
| Resultado primário, caixa e dívida bruta | resultado é fluxo; caixa e dívida são estoques | `Resultado fiscal`, linha 142; `Cofre`, linha 17; `Dívida pública`, linha 47. |
| Capacidade do Estado | limite de execução e cobrança | Linha 9; efeito e medida específicos exigem fonte ou hipótese explícita. |

Essas entradas são o **contrato do gerador**, não 16 bolhas obrigatórias na tela. O jogador deve ver PIB, emprego, inflação, contas e consequências das escolhas; bases e identidades podem ficar no detalhamento. Pobreza, desigualdade e aprovação já constam da planilha e serão ligadas quando houver mecanismo distributivo e político, sem presumir efeito direto nesta primeira rodada.

## Identidades que a geração não pode violar

1. PIB real mede produção; não entra no Tesouro. PIB nominal resulta de produção e preços com períodos coerentes.
2. Receita tributária efetiva = base tributável × regra de tributo × parcela cobrada. O jogador escolhe a regra; a base e a cobrança reagem. Não há teto arbitrário para a alíquota escolhível.
3. Resultado primário = receitas primárias − despesas primárias. Juros são registrados separadamente; o resultado total inclui juros uma única vez.
4. Caixa final = caixa inicial + entradas monetárias − pagamentos monetários + financiamento líquido. Dívida final acompanha emissões, amortizações e ajustes declarados. Um déficit não pode desaparecer nem ser lançado duas vezes.
5. Compra/venda de empresas altera caixa e ativos; dividendos e impostos são receitas distintas. PIB, lucro empresarial, venda de ativo e tributo não são a mesma entrada.
6. Toda quantidade tem unidade e período. Valor sem fonte é hipótese identificada; uma simulação estável não transforma hipótese em dado real.

## Primeiras decisões necessárias

1. **Tributação das empresas e/ou famílias:** o jogador escolhe alíquota/regra; muda a receita efetiva após resposta da base, evasão e capacidade de cobrança. As opções podem incluir valores extremos.
2. **Prioridade de gasto corrente, manutenção e investimento:** o jogador aloca recursos; só o gasto executado sai do caixa; investimento forma capacidade com prazo, sem efeito instantâneo garantido no PIB.
3. **Financiamento de falta de caixa:** usar reserva, ajustar execução ou emitir dívida conforme instituições e regras vigentes. Dívida e juros retornam à próxima decisão.

Estas são famílias de escolhas, **não três leis prontas**. Cada lei concreta deve ter fonte real para o mecanismo, condição de aplicação explícita e independente de país, opção compreensível, variável alterada e caminho verificável até uma nova decisão. Diferenças de implementação nacional entram como parâmetros/contexto tipados. Uma exceção que mude o mecanismo precisa de evidência e regra declarada. O gerador não deve criar uma lei apenas para preencher a contagem ou representar uma vertente política.

## Procedimento da rodada

1. **Gerar:** semente, características e faixas justificadas produzem país fictício e valores iniciais plausíveis entre si. Os números escolhidos permanecem hipóteses.
2. **Validar antes de publicar:** referências, unidades, períodos, identidade fiscal, alternativas legais excludentes, escolhas sem consequência e ciclos sem retorno bloqueiam a geração para o jogo.
3. **Jogar no terminal:** IA agente executa cenários sem ação, cada decisão isolada, combinações, valores extremos, crise e recuperação por no mínimo um mandato; guarda ações e trajetória para reprodução. Em cada turno confere permissões legais, caixa, dívida, produção, emprego e efeito visível da escolha.
4. **Diagnosticar:** distingue falha estrutural (lei sem ciclo ou efeito duplicado), falha de comportamento (escolha dominada, oscilação, explosão), dado ausente e diferença para evidência real. O relatório aponta o primeiro turno e o caminho causal do erro.
5. **Corrigir e repetir:** o agente pode propor mudança do gerador, da fórmula ou dos parâmetros, com motivo e comparação entre rodadas. Ajuste numérico automático só usa parâmetros marcados como ajustáveis e faixa justificada. Fonte, regra jurídica e relação causal não são inventadas nem reclassificadas como calibradas pela IA.
6. **Promover:** somente uma rodada que passa validação, simulação e revisão humana substitui os JSONs carregados pelo jogo. Gerar novamente deve atualizar todos os arquivos dependentes juntos; F5 passa a ler o pacote novo.

## Primeiros testes de jogabilidade

- Mesma semente e parâmetros → mesmo país e mesma trajetória.
- Sementes diferentes → economias iniciais distintas, ambas contabilmente coerentes; nenhuma presume que uma vertente política seja sempre melhor.
- A mesma lei global passa pela mesma bateria em países com instituições, estruturas produtivas e recursos diferentes; requisito faltante explica a indisponibilidade ou a diferença de resultado.
- Sem decisão → trajetória explicável; caixa e dívida não mudam por uma identidade fictícia.
- Imposto extremo → escolha aceita, mas arrecadação pode cair se base, evasão ou execução reagirem; nenhuma consequência surge sem mecanismo.
- Investimento → gasto no período da execução, capacidade apenas após prazo; serviço/produção e arrecadação futura podem mudar, sem somar PIB ao caixa.
- Déficit → fonte de financiamento identificada; juros futuros retornam à próxima escolha.
- Lei incompatível ou vedada → ação rejeitada; troca de regra não transfere ativos automaticamente.
- Cada decisão → problema, recurso, gargalo, mudança de estado, consequência observável e oportunidade de decisão posterior. Se um elo faltar, a lacuna fica registrada.

## Limites desta etapa

O gerador atual da Ilha Teste fornece ministérios e referências econômicas estáticas, e o gerador do grafo tem um simulador piloto de empresas. Ainda faltam o gerador procedural da economia nacional, a integração fiscal ao motor da partida, as leis econômicas com fontes e a rotina de avaliação que joga turnos e revisa rodadas. Este documento define o primeiro contrato para construir e testar essas partes em sequência; não afirma que já estejam funcionando.
