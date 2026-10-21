# Desenho proposto: ciclo de segurança, justiça e custódia

> **Status: VIGENTE.** Proposta de etapa 0 do V1-14, 21/out/2026; não aprovada
> para código. O autor precisa escolher/aprovar uma opção antes de
> implementar estados novos no motor, conforme `docs/v1/engenharia.md`.
> Auditoria de base: [`../../conteudo/auditoria-seguranca-mecanismos.md`](../../conteudo/auditoria-seguranca-mecanismos.md).

## Problema

As 27 leis de Segurança dão ao jogador decisões concretas, mas o motor atual
liga diretamente muitas opções a índices finais. Não representa o caminho
operacional que torna essas escolhas interdependentes: casos que chegam e são
esclarecidos, capacidade de julgamento, entradas e saídas de custódia, vagas
operacionais e atendimento prisional. `lotacao_prisional` funciona como índice
de saída; não é a população dividida por um estoque explícito de vagas.

O objetivo do desenho é que a resposta a um problema de segurança crie uma
próxima escolha visível sobre prevenção, investigação, justiça, custódia,
proteção e orçamento. O motor deve continuar genérico; os nomes das leis e
regras jurídicas ficam no jogo/conteúdo, como exige D-03.

## Opções consideradas

| Opção | Modelo | Vantagens | Limites |
| --- | --- | --- | --- |
| A. Índices com conexões diretas | Manter o modelo atual e revisar os coeficientes por lei. | Menor custo e compatibilidade imediata. | Não fecha o ciclo; repete os problemas já vistos: capacidade e fluxos viram bônus em índices. Rejeitada como solução final. |
| B. Estoques agregados e fluxos por turno | Criar estados genéricos para casos em fila, capacidade de julgamento, população custodiada, vagas operacionais e capacidade de atendimento. Leis/ações mudam fluxos, capacidade, prazos e custos. | Fecha um ciclo legível, mantém implementação agregada e permite escolhas repetidas sem criar um minijogo para cada lei. **Recomendação.** | Exige desenhar esquema e integração com o motor; elasticidades ainda são hipóteses e precisam de cenários/playtest. |
| C. Modelo por estado/território | Repetir estoques e fluxos para UFs, com capacidade e demanda locais. | Torna federativismo e deslocamento territorial mais concretos. | Dados mais pesados, mais estado, balanceamento e custo de contexto; prematuro para a primeira prova. Guardar para expansão posterior. |

## Escolha recomendada

Implementar a **Opção B**, em agregado nacional para a primeira versão. Manter
comando federativo, organização policial e limites constitucionais como leis
que habilitam ou restringem as escolhas. Não transformar cada lei em tela ou
minijogo próprio.

## Mecanismo e decisões

1. **Prevenir/responder:** escolher patrulha reativa, pontos críticos, gestão
   por dados ou dissuasão focada com serviço. Definir limites de vigilância e
   organização da força. A restrição é orçamento e efetivo disponível; saídas
   são ocorrências, danos, confiança e casos para investigar.
2. **Investigar/esclarecer:** dividir recursos entre polícias estaduais,
   Polícia Federal e inteligência; escolher poderes, escutas e salvaguardas.
   A restrição é orçamento, casos na fila e direitos. A saída é número de casos
   esclarecidos, com atraso e retorno marginal decrescente como hipótese.
3. **Julgar/decidir a entrada:** capacidade judicial define quantos casos
   avançam por turno. Audiência de custódia, alternativas e garantias mudam
   elegibilidade e destinos de casos. O estoque de processos pendentes cria
   pressão no turno seguinte.
4. **Custodiar/liberar:** pena, progressão e alternativas alteram entradas e
   duração; investimento e gestão alteram vagas operacionais, condições e
   manutenção. Lotação sai da razão entre pessoas custodiadas e vagas.
