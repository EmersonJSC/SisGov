# PLANO — SisGov

**Versão:** 1.0 · 9 de outubro de 2026
**Substitui:** `docs/plano-de-producao.md` como documento mestre de execução. O
plano antigo fica como **registro histórico** dos chamados SG001–SG099; não é
mais atualizado.
**Base:** auditoria da Fase 1 e modelo de domínio da Fase 2, ambos aprovados
nesta data. Os status foram conferidos por leitura do código local e do histórico
git (`origin/main` = `414047c`). **Os testes não foram executados durante a
auditoria**; o chamado SG100 faz essa verificação antes de qualquer outra coisa.

---

## 1. Visão em uma página

O SisGov é um jogo de simulação política no qual o jogador é um partido na
Presidência. O MVP prova **um ciclo de governo completo e contínuo** com o Brasil
carregado de JSON:

```text
país herdado → propor política → votação no Senado → implantação gradual
→ efeitos no país e nas finanças → reação dos grupos sociais
→ eleição (Presidência + Senado por UF) → novo mandato ou derrota → salvar/restaurar
```

…apresentado no **mapa de influência** com presidente, vice e ministros
visuais, esferas ministeriais, leis e situações.

**Princípios inegociáveis**

1. **Motor independente.** `src/engine` trabalha só com variáveis, relações e
   mecanismos. Não conhece nomes de leis, partidos, países ou cargos.
2. **Regras no JSON.** Quantidades, quóruns, fórmulas eleitorais selecionadas,
   pesos e parâmetros vêm do conteúdo. Mecanismo matemático novo = código + teste.
3. **Jogo separado da interface.** A UI envia intenções e apresenta o estado;
   nunca recalcula regras nem muta a partida.
4. **Cada chamado entrega algo funcional e testável.** Nenhum chamado é só
   documentação ou refatoração sem resultado observável.
5. **Reaproveitar antes de criar.** O código existente é a base; reescrever
   exige motivo registrado.

---

## 2. Onde estamos — quatro categorias

### 2.1 Já existe e funciona (concluído — não refazer)

| Área | O que existe | Evidência | IDs antigos |
|---|---|---|---|
| Base de produção | CI, lint, formatação, fluxo de branches | `.github/workflows/ci.yml` | SG001–008 |
| Motor numérico | Validação JSON, grafo, mecanismos (afim, soma, estoque, condição, resposta gradual), atrasos, duração, explicações | `src/engine/**` + testes | SG009–032 |
| Tempo e restauração do motor | Histórico limitado, exportar/restaurar execução, situações, eventos, dilemas | `engine/runtime/*` | SG033–040 |
| Bancada técnica | Laboratório com avanço, inspeção de causas, comparação | `motor-demo.html`, `motorDemo.ts` | SG041–048 |
| Cenário Brasil inicial | 5 políticas, variáveis, consequências, evento, situação | `src/scenarios/brasil-primeiro-cenario/` | SG049–056 |
| Domínio de proposta e política vigente | Estados da proposta, política vigente (execução × jurídico), revogação, prazo e adiamento | `src/domain/game/*` | SG097–098 |
| Criação da partida | `createGame` com leis eleitorais iniciais | `src/game/createGame.ts` | SG099 |
| Tempo trimestral/mensal | 3 passos mensais por turno, conversão de conteúdo | `advanceQuarterlyLaboratoryTurn`, `prepareMonthlyContent` | SG057-A, FIX-V1-02/04 |
| Contratos documentais | Pesquisa eleitoral e contrato político | `docs/producao/sg057-b1…`, `sg057-b2…` | SG057-B1/B2 |

### 2.2 Existe, mas precisa ser verificado ou corrigido

Código feito pelo GPT, **sem commit**, parado no meio de um loop. É base a
revisar, não entrega aceita.

| # | Problema | Onde | Corrigido em |
|---|---|---|---|
| C1 | ~40 arquivos sem commit e sem verificação | `src/game/*`, `src/domain/fiscal/*`, testes | SG100 |
| C2 | `politicalPath.test.ts` força sorteios = 1, implantação manual e jogador = vencedor | `src/tests/politicalPath.test.ts` | SG100 (marcar), SG119 (substituir) |
| C3 | Senado guardado como total nacional por partido, sem UF nem vencimento | `createGame.ts`, `commitSenateElection.ts` | SG110 |
| C4 | Regras de nível da política (domínio) escritas no teste, não lidas do JSON | `politicalPath.test.ts` | SG102 |
| C5 | Brasil sem ficha fiscal: o fiscal nunca roda no cenário real | `estado-inicial.json` | SG103 |
| C6 | `prepareGameQuarter` recebe os estados mensais das políticas prontos de quem chama; a implantação mensal não é calculada pela partida | `prepareGameQuarter.ts` | SG104 |
| C7 | Prazo de tramitação usa `defaultProposalTiming` fixo no código, não o conteúdo | `prepareGameQuarter.ts` | SG114 |
| C8 | Ocorrências (situação, evento, dilema) não estão no estado da partida | `engine/runtime/*`, `GameState` | SG106 |
| C9 | Apoio social é recalculado sob demanda, fora do turno | `refreshPoliticalSupport.ts` | SG117 |
| C10 | Votação parlamentar não fica registrada (sorteios, probabilidades) | `resolveParliamentaryVote.ts` | SG113 |
| C11 | Não há Mandato nem calendário eleitoral; vencedor = partido com mais apoio | `commitElection.ts` | SG122, SG124 |
| C12 | Política aponta para um único ministério, por texto (`"ministerio": "Ministério da Saúde"`) | JSONs de política | SG128 |
| C13 | Interface não usa a partida: `main.tsx` renderiza o cenário demo `brazilPresidency` | `src/main.tsx` | SG109 |
| C14 | Documentação duplicada em 5 lugares; plano Word obsoleto; README desatualizado | `docs/`, `README.md` | SG101 |

### 2.3 Faz parte do MVP (a construir)

Marcos M0–M6, seção 4.

### 2.4 Futuro (fora do MVP, com lugar definido)

