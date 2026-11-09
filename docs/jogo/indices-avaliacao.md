# Avaliação dos índices

Um índice está **avaliado** quando o autor já decidiu o que ele liga: o que o
move, o que ele piora ou melhora, e quais grupos o cobram. O número fino fica
para o balanço final.

Ao avaliar um índice, ligar tudo o que ele exige e criar o que faltar. O que foi
ligado ou criado e ainda não passou por avaliação entra em **Não avaliados**.

## Avaliados

| Índice                    | Movido por                                                                                             | Empurra                             | Cobrado por                         | Data        |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------- | ----------- |
| Favela (`favela`)         | contagem de casas, preço contra a renda dos pops, leis de moradia                                      | piora saúde, segurança e saneamento | sem trabalho formal                 | 04/nov/2026 |
| Saúde (`saude`)           | rede de atendimento, saneamento, favela, vacinação, saúde ambiental                                    | melhora padrão de vida e reduz pobreza | operários, educação e saúde, aposentados | 05/nov/2026 |
| Saneamento (`saneamento`) | contagem da rede (verba, concessão, teto da tarifa, tratamento), conta contra a renda dos pops, favela | melhora saúde e meio ambiente       | sem trabalho formal, gente do campo | 04/nov/2026 |

## Não avaliados

Ligados ou criados pelas avaliações da favela e do saneamento:

- Atendimento (`atendimento`): quem é atendido; o resto é a fila da saúde.
- Profissionais de saúde (`profissionais_saude`): profissionais contra o que o
  país precisa; hoje saem de `instrucao`, depois da rede escolar.
- Vacinação (`vacinacao`): parte das pessoas vacinadas; sai do programa, da rede e
  da recusa, e empurra a saúde.
- Segurança (`seguranca`)
- Meio ambiente (`meio_ambiente`)
- Padrão de vida (`padrao_vida`)
- Desigualdade (`desigualdade`): sobe com a saúde de dois andares (com plano × na fila).
- Emprego informal (`emprego_informal`): parte das pessoas sem carteira; hoje sobe com o Seguro na folha.

Os demais índices de `src/conteudo/mundo/indicadores/variaveis.json`:

- Trabalho: `ocupados`, `desemprego`
- População: `populacao`
- Economia: `pib`, `crescimento_real`, `indice_precos`, `inflacao`,
  `pib_nominal`, `industrializacao`
- Contas: `arrecadacao`, `gasto_publico`, `juros_pagos`, `resultado_primario`,
  `resultado_fiscal`, `cofre`, `divida_publica`, `taxa_juros`
- Sociedade: `instrucao`, `abastecimento`, `acesso_remedios`,
  `lotacao_presidios`, `poder_defensivo`, `seguranca_externa`, `pobreza`,
  `deficit_habitacional`, `preco_moradia`,
  `concentracao_terra`
- Política: `corrupcao`, `liberdade_civil`, `polarizacao`,
  `reputacao_internacional`, `popularidade_governo`

## Ainda não existem

- Organizações criminosas: a favela as fortalece; desenho pendente (GDD §18).
- Dependência de drogas (`dependencia_drogas`), dependência de jogos
  (`dependencia_jogos`) e mercado ilegal (`mercado_ilegal`): aprovados em 05/nov;
  desenho em [fase-1-redes.md](fase-1-redes.md).
