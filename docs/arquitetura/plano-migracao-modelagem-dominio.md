# Plano de migração para modelagem de domínio

**Status:** direção de migração, alinhada ao recorte jogável

**Data:** consolidado em 7 de outubro de 2026

**Referência:** [Modelagem do domínio](modelagem-do-dominio.md)

## Objetivo

Reorganizar o SisGov por responsabilidades de domínio sem interromper o motor,
os cenários, os testes ou o laboratório visual. A migração não é uma troca de
nomes de pastas: cada fase cria uma fronteira clara, um contrato pequeno e testes
que protegem o comportamento atual.

O destino é separar:

```text
definição do cenário → regras e dados que podem existir
estado da partida    → fatos e valores de uma partida específica
simulação            → cálculo numérico e temporal genérico
jogo                 → propostas, autorização, implantação e turno
interface            → intenção da pessoa jogadora e apresentação
```

## Regras da migração

1. **Não alterar resultado por reorganização.** Uma extração não muda a
   semântica de um turno; qualquer mudança de regra tem chamado e teste próprios.
2. **Definição não é estado.** JSONs descrevem o cenário; a partida guarda
   aprovação, implantação, dívida e ocorrências.
3. **O motor não conhece política institucional.** Ele não sabe partido,
   Senado, eleições ou componentes React.
4. **A interface não decide regra.** Ela chama casos de uso e apresenta o estado
   e as explicações retornadas.
5. **Sem migração em massa.** Um módulo só muda de lugar quando sua fronteira,
   importações e testes estiverem compreendidos.
6. **Compatibilidade primeiro.** As entradas públicas atuais recebem adaptadores
   ou são migradas junto com seus consumidores; não deixar código duplicado como
   solução permanente.
7. **Escopo do jogo antes das pastas.** A primeira integração inclui Senado com
   renovação parcial, voto com acaso controlado, tramitação curta e fiscal mínimo.
   Inflação, rating, crise fiscal e bancos não são exigências da migração.

## Correspondência com o plano de produção

As fases abaixo descrevem fronteiras arquiteturais, não um segundo catálogo de
trabalho. As dependências vigentes são as de SG097–SG099 e SG057–SG061 no
[plano de produção](../plano-de-producao.md). SG097 tem inventário registrado;
o escopo de domínio de SG098 tem testes focados; SG099 tem a fábrica básica
implementada, mas falta integrar as leis eleitorais constitucionais herdadas.
SG061 aguarda essa integração e os demais contratos políticos e fiscais. Não
reiniciar a Fase A nem exigir uma mudança de diretórios antes de integrar o jogo.

## Diagnóstico inicial

| Área atual              | Situação                                                  | Direção                                                        |
| ----------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `src/engine`            | Núcleo genérico: validação, grafo, execução e mecanismos. | Evolui para `src/simulation`.                                  |
| `src/scenarios`         | Pacotes JSON, carregador e dados de demonstração.         | Permanece como conteúdo; contratos vão para `domain/scenario`. |
| `src/game`              | Laboratório de turno e diário; hoje coordena motor.       | Torna-se o domínio de partida e seus casos de uso.             |
| `src/ui` e `main.tsx`   | Interface do mapa e apresentação.                         | Passa a depender de casos de uso, não do motor diretamente.    |
| `src/types/scenario.ts` | Tipos de apresentação de cenário antigo.                  | Avaliar uso e mover/remover após inventário.                   |
| `src/tests`             | Testes por mecanismo e fluxo técnico.                     | Ganham testes de domínio e de caso de uso.                     |

## Mapa de entidades

### Definições do cenário

São imutáveis durante uma partida:

- `ScenarioDefinition` / cenário;
- `PolicyDefinition` / política definida;
- `VariableDefinition` e `ConsequenceDefinition`;
- `OccurrenceDefinition` para evento, situação e dilema;
- `SocialProfileDefinition`;
- regras de autorização, finanças e eleição quando forem especificadas.

### Estado da partida

É específico de uma execução:

- `GameState` / partida;
- `GovernmentState`, `MandateState`, `SenateState` e `PartyState`;
- `PolicyState` para uma política vigente;
- `ProposalState` para uma proposta em tramitação;
- `FiscalState`, `PublicOpinionState` e `PopulationState`;
- calendário absoluto, vencimento das cadeiras senatoriais, prazos de propostas
  e versão/semente/estado do gerador de sorteios;