5. **Proteger/reintegrar:** atendimento de saúde, educação, trabalho e proteção
   às vítimas usam equipes e orçamento. A reincidência retorna à demanda de
   prevenção e investigação; o jogador pode mudar prioridades para recuperar.

```text
ocorrências → investigação → casos esclarecidos → fila judicial → decisões
                                      ↓                         ↓
                           orçamento/capacidade       entradas e saídas
                                                                ↓
 vagas construídas e mantidas → capacidade operacional ← população custodiada
                                       ↓                        ↓
                                      lotação → condições, saúde e reintegração
                                                      ↓              ↓
                                             proteção/recuperação   reincidência
                                                      └─────→ ocorrências futuras
```

As leis seguem separadas quando a autoridade é distinta: comando estadual não
é coordenação; orçamento federal não é fundo estadual; natureza da polícia não
é método de patrulha; audiência/alternativa pré-julgamento não é progressão
após condenação; vagas não são gestão. A matriz de 27 leis e suas decisões fica
no relatório de auditoria.

## Fórmulas candidatas (hipóteses do jogo)

As relações abaixo definem a estrutura, não coeficientes reais:

```text
casos_pendentes[t+1] = max(0, casos_pendentes[t] + casos_novos[t] - casos_resolvidos[t])
casos_resolvidos[t] = min(casos_pendentes[t] + casos_novos[t], capacidade_judicial[t])

populacao_custodiada[t+1] = max(0, populacao_custodiada[t] + entradas[t] - saidas[t])
vagas_operacionais[t+1] = max(0, vagas_operacionais[t] + vagas_entregues[t] - vagas_desativadas[t])
lotacao[t] = 100 * populacao_custodiada[t] / max(vagas_operacionais[t], vagas_minimas_de_calculo)

atendidos[t] = min(populacao_elegivel[t], capacidade_de_atendimento[t])
reincidencia_futura = funcao(atendimento, educacao, trabalho, condicoes, tempo)
```

`vagas_entregues` vem de investimento com prazo de obra; `capacidade_judicial`
e `capacidade_de_atendimento` vêm de ações/orçamentos com implantação; `casos
novos` recebe influência de ocorrências e esclarecimentos; `entradas` e `saídas`
dependem da lei e dos fluxos judiciais. A função de reincidência não recebe
coeficiente antes de definir unidade, população elegível e base empírica.

O primeiro ciclo não usará capacidade nacional única para afirmar que todos
os territórios têm acesso igual. Limites jurídicos impedem decisões
inconstitucionais; desrespeito pode ser representado por opções de exceção já
existentes e seus custos institucionais, sem tornar direitos um recurso
comprável.

## Fontes e dados reais

