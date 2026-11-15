# População, camada B: bolso e ocupação — plano de implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: usar
> superpowers:subagent-driven-development (recomendada) ou
> superpowers:executing-plans, tarefa a tarefa. Os passos usam caixa
> (`- [ ]`) para marcação.

**Objetivo:** cada perfil do eleitorado passa a ter renda, imposto e sobra, e
a tela diz quem pagou a conta de cada lei.

**Arquitetura:** o agregado manda e o perfil divide. O motor continua
calculando massa salarial, lucros e consumo; uma tabela de conteúdo reparte
esses valores entre os 2.090 perfis por ocupação × renda. O bolso é leitura
pura — não entra na rede de consequências nem na satisfação.

**Tecnologia:** TypeScript, vitest, React. Sem dependência nova.

**Spec:** [docs/jogo/mecanicas/populacao.md](../../jogo/mecanicas/populacao.md)

## Restrições gerais

- O bolso **não** alimenta a rede de consequências nem a satisfação dos
  grupos (spec 2.7). É leitura.
- O bolso guarda a **fonte** do dinheiro com nome, nunca a ocupação direto
  (spec 2.4): quando o setor existir, ele entra na fonte sem tocar em quem lê.
- Os multiplicadores são normalizados para média ponderada 1 entre quem
  trabalha (spec 2.5): a renda média dos trabalhadores fecha com
  `salario_medio`, então a repartição não cria nem some dinheiro.
- Valores por pessoa em moeda do país por ano, como `salario_medio`.
- Teste de comportamento, não de número exato: a demografia e a tabela ainda
  vão ser calibradas (ordem de 24/out no PLANO).
- `npx tsc -b` para checar tipos (`--noEmit` não checa nada neste projeto);
  `npm run check` uma vez, no fim.
- Rodar teste por arquivo (`npx vitest run src/tests/<arquivo>`): a suíte
  inteira passa de 20 minutos.

## Foco da revisão

Entradas que o spec implica e que nenhuma tarefa exercitaria sozinha:

1. **País sem tabela de multiplicadores** (qualquer país que não o Brasil): o
   bolso fica ausente e a tela cai no censo de hoje, sem quebrar. — Tarefa 1
2. **Massa salarial zero ou negativa** (crise, início de partida malformado):
   nenhuma divisão por zero; a renda de todos vira zero. — Tarefa 1
3. **Combinação sem multiplicador na tabela** (faixa nova no perfil): vale 1,
   e a normalização continua fechando a massa salarial. — Tarefa 1
4. **Faixa em que ninguém trabalha** (aposentados, fora da força): renda do
   trabalho zero, sem dividir por zero, e o benefício aparece. — Tarefa 2
5. **Lei que não mexe em imposto nem em benefício**: o boletim não inventa
   "quem pagou" — a seção some. — Tarefa 5

---

### Tarefa 1: a renda de cada perfil

**Arquivos:**

- Criar: `src/app/partida/bolso.ts`
- Criar: `src/conteudo/mundo/bolso.json` (a tabela, com nota de fonte)
- Modificar: `src/game/pais/configuracao/expandirPais.ts`,
  `src/game/pais/configuracao/tipos.ts`,
  `src/engine/model/contentTypes.ts` (levar a tabela ao manifesto, como os
  rótulos do censo foram levados em 29/out)
- Teste: `src/tests/bolso.test.ts`

**Interfaces:**

- Consome: `content.manifest.congresso` (atributos, valores, perfis) e o valor
  de `salario_medio` da partida.
- Produz:

  ```ts
  export type Fonte = Readonly<{ id: string; nome: string }>;
  export type RendaDoPerfil = Readonly<{ fonte: Fonte; porAno: number }>;
  export function rendasDosPerfis(
    content: ResolvedPackage,
    salarioMedio: number,
  ): readonly RendaDoPerfil[];
  ```

  Um item por perfil, na mesma ordem de `manifest.congresso.perfis`. Perfil de
  quem não trabalha tem `porAno` 0 e a fonte da sua ocupação.