- ocorrências ativas, já ocorridas e dilemas pendentes;
- `EngineExecution`, já existente, como estado técnico da simulação.

No estado fiscal, separar dívida inicial, emissões acumuladas, fluxo de juros
herdado e taxa fixa da dívida nova. A regra fiscal é a fonte de caixa e dívida;
o grafo recebe os valores necessários, sem manter uma contabilidade concorrente.

### Serviços e casos de uso

Não são entidades; coordenam regras entre estados:

- `createGame` — cria partida a partir de um cenário e estado herdado;
- `proposePolicy` — cria proposta sem modificar implantação;
- `voteProposal` — autoriza ou rejeita uma proposta;
- `advanceImplementation` — aproxima a implantação do nível autorizado;
- `advanceTurn` — aplica a ordem de turno completa;
- `saveGame` e `restoreGame` — serializam e validam a partida.

## Fases do plano

### Fase A — Linguagem comum e fronteiras

**Objetivo:** estabilizar os nomes antes de criar novos tipos ou pastas.

Entregas:

1. Manter e revisar o glossário em `modelagem-do-dominio.md`.
2. Produzir um inventário de módulos, seus consumidores e dependências
   proibidas.
3. Especificar `Partida`, `Proposta` e `PolíticaVigente`, incluindo
   identidade, campos mínimos, estados válidos e transições.
4. Decidir quais nomes atuais permanecem compatíveis e quais serão substituídos.

Aceite:

- “política definida”, “proposta” e “política vigente” não são sinônimos;
- cada dado mutável tem dono definido;
- não há decisão de estrutura baseada apenas em preferência de pasta.

### Fase B — Contratos de cenário e partida

**Objetivo:** separar formalmente conteúdo imutável de estado mutável, sem
alterar o motor existente.

Entregas:

1. Criar contratos em `src/domain/scenario` para a visão de domínio do pacote.
2. Criar contratos em `src/domain/game` para `GameState`, `PolicyState` e
   `ProposalState`.
3. Criar conversores explícitos entre o pacote resolvido atual e as definições
   de domínio, evitando cópias ambíguas.
4. Criar uma fábrica `createGame` que una cenário validado e estado herdado.

Aceite:

- duas partidas do mesmo cenário não compartilham estado;
- alterar implantação ou proposta não altera arquivos/definições do cenário;
- a criação de partida é testável sem React.

### Fase C — Proposta, autorização e política vigente

**Objetivo:** tornar explícito o ciclo da decisão política antes de integrar
Senado real, orçamento completo ou eleições.

Estados mínimos da proposta:

```text
rascunho → apresentada → em_votacao → aprovada | rejeitada | retirada
                                           ↓
                              cria ou altera PolíticaVigente
                                           ↓
                                     implantação progride
```

Entregas:

1. Casos de uso `proposePolicy`, `submitProposal`, `voteProposal` e
   `withdrawProposal`.
2. Regra de que rejeição não cria nem modifica `PolicyState`.
3. Regra de que aprovação cria ou altera uma `PolicyState`, mas não equivale a
   implantação imediata.
4. Adaptador temporário para o laboratório atual tratar suas metas como
   políticas previamente autorizadas.
5. Separar opções da decisão e valores de implantação; admitir uma lei aprovada
   com execução parcial quando prevista. Distinguir revogação jurídica de redução
   de execução e de dissipação de efeitos, com condição explícita de encerramento.
6. Registrar prazo absoluto e único adiamento de proposta; o normal é votar no
   próximo fechamento, com limite de dois turnos. A regra que decide adiamento
   e voto entra em SG058-B, não deve ser inventada pela função de transição.

Aceite:

- transições inválidas retornam erro explicável;
- uma proposta tem histórico próprio;
- aprovação, nível desejado e nível implantado são observáveis separadamente.
- uma proposta pendente preserva a política anterior; rotas executivas já
  autorizadas não são forçadas a passar por votação parlamentar.
- transição de mandato não reinicia prazo e não permite um segundo adiamento.

### Fase D — Contratos fiscal, social e político

**Objetivo:** implementar regras sobre a fundação de domínio antes da integração
completa, conforme SG057-A/B, SG058-A/B, SG059 e SG060-A/B.

SG057-A fecha a ordem mensal/trimestral sem depender da implementação fiscal.
Sobre ele, contabilidade e contrato político podem ser testados separadamente:

1. Fiscal mínimo: receitas, despesas, caixa, dívida, emissão automática e juros
   da dívida nova à taxa fixa, com início no mês seguinte e fluxo herdado separado.
2. Sociedade: perfis, benefícios e custos percebidos, incluindo desgaste gradual
   pelo peso dos juros, com causas próprias e sem dupla contagem.
3. Instituições: votação com acaso controlado, tramitação limitada, Presidência
   em turno único e Senado com renovação duas/uma vaga por UF a cada quatro anos.
4. Ocorrências: integrar eventos, situações e dilemas existentes à partida.

Cada módulo recebe contrato e testes antes de ser coordenado pelo turno.
Aleatoriedade tem estado da partida, nunca um sorteio global oculto. Testes
controlam sementes e verificam tanto continuidade quanto variação de resultados.
SG058-C/D e SG060-C permanecem evoluções e não bloqueiam esta fase.

Aceite: déficit válido, contabilidade única, população sem dupla contagem,
cadeiras não vencidas preservadas, limite de tramitação e falhas reproduzíveis.

### Fase E — Ordem de turno e integração com a simulação

**Objetivo:** fazer a camada de jogo coordenar o motor sem incorporar fórmulas
numéricas do motor.

Depende dos contratos e implementações anteriores; corresponde à integração
SG061–SG064. Segue a ordem do plano de produção, não uma variante própria:

```text
validar escolhas
→ registrar propostas e validar autorizações executivas
→ repetir três meses: implantação → motor → contas → ocorrências
→ resolver tramitação e votar propostas elegíveis no fechamento
→ resolver eleições quando devidas, conforme precedência de SG057-B2
→ confirmar partida, estado dos sorteios e diário
```

Entregas:

1. Caso de uso `advanceTurn` atômico.
2. Tradução de `PolicyState` para comandos já aceitos por `engine`.
3. Diário de turno como resultado da partida, separado da UI.
4. Testes de continuidade, falha atômica e explicações de efeitos.

Aceite:

- uma falha mantém a partida anterior intacta;
- o motor continua utilizável sem o módulo `game`;
- a UI não chama `advanceExecution` diretamente;
- aprovações do fechamento só orientam implantação no trimestre seguinte;
- retentativa não muda o sorteio; restauração preserva prazos, juros e mandatos;
- coincidência entre votação e eleição segue o contrato de precedência sem
  ultrapassar o prazo de dois turnos.

### Fase F — Migração física e limpeza

**Objetivo:** refletir no código as fronteiras já comprovadas.

Entregas:

1. Mover `src/engine` para `src/simulation` em uma mudança mecânica, após
   adaptar todas as importações e manter testes verdes.
2. Separar `src/game` em `domain/game` e `application`, conforme a diferença
   entre regra e orquestração ficar concreta.
3. Remover adaptadores temporários, tipos duplicados e imports antigos.
4. Atualizar README, documentação arquitetural e mapa de dependências.

Aceite:

- não existem imports de UI para domínio ou simulação;
- não existem imports de simulação para UI ou jogo institucional;
- não há dois contratos concorrentes para a mesma entidade.

## Organização-alvo

```text
src/
├── domain/
│   ├── scenario/       # definições estáveis e linguagem do conteúdo
│   ├── game/           # partida, proposta e política vigente
│   ├── fiscal/         # estado e regras financeiras
│   ├── politics/       # partido, governo, Senado e eleição
│   └── society/        # perfis e opinião pública
├── simulation/         # cálculo numérico, grafo e execução
├── application/        # casos de uso e coordenação do turno
├── scenarios/          # JSONs e carregamento de conteúdo distribuído
├── ui/                 # React e estado estritamente visual
└── tests/
```

`domain` não depende de React. `simulation` não depende de `domain/game`,
`politics`, `fiscal` ou `ui`. `application` pode depender de domínio e
simulação. `ui` pode depender de `application`, mas não deve coordenar regras.

## Próxima execução recomendada

Revisar SG098 conforme as lacunas registradas e então criar a partida de SG099,
aproveitando o inventário SG097. A fábrica começa com os contratos disponíveis;
extensões de conteúdo para política e finanças entram com SG057/SG060.
Não mover pastas como pré-requisito, refazer o motor ou implementar regras ainda
sem contrato. O foco é viabilizar o ciclo jogável com a fundação existente.