| Ordem | Marco | Conteúdo |
|---|---|---|
| 2 | **M8 Instituições e Constituição** | Constituição como camada de leis protegidas; reforma constitucional (60% em duas votações); colegiado e contagem (FIX-V1-07); organização vigente inferida; migração de `organizacao-politica.json`; continuidade após mudança institucional (FIX-V1-03, parte de reforma) |
| 2 | **M9 Ruptura institucional** | Golpe como **sistema distinto** da reforma: apoio de comandantes/Judiciário agregado, requisitos, consequências, continuidade sem eleição |
| 3 | **M10 Personagens com mecânica** | Influência partidária, ideologia, popularidade, relações, substituição de ministros com consequências, escolha de chapa, histórias, opiniões dinâmicas |
| — | M7 Balanceamento e qualidade | SG073–080, SG084–088 do plano antigo (detalhar ao abrir) |
| — | M11 Publicação | SG089–096 do plano antigo |

**Backlog (sem marco, com motivo):** ver seção 8.

---

## 3. Modelo de domínio de referência (resumo da Fase 2)

```text
CONTEÚDO (imutável)          PARTIDA (raiz do agregado)                SIMULAÇÃO
Catálogo de leis      ─────▶ Mandato · Cargos/Personagens visuais      Grafo
País (estado inicial)        Cadeiras (UF, vencimento)          ─────▶ Execução
Ministérios, Partidos        Propostas · Políticas vigentes            numérica
Grupos, Perfis, Relações     Votações · Eleições · Ocorrências
Leis eleitorais              Fiscal · Social · Gerador · Diário
```

- **Consistência:** a Partida só muda no commit atômico do turno (ou de uma ação
  validada). Fiscal, social e eleições são funções puras sobre o snapshot.
- **Derivados, nunca fonte:** comando do motor, fluxo fiscal, caixa/dívida,
  contribuição social, apoio por partido, composição do Senado por partido,
  probabilidade de voto, estimativas, organização vigente.
- **Estados:** Partida (ativa → encerrada); Proposta (rascunho → apresentada →
  em_votacao → aprovada | rejeitada | retirada); Política vigente (status de
  execução × status jurídico); Cadeira (renova só no vencimento); Eleição
  (agendada → apurada → aplicada); Ocorrências (situação com histerese, evento
  único, dilema pendente → respondido).
- **Personagens no MVP:** Cargo (presidente, vice, ministro de um Ministério) com
  ocupante = Personagem visual (nome, retrato, partido, cargo, vínculo). Sem
  mecânica individual. Os campos futuros entram em M10 sem mudar o motor.
- **Ministério ↔ Política:** muitos-para-muitos (esferas sobrepostas).

---

## 4. Marcos e chamados do MVP

**Legenda de tamanho:** **P** = 1 sessão · **M** = 2 sessões (máximo).
**Regra de dependência:** o marco Mk só começa com o marco anterior fechado;
assim, só contam as dependências **dentro do marco** e cada chamado tem no
máximo **uma** dependência aberta.
**Teste padrão:** todo chamado termina com `npm run check` verde.

### M0 — Base estável e verificável

> **Valor:** saber exatamente o que funciona; código salvo no git; dados reais do
> Brasil prontos para o turno.

#### SG100 — Verificar e versionar o trabalho local · M
- **Objetivo:** transformar o código sem commit em base confiável.
- **Entidades:** todas (sem mudança de modelo).
- **Tarefas:** rodar `npm run check`; corrigir falhas de tipo/lint/teste sem
  acrescentar funcionalidade; renomear `politicalPath.test.ts` para
  `politicalPath.demo.test.ts` com comentário "valores forçados, não é aceite";
  commitar em `sg100-base-local` e integrar na `main`.
- **Arquivos:** `src/game/*`, `src/domain/fiscal/*`, `src/tests/*`.
- **Aceite:** `main` contém todo o trabalho local; CI verde; nenhum arquivo de
  código fica fora do git.
- **Testar:** CI no GitHub + `npm run check` local.
- **Depende de:** — · **Libera:** SG102, SG103.

#### SG101 — Consolidar a documentação · P
- **Objetivo:** uma única fonte de verdade.
- **Tarefas:** publicar este `PLANO.md` como mestre; cabeçalho "histórico" no
  `docs/plano-de-producao.md`; mover a cópia Word para `docs/historico/`;
  README apontando para o PLANO e com contagem de testes atual; `AGENTS.md`
  apontando para o PLANO e para as regras anti-ciclo.
- **Arquivos:** `PLANO.md`, `README.md`, `AGENTS.md`, `docs/plano-de-producao.md`.
- **Aceite:** README e AGENTS levam ao PLANO; nenhum doc ativo declara status
  diferente do PLANO.
- **Testar:** leitura; `npm run check` (formatação do README).
- **Depende de:** — · **Libera:** —.

#### SG102 — Regras de nível lidas do conteúdo · P
- **Objetivo:** `PolicyLevelRules` (opções autorizáveis, domínio, unidade) vindo
  do JSON da política, não do código.
- **Entidades:** Política definida → Política vigente / Proposta.
- **Tarefas:** adaptador `policyLevelRulesFromContent(definition)`; usar em
  `createGame`, `commitApprovedProposal`, `validatePolicyAction`.
- **Arquivos:** `src/game/policyRulesFromContent.ts` (novo), os três acima.
- **Aceite:** nenhum domínio de política escrito em código ou teste de aceite;
  JSON sem domínio é recusado com arquivo/campo.
- **Testar:** teste unitário do adaptador + teste de pacote inválido.
- **Depende de:** SG100 · **Libera:** SG104 (M1), SG111 (M2).

#### SG103 — Ficha fiscal do Brasil (hipótese marcada) · P
- **Objetivo:** fazer o fiscal rodar no cenário real.
- **Tarefas:** declarar `fiscal` em `estado-inicial.json` com
  `origem: "hipotese"`, valores redondos e plausíveis (caixa, dívida, juros
  herdados/mês, taxa da dívida nova); conferir `impactoFiscal` das 5 políticas.
  A reconciliação com dados oficiais vai para o backlog (B-07).
- **Arquivos:** `src/scenarios/brasil-primeiro-cenario/estado-inicial.json`.
- **Aceite:** `createGame` do Brasil tem `fiscal`; teste confirma que um turno
  preparado gera déficit ou superávit finito.
- **Testar:** `createGame.test.ts` + novo caso em `prepareFiscalQuarter.test.ts`.
- **Depende de:** SG100 · **Libera:** SG105 (M1).

---

### M1 — Turno real da partida