- [ ] **Passo 1: escrever os testes que falham**

```ts
it("a renda média de quem trabalha fecha com o salário médio", () => {
  const rendas = rendasDosPerfis(pacote(), 40000);
  // Média ponderada pelo peso do perfil, só entre quem trabalha.
  expect(mediaPonderadaDeQuemTrabalha(rendas, pacote())).toBeCloseTo(40000, 0);
});

it("quem não trabalha não tira do bolo do trabalho", () => {
  const rendas = rendasDosPerfis(pacote(), 40000);
  expect(rendaDe(rendas, "ocupacao=aposentado")).toBe(0);
  expect(rendaDe(rendas, "ocupacao=fora")).toBe(0);
});

it("a fonte do dinheiro tem nome, não é a ocupação crua", () => {
  const fonte = fonteDe(rendasDosPerfis(pacote(), 40000), "ocupacao=servidor");
  expect(fonte.id).toBe("servidor");
  expect(fonte.nome).toBe("Servidores públicos");
});

it("sem tabela no país, não há renda nenhuma — e nada quebra", () => {
  expect(rendasDosPerfis(pacoteSemTabela(), 40000)).toEqual([]);
});

it("salário médio zero não divide por zero", () => {
  expect(rendasDosPerfis(pacote(), 0).every((r) => r.porAno === 0)).toBe(true);
});

it("combinação fora da tabela vale 1 e não desequilibra a massa", () => {
  // Tabela sem a linha "servidor × rica": a normalização continua fechando.
  expect(
    mediaPonderadaDeQuemTrabalha(
      rendasDosPerfis(pacoteComTabelaFurada(), 40000),
      pacoteComTabelaFurada(),
    ),
  ).toBeCloseTo(40000, 0);
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npx vitest run src/tests/bolso.test.ts`
Esperado: FAIL, módulo `bolso` não existe.

- [ ] **Passo 3: escrever `bolso.json`**

Uma linha por `ocupacao=<valor>` com, dentro, um multiplicador por faixa de
renda, mais `nome` da fonte. Campo `fonte` em nota: de onde veio o número
(PNAD Contínua, rendimento por posição na ocupação). Ocupações que não
trabalham (`aposentado`, `fora`) declaram `trabalha: false`.

- [ ] **Passo 4: implementar `rendasDosPerfis` em `src/app/partida/bolso.ts`**

Normalizar antes de multiplicar: `k = Σ(peso × mult) / Σ(peso)` entre quem
trabalha, e `porAno = salarioMedio × mult / k`. Com `k` zero ou não finito,
toda renda é 0.

- [ ] **Passo 5: rodar e ver passar**

Rodar: `npx vitest run src/tests/bolso.test.ts`
Esperado: PASS, 6 testes.

- [ ] **Passo 6: commitar**

```bash
git add src/app/partida/bolso.ts src/conteudo/mundo/bolso.json src/tests/bolso.test.ts src/game/pais/configuracao src/engine/model/contentTypes.ts
git commit -m "mundo: cada perfil tem renda, repartida da massa salarial"
```

---

### Tarefa 2: o que o perfil paga e o que lhe sobra

**Arquivos:**

- Modificar: `src/app/partida/bolso.ts`
- Teste: `src/tests/bolso.test.ts`

**Interfaces:**

- Consome: `rendasDosPerfis` (Tarefa 1) e os valores da partida.
- Produz:

  ```ts
  export type BolsoDoPerfil = Readonly<{
    fonte: Fonte;
    ganha: number; // trabalho + benefício, por ano
    paga: number; // consumo + renda + contribuição, por ano
    sobra: number; // ganha − paga
  }>;
  export function bolsosDosPerfis(
    content: ResolvedPackage,
    valores: Readonly<Record<string, number>>,
  ): readonly BolsoDoPerfil[];
  ```

