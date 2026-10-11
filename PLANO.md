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

O SisGov é um simulador político e socioeconômico em que o país funciona como
uma **rede de causa e efeito**. O jogador é um partido que acabou de vencer a
eleição presidencial (ele dá nome, sigla e cor ao partido; não escolhe
ideologia — descobre-se jogando). **A prioridade é a rede (D-30):** decisões
se propagam por leis e indicadores; apoio, votação e eleição são lidos da rede.
O MVP prova, com o Brasil carregado de JSON:

```text
país herdado → decisão (lei orçamentária, regulatória, tributária)
→ propagação pela rede (indicadores em cadeia, com atraso e não linearidade)
→ grupos sociais reagem (nós da rede) → apoio no Senado e popularidade
→ eleição no fim do mandato → novo mandato ou derrota → salvar/restaurar
```

…apresentado no **mapa de influência**: presidente e vice no centro, ministros
com retrato nas esferas, leis nas esferas, indicadores entre elas, e a
explicação de por que cada indicador mudou.

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

| Área                                   | O que existe                                                                                                       | Evidência                                                 | IDs antigos           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------- |
| Base de produção                       | CI, lint, formatação, fluxo de branches                                                                            | `.github/workflows/ci.yml`                                | SG001–008             |
| Motor numérico                         | Validação JSON, grafo, mecanismos (afim, soma, estoque, condição, resposta gradual), atrasos, duração, explicações | `src/engine/**` + testes                                  | SG009–032             |
| Tempo e restauração do motor           | Histórico limitado, exportar/restaurar execução, situações, eventos, dilemas                                       | `engine/runtime/*`                                        | SG033–040             |
| Bancada técnica                        | Laboratório com avanço, inspeção de causas, comparação                                                             | `motor-demo.html`, `motorDemo.ts`                         | SG041–048             |
| Cenário Brasil inicial                 | 5 políticas, variáveis, consequências, evento, situação                                                            | `src/scenarios/brasil-primeiro-cenario/`                  | SG049–056             |
| Domínio de proposta e política vigente | Estados da proposta, política vigente (execução × jurídico), revogação, prazo e adiamento                          | `src/domain/game/*`                                       | SG097–098             |
| Criação da partida                     | `createGame` com leis eleitorais iniciais                                                                          | `src/game/createGame.ts`                                  | SG099                 |
| Tempo trimestral/mensal                | 3 passos mensais por turno, conversão de conteúdo                                                                  | `advanceQuarterlyLaboratoryTurn`, `prepareMonthlyContent` | SG057-A, FIX-V1-02/04 |
| Contratos documentais                  | Pesquisa eleitoral e contrato político                                                                             | `docs/producao/sg057-b1…`, `sg057-b2…`                    | SG057-B1/B2           |

### 2.2 Existe, mas precisa ser verificado ou corrigido

Código feito pelo GPT, **sem commit**, parado no meio de um loop. É base a
revisar, não entrega aceita.

| #   | Problema                                                                                                                              | Onde                                        | Corrigido em                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------ |
| C1  | ~40 arquivos sem commit e sem verificação                                                                                             | `src/game/*`, `src/domain/fiscal/*`, testes | SG100                                |
| C2  | `politicalPath.test.ts` força sorteios = 1, implantação manual e jogador = vencedor                                                   | `src/tests/politicalPath.test.ts`           | SG100 (marcar), SG126 (substituir)   |
| C3  | Senado guardado como total nacional por partido, sem UF nem vencimento                                                                | `createGame.ts`, `commitSenateElection.ts`  | B-15 (fora do MVP; SG148 simplifica) |
| C4  | Regras de nível da política (domínio) escritas no teste, não lidas do JSON                                                            | `politicalPath.test.ts`                     | SG102                                |
| C5  | Brasil sem ficha fiscal: o fiscal nunca roda no cenário real                                                                          | `estado-inicial.json`                       | SG103                                |
| C6  | `prepareGameQuarter` recebe os estados mensais das políticas prontos de quem chama; a implantação mensal não é calculada pela partida | `prepareGameQuarter.ts`                     | SG104                                |
| C7  | Prazo de tramitação usa `defaultProposalTiming` fixo no código, não o conteúdo                                                        | `prepareGameQuarter.ts`                     | SG114                                |
| C8  | Ocorrências (situação, evento, dilema) não estão no estado da partida                                                                 | `engine/runtime/*`, `GameState`             | SG106                                |
| C9  | Apoio social é recalculado sob demanda, fora do turno                                                                                 | `refreshPoliticalSupport.ts`                | SG143                                |
| C10 | Votação parlamentar não fica registrada (sorteios, probabilidades)                                                                    | `resolveParliamentaryVote.ts`               | SG113                                |
| C11 | Não há Mandato nem calendário eleitoral; vencedor = partido com mais apoio                                                            | `commitElection.ts`                         | SG122, SG124                         |
| C12 | Política aponta para um único ministério, por texto (`"ministerio": "Ministério da Saúde"`)                                           | JSONs de política                           | SG128                                |
| C13 | Interface não usa a partida: `main.tsx` renderiza o cenário demo `brazilPresidency`                                                   | `src/main.tsx`                              | SG145                                |
| C14 | Documentação duplicada em 5 lugares; plano Word obsoleto; README desatualizado                                                        | `docs/`, `README.md`                        | SG101                                |
| C15 | **Interface muito confusa** (autor, 11/out): o jogador não sabe onde está cada coisa. As 12 esferas por tema (D-63) ajudaram pouco: os nomes inventados ("Economia e empresas", "Direitos e sociedade") não batem com o governo que o brasileiro conhece, e nada mostra quem cuida de quê | `src/ui/mapa/*`, `ministerio` nas leis | SG128 (10 áreas com os 38 ministérios reais, D-64) |
| C16 | **Ainda não parece jogo** (autor, 11/out): é um simulador qualquer; falta a sensação de "só mais uma coisinha" — o puxão para arrumar mais uma lei, ver mais um turno, fechar mais uma meta antes de parar | toda a tela | B-21 (fora do congelamento: precisa de desenho próprio) |

### 2.3 Faz parte do MVP (a construir)

Marcos M1–M5, seção 4 (reordenados em 9/out pelo alinhamento D-30 a D-35).

### 2.4 Futuro (fora do MVP, com lugar definido)

| Ordem | Marco                              | Conteúdo                                                                                                                                                                                                                                                                   |
| ----- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2     | **M8 Instituições e Constituição** | Constituição como camada de leis protegidas; reforma constitucional (60% em duas votações); colegiado e contagem (FIX-V1-07); organização vigente inferida; migração de `organizacao-politica.json`; continuidade após mudança institucional (FIX-V1-03, parte de reforma) |
| 2     | **M9 Ruptura institucional**       | Golpe como **sistema distinto** da reforma: apoio de comandantes/Judiciário agregado, requisitos, consequências, continuidade sem eleição                                                                                                                                  |
| 3     | **M10 Personagens com mecânica**   | Influência partidária, ideologia, popularidade, relações, substituição de ministros com consequências, escolha de chapa, histórias, opiniões dinâmicas                                                                                                                     |
| —     | M7 Balanceamento e qualidade       | SG073–080, SG084–088 do plano antigo (detalhar ao abrir)                                                                                                                                                                                                                   |
| —     | M11 Publicação                     | SG089–096 do plano antigo                                                                                                                                                                                                                                                  |

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
  commitar na `main` (D-22).
- **Arquivos:** `src/game/*`, `src/domain/fiscal/*`, `src/tests/*`.
- **Aceite:** `main` contém todo o trabalho local; `npm run check` verde;
  nenhum arquivo de código fica fora do git.
- **Testar:** `npm run check` local.
- **Depende de:** — · **Libera:** SG102, SG103.

#### SG101 — Consolidar a documentação · P

- **Objetivo:** uma única fonte de verdade.
- **Tarefas:** publicar este `PLANO.md` como mestre; cabeçalho "histórico" no
  `docs/plano-de-producao.md`, `quadro-de-chamados.md` e
  `fluxo-de-branches-e-revisao.md`; mover a cópia Word para `docs/historico/`;
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

### M1 — A rede do país