> **Valor:** "Próximo turno" no Brasil real move implantação, motor, finanças e
> ocorrências, de forma atômica, **e aparece na tela**.

#### SG104 — Implantação mensal calculada pela partida · M
- **Objetivo:** a partida calcula, mês a mês, o nível implantado de cada política
  vigente a partir da meta e da resposta temporal do JSON (fecha C6).
- **Entidades:** Política vigente.
- **Tarefas:** função pura `advancePolicyImplementation(states, content, month)`
  usando as funções existentes de `policyState.ts`; `prepareGameQuarter` passa a
  gerar os 3 estados mensais em vez de recebê-los.
- **Arquivos:** `src/game/advancePolicyImplementation.ts` (novo),
  `prepareGameQuarter.ts`, `domain/game/policyState.ts` (só se faltar função).
- **Aceite:** meta 5000 a partir de 4000 converge com a mesma fração trimestral
  já validada no SG057-A; revogação nunca sobe o nível; encerra abaixo de
  `revocationEpsilon`.
- **Testar:** `advancePolicyImplementation.test.ts` (convergência, revogação,
  equivalência trimestral).
- **Depende de:** — (M0 fechado) · **Libera:** SG105.

#### SG105 — Fiscal no turno real · P
- **Objetivo:** contas mensais do Brasil, com emissão e juros, dentro do turno.
- **Entidades:** Estado fiscal.
- **Tarefas:** ligar `prepareGameQuarter` às políticas implantadas de SG104 e à
  ficha de SG103; publicar no grafo o indicador "peso dos juros" (usado em SG121).
- **Arquivos:** `prepareGameQuarter.ts`, `preparePolicyFiscalFlows.ts`.
- **Aceite:** 16 turnos do Brasil sem erro; juros da emissão só no mês seguinte;
  caixa nunca negativo; uma única fonte de caixa e dívida.
- **Testar:** `prepareGameQuarter.test.ts` com o pacote real.
- **Depende de:** SG104 · **Libera:** SG106.

#### SG106 — Ocorrências na partida · M
- **Objetivo:** situações, eventos e dilemas viram estado da partida (fecha C8).
- **Entidades:** Ocorrência ativa (filha da Partida).
- **Tarefas:** campo `occurrences` no `GameState`; avaliação mensal em ordem de
  ID sobre o mesmo retrato; dilema pendente fica registrado e é respondido por
  uma ação (resposta aplica no mês seguinte); evento não se repete.
- **Arquivos:** `createGame.ts`, `prepareGameQuarter.ts`,
  `src/game/occurrences.ts` (novo); reaproveita `engine/runtime/evaluate*`.
- **Aceite:** evento do Brasil (`aumento-demanda`) dispara uma vez; situação
  `sobrecarga-atendimento` entra/sai com histerese; dilema de teste não aplica
  efeito antes da resposta.
- **Testar:** `occurrences.test.ts` com cenário Brasil + cenário `extremos`.
- **Depende de:** SG105 · **Libera:** SG107.

#### SG107 — Diário do turno da partida · P
- **Objetivo:** resultado do turno como dado de domínio (mensal + resumo).
- **Tarefas:** `TurnJournal` produzido pelo preparo do turno: implantação, fiscal,
  ocorrências, erros com ID/campo; reaproveitar `turnJournal.ts`.
- **Arquivos:** `src/game/turnJournal.ts`, `prepareGameQuarter.ts`.
- **Aceite:** cada mudança de indicador relevante tem causa (política, evento ou
  consequência) no diário.
- **Testar:** teste de snapshot do diário de 1 turno do Brasil.
- **Depende de:** SG106 · **Libera:** SG108.

#### SG108 — Caso de uso `advanceTurn` v1 · M
- **Objetivo:** primeira transação atômica da partida (parte 1 do antigo SG061).
- **Entidades:** Partida, Turno.
- **Tarefas:** `advanceTurn(content, graph, game, intents)` → prepara 3 meses
  (SG104–107) → commit único (`commitGameQuarter` estendido); falha descarta
  tudo, inclusive o gerador aleatório.
- **Arquivos:** `src/application/advanceTurn.ts` (novo; primeira peça da camada
  de aplicação), `commitGameQuarter.ts`.
- **Aceite:** falha sintética no mês 2 preserva a partida inteira; repetir após
  falha produz o mesmo resultado; motor continua utilizável sem `src/game`.
- **Testar:** `advanceTurn.test.ts` (sucesso, falha, retentativa, 16 turnos).
- **Depende de:** SG107 · **Libera:** SG109; abre M2.

#### SG109 — Tela: mapa lê a partida real · M
- **Objetivo:** primeira tela do jogo de verdade (fecha C13 em parte).
- **Tarefas:** modo "Partida" ao lado do laboratório (não remover a bancada);
  `main.tsx` cria a partida do Brasil e o mapa lê o `GameState`; botão "Próximo
  turno" chama `advanceTurn`; `FiscalQuarterPanel` com dados reais; diário do
  turno no painel existente.
- **Arquivos:** `src/main.tsx`, `src/ui/GameMap.tsx`, `src/ui/TurnLogPanel.tsx`,
  `src/ui/FiscalQuarterPanel.tsx`, `src/application/gameSession.ts` (novo,
  estado React da sessão).
- **Aceite:** abrir o jogo, avançar 4 turnos, ver turno, caixa, dívida e diário
  mudarem; nenhum componente chama `advanceExecution` diretamente.
- **Testar:** manual (roteiro de 5 passos no PR) + `grep` de imports na revisão.
- **Depende de:** SG108 · **Libera:** M5 (pode correr em paralelo a M2–M4).

---

### M2 — Legislativo: proposta e votação de verdade

> **Valor:** o jogador propõe uma mudança, o Senado vota no fechamento com acaso
> controlado e a política só muda se aprovada.

#### SG110 — Cadeiras do Senado por UF · M
- **Objetivo:** Cadeira (UF, slot, partido, vencimento) como fonte; composição
  por partido derivada (fecha C3).
- **Tarefas:** `cadeiras[]` no estado inicial do Brasil (81, hipótese marcada,
  vencimentos alternados 2/1); validação (UF única por slot, vencimento futuro,
  partido existente); `senateSeatsByParty` vira função derivada; ajustar
  `commitSenateElection` ao novo formato (sem lógica de apuração ainda).