- [ ] **Passo 1: escrever os testes que falham**

```ts
it("a sobra é o que ganha menos o que paga", () => {
  for (const b of bolsosDosPerfis(pacote(), valores()))
    expect(b.sobra).toBeCloseTo(b.ganha - b.paga, 6);
});

it("quem ganha mais paga mais imposto", () => {
  const b = bolsosDosPerfis(pacote(), valores());
  expect(pagaDe(b, "renda=rica")).toBeGreaterThan(pagaDe(b, "renda=pobre"));
});

it("aposentado não ganha do trabalho e mesmo assim tem o que gastar", () => {
  const b = bolsoDe(
    bolsosDosPerfis(pacote(), valores()),
    "ocupacao=aposentado",
  );
  expect(b.ganha).toBeGreaterThan(0);
});

it("imposto sobre consumo zerado tira só essa parte da conta", () => {
  const sem = bolsosDosPerfis(pacote(), {
    ...valores(),
    carga_impostos_consumo: 0,
  });
  const com = bolsosDosPerfis(pacote(), valores());
  expect(sem[0].paga).toBeLessThan(com[0].paga);
  expect(sem[0].ganha).toBeCloseTo(com[0].ganha, 6);
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npx vitest run src/tests/bolso.test.ts -t "sobra"`
Esperado: FAIL, `bolsosDosPerfis` não existe.

- [ ] **Passo 3: implementar `bolsosDosPerfis`**

Imposto sobre consumo: `carga_impostos_consumo` (%) sobre a parte consumida
da renda (`propensao_consumo`). Imposto de renda e contribuição: alíquota
efetiva do agregado (arrecadação ÷ massa salarial) aplicada à renda do
perfil. Benefício de quem não trabalha: a previdência do orçamento dividida
pelo peso de quem recebe. Cada parcela que faltar no `valores` vale 0.

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npx vitest run src/tests/bolso.test.ts`
Esperado: PASS, 10 testes.

- [ ] **Passo 5: commitar**

```bash
git add src/app/partida/bolso.ts src/tests/bolso.test.ts
git commit -m "mundo: o perfil paga imposto e recebe benefício, e sobra o que sobra"
```

---

### Tarefa 3: a visão entrega o bolso por faixa do censo

**Arquivos:**

- Modificar: `src/app/partida/censo.ts`, `src/app/partida/tipos.ts`,
  `src/app/partida/visao.ts`
- Teste: `src/tests/censo.test.ts`

**Interfaces:**

- Consome: `bolsosDosPerfis` (Tarefa 2).
- Produz: `VisaoCensoFaixa` ganha

  ```ts
  bolso?: Readonly<{ ganha: number; paga: number; sobra: number }>;
  ```

  Média ponderada pelos pesos dos perfis da faixa. Ausente quando o país não
  tem tabela.

- [ ] **Passo 1: escrever os testes que falham**

```ts
it("cada faixa do censo diz quanto ganha, paga e sobra", () => {
  const renda = verPartida(partida()).censo.find((a) => a.id === "renda")!;
  for (const f of renda.faixas) expect(f.bolso?.sobra).toBeGreaterThan(0);
});

