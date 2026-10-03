# SG051 — Variáveis e perfis do primeiro cenário

**Estado:** Concluído — contrato documental para o cenário.  
**Data de consulta:** 3 de outubro de 2026.  
**Dependência:** [SG049](sg049-recorte-do-cenario.md) e [SG050](sg050-decisoes-e-autorizacoes.md).

Este documento fixa a unidade, a referência inicial e a origem de cada variável do recorte de Saúde e Segurança. Ele separa três coisas que não podem ser confundidas:

- **dado observado:** número publicado por uma fonte e mantido com seu ano e significado;
- **valor de cenário:** número criado para o jogo, necessário para iniciar uma simulação, mas que não se apresenta como estatística nacional;
- **valor derivado:** total calculado a partir de outros valores do próprio cenário.

O motor não conhece Brasil, SUS, ministérios nem estes perfis. Estas definições serão dados do pacote de cenário em SG054. Coeficientes, atrasos e transformações ainda pertencem a SG052–SG053.

## Convenções do recorte

- A data de início do estado herdado é **31 de dezembro de 2024** quando houver dado observado. O jogo poderá avançar em outra granularidade; SG057 definirá o turno.
- Valores monetários de cenário usam **R$ milhões de 2024 por ano**. São um envelope pequeno para este recorte, não o orçamento da União nem o gasto nacional em cada área.
- Um índice `0–100` é uma escala interna: 0 é a pior condição representável no recorte e 100 é a melhor. Não significa porcentagem de pessoas, nem pode ser comparado diretamente a uma estatística pública.
- Taxas por `100 mil habitantes` preservam a unidade da fonte. Na interface, a normalização visual será responsabilidade do filtro, e não uma conversão que esconda a unidade.

## Dicionário das variáveis