- **Arquivos:** `estado-inicial.json`, `validateContentFile.ts`, `contentTypes.ts`,
  `createGame.ts`, `commitSenateElection.ts`, `src/domain/politics/seats.ts` (novo).
- **Aceite:** 27 UFs × 3 cadeiras; total derivado por partido igual ao atual;
  pacote com UF faltando é recusado.
- **Testar:** `seats.test.ts`, `validateContentFile.test.ts`.
- **Depende de:** — (M1 fechado) · **Libera:** SG112.

#### SG111 — Porta única de validação de ações · P
- **Objetivo:** completar o antigo SG059 sobre o código existente.
- **Tarefas:** `validatePolicyAction` usa SG102; verifica requisitos, exclusões,
  proposta aberta, opção autorizável; devolve `aceita | rejeita | exige-proposta`
  com motivo tipado; sem mutação nem sorteio.
- **Arquivos:** `validatePolicyAction.ts`, `commitPolicyAction.ts`.
- **Aceite:** ajuste executivo vale no mês 1 do turno; mudança legislativa vira
  proposta; impopularidade nunca bloqueia; testes de cada motivo de recusa.
- **Testar:** `validatePolicyAction.test.ts`.
- **Depende de:** — · **Libera:** SG113.

#### SG112 — Probabilidade de voto pelo conteúdo · P
- **Objetivo:** a probabilidade de cada cadeira vem de base, afinidade do partido
  e opinião, com pesos do JSON (o componente de opinião entra com valor neutro
  até SG118).
- **Tarefas:** pesos e quórum (`maioria absoluta das cadeiras ativas`) no JSON da
  lei de processo legislativo; função `estimateVote` (prévia) que **não consome**
  o gerador.
- **Arquivos:** `sampleParliamentaryVotes.ts`, `catalogo-politicas-v1.json`,
  `validateContentFile.ts`.
- **Aceite:** estimativa e votação real usam a mesma função de probabilidade;
  estimar 10 vezes não altera `game.random`.
- **Testar:** `sampleParliamentaryVotes.test.ts`.
- **Depende de:** SG110 · **Libera:** SG113.

#### SG113 — Votação no fechamento do turno · M
- **Objetivo:** propostas em votação são votadas dentro de `advanceTurn` (parte 2
  do antigo SG061; fecha C10).
- **Entidades:** Votação parlamentar (nova, filha da Partida), Proposta.
- **Tarefas:** no fechamento, em ordem de ID: amostrar pelo gerador salvo →
  registrar Votação (probabilidades, sorteios, contagem) → aprovar e
  `commitApprovedProposal` ou rejeitar; aprovada orienta a implantação a partir do
  turno seguinte.
- **Arquivos:** `src/application/advanceTurn.ts`, `resolveParliamentaryVote.ts`,
  `commitApprovedProposal.ts`, `createGame.ts` (campo `votes`).
- **Aceite:** empate não aprova; rejeitada preserva a política anterior;
  retentativa após falha usa os mesmos sorteios.
- **Testar:** `advanceTurn.vote.test.ts` com sementes fixas.
- **Depende de:** SG112 · **Libera:** SG114.

#### SG114 — Prazo e adiamento pelo conteúdo · P
- **Objetivo:** prazo normal, adiamento único e limite de 2 turnos lidos do JSON
  (fecha C7).
- **Tarefas:** `ProposalTimingRules` e condição de adiamento no conteúdo; remover
  `defaultProposalTiming` do caminho do jogo.
- **Arquivos:** `prepareProposalTramitation.ts`, `prepareGameQuarter.ts`, JSON.
- **Aceite:** proposta adiada uma vez é votada no turno seguinte; nenhuma passa
  de 2 turnos; motivo do adiamento aparece no diário.
- **Testar:** `prepareProposalTramitation.test.ts`.
- **Depende de:** SG113 · **Libera:** SG115.

#### SG115 — Tela: propor e acompanhar · M
- **Objetivo:** o jogador propõe pelo mapa.
- **Tarefas:** ao clicar numa política: controle comum (meta), estimativa de
  apoio parlamentar e custo por turno, status da proposta; resultado da votação
  no diário. Controles gerados do JSON, sem tela por lei.
- **Arquivos:** `src/ui/PolicyPanel.tsx` (novo), `GameMap.tsx`, `gameSession.ts`.
- **Aceite:** propor, avançar, ver aprovada/rejeitada e o nível desejado ×
  implantado separados.
- **Testar:** roteiro manual no PR.
- **Depende de:** SG114 · **Libera:** M3.

---

### M3 — Sociedade: grupos reagem e influenciam o Senado

> **Valor:** decisões geram reações rastreáveis por grupo; a opinião pesa na
> votação; popularidade não garante aprovação.

#### SG116 — Relações sociais validadas no conteúdo · P
- **Objetivo:** fechar a validação de perfis, grupos e relações
  (política → grupo, indicador → grupo).
- **Tarefas:** validar unidades, pesos finitos ≥ 0, perfis somando 100, referência
  positiva; apoio inicial já inclui as políticas herdadas (sem bônus duplicado).
- **Arquivos:** `validateContentFile.ts`, `validatePackageCoherence.ts`,
  `estado-inicial.json`.
- **Aceite:** pacotes inválidos recusados com campo; Brasil válido.
- **Testar:** `validateContentFile.test.ts`.
- **Depende de:** — (M2 fechado) · **Libera:** SG117.

#### SG117 — Apoio social como etapa mensal do turno · M
- **Objetivo:** recalcular o apoio todo mês dentro de `advanceTurn`, substituindo
  contribuições (fecha C9 e os FIX-V1-01/06 no caminho integrado).
- **Tarefas:** chamar `refreshPoliticalSupport` após o motor em cada mês;
  contribuições por `relação+origem+alvo`; registrar no diário.
- **Arquivos:** `advanceTurn.ts`, `refreshPoliticalSupport.ts`, `socialSupport.ts`.
- **Aceite:** 40 → 42 com efeito +2 mesmo após 3 meses; 99 → 100 → 99 ao retirar
  a fonte; extremos 0/100 sem divisão por zero; ordem dos IDs não muda o resultado.
- **Testar:** `advanceTurn.social.test.ts`.
- **Depende de:** SG116 · **Libera:** SG118, SG120, SG121.

#### SG118 — Opinião entra na votação · P
- **Objetivo:** o componente "opinião" de SG112 passa a vir do apoio social à
  medida.
