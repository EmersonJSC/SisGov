# SG049 — Recorte do primeiro cenário

**Estado:** Concluído — definição de escopo documental.  
**Data:** 3 de outubro de 2026.  
**Base:** continuidade do exemplo de Saúde e Segurança e da regra aprovada do mapa de influência.

As escolhas abaixo são decisões de design para o primeiro cenário de validação. Não são dados observados, estimativas causais verificadas ou regras institucionais brasileiras já pesquisadas. Fontes, competências, unidades e parâmetros serão detalhados em SG050–SG053. Este chamado não implementa o cenário nem o ciclo eleitoral.

## Experiência que vamos demonstrar

O jogador conduz um partido na Presidência de um Brasil simplificado e herdado: serviços já funcionam, políticas já recebem recursos e a população já enfrenta problemas. O recorte acompanha a capacidade de atendimento de saúde e a segurança cotidiana, com atenção à proteção de mulheres.

A pergunta jogável é: como distribuir recursos entre atendimento de saúde, proteção às mulheres e prevenção da violência, sabendo que os resultados demoram e que parcelas da população têm necessidades diferentes?

O país permanece independente do motor. Ministérios, políticas, condições iniciais e relações pertencem ao conteúdo do cenário. Três políticas e dez variáveis são um limite de trabalho deste exemplo, não um limite do motor ou do mapa.

## Três políticas públicas

| ID de design | Política                                                     | Decisão do jogador                                                  | Esfera visual inicial                            |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------ |
| P1           | Reforço da atenção básica em saúde                           | Ajustar os recursos destinados à capacidade de atendimento          | Saúde                                            |
| P2           | Rede de atendimento e proteção às mulheres                   | Ajustar os recursos destinados a equipes, acolhimento e atendimento | Justiça e Segurança, como agrupamento provisório |
| P3           | Programa de prevenção da violência e cooperação em segurança | Ajustar os recursos destinados às ações de prevenção e cooperação   | Justiça e Segurança                              |

Os três são serviços ou programas com alavanca de recursos. Não haverá controle direto de saúde, crime ou proteção. O nível de serviço efetivamente implantado é consequência da decisão e de sua evolução temporal.

P2 não significa editar a Lei Maria da Penha por porcentagem: o jogador ajusta a execução de um programa de atendimento e proteção. A lei é referência institucional a pesquisar. SG050 deverá verificar atribuições federais, participação de outros entes, autorização e responsabilidade ministerial das três políticas. A esfera visual não concede ao Presidente controle direto sobre serviços estaduais ou municipais.

**Atualização SG050 (3 de outubro de 2026):** a pesquisa de competências substitui o agrupamento provisório de P2 por Ministério das Mulheres, articulado com Saúde e Justiça e Segurança. As três decisões representam esforço financeiro federal e seguem os [processos de autorização documentados](sg050-decisoes-e-autorizacoes.md). A tabela acima preserva o recorte inicial para rastreabilidade.

## Dez variáveis de domínio

| ID de design | Variável                                          | Papel                                                        |
| ------------ | ------------------------------------------------- | ------------------------------------------------------------ |
| V1           | Recursos para atenção básica                      | Entrada de política P1                                       |
| V2           | Recursos para atendimento e proteção às mulheres  | Entrada de política P2                                       |
| V3           | Recursos para prevenção e cooperação em segurança | Entrada de política P3                                       |
| V4           | Acesso efetivo à saúde                            | Indicador de atendimento                                     |
| V5           | Saúde da população                                | Indicador de resultado                                       |
| V6           | Pressão sobre o atendimento hospitalar            | Indicador de demanda sobre a capacidade                      |
| V7           | Violência                                         | Indicador de resultado em segurança                          |
| V8           | Proteção efetiva às mulheres                      | Indicador de resultado de proteção                           |
| V9           | Despesa recorrente das três políticas             | Resultado financeiro do recorte                              |
| V10          | Saldo orçamentário do recorte                     | Receita disponível menos despesa, com base herdada declarada |

V1–V3 serão monetárias; moeda, escala, período e conversão em implantação serão definidos depois. V4–V8 terão unidades e fontes avaliadas em SG051, sem assumir que tudo seja percentual. V9–V10 representam somente o orçamento deste recorte; não pretendem reproduzir todas as contas públicas. Sua integração contábil ocorre em SG060, evitando cobrar novamente pelo grafo o mesmo gasto.

Estados de implantação, metas, memórias temporais, situações, opinião dos perfis e estado eleitoral são estruturas auxiliares. Não são novos indicadores de domínio escondidos nesta contagem.

## Um evento e uma situação de referência

**Evento:** aumento temporário da demanda por atendimento de saúde. Ele produz pressão adicional por duração finita, a definir em SG052–SG053. Serve para testar a reação de uma rede já existente a uma ocorrência; não é um diagnóstico epidemiológico nem exige simular uma doença específica.

**Situação:** sobrecarga do atendimento. Possui condições próprias de entrada e saída e persiste enquanto suas causas a sustentam. O evento pode acabar antes de a situação ser resolvida. Os limites demonstrativos do protótipo não são automaticamente adotados pelo cenário validado.

