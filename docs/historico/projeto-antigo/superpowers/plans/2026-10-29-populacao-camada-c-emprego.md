# População, camada C (emprego): plano de implementação

> **Para quem executa:** use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans`. Os passos usam `- [ ]`.

**Objetivo:** os perfis do eleitorado passam a acompanhar o desemprego e a informalidade do motor: nasce a ocupação `desempregado`, com bolso e força política, e a ocupação carteira ↔ informal se desloca.

**Arquitetura:** não há estado novo. As frações desempregadas e o deslocamento carteira → informal são **função pura de `valores`** (desemprego, informalidade) e do conteúdo; uma função `congressoVivo(manifesto, valores)` devolve o manifesto do congresso com pesos vivos e perfis gêmeos `desempregado` acrescentados. Bolso, censo, eleição e Congresso passam a ler esse manifesto vivo no lugar do fixo. O formato do arquivo salvo não muda.

**Stack:** TypeScript, Vitest, conteúdo em JSON. `npx tsc -b` para tipos (nunca `--noEmit`).

**Spec:** [2026-10-29-populacao-camada-c-emprego-design.md](../specs/2026-10-29-populacao-camada-c-emprego-design.md)

## Emendas à spec (decididas ao ler o código)

1. **Sem estado guardado.** A spec deixava em aberto "onde guardar as frações". Como o motor já suaviza `desemprego` e `informalidade` e a camada os segue sem atraso (spec 2.2), as frações saem de `valores` a cada leitura. Fecha o item 3 de "Em aberto" e dispensa mexer em `salvar.ts`.
2. **O teto de movimento por turno (spec 2.4) sai** (YAGNI): sem estado, não há "turno passado" para limitar, e o agregado já é suave.
3. **Informalidade é por diferença; desemprego é absoluto.** O deslocamento carteira → informal usa `informalidade − informalidade₀` com `informalidade₀` = 38,6 de `paises/brasil/valores.json`, porque os perfis já representam o país de partida e nada pode mexer no turno 0. O desemprego, ao contrário, é tirado do total (spec 2.1: o desempregado inicial sai de carteira e informal), com `desemprego` absoluto.

## Restrições globais

- Tipos: `npx tsc -b`. Testes por arquivo: `npx vitest run src/tests/<arquivo>`. **Sem `npm run check`** até a Tarefa 6.
- Teste de **comportamento**, não de número exato (ordem de 24/out).
- Aviso do hook `typescript-patterns-enforcer` em arquivo de teste (números mágicos, laços) é ruído conhecido; só conta se for de linha sua e de código de produção.
- Conteúdo em `mundo/populacao.json` e valores do país em `paises/brasil/`; nunca número do Brasil em código.
- Camadas: `src/game/` não importa de `src/app/`. A função viva mora em `src/game/congresso/`.
- Cada tarefa termina com commit. Ideia nova vai para o PLANO, não vira tarefa.

## Revisão de foco (o que a spec implica e nenhuma tarefa óbvia testa)

1. **Desemprego 0 ou ≥ força de trabalho:** zero esvazia a faixa; acima da força inteira, nenhuma fração passa de 1 e a soma dos pesos continua 1 (Tarefa 2).
2. **Informalidade abaixo da inicial:** o peso volta de informal para carteira, só entre gêmeos (Tarefa 2).
3. **Perfil sem gêmeo, e conteúdo sem tabela `emprego`:** não se move e nada quebra; país sem a tabela se comporta como hoje (Tarefas 2 e 3).
4. **Eleição e Congresso com o eleitorado vivo:** a soma dos pesos e o resultado do turno 0 não mudam além do que o carving do desemprego inicial causa (Tarefa 4).
5. **Salvar e carregar:** como não há estado, uma partida salva na camada B carrega e mostra o mesmo país (Tarefa 4).

---

### Tarefa 1: Conteúdo do emprego e do grupo desempregados

**Arquivos:**
- Modificar: `src/conteudo/mundo/populacao.json` (`emprego`, `bolso.fontes.desempregado`, `rotulos.faixas`, eixo Ocupação)
- Modificar: `src/conteudo/mundo/indicadores/variaveis.json` (`grupo_desempregados`)
- Criar: `src/conteudo/mundo/consequencias/desemprego--grupo-desempregados.json`, `nivel-seguro-desemprego--grupo-desempregados.json`
- Modificar: `src/conteudo/paises/brasil/valores.json` (valor inicial de `grupo_desempregados`)
- Modificar: `src/engine/model/contentTypes.ts` e `src/game/pais/configuracao/tipos.ts` (campo `emprego`), `src/game/pais/configuracao/expandirPais.ts` (repassar `emprego` ao congresso, como já faz com `bolso`)
- Teste: `src/tests/populacao.test.ts` (já existe; ajustar contagem de grupos, se contar)

**Interfaces:**
- Produz: `congresso.emprego?: { vulnerabilidade: { ocupacao: Record<string, number>; renda: Record<string, number>; idade: Record<string, number> }; informalidadeInicial: number; desempregado: { id: "desempregado"; origemComBeneficio: readonly string[] } }`. Peso 0 = não perde emprego.

- [ ] **Passo 1: Teste falhando** em `populacao.test.ts`: o pacote do Brasil tem `congresso.emprego`; `vulnerabilidade.ocupacao.carteira > vulnerabilidade.ocupacao.servidor`; `vulnerabilidade.idade["16-29"] > vulnerabilidade.idade["30-59"]`; `vulnerabilidade.renda.pobre > vulnerabilidade.renda.rica`; `segmentoDe["ocupacao=desempregado"] === "grupo_desempregados"`.
- [ ] **Passo 2:** `npx vitest run src/tests/populacao.test.ts` e confirmar que falha.
- [ ] **Passo 3: Conteúdo.** Em `populacao.json` acrescentar o bloco `emprego` com valores iniciais de chute declarado: ocupação (carteira 1, informal 0.7, servidor 0.1, agricultura-familiar 0.4); renda (pobre 1.5, media 1, rica 0.4); idade ("16-29" 2, "30-59" 1, "60+" 0.5); `informalidadeInicial: 38.6`; `desempregado.origemComBeneficio: ["carteira"]`. Acrescentar `desempregado` a `bolso.fontes` (`nome: "Desempregados"`, `trabalha: false`, `beneficio: "beneficio_anual_seguro_desemprego"`), o rótulo `ocupacao=desempregado: "Desempregados"`, e `desempregado: "grupo_desempregados"` no eixo Ocupação. Criar `grupo_desempregados` em `variaveis.json` no molde de `grupo_informais`. Criar as duas setas no molde de `desemprego--grupo-informais.json`: `desemprego → grupo_desempregados` com `coeficiente: -1.0, termoConstante: 0`; `nivel_seguro_desemprego → grupo_desempregados` com `coeficiente: 0.2, termoConstante: -10`. Valor inicial 40 em `valores.json`.
- [ ] **Passo 4:** repassar `emprego` em `expandirPais.ts` e declarar o tipo nos dois arquivos de tipos; `npx tsc -b` sem erro.
- [ ] **Passo 5:** `npx vitest run src/tests/populacao.test.ts src/tests/censo.test.ts`. Se algum teste conta "19 grupos", ajustar para 20 com o comentário do porquê.
- [ ] **Passo 6: Commit** — `mundo: o desempregado existe no conteúdo, com a tabela de quem perde o emprego`.

---

### Tarefa 2: O eleitorado vivo (função pura)

**Arquivos:**
- Criar: `src/game/congresso/vivo.ts`
- Teste: `src/tests/congressoVivo.test.ts`

**Interfaces:**
- Consome: `ManifestoDoCongresso` (tipo de `content.manifest.congresso`), com `perfis` = linhas `[peso, ...índices]`, `atributos`, `valores`, `emprego`, `bolso.fontes`.
- Produz: `congressoVivo(manifesto: ManifestoDoCongresso, valores: Readonly<Record<string, number>>): ManifestoDoCongresso`.
  - Mesmos campos, com `perfis` vivos: pesos reduzidos nos perfis de quem tem `trabalha: true`, **mais** uma linha gêmea `desempregado` por perfil que perdeu emprego (mesmos índices, exceto o de `ocupacao`, que passa a apontar para `desempregado`), e `valores.ocupacao` com `"desempregado"` acrescentado. Sem `emprego` no manifesto, devolve o próprio manifesto.
  - Também `export function origemDoDesempregado(manifesto, linha: number): string | undefined`, a ocupação de origem da linha gêmea (para o bolso saber se veio de carteira).

**Regras que fixam o corpo (a spec as pede, o código as escolhe):**
- Força de trabalho `L` = soma dos pesos dos perfis com `trabalha: true`. Desemprego alvo `U = min(L, desemprego/100 × L)`.
- Fração de cada perfil: `u_i = min(1, k × v_i)`, `v_i` = vulnerabilidade de ocupação × renda × idade; `k` resolve `Σ peso_i × u_i = U` por bisseção. `U = 0` dá `k = 0`.
- Informalidade: seja `E` o peso empregado dos perfis `trabalha: true` e `Δ = (informalidade − informalidadeInicial)/100 × E`. `Δ > 0` move peso empregado de carteira para o gêmeo informal na proporção do peso de carteira que tem gêmeo; `Δ < 0` faz o inverso. Gêmeo = mesma linha, trocando só o índice de `ocupacao` por informal ↔ carteira. Limitado ao peso disponível; sem gêmeo, não move.

- [ ] **Passo 1: Testes falhando** em `congressoVivo.test.ts`, com o manifesto do Brasil e `valores` mínimos `{ desemprego, informalidade }`:
  - `soma dos pesos continua 1` para `desemprego` 0, 6.2, 30, 100 e informalidade 20, 38.6, 60.
  - `desemprego 0 não cria gêmeo desempregado` (nenhuma linha com ocupação desempregado e peso > 0).
  - `desemprego 100 não passa de 1 por perfil` (peso gêmeo ≤ peso original de cada perfil) e a soma dos desempregados é a força de trabalho inteira.
  - `desemprego sobe: a fração é maior em pobre jovem de carteira que em rico de 30 a 59`.
  - `servidor perde menos que carteira` com o mesmo desemprego.
  - `informalidade igual à inicial não move ninguém` (peso de carteira e informal iguais ao manifesto, descontado o carving do desemprego).
  - `informalidade sobe: peso passa de carteira para informal, e só nos perfis com gêmeo`; `informalidade cai: volta`.
  - `perfil de carteira sem gêmeo informal não se move e nada lança erro`.
  - `sem bloco emprego, devolve o mesmo manifesto` (comparação por identidade).
  - `não muda o manifesto de entrada` (`Object.isFrozen` ou comparação profunda antes e depois).
- [ ] **Passo 2:** `npx vitest run src/tests/congressoVivo.test.ts` e confirmar que falha (módulo ausente).
- [ ] **Passo 3: Implementar** `congressoVivo` e `origemDoDesempregado` em `src/game/congresso/vivo.ts` com as regras acima. Funções pequenas e nomeadas (`fracoesDesempregadas`, `deslocarInformalidade`, `gemeoDe`); constantes nomeadas para a bisseção (iterações, tolerância).
- [ ] **Passo 4:** os testes passam; `npx tsc -b` limpo.
- [ ] **Passo 5: Commit** — `mundo: o eleitorado vivo — o desemprego e a informalidade movem o peso dos perfis`.

---

### Tarefa 3: Bolso e censo leem o eleitorado vivo

**Arquivos:**
- Modificar: `src/app/partida/bolso.ts`, `src/app/partida/censo.ts`
- Modificar: `src/app/partida/tipos.ts` (`VisaoCensoFaixa`: `variacao?: number`, tratada na Tarefa 5)
- Teste: `src/tests/bolso.test.ts`, `src/tests/censo.test.ts`

**Interfaces:**
- Consome: `congressoVivo`, `origemDoDesempregado` da Tarefa 2.
- Produz: `bolsosDosPerfis(content, valores)` e `rendasDosPerfis` passam a devolver **uma linha por perfil do manifesto vivo** (2.090 originais + gêmeos desempregados), na ordem do `congressoVivo`. `censoDoPais(content, valores)` conta pelo manifesto vivo.

- [ ] **Passo 1: Testes falhando.**
  - `bolso.test.ts`: `o desempregado não ganha renda do trabalho` (`rendasDosPerfis(...)` com `porAno === 0` na linha gêmea); `ex-carteira recebe o seguro-desemprego e ex-informal não` (`ganha` da linha gêmea de origem carteira > 0 e de origem informal = 0, com o valor do benefício vindo de `valores`); `a massa salarial continua fechando com o desemprego em 15` (a média de renda de quem trabalha, pesada pelos pesos vivos, igual a `salario_medio`); `a soma do que os perfis pagam continua fechando com a arrecadação` (o teste existente de conservação, agora com `desemprego: 15`).
  - `censo.test.ts`: `a faixa Desempregados aparece no atributo Ocupação com parte > 0` e `a soma das partes de cada atributo continua 1` com `desemprego: 12`.
- [ ] **Passo 2:** rodar os dois arquivos e confirmar que falham.
- [ ] **Passo 3: Implementar.** Em `bolso.ts` e `censo.ts`, trocar `content.manifest.congresso` por `congressoVivo(content.manifest.congresso, valores)` onde se lê `perfis`, `valores` e `atributos`. O benefício do desempregado respeita `emprego.desempregado.origemComBeneficio` (via `origemDoDesempregado`). `censoDoPais` sem `valores` continua devolvendo o censo do manifesto fixo.
- [ ] **Passo 4:** `npx vitest run src/tests/bolso.test.ts src/tests/censo.test.ts src/tests/treemap.test.ts` passam; `npx tsc -b` limpo.
- [ ] **Passo 5: Commit** — `mundo: o bolso e o censo enxergam o desempregado`.

---

### Tarefa 4: Eleição e Congresso leem o eleitorado vivo

**Arquivos:**
- Modificar: `src/game/congresso/index.ts` (extrair `pacoteDoManifesto(m)` do corpo de `congressoDoPacote`; acrescentar `pacoteVivo(content, valores)`)
- Modificar: pontos onde o `Contexto` da eleição e a `prever` da tramitação são montados com `pacote` (ver `src/game/eleicao/votacao.ts`, `src/game/eleicao/index.ts:88-260`, `src/app/partida/tramitacao.ts:119`)
- Teste: `src/tests/eleicao.test.ts`, `src/tests/tramitacao.test.ts`, `src/tests/congressoVivo.test.ts`

**Interfaces:**
- Consome: `congressoVivo`.
- Produz: `pacoteVivo(content: ResolvedPackage, valores: Readonly<Record<string, number>>): CongressoDoPacote | undefined`, equivalente a `congressoDoPacote(content)` mas com os perfis vivos. `congressoDoPacote` segue em cache e fixo (as bancadas e a composição inicial do Congresso dependem dele).

- [ ] **Passo 1: Testes falhando.**
  - `pacoteVivo com valores do país de partida soma os mesmos pesos que congressoDoPacote` (soma ≈ 1 nos dois).
  - `desemprego 30 dá peso político ao desempregado` (a soma dos pesos de perfis com `segmentos` contendo `grupo_desempregados` cresce em relação a desemprego 6).
  - `o resultado do turno 0 da eleição fica dentro de 2 pontos percentuais do fixo` (prova de que o carving inicial não vira o país de cabeça para baixo).
  - `uma partida salva na camada B carrega e abre o censo` (usar `salvarPartida`/`carregarPartida` de `src/app/partida/salvar.ts` numa partida nova; carrega sem erro e `visao.censo` tem a faixa Desempregados).
- [ ] **Passo 2:** `npx vitest run src/tests/congressoVivo.test.ts src/tests/eleicao.test.ts src/tests/tramitacao.test.ts` e confirmar que os novos falham.
- [ ] **Passo 3: Implementar.** Extrair `pacoteDoManifesto`, criar `pacoteVivo`, e nos sítios que já têm `valores` na mão (`Contexto.valores`, `eleicaoComJogador(…, valores)`, `prever` com `com`/`sem`) trocar `pacote` por `pacoteVivo(content, valores)`. Onde não há `valores`, manter o fixo e deixar um comentário de uma linha dizendo por quê.
- [ ] **Passo 4:** os três arquivos de teste passam; `npx tsc -b` limpo.
- [ ] **Passo 5: Commit** — `mundo: o desempregado pesa na eleição e no Congresso`.

---

### Tarefa 5: O censo mostra o movimento

**Arquivos:**
- Modificar: `src/app/partida/censo.ts` (cálculo da `variacao`), `src/app/partida/tipos.ts`, `src/app/partida/visao.ts`
- Modificar: `src/ui/mapa/Censo.tsx` e `src/ui/mapa/mapa.css`
- Teste: `src/tests/censo.test.ts`

**Interfaces:**
- Consome: `content.initialState.valores` (valores declarados do país, os que os perfis representam).
- Produz: `VisaoCensoFaixa.variacao?: number` em **pontos de eleitorado** desde o início (parte de agora menos parte com os `valores` iniciais, ×100). `censoDoPais(content, valores)` calcula comparando com `censoDoPais(content, content.initialState.valores)`.

- [ ] **Passo 1: Testes falhando** em `censo.test.ts`: `no turno 0 a variação é zero em todas as faixas, exceto a do desempregado e a de quem cedeu para ele` (tolerância de 0,5 ponto); `desemprego sobe e Desempregados ganha pontos e Com carteira perde`; `faixa sem variação não traz o campo` (para o censo não gritar "0,0").
- [ ] **Passo 2:** rodar e confirmar que falham.
- [ ] **Passo 3: Implementar** a `variacao` em `censo.ts` e mostrá-la em `Censo.tsx` ao lado da parte, com a convenção de cor do arquivo (sem número com 0,0); incluir `desde o início da partida` no `title` do elemento.
- [ ] **Passo 4:** `npx vitest run src/tests/censo.test.ts` passa; `npx tsc -b`, `npx eslint src/ui/mapa/Censo.tsx` limpos.
- [ ] **Passo 5: Commit** — `tela: o censo mostra quanto cada faixa se moveu`.

---

### Tarefa 6: O país absurdo, a tela e o check

**Arquivos:**
- Criar: `scripts/teste/emprego-dos-perfis.ts`
- Modificar: `PLANO.md` (item 3: camada C emprego feita), `RETOMAR.md`, spec (marcar emendas aplicadas)

- [ ] **Passo 1: Script** `scripts/teste/emprego-dos-perfis.ts` (`npx vite-node scripts/teste/emprego-dos-perfis.ts`): cria uma partida (`criarPartida({ semente: 7, ocorrencias: false, eleicao: false })`) e imprime, para `desemprego` 0, 6, 12, 25, 40 e `informalidade` 20, 38.6, 55, 80, as partes de Com carteira, Informais, Desempregados e Fora, e o `sobra` por mês do desempregado ex-carteira contra ex-informal. É a ferramenta que flagra "80% informal" ou "metade do país desempregada".
- [ ] **Passo 2:** rodar o script; **se algo sair absurdo**, ajustar só a tabela `emprego` no conteúdo (não o código) e registrar o achado no PLANO. Não abrir frente nova.
- [ ] **Passo 3: Na tela, antes de dizer que está pronto:** servidor de desenvolvimento, partida nova, aba População: ficha Ocupação com a faixa Desempregados e a variação; um turno encerrado e a variação aparecendo; bolso do desempregado; abrir uma lei que mude o desemprego e ver se "No bolso de quem" lista os desempregados. Anexar print.
- [ ] **Passo 4: `npm run check` completo** (≈ 24 min), uma vez, no fim da mecânica. Só então `[x]` no PLANO.
- [ ] **Passo 5:** atualizar `PLANO.md` (item 3, com data, commits e testes), `RETOMAR.md` e a spec; **Commit** — `chore: o PLANO e o RETOMAR depois da camada C (emprego)`.

---

## Autorrevisão

- **Cobertura da spec:** 2.1 e 2.2 (Tarefa 2), 2.3 (tabela na Tarefa 1, aplicada na 2), 2.4 (Tarefa 2), 2.5 (Tarefa 3), 2.6 (Tarefas 1 e 4), 2.7 (Tarefa 5), testes da seção 4 (Tarefas 2–6). Em aberto: o seguro-desemprego sai de `beneficio_anual_seguro_desemprego` e só chega a ex-carteira (Tarefa 3); o estado vivo e o salvamento ficam resolvidos pela emenda 1 (Tarefa 4, teste de carga). Desalento e duração das parcelas ficam fora, como a spec diz.
- **Tipos:** `congressoVivo`, `origemDoDesempregado`, `pacoteDoManifesto`, `pacoteVivo` e `VisaoCensoFaixa.variacao` têm a mesma assinatura onde aparecem.
- **Risco declarado:** a Tarefa 4 toca eleição e Congresso, que têm testes lentos. Os testes nomeados cobrem; o `npm run check` fica para a Tarefa 6.
