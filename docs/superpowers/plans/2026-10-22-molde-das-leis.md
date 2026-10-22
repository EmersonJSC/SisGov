# Molde das leis: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** a ficha v4 (molde único), as 11 áreas por assunto, a família lida
da lei (com a cor do programa) e o inventário das 242 leis, para o autor
escolher o que entra; depois, Contas públicas refeita no molde.

**Architecture:** a v4 estende a ficha v3 que já existe
(`src/game/pais/fichaV3/`): mesmo conversor para o JSON do motor, com
campos novos. As áreas passam a ser do mundo (`mundo/areas.json`); o país só
diz quais ministérios cuidam de cada área. A lei v4 mora na área declarada
nela; a lei antiga continua morando pelo ministério até ser refeita.

**Tech Stack:** TypeScript, React 19, Vite, Vitest, vite-node.

**Spec:** [docs/jogo/mecanicas/molde-das-leis.md](../../jogo/mecanicas/molde-das-leis.md)
(e a [mecânica 2](../../jogo/mecanicas/leis.md), que continua valendo).

## Global Constraints

- Famílias: `imposto`, `verba`, `programa`, `regra`, `constitucional`, `petrea`.
- Ids das 11 áreas, nesta ordem: `contas-publicas`, `economia-e-empresas`,
  `trabalho`, `protecao-social`, `saude`, `educacao-e-cultura`,
  `infraestrutura-e-energia`, `ambiente-e-campo`, `seguranca-e-defesa`,
  `direitos-e-costumes`, `governo-e-instituicoes`.
- Regra e constitucional: no máximo 3 opções (mecânica 2, 2.2).
- "O que decide" é frase afirmativa: não termina em "?".
- Toda lei v4 tem pelo menos 1 efeito (seta) e no máximo 8.
- 8 a 12 leis por área, contando o catálogo inteiro da área. **Fora disso é
  aviso, não erro** (a decisão sobre Contas públicas está em aberto, spec 6).
- Pétrea: escudo, centro, não é de nenhuma área (`area` ausente).
- Nome sem sigla e sem nome de programa de um país (lista `NOMES_DE_PROGRAMA`
  de `verificar.ts`, ampliada com "Farmácia Popular").
- Nada apagado: lei que sai vai para `src/conteudo/_arquivo-leis-antigas/`.
- Commit com assunto na frente (`leis:`, `mapa:`, `teste:`); sem `git push`.
- Na máquina do autor, git sem permissão de apagar deixa `.git/*.lock`:
  renomear (`mv .git/HEAD.lock .git/stale-<n>-HEAD.lock`), nunca apagar.
- Aceite de cada tarefa: o teste dela e `npm test` verdes; `npm run check`
  verde no fim (roda na máquina do autor).

## Review Focus

- Lei v4 numa área cujo país não declara ministério: aparece na esfera, com
  o rótulo do coordenador da área (teste na Tarefa 3).
- Lei v2 sem `familia`: continua com a cor adivinhada de hoje, sem quebrar
  (teste na Tarefa 3).
- `trava` apontando para lei ou opção que não existe: erro de referência
  quebrada, não silêncio (teste na Tarefa 1).
- Pétrea com `area` preenchida ou constitucional sem `trava`: erro (teste
  na Tarefa 1).
- Área com 13 leis ou com 7: aviso com o número e a área, sem reprovar o
  pacote (teste na Tarefa 1).

---

### Task 1: Ficha v4 e verificador do molde

**Files:**
- Create: `src/game/pais/fichaV3/molde.ts`
- Modify: `src/game/pais/fichaV3/tipos.ts` (tipo `FichaV4`), `src/game/pais/fichaV3/index.ts` (exportar)
- Create: `src/conteudo/mundo/areas.json`
- Test: `src/tests/moldeDasLeis.test.ts`

