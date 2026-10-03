# SG050 — Decisões e autorizações do cenário

**Estado:** Concluído — pesquisa e contrato documental.  
**Data de consulta:** 3 de outubro de 2026.  
**Dependência:** [SG049](sg049-recorte-do-cenario.md).

Este documento mapeia as três políticas do recorte. As bases normativas abaixo orientam o conteúdo; os fluxos de jogo são simplificações explícitas. Não foram implementados votação, autorizações ou execução orçamentária neste chamado.

## Bases brasileiras consultadas

| Fonte primária                                                                                       | Dispositivos                     | Regra observada relevante                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Constituição Federal](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm) | Arts. 44, 84, 144, 165–167 e 198 | O Legislativo federal reúne Câmara e Senado. O Executivo inicia as propostas orçamentárias, apreciadas pelo Congresso. Despesas dependem de autorização e limites orçamentários; remanejamentos e créditos seguem regras específicas. Saúde tem organização descentralizada e financiamento compartilhado. As polícias estaduais não se tornam subordinadas ao Presidente por receberem apoio federal. |
| [Lei 8.080/1990](https://www.planalto.gov.br/ccivil_03/leis/l8080.htm)                               | Arts. 9, 16–18                   | O SUS tem direção em cada esfera. A direção nacional presta cooperação técnica e financeira e promove descentralização; estados exercem funções de coordenação e apoio; municípios planejam, organizam, controlam e executam serviços de saúde.                                                                                                                                                        |
| [Lei 11.340/2006](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm)           | Arts. 8, 9, 35 e 36              | A proteção exige articulação entre entes e serviços. A lei prevê equipamentos e serviços de atendimento e dotações específicas, sem converter decisões judiciais ou atuação de órgãos autônomos em comandos presidenciais.                                                                                                                                                                             |
| [Decreto 11.431/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11431.htm)   | Arts. 1, 3–7                     | O Programa Mulher Viver sem Violência é coordenado pelo Ministério das Mulheres. Envolve atendimento integrado, articulação federativa, apoio técnico e financeiro e atuação conjunta com outros ministérios, incluindo Saúde e Justiça e Segurança Pública. Prevê fontes de recursos e atos complementares de gestão.                                                                                 |
| [Lei 13.675/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13675.htm)           | Arts. 2, 9–10                    | O Susp organiza cooperação entre integrantes dentro de suas competências. Integração inclui planejamento, prevenção e compartilhamento de informações; os sistemas dos entes implementam seus respectivos programas. Cooperação não elimina autonomia federativa.                                                                                                                                      |
| [Lei 4.320/1964](https://www.planalto.gov.br/ccivil_03/leis/l4320.htm)                               | Arts. 40–43 e 58–64              | Créditos adicionais têm modalidades e requisitos distintos. Suplementares e especiais dependem de autorização legal e abertura pelo Executivo, com indicação de recursos nos termos legais. Empenho, liquidação e pagamento são etapas distintas da execução da despesa.                                                                                                                               |
| [Lei Complementar 101/2000](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm)               | Arts. 8–9 e 15–17                | Programação financeira, limitação de empenho e requisitos de geração de despesas condicionam a execução. Expansão de ação governamental e obrigação continuada têm exigências próprias, incluindo impacto e adequação quando aplicáveis. Disponibilidade de dinheiro, sozinha, não autoriza toda despesa.                                                                                              |

O recorte não reproduz toda a legislação de transferências, contratações, pessoal ou financiamento setorial. Um instrumento específico só deverá ser apresentado como reprodução real após sua pesquisa própria. Não foram selecionados valores de pisos, limites fiscais ou dotações reais.

## Ações das três políticas

As três políticas são programas ou serviços financiados. A ação escolhida é ajustar o **esforço financeiro federal** de uma iniciativa já existente. Não é editar um indicador nem aprovar novamente sua lei de referência.

| Política                                 | Ação permitida no recorte                                                               | Responsável visual                        | Dependências representadas                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| P1 — Atenção básica                      | Ajustar apoio federal ao atendimento, dentro do programa e das autorizações disponíveis | Ministério da Saúde                       | Cooperação e capacidade de execução da rede local; implantação de equipes e atendimento          |
| P2 — Atendimento e proteção às mulheres  | Ajustar recursos federais de apoio à rede e ao atendimento integrado                    | Ministério das Mulheres                   | Articulação com Saúde, Justiça e Segurança e rede local; capacidade de acolhimento e atendimento |
| P3 — Prevenção e cooperação em segurança | Ajustar apoio federal a prevenção, capacitação e cooperação                             | Ministério da Justiça e Segurança Pública | Pactuação e execução pelos participantes, com competências próprias                              |

**Decisão de design derivada da pesquisa:** P2 passa do agrupamento provisório de Justiça e Segurança para uma esfera própria de Mulheres. Continua ligada às outras esferas. Esta correção vale para o cenário a escrever em SG054; o protótipo atual não foi alterado neste chamado.

Não disponibilizar comandos para determinar sentenças, conceder medidas protetivas individuais, comandar polícias estaduais ou dirigir unidades municipais como se fossem órgãos federais.

## Processos de autorização do jogo

Os identificadores abaixo são contratos de design para SG054 e SG058, não novos valores já aceitos e executados automaticamente pelo motor.

### 1. `execucao-programa-autorizado`

Usado por P1, P2 e P3 quando a mudança cabe na autorização vigente do cenário.

Requisitos de jogo: programa vigente; competência compatível; margem orçamentária autorizada; cumprimento de vínculos e compromissos declarados; financiamento admissível. Cooperação já pactuada pode ser herdada; expansão que dependa de pactuação adicional fica aguardando essa condição.

Resultado: a camada de jogo autoriza a nova meta. A implantação começa conforme os mecanismos temporais; o resultado social vem depois. Não há votação parlamentar a cada ajuste permitido.

### 2. `proposta-orcamentaria`

Usado pelas mesmas políticas quando a expansão ou redistribuição não cabe na autorização existente. A interface apresenta uma proposta, em vez de executar o gasto.

**Simplificação do SisGov:** a deliberação legislativa será representada pelo Senado do jogo. Na realidade, o Senado isoladamente não substitui o Congresso no processo orçamentário. Etapas, quóruns e calendário simplificados serão definidos em SG057.

Aprovação altera a autorização do cenário; depois aplica-se o fluxo de execução. Rejeição preserva a meta vigente e não inicia a expansão. A autorização legislativa não transforma capacidade local ou recursos financeiros em disponibilidade instantânea.

### 3. `alteracao-normativa`

Reservado para conteúdo futuro que efetivamente altere lei ou regulamento. Não é necessário para todo ajuste de verba das três políticas. Lei segue o processo legislativo simplificado; regulamentação executiva exige base e competência declaradas, sem permitir que um ato infralegal revogue uma lei.

## Matriz de roteamento

| Política | Ajuste dentro da autorização   | Ajuste que excede a autorização | Limite específico                                                                   |
| -------- | ------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------- |
| P1       | `execucao-programa-autorizado` | `proposta-orcamentaria`         | Não atribuir toda a execução do SUS à União                                         |
| P2       | `execucao-programa-autorizado` | `proposta-orcamentaria`         | Ajustar serviço e apoio; não reduzir direitos legais por um controle de porcentagem |
| P3       | `execucao-programa-autorizado` | `proposta-orcamentaria`         | Apoio e cooperação não equivalem a comando das forças dos demais entes              |

A redução também passa pela validação de compromissos e requisitos. O cenário não deverá permitir livre cancelamento de obrigação nem interpretar verba zero como revogação de um direito. Pisos e obrigações serão parâmetros explicitamente justificados, não números inventados no motor.

## Simplificações deliberadas

- O cenário agrega cooperação e capacidade local em requisitos e ritmos de implantação, sem simular cada prefeitura ou unidade de serviço.
- O orçamento é o envelope do recorte, com estado herdado; não é o orçamento integral brasileiro.
- A primeira versão distingue proposta, autorização, meta, implantação e resultado, sem exigir uma tela para cada etapa administrativa.
- Financiamento permitido e autorização são verificações distintas. Déficit pode continuar sendo um resultado válido; não equivale automaticamente a gasto sem autorização.
- Opinião popular pode influenciar decisões parlamentares conforme SG057. Não concede competência legal e não garante aprovação.
- A cor futura do ministério representa aprovação do ministro, sem confundi-la com votação ou autorização orçamentária.

## Informação que o conteúdo deverá declarar

Cada política deverá referenciar responsável visual, parceiros, competência, fontes e artigos, tipo de ação, processo de autorização e suas alternativas, requisitos, custos, compromissos herdados e regras de implantação/redução. Cada campo precisa distinguir dado pesquisado de hipótese ou simplificação.

O atual `processoAutorizacao` serve como ponto de partida. Roteamento condicional, envelopes e pendências ainda exigem contrato e implementação na camada de jogo. O executor numérico recebe comandos já autorizados, sem reconhecer ministérios brasileiros ou decidir votações.

## Exemplos de aceite para a integração futura

1. P1 recebe aumento dentro do envelope e requisitos válidos: a meta é autorizada sem votação; atendimento cresce depois da implantação.
2. P2 pede expansão além da autorização: surge proposta orçamentária. Se rejeitada, a execução anterior continua; nenhuma expansão é cobrada.
3. P3 recebe autorização, mas uma parceria necessária está pendente: o efeito adicional aguarda implantação, sem presumir comando federal sobre outro ente.
4. Redução conflita com um compromisso declarado: o jogo explica o impedimento e não aplica a mudança; sem conflito, a capacidade degrada conforme parâmetros próprios.
5. Uma proposta popular é rejeitada: opinião e autorização continuam distintas, com causas visíveis.

## Conclusão e próximos passos

SG050 entrega fontes primárias e processos explícitos para as três políticas, com competências, dependências e simplificações separadas. Não entrega estimativas de impacto nem uma simulação institucional completa.

SG051 definirá variáveis e perfis; SG052 justificará consequências; SG053 parametrizará o recorte. SG054 escreverá o conteúdo compatível com os contratos disponíveis e registrará os requisitos de integração pendentes. SG057–SG060 implementarão calendário, autorizações, conflitos e finanças sem fingir que o protótipo já os possui.