> **Valor:** o Brasil vira uma rede real: leis nos quatro grupos, orçamento
> proporcional, ~35 indicadores em cadeias causais com efeitos não lineares e
> grupos sociais como nós. Um turno real faz a decisão se propagar.
> Especificação das leis: [`docs/arquitetura/catalogo-de-leis-v2.md`](docs/arquitetura/catalogo-de-leis-v2.md).

#### SG135 — Formato de lei v2 e catálogo comum · M

- **Objetivo:** esquema v2 com `grupo` (orçamentária, regulatória, tributária,
  institucional) e sem quantidades; leis fora da pasta do Brasil.
- **Tarefas:** tipos e validação dos quatro grupos (regulatória com ≥ 3 opções;
  campo de quantidade na lei é recusado); mover as leis para o catálogo comum;
  migrar as 5 leis atuais para `orcamentaria` / `valor_fixo`; país declara
  `leisVigentes` com o nível; adaptador do SG102 lê o formato novo.
- **Aceite:** as 5 leis carregam sem valor do Brasil no JSON da lei; lei com
  quantidade ou regulatória com 2 opções é recusada com arquivo/campo.
- **Depende de:** — · **Libera:** SG136.

#### SG153 — Mundo e país separados · M

- **Objetivo:** aplicar D-38 no conteúdo e no carregador.
- **Tarefas:** `src/conteudo/mundo/` (leis, indicadores, consequências,
  eventos, situações, catálogo, `mundo.json`) e `src/conteudo/paises/brasil/`
  (`pais.json`, estado inicial, organização política); o país referencia o
  mundo; leis sem texto ou moeda de um país (`moeda_ano`); limites do Brasil
  saem das variáveis do mundo e vão para `limitesProprios` do país; pacotes de
  teste em `src/conteudo/testes/`.
- **Aceite:** nenhum arquivo do mundo cita país, moeda ou fonte nacional; o
  Brasil carrega igual ao SG135 (mesmos níveis, limites e gastos); um país de
  teste usa o mesmo mundo com outro pacote de leis.
- **Depende de:** SG135 · **Libera:** SG136.

#### SG136 — Ficha do país v2: economia e orçamento completo · M

- **Tarefas:** `economia.pibAnual`; `fiscal.agregados` de receita e despesa;
  aplicar os limites `…PercentualPib` da lei (validados no SG135, ainda sem
  PIB para aplicar); retirar da rede os nós `despesa_recorte` e
  `saldo_recorte` (orçamento paralelo herdado do primeiro cenário, com base
  6000 do Brasil), que o fiscal real substitui; fluxo fiscal soma leis + agregados; custo da lei
  orçamentária de valor fixo = nível ÷ 12. Substitui os valores do SG103.
- **Aceite:** um turno do Brasil mostra receita, gasto por lei e por agregado;
  primário ≈ −50/ano e nominal ≈ −950/ano; nada contado duas vezes.
- **Depende de:** SG153 · **Libera:** SG141.

#### SG141 — Mecanismos não lineares no motor · M

- **Objetivo:** relações que não são retas (princípio 5 do projeto).
- **Tarefas:** mecanismo de **razão** (um nó dividido por outro, ex.: gasto ÷
  PIB, para D-40); mecanismos genéricos e testados: **saturação** (efeito com teto),
  **retornos decrescentes** (cada unidade a mais rende menos) e **limiar**
  (efeito só acima/abaixo de um ponto); selecionados e parametrizados no JSON
  da consequência; explicação do passo informa o mecanismo.
- **Aceite:** testes unitários de cada mecanismo; consequência com mecanismo
  desconhecido é recusada; mecanismos antigos inalterados.
- **Depende de:** SG136 · **Libera:** SG154.

#### SG154 — Leis e bolhas no motor · M

- **Objetivo:** aplicar D-40 a D-43 no motor.
- **Tarefas:** tipos de nó lei / índice / situação; índices e situações sem
  valor inicial nem base (valor = resultado das influências); influência
  sobre lei com alvo `eficacia` ou `apoio`; efeito da lei = nível × eficácia;
  ordem do mês (D-42) com detecção de ciclo entre bolhas; situação com
  limiar de surgimento e intensidade; intensidade de cada nó no resultado do
  passo; explicação de cada elo; país deixa de declarar valores de índice.
- **Aceite:** o exemplo de `rede-viva.md` roda em teste (crise nasce, pede
  mais verba, reduz a eficácia e some quando a verba sobe); pacote com valor
  declarado para índice é recusado; mesma entrada → mesmo resultado.
- **Depende de:** SG141 · **Libera:** SG142.

#### SG142 — Rede de indicadores do Brasil · M

- **Objetivo:** o coração do jogo: ~35 indicadores em camadas (social,
  econômica, fiscal, institucional) ligados por cadeias causais.
- **Tarefas:** migrar as situações antigas (arquivos `situacao` com
  entraQuando/saiQuando, ex.: sobrecarga do atendimento) para nós
  `situacao` com surgimento; recalibrar a rede sem bases (hoje quase toda
  em zero, porque foi calibrada como "desvio em torno da base"); indicadores
  e consequências em JSON (hipóteses marcadas), por
  exemplo educação → qualificação → produtividade → emprego → renda →
  arrecadação; saúde → produtividade; violência → investimento; com atrasos e
  os mecanismos do SG141; documento curto com o mapa das cadeias.
- **Aceite:** nenhum indicador isolado; cada indicador tem ao menos uma origem
  e um destino; teste de 20 turnos sem valor inválido; nenhum valor de índice
  declarado pelo país (D-41); cada nó com suas listas de positivos e
  negativos. Guias: [`rede-viva.md`](docs/arquitetura/rede-viva.md),
  [`mecanismos-da-rede.md`](docs/arquitetura/mecanismos-da-rede.md).
- **Depende de:** SG154 · **Libera:** SG155.

#### SG155 — Fichas de lei · M

- **Objetivo:** ter o projeto das leis antes de colocá-las no jogo (R-11,
  agora por fichas em vez de camadas).
- **Tarefas:** método e perguntas da ficha (`docs/fichas/METODO.md`);
  catálogo de bolhas e grupos; pesquisa em 10 áreas com leis de vários
  países; checagem por regras (`scripts/fichas/fichas.py`); documento
  gerado `docs/fichas/LEIS.md`; limpeza das bolhas novas repetidas.
- **Aceite:** o autor aprova as fichas (área por área) e a lista de bolhas
  novas; `fichas.py checar` sem erros.
- **Depende de:** SG142 · **Libera:** SG156.

#### SG156 — Conversor de fichas para o jogo · M

- **Objetivo:** a ficha aprovada vira JSON do mundo sem trabalho manual.
- **Tarefas:** substituir `scripts/camadas/gerar.py` por um conversor que lê
  as fichas aprovadas e cria lei v2, variável de controle, bolhas e
  consequências; força (fraca/média/forte) → parâmetros padrão; atraso →
  resposta temporal; condição de opção → limiar; cada efeito vira teste de
  sentido na simulação; só acrescenta, nunca sobrescreve (D-44).
- **Aceite:** converter Economia e Instituições, `npm run check` verde e os
  testes de sentido passando.
- **Depende de:** SG155 · **Libera:** SG137.

#### SG157 — Orçamento na rede · G

- **Tarefas:** D-47 a D-50, em quatro fases descritas em
  [`orcamento-na-rede.md`](docs/arquitetura/orcamento-na-rede.md): (1) produto
  entre nós no motor; nós de receita, gasto, juros, resultado e dívida em R$;
  impostos e leis de gasto ligados; agregados removidos; turno lê a dívida da
  rede; barra superior Receita · Gasto · Resultado · Dívida; (2) custo de
  todas as leis e custos que reagem; (3) calibração do Brasil (déficit inicial
  visível) e situação de juros; (4) cofre e empréstimos (estudo).
- **Absorve:** SG137, SG138, SG139 e SG105 (os quatro passam a ser fases ou
  partes deste chamado).
- **Aceite da fase 1:** subir a alíquota do IVA aumenta a receita no mesmo
  turno; queda do consumo reduz a receita nos turnos seguintes; déficit soma
  na dívida e superávit abate; uma única dívida no jogo.
- **Depende de:** SG156 · **Libera:** SG143.

#### SG137 — Leis orçamentárias completas · M

- **Tarefas:** modo `percentual_orcamento` (pisos da saúde e da educação);
  converter as leis orçamentárias das fichas pelo SG156; agregados reduzidos
  no mesmo valor.