- **Tarefas:** derivar a opinião sobre a proposta a partir das relações da
  política; ligar em `estimateVote` e na votação.
- **Arquivos:** `sampleParliamentaryVotes.ts`, `socialSupport.ts`.
- **Aceite:** mesma bancada, opinião maior → probabilidade maior; nunca vira
  veto ou aprovação automática.
- **Testar:** teste de monotonicidade.
- **Depende de:** SG117 · **Libera:** SG119.

#### SG119 — Roteiros de aceite do ciclo político · P
- **Objetivo:** substituir o teste com valores forçados (fecha C2).
- **Tarefas:** dois roteiros no pacote Brasil, sementes fixas, probabilidades
  reais: medida popular rejeitada por bancada insuficiente; medida impopular
  aprovada com reação pública. Apagar `politicalPath.demo.test.ts`.
- **Arquivos:** `src/tests/politicalCycle.test.ts` (novo).
- **Aceite:** os dois roteiros passam sem nenhum valor manual além da semente e
  de bancadas de teste declaradas em JSON de teste.
- **Testar:** o próprio teste.
- **Depende de:** SG118 · **Libera:** M4.

#### SG120 — Tela: grupos e apoio com causas · P
- **Tarefas:** painel de perfis/grupos com apoio partidário e as contribuições
  que o explicam (origem → grupo → pontos).
- **Arquivos:** `src/ui/SocietyPanel.tsx` (novo).
- **Aceite:** clicar num grupo mostra quais políticas/indicadores o movem.
- **Testar:** roteiro manual.
- **Depende de:** SG117 · **Libera:** —.

#### SG121 — Desgaste pelo peso dos juros · P
- **Objetivo:** contrapartida política da dívida, só por conteúdo.
- **Tarefas:** relação JSON indicador "peso dos juros" (SG105) → grupos, com
  atraso e parâmetros marcados como hipótese.
- **Arquivos:** `estado-inicial.json` (relações), teste.
- **Aceite:** endividar eleva o peso dos juros e reduz gradualmente o apoio dos
  grupos declarados; sem derrota automática; nenhuma linha de código nova
  (se exigir, vira chamado próprio).
- **Testar:** teste comparando 8 turnos com e sem expansão de gasto.
- **Depende de:** SG117 · **Libera:** —.

---

### M4 — Eleições e mandato: o ciclo fecha

> **Valor:** a partida chega à eleição, apura Presidência e Senado por UF e
> continua (vitória) ou termina (derrota). **Ciclo completo jogável por teste.**

#### SG122 — Mandato e calendário eleitoral · P
- **Objetivo:** Mandato presidencial e datas de eleição derivadas da lei
  eleitoral vigente e do mês absoluto (fecha parte de C11).
- **Tarefas:** entidade Mandato; `nextElections(game, content)`; turno 16 do
  mandato sem decisões ordinárias.
- **Arquivos:** `src/domain/politics/mandate.ts` (novo), `createGame.ts`.
- **Aceite:** Brasil: eleição presidencial no mês 48; Senado no mesmo mês
  renovando só as cadeiras que vencem.
- **Testar:** `mandate.test.ts`.
- **Depende de:** — (M3 fechado) · **Libera:** SG123.

#### SG123 — Apuração do Senado por UF · M
- **Objetivo:** maiores médias por UF com pesos dos perfis por UF (FIX-V1-08).
- **Tarefas:** pesos por UF (hipótese) no estado inicial; votos por UF agregados
  sem duplicar perfis; divisores do JSON; d20 só em empate real; renovação só das
  cadeiras vencidas.
- **Arquivos:** `elections.ts`, `commitSenateElection.ts`, `estado-inicial.json`.
- **Aceite:** exemplos 70/30 e 60/40 com duas vagas reproduzem o cálculo manual;
  um partido pode levar as duas; UFs com perfis diferentes divergem.
- **Testar:** `elections.test.ts`, `commitSenateElection.test.ts`.
- **Depende de:** SG122 · **Libera:** SG124.

#### SG124 — Candidatura e apuração presidencial · P
- **Objetivo:** candidatura explícita mínima (FIX-V1-05 versão MVP).
- **Tarefas:** uma candidatura por partido; aliados declaram em JSON se apoiam
  outra candidatura (transferência integral só se declarada); pluralidade
  nacional; d20 em empate real.
- **Arquivos:** `elections.ts`, `commitElection.ts`, `estado-inicial.json`.
- **Aceite:** exemplo 30/25/45 dá vencedores diferentes com e sem apoio
  declarado; o diário explica o destino dos votos do aliado.
- **Testar:** `elections.test.ts`.
- **Depende de:** SG123 · **Libera:** SG125.

#### SG125 — Fechamento eleitoral no turno · M
- **Objetivo:** parte 3 do antigo SG061.
- **Tarefas:** no fechamento: votações → eleições → troca de cadeiras (vale no
  turno seguinte) → novo Mandato (vitória) ou `encerrada` (derrota).
- **Arquivos:** `advanceTurn.ts`, `commitElection.ts`, `commitSenateElection.ts`.
- **Aceite:** votação no mesmo fechamento usa a composição antiga; vitória
  preserva dívida, implantação, propostas e vencimentos; derrota bloqueia novo turno.
- **Testar:** `advanceTurn.election.test.ts`.
- **Depende de:** SG124 · **Libera:** SG126, SG127.

#### SG126 — Teste de partida completa · P
- **Objetivo:** prova do ciclo (equivale ao antigo SG064).
- **Tarefas:** teste de 32 turnos (dois mandatos) com sementes fixas: herança,
  proposta, votação, déficit válido, evento, eleição vencida, segunda eleição
  perdida e encerramento.
- **Arquivos:** `src/tests/fullGame.test.ts` (novo).
- **Aceite:** passa; nenhuma votação, custo ou evento duplicado.
- **Testar:** o próprio teste.
- **Depende de:** SG125 · **Libera:** M6.

#### SG127 — Tela: resultado eleitoral e continuidade · M
- **Tarefas:** resultado da Presidência e do Senado por UF, explicação, "continuar
  mandato" ou "nova partida".
- **Arquivos:** `src/ui/ElectionPanel.tsx` (novo), `gameSession.ts`.
- **Aceite:** jogar até a eleição pela tela; derrota não permite turno extra.
- **Testar:** roteiro manual.
- **Depende de:** SG125 · **Libera:** —.

