# Mapa da rede por camadas

> **Status: DESATIVADO** desde 12/out/2026 (V1-01). Não é para seguir. O motivo e o substituto estão em [LEIA-ME](../LEIA-ME.md).

**Chamado:** SG155 · **Regra:** R-11 do [PLANO](../../PLANO.md)
Documento construído aos poucos, uma camada de cada vez, com aprovação do
autor antes de descer para a próxima.

---

## Camada 1 — os pilares do país

**Estado:** pilares 1 a 4 aprovados e derivados; 5 a 9 a derivar.
**Fonte:** as bolhas e leis aprovadas estão em `scripts/camadas/gerar.py`
(gerador único, separado por camadas). Ele só acrescenta o que falta aos
JSONs e nunca sobrescreve; depois de gerado, o JSON é a verdade única.
**Ainda não gerado:** faltam as ligações (quem alimenta quem), para nenhuma
bolha nascer isolada.

| #   | Pilar                   | Estado    | Bolhas e leis                                                                                                                                                                                                                      |
| --- | ----------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Economia                | aprovado  | PIB, Desemprego, Renda das famílias (já existem) + **Inflação**                                                                                                                                                                    |
| 2   | Contas públicas         | aprovado  | **Arrecadação**, **Gasto público**, **Resultado fiscal**, **Dívida pública** (lenta), **Juros da dívida**                                                                                                                          |
| 3   | Estabilidade financeira | aprovado  | **Taxa de juros**, **Câmbio**, **Risco país**, **Reservas internacionais** (lenta), **Crise financeira** (situação)                                                                                                                |
| 4   | Instituições            | aprovado  | **Força das instituições** + 7 leis institucionais: Regra fiscal, Autonomia do Banco Central, Regime cambial, Independência do Judiciário, Liberdade de imprensa, Transparência pública, Federalismo (Sistema eleitoral já existe) |
| 5   | Legitimidade            | a derivar | Popularidade do governo, Confiança nas instituições                                                                                                                                                                                |
| 6   | População               | a derivar | População e envelhecimento (lenta)                                                                                                                                                                                                 |
| 7   | Bem-estar               | a derivar | Qualidade de vida, que junta saúde, escolaridade e renda                                                                                                                                                                           |
| 8   | Ordem e segurança       | a derivar | Segurança pública                                                                                                                                                                                                                  |
| 9   | Território e natureza   | a derivar | contexto fixo; meio ambiente entra na camada 2                                                                                                                                                                                     |

Consumo, investimento e produtividade descem para a camada 2.

Pontos de partida do Brasil (só o que não é calculado): dívida pública
77% do PIB, reservas 16% do PIB; leis vigentes: arcabouço fiscal, BC com
autonomia plena, câmbio flutuante, Judiciário independente, imprensa plena,
acesso à informação, federalismo cooperativo.

Comandos:

```
python3 scripts/camadas/gerar.py listar
python3 scripts/camadas/gerar.py gerar --camada 1 --pais brasil            # ensaio
python3 scripts/camadas/gerar.py gerar --camada 1 --pais brasil --aplicar  # grava
python3 scripts/camadas/gerar.py documento --camada 1
```

---

## Camada 2 — o que deriva dos pilares

**Estado:** não iniciada.

---

## Camada 3 em diante

**Estado:** não iniciada.

---

## Pesquisa consultada

- Os quatro objetivos clássicos da política econômica: crescimento, emprego,
  estabilidade de preços e equilíbrio externo.
  [Brno University of Technology](https://www.fce.vutbr.cz/EKR/asp/AktualityPredmety/BV01-EN/Lec09.pdf)
- Sinais que anteciparam crises financeiras: reservas baixas e câmbio
  sobrevalorizado. [Frankel](https://www.jeffrey-frankel.com/?p=118),
  [NBER w16047](https://www.nber.org/papers/w16047)
- Títulos da Constituição de 1988.
  [TSE](https://www.tse.jus.br/legislacao/codigo-eleitoral/constituicao-federal)
