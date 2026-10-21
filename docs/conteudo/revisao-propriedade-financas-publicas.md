# Revisão: propriedade produtiva e finanças públicas

> **Status: REFERÊNCIA DE EXECUÇÃO.** Registro do lote de quatro leis, 21/out/2026.

## Leis e decisões

Foram lidas semanticamente quatro leis e 13 opções anteriores:

| Lei | Decisão | Resultado |
| --- | --- | --- |
| Propriedade dos meios de produção | Reformular | Vira participação pública agregada em cinco níveis: 0, 25, 50, 75 e 100. A escala não separa setores. |
| Papel do Estado empresário | Reformular | Define o alcance jurídico permitido às empresas estatais; deixa de representar participação acionária. |
| Programa de privatização | Manter | É a decisão de venda, separada da participação acionária. A receita única da venda ainda não é contabilizada. |
| Nacionalização | Manter | Distingue formas jurídicas de aquisição. O desembolso de compra não é contabilizado. |

Nenhuma lei foi fundida, dividida, criada ou removida. Os antigos rótulos
"privada", "mista" e "socialista" foram substituídos por níveis percentuais
agregados. O teste direto do motor aceita 0, 25, 50, 75 e 100.

## Relação financeira

Os efeitos existentes de receita recorrente e custo operacional recorrente das
empresas públicas passaram da lei que autoriza o alcance empresarial para o
controle de participação pública. Os parâmetros não foram recalibrados. A
receita é recorrente de dividendos modelados; ela não representa venda de ativo.
Também não há custo de aquisição ou parcela de compra no modelo atual.

## Limites e cobertura

O controle é agregado: não há participação acionária independente para energia,
bancos, transportes, indústria ou telecomunicações. A transição entre níveis,
a avaliação de empresas e o caixa de venda ou aquisição não são representados
por esta mudança. Assim, a escala é um controle de política agregado, não um
inventário de ativos reais por setor.

Este lote registra quatro leis semanticamente analisadas. Não altera o total de
73 leis com integração confirmada nem reduz as 169 pendentes desse indicador:
revisão semântica e integração confirmada são contagens diferentes.

## Validação

O teste focal `src/tests/propriedadePublica.test.ts` passou (2/2): os cinco
níveis são aceitos e o saldo fiscal líquido recorrente atribuído à lei cresce
entre 0% e 100%. A geração idempotente atualizou zero arquivos; o validador
reportou 228 fichas geradas válidas e nenhuma com erro.

Foram simuladas dez rotas por 32 turnos no motor real. Todas tiveram zero
recusas e 33 observações financeiras (turnos 0 a 32). As séries completas e
os retratos sociais/econômicos nos marcos 0, 1, 4, 8, 16, 24 e 32 estão em
[`simulacao-propriedade-32-turnos.jsonl`](simulacao-propriedade-32-turnos.jsonl).
Os valores abaixo são do turno 32, em % do PIB, salvo o saldo anual líquido da
lei de propriedade, em moeda nominal do cenário.

| Rota | Receita | Gasto | Juros | Resultado | Dívida | Cofre | Saldo anual da lei de propriedade |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Referência | 29,845 | 30,275 | 18,451 | -18,881 | 171,093 | 0 | 24.177 |
| Social | 30,073 | 31,443 | 20,390 | -21,761 | 182,892 | 0 | 24.318 |
| Liberal | 18,523 | 23,966 | 40,697 | -46,140 | 265,140 | 0 | 16.121 |
| Recuperação | 26,243 | 28,702 | 34,443 | -36,901 | 230,414 | 0 | 16.966 |
| Segurança | 30,544 | 30,898 | 18,300 | -18,654 | 171,565 | 0 | 25.647 |
| Fiscal | 26,760 | 28,540 | 20,675 | -22,455 | 176,485 | 0 | 18.466 |
| Misto | 30,061 | 31,037 | 19,756 | -20,732 | 179,204 | 0 | 24.503 |
| Participação e alcance 0 | 31,833 | 30,654 | 15,440 | -14,262 | 155,085 | 0 | 0 |
| Participação e alcance 100 | 29,429 | 30,664 | 20,538 | -21,773 | 182,156 | 0 | 20.300 |
| Extrema | 31,562 | 32,741 | 19,840 | -21,019 | 182,944 | 0 | 28.049 |

As duas rotas de propriedade também alteram o alcance jurídico das estatais,
portanto a comparação entre elas é combinada; o teste focal isola o saldo direto
da lei de propriedade. O saldo direto sobe com a participação pública, mas a
economia agregada da rota 100 termina com receita menor, juros maiores e dívida
maior que a rota 0. O efeito de dividendos não domina os demais efeitos
econômicos. Isso é um resultado observado, ainda não um juízo de equilíbrio.

**Problema financeiro aberto:** todas as rotas terminam com resultado negativo,
dívida acima do ponto inicial e cofre zerado. A recuperação reduz a dívida em
relação à rota liberal, mas não restabelece sustentabilidade. Esta execução não
recalibrou coeficientes sem base nem resolve o balanceamento fiscal geral.
Simulações automáticas verificam funcionamento e diferenças entre estratégias;
não confirmam diversão nem calibração humana.