it("a faixa rica sobra mais que a pobre", () => {
  const renda = verPartida(partida()).censo.find((a) => a.id === "renda")!;
  const parte = (id: string) => renda.faixas.find((f) => f.id === id)!.bolso!;
  expect(parte("rica").sobra).toBeGreaterThan(parte("pobre").sobra);
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npx vitest run src/tests/censo.test.ts -t "ganha"`
Esperado: FAIL, `bolso` é `undefined`.

- [ ] **Passo 3: implementar a média ponderada em `censo.ts`**

- [ ] **Passo 4: rodar e ver passar**

Rodar: `npx vitest run src/tests/censo.test.ts`
Esperado: PASS, 9 testes.

- [ ] **Passo 5: commitar**

```bash
git add src/app/partida src/tests/censo.test.ts
git commit -m "mundo: o censo diz quanto cada faixa ganha, paga e sobra"
```

---

### Tarefa 4: a tela do censo mostra o bolso

**Arquivos:**

- Modificar: `src/ui/mapa/Censo.tsx`, `src/ui/mapa/mapa.css`

**Interfaces:**

- Consome: `VisaoCensoFaixa.bolso` (Tarefa 3).

- [ ] **Passo 1: mostrar a sobra na linha da faixa**

Na ficha do censo, cada faixa ganha a sobra por mês em moeda do país, ao lado
da porcentagem. Faixa sem `bolso` continua como está hoje — a coluna some, não
aparece vazia.

- [ ] **Passo 2: conferir no navegador**

Abrir a aba População, conferir a Renda e a Ocupação. Esperado: valores
plausíveis e nenhuma faixa com "NaN" ou "R$ 0" onde deveria haver dinheiro.
Tirar print.

- [ ] **Passo 3: commitar**

```bash
git add src/ui/mapa/Censo.tsx src/ui/mapa/mapa.css
git commit -m "tela: o censo mostra quanto sobra em cada faixa"
```

---

### Tarefa 5: o boletim da lei diz quem pagou a conta

**Arquivos:**

- Modificar: `src/app/partida/visao.ts` (ou onde a prévia da lei é montada),
  `src/ui/mapa/Documentos.tsx`
- Teste: `src/tests/bolso.test.ts`

**Interfaces:**

- Consome: `bolsosDosPerfis` (Tarefa 2), chamado com os valores de antes e de
  depois da lei.
- Produz:

  ```ts
  export type QuemPagou = Readonly<{
    faixa: string; // "Informais e de aplicativo"
    parte: number; // parte do eleitorado, 0 a 1
    porMes: number; // diferença na sobra, negativa quando perde
  }>;
  export function quemPagouAConta(
    content: ResolvedPackage,
    antes: Readonly<Record<string, number>>,
    depois: Readonly<Record<string, number>>,
  ): readonly QuemPagou[];
  ```

  Da maior perda para o maior ganho; faixas sem diferença ficam de fora.

- [ ] **Passo 1: escrever os testes que falham**

```ts
it("lei que não mexe em dinheiro não tem quem pague a conta", () => {
  expect(quemPagouAConta(pacote(), valores(), valores())).toEqual([]);
});

it("imposto sobre consumo maior aparece como perda, e a maior vem antes", () => {
  const conta = quemPagouAConta(pacote(), valores(), {
    ...valores(),
    carga_impostos_consumo: valores().carga_impostos_consumo + 5,
  });
  expect(conta.length).toBeGreaterThan(0);
  expect(conta[0].porMes).toBeLessThan(0);
  expect(conta.map((c) => c.porMes)).toEqual(
    [...conta.map((c) => c.porMes)].sort((a, b) => a - b),
  );
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rodar: `npx vitest run src/tests/bolso.test.ts -t "conta"`
Esperado: FAIL, `quemPagouAConta` não existe.

- [ ] **Passo 3: implementar `quemPagouAConta`**

- [ ] **Passo 4: mostrar no boletim da lei**

Uma frase por faixa, no formato do spec 2.8: "A reforma tira R$ 71 por mês
dos informais pobres — 12% do eleitorado." Sem faixas afetadas, a seção não
aparece.

- [ ] **Passo 5: rodar e ver passar, e conferir no navegador**

Rodar: `npx vitest run src/tests/bolso.test.ts`
Esperado: PASS. Abrir uma lei de imposto no jogo e conferir a frase.

- [ ] **Passo 6: `npm run check` e commitar**

```bash
git add src/app/partida src/ui/mapa src/tests/bolso.test.ts
git commit -m "tela: a lei diz quem pagou a conta"
```