- **Aceite:** piso a 15% gasta 15% da receita; orçamento total inalterado.
- **Depende de:** SG156 · **Libera:** SG138.

#### SG138 — Leis regulatórias com opções · M

- **Tarefas:** converter as leis regulatórias e institucionais das fichas;
  custo por opção relativo ao PIB; **lei filha que exige uma opção da mãe**
  (e cai quando a mãe muda); ligação com a rede.
- **Aceite:** trocar de opção muda custo e consequências; nenhuma lei com
  menos de 3 opções.
- **Depende de:** SG137 · **Libera:** SG139.

#### SG139 — Leis tributárias · P

- **Tarefas:** imposto de renda e sobre consumo; a **base é indicador da rede**
  (renda, consumo), fechando o ciclo decisão → economia → arrecadação.
- **Aceite:** subir a alíquota aumenta a receita; queda de emprego reduz a
  base e a receita nos turnos seguintes.
- **Depende de:** SG138 · **Libera:** SG143.

#### SG143 — Grupos sociais como nós da rede · M

- **Objetivo:** a política nasce da rede (D-30).
- **Tarefas:** grupos (trabalhadores, classe média, empresários, idosos,
  servidores, jovens, agro, etc.) como nós de tipo `grupo`; satisfação
  alimentada por indicadores e leis via consequências; popularidade do governo
  = agregação dos grupos pelos perfis da população; peso dos juros → grupos
  (antigo SG121); reaproveitar `socialSupport.ts` onde couber.
- **Aceite:** satisfação explicável por origens; perfis sem dupla contagem;
  popularidade inicial vem do país (vencedor de eleição, D-35).
- **Depende de:** SG139 · **Libera:** SG104.

#### SG104 — Implantação mensal calculada pela partida · M

- **Tarefas:** `advancePolicyImplementation`; `prepareGameQuarter` gera os 3
  estados mensais (fecha C6).
- **Aceite:** convergência igual à do SG057-A; revogação nunca sobe o nível.
- **Depende de:** SG143 · **Libera:** SG105.

#### SG105 — Fiscal no turno real · P

- **Aceite:** 16 turnos do Brasil sem erro; juros da emissão só no mês
  seguinte; uma única fonte de caixa e dívida.
- **Depende de:** SG104 · **Libera:** SG106.

#### SG106 — Ocorrências na partida · M

- **Tarefas:** situações, eventos e dilemas no estado da partida (fecha C8).
- **Depende de:** SG105 · **Libera:** SG107.

#### SG107 — Diário do turno com causas · P

- **Aceite:** cada mudança relevante de indicador ou grupo tem causa no diário.
- **Depende de:** SG106 · **Libera:** SG108.

#### SG108 — Caso de uso `advanceTurn` v1 · M

- **Tarefas:** prepara 3 meses → commit atômico; falha descarta tudo.
- **Aceite:** falha no mês 2 preserva a partida; retentativa dá o mesmo resultado.
- **Depende de:** SG107 · **Libera:** SG144.

#### SG144 — Prova da propagação · P

- **Objetivo:** demonstrar o coração do jogo por teste.
- **Tarefas:** roteiros com sementes fixas: (a) aumentar educação → após N
  turnos qualificação, produtividade, emprego e arrecadação sobem, com custo
  fiscal antes; (b) subir imposto → receita sobe e grupos afetados reagem;
  (c) saturação: dobrar um gasto já alto rende pouco.
- **Aceite:** os três roteiros passam e o diário explica cada elo.
- **Depende de:** SG108 · **Libera:** M2.

---

### M2 — O mapa com a rede real

> **Valor:** o jogador joga turnos pela tela e entende o que aconteceu.

#### SG145 — Limpar o laboratório e ligar o mapa à partida · M

- **Tarefas:** apagar `d4ReferenceSandbox` e as leis geradas (D-33); a
  bancada técnica (`motor-demo.html`) não é mais necessária (autor, 9/out) e
  pode ser removida aqui; remover o
  código morto (`main.tsx`/`GameMap` não montados) ou integrá-lo; o mapa lê o
  `GameState` do Brasil; "Encerrar turno" chama `advanceTurn` (fecha C13).
- **Aceite:** só conteúdo real na tela; avançar 4 turnos muda indicadores,
  caixa e dívida; nenhum componente chama o motor diretamente.
- **Depende de:** — · **Libera:** SG128.

#### SG128 — Ministérios no conteúdo · P

- **Tarefas:** `ministerios/*.json`; lei com `ministerios: [ids]`
  (muitos-para-muitos, fecha C12); texto livre recusado.
- **Depende de:** SG145 · **Libera:** SG129.

#### SG129 — Mapa de influência com a rede real · M

- **Tarefas:** leis nas esferas (sobreposição por ministério múltiplo);
  indicadores e grupos **entre** as esferas; seleção destaca causas e efeitos
  reais; nomes legíveis (sem abreviações tipo "FERR·CARG").
- **Aceite:** as leis do Brasil aparecem nas esferas certas; clicar destaca as
  consequências reais do JSON.
- **Depende de:** SG128 · **Libera:** SG146.

#### SG146 — "Por que mudou?" · P

- **Tarefas:** ao clicar num indicador ou grupo: variação no turno e as causas
  (lei, indicador, evento), com atraso indicado.
- **Depende de:** SG129 · **Libera:** SG147.

#### SG147 — Painel da lei · M

- **Tarefas:** controle conforme o grupo (valor, %, opções, alíquota) dentro
  dos limites; gasto ou receita por ano e por mês (D-28); nível desejado ×
  implantado; consequências previstas. Mudança executiva vale no turno.
- **Depende de:** SG146 · **Libera:** SG130.

#### SG130 — Ajuda mínima · P

- **Aceite:** uma pessoa faz a primeira decisão só com a ajuda.
- **Depende de:** SG147 · **Libera:** M3.

---

### M3 — Ciclo político sobre a rede

> **Valor:** mandato completo jogável: propor, votar, governar e enfrentar a
> eleição, com apoio vindo dos grupos da rede.

#### SG148 — Senado simplificado · P

- **Tarefas:** cadeiras como total por partido (sem UF no MVP; UF vai ao
  backlog B-15); coalizão; validação.
- **Depende de:** — · **Libera:** SG111.

#### SG111 — Porta única de validação de ações · P

- **Tarefas:** `aceita | rejeita | exige-proposta` com motivo; sem sorteio.
- **Depende de:** SG148 · **Libera:** SG112.

#### SG112 — Probabilidade de voto pela rede · P

- **Tarefas:** probabilidade = base + afinidade do partido + satisfação dos
  grupos ligados à lei (SG143); pesos no JSON; estimativa não consome sorteio.
- **Depende de:** SG111 · **Libera:** SG113.

#### SG113 — Votação no fechamento do turno · M

- **Aceite:** empate não aprova; rejeitada preserva a política anterior;
  retentativa usa os mesmos sorteios (fecha C10).
- **Depende de:** SG112 · **Libera:** SG114.

#### SG114 — Prazo e adiamento pelo conteúdo · P

- **Depende de:** SG113 · **Libera:** SG140.

#### SG140 — Leis institucionais · P

- **Tarefas:** leis eleitorais e de processo legislativo no grupo
  `institucional`.
- **Depende de:** SG114 · **Libera:** SG122.

#### SG122 — Mandato e calendário eleitoral · P

- **Depende de:** SG140 · **Libera:** SG124.

#### SG124 — Eleição presidencial pela rede · M

- **Tarefas:** votos por perfil derivados da satisfação dos grupos; maior
  total vence; Senado renovado de forma simplificada; d20 só em empate real.
- **Depende de:** SG122 · **Libera:** SG125.

#### SG125 — Fechamento eleitoral no turno · M

- **Aceite:** vitória preserva o país; derrota encerra (fecha C11).
- **Depende de:** SG124 · **Libera:** SG115.

#### SG115 — Tela: propor, votar e eleição · M

- **Tarefas:** propor pelo painel da lei, estimativa de apoio, resultado da
  votação; tela de resultado eleitoral e continuidade.
- **Depende de:** SG125 · **Libera:** SG126.

#### SG126 — Teste de partida completa · P

- **Tarefas:** 32 turnos com sementes fixas; substitui `politicalPath.demo`
  (fecha C2).