---

### M5 — O rosto do governo (paralelo a M2–M4, depende só de M1)

> **Valor:** a identidade do jogo — presidente, vice, ministros, esferas e
> conexões — alimentada pela partida, sem mecânica individual.

#### SG128 — Ministérios, cargos e personagens visuais · M
- **Objetivo:** estrutura para o rosto do governo e para M10, sem mecânica.
- **Entidades:** Ministério (conteúdo), Cargo e Personagem visual (partida).
- **Tarefas:** `ministerios/*.json` (id, nome, esfera); política com
  `ministerios: [ids]` (muitos-para-muitos), migrando o texto atual;
  `personagens/*.json` (id, nome, retrato, partido); estado inicial declara os
  ocupantes de presidente, vice e ministros; `GameState.offices`. Campos de
  mecânica futura **não** são criados agora; o formato aceita extensão por
  versão de esquema.
- **Arquivos:** JSONs do Brasil, `contentTypes.ts`, `validateContentFile.ts`,
  `createGame.ts`.
- **Aceite:** cada política referencia ≥ 1 ministério por ID; texto livre de
  ministério recusado; cargo sem ocupante recusado; motor intocado.
- **Testar:** `validateContentFile.test.ts`, `createGame.test.ts`.
- **Depende de:** — (M1 fechado) · **Libera:** SG129.

#### SG129 — Mapa de influência alimentado pela partida · M
- **Objetivo:** a tela-alvo aprovada (`docs/producao/mapa-de-influencia.md`) com
  dados reais.
- **Tarefas:** presidente e vice no centro com a Constituição; ministros nas
  esferas com suas políticas (sobreposição por ministério múltiplo); indicadores
  e situações orbitando fora das esferas; seleção destaca as relações do grafo.
  Reaproveitar `influenceLayout.ts`, `mapPhysics.ts`, `relationPaths.ts`;
  posição visual nunca define relação.
- **Arquivos:** `GameMap.tsx`, `influenceLayout.ts`, `relationPaths.ts`.
- **Aceite:** as 5 políticas do Brasil aparecem nas esferas certas; clicar
  destaca as consequências reais do JSON.
- **Testar:** `influenceLayout.test.ts`, `relationPaths.test.ts` + roteiro manual.
- **Depende de:** SG128 · **Libera:** SG130.

#### SG130 — Ajuda mínima e explicação do turno · P
- **Tarefas:** tela de ajuda (objetivo, turno = 3 meses, autorização, eleição,
  por que popularidade não garante aprovação e déficit não é erro); diário com
  "estimado × realizado".
- **Arquivos:** `src/ui/HelpPanel.tsx` (novo), `TurnLogPanel.tsx`.
- **Aceite:** uma pessoa faz a primeira proposta só com a ajuda.
- **Testar:** sessão rápida com uma pessoa.
- **Depende de:** SG129 · **Libera:** —.

---

### M6 — Salvar e restaurar → **MVP**

> **Valor:** retomar a partida exatamente onde parou, inclusive sorteios.

#### SG131 — Formato do arquivo de partida · M
- **Tarefas:** serializar `GameState` + execução (`exportExecution`) + gerador +
  identidade do conteúdo + versão de esquema; recusar save incompatível com motivo.
- **Arquivos:** `src/application/saveGame.ts` (novo), reaproveita
  `engine/runtime/exportExecution.ts` e `restoreExecution.ts`.
- **Aceite:** conteúdo alterado é detectado; save corrompido não altera a partida
  aberta.
- **Testar:** `saveGame.test.ts`.
- **Depende de:** — (M4 fechado) · **Libera:** SG132.

#### SG132 — Restauração equivalente · P
- **Tarefas:** comparar execução contínua × restaurada antes e depois de uma
  eleição, com a mesma semente.
- **Arquivos:** `src/tests/saveRestore.test.ts` (novo).
- **Aceite:** trajetórias, votações, sorteios, prazos e cadeiras idênticos;
  nenhum bônus social reaplicado.
- **Testar:** o próprio teste.
- **Depende de:** SG131 · **Libera:** SG133.

#### SG133 — Tela: exportar e importar · P
- **Arquivos:** `gameSession.ts`, `src/ui/SavePanel.tsx` (novo).
- **Aceite:** baixar arquivo, recarregar a página, importar e continuar.
- **Testar:** roteiro manual.
- **Depende de:** SG132 · **Libera:** SG134.

#### SG134 — Marco MVP: percurso verificado · P
- **Tarefas:** roteiro manual dos 3 critérios de sucesso de
  `primeira-versao.md` pela tela + `fullGame.test.ts` + `npm run check`; registrar
  pendências como chamados novos no backlog.
- **Aceite:** os três critérios demonstrados; nenhum bloqueio crítico.
- **Depende de:** SG133 (e M5 fechado) · **Libera:** M7–M11.

---

## 5. Grafo de dependências, ordem e caminho crítico

```text
M0  SG100 ──┬─▶ SG102 ─────────────────────────────┐
            └─▶ SG103                               │   SG101 (independente)
                                                    ▼
M1  SG104 ─▶ SG105 ─▶ SG106 ─▶ SG107 ─▶ SG108 ─▶ SG109 ──────────┐
                                          │                       ▼
M2  SG110 ─▶ SG112 ─▶ SG113 ─▶ SG114 ─▶ SG115     M5  SG128 ─▶ SG129 ─▶ SG130
    SG111 ─────────────┘ (SG113 consome SG111; SG111 fecha antes)
M3  SG116 ─▶ SG117 ─┬─▶ SG118 ─▶ SG119
                    ├─▶ SG120
                    └─▶ SG121
M4  SG122 ─▶ SG123 ─▶ SG124 ─▶ SG125 ─┬─▶ SG126
                                      └─▶ SG127
M6  SG131 ─▶ SG132 ─▶ SG133 ─▶ SG134 (MVP)
```

> Em SG113, SG111 conta como dependência: executar SG111 **antes** de SG112 no
> M2 mantém uma única dependência aberta (SG112) quando SG113 começar.