**Interfaces:**
- Produces:
  - `type Familia = "imposto" | "verba" | "programa" | "regra" | "constitucional" | "petrea"`
  - `type AreaId` (união dos 11 ids)
  - `type TravaV4 = { opcao: string; lei: string; minimo?: number; maximo?: number; proibe?: true }`
  - `type FichaV4 = Omit<FichaV3, "versaoEsquema" | "area" | "ministerio" | "fontes"> & { versaoEsquema: 4; familia: Familia; decide: string; area?: AreaId; exemplo?: string; trava?: TravaV4[]; publico?: { quem: string; pessoas: number }; fontes?: FonteV3[]; controle: FichaV3["controle"] & { opcoes?: (PolicyOption & { propoe: string })[] } }`
  - `verificarMolde(ficha: FichaV4, arquivo: string, contexto: ContextoDaFicha & { areas: ReadonlySet<string> }): ContentDiagnostic[]`
  - `avisosPorArea(leis: readonly { id: string; area?: string }[], areas: readonly string[]): string[]` (mensagens; vazio se todas entre 8 e 12)
  - `mundo/areas.json`: `{ "areas": [{ "id", "titulo", "faz" }] }`, os 11 ids e títulos da spec, seção 2.4

- [ ] **Step 1: Escrever os testes que falham** em `src/tests/moldeDasLeis.test.ts`, com uma ficha v4 válida de base (`imposto`, área `contas-publicas`, 1 efeito) e uma variação por regra:
  - válida → `[]`
  - `familia` fora das seis → erro em `familia`
  - `decide: "Quem paga?"` → erro em `decide`
  - `area: "economia"` → `REFERENCIA_QUEBRADA` em `area`
  - `efeitos: []` → erro em `efeitos`
  - regra com 4 opções → erro em `controle.opcoes`
  - opção sem `propoe` → erro em `controle.opcoes.0.propoe`
  - constitucional sem `trava` → erro em `trava`
  - `trava` com `lei: "nao-existe"` → `REFERENCIA_QUEBRADA` em `trava.0.lei`
  - pétrea com `area` → erro em `area`
  - nome "Farmácia Popular" → erro em `nome`
  - imposto sem `dinheiro.tipo: "receita"` → erro em `dinheiro`; verba ou programa sem `dinheiro.tipo: "gasto"` → erro em `dinheiro`
  - programa sem `publico` (quem recebe e quantas pessoas) → erro em `publico`
  - `avisosPorArea` com 13 leis em `saude` → `["saude: 13 leis (o molde pede 8 a 12)"]`; com 7 → mensagem com 7; com 10 → `[]`

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/tests/moldeDasLeis.test.ts`
Expected: FAIL, `verificarMolde` não existe.

- [ ] **Step 3: Implementar `molde.ts` e `areas.json`.** `verificarMolde` reaproveita de `verificar.ts` a checagem de controle e de efeitos (alvo, origem, atraso), trocando o mínimo de 3 efeitos por 1 e tirando a obrigação de fonte. `areas.json` com os 11 ids e títulos da spec.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/tests/moldeDasLeis.test.ts && npm test`
Expected: PASS (os testes da v3 seguem verdes).

- [ ] **Step 5: Commit** `leis: ficha v4 e verificador do molde`

### Task 2: Carregar a ficha v4 no jogo

**Files:**
- Modify: `src/game/pais/fichaV3/expandir.ts`, `src/game/pais/fichaV3/converter.ts`, `src/game/pais/loadScenarioPackage.ts`
- Modify: `src/engine/model/contentTypes.ts` (`PolicyFile`: `familia?: Familia`, `areaMundo?: string`, `decide?: string`, `trava?: TravaV4[]`), `src/engine/model/validateContentFile.ts` (aceitar os quatro campos)
- Test: `src/tests/moldeDasLeis.test.ts`

**Interfaces:**
- Consumes: `FichaV4`, `verificarMolde` (Task 1)
- Produces: `PolicyFile.familia`, `PolicyFile.areaMundo`, `PolicyFile.decide`, `PolicyFile.trava`; `expandirFichasV3` também expande `versaoEsquema: 4`, rodando `verificarMolde` e devolvendo os erros como diagnósticos do pacote, como já faz com a v3