- **Depende de:** SG115 · **Libera:** M4.

---

### M4 — Partido e personagens

> **Valor:** a identidade do jogo — o partido do jogador e o rosto do governo.

#### SG149 — Novo jogo: o partido do jogador · P

- **Tarefas:** tela inicial pede nome, sigla e cor (sem ideologia, D-34);
  partida começa com a popularidade de quem venceu a eleição (do país).
- **Depende de:** — · **Libera:** SG150.

#### SG150 — Banco de retratos · P

- **Tarefas:** pasta `public/personagens/retratos/` só com imagens geradas por
  IA; metadados no nome do arquivo:
  `<genero>_<faixa-etaria>_<numero>.png` (ex.: `f_45-59_03.png`); validador
  recusa nome fora do padrão.
- **Depende de:** SG149 · **Libera:** SG151.

#### SG151 — Gerador de personagens · M

- **Tarefas:** `nomes.json` (por gênero) e `historias.json` (com tags que se
  relacionam: origem, carreira, eventos ligados entre personagens); presidente,
  vice e ministros gerados na partida com nome, cargo, história e retrato
  compatível (gênero e idade); gerador com semente salva (D-32).
- **Aceite:** a mesma semente gera o mesmo governo; nunca nome e retrato de
  gêneros diferentes; histórias relacionadas são coerentes entre si.
- **Depende de:** SG150 · **Libera:** SG152.

#### SG152 — Rosto do governo no mapa · M

- **Tarefas:** presidente e vice no centro com retratos; ministros com retrato
  nas suas esferas; ficha do personagem (nome, cargo, história).
- **Depende de:** SG151 · **Libera:** M5.

---

### M5 — Salvar e restaurar → **MVP**

#### SG131 — Formato do arquivo de partida · M

- **Tarefas:** `GameState` + execução + gerador + personagens + identidade do
  conteúdo + versão de esquema; save incompatível recusado com motivo.
- **Depende de:** — · **Libera:** SG132.

#### SG132 — Restauração equivalente · P

- **Aceite:** contínua × restaurada idênticas antes e depois de uma eleição.
- **Depende de:** SG131 · **Libera:** SG133.

#### SG133 — Tela: exportar e importar · P

- **Depende de:** SG132 · **Libera:** SG134.

#### SG134 — Marco MVP verificado · P

- **Tarefas:** os 3 critérios de sucesso pela tela + teste de partida completa.
- **Depende de:** SG133 · **Libera:** M7–M11.

---

## 5. Ordem e caminho crítico

Cada marco é uma fila única (cada chamado depende só do anterior), o que
cumpre R-01 e R-02 por construção.

```text
M0  SG100 → SG101 → SG102 → SG103                                    ✅
M1  SG135 → SG153 → SG136 → SG141 → SG154 → SG142 → SG155 → SG156 → SG145 → SG137 → SG138 → SG139 → SG143
    → SG104 → SG105 → SG106 → SG107 → SG108 → SG144
M2  SG128 → SG129 → SG146 → SG147 → SG130
M3  SG148 → SG111 → SG112 → SG113 → SG114 → SG140 → SG122 → SG124
    → SG125 → SG115 → SG126
M4  SG149 → SG150 → SG151 → SG152
M5  SG131 → SG132 → SG133 → SG134 (MVP)
```

**Total:** 47 chamados — 12 feitos + 35 a fazer. **Estimativa:** ~65 sessões (P = 1, M = 2);
referência, não prazo.

---

## 6. Correspondência com os IDs antigos

| ID antigo                                  | Destino neste plano                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| SG057-B (regras políticas)                 | SG110, SG112–SG114, SG122                                                 |
| SG058-A (reação dos grupos) + FIX-V1-01/06 | SG116–SG118, SG121                                                        |
| SG058-B (apuração) + FIX-V1-05/08          | SG122–SG125                                                               |
| SG059 (validação)                          | SG111                                                                     |
| SG060-A/B (fiscal)                         | já existe; ligado em SG103, SG105                                         |
| SG061 (turno inteiro)                      | dividido: SG108 (meses), SG113 (votação), SG117 (social), SG125 (eleição) |
| SG062–SG064                                | SG119, SG126                                                              |
| SG065–SG072 (interface)                    | SG109, SG115, SG120, SG127, SG129, SG130                                  |
| SG081–SG083 (save)                         | SG131–SG133                                                               |
| FIX-V1-03, FIX-V1-07                       | M8                                                                        |
| FIX-V1-09                                  | resolvido pelas decisões D-05, D-06, D-11                                 |
| FIX-V1-10                                  | regra anti-ciclo R-07                                                     |
| SG058-C, SG058-D, SG060-C                  | backlog (B-01, B-02, B-03)                                                |
| SG073–SG080, SG084–SG096                   | M7, M11 (detalhar ao abrir)                                               |

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

- **R-11 Leis novas por camadas.** Antes de escrever leis, fazer pesquisa e
  montar o mapa por camadas: **camada 1** = pilares do país (ex.: PIB,
  Constituição, alerta de crise financeira); **camada 2** = o que deriva da
  camada 1; e assim por diante, recursivamente, até uma camada aceitável.
  Cada camada lista as bolhas principais, o que deriva delas e o que deriva
  das derivadas. Só então escrever os JSONs.

---

## 8. Backlog (fora do MVP, com motivo)

| ID   | Item                                                                                                                                                                                    | Motivo                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| B-01 | SG058-C capacidade e demanda                                                                                                                                                            | Retornos decrescentes e saturação promovidos ao SG141 (9/out)                                     |
| B-02 | SG058-D governança, desvio, fiscalização                                                                                                                                                | Evolução                                                                                          |
| B-03 | SG060-C crédito e bancos agregados                                                                                                                                                      | Escopo da V1 exclui bancos; código mantido, desconectado do turno                                 |
| B-04 | Inflação, rating, crise fiscal, vencimentos, rolagem                                                                                                                                    | Excluídos da V1                                                                                   |
| B-05 | Segundo turno presidencial                                                                                                                                                              | Excluído da V1; a lei eleitoral já permite acrescentar o mecanismo                                |
| B-06 | Campanha eleitoral (ações nos 5 turnos anteriores)                                                                                                                                      | Decisão de 9/out: sem ações vazias; exige catálogo próprio                                        |
| B-07 | Reconciliação da ficha fiscal com dados oficiais (RTN/RMD)                                                                                                                              | MVP usa hipótese marcada (SG103)                                                                  |
| B-08 | Mecânica individual de personagens (influência, lealdade, substituição com consequência)                                                                                                | M10; geração de nome, história e retrato entrou no MVP (SG151)                                    |
| B-09 | Manual de conteúdo e mods                                                                                                                                                               | Depois da publicação                                                                              |
| B-10 | Reavaliar tecnologia gráfica (PixiJS foi descartado)                                                                                                                                    | Mapa atual em SVG/DOM atende o MVP                                                                |
| B-11 | Distribuição desktop/Steam                                                                                                                                                              | Depois da versão web                                                                              |
| B-12 | Migração física de pastas (`engine` → `simulation`)                                                                                                                                     | Só com fronteiras provadas; sem valor jogável agora                                               |
| B-13 | Editor de conteúdo, contas, nuvem                                                                                                                                                       | Fora do escopo                                                                                    |
| B-14 | ~~Laboratório de 100+ políticas~~                                                                                                                                                       | Será apagado no SG145 (D-33)                                                                      |
| B-16 | IA para animar a rede viva                                                                                                                                                              | Ideia do autor (9/out); fora do escopo atual                                                      |
| B-15 | Senado por UF: cadeiras, vencimentos, renovação 2/1, apuração por UF (antigos SG110, SG123)                                                                                             | Fora do MVP pelo alinhamento D-30; código existente preservado                                    |
| B-17 | Lei de opções com verba: ao escolher uma opção como "expandir" (ex.: energia nuclear), o jogador também define quanto investir na expansão                                              | Ideia do autor (10/out); depois do SG157, que dá custo a cada opção                               |
| B-18 | Desgaste do poder: quanto mais tempo o mesmo partido governa (8 anos com o mesmo presidente, ou mais com sucessores), mais crescem a desconfiança e a corrupção dentro dele             | Ideia do autor (10/out); um estoque "tempo no poder" ligado a corrupção e confiança, com eleições |
| B-19 | Leis de Estado × leis de governo: algumas levam mais que um mandato (4 anos) para dar resultado, outras são rápidas; equilibrar prazos para o jogador ter o que mostrar em cada mandato | Ideia do autor (10/out); usa atrasos e `respostaTemporal` das leis                                |
| B-20 | Vários cenários do mesmo país (Brasil 2003, Brasil 2026…): cada um com seu estado inicial e seus índices (D-55)                                                                         | Ideia do autor (10/out); hoje só Brasil 2026                                                      |
| B-21 | Sensação de jogo, "só mais uma coisinha" (problema C16): metas curtas visíveis (ex.: "tire 3 grupos do vermelho"), recompensa clara ao fechar o turno, algo pendente sempre à vista (lei em implantação, dilema chegando, eleição se aproximando), progresso do mandato | Problema registrado pelo autor (11/out); exige desenho próprio antes de virar chamado (R-06) |
| B-22 | Extinguir e criar ministérios na partida: o jogador corta (ou recria) um ministério; leis passam para outra pasta ou deixam de existir, conforme a regra `extincao` de cada ministério (D-64) | Ideia do autor (10/out); a regra já está no conteúdo e em `extinguirMinisterio` (testada), falta a ação na partida e o efeito (custo, apoio) |