| Chamado | Depende de | Libera |
|---|---|---|
| SG100 | — | SG102, SG103 |
| SG101 | — | — |
| SG102 | SG100 | SG104, SG111 |
| SG103 | SG100 | SG105 |
| SG104 | (M0) | SG105 |
| SG105 | SG104 | SG106 |
| SG106 | SG105 | SG107 |
| SG107 | SG106 | SG108 |
| SG108 | SG107 | SG109, M2 |
| SG109 | SG108 | M5 |
| SG110 | (M1) | SG112 |
| SG111 | (M1) | SG113 |
| SG112 | SG110 | SG113 |
| SG113 | SG112 (SG111 já fechado) | SG114 |
| SG114 | SG113 | SG115 |
| SG115 | SG114 | M3 |
| SG116 | (M2) | SG117 |
| SG117 | SG116 | SG118, SG120, SG121 |
| SG118 | SG117 | SG119 |
| SG119 | SG118 | M4 |
| SG120 | SG117 | — |
| SG121 | SG117 | — |
| SG122 | (M3) | SG123 |
| SG123 | SG122 | SG124 |
| SG124 | SG123 | SG125 |
| SG125 | SG124 | SG126, SG127 |
| SG126 | SG125 | M6 |
| SG127 | SG125 | — |
| SG128 | (M1) | SG129 |
| SG129 | SG128 | SG130 |
| SG130 | SG129 | — |
| SG131 | (M4) | SG132 |
| SG132 | SG131 | SG133 |
| SG133 | SG132 | SG134 |
| SG134 | SG133 (+ M5 fechado) | M7–M11 |

**Caminho crítico (25 chamados):**
SG100 → SG102 → SG104 → SG105 → SG106 → SG107 → SG108 → SG110 → SG112 → SG113 →
SG114 → SG115 → SG116 → SG117 → SG118 → SG119 → SG122 → SG123 → SG124 → SG125 →
SG126 → SG131 → SG132 → SG133 → SG134.

**Fora do caminho crítico (encaixar quando bloqueado ou entre marcos):** SG101,
SG103 (antes de SG105), SG109, SG111, SG120, SG121, SG127, SG128–SG130.

**Estimativa:** 35 chamados, ~50 sessões (P = 1, M = 2). Não é prazo; é
referência para reestimar ao fim de cada marco.

---

## 6. Correspondência com os IDs antigos

| ID antigo | Destino neste plano |
|---|---|
| SG057-B (regras políticas) | SG110, SG112–SG114, SG122 |
| SG058-A (reação dos grupos) + FIX-V1-01/06 | SG116–SG118, SG121 |
| SG058-B (apuração) + FIX-V1-05/08 | SG122–SG125 |
| SG059 (validação) | SG111 |
| SG060-A/B (fiscal) | já existe; ligado em SG103, SG105 |
| SG061 (turno inteiro) | dividido: SG108 (meses), SG113 (votação), SG117 (social), SG125 (eleição) |
| SG062–SG064 | SG119, SG126 |
| SG065–SG072 (interface) | SG109, SG115, SG120, SG127, SG129, SG130 |
| SG081–SG083 (save) | SG131–SG133 |
| FIX-V1-03, FIX-V1-07 | M8 |
| FIX-V1-09 | resolvido pelas decisões D-05, D-06, D-11 |
| FIX-V1-10 | regra anti-ciclo R-07 |
| SG058-C, SG058-D, SG060-C | backlog (B-01, B-02, B-03) |
| SG073–SG080, SG084–SG096 | M7, M11 (detalhar ao abrir) |

---

## 7. Regras anti-ciclo (obrigatórias)

- **R-01 Sem ciclos.** Nenhum chamado depende de outro que dependa dele, direta
  ou indiretamente. Se aparecer, extrair a parte comum para um chamado anterior.
- **R-02 Uma dependência aberta.** Cada chamado tem no máximo uma dependência
  aberta dentro do marco. Precisou de mais? Está grande demais: dividir.
- **R-03 Aceite autocontido.** O aceite de um chamado é verificável **só com ele
  e com o que já está fechado**. É proibido escrever "concluído quando X integrar"
  (foi a causa do ciclo SG057/058/059/061).
- **R-04 Um objetivo por chamado.** Se o chamado acumular dois objetivos,
  dividir; o pedaço que não cabe agora vai ao backlog com motivo.
- **R-05 Limite de 3 iterações.** Iteração = uma sessão de trabalho que termina
  sem fechar o aceite. Na 3ª sem fechar, o chamado é **reavaliado** (dividido,
  reduzido ou descartado), nunca estendido. Registrar a reavaliação na seção 9.
- **R-06 Congelamento de escopo.** Os marcos M0–M6 estão congelados. Ideia nova
  vai para o backlog (seção 8) com data e motivo. Não se acrescenta escopo a
  chamado existente. O congelamento só é revisto no SG134.
- **R-07 Uma fonte de status.** O status vive só na seção 10 deste PLANO.
  Outros documentos apontam para cá e não repetem regras nem status.
- **R-08 Sem "concluído no recorte".** Um chamado está **aberto** ou
  **concluído**. Não existe "parcial" como status final.
- **R-09 Parâmetro não bloqueia.** Valor numérico ausente → hipótese marcada no
  JSON (`origem: "hipotese"`) e segue. Só mecanismo novo exige decisão.
- **R-10 Agente de IA.** Um chamado por sessão; ao fim, atualizar a seção 10 com
  arquivos, teste e resultado. Se o agente repetir a mesma correção duas vezes,
  parar e registrar o bloqueio.

---

## 8. Backlog (fora do MVP, com motivo)

| ID | Item | Motivo |
|---|---|---|
| B-01 | SG058-C capacidade, demanda, retornos decrescentes | Evolução; limites atuais bastam para o MVP |
| B-02 | SG058-D governança, desvio, fiscalização | Evolução |
| B-03 | SG060-C crédito e bancos agregados | Escopo da V1 exclui bancos; código mantido, desconectado do turno |
| B-04 | Inflação, rating, crise fiscal, vencimentos, rolagem | Excluídos da V1 |
| B-05 | Segundo turno presidencial | Excluído da V1; a lei eleitoral já permite acrescentar o mecanismo |
| B-06 | Campanha eleitoral (ações nos 5 turnos anteriores) | Decisão de 9/out: sem ações vazias; exige catálogo próprio |
| B-07 | Reconciliação da ficha fiscal com dados oficiais (RTN/RMD) | MVP usa hipótese marcada (SG103) |
| B-08 | Histórias e geração de personagens | Parte de M10 |
| B-09 | Manual de conteúdo e mods | Depois da publicação |
| B-10 | Reavaliar tecnologia gráfica (PixiJS foi descartado) | Mapa atual em SVG/DOM atende o MVP |
| B-11 | Distribuição desktop/Steam | Depois da versão web |
| B-12 | Migração física de pastas (`engine` → `simulation`) | Só com fronteiras provadas; sem valor jogável agora |
| B-13 | Editor de conteúdo, contas, nuvem | Fora do escopo |
| B-14 | Laboratório de 100+ políticas (`lawMapDemo`) como conteúdo real | Demonstração visual; não é cenário calibrado |