- [ ] **Step 1: Teste que falha:** uma ficha v4 de teste (no próprio teste, não no catálogo) expandida por `expandirFichasV3` vira um `PolicyFile` com `familia`, `areaMundo` e `decide`, e as consequências esperadas; uma ficha v4 inválida (`decide` com "?") faz o pacote falhar com diagnóstico em `decide`.
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/tests/moldeDasLeis.test.ts`, FAIL.
- [ ] **Step 3: Implementar.** `converterFicha` aceita `FichaV3 | FichaV4`; na v4, `descricao` do `PolicyFile` recebe `decide`, `ministerio` fica vazio e `grupo` sai da família (imposto → `tributaria`; verba e programa → `orcamentaria`; constitucional e pétrea → `institucional`; regra → `regulatoria`).
- [ ] **Step 4: Rodar** — `npx vitest run src/tests/moldeDasLeis.test.ts && npm test`, PASS.
- [ ] **Step 5: Commit** `leis: o jogo carrega a ficha v4`

### Task 3: Áreas do mundo, família na tela e cor do programa

**Files:**
- Modify: `src/conteudo/paises/brasil/politica.json` (as `areas` passam a ser os 11 ids do mundo; cada ministério com `area` nova)
- Modify: `src/app/partida/visao.ts` (`governoDaPartida`, `lugarDaLei`), `src/app/partida/tipos.ts` (`VisaoLei.familia?: Familia`, `VisaoLei.decide?: string`)
- Modify: `src/ui/mapa/familia.ts`, `src/ui/mapa/mapa.css`
- Test: `src/tests/moldeDasLeis.test.ts`, `src/tests/mapaPolitico.test.ts`

**Interfaces:**
- Consumes: `PolicyFile.familia`, `PolicyFile.areaMundo` (Task 2); `mundo/areas.json` (Task 1)
- Produces: `familiaDaLei(lei: VisaoLei): Familia` lê `lei.familia` e só adivinha (regra de hoje) quando ausente; `PRATELEIRAS` com `programa` entre verba e regra; classe CSS `familia-programa`

- [ ] **Step 1: Testes que falham:**
  - toda área de `brasil/politica.json` existe em `mundo/areas.json`, e todo ministério aponta para uma delas;
  - Esporte em `educacao-e-cultura`, Comunicações em `governo-e-instituicoes`, Povos Indígenas em `direitos-e-costumes`, Fazenda e Planejamento em `contas-publicas` (spec 2.4);
  - lei v4 com `areaMundo: "saude"` aparece em `VisaoLei.areas` como `["saude"]`, mesmo sem estar na lista de nenhum ministério; o rótulo é o ministério coordenador da área;
  - `familiaDaLei` devolve `"programa"` para lei com `familia: "programa"` e mantém a dedução de hoje para lei sem `familia`.
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/tests/moldeDasLeis.test.ts src/tests/mapaPolitico.test.ts`, FAIL.
- [ ] **Step 3: Implementar.** Títulos e `faz` das áreas vêm de `mundo/areas.json`; o país dá só `coordenador` e ministérios. Banco Central, câmbio e bancos ficam com o ministério que o país indicar em `economia-e-empresas`. Cor de partida da verba `#5fae4f` (anel `#86e05f`) e do programa `#3fae9f` (anel `#45e0c4`); os tons finais saem da amostra da parte 2 (spec 6).
- [ ] **Step 4: Rodar** — os dois arquivos de teste e `npm test`, PASS. Abrir o jogo (`npm run dev`) e conferir que as 11 esferas aparecem com os títulos novos.
- [ ] **Step 5: Commit** `mapa: áreas por assunto e família lida da lei`

### Task 4: Inventário das 242 leis

**Files:**
- Create: `scripts/leis/inventario.ts`
- Create (gerado): `docs/jogo/leis/inventario.md`
- Modify: `package.json` (script `"leis:inventario": "vite-node scripts/leis/inventario.ts"`)
- Test: `src/tests/inventarioDeLeis.test.ts`