---

## 9. Decisões tomadas (não rediscutir)

| ID   | Decisão                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Data      | Fonte                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| D-01 | Turno = 3 meses (design). Mandato de 4 anos = 16 turnos no Brasil atual                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 03–09/out | SG057-A; confirmado na Fase 2                                    |
| D-02 | 3 passos mensais por turno (técnica, revisável). Manter SG057-A e FIX-V1-02                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 09/out    | Fase 2                                                           |
| D-03 | Motor não conhece nomes de leis, partidos ou países; só variáveis e relações                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 08/out    | contrato-motor-json; reafirmado na Fase 2                        |
| D-04 | Catálogo de leis comum; país declara só o estado inicial; lei ausente não é proibida                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 08/out    | contrato-motor-json                                              |
| D-05 | ~~Substituída por D-32.~~ Personagens no MVP: só visuais (nome, retrato, partido, cargo, vínculo); estrutura pronta para mecânica futura                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 09/out    | Fase 2                                                           |
| D-06 | Ordem do jogo: (1) ciclo básico → (2) instituições, reforma e ruptura → (3) personagens com mecânica                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 09/out    | Fase 2                                                           |
| D-07 | Golpe e reforma constitucional são sistemas distintos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 09/out    | Fase 2                                                           |
| D-08 | Senado simulado por UF, com cadeiras, vencimentos e renovação 2/1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 09/out    | Fase 2                                                           |
| D-09 | Ministério ↔ política é muitos-para-muitos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 09/out    | Fase 2                                                           |
| D-10 | Presidência em turno único; maior total nacional vence; empate eleitoral por d20                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 07–08/out | plano antigo                                                     |
| D-11 | Campanha fora do MVP (sem ações vazias)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 09/out    | plano-fechamento-sg057b-sg059                                    |
| D-12 | Votação parlamentar com acaso controlado; empate não aprova; estimativa não consome sorteio                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 07–08/out | plano antigo                                                     |
| D-13 | Tramitação: vota no próximo fechamento; 1 adiamento; máximo 2 turnos; nunca aprovação automática                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 07/out    | plano antigo                                                     |
| D-14 | Votação no fechamento usa a composição anterior à renovação do Senado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 08/out    | plano antigo                                                     |
| D-15 | Economia V1: receitas, despesas, caixa, dívida, emissão automática, juros simples da dívida nova a partir do mês seguinte; juros herdados separados                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 07/out    | primeira-versao                                                  |
| D-16 | Apoio social recalculado da base a cada mês (sem acúmulo), saturado em [0,100] e redistribuído somando 100                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 08–09/out | B2, plano-fechamento                                             |
| D-17 | Partidos, grupos, pesos e preferências do Brasil são hipóteses marcadas, não dados reais                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 09/out    | plano-fechamento                                                 |
| D-18 | Limite de reavaliação: 3 iterações por chamado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 09/out    | este plano (assumida; confirmar)                                 |
| D-19 | Código sem commit do GPT é base a revisar (SG100), não entrega aceita                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 09/out    | este plano (assumida; confirmar)                                 |
| D-20 | SG060-C fica no backlog, com o código preservado                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 09/out    | este plano (assumida; confirmar)                                 |
| D-21 | O MVP inclui interface jogável (critério de sucesso 1 exige observar na tela)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 09/out    | primeira-versao; este plano                                      |
| D-22 | Projeto pessoal e local: trabalho direto na `main`, sem branch por chamado, PR, GitHub Project ou CI como aceite. Aceite = `npm run check` verde na máquina local. Push ao GitHub é opcional                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 09/out    | decisão do autor                                                 |
| D-23 | Leis em quatro grupos: orçamentária, regulatória, tributária, institucional                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 09/out    | decisão do autor                                                 |
| D-24 | O JSON da lei não tem quantidade, só limites e opções; o nível vem do país (vigente no início) ou do jogador                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 09/out    | decisão do autor                                                 |
| D-25 | Lei orçamentária: modo valor fixo ou % do orçamento                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 09/out    | decisão do autor                                                 |
| D-26 | Lei regulatória sempre tem opções (mínimo 3); não existe lei de sim/não                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 09/out    | decisão do autor                                                 |
| D-27 | Limites e custos em dinheiro na lei são relativos (% do PIB ou do orçamento); o país pode declarar limites próprios absolutos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 09/out    | este plano                                                       |
| D-28 | O gasto ou a receita de cada lei está sempre visível (ano e mês)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 09/out    | decisão do autor                                                 |
| D-29 | Valores do Brasil: inventados, mas nas proporções aproximadas do país (R$ bi/ano, PIB 12.000); receitas e despesas fora das leis entram como agregados                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 09/out    | decisão do autor                                                 |
| D-30 | **Prioridade = a rede do país.** Decisões se propagam por leis e indicadores; o ciclo político (apoio, votação, eleição) é derivado da rede, não um sistema paralelo. Marcos a reordenar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 09/out    | alinhamento com o autor                                          |
| D-31 | O jogador é um partido que acabou de vencer a eleição; no início da partida ele dá nome ao partido                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 09/out    | alinhamento com o autor                                          |
| D-32 | Personagens na V1: retratos gerados por IA ficam numa pasta própria (só imagens); nome, cargo e história são gerados na partida a partir de JSONs de nomes e de histórias que se relacionam                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 09/out    | alinhamento com o autor; substitui D-05                          |
| D-33 | As ~100 leis do laboratório (`d4ReferenceSandbox`) eram exemplos visuais e podem ser apagadas; o mapa passa a mostrar só conteúdo real                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 09/out    | alinhamento com o autor                                          |
| D-34 | Partido do jogador: nome, sigla e cor; sem ideologia escolhida (o jogador se descobre jogando)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 09/out    | alinhamento com o autor                                          |
| D-35 | A partida começa com a popularidade de quem venceu a eleição (valor do país, hipótese)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 09/out    | alinhamento com o autor                                          |
| D-36 | Retratos: gênero e faixa etária ficam no nome do arquivo (`<genero>_<faixa>_<n>.png`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 09/out    | alinhamento com o autor                                          |
| D-37 | Senado por UF (D-08) sai do MVP; no MVP o Senado é total por partido                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 09/out    | consequência de D-30                                             |
| D-38 | **Mundo × país.** Leis, indicadores, consequências, eventos, situações e grupos são do mundo (valem para todos). Um país é só um pacote inicial: leis vigentes e níveis, valores iniciais, limites próprios, moeda, economia, perfis e partidos                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 09/out    | alinhamento com o autor                                          |
| D-39 | As consequências são universais e determinísticas: mesma força em todo país, sem ajuste por país. Diferenças entre países vêm do estado inicial dos nós (ex.: fentanil existe no mundo, alto nos EUA e zero no Brasil). Tudo que tem peso está na rede                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 09/out    | alinhamento com o autor                                          |
| D-40 | **Não existe número escondido.** Tudo que afeta um valor é um nó visível (lei, evento, situação, índice), explicado recursivamente pelos nós que o afetam. (Substitui a leitura anterior de "% do PIB": o PIB importa e país rico gasta mais.) Modelo: [`rede-viva.md`](docs/arquitetura/rede-viva.md)                                                                                                                                                                                                                                                                                                                                                                                                                      | 09/out    | alinhamento com o autor                                          |
| D-41 | (alterada pela D-55: índice recebe também o contexto do cenário) **Tudo é bolha**; o tipo muda: **lei** (valor próprio; recebe influência na eficácia e no apoio), **índice** e **situação** (sem valor próprio nem base, só o resultado do que recebe), **estoque** (acumula; país declara o inicial), **evento**, **grupo social**. O país não declara valor de índice                                                                                                                                                                                                                                                                                                                                                    | 09/out    | alinhamento com o autor                                          |
| D-42 | Ordem do mês: leis leem as bolhas do mês anterior, depois as bolhas são calculadas em cadeia; ciclo só entre bolhas usa o mês anterior em um elo. A influência de bolha sobre lei chega no mês seguinte                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 09/out    | decisão técnica (este plano)                                     |
| D-43 | Toda bolha tem intensidade: lei pelo valor financeiro ou influência; índice pelo valor; situação pisca e cresce conforme a gravidade                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 09/out    | alinhamento com o autor                                          |
| D-44 | **Os JSONs do mundo são a única fonte da rede.** Não há calibragem automática: cada força é escolhida uma a uma, e a rede fica desequilibrada enquanto faltam leis. Ferramentas só leem os JSONs: `npm run rede:documento` (gera [`docs/conteudo/rede.md`](docs/conteudo/rede.md)) e `npm run rede:simular` (cenários). Equilibrar para o jogador é trabalho do M7                                                                                                                                                                                                                                                                                                                                                          | 09/out    | alinhamento com o autor                                          |
| D-45 | O turno 0 é o país já funcionando: o motor repete o cálculo inicial (sem acumular estoques) até leis e bolhas se acomodarem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 09/out    | SG142 (técnica)                                                  |
| D-46 | Bolhas lentas (acumulam ao longo de anos; o país declara o ponto de partida): **Escolaridade** (geral, sem separar adulto e criança), **Desenvolvimento** e **Infraestrutura** (será subdividida em estradas, ferrovias, mineração… quando vierem as leis). **PIB** é uma bolha da rede                                                                                                                                                                                                                                                                                                                                                                                                                                     | 09/out    | alinhamento com o autor                                          |
| D-47 | **O orçamento é parte da rede.** Receita = soma das bolhas que arrecadam (impostos × base, estatais…); gasto = soma das bolhas que custam (leis de gasto, custo das opções, custos que reagem); resultado = receita − gasto − juros. Nada fora do grafo: os agregados de D-29 e a conta paralela do módulo fiscal saem. Modelo: [`orcamento-na-rede.md`](docs/arquitetura/orcamento-na-rede.md)                                                                                                                                                                                                                                                                                                                             | 10/out    | alinhamento com o autor; substitui D-29 (agregados)              |
| D-48 | **Juros da dívida são uma bolha**, não despesa automática: taxa × dívida; incham e desincham; muito altos viram situação que pisca                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 10/out    | alinhamento com o autor                                          |
| D-49 | **Superávit abate a dívida; o caixa não é o centro.** Só depois de a dívida acabar o superávit vai para um cofre, que pode ser emprestado (efeito no PIB a estudar). O foco é o equilíbrio superávit × déficit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 10/out    | alinhamento com o autor                                          |
| D-50 | Motor: produto entre dois nós pela `normalizacao` (`fator`), além da razão (`divisor`). Único mecanismo novo exigido pelo orçamento na rede (R-09)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 10/out    | este plano, aprovado pelo autor                                  |
| D-51 | **Contas em % do PIB na rede, em R$ na tela.** Receita, gasto, juros, resultado e dívida ficam em % do PIB (o catálogo do mundo não leva reais de nenhum país, D-39); a tela converte pelo PIB nominal do país (`pib_nominal`). A conta de dinheiro de uma lei lê o nível aprovado, sem a eficácia (`"leitura": "nivel"`)                                                                                                                                                                                                                                                                                                                                                                                                   | 10/out    | SG157 fase 1                                                     |
| D-52 | Motor: mecanismo `pontos` (um valor por opção, ligado em retas) para o custo de cada opção, e `escala` (resultado × nó ÷ referência) para custos que reagem ao país. Custos em `docs/fichas/custos.json`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 10/out    | SG157 fase 2                                                     |
| D-53 | **O governo do jogo é o setor público inteiro** (União, estados e municípios juntos, implícitos para o jogador): os pisos de saúde e educação já eram do país todo, e as contas seguem a mesma régua. Metas: receita ≈ 31%, gasto ≈ 31%, juros ≈ 8% do PIB, déficit real ≈ 8% (escolha do autor)                                                                                                                                                                                                                                                                                                                                                                                                                            | 10/out    | SG157 fase 2; segue a fala do autor ("estados ficam implícitos") |
| D-54 | **Resposta das bolhas:** índice e situação andam uma fração do caminho por passo até o valor que recebem (`respostaDasBolhas` do mundo: 0,875 por trimestre, metade por mês). Amortece os ciclos da rede; o turno 0 vira um ponto de equilíbrio                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 10/out    | SG157 fase 3                                                     |
| D-55 | **Contexto do cenário** (altera a D-41): o cenário (ex.: Brasil 2026) declara o valor de cada índice e situação no turno 0 (`indicesIniciais`); a parte que as leis e a rede não explicam vira o nó visível e fixo "Contexto do Brasil 2026". As contas do orçamento não têm contexto (D-47)                                                                                                                                                                                                                                                                                                                                                                                                                                | 10/out    | escolha do autor                                                 |
| D-56 | O que uma lei entrega (nível × eficácia) não passa da opção mais forte; efeito de ficha "só na última opção" começa no meio do caminho desde a penúltima (rampa, não degrau)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 10/out    | SG157 fase 3; tirava a estabilidade da rede                      |
| D-57 | **Cofre = dívida líquida abaixo de zero** (fase 4 da D-49): a dívida pública guarda a posição líquida; sem dívida, o superávit enche o cofre, o cofre rende juros (juros negativos) e cobre déficits antes de qualquer dívida nova. A lei "Uso do cofre" (guardar, fundo no exterior, emprestar às empresas, investir em obras) decide o efeito, proporcional ao tamanho do cofre: emprestar vira crédito e investimento (o caminho até o PIB), obras viram gasto e infraestrutura. Efeito de ficha pode ter valor por opção (`pontos`) e escala                                                                                                                                                                            | 10/out    | SG157 fase 4                                                     |
| D-58 | **Marca do jogador: destaque, não peso.** A partida anda junto com o mesmo país no piloto automático (sem nenhuma decisão do jogador). O que difere entre os dois é do jogador e ganha destaque: lei mudada com aro dourado e caneta (também na esfera), bolha mexida por ele com onda e etiqueta "· você", resumo do turno com "Suas decisões" antes de "O país sozinho", boletim com "Sua marca" e documento com "Mudada por você". O movimento natural fica discreto (etiqueta pequena, sem piscar). A simulação não muda                                                                                                                                                                                                | 10/out    | pedido do autor                                                  |
| D-59 | **Contas sem furos.** Receita, gasto, juros e resultado não têm teto nem amortecimento próprio (`resposta: 1`, domínio aberto): resultado = receita − gasto − juros em todo mês, e todo déficit entra na dívida. Dívida e cofre não têm limite de escala; estoque comum para no limite do domínio em vez de travar a partida. A barra mostra as contas como uma conta: **Entra − Sai = Falta (ou Sobra)**, com os juros dentro do "Sai"                                                                                                                                                                                                                                                                                     | 10/out    | SG159; achados A1, A2 e N1–N4 do relatório de testes             |
| D-60 | **Grupos sociais na rede** (SG143). Os ~30 grupos citados nas fichas viram 11 segmentos do eleitorado, bolhas do tipo `grupo` (satisfação 0–100): pobres, trabalhadores, classe média, jovens, aposentados, servidores, pequenos negócios, agro, empresários, progressistas, conservadores. Cada pessoa conta em um segmento só (pesos somam 1). Leis mexem nos grupos que ganham ou perdem com elas (até 10 pontos de um extremo ao outro, uma ligação por lei e grupo); indicadores mexem no que cada grupo sente (inflação, desemprego, juros…). A aprovação do governo é a média dos grupos pelo peso; a satisfação inicial vem do cenário (D-55) e dá a aprovação de quem venceu a eleição (D-35, ~51% no Brasil 2026) | 10/out    | SG143                                                            |
| D-61 | **Lei filha** (SG138). Uma lei de opções pode declarar `requer: { lei, opcoes, motivo }`: fora da opção de base (a primeira), só vale com a mãe numa das opções listadas; quando a mãe sai delas, a filha cai para a base na mesma ação (em cascata). A regra lê as metas, não o nível implantado; voltar a mãe não religa a filha. Validador: mãe e opções existem, sem ciclo, país começa coerente                                                                                                                                                                                                                                                                                                                        | 10/out    | SG138                                                            |
| D-62 | **Ocorrências na partida** (SG106). Eventos (o país sofre), dilemas (o presidente decide, 2–4 opções, uma padrão sem requisito) e situações no estado da partida. Cada evento e cada opção é um nó-controle (0–1) com setas para as bolhas; liga por alguns meses. Sorteio por hash da semente, do turno e da ocorrência (o piloto, D-58, recebe os mesmos números e responde com a padrão). Chance base × fatores da rede; gatilhos por condição mantida (`porTurnos`), por reação a uma lei mudada e por desdobramento. Nem todo turno tem ocorrência: no máximo 1 evento grande + 1 local e 2 dilemas por turno; o turno não passa com dilema na mesa. Níveis 1–4; catástrofe ao acaso ≤ 0,5%/turno. Textos com variáveis do país (`lugares`) e variantes no conversor; `{ministro}` sai da área até existirem ministros | 11/out    | SG106 |
| D-63 | **Ministérios por tema** (pedido do autor, 11/out). As leis ficam em 12 ministérios, cada um com um tema que o jogador procura: Impostos (Fazenda), Economia e empresas (estatizar/privatizar, juros, câmbio, bancos, comércio), Trabalho, Previdência e assistência, Saúde, Educação e ciência, Infraestrutura e cidades, Meio ambiente e energia, Segurança e justiça, Direitos e sociedade, Defesa e exterior, Instituições e política (Casa Civil). O conversor põe cada lei no ministério da sua área de ficha, com exceções em `MINISTERIO_POR_LEI`; a tela mostra o tema na esfera e o cargo embaixo. O anel se afasta para caber as esferas | 11/out    | SG145 |
| D-64 | **Áreas e ministérios reais** (altera a D-63, pedido do autor, 11/out). O governo do Brasil 2026 tem os **38 ministérios reais** (31 ministérios e 7 órgãos com status de ministério), declarados pelo país em `paises/brasil/ministerios.json` (o mundo não cita país). Para não virar 38 esferas, eles se agrupam em **10 áreas**, uma esfera cada: Economia (Fazenda, Planejamento), Empresas e comércio, Trabalho e proteção social, Saúde e esporte, Educação e cultura, Infraestrutura e energia, Meio ambiente e campo, Segurança e defesa, Direitos e cidadania, Governo e instituições. Cada lei mora em um ministério; a esfera mostra a área e, aberta, as leis em fatias com o nome de cada pasta. Ministério sem lei aparece na área ("sem leis ainda"). Cada ministério extinguível declara `extincao`: o destino padrão das leis e as exceções (outra pasta ou `null` = a lei deixa de existir); ministérios sem `extincao` são o núcleo e não podem ser extintos. O campo `ministerio` das leis do mundo fica só como reserva para país sem estrutura | 11/out | SG128 |

**Reavaliações de chamados (R-05):** _nenhuma até agora._

---

## 10. Checklist de execução (ordem proposta) — **fonte única de status**

Marque `[x]` só com o aceite demonstrado e `npm run check` verde. Anote ao lado:
data, commit e teste.

**M0 — Base**

- [x] SG100 Verificar e versionar o trabalho local — 09/out · `7ca2afd` · check verde, 194 testes / 51 arquivos
- [x] SG101 Consolidar a documentação — 09/out · `81fc845` · check verde
- [x] SG102 Regras de nível lidas do conteúdo — 09/out · `fd196d0` · check verde, 202 testes / 52 arquivos; `policyRulesFromContent.test.ts`, `resolvePackage.test.ts`
- [x] SG103 Ficha fiscal do Brasil (hipótese) — 09/out · `18f4fdb` · valores substituídos pelo SG136 · check verde, 204 testes / 52 arquivos; `prepareGameQuarter.test.ts`, `resolvePackage.test.ts`

**M1 — A rede do país**

- [x] SG135 Formato de lei v2 e catálogo comum — 09/out · `d0d655b` · check verde, 209 testes / 52 arquivos; `resolvePackage.test.ts` (leis v2), `createGame.test.ts`
- [x] SG153 Mundo e país separados — 09/out · `ab160f7` · check verde, 213 testes / 53 arquivos; `worldAndCountry.test.ts`
- [x] SG136 Ficha do país v2: economia e orçamento completo — 09/out · `2533c33` · check verde, 215 testes / 53 arquivos; `prepareGameQuarter.test.ts` (SG136), `preparePolicyFiscalFlows.test.ts`
- [x] SG141 Mecanismos não lineares no motor — 09/out · `0a36409` · check verde, 230 testes / 54 arquivos; `nonLinearMechanisms.test.ts`
- [x] SG154 Leis e bolhas no motor — 09/out · `9926528` · check verde, 237 testes / 55 arquivos; `livingNetwork.test.ts`
- [x] SG142 Rede de indicadores do Brasil — 09/out · `0095f6e` + revisão (escolaridade, desenvolvimento, infraestrutura, PIB; JSON como fonte única) · check verde, 245 testes / 56 arquivos; `worldNetwork.test.ts`
- [x] SG155 Fichas de lei — 09/out · `2d1ddcb` · 117 leis em 10 áreas; aprovadas pelo autor todas as que não colidem (renda-basica-universal pendente)
- [x] SG156 Conversor de fichas para o jogo — 10/out · `cbc0a6e` · 116 leis no mundo, 1216 consequências; testes antigos usam `testes/legado`; check verde, 245 testes
- [x] SG157 Orçamento na rede — aberto e fechado em 10/out (D-47 a D-57); absorve SG137–SG139 e SG105. **Fase 1 feita em 10/out** · `60d18c5`: `normalizacao.fator` e `leitura: "nivel"` no motor; ordem das bolhas por componentes (quem depende de um ciclo espera o ciclo); impostos = alíquota × base, leis de gasto pelo elo contábil, juros = taxa × dívida, resultado → dívida; barra Receita · Gasto · Déficit · Dívida; saldo de cada lei e efeito no resultado no documento. Check verde, 290 testes / 61 arquivos; `produtoEntreNos.test.ts`, `orcamentoNaRede.test.ts`. Brasil começa com déficit de 8,2% do PIB. **Fase 2 feita em 10/out** · `c7a9e39` (D-52, D-53): mecanismos `pontos` e `escala`; custo de cada opção de 69 leis em `docs/fichas/custos.json`; seguro-desemprego, previdência e pensões reagem ao país; estatais, royalties e renúncias; cada opção mostra o seu custo no documento. Check verde, 301 testes / 62 arquivos; `custosDasLeis.test.ts`. Brasil começa com déficit de 6,8% do PIB (setor público inteiro). **Fase 3 feita em 10/out** · `e4abdd4` (D-54 a D-56): resposta das bolhas, contexto do Brasil 2026 (108 índices declarados), teto do efeito das leis, situação "juros explosivos". Turno 0 = Brasil 2026 (inflação 5%, desemprego 6%, juros 15%); receita 31,4%, gasto 31%, juros 8,1%, déficit 7,7% do PIB; 8 turnos sem ação: nenhum índice pula mais de 3% da escala; juros explosivos surgem no 3º ano se nada for feito. Check verde, 309 testes / 63 arquivos; `brasil2026.test.ts`. **Fase 4 feita em 10/out** · `282e8ce` (D-57): cofre como dívida líquida negativa, rendimento do cofre, situação "Cofre do Tesouro", lei "Uso do cofre" (fundo soberano) com efeitos por opção escalados pelo cofre; barra mostra Cofre no lugar da Dívida. Check verde, 315 testes / 64 arquivos; `cofre.test.ts`. Pendências que voltam para os chamados absorvidos: pisos como % da receita (SG137), lei filha (SG138), retirar o módulo fiscal antigo do turno (SG105).
- [x] SG137 Leis orçamentárias completas — 10/out · `540c291` (D-25) · check verde, 336 testes / 68 arquivos; `pisosVinculados.test.ts`. A conversão e o elo contábil saíram no SG157; aqui os pisos da saúde e da educação viraram % da receita (vinculação: 13,69% e 17,51% no Brasil 2026, o mesmo dinheiro de antes). Subir imposto aumenta saúde e educação; recessão corta as duas
- [x] SG138 Leis regulatórias com opções — 10/out · `cf334a5` (D-61) · check verde, 343 testes / 69 arquivos; `leisFilhas.test.ts`. Custo por opção saiu no SG157 (D-52); aqui a lei filha: `requer` no conteúdo, recusa fora da base, queda em cascata quando a mãe muda, aviso no documento antes de assinar. Exemplos: meta de inflação ← câmbio não fixo; previdência rural e pensão por morte ← previdência obrigatória; câmeras corporais ← polícia profissional. Todas as leis de opções têm 3 ou mais opções
- [x] SG139 Leis tributárias — feito no SG157 fase 1 (alíquota × base da rede; `orcamentoNaRede.test.ts`)
- [x] SG143 Grupos sociais como nós da rede — 10/out · `816fc65` (D-60) · check verde, 329 testes / 67 arquivos; `gruposSociais.test.ts`. 11 segmentos, 515 ligações; aprovação na barra (51% no início) com o boletim de cada grupo. O módulo político antigo (`politica` do estado inicial, partidos e perfis sintéticos) fica para o ciclo eleitoral (M3). Complemento 10/out · `00e315d` · check verde, 332 testes: grupos com visual próprio (medalhão hexagonal roxo, raio 58→104, anel externo, nome sempre legível) e lista lateral `PainelGrupos` (do mais ao menos satisfeito, o que mais gostam e odeiam)
- [x] SG104 Implantação mensal pela partida — 10/out · `230adb3` · `turnoSemFiscalAntigo.test.ts`. Versão feita no SG145 (`advancePolicyImplementation`: a partida calcula os 3 estados mensais e a lei anda até a meta pela `respostaTemporal`, fração por turno); aceite provado agora: sobe de forma monótona até a meta e revogar nunca sobe o nível
- [x] SG105 Fiscal no turno real — 10/out · `230adb3` · check verde, 322 testes / 64 arquivos; `turnoSemFiscalAntigo.test.ts`. Saíram o livro fiscal paralelo (`domain/fiscal`, `GameState.fiscal` e `credit`, ficha `fiscal` do estado inicial com agregados e crédito, relatório fiscal do trimestre e seus testes): caixa e dívida existem uma vez, na rede. 16 turnos do Brasil sem erro; o juro da dívida nova só entra no mês seguinte
- [x] SG106 Ocorrências na partida — 11/out · `c88f54a` (D-62) · check verde, 336 testes / 66 arquivos; `ocorrencias.test.ts`, `ocorrenciasVariedade.test.ts`. 78 eventos e 91 dilemas em `docs/fichas/ocorrencias/` (7 áreas, com variantes); mesa do presidente com prévia, jornal do turno, "acontecendo agora", ocorrência em curso entre as causas do boletim. Em 80 turnos: ~65 eventos, ~45 dilemas, 80–95 ocorrências distintas, nenhuma mais de 3 vezes, ~15 turnos calmos. Fecha C8
- [ ] SG107 Diário do turno com causas
- [ ] SG108 `advanceTurn` v1
- [ ] SG144 Prova da propagação

**M2 — O mapa com a rede real**

- [x] SG159 Contas sem furos (D-59) — 10/out · `f056a08` · check verde, 324 testes / 66 arquivos; `contasSemFuros.test.ts`. A1 (dívida/cofre travavam o turno), A2 (teto e amortecimento descartavam déficit), N1 (controle oferecia teto recusado), N2 (prévia some perto da crise: agora mostra o trecho calculado), N3 (horizonte da prévia validado, 1–20 trimestres), N4 (repetir a meta não vira ação); barra Entra − Sai = Falta/Sobra. Os achados B1–B5 (equilíbrio de conteúdo) seguem para SG138 e calibração
- [x] SG158 Marca do jogador (D-58) — 10/out · `3694f7d` · check verde, 318 testes / 65 arquivos; `marcaDoJogador.test.ts`. Piloto automático na partida (`Partida.piloto`), `porVoce`/`sozinho` no relatório, `alteradaPorVoce` e `semVoce` na visão; destaque dourado no mapa, no resumo e nos documentos
- [ ] SG145 Limpar o laboratório e ligar o mapa à partida — adiantado para depois do SG156 (autor, 10/out). Atualização visual em 10/out: mapa principal refeito com dez esferas resumidas, expansão de leis, painel contextual, zoom e arraste limitados; usa somente `verPartida`. Commit `72af590`; `npm run check` verde (57 arquivos, 249 testes). O chamado segue aberto: o laboratório antigo ainda precisa ser removido e os dados de ocupantes/aprovação/estimativas precisam entrar na API quando estiverem disponíveis. Refeito de novo em 10/out (commit `7abef55`): tela em React em `src/ui/mapa/` (substitui `lawMapDemo.ts`); a Presidência guarda as 38 leis de emenda constitucional na lente onde cada esfera a cobre; foco revela leis ligadas nas esferas fechadas; prévia de 3 meses pelo motor (`preverLei`); `atrasoMeses` corrigido (estava ×3). `npm run check` verde (58 arquivos, 269 testes). Retratos são provisórios até o SG150/SG152. Ajuste 11/out · `7c52067` (D-63, pedido do autor): 12 ministérios por tema; letras maiores na barra, nos documentos e na mesa do dilema (efeitos em cor cheia com legenda bom/ruim); vista inicial no anel e esferas que viram cartaz de tema de longe; navegação por borda da tela, roda do mouse, dois dedos e pinça no touchpad, setas/WASD e inércia; lupa de leis ("/" ou Ctrl+K) com palavras do dia a dia (privatizar, estatizar, juros…) e "onde fica cada assunto"; `buscaDeLeis.test.ts`; check verde, 343 testes / 67 arquivos
- [ ] SG128 Ministérios no conteúdo
- [ ] SG129 Mapa de influência com a rede real
- [ ] SG146 "Por que mudou?"
- [ ] SG147 Painel da lei
- [ ] SG130 Ajuda mínima

**M3 — Ciclo político sobre a rede**

- [ ] SG148 Senado simplificado
- [ ] SG111 Porta única de validação
- [ ] SG112 Probabilidade de voto pela rede
- [ ] SG113 Votação no fechamento
- [ ] SG114 Prazo e adiamento pelo conteúdo
- [ ] SG140 Leis institucionais
- [ ] SG122 Mandato e calendário eleitoral
- [ ] SG124 Eleição presidencial pela rede
- [ ] SG125 Fechamento eleitoral no turno
- [ ] SG115 Tela: propor, votar e eleição
- [ ] SG126 Teste de partida completa

**M4 — Partido e personagens**

- [ ] SG149 Novo jogo: o partido do jogador
- [ ] SG150 Banco de retratos
- [ ] SG151 Gerador de personagens
- [ ] SG152 Rosto do governo no mapa

**M5 — Salvar e restaurar → MVP**

- [ ] SG131 Formato do arquivo de partida
- [ ] SG132 Restauração equivalente
- [ ] SG133 Tela: exportar e importar
- [ ] SG134 **Marco MVP verificado**

**Retirados do MVP em 9/out (alinhamento):** SG109 (→ SG145), SG110 e SG123
Senado por UF (→ B-15), SG116–SG118 e SG121 (→ SG143), SG119 (→ SG144/SG126),
SG120 (→ SG146), SG127 (→ SG115).

**Depois do MVP (detalhar ao abrir cada marco):** M7 Balanceamento e qualidade →
M8 Instituições e Constituição → M9 Ruptura institucional → M10 Personagens com
mecânica → M11 Publicação.