---

## 9. Decisões tomadas (não rediscutir)

| ID | Decisão | Data | Fonte |
|---|---|---|---|
| D-01 | Turno = 3 meses (design). Mandato de 4 anos = 16 turnos no Brasil atual | 03–09/out | SG057-A; confirmado na Fase 2 |
| D-02 | 3 passos mensais por turno (técnica, revisável). Manter SG057-A e FIX-V1-02 | 09/out | Fase 2 |
| D-03 | Motor não conhece nomes de leis, partidos ou países; só variáveis e relações | 08/out | contrato-motor-json; reafirmado na Fase 2 |
| D-04 | Catálogo de leis comum; país declara só o estado inicial; lei ausente não é proibida | 08/out | contrato-motor-json |
| D-05 | Personagens no MVP: só visuais (nome, retrato, partido, cargo, vínculo); estrutura pronta para mecânica futura | 09/out | Fase 2 |
| D-06 | Ordem do jogo: (1) ciclo básico → (2) instituições, reforma e ruptura → (3) personagens com mecânica | 09/out | Fase 2 |
| D-07 | Golpe e reforma constitucional são sistemas distintos | 09/out | Fase 2 |
| D-08 | Senado simulado por UF, com cadeiras, vencimentos e renovação 2/1 | 09/out | Fase 2 |
| D-09 | Ministério ↔ política é muitos-para-muitos | 09/out | Fase 2 |
| D-10 | Presidência em turno único; maior total nacional vence; empate eleitoral por d20 | 07–08/out | plano antigo |
| D-11 | Campanha fora do MVP (sem ações vazias) | 09/out | plano-fechamento-sg057b-sg059 |
| D-12 | Votação parlamentar com acaso controlado; empate não aprova; estimativa não consome sorteio | 07–08/out | plano antigo |
| D-13 | Tramitação: vota no próximo fechamento; 1 adiamento; máximo 2 turnos; nunca aprovação automática | 07/out | plano antigo |
| D-14 | Votação no fechamento usa a composição anterior à renovação do Senado | 08/out | plano antigo |
| D-15 | Economia V1: receitas, despesas, caixa, dívida, emissão automática, juros simples da dívida nova a partir do mês seguinte; juros herdados separados | 07/out | primeira-versao |
| D-16 | Apoio social recalculado da base a cada mês (sem acúmulo), saturado em [0,100] e redistribuído somando 100 | 08–09/out | B2, plano-fechamento |
| D-17 | Partidos, grupos, pesos e preferências do Brasil são hipóteses marcadas, não dados reais | 09/out | plano-fechamento |
| D-18 | Limite de reavaliação: 3 iterações por chamado | 09/out | este plano (assumida; confirmar) |
| D-19 | Código sem commit do GPT é base a revisar (SG100), não entrega aceita | 09/out | este plano (assumida; confirmar) |
| D-20 | SG060-C fica no backlog, com o código preservado | 09/out | este plano (assumida; confirmar) |
| D-21 | O MVP inclui interface jogável (critério de sucesso 1 exige observar na tela) | 09/out | primeira-versao; este plano |

**Reavaliações de chamados (R-05):** _nenhuma até agora._

---

## 10. Checklist de execução (ordem proposta) — **fonte única de status**

Marque `[x]` só com o aceite demonstrado e `npm run check` verde. Anote ao lado:
data, commit e teste.

**M0 — Base**
- [ ] SG100 Verificar e versionar o trabalho local
- [ ] SG101 Consolidar a documentação
- [ ] SG102 Regras de nível lidas do conteúdo
- [ ] SG103 Ficha fiscal do Brasil (hipótese)

**M1 — Turno real**
- [ ] SG104 Implantação mensal pela partida
- [ ] SG105 Fiscal no turno real
- [ ] SG106 Ocorrências na partida
- [ ] SG107 Diário do turno
- [ ] SG108 `advanceTurn` v1
- [ ] SG109 Tela: mapa lê a partida

**M2 — Legislativo**
- [ ] SG110 Cadeiras do Senado por UF
- [ ] SG111 Porta única de validação
- [ ] SG112 Probabilidade de voto pelo conteúdo
- [ ] SG113 Votação no fechamento
- [ ] SG114 Prazo e adiamento pelo conteúdo
- [ ] SG115 Tela: propor e acompanhar

**M3 — Sociedade**
- [ ] SG116 Relações sociais validadas
- [ ] SG117 Apoio social mensal no turno
- [ ] SG118 Opinião entra na votação
- [ ] SG119 Roteiros de aceite do ciclo político
- [ ] SG120 Tela: grupos e apoio
- [ ] SG121 Desgaste pelo peso dos juros

**M4 — Eleições**
- [ ] SG122 Mandato e calendário eleitoral
- [ ] SG123 Apuração do Senado por UF
- [ ] SG124 Candidatura e apuração presidencial
- [ ] SG125 Fechamento eleitoral no turno
- [ ] SG126 Teste de partida completa
- [ ] SG127 Tela: resultado eleitoral

**M5 — Rosto do governo** (paralelo, após M1)
- [ ] SG128 Ministérios, cargos e personagens visuais
- [ ] SG129 Mapa de influência alimentado pela partida
- [ ] SG130 Ajuda mínima e explicação do turno

**M6 — Salvar e restaurar → MVP**
- [ ] SG131 Formato do arquivo de partida
- [ ] SG132 Restauração equivalente
- [ ] SG133 Tela: exportar e importar
- [ ] SG134 **Marco MVP verificado**

**Depois do MVP (detalhar ao abrir cada marco):** M7 Balanceamento e qualidade →
M8 Instituições e Constituição → M9 Ruptura institucional → M10 Personagens com
mecânica → M11 Publicação.
