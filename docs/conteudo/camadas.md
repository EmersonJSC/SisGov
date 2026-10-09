# Mapa da rede por camadas

**Chamado:** SG155 · **Regra:** R-11 do [PLANO](../../PLANO.md)
**Estado:** camada 1 em **proposta**, aguardando aprovação do autor. As
camadas 2 em diante só começam depois.

## Como as camadas funcionam

- **Camada 1 — pilares.** Bolhas que mexem em quase todo o resto, cuja crise
  abala o país inteiro e que o jogador reconhece como "manchete".
- **Camada 2** — o que deriva diretamente dos pilares.
- **Camada 3, 4…** — o que deriva das derivadas, até uma camada aceitável.

Cada bolha diz: o que já existe na rede, o que falta, quais leis mexem nela
e de onde veio a ideia. Leis também têm camada: as de camada 1 são as que
mexem nos pilares.

## Pesquisa usada na camada 1

- **Os quatro objetivos clássicos da política econômica** ("quadrilátero
  mágico"): crescimento, emprego, estabilidade de preços e equilíbrio
  externo — e eles se contrariam (ex.: reduzir desemprego pressiona preços).
  [Brno University of Technology — Macroeconomic policy](https://www.fce.vutbr.cz/EKR/asp/AktualityPredmety/BV01-EN/Lec09.pdf)
- **Sinais que anteciparam crises financeiras:** os mais fortes foram
  reservas internacionais baixas (em relação à dívida de curto prazo) e
  câmbio sobrevalorizado; saldo externo e poupança reduzem a gravidade.
  [Frankel e Saravelos — leading indicators](https://www.jeffrey-frankel.com/?p=118),
  [NBER w16047](https://www.nber.org/papers/w16047)
- **A Constituição de 1988** se organiza em: princípios fundamentais;
  direitos e garantias; organização do Estado; organização dos Poderes;
  defesa do Estado e das instituições; tributação e orçamento; ordem
  econômica e financeira; ordem social.
  [TSE — Constituição Federal](https://www.tse.jus.br/legislacao/codigo-eleitoral/constituicao-federal)

## Camada 1 — os pilares (proposta)

| # | Pilar | Bolhas | Tipo | Já existe? | Recebe de (resumo) | Alimenta (resumo) |
|---|---|---|---|---|---|---|
| 1 | **Crescimento** | PIB | índice | sim | produtividade, consumo, investimento, infraestrutura | emprego, renda, arrecadação, investimento |
| 2 | **Emprego** | Desemprego | índice | sim | PIB, qualificação | renda, pobreza, recessão, popularidade |
| 3 | **Estabilidade de preços** | Inflação | índice | **não** | gasto público, juros (−), câmbio, salário mínimo | renda real, consumo, juros, crise financeira |
| 4 | **Contas públicas** | Arrecadação, Dívida pública (% do PIB), Juros da dívida | índice / bolha lenta | **fora da rede** (estão no módulo fiscal) | PIB, impostos, gasto, juros | crise financeira, investimento, eficácia das leis |
| 5 | **Setor externo** | Câmbio, Reservas internacionais, Exportações | índice / bolha lenta | **não** (exportações são agregado fiscal) | juros, confiança, preços de exportação, regime cambial | inflação, PIB, crise financeira |
| 6 | **Alerta de crise financeira** | Crise financeira | situação | **não** | dívida alta, inflação alta, reservas baixas, câmbio sobrevalorizado, recessão | investimento (−), confiança (−), juros (+), PIB (−) |
| 7 | **Constituição** | conjunto de leis institucionais | leis | **parcial** (só leis eleitorais) | — (o jogador muda por reforma, M8) | eficácia e apoio das leis, confiança, corrupção |
| 8 | **Legitimidade** | Confiança nas instituições, Popularidade do governo | índice | confiança sim; popularidade no SG143 | segurança, corrupção, renda, inflação | apoio no Senado, eleição, eficácia das leis |
| 9 | **População** | População, Envelhecimento | bolha lenta | **não** | saúde, renda, escolaridade | gasto com previdência e saúde, força de trabalho |

### Leis de camada 1 (as que mexem nos pilares)

| Lei | Grupo | Pilares | Opções / nível |
|---|---|---|---|
| Regra fiscal | institucional | contas públicas, crise financeira, investimento | sem regra / meta de resultado / teto de gastos / arcabouço |
| Autonomia do Banco Central | institucional | inflação, juros, confiança | subordinado / autonomia parcial / autonomia plena |
| Juros básicos (meta) | regulatória | inflação, PIB, dívida, câmbio | faixas (só vale se o BC não for autônomo) |
| Regime cambial | regulatória | câmbio, reservas, inflação | fixo / bandas / flutuante administrado / flutuante |
| Imposto de renda | tributária | arrecadação, desigualdade, consumo | alíquota (já previsto no SG139) |
| Imposto sobre consumo | tributária | arrecadação, inflação, consumo | alíquota (já previsto no SG139) |
| Previdência | regulatória | contas públicas, população, pobreza | idade mínima: sem / 60 / 62–65 / 67 |
| Salário mínimo | regulatória | emprego, inflação, renda, previdência | já previsto no SG138 |
| Forma de governo e sistema eleitoral | institucional | constituição, legitimidade | já existem (M8 para mudar) |

### O que fica para a camada 2 (só a lista, para mostrar o caminho)

Saúde, Escolaridade, Segurança, Pobreza e desigualdade, Investimento e
confiança empresarial, Infraestrutura (e suas sub-bolhas: estradas,
ferrovias, mineração), Corrupção e capacidade do Estado, Meio ambiente.
A rede atual já tem boa parte disso; a camada 2 vai dizer o que falta e
quais leis entram (verbas, programas, regulações).

## Decisões pedidas ao autor

1. **Inflação, câmbio e crise financeira** foram excluídos da V1 no plano
   antigo (backlog B-04). Como pilares de camada 1, eles voltam para o MVP?
2. **Contas públicas dentro da rede:** hoje caixa, dívida e juros vivem num
   módulo fiscal separado, com o PIB fixo. Ligar esse módulo à rede (PIB da
   rede → arrecadação; dívida → crise) é o caminho?
3. **Saúde e Escolaridade** ficam na camada 2, ou você as vê como pilares?
4. **População** é pilar?