| ID | Variável | Unidade | Referência inicial | Classe | Fonte ou base | Leitura correta |
| --- | --- | --- | --- | --- | --- | --- |
| V1 | Recursos para atenção básica | R$ milhões de 2024/ano | 4.000 | Valor de cenário | Hipótese de recorte. A [Portaria GM/MS 4.371/2024](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2024/prt4371_21_06_2024.html) é referência de escala institucional: ela vincula R$ 25,04 bilhões ao Piso da Atenção Primária nas parcelas de maio a dezembro de 2024. | Verba controlada pela política P1 dentro da simulação; não é o total real da atenção primária brasileira. |
| V2 | Recursos para atendimento e proteção às mulheres | R$ milhões de 2024/ano | 240 | Valor de cenário | Hipótese de recorte, compatível com P2 e sua articulação federativa documentada em SG050. O [Relatório de Gestão 2024 do Ministério das Mulheres](https://www.gov.br/mulheres/pt-br/acesso-a-informacao/transparencia-e-prestacao-de-contas-1/RelatriodeGestoIntegradoRGIAno2024.pdf/%40%40display-file/file) é contexto institucional, não fonte deste valor. | Alocação jogável para rede e atendimento; não mede todos os gastos públicos voltados às mulheres. |
| V3 | Recursos para prevenção e cooperação em segurança | R$ milhões de 2024/ano | 600 | Valor de cenário | Hipótese de recorte; a cooperação e as competências são as já documentadas a partir da Lei 13.675/2018 em SG050. | Alocação jogável de P3; não representa o orçamento de segurança do país. |
| V4 | Cobertura estimada da atenção primária | % da população | 72 | Dado observado | [Relatório Anual de Gestão do Ministério da Saúde de 2024](https://bvsms.saude.gov.br/bvs/publicacoes/relatorio_anual_gestao_2024.pdf), competência SCNES de dezembro de 2024: 152.102.406 pessoas cobertas em população de 212.583.750. | Cobertura estimada por equipes de APS. É uma aproximação de acesso, não uma medida completa de qualidade ou de atendimento realizado. |
| V5 | Saúde da população | índice 0–100 | 60 | Valor de cenário | Hipótese explícita. Não existe um único indicador nacional oficial que resuma a saúde da população no sentido usado pelo jogo. | Resultado agregado do recorte; não é expectativa de vida, mortalidade ou percentual de pessoas saudáveis. |
| V6 | Pressão sobre o atendimento hospitalar | índice 0–100 | 54 | Valor de cenário | Hipótese explícita. Ocupação, filas e pressão variam por serviço e território; não serão fingidas como uma taxa nacional única. | Quanto maior, maior a pressão. Servirá para acionar a situação de sobrecarga depois que SG052–SG053 definirem causas e limites. |
| V7 | Violência letal | homicídios por 100 mil habitantes | 21,2 | Dado observado | [Atlas da Violência 2025](https://www.ipea.gov.br/atlasviolencia/arquivos/artigos/5999-atlasdaviolencia2025.pdf), ano-base 2023: 45.747 homicídios e taxa nacional de 21,2. | Recorte inicial de violência letal. Não resume violência doméstica, sensação de segurança ou todas as ocorrências criminais. |
| V8 | Proteção efetiva às mulheres | índice 0–100 | 42 | Valor de cenário | Hipótese explícita. O [Ligue 180 em 2024](https://www.gov.br/mulheres/pt-br/central-de-conteudos/noticias/2025/fevereiro/ligue-180-realiza-mais-de-2-mil-atendimentos-por-dia-em-2024) registrou contatos e violações relatadas, mas esses números não medem diretamente a efetividade nacional da proteção. | Mede a capacidade agregada de acolher, encaminhar e proteger no recorte. Não usa denúncias como sinônimo de violência nem como prova de qualidade do serviço. |
| V9 | Despesa recorrente das três políticas | R$ milhões de 2024/ano | 4.840 | Valor derivado | `V1 + V2 + V3` no estado inicial. | Custo anual comprometido do envelope do recorte. Custos únicos e outras despesas públicas ficam fora até que sejam declarados. |
| V10 | Saldo orçamentário do recorte | R$ milhões de 2024/ano | +360 | Valor derivado | Receita disponível de cenário: 5.200; menos V9: 4.840. Ambos são hipóteses de cenário. | Margem financeira do recorte no início. Saldo positivo não substitui a autorização de uma decisão, conforme SG050. |

V1–V3 e a receita de referência de V10 são deliberadamente hipotéticos. A pesquisa informa o contexto e impede que o cenário atribua à União poderes ou números que não possui; ela não transforma o orçamento completo brasileiro em uma barra do jogo. A recalibração futura pode trocar esses valores sem mudar a unidade ou o contrato das variáveis.

## Coerência do estado herdado

O país inicia com políticas já ativas: V1, V2 e V3 não são zero. Por isso V9 já contém despesa e V10 já contém uma pequena margem. V4 e V7 preservam o último ano publicado disponível usado neste recorte. V5, V6 e V8 são pontos de partida de jogo, declarados como hipóteses, e não tentativas de inferir índices reais inexistentes.

Essa combinação deixa uma escolha concreta para o jogador: ampliar uma política reduz o saldo primeiro; a implantação e os resultados sociais só aparecerão mais tarde. A definição de quanto e quando isso ocorre não é adiantada aqui.

## Perfis populacionais

Os perfis modelam prioridades agregadas para testar consequências sociais e, futuramente, apoio político. Eles não são cidadãos individualmente simulados, partidos, regiões ou categorias jurídicas. Cada pessoa modelada entra em apenas um perfil para fins de peso; as necessidades podem se sobrepor entre perfis sem duplicar população.

| Perfil | Peso da população modelada | Situação resumida | Interesses e sensibilidades para o teste |
| --- | ---: | --- | --- |
| A — Maior dependência da rede pública | 55% | Pessoas e famílias cujo bem-estar cotidiano depende mais diretamente de atendimento e proteção públicos. | Sensibilidade alta a V4, V5, V6 e V8; sensibilidade média a V7 e V10. A perda de acesso ou a sobrecarga deve afetar este perfil antes de qualquer conclusão eleitoral. |
| B — Trabalho e circulação sob pressão da violência | 45% | Pessoas e famílias cuja rotina econômica e deslocamento são particularmente afetados pela violência e pela segurança cotidiana. | Sensibilidade alta a V7 e V10; sensibilidade média a V4, V5 e V8. A redução da violência pode melhorar sua avaliação mesmo que os demais indicadores mudem pouco. |

Os pesos `55%` e `45%` são **hipóteses de balanceamento**, não uma estimativa demográfica brasileira. Eles somam 100% e são mutuamente exclusivos apenas no cálculo do jogo. Uma mesma preocupação, como saúde, pode existir nos dois perfis; o motor deve ponderá-la pela fração de cada perfil, nunca somar suas populações duas vezes.

Os níveis de interesse acima são rótulos qualitativos. SG052 definirá os efeitos e SG053 converterá somente os necessários em parâmetros auditáveis. Um perfil não ganha ou perde aprovação automaticamente porque um indicador existe.

## Estados que permanecem separados

Para evitar que uma mesma bolinha misture conceitos diferentes, o cenário manterá campos distintos para:

| Estado | O que responde | Não significa |
| --- | --- | --- |
| Opinião sobre uma medida | Como cada perfil avalia uma política ou proposta específica. | O resultado atual de V4–V8. |
| Aprovação do governo | Avaliação agregada do governo pelo perfil. | A aprovação de um ministro ou a autorização de gasto. |
| Aprovação do ministro | Avaliação visual futura da esfera ministerial no mapa. | A aprovação do governo inteiro. |
| Indicador de domínio | Condição mensurada do país, como cobertura da APS ou violência. | Opinião, voto ou autorização. |
| Saldo orçamentário | Margem do envelope do recorte. | Permissão automática para gastar. |

O modelo eleitoral ainda não é entregue por SG051. A separação acima é um requisito para a Fase 7 e impede que a futura cor de uma esfera ministerial seja usada como atalho para qualquer uma das demais variáveis.

## Aceites para SG054 e testes futuros

1. O pacote do cenário declara a unidade e a classe de origem de todas as dez variáveis; um valor hipotético não aparece como estatística oficial.
2. O carregador conserva V4 como percentual e V7 como taxa por 100 mil, sem convertê-los silenciosamente para índice `0–100`.
3. V9 é obtido uma única vez a partir dos recursos declarados, sem cobrar novamente o mesmo custo por uma ligação do grafo.
4. Os pesos dos perfis somam 100% e cada contribuição social é ponderada por um único perfil por vez.
5. Uma variação em indicador, opinião, aprovação ministerial, aprovação do governo ou saldo registra campos diferentes; SG052–SG053 decidirão quais relações existem entre eles.

## Próximos passos

SG051 conclui a base mensurável do primeiro cenário. [SG052](../plano-de-producao.md#sg052-justificar-consequências) selecionará e justificará as relações de consequência; SG053 definirá atrasos, faixas e parâmetros. Só depois SG054 transformará este contrato em JSON executável.