**Interfaces:**
- Consumes: `verificarMolde`, `avisosPorArea` (Task 1); áreas dos ministérios (Task 3)
- Produces: `sugerirLinha(lei: PolicyFile | FichaV3, ministerioArea: ReadonlyMap<string, string>): { id: string; nome: string; areaSugerida: string; familiaSugerida: Familia; faltas: string[]; parecidaCom?: string }`

- [ ] **Step 1: Testes que falham** para `sugerirLinha`:
  - `imposto-renda-pessoas` → área `contas-publicas`, família `imposto`;
  - `transferencia-de-renda` → `protecao-social`, `programa`;
  - `regulacao-de-vagas` → `saude`, `regra`, e `faltas` contém "sem efeito na rede" e "decide é pergunta";
  - `imposto-sobre-a-propriedade` → `parecidaCom: "imposto-propriedade-urbana-rural"`.
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/tests/inventarioDeLeis.test.ts`, FAIL.
- [ ] **Step 3: Implementar.**
  - Área: a do ministério da lei, com uma tabela curta de exceções no próprio script (juros, câmbio e bancos para `economia-e-empresas`; moradia para `protecao-social`).
  - Família: pétrea e constitucional pelo nível; `tributaria` vira imposto; dinheiro de gasto com público direto (lista de ids no script: transferência de renda, remédios, bolsas, benefícios) vira programa; outro gasto vira verba; o resto vira regra.
  - Parecida: mesmo radical no id ou nome com 2 ou mais palavras iguais além de "imposto", "verba" e "de".
  - O `.md` sai agrupado por área, com o total, o aviso de `avisosPorArea` e uma coluna "Destino" vazia para o autor (entra · junta com · sai).
- [ ] **Step 4: Rodar** — `npx vitest run src/tests/inventarioDeLeis.test.ts && npm run leis:inventario`, PASS e o arquivo gerado com as 242 linhas.
- [ ] **Step 5: Commit** `leis: inventário das 242 leis por área nova`

**Para aqui e entrega o inventário ao autor.** A Tarefa 5 só começa com a
coluna "Destino" de Contas públicas preenchida por ele e a decisão sobre o
limite dessa área.

### Task 5: Contas públicas no molde (primeira área)

**Files:**
- Modify/Create: `src/conteudo/mundo/leis/<id>.json` das leis que o autor marcou "entra" (formato v4)
- Move: as marcadas "sai" para `src/conteudo/_arquivo-leis-antigas/`
- Modify: `src/conteudo/paises/brasil/leis.json` (valores de partida das leis da área)
- Test: `src/tests/moldeDasLeis.test.ts`

**Interfaces:**
- Consumes: Tasks 1 a 4; a tabela de impostos da seção 2 do `docs/jogo/leis/equilibrio.md` (alíquota de partida, arrecadação, pico)

- [ ] **Step 1: Teste que falha:** toda lei com área `contas-publicas` é v4 e passa em `verificarMolde`; `avisosPorArea` da área segue a decisão do autor.
- [ ] **Step 2: Rodar e ver falhar** — `npx vitest run src/tests/moldeDasLeis.test.ts`, FAIL.
- [ ] **Step 3: Reescrever as leis da área**, uma por commit, cada uma com nome geral, `decide` afirmativo, família, efeitos na rede e `exemplo` do Brasil quando houver programa com nome.
- [ ] **Step 4: Rodar** — `npm test` e `npx vite-node scripts/teste/sonda-orcamento.ts base`: nenhum salto de receita maior que 3 pontos do PIB em 8 turnos.
- [ ] **Step 5: Commit por lei** `leis: <nome> no molde`; atualizar `PLANO.md` (seção "Molde das leis") ao fechar a área.

As outras dez áreas repetem a Tarefa 5, na ordem que o autor escolher.
Quando a última fechar, o verificador do molde passa a valer para todas as
leis e o formato v2 sai do validador (spec, seção 4, passo 5), num commit
`leis: só o formato v4`. As
partes 2 a 4 da spec (mapa em faixas e filtro, janela da lei, eleitorado)
ganham plano próprio depois da amostra em HTML.