- **SISDEPEN/SENAPPEN:** coleta semestral e bases abertas com população,
  capacidade, movimentação, gestão, serviços, equipes, saúde, educação e
  trabalho. A base mais recente localizada nesta pesquisa é o 19º ciclo,
  jul–dez/2025. O relatório informa déficit de 222.034 vagas em celas físicas
  na data de referência; esse total é contexto e não coeficiente de resposta do
  jogo. [Relatórios SISDEPEN](https://www.gov.br/senappen/pt-br/servicos/sisdepen/relatorios),
  [base aberta](https://www.gov.br/senappen/pt-br/servicos/sisdepen/bases-de-dados),
  [19º ciclo](https://www.gov.br/senappen/pt-br/servicos/sisdepen/relatorios/relatorios-de-informacoes-penitenciarias/relatorio-do-2o-semestre-de-2025.pdf/@@download/file).
- **Movimentação prisional:** a nota técnica do SISDEPEN define entradas
  originárias e saídas efetivas, permitindo separar fluxo de transferência de
  admissão/saída do sistema. [Nota técnica SISDEPEN](https://www.gov.br/senappen/pt-br/servicos/sisdepen/manuais-e-apostilas/nota-tecnica-sisdepen).
- **Justiça:** o CNJ mede casos novos, pendentes, baixados, congestionamento e
  tempos por fase/processo. O *Justiça em Números 2025* usa ano-base 2024 e
  oferece uma referência para conhecimento criminal e execução penal; não
  converter taxa de congestionamento diretamente em capacidade causal.
  [CNJ, Justiça em Números 2025](https://www.cnj.jus.br/wp-content/uploads/2025/09/justica-em-numeros-2025.pdf).
- **Saúde prisional:** a PNAISP integra serviços prisionais à Rede de Atenção à
  Saúde; há obstáculos de acesso decorrentes do confinamento. Usar cobertura,
  equipe e atendimento como estados próprios quando houver série e unidade
  verificadas, não expectativa de vida nacional.
  [Ministério da Saúde, Saúde Prisional/PNAISP](https://www.gov.br/saude/pt-br/composicao/saps/pnaisp),
  [monitoramento e avaliação](https://www.gov.br/saude/pt-br/composicao/saps/pnaisp/monitoramento-e-avaliacao).

As fontes têm periodicidade anual ou semestral, enquanto a partida é trimestral.
O cenário inicial deve guardar valor, unidade, período e cobertura da fonte.
Séries trimestrais interpoladas serão identificadas como hipótese de jogo; não
serão apresentadas como observação oficial.

## Como validar

### Testes automatizados do mecanismo

1. Casos pendentes não ficam negativos; resolvidos nunca excedem demanda nem
   capacidade disponível.
2. Pessoas custodiadas evoluem exatamente por entradas menos saídas; transferir
   entre unidades não muda o total nacional.
3. Vaga financiada só entra no estoque depois do prazo; manutenção insuficiente
   pode reduzir vagas operacionais. Mais vaga alivia lotação apenas se a
   população não crescer mais rápido.
4. Alternativa pré-julgamento reduz só admissões elegíveis; progressão reduz
   permanência após sentença. Combinadas, não contabilizam a mesma pessoa duas
   vezes.
5. Capacidade e orçamento limitados tornam escolhas concorrentes; ampliar uma
   prioridade reduz a margem disponível para outras.
6. Uma rota de referência parada por 16 turnos não explode nem produz estado
   inválido; cenários com choque permitem recuperação por mais de uma estratégia.
7. O diário do jogo explica a causa, o atraso e o caminho até o próximo gargalo.

### Partida demonstrativa a reproduzir após protótipo

Semente fixa, sem ocorrências aleatórias; comparar referência e duas rotas que
cruzem as leis de todos os lotes. Registrar turnos 0, 1, 4, 8 e 16. Uma rota
prioriza resposta rápida e investigação; outra combina prevenção, supervisão,
alternativas elegíveis e reintegração. No turno 4 ocorre aumento de casos; no
turno 8 a fila judicial ou a lotação torna-se gargalo; no turno 16 cada rota
deve demonstrar resultado distinto e pelo menos uma resposta de recuperação.
Os números serão obtidos do protótipo, não preenchidos como previsão inventada.

### Playtest humano

Sem a tela de explicação, a pessoa deve conseguir responder: qual gargalo está
limitando a segurança? quais duas ações são viáveis? qual resultado chega
primeiro e qual demora? o que pode ser feito para recuperar? Se não conseguir,
o mecanismo falha o teste de feedback mesmo que passe as fórmulas.

## Decisão necessária antes do código

**Recomendação:** aprovar a Opção B, incluindo os cinco estados agregados e as
regras estruturais acima. Valores e elasticidades ficam para calibração e
playtest, não para completar a especificação por palpite. Após aprovação,
separar o trabalho em: (1) contrato e migração do esquema; (2) fluxo de casos e
capacidade judicial; (3) população prisional e vagas; (4) saúde/reintegração e
retorno da reincidência; (5) integração das leis, partidas e cobertura. Cada
etapa terá testes focais próprios e manterá o jogo inicial carregável.
