# SG060-A — Inventário de fontes fiscais e séries históricas

**Chamado:** SG060-A

**IA que auxiliou neste levantamento:** Gitinho

**Estado:** fluxos do RTN extraídos; composição e perfil de vencimentos da DPF documentados; estoques de caixa e base de preços ainda pendentes
**Data de corte desta consulta:** 3 de outubro de 2026

## Objetivo

Identificar fontes oficiais para montar cenários fiscais históricos do governo
federal, mantendo separados orçamento executado, resultado fiscal, dívida do
Tesouro, dívida do setor público e índices de preços. Este inventário não fixa
valores do cenário nem afirma que as séries já foram reconciliadas.

O piloto representa a transição após o Lula III. “Lula IV” e “Bolsoflavio I” são
rótulos de cenários condicionais fornecidos pelo usuário, não resultados
eleitorais confirmados. O pacote deve usar apenas dados observados disponíveis
na data de corte de cada versão e manter estimativas explicitamente identificadas.

## Fontes candidatas

| Necessidade | Fonte oficial | Cobertura útil | Limites e tratamento |
|---|---|---|---|
| Receitas, despesas e execução orçamentária da União | [RREO — Tesouro Nacional](https://www.tesourotransparente.gov.br/publicacoes/relatorio-resumido-da-execucao-orcamentaria-rreo) | Relatório bimestral exigido pela Constituição e LRF; abrange órgãos da administração direta e entidades da indireta dos orçamentos fiscal e da seguridade social. A publicação de agosto de 2026 estava disponível nesta consulta. | A publicação é bimestral, embora a página a descreva como acompanhamento mensal, e muitos valores são acumulados no exercício. Não tratar um acumulado bimestral como fluxo isolado: obter o conceito do anexo e, se necessário, calcular diferenças entre acumulados. Distinguir dotação, empenhado, liquidado e pago antes de escolher o fluxo do jogo. Verificar série, esfera e ente no dado extraído. |
| Resultado mensal do Governo Central e composição de receita/despesa | [Boletim Resultado do Tesouro Nacional (RTN)](https://www.tesourotransparente.gov.br/publicacoes/boletim-resultado-do-tesouro-nacional-rtn) e [API de séries temporais do Tesouro](https://apiapex.tesouro.gov.br/aria/v1/series-temporais/docs) | Publicação mensal da STN, com boletim, apresentação, sumário e tabelas. O boletim de agosto de 2026 informa déficit primário de R$ 13,6 bilhões a preços correntes; na comparação com agosto de 2025, receita líquida teve acréscimo real de R$ 6,3 bilhões (+3,5%) e despesa total de R$ 3,7 bilhões (+1,9%). | Resultado primário do Governo Central não é o saldo de caixa do Tesouro nem resultado nominal com juros. Os dados reais de comparação usam preços constantes/metodologia do boletim; não misturar com valores a preços correntes. O número de manchete é apenas checagem pontual e não substitui a série detalhada. |
| Acesso estruturado a RREO, RGF, DCA e Matrizes de Saldos | [Documentação da API SICONFI — STN](https://apidatalake.tesouro.gov.br/docs/siconfi/) | API documenta consultas por exercício, período, tipo de demonstrativo, anexo, esfera e código do ente. RREO permite filtro de União (`co_esfera=U`); DCA oferece contas anuais; MSC distingue saldo inicial, movimento e saldo final. | Confirmar o código e a disponibilidade histórica do ente federal para cada operação antes de automatizar. A API avisa limite de uma requisição por segundo e paginação de 5.000 itens por padrão. API é canal de acesso; o leiaute do demonstrativo e o Manual de Demonstrativos Fiscais continuam necessários para interpretar cada conta. |
| Estoque, emissões, resgates, composição, vencimentos e custo da Dívida Pública Federal | [RMD — Relatório Mensal da Dívida, Tesouro Nacional](https://www.tesourotransparente.gov.br/publicacoes/relatorio-mensal-da-divida-rmd) | Publica séries da Dívida Pública Federal interna e externa sob responsabilidade do Tesouro Nacional em mercado. O RMD de agosto de 2026 e tabelas anexas estavam disponíveis nesta consulta. | DPF não é sinônimo de dívida bruta do governo geral nem de toda a dívida pública. Não somar esse estoque a medidas do Banco Central. Separar posição de fim do mês, emissão, resgate, fatores de variação, reserva de liquidez, composição e vencimento. RMD anterior a 2007 pode usar publicação predecessora. |
| Resultado primário/nominal, juros nominais e dívida líquida/bruta do setor público | [Estatísticas fiscais — Banco Central do Brasil](https://www.bcb.gov.br/estatisticas/estatisticasfiscais) | Série macrofiscal para o setor público conforme conceitos e cobertura estatística do BCB; útil para validar resultado, juros e medidas de dívida fora do recorte estrito da DPF. | Conferir nas notas metodológicas a cobertura institucional, competência/caixa, sinal e unidade de cada série. Não misturar a necessidade de financiamento do setor público com resultado orçamentário do Governo Central, nem com dívida mobiliária do Tesouro. Registrar qual conceito foi escolhido para cada variável. |
| Metas e reestimativas de receitas/despesas | [RARDP — Relatório de Avaliação de Receitas e Despesas Primárias, Tesouro Nacional](https://www.tesourotransparente.gov.br/publicacoes/relatorio-de-avaliacao-de-receitas-e-despesas-primarias-rardp) | Avaliação bimestral de cumprimento da meta fiscal e de contingenciamento; produzida por STN, SOF e Receita Federal. O 4º bimestre de 2026 estava publicado nesta consulta. | É monitoramento/reestimativa do exercício, não substituir por realizado. Guardar projeções em campo distinto, com edição e data de publicação; usar como hipótese ou expectativa do jogador, não como observação fiscal fechada. |
| Correção de valores monetários entre datas de referência | [IPCA — IBGE](https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html) | Índice oficial de preços ao consumidor, candidato para expressar valores nominais em uma referência de poder de compra comum. | O IPCA mede preços ao consumidor e não é automaticamente o deflator correto para todo gasto público, PIB ou ativo financeiro. SG060-A deve escolher índice compatível por série e registrar mês-base, fator aplicado e fonte. A página do IBGE bloqueou leitura automatizada nesta consulta; validar acesso/tabela antes de extrair valores. |

## Observação de disponibilidade

Na consulta de 3 de outubro de 2026, o RTN de agosto estava disponível; a
publicação informa déficit primário do Governo Central de R$ 13,6 bilhões a
preços correntes e foi publicada em 29/09/2026. A planilha de séries históricas
do boletim foi obtida em
[`serie_historica_ago26.xlsx`](https://thot-arquivos.tesouro.gov.br/publicacao-anexo/29326).
A página do RREO de agosto registra publicação em 30/09/2026; o relatório foi
obtido em [RREO — agosto/2026](https://thot-arquivos.tesouro.gov.br/publicacao/55944).
A página do RMD de agosto registra publicação em 28/09/2026 e oferece o arquivo
de anexos `RMD_Agosto_26.zip`. O RARDP do 4º bimestre de 2026 também estava
publicado, mas contém reestimativas, não realização final.

O recorte observado de agosto é um ponto mensal parcial da transição e não
constitui fechamento anual de 2026 nem retrato final do mandato. O teste inicial
da API SICONFI consultou o RREO de 2025, 6º bimestre, União, anexo 01, usando
`id_ente=530000` e, em tentativa separada, `id_ente=0`; ambas retornaram lista
vazia. Isso não prova ausência do demonstrativo: o código/rota para União ainda
precisa ser confirmado. Enquanto isso, usar as publicações federais do Tesouro e
tratar SICONFI como acesso ainda não validado para esta consulta.

Fixar a data de corte em cada pacote e atualizar quando forem publicados os
demonstrativos finais. A consulta ao IPCA e às séries do BCB ainda não pôde ser
validada diretamente neste levantamento; não aplicar fator de preços nem inferir
juros com base em fontes não verificadas.

## Fichas de linhagem — fluxos fiscais

**Vintagem usada:** planilha `serie_historica_ago26.xlsx`, publicada com o RTN de
agosto/2026. Os valores de 2025 abaixo são os da série histórica vigente nessa
planilha, não necessariamente os valores que constavam na edição publicada em
janeiro/2026. Na linha 66, o resultado primário anual acima da linha passou de
-R$ 61.691,221 milhões na planilha de dezembro/2025 para -R$ 61.694,309 milhões
na vintagem de agosto/2026. A planilha anterior está em
[`serie_historica_dez25.xlsx`](https://thot-arquivos.tesouro.gov.br/publicacao-anexo/27550);
a vintagem mais recente é a referência usada nesta ficha. Unidade original das
tabelas RTN: R$ milhões correntes; a tabela abaixo converte para R$ bilhões
correntes, dividindo por 1.000. Valores negativos são contribuições negativas ao
resultado (déficit/custo), não despesas positivas.

| Indicador | Fonte e localização | 2025 fechado | Jan–ago/2026 | Ago/2026 isolado | Interpretação |
|---|---|---:|---:|---:|---|
| Receita total | RTN, planilha de séries históricas, abas 2.1 (anual) e 1.1 (mensal), linha 6 | 2.902,2746 | 2.081,6279 | 241,9606 | Receita total antes das transferências por repartição |
| Receita líquida (receita total menos repartições) | Mesmas abas, linha 38 | 2.332,5553 | 1.669,7353 | 187,8783 | Não equivale à receita primária total do Anexo 6 do RREO |
| Despesa total | Mesmas abas, linha 39 | 2.394,2496 | 1.764,6048 | 201,4632 | Total de despesa segundo a classificação RTN |
| Resultado primário acima da linha | Mesmas abas, linha 66 | -61,6943 | -94,8695 | -13,5849 | Receita líquida menos despesa total; em agosto, coincide com o resultado primário mensal divulgado |
| Resultado primário abaixo da linha | Mesmas abas, linha 73 | -58,6871 | -97,0867 | -14,6869 | Medida RTN própria; não intercambiar com a linha de mesmo nome no RREO |
| Juros nominais (contribuição no resultado nominal RTN) | Mesmas abas, linha 74 | -891,8799 | -714,4026 | Não usado aqui | Manter sinal e conceito da série; não aplicar uma taxa sobre o estoque da dívida |
| Resultado nominal RTN | Mesmas abas, linha 75 | -950,5670 | -811,4893 | Não usado aqui | Fecha como resultado primário RTN abaixo da linha mais juros nominais RTN |

**Referência de período completo.** No arquivo de agosto/2026, a soma dos 12
valores mensais de 2025 coincide, na precisão original da planilha, com a tabela
anual 2.1: resultado primário acima da linha = **-R$ 61,6943 bilhões**
(R$ -61.694,309 milhões). O mesmo fechamento ocorre para receita total, receita
líquida, despesa total,
resultado abaixo da linha, juros nominais e resultado nominal. A identidade
acima da linha fecha: 2.332,5553 - 2.394,2496 = -61,6943 bilhões; a identidade
nominal RTN fecha: -58,6871 - 891,8799 = -950,5670 bilhões.

### Exemplo manual de referência — exercício de 2025

Este exemplo usa apenas a tabela anual 2.1 da vintagem RTN de agosto/2026,
unidade R$ bilhões correntes. Ele demonstra contas anuais, não um turno do jogo:

```text
receita líquida RTN                         2.332,5553
despesa total RTN                          - 2.394,2496
resultado primário acima da linha            -61,6943

resultado primário abaixo da linha            -58,6871
juros nominais RTN                          - 891,8799
resultado nominal RTN                       - 950,5670
```

As duas identidades fecham dentro da precisão publicada. “Acima” e “abaixo da
linha” são métodos de apuração distintos; não se deve misturar o primeiro
resultado primário com os juros da segunda identidade. A série RTN não fornece,
nesta tabela, caixa inicial e caixa final compatíveis para fechar a identidade
de caixa do jogo. Portanto, **não** se deduz caixa, emissão ou dívida desse
exemplo; esses campos ficam em aberto até uma fonte e uma regra de financiamento
serem escolhidas. O exercício mostra a contabilidade que já pode ser explicada,
e também o limite exato do que ainda não podemos converter em mecânica.

### Exemplo manual de turno — junho a agosto de 2026

Este é um teste aritmético do ciclo de três meses, não uma regra de previsão.
Usa as três observações mensais consecutivas de junho, julho e agosto da mesma
aba 1.1 e da mesma vintagem RTN (R$ bilhões correntes):

| Fluxo RTN | Jun/2026 | Jul/2026 | Ago/2026 | Soma do turno |
|---|---:|---:|---:|---:|
| Receita líquida | 195,3885 | 226,3055 | 187,8783 | 609,5722 |
| Despesa total | 243,3000 | 215,5019 | 201,4632 | 660,2651 |
| Resultado primário acima da linha | -47,9116 | 10,8036 | -13,5849 | -50,6930 |
| Resultado primário abaixo da linha | -47,2359 | 10,9751 | -14,6869 | -50,9477 |
| Juros nominais RTN | -100,4522 | -92,8169 | -102,8808 | -296,1499 |
| Resultado nominal RTN | -147,6881 | -81,8418 | -117,5677 | -347,0976 |

Controles do exemplo:

- Na medida acima da linha, `609,5722 - 660,2651 = -50,6930`.
- Na identidade nominal RTN, `-50,9477 - 296,1499 = -347,0976`.
- Os dois resultados primários diferem em cerca de R$ 0,255 bilhão no trimestre;
  manter a diferença explícita, pois os métodos não são intercambiáveis.
- A soma do trimestre é a soma dos três fluxos mensais observados; nenhuma taxa
  mensal foi multiplicada por dívida e nenhuma emissão foi presumida.
- A fonte não dá caixa inicial/final compatível para esse fechamento; portanto,
  o exemplo não afirma quanto dinheiro restou nem como o déficit foi financiado.

Esse formato já demonstra que o turno trimestral pode consolidar os fluxos
mensais sem esconder sua trajetória: junho teve déficit, julho superávit acima
da linha e agosto voltou a déficit. Ainda resta decidir qual indicador fiscal
aparece como resultado principal para o jogador e qual fica como reconciliação
no diário; não é uma escolha de fórmula a inferir dos dados.

**Referência parcial e cruzamento independente.** No arquivo RTN, a soma mensal
de janeiro a agosto/2026 da linha 66 é -R$ 94.869,478602 milhões. O Anexo 6 do
[RREO de agosto/2026](https://www.tesourotransparente.gov.br/publicacoes/relatorio-resumido-da-execucao-orcamentaria-rreo/2026/8)
informa resultado primário acima da linha acumulado de -R$ 94.869.479 mil
(= -R$ 94.869,479 milhões). A diferença é inferior a R$ 1 mil, compatível com o
arredondamento do relatório.

O cruzamento não autoriza somar componentes brutos do RREO aos do RTN. No mesmo
Anexo 6 do RREO, a receita primária total acumulada é R$ 2.096.979,236 milhões e
a despesa primária paga (orçamento + restos a pagar) é R$ 2.184.361,120 milhões;
a diferença é -R$ 87.381,884 milhões. O ajuste metodológico informado de
-R$ 7.487,594 milhões leva ao resultado acima da linha de aproximadamente
-R$ 94.869,478 milhões. Isso explica a igualdade do resultado apesar de bases
brutas diferentes. O próprio RREO registra resultado abaixo da linha de
-R$ 87.381,885 milhões; esse conceito não coincide com a série RTN abaixo da
linha (-R$ 97.086,742 milhões).

Para juros no mesmo período, o RREO registra juros e encargos ativos de
R$ 252.764,502 milhões e passivos de R$ 960.331,479 milhões, produzindo
resultado nominal acima da linha de aproximadamente -R$ 802.436,455 milhões.
Já o RTN combina sua medida primária abaixo da linha com juros nominais RTN e
chega a -R$ 811.489,303 milhões. As diferenças são conceituais/metodológicas;
escolher uma convenção fiscal coerente para o jogo antes de combinar resultado,
juros e dívida.

## Fichas de linhagem — estoques e lacunas

O Anexo 6 do RREO de agosto/2026 também informa posições em dezembro/2025 e
agosto/2026. Unidade original: R$ milhares; conversão abaixo para R$ bilhões.
São indicadores contábeis consolidados do demonstrativo, não saldos disponíveis
do caixa único do Tesouro nem a Dívida Pública Federal (DPF).

| Indicador de estoque | Dez/2025 | Ago/2026 | Tratamento |
|---|---:|---:|---|
| Dívida Consolidada | 11.545,3429 | 12.264,0739 | Definição e perímetro do Anexo 6 do RREO |
| Deduções | 3.522,3280 | 3.439,1255 | Parcela deduzida no cálculo da dívida consolidada líquida |
| Dívida Consolidada Líquida | 8.023,0149 | 8.824,9484 | Identidade do RREO: dívida consolidada menos deduções |
| Disponibilidade de Caixa Bruta | 2.063,8847 | 1.803,4536 | Posição contábil do Anexo 6, não assumir que seja caixa livre para novas políticas |
| Restos a Pagar Processados | 149,0743 | 154,0494 | Obrigação deduzida da disponibilidade bruta |
| Disponibilidade de Caixa | 1.914,8104 | 1.649,4041 | Disponibilidade líquida após a dedução indicada no demonstrativo |

Esses estoques são uma referência inicial reproduzível, mas não substituem uma
série de caixa livre do Tesouro. A DPF, sua composição e seu perfil de
vencimentos foram extraídos separadamente do RMD abaixo. A despesa de juros
agregada do RTN tampouco identifica os pagamentos de cada título ou indexador.
IPCA/fator de conversão de preços continua pendente; todos os fluxos acima
permanecem em moeda corrente da respectiva data, sem comparação real entre 2025
e 2026.

### DPF — posição, composição, vencimento e custo

**Fonte:** anexo `Anexo RMD_Agosto_26.xlsx`, publicado em 28/09/2026 com o
[RMD de agosto/2026](https://www.tesourotransparente.gov.br/publicacoes/relatorio-mensal-da-divida-rmd/2026/8).
Link do arquivo compactado: [`RMD_Agosto_26.zip`](https://thot-arquivos.tesouro.gov.br/publicacao-anexo/29322).
Data-base da posição: 31/08/2026. Valores das abas 2.1, 2.4 e 3.1 estão em
R$ bilhões, a menos que indicado.

| Medida | Valor em ago/2026 | Origem no anexo | Uso/limite |
|---|---:|---|---|
| DPF em poder do público | 9.292,7344 | Aba 2.1, linha “DPF em poder do público”, coluna Ago/26 | Estoque da dívida mobiliária federal sob responsabilidade do Tesouro em mercado; não somar à dívida consolidada líquida do RREO |
| DPMFi | 8.944,4782 | Aba 2.1, linha “DPMFi”, coluna Ago/26 | Parcela interna |
| Prefixados | 1.887,2278 (20,31%) | Aba 2.4, linha Ago/26, saldo e participação | Sensibilidade a taxas de mercado depende dos títulos e da regra de marcação/rolagem |
| Indexados a preços | 2.157,3492 (23,22%) | Aba 2.4, linha Ago/26, saldo e participação | Exposição a indexadores; não equivale a inflação observada futura |
| Taxa flutuante | 4.901,0258 (52,74%) | Aba 2.4, linha Ago/26, saldo e participação | Forte peso no perfil, mas não aplicar uma taxa instantânea ao estoque inteiro sem dinâmica contratual |
| Câmbio | 347,1316 (3,74%) | Aba 2.4, linha Ago/26, saldo e participação | Exposição cambial da carteira conforme classificação do RMD |
| Demais | 0 | Aba 2.4, linha Ago/26 | Categoria reportada como zero na edição consultada |
| Prazo médio da DPF | 4,0983 anos | Aba 3.7, linha DPF, coluna Ago/26 | Estatística agregada de prazo, não um cronograma de vencimentos |
| Custo médio mensal da DPF | 12,0396% a.a. | Aba 4.1, linha DPF, coluna Ago/26 | Custo médio observado da carteira no mês; não é taxa marginal de nova emissão |
| Custo médio da DPF acumulado em 12 meses | 12,5914% a.a. | Aba 4.2, linha DPF, coluna Ago/26 | Estatística retrospectiva da carteira; não substitui a despesa RTN/RREO nem deve ser multiplicada pelo estoque para simular juros |

**Perfil de vencimentos da DPF (aba 3.1, fechamento de 31/08/2026):**

| Horizonte | Valor (R$ bilhões) | Participação |
|---|---:|---:|
| Até 12 meses | 1.522,8897 | 16,39% |
| De 1 a 2 anos | 1.518,1553 | 16,34% |
| De 2 a 3 anos | 1.430,6034 | 15,39% |
| De 3 a 4 anos | 1.266,4129 | 13,63% |
| De 4 a 5 anos | 1.111,2803 | 11,96% |
| Acima de 5 anos | 2.443,3928 | 26,29% |
| **Total** | **9.292,7344** | **100%** |

A DPF em poder do público (R$ 9.292,7344 bi) difere da Dívida Consolidada
Líquida no Anexo 6 do RREO (R$ 8.824,9484 bi em agosto/2026): são conceitos e
perímetros distintos, e a diferença não é uma discrepância a “corrigir”.
O RMD oferece posição da carteira, indexadores, prazos, vencimentos e custos
médios; o RREO continua sendo fonte separada para seus conceitos de dívida e
disponibilidade contábil.

## Checagem observada — RTN de agosto de 2026

| Campo | Registro |
|---|---|
| Fonte | STN, [Boletim Resultado do Tesouro Nacional (RTN), agosto/2026](https://www.tesourotransparente.gov.br/publicacoes/boletim-resultado-do-tesouro-nacional-rtn/2026/8) |
| Anexo tabular | [Séries históricas do RTN, agosto/2026](https://thot-arquivos.tesouro.gov.br/publicacao-anexo/29326) |
| Publicação | 29/09/2026; consulta em 03/10/2026 |
| Conceito | Resultado primário do Governo Central |
| Valor noticiado | Déficit de R$ 13,6 bilhões, a preços correntes |
| Comparação divulgada | Contra agosto/2025: receita líquida +R$ 6,3 bilhões reais (+3,5%); despesa total +R$ 3,7 bilhões reais (+1,9%) |
| Uso neste projeto | Controle cruzado de ordem de grandeza após extrair tabelas e confirmar cobertura e metodologia |
| Controle tabular | Linha mensal 66 da aba 1.1: -R$ 13.584,945 milhões; a soma jan–ago cruza com o RREO até arredondamento de R$ 1 mil |

O resultado primário do RTN mede receitas menos despesas primárias sob o conceito
do Governo Central; não é automaticamente caixa final, resultado nominal ou
necessidade de financiamento do setor público. Não preencher ainda os campos
numéricos executáveis do cenário com esse único valor.

## Regras para ingestão e reconciliação

1. Para cada série, registrar instituição, título, URL, tabela/anexo, código da
   conta/série, conceito, unidade, cobertura institucional, frequência, período,
   estágio contábil (previsto, empenhado, liquidado, pago ou estoque), data de
   publicação e data em que foi obtida.
2. Preservar a origem, a edição exata e a transformação reproduzível. Nesta
   ficha, os arquivos oficiais não foram adicionados ao repositório: os links,
   nomes, abas e linhas de origem foram registrados para reobtenção. Antes de
   transformar os dados em fixtures ou pacote do cenário, guardar o arquivo ou
   uma extração tabular verificável junto com a transformação. Não copiar apenas
   um número para o JSON sem linhagem.
3. Não somar séries com coberturas diferentes. Em particular, não equiparar
   Governo Central, Governo Federal, Governo Geral, setor público consolidado e
   DPF.
4. Distinguir dado realizado de projeção e versão retificada. Para relatórios
   acumulados no ano, recuperar o fluxo do intervalo por diferença somente após
   confirmar que a conta tem essa propriedade e que as edições são compatíveis.
5. Converter moeda para a referência de preços do cenário apenas depois de
   selecionar o índice pertinente. Guardar valores originais, fator de conversão
   e valor convertido.
6. Reconciliar séries por exercício e período contra o demonstrativo oficial
   correspondente e documentar diferenças conceituais em vez de forçar igualdade.

## Próxima tarefa verificável

As fichas iniciais para fluxos RTN, juros agregados e alguns estoques do RREO
estão preenchidas; o exercício 2025 fecha dentro da versão do RTN e o parcial
jan–ago/2026 cruza com o RREO acima da linha. Ainda não há uma série reconciliada
de composição/vencimentos da DPF, caixa livre do Tesouro nem fator de preços.
Antes de especificar números executáveis para o cenário:

- validar a ficha anual de 2025 contra as tabelas legíveis do RREO republicado
  (o PDF de dezembro/2025 usa codificação que impediu a extração textual confiável
  nesta consulta);
- escolher um único conceito para resultado, juros e nominal e documentar as
  diferenças entre RTN e RREO;
- decidir se a disponibilidade do Anexo 6 serve apenas como referência ou se é
  necessária uma série específica de caixa livre do Tesouro;
- escolher índice, mês-base e procedimento de conversão antes de comparar
  valores de 2025 e 2026 em termos reais.

Somente depois disso fixar os exemplos numéricos de aceite do SG060-A e decidir
quais lacunas ficam fora do primeiro circuito ou entram como hipóteses
explicitamente rotuladas.

## Referências conceituais a consultar antes da extração

- Manual de Demonstrativos Fiscais e leiautes do RREO publicados pela STN.
- Notas metodológicas das Estatísticas Fiscais do BCB.
- Metodologia, tabelas anexas e notas do RMD para DPF.
- Metodologia e série histórica do IPCA/índice de preços escolhido no IBGE.

Os valores acima são uma extração documental de apoio ao planejamento, não dados
do cenário executável. Os arquivos-fonte não estão anexados ao repositório; as
publicações oficiais e seus anexos estão ligados nas fichas para reobtenção.
