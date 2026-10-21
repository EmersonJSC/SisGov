# Revisão: tributação e extremos financeiros

> **Status: REFERÊNCIA DE EXECUÇÃO.** Lote de quatro leis, 21/out/2026.

## Leis e opções

Foram analisadas quatro leis e oito opções discretas (as duas leis de renda
usam controles contínuos):

| Lei | Decisão | Achado e tratamento |
| --- | --- | --- |
| Imposto de renda pessoal | Manter | O controle é a alíquota marginal máxima, mas o efeito fiscal é agregado sobre a renda familiar; a descrição agora explicita que as faixas individuais não são simuladas. Teto próprio: 60%. |
| Imposto de renda das empresas | Pendente de verificação | A descrição agora explicita que o jogo usa PIB como proxy da base de lucro, pois não há indicador separado de lucro empresarial. Teto próprio: 40%. |
| IVA | Manter | As opções discretas distinguem alíquota e pacote com cashback a 26,5%; os dois aspectos ainda não são controles independentes. Teto próprio: 30%. |
| Imposto seletivo | Manter | As opções representam escopos discretos de produtos; máximo do controle: 100%. |

Nenhuma lei foi criada, fundida, dividida ou removida. Nenhuma curva fiscal foi
recalibrada neste lote.

## Partidas de estresse

O script `scripts/teste/estresseTributacao.ts` roda dez trajetórias de 16 turnos
com o motor real, semente 7, sem eventos ou eleição. Usa os limites da ficha:
0/60 para IRPF, 0/40 para IRPJ, 0/30 para IVA e 0/100 para o seletivo; também
isola a opção de cashback. Todas as dez rotas terminaram sem recusa e sem valor
não finito. As contas em cada marco e os saldos fiscais atribuídos às leis estão
em [`simulacao-tributacao-16-turnos.jsonl`](simulacao-tributacao-16-turnos.jsonl).

Valores no turno 16, em % do PIB; saldo direto anual da lei está em moeda
nominal do cenário:

| Rota | Receita | Gasto | Juros | Resultado | Dívida | Cofre | Saldo anual direto da lei |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Referência / cashback IVA | 30,933 | 30,805 | 9,844 | -9,716 | 115,608 | 0 | IVA 1.630.784 |
| IRPF 0% | 29,743 | 30,424 | 10,818 | -11,499 | 118,930 | 0 | IRPF 10.650 |
| IRPF 60% | 31,789 | 31,087 | 9,597 | -8,895 | 112,662 | 0 | IRPF 708.266 |
| IRPJ 0% | 27,493 | 29,701 | 12,154 | -14,362 | 126,192 | 0 | IRPJ 16.039 |
| IRPJ 40% | 31,388 | 30,955 | 9,706 | -9,273 | 113,960 | 0 | IRPJ 596.858 |
| IVA 0% | 16,553 | 26,367 | 24,126 | -33,940 | 159,915 | 0 | IVA 51.840 |
| IVA 30% | 32,848 | 31,404 | 9,388 | -7,944 | 110,149 | 0 | IVA 1.864.190 |
| Seletivo 0 | 30,542 | 30,685 | 10,199 | -10,342 | 116,779 | 0 | Seletivo 0 |
| Seletivo 100 | 31,483 | 30,976 | 9,714 | -9,207 | 114,052 | 0 | Seletivo 84.000 |

Todos terminam deficitários e com o cofre zerado. O teto do IVA melhora o
resultado agregado nesta rota, mas eleva a inflação em relação à referência;
IVA zero derruba a arrecadação e piora dívida e juros. Esses resultados mostram
que as alíquotas mudam a estratégia e que as contas reagem; não demonstram que
os coeficientes estejam calibrados. O IRPJ permanece pendente porque sua base
usa PIB como aproximação de lucro.

O total vigente do catálogo é 242 leis e 835 opções discretas. A revisão
semântica deste lote cobre quatro leis; a integração confirmada geral permanece
73/242, com 169 pendentes.