## Dois perfis populacionais com interesses combinados

As parcelas abaixo são agregações artificiais para verificar o sistema. Não representam duas classes homogêneas reais nem pressupõem voto igual entre pessoas com o mesmo interesse.

| Perfil                                                                                     | Interesses combinados para o teste                                           | Sensibilidade a demonstrar                                                    |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| A — Famílias com maior dependência da rede pública                                         | Saúde, cuidado de dependentes, segurança cotidiana e renda disponível        | Maior sensibilidade à perda de acesso ao atendimento e de proteção            |
| B — Famílias com menor dependência da rede pública e forte exposição econômica à violência | Segurança cotidiana, trabalho ou pequenos negócios, saúde e renda disponível | Maior sensibilidade à violência que afeta deslocamentos e atividade econômica |

São parcelas mutuamente exclusivas e exaustivas da população modelada. Seus pesos serão definidos em SG051 e devem somar 100%; interesses sobrepostos não somam pessoas novamente. Ambos se importam com saúde e segurança, com sensibilidades distintas a justificar. Nenhum perfil determina partido ou voto automaticamente.

Opinião sobre uma medida, aprovação geral do governo e futura aprovação de um ministro permanecem estados diferentes. O cálculo eleitoral completo pertence à Fase 7.

## Relações que o cenário deverá investigar

SG052 deverá selecionar cinco a oito relações diretas, com direção, atraso, hipótese ou fonte e incerteza. As candidatas iniciais são:

- P1 para acesso à saúde; acesso para saúde da população e pressão hospitalar.
- P2 para proteção efetiva às mulheres; proteção para violência.
- P3 para violência; violência para pressão hospitalar.
- Evento para pressão hospitalar.

São hipóteses de modelagem a investigar, sem coeficientes aprovados. A ligação de violência com pressão hospitalar demonstra influência entre Segurança e Saúde. Efeitos indiretos não devem ser repetidos como relações diretas sem justificativa independente. Custos e opiniões serão tratados nos contratos próprios, sem confundi-los com essas oito candidatas numéricas.

A contagem poderá ser reduzida se as fontes ou mecanismos não sustentarem uma candidata. A distribuição espacial segue o mapa de influência: políticas dentro dos ministérios, indicadores e situações fora, próximos de suas causas relevantes.

## Tempo, país herdado e mandato curto

A partida inicia com recursos comprometidos, níveis de implantação e valores de indicadores coerentes entre si. Nenhuma das três políticas começa obrigatoriamente em zero. Importar o cenário não deve cobrar novamente custos únicos ou reaplicar efeitos herdados.

A decisão muda uma meta. A implantação ou degradação aproxima o serviço dessa meta; os resultados podem ter atraso adicional. Redução de recursos não encerra instantaneamente a capacidade existente. Não equiparar quantidade de denúncias à quantidade de violência: denúncias exigiriam uma variável e relações próprias, fora deste primeiro recorte.

O roteiro deverá caber em um mandato de teste curto: observar a base, alterar uma política, acompanhar resposta gradual, enfrentar o evento e chegar à avaliação eleitoral. SG053 deverá propor tempos que permitam observar essas trajetórias; SG057 definirá duração do turno, passos, calendário e apuração. Não fixamos aqui semanas por turno ou encurtamos um mandato brasileiro como se fosse regra real.

Na integração da Fase 7, uma vitória inicia outro mandato preservando indicadores, políticas implantadas, metas, situações e efeitos em andamento. Derrota encerra a partida conforme o plano. Continuidade é requisito de conteúdo e estado desde agora, mas ainda não é uma funcionalidade entregue por SG049.

## Roteiros de aceitação a preparar

1. Manter recursos: observar uma base herdada coerente, sem saltos causados pela inicialização.
2. Aumentar P1: acompanhar implantação antes do resultado de atendimento e comparar custo e resposta social.
3. Reduzir P2: observar perda gradual de capacidade e resultado posterior, preservando a diferença entre decisão e consequência.
4. Alterar P3: observar segurança e investigar sua repercussão sobre a demanda por saúde.
5. Aplicar o evento: distinguir ocorrência temporária de situação persistente.
6. Na Fase 7, atravessar uma vitória sem reiniciar o país e verificar derrota separadamente.

## Limites e próximos chamados

O protótipo `brasil-basico` continua como demonstração visual e técnica. Não remover suas políticas extras nem substituir seus dados por este recorte antes de SG054. Os valores atuais não são evidência para calibrar o cenário.

- **SG050:** pesquisar decisões, competências e autorizações das três políticas.
- **SG051:** definir unidades, valores herdados e pesos dos dois perfis.
- **SG052:** justificar as relações selecionadas e os efeitos sociais distintos.
- **SG053:** definir parâmetros, implantação, degradação e atrasos.
- **SG054:** escrever o pacote do recorte em JSON.
- **SG055–SG056:** comparar trajetórias e revisar fontes, hipóteses e limitações.

SG049 está concluído como seleção documentada do recorte: tema, três políticas, dez variáveis, um evento, dois perfis e requisito de continuidade estão identificados. As pendências acima pertencem aos chamados seguintes, sem alegação de pesquisa ou implementação já concluída.
